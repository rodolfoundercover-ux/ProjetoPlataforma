# Auditoria G.1 — ponto de corte oficial

Fonte: conversa `6aa5b443-496c-83e9-8680-64eccc1cb052`, turno `15affe62-024e-4673-b9a5-b70e491b7c90`. Transcrição das 55 decisões, preservada como evidência. Os exemplos e as proibições desta auditoria não constituem configurações iniciais nem SQL executável. Os documentos mestres aplicam essas decisões.

# G.1.1 Reserva: status oficial

Em alguns momentos anteriores apareceram referências a:

```text
HOLD
WAITING_PAYMENT
WAITING_ENTRY
```

como possíveis estados da reserva.

Vamos padronizar definitivamente.

A reserva terá:

```text
DRAFT
WAITING_ENTRY
CONFIRMED
CANCELLED
EXPIRED
COMPLETED
```

`WAITING_ENTRY` significa, de forma ampla:

> Existe uma intenção/reserva temporária válida aguardando o pagamento mínimo necessário para confirmação.

Pode ser:

```text
entrada
pagamento integral
pagamento Marketplace
```

dependendo da regra comercial.

`HOLD` não será status da reserva.

Holds serão entidades próprias:

```text
seat_holds
reservation capacity hold
```

Isso elimina ambiguidade.

---

# G.1.2 Marketplace: regra definitiva

Essa foi uma área onde refinamos bastante o modelo.

A versão oficial é:

```text
Marketplace
↓
Mercado Pago
↓
pagamento confirmado
↓
reserva REAL da agência = CONFIRMED
```

E:

```text
marketplace_payout
```

é completamente independente.

Portanto:

```text
Reservation: CONFIRMED
Marketplace payout: NOT_PAID
```

é um estado perfeitamente normal.

Qualquer regra antiga sugerindo que a reserva aguardaria repasse está oficialmente descartada.

---

# G.1.3 Marketplace não duplica reserva

Também fica definitivo:

```text
1 compra Marketplace
=
1 reservation
```

dentro da agência organizadora.

Não teremos:

```text
marketplace_order
+
reservation duplicada
```

como duas vendas diferentes.

`marketplace_sales` apenas referencia:

```text
reservation_id
```

e armazena informações próprias do canal.

---

# G.1.4 Marketplace e pós-venda

Fica oficial:

```text
Marketplace
→ descoberta
→ checkout
→ pagamento
→ origem da reserva
→ repasse
```

Depois:

```text
Agência
→ contrato
→ atendimento
→ alteração
→ cancelamento
→ crédito
→ reembolso
→ operação
```

O Marketplace não será árbitro do pós-venda.

---

# G.1.5 Reembolso Marketplace

Também eliminamos modelos anteriores mais complexos.

Não teremos obrigatoriamente:

```text
refund reserve
negative Marketplace balance
automatic withholding
mandatory post-trip settlement
```

A agência assume a responsabilidade de pós-venda conforme os termos de participação.

Isso não impede evolução futura.

Mas não faz parte da arquitetura obrigatória.

---

# G.1.6 Mercado Pago no Marketplace

Definitivo:

```text
MARKETPLACE
→ Mercado Pago exclusivamente
```

Não:

```text
InfinitePay
dinheiro
gateway escolhido pela agência
```

dentro do Marketplace.

Já no canal próprio da agência:

```text
Mercado Pago
InfinitePay
Cash
```

podem coexistir.

---

# G.1.7 Taxa Marketplace x taxa financeira

Essas duas coisas nunca serão misturadas.

Exemplo:

```text
Preço da viagem             R$ 1.000
Taxa Mercado Pago              R$ 45
Taxa Marketplace               R$ 50
```

São três componentes diferentes.

A taxa do gateway pode ser:

```text
CLIENT
AGENCY
SHARED
```

conforme política da viagem/agência.

A taxa Marketplace é custo comercial do canal segundo a regra publicada.

---

# G.1.8 Receita da viagem

Outra regra oficial:

