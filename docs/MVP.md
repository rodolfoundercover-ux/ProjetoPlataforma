# Escopo e lançamentos

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: F.1, F.2, G.1.34–54. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Corte oficial

| Entrega | Classificação |
|---|---|
| Multi-tenant/RLS, licença por agência, equipe/permissões, white-label | MVP |
| Viagens, categorias, embarques, veículos, capacidade e assentos | MVP |
| Clientes, compradores não viajantes, dependentes e reserva manual | MVP |
| Site, checkout e área do cliente | MVP |
| Mercado Pago, InfinitePay, dinheiro autorizado, entrada, parcelas e taxas | MVP |
| Contract Engine, PDF, hashes, snapshots, aceite rastreável | MVP |
| Cancelamentos, reembolsos, créditos, substituição e remarcação | MVP |
| Operação mobile online e fechamento financeiro da viagem | MVP |
| Afiliados sem portal próprio, dashboard essencial, CSV/XLSX e jobs | MVP |
| ZapSign | PHASE_06/6.1 se pronta; caso contrário MVP 1.1, sujeito ao gate jurídico |
| Domínios customizados | Estrutura MVP; automação DNS/SSL não bloqueia piloto com subdomínio |
| Marketplace, agência parceira, WhatsApp IA, Advanced Reports/Finance | Expansão Fase 2 |
| Offline, Maps, QR check-in, Push, Waitlist | Futuro |

**PHASE_02** é a fase técnica de configurações da agência. **Fase 2** é a expansão posterior ao piloto; não são a mesma etapa.

Jobs de expiração, reconciliação e outbox entram quando o domínio nasce; PHASE_11 completa os fluxos e a administração. PHASE_10 prepara interfaces de comissões/settlements e PHASE_13 ativa a atribuição por afiliados, com regressão do fechamento.

## Escopo detalhado por domínio

## F.1.1 Estrutura SaaS e multiagência

Entra no MVP:

```text
Supabase Auth
PostgreSQL
Supabase Storage
RLS
Multi-tenant por agency_id

SUPER_ADMIN
ADMIN
ANALYST
CLIENT
SYSTEM

Accounts
Agencies
Licenses
Plans
Features
Agency Members
Permissions
Branding
Domains
Settings
```

Também entra desde o início a nossa regra mais importante de privacidade:

```text
Super Admin
≠
acesso aos dados privados das agências
```

Ou seja, isso não será algo que tentaremos “consertar depois”.

# F.1.2 White-label

Entra no MVP.

Cada agência poderá ter:

```text
logo
favicon
cores
nome
slogan
WhatsApp
redes sociais
banners
rodapé
```

E inicialmente teremos:

```text
subdomínio da plataforma
```

mais suporte estrutural para domínio próprio.

Eu colocaria domínio customizado já na arquitetura, mas não faria dele requisito para a Dri começar a usar.

Exemplo:

```text
dri.nossaplataforma.com
```

funciona antes mesmo de configurar:

```text
driviagens.com.br
```

# F.1.3 Cadastro de viagens

Entra completo no MVP.

O Admin precisa conseguir criar:

```text
Informações gerais
Destino
Datas
Descrição
Imagens
Itinerário
Inclusos
Não inclusos
Embarques
Categorias
Preços
Veículo
Assentos
Custos
Contrato
Regras comerciais
Data limite de pagamento
Quantidade mínima
Publicação
```

Sem precisar editar diretamente o banco.

# F.1.4 Veículos e assentos

Entra.

Precisamos ter:

```text
modelos de veículos
capacidade
mapa de assentos
assentos bloqueados/inativos
atribuição à viagem
troca de veículo
```

E principalmente:

```text
seat_holds
```

para impedir duas pessoas comprarem o mesmo lugar.

# F.1.5 Clientes e passageiros

Entra.

Com:

```text
comprador
passageiros
dependentes
menores
dados por agência
histórico
```

