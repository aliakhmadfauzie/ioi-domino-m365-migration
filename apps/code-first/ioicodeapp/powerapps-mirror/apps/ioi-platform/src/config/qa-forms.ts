import {
  FileText,
  BookOpen,
  AlertTriangle,
  ClipboardCheck,
  Lightbulb,
  Archive,
  Shield,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'readonly'
  | 'computed';

export interface FieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  section: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  gridSpan?: 1 | 2;
}

export interface FormSection {
  id: string;
  name: string;
  description?: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  description: string;
  approverRole?: string;
}

export interface QAFormDefinition {
  code: QAFormCode;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: 'documentation' | 'corrective' | 'improvement' | 'compliance';
  sections: FormSection[];
  fields: FieldDefinition[];
  stages: WorkflowStage[];
  retentionPeriod: string;
}

export type QAFormCode = 'SOP' | 'WI' | 'ICAR' | 'CRRF' | 'OFI' | 'DOR' | 'CAPA' | 'NCR';

// ===================================
// SOP - Standard Operating Procedure
// ===================================
const SOP_FORM: QAFormDefinition = {
  code: 'SOP',
  name: 'Standard Operating Procedure',
  description: 'Document standardized processes and procedures for consistent operations',
  icon: FileText,
  color: '#2563eb',
  category: 'documentation',
  sections: [
    { id: 'header', name: 'Document Information', description: 'Basic document details and metadata' },
    { id: 'purpose', name: 'Purpose & Scope', description: 'Define the objectives and applicability' },
    { id: 'procedure', name: 'Procedure Details', description: 'Step-by-step procedural content' },
    { id: 'references', name: 'References & Attachments', description: 'Supporting documents and references' },
    { id: 'approval', name: 'Review & Approval', description: 'Approval workflow information' },
  ],
  fields: [
    { id: 'documentNumber', label: 'Document Number', type: 'readonly', section: 'header', required: true },
    { id: 'title', label: 'SOP Title', type: 'text', section: 'header', required: true, placeholder: 'Enter SOP title' },
    { id: 'department', label: 'Department', type: 'select', section: 'header', required: true, options: [
      { value: 'production', label: 'Production' },
      { value: 'quality', label: 'Quality Assurance' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'safety', label: 'Safety' },
      { value: 'hr', label: 'Human Resources' },
    ]},
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', section: 'header', required: true },
    { id: 'revisionNumber', label: 'Revision Number', type: 'number', section: 'header', required: true, placeholder: '1', validation: { min: 1 } },
    { id: 'preparedBy', label: 'Prepared By', type: 'readonly', section: 'header', required: true },
    { id: 'preparedDate', label: 'Prepared Date', type: 'readonly', section: 'header', required: true },
    { id: 'purpose', label: 'Purpose', type: 'textarea', section: 'purpose', required: true, placeholder: 'State the purpose of this SOP...', gridSpan: 2 },
    { id: 'scope', label: 'Scope', type: 'textarea', section: 'purpose', required: true, placeholder: 'Define the scope and applicability...', gridSpan: 2 },
    { id: 'definitions', label: 'Definitions & Abbreviations', type: 'textarea', section: 'purpose', required: false, placeholder: 'List any key terms, definitions, or abbreviations...', gridSpan: 2 },
    { id: 'responsibilities', label: 'Responsibilities', type: 'textarea', section: 'procedure', required: true, placeholder: 'Define roles and responsibilities...', gridSpan: 2 },
    { id: 'procedure', label: 'Procedure', type: 'richtext', section: 'procedure', required: true, placeholder: 'Document the step-by-step procedure...', gridSpan: 2 },
    { id: 'safetyPrecautions', label: 'Safety Precautions', type: 'textarea', section: 'procedure', required: false, placeholder: 'List any safety precautions or PPE requirements...', gridSpan: 2 },
    { id: 'references', label: 'References', type: 'textarea', section: 'references', required: false, placeholder: 'List related documents, standards, or regulations...', gridSpan: 2 },
    { id: 'attachments', label: 'Attachments', type: 'file', section: 'references', required: false, description: 'Upload supporting documents, flowcharts, or forms', gridSpan: 2 },
    { id: 'reviewerComments', label: 'Reviewer Comments', type: 'textarea', section: 'approval', required: false, placeholder: 'Comments for reviewers...', gridSpan: 2 },
  ],
  stages: [
    { id: 'draft', name: 'Draft', order: 1, description: 'Initial document creation' },
    { id: 'review', name: 'Review', order: 2, description: 'Technical review by subject matter experts', approverRole: 'Department Head' },
    { id: 'approve', name: 'Approval', order: 3, description: 'Final approval by QA Manager', approverRole: 'QA Manager' },
    { id: 'effective', name: 'Effective', order: 4, description: 'Document is active and in use' },
  ],
  retentionPeriod: '10 years after superseded',
};

