$ErrorActionPreference = 'Stop'
$urls = @(
  'http://localhost:3000/health',
  'http://localhost:3001/health',
  'http://localhost:3002/health',
  'http://localhost:4000/health',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082'
)
foreach ($url in $urls) {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
    Write-Host "OK $($response.StatusCode) $url" -ForegroundColor Green
  } catch {
    Write-Host "FAILED $url - $($_.Exception.Message)" -ForegroundColor Red
    $failed = $true
  }
}
if ($failed) { exit 1 }

