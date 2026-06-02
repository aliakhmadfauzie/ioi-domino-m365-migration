# HR Capacity Human Confirmation Update

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-HUMAN-HR-CAPACITY-01 |
| Type | Human Confirmation Question Update |
| Priority | P0 |
| Department | HR |
| Form | CIR / MainDB_HR |

## Answer Recorded

`HR-CAPACITY-01` is answered on 2026-06-01 with **Option B**:

Move CIR form-specific `cir*` fields to a dedicated extension list instead of adding more columns to `MainDB_HR`.

## Resulting Design Direction

- Keep the selected lowercase `cir*` internal-name convention from `CIR-SCHEMA-01`.
- Do not add the CIR-specific `cir*` fields to the saturated `MainDB_HR` parent list.
- Use `MainDB_HR` for common parent metadata such as title, form code, submitter/status, and parent record identity.
- Provision the CIR fields on the existing CIR extension-list path: `MainDB_HR_Ext_Cafeteria`.
- Preserve existing legacy `cIR*` extension columns for compatibility; new CIR implementation work should target the lowercase `cir*` columns.

## Follow-Up Tasks

- `TASK-PROVISION-CIR-SCHEMA`: update to the Option B extension-list provisioning path and run/export `MainDB_HR_Ext_Cafeteria` schema evidence.
- `TASK-SYNC-SCHEMA-CIR`: remains blocked until the extension-list schema is captured/generated.
- `TASK-FIX-CIR-EXT-READWRITE`: required after schema generation so CIR new/detail/index pages write and read `cir*` fields through the extension list instead of the parent list.
- `TASK-RE-AUDIT-CIR`: remains blocked until schema sync and extension-list app read/write fixes are verified.
