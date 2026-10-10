$ErrorActionPreference = 'Stop'

'' | Write-Host
'Publishing setmousecursorpos-addon...' | Write-Host -ForegroundColor Cyan
'' | Write-Host

Push-Location -LiteralPath (Join-Path -Path $PSScriptRoot -ChildPath 'setmousecursorpos-addon', 'src')

dotnet publish --runtime win-x64 --configuration Release --verbosity:detailed

Pop-Location

'' | Write-Host
'Making Displayscope installer...' | Write-Host -ForegroundColor Cyan
'' | Write-Host

Push-Location -LiteralPath (Join-Path -Path $PSScriptRoot -ChildPath 'app')

npm run make

Pop-Location
