<#
.SYNOPSIS
    Creates Contract Worker Requisition (CWR) SharePoint extension lists
    under the HR site.

.DESCRIPTION
    Creates:
      1. MainDB_HR_Ext_CWR — CWR-specific extension columns

.PARAMETER SiteUrl
    Target SharePoint site URL.
    Default: https://ioioi.sharepoint.com/sites/ioi-portal-hr

.EXAMPLE
    .\Add-CWR-ContractWorker-Lists.ps1
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
try { Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop }
catch { Connect-PnPOnline -Url $SiteUrl -UseWebLogin }

function Add-TextFieldIfMissing {
    param($ListName, $InternalName, $DisplayName, $Description)
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { Write-Host "  [SKIP] $InternalName" -ForegroundColor Yellow; return }
    if ($WhatIf) { Write-Host "  [WHATIF] $InternalName"; return }
    Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type Text -AddToDefaultView
    Write-Host "  [ADDED] $InternalName ($DisplayName)" -ForegroundColor Green
}
function Add-DateFieldIfMissing {
    param($ListName, $InternalName, $DisplayName, $Description)
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { Write-Host "  [SKIP] $InternalName" -ForegroundColor Yellow; return }
    if ($WhatIf) { Write-Host "  [WHATIF] $InternalName"; return }
    Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type DateTime -AddToDefaultView
    Write-Host "  [ADDED] $InternalName ($DisplayName)" -ForegroundColor Green
}
function Add-NumberFieldIfMissing {
    param($ListName, $InternalName, $DisplayName, $Description)
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { Write-Host "  [SKIP] $InternalName" -ForegroundColor Yellow; return }
    if ($WhatIf) { Write-Host "  [WHATIF] $InternalName"; return }
    Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type Number -AddToDefaultView
    Write-Host "  [ADDED] $InternalName ($DisplayName)" -ForegroundColor Green
}
function Add-ChoiceFieldIfMissing {
    param($ListName, $InternalName, $DisplayName, $Choices, $Description)
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { Write-Host "  [SKIP] $InternalName" -ForegroundColor Yellow; return }
    if ($WhatIf) { Write-Host "  [WHATIF] $InternalName"; return }
    Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName -Type Choice -Choices $Choices -AddToDefaultView
    Write-Host "  [ADDED] $InternalName ($DisplayName) choices: $($Choices -join ', ')" -ForegroundColor Green
}

# ===========================================================================
# Create MainDB_HR_Ext_CWR
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host " List: MainDB_HR_Ext_CWR" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

$listName = "MainDB_HR_Ext_CWR"
$list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
if (-not $list) {
    if (-not $WhatIf) { New-PnPList -Title $listName -Template GenericList -Url $listName; Write-Host "  [CREATED] $listName" -ForegroundColor Green }
} else { Write-Host "  [EXISTS] $listName" -ForegroundColor Yellow }

# Parent reference
Add-TextFieldIfMissing -ListName $listName -InternalName "ParentRecord" -DisplayName "Parent Record ID"

# Header & Requestor
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRCategory"       -DisplayName "CWR Category"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRType"           -DisplayName "CWR Type"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRSendTo"         -DisplayName "CWR Send To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRNoWorkers"      -DisplayName "CWR No. of Workers"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRWorkstation"    -DisplayName "CWR Workstation"

# Contract Periods (×3)
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod1From"    -DisplayName "CWR Period 1 From"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod1To"      -DisplayName "CWR Period 1 To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPeriod1Days"    -DisplayName "CWR Period 1 Days"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2From"    -DisplayName "CWR Period 2 From"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2To"      -DisplayName "CWR Period 2 To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPeriod2Days"    -DisplayName "CWR Period 2 Days"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod3From"    -DisplayName "CWR Period 3 From"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod3To"      -DisplayName "CWR Period 3 To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPeriod3Days"    -DisplayName "CWR Period 3 Days"

