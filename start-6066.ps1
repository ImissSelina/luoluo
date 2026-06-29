$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 6066
$url = "http://127.0.0.1:$port"

$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-Host "Port $port is already running. Opening $url ..."
  Start-Process $url
  return
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Host "Node.js was not found. Please install Node.js or add it to PATH."
  Read-Host "Press Enter to close"
  exit 1
}

Start-Process -FilePath $node.Source -ArgumentList @("server.js") -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Seconds 1

$started = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($started) {
  Write-Host "Website is running at $url"
  Start-Process $url
} else {
  Write-Host "Failed to start website on port $port."
  Read-Host "Press Enter to close"
  exit 1
}
