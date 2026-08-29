<#
.SYNOPSIS
    Creates or updates the HI hardware asset extension list.

.DESCRIPTION
    Idempotently provisions MainDB_IT_Ext_Assets on the IT SharePoint site with
    the SharePoint internal column names expected by the Power Apps connector.
    Existing fields are left in place; type mismatches are reported for review.

.EXAMPLE
    .\scripts\sharepoint\Provision-HI-ExtAssets.ps1 -WhatIf
    .\scripts\sharepoint\Provision-HI-ExtAssets.ps1
#>

param(
    [switch]$WhatIf,
    [switch]$SkipConnect,
    [string]$OutputDirectory = "analysis/sharepoint-provisioning"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$envConfigPath = Join-Path $repoRoot "ioicodeapp\config\environment-config.ps1"
if (Test-Path $envConfigPath) { . $envConfigPath }

$siteUrl = if (Get-Variable -Name IOI_SHAREPOINT_IT_URL -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_SHAREPOINT_IT_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-it" }
$tenantId = if (Get-Variable -Name IOI_TENANT_ID -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_TENANT_ID } else { "" }
$clientId = if (Get-Variable -Name IOI_PNP_CLIENT_ID -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_PNP_CLIENT_ID } else { "" }
$parentListName = if (Get-Variable -Name IOI_LIST_MAIN_IT_PRAI -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_LIST_MAIN_IT_PRAI } else { "MainDB_IT" }
$assetListName = if (Get-Variable -Name IOI_LIST_EXT_ASSETS -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_LIST_EXT_ASSETS } else { "MainDB_IT_Ext_Assets" }

function New-FieldSpec {
    param(
        [string]$InternalName,
        [string]$DisplayName,
        [string]$Type = "Text",
        [bool]$Required = $false,
        [string]$LookupList = "",
        [string]$LookupField = "Title"
    )

    [pscustomobject]@{
        InternalName = $InternalName
        DisplayName  = $DisplayName
        Type         = $Type
        Required     = $Required
        LookupList   = $LookupList
        LookupField  = $LookupField
    }
}

function Ensure-PnPModule {
    if ($WhatIf) { return }
    if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
        throw "PnP.PowerShell is not installed. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
    }
    Import-Module PnP.PowerShell -ErrorAction Stop
}

function Connect-TargetSite {
    if ($WhatIf -or $SkipConnect) { return }

    $current = $null
    try {
        $current = Get-PnPConnection -ErrorAction Stop
    } catch {
        $current = $null
    }
    if ($current -and $current.Url -eq $siteUrl) { return }

    Write-Host "Connecting to $siteUrl" -ForegroundColor Cyan
    if ($clientId -and $tenantId) {
        Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -Tenant $tenantId -ErrorAction Stop
    } elseif ($clientId) {
        Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -ErrorAction Stop
    } else {
        Connect-PnPOnline -Url $siteUrl -Interactive -ErrorAction Stop
    }
}

function Get-FieldKind {
    param($Field)
    if (-not $Field) { return "" }
    if ($Field.TypeAsString) { return [string]$Field.TypeAsString }
    return [string]$Field.TypeDisplayName
}

function New-FieldXml {
    param([object]$Spec, [string]$TargetListId = "")

    $fieldId = [guid]::NewGuid().ToString("B")
    $required = if ($Spec.Required) { "TRUE" } else { "FALSE" }
    $displayName = [System.Security.SecurityElement]::Escape($Spec.DisplayName)
    $type = $Spec.Type
    $extra = ""

    if ($type -eq "Lookup") {
        if (-not $TargetListId) { throw "Lookup field $($Spec.InternalName) needs a target list id." }
        return "<Field ID='$fieldId' Type='Lookup' DisplayName='$displayName' StaticName='$($Spec.InternalName)' Name='$($Spec.InternalName)' List='$TargetListId' ShowField='$($Spec.LookupField)' Required='$required' />"
    }
    if ($type -eq "DateTime") { $extra = " Format='DateOnly'" }
    if ($type -eq "Note") { $extra = " NumLines='6' RichText='FALSE'" }

    return "<Field ID='$fieldId' Type='$type' DisplayName='$displayName' StaticName='$($Spec.InternalName)' Name='$($Spec.InternalName)' Required='$required'$extra />"
}

function Ensure-List {
    if ($WhatIf) {
        return [pscustomobject]@{ Status = "WhatIf"; Id = ""; Title = $assetListName }
    }

    $list = Get-PnPList -Identity $assetListName -ErrorAction SilentlyContinue
    if (-not $list) {
        $list = New-PnPList -Title $assetListName -Template GenericList -Url $assetListName -OnQuickLaunch:$false -ErrorAction Stop
        $status = "Created"
    } else {
        $status = "Existing"
    }

    Set-PnPList -Identity $assetListName -EnableVersioning $true -MajorVersions 50 -ErrorAction SilentlyContinue | Out-Null
    return [pscustomobject]@{ Status = $status; Id = [string]$list.Id; Title = $assetListName }
}

function Ensure-Field {
    param([object]$Spec)

    if ($WhatIf) {
        return [pscustomobject]@{
            Field        = $Spec.InternalName
            DisplayName  = $Spec.DisplayName
            ExpectedType = $Spec.Type
            Status       = "WhatIf"
            ExistingType = ""
        }
    }

    $existing = Get-PnPField -List $assetListName -Identity $Spec.InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        return [pscustomobject]@{
            Field        = $Spec.InternalName
            DisplayName  = $Spec.DisplayName
            ExpectedType = $Spec.Type
            Status       = "Existing"
            ExistingType = Get-FieldKind $existing
        }
    }

    $targetListId = ""
    if ($Spec.Type -eq "Lookup") {
        $target = Get-PnPList -Identity $Spec.LookupList -ErrorAction SilentlyContinue
        if (-not $target) {
            return [pscustomobject]@{
                Field        = $Spec.InternalName
                DisplayName  = $Spec.DisplayName
                ExpectedType = $Spec.Type
                Status       = "MissingLookupTarget:$($Spec.LookupList)"
                ExistingType = ""
            }
        }
        $targetListId = [string]$target.Id
    }

    Add-PnPFieldFromXml -List $assetListName -FieldXml (New-FieldXml $Spec $targetListId) | Out-Null
    return [pscustomobject]@{
        Field        = $Spec.InternalName
        DisplayName  = $Spec.DisplayName
        ExpectedType = $Spec.Type
        Status       = "Created"
        ExistingType = ""
    }
}

