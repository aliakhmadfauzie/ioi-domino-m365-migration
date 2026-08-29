<#
.SYNOPSIS
    Creates Cafeteria Inspection (CIR) SharePoint lists under the HR site
    and adds columns matching the Domino CIR form analysis.

.DESCRIPTION
    Creates two extension lists under the HR SharePoint site:
      1. MainDB_HR_Ext_Cafeteria — CIR-specific extension columns
         (editors, committees, TND, inspection metadata)
      2. MainDB_HR_Ext_Records — Sub-record types
         (Vending Machines, Service Records, ECM Cleaning,
          ECM Food Waste, LPG Records)

    Capacity decision HR-CAPACITY-01 selected Option B on 2026-06-01:
    keep planned lowercase cir* fields, but provision them on the CIR
    extension list instead of adding more columns to MainDB_HR.

    The older cIR* columns below are preserved for compatibility; new
    app/schema work should target the lowercase cir* columns.

.PARAMETER SiteUrl
    Target SharePoint site URL.
    Default: https://ioioi.sharepoint.com/sites/ioi-portal-hr

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-CIR-Cafeteria-Lists.ps1

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr",
    [string]$ClientId = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if ($script:IOI_SHAREPOINT_HR_URL) {
    $SiteUrl = $script:IOI_SHAREPOINT_HR_URL
}

if (-not $ClientId -and $script:IOI_PNP_CLIENT_ID) { $ClientId = $script:IOI_PNP_CLIENT_ID }
$script:ProvisioningErrors = @()

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if (-not $ClientId) {
    throw "No PnP client id configured. Set IOI_PNP_CLIENT_ID in apps/code-first/ioicodeapp/config/environment-config.ps1 or pass -ClientId."
}

try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
} catch {
    Write-Host "  Interactive auth failed; trying device login..." -ForegroundColor Yellow
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId $ClientId -ErrorAction Stop
}

# ---------------------------------------------------------------------------
# Helper function
# ---------------------------------------------------------------------------
function Add-FieldIfMissing {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [string]$Type,
        [string]$Description = "",
        [switch]$Required,
        [switch]$WhatIf
    )
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [SKIP] $InternalName already exists" -ForegroundColor Yellow
        return
    }
    if ($WhatIf) {
        Write-Host "  [WHATIF] Would add $InternalName ($DisplayName) as $Type" -ForegroundColor Cyan
        return
    }
    try {
        Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type $Type -Required:$Required -AddToDefaultView
        Write-Host "  [ADDED] $InternalName ($DisplayName)" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] $InternalName : $_" -ForegroundColor Red
        $script:ProvisioningErrors += "$ListName :: $InternalName :: $_"
    }
}

function Add-TextFieldIfMissing  { param($ListName,$InternalName,$DisplayName,$Type,$Description) Add-FieldIfMissing -ListName $ListName -InternalName $InternalName -DisplayName $DisplayName -Type $Type -Description $Description -WhatIf:$WhatIf }
function Add-DateTimeFieldIfMissing { param($ListName,$InternalName,$DisplayName,$Type,$Description) Add-FieldIfMissing -ListName $ListName -InternalName $InternalName -DisplayName $DisplayName -Type $Type -Description $Description -WhatIf:$WhatIf }
function Add-ChoiceFieldIfMissing {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [string[]]$Choices,
        [string]$Description = ""
    )
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [SKIP] $InternalName already exists" -ForegroundColor Yellow
        return
    }
    if ($WhatIf) {
        Write-Host "  [WHATIF] Would add $InternalName ($DisplayName) as Choice [$($Choices -join ', ')]" -ForegroundColor Cyan
        return
    }
    try {
        Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type Choice -Choices $Choices -AddToDefaultView
        Write-Host "  [ADDED] $InternalName ($DisplayName) choices: $($Choices -join ', ')" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] $InternalName : $_" -ForegroundColor Red
    }
}

# ===========================================================================
# 1. Create MainDB_HR_Ext_Cafeteria list
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host " List: MainDB_HR_Ext_Cafeteria" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

$extListName = "MainDB_HR_Ext_Cafeteria"
$extList = Get-PnPList -Identity $extListName -ErrorAction SilentlyContinue
if (-not $extList) {
    if (-not $WhatIf) {
        New-PnPList -Title $extListName -Template GenericList -Url $extListName
        Write-Host "  [CREATED] $extListName" -ForegroundColor Green
    } else {
        Write-Host "  [WHATIF] Would create list $extListName" -ForegroundColor Cyan
    }
} else {
    Write-Host "  [EXISTS] $extListName" -ForegroundColor Yellow
}

# --- Parent Record reference (Text field — code app handles the relationship) ---
Add-TextFieldIfMissing -ListName $extListName -InternalName "ParentRecord" -DisplayName "Parent Record ID" -Type Text
Add-TextFieldIfMissing -ListName $extListName -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type Text

