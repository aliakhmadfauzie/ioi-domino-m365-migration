---
name: add-sharepoint
description: Adds a SharePoint Online data source to a Power Apps code app. Use when you need to connect to SharePoint lists or document libraries.
user-invocable: true
allowed-tools: Read, Edit, Write, Grep, Glob, Bash, LSP, TaskCreate, TaskUpdate, TaskList, TaskGet, AskUserQuestion, Skill
model: sonnet
---

**📋 Shared Instructions: [shared-instructions.md](../../shared/shared-instructions.md)** - Cross-cutting concerns.

# Add SharePoint Data Source

Skill for connecting a Power Apps code app to SharePoint Online lists or document libraries.

## Workflow

### Step 1: Check Context
Check `memory-bank.md` or project root for `power.config.json` to ensure we are in a valid Power Apps project.

### Step 2: Get Connection ID
If not already known, list available connections to find the SharePoint Online `connectionId`.

```bash
npx power-apps list-connections
```
Look for `sharepointonline`. If multiple exist, ask the user to pick one.

### Step 3: Discover Site (Dataset)
Ask the user for the SharePoint site URL, or list available sites if the connector supports discovery.

```bash
npx power-apps list-datasets -a sharepointonline -c <connection-id>
```

### Step 4: Discover List (Table)
List the tables (lists/libraries) available at the selected site.

```bash
npx power-apps list-tables -a sharepointonline -c <connection-id> -d '<site-url>'
```

### Step 5: Add Data Source
Run the command to add the data source and generate services.

```bash
npx power-apps add-data-source -a sharepointonline -c <connection-id> -d '<site-url>' -t '<list-name>'
```

### Step 6: Verify Build
Run a build to ensure the generated services are compatible and there are no TypeScript errors.

```bash
npm run build
```

### Step 7: Summary
Provide the user with:
- Connection details (Site, List)
- Path to generated services (`src/generated/services/SharePointOnlineService.ts`)
- Example code snippet for reading items:

```typescript
const result = await SharePointOnlineService.GetItems({
  dataset: "<site-url>",
  table: "<list-name>"
});
const items = result.data?.value || [];
```

## SharePoint Gotchas
- **Choice Fields**: Represented as numbers in the data model.
- **Lookup Fields**: Use `_fieldname_value` for reading and `@odata.bind` for writing.
- **Virtual Fields**: Ending in `name` are read-only and may need to be handled specifically in UI.
- **Large Lists**: Be aware of delegation limits and use OData filters (`$filter`) where possible.
