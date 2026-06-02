# Batch Development Plan — Domino → M365 Migration

> **Purpose**: Organize 23+ forms into manageable batches of 3 for systematic audit, fix, and test cycles.
> **Batch Size**: 3 forms per cycle
> **Reference**: `docs/08_AUDIT_TEMPLATE.md` for output format, `docs/10_PROMPT_LIBRARY.md` for prompts

---

## Batch Workflow

For each batch of 3 forms:

```
1. DISCOVER  → Read source files, schemas, page code, SharePoint lists
2. AUDIT     → Run Prompt 2 (Form Audit) + Prompt 3 (SharePoint Audit) + Prompt 4 (Approval) + Prompt 5 (Visibility)
3. REPORT    → Output findings using `docs/08_AUDIT_TEMPLATE.md` format
4. APPROVE   → Wait for user to review and approve findings
5. FIX       → Run Prompt 7 (Fix Approved Issues) — only approved issues
6. DIFF      → Output exact changes made with file:line references
7. TEST      → Run Prompt 9 (Test Generation), then execute tests
8. DOCUMENT  → Run Prompt 10 (Documentation Update) for changed files
9. NEXT      → Move to next batch
```

**Rule: Do not modify files until findings are approved.**

---

## Batch Schedule

### Batch 1: High-Priority IT Forms (Current)
| # | Form Code | Form Name | Priority | Status | Notes |
|---|---|---|---|---|---|
| 1 | EAF | External Access Form (VPN & Citrix) | Highest | In Progress | 5-stage workflow, most complex approval |
| 2 | ITSSR | IT Support & Service Request | Highest | In Progress | 1788 existing docs, MVP candidate |
| 3 | HI | Hardware Inventory | High | In Progress | 58+ fields, standalone list |

### Batch 2: SAP Forms
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 4 | SAPCR | SAP & WB Change Request | High | Pending |
| 5 | SAPAMR | SAP Authorisation Matrix Review | High | Pending |
| 6 | SAPTR | SAP Transport Request | High | Pending |

### Batch 3: SAP Forms (continued)
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 7 | SAPCA | SAP Config Access | Medium | Pending |
| 8 | SAPDRP | SAP DRP | Medium | Pending |
| 9 | SAPSLCF | SAP Storage Location | Medium | Pending |

### Batch 4: Access & Identity Forms
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 10 | NIR | Notes ID Request | High | Pending |
| 11 | RS | Reset Password / Unlock ID | High | Pending |
| 12 | UR | User ID Request | Medium | Pending |

### Batch 5: Infrastructure Forms
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 13 | ITSC | IT Server Checklist | Medium | Pending |
| 14 | SFAR | Share Folder Access Requisition | Medium | Pending |
| 15 | DCALOG | Data Center Access Log | Low | Pending |

### Batch 6: Documentation & Policy Forms
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 16 | IOIPOL | IOI Policy | Low | Pending |
| 17 | ISGDOC | IT Procedures/Training | Low | Pending |
| 18 | ITINFO | IT Info | Low | Pending |

### Batch 7: Reporting Forms
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 19 | ITDR | IT Report | Medium | Pending |
| 20 | ITDR2 | IT Report v2 | Medium | Pending |
| 21 | ITDAILYRPT | IT Daily Report | Low | Pending |

### Batch 8: Remaining IT + Johor Forms
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 22 | PRF | Program Request Form | Medium | Pending |
| 23 | INTUATSOF / SILOUATSOF | IntuatSOF / SilouatSOF | Low | Pending |
| 24 | TRNMAN | Training Manuals | Low | Pending |

### Batch 9: Legacy & Johor IT
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 25 | ITEVT | IT Event Record (Legacy) | Low | Pending |
| 26 | SVRREBOOT / SVRREC | Server Reboot/Record (Legacy) | Low | Pending |
| 27 | PWDRESET | Password Reset (Legacy) | Low | Pending |

### Batch 10: MRF & MPSPRN
| # | Form Code | Form Name | Priority | Status |
|---|---|---|---|---|
| 28 | MRF | Material Requisition Form | Medium | Pending |
| 29 | MPSPRN | MPS Printer Request | Low | Pending |
| 30 | — | (Reserved for new form) | — | — |

---

## Batch Status Summary

| Batch | Forms | Priority | Audit | Fixes | Tests | Docs |
|---|---|---|---|---|---|---|
| 1 (EAF, ITSSR, HI) | 3 | Highest | ⬜ | ⬜ | ⬜ | ⬜ |
| 2 (SAP 1) | 3 | High | ⬜ | ⬜ | ⬜ | ⬜ |
| 3 (SAP 2) | 3 | Medium | ⬜ | ⬜ | ⬜ | ⬜ |
| 4 (Access) | 3 | High | ⬜ | ⬜ | ⬜ | ⬜ |
| 5 (Infra) | 3 | Medium | ⬜ | ⬜ | ⬜ | ⬜ |
| 6 (Docs/Policy) | 3 | Low | ⬜ | ⬜ | ⬜ | ⬜ |
| 7 (Reports) | 3 | Medium | ⬜ | ⬜ | ⬜ | ⬜ |
| 8 (PRF + Others) | 3 | Medium | ⬜ | ⬜ | ⬜ | ⬜ |
| 9 (Legacy IT) | 3 | Low | ⬜ | ⬜ | ⬜ | ⬜ |
| 10 (MRF + Extra) | 2 | Medium | ⬜ | ⬜ | ⬜ | ⬜ |

---

## Per-Batch Checklist

Before moving to next batch:

- [ ] All 3 forms audited (Prompt 2)
- [ ] SharePoint integration verified (Prompt 3)
- [ ] Approval classification documented (Prompt 4)
- [ ] Section visibility documented (Prompt 5)
- [ ] Findings reported to user for approval
- [ ] Approved fixes applied (Prompt 7)
- [ ] Diff summary provided
- [ ] Test cases generated and executed (Prompt 9)
- [ ] Documentation updated (Prompt 10)
- [ ] `docs/change-log.md` updated
- [ ] `docs/central-form-reference.md` updated if schema changed
- [ ] TypeScript compiles clean (`tsc --noEmit` exits 0)
- [ ] Vite build succeeds

---

## Notes

- **Batches can be reordered** based on business priority
- **Non-IT departments** (HR, QA/QC, STR, Finance, SHE, Production) are out of scope for initial batches — they use the same app architecture but have separate SharePoint lists and will be batched separately
- **Johor forms** (Batch 9) use `MainDB_IT_JHR` and may need separate connection configuration
- **Legacy forms** (ITEVT, SVRREBOOT, PWDRESET) have custom page components, not DynamicForm — they need special handling per `docs/app-repo-cleanup-plan.md`