// ===================================
// WI - Work Instruction
// ===================================
const WI_FORM: QAFormDefinition = {
  code: 'WI',
  name: 'Work Instruction',
  description: 'Detailed step-by-step instructions for specific tasks or operations',
  icon: BookOpen,
  color: '#0891b2',
  category: 'documentation',
  sections: [
    { id: 'header', name: 'Document Information', description: 'Basic document details' },
    { id: 'instruction', name: 'Work Instruction', description: 'Detailed work steps and requirements' },
    { id: 'quality', name: 'Quality Requirements', description: 'Quality checks and acceptance criteria' },
    { id: 'attachments', name: 'Attachments', description: 'Supporting materials' },
  ],
  fields: [
    { id: 'documentNumber', label: 'Document Number', type: 'readonly', section: 'header', required: true },
    { id: 'title', label: 'Work Instruction Title', type: 'text', section: 'header', required: true, placeholder: 'Enter work instruction title' },
    { id: 'relatedSOP', label: 'Related SOP', type: 'text', section: 'header', required: false, placeholder: 'Reference SOP number' },
    { id: 'workArea', label: 'Work Area/Station', type: 'text', section: 'header', required: true, placeholder: 'Specify work area or station' },
    { id: 'effectiveDate', label: 'Effective Date', type: 'date', section: 'header', required: true },
    { id: 'preparedBy', label: 'Prepared By', type: 'readonly', section: 'header', required: true },
    { id: 'equipment', label: 'Equipment/Tools Required', type: 'textarea', section: 'instruction', required: true, placeholder: 'List required equipment and tools...', gridSpan: 2 },
    { id: 'materials', label: 'Materials Required', type: 'textarea', section: 'instruction', required: false, placeholder: 'List required materials and consumables...', gridSpan: 2 },
    { id: 'safetyRequirements', label: 'Safety Requirements', type: 'textarea', section: 'instruction', required: true, placeholder: 'PPE and safety precautions...', gridSpan: 2 },
    { id: 'procedure', label: 'Step-by-Step Instructions', type: 'richtext', section: 'instruction', required: true, placeholder: 'Detail each step of the work instruction...', gridSpan: 2 },
    { id: 'qualityChecks', label: 'Quality Checkpoints', type: 'textarea', section: 'quality', required: true, placeholder: 'Define quality checkpoints and inspection criteria...', gridSpan: 2 },
    { id: 'acceptanceCriteria', label: 'Acceptance Criteria', type: 'textarea', section: 'quality', required: true, placeholder: 'Define acceptance/rejection criteria...', gridSpan: 2 },
    { id: 'commonDefects', label: 'Common Defects & Troubleshooting', type: 'textarea', section: 'quality', required: false, placeholder: 'List common defects and how to address them...', gridSpan: 2 },
    { id: 'attachments', label: 'Attachments', type: 'file', section: 'attachments', required: false, description: 'Upload diagrams, photos, or supporting documents', gridSpan: 2 },
  ],
  stages: [
    { id: 'draft', name: 'Draft', order: 1, description: 'Initial creation' },
    { id: 'review', name: 'Review', order: 2, description: 'Technical review', approverRole: 'Supervisor' },
    { id: 'approve', name: 'Approval', order: 3, description: 'Department approval', approverRole: 'Department Head' },
    { id: 'effective', name: 'Effective', order: 4, description: 'Active for use' },
  ],
  retentionPeriod: '5 years after superseded',
};

