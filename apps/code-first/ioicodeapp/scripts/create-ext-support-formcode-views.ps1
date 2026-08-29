<#
.SYNOPSIS
    Create SharePoint views in MainDB_IT_Ext_Support list filtered by FormCode.
.DESCRIPTION
    Creates one view per IT form code in the Ext_Support list, filtering by ParentFormCode.
    Run this script directly in PowerShell - it will open a browser for authentication.
.PARAMETER SiteUrl
    SharePoint site URL for the IT portal.
.EXAMPLE
    .\scripts\create-ext-support-formcode-views.ps1
.NOTES
    Requires PnP.PowerShell module: Install-Module PnP.PowerShell -Scope CurrentUser -Force
#>

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it"
)

$listName = "MainDB_IT_Ext_Support"
$fieldName = "ParentFormCode"

# All 33 IT form codes
$formCodes = @(
    "EAF", "EDL", "HI", "HI_JHR", "HWRR",
    "IAL1", "IAL2", "IAL3", "IAL4", "IAL5",
    "IOIP", "ITDR", "ITDR2", "ITI", "ITP", "ITP2",
    "ITSC", "ITSSR",
    "NIR",
    "PRF",
    "RS",
    "SAPAMR", "SAPCA", "SAPCR", "SAPDRP", "SAPSLCF", "SAPSOF", "SAPSOF2", "SAPTR",
    "SFAR", "SRVR",
    "UR",
    "VPN"
)

Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
try {
    Connect-PnPOnline -Url $SiteUrl -Interactive
    Write-Host "Connected!" -ForegroundColor Green
} catch {
    Write-Host "Failed to connect: $_" -ForegroundColor Red
    Write-Host "`nTry installing PnP.PowerShell first:" -ForegroundColor Yellow
    Write-Host "  Install-Module PnP.PowerShell -Scope CurrentUser -Force" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nCreating views in '$listName' filtered by '$fieldName'..." -ForegroundColor Cyan

$createdCount = 0
$skippedCount = 0
$errorCount = 0

foreach ($code in $formCodes) {
    $viewTitle = "By $code"
    $viewName  = "By_$code"

    try {
        # Check if view already exists
        $existingView = Get-PnPView -List $listName -Identity $viewName -ErrorAction SilentlyContinue

        if ($existingView) {
            Write-Host "  [SKIP] View '$viewTitle' already exists." -ForegroundColor Yellow
            $skippedCount++
            continue
        }

        # Create the view
        Add-PnPView -List $listName `
            -Title $viewTitle `
            -Fields @("Title", "ParentFormCode", "ParentSite", "ID", "Created", "Modified") `
            -Query "<Where><Eq><FieldRef Name='$fieldName'/><Value Type='Text'>$code</Value></Eq></Where>" `
            -SetAsDefault:$false `
            -Personal:$false `
            -Paged:$true

        Write-Host "  [OK]   Created view '$viewTitle'." -ForegroundColor Green
        $createdCount++
    } catch {
        Write-Host "  [ERR]  Failed to create view '$viewTitle': $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "  Created: $createdCount" -ForegroundColor Green
Write-Host "  Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "  Errors:  $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-Host "`nDone! Open the list to see the new views:" -ForegroundColor Cyan
Write-Host "  $SiteUrl/Lists/$listName/AllItems.aspx" -ForegroundColor White
