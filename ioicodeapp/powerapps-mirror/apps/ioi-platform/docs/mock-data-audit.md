# Mock Data Audit

Date: 2026-05-25

## Disabled In This Pass

- `app-gen-sdk/data/index.ts`: local Power Apps data client no longer returns successful empty/mock data. It now fails clearly when the app is not running inside the Power Apps host.
- `src/generated/services/main-dbit-service.ts`: removed the unauthorized fallback to the in-memory `SharePointSubmissionService`.
- `src/hooks/use-live-approver-search.ts`: removed hardcoded approver/user search data. Until Microsoft Graph is connected, searches return no users.
- `src/hooks/use-realtime-notifications.ts` and `src/components/notifications-panel.tsx`: disabled simulated notifications.
- `src/pages/admin/panels/data-source-mapping-panel.tsx`: removed seeded demo data sources and randomized connection test results.
- `src/hooks/use-approval-workflow.ts`: removed the hardcoded approver directory and demo approval dashboard tasks.
- `src/services/sharepoint-submission-service.ts`: disabled mock IT submission storage at runtime.
- `src/services/hr-submission-service.ts`: disabled mock HR submission storage at runtime.
- `src/services/str-service.ts`: disabled mock STR submission and approval storage at runtime.
- `src/types/data-source-mapping.ts`: changed registry status from `in-memory/mock` to `sharepoint/pending`.

## Still Requires Real SharePoint/Data Mapping

These pages still contain hardcoded page-level demo arrays and should be connected to department SharePoint lists before being considered production-ready:

- LOG dashboard and CSD customer picker
- Warehouse dashboard
- Maintenance dashboard
- Finance dashboard
- Field worker dashboard
- Security forms index
- Sales dashboard
- QC dashboard
- QA dashboards and subpages for audits, defects, documents, training
- Multiple HR operational pages including backup staff, attendance, gift/donation, foreign workers, employee update, disciplinary, contract workers, manpower requisition, uniform request, typhoid database, training, surveys, job descriptions, staff requisition, interview pipeline, roster, internships, health record, and notice database
- MTR submissions
- IT hardware dashboard and individual EAF/NIR detail pages
- Legacy/page-level demo data still appears in the files listed by `rg -n "mock|MOCK|sample data|demo data" src/pages src/hooks`. These are not part of the canonical submission/detail/approval flow, but they must be mapped to real SharePoint lists before those department pages are production-ready.

The main IT generated SharePoint services now use the Power Apps connector path and do not silently fall back to mock records.
