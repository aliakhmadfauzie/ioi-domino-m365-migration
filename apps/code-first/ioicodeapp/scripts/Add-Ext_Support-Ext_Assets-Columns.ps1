<#
.SYNOPSIS
    Adds missing columns to MainDB_IT_Ext_Support and MainDB_IT_Ext_Assets.

.DESCRIPTION
    Idempotent — skips columns that already exist.
    ITSSR fields → MainDB_IT_Ext_Support
    HI extended fields → MainDB_IT_Ext_Assets

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.EXAMPLE
    .\Add-Ext_Support-Ext_Assets-Columns.ps1

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
Import-Module SharePointPnPPowerShellOnline -ErrorAction Stop

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$ListName,
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
        Write-Host "  [whatif] Would add: $InternalName  ($Type) → $ListName" -ForegroundColor Yellow
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
        Write-Host "  [added] $InternalName  ($Type) → $ListName" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $InternalName`: $_" -ForegroundColor Red
    }
}

# ===========================================================================
# MainDB_IT_Ext_Support — ITSSR extended fields
# ===========================================================================
$supportList = "MainDB_IT_Ext_Support"
Write-Host "`n=== ITSSR extended fields → $supportList ===" -ForegroundColor White

# Verify list exists
$list = Get-PnPList -Identity $supportList -ErrorAction SilentlyContinue
if (-not $list) {
    Write-Error "List '$supportList' not found on $SiteUrl"
} else {
    Write-Host "Target list: $($list.Title)`n" -ForegroundColor Cyan

    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_Department"      -DisplayName "ITSSR Department"       -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_Extension"       -DisplayName "ITSSR Extension"        -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ServiceType2"    -DisplayName "ITSSR ServiceType2"     -Type "Choice" -Choices @("HARDWARE","SOFTWARE/APPLICATION","NEW REQUEST DESKTOP/LAPTOP")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_Hardware"        -DisplayName "ITSSR Hardware"         -Type "Choice" -Choices @("CPU","DESKTOP","IP PHONE","LAPTOP","MONITOR","NETWORK","PRINTER","SCANNER","OTHERS")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_Hardware2"       -DisplayName "ITSSR Hardware2"        -Type "Choice" -Choices @("DESKTOP","LAPTOP")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_Application"     -DisplayName "ITSSR Application"      -Type "Choice" -Choices @("BANK","CITRIX/XENAPP","DASHBOARD","E-TRAINING","ESDE","ESKER AP AUTOMATION","GATEPASS & STORE DO","HCL NOTES","INTERNET","INTRANET","IOI OLEO WEBSITE","LMS","MS EXCEL","MS POWERPOINT","MS WORD","OS","SALES PORTAL","SAP S4/HANA","SAC","VMS","WEIGHING SYSTEM","OTHERS")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_Module"          -DisplayName "ITSSR Module"           -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_SAPModule"       -DisplayName "ITSSR SAPModule"        -Type "Choice" -Choices @("ABAP","Authorisation","CO","FI","Logistics","MM-Purchasing","MM-Store","PM","PP-PI Planning","PP-PI Production","QM","SD-Marketing","SD-Shipping","System Administration","WM")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_BankModule"      -DisplayName "ITSSR BankModule"       -Type "Choice" -Choices @("AMBank","BNM (Bank Negara Malaysia)","CitiDirect Bank","MayBank","Standard Chartered Bank","UOB")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_CC"              -DisplayName "ITSSR CC"               -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ITRemarks"       -DisplayName "ITSSR ITRemarks"        -Type "Note"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_DateNotified"    -DisplayName "ITSSR DateNotified"     -Type "DateTime"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_DateClosed"      -DisplayName "ITSSR DateClosed"       -Type "DateTime"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ITName"          -DisplayName "ITSSR ITName"           -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ProblemCategory2" -DisplayName "ITSSR ProblemCategory2" -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_COOApproval"     -DisplayName "ITSSR COOApproval"      -Type "Choice" -Choices @("Yes","No")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_HWComment"       -DisplayName "ITSSR HWComment"        -Type "Note"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_VerifiedBy"      -DisplayName "ITSSR VerifiedBy"       -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_VerificationDate" -DisplayName "ITSSR VerificationDate" -Type "DateTime"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_VerificationStatus" -DisplayName "ITSSR VerificationStatus" -Type "Choice" -Choices @("Pending","Verified","Rejected")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ManagerBy"       -DisplayName "ITSSR ManagerBy"        -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ManagerDate"     -DisplayName "ITSSR ManagerDate"      -Type "DateTime"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ManagerComment"  -DisplayName "ITSSR ManagerComment"   -Type "Note"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_ManagerStatus"   -DisplayName "ITSSR ManagerStatus"    -Type "Choice" -Choices @("Pending","Approved","Rejected")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_COOBy"           -DisplayName "ITSSR COOBy"            -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_COODate"         -DisplayName "ITSSR COODate"          -Type "DateTime"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_COOComment"      -DisplayName "ITSSR COOComment"       -Type "Note"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_COOStatus"       -DisplayName "ITSSR COOStatus"        -Type "Choice" -Choices @("Pending","Approved","Rejected")
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITSSR_RequestorComment" -DisplayName "ITSSR RequestorComment" -Type "Note"
    # ITDR extended fields
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITDR2_Year"           -DisplayName "ITDR2 Year"            -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITDR2_Month"          -DisplayName "ITDR2 Month"           -Type "Text"
    Add-ColumnIfMissing -ListName $supportList -InternalName "ITDR2_Title"          -DisplayName "ITDR2 Title"           -Type "Text"
}

