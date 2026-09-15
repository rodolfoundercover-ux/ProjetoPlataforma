# SaaS multiagência de excursões e viagens

Pacote completo de documentação para implementação incremental com Codex, consolidado a partir da conversa “Analisar alerta do Defender”, com prevalência da auditoria G.1.

**PHASE_00 a PHASE_04 aprovadas e publicadas.**

Para abrir no VS Code e executar localmente, siga [Desenvolvimento local](docs/LOCAL_DEVELOPMENT.md). Veja [STATUS.md](codex/STATUS.md) para testes realizados, publicações e bloqueios.

## Começar

1. Extraia o ZIP e use o conteúdo desta pasta como raiz do repositório GitHub.
2. Abra o repositório no Codex.
3. Leia [CODEX_START.md](codex/CODEX_START.md) e envie [o prompt da PHASE_00](codex/prompts/PHASE_00.md).
4. Siga PHASE_01 até PHASE_14, registrando critérios e evidências em [STATUS.md](codex/STATUS.md).

## Estrutura

```text
AGENTS.md
README.md
docs/
  SPEC.md
  ARCHITECTURE.md
  DATABASE.md
  BUSINESS_RULES.md
  PERMISSIONS.md
  SECURITY.md
  SCREENS.md
  INTEGRATIONS.md
  CONTRACTS.md
  MVP.md
  AUDIT_G1.md
  DECISIONS.md
  QUALITY.md
  SOURCE_MAP.md
  PACKAGE_REVIEW.md
  templates/
    SAAS.md
    TRAVEL_V2.md
    ADDON.md
    MARKETPLACE.md
    VARIABLES.md
  phases/
    PHASE_00.md ... PHASE_14.md
    PHASE_00_ACCEPTANCE.md ... PHASE_14_ACCEPTANCE.md
codex/
  CODEX_START.md
  STATUS.md
  prompts/PHASE_00.md ... PHASE_14.md
MANIFEST.sha256
```

## Conteúdo e limites

Os dez documentos mestres cobrem produto, stack, banco, regras, permissões, segurança, telas, integrações, contratos e MVP. São 15 fases e 94 critérios específicos, além dos gates globais. Os quatro modelos contratuais têm placeholders; o V2 possui 34 cláusulas.

MVP inclui financeiro da viagem, afiliados, site/checkout e operação online. Marketplace, agência parceira, WhatsApp IA e módulos avançados são expansão Fase 2; não confundir com PHASE_02. ZapSign e domínio customizado seguem o corte da G.1.

Percentuais, tarifas, SLA, franquias e limites apenas ilustrativos não foram transformados em políticas universais. Consulte [DECISIONS.md](docs/DECISIONS.md) para escolhas ainda abertas, inclusive validação das versões de dependências e APIs no desenvolvimento.

[Mapa de fontes](docs/SOURCE_MAP.md) e [auditoria G.1](docs/AUDIT_G1.md) permitem rastrear a consolidação. O contrato particular anexado à conversa, os dados pessoais e os assuntos anteriores sobre Defender/limites do Codex não foram incluídos no pacote.

## Validação documental

Veja [PACKAGE_REVIEW.md](docs/PACKAGE_REVIEW.md). Essa revisão verifica a documentação e o arquivo ZIP; não representa execução de testes da futura aplicação ou aprovação jurídica dos templates.
