<#
.SYNOPSIS
    Create SharePoint views in all MainDB_QA/MainDB_QC lists filtered by FormCode/ParentFormCode.

.DESCRIPTION
    Creates one view per QA/QC form code in each list.
    - MainDB_QA_JHR, MainDB_QA, MainDB_QC_JHR, MainDB_QC use field "FormCode"
    - MainDB_QA_Ext_* lists use field "ParentFormCode"

.NOTES
    Requires PnP.PowerShell and an active SharePoint connection.
#>

# ===========================================================================
# Form Codes by list
# ===========================================================================
$qaJhrCodes   = @("PCNFL","DataAnalyst","deptkrakpi","QEN","PCNFoodManual","FDAssess","FoodSecManual","FSS","PIMSSOP","PIMSWI","PCIMSQM","PanCenICAR14","PCLTM","PCMatQP","PanCenPQP","PCMSDS","PIoRN","PCMasterFilters","PCQltyRec","PCNCR_IAReport","PCGenOFI","PanCenPAR","QACAR","PCNQAINFO","SDSPCNBM","PanCenSecDoc","PCNSNHManual")
$qcJhrCodes   = @("PFAD","FJBInsp","PISOSOP","ISOManual","PCNISO17025Info","PCLabWkReq","PanCenpqcar","QASystAuditPC","PCNQCInfo","QCPAR","PCRNMR","QCDatabase25","Sensory","tankerinsp25","MasterCalibration","OOSqc","speccode","QCRetained","PCOI","Srvyfrm","PCNHAS")
$qaCodes      = @("APISHIP","ASNHACCP","BRD","CC","CCCAR","CEAR","CIPR","CRRF","CUSTQ","DIR","DOR","FDM","FFSM","FLKRA","GBMB","GHSSDSIOI","GHSSDSNEW","GMP","HAD","HIA","ICAR","IMSHALAL","IMSQSHE","IOIEA","IRN","LTM","MLFG","MLR","MQP","NCR","OFI","PAR","PMRR","POM","PPR","PQP","PT","QAINFO","QP","SECDOC","SMF","SOP","SRR","TQM","VALIDATIONREPORT","WI")
$qcCodes      = @("CHEMSHERPA","COD","COI","ECMPDS","EMTRN","ISOOFI","ISORI","LABOOS","LABQMISO","LABSURVEY","LWR","MLE","NCRISO","PCQI","PQCAR","PSC","QCINFO","QCNTR","QCPAR","RMAM","RNMR","STIR")
$allExtCodes  = ($qaJhrCodes + $qcJhrCodes + $qaCodes + $qcCodes) | Sort-Object -Unique

# ===========================================================================
# Lists using "FormCode" field
# ===========================================================================
$formCodeLists = @(
    @{ Name = "MainDB_QA_JHR"; Codes = $qaJhrCodes },
    @{ Name = "MainDB_QC_JHR"; Codes = $qcJhrCodes },
    @{ Name = "MainDB_QA";     Codes = $qaCodes },
    @{ Name = "MainDB_QC";     Codes = $qcCodes }
)

# ===========================================================================
# Lists using "ParentFormCode" field
# ===========================================================================
$parentFormCodeLists = @(
    "MainDB_QA_Ext_IMS",
    "MainDB_QA_Ext_CAPA",
    "MainDB_QA_Ext_Records",
    "MainDB_QC_Ext_Lab",
    "MainDB_QA_Ext_Assessment",
    "MainDB_QA_Ext_Product",
    "MainDB_QA_Ext_HalalCert",
    "MainDB_QA_Ext_ChangeControl"
)

# ===========================================================================
# Function: Create views
# ===========================================================================
function Create-FormCodeViews {
    param([string]$ListName, [string]$FieldName, [string[]]$FormCodes)

    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "  List: $ListName  (field: $FieldName)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Magenta

    $list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if (-not $list) { Write-Host "  [SKIP] List '$ListName' not found." -ForegroundColor Yellow; return }

    $created = 0; $skipped = 0; $errors = 0

    # Extension lists use simpler field set (no CurrentStatus/DocumentTitle which may not exist)
    $viewFields = if ($ListName -like "MainDB_*_Ext_*") {
        @("Title", "$FieldName", "ID", "Created", "Modified")
    } else {
        @("Title", "$FieldName", "ID", "Created", "Modified", "CurrentStatus", "DocumentNo")
    }

    foreach ($code in $FormCodes) {
        $viewTitle = "By $code"
        $viewName  = "By_$code"
        try {
            $existing = Get-PnPView -List $ListName -Identity $viewName -ErrorAction SilentlyContinue
            if ($existing) { Write-Host "  [SKIP] '$viewTitle' already exists." -ForegroundColor Yellow; $skipped++; continue }
            Add-PnPView -List $ListName -Title $viewTitle -Fields $viewFields `
                -Query "<Where><Eq><FieldRef Name='$FieldName'/><Value Type='Text'>$code</Value></Eq></Where>" `
                -SetAsDefault:$false -Personal:$false -Paged:$true | Out-Null
            Write-Host "  [OK]   Created '$viewTitle'." -ForegroundColor Green
            $created++
        } catch { Write-Host "  [ERR]  Failed '$viewTitle': $_" -ForegroundColor Red; $errors++ }
    }
    Write-Host "  ---" -ForegroundColor Gray
    Write-Host "  Created: $created | Skipped: $skipped | Errors: $errors" -ForegroundColor $(if ($errors -gt 0){"Red"}else{"Green"})
}

# ===========================================================================
# Connect to SharePoint
# ===========================================================================
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

$siteUrl = if ($env:IOI_QAQC_SITE_URL) { $env:IOI_QAQC_SITE_URL } elseif ($script:IOI_SHAREPOINT_QA_URL) { $script:IOI_SHAREPOINT_QA_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-qa" }
$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "Connecting to $siteUrl ..." -ForegroundColor Cyan
if ($clientId) { Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else { Connect-PnPOnline -Url $siteUrl -Interactive -ErrorAction Stop }
Write-Host "Connected.`n" -ForegroundColor Green

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Creating FormCode views for ALL MainDB_QA/QC lists"
Write-Host "  QA Johor: $($qaJhrCodes.Count) | QC Johor: $($qcJhrCodes.Count)"
Write-Host "  QA Penang: $($qaCodes.Count) | QC Penang: $($qcCodes.Count)"
Write-Host "  Total extension codes: $($allExtCodes.Count)"
Write-Host "============================================" -ForegroundColor Cyan

# Process FormCode lists
foreach ($entry in $formCodeLists) {
    Create-FormCodeViews -ListName $entry.Name -FieldName "FormCode" -FormCodes $entry.Codes
}

# Process ParentFormCode lists
foreach ($listName in $parentFormCodeLists) {
    Create-FormCodeViews -ListName $listName -FieldName "ParentFormCode" -FormCodes $allExtCodes
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  All done!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
