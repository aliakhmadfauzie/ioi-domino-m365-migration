# Connector Reference

This document provides guidance on working with generated services for Power Platform connectors.

## Inspecting Large Generated Files
Generated service files (`src/generated/services/*.ts`) can be several thousand lines long. 
- **Do not read the entire file.**
- Use `grep` or the VS Code search tool to find the method names you need.
- Common method patterns:
  - `getAll()`: Returns all records (OData).
  - `create(body)`: Creates a new record.
  - `update(id, body)`: Updates an existing record.
  - `delete(id)`: Deletes a record.

## Common Connectors
- **Dataverse**: Native Power Platform database.
- **SharePoint Online**: For SharePoint lists and document libraries.
- **Office 365 Outlook**: For email and calendar.
- **Teams**: For messaging and channels.

## Using Generated Models
- Always use the interfaces in `src/generated/models/*.ts` for type safety.
- Import the model and use it to type your state or component props.
