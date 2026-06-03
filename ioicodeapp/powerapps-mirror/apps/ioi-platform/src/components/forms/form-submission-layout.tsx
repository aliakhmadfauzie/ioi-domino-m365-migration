/**
 * FormSubmissionLayout — Shared layout for all IT forms.
 *
 * Provides:
 *  - IOI Green header with breadcrumbs
 *  - Multi-step form skeleton
 *  - Right sidebar (help, chat, SLA)
 *  - Success confirmation screen
 *  - Retry logic for transient errors
 */

import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Check, Copy, Mail, Clock, AlertCircle, HelpCircle, MessageCircle, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MultiStepForm, type FormStep, type FormFieldConfig } from '@/components/multi-step-form';
import { retryWithBackoff, generateTicketId, type FormSubmissionResult } from '@/lib/form-submission-utils';

// =============================================================================
// Types
// =============================================================================

export interface FormConfig {
  /** Form code (e.g., "EAF", "NIR") */
  code: string;
  /** Display name (e.g., "External Access Form") */
  name: string;
  /** Base path for navigation (e.g., "/it/forms/eaf") */
  basePath: string;
  /** Optional destination for the success screen's submissions button */
  submissionsPath?: string;
  /** Initial status after submission */
  initialStatus: string;
  /** Initial workflow stage number */
  initialStage: number;
  /** Whether this form creates an Ext record */
  hasExtRecord?: boolean;
}

export interface FormSubmissionCallbacks {
  /** Called when form is submitted */
  onSubmit: (data: {
    ticketId: string;
    submissionData: Record<string, unknown>;
    createdId?: number;
  }) => Promise<void>;
  /** Called to save draft */
  onSaveDraft?: (data: Record<string, unknown>) => Promise<void>;
}

// =============================================================================
// Form Submission Layout
// =============================================================================

interface FormSubmissionLayoutProps {
  formConfig: FormConfig;
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  formData: Record<string, unknown>;
  onFieldChange: (field: string, value: unknown) => void;
  fields: FormFieldConfig[];
  isSubmitting: boolean;
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  onSubmit: () => Promise<void>;
  onSaveDraft?: () => Promise<void>;
  submissionResult: FormSubmissionResult | null;
  notificationSent: boolean;
  children?: ReactNode;
}

