/**
 * WCC - Weekly Counter Check (New)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ClipboardCheck, CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WCCNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tankerNo: '', weekEnding: '', productType: '',
    openingBalance: '', receipt: '', delivery: '', closingBalance: '',
    checkedBy: '', verifiedBy: '',
  });
  const update = (f: string, v: string) => setFormData((p) => ({ ...p, [f]: v }));

  const variance = Number(formData.openingBalance) + Number(formData.receipt)
    - Number(formData.delivery) - Number(formData.closingBalance);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const id = `WCC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${seq}`;
      await MainDBLOGService.create({
        title: id, formCode: 'WCC', currentStatus: 'Submitted',
        submittedBy: user?.email || '', submittedDate: now.toISOString(),
        wccTankerNo: formData.tankerNo, wccWeekEnding: formData.weekEnding || undefined,
        wccProductType: formData.productType,
        wccOpeningBalance: Number(formData.openingBalance) || undefined,
        wccReceipt: Number(formData.receipt) || undefined,
        wccDelivery: Number(formData.delivery) || undefined,
        wccClosingBalance: Number(formData.closingBalance) || undefined,
        wccVariance: variance || undefined,
        wccCheckedBy: formData.checkedBy || user?.fullName || user?.userPrincipalName || '',
        wccVerifiedBy: formData.verifiedBy,
      });
      setTicketId(id); setIsSubmitted(true);
      toast.success('Weekly Counter Check submitted!');
    } catch (e) { toast.error('Submit failed.'); console.error(e); }
    finally { setIsSubmitting(false); }
  };

  if (isSubmitted && ticketId) return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[600px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold">Weekly Counter Check Submitted</h2>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" /> Weekly Counter Check</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tanker No</Label><Input value={formData.tankerNo} onChange={(e) => update('tankerNo', e.target.value)} /></div>
              <div className="space-y-2"><Label>Week Ending</Label><Input type="date" value={formData.weekEnding} onChange={(e) => update('weekEnding', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Product Type</Label><Input value={formData.productType} onChange={(e) => update('productType', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Opening Balance (MT)</Label><Input type="number" value={formData.openingBalance} onChange={(e) => update('openingBalance', e.target.value)} /></div>
              <div className="space-y-2"><Label>Receipt (MT)</Label><Input type="number" value={formData.receipt} onChange={(e) => update('receipt', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Delivery (MT)</Label><Input type="number" value={formData.delivery} onChange={(e) => update('delivery', e.target.value)} /></div>
              <div className="space-y-2"><Label>Closing Balance (MT)</Label><Input type="number" value={formData.closingBalance} onChange={(e) => update('closingBalance', e.target.value)} /></div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <span className="text-gray-500">Calculated Variance:</span>
              <span className={`ml-2 font-bold ${Math.abs(variance) > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                {variance.toFixed(2)} MT
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Checked By</Label><Input value={formData.checkedBy} onChange={(e) => update('checkedBy', e.target.value)} /></div>
              <div className="space-y-2"><Label>Verified By</Label><Input value={formData.verifiedBy} onChange={(e) => update('verifiedBy', e.target.value)} /></div>
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
