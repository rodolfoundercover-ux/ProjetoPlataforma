# Regras de negócio

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: E.1–E.5, F.6; prevalência G.1. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Invariantes de leitura obrigatória

- Reserva usa somente DRAFT, WAITING_ENTRY, CONFIRMED, CANCELLED, EXPIRED, COMPLETED. HOLD pode existir no ciclo individual de passageiro descrito em F.6.9, mas nunca é status da reserva; a proteção de capacidade reside nas entidades de hold.
- Vaga pertence ao passageiro que ocupa assento. Capacidade comprometida e holds válidos não podem se sobrepor na contagem.
- Pagamento confirmado não ressuscita reserva expirada/cancelada. A confirmação exige elegibilidade e disponibilidade transacional, além da entrada quitada.
- Marketplace usa somente Mercado Pago da plataforma. A compra gera uma única reserva na organizadora; o repasse pode ser antecipado ou parcial e não interfere na confirmação.
- SUPER_ADMIN não recebe acesso a PII, contratos de viagem ou financeiro privado, inclusive via exportação, Storage, joins, logs e suporte.
- Cancelamento pela agência tem penalidade zero e escolha registrada entre reembolso do valor elegível pago e crédito na própria agência.
- Origem comercial e canal são independentes. Políticas, preços, taxas e atribuição viram snapshots.
- Taxa financeira do cliente não é receita turística. Taxa Marketplace é custo comercial separado. Receita vendida, recebimento e saldo não são sinônimos.
- Viagem, publicação, reserva, financeiro, check-in e operação têm máquinas diferentes.
- Valores do fechamento e contratos assinados não são sobrescritos; correção preserva versões.

## Quitação e cálculo monetário

Quitação até sete dias antes da saída; prazo excepcional depende de permissão/aprovação e afeta apenas a reserva autorizada. Entrada exigida deve ser paga para confirmar. Parcelas são geradas pelo tempo restante até o corte; compras após o corte não ganham prazo impossível nem liberação automática (registrar decisão operacional aplicável).

Fee bearer canônico: CLIENT, AGENCY, SHARED (G.1.7). CLIENT_PAYS e AGENCY_PAYS são aliases históricos, não novos enums. Viagem sobrepõe padrão da agência; Marketplace respeita essa política, usando as taxas do seu Mercado Pago. Snapshot registra os dois componentes da taxa.

Valores em Decimal e numeric(14,2), com estratégia única de arredondamento. Parcelas, rateios, comissões e reembolsos conservam os totais; decidir e testar regra de resíduos antes de liberar cálculos.

Receita comercial líquida começa em preço de tabela menos descontos, OU diretamente em preço vendido. Nunca deduzir desconto novamente quando a base já for sale_price. Cancelamento, retenção, crédito e reembolso devem produzir uma reconciliação única, sem subtrair duas vezes o mesmo ajuste. Resultado não é caixa. Exemplos numéricos abaixo ilustram políticas, não valores universais.

## Máquinas e transições

## F.6.1 Princípio geral

Não trataremos `status` como um campo que qualquer tela pode editar livremente.

O padrão será:

```text
AÇÃO
↓
validação da transição
↓
regra de negócio
↓
transação
↓
novo estado
↓
audit log / outbox
```

Então não teremos interfaces fazendo simplesmente:

```text
UPDATE reservations
SET status = 'CONFIRMED'
```

As mudanças críticas acontecerão através dos serviços/funções de domínio.

## F.6.2 Estado da viagem

Máquina oficial:

```text
DRAFT
  │
  ├── open_sales()
  ↓
SALES_OPEN
  │
  ├── close_sales()
  ↓
SALES_CLOSED
  │
  ├── start_boarding()
  ↓
BOARDING
  │
  ├── start_trip()
  ↓
IN_PROGRESS
  │
  ├── finish_operation()
  ↓
AWAITING_FINANCIAL_CLOSE
  │
  ├── close_financial()
  ↓
FINISHED
```

Caminho de cancelamento:

```text
DRAFT
SALES_OPEN
SALES_CLOSED
BOARDING

      ↓ cancel_trip()

CANCELLED
```

Depois de `IN_PROGRESS`, cancelamento deixa de ser uma simples mudança comercial. A partir dali tratamos ocorrência/interrupção operacional, porque a viagem efetivamente começou.

`ARCHIVED` não precisa ser um estado do ciclo operacional. Pode ser:

```text
archived_at
```

para retirar viagens antigas das telas padrão sem alterar seu status histórico.

## F.6.3 Viagem lotada

`SOLD_OUT` não será status persistido.

Será derivado:

```text
available_capacity = 0
→ SOLD_OUT = true
```

Se um passageiro cancelar:

```text
available_capacity > 0
→ SOLD_OUT = false
```

Isso evita uma viagem ficar presa em "lotada" depois que uma vaga reaparece.

## F.6.4 Estado da publicação

Publicação é independente da viagem:

```text
DRAFT
  ↓
PUBLISHED
  ↓
UNPUBLISHED
  ↓
ARCHIVED
```

Para Marketplace também:

```text
PUBLISHED
↓
SUSPENDED
```

ou:

```text
PUBLISHED
↓
REMOVED
```

Regras:

```text
REMOVED/SUSPENDED
≠
TRIP CANCELLED

UNPUBLISHED
≠
RESERVATIONS CANCELLED
```

A publicação só controla exposição comercial.

## F.6.5 Estado da reserva

Máquina principal:

```text
DRAFT
  ↓
WAITING_ENTRY
  ↓
CONFIRMED
  ↓
COMPLETED
```

Caminhos alternativos:

```text
DRAFT
WAITING_ENTRY
    ↓
EXPIRED
```

e:

```text
WAITING_ENTRY
CONFIRMED
    ↓
CANCELLED
```

`EXPIRED` é reserva/checkout que não se concretizou.

`CANCELLED` é uma reserva comercial efetivamente cancelada.

Essa diferença será preservada em relatórios.

## F.6.6 Confirmação automática da reserva

A regra oficial:

```text
entrada exigida quitada
+
pagamento válido
+
reserva ainda elegível
=
CONFIRMED
```

No Marketplace:

```text
Mercado Pago CONFIRMED
↓
entrada atendida
↓
reservation = CONFIRMED
```

Mesmo quando:

```text
marketplace_payout = NOT_PAID
```

Esses estados nunca serão acoplados.

## F.6.7 Webhook atrasado

Cenário:

```text
Reserva WAITING_ENTRY
↓
hold expira
↓
reservation = EXPIRED
↓
webhook chega 20 minutos depois
```

O webhook **não poderá ressuscitar automaticamente** a reserva.

O sistema deverá reconciliar o pagamento e criar situação excepcional para tratamento, porque a vaga pode já ter sido vendida novamente.

Isso é importantíssimo.

Teremos algo conceitualmente como:

```text
PAYMENT_CONFIRMED_AFTER_EXPIRATION
```

para tratamento seguro.

Nunca:

```text
EXPIRED → CONFIRMED
```

automaticamente.

## F.6.8 Estado financeiro da reserva

Separado do estado operacional:

```text
UNPAID
PARTIALLY_PAID
PAID
OVERDUE
REFUNDED
PARTIALLY_REFUNDED
```

Exemplo perfeitamente válido:

```text
reservation.status = CONFIRMED
financial_status = PARTIALLY_PAID
```

porque a entrada confirmou a vaga, mas existem parcelas futuras.

Também:

```text
reservation.status = CONFIRMED
financial_status = OVERDUE
```

é possível.

## F.6.9 Passageiro da reserva

Estados:

```text
HOLD
RESERVED
CONFIRMED
CANCELLED
TRANSFERRED
NO_SHOW
TRAVELED
```

Transição típica:

```text
HOLD
↓
CONFIRMED
↓
TRAVELED
```

ou:

```text
CONFIRMED
↓
CANCELLED
```

ou:

```text
CONFIRMED
↓
TRANSFERRED
```

quando substituído.

O novo passageiro recebe seu próprio registro.

## F.6.10 Check-in operacional

Isso é diferente do status comercial do passageiro.

Teremos:

```text
WAITING
BOARDED
ABSENT
NO_SHOW
CANCELLED
```

Assim podemos ter:

```text
reservation_passenger.status = CONFIRMED
checkin.status = WAITING
```

antes do embarque.

Depois:

```text
reservation_passenger.status = TRAVELED
checkin.status = BOARDED
```

ao final da operação.

## F.6.11 ABSENT não é NO_SHOW

Fluxo:

```text
WAITING
↓
ABSENT
```

enquanto a equipe procura o passageiro.

Somente após decisão operacional:

```text
ABSENT
↓
NO_SHOW
```

Nunca automaticamente só porque passou um horário.

## F.6.12 Cobranças

Estado:

```text
PENDING
↓
PARTIALLY_PAID
↓
PAID
```

Alternativas:

```text
PENDING
↓
OVERDUE
```

ou:

```text
PENDING / OVERDUE
↓
CANCELLED
```

Reembolso não precisa transformar a cobrança em uma entidade irreconhecível. O histórico do pagamento e os ajustes ficam separados.

## F.6.13 Pagamentos

Estado interno normalizado:

```text
PENDING
CONFIRMED
REJECTED
CANCELLED
REFUNDED
REVERSED
```

Provider pode ter vinte estados diferentes.

O adapter converte para os nossos estados.

Exemplo:

```text
MercadoPagoProvider
provider status X
↓
PaymentStatus.CONFIRMED
```

Assim reservas não dependem de strings específicas do Mercado Pago.

