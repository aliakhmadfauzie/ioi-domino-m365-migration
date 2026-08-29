param(
    [switch]$DryRun,
    [switch]$SkipConnect,
    [string]$OutputDirectory = "analysis/sharepoint-provisioning"
)

$ErrorActionPreference = "Stop"

function New-ColumnSpec {
    param(
        [string]$Name,
        [string]$Type = "Text",
        [string[]]$Choices = @(),
        [string]$LookupList = "",
        [string]$LookupField = "Title",
        [bool]$Required = $false
    )

    [pscustomobject]@{
        Name        = $Name
        Type        = $Type
        Choices     = $Choices
        LookupList  = $LookupList
        LookupField = $LookupField
        Required    = $Required
    }
}

function New-ListSpec {
    param(
        [string]$SiteUrl,
        [string]$ListName,
        [string]$DataSourceKey,
        [string]$Category,
        [string]$Description,
        [int]$VersionLimit,
        [object[]]$Columns,
        [string[]]$ViewFormCodes = @()
    )

    [pscustomobject]@{
        SiteUrl       = $SiteUrl
        ListName      = $ListName
        DataSourceKey = $DataSourceKey
        Category      = $Category
        Description   = $Description
        VersionLimit  = $VersionLimit
        Columns       = $Columns
        ViewFormCodes = $ViewFormCodes
    }
}

function ConvertTo-DataSourceKey {
    param([string]$ListName)

    $explicit = @{
        "ApprovalHistory_HR"                = "approvalhistory_hr"
        "ApprovalHistory_QA"                = "approvalhistory_qa"
        "ApprovalHistory_SHE"               = "approvalhistory_she"
        "ApprovalHistory_STR"               = "approvalhistory_str"
        "ApprovalRecords"                   = "approvalrecords"
        "AppSettings"                       = "appsettings"
        "Assignments_STR"                   = "assignments_str"
        "AttachmentIndex_HR"                = "attachmentindex_hr"
        "AttachmentIndex_STR"               = "attachmentindex_str"
        "AuditLog_HR"                       = "auditlog_hr"
        "AuditLogs"                         = "auditlogs"
        "ConfigApproverMatrix"              = "config_approvermatrix"
        "ConfigCompanies"                   = "config_companies"
        "ConfigDepartments"                 = "config_departments"
        "ConfigEmployeeDirectory"           = "config_employeedirectory"
        "ConfigGlobalUserRoleAssignments"   = "config_globaluserroleassignments"
        "ConfigNotesAdminRouting"           = "config_notesadminrouting"
        "HR_AppraisalRecords"               = "hr_appraisalrecords"
        "HR_HealthRegister"                 = "hr_healthregister"
        "HR_InterviewPipeline"              = "hr_interviewpipeline"
        "HR_RoutingMatrix"                  = "hr_routingmatrix"
        "IT_M1_RS_Banks"                    = "it_m1_rs_banks"
        "IT_M1_RS_SAP_Client"               = "it_m1_rs_sap_client"
        "IT_M1_RS_SystemsList"              = "it_m1_rs_systemslist"
        "IT_M1_SFAR_Servers"                = "it_m1_sfar_servers"
        "ITForms"                           = "itforms"
        "IssueAndBugTracker"                = "issueandbugtracker"
        "LineItems_STR"                     = "lineitems_str"
        "MainDB_FIN"                        = "maindb_fin"
        "MainDB_HR"                         = "maindb_hr"
        "MainDB_HR_JHR"                     = "maindb_hr_jhr"
        "MainDB_IT"                         = "maindb_it"
        "MainDB_IT_JHR"                     = "maindb_it_jhr"
        "MainDB_IT_Ext_Access"              = "maindb_it_ext_access"
        "MainDB_IT_Ext_Assets"              = "maindb_it_ext_assets"
        "MainDB_IT_Ext_Docs"                = "maindb_it_ext_docs"
        "MainDB_IT_Ext_Infra"               = "maindb_it_ext_infra"
        "MainDB_IT_Ext_Policy"              = "maindb_it_ext_policy"
        "MainDB_IT_Ext_SAP"                 = "maindb_it_ext_sap"
        "MainDB_IT_Ext_Support"             = "maindb_it_ext_support"
        "MainDB_PRD"                        = "maindb_prd"
        "MainDB_QA"                         = "maindb_qa"
        "MainDB_QA_JHR"                     = "maindb_qa_jhr"
        "MainDB_QA_Ext_Assessment"          = "maindb_qa_ext_assessment"
        "MainDB_QA_Ext_CAPA"                = "maindb_qa_ext_capa"
        "MainDB_QA_Ext_ChangeControl"       = "maindb_qa_ext_changecontrol"
        "MainDB_QA_Ext_HalalCert"           = "maindb_qa_ext_halalcert"
        "MainDB_QA_Ext_IMS"                 = "maindb_qa_ext_ims"
        "MainDB_QA_Ext_Product"             = "maindb_qa_ext_product"
        "MainDB_QA_Ext_Records"             = "maindb_qa_ext_records"
        "MainDB_QC"                         = "maindb_qc"
        "MainDB_QC_JHR"                     = "maindb_qc_jhr"
        "MainDB_QC_Ext_Lab"                 = "maindb_qc_ext_lab"
        "MainDB_SHE"                        = "maindb_she"
        "MainDB_STR"                        = "maindb_str"
        "Policies"                          = "policies"
        "QA_ActionItems"                    = "qa_actionitems"
        "QA_HACCP_ReviewRecord"             = "qa_haccp_reviewrecord"
        "QA_SubActionItems"                 = "qa_subactionitems"
        "RoutePermissions"                  = "routepermissions"
        "UserProfiles"                      = "userprofiles"
        "UserRoles"                         = "userroles"
        "UserRolesIT"                       = "user_roles_it"
        "WorkflowAuditLog"                  = "workflowauditlog"
    }

    if ($explicit.ContainsKey($ListName)) { return $explicit[$ListName] }
    return $ListName.ToLowerInvariant() -replace "[^a-z0-9]+", "_"
}

