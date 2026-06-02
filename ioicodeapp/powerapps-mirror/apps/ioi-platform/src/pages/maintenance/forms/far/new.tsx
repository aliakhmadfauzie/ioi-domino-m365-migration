/**
 * FAR - Failure Analysis Report (New)
 *
 * Form Code: FAR
 * Stages: Submit → Initial Review → Investigation → Root Cause Analysis → HOD Approval → Closed
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft, ArrowRight, Check, Send, Loader2, AlertTriangle, FileText, Wrench, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { MainDBMTNService } from '@/generated/services/main-dbmtn-service';
import { useUser } from '@/hooks/use-user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';

const FORM_STEPS = [
  { id: 1, label: 'Equipment & Failure', description: 'Equipment details and failure mode' },
  { id: 2, label: 'Analysis', description: 'Root cause and impact analysis' },
  { id: 3, label: 'Actions', description: 'Corrective and preventive actions' },
  { id: 4, label: 'Review & Submit', description: 'Confirm and submit' },
];

const FAILURE_MODES = ['Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Process', 'Other'];
const IMPACT_TYPES = ['Production', 'Quality', 'Safety', 'Environmental'];

export default function FARNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    equipmentID: '',
    equipmentName: '',
    failureDate: '',
    failureMode: '',
    symptoms: '',
    rootCause: '',
    impact: '',
    impactDescription: '',
    correctiveAction: '',
    preventiveAction: '',
    downTimeHours: '',
    reportedBy: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.equipmentID && formData.failureMode;
    if (currentStep === 2) return formData.rootCause && formData.impact;
    if (currentStep === 3) return formData.correctiveAction;
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const newTicketId = `FAR-${format(now, 'yyyyMM')}-${seq}`;

      await MainDBMTNService.create({
        title: newTicketId,
        formCode: 'FAR',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: now.toISOString(),
        fAREquipmentID: formData.equipmentID,
        equipmentName: formData.equipmentName,
        fARFailureDate: formData.failureDate || undefined,
        fARFailureMode: formData.failureMode,
        fARSymptoms: formData.symptoms,
        fARRootCause: formData.rootCause,
        fARImpact: formData.impact,
        fARImpactDescription: formData.impactDescription,
        fARCorrectiveAction: formData.correctiveAction,
        fARPreventiveAction: formData.preventiveAction,
        fARDownTimeHours: formData.downTimeHours ? Number(formData.downTimeHours) : undefined,
        fARReportedBy: formData.reportedBy || user?.email,
      });

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Failure Analysis Report submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && ticketId) {
    return (
      <div className="min-h-screen bg-muted p-6">
        <div className="mx-auto max-w-[600px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white p-8 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Failure Analysis Report Submitted</h2>
            <p className="mt-2 text-sm text-gray-500">Reference: {ticketId}</p>
            <Button className="mt-6" onClick={() => navigate('/maintenance/forms')}>
              Back to Forms
            </Button>
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
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button><div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Failure Analysis Report</h1>
              <p className="text-sm text-gray-500">FAR — Equipment failure root cause analysis</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 flex items-center gap-2">
          {FORM_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium
                ${step.id < currentStep ? 'bg-green-500 text-white' :
                  step.id === currentStep ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className={`text-xs ${step.id === currentStep ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
              {i < FORM_STEPS.length - 1 && <div className="h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Equipment & Failure */}
        {currentStep === 1 && (
          <Card>
            <CardHeader><CardTitle>Equipment & Failure Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Equipment ID *</Label>
                  <Input value={formData.equipmentID} onChange={(e) => updateField('equipmentID', e.target.value)}
                    placeholder="e.g., PM-001" />
                </div>
                <div className="space-y-2">
                  <Label>Equipment Name</Label>
                  <Input value={formData.equipmentName} onChange={(e) => updateField('equipmentName', e.target.value)}
                    placeholder="e.g., Centrifugal Pump" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Failure Date</Label>
                  <Input type="date" value={formData.failureDate}
                    onChange={(e) => updateField('failureDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Failure Mode *</Label>
                  <Select value={formData.failureMode} onValueChange={(v) => updateField('failureMode', v)}>
                    <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                    <SelectContent>
                      {FAILURE_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Symptoms / Observations</Label>
                <Textarea value={formData.symptoms} onChange={(e) => updateField('symptoms', e.target.value)}
                  placeholder="Describe the observed symptoms..." rows={3} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Analysis */}
        {currentStep === 2 && (
          <Card>
            <CardHeader><CardTitle>Root Cause & Impact Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Root Cause *</Label>
                <Textarea value={formData.rootCause} onChange={(e) => updateField('rootCause', e.target.value)}
                  placeholder="Identify the root cause..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Impact *</Label>
                  <Select value={formData.impact} onValueChange={(v) => updateField('impact', v)}>
                    <SelectTrigger><SelectValue placeholder="Select impact" /></SelectTrigger>
                    <SelectContent>
                      {IMPACT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Downtime (Hours)</Label>
                  <Input type="number" value={formData.downTimeHours}
                    onChange={(e) => updateField('downTimeHours', e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Impact Description</Label>
                <Textarea value={formData.impactDescription}
                  onChange={(e) => updateField('impactDescription', e.target.value)}
                  placeholder="Describe the business impact..." rows={2} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Actions */}
        {currentStep === 3 && (
          <Card>
            <CardHeader><CardTitle>Corrective & Preventive Actions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Corrective Action *</Label>
                <Textarea value={formData.correctiveAction}
                  onChange={(e) => updateField('correctiveAction', e.target.value)}
                  placeholder="Immediate corrective actions taken..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Preventive Action</Label>
                <Textarea value={formData.preventiveAction}
                  onChange={(e) => updateField('preventiveAction', e.target.value)}
                  placeholder="Long-term preventive measures..." rows={3} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <Card>
            <CardHeader><CardTitle>Review & Submit</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Equipment:</span><span className="font-medium">{formData.equipmentID}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Failure Mode:</span><span className="font-medium">{formData.failureMode}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Root Cause:</span><span className="font-medium">{formData.rootCause}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Impact:</span><span className="font-medium">{formData.impact}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Downtime:</span><span className="font-medium">{formData.downTimeHours || 'N/A'} hrs</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Corrective Action:</span><span className="font-medium">{formData.correctiveAction ? 'Provided' : 'N/A'}</span></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={currentStep > 1 ? () => setCurrentStep((p) => p - 1) : () => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {currentStep > 1 ? 'Previous' : 'Cancel'}
          </Button>
          {currentStep < FORM_STEPS.length ? (
            <Button onClick={() => setCurrentStep((p) => p + 1)} disabled={!canProceed()}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
