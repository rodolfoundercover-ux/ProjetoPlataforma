# Aceitação — PHASE_10: Financeiro e fechamento da viagem

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P10-01 — Preço vendido não sofre desconto duas vezes; vendido, recebido, a receber e resultado reconciliam com origens. | A registrar | PENDENTE |
| P10-02 — Custos de veículo/cadastro não são duplicados; rateios preservam total e separam custos sem rateio. | A registrar | PENDENTE |
| P10-03 — CLOSE bloqueia inconsistências críticas e congela detalhes/versão; viagem chega a FINISHED. | A registrar | PENDENTE |
| P10-04 — REOPEN preserva valores da versão anterior e cria nova; settlement pago recebe ajuste sem ser apagado. | A registrar | PENDENTE |
| P10-05 — SUPER_ADMIN/ANALYST sem permissão não lê custo/lucro em tela, API ou exportação. | A registrar | PENDENTE |
| P10-06 — Contrato das comissões suporta cancelamento por passageiro e cálculo final após fechamento; regressão obrigatória na PHASE_13. | A registrar | PENDENTE |

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
