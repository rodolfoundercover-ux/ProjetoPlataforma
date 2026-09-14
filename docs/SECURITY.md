# Segurança e privacidade

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: C.2–C.4, F.9 e G.1. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Controles obrigatórios

RLS em toda tabela privada, autorização nas ações e RPCs, constraints de integridade, Storage privado e logs sanitizados desde a fundação. Não há bypass de SUPER_ADMIN nas tabelas privadas. A administração técnica de infraestrutura não é um papel de produto nem um recurso de impersonação.

Views públicas expõem apenas catálogo aprovado. Views mascaradas não bastam se a tabela-base continuar legível pelo mesmo ator; revogar caminhos alternativos. Testar API direta, filtros, joins, exportações, funções e URLs de arquivo.

Segredos somente no backend/gerenciador seguro. service_role não é uma sessão de Super Admin; uso excepcional em workers/webhooks exige tenant e escopo validados. Nunca conceder o segredo à IA. Não guardar cartão completo/CVV.

## Autenticação entre domínios

Auth central com OTP para cliente e senha para equipe; cookies de domínios independentes não são compartilhados. O fluxo de retorno deve provar sessão no domínio de destino por mecanismo seguro, com validade curta, uso único e destino permitido; não transportar access/refresh tokens em URL pública. A implementação exata é um spike PHASE_00/07, sem substituir Supabase Auth.

O gate jurídico e prazos de retenção aqui descritos são requisitos da conversa, não um novo parecer jurídico. Políticas finais e retenção por categoria devem ser aprovadas antes do uso comercial.

## Regras de banco e Storage

# C.2.1 Funções auxiliares de segurança

Para não repetir a mesma lógica em dezenas de policies, criaremos funções seguras no banco.

Conceitualmente:

```sql
is_agency_member(agency_id)
```

retorna `true` quando:

```text
auth.uid()
↓
agency_members
↓
agência informada
↓
status = ACTIVE
```

Depois:

```sql
has_agency_permission(
    agency_id,
    'reservations.view'
)
```

valida:

```text
usuário pertence à agência
+
possui a permissão
```

E para clientes:

```sql
is_agency_customer(agency_id)
```

verifica se o usuário autenticado possui relacionamento válido com aquela agência.

# C.2.2 Não confiar no `active_agency_id`

Como falamos anteriormente:

```text
active_agency_id
```

serve para navegação.

Não para segurança.

Se alguém alterar pelo navegador:

```text
DRI
↓
AGÊNCIA_X
```

o banco continua verificando:

```text
auth.uid()
+
agency_members
```

e retorna:

```text
403 / acesso negado
```

# C.2.3 Tabelas da plataforma

Exemplos:

```text
accounts
licenses
plans
features
platform_admins
platform_settings
```

Essas não seguem a mesma RLS das agências.

O Super Admin poderá acessá-las conforme sua função.

Mas aqui precisamos ter cuidado com `accounts`.

Uma conta SaaS pode ter informações como:

```text
Razão social
CNPJ
Admin responsável
Plano
Licenças
```

Isso é informação comercial da nossa plataforma, então o Super Admin pode acessar.

Não contém os clientes passageiros daquela agência.

# C.2.4 `agencies`

Para Super Admin:

```text
SELECT:

```

porque precisa administrar a agência SaaS.

Para Admin/Analyst:

```text
SELECT:
somente agência onde é agency_member
```

Alteração:

```text
Admin:
campos permitidos

Analyst:
settings.edit, se autorizado
```

Mas alguns campos não poderão ser alterados diretamente pela agência, por exemplo:

```text
license status
subscription
platform status
```

Esses pertencem à plataforma.

# C.2.5 Tabelas tenant

Todas as tabelas operacionais terão:

```text
agency_id
```

Exemplos:

```text
trips
reservations
agency_customers
agency_passengers
payments
contracts
trip_costs
affiliates
```

Policy básica de `SELECT`:

```sql
is_agency_member(agency_id)
```

mais a permissão necessária.

Exemplo para reservas:

```sql
is_agency_member(agency_id)
AND
has_agency_permission(
  agency_id,
  'reservations.view'
)
```

# C.2.6 Admin

Para evitar cadastrar 60 permissões manualmente no Admin, a função de permissão pode considerar:

```text
member_type = ADMIN
```

como autorizado às operações comuns da própria agência.

Conceitualmente:

```sql
has_agency_permission(...)
```

faz:

```text
se ADMIN da agência
→ TRUE

se ANALYST
→ verifica permission
```

Mas mesmo o Admin continua restrito a:

```text
agency_id da própria agência
```

# C.2.7 Super Admin nas tabelas tenant

Aqui nossa regra permanece:

```text
SUPER_ADMIN
≠
agency_member
```

Portanto:

