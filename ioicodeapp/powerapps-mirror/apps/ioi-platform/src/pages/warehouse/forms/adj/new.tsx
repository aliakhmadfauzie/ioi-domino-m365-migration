/**
 * ADJ - Stock Adjustment (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ClipboardList, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBWHService } from '@/generated/services/main-dbwh-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ADJ_TYPES = ['Write-off', 'Transfer-in', 'Transfer-out', 'Correction', 'Cycle Count Variance'];

export default function ADJNewFormPage() {
  const navigate = useNavigate(); const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ adjType: '', item: '', location: '', qty: '', unit: '', reason: '' });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date(); const seq = String(Math.floor(Math.random()*9000)+1000);
      const id = `ADJ-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-${seq}`;
      await MainDBWHService.create({
        title: id, formCode: 'ADJ', department: 'Warehouse',
        submittedBy: user?.email || '', submittedOn: now.toISOString(),
        requestTitle: `Stock Adjustment: ${formData.adjType} - ${formData.item}`,
        description: formData.reason,
        currentAction: 'Submitted',
        location: formData.location, quantity: Number(formData.qty) || undefined,
        unit: formData.unit,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Stock Adjustment submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6"><div className="mx-auto max-w-[600px]"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card p-8 shadow text-center"><CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" /><h2 className="text-xl font-bold text-foreground">Stock Adjustment Submitted</h2><p className="text-sm text-muted-foreground mt-1">Ref: {ticketId}</p><Button className="mt-4" onClick={() => navigate('/warehouse/forms')}>Back to Forms</Button></motion.div></div></div>
  );

  return (
    <div className="min-h-screen bg-muted p-6"><div className="mx-auto max-w-[800px]">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Stock Adjustment</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Adjustment Type</Label>
          <Select value={formData.adjType} onValueChange={(v) => update('adjType', v)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>{ADJ_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Item/Material</Label><Input value={formData.item} onChange={(e) => update('item', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={(e) => update('location', e.target.value)} /></div>
          <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={formData.qty} onChange={(e) => update('qty', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Unit</Label><Input value={formData.unit} onChange={(e) => update('unit', e.target.value)} /></div>
          <div className="space-y-2"><Label>&nbsp;</Label></div>
        </div>
        <div className="space-y-2"><Label>Reason</Label><Textarea value={formData.reason} onChange={(e) => update('reason', e.target.value)} rows={2} /></div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </CardContent></Card>
    </div></div>
  );
}
