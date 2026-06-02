/**
 * GRN - Goods Receipt Note (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Package, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBWHService } from '@/generated/services/main-dbwh-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GRNNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplier: '', poNo: '', itemDesc: '', quantity: '', unit: '', location: '', remarks: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `GRN-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-${seq}`;
      await MainDBWHService.create({
        title: id, formCode: 'GRN', department: 'Warehouse',
        submittedBy: user?.email || '', submittedOn: now.toISOString(),
        requestTitle: `Goods Receipt - ${formData.supplier || formData.poNo}`,
        containerID: formData.poNo, location: formData.location,
        quantity: Number(formData.quantity) || undefined, unit: formData.unit,
        remarks: formData.remarks,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Goods Receipt Note submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-foreground">Goods Receipt Submitted</h2>
          <p className="text-sm text-muted-foreground mt-1">Ref: {ticketId}</p>
          <Button className="mt-4" onClick={() => navigate('/warehouse/forms')}>Back to Forms</Button>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Goods Receipt Note</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Supplier</Label><Input value={formData.supplier} onChange={(e) => update('supplier', e.target.value)} /></div>
              <div className="space-y-2"><Label>PO No</Label><Input value={formData.poNo} onChange={(e) => update('poNo', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Item Description</Label><Textarea value={formData.itemDesc} onChange={(e) => update('itemDesc', e.target.value)} rows={2} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={formData.quantity} onChange={(e) => update('quantity', e.target.value)} /></div>
              <div className="space-y-2"><Label>Unit</Label><Input value={formData.unit} onChange={(e) => update('unit', e.target.value)} /></div>
              <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={(e) => update('location', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Remarks</Label><Textarea value={formData.remarks} onChange={(e) => update('remarks', e.target.value)} rows={2} /></div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
