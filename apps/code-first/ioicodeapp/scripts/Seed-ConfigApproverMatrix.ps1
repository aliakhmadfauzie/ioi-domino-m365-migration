param([string]$SiteUrl = "https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites",[string]$ClientId = "21898567-7d8f-4634-846d-fd4cf7b185db")

Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId

# Approval stage data extracted from src/lib/it-workflow-definitions.ts
$approvalMatrix = @(
    # ── EAF ──
    @{FC="EAF";SO=1;SN="Draft";AR="Requester"}
    @{FC="EAF";SO=2;SN="Pending HOD Approval";AR="HOD"}
    @{FC="EAF";SO=3;SN="Pending Division Head Approval";AR="DivisionDirector";CF="isPCN";CV="1"}
    @{FC="EAF";SO=4;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="EAF";SO=5;SN="Pending IT Processing";AR="ITPIC"}
    @{FC="EAF";SO=6;SN="Approved";AR="System"}
    # ── NIR ──
    @{FC="NIR";SO=1;SN="Draft";AR="Requester"}
    @{FC="NIR";SO=2;SN="Pending HOD Approval";AR="HOD"}
    @{FC="NIR";SO=3;SN="Pending Notes Admin";AR="NotesAdmin"}
    @{FC="NIR";SO=4;SN="Pending IT Hardware Setup";AR="ITHardware"}
    @{FC="NIR";SO=5;SN="Approved";AR="System"}
    # ── RS ──
    @{FC="RS";SO=1;SN="Draft";AR="Requester"}
    @{FC="RS";SO=2;SN="Pending IT Processing";AR="ITPIC"}
    @{FC="RS";SO=3;SN="Pending ED Confirmation";AR="ED";CF="rSRequestType";CV="BANK"}
    @{FC="RS";SO=4;SN="Closed";AR="System"}
    # ── SFAR ──
    @{FC="SFAR";SO=1;SN="Draft";AR="Requester"}
    @{FC="SFAR";SO=2;SN="Pending Folder Owner Review";AR="FolderOwner"}
    @{FC="SFAR";SO=3;SN="Pending IT Processing";AR="ITPIC"}
    @{FC="SFAR";SO=4;SN="Approved";AR="System"}
    # ── UR ──
    @{FC="UR";SO=1;SN="Draft";AR="Requester"}
    @{FC="UR";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="UR";SO=3;SN="Pending IT Processing";AR="ITPIC"}
    @{FC="UR";SO=4;SN="Approved";AR="System"}
    # ── ITSSR ──
    @{FC="ITSSR";SO=1;SN="Draft";AR="Requester"}
    @{FC="ITSSR";SO=2;SN="Pending IT Task Assignment";AR="ITManager"}
    @{FC="ITSSR";SO=3;SN="Pending IT PIC Action";AR="ITPIC"}
    @{FC="ITSSR";SO=4;SN="Pending Requestor Acceptance";AR="Requester"}
    @{FC="ITSSR";SO=5;SN="Closed";AR="System"}
    # ── PRF ──
    @{FC="PRF";SO=1;SN="Draft";AR="Requester"}
    @{FC="PRF";SO=2;SN="Pending HOD Approval";AR="HOD"}
    @{FC="PRF";SO=3;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="PRF";SO=4;SN="Pending IT Development";AR="ITPIC"}
    @{FC="PRF";SO=5;SN="Pending User Validation";AR="Requester"}
    @{FC="PRF";SO=6;SN="Verified";AR="System"}
    # ── IAL1 (Server Reboot Log) ──
    @{FC="IAL1";SO=1;SN="Draft";AR="ITStaff"}
    @{FC="IAL1";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="IAL1";SO=3;SN="Approved";AR="System"}
    # ── IAL2 (Data Center Access Log) ──
    @{FC="IAL2";SO=1;SN="Draft";AR="ITStaff"}
    @{FC="IAL2";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="IAL2";SO=3;SN="Approved";AR="System"}
    # ── IAL3 (IT Event) ──
    @{FC="IAL3";SO=1;SN="Draft";AR="ITStaff"}
    @{FC="IAL3";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="IAL3";SO=3;SN="Approved";AR="System"}
    # ── IAL4 (Server Records) ──
    @{FC="IAL4";SO=1;SN="Draft";AR="ITStaff"}
    @{FC="IAL4";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="IAL4";SO=3;SN="Approved";AR="System"}
    # ── IAL5 (Backup Log) ──
    @{FC="IAL5";SO=1;SN="Draft";AR="ITStaff"}
    @{FC="IAL5";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="IAL5";SO=3;SN="Approved";AR="System"}
    # ── ITDR ──
    @{FC="ITDR";SO=1;SN="Draft";AR="Requester"}
    @{FC="ITDR";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="ITDR";SO=3;SN="Approved";AR="System"}
    # ── ITDR2 ──
    @{FC="ITDR2";SO=1;SN="Draft";AR="Requester"}
    @{FC="ITDR2";SO=2;SN="Pending IT Manager Review";AR="ITManager"}
    @{FC="ITDR2";SO=3;SN="Approved";AR="System"}
    # ── SAPAMR ──
    @{FC="SAPAMR";SO=1;SN="Draft";AR="Requester"}
    @{FC="SAPAMR";SO=2;SN="Pending Verification";AR="ITStaff"}
    @{FC="SAPAMR";SO=3;SN="Pending BPO/HOD Approval";AR="HOD"}
    @{FC="SAPAMR";SO=4;SN="Closed";AR="System"}
    # ── SAPCR ──
    @{FC="SAPCR";SO=1;SN="Draft";AR="Requester"}
    @{FC="SAPCR";SO=2;SN="Pending BPO Approval";AR="BPO"}
    @{FC="SAPCR";SO=3;SN="Pending PM Approval";AR="ProjectManager"}
    @{FC="SAPCR";SO=4;SN="Pending Developer Investigation";AR="ABAPDeveloper"}
    @{FC="SAPCR";SO=5;SN="Pending PM Impact Analysis";AR="ProjectManager"}
    @{FC="SAPCR";SO=6;SN="Pending Project Director Approval";AR="DivisionDirector"}
    @{FC="SAPCR";SO=7;SN="Closed";AR="System"}
)

$list = Get-PnPList -Identity "Config_ApproverMatrix"
$count = 0
foreach ($a in $approvalMatrix) {
    $null = Add-PnPListItem -List $list -Values @{
        Title = "$($a.FC) - Stage $($a.SO): $($a.SN)"
        FormCode = $a.FC
        StageOrder = $a.SO
        StageName = $a.SN
        ApproverRole = $a.AR
        IsActive = "Yes"
        ConditionField = if ($a.CF) { $a.CF } else { $null }
        ConditionValue = if ($a.CV) { $a.CV } else { $null }
    } -ErrorAction SilentlyContinue | Out-Null
    $count++
}
Write-Host "Seeded $count approval matrix entries across $($approvalMatrix.Count) rows" -ForegroundColor Green

$forms = ($approvalMatrix | Select-Object -Unique FC).Count
Write-Host "Forms covered: $forms (EAF, NIR, RS, SFAR, UR, ITSSR, PRF, IAL1-5, ITDR, ITDR2, SAPAMR, SAPCR)" -ForegroundColor Cyan
