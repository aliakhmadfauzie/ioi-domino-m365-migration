$targetLists = @(
    "MainDB_IT",
    "MainDB_IT_Attachments",
    "MainDB_IT_cr_approvalrecord",
    "MainDB_IT_Ext_Access",
    "MainDB_IT_Ext_Assets",
    "MainDB_IT_Ext_Docs",
    "MainDB_IT_Ext_Infra",
    "MainDB_IT_Ext_SAP",
    "MainDB_IT_Ext_Support"
)

Write-Host "=== MainDB IT Views Summary ===" -ForegroundColor Cyan
$totalCreated = 0
foreach ($listName in $targetLists) {
    $views = Get-PnPView -List $listName | Where-Object Title -like "By *"
    $total = ($views | Measure-Object).Count
    $totalCreated += $total
    $color = if ($total -eq 33) { "Green" } elseif ($total -gt 0) { "Yellow" } else { "Red" }
    Write-Host "  $listName : $total views" -ForegroundColor $color
}
Write-Host "  ---" -ForegroundColor Gray
Write-Host "  Total form-code views: $totalCreated" -ForegroundColor Cyan
Write-Host "  Expected per list: 33 (one per form code)" -ForegroundColor Gray
