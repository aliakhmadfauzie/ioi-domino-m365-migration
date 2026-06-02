import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Monitor,
  Code,
  UserCog,
  Wifi,
  Mail,
  Printer,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// =============================================================================
// TYPES
// =============================================================================

export interface FormStep {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number' | 'file';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
}

export interface PriorityOption {
  id: string;
  label: string;
  description: string;
  slaText?: string;
  isEscalation?: boolean;
}

export interface AffectedSystem {
  id: string;
  label: string;
}

export interface ImpactOption {
  id: string;
  label: string;
  description: string;
}

export interface MultiStepFormProps {
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  formData: Record<string, unknown>;
  onFieldChange: (field: string, value: unknown) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  categories?: CategoryOption[];
  fields?: FormFieldConfig[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  children?: ReactNode;
}

// Default IT Support categories
const DEFAULT_CATEGORIES: CategoryOption[] = [
  {
    id: 'hardware',
    label: 'Hardware Issue',
    description: 'Equipment failures, damage, or setup issues',
    icon: Monitor,
  },
  {
    id: 'software',
    label: 'Software Issue',
    description: 'Application crashes, bugs, or feature problems',
    icon: Code,
  },
  {
    id: 'access',
    label: 'Account & Access',
    description: 'Login problems, permissions, or password resets',
    icon: UserCog,
  },
  {
    id: 'network',
    label: 'Network & Connectivity',
    description: 'Internet, VPN, or connectivity issues',
    icon: Wifi,
  },
  {
    id: 'email',
    label: 'Email Services',
    description: 'Outlook, email delivery, or calendar issues',
    icon: Mail,
  },
  {
    id: 'printer',
    label: 'Printers & Peripherals',
    description: 'Printer, scanner, or device connectivity',
    icon: Printer,
  },
  {
    id: 'other',
    label: 'Other / General Support',
    description: 'Issues not listed above',
    icon: HelpCircle,
  },
];

// Priority options with IOI design specs
const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: 'low',
    label: 'Low Priority',
    description: "My work isn't affected, this can wait",
  },
  {
    id: 'normal',
    label: 'Normal Priority',
    description: 'Impacting my work, would like resolution soon',
  },
  {
    id: 'high',
    label: 'High Priority',
    description: 'Significantly impacting my work',
    slaText: '1-2 hours response time',
  },
  {
    id: 'critical',
    label: 'Critical',
    description: 'Complete service outage, affects multiple users',
    isEscalation: true,
  },
];

// Affected systems checkboxes
const AFFECTED_SYSTEMS: AffectedSystem[] = [
  { id: 'email', label: 'Email (Outlook, Teams)' },
  { id: 'sharepoint', label: 'SharePoint (Files, Lists)' },
  { id: 'sap', label: 'SAP System' },
  { id: 'vpn', label: 'VPN Connection' },
  { id: 'network', label: 'Network / WiFi' },
  { id: 'printer', label: 'Printer / Scanner' },
  { id: 'database', label: 'Database Access' },
  { id: 'other', label: 'Other' },
];

// Impact assessment options with user count
const IMPACT_OPTIONS: ImpactOption[] = [
  { id: 'just-me', label: 'Just me', description: '1 user affected' },
  { id: '2-5', label: '2-5 users', description: 'Small team' },
  { id: '6-20', label: '6-20 users', description: 'Department' },
  { id: '20-plus', label: '20+ users', description: 'Multiple departments' },
  { id: 'entire-org', label: 'Entire organization', description: 'Company-wide' },
];

// Location options
const LOCATION_OPTIONS = [
  { value: 'johor', label: 'Johor (MY-JH) - Main Office' },
  { value: 'prai', label: 'Prai (MY-PR) - Secondary Office' },
  { value: 'remote', label: 'Remote / Work from Home' },
];

