# Modelo de dados

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: F.5, F.6, B.1–B.9; G.1. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Convenções de implementação

Este é um modelo lógico detalhado, não uma migration pronta. Criar SQL incremental por fase. Toda tabela privada usa agency_id NOT NULL e imutável; relacionamentos privados devem impedir referências cross-tenant, inclusive em INSERT/UPDATE/RPC.

IDs técnicos são UUID; códigos comerciais são gerados transacionalmente. Dinheiro: numeric(14,2). Timestamps: timestamptz; nascimento: date. As configurações temporais seguem timezone da agência e snapshots históricos. Views derivadas não criam fontes paralelas.

| Grupo | Visibilidade |
|---|---|
| Accounts, plans, licenses, platform_admins, features | Plataforma; acesso da agência limitado ao próprio vínculo/contrato |
| Clientes, passageiros, reservas, pagamentos próprios, custos, operação e contratos de viagem | Tenant privado + proprietário cliente quando aplicável |
| Publicações e projeções do catálogo | Somente campos expressamente públicos |
| Marketplace sales/payouts | Projeção financeira mínima da plataforma, sem joins expondo PII |
| Audit, files, outbox e integrações | Escopo explicitamente classificado; NULL somente para registros da plataforma |

## Complementos necessários ao modelo lógico

- Holds de capacidade sem assento são entidades próprias (G.1.1/E.7.4). Nome físico e estratégia de lock devem ser documentados antes da migration PHASE_04; não usar contador manual de disponibilidade.
- Publicação no site é independente de trips.status. Representação física explícita em PHASE_03; marketplace_publications não substitui publicação do site.
- Cadastro de endereço do comprador, responsáveis de menores e configurações contratuais deve suportar as variáveis do V2. F.5 lista campos centrais, não elimina os atributos de B.2 e CONTRACTS.md.
- Contratos SaaS/Add-on/Marketplace são da relação plataforma–agência. Não forçar reservation_id fictício nem expor contratos de viagem para acomodá-los.
- Aprovações devem manter valores solicitados, política/limite, contexto aprovado, responsável, motivo e validade. Mudança no contexto exige revalidação.
- Segurança das views inclui permissões de coluna/projeção: RLS por linha sozinha não mascara CPF.
- Chaves de idempotência financeiras incluem provider e referência da conta/integração quando IDs externos não forem globais. Não assumir que IDs de contas distintas são únicos.
- Ledger de wallet define uma única convenção de sinal por tipo; débito concorrente não pode gastar o mesmo saldo duas vezes.
- Cada compromisso de capacidade conta uma vez. Converter hold em assento definitivo na mesma transação; não somar duas vezes passageiro e seu hold.
- Custos do vehicle assignment e trip_costs precisam de vínculo/autoridade única para evitar duplicação no fechamento.
- payment_allocations não pode exceder saldo elegível do pagamento nem duplicar recebimento em cobranças. Reembolso e reversão têm registros próprios.
- Mudanças em flags técnicas de supersessão não autorizam editar valores de snapshots encerrados.

## Dicionário e relações consolidadas

# F.5.1 Princípios do banco

O PostgreSQL será organizado com algumas regras que o Codex não poderá contornar:

```text
UUID = chave técnica

agency_id = isolamento tenant

códigos amigáveis = identificação humana

timestamptz = eventos no tempo

date = datas sem horário

numeric = dinheiro

status = histórico operacional

RLS = segurança

foreign keys = integridade

snapshots = preservação histórica
```

E, sempre que possível:

```text
(agency_id, entity_id)
```

também participa das relações para impedir referências entre agências diferentes.

# F.5.2 Núcleo da plataforma

Teremos inicialmente:

```text
accounts
agencies
licenses
plans

platform_admins

features
agency_features

agency_members
permissions
permission_profiles
permission_profile_permissions
agency_member_permissions

agency_settings
agency_branding
agency_domains
```

Relação principal:

```text
ACCOUNT
   │
   ├── LICENSE
   │      │
   │      └── AGENCY
   │
   └── LICENSE
          │
          └── AGENCY
```

Um `account` poderá possuir várias agências/licenças.

# F.5.3 Autenticação

Não criaremos nossa própria tabela de senha.

```text
auth.users
```

