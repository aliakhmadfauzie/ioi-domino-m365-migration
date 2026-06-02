<#
.SYNOPSIS
    Creates MainDB_IT_Ext_Policy list and adds IOI Policy (IOIP) columns.

.DESCRIPTION
    Idempotent — creates the list if missing, skips columns that already exist.
    Based on the Domino IOIOI POLICY database (PolicyEntryV1 form).

    Column naming: IOIP_* prefix for all IOIP-specific fields.
    Parent relationship: parentFormCode (Text) + parentRecord (Lookup) to MainDB_IT.

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.EXAMPLE
    .\Add-IOIP-Ext-Policy-Columns.ps1

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load config
# ---------------------------------------------------------------------------
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if (-not $SiteUrl) {
    $SiteUrl = if ($script:IOI_SHAREPOINT_IT_URL) { $script:IOI_SHAREPOINT_IT_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-it" }
}

$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
}
Write-Host "Connected.`n" -ForegroundColor Green

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text","Note","DateTime","Boolean","Choice","Number","Lookup")]
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

# ---------------------------------------------------------------------------
# Target list
# ---------------------------------------------------------------------------
$policyList = "MainDB_IT_Ext_Policy"
Write-Host "=== IOI Policy extended fields → $policyList ===" -ForegroundColor White

# Create list if it doesn't exist
$list = Get-PnPList -Identity $policyList -ErrorAction SilentlyContinue
if (-not $list) {
    if ($WhatIf) {
        Write-Host "  [whatif] Would create list: $policyList" -ForegroundColor Yellow
    } else {
        Write-Host "  [create] Creating list '$policyList' ..." -ForegroundColor Cyan
        New-PnPList -Title $policyList -Template GenericList | Out-Null
        Write-Host "  [created] $policyList" -ForegroundColor Green
    }
} else {
    Write-Host "  [exists] $policyList ($($list.ItemCount) items)" -ForegroundColor DarkGray
}

# ---------------------------------------------------------------------------
# Parent relationship fields
# ---------------------------------------------------------------------------
Add-ColumnIfMissing -ListName $policyList -InternalName "parentFormCode"     -DisplayName "Parent Form Code"     -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "parentRecordId"      -DisplayName "Parent Record ID"     -Type "Number"

# Note: parentRecord lookup field added via UI if needed; parentRecordId stores the integer ID.

# ---------------------------------------------------------------------------
# IOIP — Policy Header Fields
# ---------------------------------------------------------------------------
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_PolicyNo"          -DisplayName "IOIP Policy No"          -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Subject"           -DisplayName "IOIP Subject"            -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_ReviNum"           -DisplayName "IOIP Revision Number"    -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DateIssue"         -DisplayName "IOIP Effective Date"     -Type "DateTime"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Body"              -DisplayName "IOIP Body/Content"       -Type "Note"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DocTitle"          -DisplayName "IOIP Document Title"     -Type "Text"

# ---------------------------------------------------------------------------
# IOIP — Final Status & Archive
# ---------------------------------------------------------------------------
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_FinalStatus"       -DisplayName "IOIP Final Status"       -Type "Choice" -Choices @("0","1","4","6")
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DateArchived"      -DisplayName "IOIP Date Archived"      -Type "DateTime"

# ---------------------------------------------------------------------------
# IOIP — Approval Workflow (3 Approvers)
# Fields match Domino Approvalv2 subform
# ---------------------------------------------------------------------------

# Approver 1
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_App1_1"            -DisplayName "IOIP Approver 1"          -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Req1"              -DisplayName "IOIP Req 1 Flag"         -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Status1"           -DisplayName "IOIP Status 1"           -Type "Choice" -Choices @("","1")
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DateApproved1"     -DisplayName "IOIP Date Approved 1"    -Type "DateTime"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Comment1"          -DisplayName "IOIP Comment 1"          -Type "Note"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_A1replied"         -DisplayName "IOIP A1 Replied"         -Type "Text"

# Approver 2
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_App2_1"            -DisplayName "IOIP Approver 2"          -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Req2"              -DisplayName "IOIP Req 2 Flag"         -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Status2"           -DisplayName "IOIP Status 2"           -Type "Choice" -Choices @("","1")
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DateApproved2"     -DisplayName "IOIP Date Approved 2"    -Type "DateTime"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Comment2"          -DisplayName "IOIP Comment 2"          -Type "Note"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_A2replied"         -DisplayName "IOIP A2 Replied"         -Type "Text"

# Approver 3
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_App3_1"            -DisplayName "IOIP Approver 3"          -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Req3"              -DisplayName "IOIP Req 3 Flag"         -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Status3"           -DisplayName "IOIP Status 3"           -Type "Choice" -Choices @("","1")
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DateApproved3"     -DisplayName "IOIP Date Approved 3"    -Type "DateTime"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Comment3"          -DisplayName "IOIP Comment 3"          -Type "Note"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_A3replied"         -DisplayName "IOIP A3 Replied"         -Type "Text"

# ---------------------------------------------------------------------------
# IOIP — Distribution
# ---------------------------------------------------------------------------
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DefaultList"       -DisplayName "IOIP Default Dist List"   -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_DistributionList"  -DisplayName "IOIP Additional Dist List" -Type "Text"

# ---------------------------------------------------------------------------
# IOIP — Revision History (11 rows)
# Domino has R/R_1..R_10, D/D_1..D_10, U/U_1..U_10
# ---------------------------------------------------------------------------
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Rev_R"             -DisplayName "IOIP Rev Revision"        -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Rev_D"             -DisplayName "IOIP Rev Date"            -Type "DateTime"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Rev_U"             -DisplayName "IOIP Rev Updated By"      -Type "Text"

# Rows 1-10
for ($i = 1; $i -le 10; $i++) {
    Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Rev_R_$i"      -DisplayName "IOIP Rev R $i"           -Type "Text"
    Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Rev_D_$i"      -DisplayName "IOIP Rev D $i"           -Type "DateTime"
    Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Rev_U_$i"      -DisplayName "IOIP Rev U $i"           -Type "Text"
}

# ---------------------------------------------------------------------------
# IOIP — Editors & Tracking
# ---------------------------------------------------------------------------
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Editors"           -DisplayName "IOIP Editors"             -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Authors"           -DisplayName "IOIP Authors"             -Type "Text"
Add-ColumnIfMissing -ListName $policyList -InternalName "IOIP_Sendto"            -DisplayName "IOIP Send To"             -Type "Text"

Write-Host "`nDone! $policyList is ready." -ForegroundColor Green