```sql
is_agency_member(agency_id)
```

retorna:

```text
FALSE
```

para o Super Admin.

Não adicionaremos:

```sql
OR is_super_admin()
```

nessas policies.

Esse ponto será destacado no documento de segurança.

# C.2.8 `agency_customers`

### Usuário da agência

SELECT:

```text
customers.view
```

INSERT:

```text
customers.create
```

UPDATE:

```text
customers.edit
```

Dados sensíveis completos:

```text
customers.view_sensitive_data
```

Mas RLS trabalha principalmente com linha.

O mascaramento de CPF/telefone também terá apoio da API/view segura, porque RLS não é ideal para esconder apenas algumas colunas.

# C.2.9 Views para dados sensíveis

Em vez de deixar todo Analyst consultar:

```text
agency_customers.document
```

diretamente, podemos disponibilizar uma view segura para usuários comuns.

Por exemplo:

```text
customer_public_view
```

retorna:

```text
Nome
Telefone mascarado
CPF mascarado
```

E usuários com:

```text
customers.view_sensitive_data
```

utilizam endpoint/função autorizada para obter os dados completos.

Assim a segurança não depende só do frontend colocar:

```text
***.***.***-**
```

depois que o CPF completo já foi baixado.

# C.2.10 Cliente acessando `agency_customers`

O próprio consumidor poderá acessar somente a linha em que:

```text
auth_user_id = auth.uid()
```

E somente dentro daquela agência.

Conceitualmente:

```sql
auth_user_id = auth.uid()
```

Sem possibilidade de trocar:

```text
customer_id
```

na URL para consultar outra pessoa.

# C.2.11 `agency_passengers`

Usuário da agência:

```text
passengers/customers permission
```

Cliente:

```text
owner_customer_id
↓
agency_customer.auth_user_id
=
auth.uid()
```

Então Rodolfo consegue ver seus próprios dependentes.

Não os de outro cliente.

# C.2.12 `trips`

Viagens possuem duas naturezas:

```text
PRIVADA
PÚBLICA
```

Usuários da agência podem acessar conforme permissão.

O público não precisa de acesso direto ao banco inteiro.

Para o site white-label teremos uma view/API pública contendo somente:

```text
nome da viagem
descrição
datas
preços públicos
embarques públicos
imagens
vagas disponíveis
```

Não retorna:

```text
custos
lucro
fornecedor
passageiros
financeiro
```

# C.2.13 `trip_costs`

Essa tabela exige:

```text
trip_financial.view
```

para SELECT.

E:

```text
trip_financial.edit_costs
```

para INSERT/UPDATE.

Um vendedor que vê a viagem não precisa saber:

```text
ônibus = R$ 8.700
lucro projetado = R$ 4.300
```

Então acesso a viagem não implica acesso aos custos.

# C.2.14 `reservations`

Analyst:

```text
SELECT → reservations.view
INSERT → reservations.create
UPDATE → reservations.edit
```

Cliente:

```text
buyer_customer_id
↓
agency_customer.auth_user_id
=
auth.uid()
```

Então o comprador vê sua própria reserva.

# C.2.15 Passageiros da reserva

Cliente pode visualizar passageiros ligados à própria reserva.

Mas para edição teremos mais cuidado.

Depois que:

```text
contrato assinado
ou
reserva confirmada
```

certas alterações precisam passar por fluxo específico.

Então não vamos permitir simplesmente:

```text
UPDATE reservation_passengers
```

diretamente pelo cliente.

Ele chama algo como:

```text
requestPassengerChange()
```

e o backend aplica as regras.

# C.2.16 Pagamentos

Tabela:

```text
payments
```

Agência:

```text
payments.view
```

Cliente:

```text
somente pagamentos de suas reservas
```

Mas o cliente nunca pode:

```text
INSERT CONFIRMED
UPDATE status = CONFIRMED
```


Pagamentos online são criados/atualizados através de serviço/backend e webhook.

# C.2.17 Dinheiro manual

Somente:

```text
payments.register_cash
```

pode registrar.

E idealmente via função controlada:

```text
register_cash_payment(...)
```

em vez de INSERT direto.

Essa função:

1. valida agência;
2. valida permissão;
3. cria pagamento;
4. cria alocação;
5. atualiza cobrança;
6. registra auditoria.

Tudo na mesma transação.

# C.2.18 Reembolsos

Não permitiremos:

```text
INSERT INTO refunds
```

livremente pelo frontend.

Usaremos serviço/função como:

```text
create_refund(...)
```

que valida:

```text
payments.refund
agência correta
saldo elegível
política
reserva
```

e cria o evento.

# C.2.19 Contratos

Agência:

```text
contracts.view
```

Cliente:

```text
somente contratos da própria reserva
```

Super Admin:

```text

```

