import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  Plus,
  Building2,
  FileText,
  Users,
  Package,
  ClipboardCheck,
  Truck,
  AlertTriangle,
  Star,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useEmailNotification, generateSubmissionEmailBody } from '@/hooks/use-email-notification';
import { useUser } from '@/hooks/use-user';


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

// Field section groupings for visual organization
type FieldSection = {
  id: string;
  title: string;
  description: string;
  icon: typeof Users;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  fieldIds: string[];
};

// Form configurations
const formConfigs: Record<string, {
  title: string;
  description: string;
  icon: typeof Users;
  accentColor: string;
  sections: FieldSection[];
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'file' | 'rating';
    required?: boolean;
    options?: string[];
    placeholder?: string;
    hint?: string;
  }>;
}> = {
  VCAR: {
    title: 'Vendor Corrective Action Request',
    description: 'Request corrective action from vendor for quality issues',
    icon: ClipboardCheck,
    accentColor: 'destructive',
    sections: [
      {
        id: 'vendor-info',
        title: 'Vendor Information',
        description: 'Identify the vendor and related purchase details',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['vendorName', 'vendorCode', 'poNumber', 'materialCode', 'batchNumber'],
      },
      {
        id: 'issue-details',
        title: 'Issue Details',
        description: 'Describe the problem and its severity',
        icon: AlertTriangle,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['issueType', 'severity', 'issueDate', 'issueDescription', 'rootCause'],
      },
      {
        id: 'corrective-actions',
        title: 'Corrective Actions',
        description: 'Define required actions and response timeline',
        icon: CheckCircle2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['immediateAction', 'correctiveAction', 'responseDeadline'],
      },
      {
        id: 'attachments',
        title: 'Supporting Documents',
        description: 'Upload evidence and supporting files',
        icon: FileText,
        bgColor: 'bg-muted/50 dark:bg-muted/30',
        borderColor: 'border-l-4 border-l-muted-foreground',
        iconBgColor: 'bg-muted text-muted-foreground',
        fieldIds: ['attachments'],
      },
    ],
    fields: [
      { id: 'vendorName', label: 'Vendor Name', type: 'text', required: true, hint: 'Official registered name of the vendor' },
      { id: 'vendorCode', label: 'Vendor Code', type: 'text', required: true, hint: 'e.g., VEN-001' },
      { id: 'issueType', label: 'Issue Type', type: 'select', required: true, options: ['Quality Defect', 'Late Delivery', 'Documentation Error', 'Quantity Discrepancy', 'Packaging Issue', 'Specification Non-Conformance', 'Other'] },
      { id: 'severity', label: 'Severity', type: 'select', required: true, options: ['Critical', 'Major', 'Minor', 'Observation'] },
      { id: 'poNumber', label: 'PO Number', type: 'text', required: true, hint: 'Purchase Order reference' },
      { id: 'materialCode', label: 'Material Code', type: 'text', hint: 'If applicable' },
      { id: 'batchNumber', label: 'Batch/Lot Number', type: 'text', hint: 'For traceability' },
      { id: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { id: 'issueDescription', label: 'Issue Description', type: 'textarea', required: true, hint: 'Provide detailed description of the issue' },
      { id: 'rootCause', label: 'Root Cause (if known)', type: 'textarea', hint: 'Preliminary root cause analysis' },
      { id: 'immediateAction', label: 'Immediate Containment Action', type: 'textarea', required: true, hint: 'Actions taken to contain the issue' },
      { id: 'correctiveAction', label: 'Requested Corrective Action', type: 'textarea', required: true, hint: 'What actions do you require from the vendor?' },
      { id: 'responseDeadline', label: 'Response Deadline', type: 'date', required: true },
      { id: 'attachments', label: 'Supporting Documents', type: 'file', hint: 'Photos, test reports, inspection records, etc.' },
    ],
  },
  VRF: {
    title: 'Vendor Registration Form',
    description: 'Register a new vendor for evaluation and approval',
    icon: Users,
    accentColor: 'primary',
    sections: [
      {
        id: 'company-info',
        title: 'Company Information',
        description: 'Basic company details and registration',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['companyName', 'registrationNo', 'address', 'businessType', 'yearsInBusiness', 'annualRevenue'],
      },
      {
        id: 'contact-info',
        title: 'Contact Information',
        description: 'Primary contact for communication',
        icon: Users,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['contactPerson', 'contactEmail', 'contactPhone'],
      },
      {
        id: 'business-details',
        title: 'Business Details',
        description: 'Products, certifications, and references',
        icon: Package,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['productCategory', 'certifications', 'references', 'bankDetails'],
      },
      {
        id: 'documents',
        title: 'Required Documents',
        description: 'Upload company profile and certificates',
        icon: FileText,
        bgColor: 'bg-muted/50 dark:bg-muted/30',
        borderColor: 'border-l-4 border-l-muted-foreground',
        iconBgColor: 'bg-muted text-muted-foreground',
        fieldIds: ['companyProfile', 'certificates'],
      },
    ],
    fields: [
      { id: 'companyName', label: 'Company Name', type: 'text', required: true },
      { id: 'registrationNo', label: 'Registration Number', type: 'text', required: true, hint: 'ROC/ROB number' },
      { id: 'address', label: 'Business Address', type: 'textarea', required: true },
      { id: 'contactPerson', label: 'Contact Person', type: 'text', required: true },
      { id: 'contactEmail', label: 'Email', type: 'text', required: true },
      { id: 'contactPhone', label: 'Phone', type: 'text', required: true },
      { id: 'businessType', label: 'Business Type', type: 'select', required: true, options: ['Manufacturer', 'Distributor', 'Agent', 'Trader', 'Service Provider'] },
      { id: 'productCategory', label: 'Product/Service Category', type: 'select', required: true, options: ['Raw Materials', 'Packaging', 'Equipment', 'Services', 'Chemicals', 'Spare Parts', 'Other'] },
      { id: 'yearsInBusiness', label: 'Years in Business', type: 'number' },
      { id: 'annualRevenue', label: 'Annual Revenue (RM)', type: 'number' },
      { id: 'certifications', label: 'Certifications', type: 'textarea', placeholder: 'ISO 9001, HACCP, etc.' },
      { id: 'references', label: 'Customer References', type: 'textarea' },
      { id: 'bankDetails', label: 'Bank Details', type: 'textarea' },
      { id: 'companyProfile', label: 'Company Profile', type: 'file', required: true },
      { id: 'certificates', label: 'Certificates', type: 'file' },
    ],
  },
  VEF: {
    title: 'Vendor Evaluation Form',
    description: 'Evaluate vendor performance for approval or re-evaluation',
    icon: Star,
    accentColor: 'primary',
    sections: [
      {
        id: 'vendor-info',
        title: 'Vendor Information',
        description: 'Identify the vendor being evaluated',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['vendorName', 'vendorCode', 'evaluationType'],
      },
      {
        id: 'ratings',
        title: 'Performance Ratings',
        description: 'Rate the vendor on key criteria (1-5 scale)',
        icon: Star,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['qualityRating', 'deliveryRating', 'pricingRating', 'serviceRating', 'complianceRating'],
      },
      {
        id: 'assessment',
        title: 'Assessment',
        description: 'Overall evaluation and recommendation',
        icon: ClipboardCheck,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['strengths', 'improvements', 'recommendation', 'remarks'],
      },
      {
        id: 'documents',
        title: 'Evaluation Report',
        description: 'Attach detailed evaluation documentation',
        icon: FileText,
        bgColor: 'bg-muted/50 dark:bg-muted/30',
        borderColor: 'border-l-4 border-l-muted-foreground',
        iconBgColor: 'bg-muted text-muted-foreground',
        fieldIds: ['evaluationReport'],
      },
    ],
    fields: [
      { id: 'vendorName', label: 'Vendor Name', type: 'text', required: true },
      { id: 'vendorCode', label: 'Vendor Code', type: 'text', required: true },
      { id: 'evaluationType', label: 'Evaluation Type', type: 'select', required: true, options: ['Initial Evaluation', 'Annual Review', 'Re-evaluation', 'Special Audit'] },
      { id: 'qualityRating', label: 'Quality Rating (1-5)', type: 'rating', required: true },
      { id: 'deliveryRating', label: 'Delivery Rating (1-5)', type: 'rating', required: true },
      { id: 'pricingRating', label: 'Pricing Rating (1-5)', type: 'rating', required: true },
      { id: 'serviceRating', label: 'Service Rating (1-5)', type: 'rating', required: true },
      { id: 'complianceRating', label: 'Compliance Rating (1-5)', type: 'rating', required: true },
      { id: 'strengths', label: 'Key Strengths', type: 'textarea' },
      { id: 'improvements', label: 'Areas for Improvement', type: 'textarea' },
      { id: 'recommendation', label: 'Recommendation', type: 'select', required: true, options: ['Approved', 'Approved with Conditions', 'On Probation', 'Not Approved'] },
      { id: 'remarks', label: 'Additional Remarks', type: 'textarea' },
      { id: 'evaluationReport', label: 'Evaluation Report', type: 'file' },
    ],
  },
  PR: {
    title: 'Purchase Requisition',
    description: 'Request purchase of goods or services',
    icon: Package,
    accentColor: 'primary',
    sections: [
      {
        id: 'request-info',
        title: 'Request Information',
        description: 'Department and priority details',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['department', 'requiredDate', 'priority', 'costCenter'],
      },
      {
        id: 'item-details',
        title: 'Item Details',
        description: 'Describe what you need to purchase',
        icon: Package,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['itemDescription', 'quantity', 'uom', 'estimatedCost', 'suggestedVendor'],
      },
      {
        id: 'justification',
        title: 'Business Justification',
        description: 'Explain why this purchase is needed',
        icon: FileText,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['justification', 'specifications'],
      },
    ],
    fields: [
      { id: 'department', label: 'Requesting Department', type: 'select', required: true, options: ['Production', 'QA', 'QC', 'Maintenance', 'R&D', 'Admin', 'Logistics', 'HR'] },
      { id: 'requiredDate', label: 'Required Date', type: 'date', required: true },
      { id: 'priority', label: 'Priority', type: 'select', required: true, options: ['Urgent', 'High', 'Normal', 'Low'] },
      { id: 'itemDescription', label: 'Item Description', type: 'textarea', required: true },
      { id: 'quantity', label: 'Quantity', type: 'number', required: true },
      { id: 'uom', label: 'Unit of Measure', type: 'select', options: ['EA', 'KG', 'L', 'M', 'SET', 'BOX', 'ROLL', 'PAC'] },
      { id: 'estimatedCost', label: 'Estimated Cost (RM)', type: 'number' },
      { id: 'suggestedVendor', label: 'Suggested Vendor', type: 'text' },
      { id: 'justification', label: 'Business Justification', type: 'textarea', required: true },
      { id: 'costCenter', label: 'Cost Center', type: 'text', required: true },
      { id: 'specifications', label: 'Technical Specifications', type: 'file' },
    ],
  },
  GRN: {
    title: 'Goods Received Note',
    description: 'Record receipt of goods from vendor',
    icon: Truck,
    accentColor: 'primary',
    sections: [
      {
        id: 'order-info',
        title: 'Order Information',
        description: 'Reference the original purchase order',
        icon: FileText,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['poNumber', 'vendorName', 'deliveryDate', 'doNumber'],
      },
      {
        id: 'material-info',
        title: 'Material Details',
        description: 'Details of the received goods',
        icon: Package,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['materialCode', 'description', 'batchNumber', 'expiryDate'],
      },
      {
        id: 'quantity-check',
        title: 'Quantity & Condition',
        description: 'Verify received quantity and condition',
        icon: ClipboardCheck,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['orderedQty', 'receivedQty', 'uom', 'condition', 'storageLocation', 'remarks'],
      },
      {
        id: 'photos',
        title: 'Photo Evidence',
        description: 'Upload photos of received goods',
        icon: FileText,
        bgColor: 'bg-muted/50 dark:bg-muted/30',
        borderColor: 'border-l-4 border-l-muted-foreground',
        iconBgColor: 'bg-muted text-muted-foreground',
        fieldIds: ['photos'],
      },
    ],
    fields: [
      { id: 'poNumber', label: 'PO Number', type: 'text', required: true },
      { id: 'vendorName', label: 'Vendor Name', type: 'text', required: true },
      { id: 'deliveryDate', label: 'Delivery Date', type: 'date', required: true },
      { id: 'doNumber', label: 'Delivery Order Number', type: 'text', required: true },
      { id: 'materialCode', label: 'Material Code', type: 'text', required: true },
      { id: 'description', label: 'Material Description', type: 'text', required: true },
      { id: 'orderedQty', label: 'Ordered Quantity', type: 'number', required: true },
      { id: 'receivedQty', label: 'Received Quantity', type: 'number', required: true },
      { id: 'uom', label: 'Unit of Measure', type: 'select', options: ['EA', 'KG', 'L', 'M', 'SET', 'BOX', 'ROLL', 'PAC'] },
      { id: 'batchNumber', label: 'Batch/Lot Number', type: 'text' },
      { id: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { id: 'condition', label: 'Condition', type: 'select', required: true, options: ['Good', 'Damaged', 'Partial Damage', 'Rejected'] },
      { id: 'storageLocation', label: 'Storage Location', type: 'text' },
      { id: 'remarks', label: 'Remarks', type: 'textarea' },
      { id: 'photos', label: 'Photos of Goods', type: 'file' },
    ],
  },
  MER: {
    title: 'Material Evaluation Request',
    description: 'Request evaluation of new or alternative material',
    icon: Package,
    accentColor: 'primary',
    sections: [
      {
        id: 'material-info',
        title: 'Material Information',
        description: 'Details about the material to evaluate',
        icon: Package,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['materialName', 'proposedVendor', 'evaluationType', 'currentMaterial'],
      },
      {
        id: 'technical',
        title: 'Technical Details',
        description: 'Specifications and application',
        icon: ClipboardCheck,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['application', 'specifications', 'testingRequired', 'sampleAvailable'],
      },
      {
        id: 'business-case',
        title: 'Business Case',
        description: 'Volume estimates and cost justification',
        icon: FileText,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['estimatedVolume', 'estimatedSavings', 'justification'],
      },
      {
        id: 'documents',
        title: 'Technical Documents',
        description: 'Upload TDS, MSDS, and other documents',
        icon: FileText,
        bgColor: 'bg-muted/50 dark:bg-muted/30',
        borderColor: 'border-l-4 border-l-muted-foreground',
        iconBgColor: 'bg-muted text-muted-foreground',
        fieldIds: ['technicalData', 'msds'],
      },
    ],
    fields: [
      { id: 'materialName', label: 'Material Name', type: 'text', required: true },
      { id: 'proposedVendor', label: 'Proposed Vendor', type: 'text', required: true },
      { id: 'evaluationType', label: 'Evaluation Type', type: 'select', required: true, options: ['New Material', 'Alternative Material', 'Cost Reduction', 'Quality Improvement', 'Vendor Change'] },
      { id: 'currentMaterial', label: 'Current Material (if replacing)', type: 'text' },
      { id: 'application', label: 'Application/Use', type: 'textarea', required: true },
      { id: 'specifications', label: 'Technical Specifications', type: 'textarea', required: true },
      { id: 'estimatedVolume', label: 'Estimated Annual Volume', type: 'text' },
      { id: 'estimatedSavings', label: 'Estimated Savings (RM)', type: 'number' },
      { id: 'sampleAvailable', label: 'Sample Available', type: 'checkbox' },
      { id: 'testingRequired', label: 'Testing Required', type: 'textarea' },
      { id: 'justification', label: 'Business Justification', type: 'textarea', required: true },
      { id: 'technicalData', label: 'Technical Data Sheet', type: 'file', required: true },
      { id: 'msds', label: 'MSDS', type: 'file' },
    ],
  },
};

// Default form config
const defaultConfig = {
  title: 'Procurement Form',
  description: 'Complete this form and submit for approval',
  icon: Package,
  accentColor: 'primary',
  sections: [
    {
      id: 'form-details',
      title: 'Form Details',
      description: 'Complete all required information',
      icon: FileText,
      bgColor: 'bg-muted/50 dark:bg-muted/30',
      borderColor: 'border-l-4 border-l-muted-foreground',
      iconBgColor: 'bg-muted text-muted-foreground',
      fieldIds: ['title', 'vendorName', 'description', 'site', 'attachment'],
    },
  ],
  fields: [
    { id: 'title', label: 'Title', type: 'text' as const, required: true },
    { id: 'vendorName', label: 'Vendor Name', type: 'text' as const, required: true },
    { id: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { id: 'site', label: 'Site', type: 'select' as const, required: true, options: ['Prai', 'Johor'] },
    { id: 'attachment', label: 'Attachments', type: 'file' as const },
  ],
};

export default function ProcurementFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();
  const { sendNotification, isSending } = useEmailNotification();

  const config = formConfigs[formCode || ''] || defaultConfig;
  const FormIcon = config.icon;

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    
    const ticketId = `PROC-${format(new Date(), 'yyyyMMdd')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Send email notification
    if (!isDraft && user?.userPrincipalName) {
      try {
        const emailBody = generateSubmissionEmailBody({
          ticketId,
          formName: config.title,
          formCode: formCode || 'PROC',
          submittedBy: user.fullName || 'User',
          submittedByEmail: user.userPrincipalName,
          submittedDate: format(new Date(), 'MMM d, yyyy h:mm a'),
          approverName: 'Procurement Department',
          approverRole: 'Approver',
          priority: String(formData.priority || 'Normal'),
          justification: String(formData.justification || formData.issueDescription || ''),
        });
        
        await sendNotification({
          to: user.userPrincipalName,
          subject: `[${ticketId}] ${config.title} Submitted`,
          body: emailBody,
          formCode: formCode,
          notifyType: 'Submission',
        });
      } catch (error: unknown) {
        console.error('Failed to send email notification:', error);
      }
    }
    
    if (isDraft) {
      toast.success('Draft saved successfully');
    } else {
      toast.success(`${config.title} submitted for approval`, {
        description: `Ticket ${ticketId} has been created and confirmation email sent.`,
      });
      navigate('/procurement');
    }
    
    setIsSubmitting(false);
  };

  const getFieldById = (fieldId: string) => {
    return config.fields.find((f) => f.id === fieldId);
  };

  const renderField = (rawField: typeof config.fields[0]) => {
    const field = rawField as typeof rawField & { placeholder?: string; hint?: string };
    const isRequired = field.required;
    
    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="text-sm font-semibold text-foreground">
          {field.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        {field.type === 'text' && (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={(formData[field.id] as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {field.type === 'number' && (
          <Input
            id={field.id}
            type="number"
            value={(formData[field.id] as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {field.type === 'textarea' && (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            rows={3}
            value={(formData[field.id] as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors resize-none"
          />
        )}
        
        {field.type === 'select' && field.options && (
          <Select
            value={(formData[field.id] as string) || ''}
            onValueChange={(value: string) => handleFieldChange(field.id, value)}
          >
            <SelectTrigger className="bg-background border-2 focus:border-primary transition-colors">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {field.type === 'date' && (
          <Input
            id={field.id}
            type="date"
            value={(formData[field.id] as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {field.type === 'checkbox' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border-2">
            <Checkbox
              id={field.id}
              checked={!!formData[field.id]}
              onCheckedChange={(checked: boolean) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="font-normal cursor-pointer">{field.label}</Label>
          </div>
        )}
        
        {field.type === 'rating' && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                type="button"
                variant={formData[field.id] === String(rating) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFieldChange(field.id, String(rating))}
                className="w-12 h-12 text-lg font-bold"
              >
                {rating}
              </Button>
            ))}
          </div>
        )}
        
        {field.type === 'file' && (
          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Drag & drop files or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS, JPG up to 10MB</p>
            <Button variant="outline" size="sm" className="mt-3">
              <Plus className="h-4 w-4 mr-2" />
              Add Files
            </Button>
          </div>
        )}

        {field.hint && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {field.hint}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="space-y-6 p-6 max-w-4xl mx-auto pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to="/procurement/forms">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FormIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">{config.title}</h1>
              <p className="text-muted-foreground text-sm">{config.description}</p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-sm shrink-0">{formCode}</Badge>
      </motion.div>

      {/* Progress indicator */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sections:</span>
        <div className="flex gap-1">
          {config.sections.map((section: FieldSection, index: number) => (
            <div
              key={section.id}
              className={`h-2 w-8 rounded-full ${
                section.fieldIds.some((id: string) => formData[id])
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
              title={section.title}
            />
          ))}
        </div>
      </motion.div>

      {/* Site Selection */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              Site Selection
              <span className="text-destructive">*</span>
            </CardTitle>
            <CardDescription>Select the site this form applies to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={formData.site === 'Prai' ? 'default' : 'outline'}
                onClick={() => handleFieldChange('site', 'Prai')}
                className="flex-1 h-14 text-base"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Prai (Penang)
              </Button>
              <Button
                variant={formData.site === 'Johor' ? 'default' : 'outline'}
                onClick={() => handleFieldChange('site', 'Johor')}
                className="flex-1 h-14 text-base"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Pasir Gudang (Johor)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Sections */}
      {config.sections.map((section: FieldSection) => {
        const SectionIcon = section.icon;
        const sectionFields = section.fieldIds
          .map((id: string) => getFieldById(id))
          .filter((f): f is typeof config.fields[0] => f !== undefined);

        if (sectionFields.length === 0) return null;

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
                <div className="bg-card/80 backdrop-blur rounded-lg p-5 space-y-5 border">
                  {sectionFields.map((field) => renderField(field))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex gap-3 justify-end sticky bottom-6 bg-background/80 backdrop-blur p-4 -mx-6 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-12 px-6">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-12 px-8">
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      </motion.div>
    </motion.div>
  );
}