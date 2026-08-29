<#
.SYNOPSIS
    Adds SAPAMR email routing columns to MainDB_IT lists.

.DESCRIPTION
    Adds discrete SharePoint columns for SAPAMR (SAP Authorisation Matrix Review)
    email routing. These columns store the TBV (verifier), TBA (approver), and
    FI per-slot verifier (TBV_1–TBV_5) email addresses at form submission time.

    The workflow engine's getEmailRecipients resolves email routing from these
    columns when transitions fire (send_verification → sAPAMRTBVEmail, etc.)

.PARAMETER SiteUrl
    SharePoint site URL.  Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Target list internal name.  Default: MainDB_IT

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-SAPAMR-Columns.ps1

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
        InternalName = "SAPAMR_TBVEmail"
        DisplayName  = "SAPAMR_TBVEmail"
        Type         = "Text"
        Description  = "TBV (To Be Verified) email for SAPAMR workflow routing – populated at submission time"
    }
    @{
        InternalName = "SAPAMR_TBAEmail"
        DisplayName  = "SAPAMR_TBAEmail"
        Type         = "Text"
        Description  = "TBA (To Be Approved / BPO) email for SAPAMR workflow routing – populated at submission time"
    }
    @{
        InternalName = "SAPAMR_TBV1Email"
        DisplayName  = "SAPAMR_TBV1Email"
        Type         = "Text"
        Description  = "FI per-slot verifier TBV_1 email – populated at submission time for FI module requests"
    }
    @{
        InternalName = "SAPAMR_TBV2Email"
        DisplayName  = "SAPAMR_TBV2Email"
        Type         = "Text"
        Description  = "FI per-slot verifier TBV_2 email – populated at submission time for FI module requests"
    }
    @{
        InternalName = "SAPAMR_TBV3Email"
        DisplayName  = "SAPAMR_TBV3Email"
        Type         = "Text"
        Description  = "FI per-slot verifier TBV_3 email – populated at submission time for FI module requests"
    }
    @{
        InternalName = "SAPAMR_TBV4Email"
        DisplayName  = "SAPAMR_TBV4Email"
        Type         = "Text"
        Description  = "FI per-slot verifier TBV_4 email – populated at submission time for FI module requests"
    }
    @{
        InternalName = "SAPAMR_TBV5Email"
        DisplayName  = "SAPAMR_TBV5Email"
        Type         = "Text"
        Description  = "FI per-slot verifier TBV_5 email – populated at submission time for FI module requests"
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
