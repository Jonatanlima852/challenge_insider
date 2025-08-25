# Matriz de trade-offs

O objetivo desta matriz é comparar as três opções de arquitetura (monólito, distribuído, híbrido) em critérios relevantes ao problema.

| Critério              | Monólito | Orchestrator distribuído | Arquitetura híbrida |
|-----------------------|----------|--------------------------|---------------------|
| Complexidade inicial  | Baixa    | Alta                     | Média               |
| Risco de falha única  | Alto     | Baixo                    | Médio               |
| Escalabilidade        | Limitada | Alta                     | Alta                |
| Tempo de entrega      | Curto    | Longo                    | Médio               |
| Custos de operação    | Baixos   | Mais altos               | Controláveis        |
| Evolutividade         | Baixa    | Alta                     | Alta                |

**Decisão:** a arquitetura híbrida equilibra velocidade de entrega e capacidade de lidar com picos de tráfego, reduzindo riscos do monólito sem exigir a migração completa de imediato.
