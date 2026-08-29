import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Factory,
  Save,
  Send,
  ArrowLeft,
  Building2,
  FileText,
  CheckCircle2,
  Wrench,
  Gauge,
  Package,
  BarChart3,
  Thermometer,
  Settings,
  AlertTriangle,
  ClipboardCheck,
  Info,
  Upload,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateMainDBPRD } from '@/generated/hooks/use-main-dbprd';
import { useUser } from '@/hooks/use-user';
import type { MainDBPRD } from '@/generated/models/main-dbprd-model';

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
  icon: typeof Building2;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  fieldIds: string[];
};

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'file';
  required?: boolean;
  options?: string[];
  hint?: string;
}

interface FormDefinition {
  title: string;
  category: string;
  sections: FieldSection[];
  fields: FormField[];
}

type ProductionFormValues = Record<string, string>;

const getTextValue = (values: ProductionFormValues, ...fieldNames: string[]) => {
  for (const fieldName of fieldNames) {
    const value = values[fieldName];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
};

const summarizeValues = (formDef: FormDefinition, values: ProductionFormValues) => {
  return formDef.fields
    .filter((field) => field.type !== 'file')
    .map((field) => {
      const value = values[field.name];
      if (!value) return null;
      return `${field.label}: ${value}`;
    })
    .filter((line): line is string => Boolean(line))
    .join('\n');
};

const formDefinitions: Record<string, FormDefinition> = {
  'TPM-001': {
    title: 'TPM Database Entry',
    category: 'TPM',
    sections: [
      {
        id: 'equipment-info',
        title: 'Equipment Information',
        description: 'Identify the equipment for maintenance',
        icon: Wrench,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['equipmentId', 'equipmentName', 'location'],
      },
      {
        id: 'maintenance-details',
        title: 'Maintenance Details',
        description: 'Specify maintenance type and schedule',
        icon: Settings,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['maintenanceType', 'scheduledDate', 'technician'],
      },
      {
        id: 'work-description',
        title: 'Work Description',
        description: 'Document the work performed',
        icon: FileText,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['workDescription', 'spareParts', 'downtime', 'remarks'],
      },
    ],
    fields: [
      { name: 'equipmentId', label: 'Equipment ID', type: 'text', required: true, hint: 'e.g., EQ-001' },
      { name: 'equipmentName', label: 'Equipment Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'select', required: true, options: ['Line A', 'Line B', 'Line C', 'Line D', 'Utilities', 'Warehouse'] },
      { name: 'maintenanceType', label: 'Maintenance Type', type: 'select', required: true, options: ['Preventive', 'Corrective', 'Predictive', 'Breakdown'] },
      { name: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
      { name: 'technician', label: 'Technician', type: 'text', required: true },
      { name: 'workDescription', label: 'Work Description', type: 'textarea', required: true, hint: 'Describe the maintenance work in detail' },
      { name: 'spareParts', label: 'Spare Parts Used', type: 'textarea', hint: 'List all spare parts used' },
      { name: 'downtime', label: 'Downtime (hours)', type: 'number' },
      { name: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
  'TPM-002': {
    title: 'TPM Daily Checklist',
    category: 'TPM',
    sections: [
      {
        id: 'shift-info',
        title: 'Shift Information',
        description: 'Record shift and operator details',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['date', 'shift', 'operator', 'equipmentId'],
      },
      {
        id: 'inspection-checks',
        title: 'Inspection Checks',
        description: 'Record inspection results',
        icon: ClipboardCheck,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['visualInspection', 'lubrication', 'cleaning'],
      },
      {
        id: 'findings',
        title: 'Findings & Actions',
        description: 'Document any abnormalities found',
        icon: AlertTriangle,
        bgColor: 'bg-destructive/10 dark:bg-destructive/5',
        borderColor: 'border-l-4 border-l-destructive',
        iconBgColor: 'bg-destructive text-destructive-foreground',
        fieldIds: ['abnormalities', 'actionTaken'],
      },
    ],
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'shift', label: 'Shift', type: 'select', required: true, options: ['Morning', 'Afternoon', 'Night'] },
      { name: 'operator', label: 'Operator Name', type: 'text', required: true },
      { name: 'equipmentId', label: 'Equipment ID', type: 'text', required: true },
      { name: 'visualInspection', label: 'Visual Inspection', type: 'select', required: true, options: ['OK', 'Not OK', 'N/A'] },
      { name: 'lubrication', label: 'Lubrication Check', type: 'select', required: true, options: ['OK', 'Not OK', 'N/A'] },
      { name: 'cleaning', label: 'Cleaning Status', type: 'select', required: true, options: ['OK', 'Not OK', 'N/A'] },
      { name: 'abnormalities', label: 'Abnormalities Found', type: 'textarea', hint: 'Describe any issues discovered' },
      { name: 'actionTaken', label: 'Action Taken', type: 'textarea' },
    ],
  },
  'CCP-001': {
    title: 'CCP Filter Inspection',
    category: 'CCP',
    sections: [
      {
        id: 'inspection-info',
        title: 'Inspection Information',
        description: 'Basic inspection details',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['date', 'shift', 'inspector', 'ccpPoint'],
      },
      {
        id: 'filter-details',
        title: 'Filter Details',
        description: 'Filter type and condition assessment',
        icon: Gauge,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['filterType', 'filterCondition', 'differentialPressure'],
      },
      {
        id: 'compliance',
        title: 'Compliance & Actions',
        description: 'Critical limit verification and corrective actions',
        icon: CheckCircle2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['criticalLimit', 'correctiveAction', 'verifiedBy'],
      },
    ],
    fields: [
      { name: 'date', label: 'Inspection Date', type: 'date', required: true },
      { name: 'shift', label: 'Shift', type: 'select', required: true, options: ['Morning', 'Afternoon', 'Night'] },
      { name: 'inspector', label: 'Inspector Name', type: 'text', required: true },
      { name: 'ccpPoint', label: 'CCP Point', type: 'select', required: true, options: ['CCP-1 (Filtration)', 'CCP-2 (Metal Detection)', 'CCP-3 (Temperature)', 'CCP-4 (pH Control)'] },
      { name: 'filterType', label: 'Filter Type', type: 'text', required: true },
      { name: 'filterCondition', label: 'Filter Condition', type: 'select', required: true, options: ['Good', 'Fair', 'Replace Required'] },
      { name: 'differentialPressure', label: 'Differential Pressure (bar)', type: 'number', required: true },
      { name: 'criticalLimit', label: 'Critical Limit Met', type: 'select', required: true, options: ['Yes', 'No'] },
      { name: 'correctiveAction', label: 'Corrective Action (if deviation)', type: 'textarea' },
      { name: 'verifiedBy', label: 'Verified By', type: 'text' },
    ],
  },
  'PR-001': {
    title: 'Daily Production Report',
    category: 'Reports',
    sections: [
      {
        id: 'shift-details',
        title: 'Shift Details',
        description: 'Production date and shift information',
        icon: Building2,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['date', 'shift', 'supervisor', 'productLine'],
      },
      {
        id: 'production-metrics',
        title: 'Production Metrics',
        description: 'Output and variance tracking',
        icon: BarChart3,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-accent text-accent-foreground',
        fieldIds: ['plannedOutput', 'actualOutput', 'variance', 'rejectQty'],
      },
      {
        id: 'downtime-info',
        title: 'Downtime & Remarks',
        description: 'Record any production interruptions',
        icon: AlertTriangle,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['downtimeHours', 'downtimeReason', 'remarks'],
      },
    ],
    fields: [
      { name: 'date', label: 'Production Date', type: 'date', required: true },
      { name: 'shift', label: 'Shift', type: 'select', required: true, options: ['Morning', 'Afternoon', 'Night'] },
      { name: 'supervisor', label: 'Shift Supervisor', type: 'text', required: true },
      { name: 'productLine', label: 'Product Line', type: 'select', required: true, options: ['Oleochemicals', 'Fatty Acids', 'Glycerine', 'Specialties'] },
      { name: 'plannedOutput', label: 'Planned Output (MT)', type: 'number', required: true },
      { name: 'actualOutput', label: 'Actual Output (MT)', type: 'number', required: true },
      { name: 'variance', label: 'Variance (%)', type: 'number' },
      { name: 'rejectQty', label: 'Reject Quantity (MT)', type: 'number' },
      { name: 'downtimeHours', label: 'Downtime (hours)', type: 'number' },
      { name: 'downtimeReason', label: 'Downtime Reason', type: 'textarea' },
      { name: 'remarks', label: 'Shift Remarks', type: 'textarea' },
    ],
  },
  'MM-001': {
    title: 'Material Master Entry',
    category: 'Material',
    sections: [
      {
        id: 'material-info',
        title: 'Material Information',
        description: 'Basic material identification',
        icon: Package,
        bgColor: 'bg-accent/10 dark:bg-accent/5',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-primary/10 text-primary',
        fieldIds: ['materialCode', 'materialName', 'category', 'unit'],
      },
      {
        id: 'specifications',
        title: 'Specifications',
        description: 'Technical specifications and supplier',
        icon: FileText,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-accent-foreground',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['specification', 'supplier'],
      },
      {
        id: 'storage',
        title: 'Storage & Safety',
        description: 'Storage requirements and hazard classification',
        icon: Thermometer,
        bgColor: 'bg-secondary/50 dark:bg-secondary/30',
        borderColor: 'border-l-4 border-l-primary',
        iconBgColor: 'bg-secondary text-secondary-foreground',
        fieldIds: ['shelfLife', 'storageCondition', 'hazardClass'],
      },
    ],
    fields: [
      { name: 'materialCode', label: 'Material Code', type: 'text', required: true, hint: 'e.g., RM-001' },
      { name: 'materialName', label: 'Material Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Raw Material', 'Intermediate', 'Finished Good', 'Packaging', 'Chemical'] },
      { name: 'unit', label: 'Unit of Measure', type: 'select', required: true, options: ['KG', 'MT', 'L', 'PCS', 'DRUM'] },
      { name: 'specification', label: 'Specification', type: 'textarea', required: true, hint: 'Detailed technical specifications' },
      { name: 'supplier', label: 'Approved Supplier', type: 'text' },
      { name: 'shelfLife', label: 'Shelf Life (months)', type: 'number' },
      { name: 'storageCondition', label: 'Storage Condition', type: 'textarea' },
      { name: 'hazardClass', label: 'Hazard Classification', type: 'select', options: ['Non-Hazardous', 'Flammable', 'Corrosive', 'Toxic', 'Oxidizer'] },
    ],
  },
};

const defaultFormDef: FormDefinition = {
  title: 'Production Form',
  category: 'General',
  sections: [
    {
      id: 'form-details',
      title: 'Form Details',
      description: 'Complete all required information',
      icon: FileText,
      bgColor: 'bg-muted/50 dark:bg-muted/30',
      borderColor: 'border-l-4 border-l-muted-foreground',
      iconBgColor: 'bg-muted text-muted-foreground',
      fieldIds: ['date', 'shift', 'operator', 'description', 'remarks'],
    },
  ],
  fields: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'shift', label: 'Shift', type: 'select', required: true, options: ['Morning', 'Afternoon', 'Night'] },
    { name: 'operator', label: 'Operator', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' },
  ],
};

const promotedFormMetadata: Record<string, Pick<FormDefinition, 'title' | 'category'>> = {
  EQUIPREINSP: { title: 'Equipment Pre-Inspection Report', category: 'Inspection' },
  SAPMATEMAST: { title: 'SAP Material Master Maintenance Request', category: 'Material' },
  STOCALLOMEMO: { title: 'Stock Allocation Memo', category: 'Stock' },
  CCP1FILTINSP: { title: 'CCP1 Filter Inspection Findings', category: 'CCP' },
  STORTANKVERI: { title: 'Storage Tank Verification Form', category: 'Tank' },
  FILTCLOTREPL: { title: 'Filter Cloth Replacement Record', category: 'Inspection' },
  ASMR: { title: 'ASMR Production Record', category: 'Reports' },
  PMD: { title: 'PMD Production Record', category: 'Reports' },
  PSMR: { title: 'PSMR Production Record', category: 'Reports' },
  RMTC: { title: 'RMTC Production Record', category: 'Reports' },
  BHTADDI: { title: 'BHT Addition Database', category: 'Process' },
  DRAWREQ: { title: 'Drawing Request', category: 'Equipment' },
  FIICI: { title: 'FIICI', category: 'Inspection' },
  OPRPCCPFILT: { title: 'OPRP/CCP Filter Inspection Record', category: 'CCP' },
  STORTANKCLEA: { title: 'Storage Tank Cleaning Inspection', category: 'Tank' },
  WEIGSCALVERI: { title: 'Weighing Scale Verification', category: 'Weighing' },
  TPM: { title: 'TPM Database', category: 'TPM' },
};

function getSharePointProductionFormCode(code?: string) {
  const upper = code?.toUpperCase();
  if (upper && promotedFormMetadata[upper]) return upper;
  if (upper === 'EPIR') return 'EQUIPREINSP';
  if (upper === 'SAPMMM') return 'SAPMATEMAST';
  if (upper === 'SAM') return 'STOCALLOMEMO';
  if (upper === 'CCP1') return 'CCP1FILTINSP';
  if (upper === 'STVF') return 'STORTANKVERI';
  if (upper === 'BHTADD') return 'BHTADDI';
  if (upper === 'OPRPCCP') return 'OPRPCCPFILT';
  if (upper === 'STCI') return 'STORTANKCLEA';
  if (upper === 'WSV') return 'WEIGSCALVERI';
  if (code?.startsWith('TPM-')) return 'TPM';
  if (code?.startsWith('CCP-')) return 'CCP1FILTINSP';
  if (code?.startsWith('MM-') || code?.startsWith('MAT-')) return 'SAPMATEMAST';
  if (code?.startsWith('PR-') || code?.startsWith('RPT-')) return 'ASMR';
  if (code?.startsWith('WD-')) return 'WEIGSCALVERI';
  if (code?.startsWith('EQ-') || code?.startsWith('EQP-')) return 'DRAWREQ';
  return code || 'ASMR';
}

const getProductionFormDefinition = (code?: string): FormDefinition => {
  if (code && formDefinitions[code]) return formDefinitions[code];

  const sharePointCode = getSharePointProductionFormCode(code);
  const metadata = promotedFormMetadata[sharePointCode];
  if (!metadata) return defaultFormDef;

  return {
    ...defaultFormDef,
    title: metadata.title,
    category: metadata.category,
  };
};

export default function ProductionFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<string>('prai');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();
  const createRecord = useCreateMainDBPRD();

  const formDef = getProductionFormDefinition(formCode);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({ ...prev, [fieldName]: value }));
  };

  const generateFormId = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${getSharePointProductionFormCode(formCode)}-${dateStr}-${random}`;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    const formId = generateFormId();
    
    try {
      const submittedOn = new Date().toISOString();
      const fieldSummary = summarizeValues(formDef, formData);
      const primaryTitle =
        getTextValue(formData, 'description', 'materialName', 'equipmentName', 'productLine', 'ccpPoint') ||
        formDef.title;

      const record: Omit<MainDBPRD, 'id'> = {
        title: formId,
        formCode: getSharePointProductionFormCode(formCode),
        formReferenceID: formId,
        currentStage: isDraft ? 'Draft' : 'Submitted',
        siteKey: site === 'johor' ? 'SiteKey1' : 'SiteKey0',
        submittedOn,
        requestorEmail: user?.userPrincipalName || '',
        requestorDisplayName: user?.fullName || user?.userPrincipalName || '',
        requestedBy: user?.fullName || user?.userPrincipalName || '',
        departmentKey: 'DepartmentKey10',
        statusKey: isDraft ? 'StatusKey0' : 'StatusKey1',
        appName: formDef.title,
        businessArea: formDef.category,
        requestTitle: primaryTitle,
        description: fieldSummary || formDef.title,
        productionDate: getTextValue(formData, 'date', 'scheduledDate'),
        shiftInformation: getTextValue(formData, 'shift'),
        productCode: getTextValue(formData, 'productLine', 'materialCode', 'category'),
        productionBatchNumber: getTextValue(formData, 'batchNumber'),
        systemCode: getTextValue(formData, 'equipmentId', 'materialCode', 'ccpPoint'),
        quantityMT: getTextValue(formData, 'actualOutput', 'plannedOutput', 'rejectQty'),
        inspectionDate: getTextValue(formData, 'date', 'scheduledDate'),
        inspectedBy: getTextValue(formData, 'inspector', 'operator', 'technician', 'supervisor', 'verifiedBy'),
        inspectionRemarks: getTextValue(
          formData,
          'correctiveAction',
          'actionTaken',
          'abnormalities',
          'downtimeReason',
          'remarks'
        ),
        reasonForChange: getTextValue(formData, 'correctiveAction', 'abnormalities', 'description'),
        targetDate: getTextValue(formData, 'scheduledDate'),
        workflowAction: isDraft ? 'Save Draft' : 'Submit',
      };

      await createRecord.mutateAsync(record);

      if (isDraft) {
        toast.success('Draft saved successfully');
      } else {
        toast.success('Form submitted successfully!', {
          description: `${formDef.title} has been saved to SharePoint and routed for approval.`,
        });
        navigate(`/production/forms/${getSharePointProductionFormCode(formCode)}`);
      }
    } catch (error: unknown) {
      toast.error('Failed to submit form', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
    setIsSubmitting(false);
  };

  const getFieldByName = (fieldName: string) => {
    return formDef.fields.find((f) => f.name === fieldName);
  };

  const renderField = (field: FormField) => {
    const isRequired = field.required;
    
    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
          {field.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        {field.type === 'text' && (
          <Input
            id={field.name}
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {field.type === 'number' && (
          <Input
            id={field.name}
            type="number"
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {field.type === 'textarea' && (
          <Textarea
            id={field.name}
            rows={3}
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors resize-none"
          />
        )}
        
        {field.type === 'select' && field.options && (
          <Select
            value={formData[field.name] || ''}
            onValueChange={(val: string) => handleFieldChange(field.name, val)}
          >
            <SelectTrigger className="bg-background border-2 focus:border-primary transition-colors">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt: string) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {field.type === 'date' && (
          <Input
            id={field.name}
            type="date"
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/production/forms')} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Factory className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">{formDef.title}</h1>
              <p className="text-muted-foreground text-sm">Production form for {formDef.category}</p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-sm shrink-0">{formCode || 'NEW'}</Badge>
      </motion.div>

      {/* Progress indicator */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sections:</span>
        <div className="flex gap-1">
          {formDef.sections.map((section: FieldSection) => (
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
                variant={site === 'prai' ? 'default' : 'outline'}
                onClick={() => setSite('prai')}
                className="flex-1 h-14 text-base"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Prai (Penang)
              </Button>
              <Button
                variant={site === 'johor' ? 'default' : 'outline'}
                onClick={() => setSite('johor')}
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
      {formDef.sections.map((section: FieldSection) => {
        const SectionIcon = section.icon;
        const sectionFields = section.fieldIds
          .map((name: string) => getFieldByName(name))
          .filter((f): f is FormField => f !== undefined);

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

      {/* Info Banner */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Connected to SharePoint</p>
              <p className="text-sm text-muted-foreground mt-1">
                This form saves directly to MainDB_PRD in SharePoint. It will be routed to the Production Supervisor for review, then to the Production Manager for final approval.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
