# Integrações e processamento assíncrono

Fontes: D.1–D.8, E.7, F.4/F.7 e G.1. Integrações são contratos de implementação, não adapters já testados. URLs, assinaturas, limites, taxas e versões reais devem ser validados nas documentações oficiais na fase correspondente. Não usar as antigas citações internas da conversa como documentação de API.

## Providers e escopo

| Provider | Escopo | Fase |
|---|---|---|
| MercadoPagoProvider | Conta da agência nos canais próprios; conta central exclusivamente no Marketplace | 05 / expansão Marketplace |
| InfinitePayProvider | Conta da agência; Pix/cartão/checkout conforme capacidades verificadas | 05 |
| CashProvider | Registro autorizado de dinheiro; não simula gateway | 05 |
| PdfRenderer | Renderização server-side, branding e hash | 06 |
| SignatureProvider | Aceite interno rastreável + adapter externo | 06 |
| ZapSignProvider | Conta PLATFORM ou AGENCY, decisão operacional a registrar | 06/6.1 ou MVP 1.1 |
| EmailProvider | Fornecedor a escolher, remetente e branding da agência | Base/11 |
| WhatsAppProvider + AIProvider | API oficial, ferramentas limitadas e handoff | Expansão Fase 2 |
| Storage/Auth/Queues/Cron | Supabase | Fundação e domínios dependentes |

## PaymentProvider

Operações conceituais: criar Pix/cartão/checkout/link, consultar transação, cotar taxas, solicitar reembolso quando suportado, validar/normalizar webhook e reconciliar. A interface deve informar capacidades reais por provider; recurso não suportado tem fluxo explícito, nunca sucesso falso.

PAYMENT_LINK é modo de checkout; Pix/cartão é meio efetivo do pagamento. Registrar ambos sem contar um link como recebimento. Parcelamento do gateway e calendário de charges da reserva são conceitos distintos; documentar sua associação no adapter e testar a regra de quitação.

Entrada da cotação: agency_id validado, trip_id, canal, provider, método, parcelas e base_amount.
Saída: base_amount, provider_fee, fee_bearer, client_fee, agency_fee e customer_total. Guardar snapshot da política e cotação utilizada. Não embutir tabela de taxa comercial universal no código.

## Mercado Pago

Conexão por agência em Configurações → Integrações, preferencialmente OAuth quando o fluxo aplicável permitir. Guardar external_account_id, status, connected_at e referência do segredo; token fica fora das tabelas comuns.

Nos canais próprios, selecionar conta da agência validada. No Marketplace, account_scope = MARKETPLACE e provider = MERCADO_PAGO, usando conta da plataforma. A agência pode absorver, compartilhar ou repassar a taxa; Marketplace respeita a regra da viagem/agência e congela condições da publicação/venda.

Captura de cartão pelo fluxo seguro do provider, sem PAN/CVV na aplicação. Pix retorna referência e código/checkout conforme API. A reserva não confirma pelo clique, comprovante não verificado ou redirect.

Desconectar bloqueia novas cobranças nesse provider e preserva histórico. Reconciliar operações anteriores. Indisponibilidade no site pode permitir escolha explícita de outro provider habilitado; no Marketplace a compra fica indisponível até Mercado Pago funcionar.

## InfinitePay

Somente canais próprios. A conversa prevê handle/InfiniteTag para identificar conta, order_nsu como correlação interna e transaction_nsu/slug como referências externas. Validar esses nomes e as APIs de criação/consulta no desenvolvimento; não presumir autenticação de webhook inexistente.

Checkout criado no backend → link → cliente paga → evento/consulta autenticada confirma fato financeiro → PaymentService aloca → ReservationService verifica entrada e elegibilidade. redirect_url só navega. Pix, cartão e parcelamento devem respeitar capacidades comprovadas da conta.

Se refund via API não estiver disponível, fluxo manual autorizado com comprovante e conciliação; não inventar endpoint. Não oferecer InfinitePay para Marketplace.

## Pipeline comum de eventos financeiros

