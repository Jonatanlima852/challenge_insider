# ADR 005 – Estratégia de Feature Flags

## Contexto
A migração do monólito para a arquitetura híbrida não pode ser feita de uma vez. Era necessário definir uma forma de ativar/desativar partes da solução sem novos deploys.

## Decisão
Adotar **feature flags** para controlar o rollout de novas funcionalidades e permitir rollback rápido em caso de falhas.

## Alternativas consideradas
- Deploy direto em produção sem controle.  
- Ambientes paralelos com cutover único.  
- Feature flags com rollout gradual (escolhido).

## Consequências
- Redução de risco em mudanças críticas.  
- Possibilidade de testes A/B e dark launches.  
- Maior necessidade de governança das flags.

## Riscos e mitigação
- Risco: acúmulo de flags obsoletas.  
- Mitigação: política de limpeza periódica e monitoramento do ciclo de vida das flags.
