$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
& docker version
if ($LASTEXITCODE -ne 0) { throw 'Abra o Docker Desktop antes de continuar.' }
& npm exec --yes --package=pnpm@11.19.0 -- pnpm install --no-frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Instalação de dependências falhou.' }
& node scripts/pin-versions.mjs
if ($LASTEXITCODE -ne 0) { throw 'Fixação de versões falhou.' }
& npm exec --yes --package=pnpm@11.19.0 -- pnpm install --no-frozen-lockfile
if ($LASTEXITCODE -ne 0) { throw 'Atualização do lockfile falhou.' }
Write-Host 'Dependências preparadas. Siga docs/LOCAL_DEVELOPMENT.md para iniciar e validar o banco.'

