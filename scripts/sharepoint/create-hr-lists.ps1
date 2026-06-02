# HR SharePoint List Creation Script
# Site: https://ioioi.sharepoint.com/sites/ioi-portal-hr
# Generated: 2026-06-01 | Source: HR_SHAREPOINT_BUILD_PACKAGE.md

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr"
)

$ErrorActionPreference = "Stop"
Write-Host "HR List Creation Script" -ForegroundColor Cyan
Write-Host "Site: $SiteUrl" -ForegroundColor Gray

# Connect
Write-Host "`nConnecting..." -ForegroundColor Yellow
Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
Write-Host "Connected." -ForegroundColor Green

# Helper: safe list creation
function New-HRList {
    param($ListName, $Template = "GenericList")
    $existing = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  SKIP: $ListName already exists" -ForegroundColor Gray
        return $existing
    }
    $list = New-PnPList -Title $ListName -Template $Template -Url $ListName -ErrorAction Stop
    Write-Host "  CREATED: $ListName" -ForegroundColor Green
    return $list
}

# Helper: safe field add
function Add-HRField {
    param($List, $DisplayName, $InternalName, $Type, $Required = $false, $Choices = $null, $LookupList = $null, $LookupField = "ID")
    $existing = Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) { return }

    $params = @{ List = $List; DisplayName = $DisplayName; InternalName = $InternalName; Required = $Required }
    switch ($Type) {
        "Text" { Add-PnPField @params -Type Text }
        "Note" { Add-PnPField @params -Type Note }
        "DateTime" { Add-PnPField @params -Type DateTime -Format DateOnly }
        "Number" { Add-PnPField @params -Type Number }
        "Boolean" { Add-PnPField @params -Type Boolean }
        "Choice" { Add-PnPField @params -Type Choice -Choices $Choices }
        "User" { Add-PnPField @params -Type User }
        "UserMulti" { Add-PnPField @params -Type UserMulti }
        "Lookup" { Add-PnPField @params -Type Lookup -LookupList $LookupList -LookupField $LookupField }
        "URL" { Add-PnPField @params -Type URL }
    }
    Write-Host "    + $InternalName ($Type)" -ForegroundColor Gray
}

function Set-HRIndex {
    param($List, $FieldName)
    Set-PnPField -List $List -Identity $FieldName -Values @{Indexed=$true}
    Write-Host "    indexed: $FieldName" -ForegroundColor Gray
}

# ==================== 1. CONFIG LISTS ====================
Write-Host "`n[1/7] Config Lists" -ForegroundColor Yellow

$shifts = New-HRList "MainDB_HR_Config_ShiftCodes"
Add-HRField $shifts "Hours" "scHours" "Text" $true
Add-HRField $shifts "Description" "scDescription" "Text" $false

$companies = New-HRList "MainDB_HR_Config_Companies"
Add-HRField $companies "Full Name" "ccFullName" "Text" $false

# ==================== 2. PARENT LIST ====================
Write-Host "`n[2/7] Parent List: MainDB_HR" -ForegroundColor Yellow

$parent = New-HRList "MainDB_HR"
$fc = Add-PnPField -List $parent -DisplayName "Form Code" -InternalName "FormCode" -Type Choice -Choices @("CIR","BSD","AWHR","CWR","DRD","EEN") -Required $true
Write-Host "    + FormCode (Choice: CIR,BSD,AWHR,CWR,DRD,EEN)" -ForegroundColor Gray

# --- CIR Columns (14) ---
Write-Host "  CIR columns..." -ForegroundColor Gray
# cirSite: PENDING HR — create as text for now
Add-HRField $parent "Site" "cirSite" "Text" $true  # PENDING_HR: choice values unknown
Add-HRField $parent "Team Members" "cirTeamMembers" "Note" $false
Add-HRField $parent "Inspector" "cirInspector" "User" $false
Add-HRField $parent "Inspection Date" "cirInsDate" "DateTime" $true
Add-HRField $parent "Inspection Time" "cirInsTime" "Text" $true
Add-HRField $parent "Submitted By" "cirSubmittedBy" "User" $false
Add-HRField $parent "Submitted Date" "cirSubmittedDate" "DateTime" $false
Add-HRField $parent "Reviewed By" "cirReviewedBy" "User" $false
Add-HRField $parent "Reviewed Date" "cirReviewedDate" "DateTime" $false
Add-HRField $parent "Remarks" "cirRemarks" "Note" $false
# cirCurrentAction — DXL-confirmed: Submitted, Accepted
Add-HRField $parent "Current Status" "cirCurrentAction" "Choice" $true @("Submitted","Accepted")
Add-HRField $parent "Committee ACM" "cirACMComm" "Text" $false
Add-HRField $parent "Committee ECM" "cirECMComm" "Text" $false
Add-HRField $parent "Running Number" "cirINO" "Text" $false

