# SharePoint Integration Audit — Completed 2026-05-31

## Key Findings

### Architecture
- Power Apps Code App using `app-gen-sdk` (generated service layer) to connect to SharePoint
- 53 SharePoint lists connected across IT, HR, STR, Finance, Production, SHE, QA departments
- Parent-child pattern: MainDB_IT → MainDB_IT_Ext_* (Access, Support, SAP, Assets, Docs)
- Choice fields use key-to-label maps (e.g., `CurrentstatusKey0` → 'Active')
- Site-aware service: `MainDBITSiteService` routes to Prai/Johor lists

### 3 Critical Issues Found
1. **EAFDetails reads NIR/PRF fields** — `submission-details/index.tsx` shows `s.nIRFullName`, `s.pRFITApprovedEmail` for EAF data. **Wrong data displayed.**
2. **HRSubmissionService is 100% mock** — All HR form submissions go to in-memory Map, not SharePoint.
3. **MainDB_IT_JHR and Ext_Policy** have placeholder GUIDs — Johor data isolation and policy storage broken.

### 8 High Issues
- EAF "System Name" reads `s.subject` instead of `eAFSystemName`
- EAF "IT Manager"/"Dept. Head" reads PRF fields
- Structured fields sidebar shows NIR/HI/PRF/RS fields for ALL forms unconditionally
- data-source-mapping.ts shows "mock" for all IT forms (misleading)
- Deprecated mock service re-exported in index.ts
- FormTypeKey labels all "Pending Configuration"
- ExtAccess service uses wrong DATA_SOURCE_NAME casing

### Report Location
`docs/sharepoint-integration-audit.md`
