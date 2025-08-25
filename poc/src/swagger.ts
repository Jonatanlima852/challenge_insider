export default {
  openapi: "3.0.0",
  info: {
    title: "PoC - Idempotent Order Orchestrator",
    version: "1.0.0",
    description: "Prova de conceito para demonstrar idempotência em eventos de pedido",
    contact: {
      name: "Equipe de Arquitetura",
      email: "arquitetura@empresa.com"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desenvolvimento"
    }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health Check",
        description: "Verifica se o serviço está funcionando",
        responses: {
          "200": {
            description: "Serviço funcionando",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/metrics": {
      get: {
        summary: "Métricas do Sistema",
        description: "Retorna métricas em tempo real do sistema",
        responses: {
          "200": {
            description: "Métricas do sistema",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalRequests: { type: "number" },
                    orderEvents: { type: "number" },
                    idempotentReplays: { type: "number" },
                    ordersCreated: { type: "number" },
                    idempotencyKeysActive: { type: "number" },
                    idempotencyTTLms: { type: "number" },
                    ordersCount: { type: "number" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/order-events": {
      post: {
        summary: "Processar Evento de Pedido",
        description: "Processa um evento de pedido com garantia de idempotência",
        tags: ["Pedidos"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "eventId", "amount"],
                properties: {
                  orderId: { type: "string", description: "ID único do pedido", example: "ORD-12345" },
                  eventId: { type: "string", description: "ID único do evento", example: "EVT-67890" },
                  amount: { type: "number", description: "Valor do pedido", example: 99.99 }
                }
              },
              examples: {
                "Pedido Simples": {
                  value: { orderId: "ORD-12345", eventId: "EVT-67890", amount: 99.99 }
                }
              }
            }
          }
        },
        parameters: [
          {
            name: "Idempotency-Key",
            in: "header",
            description: "Chave de idempotência (opcional se orderId e eventId estiverem no body)",
            required: false,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Evento processado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    idempotencyKey: { type: "string" },
                    replay: { type: "boolean" },
                    order: {
                      type: "object",
                      properties: {
                        orderId: { type: "string" },
                        amount: { type: "number" },
                        createdAt: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Chave de idempotência inválida",
            content: { "application/json": { schema: { type: "object", properties: { error: { type: "string" } } } } }
          },
          "422": {
            description: "Dados inválidos",
            content: { "application/json": { schema: { type: "object", properties: { error: { type: "string" } } } } }
          },
          "500": { description: "Erro interno do servidor" }
        }
      }
    },
    "/orders/{id}": {
      get: {
        summary: "Consultar Pedido",
        description: "Retorna os detalhes de um pedido específico",
        tags: ["Pedidos"],
        parameters: [
          { name: "id", in: "path", required: true, description: "ID do pedido", schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Pedido encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    orderId: { type: "string" },
                    amount: { type: "number" },
                    createdAt: { type: "string" }
                  }
                }
              }
            }
          },
          "404": {
            description: "Pedido não encontrado",
            content: { "application/json": { schema: { type: "object", properties: { error: { type: "string" } } } } }
          }
        }
      }
    }
  },
  tags: [{ name: "Pedidos", description: "Operações relacionadas a pedidos e eventos" }],
  components: {
    schemas: {
      Order: {
        type: "object",
        properties: {
          orderId: { type: "string" },
          amount: { type: "number" },
          createdAt: { type: "string" }
        }
      },
      EventInput: {
        type: "object",
        properties: {
          orderId: { type: "string" },
          eventId: { type: "string" },
          amount: { type: "number" }
        }
      }
    }
  } 
};