continua sendo a identidade de autenticação do Supabase.

Relacionamentos:

```text
auth.users
   │
   ├── platform_admins
   │
   ├── agency_members
   │
   └── agency_customers
```

Isso permite que a mesma pessoa seja, por exemplo:

```text
Admin da Agência A
+
Cliente da Agência B
```

sem duplicar identidade de login.

# F.5.4 Clientes

```text
agency_customers
----------------------------
id
agency_id
auth_user_id nullable

full_name
email
phone
document
birth_date

status

created_at
updated_at
archived_at nullable
```

Importante:

```text
UNIQUE (agency_id, auth_user_id)
```

quando `auth_user_id` existir.

A informação comercial do cliente pertence à agência, não ao perfil global.

# F.5.5 Passageiros

```text
agency_passengers
----------------------------
id
agency_id

owner_customer_id nullable
linked_auth_user_id nullable

full_name
document
birth_date
phone nullable

status
created_at
updated_at
```

Assim conseguimos representar:

```text
Cliente comprador
├── ele mesmo
├── esposa
├── filho
└── dependente
```

sem exigir login para cada passageiro.

# F.5.6 Categorias

```text
passenger_categories
----------------------------
id
agency_id

name

min_age nullable
max_age nullable

occupies_seat_default

active
sort_order
```

Exemplo:

```text
Adulto
Criança
Bebê
```

mas completamente configurável.

# F.5.7 Viagens

Tabela principal:

```text
trips
----------------------------
id
agency_id

code
title
slug

destination
category

departure_date
return_date

sales_start_at
sales_end_at

minimum_passengers nullable
minimum_passenger_decision_date nullable

status

featured
private

current_vehicle_assignment_id nullable

created_by
created_at
updated_at
archived_at nullable
```

Nunca colocaremos aqui:

```text
available_seats
```

porque será valor derivado.

# F.5.8 Conteúdo da viagem

Separado da entidade operacional:

```text
trip_content
trip_images
trip_itinerary_items
```

Isso evita transformar `trips` numa criatura de 90 colunas.

# F.5.9 Embarques

Cadastro reutilizável:

```text
agency_boarding_locations
```

e snapshot na viagem:

```text
trip_boarding_points
```

Exemplo:

```text
agency_boarding_locations

Rodoviária Ribeirão Preto
```

Ao adicionar à viagem, copiamos informações relevantes para:

```text
trip_boarding_points
```

Assim, se a agência alterar o endereço padrão daqui a seis meses, a viagem histórica não muda.

# F.5.10 Veículos

Teremos:

```text
transport_suppliers

vehicle_templates
vehicle_template_seats

trip_vehicle_assignments
trip_seats
```

Hierarquia:

```text
Vehicle Template
      ↓
Trip Vehicle Assignment
      ↓
Trip Seats
```

O mapa de assentos da viagem é um snapshot do veículo utilizado naquele momento.

# F.5.11 Histórico do veículo

```text
trip_vehicle_assignments
----------------------------
id
agency_id
trip_id

vehicle_template_id nullable
supplier_id nullable

capacity_snapshot

estimated_cost
confirmed_cost
actual_cost

started_at
ended_at nullable

reason
created_by
```

Nunca simplesmente:

```text
UPDATE trips.vehicle_id
```

apagando o anterior.

# F.5.12 Preços da viagem

```text
trip_passenger_prices
----------------------------
id
agency_id
trip_id
passenger_category_id

list_price
minimum_price_without_approval

occupies_seat
active
```

O valor vendido posteriormente vira snapshot na reserva.

# F.5.13 Custos

```text
trip_costs
----------------------------
id
agency_id
trip_id

category
description

cost_type
allocation_type

estimated_amount
confirmed_amount
actual_amount

supplier_name nullable

created_at
updated_at
```

Tipos:

```text
FIXED
PER_PASSENGER
```

Alocação:

```text
DIRECT_PER_PASSENGER
SHARED
FIXED_NO_ALLOCATION
```

# F.5.14 Reserva

Entidade central:

```text
reservations
----------------------------
id
agency_id
trip_id

code

buyer_customer_id

status
financial_status

commercial_source
sales_channel

currency

subtotal
discount_total
client_fee_total
total_amount

entry_amount

hold_expires_at nullable

confirmed_at nullable
cancelled_at nullable
expired_at nullable

created_by nullable
created_at
updated_at
```

