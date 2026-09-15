# Aceitação — PHASE_04: Clientes, passageiros e reservas

Status: APROVADA em 2026-09-15.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P04-01 — Comprador não viajante cria reserva de dois passageiros com preços e embarques individuais e chega a WAITING_ENTRY. | `phase_04_flow.test.sql` e transação no Supabase Cloud: dois passageiros, dois embarques, R$ 1.000,00 e `WAITING_ENTRY`. | APROVADO |
| P04-02 — Duas requisições para último assento resultam em um único vencedor; última vaga sem mapa tem mesma proteção. | Lock transacional por viagem e cenário de capacidade 2: terceiro passageiro falha com `P0001`. | APROVADO |
| P04-03 — Holds válidos reduzem capacidade uma vez; expiração libera vaga mesmo com navegador fechado. | `phase_04_flow.test.sql`: rotina `expire_reservations()` expira a reserva e remove os holds. | APROVADO |
| P04-04 — Reserva nunca usa HOLD/WAITING_PAYMENT como status; frontend não confirma reserva sem pagamento. | `phase_04.test.sql` valida enum oficial e `submit_reservation` controlado pelo banco. | APROVADO |
| P04-05 — Desconto abaixo do mínimo exige aprovação válida vinculada ao valor/contexto; mudança de preço exige revalidação. | `phase_04_flow.test.sql`: preço abaixo do mínimo falha sem aprovação e passa somente com hash de contexto aprovado. | APROVADO |
| P04-06 — Alterar cadastro do passageiro preserva snapshots da reserva e isolamento de cliente/tenant. | `phase_04_flow.test.sql`: alteração do nome não muda o snapshot gravado na reserva. | APROVADO |

## Gates comuns

- [x] Código e documentação coerentes com G.1 e escopo da fase.
- [x] Testes de autorização/tenant e invariantes afetadas executados.
- [x] Migrations em banco limpo e preservação de histórico verificadas.
- [x] Tipos, lint, build e CI aplicáveis passam.
- [ ] Integrações reais não são declaradas prontas somente por fake.
- [x] Logs/segredos/PII revisados.
- [x] Pendências e decisões registradas em DECISIONS.md.
- [x] STATUS.md atualizado com evidência; nenhum TODO crítico usado como conclusão.

## Registro de execução

Commit: alterações PHASE_04 validadas localmente em 2026-09-15.
Ambiente: Supabase local e Supabase Cloud.
Comandos/cenários e resultado: `supabase db reset`, `pnpm db:test` - PASS (6 arquivos, 110 testes); `pnpm check` - PASS.
Revisor/responsável e data: responsável do projeto, 2026-09-15.
Bloqueios: nenhum.
