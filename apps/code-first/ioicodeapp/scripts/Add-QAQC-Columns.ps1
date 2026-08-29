<#
.SYNOPSIS
    Adds columns to MainDB_QA_JHR, MainDB_QC_JHR, MainDB_QA, MainDB_QC and QA/QC extension lists.

.DESCRIPTION
    Idempotent — skips columns that already exist.
    Run after Create-QAQC-Lists.ps1.

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-hr

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-QAQC-Columns.ps1
    .\Add-QAQC-Columns.ps1 -WhatIf

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

# Auto-detect site - must be passed explicitly since QA/QC are different sites
if (-not $SiteUrl) {
    Write-Error "You must specify -SiteUrl. Use the QA URL or QC URL."
    Write-Host "  Example for QA:  .\Add-QAQC-Columns.ps1 -SiteUrl `$script:IOI_SHAREPOINT_QA_URL"
    Write-Host "  Example for QC:  .\Add-QAQC-Columns.ps1 -SiteUrl `$script:IOI_SHAREPOINT_QC_URL"
    return
}

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
$module = Get-Module -ListAvailable -Name PnP.PowerShell
if ($module) { Write-Host "Using PnP.PowerShell v$($module.Version)" -ForegroundColor Cyan
} else { Import-Module SharePointPnPPowerShellOnline -ErrorAction Stop }

$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if ($clientId) { Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else { Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop }
Write-Host "Connected successfully.`n" -ForegroundColor Green

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text","Note","DateTime","Boolean","Choice","Number","Currency")]
        [string]$Type,
        [string[]]$Choices = @(),
        [switch]$Required
    )

    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { Write-Host "  [skip] $ListName :: $InternalName  (already exists)" -ForegroundColor DarkGray; return }

    if ($WhatIf) { Write-Host "  [whatif] Would add: $ListName :: $InternalName  ($Type)" -ForegroundColor Yellow; return }

    try {
        $params = @{ List = $ListName; InternalName = $InternalName; DisplayName = $DisplayName; Type = $Type }
        if ($Required) { $params.Required = $true }
        if ($Type -eq "Choice" -and $Choices.Count -gt 0) { Add-PnPField @params -Choices $Choices | Out-Null }
        else { Add-PnPField @params | Out-Null }
        Write-Host "  [added] $ListName :: $InternalName  ($Type)" -ForegroundColor Green
    } catch { Write-Host "  [error] $ListName :: $InternalName`: $_" -ForegroundColor Red }
}

# ===========================================================================
# Johor QA — Form Codes
# ===========================================================================
$qaJhrCodes = @("PCNFL","DataAnalyst","deptkrakpi","QEN","PCNFoodManual","FDAssess","FoodSecManual","FSS","PIMSSOP","PIMSWI","PCIMSQM","PanCenICAR14","PCLTM","PCMatQP","PanCenPQP","PCMSDS","PIoRN","PCMasterFilters","PCQltyRec","PCNCR_IAReport","PCGenOFI","PanCenPAR","QACAR","PCNQAINFO","SDSPCNBM","PanCenSecDoc","PCNSNHManual")

# ===========================================================================
# Johor QC — Form Codes
# ===========================================================================
$qcJhrCodes = @("PFAD","FJBInsp","PISOSOP","ISOManual","PCNISO17025Info","PCLabWkReq","PanCenpqcar","QASystAuditPC","PCNQCInfo","QCPAR","PCRNMR","QCDatabase25","Sensory","tankerinsp25","MasterCalibration","OOSqc","speccode","QCRetained","PCOI","Srvyfrm","PCNHAS")

