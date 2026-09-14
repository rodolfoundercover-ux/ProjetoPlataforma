# Aceitação — PHASE_07: Site white-label, checkout e cliente

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P07-01 — Cliente conclui jornada catálogo → passageiros → embarques/assentos → entrada → CONFIRMED → contrato. | A registrar | PENDENTE |
| P07-02 — Mesma identidade em dois domínios vê somente compras/créditos/contratos da agência atual. | A registrar | PENDENTE |
| P07-03 — Auth central retorna apenas a hostname permitido com sessão segura e sem tokens em URL pública. | A registrar | PENDENTE |
| P07-04 — Manipular preço, desconto, customer_id ou agency_id do checkout é rejeitado pelo backend. | A registrar | PENDENTE |
| P07-05 — Pagamento pendente e conflito de hold têm mensagens recuperáveis; refresh não duplica reserva. | A registrar | PENDENTE |
| P07-06 — Tela mobile, teclado, rótulos, foco, loading, erro e vazio funcionam; conteúdo privado não entra em cache público. | A registrar | PENDENTE |

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
