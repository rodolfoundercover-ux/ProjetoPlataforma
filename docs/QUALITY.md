# Qualidade e definição de pronto

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: F.3, F.10 e G.1. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Evidência de aceitação

Todos os checklists iniciam desmarcados. Registrar comando/teste, ambiente, resultado e evidência por critério na fase. Não declarar concluída uma integração somente com fake; fake valida contrato interno, sandbox/ambiente controlado valida adapter.

Testes globais: isolamento A/B, CLIENT A/B, SUPER_ADMIN privado negado, IDOR, permissões, upload/HTML malicioso, concorrência de último assento e última vaga, pagamento versus expiração, webhook repetido/fora de ordem, débito de wallet concorrente, cancelamento parcial e fechamento reaberto.

Go-live requer ensaio de restauração de banco e arquivos críticos, rollback, credenciais reais configuradas sem exposição, revisão jurídica prevista e operação controlada da Dri. Nenhum teste ou piloto foi executado por este pacote documental.

# F.3.1 Regra geral de conclusão

Nenhuma fase será considerada pronta apenas porque:

```text
a tela abriu
o botão apareceu
a migration rodou
o código compilou
```

Para receber:

```text
 DONE
```

precisa cumprir todos os critérios técnicos e funcionais daquela fase.

# F.3.2 Definition of Done

Para cada funcionalidade, o Codex deverá validar:

```text
FUNCTIONAL
SECURITY
DATA INTEGRITY
PERMISSIONS
UX
ERROR HANDLING
AUDIT
TESTS
DOCUMENTATION
```

Se uma dessas áreas aplicável estiver quebrada:

```text
STATUS = NOT_DONE
```

# F.3.3 Funcionalidade

A operação principal precisa funcionar de ponta a ponta.

Exemplo para reserva:

```text
criar comprador
↓
adicionar passageiros
↓
escolher embarque
↓
escolher assentos
↓
calcular preço
↓
criar reserva
↓
persistir corretamente
```

Não aceitaremos uma tela com dados mockados sendo tratada como funcionalidade concluída.

# F.3.4 Dados reais

Depois que uma entidade for criada e a página atualizada:

```text
F5
```

ela continua existindo.

Isso parece óbvio, mas evita aquele clássico:

```text
"funciona lindamente"

desde que ninguém recarregue a página
```

# F.3.5 Fonte única de verdade

Nada de duplicar regras importantes em vários lugares.

Exemplo:

```text
Preço da reserva
```

não será calculado uma vez no frontend, outra no WhatsApp e outra no Marketplace.

Teremos:

```text
Pricing / Reservation service
```

como fonte oficial.

Mesma regra para:

```text
vagas
pagamentos
taxas
parcelamento
cancelamentos
```

# F.3.6 Segurança multi-tenant

Toda fase que criar tabela tenant deve provar:

```text
Agency A → Agency A 
Agency A → Agency B 
```

Não basta colocar:

```text
WHERE agency_id = ...
```

no frontend.

RLS e backend precisam proteger.

# F.3.7 Testes cross-tenant obrigatórios

Sempre que surgir uma nova entidade tenant:

```text
Trip
Reservation
Payment
Contract
File
Customer
...
```

devemos adicionar teste tentando acessar a entidade com usuário de outra agência.

Resposta esperada:

```text
DENIED
```

# F.3.8 Super Admin

Também teremos teste permanente:

```text
Super Admin
↓
SELECT private agency_customer
↓
DENIED
```

A menos que seja uma tabela explicitamente de plataforma/Marketplace que ele possa acessar.

Isso vira teste de regressão.

# F.3.9 IDOR

Precisamos testar troca manual de IDs.

Exemplo:

```text
/reservations/RESERVA_DRI
```

usuário da Agência X altera para aquele ID.

Resultado:

```text
404 / 403
```

Nunca dados da Dri.

# F.3.10 Permissões

Botão escondido não vale como controle de segurança.

Exemplo:

```text
Analyst sem payments.refund
```

não vê:

```text
[ REEMBOLSAR ]
```

Mas também, se chamar a API diretamente:

```text
POST /refund
```

deve receber:

```text
403
```

# F.3.11 Integridade referencial

Entidades relacionadas não podem atravessar tenants.

Exemplo proibido:

