# Contrato de Viagem / Excursão V2

> Modelo-base da conversa, preparado para importação no Contract Engine. Status inicial: DRAFT; revisão jurídica pendente. Não publicar automaticamente no seed. Fonte: V2 da conversa; G.1.25–37. Os placeholders são substituídos por snapshots validados; condições comerciais não são fixadas por exemplos.

### CONTRATO DE PRESTAÇÃO DE SERVIÇOS TURÍSTICOS / VIAGEM POR ADESÃO

**AGÊNCIA CONTRATADA**

```text
{{agency_legal_name}}
Nome fantasia: {{agency_name}}
CNPJ/CPF: {{agency_document}}
Cadastur: {{agency_cadastur}}
Endereço: {{agency_address}}
Telefone: {{agency_phone}}
E-mail: {{agency_email}}
```

**CONTRATANTE**

```text
Nome: {{buyer_name}}
CPF/documento: {{buyer_document}}
Nascimento: {{buyer_birth_date}}
Telefone: {{buyer_phone}}
E-mail: {{buyer_email}}
Endereço: {{buyer_address}}
```

**Reserva:** `{{reservation_code}}`

As partes celebram o presente contrato, sujeito às condições da viagem, políticas vinculadas à reserva e demais disposições abaixo.

---

## CLÁUSULA 1ª - OBJETO

O presente contrato tem por objeto a prestação dos serviços turísticos especificados na reserva `{{reservation_code}}`, organizada ou comercializada pela CONTRATADA.

A contratação compreende exclusivamente os serviços expressamente indicados neste instrumento, no resumo da reserva e no descritivo da viagem.


# CLÁUSULA 2ª - DADOS DA VIAGEM

```text
Viagem: {{trip_name}}
Destino: {{destination}}

Data de saída: {{departure_date}}
Data de retorno: {{return_date}}

Horário previsto de saída: {{departure_time}}
Horário previsto de retorno: {{return_time}}

Categoria: {{trip_category}}
```

### Passageiros

```text
{{passenger_table}}
```

A tabela poderá conter:

```text
Nome
CPF/RG/documento
Nascimento
Categoria
Assento
Ponto de embarque
```


# CLÁUSULA 3ª - SERVIÇOS INCLUÍDOS

Integram o pacote exclusivamente os itens expressamente indicados:

```text
{{included_services}}
```

Exemplos possíveis:

```text
Transporte
Hospedagem
Café da manhã
Guia
Ingressos
Passeios
Traslados
Outros
```

A plataforma deverá puxar essa informação diretamente da viagem cadastrada.


# CLÁUSULA 4ª - SERVIÇOS E DESPESAS NÃO INCLUÍDOS

Salvo quando expressamente informados como incluídos, poderão correr por conta do CONTRATANTE despesas como:

```text
alimentação;
bebidas;
frigobar;
serviços de quarto;
despesas pessoais;
telefonemas;
excesso de bagagem;
documentação;
passaportes;
vistos;
taxas consulares;
taxas de embarque;
ingressos;
taxas locais;
transportes não previstos;
e demais despesas não expressamente incluídas no pacote.
```

Para viagens internacionais, o CONTRATANTE é responsável por verificar as exigências migratórias, sanitárias e documentais aplicáveis.


# CLÁUSULA 5ª - HOSPEDAGEM

Quando houver hospedagem:

```text
Hospedagem: {{hotel_information}}
Acomodação: {{room_type}}
Regime de alimentação: {{meal_plan}}
```

Os horários de check-in e check-out observarão as regras do estabelecimento contratado.

Caso determinada refeição não esteja expressamente prevista entre os serviços incluídos, será considerada não incluída.


# CLÁUSULA 6ª - TRANSPORTE

O transporte previsto para a viagem será:

```text
{{transport_description}}
```

A CONTRATADA poderá substituir o veículo originalmente previsto por outro adequado à operação e à quantidade de passageiros, respeitadas as características essenciais do serviço contratado.