$fields = @(
    New-FieldSpec "ParentID" "Parent Record" "Lookup" $true $parentListName "Title"
    New-FieldSpec "ParentFormCode" "Parent Form Code" "Text" $true
    New-FieldSpec "ParentSite" "Parent Site"

    New-FieldSpec "HI_MachineID" "HI Machine ID"
    New-FieldSpec "HI_TagNo" "HI Tag No"
    New-FieldSpec "HI_AssetNo" "HI Asset No"
    New-FieldSpec "HI_Type" "HI Type"
    New-FieldSpec "HI_ComputerName" "HI Computer Name"
    New-FieldSpec "HI_Company" "HI Company"
    New-FieldSpec "HI_UsedBy_Email" "HI Used By Email"
    New-FieldSpec "HI_Location" "HI Location"
    New-FieldSpec "HI_Department" "HI Department"
    New-FieldSpec "HI_Site" "HI Site"
    New-FieldSpec "HI_Building" "HI Building"
    New-FieldSpec "HI_Floor" "HI Floor"
    New-FieldSpec "HI_Room" "HI Room"
    New-FieldSpec "HI_SerialNo" "HI Serial No"
    New-FieldSpec "HI_Status" "HI Status"
    New-FieldSpec "HI_Condition" "HI Condition"
    New-FieldSpec "HI_Specifications" "HI Specifications" "Note"

    New-FieldSpec "HI_Model" "HI Model"
    New-FieldSpec "HI_CPU" "HI CPU"
    New-FieldSpec "HI_CPUModel" "HI CPU Model"
    New-FieldSpec "HI_CPUType" "HI CPU Type"
    New-FieldSpec "HI_CPUSerialNo" "HI CPU Serial No"
    New-FieldSpec "HI_RAM" "HI RAM"
    New-FieldSpec "HI_RAMSize" "HI RAM Size"
    New-FieldSpec "HI_RAMType" "HI RAM Type"
    New-FieldSpec "HI_HDDSize" "HI HDD Size"
    New-FieldSpec "HI_HDDType" "HI HDD Type"
    New-FieldSpec "HI_MonitorModel" "HI Monitor Model"
    New-FieldSpec "HI_MonitorSize" "HI Monitor Size"
    New-FieldSpec "HI_MonitorType" "HI Monitor Type"
    New-FieldSpec "HI_CDType" "HI CD Type"
    New-FieldSpec "HI_VLAN" "HI VLAN"
    New-FieldSpec "HI_SANStorage" "HI SAN Storage"
    New-FieldSpec "HI_IPAddress" "HI IP Address"
    New-FieldSpec "HI_MACAddress" "HI MAC Address"
    New-FieldSpec "HI_WinVersion" "HI Windows Version"
    New-FieldSpec "HI_OSVersion" "HI OS Version"
    New-FieldSpec "HI_WinServicePack" "HI Windows Service Pack"
    New-FieldSpec "HI_WinKey" "HI Windows Key"
    New-FieldSpec "HI_OfficeVersion" "HI Office Version"
    New-FieldSpec "HI_MSOfficeVer" "HI MS Office Version"
    New-FieldSpec "HI_MSOfficeKey" "HI MS Office Key"
    New-FieldSpec "HI_MSVersion" "HI MS Version"
    New-FieldSpec "HI_AntiVirusVersion" "HI Anti Virus Version"
    New-FieldSpec "HI_NotesVer" "HI Notes Version"
    New-FieldSpec "HI_NotesVersion" "HI Notes Version Legacy"
    New-FieldSpec "HI_MSEmail" "HI MS Email"

    New-FieldSpec "HI_Vendor" "HI Vendor"
    New-FieldSpec "HI_PONumber" "HI PO Number"
    New-FieldSpec "HI_PurchaseDate_dt" "HI Purchase Date" "DateTime"
    New-FieldSpec "HI_PurchasePrice" "HI Purchase Price" "Number"
    New-FieldSpec "HI_WarrantyExpiry_dt" "HI Warranty Expiry" "DateTime"
    New-FieldSpec "HI_LastAuditedDate_dt" "HI Last Audited Date" "DateTime"
    New-FieldSpec "HI_Year" "HI Year" "Number"
    New-FieldSpec "HI_Month" "HI Month" "Number"
    New-FieldSpec "HI_InvoiceNo" "HI Invoice No"
    New-FieldSpec "HI_DRP" "HI DRP"
    New-FieldSpec "HI_SentBy" "HI Sent By"
    New-FieldSpec "HI_ProbFindings" "HI Problem Findings" "Note"
    New-FieldSpec "HI_Actions" "HI Actions" "Note"
    New-FieldSpec "HI_PreviousUser" "HI Previous User"
    New-FieldSpec "HI_CarNo" "HI Car No"
    New-FieldSpec "HI_FARNo" "HI FAR No"
    New-FieldSpec "HI_ServerType" "HI Server Type"
    New-FieldSpec "HI_AccessType" "HI Access Type"
    New-FieldSpec "HI_KeyboardLanguage" "HI Keyboard Language"

    New-FieldSpec "ITSC_ChecklistYear" "ITSC Checklist Year"
    New-FieldSpec "ITSC_ReviewedBy" "ITSC Reviewed By"
    New-FieldSpec "ITSC_ReviewedDate_dt" "ITSC Reviewed Date" "DateTime"
    New-FieldSpec "ITSC_ServerName" "ITSC Server Name"
    New-FieldSpec "ITSC_VirusDefDate" "ITSC Virus Def Date"
    New-FieldSpec "ITSC_CPUUsage" "ITSC CPU Usage"
    New-FieldSpec "ITSC_MemoryUsed" "ITSC Memory Used"
    New-FieldSpec "ITSC_FullMemory" "ITSC Full Memory"
    New-FieldSpec "ITSC_DriveAvailable" "ITSC Drive Available"
    New-FieldSpec "ITSC_DriveSize" "ITSC Drive Size"
    New-FieldSpec "ITSC_DriveType" "ITSC Drive Type"
    New-FieldSpec "ITSC_DiskCleanup" "ITSC Disk Cleanup"
    New-FieldSpec "ITSC_WinUpdates" "ITSC Win Updates"
    New-FieldSpec "ITSC_Antivirus" "ITSC Antivirus"
    New-FieldSpec "ITSC_Physical" "ITSC Physical"
    New-FieldSpec "ITSC_Tenant" "ITSC Tenant"
    New-FieldSpec "ITSC_Volume1" "ITSC Volume 1"
    New-FieldSpec "ITSC_Volume2" "ITSC Volume 2"
    New-FieldSpec "ITSC_Volume3" "ITSC Volume 3"
    New-FieldSpec "ITSC_TimeStart" "ITSC Time Start"
    New-FieldSpec "ITSC_TimeEnd" "ITSC Time End"
    New-FieldSpec "ITSC_Remarks" "ITSC Remarks" "Note"
    New-FieldSpec "ITSC_Attachment" "ITSC Attachment"
)