```text
taxa financeira paga pelo cliente
≠
receita turística
```

Se:

```text
Viagem      R$ 1.000
Taxa cartão R$    50
Cliente paga R$ 1.050
```

a receita comercial continua:

```text
R$ 1.000
```

Não R$ 1.050.

---

# G.1.9 Venda x recebimento

Também manteremos separados:

```text
RECEITA VENDIDA
RECEBIDO
A RECEBER
```

Uma reserva confirmada pode gerar:

```text
R$ 1.500 vendidos
R$   500 recebidos
R$ 1.000 a receber
```

Não vamos chamar os três de “faturamento” indistintamente.

---

# G.1.10 Dinheiro no código

Havia duas possibilidades:

```text
integer cents
numeric/decimal
```

Vamos padronizar.

No PostgreSQL:

```text
numeric(14,2)
```

ou precisão equivalente definida no schema.

No TypeScript:

```text
NUNCA JS number para cálculos monetários críticos
```

Usaremos:

```text
Decimal
```

ou representação monetária tipada equivalente.

Adapters de provider convertem para centavos quando a API exigir.

Assim evitamos inconsistência entre banco e aplicação.

---

# G.1.11 Arredondamento

Teremos utilitário monetário central.

Nunca:

```text
Math.round()
```

espalhado pelo projeto.

Regras para:

```text
parcelamento
rateio
taxas
comissões
reembolsos
```

devem utilizar a mesma estratégia de arredondamento.

E qualquer diferença residual vai para uma parcela/item determinado, preservando o total.

---

# G.1.12 Super Admin

Nada mudou aqui.

Versão definitiva:

```text
SUPER_ADMIN
```

pode acessar:

```text
agências
licenças
planos
módulos
domínios
health de integrações
jobs
logs técnicos sanitizados
billing do SaaS
Marketplace
```

Mas não:

```text
clientes privados
CPF
passageiros
contratos de viagem
receita privada da agência
custos privados
lucro da agência
wallet de cliente
```

E não existe:

```text
OR is_super_admin()
```

nas RLS privadas.

---

# G.1.13 Marketplace é exceção financeira limitada

Super Admin poderá ver a parcela financeira necessária para operar Marketplace:

```text
agency
trip
marketplace_sale_id
reservation reference técnica
valor da venda Marketplace
marketplace fee
gateway amounts
valor devido à agência
repasses
```

Mas continua sem precisar ver:

```text
nome do passageiro
CPF
telefone
endereço
contrato
```

---

# G.1.14 Admin x Analyst

Modelo definitivo continua:

```text
ADMIN
ANALYST
```

Não criaremos cargos rígidos no banco como:

```text
VENDEDOR
FINANCEIRO
GERENTE
```

Esses nomes podem existir apenas como:

```text
permission_profiles
```

reutilizáveis.

A autorização real continua granular.

---

# G.1.15 Cliente global

Também consolidado:

```text
auth.users
```

é identidade global.

Mas:

```text
agency_customers
```

é relacionamento privado por agência.

Portanto a mesma pessoa pode comprar da Dri e de outra agência sem uma saber da outra.

---

# G.1.16 Dados pessoais

Não haverá perfil global cheio de:

```text
CPF
endereço
dependentes
documentos
```

acessível pela plataforma inteira.

PII comercial permanece tenant-local.

Isso preserva nossa arquitetura de privacidade.

---

# G.1.17 Passageiro x comprador

Definitivamente diferentes.

```text
BUYER
```

é quem realizou/assumiu a reserva.

```text
PASSENGER
```

é quem ocupará a viagem.

Comprador pode:

```text
não viajar
```

e isso será suportado nativamente.

---

# G.1.18 Vaga pertence ao passageiro

Regra oficial:

> **A vaga pertence ao passageiro, não à reserva.**

Uma reserva com quatro passageiros consome quatro vagas se todos ocuparem assento.

Cancelamento de um:

```text
libera apenas uma vaga
```

sem cancelar os demais.

---

