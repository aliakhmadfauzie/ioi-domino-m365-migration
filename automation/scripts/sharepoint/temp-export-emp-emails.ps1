Import-Module PnP.PowerShell
Connect-PnPOnline -Url 'https://ioioi.sharepoint.com/sites/ioi-portal-it' -Interactive -ClientId '21898567-7d8f-4634-846d-fd4cf7b185db'
$items = Get-PnPListItem -List 'Config_EmployeeDirectory' -PageSize 500 -Fields 'ConfigKey'
$emails = $items | ForEach-Object { $_.FieldValues['ConfigKey'] } | Where-Object { $_ -and $_ -match '@' } | Sort-Object -Unique
$emails | Set-Content -Path 'scripts\sharepoint\employee-directory-emails.txt' -Encoding UTF8
Write-Host "Exported $($emails.Count) emails to scripts\sharepoint\employee-directory-emails.txt"