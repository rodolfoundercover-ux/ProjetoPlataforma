# Início no Codex

## Antes de implementar

Este pacote é a especificação e não contém aplicação pronta. Abra a raiz do repositório. Leia AGENTS.md, README.md e os dez documentos mestres. G.1 é a fonte superior entre as decisões da conversa. DECISIONS.md separa lacunas de regras fechadas.

Comece por [prompts/PHASE_00.md](prompts/PHASE_00.md), copie seu texto para o Codex e acompanhe as evidências. A documentação é contexto global; cada prompt limita o trabalho a uma fase.

## Sequência

- [PHASE_00 — Fundação técnica](prompts/PHASE_00.md)
- [PHASE_01 — Multi-tenant, contas, licenças e segurança](prompts/PHASE_01.md)
- [PHASE_02 — Agência, branding e configurações](prompts/PHASE_02.md)
- [PHASE_03 — Viagens, veículos e assentos](prompts/PHASE_03.md)
- [PHASE_04 — Clientes, passageiros e reservas](prompts/PHASE_04.md)
- [PHASE_05 — Motor financeiro e pagamentos](prompts/PHASE_05.md)
- [PHASE_06 — Contratos, políticas e assinatura](prompts/PHASE_06.md)
- [PHASE_07 — Site white-label, checkout e cliente](prompts/PHASE_07.md)
- [PHASE_08 — Pós-venda, reembolso e crédito](prompts/PHASE_08.md)
- [PHASE_09 — Operação da viagem e embarque](prompts/PHASE_09.md)
- [PHASE_10 — Financeiro e fechamento da viagem](prompts/PHASE_10.md)
- [PHASE_11 — Notificações, jobs e automações](prompts/PHASE_11.md)
- [PHASE_12 — Dashboard, relatórios e exportações](prompts/PHASE_12.md)
- [PHASE_13 — Afiliados e atribuição comercial](prompts/PHASE_13.md)
- [PHASE_14 — Hardening e piloto Dri](prompts/PHASE_14.md)

## Regras de avanço

Use STATUS.md e docs/phases/PHASE_XX_ACCEPTANCE.md. Não avançar quando testes de isolamento, integridade ou regras críticas falharem. Registrar pendências de credenciais/revisão e continuar partes independentes.

Jobs nascem com os domínios: expiração em 04, reconciliação em 05, documentos em 06; 11 completa. Financeiro 10 prepara comissões, 13 ativa e testa novamente. Contratos publicados não podem ficar simulados quando 07 abrir venda real.

Subetapa 6.1 é ZapSign: implementação se pronta, senão MVP 1.1 conforme G.1. Gate jurídico por documento prevalece. PHASE_02 não significa expansão Fase 2.

## Retomada

Ao retomar, leia STATUS.md e último checklist, confira o código/commit e execute apenas as pendências reais da fase atual. Nunca inferir que todos os critérios passaram porque existe um commit.

## Formato esperado de entrega por fase

Comportamento implementado; migrations e componentes relevantes; testes e evidências; decisões/pendências; estado do checklist e próximo passo. Não declarar aplicação, segurança, integração real ou revisão jurídica concluída sem evidência correspondente.