# ===========================================================================
# Penang QA — Form Codes
# ===========================================================================
$qaCodes = @("APISHIP","ASNHACCP","BRD","CC","CCCAR","CEAR","CIPR","CRRF","CUSTQ","DIR","DOR","FDM","FFSM","FLKRA","GBMB","GHSSDSIOI","GHSSDSNEW","GMP","HAD","HIA","ICAR","IMSHALAL","IMSQSHE","IOIEA","IRN","LTM","MLFG","MLR","MQP","NCR","OFI","PAR","PMRR","POM","PPR","PQP","PT","QAINFO","QP","SECDOC","SMF","SOP","SRR","TQM","VALIDATIONREPORT","WI")

# ===========================================================================
# Penang QC — Form Codes
# ===========================================================================
$qcCodes = @("CHEMSHERPA","COD","COI","ECMPDS","EMTRN","ISOOFI","ISORI","LABOOS","LABQMISO","LABSURVEY","LWR","MLE","NCRISO","PCQI","PQCAR","PSC","QCINFO","QCNTR","QCPAR","RMAM","RNMR","STIR")

# All form codes for extension lists
$allCodes = ($qaJhrCodes + $qcJhrCodes + $qaCodes + $qcCodes) | Sort-Object -Unique

# ===========================================================================
# Core column function (applied to each main list)
# ===========================================================================
function Add-CoreColumns {
    param([string]$ListName, [string[]]$FormCodes)

    Write-Host "`n============================================" -ForegroundColor Cyan
    Write-Host "  $ListName — Core Columns" -ForegroundColor White
    Write-Host "============================================" -ForegroundColor Cyan

    Add-ColumnIfMissing -ListName $ListName -InternalName "FormCode" -DisplayName "Form Code" -Type "Choice" -Required -Choices $FormCodes
    Add-ColumnIfMissing -ListName $ListName -InternalName "CurrentStatus" -DisplayName "Current Status" -Type "Choice" -Choices @("Draft","Submitted","HOD Review","QA Review","Manager Review","Completed","Rejected","Cancelled")
    Add-ColumnIfMissing -ListName $ListName -InternalName "Site" -DisplayName "Site" -Type "Choice" -Required -Choices @("Johor","Penang","Prai")
    Add-ColumnIfMissing -ListName $ListName -InternalName "DocumentNo" -DisplayName "Document No" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "DocumentTitle" -DisplayName "Document Title" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "DocumentType" -DisplayName "Document Type" -Type "Choice" -Choices @("SOP","WI","QM","QP","PQP","SDS","LTM","Form","Record","Report","Manual","Procedure","Checklist","Other")
    Add-ColumnIfMissing -ListName $ListName -InternalName "Department" -DisplayName "Department" -Type "Choice" -Choices @("QA","QC","QA/QC")
    Add-ColumnIfMissing -ListName $ListName -InternalName "SubmittedBy" -DisplayName "Submitted By" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "SubmittedDate" -DisplayName "Submitted Date" -Type "DateTime"
    Add-ColumnIfMissing -ListName $ListName -InternalName "ReviewedBy" -DisplayName "Reviewed By" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "ReviewDate" -DisplayName "Review Date" -Type "DateTime"
    Add-ColumnIfMissing -ListName $ListName -InternalName "ApprovedBy" -DisplayName "Approved By" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "ApprovalDate" -DisplayName "Approval Date" -Type "DateTime"
    Add-ColumnIfMissing -ListName $ListName -InternalName "EffectiveDate" -DisplayName "Effective Date" -Type "DateTime"
    Add-ColumnIfMissing -ListName $ListName -InternalName "RevisionNo" -DisplayName "Revision No" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "Remarks" -DisplayName "Remarks" -Type "Note"
    Add-ColumnIfMissing -ListName $ListName -InternalName "IsLocked" -DisplayName "Is Locked" -Type "Boolean"
    Add-ColumnIfMissing -ListName $ListName -InternalName "WorkflowStage" -DisplayName "Workflow Stage" -Type "Number"
    Add-ColumnIfMissing -ListName $ListName -InternalName "EnvironmentTag" -DisplayName "Environment Tag" -Type "Choice" -Choices @("Production","UAT","Development")
}

