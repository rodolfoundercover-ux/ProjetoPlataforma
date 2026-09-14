# Permissões e aprovações

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: C.1 e E.6; G.1.12–16. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Nomes canônicos e aplicação

Usar ADMIN/ANALYST como papéis de equipe e perfis de permissões editáveis como presets. A seleção da agência na interface não concede acesso.

| Alias histórico | Nome adotado |
|---|---|
| integrations.manage | settings.integrations.manage |
| branding.manage | settings.branding.manage |
| domain.manage | settings.domain.manage |
| operations.change_boarding_point | operations.change_boarding |
| CLIENT_PAYS / AGENCY_PAYS (taxas) | CLIENT / AGENCY |

O catálogo abaixo inclui permissões de expansão, que permanecem inativas sem feature habilitada. A permissão de visualizar não implica exportar, revelar PII, reembolsar ou aprovar exceções. Clientes não podem usar permissões de equipe para editar diretamente estado financeiro.

Para leitura direta pela API de dados, restringir grants/RLS e projeções de modo que o Analyst não burle a permissão do serviço. Backend e RLS devem concordar. SECURITY DEFINER valida ator, tenant e ação explicitamente.

Aprovação não reserva capacidade eternamente: revalidar hold, preço e contexto ao executar. Limites monetários e quatro olhos são configuráveis/preparados; não tornar um valor ilustrativo requisito universal. Proteger último ADMIN ativo e impedir que gestão de equipe seja usada para ampliar privilégios além do escopo autorizado.

## C.1.1 Tipos principais de usuário

Teremos:

```text
SUPER_ADMIN
ADMIN
ANALYST
CLIENT
SYSTEM
```

E cada um vive em uma camada diferente.

---

# SUPER_ADMIN

O Super Admin administra a **plataforma**, não o negócio das agências.

Pode acessar:

```text
Contas SaaS
Licenças
Planos
Módulos
Domínios
Status de integrações
Saúde técnica
Marketplace financeiro
Repasses Marketplace
Templates globais
Configurações da plataforma
Logs técnicos
```

Não pode acessar:

```text
❌ Clientes da agência
❌ Passageiros
❌ CPF
❌ Telefone
❌ Contratos assinados
❌ Reservas privadas
❌ Financeiro interno da agência
❌ Lucro de viagens
❌ Carteira do cliente
❌ Histórico pessoal
```

Essa regra continua absoluta.

---

# ADMIN

O Admin pertence a uma ou mais agências.

Dentro da própria agência:

```text
✅ Viagens
✅ Clientes
✅ Reservas
✅ Passageiros
✅ Pagamentos
✅ Contratos
✅ Parceiros
✅ Operação
✅ Financeiro da viagem
✅ Equipe
✅ Configurações
```

Mas somente:

```text
agency_id IN agências que ele administra
```

Se ele administra:

```text
Dri Viagens
Rodolfo Viagens
```

ele pode alternar entre as duas.

Nunca mistura dados.

---

# ANALYST

O Analyst pertence a uma agência e recebe permissões granulares.

Exemplo:

```text
Mariana

✅ trips.view
✅ reservations.view
✅ reservations.create
✅ customers.view

❌ trip_financial.view
❌ settings.manage
❌ team.manage
```

Então `ANALYST` sozinho não concede quase nada.

Quem manda são:

```text
agency_member_permissions
```

---

# CLIENT

O cliente acessa somente:

```text
seus próprios dados
suas próprias reservas
seus passageiros/dependentes vinculados
seus pagamentos
seus contratos
seus créditos
```

E sempre no contexto da agência atual.

Exemplo:

```text
Rodolfo
auth_user_id = USER-001
```

Entrando na Dri:

```text
vê somente Dri
```

Entrando na Rodolfo Viagens:

```text
vê somente Rodolfo Viagens
```

Mesmo sendo a mesma identidade global.

---

# SYSTEM

Esse é um conceito técnico.

Representa processos internos como:

