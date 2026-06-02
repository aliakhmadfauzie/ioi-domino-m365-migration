/**
 * ECMFB - ECM Forklift Breakdown Notification Form (New)
 *
 * Form ID: 04
 * Sections: Initiator, Approval
 *
 * Schema Reference: Logistics_PowerApps_Data_Schema.xlsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Check,
  Send,
  Loader2,
  CheckCircle,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-user';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';

const FORM_STEPS = [
  { id: 1, label: 'Initiator', description: 'Forklift details' },
  { id: 2, label: 'Approval', description: 'Cost estimation' },
  { id: 3, label: 'Review & Submit', description: 'Confirm and submit' },
];

export default function ECMFBNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    FNumber: '',
    Desc: '',
    TotalCost: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goToNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
  const goToPrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const newTicketId = `ECMFB-${year}${month}-${seq}`;

      await MainDBLOGService.create({
        title: newTicketId,
        formCode: 'ECMFB',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: new Date().toISOString(),
        ecmForkliftNo: formData.FNumber,
        ecmIssueDescription: formData.Desc,
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('ECM Forklift Breakdown notification submitted!');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      toast.success('Ticket ID copied!');
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  if (isSubmitted && ticketId) {
    return (
      <div className="min-h-screen bg-muted p-6">
        <div className="mx-auto max-w-[800px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="rounded-xl bg-white p-8 shadow-lg"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <CheckCircle className="h-10 w-10 text-amber-600" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                Breakdown Notification Submitted!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your ECM forklift breakdown has been reported and sent for approval.
              </p>
            </div>

            <div className="mb-6 rounded-lg border-2 border-amber-500 bg-amber-50 p-4">
              <div className="mb-2 text-center font-['Segoe_UI'] text-[13px] font-semibold text-amber-700">
                NOTIFICATION NUMBER
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-['Segoe_UI'] text-[24px] font-bold text-amber-700">
                  {ticketId}
                </span>
                <Button variant="ghost" size="icon-sm" onClick={copyTicketId}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-[#FAFAFA] p-4">
              <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Breakdown Summary
              </h3>
              <div className="grid gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Forklift Number:</span>
                  <span className="font-medium">{formData.FNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Estimated Cost:</span>
                  <span className="font-medium">RM {formData.TotalCost || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/log')}>
                Back to Logistics
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-[#002244]"
                onClick={() => navigate('/log/forms/ecmfb/new')}
              >
                Report Another
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/log/forms')}
            className="mb-4 text-[#5C5C5C] hover:text-[#003366]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">LOG-04</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  ECM Forklift Breakdown Notification
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Report ECM forklift breakdowns with cost tracking
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index: number) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-['Segoe_UI'] text-[14px] font-semibold ${
                          status === 'completed'
                            ? 'bg-[#166534] text-white'
                            : status === 'active'
                              ? 'bg-amber-500 text-white'
                              : 'bg-[#E0E0E0] text-[#5C5C5C]'
                        }`}
                      >
                        {status === 'completed' ? <Check className="h-5 w-5" /> : step.id}
                      </div>
                      <span className={`mt-2 font-['Segoe_UI'] text-[12px] font-semibold ${
                        status === 'pending' ? 'text-[#5C5C5C]' : 'text-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < FORM_STEPS.length - 1 && (
                      <div className={`mx-2 h-0.5 flex-1 ${status === 'completed' ? 'bg-[#166534]' : 'bg-[#D0D0D0]'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Initiator */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Initiator Section
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter the forklift details and describe the breakdown.
                    </p>
                  </div>

                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Forklift Number <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Input
                      value={formData.FNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('FNumber', e.target.value)}
                      placeholder="e.g., ECM-FL-001"
                      className="mt-2 h-11 bg-[#E8E8E8] border-border"
                    />
                  </div>

                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Problem Description <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Textarea
                      value={formData.Desc}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('Desc', e.target.value)}
                      placeholder="Describe the breakdown in detail..."
                      className="mt-2 min-h-[150px] bg-[#E8E8E8] border-border"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Approval */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Approval Section
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter estimated repair costs.
                    </p>
                  </div>

                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Total Cost <span className="font-normal text-[#5C5C5C]">(RM)</span>
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                        RM
                      </span>
                      <Input
                        type="number"
                        value={formData.TotalCost}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('TotalCost', e.target.value)}
                        placeholder="0.00"
                        className="h-11 bg-[#E8E8E8] border-border pl-12"
                      />
                    </div>
                    <p className="mt-2 font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                      Enter estimated cost. Leave empty if unknown.
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-['Segoe_UI'] text-[13px] font-semibold text-amber-700">
                        Approval Required
                      </span>
                    </div>
                    <p className="mt-1 font-['Segoe_UI'] text-[13px] text-amber-600">
                      This notification will be sent to the supervisor for approval.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Review Your Submission
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Breakdown Details
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Forklift Number:</span>
                          <span className="font-medium">{formData.FNumber}</span>
                        </div>
                        <div>
                          <span className="text-[#5C5C5C]">Description:</span>
                          <p className="mt-1 rounded bg-[#FAFAFA] p-2 font-medium">{formData.Desc}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Cost Information
                      </h3>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#5C5C5C]">Total Cost:</span>
                        <span className="font-medium text-[18px]">RM {formData.TotalCost || '0.00'}</span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#FAFAFA] p-4">
                      <h3 className="mb-2 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        System Generated
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Created By:</span>
                          <span className="font-medium">{user?.fullName || 'Current User'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Created Date:</span>
                          <span className="font-medium">{format(new Date(), 'PPP')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-10 flex justify-between">
            <Button variant="outline" onClick={goToPrevStep} disabled={currentStep === 1} className="h-11 px-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < FORM_STEPS.length ? (
              <Button onClick={goToNextStep} className="h-11 bg-amber-500 px-6 hover:bg-amber-600">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-11 bg-amber-500 px-6 hover:bg-amber-600">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" />Submit Notification</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
