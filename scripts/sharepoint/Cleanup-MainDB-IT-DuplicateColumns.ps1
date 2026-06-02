<#
.SYNOPSIS
    Clean up duplicate form-specific columns from MainDB_IT and fix date/choice field types.
.DESCRIPTION
    This script performs two cleanup operations on the IT SharePoint lists:
    1. Removes 180+ form-specific duplicate columns from MainDB_IT (keep only shared schema)
    2. Converts ~20 date/choice fields from Single line of text to proper SharePoint types

    IMPORTANT: Run with -WhatIf FIRST to preview changes. Remove -WhatIf to execute.
.PARAMETER SiteUrl
    SharePoint site URL. Defaults to IOI Portal IT site.
.PARAMETER WhatIf
    Preview changes without executing. Enabled by default.
.EXAMPLE
    .\Cleanup-MainDB-IT-DuplicateColumns.ps1 -WhatIf
    Preview which columns will be removed/converted.

    .\Cleanup-MainDB-IT-DuplicateColumns.ps1 -WhatIf:$false
    Execute the cleanup after reviewing preview.
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [switch]$WhatIf = $true
)

# =============================================================================
# CONFIGURATION
# =============================================================================

# Shared schema columns to KEEP on MainDB_IT (everything else is form-specific)
$sharedSchemaColumns = @(
    "Title",
    "FormCode",
    "CurrentStatus",
    "SubmittedDate",
    "SubmittedBy",
    "Requestor_Email",
    "Requestor_Name",
    "Site",
    "WorkflowStage",
    "Company",
    "IsLocked",
    "Remarks",
    "EnvironmentTag",
    "Subject"
)

# Form-specific column prefixes that should be REMOVED from MainDB_IT
$duplicatePrefixes = @(
    "EAF_",
    "ITSSR_",
    "ITDR_",
    "ITDR2_",
    "NIR_",
    "IAL",
    "ITP_",
    "ITP2_",
    "ITI_",
    "IOIP",
    "ITSC_",
    "UR_",
    "SFAR_",
    "SAPAMR",
    "SAPCA",
    "SAPCR",
    "SAPSOF",
    "SAPTR",
    "SAPSLCF",
    "SAPDRP",
    "PRF_",
    "RS_",
    "HI_",
    "VPNACCESS_",
    "HWINV_"
)

# Date fields that need to be converted from Text -> Date and Time
$dateFieldConversions = @(
    # MainDB_IT date fields
    @{ List="MainDB_IT"; Fields=@("EAF_DeptHeadDate","EAF_ITManagerDate","EAF_ITCompletedDate","EAF_DDAppDate","HI_PurchaseDate","HI_LastAuditedDate","ITSSR_DateAccepted","ITSSR_DateResolved","ITSSR_DateStarted","ITDR2_DueDate","ITDR2_ClosedDate") },
    # Extension lists
    @{ List="MainDB_IT_Ext_Access"; Fields=@("EAF_DeptHeadDate","EAF_ITManagerDate","EAF_ITCompletedDate","EAF_DDAppDate") },
    @{ List="MainDB_IT_Ext_Support"; Fields=@("ITSSR_DateAccepted","ITSSR_DateResolved","ITSSR_DateStarted") },
    @{ List="MainDB_IT_Ext_Assets"; Fields=@("HI_PurchaseDate","HI_LastAuditedDate") }
)

# Choice fields that need to be converted from Text -> Choice
$choiceFieldConversions = @(
    # MainDB_IT choice fields
    @{ List="MainDB_IT"; Fields=@("CurrentStatus","EAF_DeptHeadStatus","EAF_ITManagerStatus","EAF_ITCompletionStatus","EAF_DDAppStatus") },
    @{ List="MainDB_IT_Ext_Access"; Fields=@("EAF_DeptHeadStatus","EAF_ITManagerStatus","EAF_ITCompletionStatus","EAF_DDAppStatus") }
)

# =============================================================================
# MAIN
# =============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MainDB_IT Cleanup Script" -ForegroundColor Cyan
Write-Host "  Site: $SiteUrl" -ForegroundColor Cyan
if ($WhatIf) { Write-Host "  Mode: PREVIEW (WhatIf)" -ForegroundColor Yellow }
else { Write-Host "  Mode: EXECUTE" -ForegroundColor Red }
Write-Host "========================================" -ForegroundColor Cyan

# Connect to SharePoint
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-Host "`n✅ Connected to $SiteUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to connect: $_" -ForegroundColor Red
    exit 1
}

# =============================================================================
# STEP 1: Remove duplicate form-specific columns from MainDB_IT
# =============================================================================
Write-Host "`n=== STEP 1: Identify duplicate columns on MainDB_IT ===" -ForegroundColor Cyan