# G.1.19 Disponibilidade nunca é campo manual

Não teremos:

```text
trips.available_seats = 17
```

como fonte de verdade.

Disponibilidade vem de:

```text
capacidade atual
-
passageiros comprometidos
-
holds válidos
```

---

# G.1.20 SOLD_OUT

Também fica derivado.

Não é status persistente da viagem.

Isso elimina inconsistência quando cancelamento libera vaga.

---

# G.1.21 Troca de veículo

A regra definitiva continua:

```text
novo vehicle assignment
+
histórico
```

Não sobrescrever veículo antigo.

Se o novo mapa for incompatível:

```text
migração automática quando possível
+
review obrigatório quando não
```

Redução abaixo do número de lugares comprometidos será bloqueada.

---

# G.1.22 Trip status x Operation status

Havia potencial sobreposição.

Agora fica claro que são duas máquinas diferentes.

`trips.status` representa ciclo comercial/global:

```text
DRAFT
SALES_OPEN
SALES_CLOSED
BOARDING
IN_PROGRESS
AWAITING_FINANCIAL_CLOSE
FINISHED
CANCELLED
```

Enquanto `trip_operations.status` representa a execução operacional:

```text
NOT_STARTED
OPEN
BOARDING
IN_PROGRESS
RETURNING
COMPLETED
CANCELLED
```

Eles se relacionam, mas não são o mesmo campo.

---

# G.1.23 Publicação x viagem

Também definitivamente separadas.

```text
TRIP
≠
PUBLICATION
```

É possível:

```text
Trip = SALES_OPEN
Site publication = PUBLISHED
Marketplace publication = UNPUBLISHED
```

Sem contradição.

---

# G.1.24 Remover publicação

Não cancela:

```text
viagem
reservas
pagamentos
contratos
```

Apenas interrompe exposição para novas vendas.

---

# G.1.25 Cancelamento do cliente

Percentuais não serão hard-coded na plataforma.

A Dri pode configurar sua política atual, por exemplo faixas por antecedência.

Mas o sistema trata isso como:

```text
policy_version
```

e não como “lei universal”.

---

# G.1.26 Cancelamento pela agência

Regra consolidada:

```text
penalidade do cliente = 0
```

E o valor elegível pago segue resolução apropriada:

```text
refund
ou
agency credit
```

conforme escolha/regra aplicável.

Valores juridicamente sensíveis continuam sujeitos à revisão legal antes do lançamento.

---

# G.1.27 Crédito

Crédito é:

```text
agency-specific
```

Então:

```text
Crédito Dri
```

não pode ser gasto em:

```text
Agência X
```

mesmo que a conta de login seja a mesma.

---

# G.1.28 Crédito não é saldo mutável

Não teremos:

```text
wallet.balance
```

como fonte primária.

Teremos ledger:

```text
CREDIT
DEBIT
REVERSAL
ADJUSTMENT
```

e saldo derivado.

---

# G.1.29 Pagamento nunca é apagado

Pagamento original continua histórico.

Reembolso gera:

```text
refund
payment_adjustment
```

conforme operação.

Nunca:

```text
DELETE payment
```

ou alteração que finja que ele nunca existiu.

---

# G.1.30 Webhook não “manda” no sistema

Provider informa um evento.

Nosso backend:

```text
valida
normaliza
reconcilia
aplica regra
```

O Mercado Pago não terá acesso conceitual direto para decidir:

```text
reservation.status
```

Ele apenas fornece fato financeiro confirmado.

---

# G.1.31 Reserva expirada + pagamento atrasado

Essa era uma borda importante.

Fica oficial:

```text
EXPIRED
↓
webhook tardio
```

não gera:

```text
CONFIRMED automático
```

porque a vaga pode ter sido revendida.

Será criada situação de reconciliação/exceção.

---

# G.1.32 Contratos

Não haverá Word no fluxo operacional.

Contrato é criado/editado:

```text
dentro da plataforma
```

e renderizado para PDF.

Logo, marca d'água e identidade vêm da agência.

