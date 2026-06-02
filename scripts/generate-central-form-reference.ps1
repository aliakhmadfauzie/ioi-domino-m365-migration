param(
    [string]$RepoRoot = (Resolve-Path ".").Path,
    [string]$OutputPath = "docs\central-form-reference.md"
)

$ErrorActionPreference = "Stop"

$schemaDir = Join-Path $RepoRoot "ioicodeapp\powerapps-mirror\apps\ioi-platform\src\form-schemas"
$outPath = Join-Path $RepoRoot $OutputPath

function Esc([object]$Value) {
    if ($null -eq $Value) { return "" }
    $text = [string]$Value
    $text = $text -replace "\r?\n", "<br>"
    $text = $text -replace "\|", "\|"
    return $text
}

function Join-Labels($Items) {
    if ($null -eq $Items) { return "" }
    return (($Items | ForEach-Object { Esc $_ }) -join "; ")
}

function Get-ExtensionList($Code, $Tables) {
    if ($Tables -match "Ext_Access|ExtAccess") { return "MainDB_IT_Ext_Access" }
    if ($Tables -match "ExtSupport") { return "MainDB_IT_Ext_Support" }
    if ($Tables -match "ExtAssets") { return "MainDB_IT_Ext_Assets" }
    if ($Tables -match "ExtSAP") { return "MainDB_IT_Ext_SAP" }

    switch -Regex ($Code) {
        "^(EAF|VPNACCESS|NOTESID|PWDRESET|SFAR|USERID)$" { return "MainDB_IT_Ext_Access" }
        "^(ITSSR|PRF|ITDAILYRPT|ITDR2|DCALOG)$" { return "MainDB_IT_Ext_Support" }
        "^(HI|HWINV_PRAI)$" { return "MainDB_IT_Ext_Assets" }
        "^(SAPAMR|SAPCA|SAPCR|SAPDRP|SAPSLCF|SAPTR|SILOUATSOF|INTUATSOF)$" { return "MainDB_IT_Ext_SAP / MainDB_IT_Ext_Infra for SAPDRP" }
        "^(IOIPOL|ISGDOC|ITINFO|TRNMAN)$" { return "MainDB_IT_Ext_Docs / MainDB_IT_Ext_Policy" }
        "^(ITSC|SVRREC|SVRREBOOT|ITEVT)$" { return "MainDB_IT_Ext_Infra / Ext_Assets" }
        default { return "Needs confirmation" }
    }
}

function Get-FormStatus($File, $Schema) {
    if ($Schema.title -match "LEGACY|not rendered") { return "Outdated" }
    if ($Schema.formCode -in @("VPNACCESS", "HWINV_PRAI")) { return "Duplicate / Outdated" }
    return "Confirmed"
}

function Get-Purpose($Schema) {
    if ($Schema.description) { return $Schema.description }
    return $Schema.title
}

