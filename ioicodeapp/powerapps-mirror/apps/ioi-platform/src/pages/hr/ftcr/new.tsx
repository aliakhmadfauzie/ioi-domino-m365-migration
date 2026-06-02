/** FTCR — New Fixed Term Contract Request Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MainDBHRService } from '@/services/main-dbhr-service';

export default function FTCRNewPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState('');        // → employeename
  const [empId, setEmpId] = useState('');            // → employeeid (IC/Passport)
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');      // → jobdesignation
  const [contractFrom, setContractFrom] = useState('');  // → effectivedate
  const [contractTo, setContractTo] = useState('');      // → duedate
  const [rate, setRate] = useState('');              // → remarks
  const [renewal, setRenewal] = useState('');        // → details
  const [reason, setReason] = useState('');          // → description

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !empName.trim()) { toast.error('Employee name is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `FTCR-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'FTCR',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: empName,
        employeeid: empId,
        department,
        jobdesignation: position,
        effectivedate: contractFrom,
        duedate: contractTo,
        remarks: rate ? `Rate: RM${rate}` : '',
        details: renewal ? `Renewal: ${renewal}` : '',
        description: reason,
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Submitted');
      navigate('/hr/ftcr');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Fixed Term Contracts', href: '/hr/ftcr' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/ftcr')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Fixed Term Contract Request</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Contract Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee Name <span className="text-destructive">*</span></Label><Input value={empName} onChange={e => setEmpName(e.target.value)} placeholder="Full name" /></div>
            <div className="space-y-2"><Label>IC / Passport No.</Label><Input value={empId} onChange={e => setEmpId(e.target.value)} placeholder="e.g. 900101-14-1234" /></div>
            <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" /></div>
            <div className="space-y-2"><Label>Position</Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Job title" /></div>
            <div className="space-y-2"><Label>Contract From</Label><Input type="date" value={contractFrom} onChange={e => setContractFrom(e.target.value)} /></div>
            <div className="space-y-2"><Label>Contract To</Label><Input type="date" value={contractTo} onChange={e => setContractTo(e.target.value)} /></div>
            <div className="space-y-2"><Label>Monthly Rate (RM)</Label><Input value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 2500" /></div>
            <div className="space-y-2"><Label>Renewal</Label>
              <Select value={renewal} onValueChange={setRenewal}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2"><Label>Reason / Justification</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Why is this contract needed?" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/ftcr')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
