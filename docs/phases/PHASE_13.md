# PHASE_13 — Afiliados e atribuição comercial

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_12 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Cadastro, links seguros, atribuição pelo último link válido dentro de janela configurável, regras percentuais/valor por passageiro, projeções, fechamento e pagamento. Não criar portal obrigatório nem confundir agência parceira.

## Entidades e entregas

affiliates, affiliate_links, sales_attributions, affiliate_commission_rules, affiliate_commission_items e settlements.

## Leituras

- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [DATABASE.md](../DATABASE.md)
- [SCREENS.md](../SCREENS.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
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

- [ ] P13-01: Compra por link válido registra afiliado/origem; canal pode mudar sem apagar atribuição.
- [ ] P13-02: Último link válido vence dentro da janela; mudança de regra futura preserva snapshot da venda.
- [ ] P13-03: Afiliado não recebe login operacional nem consulta base de clientes por seu link.
- [ ] P13-04: Cancelamento de um passageiro ajusta só sua comissão conforme regra.
- [ ] P13-05: Comissão é projetada antes do fechamento e definitiva/pagável depois; pagamento tem responsável/data/comprovante.
- [ ] P13-06: Reabrir fechamento após comissão paga gera ajuste; relatórios PHASE_12 e fechamento PHASE_10 passam regressão.

Usar [checklist e evidências](PHASE_13_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
