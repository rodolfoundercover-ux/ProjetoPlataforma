# Decisões técnicas da PHASE_00

Data: 2026-09-13. Estado: frontend compilado e servido localmente; backend não homologado.

Atualização após instalação pelo usuário: as versões exatas constam em INSTALLED_VERSIONS.json, package.json e pnpm-lock.yaml. TypeScript, lint, Vitest, build, pgTAP e testes E2E passaram com esses pacotes. A estratégia cross-domain está registrada para implementação na fase prevista; o login same-origin local foi validado. Instalação limpa via Git/CI e homologação permanecem pendentes.

## Versões e execução

Node 24.21.0 foi observado no ambiente; engines exige Node 24. pnpm 11.19.0 é fixado no packageManager. Next 16.3.4, React 19.2.6, TypeScript 5.9.3, ESLint 9.39.4 e Tailwind 4.2.1 foram encontrados no manifesto de outro projeto local, sem reutilização de seu código ou credenciais. Isso não substitui verificação de disponibilidade ou compatibilidade no registry.

Supabase JS/CLI 2, SSR 0.8, Zod 4, Vitest 4 e Playwright 1 são intervalos provisórios. DEC-02 não está concluída. scripts/pin-versions.mjs transforma os pacotes instalados em versões exatas; a instalação posterior sincroniza o lockfile. O CI exige o lockfile. Não foi inventado lockfile nem arquivo de tipos gerados.

A interface inicial usa HTML acessível e Tailwind; componentes shadcn e React Hook Form serão introduzidos quando houver formulários de domínio que justifiquem seu uso. Não houve troca da stack. PostgreSQL 17 é a configuração inicial a verificar com o CLI instalado.

## Auth central e domínios — DEC-03

A implementação atual é exclusivamente same-origin local, com senha no Supabase Auth, cookies SSR e validação no servidor por getUser. A sessão técnica não concede permissões comerciais.

Proposta para o spike de domínios: autenticação central; destino previamente permitido em agency_domains; transação curta vinculada a state e PKCE gerados no destino; código opaco de uso único trocado por canal servidor-servidor e sessão estabelecida em cookie do domínio de destino. Nunca colocar access/refresh tokens na URL ou compartilhar cookies entre domínios independentes. Validar replay, destino adulterado, expiração, login CSRF e revogação antes de ativar.

Esse protocolo e sua integração com Supabase NÃO foram implementados nem testados. DEC-03 permanece pendente para o spike/PHASE_07; não há SSO cross-domain funcional nesta entrega.

## Outbox, fila e workers

internal.outbox é inacessível a anon/authenticated, RLS forçada e sem policies liberadoras. scope diferencia eventos de plataforma e agência; agência exige agency_id. A FK e imutabilidade do vínculo serão adicionadas quando agencies existir na PHASE_01, antes de qualquer produtor comercial.

pgmq e pg_cron são habilitados; domain_events recebe apenas referências quando os produtores forem implementados. Nenhum cron, dispatcher ou integração externa está ativado. Gravação do evento junto da transação comercial, publicação atômica/retry, consumo idempotente, limites e dead-letter precisam ser implementados com os domínios. Não há alegação de entrega exatamente uma vez.

Web usa Node; Edge Functions usam Deno e somente contratos portáveis. PDF e bibliotecas Node não entram diretamente em Edge Functions. Compatibilidade real das extensões e runtimes permanece pendente de execução local.

## Segurança e escopo

Bucket privado criado sem policies de usuários; ausência de tenant não é compensada com policy permissiva. Nenhuma chave service_role é usada pelo aplicativo. Logs emitem vocabulário fechado e UUID próprio, sem mensagens arbitrárias de providers. Health testa apenas Auth. PHASE_01 não foi implementada.

A autorização do usuário nesta etapa é para trabalho local. Homologação externa continua pendente, e não foi criada conta ou realizado deploy.
