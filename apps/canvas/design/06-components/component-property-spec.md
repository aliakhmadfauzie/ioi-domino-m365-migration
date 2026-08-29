# Component Property Specification

> Input and output properties for all 53 Canvas App components.
> Source: Canvas App Rebuild Design Report — Sections 6 and 7
> Last updated: 2026-06-02

---

## Property Naming Convention

| Type | Pattern | Example |
|---|---|---|
| Input property | `prop<Name>` | `propCurrentStatus`, `propFormMode` |
| Output property | `out<Name>` | `outActionSelected`, `outSelectedUser` |

---

## Key Component Properties (Selected — full list in design report)

### cmpStatusBadge

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propStatus` | Text | YES | "" | SP Status.Value string: "Draft", "Submitted", "Under Review", "Approved", "Rejected", "Closed" |
| `propVariant` | Text | No | "status" | "status" / "editRequest" / "formCode" |

**Note:** propStatus accepts SP label text ("Draft"), NOT TypeScript key codes ("StatusKey0").

---

### cmpRequestCard

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propTitle` | Text | YES | "" | Record title or description |
| `propStatus` | Text | YES | "" | Status label for cmpStatusBadge |
| `propSubmittedBy` | Text | No | "" | Submitter display name |
| `propDate` | DateTime | No | Blank | Submission or last update date |
| `propFormCode` | Text | No | "" | Form code chip |
| `propRecordID` | Number | No | 0 | SP ID for navigation |

---

### cmpRequestGallery

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propItems` | Table | YES | — | Collection of records (colRequests) |
| `propEmptyMessage` | Text | No | "No records found" | Empty state message |
| `propIsLoading` | Boolean | No | false | Show loading state |
| `propLayout` | Text | No | "cards" | "cards" or "table" |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outSelectedRecord` | Record | Record tapped in gallery |

---

### cmpCanonicalRequestForm

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propFormCode` | Text | YES | "" | Active form code |
| `propFormMode` | Text | YES | "View" | "New", "Edit", "View", "Approve" |
| `propRecord` | Record | No | Blank | Bound SP record for Edit/View |
| `propCurrentUserRoles` | Table | YES | — | colUserRoleAssignments |

---

### cmpFormSection

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propSectionTitle` | Text | YES | "" | Section heading |
| `propIsVisible` | Boolean | YES | true | Whether section is shown |
| `propIsEditable` | Boolean | No | false | Whether content is editable |
| `propIsCollapsed` | Boolean | No | false | Initial collapse state |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outIsCollapsed` | Boolean | Current collapse state |

---

### cmpTextInputField

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propLabel` | Text | YES | "" | Field display label |
| `propValue` | Text | No | "" | Current value |
| `propDisplayMode` | Text | No | "Edit" | "Edit" or "View" |
| `propIsRequired` | Boolean | No | false | Show required asterisk |
| `propMaxLength` | Number | No | 255 | Max characters |
| `propPlaceholder` | Text | No | "" | Placeholder text |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outValue` | Text | Current input value for Patch |

---

### cmpPeoplePicker

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propLabel` | Text | YES | "" | Field label |
| `propSelectedUser` | Record | No | Blank | Pre-selected {Email, DisplayName} |
| `propDisplayMode` | Text | No | "Edit" | "Edit" or "View" |
| `propIsRequired` | Boolean | No | false | Required |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outSelectedUser` | Record | {Email, DisplayName, JobTitle} from Office365Users |

---

### cmpWorkflowActionPanel

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propCurrentStatus` | Text | YES | "" | SP Status.Value ("Submitted", "Under Review") |
| `propCurrentUserRoles` | Table | YES | — | colUserRoleAssignments |
| `propFormCode` | Text | YES | "" | Form code for action routing |
| `propRecordID` | Number | YES | 0 | SP record ID |
| `propAllowDelegate` | Boolean | No | false | Show delegate action |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outActionTaken` | Text | Action selected ("Approve", "Reject", "Return") |
| `outActionComment` | Text | Comment from cmpApprovalCommentBox |

---

### cmpApprovalCommentBox

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propIsRequired` | Boolean | No | false | Require comment (true for Reject/Return) |
| `propPlaceholder` | Text | No | "" | Placeholder text |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outComment` | Text | Current comment text |

---

### cmpRelatedChildItems

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propParentID` | Number | YES | 0 | Parent SP record ID |
| `propChildListName` | Text | No | "" | Child SP list name (for ChildList mode) |
| `propStoragePattern` | Text | YES | "ChildList" | "ChildList" or "JSON" |
| `propJSONFieldValue` | Text | No | "" | JSON string value (for JSON mode) |
| `propColumns` | Table | YES | — | Column definitions {InternalName, Label, Type} |
| `propDisplayMode` | Text | No | "View" | "Edit" or "View" |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outItems` | Table | Current state of editable rows |

---

### cmpFilterPanel

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propStatusOptions` | Table | No | — | {Key: "StatusKey1", Label: "Submitted"} table |
| `propDeptOptions` | Table | No | — | Department options |
| `propIsOpen` | Boolean | No | false | Panel expanded state |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outSelectedStatus` | Text | Selected status filter value (SP Status.Value label) |
| `outSelectedDept` | Text | Selected dept filter value |
| `outDateFrom` | DateTime | Date range start |
| `outDateTo` | DateTime | Date range end |

---

### cmpConfirmDialog

**Input:**
| Property | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `propTitle` | Text | YES | "" | Dialog title |
| `propMessage` | Text | YES | "" | Confirmation message |
| `propIsOpen` | Boolean | YES | false | Show/hide |
| `propConfirmLabel` | Text | No | "Confirm" | Confirm button label |

**Output:**
| Property | Type | Purpose |
|---|---|---|
| `outConfirmed` | Boolean | True when user clicks confirm |