Estados comerciais e financeiros permanecem separados.

# F.5.15 Passageiros da reserva

Essa tabela é extremamente importante:

```text
reservation_passengers
----------------------------
id
agency_id
reservation_id
trip_id

passenger_id nullable

passenger_name_snapshot
document_snapshot
birth_date_snapshot

category_id
category_name_snapshot

boarding_point_id
boarding_snapshot

occupies_seat

list_price
sale_price
discount_amount

status

created_at
cancelled_at nullable
```

Repare nos snapshots.

Mesmo se o cadastro principal do passageiro mudar:

```text
reservation_passengers
```

continua mostrando o que foi contratado.

# F.5.16 Assentos

```text
seat_holds
seat_assignments
```

Um hold terá:

```text
expires_at
```

e uma atribuição definitiva terá:

```text
assigned_at
released_at nullable
release_reason nullable
```

Precisaremos de proteção forte contra dois assentos simultâneos.

# F.5.17 Origem comercial

Teremos:

```text
sales_attributions
```

com snapshot da origem.

Campos conceituais:

```text
reservation_id

commercial_source

affiliate_id nullable
partner_agency_id nullable
marketplace_publication_id nullable
campaign_id nullable

attribution_token
rule_snapshot
```

# F.5.18 Aprovações

```text
approval_requests
```

genérica, mas fortemente relacionada a entidade e tipo.

Ela não substituirá regras específicas, apenas administrará exceções.

# F.5.19 Cobranças

```text
charges
----------------------------
id
agency_id
reservation_id

charge_type

amount
due_date

status

created_at
paid_at nullable
cancelled_at nullable
```

Tipos principais:

```text
ENTRY
INSTALLMENT
ADDITIONAL_CHARGE
CANCELLATION_FEE
PASSENGER_CHANGE_FEE
OTHER
```

# F.5.20 Pagamentos

```text
payments
----------------------------
id
agency_id
reservation_id nullable

provider
account_scope
payment_method

status

amount
client_fee_amount
agency_fee_amount

installments nullable

provider_payment_id nullable

confirmed_at nullable
created_at
```

Marketplace:

```text
account_scope = MARKETPLACE
```

Canal próprio:

```text
account_scope = AGENCY
```

# F.5.21 Alocação

```text
payment_allocations
----------------------------
payment_id
charge_id
amount
```

Permite:

```text
1 pagamento → várias cobranças

vários pagamentos → 1 cobrança
```

Esse desenho vai nos poupar muita dor de cabeça.

# F.5.22 Transações externas

```text
payment_transactions
payment_webhook_events
```

Separaremos:

```text
nosso pagamento
```

da:

```text
transação no provider
```

Isso ajuda bastante em reconciliação.

# F.5.23 Ajustes e reembolsos

```text
refunds
payment_adjustments
```

Nunca sobrescreveremos o pagamento original.

# F.5.24 Carteira do cliente

Somente ledger:

```text
customer_wallet_transactions
----------------------------
id
agency_id
customer_id

transaction_type

amount

reservation_id nullable
source_transaction_id nullable

created_at
created_by
```

O saldo é:

```text
SUM(transactions)
```

e não uma coluna manual que pode ficar dessincronizada.

# F.5.25 Contratos

Estrutura:

```text
contract_templates
contract_template_versions

policies
policy_versions

reservation_policy_snapshots

reservation_contracts
contract_signatures

reservation_documents
```

Template:

```text
Contrato padrão
```

Versão:

```text
Contrato padrão v4
```

Contrato de reserva:

```text
render da v4 + dados da reserva
```

Essa separação é essencial.

# F.5.26 Conteúdo do contrato

`contract_template_versions` deverá guardar pelo menos:

```text
structured_content
rendered_content

variable_schema

created_at
published_at
```

Versão publicada:

```text
IMMUTABLE
```

# F.5.27 PDF da reserva

```text
reservation_contracts
```

terá:

```text
template_version_id

content_snapshot

branding_snapshot

original_file_id

document_hash

status
```

Depois:

```text
signed_file_id
signed_hash
```

quando houver assinatura.

# F.5.28 ZapSign

Camada independente:

