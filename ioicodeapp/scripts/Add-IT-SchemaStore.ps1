<#
.SYNOPSIS
    Creates the IT_SchemaStore SharePoint list used to persist form schema overrides.

.DESCRIPTION
    Idempotent — skips the list and any columns that already exist.
    The app reads from this list at runtime; if no row exists for a formCode it falls
    back to the static JSON bundled in the app.

.PARAMETER SiteUrl
    Default: https://ioioi.sharepoint.com/sites/MainDB_IT

.PARAMETER WhatIf
    Preview without writing.

.REQUIREMENTS
    Install-Module SharePointPnPPowerShellOnline -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/MainDB_IT",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ListName = "IT_SchemaStore"

Import-Module SharePointPnPPowerShellOnline -WarningAction Ignore -ErrorAction Stop

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin

# Create list
$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    if ($WhatIf) { Write-Host "  [whatif] Would create list: $ListName" -ForegroundColor Yellow }
    else {
        New-PnPList -Title $ListName -Template GenericList | Out-Null
        Write-Host "  [created] List: $ListName" -ForegroundColor Green
    }
} else {
    Write-Host "  [skip] List '$ListName' already exists" -ForegroundColor DarkGray
}

function Add-ColumnIfMissing {
    param([string]$InternalName, [string]$DisplayName, [string]$Type)
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { Write-Host "  [skip] $InternalName" -ForegroundColor DarkGray; return }
    if ($WhatIf)   { Write-Host "  [whatif] Would add: $InternalName ($Type)" -ForegroundColor Yellow; return }
    try {
        Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type $Type | Out-Null
        Write-Host "  [added] $InternalName ($Type)" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $InternalName`: $_" -ForegroundColor Red
    }
}

Write-Host "`n--- Columns ---" -ForegroundColor White
Add-ColumnIfMissing -InternalName "SchemaJson"    -DisplayName "Schema JSON"    -Type "Note"
Add-ColumnIfMissing -InternalName "SchemaVersion" -DisplayName "Schema Version" -Type "Number"
Add-ColumnIfMissing -InternalName "IsActive"      -DisplayName "Is Active"      -Type "Boolean"

Write-Host "`nDone. '$ListName' is ready on $SiteUrl`n" -ForegroundColor Cyan
Write-Host "Title column = formCode (e.g. 'ITSSR'), SchemaJson = full JSON string." -ForegroundColor DarkGray