## F.6.14 Pagamento confirmado é terminal?

Não completamente.

Pode posteriormente existir:

```text
CONFIRMED
↓
REFUNDED
```

ou:

```text
CONFIRMED
↓
REVERSED
```

Mas isso acontece através de ajustes/reembolso formal, nunca editando arbitrariamente a transação.

## F.6.15 Reembolso

Estado:

```text
REQUESTED
↓
APPROVED
↓
PROCESSING
↓
COMPLETED
```

Caminhos:

```text
REQUESTED → REJECTED
PROCESSING → FAILED
REQUESTED / APPROVED → CANCELLED
```

Se falhar:

```text
FAILED
```

pode ser reprocessado conforme provider/processo.

## F.6.16 Crédito do cliente

O ledger não precisa de status mutável complexo.

Cada transação é um fato:

```text
CREDIT
DEBIT
REVERSAL
ADJUSTMENT
```

O saldo é derivado.

Isso é muito mais confiável do que:

```text
wallet.balance = ...
```

sendo atualizado em vários lugares.

## F.6.17 Contrato

Estado:

```text
DRAFT
↓
GENERATED
↓
READY_TO_SEND
↓
SENT
↓
SIGNED
```

Alternativas:

```text
SENT → REFUSED
SENT → CANCELLED
qualquer etapa técnica → ERROR
```

Depois de `SIGNED`:

```text
IMMUTABLE
```

Se precisar alterar:

```text
novo documento
nova versão
nova assinatura
```

## F.6.18 Versão de template

Estados:

```text
DRAFT
↓
PUBLISHED
↓
RETIRED
```

`PUBLISHED` é imutável.

Para editar:

```text
v4 PUBLISHED
↓
duplicar
↓
v5 DRAFT
↓
editar
↓
PUBLISHED
```

Reservas antigas continuam vinculadas à v4.

## F.6.19 Aprovação

```text
PENDING
↓
APPROVED
```

ou:

```text
PENDING
↓
REJECTED
```

Também:

```text
PENDING
↓
EXPIRED
```

ou:

```text
PENDING
↓
CANCELLED
```

Depois de `APPROVED`, a aprovação não é simplesmente editada para `REJECTED`.

Se houve erro, deve existir reversão/novo evento apropriado.

## F.6.20 Operação da viagem

Máquina própria:

```text
NOT_STARTED
↓
OPEN
↓
BOARDING
↓
IN_PROGRESS
↓
RETURNING
↓
COMPLETED
```

`RETURNING` pode ser opcional dependendo do tipo de excursão.

Também:

```text
NOT_STARTED / OPEN / BOARDING
→ CANCELLED
```

quando aplicável.

## F.6.21 Pontos de embarque

```text
PENDING
↓
OPEN
↓
CLOSED
```

Não pode voltar livremente de `CLOSED` para `OPEN`.

Se for necessário reabrir:

```text
reopen_boarding_point()
```

com permissão e audit log.

## F.6.22 Fechamento financeiro

Máquina:

```text
DRAFT
↓
CALCULATED
↓
CLOSED
```

Se precisar corrigir:

```text
CLOSED
↓
REOPENED
```

mas a versão anterior permanece registrada.

Novo fechamento:

```text
version 1 = SUPERSEDED
version 2 = DRAFT/CALCULATED/CLOSED
```

Não editamos version 1.

## F.6.23 Settlement

Para afiliado/parceiro:

```text
PROJECTED
↓
WAITING_CLOSE
↓
READY_TO_PAY
↓
PAID
```

Podemos ter:

```text
CANCELLED
ADJUSTED
```

conforme mudança financeira.

Marketplace payout não segue `WAITING_CLOSE`, porque já definimos que pode acontecer antes do fechamento.

## F.6.24 Repasse Marketplace

Estado:

```text
DRAFT
↓
APPROVED
↓
PROCESSING
↓
PAID
```

Ou:

```text
PROCESSING → FAILED
DRAFT → CANCELLED
APPROVED → CANCELLED
```

Tipo:

```text
ADVANCE
PARTIAL
FINAL
ADJUSTMENT
```

Não existe:

```text
reservation CONFIRMED
dependendo de payout PAID
```

São máquinas totalmente independentes.

## F.6.25 Licença da agência

Estado:

```text
TRIAL
↓
ACTIVE
↓
PAST_DUE
↓
SUSPENDED
↓
CANCELLED
```

Mas algumas transições podem pular etapas.

Por exemplo:

```text
TRIAL → CANCELLED
ACTIVE → CANCELLED
```

Suspender licença não apaga nada.

## F.6.26 Agência suspensa

Se a licença virar:

```text
SUSPENDED
```

a agência não deve perder seus dados.

Painel pode entrar em modo restrito.

Site público pode seguir regra comercial que definiremos no plano, mas nenhuma informação é destruída.

## F.6.27 Convite de usuário

```text
PENDING
↓
ACCEPTED
```

ou:

```text
PENDING
↓
EXPIRED
```

ou:

```text
PENDING
↓
REVOKED
```

Depois de `REVOKED`, token deixa de funcionar.

## F.6.28 Integrações

Estado normalizado:

```text
DISCONNECTED
CONNECTING
CONNECTED
DEGRADED
ERROR
DISABLED
```

Isso vale para:

```text
Mercado Pago
InfinitePay
ZapSign
WhatsApp
E-mail
```

Cada provider pode ter detalhes próprios em `integration_health`.

## F.6.29 Domínio

```text
PENDING
↓
VERIFYING
↓
VERIFIED
```

ou:

```text
VERIFYING → ERROR
VERIFIED → DISABLED
```

SSL:

```text
PENDING
ISSUING
ACTIVE
ERROR
```

Domínio público só fica ativo quando a combinação requerida estiver válida.

## F.6.30 Publicação deletada

Como já definimos:

```text
DRAFT sem dependências
→ hard delete permitido
```

Mas:

```text
PUBLISHED com vendas
→ REMOVED / ARCHIVED
```

Nunca hard delete.

## F.6.31 Funções de transição

No código, prefiro operações nomeadas:

```text
confirmReservation()
expireReservation()

openTripSales()
closeTripSales()

startBoarding()
finishTripOperation()

cancelTrip()

approveRefund()
completeRefund()

publishContractVersion()

closeFinancialPeriod()
reopenFinancialPeriod()
```

em vez de:

```text
setStatus("...")
```

Isso torna as regras muito mais explícitas.

## F.6.32 Validação central

Cada transição deve perguntar:

```text
estado atual permite?
usuário tem permissão?
entidade pertence à agência?
pré-condições foram atendidas?
existem dependências bloqueantes?
```

Somente então muda.

## F.6.33 Audit log automático

Transições importantes geram eventos como:

```text
RESERVATION_CONFIRMED
RESERVATION_EXPIRED
TRIP_SALES_OPENED
TRIP_CANCELLED
PAYMENT_CONFIRMED
REFUND_COMPLETED
FINANCIAL_CLOSE_CLOSED
```

Não dependeremos de cada componente lembrar de registrar.

## F.6.34 Outbox

Quando a transição tiver consequências:

```text
reservation CONFIRMED
```

a mesma transação gera:

```text
outbox_event
```

Depois:

```text
contrato
notificação
comissão
timeline
```

são processados.

## F.6.35 Transições proibidas

Vou colocar uma seção explícita no `BUSINESS_RULES.md`.

Exemplos:

```text
FINISHED → SALES_OPEN          

CANCELLED → CONFIRMED          

EXPIRED → CONFIRMED automático 

SIGNED → DRAFT                 

PAID charge → PENDING          

CLOSED financial version
→ editar valores diretamente   

Marketplace payout unpaid
→ desconfirmar reserva          
```

Isso será excelente para os testes automatizados.

## Jornada da reserva

## E.1.1 Entrada na jornada

Uma reserva pode nascer por diferentes canais:

```text
WEBSITE
ADMIN_PANEL
WHATSAPP_AI
MARKETPLACE
```

E ter diferentes origens comerciais:

```text
DIRECT
AFFILIATE
PARTNER_AGENCY
MARKETPLACE
```

Esses dois conceitos ficam separados.

Exemplo:

```text
commercial_source = AFFILIATE
sales_channel = WHATSAPP_AI
```

## E.1.2 Seleção da viagem

O cliente escolhe uma viagem que precisa estar:

```text
SALES_OPEN
```

O sistema valida:

```text
data de venda
capacidade
regras da viagem
categorias disponíveis
embarques ativos
```

Viagem encerrada, cancelada ou fora da janela de vendas não aceita nova reserva.

## E.1.3 Passageiros

A reserva pode ter:

```text
1 comprador
N passageiros
```

O comprador não precisa viajar.

Cada passageiro terá seu próprio:

```text
perfil
categoria
preço
embarque
assento
status
```

## E.1.4 Categoria

A categoria é calculada pela idade do passageiro **na data da viagem**.

Exemplo:

```text
Adulto
Criança
Bebê
```

Mas essas categorias continuam configuráveis pela agência.

## E.1.5 Validação de vagas

Antes de seguir:

```text
available_capacity
```

é calculada em tempo real.

Não usamos uma coluna manual de “vagas disponíveis”.

O sistema considera:

```text
capacidade do veículo
passageiros confirmados
reservas que ocupam vaga
seat holds ativos
```

## E.1.6 Hold temporário

