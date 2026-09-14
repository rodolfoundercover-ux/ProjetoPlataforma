# Aceitação — PHASE_14: Hardening e piloto Dri

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P14-01 — Jornada real controlada cobre cadastro → venda/entrada → contrato → alteração/cancelamento → embarque → fechamento. | A registrar | PENDENTE |
| P14-02 — Suítes de isolamento A/B, clientes, SUPER_ADMIN, IDOR, RLS, Storage, XSS e permissões passam. | A registrar | PENDENTE |
| P14-03 — Concorrência de assento/capacidade, webhook, expiração e wallet é validada sem duplicação. | A registrar | PENDENTE |
| P14-04 — Migrations em banco limpo e atualização de staging, build e CI passam; logs são sanitizados. | A registrar | PENDENTE |
| P14-05 — Restauração de banco e documentos críticos foi ensaiada com evidências e procedimento de recuperação. | A registrar | PENDENTE |
| P14-06 — Revisão jurídica e gates de assinatura por documento estão resolvidos; credenciais/retenção/domínios estão configurados conforme corte do piloto. | A registrar | PENDENTE |
| P14-07 — Piloto tem responsável, resultados, incidentes/correções e aceite registrado; módulos de expansão permanecem desligados. | A registrar | PENDENTE |

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
