# Decisões de consolidação e pendências

Fonte principal: G.1. Este registro distingue decisões herdadas, normalizações editoriais e lacunas que a conversa deixou abertas.

## Decisões fechadas preservadas

As 55 decisões G.1 estão em AUDIT_G1.md e mapeadas em SOURCE_MAP.md. Alteração posterior deve citar a decisão substituída, motivo, impacto em banco/API/telas/contratos e aceite do responsável pelo produto.

## Normalizações editoriais deste pacote

| Tema | Tratamento |
|---|---|
| fee_bearer | CLIENT / AGENCY / SHARED, conforme G.1.7; aliases antigos mapeados |
| Permissões | settings.integrations.manage, settings.branding.manage, settings.domain.manage e operations.change_boarding seguem formulações posteriores |
| PHASE_02 versus Fase 2 | Etapa técnica de configurações versus expansão após piloto |
| HOLD | Fora do enum de reserva; passageiro pode ter estado comercial HOLD conforme F.6.9 |
| BOARDING versus BOARDED | BOARDING para viagem/operação; BOARDED para check-in do passageiro |
| ARCHIVED | archived_at na viagem; não novo estado trips.status |
| Taxas/descontos | Base e preço vendido distintos; não contar taxa do cliente como receita nem deduzir desconto duas vezes |
| Exemplos | Valores monetários, percentuais, datas, nomes, franquias e prazos ilustrativos não são defaults |
| Versões externas | Requisito de stack preservado; número exato e compatibilidade precisam de validação no bootstrap |
| Templates | V2 substitui viagem inicial; retiradas explicações conversacionais e percentuais exemplificativos do modelo implantável |
| Privacidade Marketplace | Nenhuma PII no painel SUPER_ADMIN; processamento técnico interno não abre acesso humano |
| Hash | Hash do arquivo final não pode depender de ele próprio impresso; separar conteúdo, arquivo e evidências |
| Idempotência | Escopo por conta/integração quando necessário; proteção contra colisões e retries é derivação técnica dos invariantes |

## Decisões abertas, sem resposta inventada

| ID | Definição necessária | Momento / efeito |
|---|---|---|
| DEC-01 | Marca/domínios reais, preços/planos/franquias e quotas | Configuração PHASE_02; exemplos de domínio não são compra/configuração real |
| DEC-02 | Versões exatas Next/React/Node/Tailwind/Zod e runtime compatível | PHASE_00; verificar documentação oficial e lockfile |
| DEC-03 | Mecanismo seguro de sessão no retorno entre domínios independentes | Spike PHASE_00, implementação/validação PHASE_07 |
| DEC-04 | Credenciais/contas e capacidades reais Mercado Pago/InfinitePay, taxas por conta/método/parcela | PHASE_05; não concluir integração real com fake |
| DEC-05 | Provider de e-mail, identidade remetente e limites operacionais | Base/notificações PHASE_11 |
| DEC-06 | Biblioteca decimal, modo de arredondamento e destino determinístico de resíduos | PHASE_05 antes de aceitar cálculos; não alterar totais |
| DEC-07 | Duração dos holds, prazo manual, entrada, calendário de parcelas e tratamento de compra após corte | PHASE_02/04/05; quitação até sete dias e exceção por reserva já são decisões fechadas |
| DEC-08 | Percentuais/faixas de cancelamento, no-show, custos não recuperáveis e conceito de valor elegível pago | PHASE_06/08; parametrizar e submeter à revisão prevista |
| DEC-09 | Retenção por categoria, janela de exportação após encerramento, anonimização e arquivos temporários | Antes do go-live; não fixar anos/dias sem política |
| DEC-10 | Biblioteca PdfRenderer e alcance/conta ZapSign PLATFORM/AGENCY | PHASE_06; gate jurídico decide documentos bloqueados |
| DEC-11 | Limites de aprovação, valor sensível, janela de reautenticação e quando exigir aprovador distinto | PHASE_02/08; sem cifra universal dos exemplos |
| DEC-12 | Regras específicas empatadas de afiliado, base de comissão em cancelamento/retenção e janela de atribuição | PHASE_13; último link válido e snapshot já estão definidos |
| DEC-13 | Elegibilidade de no-show/bebês para rateio de custos, precisão/resíduos e resultado negativo de parceira | PHASE_10 e expansão; registrar fórmula sem mudar custo total |
| DEC-14 | Comportamento público de licença suspensa, prazos de cobrança e eventual SLA | Antes de ativar plano; preservar dados e histórico |
| DEC-15 | Nome físico para publicação de site e hold de capacidade; campos de endereço/responsável; eventos/tabelas de contrato SaaS | Decisão técnica na fase, mantendo semântica da SPEC |
| DEC-16 | Taxa/termos de Marketplace, forma de execução de repasse e políticas de quota WhatsApp IA | Expansão Fase 2, não bloquear núcleo do piloto |
| DEC-17 | Precedência do indicador financial_status em casos simultâneos (atraso + reembolso parcial) | PHASE_05/08; fatos financeiros completos permanecem fonte de verdade |
| DEC-18 | Transição global da viagem ao reabrir financeiro e sincronização de estados relacionados | PHASE_10; manter CLOSED anterior e nova versão sem reabrir vendas |

Decisões técnicas reversíveis podem ser resolvidas e registradas pelo implementador. Regras comerciais/jurídicas abertas não podem ser silenciosamente inventadas. Manter implementação independente em andamento e solicitar apenas o dado que bloqueia o comportamento afetado.

## Registro de mudanças futuras

PHASE_00, 2026-09-13: [registro técnico](PHASE_00_TECHNICAL.md) documenta a fundação inicial, proteção da outbox/bucket, versões provisórias e proposta de Auth entre domínios. DEC-02 e DEC-03 continuam abertas porque faltam instalação, compatibilidade e spike validado. Nenhuma regra comercial G.1 foi alterada.

| Data | ID / fonte | Decisão | Impacto | Responsável / evidência |
|---|---|---|---|---|
| A preencher | | | | |
| 2026-09-14 | PHASE_02 / G.1.47 | Verificação de domínio e SSL é controlada pelo processo técnico; usuário autenticado apenas solicita/configura o hostname. | Impede autodeclaração de domínio válido; piloto pode usar subdomínio verificado. | Migration e pgTAP PHASE_02 |
| 2026-09-14 | PHASE_02 / C.3.13–16 | Até o provedor de e-mail da PHASE_11, o token de convite é exibido uma vez e somente o hash é persistido. | Convite expira, é revogável e de uso único sem declarar envio de e-mail pronto. | Migration, tela de equipe e pgTAP PHASE_02 |
| 2026-09-14 | PHASE_02 / segurança de integrações | Configuração guarda referência ao segredo, nunca o segredo ou seu valor recuperável. | Mantém credenciais fora das tabelas e da auditoria; conexão real pertence à fase do provedor. | Migration e tela de configurações |
| 2026-09-14 | PHASE_03 / DEC-15 | Publicação própria usa `site_trip_publications`; capacidade e mapa pertencem ao `trip_vehicle_assignment` versionado. | Despublicar não altera o ciclo da viagem e trocar veículo preserva o histórico e cria novo snapshot de assentos. | Migration e pgTAP PHASE_03 |