O checkout cria holds de capacidade/assento com prazo configurável. A reserva usa DRAFT/WAITING_ENTRY, nunca HOLD. O exemplo histórico de 15 minutos não fixa um prazo universal. Hold válido impede a venda concorrente; expiração libera a capacidade. Fonte de consolidação: G.1.1.

## E.1.7 Assentos

Se a viagem tiver mapa de assentos:

```text
Cliente escolhe assento
↓
seat_hold
```

Se não concluir a compra:

```text
hold expira
↓
assento volta para disponível
```

## E.1.8 Embarque

Cada passageiro escolhe:

```text
boarding_point_id
```

O sistema pode oferecer:

```text
Aplicar este embarque a todos
```

mas grava individualmente por passageiro.

## E.1.9 Preço

O preço é determinado por passageiro.

Exemplo:

```text
Adulto 1       R$ 1.350
Adulto 2       R$ 1.350
Criança        R$   900
```

Total:

```text
R$ 3.600
```

Esse valor pode sofrer:

```text
desconto autorizado
taxa de pagamento
ajuste comercial
```

mas tudo precisa ficar auditado.

## E.1.10 Desconto

Se estiver dentro do limite permitido:

```text
price >= minimum_price_without_approval
```

pode ser aplicado por quem tiver permissão.

Se ficar abaixo:

```text
approval_request
```

A reserva espera aprovação da exceção.

## E.1.11 Origem da venda

Antes de finalizar a reserva, congelamos:

```text
commercial_source
sales_channel
affiliate_id nullable
partner_agency_id nullable
campaign_id nullable
marketplace_publication_id nullable
```

Depois não se troca livremente a origem para “arrumar relatório”.

## E.1.12 Reserva criada

Antes do pagamento da entrada:

```text
reservation.status = WAITING_ENTRY
```

A reserva possui código amigável:

```text
DRI-2026-001842
```

e UUID técnico separado.

## E.1.13 Cobranças

O sistema cria as charges:

```text
ENTRY
INSTALLMENT
INSTALLMENT
...
```

conforme:

```text
valor total
entrada
data atual
payment_cutoff_date
parcelamento
```

Tudo calculado no backend.

## E.1.14 Escolha do meio de pagamento

Nos canais próprios da agência:

```text
Mercado Pago
InfinitePay
Dinheiro
```

conforme configuração.

No Marketplace:

```text
Mercado Pago
```

obrigatoriamente.

## E.1.15 Taxa financeira

Antes de apresentar o total:

```text
PaymentPricingEngine
```

decide:

```text
provider_fee
fee_bearer
client_fee
agency_fee
customer_total
```

A regra vem da viagem ou padrão da agência.

## E.1.16 Pagamento pendente

Enquanto o gateway ainda não confirmou:

```text
payment = PENDING
reservation = WAITING_ENTRY
```

Mesmo que o cliente diga:

```text
"já paguei"
```

isso não confirma a reserva.

## E.1.17 Confirmação do pagamento

Provider envia webhook ou o backend confirma pela API.

Então:

```text
payment = CONFIRMED
```

A alocação do pagamento é feita contra a cobrança correspondente.

## E.1.18 Confirmação da reserva

Quando o valor exigido da entrada estiver totalmente pago:

```text
reservation.status = CONFIRMED
```

Automaticamente.

Não depende de clique manual.

## E.1.19 Marketplace

Para venda Marketplace:

```text
Pagamento confirmado no Mercado Pago
↓
Reserva da agência = CONFIRMED
```

Imediatamente.

Mesmo que:

```text
marketplace_payout_status = NOT_PAID
```

A venda está confirmada para a agência.

## E.1.20 Conversão de holds

Na confirmação:

```text
seat_hold
↓
seat_assignment
```

e:

```text
passenger.status = CONFIRMED
```

As vagas passam a ser oficiais.

## E.1.21 Contrato

Depois da confirmação, ou conforme regra da agência:

```text
Contract Engine
```

gera o contrato usando:

```text
modelo publicado
versão
dados da reserva
dados da viagem
políticas
branding
logo
marca d'água
```

## E.1.22 Assinatura

Se ZapSign estiver ativa:

```text
PDF
↓
ZapSign
↓
SENT
```

Quando assinado:

```text
SIGNED
```

e o PDF final é armazenado no Storage privado.

## E.1.23 Comunicação

A confirmação gera:

```text
RESERVATION_CONFIRMED
```

e o Notification Service pode enviar:

```text
e-mail
WhatsApp
in-app
```

conforme configuração.

## E.1.24 Parcelas futuras

As demais cobranças permanecem:

```text
PENDING
```

com seus vencimentos.

Jobs futuros enviam lembretes.

## E.1.25 Pagamento parcial

Uma charge pode receber:

```text
R$ 100
+
R$ 150
```

para quitar:

```text
R$ 250
```

via `payment_allocations`.

Não precisamos obrigar uma cobrança a ter um único pagamento.

## E.1.26 Adicionar passageiro depois

Admin pode:

```text
Adicionar passageiro
```

se houver vaga.

O sistema:

```text
valida capacidade
calcula preço
cria nova cobrança
gera atualização contratual quando necessário
```

Nada de alterar silenciosamente o total antigo.

## E.1.27 Troca de passageiro

Fluxo:

```text
passageiro antigo
↓
passenger_replacement
↓
passageiro novo
```

Mantém histórico.

Pode gerar taxa, aprovação e termo adicional.

## E.1.28 Mudança de assento

Cria novo:

```text
seat_assignment
```

e encerra o anterior.

Histórico continua preservado.

## E.1.29 Mudança de embarque

Mesma filosofia:

```text
boarding_change
```

com histórico.

## E.1.30 Cancelamento parcial

Se uma reserva tiver três passageiros:

```text
A
B
C
```

é possível cancelar apenas:

```text
B
```

O sistema:

```text
aplica política
simula retenção
calcula reembolso/crédito
libera assento
mantém A e C confirmados
```

## E.1.31 Cancelamento total pelo cliente

Fluxo:

```text
solicitação
↓
simulação
↓
confirmação
↓
aplicação da política
↓
cancelamento
↓
reembolso/crédito quando aplicável
```

Sem botão destrutivo instantâneo.

## E.1.32 Cancelamento pela agência

Regra já definida:

```text
penalidade do cliente = 0
```

Valores pagos elegíveis:

```text
reembolso
ou
crédito da própria agência
```

Cobranças abertas são canceladas.

## E.1.33 Remarcação

Se a agência alterar a data:

```text
trip_reschedule
```

A reserva não é sobrescrita sem histórico.

Cliente responde:

```text
ACCEPTED
REQUESTED_CANCELLATION
PENDING
```

## E.1.34 Aproximação da viagem

Antes da saída:

```text
payment_cutoff_date
```

deve ter sido respeitado.

Podemos alertar reservas:

```text
OVERDUE
```

ou situações excepcionalmente aprovadas.

## E.1.35 Operação

No dia:

```text
trip_operation = OPEN
```

Passageiros entram no fluxo:

```text
WAITING
BOARDED
ABSENT
NO_SHOW
```

A reserva continua a mesma.

Não criamos registro separado de “passageiro operacional”.

## E.1.36 Final da viagem

Quando a operação termina:

```text
trip.status = AWAITING_FINANCIAL_CLOSE
```

Passageiros podem virar:

```text
TRAVELED
NO_SHOW
```

conforme operação.

## E.1.37 Fechamento financeiro

A agência informa custos finais e executa:

```text
CALCULATE
↓
CLOSE
```

O sistema congela:

```text
receita
descontos
custos
taxas financeiras
comissões
marketplace
parceiros
resultado final
```

## E.1.38 Parceiros e afiliados

Somente após o fechamento, quando aplicável:

```text
affiliate commission
partner agency result
```

tornam-se definitivos.

Marketplace é diferente: seus repasses podem ter ocorrido antes.

## E.1.39 Histórico

No fim, uma única reserva possui uma linha do tempo:

```text
criada
entrada gerada
pagamento confirmado
reserva confirmada
contrato gerado
contrato assinado
parcelas
alterações
embarque
viagem realizada
fechamento
```

Essa timeline será extremamente útil no painel.

## E.1.40 Regra central

A regra que amarra tudo:

```text
RESERVATION
é a entidade comercial central.
```

Site, WhatsApp, Marketplace e painel **não criam tipos diferentes de reserva**.

Todos usam a mesma estrutura e as mesmas regras.

---

Então o **E.1 ciclo completo da reserva fica fechado** 


## Ciclo da viagem

## E.2.1 Criação

Toda viagem nasce como:

```text
DRAFT
```

Nesse estágio, a agência pode editar livremente:

```text
nome
destino
datas
descrição
imagens
embarques
preços
veículo
custos
contrato
regras de venda
parceiros
Marketplace
```

Ainda não existe venda pública.

## E.2.2 Validação antes de abrir vendas

Antes de mudar para:

```text
SALES_OPEN
```

o backend valida se a viagem tem o mínimo necessário.

Exemplo:

```text
datas válidas
destino
pelo menos um preço
capacidade definida
ponto de embarque
política comercial
contrato/modelo aplicável
```

Se faltar algo crítico:

```text
NÃO PUBLICAR
```

e o sistema informa exatamente o que falta.

## E.2.3 Publicação é separada da viagem

Essa regra continua importante.

Temos:

```text
TRIP
```

e:

```text
PUBLICATION
```

separadamente.

Uma viagem pode estar:

```text
SALES_OPEN
```

no painel, mas ainda não publicada no site.

Ou publicada:

```text
Site Dri 
Marketplace 
```

Isso permite controle fino.

## E.2.4 Publicação no site