export function FormSubmissionLayout({
  formConfig,
  steps,
  currentStep,
  onStepChange,
  formData,
  onFieldChange,
  fields,
  isSubmitting,
  selectedCategory,
  onCategorySelect,
  onSubmit,
  onSaveDraft,
  submissionResult,
  notificationSent,
  children,
}: FormSubmissionLayoutProps) {
  const navigate = useNavigate();

  // If submission is complete, show success screen
  if (submissionResult) {
    return (
      <FormSuccessScreen
        formConfig={formConfig}
        result={submissionResult}
        notificationSent={notificationSent}
        onBack={() => navigate(formConfig.basePath)}
        onViewSubmissions={() => navigate(formConfig.submissionsPath ?? `/my-submissions?form=${formConfig.code}`)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* IOI Blue Header */}
      <header className="h-16 bg-[#003366] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{formConfig.name}</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to={formConfig.basePath} className="hover:text-white">{formConfig.code}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New Request</span>
            </div>
          </div>
        </div>
        <Badge className="bg-white/20 text-white border-0">
          <Headset className="h-3 w-3 mr-1" />
          IT Support
        </Badge>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="mx-auto max-w-6xl flex gap-6">
          {/* Left Column - Form */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
            >
              <MultiStepForm
                steps={steps}
                currentStep={currentStep}
                onStepChange={onStepChange}
                formData={formData}
                onFieldChange={onFieldChange}
                onSubmit={onSubmit}
                onSaveDraft={onSaveDraft}
                isSubmitting={isSubmitting}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
                fields={fields}
              >
                {children}
              </MultiStepForm>
            </motion.div>
          </div>

          {/* Right Column - Sidebar (xl+ only to avoid crowding the form on narrower screens) */}
          <div className="w-64 space-y-4 shrink-0 hidden xl:block">
            {sidebarContent(formConfig)}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Sidebar Content
// =============================================================================

function sidebarContent(formConfig: FormConfig) {
  return (
    <>
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
          Fill in all required fields marked with <span className="text-red-500">*</span>.
        </p>
        <div className="space-y-2">
          <p className="text-xs text-[#5C5C5C]">
            <strong>Form:</strong> {formConfig.name} ({formConfig.code})
          </p>
          <p className="text-xs text-[#5C5C5C]">
            Your request will be routed to the appropriate IT team for processing.
          </p>
        </div>
      </motion.div>

      {/* SLA Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] as const }}
        className="bg-[#003366/10] rounded-xl border border-[#003366]/20 p-4"
      >
        <h3 className="text-sm font-semibold text-[#003366] mb-2">Processing Times</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#5C5C5C]">Standard</span>
            <span className="font-medium text-[#166534]">1-2 business days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5C5C5C]">Urgent</span>
            <span className="font-medium text-[#166534]">Same day</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// =============================================================================
// Success Screen
// =============================================================================

interface FormSuccessScreenProps {
  formConfig: FormConfig;
  result: FormSubmissionResult;
  notificationSent: boolean;
  onBack: () => void;
  onViewSubmissions: () => void;
}

function FormSuccessScreen({
  formConfig,
  result,
  notificationSent,
  onBack,
  onViewSubmissions,
}: FormSuccessScreenProps) {
  const copyTicketId = () => {
    navigator.clipboard.writeText(result.ticketId);
    toast.success('Ticket ID copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="h-16 bg-[#003366] px-6 flex items-center">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-white">Request Submitted</h1>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
          className="bg-white rounded-xl border border-[#D0D0D0] shadow-lg overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-[#003366]/10 border-b border-[#003366]/20 p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-[#166534] mx-auto mb-4 flex items-center justify-center"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-xl font-bold text-[#003366] mb-2">Submitted Successfully!</h2>
            <p className="text-[#5C5C5C] text-sm">
              Your {formConfig.name} request has been submitted and is being processed.
            </p>
          </div>

          {/* Ticket Details */}
          <div className="p-6">
            <div className="bg-[#FAFAFA] rounded-lg border border-[#E0E0E0] p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#5C5C5C] mb-1">Reference Number</p>
                  <p className="text-2xl font-bold text-[#003366]">{result.ticketId}</p>
                </div>
                <Button variant="outline" size="sm" onClick={copyTicketId} className="border-[#003366] text-[#003366] hover:bg-[#003366]/10">
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#FAFAFA] rounded-lg p-3">
                <p className="text-xs text-[#5C5C5C] mb-1">Status</p>
                <Badge className="bg-[#EAF0FB] text-[#1752A8] border-0">{result.currentStatus}</Badge>
              </div>
              {result.priority && (
                <div className="bg-[#FAFAFA] rounded-lg p-3">
                  <p className="text-xs text-[#5C5C5C] mb-1">Priority</p>
                  <Badge className={`border-0 text-white ${
                    result.priority === 'Critical' ? 'bg-[#9B2F23]' :
                    result.priority === 'High' ? 'bg-[#7B3E00]' :
                    result.priority === 'Normal' ? 'bg-[#7A4F00]' : 'bg-[#424242]'
                  }`}>{result.priority}</Badge>
                </div>
              )}
              <div className="bg-[#FAFAFA] rounded-lg p-3">
                <p className="text-xs text-[#5C5C5C] mb-1">Form Type</p>
                <p className="text-sm font-medium text-[#1C1C1C]">{formConfig.name}</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg p-3">
                <p className="text-xs text-[#5C5C5C] mb-1">Submitted</p>
                <p className="text-sm font-medium text-[#1C1C1C]">{new Date(result.submittedDate).toLocaleString()}</p>
              </div>
            </div>

            {/* Email Notification */}
            <div className={`rounded-lg border p-4 mb-6 ${notificationSent ? 'bg-[#003366]/10 border-[#166534]/20' : 'bg-[#FFF3E0] border-[#7B3E00]/20'}`}>
              <div className="flex items-center gap-3">
                {notificationSent ? (
                  <>
                    <Mail className="h-5 w-5 text-[#166534]" />
                    <div>
                      <p className="text-sm font-medium text-[#003366]">Confirmation Sent</p>
                      <p className="text-xs text-[#5C5C5C]">Check your inbox at {result.requestorEmail}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-[#7B3E00]" />
                    <div>
                      <p className="text-sm font-medium text-[#7B3E00]">Notification Pending</p>
                      <p className="text-xs text-[#5C5C5C]">Confirmation will be sent when available</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-[#D0D0D0]" onClick={onBack}>
                Back to {formConfig.code} List
              </Button>
              <Button className="flex-1 bg-[#003366] hover:bg-[#002244] text-white" onClick={onViewSubmissions}>
                View My Submissions
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