```text
webhook Mercado Pago
job de vencimentos
job de expiração de reserva
processamento de notificações
motor de IA
```

SYSTEM não é usuário humano.

Ele deve usar credenciais de serviço altamente restritas e funções específicas.

Nunca:

```text
SERVICE_ROLE em tudo
```

como atalho.

---

# C.1.2 Matriz geral

Conceitualmente:

| Recurso | Super Admin | Admin | Analyst | Client |
|---|---:|---:|---:|---:|
| Agência / licença | ✅ | própria | ❌ | ❌ |
| Clientes | ❌ | ✅ | permissão | próprio |
| Passageiros | ❌ | ✅ | permissão | próprios |
| Viagens | metadados | ✅ | permissão | públicas/compradas |
| Reservas | ❌ | ✅ | permissão | próprias |
| Pagamentos | Marketplace mínimo | ✅ | permissão | próprios |
| Contratos | ❌ | ✅ | permissão | próprios |
| Financeiro viagem | ❌ | ✅ | permissão | ❌ |
| Marketplace | ✅ plataforma | própria | permissão | público |
| Equipe | ❌ | ✅ | permissão | ❌ |
| Configurações | plataforma | ✅ | permissão | ❌ |

---

# C.1.3 Permissões do Analyst

Eu separaria por domínio.

### Viagens

```text
trips.view
trips.create
trips.edit
trips.publish
trips.cancel
trips.reschedule
trips.duplicate
```

### Reservas

```text
reservations.view
reservations.create
reservations.edit
reservations.cancel
reservations.add_passenger
reservations.transfer
reservations.extend_hold
```

### Clientes

```text
customers.view
customers.create
customers.edit
customers.view_sensitive_data
```

### Pagamentos

```text
payments.view
payments.register
payments.register_cash
payments.refund
payments.reverse
payments.view_fees
```

### Financeiro

```text
trip_financial.view
trip_financial.edit_costs
trip_financial.close
trip_financial.reopen
```

### Contratos

```text
contracts.view
contracts.generate
contracts.manage_templates
contracts.manage_policies
```

### Parceiros

```text
partners.view
partners.create
partners.edit
partners.manage_commissions
partners.manage_settlements
```

### Operação

```text
operations.view
operations.manage_checkin
operations.change_seat
operations.change_boarding
operations.mark_no_show
operations.manage_occurrences
operations.finish_trip
```

### Configurações

```text
settings.view
settings.edit
settings.integrations.manage
settings.branding.manage
settings.domain.manage
```

### Equipe

```text
team.view
team.create
team.edit
team.manage_permissions
```

---

# C.1.4 Permissões sensíveis separadas

Algumas ações precisam de proteção extra.

Por exemplo:

```text
customers.view
```

não significa automaticamente:

```text
customers.view_sensitive_data
```

Então um vendedor pode ver:

```text
João da Silva
(16) *****-1234
***.456.789-**
```

Enquanto alguém autorizado vê os dados completos.

Mesmo princípio para:

```text
payment fees
reembolsos
lucro
documentos
```

---

# C.1.5 Admin também precisa de limites

Apesar de Admin ter acesso amplo à agência, algumas operações críticas podem exigir:

```text
senha novamente
MFA futuramente
confirmação explícita
```

Exemplos:

```text
reabrir fechamento financeiro
alterar integração Mercado Pago
alterar domínio
excluir usuário
cancelar viagem
```

Isso é segurança de ação, não apenas acesso.

---

# C.1.6 RLS por agência

A regra-base para quase toda tabela tenant será:

```text
registro.agency_id
IN
agências às quais auth.uid() pertence
```

Algo conceitualmente equivalente a:

```sql
EXISTS (
    SELECT 1
    FROM agency_members am
    WHERE am.user_id = auth.uid()
      AND am.agency_id = row.agency_id
      AND am.status = 'ACTIVE'
)
```

Depois ainda verificamos a permissão específica.

---

# C.1.7 Não confiar no frontend

Mesmo que a tela não mostre:

```text
[ REEMBOLSAR ]
```

