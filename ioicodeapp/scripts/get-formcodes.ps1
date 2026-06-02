$items = Get-PnPListItem -List "MainDB_IT" -Fields "FormCode" -PageSize 500
$codes = $items | Where-Object { $_.FieldValues.FormCode -and $_.FieldValues.FormCode -ne "" } | ForEach-Object { $_.FieldValues.FormCode } | Sort-Object -Unique
Write-Host "Distinct FormCodes ($($codes.Count)):" -ForegroundColor Cyan
$codes | ForEach-Object { Write-Host "  $_" }
