<#
.SYNOPSIS
    Adds all columns to MainDB_HR, MainDB_HR_JHR, and HR extension lists.

.DESCRIPTION
    Idempotent — skips columns that already exist.
    Run after Create-HR-Lists.ps1.

.PARAMETER SiteUrl
    SharePoint site URL for HR. Default: https://ioioi.sharepoint.com/sites/ioi-portal-hr

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-HR-Columns.ps1
    .\Add-HR-Columns.ps1 -WhatIf

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if ($script:IOI_SHAREPOINT_HR_URL) {
    $SiteUrl = $script:IOI_SHAREPOINT_HR_URL
}

# ---------------------------------------------------------------------------
# Connection
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
Write-Host "Connected successfully.`n" -ForegroundColor Green

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text","Note","DateTime","Boolean","Choice","Number","Currency")]
        [string]$Type,
        [string[]]$Choices = @(),
        [switch]$Required,
        [string]$DefaultValue = ""
    )

    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [skip] $ListName :: $InternalName  (already exists)" -ForegroundColor DarkGray
        return
    }

    if ($WhatIf) {
        Write-Host "  [whatif] Would add: $ListName :: $InternalName  ($Type)" -ForegroundColor Yellow
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

        if ($DefaultValue -and $Type -eq "Choice") {
            try {
                $field = Get-PnPField -List $ListName -Identity $InternalName
                $field.DefaultValue = $DefaultValue
                $field.Update()
                Invoke-PnPQuery
            } catch {
                # Non-critical — skip default value errors
            }
        }

        Write-Host "  [added] $ListName :: $InternalName  ($Type)" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $ListName :: $InternalName`: $_" -ForegroundColor Red
    }
}

# ===========================================================================
# 1. MainDB_HR — Core Columns (All Forms)
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR — Core Columns" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$mainList = "MainDB_HR"

Add-ColumnIfMissing -ListName $mainList -InternalName "FormCode" -DisplayName "Form Code" -Type "Choice" -Required `
    -Choices @("AWHR","BSD","CIR","CWR","DRD","EEN","EPDU","EPHR","ESF","FTCR","FWWPD","FWWPE","GDSN","HEALTHINFO","HRAPR","HRINFO","INTERN","INTERVIEWDB","JD","NDF","ORGCHART","OWP","PAF","SR","TMPU","TNPRA")

Add-ColumnIfMissing -ListName $mainList -InternalName "CurrentStatus" -DisplayName "Current Status" -Type "Choice" `
    -Choices @("Draft","Submitted","HOD Approval","HR Review","Director/COO Approval","Completed","Rejected","Cancelled")

Add-ColumnIfMissing -ListName $mainList -InternalName "Site" -DisplayName "Site" -Type "Choice" -Required `
    -Choices @("Penang","Johor","Prai","Kuala Lumpur","Both Sites")

Add-ColumnIfMissing -ListName $mainList -InternalName "EmployeeName" -DisplayName "Employee Name" -Type "Text"

Add-ColumnIfMissing -ListName $mainList -InternalName "EmployeeNo" -DisplayName "Employee No" -Type "Text"

Add-ColumnIfMissing -ListName $mainList -InternalName "Company" -DisplayName "Company" -Type "Choice"

Add-ColumnIfMissing -ListName $mainList -InternalName "Department" -DisplayName "Department" -Type "Choice"

Add-ColumnIfMissing -ListName $mainList -InternalName "Designation" -DisplayName "Designation" -Type "Text"

Add-ColumnIfMissing -ListName $mainList -InternalName "SubmittedDate" -DisplayName "Submitted Date" -Type "DateTime"

Add-ColumnIfMissing -ListName $mainList -InternalName "Subject" -DisplayName "Subject" -Type "Text"

Add-ColumnIfMissing -ListName $mainList -InternalName "HOD" -DisplayName "HOD" -Type "Text"

Add-ColumnIfMissing -ListName $mainList -InternalName "HODApprovalDate" -DisplayName "HOD Approval Date" -Type "DateTime"

Add-ColumnIfMissing -ListName $mainList -InternalName "HODRemarks" -DisplayName "HOD Remarks" -Type "Note"

Add-ColumnIfMissing -ListName $mainList -InternalName "HRInCharge" -DisplayName "HR In Charge" -Type "Text"

Add-ColumnIfMissing -ListName $mainList -InternalName "HRApprovalDate" -DisplayName "HR Approval Date" -Type "DateTime"

Add-ColumnIfMissing -ListName $mainList -InternalName "HRRemarks" -DisplayName "HR Remarks" -Type "Note"

Add-ColumnIfMissing -ListName $mainList -InternalName "COOApprovalDate" -DisplayName "COO Approval Date" -Type "DateTime"

Add-ColumnIfMissing -ListName $mainList -InternalName "COORemarks" -DisplayName "COO Remarks" -Type "Note"

Add-ColumnIfMissing -ListName $mainList -InternalName "IsLocked" -DisplayName "Is Locked" -Type "Boolean"

Add-ColumnIfMissing -ListName $mainList -InternalName "Remarks" -DisplayName "Remarks" -Type "Note"

Add-ColumnIfMissing -ListName $mainList -InternalName "WorkflowStage" -DisplayName "Workflow Stage" -Type "Number"

Add-ColumnIfMissing -ListName $mainList -InternalName "EnvironmentTag" -DisplayName "Environment Tag" -Type "Choice" `
    -Choices @("Production","UAT","Development")

# ---------------------------------------------------------------------------
# SR (Staff Requisition) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- SR (Staff Requisition) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tPosition" -DisplayName "SR Position" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tDesignation" -DisplayName "SR Designation" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tName" -DisplayName "SR Candidate Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_nNumber" -DisplayName "SR Number Required" -Type "Number"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tRunningNumber" -DisplayName "SR Running Number" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tRequisitionerPost" -DisplayName "SR Requisitioner Post" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tReviewerPost" -DisplayName "SR Reviewer Post" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tVerifierPost" -DisplayName "SR Verifier Post" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tDeptHeadName" -DisplayName "SR Dept Head Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tSection" -DisplayName "SR Section" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_dCompany" -DisplayName "SR Company" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_dDept" -DisplayName "SR Department" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_dDivision" -DisplayName "SR Division" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_rExecutive" -DisplayName "SR Executive" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_RequiredDate" -DisplayName "SR Required Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_Status" -DisplayName "SR Status" -Type "Choice" `
    -Choices @("Draft","Pending HOD","Pending HR","Pending COO","Approved","Rejected")
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tSpecialRequirement" -DisplayName "SR Special Requirement" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tExperience" -DisplayName "SR Experience" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tQualification" -DisplayName "SR Qualification" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tDuties" -DisplayName "SR Duties" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tReason" -DisplayName "SR Reason" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tTermPeriod" -DisplayName "SR Term Period" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tCandidateName" -DisplayName "SR Shortlisted Candidate" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tRemark" -DisplayName "SR Remark" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_OfferedDate" -DisplayName "SR Offered Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_tUsername" -DisplayName "SR Username" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "SR_Summary" -DisplayName "SR Summary" -Type "Note"

# ---------------------------------------------------------------------------
# PAF (Performance Appraisal Form) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- PAF (Performance Appraisal) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_Year" -DisplayName "PAF Year" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmNo" -DisplayName "PAF Employee No" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmName" -DisplayName "PAF Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmComp" -DisplayName "PAF Company" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmDept" -DisplayName "PAF Department" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmDesg" -DisplayName "PAF Designation" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmDateJoin" -DisplayName "PAF Date Joined" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_EmComYear" -DisplayName "PAF Company Year" -Type "Number"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_Summary" -DisplayName "PAF Summary" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_SummaryHR" -DisplayName "PAF Summary HR" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "PAF_Band" -DisplayName "PAF Band" -Type "Choice" `
    -Choices @("Band 1","Band 2","Band 3","Band 4")

# ---------------------------------------------------------------------------
# EEN (Employee Exit Notification) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- EEN (Employee Exit Notification) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_EmpName" -DisplayName "EEN Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_EmpNum" -DisplayName "EEN Employee Num" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_EmpEmail" -DisplayName "EEN Employee Email" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Position" -DisplayName "EEN Position" -Type "Choice" `
    -Choices @("Executive","Non-Executive","Management","Contract Staff")
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Category" -DisplayName "EEN Category" -Type "Choice" `
    -Choices @("Resignation","Retirement","Contract End","Termination","Transfer","Other")
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Type" -DisplayName "EEN Type" -Type "Choice" `
    -Choices @("Voluntary","Involuntary","Mutual Agreement")
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Reasons" -DisplayName "EEN Reasons" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Pay" -DisplayName "EEN Final Pay" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Progress" -DisplayName "EEN Progress" -Type "Choice" `
    -Choices @("Submitted","HOD Review","HR Review","ED Review","Completed","Cancelled")
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Comments1" -DisplayName "EEN Comments 1" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Comments2" -DisplayName "EEN Comments 2" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Comments3" -DisplayName "EEN Comments 3" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Comments4" -DisplayName "EEN Comments 4" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Comments5" -DisplayName "EEN Comments 5" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_SugDisscussion" -DisplayName "EEN Suggestion for Discussion" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_SugImprovements" -DisplayName "EEN Improvement Suggestions" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_NewPost" -DisplayName "EEN New Position" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_PreventLeave" -DisplayName "EEN Retention Attempts" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_HRRem" -DisplayName "EEN HR Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Details_1" -DisplayName "EEN Details 1" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EEN_Details_2" -DisplayName "EEN Details 2" -Type "Note"

# ---------------------------------------------------------------------------
# CWR (Contract Worker Requisition) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- CWR (Contract Worker Requisition) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_Category" -DisplayName "CWR Category" -Type "Choice" `
    -Choices @("New","Renewal","Replacement","Extension")
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_IssueNo" -DisplayName "CWR Issue No" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_INO" -DisplayName "CWR INO Number" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_DateOFReminder" -DisplayName "CWR Reminder Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_Name" -DisplayName "CWR Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_Subject" -DisplayName "CWR Subject" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_Remarks" -DisplayName "CWR Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_DUEDATE" -DisplayName "CWR Due Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_ExpiryDate" -DisplayName "CWR Expiry Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "CWR_RunNum" -DisplayName "CWR Running Number" -Type "Text"

# ---------------------------------------------------------------------------
# TMPU (Talent Management) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- TMPU (Talent Management) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_FullName" -DisplayName "TMPU Full Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_Company" -DisplayName "TMPU Company" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_Dept" -DisplayName "TMPU Department" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_Div" -DisplayName "TMPU Division" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_JobTitle" -DisplayName "TMPU Job Title" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_JobGrade" -DisplayName "TMPU Job Grade" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_DateJoin" -DisplayName "TMPU Date Joined" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_DOB" -DisplayName "TMPU Date of Birth" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_Age" -DisplayName "TMPU Age" -Type "Number"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_Potential" -DisplayName "TMPU Potential" -Type "Choice" `
    -Choices @("High","Medium","Low")
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_Email" -DisplayName "TMPU Email" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_EmpNo" -DisplayName "TMPU Employee No" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_COOName" -DisplayName "TMPU COO Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_COODate" -DisplayName "TMPU COO Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_EDName" -DisplayName "TMPU ED Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_EDDate" -DisplayName "TMPU ED Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_HODName" -DisplayName "TMPU HOD Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TMPU_HODDate" -DisplayName "TMPU HOD Date" -Type "DateTime"

# ---------------------------------------------------------------------------
# ORGCHART (Organisation Chart) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- ORGCHART (Organisation Chart) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "ORG_HODName" -DisplayName "ORG HOD Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "ORG_HODDate" -DisplayName "ORG HOD Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "ORG_HODRemarks" -DisplayName "ORG HOD Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "ORG_EDName" -DisplayName "ORG ED Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "ORG_EDDate" -DisplayName "ORG ED Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "ORG_EDRemarks" -DisplayName "ORG ED Remarks" -Type "Note"

# ---------------------------------------------------------------------------
# AWHR (Rest Day & Additional Working Hours) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- AWHR (Rest Day & Additional Working Hours) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Grd_1" -DisplayName "AWHR Grade 1" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Grd_2" -DisplayName "AWHR Grade 2" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Grd_3" -DisplayName "AWHR Grade 3" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Grd_4" -DisplayName "AWHR Grade 4" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Grd_5" -DisplayName "AWHR Grade 5" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_1" -DisplayName "AWHR Question 1" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_2" -DisplayName "AWHR Question 2" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_3" -DisplayName "AWHR Question 3" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_4" -DisplayName "AWHR Question 4" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_5" -DisplayName "AWHR Question 5" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_6" -DisplayName "AWHR Question 6" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_7" -DisplayName "AWHR Question 7" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "AWHR_Q_8" -DisplayName "AWHR Question 8" -Type "Text"

# ---------------------------------------------------------------------------
# JD (Job Descriptions) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- JD (Job Descriptions) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "JD_jobdesc" -DisplayName "JD Description" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "JD_Department" -DisplayName "JD Department" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "JD_Company" -DisplayName "JD Company" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "JD_Designation" -DisplayName "JD Designation" -Type "Text"

# ---------------------------------------------------------------------------
# NDF (Night Duty Findings) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- NDF (Night Duty Findings) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "NDF_Dept_PIC" -DisplayName "NDF Dept PIC" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "NDF_Report" -DisplayName "NDF Report" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "NDF_Schedule" -DisplayName "NDF Schedule" -Type "Note"

# ---------------------------------------------------------------------------
# DRD (Duty Roster) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- DRD (Duty Roster) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "DRD_Date" -DisplayName "DRD Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "DRD_Roster" -DisplayName "DRD Roster" -Type "Note"

# ---------------------------------------------------------------------------
# BSD (Backup Staff Database) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- BSD (Backup Staff) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "BSD_Form" -DisplayName "BSD Form" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "BSD_Summary" -DisplayName "BSD Summary" -Type "Note"

# ---------------------------------------------------------------------------
# CIR (Cafeteria Inspection) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- CIR (Cafeteria Inspection) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "CIR_InspectionDate" -DisplayName "CIR Inspection Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "CIR_Inspector" -DisplayName "CIR Inspector" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "CIR_Remarks" -DisplayName "CIR Remarks" -Type "Note"

# ---------------------------------------------------------------------------
# FWWPD (Foreign Workers Work Permit) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- FWWPD (Foreign Workers Work Permit) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPD_WorkerName" -DisplayName "FWWPD Worker Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPD_PassportNo" -DisplayName "FWWPD Passport No" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPD_WorkPermitNo" -DisplayName "FWWPD Work Permit No" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPD_ExpiryDate" -DisplayName "FWWPD Expiry Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPD_Nationality" -DisplayName "FWWPD Nationality" -Type "Text"

# ---------------------------------------------------------------------------
# GDSN (Gift-Donation-Sponsorship) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- GDSN (Gift-Donation-Sponsorship) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "GDSN_RequestType" -DisplayName "GDSN Request Type" -Type "Choice" `
    -Choices @("Gift","Donation","Sponsorship")
Add-ColumnIfMissing -ListName $mainList -InternalName "GDSN_Amount" -DisplayName "GDSN Amount" -Type "Currency"
Add-ColumnIfMissing -ListName $mainList -InternalName "GDSN_Purpose" -DisplayName "GDSN Purpose" -Type "Note"

# ---------------------------------------------------------------------------
# EPDU (Employee Personal Detail Update) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- EPDU (Employee Personal Detail Update) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "EPDU_UpdateType" -DisplayName "EPDU Update Type" -Type "Choice" `
    -Choices @("Address","Contact No","Bank Account","Emergency Contact","Qualification","Other")
Add-ColumnIfMissing -ListName $mainList -InternalName "EPDU_OldValue" -DisplayName "EPDU Old Value" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EPDU_NewValue" -DisplayName "EPDU New Value" -Type "Note"

# ---------------------------------------------------------------------------
# EPHR (Employee Personal Health Records) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- EPHR (Employee Health Records) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "EPHR_HealthInfo" -DisplayName "EPHR Health Info" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "EPHR_LastCheckup" -DisplayName "EPHR Last Checkup" -Type "DateTime"

# ---------------------------------------------------------------------------
# FTCR (Fixed Term Contract Requisition) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- FTCR (Fixed Term Contract) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "FTCR_SPForm" -DisplayName "FTCR Contract Form" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "FTCR_StartDate" -DisplayName "FTCR Start Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "FTCR_EndDate" -DisplayName "FTCR End Date" -Type "DateTime"

# ---------------------------------------------------------------------------
# FWWPE (Foreign Worker Work Period Extension) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- FWWPE (FW Work Period Extension) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPE_Form" -DisplayName "FWWPE Form" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "FWWPE_ExtensionPeriod" -DisplayName "FWWPE Extension Period" -Type "Text"

# ---------------------------------------------------------------------------
# HEALTHINFO (Health Info) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- HEALTHINFO (Health Info) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "HEALTHINFO_Info" -DisplayName "HEALTHINFO Info" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "HEALTHINFO_Category" -DisplayName "HEALTHINFO Category" -Type "Choice" `
    -Choices @("Wellness","Medical Advisory","Health Campaign","Others")

# ---------------------------------------------------------------------------
# HRAPR (HR Applications Problem Reporting) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- HRAPR (HR Problem Reporting) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "HRAPR_SoftwareErrors" -DisplayName "HRAPR Error Description" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "HRAPR_Module" -DisplayName "HRAPR Module" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "HRAPR_Priority" -DisplayName "HRAPR Priority" -Type "Choice" `
    -Choices @("Low","Normal","High","Critical")

# ---------------------------------------------------------------------------
# HRINFO (HR Notice Database) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- HRINFO (HR Notice) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "HRINFO_NewForm" -DisplayName "HRINFO Notice" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "HRINFO_ExpiryDate" -DisplayName "HRINFO Expiry Date" -Type "DateTime"

# ---------------------------------------------------------------------------
# INTERN (Industrial Trainees) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- INTERN (Industrial Trainees) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "INTERN_InternName" -DisplayName "INTERN Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "INTERN_University" -DisplayName "INTERN University" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "INTERN_StartDate" -DisplayName "INTERN Start Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "INTERN_EndDate" -DisplayName "INTERN End Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "INTERN_WkPLForm" -DisplayName "INTERN Work Plan" -Type "Note"

# ---------------------------------------------------------------------------
# INTERVIEWDB (Interview Database) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- INTERVIEWDB (Interview Database) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "INTERVIEWDB_INT" -DisplayName "INTERVIEWDB Form" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "INTERVIEWDB_Date" -DisplayName "INTERVIEWDB Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "INTERVIEWDB_Position" -DisplayName "INTERVIEWDB Position" -Type "Text"

# ---------------------------------------------------------------------------
# OWP (Outsource Worker Passport & Work Permit) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- OWP (Outsource Worker) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "OWP_WorkerName" -DisplayName "OWP Worker Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "OWP_Vendor" -DisplayName "OWP Vendor" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "OWP_PassportNo" -DisplayName "OWP Passport No" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "OWP_WorkPermitExpiry" -DisplayName "OWP Work Permit Expiry" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "OWP_VendorList" -DisplayName "OWP Vendor List" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "OWP_JD" -DisplayName "OWP Job Description" -Type "Note"

# ---------------------------------------------------------------------------
# TNPRA (Typhoid/NPRA Database) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- TNPRA (Typhoid/NPRA) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "TNPRA_EmployeeName" -DisplayName "TNPRA Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $mainList -InternalName "TNPRA_InjectionDate" -DisplayName "TNPRA Injection Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "TNPRA_ExpiryDate" -DisplayName "TNPRA Expiry Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $mainList -InternalName "TNPRA_Remarks" -DisplayName "TNPRA Remarks" -Type "Note"

# ---------------------------------------------------------------------------
# ESF (Employee Survey) — prefixed columns
# ---------------------------------------------------------------------------
Write-Host "`n--- ESF (Employee Survey) ---" -ForegroundColor White

Add-ColumnIfMissing -ListName $mainList -InternalName "ESF_Survey" -DisplayName "ESF Survey" -Type "Note"
Add-ColumnIfMissing -ListName $mainList -InternalName "ESF_SurveyDate" -DisplayName "ESF Survey Date" -Type "DateTime"

# ===========================================================================
# 2. MainDB_HR_JHR — Core Columns (Same as MainDB_HR)
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_JHR — Core Columns" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$jhrList = "MainDB_HR_JHR"

# Add same core columns to Johor list
Add-ColumnIfMissing -ListName $jhrList -InternalName "FormCode" -DisplayName "Form Code" -Type "Choice" -Required `
    -Choices @("PCNBkStf","cancomp","ContractorReg","TyphoidVacc","UniformReq","pcnjd","LateComing","manpowerReq","NightVisit","PCNOrgChart","AppTest","SpVisit","workins","hostela","PCNTND","PCNDriver","EmpUpPOC","empinfo","PCNSecObsReport","TalentMgmt","fdreq","scrap","PCNBkStf","cancomp")

Add-ColumnIfMissing -ListName $jhrList -InternalName "CurrentStatus" -DisplayName "Current Status" -Type "Choice" `
    -Choices @("Draft","Submitted","HOD Approval","HR Review","Director/COO Approval","Completed","Rejected","Cancelled")

Add-ColumnIfMissing -ListName $jhrList -InternalName "Site" -DisplayName "Site" -Type "Choice" -Required `
    -Choices @("Johor","Penang","Prai","Kuala Lumpur","Both Sites")

Add-ColumnIfMissing -ListName $jhrList -InternalName "EmployeeName" -DisplayName "Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "EmployeeNo" -DisplayName "Employee No" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Company" -DisplayName "Company" -Type "Choice"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Department" -DisplayName "Department" -Type "Choice"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Designation" -DisplayName "Designation" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "SubmittedDate" -DisplayName "Submitted Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Subject" -DisplayName "Subject" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "HOD" -DisplayName "HOD" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "HODApprovalDate" -DisplayName "HOD Approval Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "HODRemarks" -DisplayName "HOD Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "HRInCharge" -DisplayName "HR In Charge" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "HRApprovalDate" -DisplayName "HR Approval Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "HRRemarks" -DisplayName "HR Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "COOApprovalDate" -DisplayName "COO Approval Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "COORemarks" -DisplayName "COO Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "IsLocked" -DisplayName "Is Locked" -Type "Boolean"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Remarks" -DisplayName "Remarks" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "WorkflowStage" -DisplayName "Workflow Stage" -Type "Number"
Add-ColumnIfMissing -ListName $jhrList -InternalName "EnvironmentTag" -DisplayName "Environment Tag" -Type "Choice" `
    -Choices @("Production","UAT","Development")

# Johor-specific: LateComing prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "Late_EmployeeName" -DisplayName "Late Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Late_Date" -DisplayName "Late Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Late_TimeIn" -DisplayName "Late Time In" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Late_Reason" -DisplayName "Late Reason" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Late_HODApproval" -DisplayName "Late HOD Approval" -Type "Choice" `
    -Choices @("Pending","Approved","Rejected")

# Johor-specific: PCNTND prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_TrainingCode" -DisplayName "PCNTND Training Code" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_TrainingName" -DisplayName "PCNTND Training Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_TrainingDate" -DisplayName "PCNTND Training Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_Trainer" -DisplayName "PCNTND Trainer" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_TR" -DisplayName "PCNTND Training Record" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_TE" -DisplayName "PCNTND Training Evaluation" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNTND_TM" -DisplayName "PCNTND Training Master" -Type "Note"

# Johor-specific: ContractorReg prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "ContReg_Company" -DisplayName "ContReg Company" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "ContReg_ContractorName" -DisplayName "ContReg Contractor Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "ContReg_RegistrationNo" -DisplayName "ContReg Registration No" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "ContReg_ExpiryDate" -DisplayName "ContReg Expiry Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "ContReg_CTForm" -DisplayName "ContReg Form" -Type "Note"

# Johor-specific: PCNOrgChart prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNOrg_HODName" -DisplayName "PCNOrg HOD Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNOrg_HODDate" -DisplayName "PCNOrg HOD Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNOrg_HODRemarks" -DisplayName "PCNOrg HOD Remarks" -Type "Note"

# Johor-specific: hostel prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "Hostel_Block" -DisplayName "Hostel Block" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Hostel_Room" -DisplayName "Hostel Room" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Hostel_EmployeeName" -DisplayName "Hostel Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Hostel_CheckDate" -DisplayName "Hostel Check Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Hostel_Remarks" -DisplayName "Hostel Remarks" -Type "Note"

# Johor-specific: PCNDriver prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNDriver_Date" -DisplayName "PCNDriver Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNDriver_Destination" -DisplayName "PCNDriver Destination" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNDriver_Purpose" -DisplayName "PCNDriver Purpose" -Type "Note"

# Johor-specific: UniformReq prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "Uniform_Type" -DisplayName "Uniform Type" -Type "Choice" `
    -Choices @("Shirt","Pants","Skirt","Vest","Jacket","Safety Shoes","Others")
Add-ColumnIfMissing -ListName $jhrList -InternalName "Uniform_Size" -DisplayName "Uniform Size" -Type "Choice" `
    -Choices @("XS","S","M","L","XL","XXL","XXXL")
Add-ColumnIfMissing -ListName $jhrList -InternalName "Uniform_Quantity" -DisplayName "Uniform Quantity" -Type "Number"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Uniform_Remarks" -DisplayName "Uniform Remarks" -Type "Note"

# Johor-specific: TyphoidVacc prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "Typhoid_EmployeeName" -DisplayName "Typhoid Employee Name" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Typhoid_Date" -DisplayName "Typhoid Vaccination Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "Typhoid_ExpiryDate" -DisplayName "Typhoid Expiry Date" -Type "DateTime"

# Johor-specific: manpowerReq prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "MPReq_Position" -DisplayName "MPReq Position" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "MPReq_Department" -DisplayName "MPReq Department" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "MPReq_Justification" -DisplayName "MPReq Justification" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "MPReq_Status" -DisplayName "MPReq Status" -Type "Choice" `
    -Choices @("Draft","Pending HOD","Pending HR","Approved","Rejected")

# Johor-specific: workins (Worker Inspection) prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "WorkIns_Date" -DisplayName "WorkIns Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "WorkIns_Inspector" -DisplayName "WorkIns Inspector" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "WorkIns_Findings" -DisplayName "WorkIns Findings" -Type "Note"

# Johor-specific: SpVisit (Superintendent Visit) prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "SpVisit_Date" -DisplayName "SpVisit Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "SpVisit_Visitor" -DisplayName "SpVisit Visitor" -Type "Text"
Add-ColumnIfMissing -ListName $jhrList -InternalName "SpVisit_Purpose" -DisplayName "SpVisit Purpose" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "SpVisit_Remarks" -DisplayName "SpVisit Remarks" -Type "Note"

# Johor-specific: PCNBkStf prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "PCNBkStf_Form" -DisplayName "PCNBkStf Form" -Type "Note"

# Johor-specific: cancomp (Canteen Complaint) prefixed columns
Add-ColumnIfMissing -ListName $jhrList -InternalName "CanComp_Complaint" -DisplayName "CanComp Complaint" -Type "Note"
Add-ColumnIfMissing -ListName $jhrList -InternalName "CanComp_Date" -DisplayName "CanComp Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $jhrList -InternalName "CanComp_Status" -DisplayName "CanComp Status" -Type "Choice" `
    -Choices @("Open","In Progress","Resolved","Closed")

# ===========================================================================
# 3. Extension Lists — Add ParentFormCode + form-specific columns
# ===========================================================================

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_Staffing
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_Staffing" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extStaffing = "MainDB_HR_Ext_Staffing"
Add-ColumnIfMissing -ListName $extStaffing -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extStaffing -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("SR","manpowerReq","FTCR","CWR","INTERVIEWDB")
Add-ColumnIfMissing -ListName $extStaffing -InternalName "Staffing_Details" -DisplayName "Staffing Details" -Type "Note"
Add-ColumnIfMissing -ListName $extStaffing -InternalName "Staffing_Status" -DisplayName "Staffing Status" -Type "Choice" `
    -Choices @("Draft","Submitted","HOD Review","HR Review","COO Review","Approved","Rejected")

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_Lifecycle
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_Lifecycle" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extLifecycle = "MainDB_HR_Ext_Lifecycle"
Add-ColumnIfMissing -ListName $extLifecycle -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extLifecycle -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("EEN","EPDU","EPHR","INTERN","PAF")
Add-ColumnIfMissing -ListName $extLifecycle -InternalName "Lifecycle_AppraisalData" -DisplayName "Lifecycle Appraisal Data" -Type "Note"
Add-ColumnIfMissing -ListName $extLifecycle -InternalName "Lifecycle_ExitData" -DisplayName "Lifecycle Exit Data" -Type "Note"

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_Attendance
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_Attendance" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extAttendance = "MainDB_HR_Ext_Attendance"
Add-ColumnIfMissing -ListName $extAttendance -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extAttendance -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("AWHR","DRD","NDF","LateComing","NightVisit")
Add-ColumnIfMissing -ListName $extAttendance -InternalName "Attendance_Date" -DisplayName "Attendance Date" -Type "DateTime"
Add-ColumnIfMissing -ListName $extAttendance -InternalName "Attendance_Details" -DisplayName "Attendance Details" -Type "Note"

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_ForeignWorker
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_ForeignWorker" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extFW = "MainDB_HR_Ext_ForeignWorker"
Add-ColumnIfMissing -ListName $extFW -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extFW -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("FWWPD","FWWPE","OWP","TNPRA","TyphoidVacc","UniformReq")
Add-ColumnIfMissing -ListName $extFW -InternalName "FW_WorkerName" -DisplayName "FW Worker Name" -Type "Text"
Add-ColumnIfMissing -ListName $extFW -InternalName "FW_PassportNo" -DisplayName "FW Passport No" -Type "Text"
Add-ColumnIfMissing -ListName $extFW -InternalName "FW_WorkPermitNo" -DisplayName "FW Work Permit No" -Type "Text"
Add-ColumnIfMissing -ListName $extFW -InternalName "FW_Nationality" -DisplayName "FW Nationality" -Type "Text"

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_OrgStructure
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_OrgStructure" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extOrg = "MainDB_HR_Ext_OrgStructure"
Add-ColumnIfMissing -ListName $extOrg -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extOrg -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("ORGCHART","PCNOrgChart","JD","pcnjd")
Add-ColumnIfMissing -ListName $extOrg -InternalName "Org_ChartData" -DisplayName "Org Chart Data" -Type "Note"
Add-ColumnIfMissing -ListName $extOrg -InternalName "Org_JDData" -DisplayName "Org JD Data" -Type "Note"

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_Welfare
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_Welfare" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extWelfare = "MainDB_HR_Ext_Welfare"
Add-ColumnIfMissing -ListName $extWelfare -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extWelfare -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("BSD","PCNBkStf","CIR","cancomp","GDSN","HEALTHINFO")
Add-ColumnIfMissing -ListName $extWelfare -InternalName "Welfare_Details" -DisplayName "Welfare Details" -Type "Note"
Add-ColumnIfMissing -ListName $extWelfare -InternalName "Welfare_Amount" -DisplayName "Welfare Amount" -Type "Currency"

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_Compliance
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_Compliance" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extCompliance = "MainDB_HR_Ext_Compliance"
Add-ColumnIfMissing -ListName $extCompliance -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extCompliance -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("PCNTND","TMPU","ContractorReg")
Add-ColumnIfMissing -ListName $extCompliance -InternalName "Compliance_Details" -DisplayName "Compliance Details" -Type "Note"
Add-ColumnIfMissing -ListName $extCompliance -InternalName "Compliance_ExpiryDate" -DisplayName "Compliance Expiry Date" -Type "DateTime"

# ---------------------------------------------------------------------------
# MainDB_HR_Ext_Operations
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_HR_Ext_Operations" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

$extOps = "MainDB_HR_Ext_Operations"
Add-ColumnIfMissing -ListName $extOps -InternalName "ParentRecordID" -DisplayName "Parent Record ID" -Type "Text"
Add-ColumnIfMissing -ListName $extOps -InternalName "ParentFormCode" -DisplayName "Parent Form Code" -Type "Choice" `
    -Choices @("HRINFO","HRAPR","ESF","hostela","workins","SpVisit","PCNDriver")
Add-ColumnIfMissing -ListName $extOps -InternalName "Ops_Details" -DisplayName "Ops Details" -Type "Note"
Add-ColumnIfMissing -ListName $extOps -InternalName "Ops_Date" -DisplayName "Ops Date" -Type "DateTime"

# ===========================================================================
# Summary
# ===========================================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Column Addition Complete" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
if ($WhatIf) {
    Write-Host "  🔸 WHATIF mode — no changes were made." -ForegroundColor Yellow
}
Write-Host "`n  Next step: Run create-all-hr-views.ps1 to create FormCode views." -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
