<#
.SYNOPSIS
    Creates/updates SharePoint lists for LOG, MTN, PRD, and FIN departments using JSON config files.

.DESCRIPTION
    Reads column definitions from design/sharepoint-lists/*.json and provisions lists:
      - log-columns.json     → MainDB_LOG      (new list, ioi-portal-log)
      - mtn-columns.json     → MainDB_MTN      (new list, ioi-portal-mtn)
      - prd-gap-columns.json → MainDB_PRD      (gap columns, existing ioi-portal-prd)
      - fin-columns.json     → MainDB_FIN      (new list, ioi-portal-fin)

    Idempotent — skips columns that already exist.

.PARAMETER ConfigDir
    Directory containing JSON config files. Default: ..\config\sharepoint-lists

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    .\Provision-LOG-MTN-PRD-Lists.ps1
    .\Provision-LOG-MTN-PRD-Lists.ps1 -WhatIf
    .\Provision-LOG-MTN-PRD-Lists.ps1 -ConfigDir "..\config\sharepoint-lists"

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$ConfigDir = (Join-Path $PSScriptRoot "..\..\config\sharepoint-lists"),
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration (for PnP Client ID)
# ---------------------------------------------------------------------------
$envConfigPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $envConfigPath) { . $envConfigPath }
$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

# Ensure PnP module
$module = Get-Module -ListAvailable -Name PnP.PowerShell
if (-not $module) {
    Write-Error "PnP.PowerShell module not found. Install with: Install-Module PnP.PowerShell -Scope CurrentUser"
    return
}
Write-Host "Using PnP.PowerShell v$($module.Version)" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# Helper: Add column if it doesn't already exist
# ---------------------------------------------------------------------------
function Add-ColumnIfMissing {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
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
        } elseif ($Type -eq "Boolean") {
            Add-PnPField @params | Out-Null
        } else {
            Add-PnPField @params | Out-Null
        }
        Write-Host "  [added] $InternalName  ($Type) → $ListName" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $InternalName`: $_" -ForegroundColor Red
    }
}

# ---------------------------------------------------------------------------
# Helper: Provision a list from its JSON config
# ---------------------------------------------------------------------------
function Provision-ListFromConfig {
    param([string]$ConfigPath)

    if (-not (Test-Path $ConfigPath)) {
        Write-Host "  [skip] Config file not found: $ConfigPath" -ForegroundColor DarkGray
        return
    }

    $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json

    $listName  = $config.listUrl
    $listTitle = $config.listTitle
    $siteUrl   = $config.siteUrl
    $desc      = $config.description

    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host "PROVISIONING: $listTitle" -ForegroundColor White
    Write-Host "  Site: $siteUrl" -ForegroundColor Cyan
    Write-Host "  List: $listName" -ForegroundColor Cyan
    Write-Host "  Forms: $($config.formCodes -join ', ')" -ForegroundColor Cyan
    Write-Host "  Columns: $($config.columns.Count)" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan

    # Connect if not already connected to this site
    try {
        $ctx = Get-PnPConnection
        $currentUrl = $ctx.Url
        if ($currentUrl -ne $siteUrl) {
            Write-Host "`nConnecting to $siteUrl ..." -ForegroundColor Cyan
            if ($clientId) {
                Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -ErrorAction Stop
            } else {
                Connect-PnPOnline -Url $siteUrl -UseWebLogin -ErrorAction Stop
            }
            Write-Host "Connected successfully." -ForegroundColor Green
        } else {
            Write-Host "`nAlready connected to $siteUrl" -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "`nConnecting to $siteUrl ..." -ForegroundColor Cyan
        if ($clientId) {
            Connect-PnPOnline -Url $siteUrl -Interactive -ClientId $clientId -ErrorAction Stop
        } else {
            Connect-PnPOnline -Url $siteUrl -UseWebLogin -ErrorAction Stop
        }
        Write-Host "Connected successfully." -ForegroundColor Green
    }

    # Create list if it doesn't exist
    $list = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
    if (-not $list) {
        if ($WhatIf) {
            Write-Host "  [whatif] Would create list: $listTitle ($listName)" -ForegroundColor Yellow
        } else {
            New-PnPList -Title $listTitle -Template GenericList -Url $listName
            Write-Host "  [created] $listTitle ($listName)" -ForegroundColor Green
            $list = Get-PnPList -Identity $listName
        }
    } else {
        Write-Host "  [exists] $($list.Title) ($listName)" -ForegroundColor DarkGray
    }

    # Add description
    if (-not $WhatIf -and $list) {
        try {
            $list.Description = $desc
            $list.Update()
            Invoke-PnPQuery
        } catch {
            # Description update is non-critical
        }
    }

    # Add columns
    if ($list) {
        Write-Host "`n  Adding columns ..." -ForegroundColor White
        foreach ($col in $config.columns) {
            $colParams = @{
                ListName     = $listName
                InternalName = $col.internalName
                DisplayName  = $col.displayName
                Type         = $col.type
            }
            if ($col.PSObject.Properties.Name -contains "required" -and $col.required -eq $true) { $colParams.Required = $true }
            if ($col.PSObject.Properties.Name -contains "choices" -and $col.choices -and $col.choices.Count -gt 0) { $colParams.Choices = @($col.choices) }

            Add-ColumnIfMissing @colParams
        }
    }
}

# ===========================================================================
# Main
# ===========================================================================
Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  LOG / MTN / PRD / FIN — SharePoint List Provisioning  ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Cyan

if ($WhatIf) {
    Write-Host "`n⚠  WHAT-IF MODE — no changes will be made`n" -ForegroundColor Yellow
}

# Resolve config directory
$resolvedConfigDir = Resolve-Path $ConfigDir -ErrorAction SilentlyContinue
if (-not $resolvedConfigDir) {
    Write-Error "Config directory not found: $ConfigDir"
    return
}

# Provision each list
$configFiles = @(
    "log-columns.json",
    "mtn-columns.json",
    "prd-gap-columns.json",
    "fin-columns.json"
)

foreach ($file in $configFiles) {
    $configPath = Join-Path $resolvedConfigDir $file
    Provision-ListFromConfig -ConfigPath $configPath
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "PROVISIONING COMPLETE" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
