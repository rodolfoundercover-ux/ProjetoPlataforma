# Telas e jornadas

Fontes: A.1–A.6, E.8, F.8 e G.1. Painel e área pública usam os mesmos serviços de domínio.

## Contextos e rotas

| Contexto | Rotas conceituais | Acesso |
|---|---|---|
| Site da agência | /, /viagens, /viagens/[slug], /checkout/[trip], /login | Host verificado; só conteúdo público |
| Cliente | /minha-conta e detalhes de reserva, pagamentos, contratos, créditos, perfil | Proprietário no tenant atual |
| Painel agência | /app, /app/trips, /app/reservations, /app/customers, /app/payments, /app/contracts, /app/partners, /app/approvals, /app/team, /app/settings | Membership ativo + permissão |
| Plataforma | /platform | SUPER_ADMIN, com escopo de plataforma |
| Marketplace / WhatsApp IA | Áreas futuras separadas | Feature, adesão e permissões da expansão |

## Padrões de interação

Interface em português, valores monetários e datas localizados; layout responsivo, prioridade ao celular no embarque. Formulários com rótulos, navegação por teclado, foco visível e mensagens de erro associadas aos campos. Estado vazio explica a próxima ação; carregamento impede duplo envio; erro preserva dados digitados e oferece retry seguro.

Não mostrar tabs/botões sem permissão; o backend continua bloqueando acesso direto. Confirmar ações destrutivas mostrando entidades/valores afetados, motivo e reautenticação quando aplicável. Mascaramento sensível deve ocorrer antes de os dados chegarem ao browser.

## Dashboard da agência

Resumo das próximas viagens, reservas, passageiros, ocupação, entrada/parcelas atrasadas e contratos pendentes. Indicadores financeiros só para quem pode vê-los, separando vendido, recebido e a receber, projeção e resultado fechado. Filtros por período, viagem, status e origem quando disponíveis. Cards abrem a lista que explica o número.

Menu: Dashboard, Viagens, Reservas, Clientes, Pagamentos, Contratos, Parceiros/Afiliados, Aprovações, Equipe e Configurações. ERP geral não aparece no MVP.

## Lista e detalhe da viagem

Lista com busca, filtros, datas, estado comercial, publicação, ocupação derivada e ações autorizadas. Duplicar copia conteúdo/configurações, nunca passageiros, pagamentos, check-ins ou contratos assinados.

Detalhe /app/trips/[tripId] possui abas: Resumo, Passageiros, Reservas, Assentos, Embarques, Preços, Veículo, Custos, Pagamentos, Contratos, Operação, Financeiro, Arquivos e Histórico. As abas respeitam permissão. Cabeçalho distingue estado da viagem, publicação e disponibilidade.

## Nova viagem: assistente

| Etapa | Conteúdo / validação |
|---|---|
| Informações | Título, destino, categoria, datas e janela de vendas válidas |
| Conteúdo | Descrição, imagens, roteiro, incluídos/não incluídos; seguro não anunciado automaticamente |
| Embarques | Reutilizar locais e copiar snapshots; ordem, endereço, horário, tolerância/antecedência |
| Preços | Categorias configuráveis, idade na saída, ocupa assento, preço e mínimo sem aprovação |
| Transporte | Fornecedor, modelo, capacidade, mapa e lugares bloqueados/inativos |
| Custos | Fixos/por passageiro; diretos/compartilhados/sem rateio; estimado/confirmado/real |
| Regras | Entrada, quitação, parcelas, fee bearer, mínimo de participantes e prazo de decisão |
| Contrato | Template publicado, versão/políticas, hospedagem, alimentação e termos específicos |
| Revisão | Pendências explícitas; salvar rascunho; abrir vendas e publicar são ações distintas |

Permitir salvar/reabrir rascunho sem perda. Troca de veículo mostra mapa anterior/novo, migração automática possível e itens para revisão; redução incompatível é rejeitada sem alteração parcial.

## Nova reserva / venda manual

Selecionar viagem → comprador (pode não viajar) → N passageiros/dependentes → categoria/preço individual → embarque individual (atalho aplicar a todos) → assento/hold → desconto e eventual aprovação → origem comercial → revisão → WAITING_ENTRY.

Resumo mostra preço turístico, descontos, taxas, total, entrada, parcelas e prazo. Mostrar expiração e conflitos de assento com ação para selecionar outro. Venda por telefone/presencial usa esse fluxo. Dinheiro exige permissão e confirmação registrada; a tela não oferece atalho para fingir pagamento confirmado.

## Detalhe da reserva

