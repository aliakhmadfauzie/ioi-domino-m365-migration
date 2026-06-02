# Autonomous SharePoint Audit Runner

This folder contains a read-only scheduled runner for the IOI SharePoint integration audit prompt.

## Files

- `prompt.md` - the audit prompt copied from the pasted text attachment.
- `sources.json` - the changing source set passed into each run.
- `config.json` - model, folder, and safety settings.
- `run-sharepoint-audit.ps1` - gathers sources and calls the OpenAI Responses API.
- `install-scheduled-task.ps1` - installs a Windows Scheduled Task that runs every 15 minutes.
- `outputs/` - generated audit reports.
- `logs/` - transcripts and request snapshots.

## One-Time Setup

Set `OPENAI_API_KEY` for the Windows user that will run the scheduled task.

```powershell
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "YOUR_KEY", "User")
```

Open a new PowerShell window after setting the variable.

## Test Without Calling The API

```powershell
pwsh -NoProfile -File .\run-sharepoint-audit.ps1 -DryRun
```

## Run Once

```powershell
pwsh -NoProfile -File .\run-sharepoint-audit.ps1
```

## Install Every-15-Minute Schedule

```powershell
pwsh -NoProfile -File .\install-scheduled-task.ps1
```

## Change Sources

Edit `sources.json`. Keep `source/`, `.github/`, generated folders, and schema exports read-only unless repo governance says otherwise.