$site = @{
    IT    = "https://ioioi.sharepoint.com/sites/ioi-portal-it"
    HR    = "https://ioioi.sharepoint.com/sites/ioi-portal-hr"
    QA    = "https://ioioi.sharepoint.com/sites/ioi-portal-qa"
    FIN   = "https://ioioi.sharepoint.com/sites/ioi-portal-fin"
    PRD   = "https://ioioi.sharepoint.com/sites/ioi-portal-prd"
    SHE   = "https://ioioi.sharepoint.com/sites/ioi-portal-she"
    STR   = "https://ioioi.sharepoint.com/sites/ioi-portal-str"
    Admin = "https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites"
}

$mainColumns = @(
    New-ColumnSpec "FormCode" "Text" @() "" "Title" $true
    New-ColumnSpec "CurrentStatus" "Choice" @("Draft", "Submitted", "In Progress", "Pending Approval", "Approved", "Rejected", "Closed")
    New-ColumnSpec "StatusKey" "Choice" @("Draft", "Submitted", "Under Review", "Approved", "Rejected", "Closed", "Archived")
    New-ColumnSpec "Site" "Choice" @("Prai", "Penang", "Johor", "Kuala Lumpur", "Both Sites")
    New-ColumnSpec "SiteKey" "Choice" @("Prai", "Johor")
    New-ColumnSpec "Requestor_Email"
    New-ColumnSpec "Requestor_Name"
    New-ColumnSpec "SubmittedDate" "DateTime"
    New-ColumnSpec "WorkflowStage" "Number"
    New-ColumnSpec "Company"
    New-ColumnSpec "Subject"
    New-ColumnSpec "Remarks" "Note"
    New-ColumnSpec "FormData" "Note"
)

function New-ExtensionColumns {
    param([string]$ParentList)
    @(
        New-ColumnSpec "ParentRecordID" "Lookup" @() $ParentList "Title" $true
        New-ColumnSpec "ParentFormCode" "Text" @() "" "Title" $true
        New-ColumnSpec "Details" "Note"
        New-ColumnSpec "Status" "Choice" @("Draft", "Submitted", "Approved", "Rejected", "Closed")
    )
}

