<#
.SYNOPSIS
    Creates the MainDB_IT_JHR SharePoint list (Johor site) with the same schema as MainDB_IT (Prai).

.DESCRIPTION
    This script:
      1. Connects to the IOI Portal IT SharePoint site
      2. Creates the MainDB_IT_JHR list (if it doesn't exist)
      3. Adds core discriminator columns (FormCode, CurrentStatus, Site, EnvironmentTag)
      4. Enables versioning (50 versions)
      5. Calls Add-MainDB_IT-Columns.ps1 to add all remaining columns

.PARAMETER SiteUrl
    SharePoint site URL for the Johor IT portal.
    Default: https://ioioi.sharepoint.com/sites/ioi-portal-it

.PARAMETER ListName
    Internal name for the Johor list. Default: MainDB_IT_JHR

.PARAMETER ColumnsScriptPath
    Path to the column definition script. Default: assumes same directory as this script.

.PARAMETER WhatIf
    Preview changes without writing to SharePoint.

.EXAMPLE
    # Interactive login and create list
    .\Create-MainDB_IT_JHR.ps1

    # Preview only
    .\Create-MainDB_IT_JHR.ps1 -WhatIf

.REQUIREMENTS
    Install-Module PnP.PowerShell -Scope CurrentUser
#>

param(
    [string]$SiteUrl           = "",
    [string]$ListName          = "MainDB_IT_JHR",
    [string]$ColumnsScriptPath = "",
    [string]$ConfigPath        = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Load environment configuration
# ---------------------------------------------------------------------------
if (-not $ConfigPath) {
    $ConfigPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
}

if (Test-Path $ConfigPath) {
    . $ConfigPath
    Write-Host "Loaded configuration from $ConfigPath" -ForegroundColor Cyan
} else {
    Write-Host "Configuration file not found at $ConfigPath" -ForegroundColor Yellow
    Write-Host "Using defaults. Create one from: ..\config\environment-config.template.ps1" -ForegroundColor DarkGray
}

# Fall back to defaults or config values
if (-not $SiteUrl) {
    $SiteUrl = if ($script:IOI_SHAREPOINT_IT_URL) { $script:IOI_SHAREPOINT_IT_URL } else { "https://ioioi.sharepoint.com/sites/ioi-portal-it" }
}

# ---------------------------------------------------------------------------
# Module check
# ---------------------------------------------------------------------------
$module = Get-Module -ListAvailable -Name PnP.PowerShell
if (-not $module) {
    Write-Error "PnP.PowerShell module is not installed. Run: Install-Module PnP.PowerShell -Scope CurrentUser"
    return
}
Write-Host "Using PnP.PowerShell v$($module.Version)" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# Connection
# ---------------------------------------------------------------------------
$clientId = if ($script:IOI_PNP_CLIENT_ID) { $script:IOI_PNP_CLIENT_ID } else { $null }

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
if ($clientId) {
    Write-Host "Using App Registration Client ID: $clientId" -ForegroundColor DarkGray
    try {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
        Write-Host "Connected successfully." -ForegroundColor Green
    } catch {
        Write-Host "Interactive login failed. Trying device login..." -ForegroundColor Yellow
        Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId $clientId -ErrorAction Stop
    }
} else {
    Write-Host "No Client ID configured. Set IOI_PNP_CLIENT_ID in environment-config.ps1" -ForegroundColor Yellow
    Write-Host "Or register an app at https://entra.microsoft.com/ -> App registrations" -ForegroundColor DarkGray
    try {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
        Write-Host "Connected successfully." -ForegroundColor Green
    } catch {
        Write-Host "Interactive login failed. Trying device login..." -ForegroundColor Yellow
        Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ErrorAction Stop
    }
}

# ---------------------------------------------------------------------------
# Check / Create List
# ---------------------------------------------------------------------------
$existing = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue

if ($existing) {
    Write-Host "`nList '$ListName' already exists. Skipping creation." -ForegroundColor Yellow
} else {
    Write-Host "`nCreating list '$ListName' ..." -ForegroundColor Cyan
    if ($WhatIf) {
        Write-Host "  [whatif] Would create list: $ListName (Template: GenericList)" -ForegroundColor Yellow
    } else {
        try {
            New-PnPList -Title $ListName -Template GenericList -ErrorAction Stop | Out-Null
            Write-Host "  [created] $ListName" -ForegroundColor Green
        } catch {
            Write-Error "Failed to create list: $_"
            return
        }
    }
}

# ---------------------------------------------------------------------------
# Enable versioning (50 versions)
# ---------------------------------------------------------------------------
if (-not $WhatIf -and $existing) {
    Write-Host "`nSetting versioning (50 versions) ..." -ForegroundColor Cyan
    try {
        Set-PnPList -Identity $ListName -EnableVersioning $true -MajorVersions 50 -ErrorAction Stop
        Write-Host "  [ok] Versioning enabled: 50 major versions" -ForegroundColor Green
    } catch {
        Write-Host "  [warn] Could not set versioning: $_" -ForegroundColor Yellow
    }
}

# ---------------------------------------------------------------------------
# Add core discriminator columns
# ---------------------------------------------------------------------------
Write-Host "`nAdding core discriminator columns ..." -ForegroundColor Cyan

$coreColumns = @(
    @{ InternalName = "FormCode";     DisplayName = "FormCode";     Type = "Choice"; Choices = @("EAF","NIR","RS","SFAR","UR","ITSSR","PRF","HI","ITSC","SAPAMR","SAPCA","SAPCR","SAPSLCF","SAPSOF","SAPSOF2","SAPTR","SAPDRP","IOIP","ITI","ITP","ITP2","IAL1","IAL2","IAL3","IAL4","IAL5","ITDR","ITDR2","MPSPRN","ITINFO","TRNMAN","ISGDOC","SRR","DRR","SRL","DCAL","ITE","SRVR","EDL","ITDRP") }
    @{ InternalName = "CurrentStatus"; DisplayName = "CurrentStatus"; Type = "Choice"; Choices = @("Active","Approved","Closed","Draft","Rejected","Sent","Verified","Withdrawn","Returned","Pending","In Progress","Completed") }
    @{ InternalName = "Site";          DisplayName = "Site";          Type = "Choice"; Choices = @("Johor","Penang","Prai","Kuala Lumpur","Both Sites") }
    @{ InternalName = "EnvironmentTag";DisplayName = "EnvironmentTag";Type = "Choice"; Choices = @("Production","UAT","Development") }
    @{ InternalName = "Company";       DisplayName = "Company";      Type = "Text" }
    @{ InternalName = "Subject";       DisplayName = "Subject";     Type = "Text" }
    @{ InternalName = "Remarks";       DisplayName = "Remarks";     Type = "Note" }
    @{ InternalName = "IsLocked";      DisplayName = "IsLocked";    Type = "Boolean" }
    @{ InternalName = "WorkflowStage"; DisplayName = "WorkflowStage";Type = "Number" }
)

foreach ($col in $coreColumns) {
    $fieldExists = Get-PnPField -List $ListName -Identity $col.InternalName -ErrorAction SilentlyContinue
    if ($fieldExists) {
        Write-Host "  [skip] $($col.InternalName)  (already exists)" -ForegroundColor DarkGray
        continue
    }

    if ($WhatIf) {
        Write-Host "  [whatif] Would add: $($col.InternalName)  ($($col.Type))" -ForegroundColor Yellow
        continue
    }

    try {
        $params = @{
            List         = $ListName
            InternalName = $col.InternalName
            DisplayName  = $col.DisplayName
            Type         = $col.Type
        }
        if ($col.Type -eq "Choice" -and $col.Choices.Count -gt 0) {
            Add-PnPField @params -Choices $col.Choices | Out-Null
        } else {
            Add-PnPField @params | Out-Null
        }
        Write-Host "  [added] $($col.InternalName)  ($($col.Type))" -ForegroundColor Green
    } catch {
        Write-Host "  [error] $($col.InternalName)`: $_" -ForegroundColor Red
    }
}

# ---------------------------------------------------------------------------
# Set Title column as required
# ---------------------------------------------------------------------------
if (-not $WhatIf) {
    try {
        $titleField = Get-PnPField -List $ListName -Identity "Title" -ErrorAction SilentlyContinue
        if ($titleField -and -not $titleField.Required) {
            $titleField.Required = $true
            $titleField.Update()
            Execute-PnPQuery
            Write-Host "`n[ok] Title column set to required" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [warn] Could not set Title as required: $_" -ForegroundColor Yellow
    }
}

# ---------------------------------------------------------------------------
# Run Add-MainDB_IT-Columns.ps1 for remaining columns
# ---------------------------------------------------------------------------
if (-not $WhatIf) {
    # Resolve path to the column script
    if (-not $ColumnsScriptPath) {
        $ColumnsScriptPath = Join-Path -Path $PSScriptRoot -ChildPath "Add-MainDB_IT-Columns.ps1"
    }

    if (Test-Path $ColumnsScriptPath) {
        Write-Host "`nRunning Add-MainDB_IT-Columns.ps1 for remaining columns ..." -ForegroundColor Cyan
        & $ColumnsScriptPath -SiteUrl $SiteUrl -ListName $ListName
    } else {
        Write-Host "`n[skip] Add-MainDB_IT-Columns.ps1 not found at: $ColumnsScriptPath" -ForegroundColor Yellow
        Write-Host "Run it manually later:" -ForegroundColor DarkGray
        Write-Host "  .\Add-MainDB_IT-Columns.ps1 -ListName `"$ListName`"" -ForegroundColor DarkGray
    }
} else {
    Write-Host "`n[whatif] Would run: Add-MainDB_IT-Columns.ps1 -ListName `"$ListName`"" -ForegroundColor Yellow
}

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MainDB_IT_JHR setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "List name : $ListName" -ForegroundColor White
Write-Host "Site URL  : $SiteUrl" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. In Power Apps Studio, add '$ListName' as a data source" -ForegroundColor White
Write-Host "  2. Copy the generated GUID from Power Apps Studio" -ForegroundColor White
Write-Host "  3. Update power.config.json with the GUID" -ForegroundColor White
Write-Host "  4. Run column script if not done above:" -ForegroundColor White
Write-Host "     .\Add-MainDB_IT-Columns.ps1 -ListName `"$ListName`"" -ForegroundColor DarkGray
Write-Host "  5. Create views for each FormCode category:" -ForegroundColor White
Write-Host "     .\create-all-maindb-it-views.ps1 -ListName `"$ListName`"" -ForegroundColor DarkGray
Write-Host "`n"