1. Receber payload com limites, validar autenticidade pelo mecanismo documentado do provider.
2. Resolver integração/conta e tenant internamente; agency_id externo não é prova.
3. Persistir referência do evento de forma idempotente e sanitizada.
4. Consultar estado externo quando necessário; reconciliar referência, moeda, valor e conta.
5. Normalizar estado em payments/payment_transactions; alocar sem duplicação.
6. Em transação, avaliar entrada, estado e capacidade; gerar audit/outbox.
7. Processar documento/notificação após commit.
8. Retry com backoff e fila de falhas; resultado incerto exige consulta antes de repetir efeito.

Validar eventos duplicados, fora de ordem, timeout após sucesso externo, pagamento parcial, reversão, reembolso parcial e pagamento após expiração. Sucesso do provider com reserva EXPIRED cria exceção de reconciliação; não promete vaga.

## Repasses Marketplace — expansão

marketplace_sales referencia a única reserva da agência. Super Admin vê agência, viagem/referência técnica, base, taxas, devido, pago e saldo; sem dados de passageiros.

Repasse pode ser ADVANCE, PARTIAL, FINAL ou ADJUSTMENT e ocorrer antes do fechamento. No lançamento do módulo, operador pode transferir externamente e registrar valor/data/referência/comprovante. Não impor reserva de reembolso, saldo negativo, retenção automática ou espera pós-viagem. A agência responde por contrato, atendimento, cancelamento, crédito e reembolso.

## Contratos e ZapSign

Editor interno → conteúdo estruturado e snapshot → PdfRenderer → original privado/hash → SignatureProvider → evento validado → documento assinado privado/hash.

Manter original e assinado. Suportar N signatários; padrão é responsável comprador, passageiros listados, menores representados conforme política. VIEWED/PARTIALLY_SIGNED são detalhes da assinatura; contrato usa F.6.17. Documento enviado não é editado: cancelar envio e gerar novo. Recusa não apaga reserva paga.

Falha externa preserva documento pronto para envio; retry consulta referência antes de criar duplicata. Conclusão só após verificação de todos os signatários exigidos. Health técnico não expõe PDF nem PII ao Super Admin.

ZapSign é condicional no MVP, sujeito ao gate G.1.34. Aceite interno guarda usuário, timestamp, IP, user agent, texto, versão e hash, sem alegar equivalência jurídica automática.

## E-mail e notificações

EmailProvider permanece substituível. Remetente com nome da agência; domínio remetente próprio quando verificado, ou remetente da plataforma com branding. Escolher fornecedor e requisitos de domínio no desenvolvimento.

Notificação interna não é entrega externa. message_deliveries registra canal, destinatário por referência, destino mascarado, template/versão, provider id, estado, timestamps e erro. Eventos e canais são configuráveis; comunicação transacional separada de marketing/consentimento.

Templates permitem variáveis aprovadas, preview desktop/mobile com dados fictícios e envio de teste marcado. Preferir acesso autenticado/temporário para contrato em vez de anexar PII. Cadência, limites de retry e retenção são configuráveis. Falha de e-mail não reverte pagamento.

## WhatsApp IA — expansão Fase 2

API oficial WhatsApp Business Platform/Cloud API, número/conexão por agência, templates e custos variáveis. Sem automação de WhatsApp Web.

ConversationEngine identifica tenant, mantém referência da reserva, origem/afiliado e histórico de ações. Ferramentas permitem buscar viagens, consultar disponibilidade/preço, cadastrar comprador, criar reserva/hold, gerar link, consultar pagamento, simular cancelamento e solicitar aprovação/handoff. Todas validam identidade, tenant, permissão e estado.

IA não recebe SQL, service_role, segredos, autorização para alterar preço arbitrário, confirmar pagamento ou conceder exceção. Dados fornecidos à IA são mínimos. Pedido de humano pausa automação e preserva contexto; equipe pode devolver à IA. Falha de IA direciona para humano sem perder mensagens.

Usage por agência registra período, mensagens/conversas, tokens e custo estimado; planos/quotas e comportamento no limite continuam decisão comercial. Não prometer franquias dos exemplos.

## Storage

