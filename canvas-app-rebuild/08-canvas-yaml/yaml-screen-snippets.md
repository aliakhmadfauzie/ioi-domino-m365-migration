# Canvas YAML — Screen Snippets

> Exported YAML for complete Canvas screen definitions.
> Only add YAML that has been tested in Power Apps Studio.
> Last updated: 2026-06-02

---

## Status: EMPTY

No screens have been built yet. This file will be populated as screens are completed.

Export priority:
1. scrAccessDenied (simple; no SP dependency)
2. scrNotFound (simple)
3. scrHomeDashboard (after App.OnStart confirmed working)
4. scrFormList (after first gallery is built)
5. scrNewRequest (after all field components built — AWHR pilot)

---

## Screen Export Template

When a screen is exported, use this format:

```
## [ScreenName]
## Power Apps Version: [version]
## Exported: [YYYY-MM-DD]
## Status: DRAFT / TESTED / CONFIRMED
## Notes: [any context about this screen]
## Global Variables Used: [list gbl* vars]
## Collections Used: [list col* collections]
## Data Sources: [list SP lists]

[YAML content pasted here from Studio code view]
```
