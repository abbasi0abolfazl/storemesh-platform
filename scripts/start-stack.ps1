$ErrorActionPreference = 'Stop'
$infra = Join-Path $PSScriptRoot '..\workspace\storemesh-infrastructure'
if (-not (Test-Path $infra)) {
  & (Join-Path $PSScriptRoot 'prepare-sources.ps1')
}
Set-Location $infra
if (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host 'A .env file was created. Replace every placeholder before running again.' -ForegroundColor Yellow
  exit 1
}
if (Select-String -Path '.env' -Pattern 'replace-' -Quiet) {
  throw 'The .env file still contains placeholder secrets.'
}
docker compose --env-file .env up -d --build
docker compose ps