Storage também seguirá a mesma regra.

# C.2.20 Arquivo do contrato

Mesmo que alguém descubra:

```text
/storage/.../contrato.pdf
```

não deve conseguir abrir.

O arquivo é privado.

O backend gera uma:

```text
signed URL temporária
```

somente depois de verificar:

```text
quem é o usuário?
ele pode acessar essa reserva?
```

A URL expira rapidamente.

# C.2.21 Marketplace

Aqui vamos usar um serviço interno específico.

O Marketplace precisa conseguir:

```text
consultar viagem publicada
consultar disponibilidade
criar reserva Marketplace
registrar pagamento
```

Mas não deve receber acesso geral ao tenant.

Então ele chama funções específicas:

```text
marketplace_get_trip()
marketplace_create_reservation()
marketplace_confirm_payment()
```

em vez de possuir:

```text
SELECT *
```

nas tabelas da agência.

# C.2.22 Publicação no Marketplace

Teremos:

```text
marketplace_publications
```

O Super Admin pode acessar os dados da publicação:

```text
agency_id
trip_id
preço público
taxa Marketplace
status
condições
```

Mas não ganha acesso aos passageiros porque a viagem foi publicada.

# C.2.23 Venda Marketplace

O serviço Marketplace cria:

```text
reservation
reservation_passengers
charges
payment
sales_attribution
marketplace_sale
```

em uma única operação transacional.

Isso é crucial.

Não queremos situação:

```text
Mercado Pago confirmou
```

mas:

```text
reserva não foi criada
```

ou vice-versa.

# C.2.24 Processes `SYSTEM`

O backend terá operações privilegiadas, mas específicas.

Exemplo:

```text
expire_reservation()
process_payment_webhook()
mark_overdue_charges()
```

Esses processos podem usar credencial server-side, mas não expondo `service_role` ao navegador.

Regra absoluta:

```text
SUPABASE_SERVICE_ROLE_KEY
```

nunca aparece em:

```text
frontend
browser
app público
variável NEXT_PUBLIC_*
```

# C.2.25 Service Role

Supabase Service Role ignora RLS.

Portanto ele é praticamente a chave mestra.

Usaremos somente em:

```text
server trusted environment
```

e somente quando necessário.

Sempre que possível, prefiro funções que já recebam contexto e façam operações estreitas.

# C.2.26 DELETE

Agora uma decisão importante.

Para a maioria das entidades críticas:

```text
DELETE
```

via usuário será:

```text
DENIED
```

Exemplos:

```text
reservations
payments
contracts
passengers vinculados a reservas
trip_financial_closures
```

Usamos:

```text
status
archived_at
cancelled_at
```

Em vez de apagar.

# C.2.27 Quando DELETE pode existir

Exemplo:

```text
banner de rascunho
imagem não utilizada
template ainda não usado
```

Pode ser removível.

Mas mesmo aí validamos:

```text
agency_id
permissão
```

# C.2.28 INSERT com `agency_id`

Um detalhe técnico muito importante.

Nunca faremos:

```text
frontend escolhe agency_id
↓
INSERT
```

sem validação.

Policy `WITH CHECK` exigirá:

```sql
is_agency_member(agency_id)
```

Então mesmo que alguém envie:

```json
{
  "agency_id": "AGENCIA_DO_VIZINHO"
}
```

PostgreSQL rejeita.

# C.2.29 UPDATE e troca de tenant

Também precisamos impedir algo perigoso:

```text
Reserva Dri
agency_id = DRI
```

usuário altera para:

```text
agency_id = RODOLFO
```

😵

Então `agency_id` de registros operacionais deve ser tratado como praticamente imutável.

Updates não podem transferir entidades entre tenants.

# C.2.30 Integridade entre tabelas

RLS sozinho não resolve tudo.

Imagine:

```text
reservation.agency_id = DRI
trip_id = viagem da RODOLFO
```

Precisamos impedir isso.

Usaremos validações/constraints/funções para garantir:

```text
reservation.agency_id
=
trip.agency_id
```

Mesma coisa para:

```text
passageiro
embarque
assento
pagamento
```

Isso evita cruzamento de tenant até por bug interno.

# C.2.31 Foreign Keys compostas onde fizer sentido

Em entidades críticas podemos usar relações equivalentes a:

```text
(agency_id, trip_id)
```

referenciando:

```text
trips(agency_id, id)
```

Assim o próprio PostgreSQL impede:

```text
agency A
↓
id de viagem da agency B
```

Essa é uma proteção excelente e eu quero usá-la onde não tornar o esquema excessivamente pesado.

# C.2.32 Funções `SECURITY DEFINER`

Algumas funções PostgreSQL podem precisar de:

```text
SECURITY DEFINER
```

para executar operações protegidas.

