# PHASE_08 — Pós-venda, reembolso e crédito

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_07 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Cancelamento total/parcial, simulação/política, reembolso, wallet ledger, substituição, transferência do comprador e remarcação com resposta/termos. Toda resolução financeira preserva histórico.

## Entidades e entregas

cancellation_requests, refunds, payment_adjustments, customer_wallet_transactions, passenger_replacements, reservation_transfers, trip_reschedules, reservation_reschedule_responses, reservation_documents.

## Leituras

- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [DATABASE.md](../DATABASE.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
- [CONTRACTS.md](../CONTRACTS.md)
- [INTEGRATIONS.md](../INTEGRATIONS.md)
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

- [ ] P08-01: Reserva de três passageiros cancela um; uma vaga é liberada e os outros dois seguem confirmados.
- [ ] P08-02: Simulação e execução usam mesma política/contexto; contexto alterado exige nova validação.
- [ ] P08-03: Agência cancela viagem sem penalidade do cliente; escolha individual refund/crédito é registrada.
- [ ] P08-04: Crédito só é gasto na agência emissora; duas tentativas concorrentes não gastam o mesmo saldo.
- [ ] P08-05: Falha de refund não marca pagamento como apagado nem devolução como concluída; retry não duplica.
- [ ] P08-06: Substituição/transferência preserva responsável e passageiro anteriores e gera termo quando necessário.
- [ ] P08-07: Remarcação preserva datas e registra resposta; silêncio não é aceite e recusa segue política.

Usar [checklist e evidências](PHASE_08_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
