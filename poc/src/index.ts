import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger";

/**
 * PoC: Idempotência no handler de eventos de pedido.
 *
 * Conceito:
 * - Mesma "chave idempotente" => mesmo resultado, sem repetir efeitos colaterais.
 * - Chave = header 'Idempotency-Key' OU composição 'orderId:eventId'.
 * - TTL: janelas curtas onde replays devolvem a mesma resposta.
 *
 * Observabilidade (mínima):
 * - Contadores in-memory.
 * - Header 'Idempotent-Replay' informa se a resposta veio de cache idempotente.
 */

// ------------------------------
// Tipos simples
// ------------------------------
type Order = {
  orderId: string;
  amount: number;
  createdAt: string;
};

type EventInput = {
  orderId?: string;
  eventId?: string;
  amount?: number;
};

type CachedResponse = {
  status: number;
  body: any;
  storedAt: number;
};

// ------------------------------
// Config
// ------------------------------
const PORT = Number(process.env.PORT || 3000);
const IDEMPOTENCY_TTL_MS = Number(process.env.IDEMPOTENCY_TTL_MS || 60_000);

// ------------------------------
// Armazenamentos in-memory
// ------------------------------
/**
 * ordersStore: simula "efeito colateral único" da operação (criar pedido).
 * idempotencyStore: guarda respostas para a mesma chave por um TTL.
 */
const ordersStore = new Map<string, Order>();
const idempotencyStore = new Map<string, CachedResponse>();

// Métricas simples
const metrics = {
  totalRequests: 0,
  orderEvents: 0,
  idempotentReplays: 0,
  ordersCreated: 0,
  idempotencyKeysActive: 0
};

// ------------------------------
// Utilitários
// ------------------------------
function now(): number {
  return Date.now();
}

function isExpired(entry: CachedResponse): boolean {
  return now() - entry.storedAt > IDEMPOTENCY_TTL_MS;
}

function computeIdempotencyKey(req: Request, body: EventInput): string | null {
  const headerKey = req.header("Idempotency-Key");
  if (headerKey && headerKey.trim().length > 0) return headerKey.trim();
  const { orderId, eventId } = body;
  if (!orderId || !eventId) return null;
  return `${orderId}:${eventId}`;
}

/** insere/atualiza métricas derivadas do cache */
function refreshDerivedMetrics() {
  metrics.idempotencyKeysActive = Array.from(idempotencyStore.values()).filter(
    (e) => !isExpired(e)
  ).length;
}

// ------------------------------
// "Processamento real" do evento
// (simulado para PoC)
// ------------------------------
async function processOrderEventOnce(body: Required<EventInput>): Promise<Order> {
  // Simula tempo de trabalho I/O
  await new Promise((r) => setTimeout(r, 20));

  const existing = ordersStore.get(body.orderId);
  if (existing) {
    // Já existe: não recria; retorna o registro atual
    return existing;
  }

  const order: Order = {
    orderId: body.orderId,
    amount: body.amount,
    createdAt: new Date().toISOString()
  };
  ordersStore.set(order.orderId, order);
  metrics.ordersCreated += 1;
  return order;
}

/**
 * Handler idempotente:
 * - Gera chave.
 * - Se chave existir e não expirou => retorna resposta cacheada.
 * - Caso contrário, processa e guarda resposta por TTL.
 */
async function handleIdempotentEvent(req: Request, res: Response) {
  metrics.orderEvents += 1;

  const body = (req.body || {}) as EventInput;
  const key = computeIdempotencyKey(req, body);

  if (!key) {
    return res
      .status(400)
      .json({ error: "Idempotency-Key header ou (orderId,eventId) são obrigatórios." });
  }

  // Tenta replay
  const cached = idempotencyStore.get(key);
  if (cached && !isExpired(cached)) {
    metrics.idempotentReplays += 1;
    res.setHeader("Idempotent-Replay", "true");
    return res.status(cached.status).json(cached.body);
  }

  // Validação mínima do corpo (somente para o primeiro processamento)
  const { orderId, eventId, amount } = body;
  if (!orderId || !eventId || typeof amount !== "number") {
    return res
      .status(422)
      .json({ error: "Campos obrigatórios: orderId, eventId, amount:number." });
  }

  try {
    const order = await processOrderEventOnce({
      orderId,
      eventId,
      amount
    });

    const response = {
      idempotencyKey: key,
      replay: false,
      order
    };

    const toCache: CachedResponse = {
      status: 200,
      body: response,
      storedAt: now()
    };
    idempotencyStore.set(key, toCache);
    refreshDerivedMetrics();

    res.setHeader("Idempotent-Replay", "false");
    return res.status(200).json(response);
  } catch (err: any) {
    const failure: CachedResponse = {
      status: 500,
      body: { error: "internal_error", message: String(err?.message || err) },
      storedAt: now()
    };
    // Opcional: não cachear erro. Nesta PoC, não cacheamos 500 para evitar “congelar” falha.
    return res.status(500).json(failure.body);
  }
}

// ------------------------------
// App HTTP
// ------------------------------
const app = express();
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Métricas simples (para observação manual)
app.get("/metrics", (_req, res) => {
  metrics.totalRequests += 1;
  refreshDerivedMetrics();
  res.json({
    ...metrics,
    idempotencyTTLms: IDEMPOTENCY_TTL_MS,
    ordersCount: ordersStore.size
  });
});

// Endpoint idempotente
app.post("/order-events", async (req, res) => {
  metrics.totalRequests += 1;
  return handleIdempotentEvent(req, res);
});

// Consulta de pedido
app.get("/orders/:id", (req, res) => {
  metrics.totalRequests += 1;
  const order = ordersStore.get(req.params.id);
  if (!order) return res.status(404).json({ error: "not_found" });
  res.json(order);
});

// Limpeza opcional de entradas expiradas (housekeeping leve)
setInterval(() => {
  const nowTs = now();
  let removed = 0;
  for (const [k, v] of idempotencyStore.entries()) {
    if (nowTs - v.storedAt > IDEMPOTENCY_TTL_MS) {
      idempotencyStore.delete(k);
      removed++;
    }
  }
  if (removed > 0) refreshDerivedMetrics();
}, Math.max(5_000, IDEMPOTENCY_TTL_MS / 2));

app.listen(PORT, () => {
  console.log(
    `PoC Idempotent Orchestrator up on http://localhost:${PORT} (TTL=${IDEMPOTENCY_TTL_MS}ms) and swagger on http://localhost:${PORT}/api-docs`
  );
});