o backend precisa rejeitar:

```text
POST /refund
```

caso o usuário não tenha:

```text
payments.refund
```

Interface escondida é conveniência.

Segurança real fica no backend/RLS.

---

# C.1.8 Cliente

Para cliente, a lógica muda.

Exemplo:

```text
reservations.buyer_customer_id
```

precisa apontar para um `agency_customer` cujo:

```text
auth_user_id = auth.uid()
```

Então:

```text
CLIENT
↓
auth.uid()
↓
agency_customer
↓
reservation
```

Nada de confiar em:

```text
customer_id enviado pela URL
```

---

# C.1.9 Dependentes

Se Rodolfo cadastrou João como dependente:

```text
agency_passengers.owner_customer_id = Rodolfo
```

Rodolfo pode acessá-lo.

Outro cliente:

```text
❌
```

Mesmo que saiba o UUID.

---

# C.1.10 Super Admin sem bypass

Quero deixar isso explícito mais uma vez:

```text
SUPER_ADMIN
```

não recebe uma regra do tipo:

```text
OR is_super_admin()
```

nas tabelas privadas das agências.

Nunca.

Acesso global do Super Admin fica apenas no **domínio da plataforma**.

---

# C.1.11 Marketplace

Marketplace precisa de acesso apenas ao necessário.

Por exemplo:

```text
trip publicada
preço público
vagas
embarques públicos
regras comerciais
```

Quando vende:

```text
cria reserva na agência
```

por meio de serviço interno controlado.

Mas o painel do Marketplace não recebe acesso geral a:

```text
agency_customers
reservation_passengers
contracts
```

A venda pode usar IDs técnicos sem expor dados pessoais ao operador.

---

# C.1.12 WhatsApp IA

Mesma filosofia.

A IA não recebe acesso livre ao banco.

Ela terá ferramentas específicas como:

```text
searchTrips()
getTripAvailability()
createReservation()
getPaymentStatus()
requestDiscountApproval()
```

E não:

```text
SELECT * FROM customers
```

A IA será tratada como um ator limitado.

---

# C.1.13 Logs de acesso

Para ações mais sensíveis, podemos registrar:

```text
actor_user_id
agency_id
action
entity_id
timestamp
request_id
```

Especialmente:

```text
visualização de dados sensíveis
reembolso
contrato
financeiro
alteração de permissão
```

Não precisamos logar cada clique banal.

---

# C.1.14 Sessão de agência ativa

Quando o usuário pertence a várias agências:

```text
Dri
Rodolfo
XPTO
```

o frontend mantém:

```text
active_agency_id
```

Mas isso é apenas contexto da interface.

Toda requisição ainda passa por:

```text
auth.uid()
+
agency_members
+
permission
```

Então alterar manualmente:

```text
active_agency_id
```

não concede acesso.

---

# C.1.15 Princípio final

Nossa regra será:

> **Nunca conceder acesso por cargo quando podemos conceder pelo menor privilégio necessário.**

Então:

```text
SUPER_ADMIN
```

não significa “tudo”.

```text
ANALYST
```

não significa “quase tudo”.

```text
SYSTEM
```

não significa “banco inteiro”.

Cada ator recebe somente o necessário.

---

## Exceções e ações sensíveis

## E.6.1 Permissão normal

São ações operacionais do dia a dia.

Exemplos:

```text
trips.view
trips.edit

reservations.view
reservations.create
reservations.edit

customers.view

operations.manage_checkin

contracts.view

payments.view
```

Se o Analyst possui a permissão, executa diretamente.

---

## E.6.2 Permissão não depende do cargo

Continuamos sem criar cargos rígidos do tipo:

```text
VENDEDOR
FINANCEIRO
GERENTE
```

O usuário é:

```text
ADMIN
ou
ANALYST
```

e recebe permissões específicas.

Exemplo:

```text
Ana
ANALYST

reservations.view ✅
reservations.create ✅
payments.view ✅
payments.refund ❌
trip_financial.view ❌
```

