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



## Estrutura do Repositório

```
.
├── README.md
├── docs/
│   ├── presentation/               
│   │   └── slides-arquitetura-flash-day.pdf
│   ├── nfr-charter.md                     # SLO/SLA, latência, disponibilidade, segurança, FinOps
│   ├── roadmap.md                         # Fases, dark launch, feature flags, rollback, migração de dados
│   ├── adr/                               # decisões + riscos/mitigações 
│   │   ├── ADR-001-consistencia-vs-disponibilidade.md
│   │   ├── ADR-002-orchestrator-distribuido.md
│   │   ├── ADR-003-idempotencia-eventos.md
│   │   ├── ADR-004-cache-e-ttl.md
│   │   └── ADR-005-estrategia-feature-flags.md
│   ├── tradeoffs.md                       # Matriz de trade-offs consolidada
│   ├── architecture.md                    # Arquitetura planejada
│   └── metrics.md                         # Métricas técnicas e de produto
├── diagrams/                              
│   ├── c4-context.puml
│   ├── c4-container.puml
│   └── c4-component.puml
└── poc/                                   # (5) Prova-de-conceito mínima
    ├── README.md                          
    ├── docker-compose.yml                  
    └── src/
        └── index.ts                          
        


```

---

## O que cada diretório contém

- **docs/slides-architecture/**: diagramas no estilo C4 e explicações de trade-offs.
- **docs/nfr-charter.md**: definição de requisitos não funcionais, incluindo metas de latência, disponibilidade e práticas de segurança.
- **docs/roadmap.md**: passos para a evolução da arquitetura, rollout gradual e mitigação de riscos.
- **docs/adr/**: registros curtos das principais decisões técnicas, alternativas consideradas e riscos associados.
- **docs/tradeoffs.md**: tabela comparando as opções avaliadas.
- **docs/metrics.md**: métricas tanto técnicas (latência, erro, throughput) quanto de produto (conversão, abandono).
- **poc/**: código enxuto para demonstrar um aspecto crítico da solução, como idempotência ou uso de mensageria.

---



## Glossário Rápido

- **SLO (Service Level Objective):** meta interna para medir qualidade do serviço.  
- **SLA (Service Level Agreement):** compromisso contratual com clientes ou áreas de negócio.  
- **Idempotência:** garantia de que repetir uma operação não gera efeitos duplicados.  
- **Feature Flag:** chave para ativar ou desativar funcionalidades sem novo deploy.  
- **Dark Launch:** colocar uma funcionalidade em produção sem expô-la diretamente ao usuário.  
- **ADR (Architecture Decision Record):** registro formal de uma decisão técnica, incluindo alternativas e consequências.

---


## Premissas adotadas

1. O sistema atual mistura monólito e microsserviços.

2. O checkout é o ponto de maior criticidade, alvo de 3k–8k requisições por segundo.

3. O principal risco a ser endereçado é disponibilidade e consistência durante o pico de tráfego.