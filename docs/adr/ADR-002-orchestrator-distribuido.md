# ADR 002 – Orchestrator distribuído

## Contexto
O checkout atual está fortemente acoplado ao monólito. Era necessário decidir se manteríamos toda a lógica de orquestração de pedidos dentro dele ou se extrairíamos para um serviço distribuído.

## Decisão
Extrair um **Order Orchestrator** como serviço independente, responsável por coordenar a criação de pedidos de ponta a ponta.

## Alternativas consideradas
- Manter lógica de pedidos no monólito.  
- Extrair orchestrator como serviço dedicado (escolhido).  
- Distribuir lógica entre múltiplos microsserviços sem orchestrator central.

## Consequências
- Desacoplamento da lógica de pedidos do monólito.  
- Maior resiliência e escalabilidade.  
- Aumento da complexidade de integração e necessidade de mensageria confiável.

## Riscos e mitigação
- Risco: aumento da latência por hops de rede.  
- Mitigação: uso de filas leves, caching e monitoramento de métricas P95/P99.
