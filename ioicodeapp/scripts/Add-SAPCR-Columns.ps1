<#
.SYNOPSIS
    Adds SAPCR email routing columns to MainDB_IT_Ext_SAP list.

.DESCRIPTION
    Adds discrete SharePoint columns for SAPCR (SAP & WB Change Request)
    email routing to the MainDB_IT_Ext_SAP child table. These columns store
    the BPO, PM, Developer, and Project Director email addresses at form
    submission time.

    SAPCR uses the MainDB_IT_Ext_SAP child table (not MainDB_IT directly)
    to store form-specific extended data columns. The workflow engine's
    getEmailRecipients resolves email routing from these
    columns when transitions fire (send_change → sAPCRBPOEmail, etc.)

.PARAMETER SiteUrl
    SharePoint site URL.  Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Target list internal name.  Default: MainDB_IT

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-SAPCR-Columns.ps1

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl  = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ListName = "MainDB_IT_Ext_SAP",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
} catch {
    Write-Host "  Trying legacy auth method..." -ForegroundColor Yellow
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
}

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
        InternalName = "SAPCR_BPOEmail"
        DisplayName  = "SAPCR_BPOEmail"
        Type         = "Text"
        Description  = "BPO (nmAppBy) email for SAPCR workflow routing – populated at submission time"
    }
    @{
        InternalName = "SAPCR_PMEmail"
        DisplayName  = "SAPCR_PMEmail"
        Type         = "Text"
        Description  = "Project Manager (AEditor2) email for SAPCR workflow routing – populated at submission time"
    }
    @{
        InternalName = "SAPCR_DeveloperEmail"
        DisplayName  = "SAPCR_DeveloperEmail"
        Type         = "Text"
        Description  = "Developer (nmAssgTo/AEditor3) email for SAPCR workflow routing – populated at submission time"
    }
    @{
        InternalName = "SAPCR_DirectorEmail"
        DisplayName  = "SAPCR_DirectorEmail"
        Type         = "Text"
        Description  = "Project Director (KhooTC) email for SAPCR workflow routing – populated at submission time"
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

Write-Host "`nDone. $($columns.Count) column(s) processed." -ForegroundColor Cyan