```text
Reservation agency_id = DRI
Trip agency_id = RODOLFO
```

Sempre que fizer sentido, teremos constraints/FKs compostas.

# F.3.12 Concorrência

Fluxos com recursos limitados precisam de testes concorrentes.

Principalmente:

```text
assentos
vagas
pagamentos
webhooks
repasse
```

Exemplo:

```text
Cliente A escolhe assento 12
Cliente B escolhe assento 12
```

Somente um vence.

# F.3.13 Operações financeiras transacionais

Processos financeiros importantes precisam ser atômicos.

Exemplo:

```text
pagamento confirmado
+
allocation
+
charge atualizada
+
reserva confirmada
+
audit event
```

Ou tudo acontece corretamente, ou a transação volta.

Não podemos ficar com:

```text
payment = CONFIRMED
reservation = WAITING_ENTRY
```

por falha no meio sem mecanismo de recuperação.

# F.3.14 Idempotência

Toda integração externa crítica deve suportar repetição.

Exemplo:

```text
Mercado Pago webhook 123
```

chega três vezes.

Resultado:

```text
1 payment confirmation
```

não três.

Mesma regra para:

```text
InfinitePay
ZapSign
WhatsApp
outbox
```

# F.3.15 Valores monetários

PostgreSQL numeric(14,2); TypeScript Decimal ou representação monetária tipada equivalente, sem cálculos críticos com JS number. Centavos são conversão de adapter quando exigida. Fonte: G.1.10.

# F.3.16 Arredondamento

Teremos regra central para:

```text
parcelamento
taxas
percentuais
comissões
rateio
```

Se:

```text
R$ 100 / 3
```

resultar em:

```text
33,33
33,33
33,34
```

o total precisa continuar:

```text
R$ 100,00
```

# F.3.17 Datas e timezone

Persistência:

```text
UTC
```

Interface:

```text
timezone da agência
```

A Dri inicialmente:

```text
America/Sao_Paulo
```

Jobs precisam respeitar isso.

# F.3.18 Datas comerciais

Precisamos diferenciar:

```text
created_at
departure_date
payment_due_date
sale_date
signed_at
financial_close_at
```

Nada de reutilizar uma coluna de data genérica para conceitos diferentes.

# F.3.19 Histórico

Entidades críticas não podem perder histórico por edição.

Exemplo:

```text
passageiro trocado
```

não vira simplesmente:

```text
UPDATE nome
```

Assim como:

```text
veículo
assento
embarque
preço
política
contrato
```

precisam manter histórico quando aplicável.

# F.3.20 Soft delete

Dados comerciais:

```text
reservation
payment
contract
trip com venda
customer relacionado
```

não serão hard deleted em operações normais.

Usamos:

```text
status
archived_at
cancelled_at
deleted_at
```

conforme domínio.

# F.3.21 Hard delete

Será reservado principalmente para:

```text
rascunho sem dependências
upload abandonado
configuração descartável
```

com verificações no backend.

# F.3.22 Logs e auditoria

Não é necessário auditar cada clique do mouse.

Mas ações críticas precisam aparecer no `audit_logs`.

Exemplo:

```text
PAYMENT_REFUNDED
TRIP_CANCELLED
DISCOUNT_APPROVED
CONTRACT_TEMPLATE_PUBLISHED
PERMISSION_CHANGED
FINANCIAL_CLOSE_REOPENED
```

# F.3.23 Audit log imutável

Usuários normais não poderão:

```text
editar
deletar
```

audit logs.

Senão seria um diário onde o ladrão também tem borracha.

# F.3.24 PII nos logs

Nunca registrar:

```text
senha
OTP
token
CVV
cartão completo
secret
CPF completo sem necessidade
conteúdo integral de contrato
```

Logs técnicos precisam ser sanitizados.

# F.3.25 Erros para o usuário

Nada de apresentar:

```text
PostgresError 23505 duplicate key...
```

para cliente.

A interface mostra:

```text
Este assento acabou de ser ocupado.
Escolha outro assento.
```

Enquanto o erro técnico completo fica em monitoramento seguro.

# F.3.26 Loading states

Qualquer ação assíncrona deve indicar:

```text
carregando
processando
concluído
falhou
```

Botão não pode parecer morto enquanto o backend trabalha.

