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

4. Além disso, decisões importantes podem ser encontradas com a devida discussão de benefícios e riscos na pasta [docs/adr/](docs/adr/), e os impactos na arquitetura. Foram 5 as ideias discutidas blablablablabla.  

5. Por fim, temos uma POC na pasta [poc/](poc) que demonstra o princípio da blablablablabla.
  



