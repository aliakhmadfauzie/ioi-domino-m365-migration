/**
 * QA Dynamic Form Page
 * Handles creation of all QA form types based on formCode parameter
 * With color-coded sections for visual differentiation
 */

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Building2,
  User,
  Upload,
  Plus,
  Trash2,
  Info,
  Loader2,
  ClipboardCheck,
  Shield,
  Beaker,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Form field types
interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'file' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
  defaultValue?: string | boolean | number;
  section?: string;
}

// Section configuration for color-coded visual organization
interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
}

// Form configuration by code
interface FormConfig {
  code: string;
  name: string;
  description: string;
  category: string;
  fields: FormField[];
  sections: SectionConfig[];
  approvalRequired?: boolean;
  attachmentsAllowed?: boolean;
}

// Section color themes
const sectionThemes = {
  blue: {
    bgColor: 'bg-secondary/50 dark:bg-secondary/30',
    borderColor: 'border-l-4 border-l-blue-500',
    iconBgColor: 'bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground',
  },
  violet: {
    bgColor: 'bg-secondary/50 dark:bg-violet-950/30',
    borderColor: 'border-l-4 border-l-violet-500',
    iconBgColor: 'bg-secondary dark:bg-violet-900 text-secondary-foreground dark:text-violet-300',
  },
  amber: {
    bgColor: 'bg-accent/50 dark:bg-accent/30',
    borderColor: 'border-l-4 border-l-amber-500',
    iconBgColor: 'bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground',
  },
  emerald: {
    bgColor: 'bg-primary/5 dark:bg-primary/30',
    borderColor: 'border-l-4 border-l-emerald-500',
    iconBgColor: 'bg-primary/10 dark:bg-primary text-primary dark:text-primary',
  },
  rose: {
    bgColor: 'bg-destructive/5 dark:bg-destructive/30',
    borderColor: 'border-l-4 border-l-rose-500',
    iconBgColor: 'bg-destructive/10 dark:bg-destructive text-destructive dark:text-destructive',
  },
  slate: {
    bgColor: 'bg-muted/50 dark:bg-background/30',
    borderColor: 'border-l-4 border-l-slate-400',
    iconBgColor: 'bg-muted dark:bg-muted text-foreground dark:text-muted-foreground',
  },
};

