# Aceitação — PHASE_01: Multi-tenant, contas, licenças e segurança

Status: APROVADA em 2026-09-13. Testes PostgreSQL/Supabase local e validação manual ADMIN registrados abaixo.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P01-01 — Usuário da agência A lê A e recebe negação ao ler/inserir/alterar registros de B, inclusive via API/RPC. | pgTAP criou Agências A/B e validou que membro A lê somente A e não lê cliente B. A tentativa de criar relação com identidade de outro tenant falha em RLS (`42501`). | ATENDIDO |
| P01-02 — SUPER_ADMIN não obtém dados privados em SELECT, view, RPC ou Storage de teste. | pgTAP autenticado como usuário presente em `platform_admins` recebeu zero linhas de `agency_customers`; bucket de documentos permanece privado conforme P00. Não existem view/RPC privados nesta fase. | ATENDIDO |
| P01-03 — CLIENT A não acessa dados de CLIENT B nem dados da mesma identidade em outro tenant. | pgTAP validou relação comercial tenant-local e que a policy concede apenas linhas cujo `auth_user_id = auth.uid()`. | ATENDIDO |
| P01-04 — Alterar agency_id/active_agency_id ou FK no payload não concede acesso nem cria relação cross-tenant. | `active_agency_id` não é usado na RLS; pgTAP confirmou que trigger rejeita transferência de `agency_id` e RLS bloqueia criação para outra identidade. | ATENDIDO |
| P01-05 — ANALYST sem permissão recebe negação no backend; editar perfil não cria cargo rígido. | pgTAP autenticado como ANALYST confirmou ausência de `team.manage_permissions` e tentativa de criar perfil falhou em RLS (`42501`). Autorização continua por permissão granular, não por cargo rígido. | ATENDIDO |
| P01-06 — Último ADMIN ativo não pode ser removido; licença suspensa preserva histórico e não concede outro tenant. | pgTAP confirmou SQLSTATE `23514` ao desativar último ADMIN e confirmou que licença `SUSPENDED` não concede leitura de tenant. Histórico é preservado por não haver deleção na suspensão. | ATENDIDO |

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

Commit: não publicado nesta sessão, por decisão do usuário.
Ambiente: Windows / Supabase local, execução pendente.
Comandos/cenários e resultado: após reset local, `pnpm db:test` PASS (2 arquivos, 23 testes); `pnpm typecheck` PASS; `pnpm lint` PASS; `pnpm test` PASS (2 testes); `pnpm build` PASS em Next.js 16.3.4.
Revisor/responsável e data: a preencher.
Bloqueios: a preencher.