Código, estados comercial e financeiro separados; comprador, passageiros e snapshots; assentos/embarques; cobranças, alocações e pagamentos; contrato/assinatura; comunicações; histórico e aprovações. Adicionar passageiro revalida capacidade e gera ajuste/cobrança/documento. Substituir passageiro não apaga original. Transferir comprador registra novo responsável e termo.

## Pagamento

Escolher provider/método autorizado, ver opções de parcelamento e custo discriminado, gerar Pix ou checkout/link. Página de retorno mostra processamento enquanto backend reconcilia; redirect não prova pagamento. Pagamento tardio exibe situação de análise sem prometer vaga.

Dinheiro é registrado no painel por ator autorizado. Não armazenar cartão/CVV. Sem fallback de Marketplace para InfinitePay/dinheiro.

## Pós-venda

Selecionar passageiros → simular política congelada → exibir pago, retenção, cobranças futuras, reembolso/crédito elegível → registrar escolha e confirmação → executar.

Cancelamento de um entre três preserva os outros dois. Cancelamento integral da viagem mostra impacto e permite resolução individual; penalidade do cliente zero. Crédito apresenta agência emissora, ledger e saldo derivado. Reembolso com falha fica pendente de tratamento, nunca marcado como concluído por clicar no botão.

Remarcação mostra data antiga/nova, motivo e resposta individual do cliente. Ausência de resposta não equivale a aceite.

## Operação mobile

Agrupar passageiros por ponto; pesquisar nome/código e assento; registrar WAITING, BOARDED, ABSENT e NO_SHOW. ABSENT é provisório; NO_SHOW exige decisão operacional. Mudar embarque/assento com permissão e histórico. Exibir alertas de documentação, menores, pagamento e contrato conforme regras, sem inventar cancelamento automático.

Abrir/fechar ponto, iniciar viagem, registrar ocorrências/anexos privados e encerrar operação. RETURNING é opcional. Finalizar leva a AWAITING_FINANCIAL_CLOSE. MVP online; falha de rede deve ser explícita, sem simular sincronização offline.

## Financeiro da viagem

Custos em três estágios, receitas de vendas reais, taxas separadas, descontos, retenções/reembolsos/créditos e resultado por passageiro. CALCULATE gera prévia com bloqueios e alertas; CLOSE confirma snapshot. REOPEN exige motivo e reautenticação, mostra versões e preserva a anterior.

Afiliados: cadastro, links, regra, atribuição, comissão projetada/final e settlement. Sem portal de afiliado nem acesso operacional por link.

## Contratos e configurações

Modelos, políticas, documentos gerados e assinados. Editor possui conteúdo e aparência separados: variáveis permitidas, títulos/listas/tabelas, quebras de página, logo, marca d'água, cabeçalho, rodapé, margens e numeração. Preview com dados fictícios; publicar congela versão; edição posterior cria nova.

Configurações: dados legais/Cadastur, contatos, categorias, regras comerciais, branding/fontes, domínio, integrações, equipe e perfis. Segredos nunca reaparecem em formulários após gravação.

## Site white-label e cliente

Home com identidade, banners, viagens em destaque e busca; listagem e página de viagem com datas, preços/categorias, roteiro, incluídos/não incluídos, embarques e disponibilidade. Editor usa templates/controles seguros, não código arbitrário.

Checkout reaproveita reserva manual e exige login passwordless quando necessário para vínculo seguro. Área do cliente mostra só compras da agência atual, pagamentos/vencimentos, contratos, créditos, passageiros próprios e solicitações. Recomendações entre agências são expansão, sem expor compras privadas.

## Super Admin

Agências, contas/licenças, planos/módulos, domínios, templates globais, billing SaaS, integrações/health, jobs e logs sanitizados. Marketplace futuro mostra apenas valores e referências técnicas necessários ao repasse. Não há botão de impersonação nem telas de clientes, contratos de viagem, custo/lucro da agência ou wallet.

## Relatórios e exportações

CSV e XLSX nas principais listas, filtros equivalentes à tela, permissão separada de exportação e mascaramento. Exportação grande em job; arquivo privado temporário e auditado. Aplicar proteção de conteúdo de células ao exportar para não executar fórmulas fornecidas por usuários.

Indicadores detalhados e seus cortes:

# E.8.1 Dashboard principal da agência

Ao entrar no painel, o Admin verá informações realmente acionáveis.

Algo nessa linha:

```text
HOJE

Próximas viagens             4
Reservas aguardando entrada  7
Pagamentos atrasados         12
Contratos pendentes          5
Aprovações pendentes         3

PASSAGEIROS

Confirmados próximos 30 dias 184
Vagas disponíveis            76

FINANCEIRO DAS VIAGENS

Vendido no período          R$ 148.500
Recebido                    R$ 121.300
A receber                   R$  27.200
Resultado projetado         R$  38.400
```

