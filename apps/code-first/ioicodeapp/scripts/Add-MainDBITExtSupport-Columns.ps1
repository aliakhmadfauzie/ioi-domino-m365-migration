<#
.SYNOPSIS
    Creates the MainDBITExtSupport SharePoint list (if missing) and adds all required columns.

.DESCRIPTION
    Idempotent — skips the list creation if already present, skips columns that already exist.

.PARAMETER SiteUrl
    SharePoint site URL.  Default: https://ioioi.sharepoint.com/sites/MainDB_IT

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.REQUIREMENTS
    Install-Module SharePointPnPPowerShellOnline -Scope CurrentUser
#>

param(
    [string]$SiteUrl  = "https://ioioi.sharepoint.com/sites/MainDB_IT",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ListName = "MainDBITExtSupport"

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
Import-Module SharePointPnPPowerShellOnline -WarningAction Ignore -ErrorAction Stop

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin

# ---------------------------------------------------------------------------
# Create list if missing
# ---------------------------------------------------------------------------
$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    if ($WhatIf) {
        Write-Host "  [whatif] Would create list: $ListName" -ForegroundColor Yellow
    } else {
        Write-Host "  [creating] List: $ListName" -ForegroundColor Cyan
        New-PnPList -Title $ListName -Template GenericList | Out-Null
        Write-Host "  [created] $ListName" -ForegroundColor Green
    }
} else {
    Write-Host "  [skip] List '$ListName' already exists" -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text","Note","DateTime","Boolean","Choice","Number","Lookup")]
        [string]$Type,
        [string[]]$Choices    = @(),
        [string]$LookupList   = "",
        [string]$LookupField  = "Title",
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
        if ($Type -eq "Lookup") {
            Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName `
                -Type Lookup -LookupList $LookupList -LookupField $LookupField | Out-Null
        } elseif ($Type -eq "Choice" -and $Choices.Count -gt 0) {
            Add-PnPField -List $ListName -InternalName $InternalName -DisplayName $DisplayName `
                -Type Choice -Choices $Choices | Out-Null
        } else {
            $params = @{
                List         = $ListName
                InternalName = $InternalName
                DisplayName  = $DisplayName
                Type         = $Type
            }
            if ($Required) { $params.Required = $true }
            Add-PnPField @params | Out-Null
        }
        Write-Host "  [added] $InternalName  ($Type)" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $InternalName`: $_" -ForegroundColor Red
    }
}

# ---------------------------------------------------------------------------
# Base / shared columns
# ---------------------------------------------------------------------------
Write-Host "`n--- Base ---" -ForegroundColor White

Add-ColumnIfMissing -InternalName "ParentFormCode"  -DisplayName "Parent Form Code"  -Type "Text"     -Required
Add-ColumnIfMissing -InternalName "ParentSite"       -DisplayName "Parent Site"        -Type "Text"
Add-ColumnIfMissing -InternalName "ParentRecord"     -DisplayName "Parent Record"      -Type "Lookup"  -LookupList "MainDB_IT" -LookupField "Title"

# ---------------------------------------------------------------------------
# ITDR columns (IT Daily Report / Training)
# ---------------------------------------------------------------------------
Write-Host "`n--- ITDR ---" -ForegroundColor White

Add-ColumnIfMissing -InternalName "ITDRActivityType"  -DisplayName "ITDR Activity Type"  -Type "Text"
Add-ColumnIfMissing -InternalName "ITDRCategory"      -DisplayName "ITDR Category"        -Type "Text"
Add-ColumnIfMissing -InternalName "ITDRDateFrom"      -DisplayName "ITDR Date From"        -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITDRDateTo"        -DisplayName "ITDR Date To"          -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITDRParticipants"  -DisplayName "ITDR Participants"    -Type "Note"
Add-ColumnIfMissing -InternalName "ITDRVenue"         -DisplayName "ITDR Venue"            -Type "Text"

# ---------------------------------------------------------------------------
# ITDR2 columns (sub-tasks)
# ---------------------------------------------------------------------------
Write-Host "`n--- ITDR2 ---" -ForegroundColor White

Add-ColumnIfMissing -InternalName "ITDR2AssignedTo"      -DisplayName "ITDR2 Assigned To"      -Type "Text"
Add-ColumnIfMissing -InternalName "ITDR2ClosedDate"      -DisplayName "ITDR2 Closed Date"      -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITDR2DueDate"         -DisplayName "ITDR2 Due Date"         -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITDR2TaskDescription" -DisplayName "ITDR2 Task Description" -Type "Note"
Add-ColumnIfMissing -InternalName "ITDR2TaskStatus"      -DisplayName "ITDR2 Task Status"      -Type "Text"

# ---------------------------------------------------------------------------
# ITSSR columns — existing in model
# ---------------------------------------------------------------------------
Write-Host "`n--- ITSSR (existing model) ---" -ForegroundColor White

Add-ColumnIfMissing -InternalName "ITSSRCaseNo"            -DisplayName "ITSSR Case No"            -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRAssignedToEmail"   -DisplayName "ITSSR Assigned To Email"  -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRReportedByEmail"   -DisplayName "ITSSR Reported By Email"  -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRServiceType"       -DisplayName "ITSSR Service Type"       -Type "Choice" `
    -Choices @("Hardware","Software","Network","SAP","Bank","Access","Others")
Add-ColumnIfMissing -InternalName "ITSSRProblemDescription" -DisplayName "ITSSR Problem Description" -Type "Note"
Add-ColumnIfMissing -InternalName "ITSSRProblemCategory"   -DisplayName "ITSSR Problem Category"   -Type "Choice" `
    -Choices @("Hardware Fault","Software Error","Network Issue","SAP Issue","Bank System Issue","Access / Permission","User Error","Others")
Add-ColumnIfMissing -InternalName "ITSSRSolution"          -DisplayName "ITSSR Solution"           -Type "Note"
Add-ColumnIfMissing -InternalName "ITSSRSupportMethod"     -DisplayName "ITSSR Support Method"     -Type "Choice" `
    -Choices @("Remote Desktop","On-site","Phone Call","Email","Self-Service")
Add-ColumnIfMissing -InternalName "ITSSRSatisfactionRating" -DisplayName "ITSSR Satisfaction Rating" -Type "Number"
Add-ColumnIfMissing -InternalName "ITSSRDateStarted"       -DisplayName "ITSSR Date Started"       -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITSSRDateResolved"      -DisplayName "ITSSR Date Resolved"      -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITSSRDateAccepted"      -DisplayName "ITSSR Date Accepted"      -Type "DateTime"

# ---------------------------------------------------------------------------
# ITSSR columns — new (previously in remarks)
# ---------------------------------------------------------------------------
Write-Host "`n--- ITSSR (new) ---" -ForegroundColor White

Add-ColumnIfMissing -InternalName "ITSSRCompany"          -DisplayName "ITSSR Company"           -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRExtNo"            -DisplayName "ITSSR Extension No"      -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRHardwareType"     -DisplayName "ITSSR Hardware Type"     -Type "Choice" `
    -Choices @("Desktop","Laptop","Printer","Scanner","Monitor","Mouse / Keyboard","Projector","Server","Network Equipment","UPS","Others")
Add-ColumnIfMissing -InternalName "ITSSRApplication"      -DisplayName "ITSSR Application"       -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRModule"           -DisplayName "ITSSR Module"            -Type "Text"
Add-ColumnIfMissing -InternalName "ITSSRSapModule"        -DisplayName "ITSSR SAP Module"        -Type "Choice" `
    -Choices @("SD","MM","PP","FI","CO","HR/HCM","PM","QM","WM","Basis","ABAP","Others")
Add-ColumnIfMissing -InternalName "ITSSRBankModule"       -DisplayName "ITSSR Bank Module"       -Type "Choice" `
    -Choices @("CIMB BizChannel","Maybank2E","Public Bank","RHB Reflex","Ambank","Others")
Add-ColumnIfMissing -InternalName "ITSSRPendingStatus"    -DisplayName "ITSSR Pending Status"    -Type "Choice" `
    -Choices @("Waiting for User","Waiting for Parts","Waiting for Vendor","Waiting for Access","Escalated","Others")
Add-ColumnIfMissing -InternalName "ITSSRDateNotified"     -DisplayName "ITSSR Date Notified"     -Type "DateTime"
Add-ColumnIfMissing -InternalName "ITSSRProblemCategory2" -DisplayName "ITSSR Problem Category 2" -Type "Choice" `
    -Choices @("Hardware Fault","Software Error","Network Issue","SAP Issue","Bank System Issue","Access / Permission","User Error","Others")
Add-ColumnIfMissing -InternalName "ITSSRClassification"   -DisplayName "ITSSR Classification"    -Type "Choice" `
    -Choices @("Incident","Service Request","Problem","Change Request")
Add-ColumnIfMissing -InternalName "ITSSRAcceptanceComment" -DisplayName "ITSSR Acceptance Comment" -Type "Note"
Add-ColumnIfMissing -InternalName "ITSSRFinalRemark"      -DisplayName "ITSSR Final Remark"      -Type "Note"
Add-ColumnIfMissing -InternalName "ITSSRFinalNotifyDate"  -DisplayName "ITSSR Final Notify Date" -Type "DateTime"

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host "`nDone. '$ListName' is ready on $SiteUrl`n" -ForegroundColor Cyan
