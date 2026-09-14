# PHASE_02 — Agência, branding e configurações

Status: VALIDADA LOCALMENTE em 2026-09-14; publicação pendente. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_01 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Configurações da agência, dados legais/Cadastur, equipe/convites, identidade visual, regras comerciais, categorias, locais de embarque e subdomínio verificado. Preparar integração/domínio próprio, sem obrigar automação DNS/SSL para piloto.

## Entidades e entregas

agency_settings, agency_branding, agency_domains, passenger_categories, agency_boarding_locations; convites e referência segura de integrações.

## Leituras

- [SCREENS.md](../SCREENS.md)
- [DATABASE.md](../DATABASE.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
- [SECURITY.md](../SECURITY.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [Auditoria G.1](../AUDIT_G1.md)
- [Decisões e pendências](../DECISIONS.md)
- [Qualidade global](../QUALITY.md)

## Plano de execução

1. Inspecionar implementação e evidências anteriores; identificar requisitos desta fase e suas fontes.
2. Implementar migrations/constraints/RLS, contratos de serviço e autorização aplicáveis.
3. Implementar comportamento transacional, audit/outbox e adapters necessários.
4. Construir telas previstas com estados de erro/vazio/carregamento e acesso seguro.
5. Validar critérios, atualizar documentação afetada e registrar evidências.

Não antecipar expansão Fase 2 ou funcionalidades futuras. Componentes já criados devem ser reutilizados. Falta de dependência externa não é autorização para substituir regra comercial ou concluir com mock.

## Critérios de aceitação

- [ ] P02-01: Admin salva/reabre nome, logo, cores, fonte, contatos, Cadastur e regras sem perda.
- [ ] P02-02: Duas agências exibem branding distinto, sem cache cruzado.
- [ ] P02-03: Hostname desconhecido ou não verificado não resolve tenant de produção; query agency_id não substitui Host.
- [ ] P02-04: Convite tem validade/uso único; revogação e desativação removem acesso efetivo.
- [ ] P02-05: Alterar domínio/integração exige permissão e trilha; não há dois principais ativos.
- [ ] P02-06: Categorias e embarques são configuráveis; valores comerciais ilustrativos não viram defaults ocultos.

Usar [checklist e evidências](PHASE_02_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
