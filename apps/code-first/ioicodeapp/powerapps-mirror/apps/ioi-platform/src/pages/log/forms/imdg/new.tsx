/**
 * IMDG - IMDG Inspection Checklist (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, HardHat, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DG_CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9'];

export default function IMDGNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    vehicleNo: '', driverName: '', product: '', unNo: '', dgClass: '',
    placards: false, documentation: false,
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `IMDG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBLOGService.create({
        title: id, formCode: 'IMDG', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        imdgVehicleNo: formData.vehicleNo, imdgDriverName: formData.driverName,
        imdgProduct: formData.product, imdgUNNo: formData.unNo,
        imdgClass: formData.dgClass, imdgPlacards: formData.placards,
        imdgDocumentation: formData.documentation, imdgDate: now.toISOString(),
        imdgInspector: user?.fullName || user?.userPrincipalName || '',
        imdgResult: (formData.placards && formData.documentation) ? 'Compliant' : 'Non-Compliant',
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('IMDG Inspection submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">IMDG Inspection Submitted</h2>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><HardHat className="h-5 w-5" /> IMDG Inspection Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Vehicle No</Label><Input value={formData.vehicleNo} onChange={(e) => update('vehicleNo', e.target.value)} /></div>
              <div className="space-y-2"><Label>Driver Name</Label><Input value={formData.driverName} onChange={(e) => update('driverName', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>DG Product</Label><Input value={formData.product} onChange={(e) => update('product', e.target.value)} /></div>
              <div className="space-y-2"><Label>UN No</Label><Input value={formData.unNo} onChange={(e) => update('unNo', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>DG Class</Label><Select value={formData.dgClass} onValueChange={(v) => update('dgClass', v)}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{DG_CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.placards} onChange={(e) => update('placards', e.target.checked ? 'true' : 'false')} className="h-4 w-4" /> Placards Displayed</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.documentation} onChange={(e) => update('documentation', e.target.checked ? 'true' : 'false')} className="h-4 w-4" /> Docs Complete</label>
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