Quando houver assentos previamente selecionados, a troca de veículo poderá exigir remanejamento.

Toda alteração ficará registrada no histórico da reserva.


# CLÁUSULA 7ª - EMBARQUE

O passageiro deverá comparecer:

```text
Ponto: {{boarding_point}}
Endereço: {{boarding_address}}
Horário: {{boarding_time}}
Antecedência recomendada: {{boarding_advance_minutes}}
```

portando a documentação necessária.

A agência poderá configurar:

```text
Tolerância para atraso:
{{boarding_tolerance_minutes}} minutos
```

Após o encerramento do embarque, o passageiro ausente poderá ser classificado como `NO_SHOW`.


# CLÁUSULA 8ª - DOCUMENTAÇÃO

É responsabilidade do CONTRATANTE e dos passageiros portar documentos válidos e adequados à viagem.

Isso inclui, quando aplicável:

```text
RG
CPF
passaporte
visto
autorização de menor
documentos sanitários
documentos migratórios
```

A impossibilidade de embarque por documentação irregular será tratada conforme a política vinculada à reserva e a legislação aplicável.


# CLÁUSULA 9ª - PREÇO

```text
Preço comercial: {{base_amount}}
Descontos: {{discount_amount}}
Valor contratado: {{final_amount}}
```

Passageiros diferentes poderão possuir preços diferentes conforme categoria, desconto autorizado ou condição comercial registrada.


# CLÁUSULA 10ª - MEIO DE PAGAMENTO E TAXAS

```text
Entrada: {{entry_amount}}
Saldo: {{remaining_amount}}

Parcelamento:
{{payment_schedule}}
```

A reserva será considerada confirmada quando cumpridas as condições financeiras previstas, inclusive o pagamento da entrada obrigatória.

Eventuais taxas relacionadas ao meio de pagamento serão demonstradas separadamente.

A regra aplicável fica registrada:

```text
{{payment_fee_policy}}
```

Quando:

```text
AGENCY
```

a agência absorve a taxa.

Quando:

```text
CLIENT
```

o acréscimo é apresentado ao cliente antes da confirmação.

---

Quando SHARED, a divisão das taxas será apresentada ao comprador conforme política registrada.

# CLÁUSULA 11ª - QUITAÇÃO

O valor total deverá estar quitado até:

```text
{{payment_cutoff_date}}
```

salvo exceção formalmente autorizada e registrada pela CONTRATADA.


## CLÁUSULA 12ª — INADIMPLÊNCIA

As consequências do atraso obedecerão à política financeira previamente informada e vinculada à reserva. Comunicações de cobrança e eventuais outras medidas observarão as condições da contratação e a legislação aplicável. Não haverá negativação ou cancelamento automático como consequência técnica universal.

## CLÁUSULA 13ª — DESISTÊNCIA E CANCELAMENTO PELO CLIENTE

Aplicam-se a Política de Cancelamento {{cancellation_policy_name}}, versão {{cancellation_policy_version}}, e as faixas abaixo, disponibilizadas na contratação:

{{cancellation_policy_table}}

As condições utilizadas são as congeladas na reserva, observadas as disposições legais aplicáveis.

# CLÁUSULA 14ª - VALORES NÃO RECUPERÁVEIS DE TERCEIROS

Quando o cancelamento envolver valores já comprometidos com fornecedores e que, de acordo com as condições aplicáveis, não sejam recuperáveis, seu tratamento deverá observar a política da reserva e a legislação aplicável.

Exemplos:

```text
ingressos
passagens
hotel
receptivos
transportadoras
restaurantes
outros fornecedores
```

O sistema deverá permitir identificar esses custos na simulação de cancelamento.


## CLÁUSULA 15ª — CANCELAMENTO PELA AGÊNCIA

Se a CONTRATADA cancelar integralmente a viagem, não haverá penalidade de cancelamento para o cliente. O cliente poderá escolher o reembolso de 100% do valor elegível pago ou crédito correspondente na própria agência, conforme condições aplicáveis. A escolha será registrada individualmente na plataforma.

