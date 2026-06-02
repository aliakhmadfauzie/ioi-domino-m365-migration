/**
 * TMI - Tanker Monthly Inspection Form (New)
 *
 * Form ID: 15
 * Sections: Initiator, Checklist
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
  Calendar,
  Check,
  Send,
  Loader2,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';
import { LOG_CLEANLINESS_STATUS } from '@/types/log-forms';

const FORM_STEPS = [
  { id: 1, label: 'Initiator', description: 'Previous inspection' },
  { id: 2, label: 'Checklist', description: 'Inspection items' },
  { id: 3, label: 'Review & Submit', description: 'Confirm and submit' },
];

// Checklist items for monthly inspection
const INSPECTION_ITEMS = [
  { id: '1', label: 'Cleanliness of Prime Mover', variable: 'Status_1' },
  { id: '2', label: 'Cleanliness of Tanker Body', variable: 'Status_2' },
  { id: '3', label: 'Condition of Valves and Fittings', variable: 'Status_3' },
  { id: '4', label: 'Condition of Hoses', variable: 'Status_4' },
  { id: '5', label: 'Safety Equipment Status', variable: 'Status_5' },
  { id: '6', label: 'Documentation Complete', variable: 'Status_6' },
];

export default function TMINewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [prevDate, setPrevDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    PrLTDate: '',
    checklistItems: {} as Record<string, { status: string; comment: string }>,
  });

  const updateChecklistItem = (itemId: string, status: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [itemId]: { status, comment: prev.checklistItems[itemId]?.comment || '' },
      },
    }));
  };

  const updateChecklistComment = (itemId: string, comment: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [itemId]: { status: prev.checklistItems[itemId]?.status || '', comment },
      },
    }));
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
      const newTicketId = `TMI-${year}${month}-${seq}`;

      await MainDBLOGService.create({
        title: newTicketId,
        formCode: 'TMI',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: new Date().toISOString(),
        tInspDate: formData.PrLTDate || undefined,
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Monthly inspection submitted!');
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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-[#166534]" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                Monthly Inspection Submitted!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your tanker monthly inspection has been recorded.
              </p>
            </div>

            <div className="mb-6 rounded-lg border-2 border-[#003366] bg-primary/10 p-4">
              <div className="mb-2 text-center font-['Segoe_UI'] text-[13px] font-semibold text-[#003366]">
                INSPECTION NUMBER
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-['Segoe_UI'] text-[24px] font-bold text-[#003366]">
                  {ticketId}
                </span>
                <Button variant="ghost" size="icon-sm" onClick={copyTicketId}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/log')}>
                Back to Logistics
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-[#002244]"
                onClick={() => navigate('/log/forms/tmi/new')}
              >
                New Inspection
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-[#003366]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">LOG-15</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  Tanker Monthly Inspection
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Monthly inspection checklist for tanker fleet
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
                              ? 'bg-primary text-white'
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
                      Enter the previous inspection date (carried from prior record).
                    </p>
                  </div>

                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      <Calendar className="mr-2 inline h-4 w-4" />
                      Previous Inspection Date <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'mt-2 h-11 w-full justify-start bg-[#E8E8E8] border-border text-left font-normal',
                            !prevDate && 'text-muted-foreground'
                          )}
                        >
                          {prevDate ? format(prevDate, 'PPP') : 'Select previous inspection date...'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={prevDate}
                          onSelect={(date: Date | undefined) => {
                            setPrevDate(date);
                            if (date) {
                              setFormData((prev) => ({ ...prev, PrLTDate: format(date, 'yyyy-MM-dd') }));
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="mt-2 font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                      This date is typically carried from the prior inspection record (DS).
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Checklist */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Inspection Checklist
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Rate each inspection item and add comments if needed.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {INSPECTION_ITEMS.map((item) => {
                      const currentItem = formData.checklistItems[item.id];
                      return (
                        <div key={item.id} className="rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between">
                            <Label className="font-['Segoe_UI'] text-[14px] font-medium text-foreground">
                              {item.id}. {item.label}
                            </Label>
                            <Select
                              value={currentItem?.status || ''}
                              onValueChange={(value: string) => updateChecklistItem(item.id, value)}
                            >
                              <SelectTrigger className="w-[180px] h-9 bg-muted border-border">
                                <SelectValue placeholder="Select status..." />
                              </SelectTrigger>
                              <SelectContent>
                                {LOG_CLEANLINESS_STATUS.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="mt-3">
                            <Input
                              placeholder="Comments (optional)"
                              value={currentItem?.comment || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistComment(item.id, e.target.value)}
                              className="h-9 bg-muted border-border"
                            />
                          </div>
                        </div>
                      );
                    })}
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
                        Initiator Information
                      </h3>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#5C5C5C]">Previous Inspection Date:</span>
                        <span className="font-medium">{formData.PrLTDate}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Inspection Results
                      </h3>
                      <div className="space-y-2">
                        {INSPECTION_ITEMS.map((item) => {
                          const itemData = formData.checklistItems[item.id];
                          return (
                            <div key={item.id} className="flex items-center justify-between text-[13px]">
                              <span className="text-[#5C5C5C]">{item.label}:</span>
                              <Badge variant={
                                itemData?.status === 'Good' ? 'default' :
                                itemData?.status === 'Rejected' || itemData?.status === 'Poor' ? 'destructive' :
                                'secondary'
                              }>
                                {itemData?.status || 'Not rated'}
                              </Badge>
                            </div>
                          );
                        })}
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
              <Button onClick={goToNextStep} className="h-11 bg-primary px-6 hover:bg-[#002244]">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="h-11 bg-primary px-6 hover:bg-[#002244]">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" />Submit Inspection</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
