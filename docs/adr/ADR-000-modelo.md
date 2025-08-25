# ADR 001 – Consistência vs Disponibilidade

## Contexto
Precisávamos decidir como lidar com falhas de rede entre serviços no checkout durante o Flash Day.

## Decisão
Optamos por priorizar disponibilidade em detrimento de consistência imediata, aplicando consistência eventual.

## Alternativas Consideradas
- Usar transações distribuídas (forte consistência)
- Aplicar filas assíncronas com retry e consistência eventual (escolhido)
- Replicar dados em cache de leitura

## Consequências
- O sistema continua funcionando mesmo com falhas parciais
- Pode haver divergência temporária nos dados

## Riscos e Mitigação
- Risco: cliente visualizar pedido “pendente” por alguns segundos  
- Mitigação: transparência na UI e retentativas automáticas