Mas isso é perigoso se mal utilizado.

Regra para o Codex:

```text
SECURITY DEFINER
→ somente funções explicitamente necessárias
→ search_path fixo
→ parâmetros validados
→ permissão de execução restrita
```

Nada de criar uma função:

```text
do_anything()
```

que vira portal dimensional para o banco. 🌀

# C.2.33 Auditoria junto às funções críticas

Funções como:

```text
register_cash_payment
approve_discount
change_vehicle
close_trip_financials
refund_payment
marketplace_payout
```

devem gravar:

```text
audit_logs
```

na mesma operação.

Assim não existe:

```text
ação aconteceu
↓
log falhou
↓
ninguém sabe quem fez
```

# C.2.34 Storage RLS

Teremos pelo menos dois grupos:

```text
PUBLIC ASSETS
PRIVATE ASSETS
```

Públicos:

```text
logos
banners
imagens públicas das viagens
```

Privados:

```text
contratos
comprovantes
documentos
ocorrências
```

Em paths privados:

```text
agency/{agency_id}/...
```

a autorização deve validar o `agency_id`.

# C.2.35 Cliente no Storage

Cliente pode acessar, por exemplo:

```text
contrato da própria reserva
```

Mas não consegue listar:

```text
agency/DRI/contracts/
```

inteiro.

Idealmente ele recebe acesso apenas ao arquivo específico autorizado.

# C.2.36 Super Admin e Storage

Mesma regra:

```text
Super Admin
 contracts/
 payment proofs/
 passenger documents/
```

Pode ter acesso somente a assets técnicos/públicos necessários para administrar plataforma.

# C.2.37 Logs técnicos

Super Admin pode acessar:

```text
webhook id
status
erro
timestamp
agency_id
```

Mas payload sensível deve ser:

```text
removido
mascarado
ou inacessível
```

# C.2.38 Testes automáticos de isolamento

Isso vai entrar como requisito obrigatório.

O Codex deve criar testes como:

```text
User A → Agency A
User B → Agency B
```

Teste:

```text
User A tenta SELECT reserva B
→ DENIED
```

```text
User A tenta UPDATE viagem B
→ DENIED
```

```text
Super Admin tenta SELECT customer A
→ DENIED
```

```text
Client A tenta acessar contrato Client B
→ DENIED
```

```text
Analyst sem payments.refund tenta reembolso
→ DENIED
```

Isso é muito importante.

# C.2.39 Testes contra IDOR

Vamos incluir explicitamente testes contra:

**IDOR, Insecure Direct Object Reference.**

Exemplo:

```text
/minha-reserva/123
```

usuário troca para:

```text
/minha-reserva/124
```

O sistema deve retornar:

```text
NOT FOUND / FORBIDDEN
```

e nunca os dados da outra reserva.

# C.2.40 Resultado do C.2

Nossa segurança fica em camadas:

```text
UI
↓
Permissões da aplicação
↓
API / funções
↓
RLS PostgreSQL
↓
Foreign Keys / constraints
↓
Storage policies
↓
Audit logs
```

Nenhuma camada sozinha carrega toda a responsabilidade.

## Regra máxima

```text
Frontend pode errar.
API pode ter bug.
Usuário pode manipular request.

O banco ainda deve impedir
acesso cruzado entre agências.
```


## Autenticação e sessões

# C.3.1 Login da equipe

Para:

```text
ADMIN
ANALYST
SUPER_ADMIN
```

eu usaria autenticação tradicional via Supabase Auth:

```text
e-mail
+
senha
```

com recuperação por e-mail.

Depois podemos acrescentar:

```text
MFA / 2FA
```

especialmente para contas administrativas.

# C.3.2 Login do cliente

Para o cliente, manteria o fluxo mais simples que definimos:

```text
E-mail
↓
código temporário
↓
login
```

Sem obrigar o passageiro a decorar senha.

Então ele pode acessar:

```text
driviagens.com
```

e depois:

```text
outraagencia.com
```

com a mesma identidade global.

# C.3.3 Autenticação central para white-label

Como os domínios são diferentes, não podemos compartilhar cookie diretamente.

Teremos uma camada central de autenticação.

Conceitualmente:

```text
driviagens.com
      ↓
auth.plataforma.com
      ↓
Supabase Auth
      ↓
retorno seguro
      ↓
driviagens.com
```

Para outra agência:

```text
rodolfoviagens.com
      ↓
mesmo auth central
```

A identidade é global.

A sessão local continua respeitando o domínio da agência.

# C.3.4 Redirecionamento seguro

O parâmetro de retorno não pode aceitar qualquer URL.

Nada de:

```text
?return=https://site-malicioso.com
```

Teremos uma lista de domínios autorizados:

```text
agency_domains
```