Identidade global de autenticação continua separada dos dados comerciais de cada agência.

# F.1.6 Reserva manual

**Obrigatória no MVP.**

A Dri precisa conseguir vender diretamente pelo painel:

```text
Viagem
↓
Comprador
↓
Passageiros
↓
Embarque
↓
Assento
↓
Preço
↓
Desconto
↓
Pagamento
↓
Contrato
```

Inclusive para vendas realizadas por telefone ou presencialmente.

# F.1.7 Venda pelo site

Também entra.

O cliente poderá:

```text
escolher viagem
escolher passageiros
informar dados
escolher embarque
escolher assentos
ver valor
pagar
assinar contrato
acompanhar reserva
```

Isso já transforma a plataforma em produto real, não só sistema administrativo.

# F.1.8 Reserva e capacidade

Estados: DRAFT, WAITING_ENTRY, CONFIRMED, CANCELLED, EXPIRED, COMPLETED. Holds ficam separados. Disponibilidade e SOLD_OUT são derivados. Fonte: G.1.1 e G.1.18–20.

# F.1.9 Pagamentos

Aqui quero ser um pouco pragmático.

Entram no MVP:

```text
Mercado Pago
InfinitePay
Dinheiro / registro manual autorizado

Charges
Payments
Payment Allocations
Entrada obrigatória
Parcelas
Pagamento parcial
Overdue
```

O `PaymentPricingEngine` também entra desde o começo.

Não quero construir pagamento “simplificado” agora e depois ter que desmontá-lo inteiro para suportar taxa do cartão.

# F.1.10 Taxas

Entra:

```text
CLIENT
AGENCY
SHARED
```

com possibilidade de:

```text
padrão da agência
+
override da viagem
```

e snapshot na venda.

# F.1.11 Contratos

Entra no MVP o **Contract Engine completo**.

Precisamos ter:

```text
Editor interno
Templates
Versionamento
Variáveis
Logo
Marca d'água
Preview
PDF
Storage
Histórico
```

E os quatro modelos iniciais:

```text
Contrato SaaS
Contrato de viagem
Termo de Add-on
Termo Marketplace
```

Além dos termos adicionais previstos.

# F.1.12 ZapSign

SignatureProvider, PDF, versionamento, hash e aceite interno rastreável são obrigatórios. ZapSign entra em PHASE_06/6.1 se pronta; caso contrário MVP 1.1. Se revisão jurídica exigir provedor externo para um documento, a integração bloqueia o go-live desse documento. Fonte: G.1.34–35.

# F.1.13 Políticas de cancelamento

Entram.

Precisamos de:

```text
políticas versionadas
faixas configuráveis
snapshot por reserva
cancelamento total
cancelamento por passageiro
simulação
```

E o contrato V2 que acabamos de estruturar utiliza essas regras.

# F.1.14 Reembolso e crédito

Entram.

Sem isso a agência fica sem ferramenta justamente quando dá problema.

Precisamos:

```text
refunds
customer wallet
crédito parcial
uso de crédito
reversões
histórico
```

# F.1.15 Remarcação e troca de passageiro

Entram em versão funcional.

Não precisam ter uma nave espacial de automações, mas devem suportar corretamente:

```text
remarcação da viagem
aceite do cliente
substituição de passageiro
histórico
termo adicional
```

# F.1.16 Afiliados

Eu colocaria no MVP.

Porque a estrutura é relativamente simples e pode ser uma ótima ferramenta comercial para as agências.

Entram:

```text
cadastro
links
atribuição
regra de comissão
comissão projetada
comissão final
settlement
```

Portal próprio do afiliado fica para depois.

# F.1.17 Agência parceira

Aqui eu colocaria como **Fase 2**.

A lógica financeira da agência parceira é consideravelmente mais complexa que afiliado.

Não quero que isso atrase o núcleo.

Mas o banco e `commercial_source = PARTNER_AGENCY` já ficam preparados.

