import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Send,
  AlertTriangle,
  CalendarCheck,
  FileSpreadsheet,
  Flame,
  Eye,
  Clock,
  Users,
  Wrench,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useEmailNotification, generateSubmissionEmailBody } from '@/hooks/use-email-notification';
import type { LucideIcon } from 'lucide-react';
import { useCreateMainDBMTN } from '@/generated/hooks/use-main-dbmtn';
import type { MainDBMTN } from '@/generated/models/main-dbmtn-model';

interface FormConfig {
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const FORM_CONFIGS: Record<string, FormConfig> = {
  far: {
    code: 'FAR',
    name: 'Failure Analysis Report',
    description: 'Equipment failure root cause analysis and corrective actions (IMS Critical)',
    icon: AlertTriangle,
    color: '#ef4444',
    priority: 'critical',
  },
  mtp: {
    code: 'MTP',
    name: 'Maintenance Plan',
    description: 'Preventive and predictive maintenance scheduling',
    icon: CalendarCheck,
    color: '#6366f1',
    priority: 'high',
  },
  pmd: {
    code: 'PMD',
    name: 'Plant Maintenance Documentation',
    description: 'Plant equipment maintenance records and history',
    icon: FileSpreadsheet,
    color: '#10b981',
    priority: 'medium',
  },
  mecp: {
    code: 'MECP',
    name: 'MTN Emergency Change Procedure',
    description: 'Emergency maintenance change requests and approvals',
    icon: Flame,
    color: '#ef4444',
    priority: 'critical',
  },
  epi: {
    code: 'EPI',
    name: 'Equipment Pre-Inspection',
    description: 'Pre-operation equipment safety and readiness checks',
    icon: Eye,
    color: '#8b5cf6',
    priority: 'high',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

type MTRFormValues = {
  requestorName: string;
  requestorEmail: string;
  department: string;
  remarks: string;
  equipmentId: string;
  equipmentName: string;
  failureDate: string;
  failureTime: string;
  failureDescription: string;
  immediateAction: string;
  rootCause: string;
  correctiveAction: string;
  preventiveAction: string;
  severity: string;
  maintenanceType: string;
  scheduledDate: string;
  estimatedDuration: string;
  technician: string;
  spareParts: string;
  safetyPrecautions: string;
  plantArea: string;
  documentType: string;
  revisionNumber: string;
  effectiveDate: string;
  documentDescription: string;
  reportingPeriod: string;
  energySource: string;
  consumption: string;
  unit: string;
  costPerUnit: string;
  efficiencyMetric: string;
  improvementActions: string;
  emergencyType: string;
  changeDescription: string;
  impactAssessment: string;
  rollbackPlan: string;
  approverName: string;
  inspectionType: string;
  checklistItems: string;
  operatorName: string;
  equipmentCondition: string;
  safetyChecks: string;
};

const toNumber = (value: string) => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const joinRemarks = (...values: Array<string | undefined>) => {
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join('\n');
};

const getSharePointFormCode = (code: string) => {
  switch (code) {
    case 'FAR':
      return 'FAILANALREPO';
    case 'MTP':
      return 'MAINPLAN';
    case 'PMD':
      return 'PLANMAINDOCU';
    case 'MECP':
      return 'MTNEMERCHAN';
    case 'EPI':
      return 'EQUIPREINSP';
    default:
      return code;
  }
};

const getFARCategory = (severity: string) => {
  return severity === 'critical' ? 'Critical' : 'Breakdown';
};

const getMPWorkType = (maintenanceType: string) => {
  switch (maintenanceType) {
    case 'overhaul':
      return 'Overhaul';
    case 'calibration':
      return 'Calibration';
    default:
      return 'Inspection';
  }
};

const getPMDocumentType = (documentType: string) => {
  switch (documentType) {
    case 'sop':
      return 'SOP';
    case 'drawing':
      return 'Drawing';
    case 'manual':
      return 'FormDoc';
    default:
      return 'Activity Report';
  }
};

const getMECRiskAssessment = (emergencyType: string) => {
  switch (emergencyType) {
    case 'safety':
    case 'environmental':
      return 'Critical';
    case 'production':
    case 'breakdown':
      return 'High';
    default:
      return 'Medium';
  }
};

const getEPIResult = (equipmentCondition: string) => {
  switch (equipmentCondition) {
    case 'good':
      return 'Pass';
    case 'minor-issues':
      return 'Conditional Pass';
    default:
      return 'Fail';
  }
};

const buildMainDBMTNRecord = (
  formId: string,
  formConfig: FormConfig,
  formData: MTRFormValues,
  isDraft: boolean
): Omit<MainDBMTN, 'id'> => {
  const now = new Date().toISOString();
  const commonNotes = joinRemarks(
    formData.remarks && `General Notes: ${formData.remarks}`,
    formData.failureTime && `Failure Time: ${formData.failureTime}`,
    formData.estimatedDuration && `Estimated Duration: ${formData.estimatedDuration}`,
    formData.costPerUnit && `Cost per Unit: ${formData.costPerUnit}`
  );

  const record: Omit<MainDBMTN, 'id'> = {
    title: formId,
    formCode: getSharePointFormCode(formConfig.code),
    currentStatus: isDraft ? 'New' : 'Submitted',
    departmentKey: 'DepartmentKey08',
    siteKey: 'SiteKey0',
    submittedBy: formData.requestorEmail,
    submittedDate: now,
    equipmentID: formData.equipmentId || undefined,
    equipmentName: formData.equipmentName || undefined,
    supervisor: formData.approverName || undefined,
    workflflowStage: isDraft ? 0 : 1,
  };

  switch (formConfig.code) {
    case 'FAR':
      return {
        ...record,
        fAREquipmentID: formData.equipmentId,
        fARFailureDate: formData.failureDate || undefined,
        fARFailureMode: 'Other',
        fARSymptoms: joinRemarks(formData.failureDescription, formData.immediateAction, commonNotes),
        fARRootCause: formData.rootCause,
        fARImpact: 'Production',
        fARImpactDescription: formData.failureDescription,
        fARCorrectiveAction: formData.correctiveAction,
        fARPreventiveAction: formData.preventiveAction,
        fARReportedBy: formData.requestorName || formData.requestorEmail,
        fARCategory: getFARCategory(formData.severity),
      };
    case 'MTP':
      return {
        ...record,
        mPPlanNo: formId,
        mPEquipmentID: formData.equipmentId,
        mPEquipmentName: formData.equipmentName,
        mPIntervalType: 'Monthly',
        mPNextDueDate: formData.scheduledDate || undefined,
        mPWorkType: getMPWorkType(formData.maintenanceType),
        mPTaskDescription: joinRemarks(formData.spareParts, formData.safetyPrecautions, commonNotes),
        mPAssignedTo: formData.technician,
        mPEstimatedHours: toNumber(formData.estimatedDuration),
        mPStatus: 'Scheduled',
      };
    case 'PMD':
      return {
        ...record,
        pMDocumentNo: formId,
        pMType: getPMDocumentType(formData.documentType),
        pMEquipmentID: formData.plantArea,
        pMRevisionNo: formData.revisionNumber,
        pMEffectiveDate: formData.effectiveDate || undefined,
        pMTitle: joinRemarks(formData.documentDescription || formConfig.name, commonNotes) || formConfig.name,
      };
    case 'MECP':
      return {
        ...record,
        mECChangeNo: formId,
        mECDate: now,
        mECEquipmentID: formData.equipmentId,
        mECChangeDescription: formData.changeDescription,
        mECReason: joinRemarks(formData.emergencyType, formData.impactAssessment, commonNotes),
        mECRiskAssessment: getMECRiskAssessment(formData.emergencyType),
        mECAuthorizedBy: formData.approverName,
        mECClosureNotes: formData.rollbackPlan,
      };
    case 'EPI':
      return {
        ...record,
        ePIEquipmentID: formData.equipmentId,
        ePIEquipmentName: formData.equipmentName,
        ePIInspectionDate: now,
        ePIInspector: formData.operatorName || formData.requestorName,
        ePIItem: joinRemarks(formData.inspectionType, formData.checklistItems),
        ePIResult: getEPIResult(formData.equipmentCondition),
        ePIComment: joinRemarks(formData.safetyChecks, commonNotes),
      };
    default:
      return record;
  }
};

export default function MTRFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { sendNotification, isSending } = useEmailNotification();
  const createRecord = useCreateMainDBMTN();

  const formConfig = useMemo(() => {
    return formCode ? FORM_CONFIGS[formCode.toLowerCase()] : null;
  }, [formCode]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state based on form type
  const [formData, setFormData] = useState({
    // Common fields
    requestorName: user?.fullName || '',
    requestorEmail: user?.userPrincipalName || '',
    department: 'mtr',
    remarks: '',

    // FAR specific
    equipmentId: '',
    equipmentName: '',
    failureDate: '',
    failureTime: '',
    failureDescription: '',
    immediateAction: '',
    rootCause: '',
    correctiveAction: '',
    preventiveAction: '',
    severity: '',

    // MTP specific
    maintenanceType: '',
    scheduledDate: '',
    estimatedDuration: '',
    technician: '',
    spareParts: '',
    safetyPrecautions: '',

    // PMD specific
    plantArea: '',
    documentType: '',
    revisionNumber: '',
    effectiveDate: '',
    documentDescription: '',

    // E&I energy fields retained only for future department migration, not exposed through MTN.
    reportingPeriod: '',
    energySource: '',
    consumption: '',
    unit: '',
    costPerUnit: '',
    efficiencyMetric: '',
    improvementActions: '',

    // MECP specific
    emergencyType: '',
    changeDescription: '',
    impactAssessment: '',
    rollbackPlan: '',
    approverName: '',

    // EPI specific
    inspectionType: '',
    checklistItems: '',
    operatorName: '',
    equipmentCondition: '',
    safetyChecks: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!formConfig) return;

    setIsSubmitting(true);

    const formId = `MTR-${formConfig?.code || 'GEN'}-${Date.now().toString().slice(-6)}`;

    try {
      await createRecord.mutateAsync(buildMainDBMTNRecord(formId, formConfig, formData, isDraft));

      if (!isDraft && user?.userPrincipalName) {
        const emailBody = generateSubmissionEmailBody({
          ticketId: formId,
          formName: formConfig?.name || 'Maintenance Form',
          formCode: formConfig?.code || 'MTR',
          submittedBy: user.fullName || 'Unknown',
          submittedByEmail: user.userPrincipalName,
          submittedDate: new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' }),
          approverName: 'MTR Department',
          approverRole: 'Approver',
          priority: formConfig?.priority || 'Normal',
          justification: formData.remarks || undefined,
        });

        await sendNotification({
          to: user.userPrincipalName,
          subject: `Maintenance Form Submission Confirmation: ${formConfig?.name} (${formId})`,
          body: emailBody,
        });

        // Send copy to MTR department
        await sendNotification({
          to: 'mtr@ioichem.com',
          subject: `New Maintenance Form Submission: ${formConfig?.name} (${formId})`,
          body: emailBody,
        });
      }

      if (isDraft) {
        toast.success('Draft saved successfully!');
      } else {
        toast.success('Form submitted successfully!', {
          description: `Your ${formConfig?.name} has been saved to MainDB_MTN.`,
        });
        navigate(`/mtr/forms/${formConfig.code.toLowerCase()}`);
      }
    } catch (error: unknown) {
      toast.error('Failed to submit form', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formConfig) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Form not found. Please select a valid form from the forms library.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/mtr/forms">Back to Forms</Link>
        </Button>
      </div>
    );
  }

  const FormIcon = formConfig.icon;

  return (
    <motion.div
      className="p-4 md:p-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/mtr/forms">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${formConfig.color}20` }}
          >
            <FormIcon className="h-8 w-8" style={{ color: formConfig.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{formConfig.name}</h1>
              <Badge
                variant={formConfig.priority === 'critical' ? 'destructive' : 'default'}
              >
                {formConfig.priority}
              </Badge>
            </div>
            <p className="text-muted-foreground">{formConfig.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>Fill in the required information below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Requestor Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Requestor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestorName">Full Name</Label>
                  <Input
                    id="requestorName"
                    value={formData.requestorName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('requestorName', e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestorEmail">Email</Label>
                  <Input
                    id="requestorEmail"
                    type="email"
                    value={formData.requestorEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('requestorEmail', e.target.value)
                    }
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* FAR Specific Fields */}
            {formCode?.toLowerCase() === 'far' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Failure Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">Equipment ID</Label>
                    <Input
                      id="equipmentId"
                      value={formData.equipmentId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentId', e.target.value)
                      }
                      placeholder="e.g., PUMP-A3-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentName">Equipment Name</Label>
                    <Input
                      id="equipmentName"
                      value={formData.equipmentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentName', e.target.value)
                      }
                      placeholder="e.g., Centrifugal Pump Station A3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="failureDate">Failure Date</Label>
                    <Input
                      id="failureDate"
                      type="date"
                      value={formData.failureDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('failureDate', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="failureTime">Failure Time</Label>
                    <Input
                      id="failureTime"
                      type="time"
                      value={formData.failureTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('failureTime', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value: string) => handleInputChange('severity', value)}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical - Production Stopped</SelectItem>
                        <SelectItem value="major">Major - Significant Impact</SelectItem>
                        <SelectItem value="minor">Minor - Limited Impact</SelectItem>
                        <SelectItem value="low">Low - No Production Impact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failureDescription">Failure Description</Label>
                  <Textarea
                    id="failureDescription"
                    value={formData.failureDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('failureDescription', e.target.value)
                    }
                    placeholder="Describe the failure in detail - what happened, symptoms observed, etc."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="immediateAction">Immediate Action Taken</Label>
                  <Textarea
                    id="immediateAction"
                    value={formData.immediateAction}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('immediateAction', e.target.value)
                    }
                    placeholder="What immediate actions were taken to address the failure?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rootCause">Root Cause Analysis</Label>
                  <Textarea
                    id="rootCause"
                    value={formData.rootCause}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('rootCause', e.target.value)
                    }
                    placeholder="5 Whys analysis, Fishbone diagram findings, etc."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="correctiveAction">Corrective Actions</Label>
                    <Textarea
                      id="correctiveAction"
                      value={formData.correctiveAction}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange('correctiveAction', e.target.value)
                      }
                      placeholder="Actions to fix the current failure"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preventiveAction">Preventive Actions</Label>
                    <Textarea
                      id="preventiveAction"
                      value={formData.preventiveAction}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange('preventiveAction', e.target.value)
                      }
                      placeholder="Actions to prevent future recurrence"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MTP Specific Fields */}
            {formCode?.toLowerCase() === 'mtp' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  Maintenance Plan Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">Equipment ID</Label>
                    <Input
                      id="equipmentId"
                      value={formData.equipmentId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentId', e.target.value)
                      }
                      placeholder="e.g., CONV-B7-002"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentName">Equipment Name</Label>
                    <Input
                      id="equipmentName"
                      value={formData.equipmentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentName', e.target.value)
                      }
                      placeholder="e.g., Conveyor Belt B7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceType">Maintenance Type</Label>
                    <Select
                      value={formData.maintenanceType}
                      onValueChange={(value: string) => handleInputChange('maintenanceType', value)}
                    >
                      <SelectTrigger id="maintenanceType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pm">Preventive Maintenance</SelectItem>
                        <SelectItem value="pdm">Predictive Maintenance</SelectItem>
                        <SelectItem value="cm">Corrective Maintenance</SelectItem>
                        <SelectItem value="overhaul">Major Overhaul</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="calibration">Calibration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('scheduledDate', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('estimatedDuration', e.target.value)
                      }
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technician">Assigned Technician</Label>
                    <Input
                      id="technician"
                      value={formData.technician}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('technician', e.target.value)
                      }
                      placeholder="e.g., Ahmad Rahman"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spareParts">Required Spare Parts</Label>
                  <Textarea
                    id="spareParts"
                    value={formData.spareParts}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('spareParts', e.target.value)
                    }
                    placeholder="List required spare parts with quantities"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="safetyPrecautions">Safety Precautions</Label>
                  <Textarea
                    id="safetyPrecautions"
                    value={formData.safetyPrecautions}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('safetyPrecautions', e.target.value)
                    }
                    placeholder="LOTO requirements, PPE needed, permits required, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* MECP Specific Fields */}
            {formCode?.toLowerCase() === 'mecp' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Emergency Change Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">Equipment ID</Label>
                    <Input
                      id="equipmentId"
                      value={formData.equipmentId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentId', e.target.value)
                      }
                      placeholder="e.g., BOILER-01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyType">Emergency Type</Label>
                    <Select
                      value={formData.emergencyType}
                      onValueChange={(value: string) => handleInputChange('emergencyType', value)}
                    >
                      <SelectTrigger id="emergencyType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakdown">Equipment Breakdown</SelectItem>
                        <SelectItem value="safety">Safety Hazard</SelectItem>
                        <SelectItem value="environmental">Environmental Risk</SelectItem>
                        <SelectItem value="quality">Quality Issue</SelectItem>
                        <SelectItem value="production">Production Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changeDescription">Change Description</Label>
                  <Textarea
                    id="changeDescription"
                    value={formData.changeDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('changeDescription', e.target.value)
                    }
                    placeholder="Describe the emergency change required"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impactAssessment">Impact Assessment</Label>
                  <Textarea
                    id="impactAssessment"
                    value={formData.impactAssessment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('impactAssessment', e.target.value)
                    }
                    placeholder="What is the impact if not addressed immediately? What systems/processes are affected?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollbackPlan">Rollback Plan</Label>
                  <Textarea
                    id="rollbackPlan"
                    value={formData.rollbackPlan}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('rollbackPlan', e.target.value)
                    }
                    placeholder="How to revert changes if they don't work as expected"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approverName">Emergency Approver</Label>
                  <Input
                    id="approverName"
                    value={formData.approverName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('approverName', e.target.value)
                    }
                    placeholder="Name of person authorizing emergency change"
                  />
                </div>
              </div>
            )}

            {/* EPI Specific Fields */}
            {formCode?.toLowerCase() === 'epi' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Pre-Inspection Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">Equipment ID</Label>
                    <Input
                      id="equipmentId"
                      value={formData.equipmentId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentId', e.target.value)
                      }
                      placeholder="e.g., CRANE-01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentName">Equipment Name</Label>
                    <Input
                      id="equipmentName"
                      value={formData.equipmentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('equipmentName', e.target.value)
                      }
                      placeholder="e.g., Overhead Crane Unit 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inspectionType">Inspection Type</Label>
                    <Select
                      value={formData.inspectionType}
                      onValueChange={(value: string) => handleInputChange('inspectionType', value)}
                    >
                      <SelectTrigger id="inspectionType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Pre-Start</SelectItem>
                        <SelectItem value="weekly">Weekly Inspection</SelectItem>
                        <SelectItem value="monthly">Monthly Inspection</SelectItem>
                        <SelectItem value="post-repair">Post-Repair Check</SelectItem>
                        <SelectItem value="commissioning">Commissioning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatorName">Operator Name</Label>
                    <Input
                      id="operatorName"
                      value={formData.operatorName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('operatorName', e.target.value)
                      }
                      placeholder="Name of equipment operator"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentCondition">Equipment Condition</Label>
                    <Select
                      value={formData.equipmentCondition}
                      onValueChange={(value: string) => handleInputChange('equipmentCondition', value)}
                    >
                      <SelectTrigger id="equipmentCondition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good - Ready for Operation</SelectItem>
                        <SelectItem value="minor-issues">Minor Issues - Can Operate</SelectItem>
                        <SelectItem value="needs-repair">Needs Repair - Do Not Operate</SelectItem>
                        <SelectItem value="critical">Critical - Safety Hazard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checklistItems">Checklist Items</Label>
                  <Textarea
                    id="checklistItems"
                    value={formData.checklistItems}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('checklistItems', e.target.value)
                    }
                    placeholder="List inspection items and their status (OK/Not OK/N/A)"
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="safetyChecks">Safety Checks Completed</Label>
                  <Textarea
                    id="safetyChecks"
                    value={formData.safetyChecks}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('safetyChecks', e.target.value)
                    }
                    placeholder="Emergency stops tested, guards in place, warning signs visible, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* PMD Specific Fields */}
            {formCode?.toLowerCase() === 'pmd' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Documentation Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plantArea">Plant Area</Label>
                    <Select
                      value={formData.plantArea}
                      onValueChange={(value: string) => handleInputChange('plantArea', value)}
                    >
                      <SelectTrigger id="plantArea">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="refinery">Refinery</SelectItem>
                        <SelectItem value="crushing">Crushing Plant</SelectItem>
                        <SelectItem value="fractionation">Fractionation</SelectItem>
                        <SelectItem value="boiler">Boiler House</SelectItem>
                        <SelectItem value="effluent">Effluent Treatment</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value: string) => handleInputChange('documentType', value)}
                    >
                      <SelectTrigger id="documentType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sop">Standard Operating Procedure</SelectItem>
                        <SelectItem value="checklist">Maintenance Checklist</SelectItem>
                        <SelectItem value="drawing">Technical Drawing</SelectItem>
                        <SelectItem value="manual">Equipment Manual</SelectItem>
                        <SelectItem value="specification">Specification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revisionNumber">Revision Number</Label>
                    <Input
                      id="revisionNumber"
                      value={formData.revisionNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('revisionNumber', e.target.value)
                      }
                      placeholder="e.g., Rev 3.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effectiveDate">Effective Date</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('effectiveDate', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentDescription">Document Description</Label>
                  <Textarea
                    id="documentDescription"
                    value={formData.documentDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('documentDescription', e.target.value)
                    }
                    placeholder="Brief description of the document content and purpose"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Additional Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange('remarks', e.target.value)
                  }
                  placeholder="Any additional remarks or special requirements"
                  rows={2}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