---

# G.1.33 Contratos assinados

Depois da assinatura:

```text
imutáveis
```

Alteração gera:

```text
novo documento / nova versão
```

Nunca sobrescreve o assinado.

---

# G.1.34 ZapSign

Aqui havia uma diferença de escopo, e vou consolidar desta forma:

### MVP obrigatório

```text
Contract Engine
PDF
versionamento
hash
aceite eletrônico interno rastreável
SignatureProvider abstraction
```

### ZapSign

```text
MVP se integração estiver pronta durante Phase 6.1
senão MVP 1.1
```

Porém existe um **gate jurídico**:

> Se a revisão jurídica determinar que determinado documento precisa obrigatoriamente de assinatura via provedor externo para o modelo comercial escolhido, a integração correspondente passa a ser requisito de go-live desse documento.

Ou seja, não vamos fingir que uma escolha técnica substitui parecer jurídico.

---

# G.1.35 Aceite interno

Também vou evitar dizer na especificação:

```text
"tem exatamente a mesma validade jurídica que ZapSign"
```

Isso seria uma afirmação jurídica ampla demais.

Chamaremos corretamente de:

```text
electronic acceptance record
```

com:

```text
usuário
timestamp
IP
user agent
texto aceito
versão
hash
```

A adequação jurídica é revisada antes do lançamento.

---

# G.1.36 Consentimento de imagem

Definitivamente separado do contrato obrigatório da viagem quando aplicável.

Não teremos autorização:

```text
perpétua
irrevogável
embutida silenciosamente
```

A plataforma suportará consentimento específico e revogação conforme aplicável.

---

# G.1.37 Seguro viagem

Outra decisão consolidada:

O sistema pode registrar seguro como:

```text
custo
serviço incluído quando realmente contratado
informação contratual
```

Mas nunca anuncia automaticamente:

```text
Seguro incluso
```

só porque existe um campo/custo interno.

---

# G.1.38 Financeiro geral

Fora do MVP.

Core:

```text
FINANCEIRO DA VIAGEM
```

Future/Add-on:

```text
ERP financeiro completo da agência
DRE empresarial
conciliação bancária
contas gerais
```

O Codex não deverá “aproveitar” o módulo financeiro da viagem para construir ERP.

---

# G.1.39 Fechamento financeiro

Regra definitiva:

```text
CALCULATE
↓
CLOSE
```

produz snapshot.

Reabertura:

```text
versão anterior preservada
+
nova versão
```

Não existe edição retroativa silenciosa.

---

# G.1.40 Afiliado

MVP.

Afiliado:

```text
indica
```

não:

```text
opera a viagem
```

Comissão:

```text
projetada durante operação
definitiva após fechamento
```

e calculada de forma compatível com cancelamentos por passageiro.

---

# G.1.41 Agência parceira

Fase 2.

Schema preparado no MVP, porém sem necessidade de interface completa no piloto.

Resultado da parceira não é tratado simplesmente como “comissão de afiliado”.

---

# G.1.42 Marketplace

Também Fase 2 para lançamento amplo.

Schema, contracts e interfaces internas ficam preparados.

Primeiro provamos o motor da Dri.

Depois abrimos distribuição centralizada.

---

# G.1.43 WhatsApp AI

Fase 2 / add-on.

Mas as APIs que ele precisará usar são construídas corretamente desde o MVP.

A IA não terá acesso direto:

```text
SQL
service_role
segredos
```

Usará ferramentas controladas.

---

# G.1.44 Geolocalização

Futuro.

MVP:

```text
endereço
cidade
estado
lat/long opcionais
```

Nada de custo obrigatório de Maps API.

---

# G.1.45 Offline

Futuro.

Operação do MVP é:

```text
ONLINE ONLY
```

Não tentaremos adicionar sync offline escondido no meio do desenvolvimento.

---

# G.1.46 QR Code

Futuro.

Check-in inicial funciona por:

```text
lista
pesquisa
passageiro
embarque
```