Ensure-PnPModule
Connect-TargetSite

$listResult = Ensure-List
$fieldResults = @()
foreach ($field in $fields) {
    $fieldResults += Ensure-Field $field
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputRoot = Join-Path $repoRoot $OutputDirectory
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$csvPath = Join-Path $outputRoot "hi-ext-assets-provisioning-$timestamp.csv"
$jsonPath = Join-Path $outputRoot "hi-ext-assets-provisioning-$timestamp.json"

$summary = [pscustomobject]@{
    SiteUrl       = $siteUrl
    ListName      = $assetListName
    ParentList    = $parentListName
    ListStatus    = $listResult.Status
    FieldCount    = $fieldResults.Count
    CreatedFields = @($fieldResults | Where-Object { $_.Status -eq "Created" }).Count
    ExistingFields = @($fieldResults | Where-Object { $_.Status -eq "Existing" }).Count
    BlockedFields = @($fieldResults | Where-Object { $_.Status -like "MissingLookupTarget:*" }).Count
    Fields        = $fieldResults
}

$fieldResults | Export-Csv -NoTypeInformation -Path $csvPath
$summary | ConvertTo-Json -Depth 6 | Set-Content -Path $jsonPath -Encoding UTF8

Write-Host "HI Ext Assets provisioning complete" -ForegroundColor Green
Write-Host "  Site: $siteUrl"
Write-Host "  List: $assetListName ($($listResult.Status))"
Write-Host "  Fields: $($fieldResults.Count), created: $($summary.CreatedFields), existing: $($summary.ExistingFields), blocked: $($summary.BlockedFields)"
Write-Host "  Report: $csvPath"
