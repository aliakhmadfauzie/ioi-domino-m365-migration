param([string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr")
Set-StrictMode -Version Latest; $ErrorActionPreference = "Continue"
Write-Host "Connecting..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId "21898567-7d8f-4634-846d-fd4cf7b185db" -ErrorAction Stop
Write-Host "Connected!" -ForegroundColor Green

function AddIfMissing { param($L,$I,$D,$T,$C)
  $e = Get-PnPField -List $L -Identity $I -ErrorAction SilentlyContinue
  if ($e) { Write-Host "  SKIP $I" -ForegroundColor Gray; return }
  $params = @{List=$L; InternalName=$I; DisplayName=$D; AddToDefaultView=$true}
  switch ($T) {
    'Choice'   { Add-PnPField @params -Type Choice -Choices $C }
    'DateTime' { Add-PnPField @params -Type DateTime }
    'Number'   { Add-PnPField @params -Type Number }
    'Note'     { Add-PnPField @params -Type Note }
    'YesNo'    { Add-PnPField @params -Type Boolean }
    default    { Add-PnPField @params -Type Text }
  }
  Write-Host "  ADDED $I" -ForegroundColor Green
}

Write-Host "`n=== Config_ShiftCodes ===" -ForegroundColor Cyan
AddIfMissing "MainDB_HR_Config_ShiftCodes" "scHours" "Hours" Text
AddIfMissing "MainDB_HR_Config_ShiftCodes" "scDescription" "Description" Text

Write-Host "`n=== Config_Companies ===" -ForegroundColor Cyan
AddIfMissing "MainDB_HR_Config_Companies" "ccFullName" "Full Name" Text

Write-Host "`n=== MainDB_HR FormCode ===" -ForegroundColor Cyan
AddIfMissing "MainDB_HR" "FormCode" "Form Code" Choice @("CIR","BSD","AWHR","CWR","DRD","EEN")

Write-Host "`n=== CIR Columns ===" -ForegroundColor Cyan
AddIfMissing "MainDB_HR" "cirSite" "CIR Site" Choice @("ACM Cafeteria","ECM Cafeteria")
AddIfMissing "MainDB_HR" "cirTeamMembers" "CIR Team Members" Note
AddIfMissing "MainDB_HR" "cirInspector" "CIR Inspector" Text
AddIfMissing "MainDB_HR" "cirInsDate" "CIR Inspection Date" DateTime
AddIfMissing "MainDB_HR" "cirInsTime" "CIR Inspection Time" Text
AddIfMissing "MainDB_HR" "cirSubmittedBy" "CIR Submitted By" Text
AddIfMissing "MainDB_HR" "cirSubmittedDate" "CIR Submitted Date" DateTime
AddIfMissing "MainDB_HR" "cirReviewedBy" "CIR Reviewed By" Text
AddIfMissing "MainDB_HR" "cirReviewedDate" "CIR Reviewed Date" DateTime
AddIfMissing "MainDB_HR" "cirRemarks" "CIR Remarks" Note
AddIfMissing "MainDB_HR" "cirCurrentAction" "CIR Current Status" Choice @("Submitted","Accepted")
AddIfMissing "MainDB_HR" "cirACMComm" "CIR ACM Committee" Text
AddIfMissing "MainDB_HR" "cirECMComm" "CIR ECM Committee" Text
AddIfMissing "MainDB_HR" "cirINO" "CIR Running Number" Text

Write-Host "`nDone!" -ForegroundColor Green