# F.3.27 Double-click

Botões críticos precisam evitar:

```text
clique
clique
clique
```

criando três reservas.

Além do bloqueio visual, backend deve ser idempotente quando aplicável.

# F.3.28 Mobile

Tudo relacionado ao cliente e operação precisa funcionar bem em celular.

Principalmente:

```text
checkout
área do cliente
check-in
lista de passageiros
assentos
WhatsApp handoff futuro
```

Não aceitaremos apenas desktop espremido numa tela pequena.

# F.3.29 Desktop

Admin terá foco maior em desktop, mas páginas importantes continuam responsivas.

Especialmente:

```text
reservas
viagens
aprovações
operação
```

# F.3.30 Acessibilidade básica

Precisamos pelo menos:

```text
labels
teclado
focus states
contraste adequado
mensagens de erro claras
HTML semântico
```

Não precisa virar um projeto separado no MVP, mas também não vamos construir uma armadilha digital.

# F.3.31 Confirmações destrutivas

Ações como:

```text
cancelar viagem
reembolso
reabrir financeiro
remover publicação
```

precisam de confirmação adequada.

A severidade da confirmação acompanha o impacto.

# F.3.32 Empty states

Tela sem registros não deve parecer quebrada.

Exemplo:

```text
Nenhuma viagem cadastrada ainda.

[ Criar primeira viagem ]
```

em vez de apenas uma tabela branca encarando o usuário em silêncio existencial.

# F.3.33 Estado de erro

Se uma API externa cair:

```text
Mercado Pago indisponível
```

o sistema precisa explicar e permitir recuperação.

Não apenas:

```text
Erro.
```

# F.3.34 Integrações simuláveis

Cada provider deve ter interface que permita testes.

Exemplo:

```text
PaymentProvider
```

com implementação:

```text
FakePaymentProvider
```

para testes automatizados.

Isso permite validar reserva sem gerar pagamento real.

# F.3.35 Sandbox

Quando providers oferecerem sandbox/test mode:

```text
Mercado Pago
ZapSign
etc.
```

desenvolvimento e homologação devem utilizar isso.

Produção fica isolada.

# F.3.36 Ambientes

Teremos pelo menos:

```text
LOCAL
STAGING
PRODUCTION
```

Com bancos/configurações separados.

Nunca:

```text
rodar migration experimental diretamente em produção
```

# F.3.37 Secrets

Credenciais ficam fora do Git.

Nada de:

```text
ACCESS_TOKEN=abc123
```

commitado.

Usaremos variáveis/secret manager.

# F.3.38 Migrations

Alterações do banco precisam ser versionadas.

Nada de alguém entrar no Supabase e criar uma coluna manualmente sem registrar no projeto.

A fonte oficial será:

```text
migrations/
```

# F.3.39 Seed

Teremos seed de desenvolvimento com dados fictícios.

Por exemplo:

```text
Agência Demo
Viagem Demo
Clientes fictícios
Veículo Demo
```

Nunca dados reais de passageiros.

# F.3.40 Testes

Quero pelo menos quatro camadas:

```text
UNIT
INTEGRATION
RLS / SECURITY
E2E CRITICAL FLOWS
```

Não precisamos testar cada pixel.

Precisamos testar o que pode custar dinheiro ou criar problema operacional.

# F.3.41 Fluxos E2E essenciais

Antes do piloto, obrigatoriamente:

```text
Admin cria viagem
Admin cria reserva
Cliente compra pelo site
Pagamento confirma
Contrato gera
Cancelamento parcial
Troca de passageiro
Check-in
Fechamento financeiro
```

Todos funcionando de ponta a ponta.

# F.3.42 Testes de pagamento

Precisamos validar:

```text
aprovado
pendente
rejeitado
duplicado
webhook atrasado
webhook repetido
pagamento parcial
reembolso
```

# F.3.43 Testes de capacidade

Exemplos:

```text
última vaga
dois compradores simultâneos
troca de veículo
redução de capacidade
cancelamento libera vaga
hold expirado libera vaga
```

# F.3.44 Contratos

Testaremos:

```text
template v1
assinatura/reserva
template muda para v2
contrato antigo continua v1
```

Além de verificar:

```text
logo
marca d'água
variáveis
PDF
hash
```

