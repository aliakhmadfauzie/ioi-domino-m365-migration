# FIX-005 ITSSR Section Logic Fix Report

| Item | Value |
|---|---|
| Date | 2026-06-02 |
| Form | ITSSR |
| Scope | Routed recipient vs confirmed assignee behavior for ITSSR list/detail sections |

## Finding

The ITSSR custom page was using `ITSSR_AssignedTo_Email` for the routed IT recipient on initial submission. That made a newly submitted case appear assigned, so the IT PIC list/detail section state could not correctly show `Routed / Not Assigned`.

## Fix

- Added live SharePoint column `ITSSR_SendTo_Email` to `MainDB_IT_Ext_Support`.
- Refreshed local SharePoint schema evidence; `.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json` now includes `ITSSR_SendTo_Email`.
- Added normalized model/service mapping `iTSSRSendToEmail <-> ITSSR_SendTo_Email`.
- Updated new ITSSR submissions to write routed PIC into `iTSSRSendToEmail`, not `iTSSRAssignedToEmail`.
- Kept `iTSSRAssignedToEmail` for confirmed assignment only when IT clicks Assign & Start.
- Added legacy read handling: submitted records that previously stored routed PIC in `ITSSR_AssignedTo_Email` and have no start date are displayed as routed/not assigned.
- Updated `ITSSR.json` and central form reference so `REQ_SendTo` points to `iTSSRSendToEmail`.

## Expected UAT Behavior

| State | Routed field | Assigned field | List/detail display |
|---|---|---|---|
| Submitted before IT starts | `ITSSR_SendTo_Email` populated | `ITSSR_AssignedTo_Email` blank | `Routed / Not Assigned` |
| After Assign & Start | `ITSSR_SendTo_Email` preserved | `ITSSR_AssignedTo_Email` current IT user | `Assigned` and status `InProgress` |

## Re-Audit Notes

Re-audit should create a new ITSSR request and confirm the Ext_Support child row has `ITSSR_SendTo_Email` populated while `ITSSR_AssignedTo_Email` is blank. Then click Assign & Start and confirm `ITSSR_AssignedTo_Email` is populated and the case moves to `PendingITPIC` / `InProgress`.