# F.1.18 Marketplace

Aqui eu dividiria em duas etapas.

A arquitetura entra desde o começo.

O **Marketplace funcional** pode entrar como uma fase imediatamente posterior ao piloto da Dri.

Porque antes precisamos provar que:

```text
viagem
reserva
pagamento
contrato
operação
financeiro
```

funcionam perfeitamente dentro de uma agência.

Depois ligamos várias agências através do Marketplace.

Isso reduz bastante risco.

# F.1.19 Operação da viagem

Entra no MVP.

Com:

```text
lista de passageiros
embarques
check-in
WAITING
BOARDED
ABSENT
NO_SHOW
mudança de assento
mudança de embarque
ocorrências
iniciar viagem
finalizar operação
```

Tudo mobile-first.

# F.1.20 Offline

Não entra.

Continuamos com:

```text
ONLINE ONLY
```

no MVP.

Offline fica futuro.

# F.1.21 Financeiro da viagem

Entra.

Essa parte é importante demais para adiar.

Precisamos:

```text
custos
estimado
confirmado
real

receita
desconto
taxas
reembolsos
afiliados

resultado projetado
resultado final

fechamento
reabertura versionada
```

O financeiro empresarial geral continua fora.

# F.1.22 Dashboard

Entra uma versão essencial.

Admin terá:

```text
próximas viagens
reservas
passageiros
pagamentos
atrasados
contratos pendentes
ocupação
receita
resultado projetado
```

Mas sem dezenas de gráficos avançados.

# F.1.23 Exportações

Entram:

```text
XLSX
CSV
```

para as principais telas.

Especialmente:

```text
passageiros
reservas
pagamentos
financeiro
custos
```

Exportação respeita permissões e mascaramento.

# F.1.24 WhatsApp com IA

Aqui eu faria outra divisão estratégica.

O backend necessário entra no MVP:

```text
APIs internas
reservas
payment links
availability
```

Mas o **WhatsApp AI completo entra como add-on Fase 2**.

Motivo: ele depende de Meta, IA, templates, custos variáveis, políticas de mensagens e handoff.

O núcleo precisa estar perfeito antes de colocar uma IA vendendo sobre ele.

Isso não muda nossa arquitetura.

Na verdade, melhora.

Quando ativarmos:

```text
WhatsApp AI
```

ele já encontrará APIs estáveis para usar.

# F.1.25 E-mail e notificações

Entram desde o MVP.

Precisamos pelo menos:

```text
reserva confirmada
pagamento
contrato
cobrança
viagem próxima
mudança operacional
cancelamento
```

E notificação interna no painel.

# F.1.26 Jobs

Entram desde o primeiro dia.

Especialmente:

```text
expiração de holds
expiração de reservas pendentes
parcelas vencidas
lembretes
sales_end_at
reconciliação
outbox
```

Essa infraestrutura não deve ser adiada.

# F.1.27 LGPD e segurança

Entram desde o começo.

Não existe:

```text
"fazemos depois"
```

para:

```text
RLS
tenant isolation
Storage privado
permissões
logs
audit
dados sensíveis
segredos
```

Essas são fundações, não features.

# F.1.28 Geolocalização

Futuro.

Como acabamos de decidir:

```text
 Google Maps API
 Mapbox
 geocoding
 rotas
```

No MVP:

```text
endereço textual
cidade
estado
latitude/longitude opcionais
```

# F.1.29 Relatórios avançados

Fase 2 / Add-on:

```text
forecast
coortes
curva histórica de ocupação
comparações avançadas
performance por destino
análises profundas de margem
```

MVP terá o essencial.

# F.1.30 Financeiro avançado

Futuro/add-on:

```text
contas a pagar geral
contas a receber geral
fluxo de caixa empresarial
DRE geral
centros de custo da empresa
conciliação bancária
```

O financeiro da viagem continua Core.

---