Buckets public-assets e private-documents. Logo/imagens públicas têm proprietário e relação com conteúdo publicado; contratos, comprovantes, ocorrências e documentos de passageiros são privados.

files armazena agency_id, categoria, bucket/path gerado, nome original como metadado, MIME/tamanho, entidade e ator. Upload valida conteúdo/tipo/tamanho e autorização; caminho não vem livremente do usuário. Documentos históricos referenciados não são apagados como temporários. Link privado exige autorização e validade curta.

## Domínios e autenticação

agency_domains registra hostname normalizado, proprietário, principal, verificação e SSL. Um hostname não pertence a duas agências; um principal ativo por agência. Somente domínio verificado com SSL ativo atende produção. Hosts desconhecidos falham fechados.

Admin central funciona mesmo se DNS público falhar. Subdomínio da plataforma basta ao piloto. Troca de domínio preserva agency_id e histórico; retorno do Auth só para destinos permitidos. Configuração DNS depende do provedor real, não copiar CNAME ilustrativo da conversa.

## Jobs: requisitos detalhados

Outbox, Queues e Cron desde as fases que necessitam deles. PHASE_11 completa agendamento/monitoramento; navegador fechado não pode interromper expiração e reconciliação.

# E.7.1 Arquitetura

Já havíamos preparado duas peças fundamentais:

```text
outbox_events
scheduled_job_runs
```

Elas terão funções diferentes.

```text
outbox_events
→ algo aconteceu e precisa gerar consequências

scheduled_job_runs
→ algo precisa ser verificado/executado em determinado momento
```

Exemplo:

```text
Pagamento confirmado
↓
outbox_event
↓
confirmar reserva
↓
gerar contrato
↓
notificar cliente
```

Já um prazo:

```text
Seat hold criado às 14:00
↓
expira às 14:15
↓
job libera assento
```

---

# E.7.2 Não fazer cron gigante

Eu evitaria um único processo:

```text
a cada minuto:
verificar tudo do sistema inteiro
```

Prefiro separar responsabilidades.

Conceitualmente:

```text
ReservationJobs
PaymentJobs
ContractJobs
TripJobs
NotificationJobs
IntegrationJobs
CleanupJobs
```

Isso facilita manutenção e diagnóstico.

---

# E.7.3 Expiração de seat hold

Quando criado:

```text
seat_hold

status = ACTIVE
expires_at = 14:15
```

Depois do prazo:

```text
ACTIVE
↓
EXPIRED
```

O assento volta imediatamente para disponibilidade.

---

# E.7.4 Hold de vaga sem assento

Mesmo em viagem sem mapa de assentos, precisamos preservar capacidade durante checkout.

Então também podemos ter:

```text
reservation_hold
```

ou utilizar a própria reserva temporária como ocupação.

Exemplo:

```text
2 passageiros em checkout
↓
2 vagas temporariamente comprometidas
```

Se expirar:

```text
reservation = EXPIRED
```

e as vagas retornam.

---

# E.7.5 Pagamento iniciado não congela vaga para sempre

Exemplo:

```text
Cliente gerou PIX
```

mas nunca pagou.

Isso não pode bloquear uma vaga eternamente.

Teremos:

```text
payment_expires_at
```

e:

```text
reservation_hold_expires_at
```

A política da reserva define quanto tempo aquela vaga pode permanecer protegida.

---

# E.7.6 Pagamento confirmado no último instante

Precisamos tratar concorrência corretamente.

Exemplo:

```text
14:14:59
Mercado Pago confirma

14:15:00
job de expiração executa
```

O backend deve trabalhar transacionalmente.

Se o pagamento já estiver confirmado, o job não expira a reserva.

Regra:

```text
PAYMENT CONFIRMED
tem precedência sobre
EXPIRATION JOB
```

quando a confirmação válida ocorreu dentro das condições aplicáveis.

---

# E.7.7 Reserva sem entrada

Job procura:

```text
WAITING_ENTRY
+
hold vencido
+
entrada não paga
```

e transforma:

```text
reservation = EXPIRED
```

Liberando:

