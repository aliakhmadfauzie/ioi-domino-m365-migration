import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Shield,
  Save,
  Send,
  ArrowLeft,
  Building2,
  FileText,
  AlertTriangle,
  Users,
  Camera,
  Loader2,
  Activity,
  Flame,
  UserX,
  ClipboardCheck,
  type LucideIcon,
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
import { useCreateMainDBSHE } from '@/generated/hooks/use-main-dbshe';
import { useUser } from '@/hooks/use-user';
import { useEmailNotification, generateSubmissionEmailBody } from '@/hooks/use-email-notification';

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

interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  fieldIds: string[];
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  required?: boolean;
  options?: string[];
  hint?: string;
}

interface FormDefinition {
  title: string;
  category: string;
  priority?: string;
  sections: SectionConfig[];
  fields: FieldConfig[];
}

const formDefinitions: Record<string, FormDefinition> = {
  'IR-001': {
    title: 'Incident Report Form',
    category: 'Incidents',
    priority: 'high',
    sections: [
      {
        id: 'incident-info',
        title: 'Incident Information',
        description: 'Date, time, and location of the incident',
        icon: AlertTriangle,
        ...sectionThemes.rose,
        fieldIds: ['incidentDate', 'incidentTime', 'location', 'department'],
      },
      {
        id: 'classification',
        title: 'Incident Classification',
        description: 'Type and severity of the incident',
        icon: Activity,
        ...sectionThemes.amber,
        fieldIds: ['incidentType', 'severity'],
      },
      {
        id: 'injured-person',
        title: 'Injured Person Details',
        description: 'Information about the affected person',
        icon: UserX,
        ...sectionThemes.violet,
        fieldIds: ['injuredPerson', 'employeeId', 'injuryType', 'bodyPart'],
      },
      {
        id: 'description',
        title: 'Incident Details',
        description: 'Describe what happened and actions taken',
        icon: FileText,
        ...sectionThemes.blue,
        fieldIds: ['description', 'rootCause', 'immediateAction'],
      },
      {
        id: 'witnesses',
        title: 'Reporting Information',
        description: 'Witnesses and reporter details',
        icon: Users,
        ...sectionThemes.emerald,
        fieldIds: ['witnesses', 'reportedBy'],
      },
    ],
    fields: [
      { name: 'incidentDate', label: 'Date of Incident', type: 'date', required: true },
      { name: 'incidentTime', label: 'Time of Incident', type: 'text', required: true, hint: 'e.g., 14:30' },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'Warehouse', 'QC/QA', 'Utilities', 'Office', 'Contractor'] },
      { name: 'incidentType', label: 'Incident Type', type: 'select', required: true, options: ['Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time Injury', 'Fatality', 'Property Damage', 'Environmental'] },
      { name: 'severity', label: 'Severity Level', type: 'select', required: true, options: ['Minor', 'Moderate', 'Major', 'Critical'] },
      { name: 'injuredPerson', label: 'Injured Person Name', type: 'text' },
      { name: 'employeeId', label: 'Employee ID', type: 'text' },
      { name: 'injuryType', label: 'Type of Injury', type: 'select', options: ['Cut/Laceration', 'Burn', 'Fracture', 'Sprain/Strain', 'Chemical Exposure', 'Eye Injury', 'Respiratory', 'Other'] },
      { name: 'bodyPart', label: 'Body Part Affected', type: 'select', options: ['Head', 'Eyes', 'Face', 'Neck', 'Back', 'Chest', 'Arms', 'Hands', 'Legs', 'Feet', 'Multiple'] },
      { name: 'description', label: 'Incident Description', type: 'textarea', required: true, hint: 'Describe exactly what happened' },
      { name: 'rootCause', label: 'Root Cause (if known)', type: 'textarea' },
      { name: 'immediateAction', label: 'Immediate Action Taken', type: 'textarea', required: true },
      { name: 'witnesses', label: 'Witnesses', type: 'text', hint: 'Names of witnesses, separated by commas' },
      { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
    ],
  },
  'IR-002': {
    title: 'Near Miss Report',
    category: 'Incidents',
    priority: 'high',
    sections: [
      {
        id: 'occurrence',
        title: 'Occurrence Details',
        description: 'When and where the near miss occurred',
        icon: AlertTriangle,
        ...sectionThemes.amber,
        fieldIds: ['date', 'time', 'location', 'department'],
      },
      {
        id: 'hazard',
        title: 'Hazard Information',
        description: 'Type of hazard and potential consequence',
        icon: Activity,
        ...sectionThemes.rose,
        fieldIds: ['hazardType', 'potentialConsequence'],
      },
      {
        id: 'description',
        title: 'Description & Actions',
        description: 'Describe the near miss and suggested actions',
        icon: FileText,
        ...sectionThemes.blue,
        fieldIds: ['description', 'suggestedAction'],
      },
      {
        id: 'reporter',
        title: 'Reporter Information',
        description: 'Who is reporting this near miss',
        icon: Users,
        ...sectionThemes.emerald,
        fieldIds: ['reportedBy'],
      },
    ],
    fields: [
      { name: 'date', label: 'Date of Occurrence', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'Warehouse', 'QC/QA', 'Utilities', 'Office'] },
      { name: 'hazardType', label: 'Hazard Type', type: 'select', required: true, options: ['Slip/Trip/Fall', 'Falling Object', 'Chemical', 'Electrical', 'Fire', 'Machinery', 'Ergonomic', 'Other'] },
      { name: 'potentialConsequence', label: 'Potential Consequence', type: 'select', required: true, options: ['Minor Injury', 'Serious Injury', 'Fatality', 'Property Damage', 'Environmental'] },
      { name: 'description', label: 'Description of Near Miss', type: 'textarea', required: true },
      { name: 'suggestedAction', label: 'Suggested Corrective Action', type: 'textarea' },
      { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
    ],
  },
  'HR-001': {
    title: 'HIRADC Assessment',
    category: 'HIRADC',
    sections: [
      {
        id: 'assessment-info',
        title: 'Assessment Information',
        description: 'Basic assessment details',
        icon: ClipboardCheck,
        ...sectionThemes.blue,
        fieldIds: ['assessmentDate', 'department', 'area', 'activity'],
      },
      {
        id: 'hazard',
        title: 'Hazard Identification',
        description: 'Identify hazards and potential consequences',
        icon: AlertTriangle,
        ...sectionThemes.amber,
        fieldIds: ['hazard', 'consequence'],
      },
      {
        id: 'risk-rating',
        title: 'Risk Rating',
        description: 'Likelihood and severity assessment',
        icon: Activity,
        ...sectionThemes.rose,
        fieldIds: ['likelihood', 'severity'],
      },
      {
        id: 'controls',
        title: 'Control Measures',
        description: 'Existing and additional controls',
        icon: Shield,
        ...sectionThemes.emerald,
        fieldIds: ['existingControls', 'additionalControls'],
      },
      {
        id: 'responsibility',
        title: 'Responsibility & Timeline',
        description: 'Who is responsible and target dates',
        icon: Users,
        ...sectionThemes.violet,
        fieldIds: ['responsiblePerson', 'targetDate', 'assessedBy'],
      },
    ],
    fields: [
      { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'Warehouse', 'QC/QA', 'Utilities', 'Office'] },
      { name: 'area', label: 'Work Area', type: 'text', required: true },
      { name: 'activity', label: 'Activity/Process', type: 'text', required: true },
      { name: 'hazard', label: 'Hazard Identified', type: 'textarea', required: true, hint: 'Describe the hazard in detail' },
      { name: 'consequence', label: 'Potential Consequence', type: 'textarea', required: true },
      { name: 'likelihood', label: 'Likelihood', type: 'select', required: true, options: ['1 - Rare', '2 - Unlikely', '3 - Possible', '4 - Likely', '5 - Almost Certain'] },
      { name: 'severity', label: 'Severity', type: 'select', required: true, options: ['1 - Insignificant', '2 - Minor', '3 - Moderate', '4 - Major', '5 - Catastrophic'] },
      { name: 'existingControls', label: 'Existing Control Measures', type: 'textarea', required: true },
      { name: 'additionalControls', label: 'Additional Controls Required', type: 'textarea' },
      { name: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true },
      { name: 'targetDate', label: 'Target Completion Date', type: 'date' },
      { name: 'assessedBy', label: 'Assessed By', type: 'text', required: true },
    ],
  },
  'CM-004': {
    title: 'Chemical Spill Report',
    category: 'Chemical',
    priority: 'high',
    sections: [
      {
        id: 'spill-info',
        title: 'Spill Information',
        description: 'When and where the spill occurred',
        icon: AlertTriangle,
        ...sectionThemes.rose,
        fieldIds: ['spillDate', 'spillTime', 'location'],
      },
      {
        id: 'chemical-details',
        title: 'Chemical Details',
        description: 'Identify the chemical and quantity',
        icon: Flame,
        ...sectionThemes.amber,
        fieldIds: ['chemicalName', 'quantity', 'spillArea'],
      },
      {
        id: 'cause-containment',
        title: 'Cause & Containment',
        description: 'What caused the spill and how it was contained',
        icon: Shield,
        ...sectionThemes.blue,
        fieldIds: ['causeOfSpill', 'containment'],
      },
      {
        id: 'impact',
        title: 'Impact Assessment',
        description: 'Personnel exposure and environmental impact',
        icon: Users,
        ...sectionThemes.violet,
        fieldIds: ['personnelExposed', 'environmentalImpact'],
      },
      {
        id: 'actions',
        title: 'Cleanup & Prevention',
        description: 'Actions taken and preventive measures',
        icon: ClipboardCheck,
        ...sectionThemes.emerald,
        fieldIds: ['cleanupAction', 'wasteDisposal', 'preventiveAction', 'reportedBy'],
      },
    ],
    fields: [
      { name: 'spillDate', label: 'Date of Spill', type: 'date', required: true },
      { name: 'spillTime', label: 'Time of Spill', type: 'text', required: true },
      { name: 'location', label: 'Spill Location', type: 'text', required: true },
      { name: 'chemicalName', label: 'Chemical Name', type: 'text', required: true },
      { name: 'quantity', label: 'Estimated Quantity (L/kg)', type: 'number', required: true },
      { name: 'spillArea', label: 'Spill Area (sq meters)', type: 'number' },
      { name: 'causeOfSpill', label: 'Cause of Spill', type: 'select', required: true, options: ['Container Leak', 'Transfer Error', 'Equipment Failure', 'Human Error', 'Unknown'] },
      { name: 'containment', label: 'Containment Method', type: 'select', required: true, options: ['Absorbent', 'Neutralization', 'Diking', 'Recovery', 'Dilution'] },
      { name: 'personnelExposed', label: 'Personnel Exposed', type: 'select', required: true, options: ['None', 'Yes - No Injury', 'Yes - First Aid', 'Yes - Medical Treatment'] },
      { name: 'environmentalImpact', label: 'Environmental Impact', type: 'select', required: true, options: ['None', 'Contained on Site', 'Released to Drain', 'Released to Ground', 'Released to Air'] },
      { name: 'cleanupAction', label: 'Cleanup Actions Taken', type: 'textarea', required: true },
      { name: 'wasteDisposal', label: 'Waste Disposal Method', type: 'textarea' },
      { name: 'preventiveAction', label: 'Preventive Actions', type: 'textarea' },
      { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
    ],
  },
  'PTW-001': {
    title: 'Permit to Work',
    category: 'Permits',
    sections: [
      {
        id: 'permit-info',
        title: 'Permit Information',
        description: 'Permit number and work schedule',
        icon: ClipboardCheck,
        ...sectionThemes.blue,
        fieldIds: ['permitNo', 'workDate', 'startTime', 'endTime'],
      },
      {
        id: 'work-details',
        title: 'Work Details',
        description: 'Location and description of work',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['workLocation', 'workDescription', 'contractor', 'workersNames'],
      },
      {
        id: 'hazards-precautions',
        title: 'Hazards & Precautions',
        description: 'Identified hazards and required precautions',
        icon: AlertTriangle,
        ...sectionThemes.amber,
        fieldIds: ['hazards', 'precautions'],
      },
      {
        id: 'ppe-isolation',
        title: 'PPE & Isolation',
        description: 'Required PPE and isolation requirements',
        icon: Shield,
        ...sectionThemes.emerald,
        fieldIds: ['ppeRequired', 'isolationRequired'],
      },
      {
        id: 'authorization',
        title: 'Authorization',
        description: 'Who requested and authorized the permit',
        icon: Users,
        ...sectionThemes.slate,
        fieldIds: ['requestedBy', 'authorizedBy'],
      },
    ],
    fields: [
      { name: 'permitNo', label: 'Permit Number', type: 'text', required: true },
      { name: 'workDate', label: 'Work Date', type: 'date', required: true },
      { name: 'startTime', label: 'Start Time', type: 'text', required: true },
      { name: 'endTime', label: 'End Time', type: 'text', required: true },
      { name: 'workLocation', label: 'Work Location', type: 'text', required: true },
      { name: 'workDescription', label: 'Description of Work', type: 'textarea', required: true },
      { name: 'contractor', label: 'Contractor Company', type: 'text' },
      { name: 'workersNames', label: 'Workers Names', type: 'textarea', required: true },
      { name: 'hazards', label: 'Hazards Identified', type: 'textarea', required: true },
      { name: 'precautions', label: 'Precautions Required', type: 'textarea', required: true },
      { name: 'ppeRequired', label: 'PPE Required', type: 'select', required: true, options: ['Basic PPE', 'Full PPE', 'Respiratory Protection', 'Chemical Suit', 'Fall Protection'] },
      { name: 'isolationRequired', label: 'Isolation Required', type: 'select', required: true, options: ['None', 'Electrical', 'Mechanical', 'Process', 'Multiple'] },
      { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
      { name: 'authorizedBy', label: 'Authorized By', type: 'text' },
    ],
  },
};

const defaultFormDef: FormDefinition = {
  title: 'SHE Form',
  category: 'General',
  sections: [
    {
      id: 'details',
      title: 'Form Details',
      description: 'Complete all required information',
      icon: FileText,
      ...sectionThemes.blue,
      fieldIds: ['date', 'location', 'department', 'description', 'actionRequired', 'reportedBy'],
    },
  ],
  fields: [
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'Warehouse', 'QC/QA', 'Utilities', 'Office'] },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'actionRequired', label: 'Action Required', type: 'textarea' },
    { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
  ],
};

