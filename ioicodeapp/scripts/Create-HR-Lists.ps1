<#
.SYNOPSIS
    Creates SharePoint lists for HR Department migration: MainDB_HR, MainDB_HR_JHR,
    and all extension lists.

.DESCRIPTION
    Creates the following lists on the HR SharePoint site:
    - MainDB_HR          (Prai/Penang — main list, FormCode discriminator)
    - MainDB_HR_JHR      (Johor — main list, FormCode discriminator)
    - MainDB_HR_Ext_Staffing      — Recruitment forms: SR, manpowerReq, FTCR, CWR, INTERVIEWDB
    - MainDB_HR_Ext_Lifecycle     — Employee lifecycle: EEN, EPDU, EPHR, INTERN, PAF
    - MainDB_HR_Ext_Attendance    — Attendance: AWHR, DRD, NDF, LateComing, NightVisit
    - MainDB_HR_Ext_ForeignWorker — Foreign workers: FWWPD, FWWPE, OWP, TNPRA, TyphoidVacc, UniformReq
    - MainDB_HR_Ext_OrgStructure  — Org structure: ORGCHART, PCNOrgChart, JD, pcnjd
    - MainDB_HR_Ext_Welfare       — Welfare: BSD, PCNBkStf, CIR, cancomp, GDSN, HEALTHINFO
    - MainDB_HR_Ext_Compliance    — Compliance: PCNTND, TMPU, ContractorReg
    - MainDB_HR_Ext_Operations    — Internal ops: HRINFO, HRAPR, ESF, INTERVIEWDB, hostela, workins, SpVisit, PCNDriver

    Idempotent — skips lists that already exist.

.PARAMETER SiteUrl
    SharePoint site URL for HR. Default: https://ioioi.sharepoint.com/sites/ioi-portal-hr

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Create-HR-Lists.ps1

    .\Create-HR-Lists.ps1 -WhatIf

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if ($script:IOI_SHAREPOINT_HR_URL) {
    $SiteUrl = $script:IOI_SHAREPOINT_HR_URL
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
    @{ Title = "MainDB_HR";              Description = "Main HR list — Penang/Prai. All HR forms discriminated by FormCode." },
    @{ Title = "MainDB_HR_JHR";          Description = "Main HR list — Johor. All HR forms discriminated by FormCode." },
    @{ Title = "MainDB_HR_Ext_Staffing";      Description = "Extension — Recruitment & Staffing: SR, manpowerReq, FTCR, CWR, INTERVIEWDB" },
    @{ Title = "MainDB_HR_Ext_Lifecycle";     Description = "Extension — Employee Lifecycle: EEN, EPDU, EPHR, INTERN, PAF" },
    @{ Title = "MainDB_HR_Ext_Attendance";    Description = "Extension — Attendance, Leave & Discipline: AWHR, DRD, NDF, LateComing, NightVisit" },
    @{ Title = "MainDB_HR_Ext_ForeignWorker"; Description = "Extension — Foreign Workers: FWWPD, FWWPE, OWP, TNPRA, TyphoidVacc, UniformReq" },
    @{ Title = "MainDB_HR_Ext_OrgStructure";  Description = "Extension — Org Structure: ORGCHART, PCNOrgChart, JD, pcnjd" },
    @{ Title = "MainDB_HR_Ext_Welfare";       Description = "Extension — Welfare & Facilities: BSD, PCNBkStf, CIR, cancomp, GDSN, HEALTHINFO" },
    @{ Title = "MainDB_HR_Ext_Compliance";    Description = "Extension — Compliance & Training: PCNTND, TMPU, ContractorReg" },
    @{ Title = "MainDB_HR_Ext_Operations";    Description = "Extension — Internal HR Operations: HRINFO, HRAPR, ESF, hostela, workins, SpVisit, PCNDriver" }
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
        # Set description separately
        try {
            $newList = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
            if ($newList) { $newList.Description = $desc; $newList.Update(); Invoke-PnPQuery }
        } catch { /* non-critical */ }
        Write-Host "  [OK]   Created '$listName'." -ForegroundColor Green
        $created++
    } catch {
        Write-Host "  [ERR]  Failed to create '$listName': $_" -ForegroundColor Red
        $errors++
    }
}

# ---------------------------------------------------------------------------
# Enable versioning on main lists
# ---------------------------------------------------------------------------
$mainLists = @("MainDB_HR", "MainDB_HR_JHR")
$extLists  = @(
    "MainDB_HR_Ext_Staffing",
    "MainDB_HR_Ext_Lifecycle",
    "MainDB_HR_Ext_Attendance",
    "MainDB_HR_Ext_ForeignWorker",
    "MainDB_HR_Ext_OrgStructure",
    "MainDB_HR_Ext_Welfare",
    "MainDB_HR_Ext_Compliance",
    "MainDB_HR_Ext_Operations"
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
Write-Host "  List Creation Summary" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Created: $created | Skipped: $skipped | Errors: $errors"
Write-Host "  Total lists defined: $($lists.Count)"
if ($WhatIf) {
    Write-Host "`n  🔸 WHATIF mode — no changes were made." -ForegroundColor Yellow
}
Write-Host "`n  Next step: Run Add-HR-Columns.ps1 to add columns." -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