```text
assentos
vagas
holds
```

---

# E.7.8 Expiração não é cancelamento

Importante:

```text
EXPIRED
```

significa:

> checkout/reserva temporária não concluída.

Já:

```text
CANCELLED
```

significa:

> reserva existente foi cancelada.

Não misturaremos os dois nos relatórios.

---

# E.7.9 Parcelas próximas do vencimento

Job diário identifica:

```text
charge.status = PENDING
```

com vencimento próximo.

Exemplo configurável:

```text
D-3
D-1
```

gera:

```text
PAYMENT_REMINDER
```

para o Notification Service.

---

# E.7.10 Parcela vencida

Quando:

```text
due_date < hoje
```

e ainda houver saldo:

```text
charge.status = OVERDUE
```

Automaticamente.

A reserva pode continuar:

```text
CONFIRMED
```

e ter:

```text
financial_status = OVERDUE
```

São estados independentes.

---

# E.7.11 Cadência de cobrança

Nada de bombardear o cliente.

A agência poderá definir algo como:

```text
Antes do vencimento:
3 dias
1 dia

Depois:
1 dia
3 dias
7 dias
```

O sistema registra cada envio para não repetir indevidamente.

---

# E.7.12 Data limite da viagem

Temos:

```text
payment_cutoff_date
```

Por exemplo:

```text
7 dias antes da saída
```

Job verifica reservas com saldo aberto nessa data.

Pode gerar:

```text
PAYMENT_CUTOFF_REACHED
```

e alerta para agência.

---

# E.7.13 Não cancelar automaticamente por padrão

Eu **não cancelaria automaticamente uma reserva confirmada apenas porque chegou a data limite e ainda existe saldo**.

O sistema deve:

```text
marcar atraso
alertar
bloquear determinadas ações se necessário
```

e permitir tratamento pela agência.

Caso futuramente uma agência queira cancelamento automático, isso pode ser configuração explícita.

É mais seguro para o MVP.

---

# E.7.14 Exceção de prazo

Se existe:

```text
PAYMENT_DEADLINE_EXCEPTION
```

aprovada até determinada data:

```text
job respeita a exceção
```

Não gera cobrança errada.

---

# E.7.15 Contrato não assinado

Depois de:

```text
signature_document = SENT
```

podemos executar lembretes.

Exemplo:

```text
24h depois
48h depois
```

se continuar:

```text
SENT / VIEWED
```

e não:

```text
SIGNED
```

---

# E.7.16 Viagem próxima com contrato pendente

Por exemplo:

```text
faltam 3 dias
contract_signature_required = true
```

e existem passageiros/reservas com contrato pendente.

O Admin recebe:

```text
⚠ 7 contratos ainda não assinados
```

Não necessariamente cancelamos nada automaticamente.

---

# E.7.17 Fechamento automático das vendas

Viagem possui:

```text
sales_end_at
```

Quando chega o horário:

```text
SALES_OPEN
↓
SALES_CLOSED
```

automaticamente.

Publicação pode continuar visível como:

```text
Vendas encerradas
```

em vez de simplesmente desaparecer.

---

# E.7.18 Abertura automática de vendas

Também podemos suportar:

```text
sales_start_at
```

Então:

```text
DRAFT / READY
↓
SALES_OPEN
```

na data programada.

Eu exigiria que a viagem já tivesse passado na validação de publicação.

Caso contrário:

```text
não abre
+
gera alerta
```

---

# E.7.19 Não publicar Marketplace automaticamente sem autorização

Mesmo que vendas sejam abertas:

```text
Marketplace publication
```

não nasce automaticamente.

A agência precisa ter:

```text
termo Marketplace aceito
+
publicação habilitada
```

Esse consentimento comercial continua separado.

---

# E.7.20 Quantidade mínima de passageiros

Se a viagem tiver:

```text
minimum_passengers = 25
decision_date = 01/10
```

o sistema pode alertar:

```text
7 dias antes
3 dias antes
no dia
```

com:

```text
18 / 25 confirmados
```

Mas não cancela a viagem sozinho.

A decisão continua humana.

---

