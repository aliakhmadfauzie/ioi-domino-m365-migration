export interface ITSchemaStore {
  /**
   * @displayName ID
   * @uiConstraints NEVER create input fields for this ID
   */
  id: number;
  /**
   * @displayName Title
   * @description formCode — e.g. "ITSSR", "DCALOG"
   * @validationRule Required for create/update operations
   */
  title: string;
  /**
   * @displayName Schema JSON
   * @description Serialized FormSchema JSON string
   * @validationRule Required for create/update operations
   */
  schemaJson: string;
  /**
   * @displayName Schema Version
   */
  schemaVersion?: number;
  /**
   * @displayName Is Active
   */
  isActive?: boolean;
}

export const _ITSchemaStore = 'ITSchemaStore' as const;
