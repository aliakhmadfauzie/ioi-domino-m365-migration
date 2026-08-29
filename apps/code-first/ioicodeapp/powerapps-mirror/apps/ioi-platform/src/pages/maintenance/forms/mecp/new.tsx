/**
 * MECP - MTN Emergency Change Procedure (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Flame, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBMTNService } from '@/generated/services/main-dbmtn-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

export default function MECPNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    equipmentID: '', changeDescription: '', reason: '', riskAssessment: '', authorizedBy: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `MECP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBMTNService.create({
        title: id, formCode: 'MECP', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        mECEquipmentID: formData.equipmentID, mECChangeDescription: formData.changeDescription,
        mECReason: formData.reason, mECRiskAssessment: formData.riskAssessment,
        mECAuthorizedBy: formData.authorizedBy,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Emergency Change submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">Emergency Change Submitted</h2>
          <p className="text-sm text-gray-500 mt-1">Ref: {ticketId}</p>
          <Button className="mt-4" onClick={() => navigate('/maintenance/forms')}>Back to Forms</Button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[800px]">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-red-500" /> MTN Emergency Change Procedure</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Affected Equipment</Label><Input value={formData.equipmentID} onChange={(e) => update('equipmentID', e.target.value)} /></div>
            <div className="space-y-2"><Label>Change Description</Label><Textarea value={formData.changeDescription} onChange={(e) => update('changeDescription', e.target.value)} rows={3} /></div>
            <div className="space-y-2"><Label>Emergency Reason</Label><Textarea value={formData.reason} onChange={(e) => update('reason', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Risk Assessment</Label><Select value={formData.riskAssessment} onValueChange={(v) => update('riskAssessment', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{RISK_LEVELS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Authorized By</Label><Input value={formData.authorizedBy} onChange={(e) => update('authorizedBy', e.target.value)} /></div>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit Emergency Change
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
