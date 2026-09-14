# Termo de Add-on

> Modelo-base da conversa, preparado para importação no Contract Engine. Status inicial: DRAFT; revisão jurídica pendente. Não publicar automaticamente no seed. Fonte: modelo Add-on; G.1.38/43/54. Os placeholders são substituídos por snapshots validados; condições comerciais não são fixadas por exemplos.

### TERMO DE CONTRATAÇÃO DE SERVIÇOS ADICIONAIS

**Contrato principal:** `{{master_contract_id}}`

**AGÊNCIA:** `{{agency_name}}`

**Módulo contratado:** `{{addon_name}}`

```text
Data de ativação: {{activation_date}}
Valor: {{addon_price}}
Cobrança: {{billing_cycle}}
```

### 1. Objeto

O presente Termo formaliza a contratação pela AGÊNCIA do módulo adicional `{{addon_name}}`, que complementará a licença principal enquanto permanecer ativo.

### 2. Independência do módulo

O cancelamento do módulo adicional não implica automaticamente cancelamento da licença principal da plataforma.

Da mesma forma, a contratação da licença principal não concede automaticamente acesso aos módulos adicionais.

### 3. Funcionalidades contratadas

O sistema insere automaticamente:

```text
{{addon_feature_list}}
```


---

## Exemplo: WhatsApp com IA

O termo pode receber automaticamente:

```text
MÓDULO WHATSAPP COM IA

• consulta de viagens;
• consulta de disponibilidade;
• coleta de dados para reserva;
• geração de checkout;
• consulta de pagamentos;
• encaminhamento para atendimento humano;
• atribuição de parceiro/origem;
• automações contratadas.
```

E uma cláusula específica:

> A automação por inteligência artificial não possui autorização para conceder condições comerciais além dos limites configurados pela AGÊNCIA, aprovar exceções, modificar contratos ou realizar operações administrativas não expressamente disponibilizadas pelas ferramentas internas autorizadas.


---

## Exemplo: Financeiro Avançado

```text
MÓDULO FINANCEIRO AVANÇADO

Contas a pagar
Contas a receber
Fluxo de caixa
DRE
Centros de custo
Conciliação
Relatórios
```

E deixamos claro que o módulo é ferramenta de apoio:

> Os relatórios gerados pelo software não substituem escrituração contábil, orientação fiscal ou atuação de profissional habilitado.

---

## Exemplo: Relatórios Avançados

Descrição de:

```text
dashboards
exportações
indicadores
análises
```

e regras de acesso/permissões.

---

### 4. Serviços de terceiros

Alguns add-ons podem depender de:

```text
WhatsApp/Meta
Mercado Pago
provedores de IA
e-mail
outros serviços externos
```

A disponibilidade desses componentes pode depender dos respectivos terceiros.

### 5. Valores de terceiros

Quando houver cobrança externa não incluída na mensalidade do módulo, isso deverá ser informado antes da contratação.

Exemplo:

```text
Mensalidade do módulo:
R$ X

Consumo externo:
conforme utilização/provedor
```

Consumos externos não incluídos devem ser informados antes da contratação.

### 6. Dados e privacidade

O módulo continua submetido às mesmas regras de isolamento e proteção de dados do contrato principal.

A ativação de um add-on **não dá ao Super Admin acesso aos dados privados da agência**.

### 7. Ativação e cancelamento

```text
ACTIVE
SUSPENDED
CANCELLED
```

A agência poderá desativar o módulo conforme as condições comerciais contratadas.

A desativação não deve destruir automaticamente os registros históricos produzidos enquanto o módulo estava ativo.

### 8. Aceite eletrônico

O termo guarda:

```text
addon
preço
versão
features
usuário que contratou
data/hora
IP
hash
```

como evidência das condições contratadas.

---