# ===========================================================================
# MainDB_IT_Ext_Assets — HI extended fields (CPU, RAM, Monitor, etc.)
# ===========================================================================
$assetsList = "MainDB_IT_Ext_Assets"
Write-Host "`n=== HI extended fields → $assetsList ===" -ForegroundColor White

$list2 = Get-PnPList -Identity $assetsList -ErrorAction SilentlyContinue
if (-not $list2) {
    Write-Error "List '$assetsList' not found on $SiteUrl"
} else {
    Write-Host "Target list: $($list2.Title)`n" -ForegroundColor Cyan

    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_Model"              -DisplayName "HI Model"              -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_CPUType"            -DisplayName "HI CPUType"            -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_CPUSerialNo"        -DisplayName "HI CPUSerialNo"        -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_HDDSize"            -DisplayName "HI HDDSize"            -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_RAMSize"            -DisplayName "HI RAMSize"            -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_RAMType"            -DisplayName "HI RAMType"            -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_MonitorModel"       -DisplayName "HI MonitorModel"       -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_MonitorSize"        -DisplayName "HI MonitorSize"        -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_MonitorType"        -DisplayName "HI MonitorType"        -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_CDType"             -DisplayName "HI CDType"             -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_VLAN"               -DisplayName "HI VLAN"               -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_SANStorage"         -DisplayName "HI SANStorage"         -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_IPAddress"          -DisplayName "HI IPAddress"          -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_WinServicePack"     -DisplayName "HI WinServicePack"     -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_WinKey"             -DisplayName "HI WinKey"             -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_MSVersion"          -DisplayName "HI MSVersion"          -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_AntiVirusVersion"   -DisplayName "HI AntiVirusVersion"   -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_NotesVersion"       -DisplayName "HI NotesVersion"       -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_DRP"                -DisplayName "HI DRP"                -Type "Choice" -Choices @("Yes","No")
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_SentBy"             -DisplayName "HI SentBy"             -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_ProbFindings"       -DisplayName "HI ProbFindings"       -Type "Note"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_Actions"            -DisplayName "HI Actions"            -Type "Note"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_PreviousUser"       -DisplayName "HI PreviousUser"       -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_CarNo"              -DisplayName "HI CarNo"              -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_FARNo"              -DisplayName "HI FARNo"              -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_InvoiceNo"          -DisplayName "HI InvoiceNo"          -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_ServerType"         -DisplayName "HI ServerType"         -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_AccessType"         -DisplayName "HI AccessType"         -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "HI_KeyboardLanguage"   -DisplayName "HI KeyboardLanguage"   -Type "Text"
    # ITSC extended fields
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_VirusDefDate"     -DisplayName "ITSC VirusDefDate"     -Type "DateTime"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_CPUUsage"         -DisplayName "ITSC CPUUsage"         -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_MemoryUsed"       -DisplayName "ITSC MemoryUsed"       -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_FullMemory"       -DisplayName "ITSC FullMemory"       -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_DriveAvailable"   -DisplayName "ITSC DriveAvailable"   -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_DriveSize"        -DisplayName "ITSC DriveSize"        -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_DriveType"        -DisplayName "ITSC DriveType"        -Type "Choice" -Choices @("HDD","SSD")
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_DiskCleanup"      -DisplayName "ITSC DiskCleanup"      -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_WinUpdates"       -DisplayName "ITSC WinUpdates"       -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Antivirus"        -DisplayName "ITSC Antivirus"        -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Physical"         -DisplayName "ITSC Physical"         -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Tenant"           -DisplayName "ITSC Tenant"           -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Volume1"          -DisplayName "ITSC Volume1"          -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Volume2"          -DisplayName "ITSC Volume2"          -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Volume3"          -DisplayName "ITSC Volume3"          -Type "Text"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_TimeStart"        -DisplayName "ITSC TimeStart"        -Type "DateTime"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_TimeEnd"          -DisplayName "ITSC TimeEnd"          -Type "DateTime"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Remarks"          -DisplayName "ITSC Remarks"          -Type "Note"
    Add-ColumnIfMissing -ListName $assetsList -InternalName "ITSC_Attachment"       -DisplayName "ITSC Attachment"       -Type "Text"
}

