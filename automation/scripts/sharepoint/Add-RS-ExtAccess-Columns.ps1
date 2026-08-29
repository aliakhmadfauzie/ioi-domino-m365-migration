<#
.SYNOPSIS
    Adds RS (Password Reset) workflow columns to the MainDB_IT_Ext_Access SharePoint list.
    Based on the maindb_it_ext_access.Schema.json and main-dbit-ext-access-service.ts mappings.

.DESCRIPTION
    Idempotent — skips columns that already exist.
    These columns were defined in the Power Apps code-first schema and service mappings
    but were never provisioned to the live SharePoint list, causing a 400 error
    when the Power Automate "IT - Universal Approval Flow" tries to write
    RS_TargetUser_Email to the Ext_Access child list.

.PARAMETER SiteUrl
    SharePoint site URL. Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Target list internal name. Default: MainDB_IT_Ext_Access

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl  = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
    [string]$ListName = "MainDB_IT_Ext_Access",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId "21898567-7d8f-4634-846d-fd4cf7b185db" -ErrorAction Stop

Write-Host "`n=== RS (Password Reset) Workflow Columns → $ListName ===" -ForegroundColor White

# Column definitions
$columns = @(
    # --- Identity Fields ---
    @{ Name = "RS_TargetUser_Email";  Display = "RS Target User Email";         Type = "Text" }
    @{ Name = "RS_RequestType";       Display = "RS Request Type";              Type = "Choice"; Choices = @("Active Directory", "SAP S4/HANA", "IEP", "Bank", "Other") }

    # --- Workflow Fields ---
    @{ Name = "RS_NeedsEDApproval";   Display = "RS Needs ED Approval";         Type = "Choice"; Choices = @("Yes", "No") }

    # --- IT Processed Fields ---
    @{ Name = "RS_ITProcessedBy";     Display = "RS IT Processed By";           Type = "Text" }
    @{ Name = "RS_ITProcessedDate_dt"; Display = "RS IT Processed Date";         Type = "DateTime" }

    # --- ED Approval Fields ---
    @{ Name = "RS_EDApprovedBy";      Display = "RS ED Approved By";            Type = "Text" }
    @{ Name = "RS_EDApprovedDate_dt";  Display = "RS ED Approved Date";          Type = "DateTime" }
)

$group = "RS Workflow Columns"

foreach ($col in $columns) {
    $internalName = $col.Name
    $displayName  = $col.Display
    $type         = $col.Type

    try {
        $existing = Get-PnPField -List $ListName -Identity $internalName -ErrorAction SilentlyContinue
    } catch { $existing = $null }

    if ($existing) {
        Write-Host "  [SKIP] $internalName — already exists." -ForegroundColor Yellow
    } else {
        Write-Host "  [ADD]  $internalName ($displayName — $type)" -ForegroundColor Green

        if (-not $WhatIf) {
            $params = @{
                List             = $ListName
                InternalName     = $internalName
                DisplayName      = $displayName
                Type             = $type
                Group            = $group
                AddToDefaultView = $false
                ErrorAction      = "Stop"
            }

            if ($type -eq "Choice" -and $col.Choices) {
                $params["Choices"] = $col.Choices
            }

            try {
                Add-PnPField @params
                Write-Host "    -> Done." -ForegroundColor Green
            }
            catch {
                Write-Host "    -> FAILED: $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`nDone! RS columns provisioned on $ListName.`n" -ForegroundColor Green
Write-Host "NOTE: If the Power Automate 'IT - Universal Approval Flow' still fails," -ForegroundColor Yellow
Write-Host "check that the flow's UpdateViaREST/child-list action references the correct" -ForegroundColor Yellow
Write-Host "list (MainDB_IT_Ext_Access) and not a different child list." -ForegroundColor Yellow