// ===================================
// ICAR - Internal Corrective Action Report
// ===================================
const ICAR_FORM: QAFormDefinition = {
  code: 'ICAR',
  name: 'Internal Corrective Action Report',
  description: 'Document and track internal non-conformances and corrective actions',
  icon: AlertTriangle,
  color: '#ea580c',
  category: 'corrective',
  sections: [
    { id: 'header', name: 'Report Information', description: 'Basic report details' },
    { id: 'problem', name: 'Problem Description', description: 'Details of the non-conformance' },
    { id: 'analysis', name: 'Root Cause Analysis', description: 'Investigation and root cause findings' },
    { id: 'action', name: 'Corrective Actions', description: 'Actions taken to correct and prevent recurrence' },
    { id: 'verification', name: 'Verification', description: 'Verification of effectiveness' },
  ],
  fields: [
    { id: 'documentNumber', label: 'ICAR Number', type: 'readonly', section: 'header', required: true },
    { id: 'dateRaised', label: 'Date Raised', type: 'date', section: 'header', required: true },
    { id: 'raisedBy', label: 'Raised By', type: 'readonly', section: 'header', required: true },
    { id: 'department', label: 'Department', type: 'select', section: 'header', required: true, options: [
      { value: 'production', label: 'Production' },
      { value: 'quality', label: 'Quality Assurance' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'logistics', label: 'Logistics' },
    ]},
    { id: 'severity', label: 'Severity Level', type: 'radio', section: 'header', required: true, options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ]},
    { id: 'problemDescription', label: 'Problem Description', type: 'textarea', section: 'problem', required: true, placeholder: 'Describe the problem or non-conformance in detail...', gridSpan: 2 },
    { id: 'discoveryMethod', label: 'How Was It Discovered?', type: 'select', section: 'problem', required: true, options: [
      { value: 'inspection', label: 'Inspection' },
      { value: 'audit', label: 'Internal Audit' },
      { value: 'customer', label: 'Customer Complaint' },
      { value: 'employee', label: 'Employee Report' },
      { value: 'process', label: 'Process Monitoring' },
    ]},
    { id: 'productAffected', label: 'Product/Process Affected', type: 'text', section: 'problem', required: true, placeholder: 'Specify affected products or processes' },
    { id: 'immediateAction', label: 'Immediate Containment Action', type: 'textarea', section: 'problem', required: true, placeholder: 'Describe immediate actions taken to contain the problem...', gridSpan: 2 },
    { id: 'rootCauseMethod', label: 'Root Cause Analysis Method', type: 'select', section: 'analysis', required: true, options: [
      { value: '5why', label: '5 Whys' },
      { value: 'fishbone', label: 'Fishbone Diagram' },
      { value: 'fmea', label: 'FMEA' },
      { value: '8d', label: '8D Problem Solving' },
      { value: 'other', label: 'Other' },
    ]},
    { id: 'rootCause', label: 'Root Cause', type: 'textarea', section: 'analysis', required: true, placeholder: 'Describe the identified root cause...', gridSpan: 2 },
    { id: 'correctiveAction', label: 'Corrective Action', type: 'textarea', section: 'action', required: true, placeholder: 'Describe the corrective action to address root cause...', gridSpan: 2 },
    { id: 'preventiveAction', label: 'Preventive Action', type: 'textarea', section: 'action', required: true, placeholder: 'Describe actions to prevent recurrence...', gridSpan: 2 },
    { id: 'responsiblePerson', label: 'Responsible Person', type: 'text', section: 'action', required: true, placeholder: 'Name of responsible person' },
    { id: 'targetDate', label: 'Target Completion Date', type: 'date', section: 'action', required: true },
    { id: 'verificationMethod', label: 'Verification Method', type: 'textarea', section: 'verification', required: true, placeholder: 'How will effectiveness be verified?', gridSpan: 2 },
    { id: 'verificationDate', label: 'Verification Date', type: 'date', section: 'verification', required: false },
    { id: 'effectivenessConfirmed', label: 'Effectiveness Confirmed', type: 'checkbox', section: 'verification', required: false, placeholder: 'Corrective action was effective' },
  ],
  stages: [
    { id: 'open', name: 'Open', order: 1, description: 'ICAR raised and investigation started' },
    { id: 'analysis', name: 'Analysis', order: 2, description: 'Root cause analysis in progress' },
    { id: 'action', name: 'Action', order: 3, description: 'Corrective actions being implemented' },
    { id: 'verification', name: 'Verification', order: 4, description: 'Verifying effectiveness', approverRole: 'QA Manager' },
    { id: 'closed', name: 'Closed', order: 5, description: 'ICAR completed and closed' },
  ],
  retentionPeriod: '7 years',
};