# F.3.45 Performance

No MVP não precisamos otimizar para milhões de usuários.

Mas páginas comuns não podem fazer algo como:

```text
500 queries para abrir uma viagem
```

Vamos evitar N+1 queries e colocar índices desde o começo nas relações críticas.

# F.3.46 Índices

Especial atenção para:

```text
agency_id
trip_id
reservation_id
customer_id
status
created_at
provider_transaction_id
external_event_id
```

e índices compostos conforme padrões de busca.

# F.3.47 Paginação

Listagens potencialmente grandes precisam de:

```text
paginação
filtros
pesquisa
```

Não carregar 50 mil clientes numa requisição.

# F.3.48 Observabilidade

Precisamos saber responder:

```text
o que falhou?
quando?
em qual integração?
qual request?
```

Sem precisar acessar dados privados indevidos.

Usaremos:

```text
request_id
job_id
event_id
provider_reference
```

# F.3.49 Health checks

Teremos verificações para:

```text
database
storage
workers
outbox
providers
```

para diagnóstico.

# F.3.50 Backup

Antes do piloto real:

```text
backup
restore strategy
```

precisa estar definido.

Backup que nunca foi testado para restauração é apenas um cobertor emocional em formato digital.

# F.3.51 Documentação

Quando o Codex implementar uma fase, ele também precisa atualizar a documentação se a implementação exigir alguma decisão técnica nova.

Mas:

> **Codex não pode alterar regra de negócio sozinho para fazer o código caber.**

Se encontrar conflito:

```text
STOP
REPORT
```

e nós decidimos.

# F.3.52 Proibição de “resolver diferente”

Isso entra forte no `AGENTS.md`.

Exemplo:

```text
Spec:
Super Admin não acessa clientes das agências.
```

O Codex não pode pensar:

```text
"mais simples colocar bypass para Super Admin"
```

e fazer.

Mesmo que tecnicamente seja mais fácil.

# F.3.53 TODO não conta como implementação

Se a fase pede:

```text
refund
```

e houver:

```text
// TODO implement refund
```

não está concluída.

Mesma coisa para mock permanente.

# F.3.54 Feature flags

Funcionalidade incompleta não deve ficar meio disponível.

Pode existir atrás de:

```text
feature flag
```

ou simplesmente não ser exposta até terminar.

# F.3.55 Critério de aceite

Cada fase terá arquivo como:

```text
PHASE_05_ACCEPTANCE.md
```

contendo testes verificáveis.

O Codex precisará responder ao final algo como:

```text
Implemented:
...

Tests executed:
...

Passed:
...

Known limitations:
...

Not implemented:
...
```

Isso facilita nossa revisão.

# F.3.56 Zero “surpresas escondidas”

Se algum item não puder ser implementado:

```text
não esconder
não improvisar regra diferente
```

Deve declarar claramente.

# F.3.57 Piloto

Antes da Dri usar com passageiros reais, faremos ambiente de homologação usando cenário completo fictício.

Algo como:

```text
Viagem Teste
46 lugares
35 passageiros fictícios
Mercado Pago sandbox
cancelamentos
trocas
check-in
fechamento
```

Só depois:

```text
PRODUÇÃO
```

# F.3.58 Go-live

Para liberar produção:

```text
RLS aprovado
migrations aprovadas
backup configurado
providers produção configurados
domínio/SSL funcionando
e-mail funcionando
jobs funcionando
testes E2E aprovados
```

e nenhuma vulnerabilidade crítica conhecida.

# F.3.59 Pós-lançamento

Nos primeiros dias da Dri, teremos atenção maior a:

```text
webhooks
pagamentos
holds
duplicidades
jobs
e-mails
performance
```

porque são os pontos onde bichinhos digitais costumam sair debaixo do tapete.

# F.3.60 Definição final de pronto

Eu colocaria exatamente isto no projeto:

```text
A feature is DONE only when:

- Business rules are implemented.
- Authorization and RLS are enforced.
- Data integrity is protected.
- Applicable audit events exist.
- Errors are handled.
- Critical automated tests pass.
- No mock or TODO remains in the required flow.
- Documentation matches implementation.
- Acceptance criteria pass.
```

E:

```text
"Works on my machine"
is not an acceptance criterion.
```
