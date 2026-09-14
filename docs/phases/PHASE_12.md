# PHASE_12 — Dashboard, relatórios e exportações

Status: NÃO INICIADA. Fonte de sequência: F.2; escopo corrigido por G.1.
Dependência principal: PHASE_11 concluída. Ler o contexto global antes de executar.

## Objetivo e escopo

Dashboard essencial e relatórios operacionais, pagamentos/custos/resultado, CSV/XLSX com filtros, máscara, permissão e exportação assíncrona quando necessário. Dados de afiliados ainda dependem da ativação PHASE_13.

## Entidades e entregas

Views/projeções autorizadas, consultas paginadas, jobs de exportação, arquivos privados temporários.

## Leituras

- [SCREENS.md](../SCREENS.md)
- [BUSINESS_RULES.md](../BUSINESS_RULES.md)
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

- [ ] P12-01: Cada indicador bate com reservas/passageiros/pagamentos alocados do mesmo filtro.
- [ ] P12-02: Receita turística exclui taxa do cliente; caixa Marketplace distingue pagamento do cliente e repasse à agência.
- [ ] P12-03: ANALYST sem financeiro/PII não obtém informação pelo dashboard, exportação ou consulta direta.
- [ ] P12-04: CSV/XLSX preservam filtros e valores; textos do usuário não executam fórmula ao abrir a planilha.
- [ ] P12-05: Arquivo de exportação é privado/temporário, auditado e indisponível a outro tenant.
- [ ] P12-06: Relatório histórico usa versão de fechamento, não valores atuais; recurso avançado não aparece como MVP.

Usar [checklist e evidências](PHASE_12_ACCEPTANCE.md). Critérios de segurança da fase não podem ser adiados. Testes de fases anteriores devem ser reexecutados quando esta alteração afetar suas invariantes.

## Entrega ao encerrar

Explicar comportamento implementado, arquivos/migrations, testes realmente executados e resultados, limitações/decisões abertas e próximo passo. Atualizar [STATUS.md](../../codex/STATUS.md). Não marcar APROVADA sem todos os critérios aplicáveis comprovados.