Os valores financeiros sempre respeitam as permissões do usuário.

---

# E.8.2 Filtros globais

Os dashboards precisam aceitar filtros como:

```text
Período

Viagem

Destino

Origem comercial

Canal de venda

Status da reserva

Status financeiro

Afiliado

Agência parceira
```

E o filtro de período precisa ficar claro.

Exemplo:

```text
Data da venda
```

não deve ser confundido com:

```text
Data da viagem
```

Vamos permitir selecionar qual dimensão temporal está sendo analisada quando isso fizer diferença.

---

# E.8.3 Indicadores comerciais

A agência poderá acompanhar:

```text
Reservas criadas
Reservas confirmadas
Passageiros vendidos
Receita vendida
Ticket médio
Preço médio por passageiro
Desconto concedido
Conversão de reservas
Cancelamentos
No-show
```

O ticket médio e preço médio precisam ser calculados com base nas vendas reais, não no preço cadastrado atualmente na viagem.

---

# E.8.4 Conversão

Podemos ter métricas como:

```text
Reservas iniciadas       100
Reservas confirmadas      72

Conversão                 72%
```

Mas precisamos definir corretamente o denominador.

Um checkout que expirou pode contar como tentativa.

Uma reserva manual criada por funcionário pode ter comportamento diferente.

Portanto, a métrica deve mostrar sua definição na interface para não gerar números mágicos.

---

# E.8.5 Origem das vendas

Esse relatório será muito importante.

Exemplo:

```text
DIRECT              R$ 80.000
AFFILIATE           R$ 25.000
PARTNER_AGENCY      R$ 18.000
MARKETPLACE         R$ 25.500
```

E separadamente:

```text
WEBSITE
ADMIN_PANEL
WHATSAPP_AI
MARKETPLACE
```

Assim conseguimos responder duas perguntas diferentes:

```text
Quem originou a venda?
```

e:

```text
Onde a venda foi concluída?
```

---

# E.8.6 Afiliados

Relatório:

```text
Afiliado      Passageiros   Receita     Comissão
João                 18     R$ 22.500   R$ 1.125
Maria                12     R$ 14.700   R$   735
```

Com separação:

```text
Projetado
Aguardando fechamento
Pronto para pagamento
Pago
```

---

# E.8.7 Agências parceiras

A organizadora poderá acompanhar:

```text
Parceira X

Passageiros atribuídos     14
Receita atribuída          R$ 18.500
Resultado projetado        R$  7.200
Resultado final            R$  6.850
Valor já pago              R$  3.000
Saldo                      R$  3.850
```

Sem expor as demais informações privadas da viagem para a parceira.

---

# E.8.8 Marketplace

Para a agência:

```text
Vendas Marketplace
Receita originada
Taxa Marketplace
Taxas financeiras
Valor previsto para repasse
Valor já repassado
Saldo
```

Isso vai deixar muito clara a diferença entre:

```text
VENDA CONFIRMADA
```

e:

```text
DINHEIRO JÁ REPASSADO
```

como definimos anteriormente.

---

# E.8.9 Relatório por viagem

Essa provavelmente será uma das telas mais usadas.

Exemplo:

```text
ARRAIAL DO CABO

Capacidade                  46
Confirmados                 42
Ocupação                  91,3%

Receita vendida        R$ 56.700
Recebido               R$ 52.100
A receber              R$  4.600

Descontos              R$  2.100
Custos estimados       R$ 31.000
Custos reais           R$ 30.500

Taxas financeiras      R$  1.200
Marketplace            R$    450
Afiliados              R$    900

Resultado projetado    R$ 22.950
Resultado final        R$ 23.650
```

Antes do fechamento:

```text
RESULTADO PROJETADO
```

Depois:

```text
RESULTADO FINAL
```

---

# E.8.10 Ocupação

Podemos mostrar evolução da ocupação:

```text
30 dias antes    35%
20 dias antes    52%
10 dias antes    78%
5 dias antes     91%
```

Isso pode ser muito útil depois para aprender quando cada destino costuma vender.

No MVP, basta guardarmos os eventos necessários. O gráfico histórico mais sofisticado pode vir depois.

---

# E.8.11 Passageiros

Relatórios operacionais:

```text
Lista de passageiros
Lista por embarque
Lista por assento
Lista de menores
Lista de contratos pendentes
Lista de pagamentos pendentes
Lista de no-show
```

Sempre respeitando mascaramento e permissões.

---

