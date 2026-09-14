# PHASE_06 — Contratos, políticas e assinatura

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_05 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Engine, quatro templates-base, V2 de viagem, políticas versionadas, snapshots, editor/preview, PDF, branding, hashes, aceite eletrônico interno e SignatureProvider. Subetapa 6.1: integrar ZapSign se pronta, senão registrar MVP 1.1 e avaliar gate jurídico por documento.

## Entidades e entregas

contract_templates, contract_template_versions, policies, policy_versions, reservation_policy_snapshots, reservation_contracts, contract_signatures, reservation_documents; assinatura externa quando habilitada.

## Leituras

- [CONTRACTS.md](../CONTRACTS.md)
- [DATABASE.md](../DATABASE.md)
- [INTEGRATIONS.md](../INTEGRATIONS.md)
- [SCREENS.md](../SCREENS.md)
- [SECURITY.md](../SECURITY.md)
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

- [ ] P06-01: PDF de reserva inclui agência, comprador, N passageiros/embarques, preços, parcelas, política, logo e watermark sem cortes.
- [ ] P06-02: Editor valida variáveis obrigatórias e sanitiza HTML/URLs; nenhuma expressão executável é aceita.
- [ ] P06-03: Template publicado e documento assinado não são sobrescritos; mudança cria versão e preserva PDF original.
- [ ] P06-04: Aceite registra identidade, timestamp, IP, user agent, texto, versão e hash do conteúdo correto.
- [ ] P06-05: PII/PDF privados não são acessíveis por outro cliente, tenant ou SUPER_ADMIN.
- [ ] P06-06: Imagem e marketing são consentimentos separados; seguro só consta quando realmente contratado/expresso.
- [ ] P06-07: Decisão 6.1 e revisão jurídica são registradas; documento que exige provider externo não entra em go-live sem ele.

Usar [checklist e evidências](PHASE_06_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
