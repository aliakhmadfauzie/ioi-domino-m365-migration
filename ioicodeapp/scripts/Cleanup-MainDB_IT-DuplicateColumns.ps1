<#
.SYNOPSIS
    Identify and remove duplicate form-specific columns from MainDB_IT.

.DESCRIPTION
    The audit revealed that MainDB_IT (parent table) has ~50+ columns that
    duplicate columns in extension lists (MainDB_IT_Ext_Access, Ext_Support,
    Ext_Assets, Ext_SAP). This script identifies those duplicates.

    The app uses a parent-child pattern where form-specific data is stored
    in extension lists. The duplicate columns on MainDB_IT are unused by
    the app and should be removed.

    RUN IN PREVIEW MODE FIRST:
        .\Cleanup-MainDB_IT-DuplicateColumns.ps1 -WhatIf

    THEN REVIEW before removing:
        .\Cleanup-MainDB_IT-DuplicateColumns.ps1

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER WhatIf
    Preview columns that would be removed without actually removing them.

.EXAMPLE
    .\Cleanup-MainDB_IT-DuplicateColumns.ps1 -WhatIf
    .\Cleanup-MainDB_IT-DuplicateColumns.ps1

.NOTES
    WARNING: Removing columns will delete any data in those columns.
    Verify that no existing records depend on parent-side duplicate columns
    before running this script.
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ClientId = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }
if (-not $ClientId -and $script:IOI_PNP_CLIENT_ID) { $ClientId = $script:IOI_PNP_CLIENT_ID }

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
if ($ClientId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
}
Write-Host "Connected.`n" -ForegroundColor Green

# ---------------------------------------------------------------------------
# Shared schema columns to KEEP on MainDB_IT
# ---------------------------------------------------------------------------
$sharedSchema = @(
    "Title", "FormCode", "CurrentStatus", "SubmittedDate", "Requestor_Email",
    "Requestor_Name", "Site", "WorkflowStage", "Company", "IsLocked", "Remarks",
    "Subject", "Status", "CurrentApprover_Email", "CurrentAction", "FinalStatus",
    "EmployeeNumber", "EmployeeType", "Designation", "PhoneExtension",
    "Department", "SubmittedBy", "Submitted_Email", "LastModifiedBy",
    "EnvironmentTag", "RecordType", "ServerRoom", "ServiceMode", "RebootRequired",
    "RebootType", "EventType", "Comments", "ApprovedBy", "ApprovedDate",
    "Attachments", "ContentType", "ID", "Created", "Modified", "Author", "Editor",
    "Workflow Audit JSON"
)

# ---------------------------------------------------------------------------
# Form-specific column prefixes that DUPLICATE extension list columns
# ---------------------------------------------------------------------------
$duplicatePrefixes = @("EAF_", "NIR_", "HI_", "ITSSR_", "ITDR_", "ITDR2_",
                       "IAL1_", "IAL2_", "IAL3_", "IAL4_", "IAL5_",
                       "ITP_", "ITP2_", "ITI_", "IOIP_", "ITSC_",
                       "UR_", "SFAR_", "PRF_", "RS_", "SAPAMR_", "SAPSOF_")

# ---------------------------------------------------------------------------
# Identify duplicate columns
# ---------------------------------------------------------------------------
$allFields = Get-PnPField -List "MainDB_IT" -ErrorAction SilentlyContinue |
    Where-Object { -not $_.Hidden -and -not $_.ReadOnlyField -and $_.InternalName -ne 'ContentType' }

$duplicates = @()
$keepCount = 0
$hiddenCount = 0

foreach ($field in $allFields) {
    $internalName = $field.InternalName
    $title = $field.Title

    # Check if this field matches a form-specific prefix
    $isDuplicate = $false
    foreach ($prefix in $duplicatePrefixes) {
        if ($internalName -like "$prefix*" -or $title -like "$prefix*") {
            $isDuplicate = $true
            break
        }
    }

    if ($isDuplicate) {
        $duplicates += $field
    } else {
        $keepCount++
    }
}

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MainDB_IT Column Cleanup Report" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Total columns:      $($allFields.Count)"
Write-Host "  Shared schema:      $keepCount (will keep)"
Write-Host "  Duplicate (prefix): $($duplicates.Count) (candidates for removal)"
Write-Host ""

if ($duplicates.Count -eq 0) {
    Write-Host "  ✅ No duplicate columns found." -ForegroundColor Green
    exit
}

Write-Host "  Duplicate columns to remove:" -ForegroundColor Yellow
$duplicates | Sort-Object Title | Select-Object Title, InternalName, TypeDisplayName |
    Format-Table -AutoSize | Out-String | ForEach-Object { Write-Host $_ }

# ---------------------------------------------------------------------------
# Remove (unless WhatIf)
# ---------------------------------------------------------------------------
if ($WhatIf) {
    Write-Host "  🔸 WHATIF mode — no columns were removed." -ForegroundColor Yellow
    Write-Host "  Run without -WhatIf to proceed with removal."
    exit
}

Write-Host "`n  ⚠️  WARNING: Removing columns will DELETE DATA in those columns." -ForegroundColor Red
Write-Host "  Press Ctrl+C to cancel, or Enter to continue..." -ForegroundColor Yellow
Read-Host

$removed = 0
$errors = 0

foreach ($field in $duplicates) {
    try {
        Remove-PnPField -List "MainDB_IT" -Identity $field.InternalName -Force -ErrorAction Stop
        Write-Host "  [REMOVED] $($field.Title) ($($field.InternalName))" -ForegroundColor Red
        $removed++
    } catch {
        Write-Host "  [ERROR] Failed to remove $($field.Title): $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Removed: $removed | Errors: $errors"
Write-Host "============================================" -ForegroundColor Cyan
