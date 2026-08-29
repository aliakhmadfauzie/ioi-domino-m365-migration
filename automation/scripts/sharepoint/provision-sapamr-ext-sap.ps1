# SAPAMR Ext_SAP Column Provisioning Script
# Site: https://ioioi.sharepoint.com/sites/ioi-portal-it
# List: MainDB_IT_Ext_SAP
# Purpose: Add SAPAMR routing fields to the Ext_SAP extension list (Option B)

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ClientId = ""
)

$ErrorActionPreference = "Stop"

$configPath = Join-Path $PSScriptRoot "..\..\ioicodeapp\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if ($script:IOI_SHAREPOINT_IT_URL) {
    $SiteUrl = $script:IOI_SHAREPOINT_IT_URL
}
if (-not $ClientId -and $script:IOI_PNP_CLIENT_ID) {
    $ClientId = $script:IOI_PNP_CLIENT_ID
}

Write-Host "SAPAMR Ext_SAP Column Provisioning" -ForegroundColor Cyan
Write-Host "Site: $SiteUrl" -ForegroundColor Gray

# Connect
Write-Host "`nConnecting..." -ForegroundColor Yellow
if (-not $ClientId) {
    throw "No PnP client id configured. Set IOI_PNP_CLIENT_ID in apps/code-first/ioicodeapp/config/environment-config.ps1 or pass -ClientId."
}
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -ErrorAction Stop
} catch {
    Write-Host "Interactive auth failed; trying device login..." -ForegroundColor Yellow
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId $ClientId -ErrorAction Stop
}
Write-Host "Connected." -ForegroundColor Green

$ListName = "MainDB_IT_Ext_SAP"

# Verify list exists
$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    Write-Host "ERROR: List $ListName not found on $SiteUrl" -ForegroundColor Red
    exit 1
}
Write-Host "Target list: $ListName" -ForegroundColor Green

# Helper: add field if not exists
function Add-SAPAMRField {
    param($DisplayName, $InternalName)
    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  SKIP: $InternalName already exists" -ForegroundColor Gray
        return
    }
    Add-PnPField -List $ListName -DisplayName $DisplayName -InternalName $InternalName -Type Text | Out-Null
    Write-Host "  CREATED: $InternalName ($DisplayName)" -ForegroundColor Green
}

Write-Host "`nProvisioning SAPAMR fields..." -ForegroundColor Yellow

# Primary routing fields
Add-SAPAMRField -DisplayName "SAPAMR_TBVEmail" -InternalName "SAPAMR_TBVEmail"
Add-SAPAMRField -DisplayName "SAPAMR_TBAEmail" -InternalName "SAPAMR_TBAEmail"

# FI module per-slot verifiers (TBV_1–TBV_5)
Add-SAPAMRField -DisplayName "SAPAMR_TBV1Email" -InternalName "SAPAMR_TBV1Email"
Add-SAPAMRField -DisplayName "SAPAMR_TBV2Email" -InternalName "SAPAMR_TBV2Email"
Add-SAPAMRField -DisplayName "SAPAMR_TBV3Email" -InternalName "SAPAMR_TBV3Email"
Add-SAPAMRField -DisplayName "SAPAMR_TBV4Email" -InternalName "SAPAMR_TBV4Email"
Add-SAPAMRField -DisplayName "SAPAMR_TBV5Email" -InternalName "SAPAMR_TBV5Email"

Write-Host "`nDone. $((Get-PnPField -List $ListName | Where-Object { $_.InternalName -like 'SAPAMR_*' }).Count) SAPAMR fields provisioned." -ForegroundColor Cyan
Write-Host "Next step: Run 'pac powerpages schema' or export from Power Platform to regenerate the schema JSON and model." -ForegroundColor Yellow