$itForms = @("EAF", "ITSSR", "HI", "NIR", "RS", "PRF", "SFAR", "UR", "SAPAMR", "SAPCA", "SAPCR", "SAPDRP", "SAPSLCF", "SAPSOF2", "SAPTR", "IOIP", "ITINFO", "ISGDOC", "ITSC", "IAL1", "IAL2", "IAL3", "IAL4", "IAL5")
$hrPraiForms = @("AWHR", "BSD", "CIR", "CWR", "DRD", "EEN", "EPDU", "EPHR", "ESF", "FTCR", "FWWPD", "FWWPE", "GDSN", "HEALTHINFO", "HRAPR", "HRINFO", "INTERN", "INTERVIEWDB", "JD", "NDF", "ORGCHART", "OWP", "PAF", "SR", "TMPU", "TNPRA")
$hrJhrForms = @("PCNBkStf", "cancomp", "ContractorReg", "TyphoidVacc", "UniformReq", "pcnjd", "LateComing", "manpowerReq", "NightVisit", "PCNOrgChart", "AppTest", "SpVisit", "workins", "hostel", "PCNTND", "PCNDriver")
$qaForms = @("ICAR", "SOP", "PCNFL", "DataAnalyst", "deptkrakpi", "QEN", "PCNFoodManual", "FDAssess", "FoodSecManual", "FSS", "PIMSSOP", "PIMSWI", "PCIMSQM", "PCLTM", "PCMatQP", "PanCenPQP", "PCMSDS", "PIoRN", "PCQltyRec", "PCNCR", "PCGenOFI", "PanCenPAR", "QACAR")
$qcForms = @("PFAD", "FJBInsp", "PISOSOP", "ISOManual", "PCLabWkReq", "CHEMSHERPA", "COD", "COI", "STIR")

$specs = @()
$specs += New-ListSpec $site.IT "MainDB_IT" "maindb_it" "main" "Prai/Penang IT parent list" 50 $mainColumns $itForms
$specs += New-ListSpec $site.IT "MainDB_IT_JHR" "maindb_it_jhr" "main" "Johor IT parent list" 50 $mainColumns $itForms
foreach ($list in @("MainDB_IT_Ext_Access", "MainDB_IT_Ext_Assets", "MainDB_IT_Ext_Support", "MainDB_IT_Ext_SAP", "MainDB_IT_Ext_Docs", "MainDB_IT_Ext_Infra", "MainDB_IT_Ext_Policy")) {
    $specs += New-ListSpec $site.IT $list (ConvertTo-DataSourceKey $list) "extension" "IT extension list" 25 (New-ExtensionColumns "MainDB_IT")
}
foreach ($list in @("ConfigCompanies", "ConfigDepartments", "ConfigApproverMatrix", "ConfigEmployeeDirectory", "ConfigNotesAdminRouting", "ITForms", "UserRolesIT", "Policies", "IT_M1_RS_SystemsList", "IT_M1_RS_Banks", "IT_M1_RS_SAP_Client", "IT_M1_SFAR_Servers", "ApprovalRecords", "WorkflowAuditLog")) {
    $specs += New-ListSpec $site.IT $list (ConvertTo-DataSourceKey $list) "config" "IT/configuration support list" 10 @(
        New-ColumnSpec "Code"
        New-ColumnSpec "Name"
        New-ColumnSpec "Description" "Note"
        New-ColumnSpec "IsActive" "Boolean"
    )
}

$specs += New-ListSpec $site.HR "MainDB_HR" "maindb_hr" "main" "Prai/Penang HR parent list" 50 $mainColumns $hrPraiForms
$specs += New-ListSpec $site.HR "MainDB_HR_JHR" "maindb_hr_jhr" "main" "Johor HR parent list" 50 $mainColumns $hrJhrForms
foreach ($list in @("MainDB_HR_Ext_Staffing", "MainDB_HR_Ext_Lifecycle", "MainDB_HR_Ext_Attendance", "MainDB_HR_Ext_ForeignWorker", "MainDB_HR_Ext_OrgStructure", "MainDB_HR_Ext_Welfare", "MainDB_HR_Ext_Compliance", "MainDB_HR_Ext_Operations")) {
    $specs += New-ListSpec $site.HR $list (ConvertTo-DataSourceKey $list) "extension" "HR extension list" 25 (New-ExtensionColumns "MainDB_HR")
}
foreach ($list in @("ApprovalHistory_HR", "AuditLog_HR", "AttachmentIndex_HR", "HR_RoutingMatrix", "HR_AppraisalRecords", "HR_HealthRegister", "HR_InterviewPipeline", "ConfigGlobalUserRoleAssignments")) {
    $specs += New-ListSpec $site.HR $list (ConvertTo-DataSourceKey $list) "support" "HR support list" 25 @(
        New-ColumnSpec "Code"
        New-ColumnSpec "Name"
        New-ColumnSpec "Details" "Note"
        New-ColumnSpec "IsActive" "Boolean"
    )
}