# ===========================================================================
# MainDB_IT_Ext_Docs — IOIP + ITI extended fields
# ===========================================================================
$docsList = "MainDB_IT_Ext_Docs"
Write-Host "`n=== IOIP / ITI extended fields → $docsList ===" -ForegroundColor White

$docs = Get-PnPList -Identity $docsList -ErrorAction SilentlyContinue
if (-not $docs) {
    Write-Error "List '$docsList' not found on $SiteUrl"
} else {
    Write-Host "Target list: $($docs.Title)`n" -ForegroundColor Cyan
    Add-ColumnIfMissing -ListName $docsList -InternalName "IOIP_PolicyNo"       -DisplayName "IOIP PolicyNo"        -Type "Text"
    Add-ColumnIfMissing -ListName $docsList -InternalName "IOIP_RevNo"          -DisplayName "IOIP RevNo"           -Type "Text"
    Add-ColumnIfMissing -ListName $docsList -InternalName "IOIP_ReviNum"        -DisplayName "IOIP ReviNum"         -Type "Text"
    Add-ColumnIfMissing -ListName $docsList -InternalName "IOIP_Body"           -DisplayName "IOIP Body"            -Type "Note"
    Add-ColumnIfMissing -ListName $docsList -InternalName "ITI_Attachment"      -DisplayName "ITI Attachment"       -Type "Text"
    Add-ColumnIfMissing -ListName $docsList -InternalName "ITP_Attachment"       -DisplayName "ITP Attachment"        -Type "Text"
    Add-ColumnIfMissing -ListName $docsList -InternalName "ITP2_Attachment"      -DisplayName "ITP2 Attachment"       -Type "Text"
}

# ===========================================================================
# MainDB_IT_Ext_SAP — PRF + SAPSOF + SAPTR extended fields
# ===========================================================================
$sapList = "MainDB_IT_Ext_SAP"
Write-Host "`n=== PRF / SAPSOF / SAPTR extended fields → $sapList ===" -ForegroundColor White