# --- DRD Columns (27) ---
Write-Host "  DRD columns..." -ForegroundColor Gray
Add-HRField $parent "DRD Company" "drdCompany" "Lookup" $true -LookupList "MainDB_HR_Config_Companies"
Add-HRField $parent "DRD Category" "drdCategory" "Choice" $true @("Both","Outsource Worker")
Add-HRField $parent "DRD Department" "drdDepartment" "Text" $true
Add-HRField $parent "DRD Section" "drdSection" "Text" $true
Add-HRField $parent "DRD Section Head" "drdHOS" "User" $true
Add-HRField $parent "DRD Dept Head" "drdHOD" "User" $true
Add-HRField $parent "DRD CC" "drdCC" "Text" $false
Add-HRField $parent "DRD Month" "drdMonth" "Number" $true
Add-HRField $parent "DRD Year" "drdYear" "Number" $true
Add-HRField $parent "DRD Attachments" "drdAttch" "URL" $false
Add-HRField $parent "DRD Amended" "drdAmend" "Text" $false  # PENDING_HR
Add-HRField $parent "DRD Changes" "drdChanges" "Note" $false
Add-HRField $parent "DRD Employee" "drdEmpName" "User" $true
Add-HRField $parent "DRD Submitted By" "drdSubmittedBy" "User" $false
Add-HRField $parent "DRD Submitted Date" "drdSubmittedDate" "DateTime" $false
Add-HRField $parent "DRD HOS Name" "drdHOSName" "User" $false
Add-HRField $parent "DRD HOS Date" "drdHOSDate" "DateTime" $false
Add-HRField $parent "DRD HOS Remark" "drdHOSRemark" "Note" $false
Add-HRField $parent "DRD HOD Name" "drdHODName" "User" $false
Add-HRField $parent "DRD HOD Date" "drdHODDate" "DateTime" $false
Add-HRField $parent "DRD HOD Remark" "drdHODRemark" "Note" $false
Add-HRField $parent "DRD HR Name" "drdHRName" "User" $false
Add-HRField $parent "DRD HR Date" "drdHRDate" "DateTime" $false
Add-HRField $parent "DRD HOS Approved" "drdHOSApp" "Boolean" $false
Add-HRField $parent "DRD HOD Approved" "drdHODApp" "Boolean" $false
Add-HRField $parent "DRD HR Received" "drdHRApp" "Boolean" $false
Add-HRField $parent "DRD Current Status" "drdCurrentAction" "Choice" $true @("Submitted","HOSApproved","HODApproved","Completed")

# ==================== 3. CHILD LISTS ====================
Write-Host "`n[3/7] Child List: MainDB_HR_Ext_BSD" -ForegroundColor Yellow
$bsdChild = New-HRList "MainDB_HR_Ext_BSD"
Add-HRField $bsdChild "Parent ID" "ParentID" "Lookup" $true -LookupList "MainDB_HR" -LookupField "ID"
Add-HRField $bsdChild "Backup Name" "bsdBackupName" "User" $true
Add-HRField $bsdChild "Backup Position" "bsdBackupPosition" "Text" $true
Add-HRField $bsdChild "Backup Responsibility" "bsdBackupResponsibility" "Note" $false
Add-HRField $bsdChild "Row Number" "bsdRowNumber" "Number" $false

Write-Host "`n[4/7] Child List: MainDB_HR_Ext_AWHR" -ForegroundColor Yellow
$awhrChild = New-HRList "MainDB_HR_Ext_AWHR"
Add-HRField $awhrChild "Parent ID" "ParentID" "Lookup" $true -LookupList "MainDB_HR" -LookupField "ID"
Add-HRField $awhrChild "AWHR Emp No" "awhrEmpNo" "Text" $true
Add-HRField $awhrChild "AWHR Full Name" "awhrFullName" "User" $true
Add-HRField $awhrChild "Exceeded Category" "awhrExceededCategory" "Choice" $true @("E1","E2","E3","E4")
Add-HRField $awhrChild "AWHR Date From" "awhrDateFrom" "DateTime" $true
Add-HRField $awhrChild "AWHR Date To" "awhrDateTo" "DateTime" $true
Add-HRField $awhrChild "Day Type" "awhrDayType" "Text" $true  # PENDING_HR
Add-HRField $awhrChild "Shift Code" "awhrShiftCode" "Lookup" $true -LookupList "MainDB_HR_Config_ShiftCodes" -LookupField "Title"
Add-HRField $awhrChild "Add Hours" "awhrAddHours" "Number" $false
Add-HRField $awhrChild "Total Hours" "awhrTotalHours" "Number" $true
Add-HRField $awhrChild "Row Number" "awhrRowNumber" "Number" $false

