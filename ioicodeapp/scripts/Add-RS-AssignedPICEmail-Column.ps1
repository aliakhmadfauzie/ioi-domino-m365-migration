<#
.SYNOPSIS
    Adds the RS_AssignedPICEmail column to MainDB_IT lists.

.DESCRIPTION
    Stores the resolved IT PIC email for RS (Reset Password) submissions.
    The PIC is resolved at form submission time based on Application Type and Location.
    This column is used by the workflow engine's email routing to send notifications
    to the correct IT staff.

.PARAMETER SiteUrl
    SharePoint site URL.  Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Target list internal name.  Default: MainDB_IT

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    # Add to Prai list
    .\Add-RS-AssignedPICEmail-Column.ps1

    # Add to Johor list
    .\Add-RS-AssignedPICEmail-Column.ps1 -ListName "MainDB_IT_JHR"

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl  = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ListName = "MainDB_IT",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Connection — modern PnP.PowerShell uses -Interactive, legacy uses -UseWebLogin
# ---------------------------------------------------------------------------
Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
} catch {
    Write-Host "  Trying legacy auth method..." -ForegroundColor Yellow
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
}

# Verify list exists
$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    Write-Error "List '$ListName' not found on $SiteUrl"
    return
}
Write-Host "Target list: $($list.Title) ($ListName)`n" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# Column definitions
# ---------------------------------------------------------------------------
$columns = @(
    @{
        InternalName = "RS_AssignedPICEmail"
        DisplayName  = "RS_AssignedPICEmail"
        Type         = "Text"
        Description  = "Resolved IT PIC email for RS form routing – populated at submission time"
    }
)

# ---------------------------------------------------------------------------
# Add columns
# ---------------------------------------------------------------------------
foreach ($col in $columns) {
    $existing = Get-PnPField -List $ListName -Identity $col.InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [skip] $($col.InternalName)  (already exists)" -ForegroundColor DarkGray
        continue
    }

    if ($WhatIf) {
        Write-Host "  [whatif] Would add: $($col.InternalName)  ($($col.Type))" -ForegroundColor Yellow
        continue
    }

    try {
        Add-PnPField -List $ListName -InternalName $col.InternalName -DisplayName $col.DisplayName -Type $col.Type | Out-Null
        Write-Host "  [added] $($col.InternalName)  ($($col.Type))" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $($col.InternalName)`: $_" -ForegroundColor Red
    }
}

Write-Host "`nDone." -ForegroundColor Cyan
