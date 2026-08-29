# SharePoint Write Button Audit

App root: `powerapps-mirror/apps/ioi-platform`

Note: the app uses `HashRouter`, so screen paths normally appear in the browser as `/#/path`.

## Submit / Draft Buttons

| Button / action | Screen path | File path | SharePoint list/table | Columns / fields triggered |
|---|---|---|---|---|
| IT generic Save Draft / Submit | `/#/it/forms/new-request` | `src/pages/it/forms/new-request.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `environmenttagKey`, `siteKey`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| Dynamic IT form submit | `/#/it/forms/:formCode/new` | `src/pages/it/forms/[formCode]/new.tsx`; `src/hooks/use-dynamic-form.ts` | `MainDB_IT`; optional `maindb_it_ext_support` | `Title`, `FormCode`, `CurrentStatus`, `Requestor_Email`, `SubmittedDate`, `WorkflowStage`, `Remarks`, schema `spColumn` fields |
| ITSSR submit intake | `/#/it/forms/itssr/new` | `src/features/itssr/itssr-app.tsx` | `maindb_it`, `maindb_it_ext_support`, `MainDBITExtDocs` | `title`, `currentStatus`, `formcode`, `siteKey`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks`, ITSSR ext-support fields, document fields |
| EAF submit | `/#/it/forms/eaf/new`; alias `/#/it/forms/vpn/new` | `src/pages/it/forms/eaf/new.tsx` | `maindb_it`, `MainDBITExtAccess` | Parent status/workflow/requestor fields; ext access `eAF*`, `parentFormCode`, `parentRecord` |
| HWRR submit | `/#/it/forms/hwrr/new` | `src/pages/it/forms/hwrr/new.tsx` | `maindb_it`, `MainDBITExtAssets` | Parent HWRR payload; ext asset HWRR fields |
| ITSC submit | `/#/it/forms/itsc/new` | `src/pages/it/forms/itsc/new.tsx` | `maindb_it`, `MainDBITExtAssets` | Parent `ITSC` fields; ext asset `iTSC*` fields |
| SAPTR submit | `/#/it/forms/saptr/new` | `src/pages/it/forms/saptr/new.tsx` | `maindb_it`, `MainDBITExtSAP` | Parent SAPTR fields; ext SAP `sAPTR*` fields |
| SAPAMR submit | `/#/it/forms/sapamr/new` | `src/pages/it/forms/sapamr/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SAPCA submit | `/#/it/forms/sapca/new` | `src/pages/it/forms/sapca/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `siteKey`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SAPCR submit | `/#/it/forms/sapcr/new` | `src/pages/it/forms/sapcr/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `siteKey`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SAPDRP submit | `/#/it/forms/sapdrp/new` | `src/pages/it/forms/sapdrp/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SAPSLCF submit | `/#/it/forms/sapslcf/new` | `src/pages/it/forms/sapslcf/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SAPSOF2 submit | `/#/it/forms/sapsof2/new` | `src/pages/it/forms/sapsof2/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `siteKey`, `requestoremail`, `submitteddate`, approval/test evidence metadata in `remarks` |
| PRF submit / draft | `/#/it/forms/prf/new` | `src/pages/it/forms/prf/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, PRF-specific columns/remarks |
| HI submit / draft | `/#/it/forms/hi/new`; alias `/#/it/forms/hi_jhr/new` | `src/pages/it/forms/hi/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, HI-specific columns/remarks |
| MPSPRN submit / draft | `/#/it/forms/mpsprn/new` | `src/pages/it/forms/mpsprn/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, printer fields/remarks |
| SRR submit | `/#/it/forms/srr/new` | `src/pages/it/forms/srr/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| NIR submit | `/#/it/forms/nir/new` | `src/pages/it/forms/nir/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, NIR fields |
| ITDR submit | `/#/it/forms/itdr/new` | `src/pages/it/forms/itdr/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| ITDR2 submit | `/#/it/forms/itdr2/new` | `src/pages/it/forms/itdr2/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SRL submit | `/#/it/forms/srl/new`; alias `/#/it/forms/ial1/new` | `src/pages/it/forms/srl/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| DCAL submit | `/#/it/forms/dcal/new`; alias `/#/it/forms/ial2/new` | `src/pages/it/forms/dcal/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| ITE submit | `/#/it/forms/ite/new`; alias `/#/it/forms/ial3/new` | `src/pages/it/forms/ite/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| SRVR submit | `/#/it/forms/srvr/new`; alias `/#/it/forms/ial4/new` | `src/pages/it/forms/srvr/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| ITINFO submit | `/#/it/forms/itinfo/new` | `src/pages/it/forms/itinfo/new.tsx` | `maindb_it`, `MainDBITExtDocs` | Parent `ITINFO`; docs `iTIDocumentName`, `iTIDocumentDescription`, `iTIRemarks` |
| TRNMAN submit | `/#/it/forms/trnman/new` | `src/pages/it/forms/trnman/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| ISGDOC submit | `/#/it/forms/isgdoc/new` | `src/pages/it/forms/isgdoc/new.tsx` | `maindb_it` | `title`, `formcode`, `currentStatus`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` |
| MRF standalone submit | `/#/it/forms/mrf/new` | `src/forms/mrf/MRFNewPage.tsx` | Target list from screen/action metadata | `Title`, requester fields, MRF fields, `WorkflowStage`, `IsLocked` |
| STR new Save Draft / Submit | `/#/str/new?form=...` | `src/pages/str/new.tsx` | `MainDB_STR` | `FormType`, `Site`, `EnvironmentTag`, `Department`, request details, status/workflow fields |
| STR MRF Save Draft / Submit | `/#/str/mrf/new` | `src/pages/str/mrf-form.tsx` | `MainDB_STR` | `FormType='MRFAPP'`, `Site`, `EnvironmentTag`, `Department`, MRF request fields, status/workflow fields |
| STR edit Save / Submit | `/#/str/edit/:id` | `src/pages/str/edit.tsx` | `MainDB_STR` | Existing STR fields, status/workflow fields |
| HR leave submit | `/#/hr/leave` | `src/pages/hr/leave.tsx` | `MainDB_HR` | `title`, `formcode='LVE'`, `statusKey`, `employeeid`, `employeename`, `submitteddate`, `description` |
| HR health submit | `/#/hr/health` | `src/pages/hr/health.tsx` | `MainDB_HR` | `title`, `formcode`, `employeeid`, `employeename`, health record fields |
| HR recruitment submit | `/#/hr/recruitment` | `src/pages/hr/recruitment.tsx` | `MainDB_HR` | `title`, `formcode`, `statusKey`, employee/request details |
| Finance submit / draft | `/#/fin/forms/:formCode/new` | `src/pages/finance/forms/new.tsx` | `MainDB_FIN` | `title`, `formCode`, `departmentKey`, `statusKey`, `currentStage`, `siteKey`, `submittedOn`, `requestorEmail`, `description` |
| Production submit / draft | `/#/production/forms/:formCode/new` | `src/pages/production/forms/new.tsx` | `MainDB_PRD` | `title`, `formCode`, `formReferenceID`, `currentStage`, `siteKey`, `submittedOn`, `requestorEmail`, `departmentKey`, `statusKey`, `description` |
| SHE submit / draft | `/#/she/forms/:formCode/new` | `src/pages/she/forms/new.tsx` | `MainDB_SHE` | `title`, `formCode`, `currentStage`, `siteKey`, `submittedDate`, `requestorEmail`, `priorityKey`, `departmentKey`, `statusKey`, `requestTitle` |

