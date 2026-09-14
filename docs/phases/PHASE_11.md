# PHASE_11 — Notificações, jobs e automações

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_10 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Completar outbox/queue/cron, cadências, templates, preferências, entregas, alertas, retries, falhas finais e painel sanitizado. Consolidar jobs já introduzidos em PHASE_04/05/06.

## Entidades e entregas

outbox_events, scheduled_job_runs, notifications, message_templates, message_deliveries, customer_notification_preferences.

## Leituras

- [INTEGRATIONS.md](../INTEGRATIONS.md)
- [DATABASE.md](../DATABASE.md)
- [SECURITY.md](../SECURITY.md)
- [QUALITY.md](../QUALITY.md)
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

- [ ] P11-01: Navegador fechado não impede expiração, overdue, fechamento de vendas e reconciliação.
- [ ] P11-02: Um evento repetido gera uma única entrega lógica por canal/versão/destinatário.
- [ ] P11-03: Falha de e-mail não desfaz confirmação de pagamento; retry e falha final ficam rastreáveis.
- [ ] P11-04: Jobs usam timezone/cadência configurados; ausência/atraso/mínimo não cancela nem inicia operação automaticamente.
- [ ] P11-05: Templates respeitam branding, whitelist e preferências; marketing consulta consentimento separado.
- [ ] P11-06: Super Admin reprocessa evento técnico sem receber PII, segredos ou documento privado.

Usar [checklist e evidências](PHASE_11_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
