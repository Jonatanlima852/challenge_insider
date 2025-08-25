# ADR 004 – Cache com TTL

## Contexto
Consultas repetidas ao monólito ou ao banco central em picos de tráfego podem causar sobrecarga e latência elevada.

## Decisão
Usar cache com **TTL (time-to-live)** para aliviar leituras quentes, especialmente em dados que mudam pouco (ex.: catálogo, regras de desconto).

## Alternativas consideradas
- Consultar sempre a fonte de dados original.  
- Replicação assíncrona em banco de leitura.  
- Cache com TTL e invalidação controlada (escolhido).

## Consequências
- Redução significativa da latência em cenários de alta concorrência.  
- Menor pressão sobre o banco central.  

## Riscos e mitigação
- Risco: dados levemente desatualizados em relação à fonte.  
- Mitigação: TTL curto, métricas de acerto (hit ratio) e fallback para a fonte quando necessário.
