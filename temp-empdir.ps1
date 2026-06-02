Import-Module PnP.PowerShell
Connect-PnPOnline -Url 'https://ioioi.sharepoint.com/sites/ioi-portal-it' -Interactive -ClientId '21898567-7d8f-4634-846d-fd4cf7b185db'
 = Get-PnPListItem -List 'Config_EmployeeDirectory' -PageSize 500 -Fields 'ConfigKey'
 =  | ForEach-Object { .FieldValues['ConfigKey'] } | Where-Object {  -and  -match '@' } | Sort-Object -Unique
 | Set-Content -Path (Join-Path C:\Users\AL_AAF\Project\ioi_Docs 'scripts\sharepoint\employee-directory-emails.txt') -Encoding UTF8
Write-Host  Exported 0 emails to scripts\sharepoint\employee-directory-emails.txt