Então o serviço de autenticação só redireciona para domínios verificados da plataforma.

Isso evita open redirect e roubo de sessão.

# C.3.5 Sessão administrativa

Para Admin e Analyst eu não deixaria sessões praticamente eternas.

Podemos trabalhar com:

```text
access token curto
+
refresh token
```

e renovação automática enquanto válida.

Também teremos:

```text
last_login_at
last_activity_at
```

para monitoramento.

# C.3.6 Sessões ativas

Eu deixaria preparado:

```text
user_sessions
--------------------------------
id
user_id

device_name
ip_hash / metadata
user_agent

created_at
last_seen_at
revoked_at nullable
```

Assim futuramente o usuário poderá visualizar:

```text
Chrome - Windows
Agora

iPhone
Ontem
```

e:

```text
[ ENCERRAR SESSÃO ]
```

# C.3.7 Logout global

Se houver suspeita de acesso indevido:

```text
[ ENCERRAR TODAS AS SESSÕES ]
```

revoga os refresh tokens daquele usuário.

Muito importante para equipe administrativa.

# C.3.8 MFA

Eu colocaria:

```text
MFA opcional no MVP
```

mas arquitetura pronta.

E para o Super Admin eu recomendaria:

```text
MFA obrigatório
```

quando colocarmos a plataforma em produção comercial.

Porque essa conta controla:

```text
licenças
marketplace
repasses
módulos
domínios
```

Mesmo sem acessar passageiros, ainda possui poderes importantes.

# C.3.9 Ações críticas

Algumas ações devem pedir autenticação recente.

Exemplo:

```text
Alterar integração Mercado Pago
Alterar domínio
Reabrir financeiro
Fazer repasse Marketplace
Alterar permissões
Suspender agência
```

O sistema pode exigir:

```text
Digite novamente sua senha
```

ou:

```text
Confirme MFA
```

antes de executar.

Esse padrão é chamado de reautenticação para ação sensível.

# C.3.10 Proteção contra brute force

Login e código OTP devem ter:

```text
rate limit
```

Exemplo:

```text
máximo de tentativas por período
```

e cooldown progressivo.

Também para:

```text
reenvio de código
recuperação de senha
```

Não podemos permitir que alguém fique disparando milhares de códigos.

# C.3.11 OTP

Código temporário:

```text
6 dígitos
```

com validade curta.

Exemplo:

```text
10 minutos
```

E:

```text
uso único
```

Depois que autenticar:

```text
token expira
```

# C.3.12 Não revelar se o usuário existe

Como já definimos, na tela:

```text
Digite seu e-mail
```

não responderemos:

```text
"Este usuário já existe."
```

A resposta pública será genérica:

```text
Se o endereço puder ser utilizado, enviaremos
as instruções para continuar.
```

Isso ajuda a evitar enumeração de usuários.

# C.3.13 Convite de Analyst

O Admin cria:

```text
nome
e-mail
permissões
```

O sistema gera:

```text
agency_invitation
```

Tabela:

```text
agency_invitations
--------------------------------
id
agency_id

email
member_type

invited_by

token_hash
expires_at

status

created_at
accepted_at nullable
```

Status:

```text
PENDING
ACCEPTED
EXPIRED
REVOKED
```

# C.3.14 Convite não cria acesso antes da aceitação

Enquanto:

```text
status = PENDING
```

não existe:

```text
agency_members ACTIVE
```

Depois que o convidado autentica e aceita:

```text
agency_member
```

é ativado.

# C.3.15 Convite para e-mail errado

Admin poderá:

```text
[ REVOGAR CONVITE ]
```

e gerar outro.

O token anterior deixa de funcionar.

# C.3.16 Remoção de membro

Se o Admin remover um Analyst:

```text
agency_members.status = INACTIVE
```

O usuário não é necessariamente apagado do Supabase Auth.

Porque ele pode trabalhar em outra agência.

Exemplo:

```text
Maria

Dri → removida
Agência X → ainda ativa
```

A identidade global continua existindo.

# C.3.17 Admin principal

A conta deverá ter pelo menos um Admin responsável.

Não permitiremos uma operação que deixe uma agência:

```text
0 ADMINs ativos
```

sem confirmação/processo especial.

Isso evita agência órfã.

# C.3.18 Transferência de propriedade

No futuro ou já como ferramenta administrativa:

```text
Transferir administrador principal
```

de:

```text
João
↓
Maria
```

Isso precisa ser auditado.

# C.3.19 Super Admin

Super Admin não será criado pelo painel normal da agência.

Teremos um processo separado e restrito.

Nada de:

```text
"Escolher role = SUPER_ADMIN"
```

em formulário comum.

O papel deve ser concedido somente por processo administrativo seguro.

# C.3.20 Recuperação de senha

Admin/Analyst:

