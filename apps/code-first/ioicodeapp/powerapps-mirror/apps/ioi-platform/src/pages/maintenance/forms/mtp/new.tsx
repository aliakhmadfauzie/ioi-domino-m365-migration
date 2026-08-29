/**
 * MTP - Maintenance Plan (New)
 * Stub — full implementation pending
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBMTNService } from '@/generated/services/main-dbmtn-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const INTERVAL_TYPES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
const WORK_TYPES = ['Inspection', 'Lubrication', 'Replacement', 'Overhaul', 'Calibration'];

export default function MTPNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    equipmentID: '', equipmentName: '', intervalType: '', intervalValue: '',
    lastDate: '', nextDueDate: '', workType: '', taskDescription: '', assignedTo: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `MTP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBMTNService.create({
        title: id, formCode: 'MTP', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        mPEquipmentID: formData.equipmentID, mPEquipmentName: formData.equipmentName,
        mPIntervalType: formData.intervalType,
        mPIntervalValue: formData.intervalValue ? Number(formData.intervalValue) : undefined,
        mPLastDate: formData.lastDate || undefined, mPNextDueDate: formData.nextDueDate || undefined,
        mPWorkType: formData.workType, mPTaskDescription: formData.taskDescription,
        mPAssignedTo: formData.assignedTo,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Maintenance Plan submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">Maintenance Plan Submitted</h2>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Maintenance Plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Equipment ID</Label><Input value={formData.equipmentID} onChange={(e) => update('equipmentID', e.target.value)} /></div>
              <div className="space-y-2"><Label>Equipment Name</Label><Input value={formData.equipmentName} onChange={(e) => update('equipmentName', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Interval Type</Label><Select value={formData.intervalType} onValueChange={(v) => update('intervalType', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{INTERVAL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Interval Value</Label><Input type="number" value={formData.intervalValue} onChange={(e) => update('intervalValue', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Work Type</Label><Select value={formData.workType} onValueChange={(v) => update('workType', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{WORK_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Assigned To</Label><Input value={formData.assignedTo} onChange={(e) => update('assignedTo', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Last Maintenance</Label><Input type="date" value={formData.lastDate} onChange={(e) => update('lastDate', e.target.value)} /></div>
              <div className="space-y-2"><Label>Next Due Date</Label><Input type="date" value={formData.nextDueDate} onChange={(e) => update('nextDueDate', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Task Description</Label><Textarea value={formData.taskDescription} onChange={(e) => update('taskDescription', e.target.value)} rows={3} /></div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