$allFields = Get-PnPField -List "MainDB_IT" | Where-Object {
    -not $_.Hidden -and
    -not $_.ReadOnlyField -and
    -not $_.Required -and
    $_.InternalName -notin @("ContentType", "_HasCopyDestinations", "_CopySource", "UniqueId", "SyncClientId", "FileRef", "FileDirRef", "LastModifiedBy", "Modified", "Created", "Author", "Editor", "ID", "owshiddenversion", "WorkflowVersion", "_UIVersion", "_UIVersionString", "Attachments", "_ModerationStatus", "_ModerationComments", "LinkTitleNoMenu", "LinkTitle", "DocIcon", "AppEditor", "AppAuthor", "PermMask", "FileType", "HTML_x0020_File_x0020_Type", "_SourceUrl", "_SharedFileIndex", "FolderChildCount", "ServerRedirectedEmbedUrl", "ContentTypeId", "ComplianceAssetId", "OData__ColorTag")
}

$duplicateColumns = @()
foreach ($field in $allFields) {
    $internalName = $field.InternalName
    $title = $field.Title
    foreach ($prefix in $duplicatePrefixes) {
        if ($internalName -like "$prefix*" -or $title -like "$prefix*") {
            $duplicateColumns += $field
            break
        }
    }
}

Write-Host "Found $($duplicateColumns.Count) potential duplicate columns on MainDB_IT:" -ForegroundColor Yellow
$duplicateColumns | Select-Object Title, InternalName, TypeDisplayName | Format-Table -AutoSize

if ($WhatIf) {
    Write-Host "`n⏸️  PREVIEW MODE: Would remove $($duplicateColumns.Count) columns" -ForegroundColor Yellow
    Write-Host "   Run with -WhatIf:`$false to execute" -ForegroundColor Yellow
} else {
    $confirm = Read-Host "`n⚠️  Remove $($duplicateColumns.Count) columns from MainDB_IT? (y/N)"
    if ($confirm -eq 'y') {
        foreach ($field in $duplicateColumns) {
            try {
                Remove-PnPField -List "MainDB_IT" -Identity $field.InternalName -Force
                Write-Host "  ✅ Removed: $($field.Title) ($($field.InternalName))" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Failed to remove $($field.Title): $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "  Skipped column removal." -ForegroundColor Yellow
    }
}

# =============================================================================
# STEP 2: Convert date fields from Text -> Date and Time
# =============================================================================
Write-Host "`n=== STEP 2: Convert date fields from Text -> Date and Time ===" -ForegroundColor Cyan

foreach ($listDef in $dateFieldConversions) {
    $listName = $listDef.List
    Write-Host "`nProcessing list: $listName" -ForegroundColor Cyan

    foreach ($fieldName in $listDef.Fields) {
        $field = Get-PnPField -List $listName -Identity $fieldName -ErrorAction SilentlyContinue
        if (-not $field) {
            Write-Host "  ⏭️  Field '$fieldName' not found in $listName" -ForegroundColor DarkGray
            continue
        }

        if ($field.TypeDisplayName -eq "Date and Time") {
            Write-Host "  ✅ $fieldName already Date and Time" -ForegroundColor Green
            continue
        }

        Write-Host "  ⏸️  Would convert: $fieldName ($($field.TypeDisplayName) -> Date and Time)" -ForegroundColor Yellow

        if (-not $WhatIf) {
            try {
                Set-PnPField -List $listName -Identity $fieldName -Values @{ FieldTypeKind = "DateTime"; DateTimeCalendarType = "Gregorian"; DisplayFormat = "DateAndTime" }
                Write-Host "  ✅ Converted: $fieldName" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Failed to convert $fieldName : $_" -ForegroundColor Red
            }
        }
    }
}

# =============================================================================
# STEP 3: Convert choice fields from Text -> Choice
# =============================================================================
Write-Host "`n=== STEP 3: Convert choice fields from Text -> Choice ===" -ForegroundColor Cyan

foreach ($listDef in $choiceFieldConversions) {
    $listName = $listDef.List
    Write-Host "`nProcessing list: $listName" -ForegroundColor Cyan

    foreach ($fieldName in $listDef.Fields) {
        $field = Get-PnPField -List $listName -Identity $fieldName -ErrorAction SilentlyContinue
        if (-not $field) {
            Write-Host "  ⏭️  Field '$fieldName' not found in $listName" -ForegroundColor DarkGray
            continue
        }

        if ($field.TypeDisplayName -eq "Choice") {
            Write-Host "  ✅ $fieldName already Choice" -ForegroundColor Green
            continue
        }

        Write-Host "  ⏸️  Would convert: $fieldName ($($field.TypeDisplayName) -> Choice)" -ForegroundColor Yellow

        if (-not $WhatIf) {
            try {
                Set-PnPField -List $listName -Identity $fieldName -Values @{ FieldTypeKind = "Choice"; FillInChoice = $false }
                Write-Host "  ✅ Converted: $fieldName" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Failed to convert $fieldName : $_" -ForegroundColor Red
            }
        }
    }
}

# =============================================================================
# SUMMARY
# =============================================================================
Write-Host "`n========================================" -ForegroundColor Cyan
if ($WhatIf) {
    Write-Host "  PREVIEW COMPLETE - No changes made" -ForegroundColor Yellow
    Write-Host "  Run with -WhatIf:`$false to execute" -ForegroundColor Yellow
} else {
    Write-Host "  CLEANUP COMPLETE" -ForegroundColor Green
}
Write-Host "========================================" -ForegroundColor Cyan
