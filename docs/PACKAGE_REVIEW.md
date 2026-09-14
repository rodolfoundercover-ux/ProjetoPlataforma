# Revisão do pacote documental

Consolidação em 13/09/2026. A fonte foi recuperada até o fim da paginação: 104 turnos em 11 páginas. G.1 contém 55 decisões e tem precedência explícita.

## Escopo verificado

- Estrutura requerida: AGENTS.md, README.md, dez documentos mestres, PHASE_00–14 e prompts por fase.
- Quinze checklists, 94 critérios específicos e gates comuns de qualidade.
- Quatro modelos-base, Contrato de Viagem V2 com 34 cláusulas e catálogo de variáveis.
- Links relativos, blocos de código Markdown e codificação UTF-8.
- Cobertura das 55 decisões G.1 no mapa de fontes.
- Enums de reserva/viagem/operação, fee bearer, privacidade, repasse Marketplace, cortes do MVP e dependências entre fases revisados.
- Manifesto SHA-256 e correspondência byte a byte entre arquivos entregues e conteúdo do ZIP.

## Ajustes de consistência

HOLD foi retirado do estado da reserva; ARCHIVED não é estado comercial da viagem. A taxa do cliente não aumenta receita turística, e desconto já incluído no preço vendido não é deduzido novamente. BOARDING da operação difere de BOARDED do check-in. G.1 governa ZapSign, domínio customizado, Marketplace e expansão. Tabela histórica do MVP foi substituída pelo corte oficial no início de MVP.md.

Os aliases de permissões e de fee_bearer foram normalizados. Exemplos históricos continuam identificados como exemplos. Pendências comerciais, jurídicas e de integração estão listadas em DECISIONS.md.

## Limites da revisão

Esta é uma revisão de documentação e empacotamento. Não foram implementados nem executados testes da aplicação, migrations, integrações reais ou piloto. Todos os checklists de implementação permanecem pendentes. Não foi realizado novo parecer jurídico nem validação atual de tarifas/versões de terceiros. O contrato particular anexado à conversa não foi redistribuído.

O manifesto não inclui ele próprio para evitar hash autorreferente. O ZIP inclui uma pasta raiz travel-platform; seu conteúdo pode ser colocado diretamente na raiz do repositório GitHub.
