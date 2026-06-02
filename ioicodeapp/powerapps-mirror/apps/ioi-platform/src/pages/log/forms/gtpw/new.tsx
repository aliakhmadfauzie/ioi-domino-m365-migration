/**
 * GTPW - Glycerine Tanker Periodic Washing Form (New)
 *
 * Form ID: 14
 * Sections: SECTION B
 *
 * Schema Reference: Logistics_PowerApps_Data_Schema.xlsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Droplets,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/hooks/use-user';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';
import { LOG_MONTHS } from '@/types/log-forms';

export default function GTPWNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    WMonth: '',
    Temperature: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate temperature >= 80
    const temp = parseFloat(formData.Temperature);
    if (temp < 80) {
      toast.error('Hot water temperature must be at least 80°C');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const newTicketId = `GTPW-${year}${month}-${seq}`;

      await MainDBLOGService.create({
        title: newTicketId,
        formCode: 'GTPW',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: new Date().toISOString(),
        tWashDate: formData.WMonth || undefined,
        tWashStatus: temp >= 80 ? 'Clean' : 'Conditional',
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Tanker washing record submitted!');
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
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
                <CheckCircle className="h-10 w-10 text-cyan-600" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                Washing Record Submitted!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your glycerine tanker washing has been recorded.
              </p>
            </div>

            <div className="mb-6 rounded-lg border-2 border-cyan-500 bg-cyan-50 p-4">
              <div className="mb-2 text-center font-['Segoe_UI'] text-[13px] font-semibold text-cyan-700">
                RECORD NUMBER
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-['Segoe_UI'] text-[24px] font-bold text-cyan-700">
                  {ticketId}
                </span>
                <Button variant="ghost" size="icon-sm" onClick={copyTicketId}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mb-6 rounded-lg bg-[#FAFAFA] p-4">
              <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Washing Summary
              </h3>
              <div className="grid gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Month:</span>
                  <span className="font-medium">{formData.WMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Temperature:</span>
                  <span className="font-medium">{formData.Temperature}°C</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/log')}>
                Back to Logistics
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-[#002244]"
                onClick={() => navigate('/log/forms/gtpw/new')}
              >
                Record Another
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100">
              <Droplets className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">LOG-14</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  Glycerine Tanker Periodic Washing
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Schedule and track glycerine tanker washing cycles
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
                Section B: Washing Details
              </h2>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Record the washing month and hot water temperature.
              </p>
            </div>

            <div>
              <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Washing for the Month <span className="text-[#9B2F23]">*</span>
              </Label>
              <Select
                value={formData.WMonth}
                onValueChange={(value: string) => updateField('WMonth', value)}
              >
                <SelectTrigger className="mt-2 h-11 bg-[#E8E8E8] border-border">
                  <SelectValue placeholder="Select month..." />
                </SelectTrigger>
                <SelectContent>
                  {LOG_MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Hot Water Temperature <span className="text-[#9B2F23]">*</span>
              </Label>
              <div className="relative mt-2">
                <Input
                  type="number"
                  value={formData.Temperature}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Temperature', e.target.value)}
                  placeholder="80"
                  min={80}
                  className="h-11 bg-[#E8E8E8] border-border pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                  °C
                </span>
              </div>
              <p className="mt-2 font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                Minimum temperature required: 80°C
              </p>
            </div>

            {/* Temperature Warning */}
            {formData.Temperature && parseFloat(formData.Temperature) < 80 && (
              <div className="rounded-lg border-l-4 border-destructive bg-destructive/10 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="font-['Segoe_UI'] text-[13px] font-semibold text-destructive">
                    Temperature Below Minimum
                  </span>
                </div>
                <p className="mt-1 font-['Segoe_UI'] text-[13px] text-destructive/80">
                  Hot water temperature must be at least 80°C for effective cleaning.
                </p>
              </div>
            )}

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
              disabled={isSubmitting || !formData.WMonth || !formData.Temperature}
              className="h-11 bg-cyan-600 px-8 hover:bg-cyan-700"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" />Submit Record</>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