# Job Details
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRJobDescription" -DisplayName "CWR Job Description"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRWorkingHour"    -DisplayName "CWR Working Hour"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRContractPeriod" -DisplayName "CWR Contract Period"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRCurrentWorkers" -DisplayName "CWR Current Workers"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWREffectiveDate"  -DisplayName "CWR Effective Date"

# Second Site
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRSite2"          -DisplayName "CWR Site 2"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRWorkers2"       -DisplayName "CWR Workers 2"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRWorkstation2"   -DisplayName "CWR Workstation 2"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRJD2"            -DisplayName "CWR Job Desc 2"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2_1From"  -DisplayName "CWR Site2 Period 1 From"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2_1To"    -DisplayName "CWR Site2 Period 1 To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPeriod2_1Days"  -DisplayName "CWR Site2 Period 1 Days"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2_2From"  -DisplayName "CWR Site2 Period 2 From"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2_2To"    -DisplayName "CWR Site2 Period 2 To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPeriod2_2Days"  -DisplayName "CWR Site2 Period 2 Days"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2_3From"  -DisplayName "CWR Site2 Period 3 From"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRPeriod2_3To"    -DisplayName "CWR Site2 Period 3 To"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPeriod2_3Days"  -DisplayName "CWR Site2 Period 3 Days"

# HOD 1st Approval
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRHODApp"         -DisplayName "CWR HOD Decision"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHODName"       -DisplayName "CWR HOD Name"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRHODDate"       -DisplayName "CWR HOD Date"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHODRemark"     -DisplayName "CWR HOD Remark"

# HR Review
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRHRApp"          -DisplayName "CWR HR Decision"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHRName"        -DisplayName "CWR HR Name"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHRPosition"    -DisplayName "CWR HR Position"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRHRDate"        -DisplayName "CWR HR Date"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHRRemark"      -DisplayName "CWR HR Remark"

# Vendor Assignment
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRVendor"        -DisplayName "CWR Vendor"
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRPax"           -DisplayName "CWR PAX"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRDateHR"        -DisplayName "CWR Date HR"

# HOD 2nd Approval
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRHODApp2"       -DisplayName "CWR HOD Decision 2"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHODName2"      -DisplayName "CWR HOD Name 2"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRHODDate2"      -DisplayName "CWR HOD Date 2"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHODRemark2"    -DisplayName "CWR HOD Remark 2"

# Form2 Additional
Add-NumberFieldIfMissing -ListName $listName -InternalName "cWRHODApp3"       -DisplayName "CWR HOD Decision 3"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHODName3"      -DisplayName "CWR HOD Name 3"
Add-DateFieldIfMissing   -ListName $listName -InternalName "cWRHODDate3"      -DisplayName "CWR HOD Date 3"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHODRemark3"    -DisplayName "CWR HOD Remark 3"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRDivHead"       -DisplayName "CWR Division Head"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRPermCategory"  -DisplayName "CWR Permanent Category"

# Editors & Roles
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWREditor1"       -DisplayName "CWR Editor 1"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWREditor2"       -DisplayName "CWR Editor 2"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWREditor2a"      -DisplayName "CWR Editor 2a"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWREditor3"       -DisplayName "CWR Editor 3"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWREditor4"       -DisplayName "CWR Editor 4"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWREditor5"       -DisplayName "CWR Editor 5"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRITGroup"       -DisplayName "CWR IT Group"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHRGroup"       -DisplayName "CWR HR Group"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHR2Group"      -DisplayName "CWR HR2 Group"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHRHOD"         -DisplayName "CWR HR HOD"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRMTN"           -DisplayName "CWR MTN Role"
Add-TextFieldIfMissing   -ListName $listName -InternalName "cWRHistoryLog"    -DisplayName "CWR History Log"

# Form type
Add-ChoiceFieldIfMissing -ListName $listName -InternalName "cWRFormType"      -DisplayName "CWR Form Type" -Choices @("Form", "Form2")

Write-Host "`nDone." -ForegroundColor Green
