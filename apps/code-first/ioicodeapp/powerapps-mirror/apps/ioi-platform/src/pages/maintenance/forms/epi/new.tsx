/**
 * EPI - Equipment Pre-Inspection (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBMTNService } from '@/generated/services/main-dbmtn-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const INSP_RESULTS = ['Pass', 'Conditional Pass', 'Fail'];

export default function EPINewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    equipmentID: '', equipmentName: '', inspectionDate: '', inspector: '',
    result: '', comment: '', nextInspectionDate: '', approvedBy: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `EPI-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBMTNService.create({
        title: id, formCode: 'EPI', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        ePIEquipmentID: formData.equipmentID, ePIEquipmentName: formData.equipmentName,
        ePIInspectionDate: formData.inspectionDate || undefined,
        ePIInspector: formData.inspector || user?.fullName || user?.userPrincipalName || '',
        ePIResult: formData.result, ePIComment: formData.comment,
        ePINextInspectionDate: formData.nextInspectionDate || undefined,
        ePIApprovedBy: formData.approvedBy,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Pre-Inspection report submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">Pre-Inspection Submitted</h2>
          <p className="text-sm text-gray-500 mt-1">Ref: {ticketId}</p>
          <Button className="mt-4" onClick={() => navigate('/maintenance/forms')}>Back to Forms</Button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[800px]">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-sm text-gray-500">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </button>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Equipment Pre-Inspection</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Equipment ID</Label><Input value={formData.equipmentID} onChange={(e) => update('equipmentID', e.target.value)} /></div>
              <div className="space-y-2"><Label>Equipment Name</Label><Input value={formData.equipmentName} onChange={(e) => update('equipmentName', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Inspection Date</Label><Input type="date" value={formData.inspectionDate} onChange={(e) => update('inspectionDate', e.target.value)} /></div>
              <div className="space-y-2"><Label>Inspector</Label><Input value={formData.inspector} onChange={(e) => update('inspector', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Result</Label><Select value={formData.result} onValueChange={(v) => update('result', v)}><SelectTrigger><SelectValue placeholder="Select result" /></SelectTrigger><SelectContent>{INSP_RESULTS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Comment</Label><Textarea value={formData.comment} onChange={(e) => update('comment', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Next Inspection Date</Label><Input type="date" value={formData.nextInspectionDate} onChange={(e) => update('nextInspectionDate', e.target.value)} /></div>
              <div className="space-y-2"><Label>Approved By</Label><Input value={formData.approvedBy} onChange={(e) => update('approvedBy', e.target.value)} /></div>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
