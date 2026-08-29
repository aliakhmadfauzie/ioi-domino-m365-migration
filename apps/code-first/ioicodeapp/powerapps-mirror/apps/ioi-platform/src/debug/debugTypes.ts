// ─── Enumerations ────────────────────────────────────────────────────────────

export enum FormMode {
  New = 'New',
  Edit = 'Edit',
  View = 'View',
  Approval = 'Approval',
  Process = 'Process',
  Admin = 'Admin',
  Report = 'Report',
}

export enum DataMode {
  Real = 'Real',
  Mock = 'Mock',
  Hybrid = 'Hybrid',
}

export enum SourceKind {
  SharePoint = 'SharePoint',
  MockData = 'MockData',
  LocalState = 'LocalState',
  Collection = 'Collection',
  StaticConfig = 'StaticConfig',
  M365Connector = 'M365Connector',
}

export enum FieldType {
  Text = 'Text',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  DateTime = 'DateTime',
  Choice = 'Choice',
  MultiChoice = 'MultiChoice',
  Lookup = 'Lookup',
  MultiLookup = 'MultiLookup',
  Person = 'Person',
  MultiPerson = 'MultiPerson',
  Hyperlink = 'Hyperlink',
  Currency = 'Currency',
  Integer = 'Integer',
  Guid = 'Guid',
  Computed = 'Computed',
  Unknown = 'Unknown',
}

export enum IssueSeverity {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
}

export enum DebugEventType {
  Navigation = 'Navigation',
  Read = 'Read',
  Write = 'Write',
  SchemaCheck = 'SchemaCheck',
  Error = 'Error',
  AuthCheck = 'AuthCheck',
}

// ─── Schema ───────────────────────────────────────────────────────────────────

/** One field as the app code understands it */
export interface AppField {
  controlName: string;     // React control / form field name
  appColumnName: string;   // Column name used in app payload
  fieldType: FieldType;
  required: boolean;
  description?: string;
}

/** One field as declared in the SharePoint schema registry */
export interface SharePointField {
  internalName: string;
  displayName: string;
  fieldType: FieldType;
  required: boolean;
  readOnly?: boolean;
  hidden?: boolean;
}

// ─── Read Source ──────────────────────────────────────────────────────────────

export interface ReadSourceMeta {
  sourceKey: string;         // matches data source key in power.config.json
  friendlyTitle: string;     // human-readable name shown in the app
  entityName: string;        // internal app table / entity name
  sourceKind: SourceKind;
  siteUrl?: string;          // https://ioioi.sharepoint.com/sites/…
  listName?: string;         // SP list internal name (URL name)
  listDisplayName?: string;  // SP list display name
  appFields: AppField[];     // fields the app expects to read
  spFields?: SharePointField[]; // fields declared in the SP schema registry
}

// ─── Write Action ─────────────────────────────────────────────────────────────

export interface FieldWriteMapping {
  appControlName: string;
  appColumnName: string;
  appFieldType: FieldType;
  spColumnName: string;
  spFieldType: FieldType;
  transformFn?: string;    // name of the transform function applied before write
  validationRule?: string; // human-readable description of the validation rule
}

export interface WriteActionMeta {
  actionKey: string;
  buttonOrActionName: string;
  targetListName: string;
  targetListDisplayName: string;
  targetSiteUrl: string;
  operation: 'Create' | 'Update' | 'Delete' | 'Patch';
  fieldMappings: FieldWriteMapping[];
}

// ─── Screen Metadata ──────────────────────────────────────────────────────────

/** Registered on mount by every page that participates in the debug system */
export interface ScreenMeta {
  screenId: string;
  routePath: string;
  screenTitle: string;
  departmentCode: string;
  departmentName: string;
  formCode: string;
  formTitle: string;
  formMode: FormMode;
  /** Per-screen override; falls back to the global data mode atom if undefined */
  dataMode?: DataMode;
  readSources: ReadSourceMeta[];
  writeActions: WriteActionMeta[];
}

// ─── Debug Events ─────────────────────────────────────────────────────────────

export interface DebugEvent {
  id: string;
  type: DebugEventType;
  timestamp: string;        // ISO-8601
  screenId?: string;
  sourceKey?: string;
  actionKey?: string;
  userId?: string;
  summary: string;
  details?: Record<string, unknown>;
  success?: boolean;
  errorMessage?: string;
  recordId?: string | number;
  durationMs?: number;
}

// ─── Department registry entry ────────────────────────────────────────────────

export interface DepartmentEntry {
  code: string;
  name: string;
  forms: string[];
}

/** Safe value preview — never logs the full sensitive value */
export interface FieldValuePreview {
  appControlName: string;
  appColumnName: string;
  spColumnName: string;
  valuePreview: string;    // masked / truncated
  dataType: string;
  mappingStatus: 'OK' | 'TypeMismatch' | 'Missing' | 'Extra';
}

export interface WriteEventDetail {
  operation: string;
  targetList: string;
  fieldPreview: FieldValuePreview[];
  recordId?: string | number;
  success: boolean;
  errorMessage?: string;
}

// ─── Schema Issues ────────────────────────────────────────────────────────────

export interface DebugIssue {
  id: string;
  severity: IssueSeverity;
  sourceKey: string;
  category:
    | 'MissingColumn'
    | 'ExtraColumn'
    | 'TypeMismatch'
    | 'RequiredNotMapped'
    | 'WriteMapMismatch';
  fieldName: string;
  description: string;
  recommendedFix: string;
}

export interface LastWriteResult {
  success: boolean;
  errorMessage?: string;
  recordId?: string | number;
  timestamp: string;
}