```text
Esqueci minha senha
↓
e-mail seguro
↓
link temporário
↓
nova senha
```

O token:

```text
expira
uso único
```

Depois de troca de senha, podemos revogar outras sessões.

# C.3.21 Alteração de e-mail

Isso é uma operação sensível.

Requer:

```text
confirmação no e-mail antigo
+
confirmação no novo
```

quando possível.

Especialmente para Admins.

# C.3.22 Alteração de telefone

Também precisa de validação se esse telefone estiver sendo usado para autenticação ou notificações críticas.

# C.3.23 Credenciais dos gateways

Reforçando:

```text
Mercado Pago
InfinitePay
WhatsApp
```

não usam credenciais enviadas diretamente para o navegador.

Fluxo:

```text
Frontend
↓
Backend seguro
↓
secret store
↓
provider
```

Nunca:

```text
browser → token secreto
```

# C.3.24 Webhooks

Webhook não usa login de usuário.

Ele valida:

```text
assinatura
secret
event ID
```

conforme o provider.

Depois identifica:

```text
agency_id
```

pela integração conectada.

Não aceitaremos algo como:

```text
agency_id
```

vindo do webhook sem validação.

# C.3.25 WhatsApp IA

A IA também não terá senha de usuário humano.

Terá:

```text
service identity
```

e acesso somente às ferramentas autorizadas.

Toda operação registra:

```text
actor_type = AI
```

no audit log.

# C.3.26 Marketplace

Marketplace também usa identidade de serviço específica.

Exemplo:

```text
marketplace_service
```

que pode chamar:

```text
marketplace_create_reservation
marketplace_confirm_payment
marketplace_create_payout
```

mas não:

```text
list_all_customers
```

# C.3.27 CSRF e cookies

Se usarmos sessão baseada em cookies em partes do sistema:

```text
HttpOnly
Secure
SameSite
```

e proteção contra CSRF quando aplicável.

Tokens sensíveis não ficam acessíveis ao JavaScript sem necessidade.

# C.3.28 XSS

Como teremos:

```text
descrições de viagens
contratos
templates
conteúdo personalizado
```

todo conteúdo HTML editável precisa ser sanitizado.

Nada de agência inserir:

```html
<script>
...
</script>
```

e executar no navegador dos clientes.

# C.3.29 Uploads

Uploads devem validar:

```text
tipo
tamanho
extensão
mime type
```

e gerar nomes internos seguros.

O nome original é apenas metadata.

Nunca usar diretamente:

```text
../../arquivo
```

ou qualquer caminho enviado pelo usuário.

# C.3.30 Segurança de documentos

Arquivos especialmente sensíveis podem ter:

```text
signed URL
validade curta
```

e nunca links permanentes públicos.

# C.3.31 Limites por ação

Além do login, endpoints importantes também terão rate limit.

Exemplos:

```text
criar reserva
gerar pagamento
enviar OTP
enviar contrato
consultar CPF
```

Isso ajuda contra abuso e automações maliciosas.

# C.3.32 Auditoria de autenticação

Teremos logs como:

```text
LOGIN_SUCCESS
LOGIN_FAILED
PASSWORD_CHANGED
MFA_ENABLED
MFA_DISABLED
SESSION_REVOKED
INVITATION_ACCEPTED
```

Mas novamente:

```text
sem armazenar senha
sem armazenar OTP
```

# C.3.33 Alertas futuros

Podemos futuramente avisar:

```text
Novo login em sua conta
```

ou:

```text
Novo dispositivo detectado
```

Não precisa estar no MVP inicial, mas a estrutura comporta.

---

## Resultado do C.3

Nossa autenticação fica assim:

```text
CLIENTE
→ OTP/passwordless
→ identidade global
→ contexto white-label

ADMIN / ANALYST
→ e-mail + senha
→ MFA preparado
→ agência + permissões

SUPER_ADMIN
→ autenticação administrativa forte
→ MFA recomendado/obrigatório em produção

SYSTEM / AI / MARKETPLACE
→ service identities
→ operações específicas
```

Com proteção para:

```text
sessão
brute force
OTP
convites
segredos
uploads
webhooks
XSS
CSRF
ações sensíveis
```


## Dados pessoais e direitos

## C.4.1 Papéis de privacidade

Conceitualmente:

```text
Agência
→ responsável pelo relacionamento com o cliente e pelos dados operacionais

Plataforma
→ processa os dados necessários para prestar o SaaS

Marketplace
→ usa apenas os dados mínimos para viabilizar a venda e o repasse
```

E o Super Admin continua sem acesso a dados pessoais dos passageiros.

# C.4.2 Categorias de dados

Vamos classificar os dados.

### Identificação

```text
nome
CPF/documento
data de nascimento
```

### Contato

```text
telefone
e-mail
endereço
```

