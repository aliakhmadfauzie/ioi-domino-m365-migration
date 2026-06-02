<#
.SYNOPSIS
    Fix PUR SharePoint column types: convert 41 Text→Choice and 10 Text→Number fields.

.DESCRIPTION
    Based on audit_pur_sharepoint.py results (2026-06-03).
    SharePoint cannot convert Text to Choice in-place. This script:
      1. Reads existing items for each affected list
      2. Drops the Text column
      3. Re-creates it as the correct type (Choice or Number)
      4. Restores data from backup JSON

    Run with -WhatIf first to preview changes.

.PARAMETER SiteUrl
    Target SharePoint site URL.

.PARAMETER BackupDir
    Directory to store per-list JSON backups before dropping columns.

.EXAMPLE
    .\Fix-PURColumnTypes.ps1 -WhatIf
    .\Fix-PURColumnTypes.ps1
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$SiteUrl   = "https://ioioi.sharepoint.com/sites/ioi-portal-pur",
    [string]$BackupDir = "./pur-column-fix-backups"
)

$ErrorActionPreference = "Stop"

# ── Load environment config ─────────────────────────────────────
$configPath = Join-Path $PSScriptRoot "..\..\ioicodeapp\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }
$tenantId = if (Get-Variable -Name IOI_TENANT_ID -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_TENANT_ID } else { "" }
$clientId = if (Get-Variable -Name IOI_PNP_CLIENT_ID -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_PNP_CLIENT_ID } else { "" }

# ── Import PnP ──────────────────────────────────────────────────
if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
    Write-Error "PnP.PowerShell not installed. Run: Install-Module PnP.PowerShell"
    exit 1
}
Import-Module PnP.PowerShell -DisableNameChecking

# ── Connect ─────────────────────────────────────────────────────
if (-not $WhatIfPreference) {
    Write-Host "Connecting to $SiteUrl..." -ForegroundColor Cyan
    try {
        if ($clientId -and $tenantId) {
            Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -Tenant $tenantId -ErrorAction Stop
        } elseif ($clientId) {
            Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
        } else {
            Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ErrorAction Stop
        }
        Write-Host "  ✓ Connected" -ForegroundColor Green
    } catch {
        Write-Error "  ✗ Connection failed: $_"
        exit 1
    }
} else {
    Write-Host "WhatIf mode - skipping SharePoint connection" -ForegroundColor Gray
}

# ── Create backup directory ─────────────────────────────────────
if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }

# ── Field definitions ───────────────────────────────────────────
# Each entry: ListName, InternalName, DisplayName, TargetType, Choices (for Choice fields)

