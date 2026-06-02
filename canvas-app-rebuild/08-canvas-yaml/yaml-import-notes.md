# Canvas YAML Import Notes

> How to export, import, and version Canvas App YAML in Power Apps Studio.
> Last updated: 2026-06-02

---

## What is Canvas YAML?

Power Apps Canvas Apps support a code view (YAML format) that represents controls, components, and screens. You can:
- Export YAML from Power Apps Studio to version control
- Import YAML snippets to replicate controls across screens
- Use YAML to document component structure

---

## How to Export YAML from Power Apps Studio

1. Open your Canvas App in edit mode at make.powerapps.com
2. Select any control, component, or screen in the tree view
3. In the ribbon: `View` → `Code view` (or press `Ctrl+E`)
4. The code panel shows the YAML for the selected item
5. Copy the YAML text
6. Paste into the relevant file in `08-canvas-yaml/`

---

## How to Import YAML into Power Apps Studio

1. Open your Canvas App in edit mode
2. Click on the target screen or container in the tree view
3. In the ribbon: `Insert` → `Code` (or paste directly in the code view pane)
4. Power Apps will parse and render the YAML as controls
5. Review for any error markers (red underlines indicate property issues)

---

## YAML File Conventions

Each YAML snippet file should use this header:

```
## [ComponentName or ScreenName]
- Power Apps Version: [e.g. 3.x or latest]
- Exported: [YYYY-MM-DD]
- Status: DRAFT / TESTED / CONFIRMED
- Notes: [any special instructions]
```

---

## Important YAML Rules

1. **Do not hand-write YAML without testing in Studio first** — YAML parsing is strict; untested YAML may break app imports
2. **Version snippets** — do not overwrite; append new versions with date
3. **Label exported YAML** with the component name, Power Apps version, and export date
4. **Property names are case-sensitive** in YAML — use exact property names from Studio

---

## Component vs. Screen YAML

| YAML Type | What to Export | File |
|---|---|---|
| Control snippet | Individual control (e.g. a Button or Label) | `yaml-control-snippets.md` |
| Component | Full component definition (from Components tab) | `yaml-control-snippets.md` (label as component) |
| Screen | Full screen definition including all controls | `yaml-screen-snippets.md` |

---

## Version Control Note

The Canvas App `.msapp` file (Power Apps packaged format) is binary and cannot be diffed in Git.
Use the YAML export in this folder as the human-readable version control record.
Export key components and screens after every significant build session.
