<#
.SYNOPSIS
    Create Config reference lists on the IOI-App_Admin_Sites SharePoint site.
.DESCRIPTION
    Creates Config_Companies, Config_Departments, and Config_ApproverMatrix lists
    that serve as lookup/reference data for the IOI Power Apps code-first app.
.NOTES
    Run after: MainDB_IT list exists
    Run before: Power Apps deployment to production
    Site: https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites"
)

$ErrorActionPreference = "Stop"

# ── Helper ────────────────────────────────────────────────────────────────────
function Ensure-List {
    param([string]$ListName, [string]$Description, [bool]$EnableVersioning = $true)
    $list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if (-not $list) {
        Write-Host "  [create] $ListName" -ForegroundColor Green
        $list = New-PnPList -Title $ListName -Template GenericList -Description $Description -OnQuickLaunch $true
        if ($EnableVersioning) {
            Set-PnPList -Identity $ListName -EnableVersioning $true -MajorVersions 50
        }
    } else {
        Write-Host "  [exists] $ListName" -ForegroundColor DarkGray
    }
    return $list
}

function Add-FieldIfMissing {
    param([string]$ListName, [string]$InternalName, [string]$DisplayName, [string]$Type = 'Text', $Choices = $null, [bool]$Required = $false)
    $field = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if (-not $field) {
        $params = @{
            List         = $ListName
            InternalName = $InternalName
            DisplayName  = $DisplayName
            Type         = $Type
            Required     = $Required
        }
        if ($Choices -and $Type -eq 'Choice') {
            $params.Choices = $Choices
        }
        Add-PnPField @params | Out-Null
        Write-Host "    [field] $DisplayName ($Type)" -ForegroundColor Green
    } else {
        Write-Host "    [skip]  $DisplayName" -ForegroundColor DarkGray
    }
}

# ── Connect ───────────────────────────────────────────────────────────────────
Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive
Write-Host "Connected!" -ForegroundColor Cyan

# ═══════════════════════════════════════════════════════════════════════════════
# 1. Config_Companies
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== Config_Companies ===" -ForegroundColor Cyan
Ensure-List -ListName "Config_Companies" -Description "IOI Group company master reference list"

$companyFields = @(
    @{ Name = "CompanyCode"; Display = "Company Code"; Type = "Text"; Required = $true },
    @{ Name = "CompanyName"; Display = "Company Name"; Type = "Text"; Required = $true },
    @{ Name = "IsActive"; Display = "Is Active"; Type = "Boolean" },
    @{ Name = "Site"; Display = "Site"; Type = "Choice"; Choices = @("Prai", "Johor", "Kuala Lumpur", "All Sites") },
    @{ Name = "IsPanCen"; Display = "PanCen Company"; Type = "Boolean" }
)
foreach ($f in $companyFields) {
    Add-FieldIfMissing -ListName "Config_Companies" -InternalName $f.Name -DisplayName $f.Display -Type $f.Type -Choices $f.Choices -Required ($f.Required -eq $true)
}

# ═══════════════════════════════════════════════════════════════════════════════
# 2. Config_Departments
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== Config_Departments ===" -ForegroundColor Cyan
Ensure-List -ListName "Config_Departments" -Description "IOI Group department master reference list"

$deptFields = @(
    @{ Name = "DepartmentCode"; Display = "Department Code"; Type = "Text"; Required = $true },
    @{ Name = "DepartmentName"; Display = "Department Name"; Type = "Text"; Required = $true },
    @{ Name = "IsActive"; Display = "Is Active"; Type = "Boolean" },
    @{ Name = "Module"; Display = "Module"; Type = "Choice"; Choices = @("M1", "M2", "M3", "M4", "M5", "M6", "M7", "HR", "QA", "QC", "Other") },
    @{ Name = "HODEmail"; Display = "HOD Email"; Type = "Text" }
)
foreach ($f in $deptFields) {
    Add-FieldIfMissing -ListName "Config_Departments" -InternalName $f.Name -DisplayName $f.Display -Type $f.Type -Choices $f.Choices -Required ($f.Required -eq $true)
}

# ═══════════════════════════════════════════════════════════════════════════════
# 3. Config_ApproverMatrix
# ═══════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== Config_ApproverMatrix ===" -ForegroundColor Cyan
Ensure-List -ListName "Config_ApproverMatrix" -Description "IOI Group approval routing matrix - maps form codes to approver roles"

$matrixFields = @(
    @{ Name = "FormCode"; Display = "Form Code"; Type = "Choice"; Required = $true; Choices = @("EAF","NIR","RS","SFAR","UR","ITSSR","PRF","HI","IAL1","IAL2","IAL3","IAL4","IAL5","SAPAMR","SAPCA","SAPCR","SAPSLCF","SAPSOF","SAPSOF2","SAPTR","SAPDRP","IOIP","ITI","ITP","ITP2","ITSC","DCALOG","SVRREC") },
    @{ Name = "StageOrder"; Display = "Stage Order"; Type = "Number"; Required = $true },
    @{ Name = "StageName"; Display = "Stage Name"; Type = "Text"; Required = $true },
    @{ Name = "ApproverRole"; Display = "Approver Role"; Type = "Choice"; Required = $true; Choices = @("Requester","HOD","DivisionDirector","COO","ITManager","ITPIC","ITAdmin","NotesAdmin","ITHardware","BPO","ProjectManager","ABAPDeveloper","FunctionalOwner","ISG","FolderOwner","ED","Finance","ITStaff","ITVerifier","ITSuperior","System") },
    @{ Name = "ConditionField"; Display = "Condition Field"; Type = "Text"; Description = "Field name for conditional routing (e.g., isPCN)" },
    @{ Name = "ConditionValue"; Display = "Condition Value"; Type = "Text"; Description = "Value that triggers this route" },
    @{ Name = "IsActive"; Display = "Is Active"; Type = "Boolean" }
)
foreach ($f in $matrixFields) {
    Add-FieldIfMissing -ListName "Config_ApproverMatrix" -InternalName $f.Name -DisplayName $f.Display -Type $f.Type -Choices $f.Choices -Required ($f.Required -eq $true)
}

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Config Reference Lists Created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  - Config_Companies ($((Get-PnPField -List 'Config_Companies' -ErrorAction SilentlyContinue | Measure-Object).Count) fields)"
Write-Host "  - Config_Departments ($((Get-PnPField -List 'Config_Departments' -ErrorAction SilentlyContinue | Measure-Object).Count) fields)"
Write-Host "  - Config_ApproverMatrix ($((Get-PnPField -List 'Config_ApproverMatrix' -ErrorAction SilentlyContinue | Measure-Object).Count) fields)"
Write-Host "`nNext steps:"
Write-Host "  1. Populate Config_Companies with the ~20 IOI companies"
Write-Host "  2. Populate Config_Departments with ~35 departments"
Write-Host "  3. Populate Config_ApproverMatrix with approval routing rules per form"
Write-Host "========================================" -ForegroundColor Cyan