// ===================================
// CRRF - Customer Requirement Review Form
// ===================================
const CRRF_FORM: QAFormDefinition = {
  code: 'CRRF',
  name: 'Customer Requirement Review Form',
  description: 'Review and document customer requirements before order acceptance',
  icon: ClipboardCheck,
  color: '#7c3aed',
  category: 'compliance',
  sections: [
    { id: 'header', name: 'Customer Information', description: 'Customer and order details' },
    { id: 'requirements', name: 'Requirements Review', description: 'Review of customer requirements' },
    { id: 'capability', name: 'Capability Assessment', description: 'Assess organizational capability' },
    { id: 'decision', name: 'Decision', description: 'Accept or reject decision' },
  ],
  fields: [
    { id: 'documentNumber', label: 'CRRF Number', type: 'readonly', section: 'header', required: true },
    { id: 'customerName', label: 'Customer Name', type: 'text', section: 'header', required: true, placeholder: 'Enter customer name' },
    { id: 'customerContact', label: 'Customer Contact', type: 'text', section: 'header', required: true, placeholder: 'Contact person name' },
    { id: 'enquiryReference', label: 'Enquiry/PO Reference', type: 'text', section: 'header', required: true, placeholder: 'Reference number' },
    { id: 'enquiryDate', label: 'Enquiry Date', type: 'date', section: 'header', required: true },
    { id: 'preparedBy', label: 'Prepared By', type: 'readonly', section: 'header', required: true },
    { id: 'productDescription', label: 'Product/Service Description', type: 'textarea', section: 'requirements', required: true, placeholder: 'Describe the product or service requested...', gridSpan: 2 },
    { id: 'quantity', label: 'Quantity', type: 'text', section: 'requirements', required: true, placeholder: 'Specify quantity' },
    { id: 'deliveryDate', label: 'Required Delivery Date', type: 'date', section: 'requirements', required: true },
    { id: 'technicalRequirements', label: 'Technical Requirements', type: 'textarea', section: 'requirements', required: true, placeholder: 'List specific technical requirements...', gridSpan: 2 },
    { id: 'qualityRequirements', label: 'Quality Requirements', type: 'textarea', section: 'requirements', required: false, placeholder: 'Certifications, standards, or quality requirements...', gridSpan: 2 },
    { id: 'technicalCapability', label: 'Technical Capability', type: 'radio', section: 'capability', required: true, options: [
      { value: 'yes', label: 'Can meet requirements' },
      { value: 'partial', label: 'Can partially meet requirements' },
      { value: 'no', label: 'Cannot meet requirements' },
    ]},
    { id: 'capacityAvailable', label: 'Production Capacity Available', type: 'radio', section: 'capability', required: true, options: [
      { value: 'yes', label: 'Sufficient capacity' },
      { value: 'overtime', label: 'With overtime/additional shifts' },
      { value: 'no', label: 'Insufficient capacity' },
    ]},
    { id: 'deliveryCapability', label: 'Can Meet Delivery Date', type: 'radio', section: 'capability', required: true, options: [
      { value: 'yes', label: 'Yes' },
      { value: 'partial', label: 'Partial delivery possible' },
      { value: 'no', label: 'No' },
    ]},
    { id: 'capabilityComments', label: 'Capability Comments', type: 'textarea', section: 'capability', required: false, placeholder: 'Any comments on capability assessment...', gridSpan: 2 },
    { id: 'decision', label: 'Decision', type: 'radio', section: 'decision', required: true, options: [
      { value: 'accept', label: 'Accept Order' },
      { value: 'accept_conditions', label: 'Accept with Conditions' },
      { value: 'reject', label: 'Reject Order' },
    ]},
    { id: 'conditions', label: 'Conditions/Deviations', type: 'textarea', section: 'decision', required: false, placeholder: 'List any conditions or agreed deviations...', gridSpan: 2 },
    { id: 'decisionComments', label: 'Decision Comments', type: 'textarea', section: 'decision', required: false, placeholder: 'Additional comments on the decision...', gridSpan: 2 },
  ],
  stages: [
    { id: 'draft', name: 'Draft', order: 1, description: 'Initial review in progress' },
    { id: 'review', name: 'Technical Review', order: 2, description: 'Technical team review', approverRole: 'Engineering Manager' },
    { id: 'commercial', name: 'Commercial Review', order: 3, description: 'Commercial review', approverRole: 'Sales Manager' },
    { id: 'approve', name: 'Approval', order: 4, description: 'Final approval', approverRole: 'General Manager' },
    { id: 'complete', name: 'Complete', order: 5, description: 'Review completed' },
  ],
  retentionPeriod: '10 years',
};

