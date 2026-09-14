# Aceitação — PHASE_08: Pós-venda, reembolso e crédito

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P08-01 — Reserva de três passageiros cancela um; uma vaga é liberada e os outros dois seguem confirmados. | A registrar | PENDENTE |
| P08-02 — Simulação e execução usam mesma política/contexto; contexto alterado exige nova validação. | A registrar | PENDENTE |
| P08-03 — Agência cancela viagem sem penalidade do cliente; escolha individual refund/crédito é registrada. | A registrar | PENDENTE |
| P08-04 — Crédito só é gasto na agência emissora; duas tentativas concorrentes não gastam o mesmo saldo. | A registrar | PENDENTE |
| P08-05 — Falha de refund não marca pagamento como apagado nem devolução como concluída; retry não duplica. | A registrar | PENDENTE |
| P08-06 — Substituição/transferência preserva responsável e passageiro anteriores e gera termo quando necessário. | A registrar | PENDENTE |
| P08-07 — Remarcação preserva datas e registra resposta; silêncio não é aceite e recusa segue política. | A registrar | PENDENTE |

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
