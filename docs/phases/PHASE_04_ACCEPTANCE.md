# Aceitação — PHASE_04: Clientes, passageiros e reservas

Status: NÃO INICIADA. Este checklist não comprova implementação. Nenhum item veio previamente aprovado.

| Critério | Evidência (teste/cenário, ambiente, resultado) | Situação |
|---|---|---|
| P04-01 — Comprador não viajante cria reserva de dois passageiros com preços e embarques individuais e chega a WAITING_ENTRY. | A registrar | PENDENTE |
| P04-02 — Duas requisições para último assento resultam em um único vencedor; última vaga sem mapa tem mesma proteção. | A registrar | PENDENTE |
| P04-03 — Holds válidos reduzem capacidade uma vez; expiração libera vaga mesmo com navegador fechado. | A registrar | PENDENTE |
| P04-04 — Reserva nunca usa HOLD/WAITING_PAYMENT como status; frontend não confirma reserva sem pagamento. | A registrar | PENDENTE |
| P04-05 — Desconto abaixo do mínimo exige aprovação válida vinculada ao valor/contexto; mudança de preço exige revalidação. | A registrar | PENDENTE |
| P04-06 — Alterar cadastro do passageiro preserva snapshots da reserva e isolamento de cliente/tenant. | A registrar | PENDENTE |

## Gates comuns

- [ ] Código e documentação coerentes com G.1 e escopo da fase.
- [ ] Testes de autorização/tenant e invariantes afetadas executados.
- [ ] Migrations em banco limpo e preservação de histórico verificadas quando houver mudança de banco.
- [ ] Tipos, lint, build e CI aplicáveis passam.
- [ ] Integrações reais não são declaradas prontas somente por fake.
- [ ] Logs/segredos/PII revisados.
- [ ] Pendências e decisões registradas em DECISIONS.md.
- [ ] STATUS.md atualizado com evidência; nenhum TODO crítico usado como conclusão.

## Registro de execução

Commit: a preencher.
Ambiente: a preencher.
Comandos/cenários e resultado: a preencher.
Revisor/responsável e data: a preencher.
Bloqueios: a preencher.