$sap = Get-PnPList -Identity $sapList -ErrorAction SilentlyContinue
if (-not $sap) {
    Write-Error "List '$sapList' not found on $SiteUrl"
} else {
    Write-Host "Target list: $($sap.Title)`n" -ForegroundColor Cyan
    # PRF extended
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_Department"        -DisplayName "PRF Department"         -Type "Choice" -Choices @("IT","Finance","HR","Operations","SAP","Other")
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_Priority"          -DisplayName "PRF Priority"           -Type "Choice" -Choices @("Low","Medium","High","Critical")
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_Deadline"          -DisplayName "PRF Deadline"           -Type "DateTime"
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_PhoneExt"          -DisplayName "PRF PhoneExt"           -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_CCEmails"          -DisplayName "PRF CCEmails"           -Type "Note"
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_Objective"         -DisplayName "PRF Objective"          -Type "Note"
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_Justification"     -DisplayName "PRF Justification"      -Type "Note"
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_CurrentProcess"    -DisplayName "PRF CurrentProcess"     -Type "Note"
    Add-ColumnIfMissing -ListName $sapList -InternalName "PRF_ExpectedOutcome"   -DisplayName "PRF ExpectedOutcome"    -Type "Note"
    # SAPSOF extended
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPSOF_TRNumber"       -DisplayName "SAPSOF TRNumber"        -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPSOF_DocTitle"       -DisplayName "SAPSOF DocTitle"        -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPSOF_TestPurpose"    -DisplayName "SAPSOF TestPurpose"     -Type "Note"
    # SAPTR extended
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_Category"        -DisplayName "SAPTR Category"         -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_DevCategory"     -DisplayName "SAPTR DevCategory"      -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_Client"          -DisplayName "SAPTR Client"           -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_IssueNum"        -DisplayName "SAPTR IssueNum"         -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_Tcode"           -DisplayName "SAPTR Tcode"            -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_ChangesDone"     -DisplayName "SAPTR ChangesDone"      -Type "Note"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_Remarks"         -DisplayName "SAPTR Remarks"          -Type "Note"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_KeyUser"         -DisplayName "SAPTR KeyUser"          -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_RequestedBy"     -DisplayName "SAPTR RequestedBy"      -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_AppStatus"       -DisplayName "SAPTR AppStatus"        -Type "Choice" -Choices @("Pending","Approved","Rejected")
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_ApprovedBy"      -DisplayName "SAPTR ApprovedBy"       -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_ApprovedDate"    -DisplayName "SAPTR ApprovedDate"     -Type "DateTime"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_TransportStatus" -DisplayName "SAPTR TransportStatus"  -Type "Choice" -Choices @("Pending","Transported","Failed")
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_TransportedBy"   -DisplayName "SAPTR TransportedBy"    -Type "Text"
    Add-ColumnIfMissing -ListName $sapList -InternalName "SAPTR_TransportDate"   -DisplayName "SAPTR TransportDate"    -Type "DateTime"
}

# ===========================================================================
# MainDB_IT_Ext_Access — EAF extended fields
# ===========================================================================
$accessList = "MainDB_IT_Ext_Access"
Write-Host "`n=== EAF extended fields → $accessList ===" -ForegroundColor White

$list3 = Get-PnPList -Identity $accessList -ErrorAction SilentlyContinue
if (-not $list3) {
    Write-Error "List '$accessList' not found on $SiteUrl"
} else {
    Write-Host "Target list: $($list3.Title)`n" -ForegroundColor Cyan

    Add-ColumnIfMissing -ListName $accessList -InternalName "EAF_CC"               -DisplayName "EAF CC"               -Type "Text"
    Add-ColumnIfMissing -ListName $accessList -InternalName "EAF_ITComment"         -DisplayName "EAF ITComment"         -Type "Note"
    Add-ColumnIfMissing -ListName $accessList -InternalName "EAF_Attachment"        -DisplayName "EAF Attachment"        -Type "Text"
    Add-ColumnIfMissing -ListName $accessList -InternalName "EAF_ITConfigRemarks"   -DisplayName "EAF ITConfigRemarks"   -Type "Note"
    Add-ColumnIfMissing -ListName $accessList -InternalName "EAF_ITConfigStatus"    -DisplayName "EAF ITConfigStatus"    -Type "Choice" -Choices @("Configured","Denied","Pending")
}

# ===========================================================================
# MainDB_IT_Ext_Access — NIR extended fields
# ===========================================================================
Write-Host "`n=== NIR extended fields → $accessList ===" -ForegroundColor White

Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_EmailType"        -DisplayName "NIR EmailType"        -Type "Text"
Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_Remark"           -DisplayName "NIR Remark"           -Type "Note"
Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_HodComment"       -DisplayName "NIR HodComment"       -Type "Note"
Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_PICRemark"        -DisplayName "NIR PICRemark"        -Type "Note"
Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_AccName"          -DisplayName "NIR AccName"          -Type "Text"
Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_AccDate"          -DisplayName "NIR AccDate"          -Type "DateTime"
Add-ColumnIfMissing -ListName $accessList -InternalName "NIR_AccComment"       -DisplayName "NIR AccComment"       -Type "Note"

Write-Host "`nDone!`n" -ForegroundColor Green