# ===========================================================================
# 1. MainDB_QA_JHR
# ===========================================================================
Add-CoreColumns -ListName "MainDB_QA_JHR" -FormCodes $qaJhrCodes

# ===========================================================================
# 2. MainDB_QC_JHR
# ===========================================================================
Add-CoreColumns -ListName "MainDB_QC_JHR" -FormCodes $qcJhrCodes

# ===========================================================================
# 3. MainDB_QA (Penang)
# ===========================================================================
Add-CoreColumns -ListName "MainDB_QA" -FormCodes $qaCodes

# ===========================================================================
# 4. MainDB_QC (Penang)
# ===========================================================================
Add-CoreColumns -ListName "MainDB_QC" -FormCodes $qcCodes

# ===========================================================================
# 5. Extension Lists
# ===========================================================================
function Add-ExtColumns {
    param([string]$ListName, [string[]]$SpecificCodes = $allCodes)

    Write-Host "`n============================================" -ForegroundColor Cyan
    Write-Host "  $ListName" -ForegroundColor White
    Write-Host "============================================" -ForegroundColor Cyan

    Add-ColumnIfMissing -ListName $ListName -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
    Add-ColumnIfMissing -ListName $ListName -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" -Choices $SpecificCodes
}

Add-ExtColumns -ListName "MainDB_QA_Ext_IMS" -SpecificCodes @("PIMSSOP","PIMSWI","PCIMSQM","PCLTM","PCMatQP","PanCenPQP","PCMSDS","SDSPCNBM","PanCenSecDoc","PCNSNHManual","PCNFoodManual","FoodSecManual","IMSQSHE","SOP","WI","LTM","MQP","PQP","POM","PPR","QP","SMF","FFSM","FDM","ASNHACCP")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_IMS" -InternalName "IMS_DocContent" -DisplayName "IMS Document Content" -Type "Note"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_IMS" -InternalName "IMS_ReviewComments" -DisplayName "IMS Review Comments" -Type "Note"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_IMS" -InternalName "IMS_ApproverComments" -DisplayName "IMS Approver Comments" -Type "Note"

Add-ExtColumns -ListName "MainDB_QA_Ext_CAPA" -SpecificCodes @("PanCenICAR14","PCNCR_IAReport","PCGenOFI","PanCenPAR","QACAR","ICAR","NCR","OFI","PAR","ISOOFI","NCRISO","QCPAR")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_CAPA" -InternalName "CAPA_RootCause" -DisplayName "CAPA Root Cause" -Type "Note"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_CAPA" -InternalName "CAPA_CorrectiveAction" -DisplayName "CAPA Corrective Action" -Type "Note"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_CAPA" -InternalName "CAPA_PreventiveAction" -DisplayName "CAPA Preventive Action" -Type "Note"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_CAPA" -InternalName "CAPA_ClosureDate" -DisplayName "CAPA Closure Date" -Type "DateTime"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_CAPA" -InternalName "CAPA_Status" -DisplayName "CAPA Status" -Type "Choice" -Choices @("Open","In Progress","Verification","Closed")

Add-ExtColumns -ListName "MainDB_QA_Ext_Records" -SpecificCodes @("PIoRN","PCMasterFilters","PCQltyRec","PCNQAINFO","deptkrakpi","PCNFL","MLFG","MLR","QAINFO","FLKRA","BRD","IRN","PCNI","Srvyfrm")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Records" -InternalName "Records_Type" -DisplayName "Records Type" -Type "Choice" -Choices @("Master List","Record","Info Centre","KRA/KPI","Functional Team","Survey")