# E.7.21 Lembretes de viagem

Antes da saída:

```text
TRIP_REMINDER
```

Exemplo:

```text
48h
24h
```

configurável.

Mensagem pode trazer:

```text
data
embarque
horário
assento
orientações
```

---

# E.7.22 Lembrete por ponto de embarque

Como os horários podem variar:

```text
Ribeirão Preto 05:30
Cravinhos      06:00
```

cada passageiro recebe o horário correspondente ao seu próprio ponto.

Não um horário genérico da viagem.

---

# E.7.23 Alteração operacional

Se o horário mudar:

```text
05:30
↓
06:00
```

não esperamos o job diário.

A alteração gera imediatamente:

```text
BOARDING_UPDATED
```

via `outbox_events`.

Ou seja:

```text
evento imediato
≠
job agendado
```

---

# E.7.24 Dia da viagem

Podemos gerar alerta interno:

```text
Hoje existem 3 viagens em operação
```

e preparar o painel operacional.

Mas a mudança para:

```text
BOARDING
```

eu prefiro que seja iniciada por usuário autorizado.

Não automaticamente só porque bateu o relógio.

---

# E.7.25 Por quê?

Porque uma viagem pode:

```text
atrasar
mudar horário
ter operação especial
```

Então:

```text
[ INICIAR EMBARQUE ]
```

continua sendo uma ação humana.

---

# E.7.26 Operação não finaliza sozinha

Mesma regra.

Não queremos:

```text
23:59
↓
viagem encerrada automaticamente
```

😅

Quem tiver:

```text
operations.finish_trip
```

encerra.

---

# E.7.27 Viagem concluída e financeiro pendente

Depois de:

```text
AWAITING_FINANCIAL_CLOSE
```

podemos enviar alertas internos.

Exemplo:

```text
1 dia depois
3 dias depois
7 dias depois
```

até o fechamento.

Mas nunca fechar automaticamente.

---

# E.7.28 Aprovações pendentes

`approval_requests` podem possuir:

```text
expires_at
```

Exemplo:

```text
Desconto solicitado durante checkout
```

Se não for aprovado em tempo:

```text
PENDING
↓
EXPIRED
```

e o sistema volta para a condição normal.

---

# E.7.29 Aprovação vinculada a hold

Isso é particularmente importante.

Exemplo:

```text
cliente quer desconto
assentos 12 e 13 em hold
```

Não podemos manter os assentos presos por três dias esperando gerente.

Podemos estabelecer:

```text
approval expires_at
≤
reservation hold
```

ou liberar a vaga e permitir recriação depois.

---

# E.7.30 Webhooks com falha

Jobs de reconciliação verificam:

```text
payment local = PENDING
```

há tempo demais.

Então consultam:

```text
Mercado Pago
InfinitePay
```

para confirmar o estado.

Isso cobre webhooks perdidos.

---

# E.7.31 Reconciliação de ZapSign

Mesmo princípio.

Documento local:

```text
SENT
```

por período anormal.

Podemos consultar provider quando necessário.

Webhook continua sendo o caminho principal.

---

# E.7.32 Saúde das integrações

Job periódico verifica:

```text
Mercado Pago
InfinitePay
WhatsApp
ZapSign
E-mail
```

e atualiza:

```text
integration_health
```

Exemplo:

```text
HEALTHY
DEGRADED
ERROR
```

---

# E.7.33 Não testar integração a cada segundo

Esses checks devem ter frequência razoável.

Exemplo:

```text
a cada 15 minutos
ou
hora
```

dependendo da integração.

Não queremos transformar monitoramento em gerador de custo.

---

# E.7.34 Marketplace

Algumas rotinas Marketplace podem ser automáticas:

```text
reconciliação de vendas
cálculo de saldo
checagem de pagamento
```

Mas:

```text
REPASSE
```

continua uma ação administrativa.

Não criaremos transferência automática no MVP.

---

# E.7.35 Afiliados

Comissão projetada pode ser atualizada quando:

```text
reserva confirma
passageiro cancela
preço muda por ajuste autorizado
```

Mas:

