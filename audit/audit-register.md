# Migration Audit Register

> Audit mode: create/update files under `audit/` only. Production app source, source evidence, mapping, and documentation files are read-only during audit.

## Register Summary

| Batch | Forms | Status | Started | Completed | Finding Files | Open Issues |
|---|---|---|---|---|---|---:|
| 1 | EAF, ITSSR, HI | Completed with issues | 2026-05-31 | 2026-05-31 | 3 | 6 |
| 2 | SAPCR, SAPAMR, SAPTR | Completed with issues | 2026-05-31 | 2026-05-31 | 3 | 7 |
| 3 | SAPCA, SAPDRP, SAPSLCF | Not Started |  |  |  |  |
| 4 | NIR, RS, UR | Not Started |  |  |  |  |
| 5 | ITSC, SFAR, DCALOG | Not Started |  |  |  |  |
| 6 | IOIPOL, ISGDOC, ITINFO | Not Started |  |  |  |  |
| 7 | ITDR, ITDR2, ITDAILYRPT | Not Started |  |  |  |  |
| 8 | PRF, INTUATSOF/SILOUATSOF, TRNMAN | Not Started |  |  |  |  |
| 9 | ITEVT, SVRREBOOT/SVRREC, PWDRESET | Not Started |  |  |  |  |
| 10 | MRF, MPSPRN | Not Started |  |  |  |  |

## Batch 1 Item Status

| Form Code | Form Name | Audit Status | Approval Classification | Finding File | Backlog IDs | Notes |
|---|---|---|---|---|---|---|
| EAF | External Access Form (VPN & Citrix) | Completed with issues | Approval Required | `audit/findings/batch-01/eaf.md` | AUD-B01-EAF-001, AUD-B01-EAF-002 | Missing/contradictory EAF extension fields and workflow status column names found. |
| ITSSR | IT Support & Service Request | Completed with issues | No Approval Required | `audit/findings/batch-01/itssr.md` | AUD-B01-ITSSR-001, AUD-B01-ITSSR-002 | IT routing PIC is not persisted on create; schema references columns not in generated model/schema. |
| HI | Hardware Inventory | Completed with issues | No Approval Required | `audit/findings/batch-01/hi.md` | AUD-B01-HI-001, AUD-B01-HI-002 | Create writes Ext_Assets but list/detail read MainDB_IT; schema table placement conflicts with implementation. |

## Batch 2 Item Status

| Form Code | Form Name | Audit Status | Approval Classification | Finding File | Backlog IDs | Notes |
|---|---|---|---|---|---|---|
| SAPCR | SAP & WB Change Request | Completed with issues | Approval Required | `audit/findings/batch-02/sapcr.md` | AUD-B02-SAPCR-001, AUD-B02-SAPCR-002 | Submit creates Request/Draft state; field storage and Ext_SAP schema coverage conflict. |
| SAPAMR | SAP Authorisation Matrix Review | Completed with issues | Approval Required | `audit/findings/batch-02/sapamr.md` | AUD-B02-SAPAMR-001, AUD-B02-SAPAMR-002 | TBV/TBA routing fields are not confirmed persisted; implementation relies on remarks JSON while schema is legacy. |
| SAPTR | SAP Transport Request | Completed with issues | Approval Required | `audit/findings/batch-02/saptr.md` | AUD-B02-SAPTR-001, AUD-B02-SAPTR-002, AUD-B02-SAPTR-003 | New submissions are marked Approved; list page uses sample data; Ext_SAP columns need live confirmation. |

## Next Not Started Item

Batch 3 starts with `SAPCA` unless business priority changes.