Add-ExtColumns -ListName "MainDB_QC_Ext_Lab" -SpecificCodes @("PCNISO17025Info","PCLabWkReq","PanCenpqcar","QASystAuditPC","PCNQCInfo","PCRNMR","QCDatabase25","Sensory","MasterCalibration","OOSqc","speccode","LABOOS","LABQMISO","LABSURVEY","LWR","MLE","PCQI","PQCAR","QCINFO","RNMR","PCOI","PSC","QCNTR")
Add-ColumnIfMissing -ListName "MainDB_QC_Ext_Lab" -InternalName "Lab_TestType" -DisplayName "Lab Test Type" -Type "Choice" -Choices @("Chemical","Physical","Microbiological","Sensory","Calibration","OOS","Specification","Other")
Add-ColumnIfMissing -ListName "MainDB_QC_Ext_Lab" -InternalName "Lab_TestMethod" -DisplayName "Lab Test Method" -Type "Text"
Add-ColumnIfMissing -ListName "MainDB_QC_Ext_Lab" -InternalName "Lab_Result" -DisplayName "Lab Result" -Type "Note"

Add-ExtColumns -ListName "MainDB_QA_Ext_Assessment" -SpecificCodes @("DataAnalyst","FDAssess","FSS","QEN","GMP","HIA","CEAR","CUSTQ","CRRF")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Assessment" -InternalName "Assessment_Type" -DisplayName "Assessment Type" -Type "Choice" -Choices @("Self Inspection","Food Defence","GMP Survey","Emergency Recall","Internal Audit","Customer Audit","Customer Questionnaire")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Assessment" -InternalName "Assessment_Score" -DisplayName "Assessment Score" -Type "Number"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Assessment" -InternalName "Assessment_Findings" -DisplayName "Assessment Findings" -Type "Note"

Add-ExtColumns -ListName "MainDB_QA_Ext_Product" -SpecificCodes @("PFAD","FJBInsp","tankerinsp25","QCRetained","CCCAR","DIR","DOR","TQM","APISHIP")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Product" -InternalName "Product_Type" -DisplayName "Product Type" -Type "Text"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Product" -InternalName "Product_BatchNo" -DisplayName "Product Batch No" -Type "Text"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_Product" -InternalName "Product_InspectionDate" -DisplayName "Product Inspection Date" -Type "DateTime"

Add-ExtColumns -ListName "MainDB_QA_Ext_HalalCert" -SpecificCodes @("PCNHAS","HAD","HAD2","IMSHALAL","GBMB","GHSSDSIOI","GHSSDSNEW","GHSSDSBM")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_HalalCert" -InternalName "Cert_Type" -DisplayName "Certification Type" -Type "Choice" -Choices @("Halal","SDS","GHS","Certification","Other")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_HalalCert" -InternalName "Cert_ExpiryDate" -DisplayName "Certification Expiry Date" -Type "DateTime"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_HalalCert" -InternalName "Cert_Body" -DisplayName "Certification Body" -Type "Text"

Add-ExtColumns -ListName "MainDB_QA_Ext_ChangeControl" -SpecificCodes @("CC","VALIDATIONREPORT","PCNSNHManual","PCMasterFilters")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_ChangeControl" -InternalName "CC_ChangeType" -DisplayName "Change Control Type" -Type "Choice" -Choices @("Process Change","Equipment Change","Material Change","Specification Change","Document Change","Other")
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_ChangeControl" -InternalName "CC_Justification" -DisplayName "Change Justification" -Type "Note"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_ChangeControl" -InternalName "CC_ValidationRequired" -DisplayName "Validation Required" -Type "Boolean"
Add-ColumnIfMissing -ListName "MainDB_QA_Ext_ChangeControl" -InternalName "CC_ApprovalDate" -DisplayName "Change Approval Date" -Type "DateTime"

# ===========================================================================
# Summary
# ===========================================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QA/QC Column Addition Complete" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
if ($WhatIf) { Write-Host "  🔸 WHATIF mode — no changes were made." -ForegroundColor Yellow }
Write-Host "`n  Next step: Run create-all-qaqc-views.ps1 to create FormCode views." -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