$ChoiceFields = @(
    # ECMRECOMATE
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATEStatusApp2";     Disp="StatusApp2";         Choices=@("Pending","Approved","Rejected","Reviewed") }
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATEStatusApp";      Disp="StatusApp";          Choices=@("Pending","Approved","Rejected","Reviewed") }
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATEStatusAppB";     Disp="StatusAppB";         Choices=@("Pending","Approved","Rejected","Reviewed") }
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATECompletionStatus"; Disp="CompletionStatus";  Choices=@("Incomplete","Complete","N/A") }

    # KOSHHALACERT
    @{ List="MainDB_PUR_Ext_KOSHHALACERT";     Int="kOSHHALACERTCategory";      Disp="Category";           Choices=@("New","Renewal","Amendment") }
    @{ List="MainDB_PUR_Ext_KOSHHALACERT";     Int="kOSHHALACERTType";          Disp="Type";               Choices=@("Kosher","Halal") }

    # MASTOFAPPR
    @{ List="MainDB_PUR_Ext_MASTOFAPPR";       Int="mASTOFAPPRCategory";        Disp="Category";           Choices=@("New","Renewal","Update") }

    # MASTOFSERV
    @{ List="MainDB_PUR_Ext_MASTOFSERV_Rows";  Int="mASTOFSERVService";         Disp="Service";            Choices=@("Cleaning","Security","Maintenance","Transport","Catering","Other") }
    @{ List="MainDB_PUR_Ext_MASTOFSERV_Rows";  Int="mASTOFSERVReminderStatus";  Disp="ReminderStatus";     Choices=@("Pending","Sent","Acknowledged","Expired") }
    @{ List="MainDB_PUR_Ext_MASTOFSERV_Rows";  Int="mASTOFSERVRenStatus";       Disp="RenStatus";          Choices=@("Pending","Sent","Acknowledged","Expired") }

    # MATEEVALMER
    @{ List="MainDB_PUR_Ext_MATEEVALMER_Rows"; Int="mATEEVALMERStatusApp";      Disp="StatusApp";          Choices=@("Pending","Approved","Rejected","Reviewed") }
    @{ List="MainDB_PUR_Ext_MATEEVALMER_Rows"; Int="mATEEVALMERStatus1";        Disp="Status1";            Choices=@("Pending","Approved","Rejected") }
    @{ List="MainDB_PUR_Ext_MATEEVALMER_Rows"; Int="mATEEVALMERStatus2";        Disp="Status2";            Choices=@("Pending","Approved","Rejected") }
    @{ List="MainDB_PUR_Ext_MATEEVALMER_Rows"; Int="mATEEVALMERStatus3";        Disp="Status3";            Choices=@("Pending","Approved","Rejected") }
    @{ List="MainDB_PUR_Ext_MATEEVALMER_Rows"; Int="mATEEVALMERWDStatus";       Disp="WDStatus";           Choices=@("Pending","Approved","Rejected","Closed") }

    # NOTIOFCHAN
    @{ List="MainDB_PUR_Ext_NOTIOFCHAN_Rows";  Int="nOTIOFCHANVCARCat";         Disp="VCARCat";            Choices=@("Raw Material","Packaging","Finished Goods","Service") }
    @{ List="MainDB_PUR_Ext_NOTIOFCHAN_Rows";  Int="nOTIOFCHANtxtStatus1";      Disp="txtStatus1";         Choices=@("Open","Closed","Pending") }

    # RSPOVALICHEC
    @{ List="MainDB_PUR_Ext_RSPOVALICHEC";     Int="rSPOVALICHECStatus";        Disp="Status";             Choices=@("Valid","Expired","Pending","Not Certified") }

    # TEND
    @{ List="MainDB_PUR_Ext_TEND_Rows";        Int="tENDType";                  Disp="Type";               Choices=@("Open","Closed","Selective","Direct") }
    @{ List="MainDB_PUR_Ext_TEND_Rows";        Int="tENDCategory";              Disp="Category";           Choices=@("Goods","Services","Works","Consultancy") }
    @{ List="MainDB_PUR_Ext_TEND_Rows";        Int="tENDStatus";                Disp="Status";             Choices=@("Draft","Submitted","Under Review","Approved","Rejected","Closed") }
    @{ List="MainDB_PUR_Ext_TEND_Rows";        Int="tENDRenStatus";             Disp="RenStatus";          Choices=@("N/A","Pending","Approved","Rejected") }
    @{ List="MainDB_PUR_Ext_TEND_Rows";        Int="tENDSDStatus";              Disp="SDStatus";           Choices=@("N/A","Pending","Approved","Rejected") }

    # VCAR2025
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025VCARCat";           Disp="VCARCat";            Choices=@("Internal","External","Process","System") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025Type";              Disp="Type";               Choices=@("VCAR","CAR","PAR") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025VeriStatus";        Disp="VeriStatus";         Choices=@("Pending","Verified","Not Verified") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025QAStatus";          Disp="QAStatus";           Choices=@("Pending","Approved","Rejected","Closed") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025FINStatus";         Disp="FINStatus";          Choices=@("Pending","Approved","Rejected","Closed") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025Category";          Disp="Category";           Choices=@("Minor","Major","Critical") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025NewStatus";         Disp="NewStatus";          Choices=@("Open","In Progress","Closed") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025NewStatus_1";       Disp="NewStatus_1";        Choices=@("Open","In Progress","Closed") }
    @{ List="MainDB_PUR_Ext_VCAR2025_Rows";    Int="vCAR2025CAStatus";          Disp="CAStatus";           Choices=@("Pending","Approved","Rejected","Closed") }

    # VENDAUDIREPO
    @{ List="MainDB_PUR_Ext_VENDAUDIREPO_Rows"; Int="vENDAUDIREPOCategory";     Disp="Category";           Choices=@("Quality","Delivery","Service","Overall") }
    @{ List="MainDB_PUR_Ext_VENDAUDIREPO_Rows"; Int="vENDAUDIREPOProductCategory"; Disp="ProductCategory"; Choices=@("Raw Material","Packaging","Finished Goods","Service","Other") }

    # VENDCSRASSE
    @{ List="MainDB_PUR_Ext_VENDCSRASSE";       Int="vENDCSRASSEType";          Disp="Type";               Choices=@("Self-Assessment","Third Party","Audit") }
    @{ List="MainDB_PUR_Ext_VENDCSRASSE";       Int="vENDCSRASSECategory";      Disp="Category";           Choices=@("Environmental","Social","Governance","Safety") }

    # VENDQUALAPPR
    @{ List="MainDB_PUR_Ext_VENDQUALAPPR_Rows"; Int="vENDQUALAPPRCategory";     Disp="Category";           Choices=@("A","B","C","D") }
    @{ List="MainDB_PUR_Ext_VENDQUALAPPR_Rows"; Int="vENDQUALAPPRCategoryName"; Disp="CategoryName";       Choices=@("Excellent","Good","Satisfactory","Unsatisfactory") }

    # VENDREGIVRF
    @{ List="MainDB_PUR_Ext_VENDREGIVRF_Rows";  Int="vENDREGIVRFIssueCategory"; Disp="IssueCategory";      Choices=@("Documentation","Compliance","Quality","Delivery","Other") }
    @{ List="MainDB_PUR_Ext_VENDREGIVRF_Rows";  Int="vENDREGIVRFACC";           Disp="ACC";                Choices=@("Accepted","Rejected","Pending") }
    @{ List="MainDB_PUR_Ext_VENDREGIVRF_Rows";  Int="vENDREGIVRFVenNew";        Disp="VenNew";             Choices=@("New","Existing","Renewal") }
)

