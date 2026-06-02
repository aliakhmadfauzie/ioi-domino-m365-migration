<#
.SYNOPSIS
    Clean up all duplicate form-code views and recreate exactly one per form code per list.
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

$targetLists = @(
    @{Name="MainDB_IT"; Field="FormCode"},
    @{Name="MainDB_IT_Attachments"; Field="FormCode"},
    @{Name="MainDB_IT_cr_approvalrecord"; Field="FormCode"},
    @{Name="MainDB_IT_Ext_Access"; Field="ParentFormCode"},
    @{Name="MainDB_IT_Ext_Assets"; Field="ParentFormCode"},
    @{Name="MainDB_IT_Ext_Docs"; Field="ParentFormCode"},
    @{Name="MainDB_IT_Ext_Infra"; Field="ParentFormCode"},
    @{Name="MainDB_IT_Ext_SAP"; Field="ParentFormCode"},
    @{Name="MainDB_IT_Ext_Support"; Field="ParentFormCode"}
)

# Step 1: Remove ALL existing "By *" views from all lists
Write-Host "=== Step 1: Removing all existing 'By *' views ===" -ForegroundColor Magenta
$totalRemoved = 0
foreach ($list in $targetLists) {
    $listName = $list.Name
    $views = Get-PnPView -List $listName | Where-Object { $_.Title -like "By *" }
    $count = ($views | Measure-Object).Count
    if ($count -gt 0) {
        $views | ForEach-Object {
            Remove-PnPView -List $listName -Identity $_.Id -Force
        }
        Write-Host "  Removed $count views from $listName" -ForegroundColor Yellow
        $totalRemoved += $count
    } else {
        Write-Host "  No views to remove from $listName" -ForegroundColor DarkGray
    }
}
Write-Host "  Total removed: $totalRemoved" -ForegroundColor Cyan

# Step 2: Create fresh views for all lists
Write-Host "`n=== Step 2: Creating fresh views ===" -ForegroundColor Magenta
$totalCreated = 0
foreach ($list in $targetLists) {
    $listName = $list.Name
    $fieldName = $list.Field
    Write-Host "`n--- $listName ($fieldName) ---" -ForegroundColor Cyan
    $created = 0; $errors = 0
    foreach ($code in $allFormCodes) {
        $viewTitle = "By $code"
        try {
            Add-PnPView -List $listName -Title $viewTitle `
                -Fields @("Title", $fieldName, "ID", "Created", "Modified") `
                -Query "<Where><Eq><FieldRef Name='$fieldName'/><Value Type='Text'>$code</Value></Eq></Where>" `
                -SetAsDefault:$false -Personal:$false -Paged:$true | Out-Null
            Write-Host "  [OK] $viewTitle" -ForegroundColor Green
            $created++
        } catch {
            Write-Host "  [ERR] $viewTitle : $_" -ForegroundColor Red
            $errors++
        }
    }
    Write-Host "  => $created created, $errors errors" -ForegroundColor $(if ($errors -gt 0){"Red"}else{"Green"})
    $totalCreated += $created
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Done! Total views created: $totalCreated" -ForegroundColor Green
Write-Host "  Expected: $($targetLists.Count * $allFormCodes.Count)" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Green
