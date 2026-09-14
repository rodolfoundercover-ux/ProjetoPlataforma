# Aceitação — PHASE_11: Notificações, jobs e automações

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P11-01 — Navegador fechado não impede expiração, overdue, fechamento de vendas e reconciliação. | A registrar | PENDENTE |
| P11-02 — Um evento repetido gera uma única entrega lógica por canal/versão/destinatário. | A registrar | PENDENTE |
| P11-03 — Falha de e-mail não desfaz confirmação de pagamento; retry e falha final ficam rastreáveis. | A registrar | PENDENTE |
| P11-04 — Jobs usam timezone/cadência configurados; ausência/atraso/mínimo não cancela nem inicia operação automaticamente. | A registrar | PENDENTE |
| P11-05 — Templates respeitam branding, whitelist e preferências; marketing consulta consentimento separado. | A registrar | PENDENTE |
| P11-06 — Super Admin reprocessa evento técnico sem receber PII, segredos ou documento privado. | A registrar | PENDENTE |

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