# CLÁUSULA 16ª - NÚMERO MÍNIMO DE PARTICIPANTES

A viagem poderá possuir quantidade mínima necessária para realização:

```text
{{minimum_passengers}}
```

Caso esse mínimo não seja alcançado, a CONTRATADA poderá cancelar a saída conforme as condições e os prazos informados ao cliente.

Nesse caso serão apresentadas as opções aplicáveis de:

```text
reembolso;
crédito;
ou alternativa oferecida pela agência.
```

Também teremos esses prazos configuráveis, em vez de deixá-los eternamente gravados no contrato.


# CLÁUSULA 17ª - REMARCAÇÃO

Caso a CONTRATADA altere substancialmente a data da viagem, o CONTRATANTE será comunicado.

O sistema registrará:

```text
data original;
nova data;
motivo;
aceite do cliente.
```

O CONTRATANTE poderá aceitar a nova data ou solicitar tratamento conforme as condições aplicáveis.


# CLÁUSULA 18ª - TRANSFERÊNCIA PARA OUTRO PASSAGEIRO

A substituição de passageiro será permitida conforme:

```text
{{passenger_replacement_policy}}
```

A política poderá determinar:

```text
prazo máximo;
taxa;
documentação;
necessidade de aprovação.
```

O passageiro anterior permanecerá no histórico.

Será gerado termo adicional quando necessário.


# CLÁUSULA 19ª - TRANSFERÊNCIA DE RESERVA, DATA OU DESTINO

Quando a agência permitir, o CONTRATANTE poderá solicitar:

```text
transferência da reserva para terceiro;
alteração da data;
alteração do destino.
```

As condições serão definidas por:

```text
{{reservation_transfer_policy}}
```

Se houver diferença de preço:

```text
destino mais caro
→ cliente paga diferença

destino mais barato
→ tratamento conforme política de crédito/reembolso
```

Nada disso será feito sobrescrevendo a reserva silenciosamente.


# CLÁUSULA 20ª - NO-SHOW E DESLIGAMENTO

Poderá ser caracterizado `NO_SHOW` quando o passageiro não comparecer ao ponto de embarque dentro da janela operacional definida.

Também poderá haver interrupção da participação quando o comportamento do passageiro colocar em risco:

```text
a própria segurança;
outros passageiros;
equipe;
veículo;
fornecedores;
ou a continuidade da viagem.
```

Qualquer consequência financeira deverá respeitar a política vinculada à contratação e a legislação aplicável.


# CLÁUSULA 21ª - CASO FORTUITO E FORÇA MAIOR

Eventos alheios ao controle razoável das partes, tais como:

```text
enchentes;
bloqueios;
condições climáticas severas;
greves;
epidemias;
determinações de autoridades;
conflitos;
interdições;
e outros eventos inevitáveis,
```

poderão exigir alterações, interrupção, adiamento ou cancelamento da operação.

As medidas adotadas deverão considerar segurança, viabilidade operacional, serviços efetivamente prestados e direitos aplicáveis ao consumidor.


# CLÁUSULA 22ª - ALTERAÇÃO OU REDUÇÃO DE SERVIÇOS

Quando houver substituição de serviço contratado por outro de categoria ou valor inferior e for devida diferença ao CONTRATANTE, esta deverá ser apurada e tratada conforme a legislação e as condições da contratação.


# CLÁUSULA 23ª - FORNECEDORES TERCEIROS

A execução da viagem poderá envolver fornecedores independentes, como:

```text
transportadoras;
hotéis;
guias;
restaurantes;
companhias aéreas;
receptivos;
atrativos.
```

A CONTRATADA realizará as contratações necessárias à execução do pacote.

As responsabilidades de cada participante da cadeia deverão observar a legislação aplicável.


# CLÁUSULA 24ª - BAGAGENS E OBJETOS PESSOAIS

O passageiro deverá observar os limites e regras definidos pelo transportador.

Excessos ou serviços adicionais poderão ser cobrados separadamente.

