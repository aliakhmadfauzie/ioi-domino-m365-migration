<#
.SYNOPSIS
    Uploads all form schemas from src/form-schemas/*.json into the IT_SchemaStore SharePoint list.

.DESCRIPTION
    For each JSON file, reads the formCode from the JSON, then:
      - Creates a new IT_SchemaStore item if none exists for that formCode.
      - Updates the existing item if one already exists.
    Idempotent - safe to re-run; existing rows are updated, not duplicated.

.PARAMETER SiteUrl
    Default: https://ioioi.sharepoint.com/sites/MainDB_IT

.PARAMETER SchemasPath
    Path to the form-schemas folder.
    Default: <script-root>\..\powerapps-mirror\apps\ioi-platform\src\form-schemas

.PARAMETER WhatIf
    Preview without writing to SharePoint.

.REQUIREMENTS
    Install-Module SharePointPnPPowerShellOnline -Scope CurrentUser
#>

param(
    [string]$SiteUrl     = "https://ioioi.sharepoint.com/sites/MainDB_IT",
    [string]$SchemasPath = "",
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ListName = "IT_SchemaStore"

# Resolve schemas path relative to this script if not provided
if (-not $SchemasPath) {
    $SchemasPath = Join-Path $PSScriptRoot "..\powerapps-mirror\apps\ioi-platform\src\form-schemas"
}
$SchemasPath = (Resolve-Path $SchemasPath).Path

# ---------------------------------------------------------------------------
# Connect
# ---------------------------------------------------------------------------
Import-Module SharePointPnPPowerShellOnline -WarningAction Ignore -ErrorAction Stop

Write-Host "`nConnecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin

# Verify list exists
$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    Write-Error "List '$ListName' not found. Run Add-IT-SchemaStore.ps1 first."
    return
}

# ---------------------------------------------------------------------------
# Load existing items (Title = formCode) into a hashtable for fast lookup
# ---------------------------------------------------------------------------
Write-Host "Loading existing IT_SchemaStore items ..." -ForegroundColor Cyan
$existingItems = Get-PnPListItem -List $ListName -Fields "ID","Title","SchemaVersion" |
    ForEach-Object {
        $ver = if ($null -ne $_["SchemaVersion"]) { [int]$_["SchemaVersion"] } else { 0 }
        @{ Id = $_.Id; Title = [string]$_["Title"]; Version = $ver }
    }

$existingMap = @{}
foreach ($item in $existingItems) {
    $existingMap[$item.Title] = $item
}
Write-Host "  Found $($existingMap.Count) existing override(s).`n" -ForegroundColor DarkGray

# ---------------------------------------------------------------------------
# Process each JSON file
# ---------------------------------------------------------------------------
$files = Get-ChildItem -Path $SchemasPath -Filter "*.json" | Sort-Object Name
Write-Host "Found $($files.Count) schema files in: $SchemasPath`n" -ForegroundColor Cyan

$created = 0
$updated = 0
$skipped = 0
$errors  = 0

foreach ($file in $files) {
    try {
        $json = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $schema = $json | ConvertFrom-Json
        $formCode = $schema.formCode

        if (-not $formCode) {
            Write-Host "  [skip] $($file.Name) - no formCode found" -ForegroundColor DarkGray
            $skipped++
            continue
        }

        if ($WhatIf) {
            $action = if ($existingMap.ContainsKey($formCode)) { "update" } else { "create" }
            Write-Host "  [whatif] Would $action $formCode  ($($file.Name))" -ForegroundColor Yellow
            continue
        }

        if ($existingMap.ContainsKey($formCode)) {
            # Update existing
            $existing  = $existingMap[$formCode]
            $newVersion = $existing.Version + 1
            Set-PnPListItem -List $ListName -Identity $existing.Id -Values @{
                SchemaJson    = $json
                SchemaVersion = $newVersion
                IsActive      = $true
            } | Out-Null
            Write-Host "  [updated] $formCode  (v$newVersion)  $($file.Name)" -ForegroundColor Cyan
            $updated++
        } else {
            # Create new
            Add-PnPListItem -List $ListName -Values @{
                Title         = $formCode
                SchemaJson    = $json
                SchemaVersion = 1
                IsActive      = $true
            } | Out-Null
            Write-Host "  [created] $formCode  (v1)  $($file.Name)" -ForegroundColor Green
            $created++
        }
    } catch {
        Write-Host "  [error] $($file.Name): $_" -ForegroundColor Red
        $errors++
    }
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host "`n--- Summary ---" -ForegroundColor White
Write-Host "  Created : $created" -ForegroundColor Green
Write-Host "  Updated : $updated" -ForegroundColor Cyan
Write-Host "  Skipped : $skipped" -ForegroundColor DarkGray
if ($errors -gt 0) {
    Write-Host "  Errors  : $errors" -ForegroundColor Red
}
Write-Host "Done. All schemas are now in '$ListName' on $SiteUrl" -ForegroundColor Cyan
