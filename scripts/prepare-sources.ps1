$ErrorActionPreference = 'Stop'

$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$sourceRoot = Join-Path $packageRoot 'source'
$workspaceRoot = Join-Path $packageRoot 'workspace'

New-Item -ItemType Directory -Path $workspaceRoot -Force | Out-Null

$repositories = @(
  'storemesh-cloud',
  'storemesh-contracts',
  'storemesh-e2e',
  'storemesh-infrastructure',
  'storemesh-pda',
  'storemesh-platform',
  'storemesh-site-server',
  'storemesh-terminal',
  'storemesh-web'
)

foreach ($repository in $repositories) {
  $archive = Join-Path $sourceRoot "$repository-source.zip"
  $destination = Join-Path $workspaceRoot $repository
  if (-not (Test-Path $archive)) { throw "Missing source archive: $archive" }
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  Expand-Archive -LiteralPath $archive -DestinationPath $destination -Force
  Write-Host "Prepared $repository" -ForegroundColor Green
}

$prototypeArchive = Join-Path $sourceRoot 'figma-make-ui-prototype-source.zip'
$prototypeDestination = Join-Path $workspaceRoot 'figma-make-ui-prototype'
New-Item -ItemType Directory -Path $prototypeDestination -Force | Out-Null
Expand-Archive -LiteralPath $prototypeArchive -DestinationPath $prototypeDestination -Force
Write-Host 'Prepared Figma Make UI prototype' -ForegroundColor Green

$coordinationArchive = Join-Path $sourceRoot 'storemesh-platform-local-coordination-files.zip'
Expand-Archive -LiteralPath $coordinationArchive -DestinationPath (Join-Path $workspaceRoot 'storemesh-platform') -Force
Write-Host 'Applied local Fix Request and coordination files' -ForegroundColor Green

Write-Host "Sources are ready in: $workspaceRoot" -ForegroundColor Cyan
