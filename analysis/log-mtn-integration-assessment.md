# LOG/MTN — SharePoint & App Integration Assessment

> **Date**: 2026-06-01
> **Scope**: MainDB_LOG, MainDB_MTN integration completeness

---

## Integration Status Overview

| Layer | LOG | MTN | Status |
|---|---|---|---|
| **SharePoint List** | MainDB_LOG ✅ | MainDB_MTN ✅ | Created & provisioned |
| **List Columns** | 94 columns ✅ | 98 columns ✅ | All column definitions deployed |
| **power.config.json dataSources** | `maindb_log` ✅ | `maindb_mtn` ✅ | Both connection refs updated |
| **Local Schema File** `.power/schemas/` | ❌ Missing | ❌ Missing | **GAP** — needed for SDK |
| **Generated Model** | `main-dblog-model.ts` ✅ | `main-dbmtn-model.ts` ✅ | Full interface with all fields |
| **Generated Service** | `main-dblog-service.ts` ✅ | `main-dbmtn-service.ts` ✅ | Full CRUD |
| **Generated Hook** | `use-main-dblog.ts` ✅ | `use-main-dbmtn.ts` ✅ | React Query hooks |
| **Department Config** | `departments.ts` ✅ | ❌ **Missing** | LOG has full config; MTN/MAINT not registered |
| **Form Dropdown Config** | `LOG` ✅ | `MTN` ✅ | Present in `form-dropdown-config.ts` |
| **Routes** | `log-routes.tsx` ✅ | `maintenance-routes.tsx` ✅ | Routes exist |
| **Form Pages** | 7 pages (CSD, TI, ECMFB, FBN, POD, GTPW, TMI) ⚠️ | None ❌ | LOG uses mock data — no real SharePoint write |
| **TypeScript Compilation** | ✅ Passes | ✅ Passes | `tsc --noEmit` exits 0 |

---

## Gap 1: Missing Local Schema Files

**Severity**: 🔴 High
**Impact**: App cannot resolve column metadata for MainDB_LOG and MainDB_MTN without schema exports

**Required files** (in `.power/schemas/sharepointonline/`):
```
maindb_log.Schema.json   ← MISSING
maindb_mtn.Schema.json   ← MISSING
```

**Fix**: Export schemas from SharePoint via PnP PowerShell or add as data sources in Power Apps Studio.

---

## Gap 2: MTN/MAINT Department Not Registered

**Severity**: 🔴 High
**Impact**: Maintenance department has no config entry, no module definitions, no form pages

**Missing in `departments.ts`**:
- Department entry for `MAINT` (or `MTN`) with modules, icon, color
- Module definitions for MTN forms: FAR, MTNPLAN, MTNEMGNCY, EPI, PLANTMTN, CALIBRATION, TPM, EnMS, EE

**Current state**: `MECP` (MTN Emergency Change Procedure) form exists under another department. Maintenance routes (`maintenance-routes.tsx`) reference `departmentCode="MAINT"` but no MAINT entry exists in the department registry.

---

## Gap 3: LOG Forms Use Mock Data

**Severity**: 🟡 Medium
**Impact**: LOG form submissions don't persist to SharePoint

**Affected pages** (7 forms):
- `csd/new.tsx` — Container Shipment Database
- `ti/new.tsx` — Tanker Inspection
- `ecmfb/new.tsx` — ECM Forklift Breakdown
- `fbn/new.tsx` — Forklift Breakdown
- `pod/new.tsx` — Product Over/Short Delivery
- `gtpw/new.tsx` — Glycerine Tanker Periodic Washing
- `tmi/new.tsx` — Tanker Monthly Inspection

All use `await new Promise(setTimeout)` instead of calling `MainDBLOGService.create()`.

---

## Gap 4: Missing Form Schemas for Additional LOG Forms

**Severity**: 🟡 Medium
**Impact**: Some LOG forms identified in PDF analysis (WCC, Shunting Truck, IMDG, FJB) don't have form pages

**Missing forms** (not in routes or department config):
- WCC — Weekly Counter Check
- SHUNTINGTRUCK — Shunting Truck Service Records
- IMDG — IMDG Inspection Checklist
- FJBINSP — FJB Storage Tank Cleanliness (Johor)

---

## Gap 5: No Extension Lists Designed

**Severity**: 🟢 Low
**Impact**: If LOG or MTN forms need extension lists (like IT has Ext_Support, Ext_Access), these don't exist yet. Current wide-table design should suffice for MVP.

---

## Recommendations

| Priority | Action | Owner |
|---|---|---|
| P0 | Add `MAINT` department entry to `departments.ts` with modules and forms | Developer |
| P0 | Export `maindb_log.Schema.json` and `maindb_mtn.Schema.json` from SharePoint | Migration Agent |
| P1 | Wire LOG form pages to use `MainDBLOGService`/`useCreateMainDBLOG` instead of mock data | Developer |
| P1 | Create maintenance form pages (FAR, MTNPLAN, MTNEMGNCY, EPI) | Developer |
| P2 | Add missing LOG forms (WCC, Shunting Truck, IMDG, FJB) to department config and routes | Developer |