Write-Host "`n[5/7] Child List: MainDB_HR_Ext_CWR_Periods" -ForegroundColor Yellow
$cwrChild = New-HRList "MainDB_HR_Ext_CWR_Periods"
Add-HRField $cwrChild "Parent ID" "ParentID" "Lookup" $true -LookupList "MainDB_HR" -LookupField "ID"
Add-HRField $cwrChild "Section Type" "cwrSection" "Choice" $true @("Permanent","Plant Shutdown")
Add-HRField $cwrChild "Period From" "cwrPeriodFrom" "DateTime" $true
Add-HRField $cwrChild "Period To" "cwrPeriodTo" "DateTime" $true
Add-HRField $cwrChild "Total Days" "cwrTotalDays" "Number" $true
Add-HRField $cwrChild "Row Number" "cwrRowNumber" "Number" $false

# ==================== 4. WORKFLOW HISTORY ====================
Write-Host "`n[6/7] Workflow History: MainDB_HR_WorkflowHistory" -ForegroundColor Yellow
$wf = New-HRList "MainDB_HR_WorkflowHistory"
Add-HRField $wf "Parent ID" "ParentID" "Lookup" $true -LookupList "MainDB_HR" -LookupField "ID"
Add-HRField $wf "Form Code" "wfFormCode" "Choice" $true @("BSD","AWHR","CWR","DRD","EEN")
Add-HRField $wf "Stage" "wfStage" "Text" $true
Add-HRField $wf "Action" "wfAction" "Choice" $true @("Approved","Rejected","Submitted","Acknowledged","Denied","Withdrawn","Extended")
Add-HRField $wf "Performed By" "wfPerformedBy" "User" $true
Add-HRField $wf "Performed Date" "wfPerformedDate" "DateTime" $true
Add-HRField $wf "Comments" "wfComments" "Note" $false
Add-HRField $wf "Previous State" "wfPreviousState" "Text" $false
Add-HRField $wf "New State" "wfNewState" "Text" $false

# ==================== 5. INDEXES ====================
Write-Host "`n[7/7] Creating indexes..." -ForegroundColor Yellow
Set-HRIndex $parent "FormCode"
foreach ($childList in @($bsdChild, $awhrChild, $cwrChild, $wf)) {
    Set-HRIndex $childList "ParentID"
}
Set-HRIndex $wf "wfFormCode"

# ==================== 6. SEED DATA ====================
Write-Host "`nSeeding shift codes..." -ForegroundColor Yellow
$shifts_data = @(
    @{Title="OFC"; scHours="08:30-17:45"}, @{Title="OFO"; scHours="08:30-17:30"},
    @{Title="N1"; scHours="08:30-17:00"}, @{Title="A1"; scHours="07:00-14:30"},
    @{Title="A2"; scHours="07:30-15:00"}, @{Title="B1"; scHours="15:00-22:30"},
    @{Title="C1"; scHours="23:00-06:30"}, @{Title="7A1"; scHours="07:00-19:00"},
    @{Title="7A2"; scHours="07:30-19:00"}, @{Title="7P1"; scHours="19:00-06:30"}
)
foreach ($s in $shifts_data) {
    $existing = Get-PnPListItem -List $shifts -Query "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>$($s.Title)</Value></Eq></Where></Query></View>" -ErrorAction SilentlyContinue
    if (-not $existing) {
        Add-PnPListItem -List $shifts -Values @{Title=$s.Title; scHours=$s.scHours} | Out-Null
    }
}
Write-Host "  10 shift codes seeded" -ForegroundColor Green

Write-Host "`nSeeding companies..." -ForegroundColor Yellow
$co_data = @(@{Title="YKS"}, @{Title="YTC"}, @{Title="NAGA"})
foreach ($c in $co_data) {
    Add-PnPListItem -List $companies -Values @{Title=$c.Title} -ErrorAction SilentlyContinue | Out-Null
}
Write-Host "  3 companies seeded (full names PENDING_HR)" -ForegroundColor Yellow

# ==================== DONE ====================
Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " HR SharePoint Lists - Creation Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Lists created: 7" -ForegroundColor Green
Write-Host "   MainDB_HR_Config_ShiftCodes (10 rows seeded)" -ForegroundColor Gray
Write-Host "   MainDB_HR_Config_Companies (3 rows seeded)" -ForegroundColor Gray
Write-Host "   MainDB_HR (CIR + DRD columns)" -ForegroundColor Gray
Write-Host "   MainDB_HR_Ext_BSD" -ForegroundColor Gray
Write-Host "   MainDB_HR_Ext_AWHR" -ForegroundColor Gray
Write-Host "   MainDB_HR_Ext_CWR_Periods" -ForegroundColor Gray
Write-Host "   MainDB_HR_WorkflowHistory" -ForegroundColor Gray
Write-Host " Pending HR: cirSite, drdAmend, awhrDayType, ccFullName" -ForegroundColor Yellow