O passageiro deve zelar por seus objetos pessoais e comunicar imediatamente qualquer ocorrência à equipe responsável.


# CLÁUSULA 25ª - ATIVIDADES E SEGURANÇA

Determinadas atividades poderão possuir requisitos ou riscos próprios.

O CONTRATANTE e os passageiros deverão:

```text
observar orientações;
utilizar equipamentos exigidos;
respeitar restrições;
seguir instruções de segurança.
```

A agência deverá disponibilizar as informações relevantes quando aplicáveis.


## CLÁUSULA 26ª — SEGURO E ASSISTÊNCIA

Seguro-viagem ou assistência somente integrarão o pacote quando expressamente contratados ou indicados nos documentos específicos da reserva.

## CLÁUSULA 27ª — USO DE IMAGEM

A autorização de uso de imagem, quando solicitada, será objeto de consentimento específico e separado da contratação obrigatória da viagem, com registro da decisão e possibilidade de revogação conforme aplicável. A assinatura deste contrato não representa autorização silenciosa, perpétua ou irrevogável de uso de imagem.

# CLÁUSULA 28ª - DADOS PESSOAIS

Os dados serão tratados para:

```text
reserva;
execução da viagem;
identificação;
contratos;
pagamentos;
atendimento;
comunicação operacional;
cumprimento de obrigações.
```

Marketing terá consentimento separado.


## CLÁUSULA 29ª — ORIGEM MARKETPLACE (SOMENTE QUANDO APLICÁVEL)

A reserva foi originada pelo Marketplace da plataforma, utilizando Mercado Pago para processamento da compra. A viagem é organizada e operada por {{agency_name}}, responsável pelo contrato, atendimento, alterações, cancelamentos, créditos, eventuais reembolsos e operação. A reserva confirmada independe do repasse do Marketplace à agência.

# CLÁUSULA 30ª - COMUNICAÇÕES

O cliente autoriza o envio das comunicações estritamente necessárias à reserva através dos dados cadastrados.

Exemplos:

```text
alteração de horário;
embarque;
pagamentos;
contrato;
remarcação;
cancelamento;
informações da viagem.
```

Publicidade permanece separada.


# CLÁUSULA 31ª - CONDIÇÕES ESPECÍFICAS DA VIAGEM

Poderá existir uma seção dinâmica:

```text
{{trip_specific_contract_terms}}
```

Isso é importante.

Por exemplo, determinada excursão pode ter:

```text
regra de ingresso;
restrição de idade;
regra de parque;
bagagem específica;
necessidade de traje;
documentação especial.
```

Sem precisar alterar o contrato padrão para todas as viagens.


## CLÁUSULA 32ª — VERSÃO E IMUTABILIDADE

Versão do contrato: {{contract_version}}
Versão da política: {{policy_version}}

O documento aceito/assinado e suas condições não serão alterados retroativamente. Eventuais alterações gerarão nova versão ou documento e o aceite aplicável, preservado o histórico. A evidência de aceite mantém identidade, data/hora e hashes correspondentes.

# CLÁUSULA 33ª - DECLARAÇÕES FINAIS

O CONTRATANTE declara:

```text
que leu o contrato;

que teve acesso às informações essenciais da viagem;

que conferiu os serviços incluídos;

que conhece as condições de pagamento;

que teve acesso à política de cancelamento;

que prestou informações corretas dos passageiros;

que conhece suas responsabilidades relativas
à documentação;

e que teve oportunidade de esclarecer dúvidas
antes do aceite.
```


## CLÁUSULA 34ª — ASSINATURA E EVIDÊNCIAS

Agência: {{agency_name}}
Contratante: {{buyer_name}}
Reserva: {{reservation_code}}
Versão: {{contract_version}}

O registro de assinatura/aceite vinculado a este documento conterá {{signature_provider}}, {{signed_at}} e {{document_hash}}, conforme o estágio efetivamente concluído. Não registrar assinatura ou data fictícia na geração do documento.
