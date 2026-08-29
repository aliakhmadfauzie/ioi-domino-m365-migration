import { v4 as uuidv4 } from 'uuid';
import { IssueSeverity } from './debugTypes';
import type { AppField, SharePointField, WriteActionMeta, DebugIssue } from './debugTypes';

/**
 * Compare the app's declared fields against the SharePoint schema registry
 * and return a list of issues found.
 *
 * This runs entirely client-side against the manually-maintained SP schema
 * stored in each form's *.schema.ts file.
 */
export function compareReadSchema(
  sourceKey: string,
  appFields: AppField[],
  spFields: SharePointField[]
): DebugIssue[] {
  const issues: DebugIssue[] = [];

  const spMap = new Map(spFields.map((f) => [f.internalName.toLowerCase(), f]));
  const appMap = new Map(appFields.map((f) => [f.appColumnName.toLowerCase(), f]));

  // Check every app field against SP
  for (const appField of appFields) {
    const spField = spMap.get(appField.appColumnName.toLowerCase());

    if (!spField) {
      issues.push({
        id: uuidv4(),
        severity: appField.required ? IssueSeverity.Error : IssueSeverity.Warning,
        sourceKey,
        category: 'MissingColumn',
        fieldName: appField.appColumnName,
        description: `App expects column "${appField.appColumnName}" but it does not exist in the SP schema for "${sourceKey}".`,
        recommendedFix: `Add a "${appField.appColumnName}" column to the SharePoint list, or update the app field mapping in mrf.schema.ts.`,
      });
      continue;
    }

    if (appField.fieldType !== spField.fieldType) {
      issues.push({
        id: uuidv4(),
        severity: IssueSeverity.Error,
        sourceKey,
        category: 'TypeMismatch',
        fieldName: appField.appColumnName,
        description: `Type mismatch on "${appField.appColumnName}": app expects ${appField.fieldType}, SP has ${spField.fieldType}.`,
        recommendedFix: `Align the field type in the schema registry (*.schema.ts) with the actual SP column type, or add a transform function in the write map.`,
      });
    }

    if (appField.required && !spField.required) {
      issues.push({
        id: uuidv4(),
        severity: IssueSeverity.Warning,
        sourceKey,
        category: 'RequiredNotMapped',
        fieldName: appField.appColumnName,
        description: `"${appField.appColumnName}" is required by the app but not marked required in SP. Writes may silently omit it.`,
        recommendedFix: `Mark the SP column as required, or add a validation rule in the write map.`,
      });
    }
  }

  // Identify SP fields the app never reads (informational only)
  for (const spField of spFields) {
    if (!spField.hidden && !spField.readOnly && !appMap.has(spField.internalName.toLowerCase())) {
      issues.push({
        id: uuidv4(),
        severity: IssueSeverity.Info,
        sourceKey,
        category: 'ExtraColumn',
        fieldName: spField.internalName,
        description: `SP column "${spField.internalName}" (${spField.displayName}) exists but is not used by the app.`,
        recommendedFix: `Add it to appFields in the schema file if the app should read it, or leave as-is if intentionally unused.`,
      });
    }
  }

  return issues;
}

/**
 * Validate a write map against the registered SP schema for its target list.
 * Returns issues for columns that are in the write map but missing from SP,
 * and type mismatches between the write-map's declared types and SP.
 */
export function compareWriteMap(
  sourceKey: string,
  writeAction: WriteActionMeta,
  spFields: SharePointField[]
): DebugIssue[] {
  const issues: DebugIssue[] = [];
  const spMap = new Map(spFields.map((f) => [f.internalName.toLowerCase(), f]));

  for (const mapping of writeAction.fieldMappings) {
    const spField = spMap.get(mapping.spColumnName.toLowerCase());

    if (!spField) {
      issues.push({
        id: uuidv4(),
        severity: IssueSeverity.Error,
        sourceKey,
        category: 'WriteMapMismatch',
        fieldName: mapping.spColumnName,
        description: `Write map for action "${writeAction.actionKey}" targets SP column "${mapping.spColumnName}" which is not in the schema registry.`,
        recommendedFix: `Verify the SP column name in *.writeMap.ts, or add the column to the schema file.`,
      });
      continue;
    }

    if (mapping.spFieldType !== spField.fieldType) {
      issues.push({
        id: uuidv4(),
        severity: IssueSeverity.Warning,
        sourceKey,
        category: 'WriteMapMismatch',
        fieldName: mapping.spColumnName,
        description: `Write map type mismatch for "${mapping.spColumnName}": map declares ${mapping.spFieldType}, SP schema has ${spField.fieldType}.`,
        recommendedFix: `Correct the spFieldType in *.writeMap.ts or add a transformFn to convert before writing.`,
      });
    }
  }

  return issues;
}
