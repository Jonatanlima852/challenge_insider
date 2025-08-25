# ADR 003 – Idempotência em eventos

## Contexto
Durante picos de tráfego, falhas de rede ou retries podem gerar eventos duplicados, causando criação de pedidos em duplicidade.

## Decisão
Implementar **idempotência** nas operações críticas do orchestrator de pedidos.  
Cada evento é processado com base em uma chave única (ex.: `orderId + eventId`).

## Alternativas consideradas
- Aceitar duplicidade e corrigir manualmente (não faz sentido).  
- Bloqueio transacional no banco (custo alto em escala).  
- Chave idempotente em camada de aplicação (escolhido).

## Consequências
- Garante integridade dos pedidos sem custo elevado de lock no banco.  
- Maior previsibilidade no fluxo de eventos.

## Riscos e mitigação
- Risco: colisões de chave ou lógica incorreta de deduplicação.  
- Mitigação: testes extensivos e logs estruturados para auditoria.
