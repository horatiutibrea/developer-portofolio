[CmdletBinding()]
param(
    [switch]$Fix,
    [switch]$NoRestore
)

$ErrorActionPreference = "Stop"

$backendRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Split-Path -Parent $backendRoot
$repositoryRoot = Split-Path -Parent $sourceRoot
$solutionFiles = @(Get-ChildItem -LiteralPath $repositoryRoot -Filter "*.sln" -File)

if ($solutionFiles.Count -ne 1) {
    throw "Expected exactly one solution file in '$repositoryRoot', but found $($solutionFiles.Count)."
}

$formatArguments = @("format", $solutionFiles[0].FullName)

if (-not $Fix) {
    $formatArguments += "--verify-no-changes"
}

if ($NoRestore) {
    $formatArguments += "--no-restore"
}

$formatArguments += @("--verbosity", "minimal")

& dotnet @formatArguments
if ($LASTEXITCODE -ne 0) {
    if ($Fix) {
        throw "Backend formatting failed."
    }

    throw "Backend lint failed. Run this script again with -Fix, then review the changes."
}

if ($Fix) {
    Write-Host "Backend formatting completed." -ForegroundColor Green
} else {
    Write-Host "Backend lint passed." -ForegroundColor Green
}
