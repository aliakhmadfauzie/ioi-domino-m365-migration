<#
.SYNOPSIS
    Creates SharePoint lists for QA & QC Departments migration.

.DESCRIPTION
    Creates the following lists on the target SharePoint site:
    - MainDB_QA_JHR          (Johor QA — main list, FormCode discriminator)
    - MainDB_QC_JHR          (Johor QC — main list, FormCode discriminator)
    - MainDB_QA              (Penang QA — main list, FormCode discriminator)
    - MainDB_QC              (Penang QC — main list, FormCode discriminator)
    - MainDB_QA_Ext_IMS           — IMS documents: SOP, WI, QM, LTM, QP, PQP, SDS, Manuals
    - MainDB_QA_Ext_CAPA          — Corrective actions: ICAR, NCR, OFI, PAR, QACAR
    - MainDB_QA_Ext_Records       — Master lists, QA Info, KRA/KPI
    - MainDB_QC_Ext_Lab           — Laboratory management
    - MainDB_QA_Ext_Assessment    — Assessment & audit
    - MainDB_QA_Ext_Product       — Product quality
    - MainDB_QA_Ext_HalalCert     — Halal & certification
    - MainDB_QA_Ext_ChangeControl — Change control & validation

    Idempotent — skips lists that already exist.

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-hr

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Create-QAQC-Lists.ps1
    .\Create-QAQC-Lists.ps1 -WhatIf

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

# Auto-detect site based on which lists we need to create
if (-not $SiteUrl) {
    $SiteUrl = if ($script:IOI_SHAREPOINT_QA_URL) { $script:IOI_SHAREPOINT_QA_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-qa" }
}

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
$module = Get-Module -ListAvailable -Name PnP.PowerShell
if ($module) {
    Write-Host "Using PnP.PowerShell v$($module.Version)" -ForegroundColor Cyan
} else {
    Import-Module SharePointPnPPowerShellOnline -ErrorAction Stop
}

$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
}
Write-Host "Connected successfully.`n" -ForegroundColor Green

# ---------------------------------------------------------------------------
# List definitions
# ---------------------------------------------------------------------------
$lists = @(
    @{ Title = "MainDB_QA_JHR";          Description = "Main QA list — Johor. All QA forms discriminated by FormCode." },
    @{ Title = "MainDB_QC_JHR";          Description = "Main QC list — Johor. All QC forms discriminated by FormCode." },
    @{ Title = "MainDB_QA";              Description = "Main QA list — Penang/Prai. All QA forms discriminated by FormCode." },
    @{ Title = "MainDB_QC";              Description = "Main QC list — Penang/Prai. All QC forms discriminated by FormCode." },
    @{ Title = "MainDB_QA_Ext_IMS";           Description = "Extension — IMS Documents: SOP, WI, QM, LTM, QP, PQP, SDS, Manuals" },
    @{ Title = "MainDB_QA_Ext_CAPA";          Description = "Extension — Corrective Actions: ICAR, NCR, OFI, PAR, QACAR" },
    @{ Title = "MainDB_QA_Ext_Records";       Description = "Extension — Master Lists, QA Info, KRA/KPI" },
    @{ Title = "MainDB_QC_Ext_Lab";           Description = "Extension — Laboratory Management: QC Lab forms, Calibration, Sensory" },
    @{ Title = "MainDB_QA_Ext_Assessment";    Description = "Extension — Assessment & Audit: Data Analysis, Food Defence, GMP Survey" },
    @{ Title = "MainDB_QA_Ext_Product";       Description = "Extension — Product Quality: Tanker Inspection, PFAD, CCCAR, DIR" },
    @{ Title = "MainDB_QA_Ext_HalalCert";     Description = "Extension — Halal & Certification: Halal, SDS, Certification" },
    @{ Title = "MainDB_QA_Ext_ChangeControl"; Description = "Extension — Change Control & Validation" }
)

# ---------------------------------------------------------------------------
# Create lists
# ---------------------------------------------------------------------------
$created = 0
$skipped = 0
$errors = 0

foreach ($listDef in $lists) {
    $listName = $listDef.Title
    $desc     = $listDef.Description

    $existing = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [SKIP] '$listName' already exists." -ForegroundColor Yellow
        $skipped++
        continue
    }

    if ($WhatIf) {
        Write-Host "  [WHATIF] Would create list: $listName" -ForegroundColor Yellow
        $created++
        continue
    }

    try {
        New-PnPList -Title $listName -Template "GenericList" -Url $listName -ErrorAction Stop | Out-Null
        # Set description separately (PnP v3 compat)
        try {
            $newList = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
            if ($newList) { $newList.Description = $desc; $newList.Update(); Invoke-PnPQuery }
        } catch { }
        Write-Host "  [OK]   Created '$listName'." -ForegroundColor Green
        $created++
    } catch {
        Write-Host "  [ERR]  Failed to create '$listName': $_" -ForegroundColor Red
        $errors++
    }
}

# ---------------------------------------------------------------------------
# Enable versioning
# ---------------------------------------------------------------------------
$mainLists = @("MainDB_QA_JHR", "MainDB_QC_JHR", "MainDB_QA", "MainDB_QC")
$extLists  = @(
    "MainDB_QA_Ext_IMS", "MainDB_QA_Ext_CAPA", "MainDB_QA_Ext_Records",
    "MainDB_QC_Ext_Lab", "MainDB_QA_Ext_Assessment", "MainDB_QA_Ext_Product",
    "MainDB_QA_Ext_HalalCert", "MainDB_QA_Ext_ChangeControl"
)

if (-not $WhatIf) {
    foreach ($listName in $mainLists) {
        try {
            Set-PnPList -Identity $listName -EnableVersioning $true -MajorVersions 50 -ErrorAction SilentlyContinue
            Write-Host "  [OK]   Versioning enabled on '$listName' (50 versions)." -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] Could not set versioning on '$listName': $_" -ForegroundColor DarkYellow
        }
    }
    foreach ($listName in $extLists) {
        try {
            Set-PnPList -Identity $listName -EnableVersioning $true -MajorVersions 25 -ErrorAction SilentlyContinue
            Write-Host "  [OK]   Versioning enabled on '$listName' (25 versions)." -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] Could not set versioning on '$listName': $_" -ForegroundColor DarkYellow
        }
    }
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QA/QC List Creation Summary" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Created: $created | Skipped: $skipped | Errors: $errors"
Write-Host "  Total lists defined: $($lists.Count)"
if ($WhatIf) {
    Write-Host "`n  🔸 WHATIF mode — no changes were made." -ForegroundColor Yellow
}
Write-Host "`n  Next step: Run Add-QAQC-Columns.ps1 to add columns." -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
