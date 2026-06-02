/**
 * SHUNTING - Shunting Truck Service Record (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Truck, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SERVICE_TYPES = ['Routine', 'Major', 'Emergency Repair'];

export default function SHUNTINGNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    truckNo: '', serviceDate: '', serviceType: '', odometer: '',
    serviceDetails: '', partsReplaced: '', nextServiceDate: '', serviceBy: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `ST-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBLOGService.create({
        title: id, formCode: 'SHUNTING', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        stTruckNo: formData.truckNo, stServiceDate: formData.serviceDate || undefined,
        stServiceType: formData.serviceType,
        stOdometerReading: Number(formData.odometer) || undefined,
        stServiceDetails: formData.serviceDetails, stPartsReplaced: formData.partsReplaced,
        stNextServiceDate: formData.nextServiceDate || undefined,
        stServiceBy: formData.serviceBy,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Service record submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">Service Record Submitted</h2>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5" /> Shunting Truck Service Record</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Truck No</Label><Input value={formData.truckNo} onChange={(e) => update('truckNo', e.target.value)} /></div>
              <div className="space-y-2"><Label>Service Date</Label><Input type="date" value={formData.serviceDate} onChange={(e) => update('serviceDate', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Service Type</Label><Select value={formData.serviceType} onValueChange={(v) => update('serviceType', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{SERVICE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Odometer (km)</Label><Input type="number" value={formData.odometer} onChange={(e) => update('odometer', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Service Details</Label><Textarea value={formData.serviceDetails} onChange={(e) => update('serviceDetails', e.target.value)} rows={2} /></div>
            <div className="space-y-2"><Label>Parts Replaced</Label><Textarea value={formData.partsReplaced} onChange={(e) => update('partsReplaced', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Next Service Date</Label><Input type="date" value={formData.nextServiceDate} onChange={(e) => update('nextServiceDate', e.target.value)} /></div>
              <div className="space-y-2"><Label>Service By</Label><Input value={formData.serviceBy} onChange={(e) => update('serviceBy', e.target.value)} /></div>
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
