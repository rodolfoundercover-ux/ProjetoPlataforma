# Estado da implementação

Atualizado em 2026-09-15. A PHASE_00 até a PHASE_04 estão validadas. A PHASE_05 pode ser iniciada.

| Fase | Título | Situação | Evidência principal |
|---|---|---|---|
| PHASE_00 | Fundação técnica | APROVADA | CI, Supabase local, autenticação, logout e homologação validados |
| PHASE_01 | Multi-tenant, contas, licenças e segurança | APROVADA | RLS, permissões, CI e operação online validados; commit final `4572d96` |
| PHASE_02 | Agência, branding e configurações | APROVADA | Commit `4c3e80d`; CI `34880713513` aprovada; Supabase Cloud e Vercel validados |
| PHASE_03 | Viagens, veículos e assentos | APROVADA | Commit `20cf3cf`; 80 testes pgTAP e gates aprovados; Supabase Cloud e Vercel validados |
| PHASE_04 | Clientes, passageiros e reservas | APROVADA | Banco limpo, 110 testes pgTAP, fluxos de capacidade, expiração, desconto e snapshots validados |
| PHASE_05 | Motor financeiro e pagamentos | NÃO INICIADA | — |
| PHASE_06 | Contratos, políticas e assinatura | NÃO INICIADA | — |
| PHASE_07 | Site white-label, checkout e cliente | NÃO INICIADA | — |
| PHASE_08 | Pós-venda, reembolso e crédito | NÃO INICIADA | — |
| PHASE_09 | Operação da viagem e embarque | NÃO INICIADA | — |
| PHASE_10 | Financeiro e fechamento da viagem | NÃO INICIADA | — |
| PHASE_11 | Notificações, jobs e automações | NÃO INICIADA | — |
| PHASE_12 | Dashboard, relatórios e exportações | NÃO INICIADA | — |
| PHASE_13 | Afiliados e atribuição comercial | NÃO INICIADA | — |
| PHASE_14 | Hardening e piloto Dri | NÃO INICIADA | — |

## PHASE_02 — evidência local

- `20260914000300_agency_settings.sql` cria configurações, identidade visual, domínios, categorias, locais de embarque, convites, referências seguras de integração e auditoria.
- Todas as entidades comerciais usam `agency_id`, RLS e licença ativa. Não há bypass de dados privados para SUPER_ADMIN.
- Resolução pública recebe somente hostname normalizado e falha fechada para host desconhecido, não verificado, sem SSL ativo ou com licença inativa.
- Mudanças de domínio e integração geram auditoria e referência na outbox. Verificação de domínio é reservada ao processo técnico.
- Convites guardam somente hash, expiram, têm uso único e podem ser revogados. Desativar o membro remove acesso efetivo.
- Categorias, embarques e regras não recebem valores comerciais ilustrativos como defaults.
- `supabase db reset` e `pnpm db:types`: concluídos no banco local limpo.
- `pnpm db:test`: PASS, 3 arquivos e 52 testes (29 da PHASE_02).
- Após a geração final dos tipos, `pnpm check`: PASS (`lint`, TypeScript, Vitest 2/2 e build Next.js).
- `PLAYWRIGHT_USE_EDGE=1 pnpm test:e2e`: PASS, 2/2 cenários de autenticação.
- GitHub Actions `34880713513`: PASS no commit documental `65448a5`.
- Migração aplicada no Supabase Cloud; agência inicial, licença ativa e vínculo ADMIN criados para a conta de operação.
- Vercel validada em `/technical/settings` e `/technical/team` com a agência atual e os formulários da PHASE_02.

## Limites deliberados

- O provedor de e-mail entra na PHASE_11. Nesta fase, o token de convite é exibido uma vez ao administrador para entrega por canal seguro.
- DNS e SSL de domínio próprio estão preparados, mas a automação externa não bloqueia o piloto com subdomínio da plataforma.
- Referências de integração não armazenam nem reexibem segredos e não declaram qualquer provedor conectado.

Consultar [DECISIONS.md](../docs/DECISIONS.md), [aceitação da PHASE_02](../docs/phases/PHASE_02_ACCEPTANCE.md) e [desenvolvimento local](../docs/LOCAL_DEVELOPMENT.md).
