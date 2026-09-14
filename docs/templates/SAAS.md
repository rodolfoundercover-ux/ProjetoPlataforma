# Contrato SaaS

> Modelo-base da conversa, preparado para importação no Contract Engine. Status inicial: DRAFT; revisão jurídica pendente. Não publicar automaticamente no seed. Fonte: modelo SaaS e G.1.12/34/35. Os placeholders são substituídos por snapshots validados; condições comerciais não são fixadas por exemplos.

### CONTRATO DE LICENÇA DE USO DE SOFTWARE E PRESTAÇÃO DE SERVIÇOS SaaS

**CONTRATADA:**  
`{{platform_legal_name}}`, inscrita no CNPJ sob nº `{{platform_document}}`, com sede em `{{platform_address}}`, doravante denominada **PLATAFORMA**.

**CONTRATANTE:**  
`{{agency_legal_name}}`, nome fantasia `{{agency_name}}`, inscrita no CNPJ/CPF sob nº `{{agency_document}}`, representada por `{{account_owner_name}}`, doravante denominada **AGÊNCIA**.

### 1. Objeto

A PLATAFORMA concede à AGÊNCIA licença temporária, não exclusiva e vinculada à vigência da contratação para utilização do sistema `{{platform_name}}`, destinado à gestão de viagens, excursões, reservas, passageiros, pagamentos, contratos, parceiros, operações e demais funcionalidades disponibilizadas conforme o plano contratado.

Cada licença corresponde a uma agência cadastrada na plataforma.

### 2. Plano contratado

```text
Plano: {{plan_name}}
Valor: {{subscription_price}}
Periodicidade: {{billing_cycle}}
Início: {{start_date}}
Renovação: {{renewal_date}}
```

Funcionalidades adicionais contratadas separadamente não integram automaticamente o plano principal.

### 3. Acesso e usuários

A AGÊNCIA poderá cadastrar administradores e analistas conforme os limites de seu plano.

A AGÊNCIA é responsável pela concessão, revisão e cancelamento dos acessos de sua equipe.

Contas e credenciais são pessoais e não devem ser compartilhadas.

### 4. Isolamento dos dados

Os dados operacionais da AGÊNCIA serão logicamente isolados dos dados das demais agências.

Clientes, passageiros, reservas, contratos e informações financeiras da AGÊNCIA não serão disponibilizados a outras agências.

O papel de **Super Admin da PLATAFORMA não possuirá, através da aplicação, acesso aos dados pessoais dos passageiros, contratos assinados ou financeiro privado da AGÊNCIA**, salvo eventual processamento técnico estritamente necessário realizado pelos serviços internos da infraestrutura.


### 5. Proteção de dados

As partes comprometem-se a tratar dados pessoais de acordo com a legislação aplicável, inclusive a LGPD.

A AGÊNCIA será responsável pela definição das finalidades relacionadas à sua operação turística e relacionamento com seus clientes, enquanto a PLATAFORMA tratará os dados necessários para fornecimento e operação do serviço contratado. A LGPD disciplina o tratamento de dados pessoais inclusive em meios digitais. 

### 6. Responsabilidades da agência

A AGÊNCIA é responsável pela legalidade de suas atividades, conteúdo publicado, viagens comercializadas, preços, políticas comerciais, atendimento aos passageiros, cumprimento dos serviços vendidos, dados cadastrados e usuários autorizados.

A PLATAFORMA fornece tecnologia e não assume automaticamente a condição de organizadora das viagens cadastradas pelas agências.

### 7. Disponibilidade do sistema

A PLATAFORMA empregará esforços técnicos razoáveis para manter o serviço disponível e seguro.

Interrupções decorrentes de manutenção, falhas de terceiros, indisponibilidade de provedores, internet ou eventos fora do controle razoável da PLATAFORMA poderão ocorrer.

Eventual SLA específico constará do plano ou anexo contratado.

### 8. Pagamentos da licença

O não pagamento poderá gerar:

```text
ACTIVE
→ PAST_DUE
→ SUSPENDED
```

A suspensão não resulta automaticamente na exclusão dos dados da AGÊNCIA.

Regularizada a pendência, o acesso poderá ser restabelecido conforme as condições comerciais vigentes.

### 9. Propriedade intelectual

Código, marca, arquitetura e componentes próprios da PLATAFORMA permanecem de titularidade da CONTRATADA.

Os dados comerciais, textos próprios, imagens e demais conteúdos inseridos pela AGÊNCIA permanecem sob responsabilidade/titularidade de seus respectivos proprietários.

### 10. Marketplace

A utilização do Marketplace será facultativa e sujeita a condições próprias.

A participação não será presumida pela simples contratação do SaaS.

### 11. Encerramento

A AGÊNCIA poderá solicitar cancelamento da assinatura conforme o plano contratado.

O encerramento não implica destruição imediata dos dados que devam ser preservados por obrigação legal, segurança, prevenção a fraude ou outra finalidade legítima.

A janela de exportação anterior à eliminação/anonimização constará das condições comerciais e de retenção aprovadas.

### 12. Assinatura eletrônica

A contratação eletrônica registrará identificação do signatário, data/hora, versão do contrato, texto aceito e hash, observadas as exigências de assinatura aplicáveis ao documento e a revisão jurídica de lançamento.
