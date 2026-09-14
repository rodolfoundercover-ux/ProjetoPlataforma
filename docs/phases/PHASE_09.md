# PHASE_09 — Operação da viagem e embarque

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_08 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Sessão operacional, equipe, pontos de embarque, check-in por passageiro, mudanças autorizadas, checklists, ocorrências e encerramento online mobile.

## Entidades e entregas

trip_operations, trip_operational_staff, boarding_point_operations, passenger_checkins, passenger_boarding_changes, trip_occurrences, passenger_operational_notes, trip_checklist_items.

## Leituras

- [SCREENS.md](../SCREENS.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [DATABASE.md](../DATABASE.md)
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

- [ ] P09-01: No celular, equipe abre embarque, pesquisa/filtra ponto e marca BOARDED mantendo o passageiro da reserva.
- [ ] P09-02: ABSENT não vira NO_SHOW por relógio; decisão exige permissão e auditoria.
- [ ] P09-03: Troca operacional de assento/embarque valida disponibilidade e preserva histórico.
- [ ] P09-04: Ponto fechado só reabre por comando autorizado com motivo/auditoria.
- [ ] P09-05: Operação finalizada leva viagem a AWAITING_FINANCIAL_CLOSE, sem FINISHED prematuro.
- [ ] P09-06: Falha de internet é explícita; não há offline/sync, QR check-in ou mapa obrigatório no MVP.

Usar [checklist e evidências](PHASE_09_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
