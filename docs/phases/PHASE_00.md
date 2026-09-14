# PHASE_00 — Fundação técnica

Status: EM ANDAMENTO — código inicial criado, execução integral bloqueada por permissões do ambiente do agente. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: Nenhuma fase anterior. Ler o contexto global antes de executar.

## Objetivo e escopo

Criar Next.js/TypeScript strict, Supabase local, estrutura de módulos, Auth/Storage básicos, migrations, logs/erros, ambientes e abstrações de providers. Fixar versões compatíveis verificadas, pnpm e CI. Preparar outbox/queue/cron, sem fluxo comercial.

## Entidades e entregas

Estrutura src/, supabase/, tests/, configuração de ambiente e providers fake.

## Leituras

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SECURITY.md](../SECURITY.md)
- [DATABASE.md](../DATABASE.md)
- [QUALITY.md](../QUALITY.md)
- [Auditoria G.1](../AUDIT_G1.md)
- [Decisões e pendências](../DECISIONS.md)
- [Qualidade global](../QUALITY.md)

## Plano de execução

1. Inspecionar implementação e evidências anteriores; identificar requisitos desta fase e suas fontes.
2. Implementar migrations/constraints/RLS, contratos de serviço e autorização aplicáveis.
3. Implementar comportamento transacional, audit/outbox e adapters necessários.
4. Construir telas previstas com estados de erro/vazio/carregamento e acesso seguro.
5. Validar critérios, atualizar documentação afetada e registrar evidências.

Não antecipar expansão Fase 2 ou funcionalidades futuras. Componentes já criados devem ser reutilizados. Falta de dependência externa não é autorização para substituir regra comercial ou concluir com mock.

## Critérios de aceitação

- [ ] P00-01: Partindo de checkout limpo, instalação e execução local seguem README sem segredo no Git.
- [ ] P00-02: Migrations rodam em banco vazio; tipos gerados correspondem ao schema.
- [ ] P00-03: Login técnico com Supabase funciona; chave privilegiada não aparece no bundle.
- [ ] P00-04: Lint, TypeScript, testes-base e build passam no CI.
- [ ] P00-05: Deploy de homologação e health check têm evidência; produção não recebe dados de teste.
- [ ] P00-06: Versões oficiais verificadas, estratégia de Auth entre domínios e requisitos de runtime dos workers estão registrados.

Usar [checklist e evidências](PHASE_00_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
