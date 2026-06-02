param([string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr",[switch]$WhatIf)
Set-StrictMode -Version Latest; $ErrorActionPreference = "Stop"
Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
try { Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop } catch { Connect-PnPOnline -Url $SiteUrl -UseWebLogin }
function AddIfMissing { param($L,$I,$D,$T,$C)
  $e=Get-PnPField -List $L -Identity $I -ErrorAction SilentlyContinue
  if($e){Write-Host "  [SKIP] $I" -ForegroundColor Yellow; return}
  if($WhatIf){Write-Host "  [WHATIF] $I"; return}
  if($T-eq'Choice'){Add-PnPField -List $L -InternalName $I -DisplayName $D -Type Choice -Choices $C -AddToDefaultView}
  elseif($T-eq'DateTime'){Add-PnPField -List $L -InternalName $I -DisplayName $D -Type DateTime -AddToDefaultView}
  elseif($T-eq'Number'){Add-PnPField -List $L -InternalName $I -DisplayName $D -Type Number -AddToDefaultView}
  else{Add-PnPField -List $L -InternalName $I -DisplayName $D -Type Text -AddToDefaultView}
  Write-Host "  [ADDED] $I ($D)" -ForegroundColor Green
}
$listName="MainDB_HR_Ext_BSD"
$list=Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
if(-not$list){if(-not$WhatIf){New-PnPList -Title $listName -Template GenericList -Url $listName;Write-Host "  [CREATED] $listName" -ForegroundColor Green}}
else{Write-Host "  [EXISTS] $listName" -ForegroundColor Yellow}
AddIfMissing -L $listName -I "ParentRecord" -D "Parent Record ID" -T Text
AddIfMissing -L $listName -I "bSDResponsibility" -D "BSD Responsibility" -T Text
1..3|%{AddIfMissing -L $listName -I "bSDBackupName$_" -D "BSD Backup $_ Name" -T Text}
1..3|%{AddIfMissing -L $listName -I "bSDBackupPosition$_" -D "BSD Backup $_ Position" -T Text}
1..3|%{AddIfMissing -L $listName -I "bSDBackupResponsibility$_" -D "BSD Backup $_ Responsibility" -T Text}
AddIfMissing -L $listName -I "bSDHODName" -D "BSD HOD Name" -T Text
AddIfMissing -L $listName -I "bSDHODPosition" -D "BSD HOD Position" -T Text
AddIfMissing -L $listName -I "bSDHODDate" -D "BSD HOD Date" -T DateTime
AddIfMissing -L $listName -I "bSDHODRemarks" -D "BSD HOD Remarks" -T Text
AddIfMissing -L $listName -I "bSDHODApp" -D "BSD HOD Decision" -T Number
AddIfMissing -L $listName -I "bSDRevision" -D "BSD Revision" -T Choice -C @("Yes","No")
AddIfMissing -L $listName -I "bSDStatusRemarks" -D "BSD Status Remarks" -T Text
AddIfMissing -L $listName -I "bSDEditor1" -D "BSD Editor 1" -T Text
AddIfMissing -L $listName -I "bSDEditor2" -D "BSD Editor 2" -T Text
AddIfMissing -L $listName -I "bSDEditor3" -D "BSD Editor 3" -T Text
AddIfMissing -L $listName -I "bSDHRGroup" -D "BSD HR Group" -T Text
AddIfMissing -L $listName -I "bSDHRAdminGroup" -D "BSD HR Admin Group" -T Text
AddIfMissing -L $listName -I "bSDITGroup" -D "BSD IT Group" -T Text
Write-Host "Done." -ForegroundColor Green
