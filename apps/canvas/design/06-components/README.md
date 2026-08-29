# 06 — Components

## Purpose
Canvas reusable component architecture. Defines all 53 Canvas App components — their purpose, input/output properties, usage rules, and which screens they appear on. Components must be designed before screens are finalized.

## What Belongs Here
- Full inventory of all 53 components with category, purpose, and build status (`component-inventory.md`)
- All input and output property specifications (`component-property-spec.md`)
- Map of which component is used on which screen (`component-usage-map.md`)

## What Does NOT Belong Here
- Power Fx formula code for the component internals (document those in `07-powerfx/` with a cross-reference)
- YAML snippets (those go in `08-canvas-yaml/`)
- Screen-level layout decisions

## Source of Truth
- Canvas App Rebuild Design Report — Phases 3, 6, 7 (Component Architecture, Property Spec, Internal Controls)
- Audit Report — Component audit section
- TSX components in `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/` — reference only

## Update Rules
- Mark each component BUILD_STATUS: DESIGNED / IN_PROGRESS / BUILT / TESTED
- Do not create duplicate components — extend or parameterize existing ones
- Every repeated UI pattern must be evaluated as a reusable component
- Build feedback/state components first, then shell, then field inputs, then form structure, then workflow

## Component Categories (53 total)
1. App Shell and Navigation (6): cmpAppShell, cmpAppHeader, cmpSideNav, cmpBreadcrumb, cmpCommandBar, cmpAccessGuard
2. List, Dashboard, and Card (8): cmpDashboardSummary, cmpStatusSummaryCards, cmpRequestCard, cmpRequestGallery, cmpRequestListToolbar, cmpFilterPanel, cmpSearchBox, cmpPaginationOrLoadMore
3. Form and Section (8): cmpCanonicalRequestForm, cmpFormSection, cmpSectionHeader, cmpFieldLabel, cmpRequiredIndicator, cmpValidationSummary, cmpFormModeBanner, cmpUnsavedChangesBanner
4. Field/Input (12): cmpTextInputField, cmpMultilineTextField, cmpChoiceField, cmpMultiChoiceField, cmpDateField, cmpNumberField, cmpCurrencyField, cmpYesNoField, cmpPeoplePicker, cmpLookupField, cmpReadOnlyField, cmpCalculatedFieldDisplay
5. Workflow and Approval (7): cmpStatusBadge, cmpWorkflowActionPanel, cmpApprovalPanel, cmpApprovalHistory, cmpApprovalCommentBox, cmpWorkflowTimeline, cmpAuditHistory
6. Attachment and Related Data (4): cmpAttachmentPanel, cmpRelatedChildItems, cmpChecklistItems, cmpRelatedRecordCard
7. Feedback and State (6): cmpLoadingState, cmpErrorState, cmpEmptyState, cmpSuccessMessage, cmpConfirmDialog, cmpWarningBanner
8. Admin (3): cmpAdminConfigPanel, cmpRoleMatrixViewer, cmpReferenceDataManager
