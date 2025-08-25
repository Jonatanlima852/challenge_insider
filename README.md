# Organização do repositório do case técnico 

Este repositório organiza os artefatos produzidos para o case.  

O objetivo é apresentar as decisões arquiteturais, o raciocínio por trás delas e uma prova de conceito mínima para um ponto crítico do sistema.

Este README funciona como um guia de navegação. Ele não contém toda a explicação detalhada, mas mostra onde encontrar cada parte do trabalho e se situar na análise do case.

## Contexto geral do problema: 

A Insider Store planeja um “Flash Day” com picos estimados de tráfego entre 3 000 e 8 000 req/s no checkout. O ecossistema atual mistura serviços legados monolíticos e microsserviços. 


## Artefatos principais e como navegar

Sendo a ideia transitar do estado atual para um estado que possibilite recepcionar esse tráfego, os artefatos principais projetados e a ordem em que se deve navegar seguem:

1. Primeiro, temos a análise das opções fornecidas e definição da opção a ser seguida em [architecture.md](docs/architecture.md) e matriz de trade-offs de cada sistema em [tradeoffs.md](docs/tradeoffs.md).

2. Em seguida, temos uma tabela com os requisitos não funcionais(NFRs) em [nfr-charter.md](docs/nfr-charter.md). Ao tomar uma decisão arquitetural, é importante ter esses requisitos em mente. Além disso, nos testes em produção, esses requisitos devem ser atingidos. 

3. Depois, podemos consultar o plano de evolução construído em [roadmap.md](docs/roadmap.md). O foco é que a solução possa evoluir do ponto atual ao objetivo final de forma incremental e segura. sendo assim o plano explicita as fases, os marcos do projeto que delimitarão as sprints, define estrategias de rollback caso os objetivos não sejam atingidos e a estratégia de migração de dados. As métricas de sucesso (técnicas, de produto e de pessoal) que guiaram a construção do roadmap estão em [metrics.md](docs/metrics.md)
 
4. Além disso, decisões importantes podem ser encontradas com a devida discussão de benefícios e riscos na pasta [docs/adr/](docs/adr/), e os impactos na arquitetura. Foram 5 as ideias discutidas com análise detalhada de cada uma, sendo elas: consistencia vs. disponibilidade, orquestadror vs. sistema distribuído, idempotencia de eventos, cache e time-to-live, e sobre a estratégia de feature flags.

5. Por fim, temos uma POC na pasta [poc/](poc) que demonstra o princípio da idempotência em eventos de pedido, essencial para garantir que requisições duplicadas(devidos a problemas de internet ou problemas no frontend) não criem pedidos duplicados durante o processamento de checkout.

Na pasta [diagrams/](diagrams) temos diversos diagramas do tipo C4-PlantUML, isto é, que combinam os benefícios dos diagramas PlantUML para representar diagrams de software e do C4-Model (que no caso consiste em dividir a visão do sistema em contexto, container, componente e código - sendo que no caso, não teremos diagrama para a parte do código). Os diagramas feitos são: [c4-context](diagrams/c4-context.puml) para mostrar a lógica de uso dos componentes do sistema, [c4-container](diagrams/c4-container.puml) para destacar a ideia final do diagrama com order orchestartor, [c4-container-legacy](diagrams/c4-container-legacy.puml) para mostrar como é o sistema atual, [c4-container-feature-flags](diagrams/c4-container-feature-flags.puml) para mostrar como fica o sistema durante a transição, [c4-component-orchestrator](diagrams/c4-component-orchestrator.puml) sendo o diagrama do componente orquestrador ao final da sua retirada do monolito e [c4-component-poc](diagrams/c4-component-poc.puml) sendo o diagrama da poc construída para demonstrar o princípio da idempotência discutido para o orquestrador. 

É importante observar que a princípio, os diagramas [c4-container-legacy](diagrams/c4-container-legacy.puml) e [c4-container](diagrams/c4-container.puml) parecem bastante, como se a retirada do orquestrador não fosse algo tão importante, mas é essencial notar que há diversos outros serviços pertencentes ao monolito que serão consultados pelo orquestrador enquanto se dá a retirada gradual dos demais serviços do monolito. Por exemplo, poderão estar no monolito apesar da retirada do orquestrador: modelos de catálogos e produtos, preços e regras de campanha/promoções, regras de estoque, cálculo de frete, identidade do cliente, painéis de admnistração e visualização de métricas, sistemas relacionados ao pós venda (como devoluções, chats de atendimento, etc). Por isso, a divisão em microserviços deve ser gradual. 