$NumberFields = @(
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATEQty";           Disp="Qty" }
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATESellingPrice";  Disp="SellingPrice" }
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATETotalPayment";  Disp="TotalPayment" }
    @{ List="MainDB_PUR_Ext_ECMRECOMATE_Rows"; Int="eCMRECOMATEQuantity";      Disp="Quantity" }

    @{ List="MainDB_PUR_Ext_NOTIOFCHAN_Rows";  Int="nOTIOFCHANTotalList";      Disp="TotalList" }
    @{ List="MainDB_PUR_Ext_NOTIOFCHAN_Rows";  Int="nOTIOFCHANGetTotal";       Disp="GetTotal" }
    @{ List="MainDB_PUR_Ext_NOTIOFCHAN_Rows";  Int="nOTIOFCHANGetApp";         Disp="GetApp" }

    @{ List="MainDB_PUR_Ext_VENDREGIVRF_Rows"; Int="vENDREGIVRFPhone";         Disp="Phone" }
    @{ List="MainDB_PUR_Ext_VENDREGIVRF_Rows"; Int="vENDREGIVRFFax";           Disp="Fax" }

    @{ List="MainDB_PUR_Ext_RSPOVALICHEC";     Int="rSPOVALICHECFNO";          Disp="FNO" }
)

# ── Helper: Backup list data ────────────────────────────────────
function Backup-ListData {
    param([string]$ListName, [string]$InternalName, [string]$BackupDir)
    $fileName = "${ListName}__${InternalName}.json"
    $path     = Join-Path $BackupDir $fileName
    if (Test-Path $path) { Write-Host "  Backup exists: $fileName"; return $path }
    Write-Host "  Backing up $InternalName from $ListName..." -ForegroundColor Yellow
    $items = Get-PnPListItem -List $ListName -PageSize 2000 -ErrorAction SilentlyContinue
    if (-not $items) { Write-Host "  No items found."; return $path }
    $data = foreach ($item in $items) {
        $val = $item.FieldValues[$InternalName]
        if ($null -ne $val -and $val -ne "") {
            @{ Id = $item.Id; Value = [string]$val }
        }
    }
    $data | ConvertTo-Json -Depth 5 | Set-Content -Path $path -Encoding UTF8
    Write-Host "  Saved $(@($data).Count) records to $fileName" -ForegroundColor Green
    return $path
}