Quando a agência publica no próprio site:

```text
site_publication = PUBLISHED
```

A viagem passa a aparecer publicamente.

Mas apenas os dados comerciais autorizados:

```text
título
datas
destino
imagens
preços
embarques
vagas
descrição
itinerário
incluídos
não incluídos
```

Nunca:

```text
custos
margem
dados de passageiros
financeiro interno
```

## E.2.5 Marketplace

Se a agência ativar:

```text
PUBLISH_ON_MARKETPLACE
```

criamos:

```text
marketplace_publication
```

com snapshot de:

```text
taxa Marketplace
termos aceitos
regras comerciais
data de publicação
```

E lembrando:

```text
Marketplace
→ Mercado Pago obrigatório
```

## E.2.6 Capacidade

A capacidade vem do veículo ativo da viagem.

Exemplo:

```text
Ônibus
46 lugares
```

A viagem não guarda manualmente:

```text
available_seats = 12
```

A disponibilidade é derivada.

## E.2.7 Ocupação

O sistema calcula em tempo real:

```text
Capacidade       46
Confirmados      32
Holds             3
Disponíveis      11
```

Assim não existe risco de um funcionário esquecer de atualizar uma coluna de vagas.

## E.2.8 Troca de veículo

Se trocar:

```text
46 lugares
↓
50 lugares
```

sem problema.

Novo:

```text
trip_vehicle_assignment
```

é criado.

O anterior continua no histórico.

## E.2.9 Redução de capacidade

Se tentar:

```text
46 lugares
↓
30 lugares
```

mas houver:

```text
35 passageiros comprometidos
```

o sistema bloqueia.

Mensagem:

```text
Não é possível reduzir a capacidade abaixo
da quantidade de passageiros comprometidos.
```

## E.2.10 Mapa de assentos

Na troca de veículo:

```text
mapa antigo
↓
mapa novo
```

tentamos preservar automaticamente os mesmos números de assento.

Se não for possível:

```text
REASSIGNMENT_REQUIRED
```

e o Admin precisa revisar.

## E.2.11 Preços

A viagem possui preços por categoria:

```text
Adulto       R$ 1.350
Criança      R$   900
Bebê         R$   200
```

com:

```text
list_price
minimum_without_approval
occupies_seat
```

Nada de um único preço fixo na viagem.

## E.2.12 Mudança de preço

Se a viagem já tiver vendas:

```text
R$ 1.350
↓
R$ 1.450
```

novas reservas usam o novo preço.

Reservas já confirmadas continuam com:

```text
price_snapshot = 1.350
```

Não alteramos venda histórica.

## E.2.13 Custos estimados

Durante planejamento:

```text
Ônibus                R$ 8.000
Hotel                 R$ 5.000
Guia                  R$ 1.000
```

podem estar como:

```text
ESTIMATED
```

Depois:

```text
CONFIRMED
```

e finalmente:

```text
ACTUAL
```

## E.2.14 Projeção financeira

Durante vendas, podemos mostrar:

```text
Receita confirmada
Receita projetada
Custos estimados
Margem projetada
Ocupação
Ponto de equilíbrio
```

Sem esperar a viagem terminar.

## E.2.15 Ponto de equilíbrio

Isso pode ser muito útil.

Exemplo:

```text
Custos fixos:
R$ 12.000

Margem média por passageiro:
R$ 600
```

Break-even aproximado:

```text
20 passageiros
```

Então no painel:

```text
32 passageiros vendidos
 ponto de equilíbrio atingido
```

Não precisa entrar no primeiro MVP se quiser simplificar, mas a estrutura permite.

## E.2.16 Número mínimo de passageiros

A viagem pode ter:

```text
minimum_passengers = 25
```

e o painel mostra:

```text
Confirmados:
18 / 25
```

Essa informação também alimenta a cláusula contratual específica.

## E.2.17 Prazo de decisão do mínimo

Podemos guardar:

```text
minimum_passenger_decision_date
```

para a agência decidir até quando aguarda o grupo fechar.

O sistema pode alertar:

```text
 faltam 3 dias para a decisão
```

## E.2.18 Fechamento das vendas

A agência pode mudar:

```text
SALES_OPEN
↓
SALES_CLOSED
```

Nesse momento:

```text
novas reservas = bloqueadas
```

Mas as reservas existentes continuam funcionando.

Pagamento, contrato e atendimento permanecem ativos.

## E.2.19 Fechamento automático

Também pode existir:

```text
sales_end_at
```

Quando chega a data:

```text
SALES_CLOSED
```

automaticamente.

## E.2.20 Lotação

Se todas as vagas forem ocupadas:

```text
available_capacity = 0
```

não precisamos mudar necessariamente o status da viagem.

Podemos apresentar:

```text
LOTADA
```

como estado derivado.

Se alguém cancelar:

```text
available_capacity > 0
```

a viagem volta a ter vaga automaticamente.

## E.2.21 Lista de espera futura

Eu deixaria como melhoria futura:

```text
WAITLIST
```

Pessoa entra na fila e é avisada quando surgir vaga.

Não precisa entrar no MVP.

## E.2.22 Alteração de horário

Se a agência alterar um embarque:

```text
05:30
↓
06:00
```

isso gera histórico e notificação.

Não é apenas um update silencioso.

## E.2.23 Alteração de ponto de embarque

Mesma coisa:

```text
boarding_point_change
```

Passageiros afetados são identificados.

## E.2.24 Remarcação

Se alterar:

```text
10/10/2026
↓
17/10/2026
```

não sobrescrevemos simplesmente a data antiga.

Criamos:

```text
trip_reschedule
```

com:

```text
old_date
new_date
reason
created_by
created_at
```

E cada reserva recebe resposta própria.

## E.2.25 Cancelamento da viagem

Se a agência cancela:

```text
trip.status = CANCELLED
```

o sistema:

```text
bloqueia novas vendas
bloqueia publicação
gera evento de cancelamento
identifica reservas afetadas
cancela cobranças futuras
abre resolução financeira
```

## E.2.26 Resolutiva por reserva

Cada comprador escolhe:

```text
REFUND
ou
AGENCY_CREDIT
```

conforme regra que definimos.

Isso é registrado individualmente.

## E.2.27 Cancelamento não apaga viagem

Viagem cancelada permanece no histórico.

Nada de deletar:

```text
reservas
pagamentos
contratos
passageiros
```

## E.2.28 Operação de embarque

A ação autorizada de iniciar embarque aplica as transições relacionadas, mas separadas, de trips.status e trip_operations.status. O horário sozinho não inicia operação. Usar as máquinas de F.6 e G.1.22.

## E.2.29 Embarques separados

Cada ponto de embarque pode ser:

```text
PENDING
OPEN
CLOSED
```

Exemplo:

```text
Bebedouro       CLOSED
Pitangueras     CLOSED
Ribeirão Preto  OPEN
Cravinhos       PENDING
```

## E.2.30 Passageiros

Durante embarque:

```text
WAITING
BOARDED
ABSENT
NO_SHOW
```

A equipe pode filtrar:

```text
quem falta
quem já embarcou
quem está em outro ponto
```

## E.2.31 Saída

A equipe autorizada fecha os pontos e executa start_trip(), validando pendências, gravando actual_departure_at e atualizando as máquinas de viagem e operação de forma consistente. Não iniciar viagem automaticamente por horário ou apenas por fechar um ponto. Fonte: F.6 e E.7.

## E.2.32 Ocorrências

Durante a viagem:

```text
trip_occurrences
```

pode registrar:

```text
atraso
problema mecânico
mudança de rota
problema com passageiro
ocorrência médica
hotel
outro
```

com anexos privados quando necessário.

## E.2.33 Retorno

No retorno:

```text
RETURNING
```

se quisermos usar esse estado operacional.

Depois:

```text
COMPLETED
```

## E.2.34 Finalização operacional

Ao concluir:

```text
actual_return_at
```

é gravado.

E a viagem muda para:

```text
AWAITING_FINANCIAL_CLOSE
```

Essa regra é muito importante:

```text
VIAGEM TERMINOU
≠
FINANCEIRO FECHADO
```

## E.2.35 Custos reais

Agora a agência informa:

```text
Ônibus estimado       8.000
Ônibus real           8.500

Hotel estimado        5.000
Hotel real            4.900
```

Isso alimenta o resultado final.

## E.2.36 Receita final

O sistema considera:

```text
vendas
descontos
cancelamentos
reembolsos
taxas financeiras
Marketplace
afiliados
parceiros
```

## E.2.37 Fechamento

A agência executa:

```text
CALCULATE
```

revê os valores.

Depois:

```text
CLOSE
```

Geramos:

```text
trip_financial_closure
version = 1
```

## E.2.38 Resultado congelado

Depois de fechado:

```text
receita final
custos finais
margem final
resultado por passageiro
comissões
parceiros
```

viram snapshot.

Nada de números históricos mudando porque alguém editou um custo-base depois.

## E.2.39 Reabertura

Se houver erro:

```text
REOPEN
```

A versão 1 continua existindo.

Depois:

```text
version = 2
```

é criada.

Isso preserva auditoria.

## E.2.40 Viagem finalizada

Quando o financeiro estiver fechado:

```text
trip.status = FINISHED
```

A viagem passa a histórico.

Mas continua acessível nos relatórios.

## E.2.41 Duplicar viagem

A partir de uma viagem finalizada:

```text
[ DUPLICAR ]
```

podemos criar outra.

Copiamos:

