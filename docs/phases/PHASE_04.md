# PHASE_04 — Clientes, passageiros e reservas

Status: APROVADA em 2026-09-15. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_03 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Clientes tenant-local, passageiros/dependentes, comprador não viajante, reserva manual, preços/descontos, origem/canal, aprovação de exceção e holds de vaga/assento. Implementar expiração no backend agora; não aguardar PHASE_11.

## Entidades e entregas

agency_customers, agency_passengers, reservations, reservation_passengers, seat_holds, seat_assignments, hold de capacidade, sales_attributions, approval_requests.

## Leituras

- [DATABASE.md](../DATABASE.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
- [SCREENS.md](../SCREENS.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md)
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

- [x] P04-01: Comprador não viajante cria reserva de dois passageiros com preços e embarques individuais e chega a WAITING_ENTRY.
- [x] P04-02: Lock transacional por viagem e teste de última vaga impedem o terceiro passageiro de ocupar capacidade já comprometida.
- [x] P04-03: Holds válidos reduzem capacidade uma vez; expiração libera vaga por rotina no backend.
- [x] P04-04: Reserva nunca usa HOLD/WAITING_PAYMENT como status; frontend não confirma reserva sem pagamento.
- [x] P04-05: Desconto abaixo do mínimo exige aprovação válida vinculada ao valor/contexto.
- [x] P04-06: Alterar cadastro do passageiro preserva snapshots da reserva e isolamento de cliente/tenant.

Usar [checklist e evidências](PHASE_04_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
