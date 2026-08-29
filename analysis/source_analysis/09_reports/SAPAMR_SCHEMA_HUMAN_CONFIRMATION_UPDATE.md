# SAPAMR Schema Human Confirmation Update

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-HUMAN-SAPAMR-SCHEMA |
| Type | Human Confirmation Question Update |
| Priority | P0 |
| Department | IT |
| Form | SAPAMR |

## Why Allowed

- `TASK-FIX-009` is blocked by missing SharePoint schema evidence.
- Captured `MainDB_IT` and `MainDB_IT_Ext_SAP` schemas do not confirm SAPAMR TBV/TBA routing columns.
- Blocking rules prohibit implementing mappings to guessed SharePoint internal names.

## Question Routed

`IT-SAPAMR-SCHEMA-01` is now the active P0 human/schema decision:

Should SAPAMR TBV/TBA routing fields be provisioned on `MainDB_IT`, provisioned on `MainDB_IT_Ext_SAP`, or kept only in `remarks` JSON with workflow/reporting risk accepted?

## Recommended Decision

Provision SAPAMR-specific routing fields on `MainDB_IT_Ext_SAP`, then export/regenerate schema evidence and update SAPAMR submit/read paths to create/read the extension child record.

This keeps `MainDB_IT` reserved for common parent metadata and keeps SAP-specific routing fields with SAP extension data.

## Result

Question routed. `TASK-FIX-009` remains blocked until a decision is answered and live/captured schema evidence exists.

## Queue Updates

- `TASK-HUMAN-SAPAMR-SCHEMA`: `Ready` -> `Complete - Question Routed`
- `TASK-FIX-009`: remains `Blocked`

## Next Recommended Task

Wait for an answer to `IT-SAPAMR-SCHEMA-01` before resuming SAPAMR implementation.
