<#
.SYNOPSIS
    Adds missing columns to the MainDB_IT SharePoint list.

.DESCRIPTION
    Idempotent — skips columns that already exist.
    Run once per list. To also apply to MainDB_IT_JHR, pass -ListName "MainDB_IT_JHR".

.PARAMETER SiteUrl
    SharePoint site URL.  Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Target list internal name.  Default: MainDB_IT

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    # Add to Prai list
    .\Add-MainDB_IT-Columns.ps1

    # Add to Johor list
    .\Add-MainDB_IT-Columns.ps1 -ListName "MainDB_IT_JHR"

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl  = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ListName = "MainDB_IT",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration (for PnP Client ID)
# ---------------------------------------------------------------------------
$script:ConfigPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $script:ConfigPath) { . $script:ConfigPath }

# ---------------------------------------------------------------------------
# Connection (supports both PnP.PowerShell v3 and legacy SharePointPnPPowerShellOnline)
# ---------------------------------------------------------------------------
$module = Get-Module -ListAvailable -Name PnP.PowerShell
if ($module) {
    Write-Host "Using PnP.PowerShell v$($module.Version)" -ForegroundColor Cyan
} else {
    Import-Module SharePointPnPPowerShellOnline -ErrorAction Stop
}

$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
}

Write-Host "Connected successfully." -ForegroundColor Green

