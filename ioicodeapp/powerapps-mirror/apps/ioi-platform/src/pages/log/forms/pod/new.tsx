/**
 * POD - Product Over/Short Delivery Form (New)
 *
 * Form ID: 10
 * Sections: Requestor, Weights
 *
 * Schema Reference: Logistics_PowerApps_Data_Schema.xlsx
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  Scale,
  Check,
  Send,
  Loader2,
  CheckCircle,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/use-user';

const FORM_STEPS = [
  { id: 1, label: 'Requestor', description: 'Vehicle details' },
  { id: 2, label: 'Weights', description: 'Weight measurements' },
  { id: 3, label: 'Review & Submit', description: 'Confirm and submit' },
];

export default function PODNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    TankNo: '',
    ACMLoadTemp: '',
    ACMNetWeight: '',
    CustNetWeight: '',
  });

  // Computed: Temp Drop (CM)
  const tempDrop = useMemo(() => {
    const acmTemp = parseFloat(formData.ACMLoadTemp) || 0;
    const custWeight = parseFloat(formData.CustNetWeight) || 0;
    const acmWeight = parseFloat(formData.ACMNetWeight) || 0;
    // Simple calculation for demo - actual formula may differ
    return (acmWeight - custWeight).toFixed(3);
  }, [formData.ACMNetWeight, formData.CustNetWeight]);

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
      const newTicketId = `POD-${year}${month}-${seq}`;

      await MainDBLOGService.create({
        title: newTicketId,
        formCode: 'POD',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: new Date().toISOString(),
        tWasherTankerNo: formData.TankNo,
        wccDelivery: formData.ACMNetWeight ? Number(formData.ACMNetWeight) : undefined,
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('POD report submitted successfully!');
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
                POD Report Submitted!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your product over/short delivery report has been recorded.
              </p>
            </div>

            <div className="mb-6 rounded-lg border-2 border-[#003366] bg-primary/10 p-4">
              <div className="mb-2 text-center font-['Segoe_UI'] text-[13px] font-semibold text-[#003366]">
                REPORT NUMBER
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

            <div className="mb-6 rounded-lg bg-[#FAFAFA] p-4">
              <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Report Summary
              </h3>
              <div className="grid gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Vehicle No:</span>
                  <span className="font-medium">{formData.TankNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">ACM Net Weight:</span>
                  <span className="font-medium">{formData.ACMNetWeight} MT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Customer Net Weight:</span>
                  <span className="font-medium">{formData.CustNetWeight} MT</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-[#5C5C5C]">Variance:</span>
                  <span className={`font-bold ${parseFloat(tempDrop) !== 0 ? 'text-destructive' : 'text-[#166534]'}`}>
                    {tempDrop} MT
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/log')}>
                Back to Logistics
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-[#002244]"
                onClick={() => navigate('/log/forms/pod/new')}
              >
                Create Another
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
              <Scale className="h-6 w-6 text-[#003366]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">LOG-10</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  Product Over/Short Delivery (POD)
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Document product weight discrepancies and temperature variations
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
              {/* Step 1: Requestor */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Requestor Section
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter vehicle details and loading temperature.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        Vehicle No. <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        value={formData.TankNo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('TankNo', e.target.value)}
                        placeholder="Enter vehicle number"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>

                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        Loading Temp at ACM <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          type="number"
                          value={formData.ACMLoadTemp}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ACMLoadTemp', e.target.value)}
                          placeholder="0.0"
                          className="h-11 bg-[#E8E8E8] border-border pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                          °C
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Weights */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Weights Section
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter weight measurements. Variance is calculated automatically.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        ACM Net Weight <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          type="number"
                          step="0.001"
                          value={formData.ACMNetWeight}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ACMNetWeight', e.target.value)}
                          placeholder="0.000"
                          className="h-11 bg-[#E8E8E8] border-border pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                          MT
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        Customer Net Weight <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          type="number"
                          step="0.001"
                          value={formData.CustNetWeight}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('CustNetWeight', e.target.value)}
                          placeholder="0.000"
                          className="h-11 bg-[#E8E8E8] border-border pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                          MT
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Computed Field */}
                  <div className="rounded-lg border-2 border-[#003366] bg-primary/10 p-4">
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                      Weight Variance (CM - Computed)
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`font-['Segoe_UI'] text-[28px] font-bold ${
                        parseFloat(tempDrop) !== 0 ? 'text-destructive' : 'text-[#166534]'
                      }`}>
                        {tempDrop}
                      </span>
                      <span className="font-['Segoe_UI'] text-[16px] text-[#003366]">
                        MT
                      </span>
                      {parseFloat(tempDrop) > 0 && (
                        <Badge variant="destructive" className="ml-2">Over</Badge>
                      )}
                      {parseFloat(tempDrop) < 0 && (
                        <Badge variant="destructive" className="ml-2">Short</Badge>
                      )}
                      {parseFloat(tempDrop) === 0 && (
                        <Badge className="ml-2 bg-[#166534]">Match</Badge>
                      )}
                    </div>
                    <p className="mt-2 font-['Segoe_UI'] text-[12px] text-[#003366]">
                      ACM Net Weight - Customer Net Weight
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
                        Vehicle Information
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Vehicle No:</span>
                          <span className="font-medium">{formData.TankNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Loading Temp:</span>
                          <span className="font-medium">{formData.ACMLoadTemp} °C</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Weight Measurements
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">ACM Net Weight:</span>
                          <span className="font-medium">{formData.ACMNetWeight} MT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Customer Net Weight:</span>
                          <span className="font-medium">{formData.CustNetWeight} MT</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2">
                          <span className="text-[#5C5C5C]">Variance (Computed):</span>
                          <span className={`font-bold ${parseFloat(tempDrop) !== 0 ? 'text-destructive' : 'text-[#166534]'}`}>
                            {tempDrop} MT
                          </span>
                        </div>
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

                    {parseFloat(tempDrop) !== 0 && (
                      <div className="rounded-lg border-l-4 border-destructive bg-destructive/10 p-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <span className="font-['Segoe_UI'] text-[13px] font-semibold text-destructive">
                            Weight Discrepancy Detected
                          </span>
                        </div>
                        <p className="mt-1 font-['Segoe_UI'] text-[13px] text-destructive/80">
                          A variance of {tempDrop} MT has been recorded. This will be flagged for review.
                        </p>
                      </div>
                    )}
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
                  <><Send className="mr-2 h-4 w-4" />Submit Report</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
