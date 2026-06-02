# Canvas YAML — Control Snippets

> Exported YAML snippets for reusable Canvas controls and components.
> Only add YAML that has been tested in Power Apps Studio.
> Follow the header convention from yaml-import-notes.md.
> Last updated: 2026-06-02

---

## Status: EMPTY

No YAML has been exported yet. The Canvas App has not been built.

This file will be populated when:
1. Power Apps Studio is opened
2. First components are built (starting with cmpLoadingState, cmpErrorState, cmpEmptyState)
3. YAML is exported from Studio and pasted here

---

## Placeholder: cmpLoadingState

```yaml
## cmpLoadingState
## Power Apps Version: TBD
## Exported: NOT YET
## Status: PLACEHOLDER — replace with actual Studio export when built

# Component: cmpLoadingState
# Properties:
#   - propIsVisible: Boolean
#   - propMessage: Text
#
# Internal controls:
#   - conLoading: Container (full-screen overlay)
#   - icoSpinner: Image/Icon (spinning indicator)
#   - lblLoadingMsg: Label
```

---

## Placeholder: cmpStatusBadge

```yaml
## cmpStatusBadge
## Power Apps Version: TBD
## Exported: NOT YET
## Status: PLACEHOLDER

# Component: cmpStatusBadge
# Properties:
#   - propStatus: Text ("Draft", "Submitted", "Under Review", "Approved", "Rejected", "Closed")
#   - propVariant: Text ("status" / "editRequest")
#
# Note: propStatus accepts SP Status.Value label strings — NOT TypeScript StatusKey codes
# Color mapping: fxStatusColor(propStatus) named formula
```

---

## Placeholder: cmpTextInputField

```yaml
## cmpTextInputField
## Power Apps Version: TBD
## Exported: NOT YET
## Status: PLACEHOLDER

# Component: cmpTextInputField
# Properties:
#   - propLabel: Text
#   - propValue: Text
#   - propDisplayMode: Text ("Edit" / "View")
#   - propIsRequired: Boolean
#   - propMaxLength: Number
#   - propPlaceholder: Text
# Output:
#   - outValue: Text
```
