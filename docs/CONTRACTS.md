# Contratos, políticas e documentos

Fontes: B.6, modelos aprovados da conversa, Contrato de Viagem V2, D.5 e G.1.32–37. Os modelos abaixo são a base documental definida na conversa, sujeitos à revisão jurídica de lançamento já prevista; não constituem parecer jurídico novo.

## Biblioteca inicial

| Modelo | Partes | Arquivo |
|---|---|---|
| SaaS | Plataforma ↔ agência | [SAAS.md](templates/SAAS.md) |
| Viagem V2 | Agência ↔ comprador | [TRAVEL_V2.md](templates/TRAVEL_V2.md) |
| Add-on | Plataforma ↔ agência, vinculado ao contrato SaaS | [ADDON.md](templates/ADDON.md) |
| Adesão Marketplace | Plataforma ↔ agência | [MARKETPLACE.md](templates/MARKETPLACE.md) |

V2 substitui o primeiro contrato de viagem. Templates de Add-on/Marketplace existem no núcleo, mas seus módulos não são automaticamente ativados no MVP. O DOCX particular fornecido na conversa não é dependência do fluxo e não é incluído neste repositório público; as decisões incorporadas ao V2 estão preservadas.

## Engine

Editor interno sem Word: títulos, negrito, itálico, listas, tabelas, alinhamento, variáveis, quebras de página e preview. Conteúdo e aparência separados. Tiptap ou equivalente por abstração; persistir structured_content e representação renderizada.

Template publicado é imutável. Editar cria nova versão DRAFT; publicação PUBLISHED e retirada RETIRED não reescrevem reservas anteriores. Policies possuem versões e reservation_policy_snapshots.

Geração combina versão publicada, dados da agência, comprador/passageiros, viagem, embarques, preços/descontos/taxas, entrada/parcelas, políticas e branding. Salvar snapshot, PDF original e hash. Logo e marca d'água configurável realmente integram o PDF. Mudança posterior de logo não altera documento histórico.

A aparência permite cabeçalho/rodapé, fonte/tamanho, margens, numeração e logo/marca d'água por modelo. Watermark nos contratos oficiais vem habilitada por padrão conforme conversa; opacidade ilustrativa não é uma regra comercial.

## Variáveis e validação

Ver [VARIABLES.md](templates/VARIABLES.md). Variável é placeholder tipado autorizado, não expressão SQL ou execução de código. Valor obrigatório ausente bloqueia geração/publicação conforme etapa, com mensagem compreensível. HTML e URLs são sanitizados; tabelas de passageiros/políticas são renderizações controladas.

Campos condicionais: hospedagem, alimentação, Marketplace, substituição e serviços contratados. Embarques são individuais; não usar um único boarding_point para representar incorretamente uma reserva com locais diferentes. Não inserir seguro só porque existe custo interno.

O hash de um PDF não pode ser impresso nele próprio após seu cálculo sem mudar o arquivo. Definir hash do conteúdo/snapshot e hash do arquivo como evidências distintas; hash final e timestamp real de assinatura ficam no registro/evidência de aceite, sem modificar o original congelado.

## Aceite, assinatura e imutabilidade

MVP: PDF, versão, hash, registro de aceite rastreável e SignatureProvider. Aceite inclui usuário, timestamp, IP, user agent, texto aceito, versão e hash; verificar identidade e vínculo com comprador/reserva.

ZapSign entra em PHASE_06/6.1 se pronta; senão MVP 1.1. Se parecer jurídico exigir provedor externo para algum documento, esse documento não entra em operação sem a integração. Não afirmar equivalência jurídica automática entre aceite interno e ZapSign.

Padrão: comprador responsável assina; múltiplos signatários são suportados se política exigir. Documento SENT não é editado; original e assinado são privados e preservados. SIGNED é imutável; mudança gera documento/versão nova e novo aceite quando necessário.

## Políticas e pós-venda

Políticas configuráveis de entrada/quitação, cancelamento por antecedência, no-show, documentação irregular, substituição, transferência, data/destino, bagagem, força maior e mínimo de participantes. Percentuais dos exemplos não são hard-coded nem implantados como regra legal universal.

Cancelamento pela agência: penalidade zero e resolução individual do valor elegível pago por reembolso ou crédito da mesma agência. Simulação e execução usam o mesmo cálculo e snapshot. Remarcação mantém data antiga/nova, motivo e resposta; não inferir aceite do silêncio.

Termos adicionais registram cancelamento, remarcação, substituição, transferência de responsável e ajuste conforme necessidade. Imagem/marketing exigem consentimento específico e separável, com revogação quando aplicável; nunca condição silenciosa para contratar viagem.

## Acesso e lançamento

Cliente lê seus documentos no tenant atual. Equipe usa permissions e máscara apropriadas. SUPER_ADMIN não lê contratos privados de viagem; documentos SaaS/Add-on/adesão pertencem à relação plataforma–agência e recebem escopo próprio.

Revisão jurídica de cancelamento, no-show, inadimplência, força maior, responsabilidade, imagem, tratamento de dados e exigência de assinatura deve ser registrada por versão antes do go-live. Não automatizar SPC/Serasa, perda total universal, autorização perpétua de imagem ou edição retroativa de contrato.
