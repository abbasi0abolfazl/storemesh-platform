$ErrorActionPreference = 'Stop'
$prototype = Join-Path $PSScriptRoot '..\workspace\figma-make-ui-prototype'
if (-not (Test-Path $prototype)) {
  & (Join-Path $PSScriptRoot 'prepare-sources.ps1')
}
Set-Location $prototype
corepack enable
pnpm install --frozen-lockfile
New-Item -ItemType Directory -Path 'node_modules\.vite-temp' -Force | Out-Null
pnpm dev -- --host 0.0.0.0 --port 8443

