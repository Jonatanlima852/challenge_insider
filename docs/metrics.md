# Métricas de sucesso

As métricas que avaliaremos para considerar se houve ou não sucesso são divididas em técnicas, de produto e de equipe. Todas devem ser monitoradas durante o projeto em produção.

## Métricas Técnicas
- **Latência P95 e P99 no checkout** - métricas que impactam diretamente na conversão e experiência do usuário.
- **Taxa de erro global ≤ 0,5%** - métricas que impactam na conversão e confiabilidade do sistema.
- **Throughput em req/s sustentado** - capacidade de processamento durante picos de tráfego.
- **Saturação de CPU e memória nos serviços** - indicadores de saúde dos recursos computacionais.
- **Lag em filas de eventos** - atraso no processamento assíncrono que pode impactar a consistência.

## Produto
- **Taxa de conversão no checkout** - métrica principal de sucesso do negócio.
- **Abandono por latência** - % de usuários que desistiram após X segundos de espera, diretamente ligado ao ROI.
- **Reprocessamento de pedidos** - indicador de falhas e inconsistências no sistema.
- **NPS/CSAT relacionado à experiência de compra** - importante para verificar se não houve degradação da experiência.

## Equipe
- **Velocidade de entrega (tempo por sprint)** - útil para mensurar o ROI e eficiência do desenvolvimento.
- **Quantidade de incidentes abertos/fechados** - útil para mensurar a estabilidade e dificuldade de retirada do order orchestrator.
- **Tempo médio para rollback** - métrica crítica para avaliar a capacidade de resposta a problemas em produção.

## Glossário de Métricas:

- **P95/P99**: Percentil de latência - 95% ou 99% das requisições respondem dentro do tempo especificado
- **Throughput**: Número de requisições processadas por segundo (req/s)
- **Saturação**: Percentual de utilização dos recursos (CPU, memória, etc.)
- **Lag**: Atraso no processamento de eventos ou mensagens em filas
- **ROI**: Return on Investment - retorno sobre o investimento
- **NPS**: Net Promoter Score - métrica de satisfação e recomendação do cliente
- **CSAT**: Customer Satisfaction - satisfação do cliente
- **Rollback**: Reversão para versão anterior do sistema em caso de problemas