// ===================================
// OFI - Opportunity for Improvement
// ===================================
const OFI_FORM: QAFormDefinition = {
  code: 'OFI',
  name: 'Opportunity for Improvement',
  description: 'Suggest and track improvement opportunities across the organization',
  icon: Lightbulb,
  color: '#16a34a',
  category: 'improvement',
  sections: [
    { id: 'header', name: 'Suggestion Information', description: 'Basic suggestion details' },
    { id: 'improvement', name: 'Improvement Details', description: 'Description of the improvement' },
    { id: 'evaluation', name: 'Evaluation', description: 'Assessment of the suggestion' },
    { id: 'implementation', name: 'Implementation', description: 'Implementation details if approved' },
  ],
  fields: [
    { id: 'documentNumber', label: 'OFI Number', type: 'readonly', section: 'header', required: true },
    { id: 'submittedBy', label: 'Submitted By', type: 'readonly', section: 'header', required: true },
    { id: 'submissionDate', label: 'Submission Date', type: 'readonly', section: 'header', required: true },
    { id: 'category', label: 'Improvement Category', type: 'select', section: 'header', required: true, options: [
      { value: 'quality', label: 'Quality Improvement' },
      { value: 'productivity', label: 'Productivity' },
      { value: 'safety', label: 'Safety' },
      { value: 'cost', label: 'Cost Reduction' },
      { value: 'environment', label: 'Environmental' },
      { value: 'process', label: 'Process Improvement' },
      { value: 'other', label: 'Other' },
    ]},
    { id: 'area', label: 'Area/Department', type: 'select', section: 'header', required: true, options: [
      { value: 'production', label: 'Production' },
      { value: 'quality', label: 'Quality Assurance' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'office', label: 'Office/Admin' },
      { value: 'all', label: 'Company-wide' },
    ]},
    { id: 'currentSituation', label: 'Current Situation', type: 'textarea', section: 'improvement', required: true, placeholder: 'Describe the current situation or problem...', gridSpan: 2 },
    { id: 'proposedImprovement', label: 'Proposed Improvement', type: 'textarea', section: 'improvement', required: true, placeholder: 'Describe your improvement suggestion...', gridSpan: 2 },
    { id: 'expectedBenefits', label: 'Expected Benefits', type: 'textarea', section: 'improvement', required: true, placeholder: 'What benefits do you expect from this improvement?', gridSpan: 2 },
    { id: 'estimatedCost', label: 'Estimated Implementation Cost', type: 'select', section: 'improvement', required: false, options: [
      { value: 'none', label: 'No cost' },
      { value: 'low', label: 'Low (<$1,000)' },
      { value: 'medium', label: 'Medium ($1,000-$10,000)' },
      { value: 'high', label: 'High (>$10,000)' },
    ]},
    { id: 'attachments', label: 'Supporting Documents', type: 'file', section: 'improvement', required: false, description: 'Upload diagrams, photos, or supporting documents' },
    { id: 'evaluationComments', label: 'Evaluation Comments', type: 'textarea', section: 'evaluation', required: false, placeholder: 'Comments from evaluators...', gridSpan: 2 },
    { id: 'feasibility', label: 'Feasibility Assessment', type: 'radio', section: 'evaluation', required: false, options: [
      { value: 'high', label: 'Highly Feasible' },
      { value: 'medium', label: 'Moderately Feasible' },
      { value: 'low', label: 'Low Feasibility' },
      { value: 'not', label: 'Not Feasible' },
    ]},
    { id: 'decision', label: 'Decision', type: 'radio', section: 'evaluation', required: false, options: [
      { value: 'approved', label: 'Approved for Implementation' },
      { value: 'deferred', label: 'Deferred' },
      { value: 'rejected', label: 'Not Approved' },
    ]},
    { id: 'implementationPlan', label: 'Implementation Plan', type: 'textarea', section: 'implementation', required: false, placeholder: 'Plan for implementing the improvement...', gridSpan: 2 },
    { id: 'responsiblePerson', label: 'Responsible Person', type: 'text', section: 'implementation', required: false, placeholder: 'Name of implementation lead' },
    { id: 'targetDate', label: 'Target Implementation Date', type: 'date', section: 'implementation', required: false },
    { id: 'actualResults', label: 'Actual Results', type: 'textarea', section: 'implementation', required: false, placeholder: 'Document actual results after implementation...', gridSpan: 2 },
  ],
  stages: [
    { id: 'submitted', name: 'Submitted', order: 1, description: 'Suggestion submitted' },
    { id: 'evaluation', name: 'Evaluation', order: 2, description: 'Under evaluation', approverRole: 'Department Head' },
    { id: 'approved', name: 'Approved', order: 3, description: 'Approved for implementation' },
    { id: 'implementing', name: 'Implementing', order: 4, description: 'Implementation in progress' },
    { id: 'completed', name: 'Completed', order: 5, description: 'Implementation completed' },
  ],
  retentionPeriod: '5 years',
};

// ===================================
// DOR - Disposal of Records
// ===================================
const DOR_FORM: QAFormDefinition = {
  code: 'DOR',
  name: 'Disposal of Records',
  description: 'Document and authorize the disposal of quality records',
  icon: Archive,
  color: '#64748b',
  category: 'compliance',
  sections: [
    { id: 'header', name: 'Request Information', description: 'Basic disposal request details' },
    { id: 'records', name: 'Records to be Disposed', description: 'Details of records for disposal' },
    { id: 'approval', name: 'Authorization', description: 'Approval and authorization' },
  ],
  fields: [
    { id: 'documentNumber', label: 'DOR Number', type: 'readonly', section: 'header', required: true },
    { id: 'requestDate', label: 'Request Date', type: 'readonly', section: 'header', required: true },
    { id: 'requestedBy', label: 'Requested By', type: 'readonly', section: 'header', required: true },
    { id: 'department', label: 'Department', type: 'select', section: 'header', required: true, options: [
      { value: 'production', label: 'Production' },
      { value: 'quality', label: 'Quality Assurance' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'hr', label: 'Human Resources' },
      { value: 'finance', label: 'Finance' },
    ]},
    { id: 'recordType', label: 'Type of Records', type: 'select', section: 'records', required: true, options: [
      { value: 'quality', label: 'Quality Records' },
      { value: 'production', label: 'Production Records' },
      { value: 'training', label: 'Training Records' },
      { value: 'calibration', label: 'Calibration Records' },
      { value: 'audit', label: 'Audit Records' },
      { value: 'correspondence', label: 'Correspondence' },
      { value: 'other', label: 'Other' },
    ]},
    { id: 'recordDescription', label: 'Description of Records', type: 'textarea', section: 'records', required: true, placeholder: 'Describe the records to be disposed...', gridSpan: 2 },
    { id: 'datePeriod', label: 'Date Period Covered', type: 'text', section: 'records', required: true, placeholder: 'e.g., January 2015 - December 2018' },
    { id: 'storageLocation', label: 'Current Storage Location', type: 'text', section: 'records', required: true, placeholder: 'Where are the records currently stored?' },
    { id: 'volume', label: 'Volume/Quantity', type: 'text', section: 'records', required: true, placeholder: 'Number of boxes, folders, or files' },
    { id: 'retentionPeriod', label: 'Retention Period', type: 'text', section: 'records', required: true, placeholder: 'Required retention period' },
    { id: 'retentionExpiry', label: 'Retention Expiry Date', type: 'date', section: 'records', required: true },
    { id: 'disposalMethod', label: 'Disposal Method', type: 'select', section: 'records', required: true, options: [
      { value: 'shredding', label: 'Shredding' },
      { value: 'incineration', label: 'Incineration' },
      { value: 'secure_delete', label: 'Secure Electronic Deletion' },
      { value: 'recycling', label: 'Recycling (non-confidential)' },
    ]},
    { id: 'justification', label: 'Justification for Disposal', type: 'textarea', section: 'records', required: true, placeholder: 'Provide justification for disposal...', gridSpan: 2 },
    { id: 'approverComments', label: 'Approver Comments', type: 'textarea', section: 'approval', required: false, placeholder: 'Comments from approver...', gridSpan: 2 },
    { id: 'disposalDate', label: 'Actual Disposal Date', type: 'date', section: 'approval', required: false },
    { id: 'disposalWitness', label: 'Disposal Witness', type: 'text', section: 'approval', required: false, placeholder: 'Name of witness to disposal' },
  ],
  stages: [
    { id: 'request', name: 'Request', order: 1, description: 'Disposal request submitted' },
    { id: 'review', name: 'Review', order: 2, description: 'Under review', approverRole: 'Document Controller' },
    { id: 'approve', name: 'Approval', order: 3, description: 'Approval', approverRole: 'QA Manager' },
    { id: 'dispose', name: 'Disposal', order: 4, description: 'Records being disposed' },
    { id: 'complete', name: 'Complete', order: 5, description: 'Disposal completed' },
  ],
  retentionPeriod: 'Permanent (disposal register)',
};

