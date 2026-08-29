export type FieldType =
  | 'text'
  | 'choice'
  | 'multiline'
  | 'people'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'attachment';

export type AutoValueKind = 'timestamp' | 'currentUser' | 'generateRecordNo';

export interface ShowWhenRule {
  fieldId: string;
  op: 'eq' | 'neq' | 'in' | 'notIn';
  value: string | string[];
}

export interface FieldSchema {
  fieldId: string;
  label: string;
  fieldType: FieldType;
  required: boolean;
  readOnly?: boolean;
  autoValue?: AutoValueKind;
  options?: string[];
  fullWidth?: boolean;
  placeholder?: string;
  displayOrder: number;
  notes?: string;
  deprecated?: boolean;
  spColumn?: string;
  spTable?: 'MainDB_IT' | 'ExtSupport' | 'ExtAccess' | 'ExtAssets' | 'ExtSAP' | 'ExtDocs' | 'ExtInfra' | 'ExtPolicy';
  spLabelToKey?: Record<string, string>;
  spColumnType?: 'text' | 'number';
}

export interface SectionSchema {
  sectionId: string;
  sectionName: string;
  displayOrder: number;
  fields: FieldSchema[];
  showWhen?: ShowWhenRule;
}

export interface FormSchema {
  formCode: string;
  title: string;
  description?: string;
  routeBase: string;
  icon?: string;
  sections: SectionSchema[];
  version: number;
}

export type FormValues = Record<string, string | boolean | string[] | null>;
export type FormErrors = Record<string, string>;
