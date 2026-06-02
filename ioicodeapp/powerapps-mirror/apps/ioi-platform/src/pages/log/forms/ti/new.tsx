/**
 * TI - Tanker Inspection Form (New)
 *
 * Form ID: 02
 * Sections: SECTION A, SECTION B (Checklist), QC Approval
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
  ClipboardCheck,
  Check,
  Send,
  Loader2,
  CheckCircle,
  Copy,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { LOG_PRODUCTS } from '@/types/log-forms';

const FORM_STEPS = [
  { id: 1, label: 'Section A', description: 'Tanker details' },
  { id: 2, label: 'Section B', description: 'Inspection checklist' },
  { id: 3, label: 'QC Approval', description: 'Quality control review' },
  { id: 4, label: 'Review & Submit', description: 'Confirm and submit' },
];

// Checklist items based on schema
const CHECKLIST_ITEMS = [
  { id: '1a', label: 'Is the tanker clean and free from contamination?' },
  { id: '1b', label: 'Is the tanker properly sealed?' },
  { id: '2a', label: 'Are all valves and fittings in good condition?' },
  { id: '2b', label: 'Is the tanker documentation complete?' },
  { id: '3a', label: 'Is the tanker capacity suitable for the product?' },
  { id: '3b', label: 'Is the tanker equipped with required safety features?' },
];

export default function TINewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [inDate, setInDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    InDate: '',
    TankNo: '',
    Product: '',
    checklistAnswers: {} as Record<string, { answer: 'Yes' | 'No' | ''; remark: string }>,
    QCRemark: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateChecklistItem = (itemId: string, answer: 'Yes' | 'No' | '') => {
    setFormData((prev) => ({
      ...prev,
      checklistAnswers: {
        ...prev.checklistAnswers,
        [itemId]: { answer, remark: prev.checklistAnswers[itemId]?.remark || '' },
      },
    }));
  };

  const updateChecklistRemark = (itemId: string, remark: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistAnswers: {
        ...prev.checklistAnswers,
        [itemId]: { answer: prev.checklistAnswers[itemId]?.answer || '', remark },
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
      const newTicketId = `TI-${year}${month}-${seq}`;

      await MainDBLOGService.create({
        title: newTicketId,
        formCode: 'TI',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: new Date().toISOString(),
        tInspTankerNo: formData.TankNo,
        tInspDate: inDate?.toISOString(),
        tInspProduct: formData.Product,
        tInspRemarks: formData.QCRemark,
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Tanker Inspection submitted successfully!');
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

  // Success Screen
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
                Tanker Inspection Submitted!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your inspection has been recorded and sent for QC approval.
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
                onClick={() => navigate('/log/forms/ti/new')}
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
              <ClipboardCheck className="h-6 w-6 text-[#003366]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">LOG-02</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  Tanker Inspection
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Inspect tankers before loading with QC approval workflow
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
              {/* Step 1: Section A */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Section A: Tanker Information
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter tanker details and product to be loaded.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        <Calendar className="mr-2 inline h-4 w-4" />
                        Date In <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'mt-2 h-11 w-full justify-start bg-[#E8E8E8] border-border text-left font-normal',
                              !inDate && 'text-muted-foreground'
                            )}
                          >
                            {inDate ? format(inDate, 'PPP') : 'Select date...'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={inDate}
                            onSelect={(date: Date | undefined) => {
                              setInDate(date);
                              if (date) updateField('InDate', format(date, 'yyyy-MM-dd'));
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        Tanker & Trailer No <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        value={formData.TankNo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('TankNo', e.target.value)}
                        placeholder="Enter tanker/trailer number"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        Product to Load <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Select
                        value={formData.Product}
                        onValueChange={(value: string) => updateField('Product', value)}
                      >
                        <SelectTrigger className="mt-2 h-11 bg-[#E8E8E8] border-border">
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LOG_PRODUCTS.map((product) => (
                            <SelectItem key={product} value={product}>
                              {product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Section B - Checklist */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Section B: Inspection Checklist
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Complete all inspection items. Mark Yes or No and add remarks if needed.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {CHECKLIST_ITEMS.map((item) => {
                      const currentAnswer = formData.checklistAnswers[item.id];
                      return (
                        <div key={item.id} className="rounded-lg border border-border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Label className="font-['Segoe_UI'] text-[14px] font-medium text-foreground">
                                {item.id.toUpperCase()}. {item.label}
                              </Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={currentAnswer?.answer === 'Yes' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateChecklistItem(item.id, 'Yes')}
                                className={currentAnswer?.answer === 'Yes' ? 'bg-[#166534] hover:bg-[#166534]' : ''}
                              >
                                Yes
                              </Button>
                              <Button
                                type="button"
                                variant={currentAnswer?.answer === 'No' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => updateChecklistItem(item.id, 'No')}
                              >
                                No
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Input
                              placeholder="Remarks (optional)"
                              value={currentAnswer?.remark || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRemark(item.id, e.target.value)}
                              className="h-9 bg-muted border-border"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: QC Approval */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      QC Approval Section
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Add any additional remarks for QC review.
                    </p>
                  </div>

                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      QC Remarks
                    </Label>
                    <Textarea
                      value={formData.QCRemark}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('QCRemark', e.target.value)}
                      placeholder="Enter any remarks for QC..."
                      className="mt-2 min-h-[120px] bg-[#E8E8E8] border-border"
                    />
                  </div>

                  <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-['Segoe_UI'] text-[13px] font-semibold text-amber-700">
                        Pending QC Review
                      </span>
                    </div>
                    <p className="mt-1 font-['Segoe_UI'] text-[13px] text-amber-600">
                      This inspection will be routed to QC for approval after submission.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Review Your Submission
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Tanker Information
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Date In:</span>
                          <span className="font-medium">{formData.InDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Tanker No:</span>
                          <span className="font-medium">{formData.TankNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Product:</span>
                          <span className="font-medium">{formData.Product}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Checklist Summary
                      </h3>
                      <div className="space-y-2">
                        {CHECKLIST_ITEMS.map((item) => {
                          const answer = formData.checklistAnswers[item.id];
                          return (
                            <div key={item.id} className="flex items-center justify-between text-[13px]">
                              <span className="text-[#5C5C5C]">{item.id.toUpperCase()}:</span>
                              <Badge variant={answer?.answer === 'Yes' ? 'default' : answer?.answer === 'No' ? 'destructive' : 'secondary'}>
                                {answer?.answer || 'Not answered'}
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