```text
signature_integrations
signature_documents
signature_signers
```

Isso permite assinatura não apenas de contratos de reserva.

Pode assinar:

```text
Contrato SaaS
Termo Marketplace
Add-on
Termo de remarcação
```

# F.5.29 Cancelamentos

```text
cancellation_requests
----------------------------
id
agency_id
reservation_id
reservation_passenger_id nullable

scope
reason

policy_version_id

paid_amount_snapshot
retention_amount_snapshot
refund_amount_snapshot
credit_amount_snapshot

status

requested_at
approved_at nullable
executed_at nullable
```

Nada é recalculado retroativamente depois de executado.

# F.5.30 Substituições

```text
passenger_replacements
```

com:

```text
old_reservation_passenger_id
new_reservation_passenger_id
fee_amount
reason
approved_by
```

# F.5.31 Transferência da reserva

Também devemos ter histórico explícito:

```text
reservation_transfers
```

e não apenas trocar `buyer_customer_id`.

# F.5.32 Remarcação

```text
trip_reschedules
reservation_reschedule_responses
```

Datas anteriores permanecem registradas.

# F.5.33 Operação

Núcleo:

```text
trip_operations

trip_operational_staff

boarding_point_operations

passenger_checkins

passenger_boarding_changes

trip_occurrences

passenger_operational_notes

trip_checklist_items
```

Tudo continua associado ao mesmo `reservation_passenger`.

# F.5.34 Check-in

```text
passenger_checkins
```

pode ter:

```text
status
boarding_point_id
checked_at
checked_by
```

Estados:

```text
WAITING
BOARDED
ABSENT
NO_SHOW
CANCELLED
```

# F.5.35 Financeiro da viagem

```text
trip_financial_closures

trip_financial_closure_costs

trip_financial_passenger_results
```

O fechamento é versionado.

Exemplo:

```text
trip_id 123

closure version 1
SUPERSEDED

closure version 2
CLOSED
```

# F.5.36 Resultado por passageiro

Snapshot:

```text
trip_financial_passenger_results
----------------------------
closure_id
reservation_passenger_id

commercial_source

gross_revenue
discount_amount
net_revenue

direct_costs
shared_costs

payment_fees
marketplace_fees
affiliate_commission

partner_result

final_result
```

Isso permitirá relatórios excelentes posteriormente.

# F.5.37 Afiliados

```text
affiliates
affiliate_links
affiliate_commission_rules
affiliate_commission_items
```

Comissão calculada por passageiro.

# F.5.38 Parceiros

Preparados desde o banco:

```text
agency_partnerships
trip_partner_agencies
partner_agency_links
```

Mesmo que a UI completa entre só na Fase 2.

# F.5.39 Settlements

Teremos uma entidade genérica:

```text
settlements
```

para:

```text
AFFILIATE
PARTNER_AGENCY
PLATFORM
```

Tipos:

```text
COMMISSION
PARTNER_PROFIT
MARKETPLACE_FEE
ADJUSTMENT
```

# F.5.40 Marketplace

Estrutura desde a fundação:

```text
marketplace_publications
marketplace_sales
marketplace_payouts
```

Importante:

```text
marketplace_sale
→ reservation_id
```

Não haverá segunda reserva.

# F.5.41 Venda Marketplace

```text
marketplace_sales
----------------------------
agency_id
trip_id
reservation_id
publication_id

base_amount

client_fee_amount
agency_fee_amount
marketplace_fee_amount

amount_due_to_agency
amount_paid_to_agency

status
```

# F.5.42 Repasse Marketplace

```text
marketplace_payouts
----------------------------
id

agency_id
trip_id nullable

payout_type

amount
status

approved_by
paid_by nullable

reference
proof_file_id nullable

created_at
paid_at nullable
```

Sem passageiro.

O Super Admin não precisa dele.

# F.5.43 Notificações

```text
notifications
message_templates
message_deliveries
customer_notification_preferences
```

Separadas do domínio comercial.

# F.5.44 Outbox

```text
outbox_events
----------------------------
id

agency_id nullable

event_type

aggregate_type
aggregate_id

payload

status

created_at
processed_at nullable
```

Payload mínimo necessário.

Nada de despejar todo o cadastro do cliente dentro dele.

# F.5.45 Jobs

