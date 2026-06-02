# 11 — Risk and Issues

## Purpose
Tracks all open risks, active issues, and confirmed assumptions for the Canvas App migration. Every item in the audit report's Sections 3, 4, and 5 is seeded here.

## What Belongs Here
- All risks with probability, impact, and mitigation (`risk-register.md`)
- All active issues with severity, owner, and resolution date (`issue-log.md`)
- All confirmed assumptions with validation plan (`assumption-log.md`)

## What Does NOT Belong Here
- Resolved items — move to `completed-work.md` when resolved
- Design decisions (that goes in `00-project-control/decision-log.md`)
- Missing information items (those go in `00-project-control/missing-info-register.md`)

## Source of Truth
- Audit and Fact-Check Report — Sections 3 (Issues), 4 (Missing Info), 5 (Assumption Risks)
- `00-project-control/missing-info-register.md` — for MISSING_INFO items that are also risks

## Update Rules
- Add issues immediately when found during build — do not wait until end of session
- Every issue must have: ID, area, description, severity, owner, target resolution date
- When an issue is resolved, record the resolution and date — do not delete the row
- Review the risk register at the start of every build batch

## Severity Levels
- CRITICAL — will cause runtime failure if not resolved before build
- HIGH — will produce wrong results; must resolve before testing
- MEDIUM — affects quality or completeness; resolve before UAT
- LOW — improvement or documentation item; resolve before release
