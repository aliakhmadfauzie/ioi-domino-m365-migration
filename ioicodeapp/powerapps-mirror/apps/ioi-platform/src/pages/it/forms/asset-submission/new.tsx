import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Monitor,
  FileText,
  Settings,
  ClipboardCheck,
  Send,
  Building2,
  User,
  Calendar,
  Tag,
  Box,
  Cpu,
  HardDrive,
  Laptop,
  Printer,
  Server,
  Network,
  Shield,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSharePointDepartments } from '@/hooks/use-sharepoint-config';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtAssets } from '@/generated/hooks/use-main-dbitext-assets';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';

const FORM_STEPS = [
  { id: 'requester', title: 'Requester Info', icon: User },
  { id: 'asset', title: 'Asset Details', icon: Monitor },
  { id: 'specifications', title: 'Specifications', icon: Cpu },
  { id: 'assignment', title: 'Assignment', icon: Building2 },
  { id: 'review', title: 'Review & Submit', icon: ClipboardCheck },
];

const ASSET_TYPES = [
  { value: 'desktop', label: 'Desktop PC', icon: Monitor },
  { value: 'laptop', label: 'Laptop', icon: Laptop },
  { value: 'printer', label: 'Printer', icon: Printer },
  { value: 'server', label: 'Server', icon: Server },
  { value: 'network', label: 'Network Equipment', icon: Network },
  { value: 'peripheral', label: 'Peripheral Device', icon: HardDrive },
  { value: 'other', label: 'Other Hardware', icon: Box },
];

// Departments are now loaded from SharePoint via useSharePointDepartments()

const LOCATIONS = [
  'IOI City Tower - Level 10',
  'IOI City Tower - Level 11',
  'IOI City Tower - Level 12',
  'Putrajaya Data Center',
  'Johor Bahru Office',
  'Penang Branch',
  'Ipoh Branch',
  'Kuantan Branch',
  'Warehouse - Shah Alam',
  'Remote/Work From Home',
];

const CONDITION_OPTIONS = [
  { value: 'new', label: 'New (Sealed)', color: 'bg-emerald-500' },
  { value: 'refurbished', label: 'Refurbished', color: 'bg-blue-500' },
  { value: 'used_good', label: 'Used - Good Condition', color: 'bg-amber-500' },
  { value: 'used_fair', label: 'Used - Fair Condition', color: 'bg-orange-500' },
  { value: 'damaged', label: 'Damaged/Repair Needed', color: 'bg-red-500' },
];

const WARRANTY_PERIODS = [
  '1 Year',
  '2 Years',
  '3 Years',
  '5 Years',
  'Extended Warranty',
  'No Warranty',
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', description: 'Standard processing (5-7 business days)' },
  { value: 'medium', label: 'Medium', description: 'Priority processing (3-5 business days)' },
  { value: 'high', label: 'High', description: 'Urgent processing (1-2 business days)' },
  { value: 'critical', label: 'Critical', description: 'Immediate attention required' },
];

