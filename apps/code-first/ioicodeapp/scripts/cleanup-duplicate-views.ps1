$listName = "MainDB_IT_Ext_Support"
$views = Get-PnPView -List $listName | Where-Object { $_.Title -like "By *" }
$grouped = $views | Group-Object Title

Write-Host "=== View Summary ===" -ForegroundColor Cyan
$grouped | ForEach-Object { 
    $color = if ($_.Count -gt 1) { "Red" } else { "Green" }
    Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor $color
}
Write-Host "`nTotal views with 'By ' prefix: $($views.Count)" -ForegroundColor Cyan
Write-Host "Unique titles: $($grouped.Count)" -ForegroundColor Cyan

# Remove duplicates - keep the first one (lowest ID)
Write-Host "`nCleaning up duplicates..." -ForegroundColor Yellow
$removedCount = 0
$grouped | Where-Object { $_.Count -gt 1 } | ForEach-Object {
    $dupes = $_.Group | Sort-Object Id
    # Keep the first one, remove the rest
    $dupes | Select-Object -Skip 1 | ForEach-Object {
        Remove-PnPView -List $listName -Identity $_.Id -Force
        Write-Host "  Removed duplicate '$($_.Title)' (ID: $($_.Id))" -ForegroundColor DarkYellow
        $removedCount++
    }
}
Write-Host "`nRemoved $removedCount duplicate views." -ForegroundColor Green

# Final verification
$finalViews = Get-PnPView -List $listName | Where-Object { $_.Title -like "By *" }
Write-Host "`n=== Final count ===" -ForegroundColor Cyan
Write-Host "  Views remaining: $($finalViews.Count)" -ForegroundColor Green