## Approval / Status Buttons

| Button / action | Screen path | File path | SharePoint list/table | Columns / fields triggered |
|---|---|---|---|---|
| Approve / Reject / Return | `/#/approvals` | `src/pages/approvals.tsx` | `ApprovalRecords`, `maindb_it` | Approval row `stagename`, `formid`, `formcode`, `actionbyid`, `actiondate`, `decision`, `comments`; submission `currentStatus` |
| Batch Approve / Reject / Return | `/#/batch-approvals` | `src/pages/batch-approvals.tsx` | `ApprovalRecords`, `maindb_it` | Same as approval action, repeated for selected submissions |
| Manager approve / reject / return | `/#/manager-dashboard` | `src/pages/manager-dashboard.tsx` | `maindb_it` | `currentStatus`, `remarks` |
| IT approval context approve / reject / return | Used by IT approval flows | `src/contexts/it-approval-context.tsx` | `maindb_it` | `currentStatus`, `remarks`, workflow metadata inside `remarks` |
| HWRR approve / reject workflow | `/#/it/forms/hwrr/:id`; canonical `/#/submissions/:id` | `src/pages/it/forms/hwrr/[id].tsx` | `maindb_it` | `remarks`, `currentStatus` |
| ITSSR triage / assign / resolve / accept / return | `/#/it/forms/itssr/:id` | `src/features/itssr/itssr-app.tsx` | `maindb_it`, `maindb_it_ext_support`, optional `MainDBITExtDocs` | Status/workflow, `remarks`, assignment, started/resolved/accepted dates, solution, classification, support method, rating/comment |
| ITSSR detail status actions | `/#/it/forms/itssr/:id` | `src/pages/it/forms/itssr/detail.tsx` | `maindb_it` | `remarks`, `currentStatus` |
| Withdraw / Cancel Request | `/#/submissions/:id` | `src/pages/submissions/[id].tsx` | `maindb_it` | `currentStatus='CurrentstatusKey6'`, `remarks.withdrawnAt`, `remarks.withdrawReason`, `remarks.cancelledAt`, `remarks.cancelReason` |
| Edit request submit / approve / reject / complete | `/#/submissions/:id` and edit-request approval panel | `src/hooks/use-edit-request.ts`; `src/components/workflow/edit-request-approval-panel.tsx` | `maindb_it` | `remarks.editState`, `remarks.editRequest`, `remarks.editHistory`, `islocked` |
| STR approve / reject / return | `/#/str/approve/:id` | `src/pages/str/approve.tsx` | `MainDB_STR` | STR status/workflow/approval fields through STR submission service |
| HR leave approve / reject | `/#/hr/leave` | `src/pages/hr/leave.tsx` | None found | UI toast only; no SharePoint update found in handler |

