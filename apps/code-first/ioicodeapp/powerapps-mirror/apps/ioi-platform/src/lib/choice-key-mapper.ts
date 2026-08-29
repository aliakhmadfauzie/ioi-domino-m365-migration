/**
 * Choice Key Mapper
 *
 * Validates that SharePoint choice keys match expected patterns and warns
 * when a key doesn't match any known entry. This catches SharePoint
 * choice option reordering issues early.
 *
 * SharePoint stores choice selections as key strings like "CurrentstatusKey30".
 * The numeric index (30) maps to a specific choice option. If choice options
 * are reordered in the SharePoint list settings, these indices shift and
 * ALL existing records will show wrong labels.
 *
 * This utility:
 * 1. Validates keys against known key-to-label maps
 * 2. Logs warnings for unknown keys (potential reordering)
 * 3. Provides a fallback value when a key is unrecognized
 */

import {
  MainDBITCurrentstatusKeyToLabel,
  MainDBITSiteKeyToLabel,
  MainDBITEnvironmenttagKeyToLabel,
  type MainDBITCurrentstatusKey,
  type MainDBITSiteKey,
  type MainDBITEnvironmenttagKey,
} from '@/generated/models/main-dbit-model';

// =============================================================================
// GENERIC VALIDATOR
// =============================================================================

/**
 * Validate that a choice key exists in the known key-to-label map.
 * Logs a warning if the key is not found (suggesting SP option reordering).
 */
export function validateChoiceKey<T extends string>(
  key: T | undefined,
  keyToLabel: Record<T, string>,
  fieldName: string
): T | undefined {
  if (!key) return undefined;
  if (key in keyToLabel) return key;

  console.warn(
    `[ChoiceKeyMapper] Unknown key "${key}" for field "${fieldName}". ` +
    `SharePoint choice options may have been reordered. ` +
    `Known keys: ${Object.keys(keyToLabel).slice(0, 10).join(', ')}...`
  );
  return key;
}

// =============================================================================
// FIELD-SPECIFIC VALIDATORS
// =============================================================================

/**
 * Validate a CurrentStatus key.
 */
export function validateCurrentStatusKey(
  key: string | undefined
): string | undefined {
  return validateChoiceKey(
    key as MainDBITCurrentstatusKey,
    MainDBITCurrentstatusKeyToLabel as unknown as Record<string, string>,
    'CurrentStatus'
  );
}

/**
 * Validate a Site key.
 */
export function validateSiteKey(
  key: string | undefined
): string | undefined {
  return validateChoiceKey(
    key as MainDBITSiteKey,
    MainDBITSiteKeyToLabel as unknown as Record<string, string>,
    'Site'
  );
}

/**
 * Validate an EnvironmentTag key.
 */
export function validateEnvironmentTagKey(
  key: string | undefined
): string | undefined {
  return validateChoiceKey(
    key as MainDBITEnvironmenttagKey,
    MainDBITEnvironmenttagKeyToLabel as unknown as Record<string, string>,
    'EnvironmentTag'
  );
}

// =============================================================================
// LABEL RESOLUTION WITH VALIDATION
// =============================================================================

/**
 * Resolve a choice key to its display label.
 * Returns the label if found, or the raw key if unknown.
 */
export function resolveCurrentStatusLabel(
  key: string | undefined
): string {
  const validated = validateCurrentStatusKey(key);
  if (!validated) return 'Unknown';
  const labels = MainDBITCurrentstatusKeyToLabel as unknown as Record<string, string>;
  return labels[validated] || validated;
}

/**
 * Resolve a Site key to its display label.
 */
export function resolveSiteLabel(
  key: string | undefined
): string {
  const validated = validateSiteKey(key);
  if (!validated) return 'Unknown';
  const labels = MainDBITSiteKeyToLabel as unknown as Record<string, string>;
  return labels[validated] || validated;
}

/**
 * Resolve an EnvironmentTag key to its display label.
 */
export function resolveEnvironmentTagLabel(
  key: string | undefined
): string {
  const validated = validateEnvironmentTagKey(key);
  if (!validated) return 'Unknown';
  const labels = MainDBITEnvironmenttagKeyToLabel as unknown as Record<string, string>;
  return labels[validated] || validated;
}