export default function AssetSubmissionNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { departments } = useSharePointDepartments();
  const createMainDBIT = useCreateMainDBIT();
  const createMainDBITExtAssets = useCreateMainDBITExtAssets();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Requester Info
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    requesterDepartment: '',
    requestDate: new Date(),
    priority: 'medium',

    // Asset Details
    assetType: '',
    assetBrand: '',
    assetModel: '',
    assetSerialNumber: '',
    assetTagNumber: '',
    assetCondition: '',
    purchaseDate: undefined as Date | undefined,
    warrantyPeriod: '',
    warrantyExpiry: undefined as Date | undefined,
    purchaseValue: '',
    vendor: '',
    invoiceNumber: '',

    // Specifications
    processor: '',
    memory: '',
    storage: '',
    operatingSystem: '',
    additionalSpecs: '',
    softwareLicenses: '',
    macAddress: '',
    ipAddress: '',

    // Assignment
    assignedTo: '',
    assignedDepartment: '',
    assignedLocation: '',
    installationDate: undefined as Date | undefined,
    assetUsage: '',
    securityClassification: 'standard',
    networkAccess: false,
    vpnRequired: false,
    specialSoftware: '',
    additionalNotes: '',
    acknowledgement: false,
  });

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const requiredFields = [
    'requesterName',
    'requesterEmail',
    'requesterDepartment',
    'assetType',
    'assetBrand',
    'assetModel',
    'assetSerialNumber',
    'assetCondition',
    'assignedTo',
    'assignedDepartment',
    'assignedLocation',
  ];

  const value = (field: keyof typeof formData) => String(formData[field] || '').trim();
  const isoDate = (date?: Date) => date?.toISOString();
  const purchaseYear = formData.purchaseDate?.getFullYear();
  const purchaseMonth = formData.purchaseDate ? formData.purchaseDate.getMonth() + 1 : undefined;
  const purchasePrice = Number(formData.purchaseValue);

  const buildRemarks = () => [
    `Priority: ${value('priority')}`,
    `Phone: ${value('requesterPhone')}`,
    `Warranty period: ${value('warrantyPeriod')}`,
    `Installation date: ${isoDate(formData.installationDate) || ''}`,
    `Asset usage: ${value('assetUsage')}`,
    `Security classification: ${value('securityClassification')}`,
    `Network access: ${formData.networkAccess ? 'Yes' : 'No'}`,
    `VPN required: ${formData.vpnRequired ? 'Yes' : 'No'}`,
    `Software licenses: ${value('softwareLicenses')}`,
    `Special software: ${value('specialSoftware')}`,
    `Notes: ${value('additionalNotes')}`,
  ].filter((line) => !line.endsWith(': ')).join('\n');

  const buildAssetColumns = () => ({
    hITagNo: value('assetTagNumber'),
    hIAssetNo: value('assetTagNumber') || value('assetSerialNumber'),
    hIType: value('assetType'),
    hIComputerName: value('assetBrand') && value('assetModel') ? `${value('assetBrand')} ${value('assetModel')}` : value('assetModel'),
    hIDepartment: value('assignedDepartment') || value('requesterDepartment'),
    hILocation: value('assignedLocation'),
    hIPurchaseDate: isoDate(formData.purchaseDate),
    hISerialNo: value('assetSerialNumber'),
    hIStatus: value('assetCondition'),
    hIUsedByEmail: value('assignedTo'),
    hIVendor: value('vendor'),
    hIYear: purchaseYear,
    hIMonth: purchaseMonth,
  });

  const createExtAssetRecord = async (parent: MainDBIT, reference: string) => {
    const extPayload: Omit<MainDBITExtAssets, 'id'> = {
      title: `${reference}-ext`,
      parentFormCode: 'ASSETSUBMISSION',
      parentRecord: { id: parent.id, title: parent.title || reference },
      parentSite: 'PRAI',
      ...buildAssetColumns(),
      hIModel: value('assetModel'),
      hICPUType: value('processor'),
      hIHDDSize: value('storage'),
      hIRAMSize: value('memory'),
      hIIPAddress: value('ipAddress'),
      hIWindowsVersion: value('operatingSystem'),
      hIInvoiceNo: value('invoiceNumber'),
      hIWinServicePack: value('warrantyPeriod'),
      hISentBy: value('requesterEmail') || user?.userPrincipalName || '',
    };

    await createMainDBITExtAssets.mutateAsync(extPayload);
  };

  const handleSubmit = async () => {
    const missingFields = requiredFields.filter((field) => !String(formData[field as keyof typeof formData] || '').trim());
    if (missingFields.length > 0) {
      toast.error('Please complete all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const reference = `ASSETSUBMISSION-${format(now, 'yyyyMMdd-HHmmss')}`;
      const parent = await createMainDBIT.mutateAsync({
        title: reference,
        formcode: 'ASSETSUBMISSION',
        currentStatus: 'CurrentstatusKey4',
        currentAction: 'Pending IT Admin Review',
        requestoremail: value('requesterEmail') || user?.userPrincipalName || '',
        requestorName: value('requesterName') || user?.fullName || '',
        submitteddate: now.toISOString(),
        workflowstage: 1,
        siteKey: 'SiteKey2',
        islocked: false,
        remarks: buildRemarks(),
        ...buildAssetColumns(),
        hIPONumber: value('invoiceNumber'),
        hIWarrantyExpiry: isoDate(formData.warrantyExpiry),
        hICondition: value('assetCondition'),
        hISpecifications: [
          value('processor'),
          value('memory'),
          value('storage'),
          value('operatingSystem'),
          value('additionalSpecs'),
        ].filter(Boolean).join(' | '),
        hIPurchasePrice: Number.isFinite(purchasePrice) ? purchasePrice : undefined,
      });

      await createExtAssetRecord(parent, reference);

      toast.success('Asset Submission Form submitted successfully!', {
        description: `Reference: ${reference}`,
      });
      navigate('/it');
    } catch (error) {
      console.error(error);
      toast.error('Asset submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <RequesterInfoStep formData={formData} updateFormData={updateFormData} departments={departments} />;
      case 1:
        return <AssetDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <SpecificationsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <AssignmentStep formData={formData} updateFormData={updateFormData} departments={departments} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/it')}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    ASSET
                  </Badge>
                  <span className="text-slate-500">Hardware Module</span>
                </div>
                <h1 className="text-xl font-bold text-white mt-1">
                  Asset Submission Form
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">Form Reference</p>
                <p className="text-sm font-mono text-cyan-400">
                  ASSET-{format(new Date(), 'yyyyMMdd')}-DRAFT
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {FORM_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => index < currentStep && setCurrentStep(index)}
                    disabled={index > currentStep}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-lg transition-all',
                      isActive && 'bg-cyan-500/20 text-cyan-400',
                      isCompleted &&
                        'text-emerald-400 hover:bg-emerald-500/10 cursor-pointer',
                      !isActive && !isCompleted && 'text-slate-500 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                        isActive && 'border-cyan-500 bg-cyan-500/20',
                        isCompleted && 'border-emerald-500 bg-emerald-500/20',
                        !isActive && !isCompleted && 'border-slate-600 bg-slate-800'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-xs text-slate-500">Step {index + 1}</p>
                      <p className="text-sm font-medium">{step.title}</p>
                    </div>
                  </button>
                  {index < FORM_STEPS.length - 1 && (
                    <div
                      className={cn(
                        'hidden lg:block w-12 h-0.5 mx-2',
                        isCompleted ? 'bg-emerald-500' : 'bg-slate-700'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === FORM_STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.acknowledgement}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Settings className="h-4 w-4" />
                  </motion.div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Asset Form
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function RequesterInfoStep({
  formData,
  updateFormData,
  departments,
}: {
  formData: Record<string, unknown>;
  updateFormData: (field: string, value: unknown) => void;
  departments: Array<{ code: string; name: string }>;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <User className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Requester Information</h3>
            <p className="text-sm text-slate-400">
              Enter details of the person submitting this asset
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              value={formData.requesterName as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('requesterName', e.target.value)
              }
              placeholder="Enter full name"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              value={formData.requesterEmail as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('requesterEmail', e.target.value)
              }
              placeholder="email@ioigroup.com"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Phone Number</Label>
            <Input
              value={formData.requesterPhone as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('requesterPhone', e.target.value)
              }
              placeholder="+60 12-345 6789"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Department <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.requesterDepartment as string}
              onValueChange={(val: string) => updateFormData('requesterDepartment', val)}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.code} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Request Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-slate-900/50 border-slate-600 text-white hover:bg-slate-800"
                >
                  <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                  {formData.requestDate
                    ? format(formData.requestDate as Date, 'PPP')
                    : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.requestDate as Date}
                  onSelect={(date: Date | undefined) =>
                    updateFormData('requestDate', date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Priority Level</Label>
            <Select
              value={formData.priority as string}
              onValueChange={(val: string) => updateFormData('priority', val)}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex flex-col">
                      <span>{level.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {level.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssetDetailsStep({
  formData,
  updateFormData,
}: {
  formData: Record<string, unknown>;
  updateFormData: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Asset Type Selection */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Box className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Asset Type</h3>
            <p className="text-sm text-slate-400">Select the type of hardware asset</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ASSET_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.assetType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => updateFormData('assetType', type.value)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-left',
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                )}
              >
                <Icon
                  className={cn(
                    'h-6 w-6 mb-2',
                    isSelected ? 'text-cyan-400' : 'text-slate-400'
                  )}
                />
                <p
                  className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-cyan-400' : 'text-slate-300'
                  )}
                >
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Information */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Tag className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Asset Information</h3>
            <p className="text-sm text-slate-400">Enter asset identification details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">
              Brand/Manufacturer <span className="text-red-400">*</span>
            </Label>
            <Input
              value={formData.assetBrand as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('assetBrand', e.target.value)
              }
              placeholder="e.g., Dell, HP, Lenovo"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Model <span className="text-red-400">*</span>
            </Label>
            <Input
              value={formData.assetModel as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('assetModel', e.target.value)
              }
              placeholder="e.g., OptiPlex 7090, ThinkPad X1"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Serial Number <span className="text-red-400">*</span>
            </Label>
            <Input
              value={formData.assetSerialNumber as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('assetSerialNumber', e.target.value)
              }
              placeholder="Enter serial number"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Asset Tag Number</Label>
            <Input
              value={formData.assetTagNumber as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('assetTagNumber', e.target.value)
              }
              placeholder="IOI-IT-XXXX"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-slate-300">
              Asset Condition <span className="text-red-400">*</span>
            </Label>
            <RadioGroup
              value={formData.assetCondition as string}
              onValueChange={(val: string) => updateFormData('assetCondition', val)}
              className="flex flex-wrap gap-3"
            >
              {CONDITION_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all',
                    formData.assetCondition === option.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  )}
                >
                  <RadioGroupItem value={option.value} className="sr-only" />
                  <div className={cn('w-2 h-2 rounded-full', option.color)} />
                  <span className="text-sm text-slate-300">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Purchase & Warranty */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Purchase & Warranty</h3>
            <p className="text-sm text-slate-400">Financial and warranty information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Purchase Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-slate-900/50 border-slate-600 text-white hover:bg-slate-800"
                >
                  <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                  {formData.purchaseDate
                    ? format(formData.purchaseDate as Date, 'PPP')
                    : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.purchaseDate as Date | undefined}
                  onSelect={(date: Date | undefined) =>
                    updateFormData('purchaseDate', date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Purchase Value (MYR)</Label>
            <Input
              type="number"
              value={formData.purchaseValue as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('purchaseValue', e.target.value)
              }
              placeholder="0.00"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Warranty Period</Label>
            <Select
              value={formData.warrantyPeriod as string}
              onValueChange={(val: string) => updateFormData('warrantyPeriod', val)}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Select warranty" />
              </SelectTrigger>
              <SelectContent>
                {WARRANTY_PERIODS.map((period: string) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Warranty Expiry</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-slate-900/50 border-slate-600 text-white hover:bg-slate-800"
                >
                  <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                  {formData.warrantyExpiry
                    ? format(formData.warrantyExpiry as Date, 'PPP')
                    : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.warrantyExpiry as Date | undefined}
                  onSelect={(date: Date | undefined) =>
                    updateFormData('warrantyExpiry', date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Vendor/Supplier</Label>
            <Input
              value={formData.vendor as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('vendor', e.target.value)
              }
              placeholder="Enter vendor name"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Invoice Number</Label>
            <Input
              value={formData.invoiceNumber as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('invoiceNumber', e.target.value)
              }
              placeholder="INV-XXXX"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecificationsStep({
  formData,
  updateFormData,
}: {
  formData: Record<string, unknown>;
  updateFormData: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Hardware Specifications */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Cpu className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Hardware Specifications</h3>
            <p className="text-sm text-slate-400">Technical details of the asset</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Processor (CPU)</Label>
            <Input
              value={formData.processor as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('processor', e.target.value)
              }
              placeholder="e.g., Intel Core i7-12700, AMD Ryzen 7"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Memory (RAM)</Label>
            <Input
              value={formData.memory as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('memory', e.target.value)
              }
              placeholder="e.g., 16GB DDR4, 32GB DDR5"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Storage</Label>
            <Input
              value={formData.storage as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('storage', e.target.value)
              }
              placeholder="e.g., 512GB NVMe SSD, 1TB HDD"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Operating System</Label>
            <Input
              value={formData.operatingSystem as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('operatingSystem', e.target.value)
              }
              placeholder="e.g., Windows 11 Pro, Ubuntu 22.04"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-slate-300">Additional Specifications</Label>
            <Textarea
              value={formData.additionalSpecs as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData('additionalSpecs', e.target.value)
              }
              placeholder="Graphics card, display resolution, ports, etc."
              rows={3}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Network & Software */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Network className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Network & Software</h3>
            <p className="text-sm text-slate-400">Network configuration and licenses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">MAC Address</Label>
            <Input
              value={formData.macAddress as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('macAddress', e.target.value)
              }
              placeholder="XX:XX:XX:XX:XX:XX"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">IP Address (if assigned)</Label>
            <Input
              value={formData.ipAddress as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('ipAddress', e.target.value)
              }
              placeholder="192.168.x.x"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-slate-300">Software Licenses</Label>
            <Textarea
              value={formData.softwareLicenses as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData('softwareLicenses', e.target.value)
              }
              placeholder="List installed software and license keys (e.g., Microsoft Office 365, Adobe Creative Suite)"
              rows={3}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentStep({
  formData,
  updateFormData,
  departments,
}: {
  formData: Record<string, unknown>;
  updateFormData: (field: string, value: unknown) => void;
  departments: Array<{ code: string; name: string }>;
}) {
  return (
    <div className="space-y-6">
      {/* Assignment Details */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <User className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Assignment Details</h3>
            <p className="text-sm text-slate-400">Who will use this asset</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">
              Assigned To <span className="text-red-400">*</span>
            </Label>
            <Input
              value={formData.assignedTo as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData('assignedTo', e.target.value)
              }
              placeholder="Employee name"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Department <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.assignedDepartment as string}
              onValueChange={(val: string) => updateFormData('assignedDepartment', val)}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.code} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
              Location <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.assignedLocation as string}
              onValueChange={(val: string) => updateFormData('assignedLocation', val)}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((loc: string) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Installation Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-slate-900/50 border-slate-600 text-white hover:bg-slate-800"
                >
                  <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                  {formData.installationDate
                    ? format(formData.installationDate as Date, 'PPP')
                    : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={formData.installationDate as Date | undefined}
                  onSelect={(date: Date | undefined) =>
                    updateFormData('installationDate', date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-slate-300">Asset Usage Description</Label>
            <Textarea
              value={formData.assetUsage as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData('assetUsage', e.target.value)
              }
              placeholder="Describe the primary use of this asset"
              rows={2}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Security & Access</h3>
            <p className="text-sm text-slate-400">Security classification and access requirements</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-slate-300">Security Classification</Label>
            <RadioGroup
              value={formData.securityClassification as string}
              onValueChange={(val: string) =>
                updateFormData('securityClassification', val)
              }
              className="flex flex-wrap gap-4"
            >
              {[
                { value: 'standard', label: 'Standard', desc: 'General business use' },
                { value: 'confidential', label: 'Confidential', desc: 'Sensitive data access' },
                { value: 'restricted', label: 'Restricted', desc: 'Highly sensitive systems' },
              ].map((option) => (
                <Label
                  key={option.value}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all flex-1 min-w-[180px]',
                    formData.securityClassification === option.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  )}
                >
                  <RadioGroupItem value={option.value} className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-300">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex flex-wrap gap-6">
            <Label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={formData.networkAccess as boolean}
                onCheckedChange={(checked: boolean) =>
                  updateFormData('networkAccess', checked)
                }
              />
              <div>
                <p className="text-sm text-slate-300">Network Access Required</p>
                <p className="text-xs text-slate-500">Connect to corporate network</p>
              </div>
            </Label>

            <Label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={formData.vpnRequired as boolean}
                onCheckedChange={(checked: boolean) =>
                  updateFormData('vpnRequired', checked)
                }
              />
              <div>
                <p className="text-sm text-slate-300">VPN Access Required</p>
                <p className="text-xs text-slate-500">Remote access capability</p>
              </div>
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Special Software Requirements</Label>
            <Textarea
              value={formData.specialSoftware as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData('specialSoftware', e.target.value)
              }
              placeholder="List any special software that needs to be installed"
              rows={2}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Additional Notes</Label>
            <Textarea
              value={formData.additionalNotes as string}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateFormData('additionalNotes', e.target.value)
              }
              placeholder="Any other relevant information"
              rows={2}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ formData }: { formData: Record<string, unknown> }) {
  const assetTypeLabel =
    ASSET_TYPES.find((t) => t.value === formData.assetType)?.label || formData.assetType;

  const sections = [
    {
      title: 'Requester Information',
      icon: User,
      color: 'cyan',
      fields: [
        { label: 'Name', value: formData.requesterName },
        { label: 'Email', value: formData.requesterEmail },
        { label: 'Phone', value: formData.requesterPhone },
        { label: 'Department', value: formData.requesterDepartment },
        {
          label: 'Request Date',
          value: formData.requestDate
            ? format(formData.requestDate as Date, 'PPP')
            : '-',
        },
        { label: 'Priority', value: formData.priority },
      ],
    },
    {
      title: 'Asset Details',
      icon: Monitor,
      color: 'purple',
      fields: [
        { label: 'Asset Type', value: assetTypeLabel },
        { label: 'Brand', value: formData.assetBrand },
        { label: 'Model', value: formData.assetModel },
        { label: 'Serial Number', value: formData.assetSerialNumber },
        { label: 'Asset Tag', value: formData.assetTagNumber },
        {
          label: 'Condition',
          value:
            CONDITION_OPTIONS.find((c) => c.value === formData.assetCondition)?.label ||
            formData.assetCondition,
        },
        {
          label: 'Purchase Date',
          value: formData.purchaseDate
            ? format(formData.purchaseDate as Date, 'PPP')
            : '-',
        },
        {
          label: 'Purchase Value',
          value: formData.purchaseValue ? `MYR ${formData.purchaseValue}` : '-',
        },
        { label: 'Warranty', value: formData.warrantyPeriod },
        { label: 'Vendor', value: formData.vendor },
      ],
    },
    {
      title: 'Specifications',
      icon: Cpu,
      color: 'orange',
      fields: [
        { label: 'Processor', value: formData.processor },
        { label: 'Memory', value: formData.memory },
        { label: 'Storage', value: formData.storage },
        { label: 'OS', value: formData.operatingSystem },
        { label: 'MAC Address', value: formData.macAddress },
        { label: 'IP Address', value: formData.ipAddress },
      ],
    },
    {
      title: 'Assignment',
      icon: Building2,
      color: 'pink',
      fields: [
        { label: 'Assigned To', value: formData.assignedTo },
        { label: 'Department', value: formData.assignedDepartment },
        { label: 'Location', value: formData.assignedLocation },
        {
          label: 'Installation Date',
          value: formData.installationDate
            ? format(formData.installationDate as Date, 'PPP')
            : '-',
        },
        { label: 'Security Level', value: formData.securityClassification },
        { label: 'Network Access', value: formData.networkAccess ? 'Yes' : 'No' },
        { label: 'VPN Required', value: formData.vpnRequired ? 'Yes' : 'No' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <ClipboardCheck className="h-7 w-7 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Review Your Submission</h3>
            <p className="text-slate-400">
              Please verify all information before submitting the asset form
            </p>
          </div>
        </div>
      </div>

      {/* Review Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    section.color === 'cyan' && 'bg-cyan-500/20',
                    section.color === 'purple' && 'bg-purple-500/20',
                    section.color === 'orange' && 'bg-orange-500/20',
                    section.color === 'pink' && 'bg-pink-500/20'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      section.color === 'cyan' && 'text-cyan-400',
                      section.color === 'purple' && 'text-purple-400',
                      section.color === 'orange' && 'text-orange-400',
                      section.color === 'pink' && 'text-pink-400'
                    )}
                  />
                </div>
                <h4 className="font-semibold text-white">{section.title}</h4>
              </div>
              <div className="space-y-2">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{field.label}</span>
                    <span className="text-slate-300 font-medium text-right max-w-[60%] truncate">
                      {(field.value as string) || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval Workflow Info */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-5 w-5 text-blue-400" />
          <h4 className="font-semibold text-white">Approval Workflow</h4>
        </div>
        <div className="flex items-center gap-4">
          {[
            { step: 1, label: 'IT Admin Review', status: 'pending' },
            { step: 2, label: 'Asset Registration', status: 'pending' },
            { step: 3, label: 'Inventory Update', status: 'pending' },
          ].map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-800 flex items-center justify-center">
                  <span className="text-sm text-slate-400">{step.step}</span>
                </div>
                <span className="text-sm text-slate-400">{step.label}</span>
              </div>
              {index < 2 && <div className="w-8 h-0.5 bg-slate-700 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Acknowledgement */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
        <Label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={formData.acknowledgement as boolean}
            onCheckedChange={() => {}}
            className="mt-1"
          />
          <div>
            <p className="text-amber-400 font-medium">
              I confirm that all information provided is accurate
            </p>
            <p className="text-sm text-slate-400 mt-1">
              By submitting this form, I acknowledge that the asset details have been
              verified and I am responsible for ensuring the accuracy of this submission.
            </p>
          </div>
        </Label>
      </div>
    </div>
  );
}