Isso deixa a plataforma muito mais flexível.

---

# E.6.3 Perfis de permissão

Mesmo sendo granular, podemos facilitar o cadastro com presets.

Exemplo:

```text
Perfil: Atendimento
Perfil: Vendas
Perfil: Operação
Perfil: Financeiro
Perfil: Gerência
```

Mas eles são apenas modelos.

Se aplicarmos:

```text
Perfil Vendas
```

o Admin ainda pode depois:

```text
+ contracts.view
- customers.export
```

individualmente.

---

# E.6.4 Aprovações

Existem ações que o usuário pode solicitar, mas não necessariamente aprovar sozinho.

Exemplo:

```text
DESCONTO FORA DO LIMITE
```

O vendedor possui:

```text
reservations.create
```

mas não:

```text
approvals.discount_exception
```

Então:

```text
Vendedor solicita
↓
approval_request
↓
Gerente/Admin aprova
↓
operação continua
```

---

# E.6.5 Tipos de aprovação

Já temos uma estrutura genérica:

```text
approval_requests
```

Tipos iniciais:

```text
DISCOUNT_EXCEPTION
PAYMENT_DEADLINE_EXCEPTION
PASSENGER_CHANGE_EXCEPTION
CANCELLATION_EXCEPTION
REFUND_EXCEPTION
CREDIT_EXCEPTION
```

E podemos adicionar outros sem redesenhar o banco.

---

# E.6.6 Estrutura

Conceitualmente:

```text
approval_requests
--------------------------------
id
agency_id

request_type

entity_type
entity_id

requested_by
requested_at

reason

normal_value nullable
requested_value nullable

status

reviewed_by nullable
reviewed_at nullable
review_notes nullable
```

Status:

```text
PENDING
APPROVED
REJECTED
CANCELLED
EXPIRED
```

---

# E.6.7 Aprovação de desconto

Exemplo:

```text
Preço tabela:
R$ 1.350

Mínimo sem aprovação:
R$ 1.250

Vendedor deseja:
R$ 1.150
```

Sistema bloqueia conclusão e cria:

```text
DISCOUNT_EXCEPTION
```

O responsável vê:

```text
Preço tabela        R$ 1.350
Limite permitido    R$ 1.250
Solicitado          R$ 1.150
Motivo              Cliente recorrente
```

Então:

```text
[ APROVAR ]
[ RECUSAR ]
```

---

# E.6.8 Desconto aprovado

Ao aprovar:

```text
approved_by
approved_at
approved_amount
```

viram snapshot da venda.

Não basta apenas liberar o botão.

Precisamos saber depois **quem autorizou aquele preço**.

---

# E.6.9 Prazo de pagamento

A viagem pode exigir quitação até:

```text
7 dias antes
```

Mas excepcionalmente um cliente pode pagar:

```text
3 dias antes
```

Usuário solicita:

```text
PAYMENT_DEADLINE_EXCEPTION
```

Se aprovado, a reserva recebe a exceção específica.

Não mudamos a política da viagem inteira.

---

# E.6.10 Cancelamento fora da política

Exemplo:

```text
Política normal:
reembolso R$ 200

Usuário solicita:
reembolso R$ 600
```

Isso gera:

```text
CANCELLATION_EXCEPTION
```

Se aprovado:

```text
policy_result = 200
approved_result = 600
```

Os dois permanecem registrados.

---

# E.6.11 Reembolso acima do permitido

Também podemos separar:

```text
payments.refund
```

de:

```text
approvals.refund_exception
```

Então alguém pode executar um reembolso normal, mas não conceder valor acima da política sozinho.

---

# E.6.12 Quem pode aprovar

Permissões específicas:

```text
approvals.discount_exception
approvals.payment_deadline_exception
approvals.cancellation_exception
approvals.passenger_change_exception
approvals.refund_exception
```

Admin pode receber todas por padrão.

Analyst recebe somente as necessárias.

---

# E.6.13 Autoaprovação

Eu evitaria permitir que o mesmo usuário:

