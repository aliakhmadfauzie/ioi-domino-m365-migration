$lists = Get-PnPList | Where-Object { $_.Title -like "MainDB_IT*" } | Sort-Object Title
foreach ($list in $lists) {
    $fields = Get-PnPField -List $list.Title | Where-Object { $_.InternalName -like "*FormCode*" -or $_.InternalName -like "*Form*Code*" }
    if ($fields) {
        Write-Host "=== $($list.Title) ===" -ForegroundColor Cyan
        $fields | Select-Object Title, InternalName, TypeDisplayName | Format-Table -AutoSize
    } else {
        Write-Host "=== $($list.Title) === No FormCode fields" -ForegroundColor DarkGray
    }
}