# Verify list exists
$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    Write-Error "List '$ListName' not found on $SiteUrl"
    return
}
Write-Host "Target list: $($list.Title) ($ListName)`n" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text","Note","DateTime","Boolean","Choice","Number")]
        [string]$Type,
        [string[]]$Choices = @(),
        [switch]$Required
    )

    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [skip] $InternalName  (already exists)" -ForegroundColor DarkGray
        return
    }

    if ($WhatIf) {
        Write-Host "  [whatif] Would add: $InternalName  ($Type)" -ForegroundColor Yellow
        return
    }

    try {
        $params = @{
            List         = $ListName
            InternalName = $InternalName
            DisplayName  = $DisplayName
            Type         = $Type
        }
        if ($Required) { $params.Required = $true }

        if ($Type -eq "Choice" -and $Choices.Count -gt 0) {
            Add-PnPField @params -Choices $Choices | Out-Null
        } else {
            Add-PnPField @params | Out-Null
        }
        Write-Host "  [added] $InternalName  ($Type)" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $InternalName`: $_" -ForegroundColor Red
    }
}

# ---------------------------------------------------------------------------
# Columns — ITEVT (IT Event Record)
# ---------------------------------------------------------------------------
Write-Host "--- ITEVT ---" -ForegroundColor White
Add-ColumnIfMissing `
    -InternalName "EventType" `
    -DisplayName  "Event Type" `
    -Type         "Choice" `
    -Choices      @("Outage","Planned Maintenance","Security Incident","Hardware Failure","Software Failure","Network Issue","Other")

# ---------------------------------------------------------------------------
# Columns — SVRREBOOT (Server Reboot Log)
# ---------------------------------------------------------------------------
Write-Host "`n--- SVRREBOOT ---" -ForegroundColor White
Add-ColumnIfMissing `
    -InternalName "RebootType" `
    -DisplayName  "Reboot Type" `
    -Type         "Choice" `
    -Choices      @("Planned Maintenance","Emergency Reboot","Patch / Update","OS Crash","Hardware Failure","Other")

Add-ColumnIfMissing `
    -InternalName "TotalDownTime" `
    -DisplayName  "Total Down Time" `
    -Type         "Text"

# ---------------------------------------------------------------------------
# Columns — SVRREC (Server Record / RCA)
# ---------------------------------------------------------------------------
Write-Host "`n--- SVRREC ---" -ForegroundColor White
Add-ColumnIfMissing `
    -InternalName "RecordType" `
    -DisplayName  "Record Type" `
    -Type         "Choice" `
    -Choices      @("Incident","Maintenance","Change Request","Problem","Other")

Add-ColumnIfMissing `
    -InternalName "ServiceMode" `
    -DisplayName  "Service Mode" `
    -Type         "Choice" `
    -Choices      @("Planned","Unplanned")

Add-ColumnIfMissing `
    -InternalName "RebootRequired" `
    -DisplayName  "Reboot Required" `
    -Type         "Choice" `
    -Choices      @("Yes","No")

Add-ColumnIfMissing `
    -InternalName "Background" `
    -DisplayName  "Background" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "Analysis" `
    -DisplayName  "Analysis" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "RootCause" `
    -DisplayName  "Root Cause" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "CorrectiveAction" `
    -DisplayName  "Corrective Action" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "PreventiveAction" `
    -DisplayName  "Preventive Action" `
    -Type         "Note"

# ---------------------------------------------------------------------------
# Columns — DATAREST (Data Restoration Request)
# ---------------------------------------------------------------------------
Write-Host "`n--- DATAREST ---" -ForegroundColor White
Add-ColumnIfMissing `
    -InternalName "MediaBackupDate" `
    -DisplayName  "Media Backup Date" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "FileName" `
    -DisplayName  "File Name" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "BackupMediaName" `
    -DisplayName  "Backup Media Name" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "BackupMediaDate" `
    -DisplayName  "Backup Media Date" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "BackupFileName" `
    -DisplayName  "Backup File Name (Restored)" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "BackupStatus" `
    -DisplayName  "Backup Status" `
    -Type         "Choice" `
    -Choices      @("Completed","Failed","Partial")

# ---------------------------------------------------------------------------
# Columns — General (shared across multiple forms)
# ---------------------------------------------------------------------------
Write-Host "`n--- General ---" -ForegroundColor White

# CC: store comma-separated email addresses for notification
Add-ColumnIfMissing `
    -InternalName "CC" `
    -DisplayName  "CC" `
    -Type         "Text"

# ServerRoom: free-text server/network room name (separate from DataCenterArea choice)
Add-ColumnIfMissing `
    -InternalName "ServerRoom" `
    -DisplayName  "Server Room" `
    -Type         "Text"

# ---------------------------------------------------------------------------
# Columns - RS (Reset Password)
# ---------------------------------------------------------------------------
Write-Host "`n--- RS (Reset Password) ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "RS_UserName" `
    -DisplayName  "RS UserName" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "RS_Designation" `
    -DisplayName  "RS Designation" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "RS_Company" `
    -DisplayName  "RS Company" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "RS_Department" `
    -DisplayName  "RS Department" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "RS_Location" `
    -DisplayName  "RS Location" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "RS_ResetType" `
    -DisplayName  "RS ResetType" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "RS_ReasonForReset" `
    -DisplayName  "RS ReasonForReset" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "RS_BankTokenSerial" `
    -DisplayName  "RS BankTokenSerial" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "RS_ExecutiveDirectorEmail" `
    -DisplayName  "RS ExecutiveDirectorEmail" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "RS_SAPClient" `
    -DisplayName  "RS SAPClient" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "RS_IEPClientName" `
    -DisplayName  "RS IEPClientName" `
    -Type         "Text"

# RS_TargetUser_Email — used by submitTransform for requestor email
Add-ColumnIfMissing `
    -InternalName "RS_TargetUser_Email" `
    -DisplayName  "RS Target User Email" `
    -Type         "Text"

# RS_AssignedPICEmail — IT PIC email for workflow routing
Add-ColumnIfMissing `
    -InternalName "RS_AssignedPICEmail" `
    -DisplayName  "RS Assigned PIC Email" `
    -Type         "Text"

# RS_RequestType — system/application type requested for password reset
Add-ColumnIfMissing `
    -InternalName "RS_RequestType" `
    -DisplayName  "RS RequestType" `
    -Type         "Choice" `
    -Choices      @("Active Directory","SAP S4/HANA","IEP","Bank","Other")

# ---------------------------------------------------------------------------
# Columns - SFAR (Share Folder Access Request)
# ---------------------------------------------------------------------------
Write-Host "`n--- SFAR (Share Folder Access Request) ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "SFAR_Company" `
    -DisplayName  "SFAR Company" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "SFAR_Department" `
    -DisplayName  "SFAR Department" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "SFAR_Extension" `
    -DisplayName  "SFAR Extension" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "SFAR_FolderType" `
    -DisplayName  "SFAR FolderType" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "SFAR_ServerName" `
    -DisplayName  "SFAR ServerName" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "SFAR_RequestType" `
    -DisplayName  "SFAR RequestType" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "SFAR_HODEmail" `
    -DisplayName  "SFAR HODEmail" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "SFAR_Owner" `
    -DisplayName  "SFAR Owner" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "SFAR_AccessTo" `
    -DisplayName  "SFAR AccessTo" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "SFAR_AccessToName" `
    -DisplayName  "SFAR AccessToName" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "SFAR_Purpose" `
    -DisplayName  "SFAR Purpose" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "SFAR_Justification" `
    -DisplayName  "SFAR Justification" `
    -Type         "Note"

# ---------------------------------------------------------------------------
# Columns - UR (User ID Request)
# ---------------------------------------------------------------------------
Write-Host "`n--- UR (User ID Request) ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "UR_RequestType" `
    -DisplayName  "UR RequestType" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "UR_EmployeeNumber" `
    -DisplayName  "UR EmployeeNumber" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "UR_Designation" `
    -DisplayName  "UR Designation" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "UR_Company" `
    -DisplayName  "UR Company" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "UR_Division" `
    -DisplayName  "UR Division" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "UR_Extension" `
    -DisplayName  "UR Extension" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "UR_EmailAddress" `
    -DisplayName  "UR EmailAddress" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "UR_BankName" `
    -DisplayName  "UR BankName" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "UR_BankUserEmail" `
    -DisplayName  "UR BankUserEmail" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "UR_Plant" `
    -DisplayName  "UR Plant" `
    -Type         "Text"

# ---------------------------------------------------------------------------
# Columns - PRF (Program Request Form)
# ---------------------------------------------------------------------------
Write-Host "`n--- PRF (Program Request Form) ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "PRF_SAPClient" `
    -DisplayName  "PRF SAPClient" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "PRF_SAPModule" `
    -DisplayName  "PRF SAPModule" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "PRF_Department" `
    -DisplayName  "PRF Department" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "PRF_Priority" `
    -DisplayName  "PRF Priority" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "PRF_Deadline" `
    -DisplayName  "PRF Deadline" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "PRF_PhoneExt" `
    -DisplayName  "PRF PhoneExt" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "PRF_CCEmails" `
    -DisplayName  "PRF CCEmails" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "PRF_Objective" `
    -DisplayName  "PRF Objective" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "PRF_Justification" `
    -DisplayName  "PRF Justification" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "PRF_CurrentProcess" `
    -DisplayName  "PRF CurrentProcess" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "PRF_ExpectedOutcome" `
    -DisplayName  "PRF ExpectedOutcome" `
    -Type         "Note"

# ---------------------------------------------------------------------------
# Columns — HI (Hardware Inventory)
# ---------------------------------------------------------------------------
Write-Host "`n--- HI (Hardware Inventory) ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "HI_PONumber" `
    -DisplayName  "HI PONumber" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_WarrantyExpiry" `
    -DisplayName  "HI WarrantyExpiry" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "HI_Condition" `
    -DisplayName  "HI Condition" `
    -Type         "Choice"

Add-ColumnIfMissing `
    -InternalName "HI_Specifications" `
    -DisplayName  "HI Specifications" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "HI_PurchasePrice" `
    -DisplayName  "HI PurchasePrice" `
    -Type         "Number"

# ---------------------------------------------------------------------------
# Columns — ITSSR (IT Support & Service Request)
# ---------------------------------------------------------------------------
Write-Host "`n--- ITSSR (IT Support & Service Request) ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "ITSSR_Department" `
    -DisplayName  "ITSSR Department" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_Extension" `
    -DisplayName  "ITSSR Extension" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ServiceType2" `
    -DisplayName  "ITSSR ServiceType2" `
    -Type         "Choice" `
    -Choices      @("HARDWARE","SOFTWARE/APPLICATION","NEW REQUEST DESKTOP/LAPTOP")

Add-ColumnIfMissing `
    -InternalName "ITSSR_Hardware" `
    -DisplayName  "ITSSR Hardware" `
    -Type         "Choice" `
    -Choices      @("CPU","DESKTOP","IP PHONE","LAPTOP","MONITOR","NETWORK","PRINTER","SCANNER","OTHERS")

Add-ColumnIfMissing `
    -InternalName "ITSSR_Hardware2" `
    -DisplayName  "ITSSR Hardware2" `
    -Type         "Choice" `
    -Choices      @("DESKTOP","LAPTOP")

Add-ColumnIfMissing `
    -InternalName "ITSSR_Application" `
    -DisplayName  "ITSSR Application" `
    -Type         "Choice" `
    -Choices      @("BANK","CITRIX/XENAPP","DASHBOARD","E-TRAINING","ESDE","ESKER AP AUTOMATION","GATEPASS & STORE DO","HCL NOTES","INTERNET","INTRANET","IOI OLEO WEBSITE","LMS","MS EXCEL","MS POWERPOINT","MS WORD","OS","SALES PORTAL","SAP S4/HANA","SAC","VMS","WEIGHING SYSTEM","OTHERS")

Add-ColumnIfMissing `
    -InternalName "ITSSR_Module" `
    -DisplayName  "ITSSR Module" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_SAPModule" `
    -DisplayName  "ITSSR SAPModule" `
    -Type         "Choice" `
    -Choices      @("ABAP","Authorisation","CO","FI","Logistics","MM-Purchasing","MM-Store","PM","PP-PI Planning","PP-PI Production","QM","SD-Marketing","SD-Shipping","System Administration","WM")

Add-ColumnIfMissing `
    -InternalName "ITSSR_BankModule" `
    -DisplayName  "ITSSR BankModule" `
    -Type         "Choice" `
    -Choices      @("AMBank","BNM (Bank Negara Malaysia)","Citi Bank","MayBank","Standard Chartered Bank","UOB")

Add-ColumnIfMissing `
    -InternalName "ITSSR_CC" `
    -DisplayName  "ITSSR CC" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ITRemarks" `
    -DisplayName  "ITSSR ITRemarks" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "ITSSR_DateNotified" `
    -DisplayName  "ITSSR DateNotified" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "ITSSR_DateClosed" `
    -DisplayName  "ITSSR DateClosed" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ITName" `
    -DisplayName  "ITSSR ITName" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ProblemCategory2" `
    -DisplayName  "ITSSR ProblemCategory2" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_COOApproval" `
    -DisplayName  "ITSSR COOApproval" `
    -Type         "Choice" `
    -Choices      @("Yes","No")

Add-ColumnIfMissing `
    -InternalName "ITSSR_HWComment" `
    -DisplayName  "ITSSR HWComment" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "ITSSR_VerifiedBy" `
    -DisplayName  "ITSSR VerifiedBy" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_VerificationDate" `
    -DisplayName  "ITSSR VerificationDate" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "ITSSR_VerificationStatus" `
    -DisplayName  "ITSSR VerificationStatus" `
    -Type         "Choice" `
    -Choices      @("Pending","Verified","Rejected")

Add-ColumnIfMissing `
    -InternalName "ITSSR_ManagerBy" `
    -DisplayName  "ITSSR ManagerBy" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ManagerDate" `
    -DisplayName  "ITSSR ManagerDate" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ManagerComment" `
    -DisplayName  "ITSSR ManagerComment" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "ITSSR_ManagerStatus" `
    -DisplayName  "ITSSR ManagerStatus" `
    -Type         "Choice" `
    -Choices      @("Pending","Approved","Rejected")

Add-ColumnIfMissing `
    -InternalName "ITSSR_COOBy" `
    -DisplayName  "ITSSR COOBy" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "ITSSR_COODate" `
    -DisplayName  "ITSSR COODate" `
    -Type         "DateTime"

Add-ColumnIfMissing `
    -InternalName "ITSSR_COOComment" `
    -DisplayName  "ITSSR COOComment" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "ITSSR_COOStatus" `
    -DisplayName  "ITSSR COOStatus" `
    -Type         "Choice" `
    -Choices      @("Pending","Approved","Rejected")

Add-ColumnIfMissing `
    -InternalName "ITSSR_RequestorComment" `
    -DisplayName  "ITSSR RequestorComment" `
    -Type         "Note"

# ---------------------------------------------------------------------------
# Columns — HI (Hardware Inventory) — extended fields
# ---------------------------------------------------------------------------
Write-Host "`n--- HI (Hardware Inventory) Extended ---" -ForegroundColor White

Add-ColumnIfMissing `
    -InternalName "HI_Model" `
    -DisplayName  "HI Model" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_CPUType" `
    -DisplayName  "HI CPUType" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_CPUSerialNo" `
    -DisplayName  "HI CPUSerialNo" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_HDDSize" `
    -DisplayName  "HI HDDSize" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_RAMSize" `
    -DisplayName  "HI RAMSize" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_RAMType" `
    -DisplayName  "HI RAMType" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_MonitorModel" `
    -DisplayName  "HI MonitorModel" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_MonitorSize" `
    -DisplayName  "HI MonitorSize" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_MonitorType" `
    -DisplayName  "HI MonitorType" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_CDType" `
    -DisplayName  "HI CDType" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_VLAN" `
    -DisplayName  "HI VLAN" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_SANStorage" `
    -DisplayName  "HI SANStorage" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_IPAddress" `
    -DisplayName  "HI IPAddress" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_WinServicePack" `
    -DisplayName  "HI WinServicePack" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_WinKey" `
    -DisplayName  "HI WinKey" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_MSVersion" `
    -DisplayName  "HI MSVersion" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_AntiVirusVersion" `
    -DisplayName  "HI AntiVirusVersion" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_NotesVersion" `
    -DisplayName  "HI NotesVersion" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_DRP" `
    -DisplayName  "HI DRP" `
    -Type         "Choice" `
    -Choices      @("Yes","No")

Add-ColumnIfMissing `
    -InternalName "HI_SentBy" `
    -DisplayName  "HI SentBy" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_ProbFindings" `
    -DisplayName  "HI ProbFindings" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "HI_Actions" `
    -DisplayName  "HI Actions" `
    -Type         "Note"

Add-ColumnIfMissing `
    -InternalName "HI_PreviousUser" `
    -DisplayName  "HI PreviousUser" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_CarNo" `
    -DisplayName  "HI CarNo" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_FARNo" `
    -DisplayName  "HI FARNo" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_InvoiceNo" `
    -DisplayName  "HI InvoiceNo" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_ServerType" `
    -DisplayName  "HI ServerType" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_AccessType" `
    -DisplayName  "HI AccessType" `
    -Type         "Text"

Add-ColumnIfMissing `
    -InternalName "HI_KeyboardLanguage" `
    -DisplayName  "HI KeyboardLanguage" `
    -Type         "Text"
# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host "`nDone. Columns added to '$ListName' on $SiteUrl" -ForegroundColor Cyan
Write-Host "To apply to the Johor list:" -ForegroundColor DarkGray
Write-Host "  1. Create the list first:" -ForegroundColor DarkGray
Write-Host "     .\Create-MainDB_IT_JHR.ps1" -ForegroundColor DarkGray
Write-Host "  2. Or add columns to existing list:" -ForegroundColor DarkGray
Write-Host "     .\Add-MainDB_IT-Columns.ps1 -ListName `"MainDB_IT_JHR`"`n" -ForegroundColor DarkGray
