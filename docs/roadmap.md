# Roadmap de evolução

O plano de evolução descreve como migrar do cenário atual para a solução híbrida de forma incremental e segura.

## Fases

1. **Discovery e preparação**
   - Mapear dependências do checkout e identificar pontos de integração.
   - Definir métricas de baseline para comparação durante a migração.
   - Preparar ambiente de desenvolvimento e testes.

2. **Dark launch**
   - Extrair orchestrator de pedidos para serviço independente.
   - Enviar tráfego sombra (shadow traffic) para validar consistência sem impacto ao usuário.
   - Validar comportamento em produção com dados reais.

3. **Feature flags e rollout gradual**
   - Implementar sistema robusto de feature flags com controle granular de tráfego.
   - Habilitar orchestrator para percentuais crescentes de tráfego (5%, 10%, 25%, 50%, 100%).
   - Garantir rollback instantâneo via flags em caso de problemas.
   - Monitorar métricas em tempo real durante cada incremento.

4. **Migração de dados**
   - Implementar dual-write no período de transição para garantir redundância.
   - Executar backfill completo dos dados históricos para validação.
   - Validação de consistência entre sistemas legado e novo.
   - Sincronização em tempo real durante a transição.

5. **Observabilidade e hardening**
   - Monitoramento avançado de P95, taxa de erro e saturação dos recursos.
   - Testes de caos para validar resiliência e recuperação automática.
   - Ajuste fino de escalabilidade e otimização de performance.
   - Documentação de runbooks e procedimentos operacionais.

## Marcos
- Cada fase é acompanhada por um marco (sprint) validado por métricas técnicas específicas.
- Critérios de saída incluem latência, disponibilidade e custo aceitáveis.
- Aprovação da equipe de produto antes de avançar para a próxima fase.

## Métricas
As métricas técnicas e de produto estão detalhadas em [metrics.md](metrics.md).

## Glossário de termos:

- **Dark Launch**: Estratégia de deploy que executa o novo sistema em paralelo sem exposição ao usuário final
- **Dual Write**: Padrão onde dados são escritos simultaneamente em dois sistemas para garantir redundância
- **Backfill**: Processo de preenchimento de dados históricos no novo sistema
- **Feature Flags**: Sistema de controle que permite habilitar/desabilitar funcionalidades em tempo real
- **Rollout Gradual**: Liberação progressiva de funcionalidades para percentuais crescentes de usuários
- **Rollback**: Reversão para versão anterior do sistema em caso de problemas
- **Shadow Traffic**: Tráfego duplicado enviado ao novo sistema para validação sem impacto ao usuário
- **Testes de Caos**: Metodologia que simula falhas para validar resiliência e recuperação do sistema 