// Generate form configurations for different form types
const getFormConfig = (formCode: string): FormConfig | null => {
  const upperCode = formCode.toUpperCase();
  
  // NCR Forms
  if (upperCode.startsWith('NCR')) {
    return {
      code: upperCode,
      name: 'Non-Conformance Report',
      description: 'Document and track non-conforming products or processes',
      category: 'NCR & Audit',
      approvalRequired: true,
      attachmentsAllowed: true,
      sections: [
        {
          id: 'identification',
          title: 'Identification',
          description: 'Basic identification and classification',
          icon: Building2,
          ...sectionThemes.blue,
        },
        {
          id: 'description',
          title: 'Issue Description',
          description: 'Describe the non-conformance in detail',
          icon: AlertTriangle,
          ...sectionThemes.amber,
        },
        {
          id: 'investigation',
          title: 'Root Cause Analysis',
          description: 'Investigate and identify root cause',
          icon: Beaker,
          ...sectionThemes.violet,
        },
        {
          id: 'actions',
          title: 'Corrective Actions',
          description: 'Define corrective and preventive actions',
          icon: CheckCircle2,
          ...sectionThemes.emerald,
        },
      ],
      fields: [
        { id: 'ncr_number', label: 'NCR Number', type: 'text', required: true, placeholder: 'Auto-generated', section: 'identification' },
        { id: 'site', label: 'Site', type: 'select', required: true, options: [{ value: 'PRAI', label: 'Prai' }, { value: 'JHR', label: 'Johor' }], section: 'identification' },
        { id: 'department', label: 'Department', type: 'select', required: true, options: [
          { value: 'QA', label: 'Quality Assurance' },
          { value: 'QC', label: 'Quality Control' },
          { value: 'PROD', label: 'Production' },
          { value: 'WHSE', label: 'Warehouse' },
          { value: 'MAINT', label: 'Maintenance' },
        ], section: 'identification' },
        { id: 'nc_type', label: 'NC Type', type: 'select', required: true, options: [
          { value: 'PRODUCT', label: 'Product Non-Conformance' },
          { value: 'PROCESS', label: 'Process Non-Conformance' },
          { value: 'MATERIAL', label: 'Raw Material NC' },
          { value: 'EQUIPMENT', label: 'Equipment NC' },
          { value: 'DOCUMENTATION', label: 'Documentation NC' },
        ], section: 'identification' },
        { id: 'severity', label: 'Severity', type: 'select', required: true, options: [
          { value: 'CRITICAL', label: 'Critical' },
          { value: 'MAJOR', label: 'Major' },
          { value: 'MINOR', label: 'Minor' },
        ], section: 'identification' },
        { id: 'detected_date', label: 'Date Detected', type: 'date', required: true, section: 'identification' },
        { id: 'detected_by', label: 'Detected By', type: 'text', required: true, section: 'identification' },
        { id: 'product_name', label: 'Product/Process Name', type: 'text', required: true, section: 'description' },
        { id: 'batch_number', label: 'Batch Number', type: 'text', section: 'description' },
        { id: 'quantity_affected', label: 'Quantity Affected', type: 'number', section: 'description' },
        { id: 'description', label: 'Description of Non-Conformance', type: 'textarea', required: true, placeholder: 'Describe the non-conformance in detail...', section: 'description' },
        { id: 'immediate_action', label: 'Immediate Action Taken', type: 'textarea', required: true, placeholder: 'Describe containment actions...', section: 'description' },
        { id: 'root_cause', label: 'Root Cause Analysis', type: 'textarea', helpText: 'Use 5-Why or Fishbone analysis', section: 'investigation' },
        { id: 'corrective_action', label: 'Corrective Action', type: 'textarea', section: 'actions' },
        { id: 'preventive_action', label: 'Preventive Action', type: 'textarea', section: 'actions' },
        { id: 'target_date', label: 'Target Completion Date', type: 'date', section: 'actions' },
        { id: 'responsible_person', label: 'Responsible Person', type: 'text', section: 'actions' },
        { id: 'verification_required', label: 'Verification Required', type: 'checkbox', defaultValue: true, section: 'actions' },
      ],
    };
  }

  // CAPA Forms
  if (upperCode.startsWith('CAPA') || upperCode === 'NCR-006') {
    return {
      code: upperCode,
      name: 'Corrective and Preventive Action',
      description: 'Formal CAPA process for quality issues',
      category: 'NCR & Audit',
      approvalRequired: true,
      attachmentsAllowed: true,
      sections: [
        {
          id: 'initiation',
          title: 'CAPA Initiation',
          description: 'Define the problem and source',
          icon: FileText,
          ...sectionThemes.blue,
        },
        {
          id: 'investigation',
          title: 'Investigation',
          description: 'Root cause analysis methodology',
          icon: Beaker,
          ...sectionThemes.violet,
        },
        {
          id: 'action_plan',
          title: 'Action Plan',
          description: 'Corrective and preventive measures',
          icon: CheckCircle2,
          ...sectionThemes.emerald,
        },
        {
          id: 'verification',
          title: 'Verification',
          description: 'Effectiveness check criteria',
          icon: Shield,
          ...sectionThemes.amber,
        },
      ],
      fields: [
        { id: 'capa_number', label: 'CAPA Number', type: 'text', required: true, placeholder: 'Auto-generated', section: 'initiation' },
        { id: 'capa_type', label: 'CAPA Type', type: 'select', required: true, options: [
          { value: 'CORRECTIVE', label: 'Corrective Action' },
          { value: 'PREVENTIVE', label: 'Preventive Action' },
        ], section: 'initiation' },
        { id: 'source', label: 'Source', type: 'select', required: true, options: [
          { value: 'NCR', label: 'Non-Conformance Report' },
          { value: 'AUDIT', label: 'Audit Finding' },
          { value: 'COMPLAINT', label: 'Customer Complaint' },
          { value: 'DEVIATION', label: 'Process Deviation' },
          { value: 'MANAGEMENT_REVIEW', label: 'Management Review' },
          { value: 'TREND_ANALYSIS', label: 'Trend Analysis' },
          { value: 'OTHER', label: 'Other' },
        ], section: 'initiation' },
        { id: 'reference_number', label: 'Reference Number', type: 'text', helpText: 'NCR/Audit/Complaint reference', section: 'initiation' },
        { id: 'priority', label: 'Priority', type: 'select', required: true, options: [
          { value: 'CRITICAL', label: 'Critical (24h)' },
          { value: 'HIGH', label: 'High (7 days)' },
          { value: 'MEDIUM', label: 'Medium (30 days)' },
          { value: 'LOW', label: 'Low (90 days)' },
        ], section: 'initiation' },
        { id: 'site', label: 'Site', type: 'select', required: true, options: [{ value: 'PRAI', label: 'Prai' }, { value: 'JHR', label: 'Johor' }], section: 'initiation' },
        { id: 'department', label: 'Department', type: 'select', required: true, options: [
          { value: 'QA', label: 'Quality Assurance' },
          { value: 'QC', label: 'Quality Control' },
          { value: 'PROD', label: 'Production' },
          { value: 'WHSE', label: 'Warehouse' },
          { value: 'MAINT', label: 'Maintenance' },
          { value: 'ENG', label: 'Engineering' },
        ], section: 'initiation' },
        { id: 'problem_statement', label: 'Problem Statement', type: 'textarea', required: true, placeholder: 'Clearly describe the problem...', section: 'initiation' },
        { id: 'investigation_method', label: 'Investigation Method', type: 'select', options: [
          { value: '5_WHY', label: '5-Why Analysis' },
          { value: 'FISHBONE', label: 'Fishbone Diagram' },
          { value: 'FMEA', label: 'FMEA' },
          { value: 'FAULT_TREE', label: 'Fault Tree Analysis' },
          { value: 'OTHER', label: 'Other' },
        ], section: 'investigation' },
        { id: 'root_cause', label: 'Root Cause', type: 'textarea', required: true, section: 'investigation' },
        { id: 'contributing_factors', label: 'Contributing Factors', type: 'textarea', section: 'investigation' },
        { id: 'corrective_action', label: 'Corrective Action(s)', type: 'textarea', required: true, section: 'action_plan' },
        { id: 'preventive_action', label: 'Preventive Action(s)', type: 'textarea', section: 'action_plan' },
        { id: 'responsible_person', label: 'Responsible Person', type: 'text', required: true, section: 'action_plan' },
        { id: 'target_date', label: 'Target Date', type: 'date', required: true, section: 'action_plan' },
        { id: 'verification_method', label: 'Verification Method', type: 'textarea', section: 'verification' },
        { id: 'effectiveness_criteria', label: 'Effectiveness Criteria', type: 'textarea', section: 'verification' },
      ],
    };
  }

  // Change Control Forms
  if (upperCode.startsWith('CC-0')) {
    return {
      code: upperCode,
      name: 'Change Request Form',
      description: 'Initiate product or process change request',
      category: 'Change Control',
      approvalRequired: true,
      attachmentsAllowed: true,
      sections: [
        {
          id: 'change_details',
          title: 'Change Details',
          description: 'Define what is being changed',
          icon: FileText,
          ...sectionThemes.blue,
        },
        {
          id: 'impact_assessment',
          title: 'Impact Assessment',
          description: 'Evaluate quality, safety, and regulatory impact',
          icon: AlertTriangle,
          ...sectionThemes.amber,
        },
        {
          id: 'approval',
          title: 'Approval & Implementation',
          description: 'Approval routing and timeline',
          icon: CheckCircle2,
          ...sectionThemes.emerald,
        },
      ],
      fields: [
        { id: 'change_number', label: 'Change Request Number', type: 'text', required: true, placeholder: 'Auto-generated', section: 'change_details' },
        { id: 'change_type', label: 'Type of Change', type: 'select', required: true, options: [
          { value: 'FORMULA', label: 'Formula/Recipe Change' },
          { value: 'PROCESS', label: 'Process Change' },
          { value: 'EQUIPMENT', label: 'Equipment Change' },
          { value: 'PACKAGING', label: 'Packaging Change' },
          { value: 'SUPPLIER', label: 'Supplier Change' },
          { value: 'SPECIFICATION', label: 'Specification Change' },
          { value: 'DOCUMENT', label: 'Document Change' },
          { value: 'LABEL', label: 'Label Change' },
        ], section: 'change_details' },
        { id: 'site', label: 'Site', type: 'select', required: true, options: [{ value: 'PRAI', label: 'Prai' }, { value: 'JHR', label: 'Johor' }, { value: 'BOTH', label: 'Both Sites' }], section: 'change_details' },
        { id: 'department', label: 'Initiating Department', type: 'select', required: true, options: [
          { value: 'QA', label: 'Quality Assurance' },
          { value: 'RD', label: 'R&D' },
          { value: 'PROD', label: 'Production' },
          { value: 'ENG', label: 'Engineering' },
          { value: 'PROC', label: 'Procurement' },
        ], section: 'change_details' },
        { id: 'product_affected', label: 'Product(s) Affected', type: 'text', required: true, section: 'change_details' },
        { id: 'current_state', label: 'Current State', type: 'textarea', required: true, placeholder: 'Describe current situation...', section: 'change_details' },
        { id: 'proposed_change', label: 'Proposed Change', type: 'textarea', required: true, placeholder: 'Describe the proposed change...', section: 'change_details' },
        { id: 'reason_for_change', label: 'Reason for Change', type: 'textarea', required: true, section: 'change_details' },
        { id: 'quality_impact', label: 'Quality Impact', type: 'select', required: true, options: [
          { value: 'NONE', label: 'No Impact' },
          { value: 'LOW', label: 'Low Impact' },
          { value: 'MEDIUM', label: 'Medium Impact' },
          { value: 'HIGH', label: 'High Impact' },
        ], section: 'impact_assessment' },
        { id: 'safety_impact', label: 'Safety Impact', type: 'select', required: true, options: [
          { value: 'NONE', label: 'No Impact' },
          { value: 'LOW', label: 'Low Impact' },
          { value: 'MEDIUM', label: 'Medium Impact' },
          { value: 'HIGH', label: 'High Impact' },
        ], section: 'impact_assessment' },
        { id: 'regulatory_impact', label: 'Regulatory Impact', type: 'checkbox', section: 'impact_assessment' },
        { id: 'customer_notification', label: 'Customer Notification Required', type: 'checkbox', section: 'impact_assessment' },
        { id: 'validation_required', label: 'Validation Required', type: 'checkbox', section: 'impact_assessment' },
        { id: 'impact_description', label: 'Impact Description', type: 'textarea', section: 'impact_assessment' },
        { id: 'implementation_date', label: 'Proposed Implementation Date', type: 'date', required: true, section: 'approval' },
        { id: 'departments_to_approve', label: 'Departments Required to Approve', type: 'textarea', helpText: 'List all departments that need to approve', section: 'approval' },
      ],
    };
  }

  // Validation Forms
  if (upperCode.startsWith('VAL')) {
    return {
      code: upperCode,
      name: 'Validation Protocol',
      description: 'Process/Method validation documentation',
      category: 'Validation',
      approvalRequired: true,
      attachmentsAllowed: true,
      sections: [
        {
          id: 'protocol_information',
          title: 'Protocol Information',
          description: 'Basic protocol identification',
          icon: FileText,
          ...sectionThemes.blue,
        },
        {
          id: 'scope',
          title: 'Scope & Objectives',
          description: 'Define what is being validated',
          icon: Scale,
          ...sectionThemes.violet,
        },
        {
          id: 'acceptance_criteria',
          title: 'Acceptance Criteria',
          description: 'Define pass/fail criteria',
          icon: CheckCircle2,
          ...sectionThemes.emerald,
        },
        {
          id: 'results',
          title: 'Results & Timeline',
          description: 'Execution details and dates',
          icon: ClipboardCheck,
          ...sectionThemes.amber,
        },
      ],
      fields: [
        { id: 'protocol_number', label: 'Protocol Number', type: 'text', required: true, section: 'protocol_information' },
        { id: 'validation_type', label: 'Validation Type', type: 'select', required: true, options: [
          { value: 'PROCESS', label: 'Process Validation' },
          { value: 'CLEANING', label: 'Cleaning Validation' },
          { value: 'METHOD', label: 'Method Validation' },
          { value: 'EQUIPMENT', label: 'Equipment Qualification' },
          { value: 'COMPUTER', label: 'Computer System Validation' },
        ], section: 'protocol_information' },
        { id: 'site', label: 'Site', type: 'select', required: true, options: [{ value: 'PRAI', label: 'Prai' }, { value: 'JHR', label: 'Johor' }], section: 'protocol_information' },
        { id: 'product_process', label: 'Product/Process/Equipment', type: 'text', required: true, section: 'protocol_information' },
        { id: 'version', label: 'Protocol Version', type: 'text', defaultValue: '1.0', section: 'protocol_information' },
        { id: 'objective', label: 'Objective', type: 'textarea', required: true, section: 'scope' },
        { id: 'scope', label: 'Scope', type: 'textarea', required: true, section: 'scope' },
        { id: 'exclusions', label: 'Exclusions', type: 'textarea', section: 'scope' },
        { id: 'reference_documents', label: 'Reference Documents', type: 'textarea', section: 'scope' },
        { id: 'acceptance_criteria', label: 'Acceptance Criteria', type: 'textarea', required: true, section: 'acceptance_criteria' },
        { id: 'test_parameters', label: 'Test Parameters', type: 'textarea', required: true, section: 'acceptance_criteria' },
        { id: 'sampling_plan', label: 'Sampling Plan', type: 'textarea', section: 'acceptance_criteria' },
        { id: 'planned_start', label: 'Planned Start Date', type: 'date', section: 'results' },
        { id: 'planned_end', label: 'Planned End Date', type: 'date', section: 'results' },
        { id: 'responsible_person', label: 'Responsible Person', type: 'text', required: true, section: 'results' },
      ],
    };
  }

  // Default generic form
  return {
    code: upperCode,
    name: 'Quality Form',
    description: 'General quality assurance form',
    category: 'General',
    approvalRequired: true,
    attachmentsAllowed: true,
    sections: [
      {
        id: 'details',
        title: 'Form Details',
        description: 'Basic form information',
        icon: FileText,
        ...sectionThemes.blue,
      },
      {
        id: 'description',
        title: 'Description',
        description: 'Describe the subject matter',
        icon: ClipboardCheck,
        ...sectionThemes.violet,
      },
      {
        id: 'actions',
        title: 'Actions',
        description: 'Required actions and responsible parties',
        icon: CheckCircle2,
        ...sectionThemes.emerald,
      },
    ],
    fields: [
      { id: 'form_number', label: 'Form Number', type: 'text', required: true, section: 'details' },
      { id: 'site', label: 'Site', type: 'select', required: true, options: [{ value: 'PRAI', label: 'Prai' }, { value: 'JHR', label: 'Johor' }], section: 'details' },
      { id: 'department', label: 'Department', type: 'select', required: true, options: [
        { value: 'QA', label: 'Quality Assurance' },
        { value: 'QC', label: 'Quality Control' },
        { value: 'PROD', label: 'Production' },
      ], section: 'details' },
      { id: 'date', label: 'Date', type: 'date', required: true, section: 'details' },
      { id: 'title', label: 'Title', type: 'text', required: true, section: 'description' },
      { id: 'description', label: 'Description', type: 'textarea', required: true, section: 'description' },
      { id: 'action_required', label: 'Action Required', type: 'textarea', section: 'actions' },
      { id: 'responsible', label: 'Responsible Person', type: 'text', section: 'actions' },
      { id: 'due_date', label: 'Due Date', type: 'date', section: 'actions' },
    ],
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

export default function QAFormNewPage() {
  const { formCode = '' } = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string | boolean | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const formConfig = useMemo(() => getFormConfig(formCode), [formCode]);

  if (!formConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-accent-foreground mb-4" />
            <h2 className="text-xl font-semibold">Form Not Found</h2>
            <p className="text-muted-foreground mt-2">The form code "{formCode}" is not recognized.</p>
            <Button asChild className="mt-4">
              <Link to="/qa/forms">Back to Forms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, value: string | boolean | number) => {
    setFormData((prev: Record<string, string | boolean | number>) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (isDraft) {
      toast.success('Draft saved successfully');
    } else {
      toast.success(`${formConfig.code} submitted for approval`);
    }
    
    setIsSubmitting(false);
    navigate('/qa/forms');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments((prev: File[]) => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];

    return (
      <div key={field.id} className={cn('space-y-2', field.type === 'textarea' && 'col-span-2')}>
        {field.type !== 'checkbox' && (
          <Label htmlFor={field.id} className="text-sm font-semibold text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        {field.type === 'text' && (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}

        {field.type === 'number' && (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={(value as number) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, Number(e.target.value))}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}

        {field.type === 'textarea' && (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.id, e.target.value)}
            rows={4}
            className="bg-background border-2 focus:border-primary transition-colors resize-none"
          />
        )}

        {field.type === 'select' && (
          <Select
            value={(value as string) || ''}
            onValueChange={(val: string) => handleFieldChange(field.id, val)}
          >
            <SelectTrigger className="bg-background border-2 focus:border-primary transition-colors">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: { value: string; label: string }) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === 'date' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal border-2 bg-background',
                  !value && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value ? format(new Date(value as string), 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={value ? new Date(value as string) : undefined}
                onSelect={(date: Date | undefined) => handleFieldChange(field.id, date?.toISOString() || '')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        {field.type === 'checkbox' && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-background border-2">
            <Checkbox
              id={field.id}
              checked={(value as boolean) || false}
              onCheckedChange={(checked: boolean) => handleFieldChange(field.id, checked)}
            />
            <label htmlFor={field.id} className="text-sm font-medium leading-none cursor-pointer">
              {field.label}
            </label>
          </div>
        )}

        {field.helpText && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {field.helpText}
          </p>
        )}
      </div>
    );
  };

  // Group fields by section
  const fieldsBySection = formConfig.sections.reduce(
    (acc: Record<string, FormField[]>, section: SectionConfig) => {
      acc[section.id] = formConfig.fields.filter((f: FormField) => f.section === section.id);
      return acc;
    },
    {} as Record<string, FormField[]>
  );

  return (
    <motion.div
      className="min-h-screen bg-background pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/qa/forms" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{formConfig.name}</h1>
                  <Badge variant="outline">{formConfig.code}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{formConfig.category}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Form Info Alert */}
        <motion.div variants={itemVariants}>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>New {formConfig.code} Form</AlertTitle>
            <AlertDescription>
              {formConfig.description}. Fields marked with * are required.
              {formConfig.approvalRequired && ' This form requires approval before processing.'}
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Submitter Info */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.fullName || 'QA User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.userPrincipalName || 'qa@ioiacidchem.com'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Submission Date</p>
                  <p className="text-sm font-medium">{format(new Date(), 'PPP')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress indicator */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sections:</span>
          <div className="flex gap-1">
            {formConfig.sections.map((section: SectionConfig) => (
              <div
                key={section.id}
                className={`h-2 w-8 rounded-full ${
                  fieldsBySection[section.id]?.some((f: FormField) => formData[f.id])
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                title={section.title}
              />
            ))}
          </div>
        </motion.div>

        {/* Form Sections */}
        {formConfig.sections.map((section: SectionConfig) => {
          const sectionFields = fieldsBySection[section.id] || [];
          if (sectionFields.length === 0) return null;
          
          const SectionIcon = section.icon;

          return (
            <motion.div key={section.id} variants={itemVariants}>
              <Card className={`${section.bgColor} ${section.borderColor} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${section.iconBgColor}`}>
                      <SectionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-lg">{section.title}</span>
                      <CardDescription className="font-normal mt-0.5">
                        {section.description}
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="bg-card/80 backdrop-blur rounded-lg p-5 border">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {sectionFields.map((field: FormField) => renderField(field))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Attachments */}
        {formConfig.attachmentsAllowed && (
          <motion.div variants={itemVariants}>
            <Card className={`${sectionThemes.slate.bgColor} ${sectionThemes.slate.borderColor} border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${sectionThemes.slate.iconBgColor}`}>
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-lg">Attachments</span>
                    <CardDescription className="font-normal mt-0.5">
                      Upload supporting documents, images, or evidence
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-card/80 backdrop-blur rounded-lg p-5 border space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-1" /> Add Files
                      </label>
                    </Button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((file: File, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAttachment(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Button variant="outline" asChild>
            <Link to="/qa/forms">Cancel</Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="h-12 px-6"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="h-12 px-8"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}