# Rastreabilidade das fontes

Conversa de origem: “Analisar alerta do Defender”, ID `6aa5b443-496c-83e9-8680-64eccc1cb052`.
Recuperação em 13/09/2026: 11 páginas, 104 turnos; paginação percorrida até hasMore=false. Nenhuma mensagem recuperada atingiu o limite de 20.000 caracteres por item.

O título vem do início da conversa. Trechos sobre Defender, limites de uso, custo estimado de outro aplicativo e imagens não relacionadas não integram a especificação. O DOCX particular não foi redistribuído; usamos as decisões de incorporação ao V2 explicitadas na própria conversa, sem alegar nova leitura do anexo original.

Não foram incluídos tokens, credenciais ou dados pessoais do contrato particular. Os exemplos restantes são exemplos da especificação, não cadastro de produção.

## Precedência

G.1 mais recente prevalece; depois os blocos consolidados F/E e detalhes A/B/C/D compatíveis. Templates SaaS/Add-on/Marketplace vêm dos respectivos modelos; contrato de viagem vem do V2 posterior. Valores e versões técnicas citados como exemplos não são garantias atuais de terceiros.

## Cobertura das 55 decisões G.1

| ID | Decisão | Documentos que aplicam |
|---|---|---|
| G.1.1 | Reserva: status oficial | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.2 | Marketplace: regra definitiva | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.3 | Marketplace não duplica reserva | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.4 | Marketplace e pós-venda | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.5 | Reembolso Marketplace | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.6 | Mercado Pago no Marketplace | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.7 | Taxa Marketplace x taxa financeira | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md) |
| G.1.8 | Receita da viagem | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md) |
| G.1.9 | Venda x recebimento | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md) |
| G.1.10 | Dinheiro no código | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md) |
| G.1.11 | Arredondamento | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md) |
| G.1.12 | Super Admin | [PERMISSIONS.md](PERMISSIONS.md), [SECURITY.md](SECURITY.md) |
| G.1.13 | Marketplace é exceção financeira limitada | [PERMISSIONS.md](PERMISSIONS.md), [SECURITY.md](SECURITY.md) |
| G.1.14 | Admin x Analyst | [PERMISSIONS.md](PERMISSIONS.md), [SECURITY.md](SECURITY.md) |
| G.1.15 | Cliente global | [PERMISSIONS.md](PERMISSIONS.md), [SECURITY.md](SECURITY.md) |
| G.1.16 | Dados pessoais | [PERMISSIONS.md](PERMISSIONS.md), [SECURITY.md](SECURITY.md) |
| G.1.17 | Passageiro x comprador | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.18 | Vaga pertence ao passageiro | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.19 | Disponibilidade nunca é campo manual | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.20 | SOLD_OUT | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.21 | Troca de veículo | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.22 | Trip status x Operation status | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.23 | Publicação x viagem | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.24 | Remover publicação | [BUSINESS_RULES.md](BUSINESS_RULES.md), [DATABASE.md](DATABASE.md), [SCREENS.md](SCREENS.md) |
| G.1.25 | Cancelamento do cliente | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.26 | Cancelamento pela agência | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.27 | Crédito | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.28 | Crédito não é saldo mutável | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.29 | Pagamento nunca é apagado | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.30 | Webhook não “manda” no sistema | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.31 | Reserva expirada + pagamento atrasado | [BUSINESS_RULES.md](BUSINESS_RULES.md), [INTEGRATIONS.md](INTEGRATIONS.md) |
| G.1.32 | Contratos | [CONTRACTS.md](CONTRACTS.md), [templates/TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| G.1.33 | Contratos assinados | [CONTRACTS.md](CONTRACTS.md), [templates/TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| G.1.34 | ZapSign | [CONTRACTS.md](CONTRACTS.md), [templates/TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| G.1.35 | Aceite interno | [CONTRACTS.md](CONTRACTS.md), [templates/TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| G.1.36 | Consentimento de imagem | [CONTRACTS.md](CONTRACTS.md), [templates/TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| G.1.37 | Seguro viagem | [CONTRACTS.md](CONTRACTS.md), [templates/TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| G.1.38 | Financeiro geral | [MVP.md](MVP.md), [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| G.1.39 | Fechamento financeiro | [MVP.md](MVP.md), [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| G.1.40 | Afiliado | [MVP.md](MVP.md), [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| G.1.41 | Agência parceira | [MVP.md](MVP.md), [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| G.1.42 | Marketplace | [MVP.md](MVP.md), [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| G.1.43 | WhatsApp AI | [MVP.md](MVP.md), [BUSINESS_RULES.md](BUSINESS_RULES.md) |
| G.1.44 | Geolocalização | [MVP.md](MVP.md), [SCREENS.md](SCREENS.md) |
| G.1.45 | Offline | [MVP.md](MVP.md), [SCREENS.md](SCREENS.md) |
| G.1.46 | QR Code | [MVP.md](MVP.md), [SCREENS.md](SCREENS.md) |
| G.1.47 | Domínio personalizado | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.48 | Site e Admin | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.49 | Autenticação entre domínios | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.50 | Fila e Cron | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.51 | Service layer x PostgreSQL RPC | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.52 | Banco não substitui aplicação | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.53 | Frontend não decide regras | [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md) |
| G.1.54 | MVP final consolidado | [MVP.md](MVP.md), [SPEC.md](SPEC.md) |
| G.1.55 | Resultado da auditoria | [MVP.md](MVP.md), [SPEC.md](SPEC.md) |

## Blocos e destino

| Fonte da conversa | Documento |
|---|---|
| A.1–A.6 | SPEC, SCREENS; acesso de suporte antigo limitado por G.1 |
| B.1–B.9 e F.5 | DATABASE, PERMISSIONS, CONTRACTS |
| C.1/E.6 | PERMISSIONS |
| C.2–C.4/F.9 | SECURITY |
| D.1/D.2 | INTEGRATIONS (Mercado Pago e InfinitePay) |
| D.3/D.4/E.7 | INTEGRATIONS (IA futura, notificações, jobs) |
| D.5 | CONTRACTS e INTEGRATIONS |
| D.6 | Adiamento Maps em MVP |
| D.7/D.8 | SECURITY e INTEGRATIONS (Storage/domínios) |
| E.1–E.5/F.6 | BUSINESS_RULES |
| E.8 | SCREENS e PHASE_12 |
| F.1/F.2 | MVP e PHASE_00–14 |
| F.3/F.10 | QUALITY e checklists |
| F.4/F.7/F.8 | ARCHITECTURE e SCREENS |
| Modelos de contratos + V2 | CONTRACTS e templates/ |
| G.1 | AUDIT_G1 e todas as normalizações |

## Identificadores dos turnos centrais

| Fonte | Turno |
|---|---|
| G.1 | 15affe62-024e-4673-b9a5-b70e491b7c90 |
| F.7–F.10 | b5fb2352-3b81-4914-90f0-4ad125541203 |
| F.6 | 66d8b366-5172-4305-9fe1-7c112f4d9783 |
| F.5 | d2661f20-e640-43bc-ac6d-e79a5a60af0b |
| F.4 | 00bdc33d-40d0-4726-973e-854fdc0d8278 |
| F.3 | 9dabe97a-13a5-42e5-b5bb-2077b5d8659b |
| F.2 | c6300d2a-d161-4798-8a49-70986a833668 |
| F.1 | f1543624-f0c5-4a7f-b15c-6ef76caa6944 |
| Contrato de Viagem V2 | c9ab7354-411f-418c-975f-9ffd1c8055f3 |
| SaaS e Add-on | e7dc6547-b8de-49fc-83af-944a1fb50b85 |
| Termo Marketplace/editor | 457e5d8e-c580-4ba4-9fae-059ba8278d0a |

## Detalhamentos deste pacote

Checklists de aceitação, critérios de verificação, nomes de arquivos, resolução editorial de aliases e notas de implementação foram redigidos para tornar as decisões executáveis. Não representam novas condições comerciais. Lacunas permanecem explícitas em DECISIONS.md, em vez de inferidas de exemplos.