# --- Selected CIR lowercase extension columns (HR-CAPACITY-01 Option B) ---
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirSite" -DisplayName "CIR Site" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirTeamMembers" -DisplayName "CIR Team Members" -Type Note
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirInspector" -DisplayName "CIR Inspector" -Type Text
Add-DateTimeFieldIfMissing -ListName $extListName -InternalName "cirInsDate" -DisplayName "CIR Inspection Date" -Type DateTime
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirInsTime" -DisplayName "CIR Inspection Time" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirSubmittedBy" -DisplayName "CIR Submitted By" -Type Text
Add-DateTimeFieldIfMissing -ListName $extListName -InternalName "cirSubmittedDate" -DisplayName "CIR Submitted Date" -Type DateTime
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirReviewedBy" -DisplayName "CIR Reviewed By" -Type Text
Add-DateTimeFieldIfMissing -ListName $extListName -InternalName "cirReviewedDate" -DisplayName "CIR Reviewed Date" -Type DateTime
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirRemarks" -DisplayName "CIR Remarks" -Type Note
Add-ChoiceFieldIfMissing -ListName $extListName -InternalName "cirCurrentAction" -DisplayName "CIR Current Action" -Choices @("Submitted", "Accepted")
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirACMComm" -DisplayName "CIR ACM Committee" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirECMComm" -DisplayName "CIR ECM Committee" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cirINO" -DisplayName "CIR Inspection Number" -Type Text

# --- Legacy CIR-specific columns retained for compatibility ---
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRInspectorName" -DisplayName "CIR Inspector Name" -Type Text
Add-DateTimeFieldIfMissing -ListName $extListName -InternalName "cIRDueDate" -DisplayName "CIR Inspection Due Date" -Type DateTime
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRSentBy" -DisplayName "CIR Sent By" -Type Text
Add-DateTimeFieldIfMissing -ListName $extListName -InternalName "cIRSentDate" -DisplayName "CIR Sent Date" -Type DateTime
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIREditor1" -DisplayName "CIR Editor 1" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIREditor2" -DisplayName "CIR Editor 2" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIREditor3" -DisplayName "CIR Editor 3" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIREditors" -DisplayName "CIR Editors" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRACMCommittee" -DisplayName "CIR ACM Committee" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRECMCommittee" -DisplayName "CIR ECM Committee" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRTND" -DisplayName "CIR TND Role" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRITGroup" -DisplayName "CIR IT Group" -Type Text
Add-TextFieldIfMissing  -ListName $extListName -InternalName "cIRTeamMembers" -DisplayName "CIR Team Members" -Type Text
Add-ChoiceFieldIfMissing -ListName $extListName -InternalName "cIRRecordType" -DisplayName "CIR Form Type" -Choices @("Form", "NewForm")

# ===========================================================================
# 2. Create MainDB_HR_Ext_Records list
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host " List: MainDB_HR_Ext_Records" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

$recListName = "MainDB_HR_Ext_Records"
$recList = Get-PnPList -Identity $recListName -ErrorAction SilentlyContinue
if (-not $recList) {
    if (-not $WhatIf) {
        New-PnPList -Title $recListName -Template GenericList -Url $recListName
        Write-Host "  [CREATED] $recListName" -ForegroundColor Green
    } else {
        Write-Host "  [WHATIF] Would create list $recListName" -ForegroundColor Cyan
    }
} else {
    Write-Host "  [EXISTS] $recListName" -ForegroundColor Yellow
}

# --- Parent Record reference (Text field) ---
Add-TextFieldIfMissing -ListName $recListName -InternalName "ParentRecord" -DisplayName "Parent Record ID" -Type Text

# --- Sub-record columns ---
Add-ChoiceFieldIfMissing -ListName $recListName -InternalName "cIRRecSubType" -DisplayName "Record Sub-Type" -Choices @("Vending Machines", "Service Records", "ECM Cleaning Records", "ECM Food Waste Records", "LPG Records")
Add-TextFieldIfMissing  -ListName $recListName -InternalName "cIRRecTitle" -DisplayName "Record Title" -Type Text
Add-TextFieldIfMissing  -ListName $recListName -InternalName "cIRRecNotes" -DisplayName "Record Notes" -Type Note

# ===========================================================================
# Summary
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host " Summary" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host " Site: $SiteUrl" -ForegroundColor White
Write-Host " List 1: MainDB_HR_Ext_Cafeteria" -ForegroundColor White
Write-Host " List 2: MainDB_HR_Ext_Records" -ForegroundColor White
if ($script:ProvisioningErrors.Count -gt 0) {
    Write-Host "`nProvisioning completed with errors:" -ForegroundColor Red
    $script:ProvisioningErrors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    throw "CIR extension list provisioning failed for $($script:ProvisioningErrors.Count) field(s)."
}
Write-Host "`nDone." -ForegroundColor Green
