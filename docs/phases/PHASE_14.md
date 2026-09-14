# PHASE_14 — Hardening e piloto Dri

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_13 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Consolidar segurança, concorrência, desempenho, acessibilidade/mobile, operações e integrações; ensaiar restauração e executar piloto controlado da Dri. Nenhuma segunda agência comercial antes da validação do piloto.

## Entidades e entregas

Runbooks, evidências, configuração de produção, plano de rollback e relatório do piloto.

## Leituras

- [QUALITY.md](../QUALITY.md)
- [SECURITY.md](../SECURITY.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
- [INTEGRATIONS.md](../INTEGRATIONS.md)
- [MVP.md](../MVP.md)
- [DECISIONS.md](../DECISIONS.md)
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

- [ ] P14-01: Jornada real controlada cobre cadastro → venda/entrada → contrato → alteração/cancelamento → embarque → fechamento.
- [ ] P14-02: Suítes de isolamento A/B, clientes, SUPER_ADMIN, IDOR, RLS, Storage, XSS e permissões passam.
- [ ] P14-03: Concorrência de assento/capacidade, webhook, expiração e wallet é validada sem duplicação.
- [ ] P14-04: Migrations em banco limpo e atualização de staging, build e CI passam; logs são sanitizados.
- [ ] P14-05: Restauração de banco e documentos críticos foi ensaiada com evidências e procedimento de recuperação.
- [ ] P14-06: Revisão jurídica e gates de assinatura por documento estão resolvidos; credenciais/retenção/domínios estão configurados conforme corte do piloto.
- [ ] P14-07: Piloto tem responsável, resultados, incidentes/correções e aceite registrado; módulos de expansão permanecem desligados.

Usar [checklist e evidências](PHASE_14_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