### Operacionais

```text
viagem
embarque
assento
passageiros
check-in
```

### Contratuais

```text
contratos
políticas aceitas
assinaturas
termos adicionais
```

### Financeiros

```text
pagamentos
parcelas
reembolsos
créditos
```

### Técnicos

```text
IP
user agent
logs
eventos de segurança
```

Isso ajuda a definir quem pode ver cada coisa.

# C.4.3 Dados mínimos

Não quero formulários pedindo 25 informações só porque “talvez um dia sejam úteis”.

Cada campo precisa ter finalidade.

Exemplo:

```text
CPF
→ contrato / identificação da reserva
```

Mas se alguma agência não precisar de endereço completo para determinado fluxo, não precisamos obrigatoriamente exigir isso no primeiro contato.

# C.4.4 Consentimento de marketing separado

Aceitar uma compra não significa aceitar propaganda.

Então teremos registros distintos:

```text
Aceite contratual
≠
Consentimento de marketing
```

Eu criaria:

```text
customer_consents
--------------------------------
id
agency_id
customer_id

consent_type
status

policy_version
granted_at
revoked_at nullable

source
```

Tipos:

```text
EMAIL_MARKETING
WHATSAPP_MARKETING
OPTIONAL_DATA_USAGE
```

Comunicação transacional necessária à reserva não depende do mesmo consentimento de marketing.

# C.4.5 Registro de aceite

Toda autorização relevante guarda:

```text
quando
qual versão
origem
usuário
```

Nada de um campo simples:

```text
accepted = true
```

sem histórico.

# C.4.6 Política de privacidade por agência

Cada agência poderá ter:

```text
privacy_policy
```

e versão:

```text
privacy_policy_versions
--------------------------------
id
agency_id
version_number
content
published_at
```

O cliente aceita a versão vigente.

Depois, se a agência mudar a política, o histórico antigo continua existindo.

# C.4.7 Política da própria plataforma

Também teremos uma política da plataforma para:

```text
conta global
autenticação
infraestrutura
Marketplace
```

Separada da política da agência.

Isso é especialmente importante porque o cliente pode ter identidade global, mas relacionamento isolado por agência.

# C.4.8 Menores

Como teremos crianças e adolescentes como passageiros:

- dados do menor ficam vinculados ao responsável/comprador;
- acesso deve ser ainda mais restrito;
- não entram em campanhas de marketing por padrão;
- documentos e informações sensíveis não ficam visíveis para operadores sem necessidade;
- logs não devem copiar seus dados.

Se no futuro houver requisitos específicos de consentimento do responsável, podemos estruturar isso sem redesenhar o banco.

# C.4.9 Direito de acesso aos próprios dados

Na área do cliente, futuramente poderemos oferecer:

```text
Meus dados
Minhas reservas
Meus contratos
Meus pagamentos
Meus créditos
```

E uma opção:

```text
Solicitar cópia dos meus dados
```

Não precisa ser um exportador sofisticado no primeiro dia, mas a arquitetura deve permitir.

# C.4.10 Solicitações de privacidade

Eu criaria:

```text
privacy_requests
--------------------------------
id

agency_id nullable
customer_id / auth_user_id

request_type

status

requested_at
completed_at nullable

handled_by nullable
notes nullable
```

Tipos:

```text
ACCESS
CORRECTION
DELETION
ANONYMIZATION
CONSENT_REVOCATION
DATA_EXPORT
OTHER
```

# C.4.11 Exclusão não significa apagar tudo

Esse ponto é importante.

Se o cliente pede exclusão, não podemos simplesmente destruir:

```text
pagamentos
contratos
reservas
obrigações legais
```

que precisam ser preservadas por motivo legítimo.

Então o fluxo será algo como:

```text
pedido de exclusão
↓
avaliar dados que podem ser apagados
↓
apagar ou anonimizar o que não precisa ser mantido
↓
preservar registros exigidos
```

# C.4.12 Anonimização

Depois do período necessário, registros históricos podem ser transformados.

Exemplo:

```text
João da Silva
CPF xxx
telefone xxx
```

pode virar:

```text
Cliente anonimizado
ID histórico
```

mantendo apenas o que for necessário para estatísticas ou integridade contábil.

# C.4.13 Retenção por categoria

Eu não colocaria um prazo único para tudo.

Vamos definir política por categoria:

```text
dados de autenticação
dados comerciais
contratos
pagamentos
logs
arquivos temporários
```

Cada tipo pode ter um período próprio.

Esses prazos devem ser configuráveis/documentados e revisados juridicamente antes do lançamento comercial.

# C.4.14 Arquivos temporários

Exemplo:

```text
comprovante temporário
upload abandonado
imagem não vinculada
```

pode ter limpeza automática depois de determinado período.