// Operating System options
const OS_OPTIONS = [
  { value: 'windows11', label: 'Windows 11' },
  { value: 'windows10', label: 'Windows 10' },
  { value: 'macos', label: 'macOS' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'other', label: 'Other' },
];

// Animation variants
const stepContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// =============================================================================
// STEP PROGRESS INDICATOR
// =============================================================================

interface StepProgressProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

function StepProgress({ steps, currentStep, onStepClick }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connector lines */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#D0D0D0] z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-300"
          style={{ width: `${Math.max(0, ((currentStep) / (steps.length - 1)) * 100)}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
              style={{ flex: 1 }}
            >
              {/* Step circle */}
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={isPending}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200',
                  isCompleted && 'bg-primary text-white cursor-pointer',
                  isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                  isPending && 'bg-[#E0E0E0] text-muted-foreground cursor-not-allowed'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </button>

              {/* Step label */}
              <span
                className={cn(
                  'mt-2 text-sm font-semibold text-center max-w-[100px]',
                  (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// CATEGORY SELECTION CARDS
// =============================================================================

interface CategoryCardsProps {
  categories: CategoryOption[];
  selectedCategory?: string;
  onSelect: (categoryId: string) => void;
}

function CategoryCards({ categories, selectedCategory, onSelect }: CategoryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;

        return (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
              'min-h-[80px] cursor-pointer',
              isSelected
                ? 'bg-accent/50 border-primary shadow-md'
                : 'bg-[#FAFAFA] border-[#D0D0D0] hover:bg-[#F0F0F0] hover:border-primary hover:shadow-sm'
            )}
          >
            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                isSelected ? 'bg-primary' : 'bg-white'
              )}>
                <Icon className={cn(
                  'h-6 w-6',
                  isSelected ? 'text-primary-foreground' : 'text-primary'
                )} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {category.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// =============================================================================
// PRIORITY SELECTION (STEP 2)
// =============================================================================

interface PrioritySelectionProps {
  selectedPriority: string;
  onSelect: (priority: string) => void;
}

function PrioritySelection({ selectedPriority, onSelect }: PrioritySelectionProps) {
  return (
    <div className="space-y-3">
      {PRIORITY_OPTIONS.map((option) => {
        const isSelected = selectedPriority === option.id;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            className={cn(
              'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
              isSelected
                ? 'bg-accent/50 border-primary'
                : 'bg-white border-[#D0D0D0] hover:bg-[#FAFAFA] hover:border-primary active:border-primary'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Radio circle */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors shrink-0',
                  isSelected ? 'border-primary bg-primary' : 'border-[#D0D0D0]'
                )}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {option.label}
                  </span>
                  {option.slaText && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#7B3E00]/10 text-[#7B3E00] font-medium">
                      {option.slaText}
                    </span>
                  )}
                  {option.isEscalation && (
                    <span className="text-sm px-2 py-0.5 rounded-full bg-[#9B2F23]/10 text-[#9B2F23] font-medium">
                      Auto-escalation
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Critical escalation alert */}
      <AnimatePresence>
        {selectedPriority === 'critical' && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 200 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-lg bg-[#7B3E00]/10 border-l-4 border-[#7B3E00] flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#7B3E00] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#7B3E00]">
                Critical priority requests are escalated immediately to senior support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// AFFECTED SYSTEMS CHECKBOXES (STEP 2)
// =============================================================================

interface AffectedSystemsProps {
  selectedSystems: string[];
  onChange: (systems: string[]) => void;
  showError?: boolean;
}

function AffectedSystemsCheckboxes({ selectedSystems, onChange, showError }: AffectedSystemsProps) {
  const toggleSystem = (systemId: string) => {
    if (selectedSystems.includes(systemId)) {
      onChange(selectedSystems.filter((id: string) => id !== systemId));
    } else {
      onChange([...selectedSystems, systemId]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AFFECTED_SYSTEMS.map((system) => {
          const isChecked = selectedSystems.includes(system.id);

          return (
            <motion.button
              key={system.id}
              type="button"
              onClick={() => toggleSystem(system.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all duration-100',
                isChecked
                  ? 'bg-accent/50 border-primary'
                  : 'bg-white border-[#D0D0D0] hover:bg-[#FAFAFA] hover:border-primary active:border-primary'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'w-6 h-6 rounded border-2 flex items-center justify-center transition-colors shrink-0',
                  isChecked ? 'border-primary bg-primary' : 'border-[#D0D0D0]'
                )}
              >
                {isChecked && <Check className="h-3.5 w-3.5 text-white" />}
              </div>
              <span
                className={cn(
                  'text-sm',
                  isChecked ? 'text-primary font-semibold' : 'text-foreground'
                )}
              >
                {system.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      {showError && selectedSystems.length === 0 && (
        <p className="mt-3 text-sm text-[#9B2F23]">
          Please select at least one affected system
        </p>
      )}
    </div>
  );
}

// =============================================================================
// IMPACT ASSESSMENT RADIO (STEP 2)
// =============================================================================

interface ImpactAssessmentProps {
  selectedImpact: string;
  onSelect: (impact: string) => void;
}

function ImpactAssessment({ selectedImpact, onSelect }: ImpactAssessmentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {IMPACT_OPTIONS.map((option) => {
        const isSelected = selectedImpact === option.id;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'p-4 rounded-lg border-2 text-center transition-all duration-200',
              isSelected
                ? 'bg-accent/50 border-primary'
                : 'bg-white border-[#D0D0D0] hover:bg-[#FAFAFA] hover:border-primary active:border-primary'
            )}
          >
            <span
              className={cn(
                'text-sm font-semibold block',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {option.label}
            </span>
            <span className="text-sm text-muted-foreground mt-1 block">{option.description}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// =============================================================================
// FORM FIELD RENDERER
// =============================================================================

interface FormFieldRendererProps {
  field: FormFieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}

function FormFieldRenderer({ field, value, onChange }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            id={field.id}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            inputMode={field.type === 'email' ? 'email' : field.type === 'number' ? 'numeric' : 'text'}
            className="h-11 bg-[#E8E8E8] border-[#D0D0D0] rounded-lg px-4 text-sm focus:bg-[#E8E8E8] focus:ring-2 focus:ring-ring"
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            className="min-h-[100px] bg-[#E8E8E8] border-[#D0D0D0] rounded-lg px-4 py-3 text-sm focus:bg-[#E8E8E8] focus:ring-2 focus:ring-ring"
          />
        );

      case 'select':
        return (
          <Select
            value={(value as string) || ''}
            onValueChange={onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className="h-11 bg-[#E8E8E8] border-[#D0D0D0] rounded-lg">
              <SelectValue placeholder={field.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <Checkbox
              id={field.id}
              checked={(value as boolean) || false}
              onCheckedChange={onChange}
              disabled={field.disabled}
            />
            <label
              htmlFor={field.id}
              className="text-sm text-foreground cursor-pointer"
            >
              {field.placeholder || field.label}
            </label>
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-11 justify-start text-left font-normal bg-[#E8E8E8] border-[#D0D0D0] rounded-lg',
                  !value && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value as Date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value as Date | undefined}
                onSelect={onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'file':
        return (
          <div
            className="border-2 border-dashed border-[#D0D0D0] rounded-lg p-6 text-center bg-[#FAFAFA] hover:bg-[#F0F0F0] active:bg-[#E8E8E8] transition-colors cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => document.getElementById(field.id)?.click()}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById(field.id)?.click(); }}
          >
            <input
              type="file"
              id={field.id}
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0])}
            />
            <label htmlFor={field.id} className="cursor-pointer">
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-sm text-[#9E9E9E] mt-1">Max 10MB</p>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (field.type === 'checkbox') {
    return <div className="py-2">{renderField()}</div>;
  }

  return (
    <div className="space-y-2">
      <Label
        htmlFor={field.id}
        className="text-sm font-semibold text-foreground"
      >
        {field.label}
        {field.required && <span className="text-[#9B2F23] ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helperText && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  );
}

// =============================================================================
// STEP 2 ISSUE DETAILS CONTENT
// =============================================================================

interface Step2IssueDetailsProps {
  formData: Record<string, unknown>;
  onFieldChange: (field: string, value: unknown) => void;
  showValidationErrors?: boolean;
  selectedCategory?: string;
}

function Step2IssueDetails({ formData, onFieldChange, showValidationErrors, selectedCategory }: Step2IssueDetailsProps) {
  const selectedPriority = (formData.priority as string) || '';
  const selectedSystems = (formData.affectedSystems as string[]) || [];
  const selectedImpact = (formData.impact as string) || '';
  const location = (formData.location as string) || '';
  const usersAffected = (formData.usersAffected as number) || 1;
  const [isDetecting, setIsDetecting] = useState(false);
  const [deviceDetected, setDeviceDetected] = useState(false);
  const detectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (detectTimerRef.current) clearTimeout(detectTimerRef.current);
    };
  }, []);

  // Auto-detect device info from browser
  const handleDetectDevice = () => {
    setIsDetecting(true);
    detectTimerRef.current = setTimeout(() => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform || '';
      // Use actual hostname as device name hint
      const detectedDevice = platform || 'Unknown device';
      let detectedOS = 'other';
      if (userAgent.includes('Windows NT 11') || userAgent.includes('Windows NT 10.0')) detectedOS = 'windows11';
      else if (userAgent.includes('Windows NT 10')) detectedOS = 'windows10';
      else if (userAgent.includes('Mac OS X') && !userAgent.includes('iPhone')) detectedOS = 'macos';
      else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) detectedOS = 'ios';
      else if (userAgent.includes('Android')) detectedOS = 'android';

      onFieldChange('deviceName', detectedDevice);
      onFieldChange('os', detectedOS);
      setIsDetecting(false);
      setDeviceDetected(true);
      detectTimerRef.current = null;
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-2">
          Tell us more about your issue
        </h2>
        <p className="text-sm text-muted-foreground">
          Help us prioritize and route your request to the right team.
        </p>
      </div>

      {/* Field Group 1: Priority Level - Wrapped in fieldset for accessibility */}
      <fieldset role="radiogroup" aria-required="true" aria-labelledby="priority-legend">
        <legend id="priority-legend" className="text-sm font-semibold text-foreground mb-3 block">
          Priority Level <span className="text-[#9B2F23]">*</span>
        </legend>
        <PrioritySelection
          selectedPriority={selectedPriority}
          onSelect={(priority: string) => onFieldChange('priority', priority)}
        />
        {showValidationErrors && !selectedPriority && (
          <p className="mt-3 text-sm text-[#9B2F23]" role="alert">
            Please select a priority level
          </p>
        )}
      </fieldset>

      {/* Field Group 2: Affected Systems - Wrapped in fieldset for accessibility */}
      <fieldset role="group" aria-required="true" aria-labelledby="systems-legend">
        <legend id="systems-legend" className="text-sm font-semibold text-foreground mb-3 block">
          Which systems are affected? <span className="text-[#9B2F23]">*</span>
        </legend>
        <AffectedSystemsCheckboxes
          selectedSystems={selectedSystems}
          onChange={(systems: string[]) => onFieldChange('affectedSystems', systems)}
          showError={showValidationErrors}
        />
      </fieldset>

      {/* Field Group 3: Impact Assessment - Number Input */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block">
          How many users are affected?
        </Label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={usersAffected}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = parseInt(e.target.value) || 1;
              onFieldChange('usersAffected', Math.max(1, Math.min(9999, val)));
            }}
            inputMode="numeric"
            min={1}
            max={9999}
            placeholder="1"
            className="w-[120px] h-11 bg-[#E8E8E8] border border-[#D0D0D0] rounded-lg px-4 text-sm focus:border-2 focus:border-ring focus:ring-0 focus:shadow-[0_0_0_3px_rgba(0,51,102,0.08)]"
          />
          <span className="text-sm text-muted-foreground">user(s)</span>
        </div>

        {/* High Impact Alert */}
        <AnimatePresence>
          {usersAffected > 5 && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 200 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-lg bg-[#7B3E00]/10 border-l-4 border-[#7B3E00] flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[#7B3E00] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#7B3E00]">
                  High impact detected. This will be escalated to priority support.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Impact Quick Select */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Or select an impact level:</p>
          <ImpactAssessment
            selectedImpact={selectedImpact}
            onSelect={(impact: string) => onFieldChange('impact', impact)}
          />
        </div>
      </div>

      {/* Field Group 4: Location / Site */}
      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block">
          Location / Site <span className="text-[#9B2F23]">*</span>
        </Label>
        <Select
          value={location}
          onValueChange={(val: string) => onFieldChange('location', val)}
        >
          <SelectTrigger className="h-11 bg-[#E8E8E8] border border-[#D0D0D0] rounded-lg hover:border-2 hover:border-ring hover:shadow-sm focus:border-2 focus:border-ring focus:shadow-[0_0_0_3px_rgba(0,51,102,0.08)] transition-all duration-100">
            <SelectValue placeholder="Select location..." />
            <ChevronDown className="h-5 w-5 text-[#5C5C5C] ml-auto" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-lg border-none max-h-[240px]">
            {LOCATION_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="h-11 px-4 text-sm hover:bg-accent focus:bg-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary data-[state=checked]:font-semibold cursor-pointer transition-colors duration-100"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showValidationErrors && !location && (
          <p className="mt-2 text-sm text-[#9B2F23]">Please select a location</p>
        )}
      </div>

      {/* Field Group 5: Device Information */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <Label className="text-sm font-semibold text-foreground">
              Device Information
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              Helps us diagnose issues faster
            </p>
          </div>
        </div>

        {/* Auto-Detect Button */}
        {!deviceDetected && (
          <Button
            type="button"
            variant="outline"
            onClick={handleDetectDevice}
            disabled={isDetecting}
            className="h-11 px-6 mb-4 bg-white border border-[#D0D0D0] text-foreground hover:bg-[#E0E0E0] rounded-xl"
          >
            {isDetecting ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Detect Device Info
              </>
            )}
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              Device Name
            </Label>
            <Input
              value={(formData.deviceName as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('deviceName', e.target.value)}
              placeholder={deviceDetected ? 'Not detected' : 'e.g., IOI-LAPTOP-001'}
              disabled={deviceDetected}
              className={cn(
                'h-11 border rounded-lg px-4 text-sm',
                deviceDetected
                  ? 'bg-[#E0E0E0] border-[#D0D0D0] text-muted-foreground cursor-not-allowed'
                  : 'bg-[#E8E8E8] border-[#D0D0D0] focus:border-2 focus:border-ring'
              )}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              Operating System
            </Label>
            <Select
              value={(formData.os as string) || ''}
              onValueChange={(val: string) => onFieldChange('os', val)}
              disabled={deviceDetected}
            >
              <SelectTrigger
                className={cn(
                  'h-11 rounded-lg',
                  deviceDetected
                    ? 'bg-[#E0E0E0] border-[#D0D0D0] text-muted-foreground cursor-not-allowed'
                    : 'bg-[#E8E8E8] border-[#D0D0D0] hover:border-ring'
                )}
              >
                <SelectValue placeholder="Select OS..." />
              </SelectTrigger>
              <SelectContent>
                {OS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Software Version - Conditional for Software Issues */}
        {selectedCategory === 'software' && (
          <div className="mt-4">
            <Label className="text-sm font-semibold text-foreground mb-2 block">
              Application Version <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              value={(formData.softwareVersion as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('softwareVersion', e.target.value)}
              placeholder="e.g., Microsoft Outlook 16.89, Excel 2024"
              className="h-11 bg-[#E8E8E8] border border-[#D0D0D0] rounded-lg px-4 text-sm focus:border-2 focus:border-[#1B5E20]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN MULTI-STEP FORM COMPONENT
// =============================================================================

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  formData,
  onFieldChange,
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
  categories = DEFAULT_CATEGORIES,
  fields = [],
  selectedCategory,
  onCategorySelect,
  children,
}: MultiStepFormProps) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Validation for Step 1: Category selection
  const validateStep1 = useCallback(() => {
    return !!selectedCategory;
  }, [selectedCategory]);

  // Validation for Step 2: Priority, Affected Systems, Location all required
  const validateStep2 = useCallback(() => {
    const priority = formData.priority as string;
    const affectedSystems = (formData.affectedSystems as string[]) || [];
    const location = formData.location as string;
    
    const hasPriority = !!priority;
    const hasMinOneSystem = affectedSystems.length > 0;
    const hasLocation = !!location;
    
    return hasPriority && hasMinOneSystem && hasLocation;
  }, [formData]);

  // Check if current step is valid (for enabling/disabling Continue button)
  const isCurrentStepValid = useCallback(() => {
    // When custom children are used, step validation is managed by the consumer
    if (children) return true;
    switch (currentStep) {
      case 0:
        return validateStep1();
      case 1:
        return validateStep2();
      default:
        return true; // Steps 3+ have optional fields or are confirmation
    }
  }, [currentStep, validateStep1, validateStep2, children]);

  const handleNext = useCallback(() => {
    // Validate current step before proceeding
    if (!isCurrentStepValid()) {
      setShowValidationErrors(true);
      return;
    }
    setShowValidationErrors(false);
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  }, [currentStep, steps.length, onStepChange, isCurrentStepValid]);

  const handlePrevious = useCallback(() => {
    setShowValidationErrors(false);
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, onStepChange]);

  const handleStepClick = useCallback((step: number) => {
    if (step <= currentStep) {
      setShowValidationErrors(false);
      onStepChange(step);
    }
  }, [currentStep, onStepChange]);

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md border border-[#D0D0D0] p-8">
        {/* Progress Indicator */}
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Custom children override default step content */}
            {children ? (
              children
            ) : (
              <>
                {/* Step 1: Category Selection */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-2">
                      What type of issue are you experiencing?
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      Select the category that best describes your issue. This helps us route your request to the right team.
                    </p>
                    <CategoryCards
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelect={(id: string) => onCategorySelect?.(id)}
                    />

                    {/* Brief Description Field */}
                    <div className="mt-6">
                      <Label className="text-sm font-semibold text-foreground mb-2 block">
                        Brief Description
                      </Label>
                      <Textarea
                        value={(formData.description as string) || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onFieldChange('description', e.target.value)}
                        placeholder="Briefly describe your issue..."
                        className="min-h-[100px] bg-[#E8E8E8] border-[#D0D0D0] rounded-lg px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Issue Details */}
                {currentStep === 1 && (
                  <Step2IssueDetails
                    formData={formData}
                    onFieldChange={onFieldChange}
                    showValidationErrors={showValidationErrors}
                    selectedCategory={selectedCategory}
                  />
                )}

                {/* Step 3+: Dynamic Fields */}
                {currentStep > 1 && currentStep < steps.length - 1 && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  {steps[currentStep].name}
                </h2>
                {steps[currentStep].description && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {steps[currentStep].description}
                  </p>
                )}

                <div className="grid gap-4">
                  {fields.map((field) => (
                    <FormFieldRenderer
                      key={field.id}
                      field={field}
                      value={formData[field.id]}
                      onChange={(val: unknown) => onFieldChange(field.id, val)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Last Step: Confirmation */}
            {isLastStep && (
              <div>
                <h2 className="text-base font-semibold text-foreground mb-2">
                  Review & Confirm
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Please review your submission before submitting.
                </p>

                {/* Summary Card */}
                <div className="bg-[#FAFAFA] border border-[#D0D0D0] rounded-lg p-4 space-y-3">
                  {selectedCategory && (
                    <div>
                      <span className="text-[13px] font-semibold text-muted-foreground uppercase">Category</span>
                      <p className="text-sm text-foreground">
                        {categories.find((c) => c.id === selectedCategory)?.label || selectedCategory}
                      </p>
                    </div>
                  )}
                  {typeof formData.priority === 'string' && formData.priority && (
                    <div>
                      <span className="text-[13px] font-semibold text-muted-foreground uppercase">Priority</span>
                      <p className="text-sm text-foreground capitalize">{formData.priority}</p>
                    </div>
                  )}
                  {(formData.affectedSystems as string[])?.length > 0 && (
                    <div>
                      <span className="text-[13px] font-semibold text-muted-foreground uppercase">Affected Systems</span>
                      <p className="text-sm text-foreground">
                        {(formData.affectedSystems as string[]).map((id: string) =>
                          AFFECTED_SYSTEMS.find((s) => s.id === id)?.label || id
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                  {typeof formData.impact === 'string' && formData.impact && (
                    <div>
                      <span className="text-[13px] font-semibold text-muted-foreground uppercase">Impact</span>
                      <p className="text-sm text-foreground">
                        {IMPACT_OPTIONS.find((o) => o.id === formData.impact)?.label || formData.impact}
                      </p>
                    </div>
                  )}
                  {typeof formData.location === 'string' && formData.location && (
                    <div>
                      <span className="text-[13px] font-semibold text-muted-foreground uppercase">Location</span>
                      <p className="text-sm text-foreground">
                        {formData.location === 'MY-JH' || formData.location === 'johor' ? 'Johor (MY-JH) - Main Office' :
                         formData.location === 'MY-PR' || formData.location === 'prai' ? 'Prai (MY-PR) - Secondary Office' :
                         'Remote / Work from Home'}
                      </p>
                    </div>
                  )}
                  {typeof formData.description === 'string' && formData.description && (
                    <div>
                      <span className="text-[13px] font-semibold text-muted-foreground uppercase">Description</span>
                      <p className="text-sm text-foreground">{formData.description}</p>
                    </div>
                  )}
                </div>

                {/* SLA Acknowledgment */}
                <div className="mt-6 flex items-start gap-3">
                  <Checkbox
                    id="sla-ack"
                    checked={(formData.slaAcknowledged as boolean) || false}
                    onCheckedChange={(checked: boolean) => onFieldChange('slaAcknowledged', checked)}
                  />
                  <label htmlFor="sla-ack" className="text-sm text-[#5C5C5C] cursor-pointer">
                    I understand that response times are based on priority and may vary. Standard SLA applies.
                  </label>
                </div>
              </div>
            )}
            </>
          )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#EEEEEE]">
          <div>
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="h-11 px-6 border-[#D0D0D0] text-foreground hover:bg-[#E0E0E0]"
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              className="h-11 px-6 border-[#D0D0D0] text-foreground hover:bg-[#E0E0E0]"
            >
              Save as Draft
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || (!children && !(formData.slaAcknowledged as boolean))}
                className="h-11 px-6 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground/60 text-primary-foreground font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className={cn(
                  'h-11 px-6 font-semibold transition-all duration-200',
                  isCurrentStepValid()
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-muted text-muted-foreground/60 cursor-not-allowed'
                )}
              >
                Continue to Step {currentStep + 2}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_CATEGORIES, PRIORITY_OPTIONS, AFFECTED_SYSTEMS, IMPACT_OPTIONS };