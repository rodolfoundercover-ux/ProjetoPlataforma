# Desenvolvimento local e VS Code

A PHASE_00 foi iniciada, mas ainda não foi executada integralmente. As dependências foram instaladas e o build passou. A aplicação foi iniciada pelo agente em http://127.0.0.1:3000; ela permanece disponível enquanto esse processo estiver ativo. Docker e rede continuam bloqueados na sessão do agente.

Próxima ação neste computador: no terminal do VS Code, na raiz do projeto, execute `node node_modules/supabase/dist/supabase.js start`. Isso usa o CLI já instalado. Não é preciso reinstalar os pacotes. Após o banco iniciar, configure o ambiente conforme abaixo e reinicie o servidor web para carregar .env.local.

## Abrir no VS Code

Use Arquivo → Abrir Pasta e selecione a pasta travel-platform que contém AGENTS.md e package.json. Não abra a pasta Dri-excursoes: ela é outro projeto.

Use Terminal → Novo Terminal. O terminal deve estar na raiz travel-platform. O Explorer mostra os arquivos; src/app contém as páginas, supabase/migrations contém o banco, codex/STATUS.md registra o andamento. Ctrl+Shift+P → Tasks: Run Task oferece os comandos PHASE_00 já cadastrados.

## Primeira instalação

Docker Desktop deve mostrar Engine running. Execute a tarefa “PHASE_00: instalar dependências” ou:

```powershell
powershell -NoProfile -File scripts/setup-local.ps1
```

O script instala dependências com pnpm 11.19.0, registra as versões realmente instaladas e sincroniza o lockfile. Se o PowerShell bloquear scripts por política, execute os comandos individuais abaixo; não é necessário alterar a política:

```powershell
npm exec --yes --package=pnpm@11.19.0 -- pnpm install --no-frozen-lockfile
node scripts/pin-versions.mjs
npm exec --yes --package=pnpm@11.19.0 -- pnpm install --no-frozen-lockfile
```

Após isso, use as tarefas do VS Code ou os comandos pnpm abaixo. Se pnpm não for encontrado no seu terminal, substitua o prefixo pnpm por npm exec --yes --package=pnpm@11.19.0 -- pnpm.

## Iniciar serviços e aplicação

```powershell
pnpm local:start
pnpm local:env
pnpm db:types
pnpm dev
```

O primeiro start baixa as imagens e aplica migrations. local:env escreve somente a URL e chave pública locais; recusa sobrescrever .env.local. Nunca envie saídas com chaves ou arquivos .env para o chat/GitHub.

Abra http://127.0.0.1:3000 para a aplicação e http://127.0.0.1:55323 para o Studio local. O terminal de pnpm dev fica ocupado; abra outro para verificações. Ctrl+C para o servidor web; pnpm local:stop encerra os serviços preservando os volumes locais.

## Login técnico

No Studio local, em Authentication → Users, crie um usuário fictício confirmado com e-mail e senha próprios de desenvolvimento. O cadastro público está desabilitado. Entre por /login; o sucesso leva a /technical. Atualize a página, saia e confirme que /technical volta ao login. Não use senha pessoal nem dados reais.

O bucket private-documents é privado e não permite uploads/leituras por usuários nesta fase. As policies de documentos comerciais dependem de tenants/permissões das próximas fases. A página autenticada só comprova identidade, não concede papel de ADMIN ou SUPER_ADMIN.

## Verificações pendentes

Resultado local atual: 7 testes pgTAP passaram no terminal do usuário; build, TypeScript e lint passaram no agente. Dois testes E2E passaram com Edge. Login válido/logout permanece a validar pelo cenário acima.

Alternativa ao download de Chromium no Windows quando Edge já está instalado:

```powershell
$env:PLAYWRIGHT_USE_EDGE = '1'
node node_modules/@playwright/test/cli.js test
```

A variável vale somente para esse terminal; o CI continua usando Chromium.

```powershell
pnpm db:test
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

Verifique /api/health: retorna 200 somente quando o serviço Auth responde e 503 quando indisponível. Esse endpoint não atesta migrations, Storage, workers ou integrações comerciais.

Os testes de banco verificam infraestrutura e negações de acesso. Os testes do navegador verificam acesso anônimo e credenciais inválidas; o login válido ainda requer o cenário manual acima. A homologação e o CI remoto não foram executados.

Para provar migration em banco vazio, use ambiente descartável próprio. Não execute db reset em um banco com dados que deseja preservar.

## Git e evidências

Esta pasta é a cópia local do pacote, sem vínculo Git detectado. Os arquivos não foram enviados ao repositório ProjetoPlataforma. Antes de publicar, revisar o diff, versionar pnpm-lock.yaml e os tipos gerados e conferir .gitignore. O workflow falha deliberadamente se lockfile ou tipos versionados estiverem ausentes.

MANIFEST.sha256 corresponde ao pacote documental original; não representa os arquivos modificados nesta fase. O ZIP original também não foi atualizado nesta etapa.

## Fontes

- [Supabase local e CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Testes reais de banco](https://supabase.com/docs/guides/database/testing)
- [Next.js](https://nextjs.org/docs/app/getting-started/installation)