## Admin / Configuration Buttons

| Button / action | Screen path | File path | SharePoint list/table | Columns / fields triggered |
|---|---|---|---|---|
| Save / delete IT user role | `/#/admin/workflow` | `src/pages/admin/workflow-matrix.tsx` | `User_Roles_IT` | `title`, `userEmail`, `userDisplayName`, role fields; delete by ID |
| Save / toggle / delete routing rule | Admin routing screen | `src/pages/admin/routing-matrix.tsx` | `IT_RoutingMatrix` | Routing rule fields, `isActive`; delete by ID |
| Approval routing save / toggle / delete | `/#/admin` panel | `src/pages/admin/panels/approval-routing-panel.tsx` | `IT_RoutingMatrix` | Rule fields, `isActive`; delete by ID |
| Workflow management save / toggle / delete | `/#/admin` panel | `src/pages/admin/panels/workflow-management-panel.tsx` | `IT_RoutingMatrix` | Stage/routing fields, `isActive`; delete by ID |
| Route permissions save / delete | `/#/admin` panel | `src/pages/admin/panels/route-permissions-panel.tsx` | `RoutePermissions` | Route permission fields; delete by ID |
| Form registry save / delete | `/#/admin` panel | `src/pages/admin/panels/form-registry-panel.tsx` | `ITForms` | Form registry fields; delete by ID |
| System settings save / toggle / delete | `/#/admin` panel | `src/pages/admin/panels/system-settings-panel.tsx` | `AppSettings` | `title`, `settingKey`, `settingValue`; boolean toggle writes `settingValue` |
| User profiles save / toggle / delete | `/#/admin` panel | `src/pages/admin/panels/user-profiles-panel.tsx` | `UserProfiles` | Profile fields, `isActive`; delete by ID |
| User role assignment save / delete | `/#/admin` panel | `src/pages/admin/panels/user-roles-panel.tsx` | `Config_GlobalUserRoleAssignments` | Role assignment fields; delete by ID |

## Other SharePoint Write Buttons

| Button / action | Screen path | File path | SharePoint list/table | Columns / fields triggered |
|---|---|---|---|---|
| Submit bug report | Floating widget on all routes | `src/features/bug-tracker/feedback-widget.tsx`; `src/features/bug-tracker/use-bug-reports.ts` | `IssueAndBugTracker` | `title`, `issueDescription`, `priorityKey`, `statusKey`, metadata/comment fields |
| Bug admin status / priority update | `/#/bug-admin` | `src/pages/bug-admin.tsx` | `IssueAndBugTracker` | `statusKey` or `priorityKey`, `comment` metadata |
| HR attachment upload / delete | HR attachment UI / hooks | `src/hooks/use-attachments.ts` | `AttachmentIndex_HR` | Attachment metadata create; delete by ID |

