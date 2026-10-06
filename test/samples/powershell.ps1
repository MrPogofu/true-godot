# Requires -Version 7
param(
    [Parameter(Mandatory = $true)]
    [string]$Version,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$themes = Get-ChildItem -Path .\themes -Filter *.json

function Test-Theme {
    [CmdletBinding()]
    param([System.IO.FileInfo]$File)
    try {
        $null = Get-Content $File.FullName -Raw | ConvertFrom-Json
        Write-Host "OK: $($File.Name)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Warning "Invalid JSON in $File"
        return $false
    }
}

foreach ($t in $themes) {
    if (-not (Test-Theme -File $t)) { exit 1 }
}

$count = ($themes | Measure-Object).Count
if ($DryRun -and $count -gt 0) {
    "Would publish $Version ($count themes)"
} else {
    & npx @vscode/vsce publish $Version
}
