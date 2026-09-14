# PHASE_10 — Financeiro e fechamento da viagem

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_09 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Custos estimados/confirmados/reais, receitas e ajustes, cálculo por passageiro, CALCULATE/CLOSE/REOPEN e settlements. Preparar regra de comissão para ativação em PHASE_13; não construir ERP.

## Entidades e entregas

trip_financial_closures, trip_financial_closure_costs, trip_financial_passenger_results, settlements e projeções financeiras.

## Leituras

- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [DATABASE.md](../DATABASE.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
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

- [ ] P10-01: Preço vendido não sofre desconto duas vezes; vendido, recebido, a receber e resultado reconciliam com origens.
- [ ] P10-02: Custos de veículo/cadastro não são duplicados; rateios preservam total e separam custos sem rateio.
- [ ] P10-03: CLOSE bloqueia inconsistências críticas e congela detalhes/versão; viagem chega a FINISHED.
- [ ] P10-04: REOPEN preserva valores da versão anterior e cria nova; settlement pago recebe ajuste sem ser apagado.
- [ ] P10-05: SUPER_ADMIN/ANALYST sem permissão não lê custo/lucro em tela, API ou exportação.
- [ ] P10-06: Contrato das comissões suporta cancelamento por passageiro e cálculo final após fechamento; regressão obrigatória na PHASE_13.

Usar [checklist e evidências](PHASE_10_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
