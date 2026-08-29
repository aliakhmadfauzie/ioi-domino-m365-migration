/**
 * Utility function to format form data as plain text remarks for SharePoint
 * Instead of storing JSON, we store human-readable key-value pairs
 */

export function formatRemarksText(data: Record<string, unknown>): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }
    
    // Format the key from camelCase/PascalCase to readable format
    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
    
    // Handle different value types
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        // For arrays (like attachments), list them
        if (value.length > 0) {
          const items = value.map((item: unknown) => {
            if (typeof item === 'object' && item !== null && 'name' in item) {
              return (item as { name: string }).name;
            }
            return String(item);
          });
          lines.push(`${formattedKey}: ${items.join(', ')}`);
        }
      } else if (value !== null) {
        // For objects, try to get a meaningful string representation
        const obj = value as Record<string, unknown>;
        if ('DisplayName' in obj) {
          lines.push(`${formattedKey}: ${obj.DisplayName}`);
        } else if ('name' in obj) {
          lines.push(`${formattedKey}: ${obj.name}`);
        } else if ('email' in obj) {
          lines.push(`${formattedKey}: ${obj.email}`);
        } else {
          // Skip complex nested objects
        }
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${formattedKey}: ${value ? 'Yes' : 'No'}`);
    } else if (value instanceof Date) {
      lines.push(`${formattedKey}: ${value.toISOString()}`);
    } else {
      lines.push(`${formattedKey}: ${String(value)}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Format ITSSR form data as plain text remarks
 */
export function formatITSSRRemarks(data: {
  caseStatus?: string;
  company?: string;
  serviceType?: string;
  hardware?: string;
  application?: string;
  module?: string;
  department?: string;
  extension?: string;
  problemDescription?: string;
  sendTo?: string;
  cc?: string;
  requestorEmail?: string;
  requestorName?: string;
}): string {
  const lines: string[] = [];
  
  if (data.caseStatus) lines.push(`Case Status: ${data.caseStatus}`);
  if (data.company) lines.push(`Company: ${data.company}`);
  if (data.serviceType) lines.push(`Service Type: ${data.serviceType}`);
  if (data.hardware) lines.push(`Hardware: ${data.hardware}`);
  if (data.application) lines.push(`Application: ${data.application}`);
  if (data.module) lines.push(`Module: ${data.module}`);
  if (data.department) lines.push(`Department: ${data.department}`);
  if (data.extension) lines.push(`Extension: ${data.extension}`);
  if (data.problemDescription) lines.push(`Problem Description: ${data.problemDescription}`);
  if (data.sendTo) lines.push(`Send To: ${data.sendTo}`);
  if (data.cc) lines.push(`CC: ${data.cc}`);
  if (data.requestorEmail) lines.push(`Requestor Email: ${data.requestorEmail}`);
  if (data.requestorName) lines.push(`Requestor Name: ${data.requestorName}`);
  
  return lines.join('\n');
}

/**
 * Format EAF form data as plain text remarks
 */
export function formatEAFRemarks(data: {
  formType?: string;
  requestor?: string;
  company?: string;
  targetUser?: string;
  application?: string;
  systemName?: string;
  justification?: string;
  departmentHead?: string;
  ccRecipients?: string;
  currentAction?: string;
  workflowStage?: number;
  approverEmail?: string;
  approverName?: string;
  routingMode?: string;
}): string {
  const lines: string[] = [];
  
  if (data.formType) lines.push(`Form Type: ${data.formType}`);
  if (data.requestor) lines.push(`Requestor: ${data.requestor}`);
  if (data.company) lines.push(`Company: ${data.company}`);
  if (data.targetUser) lines.push(`Target User: ${data.targetUser}`);
  if (data.application) lines.push(`Application: ${data.application}`);
  if (data.systemName) lines.push(`System Name: ${data.systemName}`);
  if (data.justification) lines.push(`Justification: ${data.justification}`);
  if (data.departmentHead) lines.push(`Department Head: ${data.departmentHead}`);
  if (data.ccRecipients) lines.push(`CC Recipients: ${data.ccRecipients}`);
  if (data.currentAction) lines.push(`Current Action: ${data.currentAction}`);
  if (data.workflowStage) lines.push(`Workflow Stage: ${data.workflowStage}`);
  if (data.approverEmail) lines.push(`Approver Email: ${data.approverEmail}`);
  if (data.approverName) lines.push(`Approver Name: ${data.approverName}`);
  if (data.routingMode) lines.push(`Routing Mode: ${data.routingMode}`);
  
  return lines.join('\n');
}

/**
 * Format generic IT form data as plain text remarks
 */
export function formatGenericITRemarks(data: {
  priority?: string;
  formData?: Record<string, unknown>;
  workflow?: {
    currentStage?: number;
    currentStageName?: string;
    totalStages?: number;
  };
  approvers?: {
    approver?: { name?: string; email?: string };
    hod?: { name?: string; email?: string };
    manager?: { name?: string; email?: string };
  };
  attachments?: Array<{ name: string; size?: number; type?: string }>;
}): string {
  const lines: string[] = [];
  
  if (data.priority) lines.push(`Priority: ${data.priority}`);
  
  // Workflow info
  if (data.workflow) {
    if (data.workflow.currentStageName) lines.push(`Current Stage: ${data.workflow.currentStageName}`);
    if (data.workflow.currentStage && data.workflow.totalStages) {
      lines.push(`Stage Progress: ${data.workflow.currentStage} of ${data.workflow.totalStages}`);
    }
  }
  
  // Approvers
  if (data.approvers) {
    if (data.approvers.approver?.name) lines.push(`Approver: ${data.approvers.approver.name} (${data.approvers.approver.email || 'N/A'})`);
    if (data.approvers.hod?.name) lines.push(`HoD: ${data.approvers.hod.name} (${data.approvers.hod.email || 'N/A'})`);
    if (data.approvers.manager?.name) lines.push(`Manager: ${data.approvers.manager.name} (${data.approvers.manager.email || 'N/A'})`);
  }
  
  // Attachments
  if (data.attachments && data.attachments.length > 0) {
    const attachmentNames = data.attachments.map((a: { name: string }) => a.name).join(', ');
    lines.push(`Attachments: ${attachmentNames}`);
  }
  
  // Other form data
  if (data.formData) {
    for (const [key, value] of Object.entries(data.formData)) {
      if (value && typeof value === 'string') {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
        lines.push(`${formattedKey}: ${value}`);
      }
    }
  }
  
  return lines.join('\n');
}