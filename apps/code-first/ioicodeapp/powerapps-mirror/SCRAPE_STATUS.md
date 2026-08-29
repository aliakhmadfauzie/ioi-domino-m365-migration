# Scrape Status

The app structure was recursively discovered from the Power Apps file explorer and mirrored locally.

Real content was copied for:

- `apps/ioi-platform/src/app.tsx`
- `apps/ioi-platform/src/index.css`
- `apps/ioi-platform/src/main.tsx`
- `apps/ioi-platform/power.config.json`
- `apps/ioi-platform/src/config/*`
- `apps/ioi-platform/src/contexts/it-approval-context.tsx`
- `apps/ioi-platform/src/features/bug-tracker/*`
- `apps/ioi-platform/src/generated/components/*`

Warning:

The browser/Monaco scraping path is not reliable for large generated files. The generated hooks are being replaced from the verified `export-bundles/03-generated-hooks.txt` text bundle instead.
