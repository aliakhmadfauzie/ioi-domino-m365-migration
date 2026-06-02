<#
.SYNOPSIS
    Adds PRF workflow tracking columns to the MainDB_IT_Ext_Access SharePoint list.
    Based on Domino PRF26.nsf fields for both Non-SAP and SAP tracks.
    Uses the existing shared child list (also used by EAF, NIR, RS, SFAR, UR).

.DESCRIPTION
    Idempotent — skips columns that already exist.
    Uses MainDB_IT_Ext_Access which already has parentFormCode, parentRecord lookup,
    and is shared across multiple modules.

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
Connect-PnPOnline -Url $SiteUrl -Interactive

# Column definitions: InternalName, DisplayName, Type, Choices (for Choice type)
$columns = @(
    # --- Status Fields ---
    @{ Name = "PRF_Status1";         Display = "PRF Status 1";          Type = "Choice";    Choices = @("Accepted", "Rejected") }
    @{ Name = "PRF_Status2";         Display = "PRF Status 2";          Type = "Choice";    Choices = @("Accepted", "Rejected", "KIV") }
    @{ Name = "PRF_Status3";         Display = "PRF Status 3";          Type = "Choice";    Choices = @("Completed", "Released for testing") }
    @{ Name = "PRF_Status4";         Display = "PRF Status 4";          Type = "Choice";    Choices = @("Accepted", "to be revised", "KIV") }
    @{ Name = "PRF_FinalStatus";     Display = "PRF Final Status";      Type = "Text" }
    @{ Name = "PRF_StatusISG";       Display = "PRF Status ISG";        Type = "Choice";    Choices = @("Completed", "Pending") }

    # --- Date Fields ---
    @{ Name = "PRF_DateApp1";        Display = "PRF Date App 1";        Type = "DateTime" }
    @{ Name = "PRF_DateApp2";        Display = "PRF Date App 2";        Type = "DateTime" }
    @{ Name = "PRF_DateApp2_1";      Display = "PRF Date App 2.1";      Type = "DateTime" }
    @{ Name = "PRF_DateApp3";        Display = "PRF Date App 3";        Type = "DateTime" }
    @{ Name = "PRF_DateApp4";        Display = "PRF Date App 4";        Type = "DateTime" }
    @{ Name = "PRF_DateSent";        Display = "PRF Date Sent";         Type = "DateTime" }
    @{ Name = "PRF_DateISG";         Display = "PRF Date ISG";          Type = "DateTime" }

    # --- Person/Name Fields ---
    @{ Name = "PRF_DeptHead";        Display = "PRF Dept Head";         Type = "Text" }
    @{ Name = "PRF_ISG";             Display = "PRF ISG";               Type = "Text" }
    @{ Name = "PRF_Ismgr2";          Display = "PRF IS Mgr 2";          Type = "Text" }
    @{ Name = "PRF_Ismgr";           Display = "PRF IS Mgr";            Type = "Text" }
    @{ Name = "PRF_AppByISG";        Display = "PRF App By ISG";        Type = "Text" }
    @{ Name = "PRF_AppBySAP";        Display = "PRF App By SAP";        Type = "Text" }
    @{ Name = "PRF_ByISStaff";       Display = "PRF By IS Staff";       Type = "Text" }
    @{ Name = "PRF_NotifiedBy";      Display = "PRF Notified By";       Type = "Text" }
    @{ Name = "PRF_ABAP";            Display = "PRF ABAP";              Type = "Text" }
    @{ Name = "PRF_FuncOwnerSAP";    Display = "PRF Func Owner SAP";    Type = "Text" }
    @{ Name = "PRF_AttachedBy";      Display = "PRF Attached By";       Type = "Text" }

    # --- Comment Fields ---
    @{ Name = "PRF_Comments1";       Display = "PRF Comments 1";        Type = "Note" }
    @{ Name = "PRF_Comment1";        Display = "PRF Comment 1";         Type = "Note" }
    @{ Name = "PRF_CommentsISG";     Display = "PRF Comments ISG";      Type = "Note" }
    @{ Name = "PRF_ITReason";        Display = "PRF IT Reason";         Type = "Note" }

    # --- Numeric Fields ---
    @{ Name = "PRF_Rating";          Display = "PRF Rating";            Type = "Number" }

    # --- Choice/Boolean Fields ---
    @{ Name = "PRF_RFC";             Display = "PRF Require SAP RFC";   Type = "Choice";    Choices = @("Yes", "No") }
)

$group = "PRF Workflow Columns"

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
                Required         = $false
                AddToDefaultView = $false
            }

            if ($type -eq "Choice") {
                Add-PnPField @params -Choices $col.Choices | Out-Null
            } elseif ($type -eq "DateTime") {
                Add-PnPField @params | Out-Null
            } elseif ($type -eq "Number") {
                Add-PnPField @params | Out-Null
            } else {
                Add-PnPField @params | Out-Null
            }
        } else {
            Write-Host "         (WhatIf — skipped)" -ForegroundColor DarkYellow
        }
    }
}

Write-Host "`nPRF workflow column provisioning complete." -ForegroundColor Cyan
