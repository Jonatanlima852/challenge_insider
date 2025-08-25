# Requisitos não funcionais (NFR Charter)

Este documento lista os principais requisitos não funcionais (NFRs) que orientaram as decisões arquiteturais. Eles devem ser monitorados e atendidos nos testes de carga e em produção.

## Desempenho
- Latência P99 do checkout: ≤ 300 ms (Order Orchestrator: < 250ms, Inventário: < 100ms).
- Throughput sustentado: até 8.000 req/s durante o Flash Day.

## Disponibilidade
- SLA geral: 99,9% de uptime durante o Flash Day.
- Serviços críticos: Pagamento (99,99%), Order Orchestrator (99,95%), Inventário (99,95%).
- Estratégia de fallback para indisponibilidades parciais.

## Resiliência
- Idempotência em operações críticas (pedido não duplicado).
- Circuit breaker, retries com backoff e DLQ para eventos com falha.
- Fila de Mensagens com alta disponibilidade (99,99%) para garantir que nenhum pedido seja perdido.

## Segurança e Compliance
- Autenticação e autorização centralizadas.
- Criptografia em trânsito (TLS) e em repouso.
- Conformidade com LGPD: dados minimizados e auditáveis.
- Compliance PCI DSS para o Serviço de Pagamento.

## Consistência de Dados
- Consistência forte para dados de inventário (crítico para evitar venda sem estoque).
- Consistência eventual para notificações (não crítico para o momento da compra).

## Custos (FinOps)
- Monitorar custo por transação no pico.
- Alocação dinâmica de recursos em cloud (auto-scaling).

Assim, temos a seguinte tabela que sumariza os NFRs por componente:

| Componente Quantum | Req. Não-Funcional | Meta (SLO) | Justificativa de Negócio |
|-------------------|-------------------|-------------|--------------------------|
|  Order Orchestrator | Disponibilidade | 99.95% | Ponto de entrada do novo fluxo. Deve estar quase sempre no ar. |
| | Latência (p99) | < 250ms | O tempo total de resposta ao cliente depende dele ser rápido. |
| | Throughput (Pico) | 8.000 req/s | Precisa aguentar o pico máximo estimado do Flash Day. |
| Serviço de Pagamento | Disponibilidade | 99.99% | Falhas aqui significam perda direta e imediata de receita. |
| | Segurança | Compliance PCI DSS | Lida com dados de cartão de crédito. Inegociável. |
| Serviço de Inventário | Disponibilidade | 99.95% | Essencial para evitar venda de produtos fora de estoque. |
| | Latência (p99) | < 100ms | A checagem de estoque deve ser extremamente rápida. |
| | Consistência | Forte | O dado de estoque não pode estar defasado. |
| Fila de Mensagens | Disponibilidade | 99.99% | Garante que nenhum pedido seja perdido entre os serviços. |
| Serviço de Notificação | Disponibilidade | 99.9% | O envio de e-mail pode atrasar alguns minutos sem impacto crítico. |
| | Consistência | Eventual | O cliente não precisa receber o e-mail no exato segundo da compra. |

# Glossário:

- **P95/P99**: Percentil de latência - 95% ou 99% das requisições devem responder dentro do tempo especificado
- **Throughput**: Número de requisições que o sistema consegue processar por segundo
- **SLA**: Service Level Agreement - acordo formal sobre o nível de serviço a ser fornecido
- **Fallback**: Estratégia alternativa quando o serviço principal não está disponível
- **Idempotência**: Propriedade de uma operação que pode ser executada múltiplas vezes sem alterar o resultado
- **Circuit Breaker**: Padrão que "abre o circuito" (para requisições) quando um serviço está falhando
- **Backoff**: Estratégia de retry que aumenta o tempo de espera entre tentativas
- **DLQ**: Dead Letter Queue - fila para mensagens que falharam no processamento após múltiplas tentativas 
