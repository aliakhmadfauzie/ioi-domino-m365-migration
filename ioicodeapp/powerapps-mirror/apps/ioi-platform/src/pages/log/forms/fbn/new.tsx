/**
 * FBN - Forklift Breakdown Notification Form (New)
 *
 * Form ID: 05
 * Sections: Initiator
 *
 * Schema Reference: Logistics_PowerApps_Data_Schema.xlsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  AlertTriangle,
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
import { useUser } from '@/hooks/use-user';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';

export default function FBNNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    BNumber: '',
    SMUHours: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const newTicketId = `FBN-${year}${month}-${seq}`;

      await MainDBLOGService.create({
        title: newTicketId,
        formCode: 'FBN',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: new Date().toISOString(),
        ecmForkliftNo: formData.BNumber,
        fLiftHoursMeter: formData.SMUHours ? Number(formData.SMUHours) : undefined,
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Forklift Breakdown notification submitted!');
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

  if (isSubmitted && ticketId) {
    return (
      <div className="min-h-screen bg-muted p-6">
        <div className="mx-auto max-w-[600px]">
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
                Your forklift breakdown has been reported.
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
                  <span className="text-[#5C5C5C]">Battery Number:</span>
                  <span className="font-medium">{formData.BNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">SMU Hours:</span>
                  <span className="font-medium">{formData.SMUHours} hours</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/log')}>
                Back to Logistics
              </Button>
              <Button
                className="flex-1 bg-[#003366] hover:bg-[#002244]"
                onClick={() => navigate('/log/forms/fbn/new')}
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
      <div className="mx-auto max-w-[600px]">
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
                <Badge variant="outline">LOG-05</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  Forklift Breakdown Notification
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Report standard forklift breakdowns with SMU tracking
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="rounded-xl bg-white p-8 shadow-lg"
        >
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                Initiator Section
              </h2>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Enter the forklift battery details and SMU hours.
              </p>
            </div>

            <div>
              <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Battery Number <span className="text-[#9B2F23]">*</span>
              </Label>
              <Input
                value={formData.BNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('BNumber', e.target.value)}
                placeholder="e.g., BAT-001"
                className="mt-2 h-11 bg-[#E8E8E8] border-[#D0D0D0]"
              />
            </div>

            <div>
              <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                SMU Hours <span className="text-[#9B2F23]">*</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  type="number"
                  value={formData.SMUHours}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('SMUHours', e.target.value)}
                  placeholder="0"
                  className="h-11 bg-[#E8E8E8] border-[#D0D0D0] pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                  hours
                </span>
              </div>
              <p className="mt-2 font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                Enter the current SMU (Service Meter Units) reading.
              </p>
            </div>

            {/* System Generated Info */}
            <div className="rounded-lg bg-[#FAFAFA] p-4">
              <h3 className="mb-2 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                System Generated Fields
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

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.BNumber || !formData.SMUHours}
              className="h-11 bg-amber-500 px-8 hover:bg-amber-600"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" />Submit Notification</>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
