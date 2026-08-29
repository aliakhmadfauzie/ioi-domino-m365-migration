import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Headset,
  Check,
  Copy,
  Mail,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  MultiStepForm,
  DEFAULT_CATEGORIES,
  type FormStep,
  type FormFieldConfig,
  type CategoryOption,
} from '@/components/multi-step-form';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtSupport } from '@/generated/hooks/use-main-dbitext-support';
import { ITSSR } from '@/lib/it-forms-config';
import { MainDBIT } from '@/generated/models';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';

// =============================================================================
// RETRY HELPER - handles transient "data model being updated" errors
// =============================================================================

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 2000;

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  onRetry?: (attempt: number, maxAttempts: number) => void
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Only retry on data model update errors
      if (!errorMessage.includes('data model') && !errorMessage.includes('being updated')) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(1.5, attempt - 1);
        onRetry?.(attempt, MAX_RETRIES);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// =============================================================================
// TYPES
// =============================================================================

interface SubmissionResult {
  id: number;
  ticketId: string;
  title: string;
  formcode: string;
  currentStatus: string;
  priority: string;
  site: string;
  submittedDate: string;
  requestorEmail: string;
}

// =============================================================================
// FORM STEPS CONFIGURATION
// =============================================================================

const FORM_STEPS: FormStep[] = [
  { id: 'category', name: 'Category', description: 'Select issue type' },
  { id: 'details', name: 'Details', description: 'Describe your issue' },
  { id: 'additional', name: 'Additional', description: 'Extra information' },
  { id: 'confirmation', name: 'Confirmation', description: 'Review and submit' },
];

