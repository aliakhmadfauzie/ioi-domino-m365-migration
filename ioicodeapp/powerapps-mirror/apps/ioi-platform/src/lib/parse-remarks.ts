/**
 * Utility to parse the JSON remarks field from MainDB_IT SharePoint list
 * The remarks field contains form-specific data as a JSON string
 */

export interface ParsedRemarks {
  // Common fields
  formCode?: string;
  requestId?: string;
  submittedBy?: string;
  submittedByEmail?: string;
  department?: string;
  site?: string;
  priority?: string;
  justification?: string;
  
  // ITSSR fields
  serviceType?: string;
  softwareName?: string;
  sapModule?: string;
  problemDescription?: string;
  location?: string;
  
  // EAF fields
  accessType?: string;
  accessDuration?: string;
  startDate?: string;
  endDate?: string;
  externalUserName?: string;
  externalUserEmail?: string;
  externalCompany?: string;
  company?: string;
  
  // NIR fields
  requestType?: string;
  employeeName?: string;
  employeeId?: string;
  notesIdRequired?: string;
  mailDatabase?: string;
  
  // UR fields
  application?: string;
  plant?: string;
  userIdType?: string;
  copyFromUserId?: string;
  validFrom?: string;
  validTo?: string;
  
  // RS fields
  systemName?: string;
  userId?: string;
  resetReason?: string;
  applicationType?: string;
  resetType?: string;
  userName?: string;
  
  // SFAR fields
  folderPath?: string;
  accessLevel?: string;
  accessReason?: string;
  serverName?: string;
  
  // FESB fields
  extinguisherId?: string;
  extinguisherLocation?: string;
  extinguisherType?: string;
  serviceDate?: string;
  nextServiceDate?: string;
  servicedBy?: string;
  serviceRemarks?: string;
  conditionStatus?: string;
  
  // DCAL fields
  visitorName?: string;
  visitorCompany?: string;
  visitorIC?: string;
  purposeOfVisit?: string;
  entryTime?: string;
  exitTime?: string;
  escort?: string;
  dataCenterArea?: string;
  
  // DRR fields
  dataType?: string;
  dataPath?: string;
  restoreDate?: string;
  restoreReason?: string;
  urgencyLevel?: string;
  
  // Server/Infrastructure fields
  serverIP?: string;
  serverOS?: string;
  rebootDate?: string;
  rebootReason?: string;
  downtimeStart?: string;
  downtimeEnd?: string;
  rebootType?: string;
  
  // SAP fields
  module?: string;
  trCategory?: string;
  client?: string;
  system?: string;
  projectPhase?: string;
  plantCode?: string;
  storageCode?: string;
  
  // Hardware fields
  equipmentType?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  assetTag?: string;
  assignedTo?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  
  // General fields
  description?: string;
  remarks?: string;
  comments?: string;
  
  // Allow any other fields
  [key: string]: unknown;
}

/**
 * Parse the remarks field from MainDB_IT
 * Handles both JSON strings and plain text
 */
export function parseRemarks(remarks: string | undefined | null): ParsedRemarks {
  if (!remarks) return {};
  
  // Try to parse as JSON
  try {
    const parsed = JSON.parse(remarks);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as ParsedRemarks;
    }
  } catch {
    // Not JSON, return as description
    return { description: remarks };
  }
  
  return {};
}

/**
 * Get a specific field from remarks, with fallback
 */
export function getRemarkField(
  remarks: string | undefined | null,
  field: string,
  fallback: string = '-'
): string {
  const parsed = parseRemarks(remarks);
  const value = parsed[field];
  
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  
  return String(value);
}

/**
 * Get multiple fields from remarks
 */
export function getRemarkFields(
  remarks: string | undefined | null,
  fields: string[]
): Record<string, string> {
  const parsed = parseRemarks(remarks);
  const result: Record<string, string> = {};
  
  for (const field of fields) {
    const value = parsed[field];
    result[field] = value !== undefined && value !== null && value !== '' 
      ? String(value) 
      : '-';
  }
  
  return result;
}