```text
descrição
imagens
embarques
itinerário
preços
custos-base
contratos
configurações
```

Mas **não copiamos**:

```text
reservas
passageiros
pagamentos
assentos ocupados
check-ins
contratos assinados
```

## E.2.42 Arquivamento

Usar archived_at para retirar viagens antigas das telas padrão, mantendo o status comercial histórico. ARCHIVED não integra o enum trips.status. Fonte: F.6.2 e G.1.22.

## E.2.43 Exclusão

Hard delete apenas quando:

```text
DRAFT
sem reservas
sem pagamentos
sem contratos
sem histórico comercial
```

Qualquer viagem com histórico comercial:

```text
 DELETE
```

apenas:

```text
ARCHIVE / CANCEL
```

## E.2.44 Timeline

Cada viagem terá histórico:

```text
Criada
Publicada
Venda aberta
Primeira reserva
Mudança de preço
Troca de veículo
Venda encerrada
Embarque iniciado
Viagem iniciada
Viagem concluída
Financeiro fechado
```

Isso vai deixar o painel muito poderoso.

## Financeiro da viagem

## E.3.1 Visão financeira da viagem

Cada viagem terá uma área financeira própria com quatro grupos principais:

```text
RECEITAS
CUSTOS
INTERMEDIAÇÕES / COMISSÕES
RESULTADO
```

Durante as vendas, os números são projetados.

Depois do fechamento:

```text
resultado final
```

vira histórico imutável daquela versão.

## E.3.2 Receita comercial

A receita não deve ser simplesmente:

```text
número de passageiros × preço atual
```

Ela vem das vendas reais.

Exemplo:

```text
Passageiro A   R$ 1.350
Passageiro B   R$ 1.300
Passageiro C   R$   900
```

Receita comercial:

```text
R$ 3.550
```

Cada passageiro já carrega o snapshot do preço efetivamente vendido.

## E.3.3 Preço de tabela x preço vendido

Precisamos guardar os dois.

```text
list_price
sale_price
```

Exemplo:

```text
Preço tabela      R$ 1.350
Preço vendido     R$ 1.250
Desconto          R$   100
```

Isso nos permite calcular depois:

```text
desconto total concedido
```

e até:

```text
desconto médio por passageiro
```

## E.3.4 Receita confirmada x prevista

Durante a venda:

```text
Receita confirmada
```

é formada pelas reservas confirmadas.

Podemos também mostrar:

```text
Receita potencial
```

considerando vagas ainda disponíveis.

Exemplo:

```text
Capacidade:              46
Vendidos:                30

Receita confirmada:      R$ 40.000
Receita potencial total: R$ 60.000
```

Mas o potencial nunca entra como receita realizada.

## E.3.5 Pagamento não é igual a receita

Regra importante:

> **Receita comercial da viagem e dinheiro recebido são coisas diferentes.**

Uma reserva pode valer:

```text
R$ 1.350
```

mas até hoje ter recebido:

```text
R$ 450
```

Então teremos:

```text
Receita contratada
Recebido
A receber
```

separadamente.

## E.3.6 Recebimentos

O financeiro da viagem pode mostrar:

```text
Valor vendido          R$ 40.000
Recebido               R$ 28.000
A receber              R$ 12.000
```

E separar por provider:

```text
Mercado Pago           R$ 15.000
InfinitePay            R$  8.000
Dinheiro               R$  3.000
Marketplace            R$  2.000
```

## E.3.7 Marketplace

Venda Marketplace é receita da agência, mesmo antes do repasse.

Exemplo:

```text
Reserva confirmada      R$ 1.000
Origem                  MARKETPLACE
```

Para a Dri:

```text
Receita comercial       R$ 1.000
```

Ao mesmo tempo:

```text
Valor a receber do Marketplace
```

é controlado separadamente.

## E.3.8 Recebido do Marketplace

Se o Marketplace ainda não repassou:

```text
Venda Marketplace        R$ 1.000
Repasse recebido         R$     0
A receber Marketplace    R$   910
```

Isso **não muda a receita da viagem**.

Só muda a posição financeira de recebimento.

## E.3.9 Taxa do Marketplace

A taxa do Marketplace será um custo/intermediação separado.

Exemplo:

```text
Venda              R$ 1.000
Marketplace fee    R$    50
```

Resultado antes dos demais custos:

```text
R$ 950
```

A taxa do Marketplace nunca deve ser misturada com a taxa do cartão.

## E.3.10 Taxa do gateway

Exemplo:

```text
Mercado Pago fee   R$ 40
```

Se:

```text
fee_bearer = AGENCY
```

entra como custo financeiro da viagem.

Se:

```text
fee_bearer = CLIENT
```

essa parcela não vira custo da agência.

## E.3.11 Exemplo completo Marketplace

Venda:

```text
Preço da viagem                R$ 1.000
Taxa Mercado Pago              R$    40
Taxa Marketplace               R$    50
```

Se a agência absorve a taxa do cartão:

```text
Receita comercial              R$ 1.000
(-) Gateway                    R$    40
(-) Marketplace                R$    50
Resultado antes demais custos  R$   910
```

É justamente o valor que pode aparecer como saldo líquido previsto de repasse.

## E.3.12 Se o cliente paga a taxa do cartão

Exemplo:

```text
Preço da viagem                R$ 1.000
Taxa cobrada do cliente        R$    40

Cliente paga                   R$ 1.040
```

Financeiramente:

```text
Receita da viagem              R$ 1.000
Taxa financeira da agência     R$     0
```

Os R$ 40 não devem aumentar artificialmente a receita turística.

São um valor relacionado ao meio de pagamento.

## E.3.13 Custos fixos

Exemplos:

```text
ônibus
guia
pedágio contratado
hotel do guia
estacionamento
licenças
serviços fixos
```

Mesmo que a viagem tenha 20 ou 40 passageiros, o custo pode permanecer igual.

```text
cost_type = FIXED
```

## E.3.14 Custos por passageiro

Exemplos:

```text
hotel
ingresso
alimentação
seguro quando contratado
kit de viagem
```

```text
cost_type = PER_PASSENGER
```

Podem inclusive variar por categoria.

## E.3.15 Custos diretos por passageiro

Um passageiro pode ter custo específico.

Exemplo:

```text
Ingresso adulto     R$ 100
Ingresso criança    R$  50
```

Então:

```text
allocation_type = DIRECT_PER_PASSENGER
```

## E.3.16 Custos compartilhados

Exemplo:

```text
Ônibus
R$ 8.000
```

Pode ser alocado entre os passageiros elegíveis para calcular resultado individual.

```text
allocation_type = SHARED
```

No MVP, como já definimos, eu manteria a regra simples:

```text
custo compartilhado
÷
passageiros efetivamente participantes
```

## E.3.17 Custos sem rateio

Alguns custos não precisam ser distribuídos individualmente.

```text
allocation_type = FIXED_NO_ALLOCATION
```

Eles afetam resultado geral da viagem, mas não entram necessariamente no cálculo detalhado do passageiro.

## E.3.18 Estimado, confirmado e realizado

Cada custo pode ter:

```text
estimated_amount
confirmed_amount
actual_amount
```

Exemplo:

```text
Ônibus

Estimado      R$ 8.000
Confirmado    R$ 8.300
Real          R$ 8.500
```

Assim podemos comparar planejamento versus execução.

## E.3.19 Resultado projetado

Durante vendas:

```text
Receita confirmada
-
Custos estimados/confirmados
-
Taxas previstas
-
Comissões projetadas
=
Resultado projetado
```

Esse número muda à medida que a viagem vende.

## E.3.20 Resultado real

Depois da viagem:

```text
Receita final
-
Custos reais
-
Taxas reais
-
Reembolsos/ajustes
-
Comissões finais
-
Resultado parceiros
=
Resultado final
```

## E.3.21 Descontos

Precisamos apresentar:

```text
Valor tabela total
Valor vendido total
Descontos concedidos
```

Exemplo:

```text
Tabela            R$ 50.000
Vendido           R$ 47.000
Descontos         R$  3.000
```

Assim o Admin consegue enxergar quanto “abriu mão” comercialmente.

## E.3.22 Cancelamentos

Cancelamentos alteram o financeiro conforme a política.

Exemplo:

```text
Passageiro pagou          R$ 1.000
Retenção                  R$   200
Reembolso                 R$   800
```

O fechamento precisa refletir corretamente:

```text
Receita retida
Reembolso
```

sem simplesmente apagar a venda original.

## E.3.23 Crédito do cliente

Se o cliente recebe:

```text
R$ 800 em crédito
```

isso é diferente de dinheiro reembolsado.

A movimentação entra:

```text
customer_wallet_transactions
```

e precisamos considerar corretamente no resultado da viagem que originou o crédito.

## E.3.24 Afiliado

Se a venda veio de:

```text
AFFILIATE
```

podemos ter:

```text
Venda                   R$ 1.000
Comissão afiliado 5%    R$    50
```

Durante a viagem:

```text
PROJECTED
```

Depois do fechamento:

```text
READY_TO_PAY
```

## E.3.25 Comissão calculada por passageiro

Isso é importante.

Uma reserva pode ter:

```text
3 passageiros
```

e um deles cancelar.

Então a comissão não pode simplesmente ser:

```text
5% da reserva original
```

Devemos calcular por passageiro elegível.

Isso permite ajustes sem bagunça.

## E.3.26 Agência parceira

O modelo de agência parceira é diferente do afiliado.

Ela não ganha simplesmente:

```text
5% de comissão
```

