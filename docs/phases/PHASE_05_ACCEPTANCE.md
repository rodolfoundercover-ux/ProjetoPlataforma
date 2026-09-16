# Aceitação — PHASE_05: Motor financeiro e pagamentos

Status: EM IMPLEMENTAÇÃO desde 2026-09-15. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P05-01 — Entrada só confirma reserva elegível quando integralmente paga; pagamento parcial preserva saldo. | `phase_05.test.sql`: parcial, quitação e confirmação; reexecutar na validação final. | IMPLEMENTADO — validação final pendente |
| P05-02 — Webhook repetido, fora de ordem ou retry após timeout não duplica pagamento/alocação. | `phase_05.test.sql`: retry de dinheiro e webhook repetido idempotentes; reexecutar na validação final. | IMPLEMENTADO — validação final pendente |
| P05-03 — Pagamento depois de EXPIRED gera exceção, sem confirmação automática nem overbooking. | `phase_05.test.sql`: evento tardio mantém reserva expirada e cria exceção. | IMPLEMENTADO — validação final pendente |
| P05-04 — CLIENT/AGENCY/SHARED resultam em total correto; taxa do cliente não aumenta receita turística; parcelas somam o total exato. | `payments.test.ts` cobre preço; `phase_05.test.sql` cobre saldo parcelado exato. | IMPLEMENTADO — validação final pendente |
| P05-05 — Mercado Pago e InfinitePay usam a conta correta; redirect não comprova pagamento; dinheiro passa por RPC autorizada. Adapter de gateway aguarda credenciais por agência. | PARCIAL — credenciais e adapters reais pendentes |
| P05-06 — Quitação até sete dias antes e exceção por reserva funcionam sem mudar política global. | Migration `20260916001000_payment_deadlines.sql`; `phase_05.test.sql` agenda saldo dentro do corte e bloqueia duplicidade. Exceção é vinculada e auditada por reserva. | IMPLEMENTADO — validação final pendente |
| P05-07 — Adapters têm evidência controlada de criação/consulta/confirmação; falta de credencial/capacidade é registrada como pendência, não sucesso. | `payments.test.ts` verifica erro explícito sem credencial; fake é restrito a teste e só retorna `PENDING`. | PARCIAL — validação sandbox real pendente |

## Gates comuns

- [ ] Código e documentação coerentes com G.1 e escopo da fase.
- [ ] Testes de autorização/tenant e invariantes afetadas executados.
- [ ] Migrations em banco limpo e preservação de histórico verificadas quando houver mudança de banco.
- [ ] Tipos, lint, build e CI aplicáveis passam.
- [ ] Integrações reais não são declaradas prontas somente por fake.
- [ ] Logs/segredos/PII revisados.
- [ ] Pendências e decisões registradas em DECISIONS.md.
- [ ] STATUS.md atualizado com evidência; nenhum TODO crítico usado como conclusão.

## Registro de execução

Commit: a preencher.
Ambiente: a preencher.
Comandos/cenários e resultado: a preencher.
Revisor/responsável e data: a preencher.
Bloqueios: a preencher.