# E.8.12 Lista de embarque

Exemplo:

```text
RIBEIRÃO PRETO - 05:30

Assento  Passageiro        Status
12       João Silva        CONFIRMED
13       Maria Silva       CONFIRMED
18       Pedro Souza       CONFIRMED
```

Essa lista poderá ser utilizada pela operação.

---

# E.8.13 Financeiro

Relatórios financeiros do MVP ficam limitados ao universo das viagens:

```text
Receitas por viagem
Valores recebidos
Valores a receber
Parcelas vencidas
Custos por viagem
Resultado por viagem
Taxas de gateway
Marketplace
Comissões
Parceiros
Créditos gerados
Reembolsos
```

Não entraremos agora em contabilidade empresarial completa.

---

# E.8.14 Aging de recebíveis

Podemos ter:

```text
A vencer           R$ 22.000
1-7 dias atraso    R$  4.500
8-15 dias          R$  1.200
16+ dias           R$    800
```

Isso ajuda muito a agência a saber onde cobrar.

---

# E.8.15 Formas de pagamento

Exemplo:

```text
PIX                 52%
Cartão              38%
Dinheiro            10%
```

E por provider:

```text
Mercado Pago
InfinitePay
Marketplace Mercado Pago
```

Sem confundir provider com método.

---

# E.8.16 Taxas financeiras

Podemos mostrar:

```text
Taxas absorvidas pela agência

Mercado Pago       R$ 1.200
InfinitePay        R$   650
Marketplace MP     R$   480

Total              R$ 2.330
```

Isso ajuda a agência a entender o custo de oferecer parcelamento.

---

# E.8.17 Descontos

Outro relatório importante:

```text
Descontos concedidos

Viagem            Valor
Ubatuba            R$ 1.200
Arraial            R$   850
Caldas Novas       R$   430
```

E podemos detalhar:

```text
usuário que concedeu
aprovador
motivo
```

quando houver permissão.

---

# E.8.18 Cancelamentos e reembolsos

Indicadores:

```text
Cancelamentos
Valor originalmente vendido
Valor retido
Valor reembolsado
Crédito concedido
```

Separando:

```text
cliente cancelou
agência cancelou
```

porque representam situações muito diferentes.

---

# E.8.19 Contratos

Dashboard:

```text
Gerados             180
Aguardando assinatura 12
Assinados           165
Recusados             3
```

Também podemos filtrar por viagem.

---

# E.8.20 Operação

Depois da viagem:

```text
Passageiros esperados    46
Embarcados               44
No-show                   2
Ocorrências               1
```

E por ponto de embarque:

```text
Ribeirão Preto  20/20
Cravinhos        8/9
Bebedouro       16/17
```

---

# E.8.21 Performance das viagens

Podemos comparar:

```text
Viagem            Ocupação    Resultado   Margem
Ubatuba               96%      18.500      31%
Arraial               91%      23.650      42%
Caldas Novas          72%       8.200      18%
```

Isso ajuda a agência a decidir quais destinos repetir.

---

# E.8.22 Destinos

Futuramente podemos analisar:

```text
Destino
Quantidade de viagens
Passageiros
Receita
Ocupação média
Resultado médio
```

Isso já pode existir em formato simples no MVP.

---

# E.8.23 Clientes recorrentes

Podemos identificar:

```text
Clientes novos
Clientes recorrentes
Número médio de viagens por cliente
```

Mas sempre dentro da própria agência.

A Dri não descobre que um cliente também compra de outra agência da plataforma.

---

# E.8.24 Dashboard do Analyst

O Analyst vê apenas indicadores relativos às permissões dele.

Exemplo:

Se não possui:

```text
trip_financial.view
```

não verá:

```text
lucro
custos
margem
```

Mesmo que esteja no dashboard principal.

Os cards simplesmente não aparecem.

---

# E.8.25 Dashboard do Super Admin

Aqui precisamos ser extremamente cuidadosos.

Super Admin pode acompanhar a plataforma:

```text
Agências ativas
Licenças
Trials
Planos
Módulos ativos
Uso de storage
Saúde das integrações
Domínios
Erros técnicos
Marketplace
Receita do próprio SaaS
```

Mas não:

```text
Receita total privada da Dri
Lucro da Dri
Custos da Dri
Clientes da Dri
```

---

# E.8.26 Métricas agregadas da plataforma

Podemos permitir dados não sensíveis como:

```text
Número total de viagens criadas
Número de reservas processadas
Volume de mensagens
Uso de storage
Quantidade de documentos
```

desde que não revelem informações privadas indevidas.

---

# E.8.27 Marketplace no Super Admin

