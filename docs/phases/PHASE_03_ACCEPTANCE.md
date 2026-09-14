# Aceitação — PHASE_03: Viagens, veículos e assentos

Status: APROVADA em 2026-09-14. Publicação, CI, Supabase Cloud e Vercel validados.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P03-01 — Viagem completa salva/reabre datas, roteiro, embarques, preços, mapa e custos com integridade. | Migration cobre entidades, FKs tenant-local, dinheiro exato e snapshots; pgTAP aprovado. | ATENDIDO LOCALMENTE |
| P03-02 — Preço/categoria considera idade configurável e ocupa assento independentemente do preço. | pgTAP valida aniversário na saída, seleção da categoria e ocupação independente do preço. | ATENDIDO LOCALMENTE |
| P03-03 — Trocar veículo cria assignment/histórico; mapa incompatível exige revisão e capacidade inválida é bloqueada. | pgTAP valida histórico, assignment atual único, snapshot e revisão do mapa incompatível. | ATENDIDO LOCALMENTE |
| P03-04 — Despublicar não cancela viagem, reservas ou documentos; SOLD_OUT é derivado. | pgTAP comprova ciclo da viagem preservado e catálogo removido após despublicar. | ATENDIDO LOCALMENTE |
| P03-05 — Duplicar viagem não copia registros de venda, check-in, ocupação ou documentos assinados. | pgTAP comprova cópia configuracional sem assignment/ocupação e com contrato pendente. | ATENDIDO LOCALMENTE |
| P03-06 — Conteúdo público exclui custos/PII e não anuncia seguro automaticamente; upload é validado. | pgTAP valida projeção pública sem custo/seguro e rejeita metadados de upload inseguros. | ATENDIDO LOCALMENTE |

## Gates comuns

- [x] Código e documentação coerentes com G.1 e escopo da fase.
- [x] Testes de autorização/tenant e invariantes afetadas executados.
- [x] Migrations em banco limpo e preservação de histórico verificadas quando houver mudança de banco.
- [x] Tipos, lint e build passam; CI será registrada após publicação.
- [x] Integrações reais não são declaradas prontas somente por fake.
- [x] Logs/segredos/PII revisados.
- [x] Pendências e decisões registradas em DECISIONS.md.
- [x] STATUS.md atualizado com evidência; nenhum TODO crítico usado como conclusão.

## Registro de execução

Commit: `20cf3cf` — implementação da PHASE_03.
Ambiente: Supabase local no Windows, Supabase Cloud e Vercel, 2026-09-14.
Comandos/cenários e resultado: banco recriado e tipos gerados; `pnpm db:test` PASS, 4 arquivos/80 testes; `pnpm check` PASS, incluindo lint, TypeScript, Vitest 2/2 e build Next.js.
Revisor/responsável e data: validação conduzida com o usuário em 2026-09-14.
Publicação: importador GitHub `34884194963` executado com sucesso na segunda tentativa; migração aplicada no Supabase Cloud; `/technical/trips` validada na Vercel com agência ADMIN ativa.
Bloqueios: nenhum para concluir a PHASE_03.
