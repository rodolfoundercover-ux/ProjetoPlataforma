# PHASE_07 — Site white-label, checkout e cliente

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_06 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Home, catálogo, viagem, checkout, login OTP central e área do cliente. Reusar serviços de reserva/pagamento/contrato do painel. Não ativar Marketplace ou recomendações entre agências.

## Entidades e entregas

Projeções públicas, contexto hostname, sessão cliente, páginas e endpoints do checkout/conta.

## Leituras

- [SCREENS.md](../SCREENS.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
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

- [ ] P07-01: Cliente conclui jornada catálogo → passageiros → embarques/assentos → entrada → CONFIRMED → contrato.
- [ ] P07-02: Mesma identidade em dois domínios vê somente compras/créditos/contratos da agência atual.
- [ ] P07-03: Auth central retorna apenas a hostname permitido com sessão segura e sem tokens em URL pública.
- [ ] P07-04: Manipular preço, desconto, customer_id ou agency_id do checkout é rejeitado pelo backend.
- [ ] P07-05: Pagamento pendente e conflito de hold têm mensagens recuperáveis; refresh não duplica reserva.
- [ ] P07-06: Tela mobile, teclado, rótulos, foco, loading, erro e vazio funcionam; conteúdo privado não entra em cache público.

Usar [checklist e evidências](PHASE_07_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
