# Prompt de implementação — PHASE_07

Você está implementando a PHASE_07: Site white-label, checkout e cliente, no SaaS multiagência de excursões/viagens.

Leia AGENTS.md, README.md, docs/SPEC.md, docs/AUDIT_G1.md, docs/DECISIONS.md, codex/STATUS.md e docs/phases/PHASE_07.md. Consulte docs/SCREENS.md, docs/ARCHITECTURE.md, docs/BUSINESS_RULES.md, docs/PERMISSIONS.md, docs/SECURITY.md e o checklist docs/phases/PHASE_07_ACCEPTANCE.md. A auditoria G.1 prevalece sobre decisões históricas.

Implemente somente este escopo: Home, catálogo, viagem, checkout, login OTP central e área do cliente. Reusar serviços de reserva/pagamento/contrato do painel. Não ativar Marketplace ou recomendações entre agências.

Dependência: PHASE_06 concluída. Verifique as evidências existentes; não refaça trabalho já aceito nem avance sobre segurança quebrada.

Entregue banco/migrations/RLS, serviços/transações, interface e testes necessários para satisfazer o checklist desta fase. Mantenha isolamento tenant-local, proibição de bypass SUPER_ADMIN, dinheiro exato, snapshots, idempotência, proteção de capacidade e histórico.

Não habilite Marketplace/WhatsApp IA/agências parceiras/ERP/offline/Maps/QR check-in fora do corte indicado. Não use exemplos de preços/prazos/taxas como regras fixas. Não trate provider fake, TODO, tela demonstrativa ou teste não executado como conclusão.

Resolva e registre decisões técnicas compatíveis com a documentação. Se faltar uma decisão comercial/credencial obrigatória, registre o bloqueio concreto e avance nas partes independentes, sem fabricar sucesso ou alterar a regra.

Ao finalizar, atualize checklist, docs afetadas e codex/STATUS.md com evidências reais. Relate o que passou a funcionar, verificações executadas e resultados, pendências e próximo passo. Conclua a fase somente com os critérios satisfeitos; não implemente a próxima fase neste pedido.
