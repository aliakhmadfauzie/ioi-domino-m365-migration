param(
    [string]$TaskName = "IOI SharePoint Integration Audit",
    [int]$IntervalMinutes = 15,
    [string]$RunnerPath = (Join-Path $PSScriptRoot "run-sharepoint-audit.ps1")
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $RunnerPath)) {
    throw "Runner script not found: $RunnerPath"
}

$pwsh = (Get-Command pwsh -ErrorAction SilentlyContinue).Source
if ([string]::IsNullOrWhiteSpace($pwsh)) {
    $pwsh = "powershell.exe"
}

$action = New-ScheduledTaskAction `
    -Execute $pwsh `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$RunnerPath`""

$trigger = New-ScheduledTaskTrigger `
    -Once `
    -At (Get-Date).AddMinutes(1) `
    -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) `
    -RepetitionDuration (New-TimeSpan -Days 3650)

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Runs the IOI SharePoint integration audit prompt every $IntervalMinutes minutes." `
    -Force

Write-Host "Scheduled task installed: $TaskName"