// ===================================
// CAPA - Corrective and Preventive Action
// ===================================
const CAPA_FORM: QAFormDefinition = {
  code: 'CAPA',
  name: 'Corrective and Preventive Action',
  description: 'Comprehensive corrective and preventive action management',
  icon: Shield,
  color: '#dc2626',
  category: 'corrective',
  sections: [
    { id: 'header', name: 'CAPA Information', description: 'Basic CAPA details' },
    { id: 'source', name: 'Source & Description', description: 'Source and description of the issue' },
    { id: 'investigation', name: 'Investigation', description: 'Root cause investigation' },
    { id: 'actions', name: 'Actions', description: 'Corrective and preventive actions' },
    { id: 'verification', name: 'Verification & Closure', description: 'Effectiveness verification' },
  ],
  fields: [
    { id: 'documentNumber', label: 'CAPA Number', type: 'readonly', section: 'header', required: true },
    { id: 'capaType', label: 'CAPA Type', type: 'radio', section: 'header', required: true, options: [
      { value: 'corrective', label: 'Corrective Action' },
      { value: 'preventive', label: 'Preventive Action' },
      { value: 'both', label: 'Both' },
    ]},
    { id: 'priority', label: 'Priority', type: 'radio', section: 'header', required: true, options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' },
    ]},
    { id: 'initiatedBy', label: 'Initiated By', type: 'readonly', section: 'header', required: true },
    { id: 'initiatedDate', label: 'Initiated Date', type: 'readonly', section: 'header', required: true },
    { id: 'dueDate', label: 'Due Date', type: 'date', section: 'header', required: true },
    { id: 'source', label: 'Source of CAPA', type: 'select', section: 'source', required: true, options: [
      { value: 'internal_audit', label: 'Internal Audit' },
      { value: 'external_audit', label: 'External Audit' },
      { value: 'customer_complaint', label: 'Customer Complaint' },
      { value: 'ncr', label: 'Non-Conformance Report' },
      { value: 'icar', label: 'Internal Corrective Action' },
      { value: 'management_review', label: 'Management Review' },
      { value: 'risk_assessment', label: 'Risk Assessment' },
      { value: 'trend_analysis', label: 'Trend Analysis' },
      { value: 'other', label: 'Other' },
    ]},
    { id: 'sourceReference', label: 'Source Reference', type: 'text', section: 'source', required: false, placeholder: 'Reference number of source document' },
    { id: 'problemStatement', label: 'Problem Statement', type: 'textarea', section: 'source', required: true, placeholder: 'Clearly state the problem or issue...', gridSpan: 2 },
    { id: 'impactDescription', label: 'Impact Description', type: 'textarea', section: 'source', required: true, placeholder: 'Describe the impact or potential impact...', gridSpan: 2 },
    { id: 'immediateAction', label: 'Immediate Containment', type: 'textarea', section: 'source', required: false, placeholder: 'Immediate actions taken to contain the issue...', gridSpan: 2 },
    { id: 'investigationMethod', label: 'Investigation Method', type: 'select', section: 'investigation', required: true, options: [
      { value: '5why', label: '5 Whys' },
      { value: 'fishbone', label: 'Fishbone/Ishikawa' },
      { value: 'fmea', label: 'FMEA' },
      { value: 'fta', label: 'Fault Tree Analysis' },
      { value: '8d', label: '8D Methodology' },
      { value: 'pareto', label: 'Pareto Analysis' },
      { value: 'other', label: 'Other' },
    ]},
    { id: 'investigationDetails', label: 'Investigation Details', type: 'richtext', section: 'investigation', required: true, placeholder: 'Document the investigation process and findings...', gridSpan: 2 },
    { id: 'rootCauses', label: 'Root Cause(s)', type: 'textarea', section: 'investigation', required: true, placeholder: 'List identified root cause(s)...', gridSpan: 2 },
    { id: 'contributingFactors', label: 'Contributing Factors', type: 'textarea', section: 'investigation', required: false, placeholder: 'List any contributing factors...', gridSpan: 2 },
    { id: 'correctiveActions', label: 'Corrective Actions', type: 'richtext', section: 'actions', required: true, placeholder: 'List corrective actions to address root cause...', gridSpan: 2 },
    { id: 'preventiveActions', label: 'Preventive Actions', type: 'richtext', section: 'actions', required: false, placeholder: 'List preventive actions to avoid recurrence...', gridSpan: 2 },
    { id: 'actionOwner', label: 'Action Owner', type: 'text', section: 'actions', required: true, placeholder: 'Person responsible for actions' },
    { id: 'implementationDate', label: 'Implementation Target Date', type: 'date', section: 'actions', required: true },
    { id: 'resourcesRequired', label: 'Resources Required', type: 'textarea', section: 'actions', required: false, placeholder: 'List resources needed for implementation...', gridSpan: 2 },
    { id: 'verificationPlan', label: 'Verification Plan', type: 'textarea', section: 'verification', required: true, placeholder: 'How will effectiveness be verified?', gridSpan: 2 },
    { id: 'verificationResults', label: 'Verification Results', type: 'textarea', section: 'verification', required: false, placeholder: 'Document verification results...', gridSpan: 2 },
    { id: 'effectivenessConfirmed', label: 'Effectiveness Confirmed', type: 'radio', section: 'verification', required: false, options: [
      { value: 'yes', label: 'Yes - Effective' },
      { value: 'partial', label: 'Partially Effective' },
      { value: 'no', label: 'No - Not Effective' },
    ]},
    { id: 'closureComments', label: 'Closure Comments', type: 'textarea', section: 'verification', required: false, placeholder: 'Final comments for closure...', gridSpan: 2 },
  ],
  stages: [
    { id: 'open', name: 'Open', order: 1, description: 'CAPA initiated' },
    { id: 'investigation', name: 'Investigation', order: 2, description: 'Root cause investigation' },
    { id: 'planning', name: 'Action Planning', order: 3, description: 'Planning corrective/preventive actions' },
    { id: 'implementation', name: 'Implementation', order: 4, description: 'Actions being implemented' },
    { id: 'verification', name: 'Verification', order: 5, description: 'Verifying effectiveness', approverRole: 'QA Manager' },
    { id: 'closed', name: 'Closed', order: 6, description: 'CAPA completed and closed' },
  ],
  retentionPeriod: '10 years',
};

