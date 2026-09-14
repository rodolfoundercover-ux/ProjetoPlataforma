# Edge Functions

Nenhuma função externa ou job comercial está ativado na PHASE_00. Usar runtime Deno do Supabase, validação na entrada e RPC transacional. Não importar next/headers, módulos Node nativos ou renderizadores PDF no worker. Referências da outbox serão consumidas com idempotência e retry nas fases dos domínios; extensões e fila são preparadas agora. Não usar credenciais privilegiadas para oferecer acesso de suporte.

