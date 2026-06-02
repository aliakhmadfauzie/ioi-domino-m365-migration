<#
.SYNOPSIS
    Convert text-based date fields to proper Date and Time type in SharePoint lists.

.DESCRIPTION
    The audit found ~20+ date-related columns stored as Single line of text
    instead of Date and Time. SharePoint does not allow changing field types
    in-place, so this script:
    1. Creates a new DateTime column with "_dt" suffix
    2. Copies existing text data to the new DateTime column (PowerShell parse)
    3. Optionally removes the old text column

    RUN IN PREVIEW MODE FIRST:
        .\Fix-DateFieldTypes.ps1 -WhatIf

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.PARAMETER ExecuteMigration
    Actually create new columns and migrate data. Without this, runs in preview mode.

.EXAMPLE
    .\Fix-DateFieldTypes.ps1 -WhatIf
    .\Fix-DateFieldTypes.ps1 -ExecuteMigration

.NOTES
    WARNING: Data migration may fail for non-date text values. Preview first.
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ClientId = "",
    [switch]$WhatIf,
    [switch]$ExecuteMigration
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }
if (-not $ClientId -and $script:IOI_PNP_CLIENT_ID) { $ClientId = $script:IOI_PNP_CLIENT_ID }

function Write-Header($text) {
    Write-Host "`n=== $text ===" -ForegroundColor Cyan
}

function Test-Connection() {
    Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
    if ($ClientId) {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
    } else {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
    }
    Write-Host "Connected.`n" -ForegroundColor Green
}

# ===========================================================================
# DATE FIELDS TO FIX
# ===========================================================================
$dateFieldSets = @(
    # MainDB_IT - IT parent list (date fields remaining after duplicate cleanup)
    @{
        List = "MainDB_IT"
        Fields = @("SAP_ReviewedDate", "MediaBackupDate")
    },
    # MainDB_IT_Ext_Access
    @{
        List = "MainDB_IT_Ext_Access"
        Fields = @("EAF_DeptHeadDate", "EAF_ITManagerDate", "EAF_ITCompletedDate",
                   "EAF_DDAppDate", "NIR_HODApprovedDate", "NIR_AccDate",
                   "NIR_NotesAdminDate", "PRF_DateApp1", "PRF_DateApp2",
                   "PRF_DateApp2_1", "PRF_DateApp3", "PRF_DateApp4",
                   "PRF_DateISG", "PRF_DateSent", "RS_EDApprovedDate",
                   "RS_ITProcessedDate", "SFAR_ReviewedDate", "UR_ITAdminDate")
    },
    # MainDB_IT_Ext_Support
    @{
        List = "MainDB_IT_Ext_Support"
        Fields = @("ITSSR_DateStarted", "ITSSR_DateResolved", "ITSSR_DateAccepted",
                   "ITDR2_DueDate", "ITDR2_ClosedDate", "ITDR_DateFrom", "ITDR_DateTo")
    },
    # MainDB_IT_Ext_Assets
    @{
        List = "MainDB_IT_Ext_Assets"
        Fields = @("HI_PurchaseDate", "HI_LastAuditedDate", "ITSC_ReviewedDate")
    },
    # MainDB_IT_Ext_SAP
    @{
        List = "MainDB_IT_Ext_SAP"
        Fields = @("PRF_ITApprovedDate", "SAPSOF_ITSubmittedDate", "SAP_ReviewedDate")
    },
    # MainDB_HR
    @{
        List = "MainDB_HR"
        Fields = @("TargetDate", "DueDate", "ResponseDueDate",
                   "ResponseExtendedDueDate", "InspectionDate",
                   "QCApprovalDate", "ESF_DateSubmitted")
    }
)

# ===========================================================================
# MAIN
# ===========================================================================

Test-Connection

$totalFields = 0
$totalCreated = 0
$totalMigrated = 0
$totalSkipped = 0
$totalErrors = 0

