# Aceitação — PHASE_05: Motor financeiro e pagamentos

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P05-01 — Entrada só confirma reserva elegível quando integralmente paga; pagamento parcial preserva saldo. | A registrar | PENDENTE |
| P05-02 — Webhook repetido, fora de ordem ou retry após timeout não duplica pagamento/alocação. | A registrar | PENDENTE |
| P05-03 — Pagamento depois de EXPIRED gera exceção, sem confirmação automática nem overbooking. | A registrar | PENDENTE |
| P05-04 — CLIENT/AGENCY/SHARED resultam em total correto; taxa do cliente não aumenta receita turística; parcelas somam o total exato. | A registrar | PENDENTE |
| P05-05 — Mercado Pago e InfinitePay usam a conta correta; redirect não comprova pagamento; dinheiro exige permissão. | A registrar | PENDENTE |
| P05-06 — Quitação até sete dias antes e exceção por reserva funcionam sem mudar política global. | A registrar | PENDENTE |
| P05-07 — Adapters têm evidência controlada de criação/consulta/confirmação; falta de credencial/capacidade é registrada como pendência, não sucesso. | A registrar | PENDENTE |

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
