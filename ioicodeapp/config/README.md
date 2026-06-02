# IOI Environment Configuration

This folder centralizes all environment-specific IDs (tenant, client, SharePoint GUIDs)
so every script and tool can reference one source of truth.

## Files

| File | Purpose | Committed? |
|------|---------|------------|
| `environment-config.template.ps1` | Template with all variable names — copy to create your local config | ✅ Yes |
| `environment-config.template.json` | JSON version of the same config | ✅ Yes |
| `environment-config.ps1` | **Your local config** — fill in actual IDs | ❌ No (in `.gitignore`) |
| `environment-config.json` | JSON version for TypeScript tools | ❌ No (in `.gitignore`) |
| `README.md` | This file | ✅ Yes |

## Quick Start

### 1. Copy the template

```powershell
copy .\environment-config.template.ps1 .\environment-config.ps1
```

### 2. Fill in your IDs

Open `environment-config.ps1` and fill in:

| Variable | Where to find it |
|----------|-----------------|
| `IOI_TENANT_ID` | Azure Portal → Entra ID → Overview → Tenant ID |
| `IOI_PNP_CLIENT_ID` | Create an App Registration in Entra ID → Client ID |
| `IOI_DS_MAIN_IT_JHR` | After adding MainDB_IT_JHR as data source in Power Apps Studio |

### 3. Create the Entra ID App Registration

For PnP.PowerShell automation, you need an App Registration:

1. Go to [Entra ID App Registrations](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/)
2. Click **New registration**
   - Name: `IOI PnP Automation`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI (optional): `https://ioioi.sharepoint.com`
3. Click **Register**
4. Copy the **Application (client) ID** → paste into `IOI_PNP_CLIENT_ID`
5. Under **API permissions**:
   - Click **Add a permission** → **SharePoint** → **Sites.FullControl.All**
   - Click **Grant admin consent**
6. Under **Certificates & secrets** → **Client secrets** → **New client secret**
   - (Optional: only needed for non-interactive automation)

### 4. Use in scripts

```powershell
# At the top of any PowerShell script:
$configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
if (Test-Path $configPath) { . $configPath }

# Now use variables:
Connect-PnPOnline -Url $script:IOI_SHAREPOINT_IT_URL -Interactive -ClientId $script:IOI_PNP_CLIENT_ID

# Or use the helper:
$cfg = Get-IOIConfig
Connect-PnPOnline -Url $cfg.SharePointITUrl -Interactive -ClientId $cfg.PnPClientId
```

## Secrets Safety

- `environment-config.ps1` and `environment-config.json` are in `.gitignore`
- **Never commit** files containing real secrets to Git
- Only the `.template.*` files are committed
- If you accidentally commit secrets, rotate them immediately
