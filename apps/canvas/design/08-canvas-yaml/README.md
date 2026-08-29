# 08 — Canvas YAML Snippets

## Purpose
Canvas App YAML and code-view snippets exported from Power Apps Studio. Stores reusable control, component, and screen definitions that can be imported into the app or used as copy-paste references.

## What Belongs Here
- Exported YAML snippets for individual controls (`yaml-control-snippets.md`)
- Exported YAML for complete screen definitions (`yaml-screen-snippets.md`)
- Notes on how to export, import, and version YAML from Power Apps Studio (`yaml-import-notes.md`)

## What Does NOT Belong Here
- Draft Power Fx formulas not yet in YAML form (those go in `07-powerfx/`)
- Design documents or planning notes
- Component property tables (those go in `06-components/`)

## Source of Truth
- Power Apps Studio code view (YAML is exported directly from the Canvas App)
- Official Microsoft Power Apps YAML schema documentation

## Update Rules
- Only add YAML that has been tested in Power Apps Studio
- Label every snippet with: component/screen name, Power Apps version, date exported
- When a component is updated, add the new YAML as a new version — do not overwrite old versions
- Do not hand-write YAML without testing in Studio first; YAML errors break app imports

## How to Export YAML from Power Apps Studio
1. Select the control or screen in the Canvas App editor
2. Open the code view (... > Edit code)
3. Copy the YAML text
4. Paste into the relevant file here with a header showing name, version, and date
