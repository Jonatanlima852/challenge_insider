# ADR 001 – Consistência vs Disponibilidade

## Contexto
Durante o Flash Day, o sistema precisa lidar com falhas de rede entre serviços. Era necessário escolher entre consistência forte ou disponibilidade.

## Decisão
Optamos por priorizar disponibilidade, permitindo consistência eventual.  
Pedidos podem aparecer temporariamente como “pendentes”, mas não são perdidos.

## Alternativas consideradas
- Transações distribuídas (consistência forte).  
- Consistência eventual com mensageria e retries (escolhido).  
- Replicação em cache de leitura.

## Consequências
- O sistema continua disponível mesmo com falhas parciais.
- Pode haver divergência temporária em consultas de status de pedidos.

## Riscos e mitigação
- Risco: cliente visualizar pedido “pendente”.  
- Mitigação: feedback claro na UI e reprocessamento automático.