export default function SHEFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [site, setSite] = useState<string>('prai');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();
  const createRecord = useCreateMainDBSHE();
  const { sendNotification, isSending } = useEmailNotification();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    pageRef.current?.focus();
  }, []);

  const formDef = formCode && formDefinitions[formCode] ? formDefinitions[formCode] : defaultFormDef;
  const isHighPriority = 'priority' in formDef && formDef.priority === 'high';

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({ ...prev, [fieldName]: value }));
  };

  const generateFormId = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${formCode || 'SHE'}-${dateStr}-${random}`;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    const formId = generateFormId();

    try {
      await createRecord.mutateAsync({
        title: formId,
        formCode: formCode || 'SHE',
        currentStage: 1,
        siteKey: site === 'johor' ? 'SiteKey1' : 'SiteKey0',
        submittedDate: new Date().toISOString(),
        requestorEmail: user?.userPrincipalName || '',
        priorityKey: isHighPriority ? 'PriorityKey0' : 'PriorityKey1',
        departmentKey: 'DepartmentKey16',
        statusKey: 'StatusKey1',
        requestTitle: JSON.stringify({
          ...formData,
          category: formDef.category,
        }),
      });

      // Send email notification
      if (!isDraft && user?.userPrincipalName) {
        try {
          const emailBody = generateSubmissionEmailBody({
            ticketId: formId,
            formName: formDef.title,
            formCode: formCode || 'SHE',
            submittedBy: user.fullName || 'Unknown',
            submittedByEmail: user.userPrincipalName,
            submittedDate: new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' }),
            approverName: 'SHE Department',
            approverRole: 'Approver',
            priority: isHighPriority ? 'High' : 'Normal',
            justification: JSON.stringify(formData),
          });

          await sendNotification({
            to: user.userPrincipalName,
            subject: `SHE Form Submission Confirmation: ${formDef.title} (${formId})`,
            body: emailBody,
          });

          // Send copy to SHE department
          await sendNotification({
            to: 'she@ioichem.com',
            subject: `New SHE Form Submission: ${formDef.title} (${formId})`,
            body: emailBody,
          });
        } catch (emailError: unknown) {
          console.error('Failed to send email notification:', emailError);
        }
      }

      if (isDraft) {
        toast.success('Draft saved successfully');
      } else {
        toast.success('Form submitted successfully!', {
          description: `${formDef.title} has been saved to SharePoint and email confirmation sent.`,
        });
        navigate('/she/forms');
      }
    } catch (error: unknown) {
      toast.error('Failed to submit form', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
    setIsSubmitting(false);
  };

  const getFieldByName = (name: string) => {
    return formDef.fields.find((f) => f.name === name);
  };

  const renderField = (field: FieldConfig) => {
    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-semibold text-foreground">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        {field.type === 'text' && (
          <Input
            id={field.name}
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors h-11"
          />
        )}
        
        {field.type === 'number' && (
          <Input
            id={field.name}
            type="number"
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors h-11"
          />
        )}
        
        {field.type === 'date' && (
          <Input
            id={field.name}
            type="date"
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors h-11"
          />
        )}
        
        {field.type === 'textarea' && (
          <Textarea
            id={field.name}
            value={formData[field.name] || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.name, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors resize-none min-h-[100px]"
            rows={4}
          />
        )}
        
        {field.type === 'select' && field.options && (
          <Select
            value={formData[field.name] || ''}
            onValueChange={(val: string) => handleFieldChange(field.name, val)}
          >
            <SelectTrigger className="bg-background border-2 focus:border-primary transition-colors h-11">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      ref={pageRef}
      tabIndex={-1}
      className="space-y-6 p-4 md:p-6 pb-28 md:pb-6 outline-none max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/she/forms')} className="shrink-0 h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">{formDef.title}</h1>
              <p className="text-muted-foreground text-sm">{formDef.category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{formCode || 'NEW'}</Badge>
          {isHighPriority && (
            <Badge className="bg-destructive text-destructive-foreground">High Priority</Badge>
          )}
        </div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sections:</span>
        <div className="flex gap-1">
          {formDef.sections.map((section) => (
            <div
              key={section.id}
              className={`h-2 w-8 rounded-full ${
                section.fieldIds.some((id) => formData[id])
                  ? 'bg-destructive'
                  : 'bg-muted'
              }`}
              title={section.title}
            />
          ))}
        </div>
      </motion.div>

      {/* High Priority Alert */}
      {isHighPriority && (
        <motion.div variants={itemVariants}>
          <Card className="bg-destructive text-destructive-foreground border-0">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">High Priority Submission</p>
                <p className="text-sm opacity-90">
                  This form will trigger immediate notification to SHE Manager and relevant stakeholders.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Site Selection */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-destructive" />
              </div>
              Site Selection
              <span className="text-destructive">*</span>
            </CardTitle>
            <CardDescription>Select the site this report applies to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant={site === 'prai' ? 'default' : 'outline'}
                className="flex-1 h-14 text-base"
                onClick={() => setSite('prai')}
              >
                <Building2 className="h-5 w-5 mr-2" />
                Prai (Penang)
              </Button>
              <Button
                variant={site === 'johor' ? 'default' : 'outline'}
                className="flex-1 h-14 text-base"
                onClick={() => setSite('johor')}
              >
                <Building2 className="h-5 w-5 mr-2" />
                Pasir Gudang (Johor)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Sections */}
      {formDef.sections.map((section) => {
        const SectionIcon = section.icon;
        const sectionFields = section.fieldIds
          .map((name) => getFieldByName(name))
          .filter((f): f is FieldConfig => f !== undefined);

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

      {/* Photo Upload */}
      <motion.div variants={itemVariants}>
        <Card className={`${sectionThemes.slate.bgColor} ${sectionThemes.slate.borderColor} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${sectionThemes.slate.iconBgColor}`}>
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg">Photo Evidence</span>
                <CardDescription className="font-normal mt-0.5">
                  Upload photos of the incident or hazard
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-card/80 backdrop-blur rounded-lg p-5 border">
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Drag and drop photos here, or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">Supports: JPG, PNG, HEIC (max 10MB each)</p>
                <Button variant="outline" size="sm" className="mt-4 h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Workflow Info */}
      <motion.div variants={itemVariants}>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="p-2 bg-primary rounded-lg shrink-0">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Connected to SharePoint (MainDB_SHE)</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isHighPriority
                  ? 'High priority: Immediate notification to SHE Manager → Plant Manager → Investigation Team'
                  : 'Standard workflow: SHE Officer Review → SHE Manager Approval → Action Assignment'}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Desktop Submit Buttons */}
      <div className="hidden md:flex gap-3 justify-end sticky bottom-6 bg-background/80 backdrop-blur p-4 -mx-6 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={() => navigate('/she/forms')} className="h-12 px-6">
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          className="h-12 px-6"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          className="h-12 px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90" 
          onClick={() => handleSubmit(false)} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>

      {/* Sticky Bottom CTA - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/she/forms')} className="h-14 flex-1">
            Cancel
          </Button>
          <Button 
            className="h-14 flex-[2] text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}