Isso evita armazenamento virar um cemitério digital.

# C.4.15 Logs

Logs também precisam de retenção.

Não faz sentido guardar para sempre:

```text
IP
user agent
erros antigos
```

sem necessidade.

Então teremos retenção específica para logs técnicos e de segurança.

# C.4.16 Dados sensíveis na interface

Mesmo dentro da agência:

```text
CPF
telefone
e-mail
```

podem aparecer mascarados.

Exemplo:

```text
***.456.789-**
(16) *****-1234
r***@gmail.com
```

E usuário com permissão específica pode visualizar completo.

# C.4.17 Revelar dado completo

Para dado sensível, eu gosto de:

```text
[ Mostrar CPF completo ]
```

e isso pode gerar log:

```text
SENSITIVE_DATA_VIEWED
```

para operações mais críticas.

Assim não entregamos tudo na tela automaticamente.

# C.4.18 Exportação de dados

Analyst não deve conseguir baixar uma planilha com 30 mil clientes só porque tem:

```text
customers.view
```

Teremos uma permissão separada:

```text
customers.export
```

E exportações relevantes ficam auditadas:

```text
quem exportou
quando
quantos registros
```

# C.4.19 Limites de exportação

Podemos inclusive limitar:

```text
até X registros
```

ou exigir aprovação para grandes exports.

Não precisa estar no MVP inicial, mas a permissão separada já entra agora.

# C.4.20 Backups

Backups também contêm dados pessoais.

Então:

```text
acesso extremamente restrito
criptografia
retenção definida
```

e nunca disponíveis pelo painel da agência ou Super Admin comum.

# C.4.21 Ambiente de desenvolvimento

Regra importante:

> **não usar dados reais de passageiros em desenvolvimento/teste.**

Usaremos dados fictícios.

Nada de copiar produção para notebook de desenvolvedor.

# C.4.22 Erros e monitoramento

Ferramentas de erro não devem receber:

```text
CPF
contrato
token
dados completos de pagamento
```

por acidente.

Precisamos sanitizar payloads antes de enviar para monitoramento.

# C.4.23 Notificações

E-mail e WhatsApp devem conter apenas os dados necessários.

Exemplo ruim:

```text
CPF completo do passageiro dentro do WhatsApp
```

sem necessidade.

Exemplo adequado:

```text
Reserva RES-1842 confirmada
Viagem Ubatuba
```

# C.4.24 Marketplace

Mantemos nosso desenho:

```text
Marketplace
→ precisa do mínimo necessário para realizar a compra e repasse
```

Depois da venda, o relacionamento completo fica na agência.

No painel Super Admin do Marketplace:

```text
referência da venda
agência
viagem
valores
repasse
```

e não dados pessoais completos do cliente.

# C.4.25 Parceiros e afiliados

João, afiliado, não recebe:

```text
nome dos clientes
telefone
CPF
```

Ele precisa apenas de:

```text
quantidade de vendas
valor de comissão
status
```

Se futuramente criarmos portal do parceiro, ele seguirá essa regra.

# C.4.26 Agência parceira

Mesma coisa.

A agência parceira pode ver:

```text
quantidade de passageiros atribuídos
receita atribuída
resultado
valor a receber
```

mas não automaticamente toda a base de clientes da organizadora.

# C.4.27 Incidente de segurança

Precisamos prever um cadastro:

```text
security_incidents
--------------------------------
id

agency_id nullable

incident_type
severity

detected_at
status

description

contained_at nullable
resolved_at nullable

created_by
```

Isso ajuda a registrar:

```text
acesso indevido
vazamento potencial
token comprometido
comportamento suspeito
```

# C.4.28 Revogação de acesso

Se houver suspeita:

```text
revogar sessão
desativar usuário
rotacionar segredo
desconectar integração
```

precisa ser possível rapidamente.

# C.4.29 Privacy by design

Quero isso escrito literalmente na especificação:

```text
PRIVACY BY DESIGN
```

Ou seja, não vamos criar primeiro um sistema que mostra tudo e depois tentar esconder.

Desde o banco:

```text
tenant isolation
mínimo privilégio
storage privado
logs sem PII
mascaramento
```

já fazem parte da arquitetura.

# C.4.30 Base legal e revisão jurídica

A plataforma precisa permitir registrar consentimentos quando necessários, mas **não vamos codificar a LGPD como se fosse uma tabela de regras jurídicas universais**.

Antes do lançamento comercial:

- política de privacidade;
- termos de uso;
- contrato padrão;
- prazos de retenção;
- política para menores;
- responsabilidades Marketplace × agência;

devem ser revisados por profissional jurídico com experiência em turismo, consumidor e proteção de dados.

O sistema fica preparado para executar essas regras, mas não inventa a interpretação jurídica.
