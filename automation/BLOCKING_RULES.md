# Blocking Rules

## Build Blocking Rules

1. If a form build audit has any P0 issue, block the next form build.
2. If a form writes to the wrong SharePoint list, block next build.
3. If a form uses wrong internal column names, block next build.
4. If a non-approval form contains approval workflow, block next build.
5. If a workflow form has unverified routing logic, block full build.
6. If re-audit fails, keep dependent forms blocked.

## Source Analysis Blocking Rules

1. Do not promote extraction candidates without quality review.
2. Do not generate schema from unpromoted candidates.
3. Do not mark Unknown choice values as confirmed.
4. Do not mark signature boxes as approval unless workflow evidence exists.

## Schema Blocking Rules

1. Do not build forms without schema validation.
2. Do not build against schema with unresolved P0 blockers.
3. Do not use guessed SharePoint internal names.

## Automation Rule

The AI must always process the highest-priority unblocked task.