```text
scheduled_job_runs
```

para auditoria técnica dos processos agendados.

# F.5.46 Arquivos

Tabela central:

```text
files
----------------------------
id
agency_id nullable

category

storage_bucket
storage_path

original_name
mime_type
size_bytes

entity_type
entity_id

is_public

uploaded_by nullable
created_at
deleted_at nullable
```

`agency_id` poderá ser `NULL` apenas para arquivos genuinamente da própria plataforma.

# F.5.47 Integrações

```text
agency_integrations
integration_health
integration_webhook_events
```

A tabela não contém segredo puro.

Somente:

```text
provider
external account reference
status
metadata não sensível
```

Tokens ficam no ambiente seguro.

# F.5.48 Privacidade

```text
customer_consents
privacy_policy_versions
privacy_requests
security_incidents
```

Já preparados desde o schema.

# F.5.49 Auditoria

```text
audit_logs
----------------------------
id
agency_id nullable

actor_type
actor_user_id nullable

action

entity_type
entity_id

request_id

metadata

created_at
```

`metadata` deve ser sanitizada.

# F.5.50 Códigos amigáveis

Teremos código amigável para entidades que usuários manipulam bastante.

Exemplo:

```text
RESERVA
DRI-2026-001842

VIAGEM
TRIP-2026-0041
```

O formato final pode variar.

Mas:

```text
UUID
```

continua sendo PK.

# F.5.51 Restrições que considero obrigatórias

O `DATABASE.md` vai exigir explicitamente:

```text
Não mutar agency_id depois da criação.

Não permitir FK cross-tenant.

Não permitir seat assignment duplicado ativo.

Não permitir webhook externo duplicado processado.

Não permitir provider transaction duplicada.

Não permitir dois domains primários ativos por agência.

Não permitir último ADMIN ser removido.

Não permitir fechamento financeiro versionado ser sobrescrito.

Não permitir versão publicada de contrato ser editada.
```

Algumas serão constraints; outras functions/services + constraints complementares.

# F.5.52 Índices

Além das PKs:

```text
agency_id

(agency_id, status)

(agency_id, trip_id)

(agency_id, reservation_id)

(agency_id, customer_id)

(provider, provider_payment_id)

(provider, external_event_id)

trip departure dates

charge due_date

hold expires_at
```

Serão prioritários.

# F.5.53 Views

Algumas informações derivadas merecem views/RPCs controladas.

Exemplo:

```text
trip_availability
trip_financial_summary
customer_wallet_balance
reservation_balance
marketplace_agency_balance
```

Não armazenaremos esses valores como segunda fonte da verdade quando puderem ser derivados de forma segura.

# F.5.54 Views públicas

Para o site:

```text
public_trip_catalog
public_trip_detail
```

com apenas dados aprovados.

Assim o frontend público nunca precisa consultar diretamente:

```text
trips
trip_costs
customers
```

# F.5.55 Views mascaradas

Equipe sem permissão sensível poderá usar estrutura que retorne:

```text
***.456.789-**
r***@gmail.com
```

em vez dos dados completos.

# F.5.56 Funções transacionais críticas

Algumas operações devem ser functions/RPCs ou serviços transacionais, por exemplo:

```text
create_reservation()
confirm_payment()
register_cash_payment()

hold_seat()
confirm_seat_assignment()

execute_cancellation()

create_wallet_credit()

close_trip_financial()

reopen_trip_financial()
```

O Codex não poderá transformar essas operações em cinco updates independentes pelo frontend.

# F.5.57 Mapa macro

No centro da arquitetura teremos:

```text
                       AGENCY
                          │
          ┌───────────────┼───────────────┐
          │               │               │
        TRIPS         CUSTOMERS       MEMBERS
          │               │
          │               │
      RESERVATIONS ─ PASSENGERS
          │
    ┌─────┼──────┐
    │     │      │
 PAYMENTS SEATS CONTRACTS
    │             │
    │        SIGNATURES
    │
 CANCELLATIONS
    │
 CREDITS

TRIP
 │
 ├── OPERATION
 │
 ├── COSTS
 │
 ├── AFFILIATES
 │
 ├── MARKETPLACE
 │
 └── FINANCIAL CLOSURE
```

Esse será o esqueleto do `DATABASE.md`.
