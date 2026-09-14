# Instruções para implementação

Este repositório contém a especificação do SaaS multiagência de excursões/viagens. Leia README.md, docs/SPEC.md, docs/AUDIT_G1.md e codex/CODEX_START.md antes de implementar.

## Fonte de verdade

1. Decisões explícitas posteriores do responsável pelo produto, registradas em docs/DECISIONS.md.
2. Auditoria G.1 (55 decisões).
3. Documentos mestres que aplicam G.1.
4. Detalhes históricos identificados por A/B/C/D/E/F, apenas se compatíveis.
5. Exemplos não são defaults nem políticas legais.

Não inventar regras comerciais para preencher lacunas. Registrar pendência e prosseguir nas partes independentes. Nome físico/DTO e organização interna podem ser decididos tecnicamente, documentando o mapeamento sem alterar comportamento. Templates começam DRAFT.

## Escopo

Implementar uma PHASE por vez, incluindo banco, segurança, serviço, interface e testes aplicáveis. Não ativar funcionalidades posteriores para completar a atual. PHASE_02 é configurações; Fase 2 é expansão pós-piloto. ZapSign 6.1 faz parte da avaliação PHASE_06.

## Invariantes

- SUPER_ADMIN nunca tem bypass em RLS/Storage privados, nem acesso de suporte para ver tudo.
- Dados pessoais comerciais são tenant-local; auth.users é só identidade global.
- Comprador pode não viajar. Capacidade é por passageiro ocupante, com holds próprios e operações atômicas.
- Estados da reserva: DRAFT, WAITING_ENTRY, CONFIRMED, CANCELLED, EXPIRED, COMPLETED. Não adicionar HOLD, WAITING_PAYMENT ou SOLD_OUT.
- SOLD_OUT e disponibilidade são derivados; publicação não é estado da viagem.
- Confirmação exige entrada quitada e reserva elegível; evento tardio não ressuscita expirada/cancelada.
- Marketplace cria uma única reserva da agência, usa somente Mercado Pago e confirma independentemente do repasse.
- Pós-venda Marketplace fica na agência; sem reserva de reembolso/retenção automática obrigatória.
- Dinheiro: numeric(14,2), Decimal no domínio, arredondamento central. Nunca cálculo crítico com JS number.
- Taxa do cliente não é receita turística; desconto não é subtraído duas vezes.
- Cancelamento pela agência não penaliza cliente; crédito vale somente no tenant emissor e usa ledger.
- Não apagar pagamentos, contratos assinados ou snapshots de fechamento; corrigir por eventos/versões.
- Afiliado não é agência parceira; comissão definitiva apenas após fechamento.
- Não construir ERP, offline, Maps, QR check-in ou WhatsApp IA no MVP.
- Segredos nunca entram em Git/browser/logs/contexto da IA. Webhook não escolhe tenant por payload externo.
- Frontend não é autoridade de preço, vaga, permissão ou estado.

## Engenharia

Usar stack definida em ARCHITECTURE.md e versões verificadas no bootstrap. Sem troca silenciosa de major/stack. SQL migrations versionadas, tipos gerados, TypeScript strict, validação de entradas externas, serviços por domínio, transactions/RPC em invariantes críticos e audit/outbox no commit.

RLS e grants devem bloquear acesso direto que contorne permissões/mascaramento. Testar PostgreSQL real, não apenas mocks. Fakes são para testes, não comprovação de integração real.

## Conclusão da fase

Preencher checklist com evidência, executar verificações aplicáveis e atualizar codex/STATUS.md. Não marcar concluído com TODO, tela fake, credencial ausente ou teste não executado. Relatar comportamento, validações e pendências. Não publicar contratos sem revisão exigida nem alegar que teste de software substitui parecer jurídico.

Mudanças destrutivas, uso de credenciais e deploy devem seguir a autorização efetiva da sessão e a política do ambiente; este arquivo não concede autorização externa.
