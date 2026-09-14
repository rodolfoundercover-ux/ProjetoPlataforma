# Aceitação — PHASE_02: Agência, branding e configurações

Status: APROVADA em 2026-09-14. Publicação, CI remota, Supabase Cloud e Vercel validados.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P02-01 — Admin salva/reabre nome, logo, cores, fonte, contatos, Cadastur e regras sem perda. | pgTAP preserva todos os campos por agência; `/technical/settings` oferece formulários protegidos e o build passou. | ATENDIDO LOCALMENTE |
| P02-02 — Duas agências exibem branding distinto, sem cache cruzado. | pgTAP cria marcas A/B e comprova que a sessão A lê apenas A; página dinâmica e respostas `private, no-store`. | ATENDIDO LOCALMENTE |
| P02-03 — Hostname desconhecido ou não verificado não resolve tenant de produção; query agency_id não substitui Host. | Resolver usa somente hostname normalizado e exige domínio VERIFIED, SSL ACTIVE e licença ACTIVE; pgTAP cobre host verificado, pendente e desconhecido. | ATENDIDO LOCALMENTE |
| P02-04 — Convite tem validade/uso único; revogação e desativação removem acesso efetivo. | pgTAP cobre aceite, segundo uso, expiração, revogação e perda de leitura após membro INACTIVE. | ATENDIDO LOCALMENTE |
| P02-05 — Alterar domínio/integração exige permissão e trilha; não há dois principais ativos. | pgTAP cobre permissão negada, bloqueio de autoverificação, domínio principal único e auditoria/outbox. | ATENDIDO LOCALMENTE |
| P02-06 — Categorias e embarques são configuráveis; valores comerciais ilustrativos não viram defaults ocultos. | pgTAP cadastra ambos por tenant; tempos são opcionais e nenhum preço, percentual ou prazo comercial é predefinido. | ATENDIDO LOCALMENTE |

## Gates comuns

- [x] Código e documentação coerentes com G.1 e escopo da fase.
- [x] Testes de autorização/tenant e invariantes afetadas executados.
- [x] Migration aplicada em banco local limpo e tipos regenerados.
- [x] Tipos, lint, testes, build e E2E passam após a regeneração final; CI remota aprovada.
- [x] Integrações reais não são declaradas prontas somente por fake.
- [x] Segredos e PII não são persistidos na auditoria/outbox; integração armazena apenas referência.
- [x] Pendências e decisões registradas em DECISIONS.md.
- [x] STATUS.md atualizado com evidência; nenhum TODO crítico usado como conclusão.

## Registro de execução

Commit: `4c3e80d` — implementação da PHASE_02; `65448a5` — registro publicado que acionou a CI.
Ambiente: Supabase local no Windows, Supabase Cloud e Vercel, 2026-09-14.
Comandos/cenários e resultado: banco limpo e tipos concluídos; `pnpm db:test` PASS, 3 arquivos/52 testes; `pnpm check` PASS; Playwright com Edge 2/2 PASS.
Revisor/responsável e data: validação conduzida com o usuário em 2026-09-14.
CI e publicação: GitHub Actions `34880713513` PASS; migração aplicada no Supabase Cloud; `/technical/settings` e `/technical/team` validadas na Vercel com vínculo ADMIN ativo.
Bloqueios: nenhum para concluir a PHASE_02.
