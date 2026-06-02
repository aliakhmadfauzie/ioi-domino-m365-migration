<#
.SYNOPSIS
    Adds the NIR_HWGRouting column to the single MainDB_IT SharePoint list.
    HWG Routing determines which IT Hardware group handles Notes config:
      - Penang / ACM companies → "ISGHardware"
      - Johor / PanCen companies → "ISGHardware2"

.DESCRIPTION
    Single list for all sites (Prai + Johor). The HWG group is computed from
    the requestor's company field by the code app's computeHWGRouting() function.
    This column stores the result so Power Automate flows can filter/view by it.

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Target list internal name. Default: MainDB_IT

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-NIR-HWGRouting-Column.ps1

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
Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

# ---------------------------------------------------------------------------
# Column: NIR_HWGRouting (Choice)
# ---------------------------------------------------------------------------
$colName   = "NIR_HWGRouting"
$display   = "NIR HWG Routing"
$choices   = @("ISGHardware", "ISGHardware2")
$desc      = "Computed HWG routing group based on requestor's company. Penang→ISGHardware, Johor/PanCen→ISGHardware2."

try {
    $existing = Get-PnPField -List $ListName -Identity $colName -ErrorAction SilentlyContinue
} catch { $existing = $null }

if ($existing) {
    Write-Host "  [SKIP] '$colName' already exists." -ForegroundColor Yellow
} else {
    Write-Host "  [ADD]  '$colName' ($display) — Choice: $($choices -join ', ')" -ForegroundColor Green
    if (-not $WhatIf) {
        Add-PnPField -List $ListName `
                     -InternalName $colName `
                     -DisplayName $display `
                     -Description $desc `
                     -Type Choice `
                     -Group "NIR Columns" `
                     -Choices $choices `
                     -Required $false `
                     -AddToDefaultView $false | Out-Null
        Write-Host "         Done." -ForegroundColor Green
    } else {
        Write-Host "         (WhatIf — skipped)" -ForegroundColor DarkYellow
    }
}

Write-Host "`nColumn provisioning complete." -ForegroundColor Cyan