Ela recebe o resultado econômico dos passageiros que originou, conforme regras estabelecidas.

Exemplo:

```text
Passageiros vendidos pela Agência X
Receita atribuída       R$ 5.000

Custos diretos          R$ 1.500
Custos compartilhados   R$ 1.000
Taxas financeiras       R$   200

Resultado atribuído     R$ 2.300
```

Esse valor alimenta:

```text
PARTNER_PROFIT
```

## E.3.27 Resultado por passageiro

Exemplo de reconciliação: preço de tabela 1.350,00; desconto 100,00; preço vendido 1.250,00. Hotel 300,00 + ingresso 100,00 + ônibus 200,00 + taxa da agência 40,00 + comissão 60,00 resultam em 550,00. O desconto já integra o preço vendido e não deve ser subtraído novamente. Persistir o snapshot em trip_financial_passenger_results.

## E.3.28 Não confundir lucro com caixa

Podemos mostrar dois conceitos:

```text
RESULTADO DA VIAGEM
```

e:

```text
FLUXO DE RECEBIMENTOS
```

Uma viagem pode ter lucro de:

```text
R$ 10.000
```

mas ainda ter:

```text
R$ 4.000 a receber
```

Essas métricas não podem ser misturadas.

## E.3.29 Dashboard financeiro

Eu faria algo como:

```text
Viagem: Arraial do Cabo

Receita vendida            R$ 54.000
Recebido                   R$ 49.000
A receber                  R$  5.000

Descontos                  R$  2.500

Custos                     R$ 32.000
Taxas financeiras          R$  1.200
Marketplace                R$    900
Afiliados                  R$    800
Parceiros                  R$  2.000

Resultado projetado        R$ 17.100
Margem                     31,7%
```

## E.3.30 Projeção de ocupação

Podemos ainda simular:

```text
Se vender mais 5 passageiros
```

resultado estimado pode subir.

Isso pode virar uma função futura mais avançada.

No MVP, o básico já deve mostrar o resultado com o que está confirmado.

## E.3.31 Fechamento financeiro

Depois da operação, a viagem fica:

```text
AWAITING_FINANCIAL_CLOSE
```

Admin entra em:

```text
Financeiro
→ Fechamento
```

Revisa:

```text
receitas
reembolsos
custos
taxas
comissões
parceiros
```

## E.3.32 Validações antes de fechar

Eu bloquearia o fechamento se houver inconsistências críticas.

Exemplos:

```text
custo obrigatório sem valor real
pagamento sem conciliação
cancelamento pendente
comissão sem regra definida
passageiro com status financeiro incoerente
```

Pode haver alertas não bloqueantes também.

## E.3.33 Prévia

Primeiro:

```text
[ CALCULAR FECHAMENTO ]
```

Cria:

```text
status = CALCULATED
```

Admin revisa.

Nada fica definitivo ainda.

## E.3.34 Confirmar fechamento

Depois:

```text
[ FECHAR FINANCEIRO ]
```

gera:

```text
trip_financial_closure
version = 1
status = CLOSED
```

e snapshots detalhados.

## E.3.35 Itens congelados

O fechamento registra:

```text
total_revenue
total_discounts
total_refunds
total_costs
total_payment_fees
total_marketplace_fees
total_affiliate_commissions
total_partner_result
final_result
```

além dos detalhes por passageiro.

## E.3.36 Margem

Também podemos armazenar:

```text
final_margin_percentage
```

Mas a fonte primária continua sendo:

```text
final_result / receita
```

A porcentagem pode ser recalculada.

## E.3.37 Fechamento gera settlements

Depois de fechado:

```text
affiliate commissions
partner agency result
```

podem gerar:

```text
settlements
```

com:

```text
READY_TO_PAY
```

## E.3.38 Marketplace não espera fechamento

Reforçando nossa exceção:

```text
Marketplace payout
```

pode ocorrer:

```text
antes
durante
ou depois
```

da viagem.

O fechamento apenas contabiliza os valores relacionados.

## E.3.39 Reabrir fechamento

Se descobrir erro:

```text
[ REABRIR ]
```

não editamos a versão 1.

Criamos:

```text
version 2
```

e:

```text
version 1 = SUPERSEDED
```

## E.3.40 Se já houve pagamento de comissão

Se:

```text
afiliado já recebeu
```

e o fechamento reaberto mostrar diferença:

```text
não apagamos settlement antigo
```

Criamos:

```text
ADJUSTMENT
```

positivo ou negativo.

Isso mantém trilha contábil.

## E.3.41 Permissões

Teremos algo como:

```text
trip_financial.view
trip_financial.edit_costs
trip_financial.calculate
trip_financial.close
trip_financial.reopen
```

Reabrir fechamento deve ser uma permissão mais sensível.

## E.3.42 Audit log

Eventos:

```text
TRIP_COST_CREATED
TRIP_COST_UPDATED
FINANCIAL_CLOSE_CALCULATED
FINANCIAL_CLOSE_CLOSED
FINANCIAL_CLOSE_REOPENED
SETTLEMENT_CREATED
SETTLEMENT_PAID
```

## E.3.43 Super Admin não vê

Mesmo com esse financeiro sofisticado:

```text
Super Admin
```

não verá:

```text
lucro da Dri
custos da Dri
margem da Dri
receita geral da Dri
```

Ele vê apenas o que for relativo ao próprio SaaS ou ao Marketplace.

Essa separação continua intacta.

## E.3.44 Financeiro geral da agência

Ainda continua **fora do MVP**.

Não vamos transformar agora o sistema em:

```text
contabilidade completa
contas bancárias
folha
impostos
despesas administrativas gerais
```

O MVP controla:

> **financeiro relacionado às viagens.**

O módulo `ADVANCED_FINANCE` poderá expandir isso depois.

## Afiliados, parceria e Marketplace

Afiliado é MVP. As seções de agência parceira e Marketplace são contratos da expansão Fase 2; não ativar a UI no piloto.

## E.4.1 Afiliado

Afiliado é alguém ou empresa que **indica clientes**.

Exemplo:

```text
João divulga link da Dri
↓
cliente compra
↓
João recebe comissão
```

Ele não opera a viagem.

Ele não atende o passageiro como agência responsável.

Ele não tem acesso à base de clientes.

## E.4.2 Cadastro de afiliado

Teremos:

```text
affiliates
--------------------------------
id
agency_id

name
document nullable
email
phone

status

created_at
updated_at
```

Status:

```text
ACTIVE
INACTIVE
BLOCKED
```

## E.4.3 Regra de comissão

Tabela:

```text
affiliate_commission_rules
--------------------------------
id
agency_id
affiliate_id nullable
trip_id nullable

commission_type
commission_value

valid_from
valid_until nullable

status
```

Podemos suportar:

```text
PERCENTAGE
FIXED_PER_PASSENGER
```

mesmo que no MVP usemos principalmente percentual.

## E.4.4 Hierarquia da regra

Exemplo:

```text
Regra geral da agência:
5%

Regra específica João:
7%

Regra específica Ubatuba:
10%
```

A regra mais específica válida prevalece.

Mas a regra usada na venda vira snapshot.

Se amanhã mudar de 7% para 5%, a venda antiga continua com 7%.

## E.4.5 Link de afiliado

Pode ser geral:

```text
driviagens.com.br/?ref=JOAO
```

ou específico de viagem:

```text
driviagens.com.br/viagens/ubatuba?ref=JOAO
```

A plataforma cria:

```text
affiliate_links
```

com token público seguro.

## E.4.6 Atribuição

Quando o cliente entra pelo link:

```text
affiliate attribution
```

é preservada durante a jornada.

No MVP eu manteria a regra que já definimos:

> **último link válido de parceiro antes da compra vence.**

Com janela configurável, por exemplo:

```text
30 dias
```

## E.4.7 Canal pode mudar

Cliente pode entrar pelo afiliado:

```text
commercial_source = AFFILIATE
```

e depois concluir no WhatsApp:

```text
sales_channel = WHATSAPP_AI
```

A comissão continua pertencendo ao afiliado.

## E.4.8 Comissão projetada

Quando a reserva é confirmada:

```text
affiliate_commission_item
status = PROJECTED
```

Exemplo:

```text
Passageiro:
R$ 1.000

Comissão:
5%

Projetado:
R$ 50
```

## E.4.9 Cancelamento parcial

Se aquela reserva tiver três passageiros e um cancelar:

```text
comissão daquele passageiro
```

é recalculada/cancelada conforme regra.

Por isso a comissão é por passageiro.

## E.4.10 Comissão definitiva

Depois do fechamento financeiro:

```text
PROJECTED
↓
READY_TO_PAY
```

Só então vira valor definitivo para pagamento.

## E.4.11 Pagamento do afiliado

Quando pago:

```text
settlement
beneficiary = AFFILIATE
type = COMMISSION
status = PAID
```

registrando:

```text
valor
data
comprovante
responsável
```

---

# AGÊNCIA PARCEIRA

Agora muda bastante.

## E.4.12 O que é agência parceira

Exemplo:

```text
DRI organiza a viagem
↓
Agência X ajuda a vender
```

A viagem continua pertencendo à Dri.

A Agência X não edita:

```text
veículo
custos
embarques
contrato
operação
```

da Dri.

## E.4.13 Parceria entre agências

Tabela:

```text
agency_partnerships
--------------------------------
id

organizer_agency_id
partner_agency_id

status

created_at
```

Status:

```text
PENDING
ACTIVE
SUSPENDED
ENDED
```

## E.4.14 Autorização por viagem