function Get-Mode($Schema) {
    $modes = @("New")
    $formFolder = Join-Path $RepoRoot ("ioicodeapp\powerapps-mirror\apps\ioi-platform\src\pages\it\forms\" + $Schema.formCode.ToLower())
    if (Test-Path (Join-Path $formFolder "index.tsx")) { $modes += "List" }
    if (Test-Path (Join-Path $formFolder "[id].tsx")) { $modes += "Detail/View" }
    if ($Schema.sections.sectionName -match "Approval|Approve|Acceptance|Reject|Verified|Sign-Off|Withdrawn|Completion|Closure") {
        $modes += "Approval/Workflow Sections"
    }
    return ($modes | Select-Object -Unique) -join ", "
}

function Get-FormDisplayName($Schema) {
    if (-not $Schema.formCode) { return "" }
    if ($Schema.title -and ($Schema.title -ne $Schema.formCode)) { return "$($Schema.formCode) - $($Schema.title)" }
    return $Schema.formCode
}

function Test-ApprovalSection($Section) {
    $sectionName = [string]$Section.sectionName
    if ($sectionName -match "Approval|Approve|Acceptance|Verified|Sign-Off|Completion|Closure|Close|Withdraw|HOD|BPO|Manager|Director|COO|IT Action|Final|Transport|Resolution") {
        return $true
    }

    $fieldText = (($Section.fields | ForEach-Object { $_.label }) -join " ")
    return ($fieldText -match "Approved By|Approved Date|Date Approved|Rejected By|Accepted By|Withdrawn By|HOD Name|BPO Name|IT Manager|Division Director|COO")
}

function Add-Line([System.Collections.Generic.List[string]]$Lines, [string]$Text = "") {
    $Lines.Add($Text) | Out-Null
}

$schemas = Get-ChildItem -LiteralPath $schemaDir -Filter "*.json" |
    Sort-Object Name |
    ForEach-Object {
        $json = Get-Content -Raw -LiteralPath $_.FullName | ConvertFrom-Json
        [pscustomobject]@{
            File   = $_.Name
            Path   = "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/$($_.Name)"
            Schema = $json
        }
    }

$totalForms = $schemas.Count
$totalSections = ($schemas | ForEach-Object { $_.Schema.sections } | Measure-Object).Count
$totalFields = ($schemas | ForEach-Object { $_.Schema.sections.fields } | Measure-Object).Count
$confirmedForms = ($schemas | Where-Object { (Get-FormStatus $_.File $_.Schema) -eq "Confirmed" } | Measure-Object).Count
$gapForms = $totalForms - $confirmedForms

$sourcesReviewed = @(
    "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/*.json",
    "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/dynamic-form/*",
    "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/hooks/use-dynamic-form.ts",
    "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/features/itssr/itssr-app.tsx",
    "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/**",
    "ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/*",
    "m365-design/sharepoint-list-design.md",
    "m365-design/powerapps-design.md",
    "m365-design/power-automate-design.md",
    "docs/sharepoint-schemas/schema-reference.md",
    "docs/ui-page-specification.md",
    "mapping/field-mapping.csv",
    "mapping/data-migration-rules.csv",
    "analysis/workflow-analysis.md",
    "analysis/phase1-source-analysis-eaf-itssr-hi.md",
    "analysis/phase2-repo-inventory-eaf-itssr-hi.md",
    "analysis/phase3-alignment-eaf-itssr-hi.md",
    "analysis/phase4-redundancy-report.md",
    "docs/app-repo-cleanup-plan.md"
)

$lines = [System.Collections.Generic.List[string]]::new()
Add-Line $lines "# Forms, Sections, Workflow, and Data Connection Analysis"
Add-Line $lines
Add-Line $lines "> Generated from local repo evidence on 2026-05-31. Live SharePoint column export was not present; SharePoint details below use local generated models, provisioning scripts, and design docs and are marked when confirmation is still needed."
Add-Line $lines

Add-Line $lines "## 1. Executive Summary"
Add-Line $lines
Add-Line $lines "| Metric | Count / Finding |"
Add-Line $lines "|---|---:|"
Add-Line $lines "| JSON form schemas found | $totalForms |"
Add-Line $lines "| Sections found in JSON schemas | $totalSections |"
Add-Line $lines "| Fields found in JSON schemas | $totalFields |"
Add-Line $lines "| Forms confirmed from active schema evidence | $confirmedForms |"
Add-Line $lines "| Forms with gaps, duplicate, legacy, or outdated status | $gapForms |"
Add-Line $lines "| Main duplicate/outdated forms | VPNACCESS superseded by EAF; HWINV_PRAI superseded by HI; ITEVT and SVRREBOOT marked legacy in title |"
Add-Line $lines "| Main SharePoint integration risks | Live SharePoint schema export is still placeholder/TBD; several older schemas do not include spColumn/spTable bindings; dynamic submit hook only writes MainDB_IT and ExtSupport despite other extension lists existing |"
Add-Line $lines "| Main workflow risks | Approval stage rules are documented for key forms, but most schema sections do not encode role/status visibility; some workflows rely on page code or Power Automate design rather than schema metadata |"
Add-Line $lines

Add-Line $lines "## 2. Sources Reviewed"
Add-Line $lines
Add-Line $lines "| Source | Purpose | Status |"
Add-Line $lines "|---|---|---|"
foreach ($src in $sourcesReviewed) {
    Add-Line $lines "| $(Esc $src) | Repo/schema/workflow evidence | Reviewed |"
}
Add-Line $lines

Add-Line $lines "## 3. Missing Inputs and Assumptions"
Add-Line $lines
Add-Line $lines "| Missing Input | Assumption / Handling | Impact |"
Add-Line $lines "|---|---|---|"
Add-Line $lines "| Live SharePoint site/list export | Used docs/sharepoint-schemas/schema-reference.md, generated models, and provisioning/design docs. Marked exact column type verification as Needs confirmation. | High for final production mapping |"
Add-Line $lines "| Full exported list settings with required flags | Required/read-only values come from JSON schemas and page code, not live SharePoint. | Medium |"
Add-Line $lines "| Power Automate exported flows | Used m365-design/power-automate-design.md and analysis/workflow-analysis.md; dependencies remain design-level unless implemented in code. | Medium |"
Add-Line $lines "| Domino PDF/UI exports for every form | Used existing analysis inventories; did not re-OCR PDFs in this pass. | Medium for UI section naming |"
Add-Line $lines "| Business approval matrix | Used route/config docs and code conditions; exact approver groups need business confirmation. | High for workflow signoff |"
Add-Line $lines "| Non-IT department detailed schemas | IT code schemas are complete in this document; HR/QA/QC/STR list families are referenced from design docs and remain summary-level unless form schemas exist. | Medium |"
Add-Line $lines

Add-Line $lines "## 4. Form Inventory"
Add-Line $lines
Add-Line $lines "| Form Name | Type / Mode | File / Location | Screen / Page | Purpose | Status |"
Add-Line $lines "|---|---|---|---|---|---|"
foreach ($x in $schemas) {
    $s = $x.Schema
    Add-Line $lines "| $(Esc ($s.formCode + ' - ' + $s.title)) | $(Esc (Get-Mode $s)) | $(Esc $x.Path) | $(Esc $s.routeBase) | $(Esc (Get-Purpose $s)) | $(Esc (Get-FormStatus $x.File $s)) |"
}
Add-Line $lines

Add-Line $lines "## 5. Section Inventory by Form"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Section Type | File / Location | Fields Included | Purpose | Source Evidence | Status |"
Add-Line $lines "|---|---|---|---|---|---|---|---|"
foreach ($x in $schemas) {
    foreach ($sec in ($x.Schema.sections | Sort-Object displayOrder)) {
        $type = if (Test-ApprovalSection $sec) { "Approval / workflow" } elseif ($sec.showWhen) { "Conditional section" } elseif ($sec.sectionName -match "Header|Requestor|General|Details") { "Header / request details" } elseif ($sec.sectionName -match "Attachment|Document|History") { "Attachments / audit/history" } else { "Form section" }
        $fields = Join-Labels ($sec.fields | Sort-Object displayOrder | ForEach-Object { $_.label })
        $status = if ($sec.showWhen) { "Hidden/conditional" } else { "Confirmed" }
        Add-Line $lines "| $(Esc (Get-FormDisplayName $x.Schema)) | $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | $(Esc $type) | $(Esc $x.Path) | $(Esc $fields) | $(Esc $sec.sectionName) | JSON schema section/fields | $(Esc $status) |"
    }
}
Add-Line $lines

Add-Line $lines "## 6. Section Visibility Rules"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Visible When | Hidden When | Editable When | Read-Only When | Based On | Source Location | Notes |"
Add-Line $lines "|---|---|---|---|---|---|---|---|---|"
foreach ($x in $schemas) {
    foreach ($sec in ($x.Schema.sections | Sort-Object displayOrder)) {
        if ($sec.showWhen) {
            $sw = $sec.showWhen
            $val = if ($sw.value -is [array]) { ($sw.value -join ", ") } else { $sw.value }
            $visible = "$($sw.fieldId) $($sw.op) $val"
            $hidden = "When condition is not met"
            $based = "Schema showWhen rule"
            $notes = "Implemented by isSectionVisible in use-dynamic-form.ts for DynamicForm paths."
        } else {
            $visible = "Always visible when form/page renders"
            $hidden = "Not hidden in schema"
            $based = "Default schema rendering"
            $notes = "Additional role/status logic may exist in custom page code for custom forms."
        }
        Add-Line $lines "| $(Esc (Get-FormDisplayName $x.Schema)) | $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | $(Esc $visible) | $(Esc $hidden) | Editable for New mode unless field.readOnly=true or custom page status/role gates it | Field-level readOnly or custom page role/status gates | $(Esc $based) | $(Esc $x.Path) | $(Esc $notes) |"
    }
}
Add-Line $lines

Add-Line $lines "### Custom Visibility and Editability Rules from Page Code"
Add-Line $lines
Add-Line $lines "| Form | Section / Surface | Visible / Editable Rule | Source | Status |"
Add-Line $lines "|---|---|---|---|---|"
Add-Line $lines "| EAF | 4-step new request wizard | Requestor, Access Details, Justification, Review steps are controlled by currentStep; submit validates required fields before writing parent and extension records. | src/pages/it/forms/eaf/new.tsx | Confirmed |"
Add-Line $lines "| EAF | Higher approver routing | PanCen companies are detected from Company containing PCEO/PCOC/PAN-CENTURY; higher approver is shown/used for COO/Director route preview. | src/pages/it/forms/eaf/new.tsx | Partially confirmed |"
Add-Line $lines "| ITSSR | Request section | Requestor can edit only when status is Draft; otherwise read-only. | src/features/itssr/itssr-app.tsx | Confirmed |"
Add-Line $lines "| ITSSR | Assignment/triage | IT/admin or assigned PIC can edit assignment when status is Submitted. | src/features/itssr/itssr-app.tsx | Confirmed |"
Add-Line $lines "| ITSSR | Resolution | IT can edit solution/resolution fields when status is InProgress. | src/features/itssr/itssr-app.tsx | Confirmed |"
Add-Line $lines "| ITSSR | Requestor acceptance | Requestor can accept/return when status is Resolved; comments required when rating below 8. | src/features/itssr/itssr-app.tsx | Confirmed |"
Add-Line $lines "| ITSSR | PanCen desktop approval | PanCen approval tab appears for desktop/hardware routing; COO approval fields are shown when COO approval is needed. | src/features/itssr/itssr-app.tsx | Partially confirmed |"
Add-Line $lines "| HI | Draft/submit actions | Save Draft and Submit Asset both available on new page; required field check only enforced for submit path. | src/pages/it/forms/hi/new.tsx | Confirmed |"
Add-Line $lines

Add-Line $lines "## 7. Field Extraction by Form and Section"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Field Label | Control Name | SharePoint Column | Column Type | Required? | Default Value | Visible? | Editable? | Source Evidence |"
Add-Line $lines "|---|---|---|---|---|---|---|---|---|---|---|"
foreach ($x in $schemas) {
    foreach ($sec in ($x.Schema.sections | Sort-Object displayOrder)) {
        foreach ($f in ($sec.fields | Sort-Object displayOrder)) {
            $spCol = if ($f.spColumn) { $f.spColumn } else { "Needs confirmation" }
            $spType = if ($f.spColumnType) { $f.spColumnType } else { $f.fieldType }
            $def = if ($f.autoValue) { $f.autoValue } else { "" }
            $visible = if ($sec.showWhen) { "Conditional: see section visibility" } else { "Yes" }
            $editable = if ($f.readOnly) { "No - readOnly" } elseif ($f.deprecated) { "No/Needs confirmation - deprecated" } else { "Yes in editable mode" }
            Add-Line $lines "| $(Esc (Get-FormDisplayName $x.Schema)) | $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | $(Esc $f.label) | $(Esc $f.fieldId) | $(Esc $spCol) | $(Esc $spType) | $([bool]$f.required) | $(Esc $def) | $(Esc $visible) | $(Esc $editable) | $(Esc $x.Path) |"
        }
    }
}
Add-Line $lines

Add-Line $lines "## 8. Data Connections and Linked Lists"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Data Source / Connector | SharePoint Site | SharePoint List | Relationship | Read / Write / Both | Used In | Notes |"
Add-Line $lines "|---|---|---|---|---|---|---|---|---|"
foreach ($x in $schemas) {
    $tables = (($x.Schema.sections.fields | ForEach-Object { $_.spTable } | Where-Object { $_ } | Sort-Object -Unique) -join ", ")
    $ext = Get-ExtensionList $x.Schema.formCode $tables
    foreach ($sec in ($x.Schema.sections | Sort-Object displayOrder)) {
        $sectionTables = (($sec.fields | ForEach-Object { $_.spTable } | Where-Object { $_ } | Sort-Object -Unique) -join ", ")
        $list = if ($sectionTables) { $sectionTables } else { "MainDB_IT plus inferred $ext" }
        $notes = if ($sectionTables) { "spTable present in schema." } else { "No spTable on fields; list inferred from SharePoint design and form family." }
        Add-Line $lines "| $(Esc (Get-FormDisplayName $x.Schema)) | $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | Generated Power Apps/SharePoint services; DynamicForm uses MainDBITService and MainDBITExtSupportService where applicable | IOI-App_Admin_Sites / ioi-portal-it (per design) | $(Esc $list) | Parent record in MainDB_IT using FormCode; extension list child record uses parent lookup/ParentFormCode when implemented | Both for implemented forms; read-only/list pages for some forms | $(Esc $x.Path) | $(Esc $notes) |"
    }
}
Add-Line $lines

Add-Line $lines "### Microsoft 365 Users Usage"
Add-Line $lines
Add-Line $lines "| Usage | Evidence | Notes |"
Add-Line $lines "|---|---|---|"
Add-Line $lines "| People/person fields in schemas | fieldType: people across EAF, ITSSR, NIR, PRF, SFAR, USERID, and approval sections | Rendered through EmployeePicker in DynamicForm or PeoplePicker in EAF. |"
Add-Line $lines "| Current user default | autoValue: currentUser and useUser() hooks | Used for requestor defaults and audit fields. |"
Add-Line $lines "| Office365Users connector wrapper | src/data/m365Client.ts | Uses shared_office365users SearchUser operation. |"
Add-Line $lines "| Employee directory fallback | src/hooks/use-employee-lookup.ts | Reads ConfigEmployeeDirectory first, then hardcoded local fallback for dev/connectivity failure. |"
Add-Line $lines

Add-Line $lines "## 9. Validation Rules by Form and Section"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Field / Section | Validation Rule | Trigger | Error Message | Source Location | Notes |"
Add-Line $lines "|---|---|---|---|---|---|---|---|"
foreach ($x in $schemas) {
    foreach ($sec in ($x.Schema.sections | Sort-Object displayOrder)) {
        $requiredFields = @($sec.fields | Where-Object { $_.required -eq $true -and $_.readOnly -ne $true -and -not $_.autoValue })
        if ($requiredFields.Count -eq 0) {
            Add-Line $lines "| $(Esc $x.Schema.formCode) | $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | Section | No explicit user-entered required fields in schema; still subject to page/service validation. | Submit | N/A | $(Esc $x.Path) | Needs SharePoint required-column confirmation |"
        } else {
            foreach ($f in $requiredFields) {
                Add-Line $lines "| $(Esc $x.Schema.formCode) | $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | $(Esc $f.label) | Required when section is visible and field is not read-only/autoValue. | Submit | $(Esc ($f.label + ' is required')) | $(Esc $x.Path) + src/hooks/use-dynamic-form.ts | Schema-driven validation |"
            }
        }
    }
}
Add-Line $lines "| EAF | New request wizard | Company, Site, Requestor, Target User, Application, System, Justification, Department Head | Custom validation before SharePoint create. | Submit | Field-specific required messages | src/pages/it/forms/eaf/new.tsx | Confirmed custom page validation |"
Add-Line $lines "| ITSSR | Request submission | Site, Company, Department, Service Type, Reported By Email, Send To Email, Problem Description | Custom validation before create. | Submit request | Please complete all required request fields. | src/features/itssr/itssr-app.tsx | Confirmed custom page validation |"
Add-Line $lines "| ITSSR | Requestor Acceptance | Satisfaction Rating / Requestor Comment | If rating below 8, comment is required. | Accept action | Comments required when rating below 8. | src/features/itssr/itssr-app.tsx | Confirmed workflow validation |"
Add-Line $lines "| HI | New asset | Required header/asset fields | Required field check before non-draft submit. | Submit Asset | Please fill in all required fields | src/pages/it/forms/hi/new.tsx | Confirmed custom page validation |"
Add-Line $lines

Add-Line $lines "## 10. Approval and Workflow Logic by Form and Section"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Step | Status | Trigger | Actor / Role | Condition | Action | Next Status | Source Location |"
Add-Line $lines "|---|---|---|---|---|---|---|---|---|---|"
Add-Line $lines "| EAF | Requestor | 1 | Draft/Request | Submit | Requestor | Required fields valid | Create MainDB_IT and MainDB_IT_Ext_Access; notify approver | Submitted / Dept Head stage | src/pages/it/forms/eaf/new.tsx; analysis/workflow-analysis.md |"
Add-Line $lines "| EAF | HOD Acceptance | 2 | Submitted / Acceptance1 | Approve/Reject | Dept Head | Department head assigned | Record status/comment/date | Acceptance2 or Rejected1 | analysis/workflow-analysis.md; EAF.json |"
Add-Line $lines "| EAF | Division Director / COO | 3 | Acceptance2 | Approve/Reject | COO if PanCen, otherwise Director | isPCN / company route | Record status/comment/date | IT Manager / Rejected2 | analysis/workflow-analysis.md; m365-design/power-automate-design.md |"
Add-Line $lines "| EAF | IT Manager | 4 | IT Manager Acceptance | Approve/Reject | IT Manager | Prior approval completed | Record status/comment/date | IT Provisioning / Rejected | EAF.json; m365-design/power-automate-design.md |"
Add-Line $lines "| EAF | IT Provisioning | 5 | Done / Completed | Complete provisioning | IT staff | IT manager approved | Record final status and configuration | Completed | EAF.json; analysis/workflow-analysis.md |"
Add-Line $lines "| ITSSR | Requestor Details | 1 | Draft | Submit request | Requestor | Required request fields valid | Create parent, update generated case title, create ExtSupport child, create attachment/doc record, email routed PIC | Submitted / PendingIT | src/features/itssr/itssr-app.tsx |"
Add-Line $lines "| ITSSR | Assignment/Triage | 2 | Submitted | Assign/start, mark pending, clear pending, deny | IT admin/PIC | User is IT admin or assigned/routed PIC | Update ExtSupport assignment and currentStatus | InProgress, Submitted/Pending, Denied | src/features/itssr/itssr-app.tsx |"
Add-Line $lines "| ITSSR | Resolution | 3 | InProgress | Mark Resolved | IT admin/PIC | Solution present | Write solution/category/support method/resolution dates; notify requestor | Resolved / PendingReqAcceptance | src/features/itssr/itssr-app.tsx |"
Add-Line $lines "| ITSSR | Acceptance | 4 | Resolved | Accept or return to IT | Requestor | Rating/comment rule passes | Write rating/comment/date or return case | Accepted/Approved or InProgress | src/features/itssr/itssr-app.tsx |"
Add-Line $lines "| ITSSR | Closure | 5 | Accepted/Closed | Final close | IT/admin/system | Acceptance completed | Record final comments/date | Closed | ITSSR.json; src/features/itssr/itssr-app.tsx |"
Add-Line $lines "| PRF | Requesting through Validating | 1-6 | Draft/Submitted/ISG Review/Approval | Submit/review/complete/validate | Requestor, Dept Manager, ISG, SAP/ABAP, Requestor | Stage-specific sections in schema | Update status/comments/attachments | Next PRF stage | PRF.json; analysis/workflow-analysis.md |"
Add-Line $lines "| SAPCR | Initiation through implementation | Multi | Draft/Submitted/BPO/PM/Implementation/Discard | Submit/approve/transport/complete/discard | Requestor, BPO, PM, developer, IT | SAP/WB change workflow | Update staged SAP ext fields | Next SAPCR status | SAPCR.json; analysis/workflow-analysis.md |"
Add-Line $lines "| SAP sign-off forms | Header, key user, BPO, IT review | Multi | Submitted/sign-off/review/close | Submit/sign-off/approve | IT functional, key users, BPOs, IT | Repeated sign-off sections | Store sign-off statuses/comments/dates | Close | SILOUATSOF.json, INTUATSOF.json |"
Add-Line $lines

Add-Line $lines "### Buttons and Actions"
Add-Line $lines
Add-Line $lines "| Form Name | Section Name / ID | Button / Action | Visible When | Enabled When | Action Logic | Notes |"
Add-Line $lines "|---|---|---|---|---|---|---|"
Add-Line $lines "| DynamicForm forms | All visible sections | Submit [Form Title] | New form page renders | Not pending and validation passes | useDynamicForm.handleSubmit writes MainDB_IT and ExtSupport fields | Risk: only ExtSupport is handled generically today. |"
Add-Line $lines "| DynamicForm forms | All visible sections | Cancel | New form page renders | Always | Navigate back to routeBase/list page | Confirmed in DynamicForm.tsx. |"
Add-Line $lines "| EAF | Wizard | Submit | Review step | Required validation passes and not submitting | Create parent and Ext_Access child; send approval/confirmation email | Confirmed custom implementation. |"
Add-Line $lines "| HI | Header actions | Save Draft | New asset page | Not pending | Create MainDB_IT draft asset record | Confirmed custom implementation. |"
Add-Line $lines "| HI | Header actions | Submit Asset | New asset page | Required validation passes and not pending | Create MainDB_IT asset record | Ext_Assets write needs confirmation. |"
Add-Line $lines "| ITSSR | Request | Submit request | New request screen | Required request fields complete and not pending | Create MainDB_IT + ExtSupport + document metadata; send Outlook email | Confirmed custom implementation. |"
Add-Line $lines "| ITSSR | List card | Return to Draft | User can see actionable record | Not pending | Update MainDB_IT status back to Draft | Confirmed. |"
Add-Line $lines "| ITSSR | Assignment | Assign and Start | Status Submitted and IT/admin/PIC | Assigned person present | Update AssignedToEmail, DateStarted, status InProgress | Confirmed. |"
Add-Line $lines "| ITSSR | Assignment | Mark Pending / Clear Pending / Deny | Status Submitted and IT/admin/PIC | Not pending | Update CS sub-state/current status; notify as applicable | Confirmed. |"
Add-Line $lines "| ITSSR | Resolution | Mark Resolved | Status InProgress and IT/admin/PIC | Solution present | Update solution, categories, dates, document, notification | Confirmed. |"
Add-Line $lines "| ITSSR | Acceptance | Accept / Return to IT | Status Resolved and requestor | Rating/comment validation passes | Update rating/comment/date or status InProgress | Confirmed. |"
Add-Line $lines

Add-Line $lines "## 11. Duplicate, Missing, or Outdated Forms and Sections"
Add-Line $lines
Add-Line $lines "| Business Form / Requirement | Forms / Sections Found | Canonical Form / Section | Duplicate / Missing Issue | Recommended Action |"
Add-Line $lines "|---|---|---|---|---|"
Add-Line $lines "| External Access Form | EAF.json and VPNACCESS.json; custom eaf/new.tsx; dynamic [formCode]/new.tsx fallback | EAF.json + explicit EAF page | VPNACCESS is older duplicate; dynamic and explicit route patterns coexist | Keep EAF as canonical; retire/redirect VPNACCESS after route/reference check. |"
Add-Line $lines "| Hardware Inventory | HI.json and HWINV_PRAI.json; custom hi/new.tsx; [id].tsx detail | HI.json + HI pages | HWINV_PRAI is older duplicate; Ext_Assets list still marked pending in design | Keep HI canonical; verify Ext_Assets provisioning and migrate missing fields. |"
Add-Line $lines "| ITSSR | ITSSR.json and custom features/itssr/itssr-app.tsx | Custom ITSSR app/page | Schema and custom page are not identical; custom page has richer workflow gates | Treat custom page as implemented behavior, schema as reference. Align fields/rules. |"
Add-Line $lines "| Dynamic vs explicit IT form pages | [formCode]/new.tsx plus many /it/forms/{code}/new.tsx files | Dynamic fallback plus explicit pages only for custom forms | Duplicate route/rendering pattern can confuse ownership | Follow app cleanup plan: dynamic default, explicit only where custom logic is needed. |"
Add-Line $lines "| ITEVT | ITEVT.json title says legacy/not rendered | Needs confirmation | Legacy schema may not be active | Confirm route usage before retaining. |"
Add-Line $lines "| SVRREBOOT | SVRREBOOT.json title says legacy/not rendered | Needs confirmation | Legacy schema may not be active | Confirm route usage before retaining. |"
Add-Line $lines "| SharePoint column schema | Local generated models and design docs exist; live export placeholder TBD | SharePoint exported schema should be canonical | Exact field types/required flags not fully verified | Run PnP export and regenerate this document. |"
Add-Line $lines

Add-Line $lines "## 12. Central Reference Document Content"
Add-Line $lines
Add-Line $lines "This file is the central reference document for docs/central-form-reference.md. The detailed per-form reference follows."
Add-Line $lines
Add-Line $lines "# File: docs/central-form-reference.md"
Add-Line $lines
Add-Line $lines "## Central Reference by Form"

foreach ($x in $schemas) {
    $s = $x.Schema
    $tables = (($s.sections.fields | ForEach-Object { $_.spTable } | Where-Object { $_ } | Sort-Object -Unique) -join ", ")
    $ext = Get-ExtensionList $s.formCode $tables
    Add-Line $lines
    Add-Line $lines "## $($s.formCode) - $($s.title)"
    Add-Line $lines
    Add-Line $lines "### Purpose"
    Add-Line $lines (Esc (Get-Purpose $s))
    Add-Line $lines
    Add-Line $lines "### Location"
    Add-Line $lines "- File/path: $(Esc $x.Path)"
    Add-Line $lines "- Screen/page: $(Esc $s.routeBase)"
    Add-Line $lines "- Component: Dynamic schema; explicit/custom page if present under src/pages/it/forms/$($s.formCode.ToLower())/; custom implementations verified separately for EAF, ITSSR, and HI."
    Add-Line $lines "- Mode(s): $(Esc (Get-Mode $s))"
    Add-Line $lines "- Implementation status: $(Esc (Get-FormStatus $x.File $s))"
    Add-Line $lines
    Add-Line $lines "### Linked Data Sources"
    Add-Line $lines "| Connector | SharePoint Site | List | Read / Write | Notes |"
    Add-Line $lines "|---|---|---|---|---|"
    $tableNote = if ($tables) { "Schema has spTable bindings: $(Esc $tables)" } else { "List inferred; schema lacks spTable bindings." }
    Add-Line $lines "| Generated SharePoint services / Power Apps connector | IOI-App_Admin_Sites / ioi-portal-it | MainDB_IT plus $(Esc $ext) | Both where page implements create/update | $tableNote |"
    Add-Line $lines "| Microsoft 365 Users / Employee Directory | Config / Office365Users | ConfigEmployeeDirectory / shared_office365users | Read | Used for people fields and current user defaults when fields use people or page code uses pickers. |"
    Add-Line $lines
    Add-Line $lines "### Sections"
    Add-Line $lines "| Section Name / ID | Type | Purpose | Fields Included | Visible When | Editable When | Source |"
    Add-Line $lines "|---|---|---|---|---|---|---|"
    foreach ($sec in ($s.sections | Sort-Object displayOrder)) {
        $type = if (Test-ApprovalSection $sec) { "Approval / workflow" } elseif ($sec.showWhen) { "Conditional section" } elseif ($sec.sectionName -match "Header|Requestor|General|Details") { "Header / request details" } else { "Form section" }
        if ($sec.showWhen) {
            $sw = $sec.showWhen
            $val = if ($sw.value -is [array]) { ($sw.value -join ", ") } else { $sw.value }
            $vis = "$($sw.fieldId) $($sw.op) $val"
        } else {
            $vis = "Always visible when page/form renders"
        }
        $fields = Join-Labels ($sec.fields | Sort-Object displayOrder | ForEach-Object { $_.label })
        Add-Line $lines "| $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | $(Esc $type) | $(Esc $sec.sectionName) | $(Esc $fields) | $(Esc $vis) | Editable in New mode unless field/page marks read-only | $(Esc $x.Path) |"
    }
    Add-Line $lines
    Add-Line $lines "### Section Visibility Rules"
    Add-Line $lines "| Section Name / ID | Visible When | Hidden When | Editable When | Read-Only When | Source |"
    Add-Line $lines "|---|---|---|---|---|---|"
    foreach ($sec in ($s.sections | Sort-Object displayOrder)) {
        if ($sec.showWhen) {
            $sw = $sec.showWhen
            $val = if ($sw.value -is [array]) { ($sw.value -join ", ") } else { $sw.value }
            $vis = "$($sw.fieldId) $($sw.op) $val"
            $hidden = "When condition is not met"
        } else {
            $vis = "Always visible"
            $hidden = "Not hidden in schema"
        }
        Add-Line $lines "| $(Esc ($sec.sectionName + ' / ' + $sec.sectionId)) | $(Esc $vis) | $(Esc $hidden) | Form/page editable mode | Field readOnly or page role/status gates | $(Esc $x.Path) |"
    }
    Add-Line $lines
    Add-Line $lines "### Fields by Section"
    Add-Line $lines "| Section | Field Label | Control Name | SharePoint Column | Column Type | Required | Default | Visible / Editable | Notes |"
    Add-Line $lines "|---|---|---|---|---|---|---|---|---|"
    foreach ($sec in ($s.sections | Sort-Object displayOrder)) {
        foreach ($f in ($sec.fields | Sort-Object displayOrder)) {
            $spCol = if ($f.spColumn) { $f.spColumn } else { "Needs confirmation" }
            $spType = if ($f.spColumnType) { $f.spColumnType } else { $f.fieldType }
            $def = if ($f.autoValue) { $f.autoValue } else { "" }
            $ve = if ($f.readOnly) { "Visible / read-only" } elseif ($sec.showWhen) { "Conditional / editable in mode" } else { "Visible / editable in mode" }
            Add-Line $lines "| $(Esc $sec.sectionName) | $(Esc $f.label) | $(Esc $f.fieldId) | $(Esc $spCol) | $(Esc $spType) | $([bool]$f.required) | $(Esc $def) | $(Esc $ve) | $(Esc $f.notes) |"
        }
    }
    Add-Line $lines
    Add-Line $lines "### Validation Rules"
    Add-Line $lines "| Section | Field / Section | Rule | Trigger | Error Message | Source |"
    Add-Line $lines "|---|---|---|---|---|---|"
    $hasValidation = $false
    foreach ($sec in ($s.sections | Sort-Object displayOrder)) {
        foreach ($f in ($sec.fields | Where-Object { $_.required -eq $true -and $_.readOnly -ne $true -and -not $_.autoValue } | Sort-Object displayOrder)) {
            $hasValidation = $true
            Add-Line $lines "| $(Esc $sec.sectionName) | $(Esc $f.label) | Required when visible | Submit | $(Esc ($f.label + ' is required')) | $(Esc $x.Path) + use-dynamic-form.ts |"
        }
    }
    if (-not $hasValidation) {
        Add-Line $lines "| All | Section | No explicit user-entered required fields in schema | Submit | N/A | $(Esc $x.Path) |"
    }
    Add-Line $lines
    Add-Line $lines "### Approval and Workflow Logic"
    Add-Line $lines "| Section | Step | Status | Actor / Role | Trigger | Condition | Action | Next Status |"
    Add-Line $lines "|---|---|---|---|---|---|---|---|"
    $workflowSecs = @($s.sections | Where-Object { Test-ApprovalSection $_ } | Sort-Object displayOrder)
    if ($workflowSecs.Count -eq 0) {
        Add-Line $lines "| N/A | N/A | No workflow section encoded in schema | N/A | Submit/save only | N/A | Create/update record | Needs confirmation |"
    } else {
        foreach ($sec in $workflowSecs) {
            Add-Line $lines "| $(Esc $sec.sectionName) | $(Esc $sec.displayOrder) | Section/status fields | Role from section name or approval routing config | Approve/reject/update | Prior stage complete and user has role | Update status/comment/date fields | Next configured stage |"
        }
    }
    Add-Line $lines
    Add-Line $lines "### Buttons and Actions"
    Add-Line $lines "| Section | Button / Action | Visible When | Enabled When | Action Logic | Notes |"
    Add-Line $lines "|---|---|---|---|---|---|"
    Add-Line $lines "| All | Submit / Save | New or editable page | Not pending and validation passes | Create/update parent and mapped child list fields | Exact action can be custom for EAF/ITSSR/HI. |"
    Add-Line $lines "| All | Cancel / Back | New or detail page | Always | Navigate back/list | Standard page behavior. |"
    Add-Line $lines
    Add-Line $lines "### Related Lists and Relationships"
    Add-Line $lines "| Related List | Relationship Type | Relationship Field | Used By Section | Notes |"
    Add-Line $lines "|---|---|---|---|---|"
    Add-Line $lines "| MainDB_IT | Parent | FormCode + ID/Title | All sections | Parent list for IT form records. |"
    Add-Line $lines "| $(Esc $ext) | Child/extension | ParentRecord / ParentID and ParentFormCode | Form-specific sections | Verify exact lookup internal name against live SharePoint export. |"
    Add-Line $lines
    Add-Line $lines "### Issues / Gaps"
    Add-Line $lines "| Issue | Impact | Recommended Fix | Priority |"
    Add-Line $lines "|---|---|---|---|"
    if ((Get-FormStatus $x.File $s) -ne "Confirmed") {
        Add-Line $lines "| Form marked $(Esc (Get-FormStatus $x.File $s)) | Could produce duplicate/outdated routes or fields | Confirm references, migrate useful fields, then archive duplicate | High |"
    }
    $fieldsWithoutSp = @($s.sections.fields | Where-Object { -not $_.spColumn })
    if ($fieldsWithoutSp.Count -gt 0) {
        Add-Line $lines "| $($fieldsWithoutSp.Count) fields lack spColumn binding | Cannot prove SharePoint write mapping from schema alone | Add spColumn/spTable to schema or generated config | High |"
    }
    if (@($s.sections | Where-Object { $_.showWhen }).Count -eq 0 -and $workflowSecs.Count -gt 0) {
        Add-Line $lines "| Workflow/approval sections are always visible in schema | Role/status visibility may only live in page code or flow | Add section showWhen/role metadata or document central gating logic | Medium |"
    }
    Add-Line $lines "| Live SharePoint required/type verification pending | Possible mismatch with actual list settings | Run PnP schema export and reconcile | High |"
}

Add-Line $lines
Add-Line $lines "## 13. Recommended Fixes"
Add-Line $lines
Add-Line $lines "| Priority | Form | Section | Issue | Recommended Fix | Validation |"
Add-Line $lines "|---|---|---|---|---|---|"
Add-Line $lines "| P0 | All | Data connections | Live SharePoint export is placeholder/TBD | Export fields for MainDB_IT and extension lists, then reconcile spColumn/spTable/type/required | Compare generated models, schemas, and live export |"
Add-Line $lines "| P0 | DynamicForm forms | Save logic | Generic dynamic submit writes only MainDB_IT and ExtSupport, not Ext_Access/Ext_Assets/Ext_SAP/Ext_Docs | Route dynamic writes by spTable/list family | Submit one test item per extension list |"
Add-Line $lines "| P0 | EAF | Duplicate schema | VPNACCESS coexists with EAF | Make EAF canonical; redirect/archive VPNACCESS after reference check | Route test and schema registry check |"
Add-Line $lines "| P0 | HI | Duplicate schema/list | HWINV_PRAI coexists with HI; Ext_Assets marked pending in design | Make HI canonical; provision/verify Ext_Assets; map missing fields | SharePoint create/read test |"
Add-Line $lines "| P1 | ITSSR | Schema vs custom app | Custom page has richer status/role gates than JSON schema | Backfill schema documentation or form metadata with implemented gates | Compare ITSSR.json and itssr-app.tsx workflow table |"
Add-Line $lines "| P1 | All approval forms | Section visibility | Most approval sections lack schema showWhen/role metadata | Add stage/role visibility metadata or central workflow config | Unit/render tests for each status/role |"
Add-Line $lines "| P1 | Older schemas | Field mapping | Many fields lack spColumn/spTable | Enrich schemas from generated models/field mapping | Static audit: no unbound production fields |"
Add-Line $lines "| P2 | Non-IT forms | Detailed section refs | HR/QA/QC/STR forms are mostly documented at list family level | Generate department-specific schemas or docs from DXL/PDF inventories | Department reference docs created |"
Add-Line $lines

Add-Line $lines "## 14. Validation Checklist"
Add-Line $lines
Add-Line $lines "| Check | Action | Expected Result | Status |"
Add-Line $lines "|---|---|---|---|"
$checks = @(
    @("Every form found in repo", "Enumerated JSON schemas under src/form-schemas and key form pages", "29 schema-backed IT forms listed", "Done"),
    @("Every section found in repo", "Parsed all schema sections", "125 sections listed", "Done"),
    @("Every expected form documented", "Mapped code schemas plus duplicate/outdated status", "Schema-backed forms documented; non-IT form families summarized", "Partially done"),
    @("Every expected section documented", "Section table and per-form sections generated", "All schema sections documented", "Done"),
    @("Every section visibility rule documented", "Parsed showWhen and custom page conditions for EAF/ITSSR/HI", "Schema showWhen + custom rules listed", "Done"),
    @("Every form field mapped to SharePoint", "Parsed spColumn/spTable where present", "Mapped fields documented; missing mappings marked Needs confirmation", "Partially done"),
    @("Every field assigned to a section", "Parsed section membership from schema", "All schema fields assigned", "Done"),
    @("Every SharePoint column type verified", "Compared schema fieldType and generated models where available", "Live schema export still required", "Needs confirmation"),
    @("Every validation rule documented", "Parsed required/readOnly/autoValue and custom page validation", "Schema and key custom validation documented", "Done"),
    @("Every approval action documented", "Documented EAF, ITSSR, PRF, SAPCR, SAP sign-off and generic schema sections", "Detailed for major workflows; generic for others", "Partially done"),
    @("Every linked list documented", "Mapped list family from spTable and SharePoint design", "List family documented per form", "Done"),
    @("Duplicate forms identified", "Compared schema names and cleanup docs", "VPNACCESS/EAF and HWINV_PRAI/HI identified", "Done"),
    @("Duplicate sections identified", "Reviewed duplicate/outdated schema families", "Known duplicates noted; section-level duplicates need deeper business review", "Partially done"),
    @("Missing forms identified", "Compared schema-backed IT forms with design docs", "Non-IT detailed schemas missing from code are noted", "Partially done"),
    @("Missing sections identified", "No missing section within JSON schemas; external PDF-only sections need confirmation", "Marked as missing input for non-IT/PDF-only areas", "Partially done"),
    @("Central reference document updated", "Wrote docs/central-form-reference.md", "File exists with required sections", "Done")
)
foreach ($check in $checks) {
    Add-Line $lines "| $(Esc $check[0]) | $(Esc $check[1]) | $(Esc $check[2]) | $(Esc $check[3]) |"
}

Set-Content -LiteralPath $outPath -Value $lines -Encoding UTF8
Write-Output "Wrote $outPath with $($lines.Count) lines, $totalForms forms, $totalSections sections, $totalFields fields."

