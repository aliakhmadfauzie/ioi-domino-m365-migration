[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$DefinitionPath = (Join-Path $PSScriptRoot 'hr-list-definitions.json'),
    [string]$SiteUrl,
    [string]$ExportListIdsPath,
    [switch]$DeviceLogin
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
    throw 'PnP.PowerShell is not installed. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser'
}

$definition = Get-Content -Raw -LiteralPath $DefinitionPath | ConvertFrom-Json
$targetSite = if ($SiteUrl) { $SiteUrl } else { $definition.siteUrl }

if (-not $targetSite) {
    throw 'Target SharePoint site URL is required.'
}

Import-Module PnP.PowerShell

if ($DeviceLogin) {
    Connect-PnPOnline -Url $targetSite -DeviceLogin -ClientId '21898567-7d8f-4634-846d-fd4cf7b185db'
} else {
    Connect-PnPOnline -Url $targetSite -Interactive -ClientId '21898567-7d8f-4634-846d-fd4cf7b185db'
}

function Add-HRField {
    param(
        [Parameter(Mandatory)] [string]$ListTitle,
        [Parameter(Mandatory)] $Column
    )

    $field = Get-PnPField -List $ListTitle -Identity $Column.name -ErrorAction SilentlyContinue
    if ($field) {
        Write-Host "  exists column $($Column.name)"
    } else {
        Write-Host "  add column $($Column.name) [$($Column.type)]"
        switch ($Column.type) {
            'Text' {
                Add-PnPField -List $ListTitle -DisplayName $Column.displayName -InternalName $Column.name -Type Text -AddToDefaultView | Out-Null
            }
            'Note' {
                Add-PnPField -List $ListTitle -DisplayName $Column.displayName -InternalName $Column.name -Type Note -AddToDefaultView | Out-Null
            }
            'DateTime' {
                Add-PnPField -List $ListTitle -DisplayName $Column.displayName -InternalName $Column.name -Type DateTime -AddToDefaultView | Out-Null
            }
            'Boolean' {
                Add-PnPField -List $ListTitle -DisplayName $Column.displayName -InternalName $Column.name -Type Boolean -AddToDefaultView | Out-Null
            }
            'Number' {
                Add-PnPField -List $ListTitle -DisplayName $Column.displayName -InternalName $Column.name -Type Number -AddToDefaultView | Out-Null
            }
            default {
                throw "Unsupported field type '$($Column.type)' for $ListTitle.$($Column.name)"
            }
        }
    }

    if ($Column.indexed -eq $true) {
        $indexedField = Get-PnPField -List $ListTitle -Identity $Column.name
        if (-not $indexedField.Indexed) {
            Write-Host "  index column $($Column.name)"
            Set-PnPField -List $ListTitle -Identity $Column.name -Values @{ Indexed = $true } | Out-Null
        }
    }
}

foreach ($list in $definition.lists) {
    if ($PSCmdlet.ShouldProcess($list.title, 'create/update SharePoint list')) {
        $existingList = Get-PnPList -Identity $list.title -ErrorAction SilentlyContinue
        if ($existingList) {
            Write-Host "exists list $($list.title)"
        } else {
            Write-Host "create list $($list.title)"
            New-PnPList -Title $list.title -Template GenericList | Out-Null
        }

        if ($list.description) {
            Set-PnPList -Identity $list.title -Description $list.description | Out-Null
        }

        foreach ($column in $list.columns) {
            Add-HRField -ListTitle $list.title -Column $column
        }
    }
}

if ($ExportListIdsPath) {
    $listIds = foreach ($list in $definition.lists) {
        $spList = Get-PnPList -Identity $list.title
        [pscustomobject]@{
            name = $list.title
            id = $spList.Id.Guid
            itemCount = $spList.ItemCount
        }
    }

    $listIds | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $ExportListIdsPath -Encoding UTF8
    Write-Host "Exported HR migration list IDs to $ExportListIdsPath"
}

Write-Host "HR migration list provisioning complete for $targetSite"