Mesmo que duas agências tenham parceria ativa, isso não significa que a parceira pode vender todas as viagens.

Teremos:

```text
trip_partner_agencies
```

Exemplo:

```text
Ubatuba
Agência parceira X 

Arraial
Agência parceira X 
```

## E.4.15 Link da agência parceira

A parceira recebe link próprio:

```text
partner_agency_links
```

Quando alguém compra:

```text
commercial_source = PARTNER_AGENCY
partner_agency_id = X
```

## E.4.16 Reserva continua na organizadora

Regra fundamental:

```text
Organizadora = Dri
```

Então a reserva real está:

```text
agency_id = DRI
```

Não criamos reserva duplicada na Agência X.

## E.4.17 O que a parceira vê

A agência parceira pode ver apenas o necessário para suas vendas:

```text
quantidade de passageiros atribuídos
receita atribuída
status das reservas vendidas
resultado econômico próprio
valor a receber
```

Não:

```text
todos os clientes da Dri
custos completos da Dri
outras reservas
financeiro global da viagem
```

## E.4.18 Dados pessoais

Se operacionalmente a agência parceira precisar identificar um passageiro que ela vendeu, podemos permitir apenas o mínimo necessário.

Nunca acesso geral à base da organizadora.

## E.4.19 Resultado da parceira

Aqui não usamos simples comissão fixa.

Exemplo:

```text
Passageiros originados pela parceira

Receita atribuída        R$ 10.000
Custos diretos           R$  3.000
Rateio compartilhado     R$  2.000
Taxas financeiras        R$    400
----------------------------------
Resultado parceiro       R$  4.600
```

Esse resultado só fica definitivo no fechamento.

## E.4.20 Antes do fechamento

Mostramos:

```text
RESULTADO PROJETADO
```

Depois:

```text
RESULTADO FINAL
```

## E.4.21 Settlement da agência parceira

Depois do fechamento:

```text
settlements

beneficiary = PARTNER_AGENCY
type = PARTNER_PROFIT
```

com:

```text
READY_TO_PAY
PAID
```

---

# MARKETPLACE

Agora nosso terceiro modelo.

## E.4.22 Papel do Marketplace

O Marketplace faz:

```text
descoberta
venda
pagamento Mercado Pago
criação da reserva na agência
repasse
```

E para por aí.

Não opera a viagem.

Não assume pós-venda da agência.

## E.4.23 Publicação

A agência precisa:

```text
aderir ao Marketplace
+
publicar a viagem
```

Não basta ter conta na plataforma.

## E.4.24 Publicação congelada

Quando publica:

```text
marketplace_publication
```

guarda snapshot de:

```text
taxa Marketplace
termo aceito
regra da publicação
data
```

Assim uma mudança posterior não altera vendas antigas.

## E.4.25 Compra Marketplace — expansão Fase 2

Cliente escolhe publicação autorizada, usa os serviços de reserva da organizadora e paga via Mercado Pago da plataforma. Durante a espera, reservation.status = WAITING_ENTRY e holds são entidades próprias. Confirmar somente se pagamento válido e reserva ainda elegível; evento tardio exige reconciliação.

## E.4.26 Pagamento aprovado

Assim que Mercado Pago confirma:

```text
payment = CONFIRMED
```

então:

```text
reservation = CONFIRMED
```

na Dri.

Essa regra continua absoluta.

## E.4.27 Reserva não espera repasse

Mesmo se:

```text
marketplace payout = NOT_PAID
```

a reserva aparece para a Dri como:

```text
 CONFIRMADA
```

## E.4.28 Passageiro entra na operação

Ele passa a aparecer normalmente em:

```text
passageiros
assentos
embarques
contratos
check-in
```

como qualquer outra reserva da Dri.

## E.4.29 Origem

Internamente:

```text
commercial_source = MARKETPLACE
sales_channel = MARKETPLACE
```

## E.4.30 Taxa Marketplace

Exemplo:

```text
Base da viagem     R$ 1.000
Marketplace fee    R$    50
```

Essa taxa é separada da taxa Mercado Pago.

## E.4.31 Taxa do cartão

Quem paga depende da política:

```text
CLIENT
AGENCY
SHARED
```

e não do Marketplace.

## E.4.32 Repasse

A plataforma pode realizar:

```text
ADVANCE
PARTIAL
FINAL
ADJUSTMENT
```

sem esperar o fechamento da viagem.

## E.4.33 Painel de repasses

Super Admin do Marketplace vê:

```text
Agência
Viagem
Vendas Marketplace
Valor devido
Já repassado
Saldo
```

sem precisar enxergar passageiros.

## E.4.34 Agência vê

A Dri verá algo como:

```text
Marketplace

Vendas:
R$ 12.000

Taxas Marketplace:
R$ 600

Taxas financeiras da agência:
R$ 350

Previsto a receber:
R$ 11.050

Já recebido:
R$ 8.000

Saldo:
R$ 3.050
```

## E.4.35 Pós-venda

Cliente quer cancelar:

```text
Cliente
↓
Dri
```

Não:

```text
Cliente
↓
Marketplace decide
```

A agência trata conforme contrato e política.

## E.4.36 Reembolso

Mantemos sua decisão:

> **A agência é responsável por realizar o reembolso ao cliente.**

O Marketplace não precisa manter reserva financeira obrigatória para isso.

## E.4.37 Histórico

Mesmo depois de retirada da publicação:

```text
reservas Marketplace
```

continuam intactas.

## E.4.38 Remoção da publicação

Admin da agência pode:

```text
UNPUBLISH
ARCHIVE
```

Super Admin pode:

```text
SUSPEND
REMOVE
```

por motivo registrado.

Nada disso apaga vendas realizadas.

## E.4.39 Hard delete

Somente:

```text
publicação draft
sem vendas
sem dependências
```

pode ser apagada fisicamente.

# E.4.40 Comparação final

```text
AFILIADO
→ indica
→ recebe comissão
→ não opera

AGÊNCIA PARCEIRA
→ vende em parceria
→ recebe resultado atribuído
→ não controla viagem da organizadora

MARKETPLACE
→ canal central
→ processa pagamento
→ cria reserva
→ repassa valor
→ não administra pós-venda
```

## E.4.41 Quem é dono da reserva

Em todos os casos:

```text
RESERVA PERTENCE À AGÊNCIA ORGANIZADORA
```

Esse é o eixo que mantém o sistema coerente.

## E.4.42 Quem vê o cliente

```text
Agência organizadora
→ sim

Afiliado
→ não

Agência parceira
→ somente mínimo necessário de suas vendas

Super Admin Marketplace
→ não precisa ver PII
```

## E.4.43 Quem recebe primeiro

```text
Venda direta
→ agência

Afiliado
→ agência recebe; afiliado recebe depois

Parceira
→ organizadora controla a venda e acerto

Marketplace
→ Marketplace processa; repassa à agência
```

## Pós-venda e exceções

## E.5.1 Tipos de ocorrência

Vamos separar claramente:

```text
CANCELAMENTO PELO CLIENTE
CANCELAMENTO PELA AGÊNCIA
REMARCAÇÃO DA VIAGEM
SUBSTITUIÇÃO DE PASSAGEIRO
TRANSFERÊNCIA DE RESERVA
NO_SHOW
```

Cada um tem regras e efeitos financeiros diferentes.

## E.5.2 Cancelamento pelo cliente

O cliente nunca apaga a reserva diretamente.

Ele cria:

```text
cancellation_request
```

com escopo:

```text
FULL_RESERVATION
ou
SINGLE_PASSENGER
```

Isso permite cancelar uma pessoa sem destruir a reserva inteira.

## E.5.3 Simulação antes da confirmação

Antes de executar, o sistema calcula:

```text
valor pago
valor ainda devido
retenções aplicáveis
valores não recuperáveis
reembolso estimado
crédito possível
```

e mostra uma prévia.

Nada de botão “Cancelar” que dispara uma bomba financeira sem aviso 💣.

## E.5.4 Política congelada

A simulação usa:

```text
reservation_policy_snapshot
```

daquela reserva.

Nunca usa simplesmente a política atual da agência.

Se a política mudou depois da compra, a reserva antiga continua usando a versão contratada.

## E.5.5 Cancelamento parcial

Exemplo:

```text
Reserva:
João
Maria
Pedro
```

Maria cancela.

O sistema:

```text
Maria → CANCELLED
João → CONFIRMED
Pedro → CONFIRMED
```

e recalcula apenas o que pertence a Maria.

Seu assento é liberado.

## E.5.6 Cobranças futuras

Se o cancelamento eliminar parte do saldo:

```text
charges abertas
```

são ajustadas ou canceladas de forma explícita.

Nunca deletamos cobrança antiga.

Mantemos histórico.

## E.5.7 Reembolso

Se houver valor a devolver:

```text
refund
```

é criado.

Status:

```text
REQUESTED
APPROVED
PROCESSING
COMPLETED
FAILED
CANCELLED
```

## E.5.8 Reembolso não apaga pagamento

Pagamento original:

```text
CONFIRMED
```

continua existindo.

Depois:

```text
refund = COMPLETED
```

ou:

```text
payment_adjustment = REFUND
```

Isso mantém a trilha financeira correta.

## E.5.9 Crédito da agência

Em vez de dinheiro, quando aplicável:

```text
customer_wallet_transactions
```

gera crédito.

Exemplo:

```text
+ R$ 800
Motivo: Cancelamento reserva DRI-1842
```

O saldo é derivado do ledger.

## E.5.10 Crédito pertence à agência

