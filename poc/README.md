# PoC — Idempotência no Orchestrator de Pedidos

**O que esta PoC demonstra:**  
Processar múltiplas vezes o **mesmo evento** (mesmo `orderId` + `eventId` ou o mesmo header `Idempotency-Key`) **não** gera pedidos duplicados. O handler retorna a **mesma resposta** para repetições dentro do TTL configurado e o **efeito colateral único** (criação do pedido) acontece apenas uma vez. 

Em um sistema real, vamos considerar o seguinte cenário: quando a pessoa clicar no checkout, irá gerar um mesmo orderId. Além disso, ao tentar enviar a requisição, digamos que estaremos utilizando uma estratégia de retrys com tempos exponenciais (para garantir que a requisição seja feita). Cada tentativa de retry gera um novo eventId. Assim, caso uma requisição vá duplicada, o eventId e o orderId servirão como chave de idempotência. E além disso, uma outra estratégia é que enviaremos o header `Idempotency-Key:orderId` para também evitar que um pedido duplicado seja processado. A idempotência é essencial para lidar com os erros que podem haver de rede tambem com os erros que podem surgir devido aos estados do frontend.
 

**Como rodar:**
```bash
# Dentro de poc/
npm install
npm run build
npm start
# ou para desenvolvimento:
# npm run dev
```

## Executar com Docker (caso máquina não tenha node)

```bash
# Na pasta poc/
docker compose up --build
# Depois acesse:
# http://localhost:3000/health
# http://localhost:3000/metrics
```

Para ajustar o TTL(Time to live) da idempotência:

Edite IDEMPOTENCY_TTL_MS (tempo em milisegundos) no docker-compose.yml, ou

Passe em linha de comando:

```bash
IDEMPOTENCY_TTL_MS=60000 docker compose up --build
```

**Swagger UI (alternativa ao curl):**  
A documentação interativa abre em `http://localhost:3000/api-docs`. Você pode testar as rotas diretamente por lá.

**Testes rápidos (cURLs):**

```bash
# 1) Primeiro processamento (cria pedido)
curl -s -X POST http://localhost:3000/order-events \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"A123","eventId":"E1","amount":199.9}'

# 2) Repetição do mesmo evento (idempotente: não duplica)
curl -s -X POST http://localhost:3000/order-events \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"A123","eventId":"E1","amount":199.9}'

# Alternativa: usando header Idempotency-Key (independe do corpo)
curl -s -X POST http://localhost:3000/order-events \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: A123:E1' \
  -d '{"orderId":"A123","eventId":"IGNORADO_NO_REPLAY","amount":199.9}'

# Consultar pedido
curl -s http://localhost:3000/orders/A123 | jq .

# Métricas simples
curl -s http://localhost:3000/metrics
```

**O que observar:**

- A segunda chamada do mesmo evento retorna Idempotent-Replay: true e o mesmo corpo/resposta do primeiro processamento.

- A rota GET /orders/:id mostra que só existe um pedido criado.

- GET /metrics mostra contadores de tráfego, replays e pedidos criados.

**Limites intencionais:**

- Armazenamento em memória (Map) com TTL (simples e suficiente para a PoC).

- Sem persistência/cluster; foco é demonstrar a semântica de idempotência e o contrato do handler.