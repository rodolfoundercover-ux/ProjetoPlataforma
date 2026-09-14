# Aceitação — PHASE_00: Fundação técnica

Status: APROVADA em 2026-09-13. Código inicial, CI, banco local, autenticação e homologação têm evidência registrada abaixo.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P00-01 — Partindo de checkout limpo, instalação e execução local seguem README sem segredo no Git. | GitHub Actions executou checkout limpo, instalação frozen e ambiente Supabase; revisão confirmou ausência de `.env.local` e de chave privilegiada no repositório. Run `34785605661`, commit `b860a0b`, PASS. | ATENDIDO |
| P00-02 — Migrations rodam em banco vazio; tipos gerados correspondem ao schema. | Primeiro start local ocorreu após falha inicial de bind, aplicando a migration em instância nova. Usuário executou pgTAP: 7/7 PASS. Tipos gerados presentes e usados nos clientes; typecheck/build passam. | ATENDIDO |
| P00-03 — Login técnico com Supabase funciona; chave privilegiada não aparece no bundle. | Login válido e logout comprovados manualmente. Edge/Playwright 2/2 PASS. Auth: email=true e cadastro público fechado. Scan de src e bundle sem service_role/segredos privilegiados; .env.local contém somente nomes de URL e chave pública esperados. | ATENDIDO |
| P00-04 — Lint, TypeScript, testes-base e build passam no CI. | Workflow `PHASE_00 checks` concluiu instalação, Supabase, tipos, pgTAP, lint, TypeScript, Vitest, build e Playwright. Run `34785605661`, commit `b860a0b`, PASS em 2m47s. | ATENDIDO |
| P00-05 — Deploy de homologação e health check têm evidência; produção não recebe dados de teste. | Projeto `projeto-plataforma` criado na Vercel, conectado ao branch `main` de `rodolfoundercover-ux/ProjetoPlataforma`; primeiro deploy concluiu com sucesso em 2026-09-13. URL de deploy exibida pela Vercel: `https://projeto-plataforma-six.vercel.app`. URL e chave pública do Supabase de homologação foram configuradas para Production e Preview. Logs da Vercel registraram `GET /api/health` com HTTP 200 às 20:05:33 e 20:05:58 (America/Sao_Paulo); nenhum dado de teste foi enviado à produção. | ATENDIDO |
| P00-06 — Versões oficiais verificadas, estratégia de Auth entre domínios e requisitos de runtime dos workers estão registrados. | Versões exatas registradas em package.json, lockfile e INSTALLED_VERSIONS.json; compatibilidade comprovada por build/testes locais. PHASE_00_TECHNICAL.md registra estratégia central com código opaco/PKCE e separação Node/Deno; implementação cross-domain fica na fase prevista. | ATENDIDO |

## Gates comuns

- [x] Código e documentação coerentes com G.1 e escopo da fase.
- [x] Testes de autorização aplicáveis à fundação executados; entidades tenant ainda não existem nesta fase.
- [x] Migration aplicada no primeiro banco local e 7 testes pgTAP passaram.
- [x] Tipos, lint, build e testes passam localmente e no CI remoto.
- [x] Integrações reais não são declaradas prontas somente por fake.
- [x] Logs/segredos/PII revisados.
- [x] Pendências e decisões registradas em DECISIONS.md.
- [x] STATUS.md atualizado com evidência; nenhum TODO crítico usado como conclusão.

## Registro de execução

Commit: `b860a0b` no branch `main` do GitHub.
Ambiente: Windows / Node 24.21.0 local e GitHub Actions/Ubuntu com Node 24.
Comandos/cenários: ver [STATUS.md](../../codex/STATUS.md), registro de 2026-09-13.
Responsável pela implementação inicial: Codex; revisão humana pendente.
PHASE_00 aprovada: todos os critérios P00-01 a P00-06 estão atendidos. O ambiente local, o CI e a homologação passaram. PHASE_01 não foi iniciada. Guia no [VS Code](../LOCAL_DEVELOPMENT.md).