Crédito da Dri:

```text
não pode ser usado na Rodolfo Viagens
```

mesmo que o cliente tenha a mesma conta global.

O crédito sempre tem:

```text
agency_id
customer_id
```

## E.5.11 Uso parcial do crédito

Cliente tem:

```text
R$ 800
```

Compra viagem de:

```text
R$ 1.200
```

Pode usar:

```text
R$ 800 crédito
+
R$ 400 pagamento
```

Inclusive para entrada, se a agência permitir.

## E.5.12 Cancelamento pela agência

Aqui a regra é diferente.

Se a própria agência cancelar a viagem:

```text
penalidade do cliente = 0
```

Valores elegíveis pagos devem ser preservados integralmente como:

```text
REFUND
ou
AGENCY_CREDIT
```

conforme escolha do cliente e regras aplicáveis.

## E.5.13 Cobranças não pagas

No cancelamento da viagem pela agência:

```text
charges PENDING
```

são:

```text
CANCELLED
```

automaticamente.

O cliente não continua devendo por uma viagem cancelada.

## E.5.14 Resolução individual

Cada reserva pode escolher uma saída diferente.

Exemplo:

```text
João → REFUND
Maria → CREDIT
Pedro → REFUND
```

Se forem compradores diferentes.

A resolução fica registrada.

## E.5.15 Marketplace

Se a venda veio do Marketplace, a reserva continua sendo tratada pela agência.

Então:

```text
Cliente
↓
Agência organizadora
↓
cancelamento/reembolso
```

O Marketplace não vira árbitro.

## E.5.16 Repasse já feito

Se o Marketplace já repassou o dinheiro à agência, isso não muda a responsabilidade.

A agência continua responsável pelo reembolso ao cliente.

O histórico financeiro apenas registra que a venda veio do Marketplace.

## E.5.17 Remarcação

Se a agência altera a data da viagem:

```text
trip_reschedule
```

guarda:

```text
old_departure_date
new_departure_date
old_return_date
new_return_date
reason
```

Nada é sobrescrito sem histórico.

## E.5.18 Resposta do cliente

Cada reserva passa a ter:

```text
reservation_reschedule_response
```

Status:

```text
PENDING
ACCEPTED
REQUESTED_CANCELLATION
```

Isso deixa a operação clara.

## E.5.19 Aceitou nova data

Se:

```text
ACCEPTED
```

a reserva permanece confirmada.

Pode ser gerado:

```text
RESCHEDULE_TERM
```

para assinatura, dependendo da regra da agência.

## E.5.20 Recusou nova data

Se pedir cancelamento após remarcação:

```text
REQUESTED_CANCELLATION
```

entra no fluxo adequado.

A política aplicável deve considerar o motivo da alteração e as condições jurídicas/contratuais da reserva.

## E.5.21 Substituição de passageiro

Exemplo:

```text
João não pode ir.
Maria irá no lugar.
```

Não fazemos:

```text
UPDATE passenger_name = Maria
```

Isso apagaria história.

Criamos:

```text
passenger_replacements
```

com:

```text
old_passenger_id
new_passenger_id
reason
fee
approved_by
replaced_at
```

## E.5.22 Assento na substituição

Por padrão, o novo passageiro pode herdar o mesmo assento.

Mas ainda registramos:

```text
seat_assignment antigo encerrado
novo seat_assignment criado
```

Assim tudo fica auditável.

## E.5.23 Embarque na substituição

Também pode ser herdado ou alterado.

Se mudar:

```text
passenger_boarding_changes
```

registra.

## E.5.24 Taxa de substituição

A política pode dizer:

```text
sem taxa
taxa fixa
percentual
necessita aprovação
```

O sistema calcula.

Se houver cobrança:

```text
charge = PASSENGER_CHANGE_FEE
```

## E.5.25 Termo adicional

Quando a substituição for concluída:

```text
reservation_document
type = PASSENGER_REPLACEMENT_TERM
```

Pode ir para ZapSign.

## E.5.26 Transferência da reserva

Isso é diferente de trocar passageiro.

Aqui muda:

```text
BUYER
```

Exemplo:

```text
Rodolfo comprou
↓
transfere reserva para João
```

Pagamentos anteriores continuam ligados ao histórico do pagador original.

## E.5.27 Novo responsável

A reserva passa a ter:

```text
new_buyer_customer_id
```

mas preserva:

```text
previous_buyer_snapshot
```

ou tabela de histórico da transferência.

## E.5.28 Transferência também gera termo

```text
RESERVATION_TRANSFER_TERM
```

com os participantes e condições.

## E.5.29 No-show

No-show não é cancelamento.

Passageiro simplesmente não compareceu à operação.

Status:

```text
NO_SHOW
```

e a consequência financeira segue a política aplicável.

Não geramos automaticamente refund.

## E.5.30 Ausente x no-show

Durante embarque:

```text
ABSENT
```

é temporário.

Depois do encerramento do ponto e confirmação operacional:

```text
NO_SHOW
```

Isso evita marcar alguém errado cedo demais.

## E.5.31 Exceções

Algumas situações fogem da política padrão.

Exemplo:

```text
cliente hospitalizado
erro operacional da agência
situação extraordinária
autorização comercial
```

Então teremos:

```text
approval_requests
type = CANCELLATION_EXCEPTION
```

ou:

```text
PASSENGER_CHANGE_EXCEPTION
```

## E.5.32 Aprovação

Pedido registra:

```text
requested_by
reason
requested_value
normal_policy_result
exception_requested
```

A pessoa autorizada:

```text
APPROVE
REJECT
```

## E.5.33 Exceção sempre auditada

Se a política normal dizia:

```text
reembolso = R$ 200
```

mas Admin aprovou:

```text
R$ 600
```

guardamos os dois valores.

Isso é essencial para saber depois por que o resultado financeiro mudou.

## E.5.34 Reembolso por gateway

Para venda direta, se a integração permitir:

```text
refund
↓
PaymentProvider
↓
MercadoPagoProvider / InfinitePayProvider
```

Quando não houver suporte técnico ou quando for dinheiro:

```text
reembolso externo/manual
```

pode ser registrado.

## E.5.35 Reembolso manual

Campos:

```text
amount
method
paid_at
reference
proof_file_id
processed_by
```

Nada de apenas marcar “feito”.

## E.5.36 Crédito x reembolso

Na interface precisam ser claramente diferentes.

```text
REEMBOLSO
→ dinheiro devolvido

CRÉDITO
→ valor disponível para nova compra na mesma agência
```

Não vamos misturar os dois.

## E.5.37 Crédito expirável

A arquitetura pode suportar:

```text
expires_at
```

mas eu deixaria:

```text
NULL
```

por padrão inicialmente.

Se uma agência quiser validade, isso deve estar previsto e comunicado corretamente.

## E.5.38 Reversão de crédito

Se um crédito foi criado por engano:

```text
wallet_transaction = REVERSAL
```

Nunca apagamos a movimentação original.

## E.5.39 Efeito no assento

Cancelamento efetivo do passageiro:

```text
seat_assignment released
```

e a vaga volta imediatamente para disponibilidade.

## E.5.40 Lista de espera futura

Quando implementarmos waitlist:

```text
vaga liberada
↓
próximo cliente avisado
```

Mas isso fica Future Update.

## E.5.41 Efeito em afiliado

Cancelamento pode alterar:

```text
affiliate_commission_item
```

Por exemplo:

```text
PROJECTED
↓
CANCELLED
```

ou valor reduzido.

## E.5.42 Efeito em agência parceira

Também recalculamos o resultado atribuído aos passageiros daquele parceiro.

Antes do fechamento:

```text
projected partner result
```

muda.

Depois de fechamento reaberto, usamos adjustment.

## E.5.43 Efeito no financeiro

Cancelamento nunca apaga receita histórica.

O fechamento consegue ver:

```text
venda original
retenção
reembolso
crédito
taxas
resultado líquido
```

Isso dá rastreabilidade total.

## E.5.44 Comunicação

Cada fluxo gera eventos próprios:

```text
CANCELLATION_REQUESTED
CANCELLATION_APPROVED
REFUND_COMPLETED
CREDIT_CREATED
TRIP_RESCHEDULED
PASSENGER_REPLACED
RESERVATION_TRANSFERRED
```

e o Notification Service cuida dos canais.

## E.5.45 Contratos e termos

Os documentos associados podem ser:

```text
PASSENGER_REPLACEMENT_TERM
RESERVATION_TRANSFER_TERM
RESCHEDULE_TERM
CANCELLATION_TERM
```

quando necessários.

Todos seguem o mesmo Contract Engine + ZapSign.

## E.5.46 Permissões

Sugestão:

```text
reservations.cancel
reservations.transfer
reservations.add_passenger

payments.refund

customers.wallet.manage

approvals.cancellation_exception
approvals.passenger_change_exception
```

Ações excepcionais devem exigir permissão mais alta.

## E.5.47 Reautenticação

Eu exigiria autenticação recente para:

```text
reembolso alto
cancelamento de viagem inteira
reabertura financeira
transferência sensível
```

principalmente Admin.

## E.5.48 Audit log

Eventos importantes:

```text
CANCELLATION_REQUEST_CREATED
CANCELLATION_EXECUTED
REFUND_CREATED
REFUND_COMPLETED
CREDIT_CREATED
CREDIT_REVERSED
TRIP_RESCHEDULED
PASSENGER_REPLACED
RESERVATION_TRANSFERRED
EXCEPTION_APPROVED
```