foreach ($set in $dateFieldSets) {
    $listName = $set.List
    $fields = $set.Fields

    Write-Header "$listName ($($fields.Count) fields)"

    # Check if list exists
    $list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
    if (-not $list) {
        Write-Host "  [SKIP] List '$listName' not found." -ForegroundColor Yellow
        $totalSkipped += $fields.Count
        continue
    }

    foreach ($fieldName in $fields) {
        $totalFields++
        $existingField = Get-PnPField -List $listName -Identity $fieldName -ErrorAction SilentlyContinue

        if (-not $existingField) {
            Write-Host "  [SKIP] '$fieldName' not found on $listName." -ForegroundColor DarkGray
            $totalSkipped++
            continue
        }

        if ($existingField.TypeDisplayName -eq "Date and Time") {
            Write-Host "  [OK]   '$fieldName' is already DateTime." -ForegroundColor Green
            $totalSkipped++
            continue
        }

        $newFieldName = "${fieldName}_dt"
        $newFieldExists = Get-PnPField -List $listName -Identity $newFieldName -ErrorAction SilentlyContinue

        if ($WhatIf) {
            Write-Host "  [WHATIF] Would convert '$fieldName' ($($existingField.TypeDisplayName)) → add '$newFieldName' (DateTime) and migrate data" -ForegroundColor Yellow
            $totalCreated++
            continue
        }

        if (-not $ExecuteMigration) {
            Write-Host "  [PREVIEW] '$fieldName' ($($existingField.TypeDisplayName)) needs conversion to DateTime" -ForegroundColor Yellow
            $totalCreated++
            continue
        }

        # Step 1: Create new DateTime column
        if (-not $newFieldExists) {
            try {
                Add-PnPField -List $listName -InternalName $newFieldName -DisplayName "$fieldName (Date)" -Type DateTime -Group "Migration Columns" -ErrorAction Stop | Out-Null
                Write-Host "  [CREATED] '$newFieldName' (DateTime)" -ForegroundColor Green
                $totalCreated++
            } catch {
                Write-Host "  [ERROR] Creating '$newFieldName': $_" -ForegroundColor Red
                $totalErrors++
                continue
            }
        } else {
            Write-Host "  [SKIP] '$newFieldName' already exists." -ForegroundColor DarkGray
        }

        # Step 2: Migrate existing text data to new DateTime column
        try {
            $items = Get-PnPListItem -List $listName -PageSize 500 -ErrorAction SilentlyContinue |
                     Where-Object { $_[$fieldName] -ne $null -and $_[$fieldName] -ne "" }

            $migrated = 0
            foreach ($item in $items) {
                $textDate = $item[$fieldName]
                $parsedDate = $null

                # Try multiple date formats
                if ($textDate -match '^\d{4}-\d{2}-\d{2}') {
                    $parsedDate = [DateTime]::Parse($textDate, [System.Globalization.CultureInfo]::InvariantCulture)
                } elseif ($textDate -match '^\d{2}/\d{2}/\d{4}\s') {
                    # Try US format (MM/dd/yyyy HH:mm:ss) first, then UK format (dd/MM/yyyy)
                    try {
                        $parsedDate = [DateTime]::ParseExact($textDate, 'MM/dd/yyyy HH:mm:ss', $null)
                    } catch {
                        try {
                            $parsedDate = [DateTime]::ParseExact($textDate, 'dd/MM/yyyy HH:mm:ss', $null)
                        } catch {
                            $parsedDate = [DateTime]::ParseExact($textDate, 'dd/MM/yyyy', $null)
                        }
                    }
                } elseif ($textDate -match '^\d{2}/\d{2}/\d{4}') {
                    $parsedDate = [DateTime]::ParseExact($textDate, 'dd/MM/yyyy', $null)
                } elseif ($textDate -match '^\d{2}-\d{2}-\d{4}') {
                    $parsedDate = [DateTime]::ParseExact($textDate, 'dd-MM-yyyy', $null)
                } else {
                    Write-Host "  [WARN]  Could not parse date '$textDate' in item $($item.Id)" -ForegroundColor DarkYellow
                    continue
                }

                Set-PnPListItem -List $listName -Identity $item.Id -Values @{$newFieldName = $parsedDate} -ErrorAction SilentlyContinue | Out-Null
                $migrated++
            }

            if ($migrated -gt 0) {
                Write-Host "  [MIGRATED] $migrated items for '$fieldName' → '$newFieldName'" -ForegroundColor Green
                $totalMigrated += $migrated
            }
        } catch {
            Write-Host "  [ERROR] Migrating '$fieldName': $_" -ForegroundColor Red
            $totalErrors++
        }
    }
}

# ===========================================================================
# SUMMARY
# ===========================================================================
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Date Field Type Fix Summary" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Fields reviewed:    $totalFields"
Write-Host "  New columns created: $totalCreated"
Write-Host "  Items migrated:     $totalMigrated"
Write-Host "  Skipped (already OK or not found): $totalSkipped"
Write-Host "  Errors:             $totalErrors"

if ($WhatIf) {
    Write-Host "`n  🔸 WHATIF mode — no changes were made." -ForegroundColor Yellow
}

if (-not $ExecuteMigration) {
    Write-Host "`n  🔸 PREVIEW mode — run with -ExecuteMigration to apply changes." -ForegroundColor Yellow
}

Write-Host "============================================" -ForegroundColor Cyan

if ($ExecuteMigration) {
    Write-Host "`n  ⚠️  Old text columns still exist. Review and remove manually after verification:" -ForegroundColor Magenta
    Write-Host "     Remove-PnPField -List '<List>' -Identity '<OldFieldName>' -Force"
}
