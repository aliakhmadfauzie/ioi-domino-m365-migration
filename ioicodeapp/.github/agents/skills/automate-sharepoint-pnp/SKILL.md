---
name: automate-sharepoint-pnp
description: Automates SharePoint tasks using PnP PowerShell. Use for list creation, column management, site configuration, and bulk data operations.
user-invocable: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash, LSP, TaskCreate, TaskUpdate, TaskList, TaskGet, AskUserQuestion, Skill
model: sonnet
---

**📋 Shared Instructions: [shared-instructions.md](../../shared/shared-instructions.md)** - Cross-cutting concerns.

# Automate SharePoint with PnP

Skill for automating SharePoint Online administration and configuration using PnP PowerShell.

## Workflow

### Step 1: Validate Prerequisites
Ensure PnP PowerShell is installed and the user has the necessary permissions.

```powershell
Get-Module -ListAvailable PnP.PowerShell
```
If not found: `Install-Module PnP.PowerShell -Scope CurrentUser`

### Step 2: Connect to Site
Connect to the target SharePoint site.

```powershell
$siteUrl = "https://yourtenant.sharepoint.com/sites/yoursite"
Connect-PnPOnline -Url $siteUrl -UseWebLogin
```

### Step 3: Identify Task
Determine what needs to be automated:
- **List Management**: Create lists, update settings.
- **Schema Management**: Add/Update columns (fields), content types, views.
- **Data Operations**: Bulk upload, item updates, file management.
- **Site Configuration**: Navigation, permissions, regional settings.

### Step 4: Execute Automation
Run the appropriate PnP cmdlets. Use idempotent patterns (check if exists before creating).

#### Example: Add a Column
```powershell
$listName = "MyList"
$fieldName = "ProjectStatus"
$fieldDisplayName = "Project Status"
$choices = @("Not Started", "In Progress", "Completed")

$existing = Get-PnPField -List $listName -Identity $fieldName -ErrorAction SilentlyContinue
if (-not $existing) {
    Add-PnPField -List $listName -DisplayName $fieldDisplayName -InternalName $fieldName -Type Choice -Choices $choices
    Write-Host "Field added."
}
```

#### Example: Create a List
```powershell
$listName = "ProjectTracking"
$existingList = Get-PnPList -Identity $listName -ErrorAction SilentlyContinue
if (-not $existingList) {
    New-PnPList -Title "Project Tracking" -Template GenericList
}
```

### Step 5: Verify
Check the results in SharePoint or via PowerShell.

```powershell
Get-PnPList -Identity $listName
```

## Best Practices
- **Idempotency**: Always check for existing resources before creation to avoid errors on subsequent runs.
- **Logging**: Use `Write-Host` or `Write-Log` to provide feedback during automation.
- **Error Handling**: Use `try/catch` blocks for critical operations.
- **Authentication**: Use `-UseWebLogin` for interactive sessions or AppId/AppSecret for headless automation.