em interface mobile-first.

---

# G.1.47 Domínio personalizado

Vou consolidar assim:

### MVP arquitetural

```text
hostname tenant resolution
agency_domains
platform subdomains
```

### Piloto

Pode funcionar perfeitamente em:

```text
dri.plataforma.com
```

### Custom domain

Suporte previsto e desejável já no MVP, mas **não será blocker técnico do piloto** se automação de DNS/SSL ainda estiver sendo finalizada.

Isso evita travar toda a operação por configuração de domínio.

---

# G.1.48 Site e Admin

O site público pode usar domínio da agência.

O Admin fica central:

```text
app.plataforma.com
```

Isso simplifica:

```text
segurança
login
suporte
multiagência
```

---

# G.1.49 Autenticação entre domínios

Como cookies não atravessam domínios independentes, manteremos arquitetura de autenticação central.

Conceitualmente:

```text
driviagens.com
↓
auth.plataforma.com
↓
OTP/login
↓
safe redirect
↓
driviagens.com/minha-conta
```

Sem revelar ao cliente detalhes desnecessários da arquitetura multiagência.

---

# G.1.50 Fila e Cron

Também consolidado:

```text
Supabase Queues
Supabase Cron
Outbox Pattern
```

Nenhum Redis/RabbitMQ obrigatório no MVP.

Se escala futura justificar, substituímos atrás das abstrações.

---

# G.1.51 Service layer x PostgreSQL RPC

Não são alternativas concorrentes.

Usaremos os dois.

```text
Domain Service
→ regra/orquestração
```

e para invariantes críticos:

```text
PostgreSQL transaction/RPC
→ atomicidade
```

Exemplo:

```text
ReservationService
↓
hold_seat()
```

O service organiza.

O banco garante que ninguém roube o mesmo assento simultaneamente.

---

# G.1.52 Banco não substitui aplicação

Da mesma forma, não criaremos toda a aplicação em:

```text
triggers obscuros
stored procedures gigantes
```

Banco protege invariantes.

Service layer mantém a lógica compreensível.

---

# G.1.53 Frontend não decide regras

O frontend pode:

```text
mostrar
validar ergonomicamente
```

Mas nunca é a autoridade final sobre:

```text
preço
desconto
vaga
permissão
cancelamento
pagamento
```

Tudo é validado novamente no backend.

---

# G.1.54 MVP final consolidado

O núcleo que precisa funcionar no piloto Dri será:

```text
Multi-tenant + RLS
Agência/configurações
Equipe/permissões
White-label
Viagens
Embarques
Veículos/assentos
Clientes/passsageiros
Reserva manual
Site/checkout
Mercado Pago
InfinitePay
Dinheiro
Parcelamento
Contract Engine
Cancelamentos
Reembolsos/créditos
Troca de passageiro
Remarcação
Operação/check-in
Financeiro da viagem
Afiliados
Notificações/jobs
Dashboard
Excel/CSV
Auditoria
```

Preparados mas não necessariamente ativados no primeiro piloto:

```text
ZapSign
custom domain automation
```

Fase 2:

```text
Marketplace
Agência parceira
WhatsApp AI
Advanced Reports
Advanced Finance
```

Futuro:

```text
Offline
Maps
QR
Push
Waitlist
```

---

# G.1.55 Resultado da auditoria

Não encontrei nenhum conflito estrutural que torne o projeto inviável.

As principais ambiguidades que existiam foram eliminadas:

```text
✅ status da reserva
✅ HOLD separado
✅ Marketplace x repasse
✅ Marketplace x pós-venda
✅ taxa financeira x receita
✅ Super Admin x tenant
✅ contratos x ZapSign
✅ trip x publication
✅ trip status x operation status
✅ money representation
✅ partner agency x affiliate
✅ MVP x Phase 2
```

E fica uma regra para os documentos finais:

> **Quando uma seção histórica da conversa divergir desta auditoria, a decisão consolidada da auditoria prevalece.**

Esse será o ponto de corte oficial.
