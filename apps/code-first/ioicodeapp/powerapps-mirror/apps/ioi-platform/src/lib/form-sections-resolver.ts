// =============================================================================
// FORM SECTIONS RESOLVER
// Merges base form config with complete field definitions
// Supports M1 (User & Access Management) and M2 (IT Support & Service Requests)
// =============================================================================

import type { ITFormConfig, FormSection } from './it-forms-config';
import { M1_FORM_SECTIONS } from './m1-form-fields';
import { M2_FORM_SECTIONS } from './m2-form-fields';

// Combined sections map for all modules
const ALL_FORM_SECTIONS: Record<string, FormSection[]> = {
  ...M1_FORM_SECTIONS,
  ...M2_FORM_SECTIONS,
};

/**
 * Gets the complete form configuration by merging base config with full field definitions
 */
export function getCompleteFormConfig(baseConfig: ITFormConfig): ITFormConfig {
  const moduleSections = ALL_FORM_SECTIONS[baseConfig.code];
  
  if (moduleSections) {
    return {
      ...baseConfig,
      sections: moduleSections,
    };
  }
  
  // Return base config if no enhanced sections found
  return baseConfig;
}

/**
 * Gets form sections for a specific form code
 */
export function getFormSections(formCode: string): FormSection[] | undefined {
  return ALL_FORM_SECTIONS[formCode.toUpperCase()];
}

/**
 * Checks if a form has complete field definitions
 */
export function hasCompleteDefinitions(formCode: string): boolean {
  return formCode.toUpperCase() in ALL_FORM_SECTIONS;
}

/**
 * Gets form sections by module
 */
export function getFormSectionsByModule(module: 'M1' | 'M2'): Record<string, FormSection[]> {
  if (module === 'M1') {
    return M1_FORM_SECTIONS;
  }
  return M2_FORM_SECTIONS;
}