Marketplace é a exceção financeira.

Super Admin pode ver:

```text
Vendas originadas pelo Marketplace
Taxa Marketplace
Valores processados no canal
Valores a repassar
Valores repassados
```

porque a plataforma faz parte daquela transação.

Mesmo assim, não precisa conhecer identidade do passageiro.

---

# E.8.28 Receita SaaS

Super Admin também precisa ver:

```text
MRR
Assinaturas
Add-ons
Agências inadimplentes
Trials
Cancelamentos de licença
```

porque isso pertence à própria plataforma.

Isso não viola a separação financeira das agências.

---

# E.8.29 Exportação

Vamos permitir:

```text
CSV
XLSX
```

nos relatórios em que fizer sentido.

PDF podemos oferecer para alguns relatórios operacionais ou executivos.

Mas não quero tornar PDF obrigatório para todo relatório.

---

# E.8.30 Excel

Como nossas agências provavelmente vão trabalhar bastante com Excel, eu considero **XLSX uma exportação importante desde o MVP**.

Exemplo:

```text
[ EXPORTAR EXCEL ]
```

para:

```text
passageiros
reservas
pagamentos
financeiro da viagem
custos
afiliados
```

---

# E.8.31 Permissão de exportação

Como já definimos:

```text
visualizar
≠
exportar
```

Então poderemos ter permissões como:

```text
customers.export
reservations.export
payments.export
trip_financial.export
```

Não basta conseguir abrir a tela.

---

# E.8.32 Exportações sensíveis

Se a exportação incluir:

```text
CPF
telefone
e-mail
```

o usuário precisa também possuir:

```text
customers.view_sensitive_data
```

Caso contrário, o arquivo sai mascarado.

---

# E.8.33 Auditoria das exportações

Exportações relevantes registram:

```text
quem exportou
quando
qual relatório
quantidade de registros
filtros aplicados
```

Sem copiar os dados exportados para o audit log.

---

# E.8.34 Limite

Para evitar alguém solicitar:

```text
2 milhões de linhas
```

e fazer o servidor virar uma torradeira 🔥,

exports maiores podem ser processados em background.

Fluxo:

```text
Solicitar exportação
↓
job
↓
arquivo privado
↓
notificação
↓
download temporário
```

---

# E.8.35 Arquivo exportado

Exportações temporárias ficam no Storage privado.

Podem expirar depois de:

```text
X horas/dias
```

conforme política.

Não precisamos guardar eternamente uma planilha com milhares de CPFs.

---

# E.8.36 Relatórios salvos

Podemos futuramente permitir:

```text
Salvar visão
```

Exemplo:

```text
"Minhas parcelas vencidas"
```

com filtros já configurados.

Não é essencial para MVP.

---

# E.8.37 Relatórios agendados

Também fica para futuro:

```text
Toda segunda às 08:00
→ enviar relatório financeiro
```

A arquitetura de jobs já suporta isso depois.

---

# E.8.38 Power BI

Eu **não colocaria Power BI como dependência da plataforma**.

Nossa aplicação terá seus próprios dashboards.

Mas futuramente podemos disponibilizar:

```text
API de relatórios
export estruturado
conector
```

para quem quiser usar Power BI externamente.

Assim não amarramos o SaaS a uma licença Microsoft.

---

# E.8.39 Advanced Reports

Como já definimos módulos pagos, algumas análises mais sofisticadas podem entrar em:

```text
ADVANCED_REPORTS
```

Exemplo:

```text
comparação entre períodos
forecast
coortes
retenção de clientes
performance histórica por destino
curva de ocupação
análise avançada de margem
```

O MVP fica com os indicadores essenciais.

---

# E.8.40 Fonte única dos números

Essa regra precisa ficar muito clara para o Codex:

> **Dashboard não guarda número manualmente.**

Ele calcula a partir das entidades oficiais.

Exemplo:

```text
Receita
→ reservation_passengers / financial snapshots

Recebido
→ payments / allocations

Custos
→ trip_costs

Marketplace
→ marketplace_sales / payouts
```

Evita termos:

```text
dashboard_total_revenue
```

que alguém precisa sincronizar manualmente.

---

# E.8.41 Snapshots históricos

Para períodos já fechados, podemos usar:

```text
trip_financial_closures
```

porque representam o resultado oficial daquela versão.

Assim um relatório histórico não muda porque algum cadastro atual foi alterado.

---

# E.8.42 Data de atualização

Todo dashboard deve indicar algo como:

```text
Atualizado há poucos segundos
```

ou:

```text
Última atualização: 16:48
```

principalmente quando alguma métrica utilizar processamento assíncrono.

---
