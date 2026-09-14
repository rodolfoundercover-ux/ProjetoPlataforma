# Prompt de implementação — PHASE_11

Você está implementando a PHASE_11: Notificações, jobs e automações, no SaaS multiagência de excursões/viagens.

Leia AGENTS.md, README.md, docs/SPEC.md, docs/AUDIT_G1.md, docs/DECISIONS.md, codex/STATUS.md e docs/phases/PHASE_11.md. Consulte docs/INTEGRATIONS.md, docs/DATABASE.md, docs/SECURITY.md, docs/QUALITY.md e o checklist docs/phases/PHASE_11_ACCEPTANCE.md. A auditoria G.1 prevalece sobre decisões históricas.

Implemente somente este escopo: Completar outbox/queue/cron, cadências, templates, preferências, entregas, alertas, retries, falhas finais e painel sanitizado. Consolidar jobs já introduzidos em PHASE_04/05/06.

Dependência: PHASE_10 concluída. Verifique as evidências existentes; não refaça trabalho já aceito nem avance sobre segurança quebrada.

Entregue banco/migrations/RLS, serviços/transações, interface e testes necessários para satisfazer o checklist desta fase. Mantenha isolamento tenant-local, proibição de bypass SUPER_ADMIN, dinheiro exato, snapshots, idempotência, proteção de capacidade e histórico.

Não habilite Marketplace/WhatsApp IA/agências parceiras/ERP/offline/Maps/QR check-in fora do corte indicado. Não use exemplos de preços/prazos/taxas como regras fixas. Não trate provider fake, TODO, tela demonstrativa ou teste não executado como conclusão.

Resolva e registre decisões técnicas compatíveis com a documentação. Se faltar uma decisão comercial/credencial obrigatória, registre o bloqueio concreto e avance nas partes independentes, sem fabricar sucesso ou alterar a regra.

Ao finalizar, atualize checklist, docs afetadas e codex/STATUS.md com evidências reais. Relate o que passou a funcionar, verificações executadas e resultados, pendências e próximo passo. Conclua a fase somente com os critérios satisfeitos; não implemente a próxima fase neste pedido.