# ── Helper: Restore data after re-creation ───────────────────────
function Restore-ListData {
    param([string]$ListName, [string]$InternalName, [string]$BackupPath)
    if (-not (Test-Path $BackupPath)) { Write-Host "  No backup to restore."; return }
    $data = Get-Content $BackupPath -Raw | ConvertFrom-Json
    if (-not $data) { Write-Host "  Empty backup."; return }
    Write-Host "  Restoring $(@($data).Count) records..." -ForegroundColor Yellow
    $restored = 0; $failed = 0
    foreach ($rec in $data) {
        try {
            $val = $rec.Value
            if ($rec.Value -match '^-?\d+(\.\d+)?$') { $val = [double]$rec.Value }
            Set-PnPListItem -List $ListName -Identity $rec.Id -Values @{ $InternalName = $val } -ErrorAction Stop | Out-Null
            $restored++
        } catch {
            $failed++
            Write-Host "    WARN: Item $($rec.Id) restore failed: $_" -ForegroundColor DarkYellow
        }
    }
    Write-Host "  Restored: $restored | Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Yellow" } else { "Green" })
}

# ── Process Choice fields ────────────────────────────────────────
Write-Host "`n╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  FIXING CHOICE FIELDS ($($ChoiceFields.Count) fields)                 ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

$choiceOk = 0; $choiceFail = 0
foreach ($f in $ChoiceFields) {
    $target = "$($f.List) :: $($f.Int) (Text→Choice)"
    Write-Host "`n$target" -ForegroundColor White
    if ($WhatIfPreference) {
        Write-Host "  WHAT-IF: backup data, drop column, recreate as Choice: $($f.Choices -join ', ')" -ForegroundColor DarkGray
        $choiceOk++
        continue
    }
    if (-not $PSCmdlet.ShouldProcess($target, "Convert to Choice")) { $choiceFail++; continue }
    try {
        $backupPath = Backup-ListData -ListName $f.List -InternalName $f.Int -BackupDir $BackupDir
        Remove-PnPField -Identity $f.Int -List $f.List -Force
        $choicesXml = ($f.Choices | ForEach-Object { "<CHOICE>$_</CHOICE>" }) -join "`n            "
        $fieldXml = @"
<Field Type="Choice" DisplayName="$($f.Disp)" Required="FALSE" Format="Dropdown">
    <CHOICES>
            $choicesXml
    </CHOICES>
</Field>
"@
        Add-PnPFieldFromXml -List $f.List -FieldXml $fieldXml
        Write-Host "  ✓ Recreated as Choice" -ForegroundColor Green
        Restore-ListData -ListName $f.List -InternalName $f.Int -BackupPath $backupPath
        $choiceOk++
    } catch {
        Write-Host "  ✗ FAILED: $_" -ForegroundColor Red
        $choiceFail++
    }
}

# ── Process Number fields ────────────────────────────────────────
Write-Host "`n╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  FIXING NUMBER FIELDS ($($NumberFields.Count) fields)                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

$numberOk = 0; $numberFail = 0
foreach ($f in $NumberFields) {
    $target = "$($f.List) :: $($f.Int) (Text→Number)"
    Write-Host "`n$target" -ForegroundColor White
    if ($WhatIfPreference) {
        Write-Host "  WHAT-IF: backup data, drop column, recreate as Number" -ForegroundColor DarkGray
        $numberOk++
        continue
    }
    if (-not $PSCmdlet.ShouldProcess($target, "Convert to Number")) { $numberFail++; continue }
    try {
        $backupPath = Backup-ListData -ListName $f.List -InternalName $f.Int -BackupDir $BackupDir
        Remove-PnPField -Identity $f.Int -List $f.List -Force
        Add-PnPField -DisplayName $f.Disp -InternalName $f.Int -Type Number -List $f.List
        Write-Host "  ✓ Recreated as Number" -ForegroundColor Green
        Restore-ListData -ListName $f.List -InternalName $f.Int -BackupPath $backupPath
        $numberOk++
    } catch {
        Write-Host "  ✗ FAILED: $_" -ForegroundColor Red
        $numberFail++
    }
}

# ── Summary ──────────────────────────────────────────────────────
Write-Host "`n╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  SUMMARY                                       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "  Choice fields:  $choiceOk OK / $choiceFail failed" -ForegroundColor $(if ($choiceFail -gt 0) { "Yellow" } else { "Green" })
Write-Host "  Number fields:  $numberOk OK / $numberFail failed" -ForegroundColor $(if ($numberFail -gt 0) { "Yellow" } else { "Green" })
Write-Host "  Total:          $($choiceOk + $numberOk) OK / $($choiceFail + $numberFail) failed" -ForegroundColor $(if (($choiceFail + $numberFail) -gt 0) { "Yellow" } else { "Green" })

Disconnect-PnPOnline
Write-Host "`nDone. Re-run audit_pur_sharepoint.py to verify." -ForegroundColor Cyan
