# Arquitetura planejada

O problema central é garantir que o checkout da Insider Store suporte picos de 3 000 a 8 000 requisições por segundo durante o Flash Day, partindo de uma base mista de monólito e microsserviços.

## Opções avaliadas
- **Monólito escalado verticalmente:** baixa complexidade inicial, mas alto risco de ponto único de falha.  
- **Orchestrator distribuído:** maior desacoplamento, resiliência e escalabilidade, mas exige integração e maior complexidade de eventos.  
- **Arquitetura híbrida:** mantém parte do monólito, extrai componentes críticos com feature flags e rollout gradual.  

## Decisão
Adotar uma **arquitetura híbrida** como caminho de evolução:  
1. Checkout continua funcionando no monólito.  
2. Orchestrator distribuído para pedidos é extraído como serviço independente.  
3. Feature flags permitem controlar rollout sem riscos.  

## Diagramas
Os diagramas C4 estão na pasta [../diagrams](../diagrams) e os slides explicativos em [presentation/slides-arquitetura-flash-day.pdf](presentation/slides-arquitetura-flash-day.pdf).