$specs += New-ListSpec $site.QA "MainDB_QA_JHR" "maindb_qa_jhr" "main" "Johor QA parent list" 50 $mainColumns $qaForms
$specs += New-ListSpec $site.QA "MainDB_QC_JHR" "maindb_qc_jhr" "main" "Johor QC parent list" 50 $mainColumns $qcForms
$specs += New-ListSpec $site.QA "MainDB_QA" "maindb_qa" "main" "Prai/Penang QA parent list" 50 $mainColumns $qaForms
$specs += New-ListSpec $site.QA "MainDB_QC" "maindb_qc" "main" "Prai/Penang QC parent list" 50 $mainColumns $qcForms
foreach ($list in @("MainDB_QA_Ext_IMS", "MainDB_QA_Ext_CAPA", "MainDB_QA_Ext_Records", "MainDB_QC_Ext_Lab", "MainDB_QA_Ext_Assessment", "MainDB_QA_Ext_Product", "MainDB_QA_Ext_HalalCert", "MainDB_QA_Ext_ChangeControl")) {
    $parent = if ($list -like "MainDB_QC*") { "MainDB_QC" } else { "MainDB_QA" }
    $specs += New-ListSpec $site.QA $list (ConvertTo-DataSourceKey $list) "extension" "QA/QC extension list" 25 (New-ExtensionColumns $parent)
}
foreach ($list in @("ApprovalHistory_QA", "QA_ActionItems", "QA_SubActionItems", "QA_HACCP_ReviewRecord")) {
    $specs += New-ListSpec $site.QA $list (ConvertTo-DataSourceKey $list) "support" "QA support list" 25 @(
        New-ColumnSpec "Code"
        New-ColumnSpec "Name"
        New-ColumnSpec "Details" "Note"
        New-ColumnSpec "IsActive" "Boolean"
    )
}

$specs += New-ListSpec $site.FIN "MainDB_FIN" "maindb_fin" "main" "Finance parent list" 50 $mainColumns @("CAR", "EARF", "TClaim", "MonthClose")
$specs += New-ListSpec $site.PRD "MainDB_PRD" "maindb_prd" "main" "Production parent list" 50 $mainColumns @()
$specs += New-ListSpec $site.SHE "MainDB_SHE" "maindb_she" "main" "SHE parent list" 50 $mainColumns @()
$specs += New-ListSpec $site.SHE "ApprovalHistory_SHE" "approvalhistory_she" "support" "SHE approval history" 25 @(
    New-ColumnSpec "FormID"
    New-ColumnSpec "ActionBy"
    New-ColumnSpec "ActionDate" "DateTime"
    New-ColumnSpec "Comment" "Note"
)
$specs += New-ListSpec $site.STR "MainDB_STR" "maindb_str" "main" "Store parent list" 50 $mainColumns @("ACMSTR", "GIR")
foreach ($list in @("Assignments_STR", "AttachmentIndex_STR", "LineItems_STR", "ApprovalHistory_STR")) {
    $specs += New-ListSpec $site.STR $list (ConvertTo-DataSourceKey $list) "support" "STR support list" 25 @(
        New-ColumnSpec "ParentRecordID" "Lookup" @() "MainDB_STR"
        New-ColumnSpec "Details" "Note"
        New-ColumnSpec "Status"
    )
}
foreach ($list in @("IssueAndBugTracker", "UserRoles", "AppSettings", "AuditLogs", "RoutePermissions", "UserProfiles")) {
    $specs += New-ListSpec $site.Admin $list (ConvertTo-DataSourceKey $list) "admin" "Platform administration list" 25 @(
        New-ColumnSpec "Code"
        New-ColumnSpec "Name"
        New-ColumnSpec "Details" "Note"
        New-ColumnSpec "IsActive" "Boolean"
    )
}

function Ensure-PnPModule {
    if ($DryRun) { return }
    if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
        throw "PnP.PowerShell is not installed. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
    }
    Import-Module PnP.PowerShell -ErrorAction Stop
}

function Ensure-List {
    param([object]$Spec)
    if ($DryRun) {
        return [pscustomobject]@{ Id = ""; Title = $Spec.ListName; Status = "DryRun" }
    }

    $list = Get-PnPList -Identity $Spec.ListName -ErrorAction SilentlyContinue
    if (-not $list) {
        $list = New-PnPList -Title $Spec.ListName -Template GenericList -OnQuickLaunch:$false
        $status = "Created"
    } else {
        $status = "Existing"
    }

    Set-PnPList -Identity $Spec.ListName -EnableVersioning $true -MajorVersions $Spec.VersionLimit | Out-Null
    [pscustomobject]@{ Id = $list.Id; Title = $Spec.ListName; Status = $status }
}

