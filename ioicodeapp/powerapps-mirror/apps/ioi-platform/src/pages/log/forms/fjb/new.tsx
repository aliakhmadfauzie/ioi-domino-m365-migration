/**
 * FJB - FJB Storage Tank Cleanliness Inspection (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Droplets, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GRADES = ['A', 'B', 'C', 'Reject'];

export default function FJBNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tankNo: '', inspectionDate: '', product: '', grade: '', nextInspection: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `FJB-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBLOGService.create({
        title: id, formCode: 'FJB', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        fjbTankNo: formData.tankNo, fjbInspectionDate: formData.inspectionDate || undefined,
        fjbProduct: formData.product, fjbCleanlinessGrade: formData.grade,
        fjbNextInspection: formData.nextInspection || undefined,
        fjbInspector: user?.fullName || user?.userPrincipalName || '',
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('FJB Inspection submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">FJB Inspection Submitted</h2>
          <p className="text-sm text-gray-500 mt-1">Ref: {ticketId}</p>
          <Button className="mt-4" onClick={() => navigate('/log/forms')}>Back to Forms</Button>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5" /> FJB Storage Tank Cleanliness Inspection</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tank No</Label><Input value={formData.tankNo} onChange={(e) => update('tankNo', e.target.value)} /></div>
              <div className="space-y-2"><Label>Inspection Date</Label><Input type="date" value={formData.inspectionDate} onChange={(e) => update('inspectionDate', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Product</Label><Input value={formData.product} onChange={(e) => update('product', e.target.value)} /></div>
              <div className="space-y-2"><Label>Cleanliness Grade</Label><Select value={formData.grade} onValueChange={(v) => update('grade', v)}><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Next Inspection Date</Label><Input type="date" value={formData.nextInspection} onChange={(e) => update('nextInspection', e.target.value)} /></div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
