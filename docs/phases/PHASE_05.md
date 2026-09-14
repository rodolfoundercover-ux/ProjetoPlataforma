# PHASE_05 — Motor financeiro e pagamentos

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_04 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Charges, entrada/parcelas, alocações, PaymentPricingEngine, Decimal, Mercado Pago, InfinitePay e dinheiro autorizado. Criar reconciliação e base de refunds/adjustments. Testar fake primeiro e adapters reais no ambiente disponível; não habilitar Marketplace.

## Entidades e entregas

charges, payments, payment_allocations, payment_transactions, payment_webhook_events, refunds/payment_adjustments base, agency_integrations e jobs de reconciliação.

## Leituras

- [DATABASE.md](../DATABASE.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [INTEGRATIONS.md](../INTEGRATIONS.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
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

- [ ] P05-01: Entrada só confirma reserva elegível quando integralmente paga; pagamento parcial preserva saldo.
- [ ] P05-02: Webhook repetido, fora de ordem ou retry após timeout não duplica pagamento/alocação.
- [ ] P05-03: Pagamento depois de EXPIRED gera exceção, sem confirmação automática nem overbooking.
- [ ] P05-04: CLIENT/AGENCY/SHARED resultam em total correto; taxa do cliente não aumenta receita turística; parcelas somam o total exato.
- [ ] P05-05: Mercado Pago e InfinitePay usam a conta correta; redirect não comprova pagamento; dinheiro exige permissão.
- [ ] P05-06: Quitação até sete dias antes e exceção por reserva funcionam sem mudar política global.
- [ ] P05-07: Adapters têm evidência controlada de criação/consulta/confirmação; falta de credencial/capacidade é registrada como pendência, não sucesso.

Usar [checklist e evidências](PHASE_05_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
