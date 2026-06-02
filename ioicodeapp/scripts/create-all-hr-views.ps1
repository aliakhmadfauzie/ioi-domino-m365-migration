<#
.SYNOPSIS
    Create SharePoint views in all MainDB_HR lists filtered by FormCode/ParentFormCode.

.DESCRIPTION
    Creates one view per HR form code in each MainDB_HR list.
    - MainDB_HR, MainDB_HR_JHR use field "FormCode"
    - MainDB_HR_Ext_* lists use field "ParentFormCode"

.NOTES
    Requires PnP.PowerShell and an active SharePoint connection.
#>

# ===========================================================================
# HR Form Codes — Penang (Prai)
# ===========================================================================
$penangFormCodes = @(
    "AWHR", "BSD", "CIR", "CWR", "DRD",
    "EEN", "EPDU", "EPHR", "ESF", "FTCR",
    "FWWPD", "FWWPE", "GDSN", "HEALTHINFO",
    "HRAPR", "HRINFO", "INTERN", "INTERVIEWDB",
    "JD", "NDF", "ORGCHART", "OWP", "PAF",
    "SR", "TMPU", "TNPRA"
)

# ===========================================================================
# HR Form Codes — Johor (differs from Penang)
# ===========================================================================
$johorFormCodes = @(
    "PCNBkStf", "cancomp", "ContractorReg", "TyphoidVacc", "UniformReq",
    "pcnjd", "LateComing", "manpowerReq", "NightVisit", "PCNOrgChart",
    "AppTest", "SpVisit", "workins", "hostela", "PCNTND", "PCNDriver"
)

# ===========================================================================
# Extension lists use ParentFormCode — combine all codes
# ===========================================================================
$allExtCodes = ($penangFormCodes + $johorFormCodes) | Sort-Object -Unique

# ===========================================================================
# Lists using "FormCode" field
# ===========================================================================
$formCodeLists = @(
    "MainDB_HR",
    "MainDB_HR_JHR"
)

# ===========================================================================
# Lists using "ParentFormCode" field
# ===========================================================================
$parentFormCodeLists = @(
    "MainDB_HR_Ext_Staffing",
    "MainDB_HR_Ext_Lifecycle",
    "MainDB_HR_Ext_Attendance",
    "MainDB_HR_Ext_ForeignWorker",
    "MainDB_HR_Ext_OrgStructure",
    "MainDB_HR_Ext_Welfare",
    "MainDB_HR_Ext_Compliance",
    "MainDB_HR_Ext_Operations"
)

# ===========================================================================
# Function: Create views filtered by FormCode/ParentFormCode
# ===========================================================================
function Create-FormCodeViews {
    param(
        [string]$ListName,
        [string]$FieldName,
        [string[]]$FormCodes
    )

    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "  List: $ListName  (field: $FieldName)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Magenta

    # Verify list exists
    $list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if (-not $list) {
        Write-Host "  [SKIP] List '$ListName' not found on this site." -ForegroundColor Yellow
        return
    }

    $createdCount = 0
    $skippedCount = 0
    $errorCount = 0

    foreach ($code in $FormCodes) {
        $viewTitle = "By $code"
        $viewName  = "By_$code"

        try {
            $existingView = Get-PnPView -List $ListName -Identity $viewName -ErrorAction SilentlyContinue

            if ($existingView) {
                Write-Host "  [SKIP] '$viewTitle' already exists." -ForegroundColor Yellow
                $skippedCount++
                continue
            }

            # Extension lists use simpler field set (no CurrentStatus/EmployeeName)
            $viewFields = if ($ListName -like "MainDB_HR_Ext_*") {
                @("Title", "$FieldName", "ID", "Created", "Modified")
            } else {
                @("Title", "$FieldName", "ID", "Created", "Modified", "CurrentStatus", "EmployeeName")
            }

            Add-PnPView -List $ListName `
                -Title $viewTitle `
                -Fields $viewFields `
                -Query "<Where><Eq><FieldRef Name='$FieldName'/><Value Type='Text'>$code</Value></Eq></Where>" `
                -SetAsDefault:$false `
                -Personal:$false `
                -Paged:$true

            Write-Host "  [OK]   Created '$viewTitle'." -ForegroundColor Green
            $createdCount++
        } catch {
            Write-Host "  [ERR]  Failed '$viewTitle': $_" -ForegroundColor Red
            $errorCount++
        }
    }

    Write-Host "  ---" -ForegroundColor Gray
    Write-Host "  Created: $createdCount | Skipped: $skippedCount | Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0){"Red"}else{"Green"})
}

# ===========================================================================
# Connect to SharePoint
# ===========================================================================
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

$siteUrl = if ($script:IOI_SHAREPOINT_HR_URL) { $script:IOI_SHAREPOINT_HR_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-hr" }
$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "Connecting to $siteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $siteUrl -Interactive -ErrorAction Stop
}
Write-Host "Connected.`n" -ForegroundColor Green

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Creating FormCode views for ALL MainDB_HR lists"
Write-Host "  Penang form codes: $($penangFormCodes.Count)"
Write-Host "  Johor form codes: $($johorFormCodes.Count)"
Write-Host "  Total extension codes: $($allExtCodes.Count)"
Write-Host "============================================" -ForegroundColor Cyan

# Process MainDB_HR with Penang form codes
foreach ($listName in @("MainDB_HR")) {
    Create-FormCodeViews -ListName $listName -FieldName "FormCode" -FormCodes $penangFormCodes
}

# Process MainDB_HR_JHR with Johor form codes
foreach ($listName in @("MainDB_HR_JHR")) {
    Create-FormCodeViews -ListName $listName -FieldName "FormCode" -FormCodes $johorFormCodes
}

# Process extension lists with all codes
foreach ($listName in $parentFormCodeLists) {
    Create-FormCodeViews -ListName $listName -FieldName "ParentFormCode" -FormCodes $allExtCodes
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  All done!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