function Ensure-Field {
    param([string]$ListName, [object]$Column)
    if ($Column.Name -eq "Title") { return "BuiltIn" }

    if ($DryRun) { return "DryRun" }

    $existing = Get-PnPField -List $ListName -Identity $Column.Name -ErrorAction SilentlyContinue
    if ($existing) { return "Existing" }

    if ($Column.Type -eq "Lookup") {
        $target = Get-PnPList -Identity $Column.LookupList -ErrorAction SilentlyContinue
        if (-not $target) { return "MissingLookupTarget:$($Column.LookupList)" }
        Add-PnPField -List $ListName -DisplayName $Column.Name -InternalName $Column.Name -Type Lookup -LookupList $target.Id -LookupField $Column.LookupField -AddToDefaultView | Out-Null
        return "Created"
    }

    if ($Column.Type -eq "Choice") {
        Add-PnPField -List $ListName -DisplayName $Column.Name -InternalName $Column.Name -Type Choice -Choices $Column.Choices -AddToDefaultView | Out-Null
        return "Created"
    }

    Add-PnPField -List $ListName -DisplayName $Column.Name -InternalName $Column.Name -Type $Column.Type -AddToDefaultView | Out-Null
    return "Created"
}

function Ensure-FormViews {
    param([object]$Spec)
    $added = 0
    $existing = 0
    if ($DryRun) { return [pscustomobject]@{ Added = 0; Existing = $Spec.ViewFormCodes.Count } }

    foreach ($formCode in $Spec.ViewFormCodes) {
        $viewName = "Form_$formCode"
        $view = Get-PnPView -List $Spec.ListName -Identity $viewName -ErrorAction SilentlyContinue
        if ($view) {
            $existing++
            continue
        }

        $query = "<Where><Eq><FieldRef Name='FormCode'/><Value Type='Text'>$formCode</Value></Eq></Where>"
        Add-PnPView -List $Spec.ListName -Title $viewName -Fields @("Title", "FormCode", "CurrentStatus", "SubmittedDate") -Query $query | Out-Null
        $added++
    }
    [pscustomobject]@{ Added = $added; Existing = $existing }
}

Ensure-PnPModule
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

$audit = New-Object System.Collections.Generic.List[object]
$sitesToProcess = $specs | Group-Object SiteUrl
foreach ($siteGroup in $sitesToProcess) {
    if (-not $DryRun -and -not $SkipConnect) {
        Connect-PnPOnline -Url $siteGroup.Name -Interactive
    }

    foreach ($spec in $siteGroup.Group) {
        $listResult = Ensure-List $spec
        $createdColumns = 0
        $existingColumns = 0
        $columnIssues = @()

        foreach ($column in $spec.Columns) {
            $fieldResult = Ensure-Field $spec.ListName $column
            if ($fieldResult -eq "Created") { $createdColumns++ }
            elseif ($fieldResult -eq "Existing" -or $fieldResult -eq "BuiltIn" -or $fieldResult -eq "DryRun") { $existingColumns++ }
            else { $columnIssues += "$($column.Name):$fieldResult" }
        }

        $viewResult = Ensure-FormViews $spec
        $audit.Add([pscustomobject]@{
            SiteUrl                   = $spec.SiteUrl
            ListName                  = $spec.ListName
            DataSourceKey             = $spec.DataSourceKey
            Category                  = $spec.Category
            ListId                    = [string]$listResult.Id
            ListStatus                = $listResult.Status
            ColumnsCreated            = $createdColumns
            ColumnsExistingOrPlanned  = $existingColumns
            ColumnIssues              = ($columnIssues -join "; ")
            ViewsCreated              = $viewResult.Added
            ViewsExistingOrPlanned    = $viewResult.Existing
            RequiresPowerAppsRefresh  = $true
        })
    }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$csvPath = Join-Path $OutputDirectory "sharepoint-list-audit-$timestamp.csv"
$jsonPath = Join-Path $OutputDirectory "sharepoint-list-audit-$timestamp.json"
$latestJsonPath = Join-Path $OutputDirectory "sharepoint-list-audit.latest.json"

$audit | Export-Csv -NoTypeInformation -Path $csvPath
$audit | ConvertTo-Json -Depth 6 | Set-Content -Path $jsonPath
$audit | ConvertTo-Json -Depth 6 | Set-Content -Path $latestJsonPath

Write-Host "SharePoint provisioning audit written:"
Write-Host "  $csvPath"
Write-Host "  $jsonPath"
Write-Host "  $latestJsonPath"
if ($DryRun) {
    Write-Host "DryRun completed. No SharePoint changes were made."
}