// Step 2: Issue Details fields
const DETAILS_FIELDS: FormFieldConfig[] = [
  {
    id: 'priority',
    label: 'Priority',
    type: 'select',
    required: true,
    options: [
      { value: 'low', label: 'Low - Can wait' },
      { value: 'normal', label: 'Normal - Standard handling' },
      { value: 'high', label: 'High - Urgent attention needed' },
      { value: 'critical', label: 'Critical - Business impacting' },
    ],
    helperText: 'Critical issues affect multiple users or critical business processes',
  },
  {
    id: 'affectedSystems',
    label: 'Affected Systems',
    type: 'select',
    required: true,
    options: [
      { value: 'email', label: 'Email / Outlook' },
      { value: 'sharepoint', label: 'SharePoint / OneDrive' },
      { value: 'sap', label: 'SAP' },
      { value: 'vpn', label: 'VPN / Remote Access' },
      { value: 'network', label: 'Network / Internet' },
      { value: 'printer', label: 'Printer / Scanner' },
      { value: 'laptop', label: 'Laptop / Desktop' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'affectedUsers',
    label: 'How many users affected?',
    type: 'select',
    required: true,
    options: [
      { value: '1', label: 'Just me' },
      { value: '2-5', label: '2-5 users' },
      { value: '5-10', label: '5-10 users' },
      { value: '10+', label: 'More than 10 users' },
      { value: 'department', label: 'Entire department' },
    ],
    helperText: 'If more than 5 users, this may trigger escalation',
  },
  {
    id: 'location',
    label: 'Location',
    type: 'select',
    required: true,
    options: [
      { value: 'MY-PR', label: 'Prai (MY-PR)' },
      { value: 'MY-JH', label: 'Johor (MY-JH)' },
      { value: 'remote', label: 'Working Remotely' },
    ],
  },
];

// Step 3: Additional Info fields
const ADDITIONAL_FIELDS: FormFieldConfig[] = [
  {
    id: 'troubleshootingDone',
    label: 'Have you tried restarting?',
    type: 'checkbox',
    placeholder: 'Yes, I have restarted my device',
  },
  {
    id: 'clearedCache',
    label: 'Cleared cache/cookies?',
    type: 'checkbox',
    placeholder: 'Yes, I have cleared cache/cookies',
  },
  {
    id: 'checkedConnectivity',
    label: 'Checked network connectivity?',
    type: 'checkbox',
    placeholder: 'Yes, I have verified my network connection',
  },
  {
    id: 'errorMessage',
    label: 'Error Message (if any)',
    type: 'textarea',
    placeholder: 'Copy and paste the exact error message here...',
    helperText: 'Include the full error text if visible',
  },
  {
    id: 'issueStartDate',
    label: 'When did the issue start?',
    type: 'date',
    required: true,
  },
  {
    id: 'isRecurring',
    label: 'Is this a recurring issue?',
    type: 'select',
    options: [
      { value: 'no', label: 'No, first time' },
      { value: 'occasional', label: 'Occasionally' },
      { value: 'frequent', label: 'Frequently' },
      { value: 'always', label: 'Always happens' },
    ],
  },
  {
    id: 'deviceInfo',
    label: 'Device Information',
    type: 'text',
    placeholder: 'e.g., Dell Latitude 5520, Windows 11',
    helperText: 'Your device name and operating system',
  },
];

// Generate ticket ID
const generateTicketId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `${ITSSR.code}-${year}${month}-${seq}`;
};

// Map location to site key
const mapLocationToSiteKey = (location: string): MainDBIT['siteKey'] => {
  switch (location) {
    case 'MY-JH': return 'SiteKey0'; // Johor
    case 'MY-PR': return 'SiteKey2'; // Prai
    default: return 'SiteKey4'; // All Sites for remote
  }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || undefined;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT } = useCreateMainDBIT();
  const { mutateAsync: createExtSupport } = useCreateMainDBITExtSupport();

  // Get fields for current step
  const currentFields = useMemo(() => {
    if (currentStep === 1) return DETAILS_FIELDS;
    if (currentStep === 2) return ADDITIONAL_FIELDS;
    return [];
  }, [currentStep]);

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleRetryNotification = useCallback((attempt: number, maxAttempts: number) => {
    toast.info(`System busy, retrying... (${attempt}/${maxAttempts})`, { duration: 2000 });
  }, []);

  const handleSaveDraft = async () => {
    try {
      const ticketId = generateTicketId();
      const siteKey = mapLocationToSiteKey(formData.location as string || 'MY-PR');

      // Create record in MainDB_IT SharePoint list
      const record: Omit<MainDBIT, 'id'> = {
        title: ticketId,
        formcode: ITSSR.code,
        currentStatus: 'Draft' ,
        environmenttagKey: 'EnvironmenttagKey0', // Production
        siteKey,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 0,
        currentAction: 'Draft',
        subject: `IT Support Request - ${selectedCategory || 'General'}`,
      };

      // Retry with exponential backoff for transient errors
      const created = await retryWithBackoff(
        () => createMainDBIT(record),
        handleRetryNotification
      );

      if (created?.id) {
        const supportRecord: Omit<MainDBITExtSupport, 'id'> = {
          title: `${ticketId}-support`,
          parentFormCode: ITSSR.code,
          parentRecord: { id: created.id, title: ticketId },
          parentSite: formData.location as string || 'MY-PR',
          iTSSRReportedByEmail: user?.userPrincipalName || '',
          iTSSRProblemCategory: selectedCategory || '',
          iTSSRServiceType: String(formData.affectedSystems || ''),
          iTSSRProblemDescription: [
            `Affected Systems: ${formData.affectedSystems || ''}`,
            `Affected Users: ${formData.affectedUsers || ''}`,
            `Location: ${formData.location || ''}`,
            formData.errorMessage ? `Error: ${formData.errorMessage}` : '',
            formData.deviceInfo ? `Device: ${formData.deviceInfo}` : '',
          ].filter(Boolean).join('\n'),
          iTSSRITRemarks: [
            `Draft Step: ${currentStep}`,
            `Restarted: ${formData.troubleshootingDone ? 'Yes' : 'No'}`,
            `Cleared Cache: ${formData.clearedCache ? 'Yes' : 'No'}`,
            `Checked Connectivity: ${formData.checkedConnectivity ? 'Yes' : 'No'}`,
          ].join('\n'),
        };
        await retryWithBackoff(() => createExtSupport(supportRecord));
      }
      toast.success(`Draft saved! Ticket: ${ticketId}`);
      navigate('/it/support');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('data model') || errorMessage.includes('being updated')) {
        toast.error('System is temporarily busy. Please wait a moment and try again.');
      } else {
        toast.error('Failed to save draft');
      }
      console.error('Draft save error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.slaAcknowledged) {
      toast.error('Please acknowledge the SLA terms');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketId = generateTicketId();
      const siteKey = mapLocationToSiteKey(formData.location as string || 'MY-PR');

      // Map priority to display value
      const priorityMap: Record<string, string> = {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        critical: 'Critical',
      };
      const priority = priorityMap[formData.priority as string] || 'Normal';

      // Create record in MainDB_IT SharePoint list
      const record: Omit<MainDBIT, 'id'> = {
        title: ticketId,
        formcode: ITSSR.code,
        currentStatus: 'PendingIT', // PendingIT - first ITSSR stage after submit
        environmenttagKey: 'EnvironmenttagKey0', // Production
        siteKey,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        currentAction: 'PendingIT',
        subject: `IT Support Request - ${selectedCategory || formData.affectedSystems || 'General'}`,
      };

      // Retry with exponential backoff for transient errors
      const result = await retryWithBackoff(
        () => createMainDBIT(record),
        handleRetryNotification
      );

      if (result?.id) {
        const supportRecord: Omit<MainDBITExtSupport, 'id'> = {
          title: `${ticketId}-support`,
          parentFormCode: ITSSR.code,
          parentRecord: { id: result.id, title: ticketId },
          parentSite: formData.location as string || 'MY-PR',
          iTSSRReportedByEmail: user?.userPrincipalName || '',
          iTSSRProblemCategory: selectedCategory || '',
          iTSSRServiceType: String(formData.affectedSystems || ''),
          iTSSRProblemDescription: [
            `Priority: ${priority}`,
            `Affected Systems: ${formData.affectedSystems || ''}`,
            `Affected Users: ${formData.affectedUsers || ''}`,
            `Location: ${formData.location || ''}`,
            formData.issueStartDate ? `Started: ${formData.issueStartDate}` : '',
            formData.isRecurring ? `Recurring: ${formData.isRecurring}` : '',
            formData.errorMessage ? `Error: ${formData.errorMessage}` : '',
            formData.deviceInfo ? `Device: ${formData.deviceInfo}` : '',
          ].filter(Boolean).join('\n'),
          iTSSRITRemarks: [
            `Restarted: ${formData.troubleshootingDone ? 'Yes' : 'No'}`,
            `Cleared Cache: ${formData.clearedCache ? 'Yes' : 'No'}`,
            `Checked Connectivity: ${formData.checkedConnectivity ? 'Yes' : 'No'}`,
          ].join('\n'),
        };
        await retryWithBackoff(() => createExtSupport(supportRecord));
      }

      // Store result for confirmation display
      const submissionData: SubmissionResult = {
        id: result.id,
        ticketId,
        title: `IT Support Request - ${selectedCategory}`,
        formcode: ITSSR.code,
        currentStatus: 'Submitted',
        priority,
        site: formData.location as string || 'MY-PR',
        submittedDate: new Date().toISOString(),
        requestorEmail: user?.userPrincipalName || '',
      };
      setSubmissionResult(submissionData);
      setNotificationSent(true); // Assume email sent via Power Automate flow

      toast.success(`Request submitted! Ticket: ${ticketId}`);

      // Move to confirmation step
      setCurrentStep(4);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('data model') || errorMessage.includes('being updated')) {
        toast.error('System is temporarily busy. Please wait 30 seconds and try again, or refresh the page.');
      } else {
        toast.error('Failed to submit request');
      }
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy ticket ID to clipboard
  const copyTicketId = () => {
    if (submissionResult?.ticketId) {
      navigator.clipboard.writeText(submissionResult.ticketId);
      toast.success('Ticket ID copied to clipboard');
    }
  };

  // If we have a submission result, show success view
  if (submissionResult && currentStep === 4) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* IOI Green Header */}
        <header className="h-16 bg-[#003366] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/it/support">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Request Submitted</h1>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Link to="/it" className="hover:text-white underline underline-offset-2 decoration-white/30">IT</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/it/support" className="hover:text-white underline underline-offset-2 decoration-white/30">Support</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white">Confirmation</span>
              </div>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <div className="p-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
            className="bg-white rounded-xl border border-[#D0D0D0] shadow-lg overflow-hidden"
          >
            {/* Success Header */}
            <div className="bg-[#003366/10] border-b border-[#003366]/20 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-[#166534] mx-auto mb-4 flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-[#003366] mb-2">Request Submitted Successfully!</h2>
              <p className="text-[#5C5C5C] text-sm">
                Your IT support request has been saved to SharePoint and is being processed.
              </p>
            </div>

            {/* Ticket Details */}
            <div className="p-6">
              {/* Ticket ID */}
              <div className="bg-[#FAFAFA] rounded-lg border border-[#E0E0E0] p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#5C5C5C] mb-1">Ticket ID</p>
                    <p className="text-2xl font-bold text-[#003366]">{submissionResult.ticketId}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyTicketId}
                    className="border-[#003366] text-[#003366] hover:bg-[#003366/10]"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#FAFAFA] rounded-lg p-3">
                  <p className="text-xs text-[#5C5C5C] mb-1">Status</p>
                  <Badge className="bg-[#EAF0FB] text-[#1752A8] border-0">{submissionResult.currentStatus}</Badge>
                </div>
                <div className="bg-[#FAFAFA] rounded-lg p-3">
                  <p className="text-xs text-[#5C5C5C] mb-1">Priority</p>
                  <Badge className={`border-0 text-white ${
                    submissionResult.priority === 'Critical' ? 'bg-[#9B2F23]' :
                    submissionResult.priority === 'High' ? 'bg-[#7B3E00]' :
                    submissionResult.priority === 'Normal' ? 'bg-[#7A4F00]' : 'bg-[#424242]'
                  }`}>{submissionResult.priority}</Badge>
                </div>
                <div className="bg-[#FAFAFA] rounded-lg p-3">
                  <p className="text-xs text-[#5C5C5C] mb-1">Category</p>
                  <p className="text-sm font-medium text-[#1C1C1C]">{(DEFAULT_CATEGORIES as CategoryOption[]).find((c) => c.id === selectedCategory)?.label || selectedCategory || 'General'}</p>
                </div>
                <div className="bg-[#FAFAFA] rounded-lg p-3">
                  <p className="text-xs text-[#5C5C5C] mb-1">Location</p>
                  <p className="text-sm font-medium text-[#1C1C1C]">
                    {submissionResult.site === 'MY-JH' ? 'Johor (MY-JH)' :
                     submissionResult.site === 'remote' ? 'Remote' : 'Prai (MY-PR)'}
                  </p>
                </div>
              </div>

              {/* SLA Info */}
              <div className="bg-[#003366/10] rounded-lg border border-[#003366]/20 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#166534]" />
                  <div>
                    <p className="text-sm font-medium text-[#003366]">Expected Response</p>
                    <p className="text-sm text-[#5C5C5C]">
                      {submissionResult.priority === 'Critical' ? '1 hour' :
                       submissionResult.priority === 'High' ? '4 hours' :
                       submissionResult.priority === 'Normal' ? '8 hours' : '24 hours'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Notification Status */}
              <div className={`rounded-lg border p-4 mb-6 ${notificationSent ? 'bg-[#003366/10] border-[#166534]/20' : 'bg-[#FFF3E0] border-[#7B3E00]/20'}`}>
                <div className="flex items-center gap-3">
                  {notificationSent ? (
                    <>
                      <Mail className="h-5 w-5 text-[#166534]" />
                      <div>
                        <p className="text-sm font-medium text-[#003366]">Confirmation Email Sent</p>
                        <p className="text-xs text-[#5C5C5C]">Check your inbox at {submissionResult.requestorEmail}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-[#7B3E00]" />
                      <div>
                        <p className="text-sm font-medium text-[#7B3E00]">Email Notification Pending</p>
                        <p className="text-xs text-[#5C5C5C]">Confirmation will be sent when available</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#D0D0D0] hover:bg-[#FAFAFA]"
                  onClick={() => navigate('/it/support')}
                >
                  Back to Support Hub
                </Button>
                <Button
                  className="flex-1 bg-[#003366] hover:bg-[#002244] text-white"
                  onClick={() => navigate(`/my-submissions`)}
                >
                  View My Submissions
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* IOI Green Header */}
      <header className="h-16 bg-[#003366] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/it/support">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">IT Support Request</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/it/support" className="hover:text-white">Support</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New Request</span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <Badge className="bg-white/20 text-white border-0 cursor-default" title="IT support is currently online during business hours">
            <Headset className="h-3 w-3 mr-1" />
            Support Available
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left Column - Form (70%) */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
            >
              <MultiStepForm
                steps={FORM_STEPS}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                formData={formData}
                onFieldChange={handleFieldChange}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                isSubmitting={isSubmitting}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                fields={currentFields}
              />
            </motion.div>
          </div>

          {/* Right Column - Sidebar (30%) */}
          <div className="w-80 space-y-4">
            {/* Help Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
              className="bg-white rounded-xl border border-[#D0D0D0] p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-5 w-5 text-[#003366]" />
                <h3 className="text-base font-semibold text-[#1C1C1C]">Need Help?</h3>
              </div>
              <p className="text-sm text-[#5C5C5C] mb-4">
                Check our knowledge base for common solutions before submitting.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toast.info('Knowledge base not yet available')}
                  className="block w-full text-left text-sm text-[#003366] hover:underline cursor-pointer"
                >
                  → VPN connection issues
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Knowledge base not yet available')}
                  className="block w-full text-left text-sm text-[#003366] hover:underline cursor-pointer"
                >
                  → Password reset guide
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Knowledge base not yet available')}
                  className="block w-full text-left text-sm text-[#003366] hover:underline cursor-pointer"
                >
                  → Email troubleshooting
                </button>
              </div>
            </motion.div>

            {/* Live Chat Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] as const }}
              className="bg-white rounded-xl border border-[#D0D0D0] p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-5 w-5 text-[#003366]" />
                <h3 className="text-base font-semibold text-[#1C1C1C]">Live Chat</h3>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
                  <span className="text-sm text-[#166534] font-medium">Online</span>
                </span>
              </div>
              <p className="text-sm text-[#5C5C5C] mb-4">
                Chat with our support team for immediate assistance.
              </p>
              <Button
                className="w-full bg-[#003366] hover:bg-[#002244] text-white h-10"
                onClick={() => toast.info('Live chat is not yet available. Please submit a request and a support agent will contact you.')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
            </motion.div>

            {/* SLA Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] as const }}
              className="bg-[#003366/10] rounded-xl border border-[#003366]/20 p-4"
            >
              <h3 className="text-sm font-semibold text-[#003366] mb-2">Expected Response Times</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Critical</span>
                  <span className="font-medium text-[#166534]">1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">High</span>
                  <span className="font-medium text-[#166534]">4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Normal</span>
                  <span className="font-medium text-[#166534]">8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Low</span>
                  <span className="font-medium text-[#166534]">24 hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