// ===================================
// NCR - Non-Conformance Report
// ===================================
const NCR_FORM: QAFormDefinition = {
  code: 'NCR',
  name: 'Non-Conformance Report',
  description: 'Document and manage product or process non-conformances',
  icon: XCircle,
  color: '#b91c1c',
  category: 'corrective',
  sections: [
    { id: 'header', name: 'NCR Information', description: 'Basic NCR details' },
    { id: 'nonconformance', name: 'Non-Conformance Details', description: 'Details of the non-conformance' },
    { id: 'disposition', name: 'Disposition', description: 'Decision on non-conforming item' },
    { id: 'closure', name: 'Closure', description: 'NCR closure details' },
  ],
  fields: [
    { id: 'documentNumber', label: 'NCR Number', type: 'readonly', section: 'header', required: true },
    { id: 'dateRaised', label: 'Date Raised', type: 'date', section: 'header', required: true },
    { id: 'raisedBy', label: 'Raised By', type: 'readonly', section: 'header', required: true },
    { id: 'department', label: 'Department', type: 'select', section: 'header', required: true, options: [
      { value: 'incoming', label: 'Incoming Inspection' },
      { value: 'production', label: 'Production' },
      { value: 'final_inspection', label: 'Final Inspection' },
      { value: 'customer', label: 'Customer Return' },
      { value: 'warehouse', label: 'Warehouse' },
    ]},
    { id: 'ncrType', label: 'NCR Type', type: 'radio', section: 'header', required: true, options: [
      { value: 'material', label: 'Material' },
      { value: 'product', label: 'Product' },
      { value: 'process', label: 'Process' },
      { value: 'documentation', label: 'Documentation' },
    ]},
    { id: 'productName', label: 'Product/Material Name', type: 'text', section: 'nonconformance', required: true, placeholder: 'Name of product or material' },
    { id: 'partNumber', label: 'Part Number/Code', type: 'text', section: 'nonconformance', required: true, placeholder: 'Part number or material code' },
    { id: 'batchNumber', label: 'Batch/Lot Number', type: 'text', section: 'nonconformance', required: false, placeholder: 'Batch or lot number' },
    { id: 'quantity', label: 'Quantity Affected', type: 'number', section: 'nonconformance', required: true, placeholder: 'Number of units affected' },
    { id: 'supplierName', label: 'Supplier Name', type: 'text', section: 'nonconformance', required: false, placeholder: 'If supplier-related' },
    { id: 'purchaseOrder', label: 'PO Number', type: 'text', section: 'nonconformance', required: false, placeholder: 'Purchase order reference' },
    { id: 'specification', label: 'Specification Reference', type: 'text', section: 'nonconformance', required: true, placeholder: 'Specification or standard reference' },
    { id: 'nonconformanceDescription', label: 'Description of Non-Conformance', type: 'textarea', section: 'nonconformance', required: true, placeholder: 'Describe what is wrong...', gridSpan: 2 },
    { id: 'requirement', label: 'Required Specification', type: 'textarea', section: 'nonconformance', required: true, placeholder: 'What should it be?', gridSpan: 2 },
    { id: 'actual', label: 'Actual Condition', type: 'textarea', section: 'nonconformance', required: true, placeholder: 'What is the actual condition?', gridSpan: 2 },
    { id: 'evidence', label: 'Evidence/Photos', type: 'file', section: 'nonconformance', required: false, description: 'Upload photos or supporting evidence', gridSpan: 2 },
    { id: 'disposition', label: 'Disposition Decision', type: 'select', section: 'disposition', required: true, options: [
      { value: 'use_as_is', label: 'Use As Is' },
      { value: 'rework', label: 'Rework' },
      { value: 'repair', label: 'Repair' },
      { value: 'scrap', label: 'Scrap' },
      { value: 'return_supplier', label: 'Return to Supplier' },
      { value: 'concession', label: 'Concession Required' },
    ]},
    { id: 'dispositionJustification', label: 'Disposition Justification', type: 'textarea', section: 'disposition', required: true, placeholder: 'Justify the disposition decision...', gridSpan: 2 },
    { id: 'reworkInstructions', label: 'Rework/Repair Instructions', type: 'textarea', section: 'disposition', required: false, placeholder: 'If rework or repair, provide instructions...', gridSpan: 2 },
    { id: 'requiresCAPA', label: 'CAPA Required?', type: 'radio', section: 'disposition', required: true, options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ]},
    { id: 'capaReference', label: 'CAPA Reference', type: 'text', section: 'disposition', required: false, placeholder: 'CAPA number if raised' },
    { id: 'dispositionCompleted', label: 'Disposition Completed', type: 'checkbox', section: 'closure', required: false, placeholder: 'Mark when disposition is completed' },
    { id: 'verificationComments', label: 'Verification Comments', type: 'textarea', section: 'closure', required: false, placeholder: 'Comments on disposition verification...', gridSpan: 2 },
    { id: 'closureDate', label: 'Closure Date', type: 'date', section: 'closure', required: false },
    { id: 'closedBy', label: 'Closed By', type: 'text', section: 'closure', required: false, placeholder: 'Name of person closing NCR' },
  ],
  stages: [
    { id: 'open', name: 'Open', order: 1, description: 'NCR raised' },
    { id: 'review', name: 'Review', order: 2, description: 'Under review', approverRole: 'QA Engineer' },
    { id: 'disposition', name: 'Disposition', order: 3, description: 'Disposition decision', approverRole: 'QA Manager' },
    { id: 'action', name: 'Action', order: 4, description: 'Disposition being executed' },
    { id: 'verification', name: 'Verification', order: 5, description: 'Verification of completion' },
    { id: 'closed', name: 'Closed', order: 6, description: 'NCR closed' },
  ],
  retentionPeriod: '10 years',
};

// ===================================
// Export all forms
// ===================================
export const QA_FORMS: Record<QAFormCode, QAFormDefinition> = {
  SOP: SOP_FORM,
  WI: WI_FORM,
  ICAR: ICAR_FORM,
  CRRF: CRRF_FORM,
  OFI: OFI_FORM,
  DOR: DOR_FORM,
  CAPA: CAPA_FORM,
  NCR: NCR_FORM,
};

export const getQAForm = (code: string): QAFormDefinition | undefined => {
  return QA_FORMS[code.toUpperCase() as QAFormCode];
};

export const getAllQAForms = (): QAFormDefinition[] => {
  return Object.values(QA_FORMS);
};