```text
solicite
+
aprove
```

uma exceção sensível.

Especialmente para:

```text
desconto
reembolso
cancelamento
```

Podemos ter regra:

```text
requires_distinct_approver = true
```

por tipo de aprovação.

---

# E.6.14 Situações pequenas

Para não transformar tudo em burocracia, exceções menores podem permitir autoaprovação se a agência configurar.

Exemplo:

```text
desconto adicional até R$ 20
```

Mas isso é configuração da agência, não comportamento fixo.

---

# E.6.15 Limites monetários

Podemos deixar arquitetura preparada para:

```text
refund.limit = R$ 500
```

Exemplo:

Analyst pode reembolsar até:

```text
R$ 500
```

Acima:

```text
approval_request
```

Isso é muito útil futuramente.

---

# E.6.16 Ações que exigem reautenticação

Algumas ações são tão sensíveis que mesmo um usuário autorizado deve confirmar sua identidade novamente.

Eu colocaria:

```text
Alterar integração financeira
Alterar conta de recebimento
Fazer grande reembolso
Reabrir fechamento financeiro
Alterar domínio principal
Alterar permissões de Admin
Transferir propriedade da agência
Cancelar viagem inteira
Executar repasse Marketplace
```

---

# E.6.17 Reautenticação

Fluxo:

```text
usuário clica
↓
sessão não é recente
↓
Confirmar identidade
↓
senha / MFA
↓
operação liberada
```

Podemos considerar autenticação recente válida por alguns minutos.

---

# E.6.18 MFA

Para:

```text
SUPER_ADMIN
```

quero manter nossa recomendação:

```text
MFA obrigatório em produção
```

Para Admin:

```text
MFA opcional inicialmente
```

mas altamente recomendado.

---

# E.6.19 Cancelamento da viagem inteira

Isso merece confirmação especial.

Ao clicar:

```text
[ CANCELAR VIAGEM ]
```

mostrar:

```text
46 reservas afetadas
38 passageiros confirmados
R$ 42.000 recebidos
R$ 8.000 pendentes
```

e exigir:

```text
motivo
confirmação explícita
reautenticação
```

---

# E.6.20 Não usar confirmação fraca

Nada de:

```text
Tem certeza?
[ SIM ]
```

para ação destrutiva crítica.

Podemos exigir algo como:

```text
Digite CANCELAR VIAGEM
```

ou confirmação equivalente.

Isso reduz erro operacional.

---

# E.6.21 Reabrir fechamento financeiro

Fluxo:

```text
[ REABRIR FECHAMENTO ]
↓
motivo obrigatório
↓
reautenticação
↓
audit log
↓
nova versão poderá ser criada
```

Nunca silencioso.

---

# E.6.22 Reembolso

Para um reembolso:

```text
Reserva DRI-1842
Valor: R$ 800
```

a tela deve mostrar antes:

```text
Pagamento original
Valor já reembolsado
Saldo reembolsável
Política aplicada
Motivo
```

Evita devolver mais do que foi pago.

---

# E.6.23 Crédito

Mesmo princípio:

```text
[ GERAR CRÉDITO ]
```

mostra:

```text
valor
origem
motivo
reserva
```

e precisa da permissão:

```text
customers.wallet.manage
```

---

# E.6.24 Exportação de clientes

Como definimos no C.4:

```text
customers.view
```

não implica:

```text
customers.export
```

Exportação precisa de permissão separada.

Grandes exportações poderão exigir aprovação no futuro.

---

# E.6.25 Dados sensíveis

Também separaremos:

```text
customers.view
```

de:

```text
customers.view_sensitive_data
```

Então usuário sem permissão vê:

```text
***.456.789-**
```

e não CPF completo.

---

# E.6.26 Visualização de financeiro

Permissões:

```text
trip_financial.view
trip_financial.edit_costs
trip_financial.calculate
trip_financial.close
trip_financial.reopen
```

Isso permite ter alguém que só visualiza sem poder fechar.

---

# E.6.27 Pagamentos

Separar:

