/** MCL — New Medical Claim Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Activity } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

export default function MCLNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || ''); // → employeename
  const [receiptDate, setReceiptDate] = useState('');  // → effectivedate
  const [amount, setAmount] = useState('');            // → remarks
  const [clinic, setClinic] = useState('');            // → details
  const [panelType, setPanelType] = useState('Panel'); // included in details
  const [diagnosis, setDiagnosis] = useState('');      // → description

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !receiptDate) { toast.error('Receipt date is required'); return; }
    if (action === 'submit' && !amount) { toast.error('Amount is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `MCL-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'MCL',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        requesttypeKey: 'RequesttypeKey5',  // Medical
        employeename: empName,
        effectivedate: receiptDate,
        remarks: `RM ${amount}`,
        details: `${clinic} (${panelType})`,
        description: diagnosis,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Claim submitted');
      navigate('/hr/mcl');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Medical Claims', href: '/hr/mcl' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/mcl')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Medical Claim</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Activity className="h-5 w-5" />Claim Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>Receipt Date <span className="text-destructive">*</span></Label><Input type="date" value={receiptDate} onChange={e => setReceiptDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Amount (RM) <span className="text-destructive">*</span></Label><Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 120.50" /></div>
            <div className="space-y-2"><Label>Clinic / Hospital</Label><Input value={clinic} onChange={e => setClinic(e.target.value)} placeholder="Clinic name" /></div>
            <div className="space-y-2"><Label>Panel / Non-Panel</Label>
              <Select value={panelType} onValueChange={setPanelType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Panel">Panel</SelectItem><SelectItem value="Non-Panel">Non-Panel</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2"><Label>Diagnosis / Description</Label><Textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} placeholder="Medical condition or diagnosis" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/mcl')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit Claim</Button>
      </div>
    </motion.div>
  );
}
