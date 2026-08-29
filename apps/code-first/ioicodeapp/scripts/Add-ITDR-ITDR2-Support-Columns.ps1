<#
.SYNOPSIS
    Adds ITDR and ITDR2 structured storage columns to MainDB_IT_Ext_Support.

.DESCRIPTION
    DEC-2026-007 requires form fields to be stored as SharePoint/model columns,
    not as structured JSON in MainDB_IT.Remarks. This script provisions the
    extra ITDR and ITDR2 extension columns used by the code-first app.

.PARAMETER SiteUrl
    Target IT SharePoint site URL.

.PARAMETER ClientId
    PnP app/client id. Falls back to apps/code-first/ioicodeapp/config/environment-config.ps1
    when IOI_PNP_CLIENT_ID is configured there.

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ClientId = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if ($script:IOI_SHAREPOINT_IT_URL) {
    $SiteUrl = $script:IOI_SHAREPOINT_IT_URL
}
if (-not $ClientId -and $script:IOI_PNP_CLIENT_ID) {
    $ClientId = $script:IOI_PNP_CLIENT_ID
}

$listName = "MainDB_IT_Ext_Support"
$script:ProvisioningErrors = @()

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if (-not $ClientId) {
    throw "No PnP client id configured. Set IOI_PNP_CLIENT_ID in apps/code-first/ioicodeapp/config/environment-config.ps1 or pass -ClientId."
}

try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
} catch {
    Write-Host "  Interactive auth failed; trying device login..." -ForegroundColor Yellow
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId $ClientId -ErrorAction Stop
}

function Add-FieldIfMissing {
    param(
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text", "Note", "DateTime", "Number")]
        [string]$Type
    )

    $existing = Get-PnPField -List $listName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [SKIP] $InternalName already exists" -ForegroundColor Yellow
        return
    }

    if ($WhatIf) {
        Write-Host "  [WHATIF] Would add $InternalName ($DisplayName) as $Type" -ForegroundColor Cyan
        return
    }

    try {
        Add-PnPField -List $listName -InternalName $InternalName -DisplayName $DisplayName -Type $Type -AddToDefaultView | Out-Null
        Write-Host "  [ADDED] $InternalName ($DisplayName)" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] $InternalName : $_" -ForegroundColor Red
        $script:ProvisioningErrors += "$listName :: $InternalName :: $_"
    }
}

$list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
if (-not $list) {
    throw "List '$listName' was not found on $SiteUrl. Create/export the support extension list before adding form columns."
}

Write-Host "`n--- ITDR missing structured columns ---" -ForegroundColor White
Add-FieldIfMissing -InternalName "ITDR_DisplayText" -DisplayName "ITDR Display Text" -Type Text
Add-FieldIfMissing -InternalName "ITDR_DocAuthor" -DisplayName "ITDR Document Author" -Type Text
Add-FieldIfMissing -InternalName "ITDR_AuditCreatedDate" -DisplayName "ITDR Audit Created Date" -Type DateTime
Add-FieldIfMissing -InternalName "ITDR_MeetingChairman" -DisplayName "ITDR Meeting Chairman" -Type Text
Add-FieldIfMissing -InternalName "ITDR_TimeFrom" -DisplayName "ITDR Time From" -Type Text
Add-FieldIfMissing -InternalName "ITDR_TimeTo" -DisplayName "ITDR Time To" -Type Text
Add-FieldIfMissing -InternalName "ITDR_Trainer" -DisplayName "ITDR Trainer" -Type Text
Add-FieldIfMissing -InternalName "ITDR_OTCategory" -DisplayName "ITDR OT Category" -Type Text
Add-FieldIfMissing -InternalName "ITDR_OTPurpose" -DisplayName "ITDR OT Purpose" -Type Note

Write-Host "`n--- ITDR2 missing structured columns ---" -ForegroundColor White
Add-FieldIfMissing -InternalName "ITDR2_Category" -DisplayName "ITDR2 Category" -Type Text
Add-FieldIfMissing -InternalName "ITDR2_Priority" -DisplayName "ITDR2 Priority" -Type Text
Add-FieldIfMissing -InternalName "ITDR2_Remarks" -DisplayName "ITDR2 Remarks" -Type Note

if ($script:ProvisioningErrors.Count -gt 0) {
    Write-Host "`nProvisioning completed with errors:" -ForegroundColor Red
    $script:ProvisioningErrors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    throw "ITDR/ITDR2 support-column provisioning failed for $($script:ProvisioningErrors.Count) field(s)."
}

if ($WhatIf) {
    Write-Host "`nWhatIf complete. No SharePoint columns were changed." -ForegroundColor Cyan
} else {
    Write-Host "`nDone. ITDR/ITDR2 structured columns are ready on $listName." -ForegroundColor Green
}
