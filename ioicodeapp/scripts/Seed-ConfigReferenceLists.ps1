<#
.SYNOPSIS
    Seed Config_Companies and Config_Departments with known IOI values.
.DESCRIPTION
    Adds standard company and department records to the Config reference lists.
    Run after Create-ConfigReferenceLists.ps1.
.NOTES
    Site: https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites"
)

$ErrorActionPreference = "Stop"

# ── Connect ───────────────────────────────────────────────────────────────────
Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive
Write-Host "Connected!" -ForegroundColor Cyan

# ═══════════════════════════════════════════════════════════════════════════════
# Seed Config_Companies
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== Seeding Config_Companies ===" -ForegroundColor Cyan

$companies = @(
    @{ CompanyCode = "IOICORP";  CompanyName = "IOI Corporation Berhad";                              Site = "All Sites";   IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "IOIOLEO";  CompanyName = "IOI Oleochemical Industries Berhad";                  Site = "Prai";        IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "ACIDCHEM"; CompanyName = "IOI Acidchem Sdn Bhd";                               Site = "Prai";        IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "PCEO";     CompanyName = "IOI Pan-Century Oleochemicals Sdn Bhd";              Site = "Johor";       IsPanCen = $true;  IsActive = $true },
    @{ CompanyCode = "PCOC";     CompanyName = "IOI Pan-Century Edible Oils Sdn Bhd";                Site = "Johor";       IsPanCen = $true;  IsActive = $true },
    @{ CompanyCode = "LCAP";     CompanyName = "Loders Croklaan Asia Pacific Sdn Bhd";               Site = "Prai";        IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "BIOENERGY";CompanyName = "IOI Bio-Energy Sdn Bhd";                             Site = "Prai";        IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "BLC";      CompanyName = "Bunge Loders Croklaan";                              Site = "All Sites";   IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "IOIEO";    CompanyName = "IOI Edible Oils Sdn Bhd";                            Site = "Prai";        IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "PCS";      CompanyName = "Pan-Century Surfactants Sdn Bhd";                  Site = "Johor";       IsPanCen = $true;  IsActive = $true },
    @{ CompanyCode = "CONTRACTOR";CompanyName = "Contractor";                                       Site = "All Sites";   IsPanCen = $false; IsActive = $true },
    @{ CompanyCode = "VENDOR";   CompanyName = "Vendor/Third Party";                                 Site = "All Sites";   IsPanCen = $false; IsActive = $true }
)

$list = Get-PnPList -Identity "Config_Companies"
foreach ($c in $companies) {
    $exists = Get-PnPListItem -List $list -Query "<View><Query><Where><Eq><FieldRef Name='CompanyCode'/><Value Type='Text'>$($c.CompanyCode)</Value></Eq></Where></Query></View>"
    if (-not $exists) {
        Add-PnPListItem -List $list -Values @{
            Title       = $c.CompanyName
            CompanyCode = $c.CompanyCode
            CompanyName = $c.CompanyName
            Site        = $c.Site
            IsPanCen    = $c.IsPanCen ? "Yes" : "No"
            IsActive    = $c.IsActive ? "Yes" : "No"
        } | Out-Null
        Write-Host "  [added] $($c.CompanyCode) - $($c.CompanyName)" -ForegroundColor Green
    } else {
        Write-Host "  [skip]  $($c.CompanyCode)" -ForegroundColor DarkGray
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# Seed Config_Departments
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== Seeding Config_Departments ===" -ForegroundColor Cyan

$departments = @(
    @{ Code = "IT";          Name = "Information Technology";        Module = "M1" },
    @{ Code = "HR";          Name = "Human Resources";              Module = "HR" },
    @{ Code = "FIN";         Name = "Finance";                      Module = "M7" },
    @{ Code = "ACCT";        Name = "Accounts";                     Module = "M7" },
    @{ Code = "PROD";        Name = "Production";                   Module = "M3" },
    @{ Code = "QA";          Name = "Quality Assurance";            Module = "QA" },
    @{ Code = "QC";          Name = "Quality Control";              Module = "QC" },
    @{ Code = "WH";          Name = "Warehouse";                    Module = "M5" },
    @{ Code = "LOG";         Name = "Logistics";                    Module = "M5" },
    @{ Code = "ENG";         Name = "Engineering";                  Module = "M3" },
    @{ Code = "MNT";         Name = "Maintenance";                  Module = "M3" },
    @{ Code = "ADMIN";       Name = "Administration";               Module = "M7" },
    @{ Code = "MKTG";        Name = "Marketing";                    Module = "M7" },
    @{ Code = "SALES";       Name = "Sales";                        Module = "M7" },
    @{ Code = "PROC";        Name = "Procurement";                  Module = "M5" },
    @{ Code = "HSE";         Name = "Health, Safety & Environment"; Module = "M7" },
    @{ Code = "PLANT_OPS";   Name = "Plant Operations";             Module = "M3" },
    @{ Code = "RND";         Name = "Research & Development";       Module = "QA" },
    @{ Code = "MGMT";        Name = "Management";                   Module = "M7" },
    @{ Code = "SEC";         Name = "Security";                     Module = "M7" },
    @{ Code = "TRANS";       Name = "Transport";                    Module = "M5" },
    @{ Code = "PUR";         Name = "Purchasing";                   Module = "M5" },
    @{ Code = "STORE";       Name = "Store";                        Module = "M5" },
    @{ Code = "TRAINING";    Name = "Training";                     Module = "HR" }
)

$list = Get-PnPList -Identity "Config_Departments"
foreach ($d in $departments) {
    $exists = Get-PnPListItem -List $list -Query "<View><Query><Where><Eq><FieldRef Name='DepartmentCode'/><Value Type='Text'>$($d.Code)</Value></Eq></Where></Query></View>"
    if (-not $exists) {
        Add-PnPListItem -List $list -Values @{
            Title          = $d.Name
            DepartmentCode = $d.Code
            DepartmentName = $d.Name
            Module         = $d.Module
            IsActive       = "Yes"
        } | Out-Null
        Write-Host "  [added] $($d.Code) - $($d.Name)" -ForegroundColor Green
    } else {
        Write-Host "  [skip]  $($d.Code)" -ForegroundColor DarkGray
    }
}

Write-Host "`n=== Seeding Complete! ===" -ForegroundColor Green
