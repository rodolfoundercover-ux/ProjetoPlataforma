# Variáveis dos modelos

Todas as variáveis abaixo foram extraídas dos modelos entregues. O schema do Contract Engine deve definir tipo, obrigatoriedade por documento, condição de exibição e origem do snapshot. Nenhuma variável permite acesso arbitrário a banco ou código.

| Grupo | Origem e representação |
|---|---|
| agency_*, account_owner_* | Snapshot dos dados legais/branding da agência e representante |
| platform_*, plan_*, subscription_*, billing_* | Contratação SaaS, sem depender de reserva turística |
| buyer_* | Cliente comprador do tenant da reserva |
| trip_*, destination, departure_*, return_* | Snapshot da viagem e seus termos específicos |
| passenger_*, boarding_* | Passageiros e seus embarques individuais; renderizar tabela para múltiplos |
| base_*, final_*, discount_*, entry_*, remaining_*, payment_* | Motor comercial e financeiro; Decimal formatado para exibição |
| cancellation_*, policy_*, *_policy | Versões de política congeladas, não configuração atual |
| addon_*, activation_*, master_contract_* | Termo ligado ao contrato principal e módulo |
| hotel_*, room_*, meal_*, included_* | Serviços expressamente contratados; condicionais |
| signed_at, signature_provider, document_hash | Evidência real da assinatura/aceite; não inventar no PDF original |

Para campos opcionais ausentes, omitir a cláusula/seção condicional conforme template publicado; para obrigatórios, bloquear com erro identificável. Textos e HTML são sanitizados.

## Catálogo

- `{{account_owner_name}}`
- `{{activation_date}}`
- `{{addon_feature_list}}`
- `{{addon_name}}`
- `{{addon_price}}`
- `{{agency_address}}`
- `{{agency_cadastur}}`
- `{{agency_document}}`
- `{{agency_email}}`
- `{{agency_legal_name}}`
- `{{agency_name}}`
- `{{agency_phone}}`
- `{{base_amount}}`
- `{{billing_cycle}}`
- `{{boarding_address}}`
- `{{boarding_advance_minutes}}`
- `{{boarding_point}}`
- `{{boarding_time}}`
- `{{boarding_tolerance_minutes}}`
- `{{buyer_address}}`
- `{{buyer_birth_date}}`
- `{{buyer_document}}`
- `{{buyer_email}}`
- `{{buyer_name}}`
- `{{buyer_phone}}`
- `{{cancellation_policy_name}}`
- `{{cancellation_policy_table}}`
- `{{cancellation_policy_version}}`
- `{{contract_version}}`
- `{{departure_date}}`
- `{{departure_time}}`
- `{{destination}}`
- `{{discount_amount}}`
- `{{document_hash}}`
- `{{entry_amount}}`
- `{{final_amount}}`
- `{{hotel_information}}`
- `{{included_services}}`
- `{{marketplace_fee}}`
- `{{master_contract_id}}`
- `{{meal_plan}}`
- `{{minimum_passengers}}`
- `{{passenger_replacement_policy}}`
- `{{passenger_table}}`
- `{{payment_cutoff_date}}`
- `{{payment_fee_policy}}`
- `{{payment_schedule}}`
- `{{plan_name}}`
- `{{platform_address}}`
- `{{platform_document}}`
- `{{platform_legal_name}}`
- `{{platform_name}}`
- `{{policy_version}}`
- `{{remaining_amount}}`
- `{{renewal_date}}`
- `{{reservation_code}}`
- `{{reservation_transfer_policy}}`
- `{{return_date}}`
- `{{return_time}}`
- `{{room_type}}`
- `{{signature_provider}}`
- `{{signed_at}}`
- `{{start_date}}`
- `{{subscription_price}}`
- `{{transport_description}}`
- `{{trip_category}}`
- `{{trip_name}}`
- `{{trip_specific_contract_terms}}`

## Particularidades

- boarding_point/address/time não devem sobrescrever embarques individuais: a representação é por passageiro.
- base_amount é preço turístico antes dos descontos; final_amount deve ter significado documentado e não misturar taxa do cliente com receita.
- document_hash exige distinguir hash de conteúdo, hash do PDF original e hash do PDF assinado; evidência externa evita autorreferência impossível.
- signature_provider e signed_at ficam sem evidência concluída enquanto não houver aceite real.
- Termos de cancelamento, troca, transferência e remarcação usam reservation_documents e versões próprias; cláusulas não são modificadas no assinado.