```text
READY_TO_PAY
```

somente após fechamento financeiro.

---

# E.7.36 Limpeza de arquivos temporários

`CleanupJobs` podem remover:

```text
uploads abandonados
arquivos temporários
previews antigos
```

depois de um período.

Nunca:

```text
contratos assinados
comprovantes necessários
documentos ligados a histórico comercial
```

---

# E.7.37 Limpeza de holds

Holds expirados podem continuar como registro histórico por certo período, mas deixam de contar na disponibilidade imediatamente.

Depois podem ser arquivados/limpos conforme retenção.

---

# E.7.38 Logs técnicos

Também podem ter política automática de retenção.

Exemplo conceitual:

```text
logs operacionais comuns
→ retenção menor

audit logs críticos
→ retenção maior
```

Os períodos definitivos serão definidos depois conforme necessidade jurídica e operacional.

---

# E.7.39 Notificações não entregues

Job pode tentar novamente:

```text
QUEUED
↓
FAILED
↓
RETRY
```

com backoff.

Depois de várias falhas:

```text
FAILED_FINAL
```

e alerta quando relevante.

---

# E.7.40 Outbox

Essa peça é fundamental.

Imagine:

```text
Pagamento confirmado
```

O banco salva:

```text
payment = CONFIRMED
reservation = CONFIRMED
outbox_event = RESERVATION_CONFIRMED
```

na mesma transação.

Depois um worker processa:

```text
contrato
notificação
comissão
timeline
```

Se o servidor cair depois do commit:

```text
evento continua na outbox
```

e será processado mais tarde.

Isso evita “reserva confirmada mas sistema esqueceu de mandar o resto”.

---

# E.7.41 Idempotência da outbox

Cada consumidor precisa tolerar processamento repetido.

Exemplo:

```text
RESERVATION_CONFIRMED
```

executado duas vezes não pode criar:

```text
2 contratos
4 cobranças
3 comissões
```

Cada consequência terá chave de idempotência.

---

# E.7.42 Scheduled jobs

Tabela:

```text
scheduled_job_runs
--------------------------------
id

job_type
agency_id nullable

scheduled_for
started_at
finished_at

status

processed_count
failed_count

error_summary nullable
```

Status:

```text
SCHEDULED
RUNNING
COMPLETED
PARTIAL
FAILED
```

---

# E.7.43 Timezone

Internamente:

```text
UTC
```

Mas regras comerciais usam:

```text
agency_settings.timezone
```

Exemplo:

```text
America/Sao_Paulo
```

Então:

```text
vence dia 20
```

significa dia 20 no horário da agência, não em UTC puro.

Isso evita aqueles deliciosos bugs de cobrança às 21h do dia anterior. 🕰️

---

# E.7.44 Mudança de timezone

O timezone será configuração sensível.

Datas históricas permanecem armazenadas de forma absoluta.

Alterar timezone muda principalmente a forma de interpretar/exibir regras futuras, não reescreve timestamps históricos.

---

# E.7.45 Dashboard de jobs

Super Admin técnico pode enxergar:

```text
Jobs executados
Jobs com falha
Fila da outbox
Webhooks com erro
Integrações degradadas
```

Sem acessar dados pessoais das agências.

---

# E.7.46 Agência vê apenas o necessário

Admin da Dri pode enxergar:

```text
12 cobranças vencidas
3 contratos pendentes
1 integração com erro
```

mas não precisa ver detalhes técnicos de workers internos.

---

# E.7.47 Reprocessamento

Alguns erros podem ter:

```text
[ REPROCESSAR ]
```

Por exemplo:

```text
webhook
notificação
assinatura
```

Mas reprocessamento deve continuar idempotente.

---

# E.7.48 Jobs críticos versus informativos

Vamos distinguir:

```text
CRÍTICO
expirar hold
atualizar overdue
reconciliar pagamento

INFORMATIVO
enviar lembrete
gerar alerta
avisar sobre fechamento pendente
```

Se lembrete falhar:

```text
reserva continua válida
```

Se expiração falhar:

```text
precisa retry prioritário
```

---
