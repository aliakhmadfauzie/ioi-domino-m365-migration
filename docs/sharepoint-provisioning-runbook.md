# SharePoint Provisioning Runbook

This runbook covers the core live app scope: IT, HR, QA/QC, FIN, PRD, SHE, STR, and the platform admin lists currently represented in the active app config.

## Provision Lists

Run a dry run first:

```powershell
.\scripts\Invoke-CoreSharePointProvisioning.ps1 -DryRun
```

Run the live provisioning pass with an account that can create lists and fields on the target sites:

```powershell
.\scripts\Invoke-CoreSharePointProvisioning.ps1
```

The script writes:

- `analysis/sharepoint-provisioning/sharepoint-list-audit-<timestamp>.csv`
- `analysis/sharepoint-provisioning/sharepoint-list-audit-<timestamp>.json`
- `analysis/sharepoint-provisioning/sharepoint-list-audit.latest.json`

## Update App Data Sources

After live provisioning, update `power.config.json` from the audit file:

```powershell
Set-Location .\ioicodeapp\powerapps-mirror\apps\ioi-platform
npm run power-config:apply-sharepoint-audit -- --dry-run
npm run power-config:apply-sharepoint-audit
```

Then audit the app config:

```powershell
npm run power-config:audit
```

The audit writes `analysis/power-config-audit.json` and reports placeholder GUIDs, non-GUID table names, duplicate data-source keys, and missing core data sources.

## Power Apps Studio Refresh

Power Apps Studio still needs to refresh the SharePoint data sources after GUIDs are in `power.config.json`:

1. Open the app in Studio.
2. Open the Data panel.
3. Refresh the SharePoint connector.
4. Confirm the new lists appear.
5. Save and publish.

This is required because the coding agent cannot add Canvas App data sources directly through Studio.

## Recommendation

Keep department lists on department sites. Use `IOI-App_Admin_Sites` only for platform administration lists such as user roles, route permissions, app settings, audit logs, and bug tracking.
