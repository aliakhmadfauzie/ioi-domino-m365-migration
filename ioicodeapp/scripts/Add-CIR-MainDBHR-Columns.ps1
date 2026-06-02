<#
.SYNOPSIS
    Adds the approved CIR parent-list columns to MainDB_HR.

.DESCRIPTION
    Idempotent provisioning script for CIR-SCHEMA-01.
    The approved path is to keep the planned lowercase cir* internal names
    from source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md.

    Superseded by HR-CAPACITY-01 Option B on 2026-06-01 after live
    MainDB_HR provisioning failed because the list column-size limit was
    exceeded. Use Add-CIR-Cafeteria-Lists.ps1 for the selected extension-list
    path unless a future capacity cleanup explicitly restores parent-list
    provisioning.

.PARAMETER SiteUrl
    Target SharePoint HR site URL.

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Add-CIR-MainDBHR-Columns.ps1
    .\Add-CIR-MainDBHR-Columns.ps1 -WhatIf
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-hr",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

if ($script:IOI_SHAREPOINT_HR_URL) {
    $SiteUrl = $script:IOI_SHAREPOINT_HR_URL
}

$mainList = if ($script:IOI_LIST_MAIN_HR) { $script:IOI_LIST_MAIN_HR } else { "MainDB_HR" }
$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
} else {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
}

function Add-CIRColumnIfMissing {
    param(
        [string]$InternalName,
        [string]$DisplayName,
        [ValidateSet("Text","Note","DateTime","Choice")]
        [string]$Type,
        [string[]]$Choices = @(),
        [switch]$Required
    )

    $existing = Get-PnPField -List $mainList -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [skip] $mainList :: $InternalName already exists" -ForegroundColor DarkGray
        return
    }

    if ($WhatIf) {
        Write-Host "  [whatif] Would add $mainList :: $InternalName ($Type)" -ForegroundColor Yellow
        return
    }

    $params = @{
        List = $mainList
        InternalName = $InternalName
        DisplayName = $DisplayName
        Type = $Type
    }
    if ($Required) { $params.Required = $true }

    if ($Type -eq "Choice") {
        Add-PnPField @params -Choices $Choices -AddToDefaultView | Out-Null
    } else {
        Add-PnPField @params -AddToDefaultView | Out-Null
    }

    Write-Host "  [added] $mainList :: $InternalName ($Type)" -ForegroundColor Green
}

function Add-CIRUserFieldIfMissing {
    param(
        [string]$InternalName,
        [string]$DisplayName,
        [switch]$Multi,
        [switch]$Required
    )

    $existing = Get-PnPField -List $mainList -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "  [skip] $mainList :: $InternalName already exists" -ForegroundColor DarkGray
        return
    }

    $type = if ($Multi) { "UserMulti" } else { "User" }
    $requiredText = if ($Required) { "TRUE" } else { "FALSE" }
    $multiText = if ($Multi) { "TRUE" } else { "FALSE" }
    $multiAttr = if ($Multi) { " Mult='$multiText'" } else { "" }
    $xml = "<Field Type='$type' DisplayName='$DisplayName' StaticName='$InternalName' Name='$InternalName' Required='$requiredText' UserSelectionMode='0'$multiAttr />"

    if ($WhatIf) {
        Write-Host "  [whatif] Would add $mainList :: $InternalName ($type)" -ForegroundColor Yellow
        return
    }

    Add-PnPFieldFromXml -List $mainList -FieldXml $xml | Out-Null
    Write-Host "  [added] $mainList :: $InternalName ($type)" -ForegroundColor Green
}

Write-Host "`nAdding CIR parent-list columns to $mainList ..." -ForegroundColor Cyan

Add-CIRColumnIfMissing -InternalName "cirSite" -DisplayName "CIR Site" -Type "Choice" -Choices @("Prai","Johor")
Add-CIRUserFieldIfMissing -InternalName "cirTeamMembers" -DisplayName "CIR Team Members" -Multi
Add-CIRUserFieldIfMissing -InternalName "cirInspector" -DisplayName "CIR Inspector"
Add-CIRColumnIfMissing -InternalName "cirInsDate" -DisplayName "CIR Inspection Date" -Type "DateTime"
Add-CIRColumnIfMissing -InternalName "cirInsTime" -DisplayName "CIR Inspection Time" -Type "Text"
Add-CIRUserFieldIfMissing -InternalName "cirSubmittedBy" -DisplayName "CIR Submitted By"
Add-CIRColumnIfMissing -InternalName "cirSubmittedDate" -DisplayName "CIR Submitted Date" -Type "DateTime"
Add-CIRUserFieldIfMissing -InternalName "cirReviewedBy" -DisplayName "CIR Reviewed By"
Add-CIRColumnIfMissing -InternalName "cirReviewedDate" -DisplayName "CIR Reviewed Date" -Type "DateTime"
Add-CIRColumnIfMissing -InternalName "cirRemarks" -DisplayName "CIR Remarks" -Type "Note"
Add-CIRColumnIfMissing -InternalName "cirCurrentAction" -DisplayName "CIR Current Action" -Type "Choice" -Choices @("Submitted","Accepted")
Add-CIRColumnIfMissing -InternalName "cirACMComm" -DisplayName "CIR ACM Committee Members" -Type "Text"
Add-CIRColumnIfMissing -InternalName "cirECMComm" -DisplayName "CIR ECM Committee Members" -Type "Text"
Add-CIRColumnIfMissing -InternalName "cirINO" -DisplayName "CIR Running Number" -Type "Text"

Write-Host "`nDone. Export MainDB_HR schema/model after this script completes against SharePoint." -ForegroundColor Green