```text
payments.view
payments.register
payments.register_cash
payments.refund
payments.reverse
payments.view_fees
```

Um vendedor pode consultar se pagou, mas não registrar dinheiro manualmente.

---

# E.6.28 Integrações

Permissão sensível:

```text
settings.integrations.manage
```

para:

```text
Mercado Pago
InfinitePay
WhatsApp
ZapSign
E-mail
```

Não queremos qualquer Analyst mexendo nisso.

---

# E.6.29 Branding e contratos

Separar:

```text
settings.branding.manage
contracts.manage_templates
contracts.manage_policies
```

A pessoa que edita uma viagem não precisa necessariamente poder alterar o contrato padrão da agência inteira.

---

# E.6.30 Marketplace

Para agência:

```text
marketplace.publish_trip
marketplace.unpublish_trip
marketplace.view_sales
marketplace.view_payouts
```

Para Super Admin:

```text
marketplace.manage_publications
marketplace.manage_payouts
marketplace.suspend_publication
```

Sem acesso à operação privada da agência.

---

# E.6.31 Repasse Marketplace

Essa é uma das ações mais críticas do Super Admin.

Eu exigiria:

```text
marketplace.payout.create
marketplace.payout.approve
```

e podemos futuramente separar:

```text
quem cria
≠
quem aprova
```

para valores altos.

---

# E.6.32 Princípio de quatro olhos

Para ações financeiras grandes, podemos suportar:

```text
maker
+
checker
```

Exemplo:

```text
Admin A cria repasse de R$ 50.000
Admin B aprova
```

Não precisamos ativar isso no MVP, mas deixamos arquitetura preparada.

---

# E.6.33 Operação

Permissões que já definimos:

```text
operations.view
operations.manage_checkin
operations.change_boarding
operations.change_seat
operations.mark_no_show
operations.manage_occurrences
operations.close_boarding
operations.start_trip
operations.finish_trip
```

Assim um guia operacional não precisa entrar no financeiro.

---

# E.6.34 Convites e equipe

```text
team.view
team.create
team.edit
team.manage_permissions
```

Só quem possui:

```text
team.manage_permissions
```

pode alterar o que os outros podem fazer.

---

# E.6.35 Proteção contra perda do último Admin

Mesmo com permissão:

```text
team.edit
```

o backend impede:

```text
desativar último Admin ativo
```

sem fluxo especial de transferência.

Isso é regra de negócio, não permissão.

---

# E.6.36 Hierarquia de segurança

Importante:

```text
FRONTEND
↓
PERMISSION CHECK
↓
BACKEND SERVICE
↓
RLS
↓
DATABASE CONSTRAINT
```

Não confiamos em:

```text
botão escondido
```

como segurança.

---

# E.6.37 UI adaptativa

Se Analyst não tem:

```text
payments.refund
```

o botão nem aparece.

Mas se ele tentar chamar a API manualmente:

```text
403 FORBIDDEN
```

O backend continua protegendo.

---

# E.6.38 Audit log

Toda ação sensível registra:

```text
actor
agency
action
entity
timestamp
request_id
metadata mínima
```

Exemplos:

```text
DISCOUNT_EXCEPTION_APPROVED
PAYMENT_REFUNDED
TRIP_CANCELLED
FINANCIAL_CLOSE_REOPENED
PERMISSION_CHANGED
INTEGRATION_UPDATED
MARKETPLACE_PAYOUT_APPROVED
```

---

# E.6.39 Notificação de aprovação

Quando alguém solicita:

```text
DISCOUNT_EXCEPTION
```

aprovadores recebem:

```text
🔔 Nova aprovação pendente
```

Quando decidido, solicitante recebe:

```text
✅ Aprovado
```

ou:

```text
❌ Recusado
```

---

# E.6.40 Caixa de aprovações

No painel:

```text
Aprovações
```

com:

```text
Pendentes
Aprovadas
Recusadas
Minhas solicitações
```

Filtros por:

```text
tipo
viagem
usuário
data
```

---
