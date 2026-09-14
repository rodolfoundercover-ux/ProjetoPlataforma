# PHASE_03 — Viagens, veículos e assentos

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_02 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Wizard de viagem, conteúdo público, itinerário, embarques snapshot, preços por categoria, custos, fornecedores, modelos de veículo e mapa por assignment. Separar publicação e ciclo da viagem. Permitir rascunho com pendência contratual explícita até PHASE_06.

## Entidades e entregas

trips, trip_content, trip_images, trip_itinerary_items, trip_boarding_points, trip_passenger_prices, trip_costs, transport_suppliers, vehicle_templates, vehicle_template_seats, trip_vehicle_assignments, trip_seats e publicação do site.

## Leituras

- [SCREENS.md](../SCREENS.md)
- [DATABASE.md](../DATABASE.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [CONTRACTS.md](../CONTRACTS.md)
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

- [ ] P03-01: Viagem completa salva/reabre datas, roteiro, embarques, preços, mapa e custos com integridade.
- [ ] P03-02: Preço/categoria considera idade na data da saída e ocupa assento independentemente do preço.
- [ ] P03-03: Trocar veículo cria assignment/histórico; mapa incompatível exige revisão e capacidade inválida é bloqueada.
- [ ] P03-04: Despublicar não cancela viagem, reservas ou documentos; SOLD_OUT é derivado.
- [ ] P03-05: Duplicar viagem não copia registros de venda, check-in, ocupação ou documentos assinados.
- [ ] P03-06: Conteúdo público exclui custos/PII e não anuncia seguro automaticamente; upload é validado.

Usar [checklist e evidências](PHASE_03_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
