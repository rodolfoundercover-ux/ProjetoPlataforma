# PHASE_01 — Multi-tenant, contas, licenças e segurança

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_00 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Implementar conta, licença por agência, membros, papéis, permissões/perfis, features e isolamento. Criar fixtures de duas agências, dois clientes e Super Admin. Proteger último ADMIN ativo.

## Entidades e entregas

accounts, agencies, licenses, plans, platform_admins, features, agency_features, agency_members, permissions, permission_profiles, permission_profile_permissions, agency_member_permissions.

## Leituras

- [SPEC.md](../SPEC.md)
- [DATABASE.md](../DATABASE.md)
- [PERMISSIONS.md](../PERMISSIONS.md)
- [SECURITY.md](../SECURITY.md)
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

- [ ] P01-01: Usuário da agência A lê A e recebe negação ao ler/inserir/alterar registros de B, inclusive via API/RPC.
- [ ] P01-02: SUPER_ADMIN não obtém dados privados em SELECT, view, RPC ou Storage de teste.
- [ ] P01-03: CLIENT A não acessa dados de CLIENT B nem dados da mesma identidade em outro tenant.
- [ ] P01-04: Alterar agency_id/active_agency_id ou FK no payload não concede acesso nem cria relação cross-tenant.
- [ ] P01-05: ANALYST sem permissão recebe negação no backend; editar perfil não cria cargo rígido.
- [ ] P01-06: Último ADMIN ativo não pode ser removido; licença suspensa preserva histórico e não concede outro tenant.

Usar [checklist e evidências](PHASE_01_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
