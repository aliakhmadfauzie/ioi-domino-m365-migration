<#
.SYNOPSIS
    Create SharePoint views in all MainDB_IT lists filtered by FormCode/ParentFormCode.
.DESCRIPTION
    Creates one view per IT form code in each MainDB_IT list.
    - MainDB_IT, MainDB_IT_Attachments, MainDB_IT_cr_approvalrecord use field "FormCode"
    - MainDB_IT_Ext_* lists use field "ParentFormCode"
    (MainDB_IT_Ext_Support was already done separately)
.NOTES
    Requires PnP.PowerShell and an active SharePoint connection.
#>

$allFormCodes = @(
    "EAF", "EDL", "HI", "HI_JHR", "HWRR",
    "IAL1", "IAL2", "IAL3", "IAL4", "IAL5",
    "IOIP", "ITDR", "ITDR2", "ITI", "ITP", "ITP2",
    "ITSC", "ITSSR",
    "NIR",
    "PRF",
    "RS",
    "SAPAMR", "SAPCA", "SAPCR", "SAPDRP", "SAPSLCF", "SAPSOF", "SAPSOF2", "SAPTR",
    "SFAR", "SRVR",
    "UR",
    "VPN"
)

# Lists using "FormCode" field
$formCodeLists = @(
    "MainDB_IT",
    "MainDB_IT_JHR",    # Johor site — same view structure
    "MainDB_IT_Attachments",
    "MainDB_IT_cr_approvalrecord"
)

# Lists using "ParentFormCode" field (Ext_Support already done)
$parentFormCodeLists = @(
    "MainDB_IT_Ext_Access",
    "MainDB_IT_Ext_Assets",
    "MainDB_IT_Ext_Docs",
    "MainDB_IT_Ext_Infra",
    "MainDB_IT_Ext_Policy",
    "MainDB_IT_Ext_SAP"
)

function Create-FormCodeViews {
    param(
        [string]$ListName,
        [string]$FieldName,
        [string[]]$FormCodes
    )

    Write-Host "`n========================================" -ForegroundColor Magenta
    Write-Host "  List: $ListName  (field: $FieldName)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Magenta

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

            Add-PnPView -List $ListName `
                -Title $viewTitle `
                -Fields @("Title", "$FieldName", "ID", "Created", "Modified") `
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

# ---------------------------------------------------------------------------
# Connect to SharePoint
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

$siteUrl = if ($script:IOI_SHAREPOINT_IT_URL) { $script:IOI_SHAREPOINT_IT_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-it" }
$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "Connecting to $siteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $siteUrl -Interactive -ErrorAction Stop
}
Write-Host "Connected.`n" -ForegroundColor Green

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Creating FormCode views for ALL MainDB_IT lists"
Write-Host "  Total form codes: $($allFormCodes.Count)"
Write-Host "============================================" -ForegroundColor Cyan

# Process lists with "FormCode" field
foreach ($listName in $formCodeLists) {
    Create-FormCodeViews -ListName $listName -FieldName "FormCode" -FormCodes $allFormCodes
}

# Process lists with "ParentFormCode" field
foreach ($listName in $parentFormCodeLists) {
    Create-FormCodeViews -ListName $listName -FieldName "ParentFormCode" -FormCodes $allFormCodes
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "  All done!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
