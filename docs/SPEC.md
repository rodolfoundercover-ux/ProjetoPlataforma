# Especificação do SaaS multiagência

Status: especificação para implementação; o software ainda não foi construído neste pacote.
Fontes: decisões iniciais de produto, blocos A–F e G.1. Em conflitos históricos, prevalece [AUDIT_G1.md](AUDIT_G1.md). Valores ilustrativos não são defaults. Pendências explícitas estão em [DECISIONS.md](DECISIONS.md).

## Objetivo e usuários

Uma única aplicação permite que cada agência configure sua marca, anuncie excursões/viagens, venda pelo painel e pelo site, receba entrada e parcelas, emita contratos, realize embarques e feche o financeiro de cada viagem. Dri Viagens é a primeira agência piloto; não há código comercial exclusivo para ela.

Conta contratante (account) pode ter várias licenças; uma nova agência requer nova licença. O usuário com vínculo em mais de uma agência escolhe qual operar. Identidade de login é global; dados comerciais e pessoais são privados por agência.

| Ator | Responsabilidade |
|---|---|
| SUPER_ADMIN | Contas, licenças, planos, módulos, domínios, integrações técnicas, billing SaaS e mínimo financeiro Marketplace |
| ADMIN | Administração da agência à qual pertence |
| ANALYST | Operações da agência conforme permissões granulares |
| CLIENT | Próprias compras, dependentes, pagamentos, documentos e créditos no tenant atual |
| SYSTEM | Jobs e integrações com escopo técnico explícito |

Afiliado indica por link sem login operacional obrigatório. Agência parceira participa do resultado dos passageiros atribuídos e entra na expansão. Não é outro cargo de ANALYST.

## Mapa de domínio

Account → License → Agency → Trips → Reservations → Reservation Passengers.
Cliente comprador e passageiro são entidades diferentes. Cada passageiro possui preço, categoria, embarque, ocupação e histórico.
Pagamento → alocações em cobranças → avaliação da entrada → confirmação da reserva elegível.
Contrato → versão de template + políticas + dados e branding congelados.
Operação → check-in por passageiro → fim operacional → fechamento financeiro versionado.

## Fluxo que define o MVP

1. Admin configura agência, equipe, regras e identidade visual.
2. Cadastra viagem, preços por categoria, embarques, veículo/assentos, custos e contrato.
3. Abre vendas e publica no site.
4. Cria reserva manual ou cliente faz checkout; holds protegem capacidade.
5. Entrada validamente paga confirma a reserva; parcelas posteriores continuam independentes.
6. Contract Engine gera PDF e registra aceite/assinatura conforme exigência aplicável.
7. Agência trata alterações, cancelamentos parciais, reembolso ou crédito.
8. Equipe opera a viagem pelo celular, online.
9. Agência informa custos reais, calcula e fecha resultado, preservando snapshots e comissões.

## Documentos por responsabilidade

| Documento | Uso |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, módulos, serviços, transações e ambientes |
| [DATABASE.md](DATABASE.md) | Modelo lógico, campos, constraints, índices e RPCs |
| [BUSINESS_RULES.md](BUSINESS_RULES.md) | Estados, invariantes e fluxos |
| [PERMISSIONS.md](PERMISSIONS.md) | Matriz, catálogo e aprovações |
| [SECURITY.md](SECURITY.md) | RLS, sessão, arquivos, privacidade e segredos |
| [SCREENS.md](SCREENS.md) | Jornadas, rotas e comportamento de telas |
| [INTEGRATIONS.md](INTEGRATIONS.md) | Pagamentos, assinatura, notificações e domínios |
| [CONTRACTS.md](CONTRACTS.md) | Engine e modelos contratuais |
| [MVP.md](MVP.md) | Escopo e cortes de lançamento |
| [QUALITY.md](QUALITY.md) | Definição de pronto e validação |
| [SOURCE_MAP.md](SOURCE_MAP.md) | Rastreabilidade da conversa e G.1 |

## Limites do produto

Financeiro da viagem é Core. ERP geral, Marketplace amplo, agências parceiras e WhatsApp IA são expansões. Offline, mapas, QR de check-in, push e lista de espera são futuros. QR de pagamento Pix não é QR de check-in e não está excluído.

Prazos de holds, taxas, comissões, faixas etárias e políticas são parametrizáveis. Prazo comercial consolidado de quitação: uma semana antes da saída, com exceção autorizada por reserva. Não inferir percentuais de entrada ou taxas universais dos exemplos.

## Critério de produto concluído

O piloto deve cumprir PHASE_00–PHASE_14 e os gates de segurança, pagamentos, contratos, restauração e operação real de QUALITY.md. Documentação entregue não equivale a fases de implementação aprovadas.
