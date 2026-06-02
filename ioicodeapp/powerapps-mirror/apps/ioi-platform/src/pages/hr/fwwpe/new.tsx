/** FWWPE — New Flexible Work Arrangement Form (uses FWWPD prefixed columns) */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Settings } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const FWA_TYPES = ['Flexi Hours', 'Compressed Work Week', 'Remote Working', 'Part-Time', 'Job Sharing', 'Staggered Hours'];

export default function FWWPENewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || '');  // → fwwpdname
  const [empNo, setEmpNo] = useState('');                         // → fwwpdempno
  const [department, setDepartment] = useState('');               // → fwwpddepartment
  const [company, setCompany] = useState('');                     // → fwwpdcompany
  const [fwaType, setFwaType] = useState('');                     // → details
  const [startDate, setStartDate] = useState('');                 // → effectivedate
  const [endDate, setEndDate] = useState('');                     // → duedate
  const [reason, setReason] = useState('');                       // → fwwpdreason
  const [remark, setRemark] = useState('');                       // → fwwpdremark

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !fwaType) { toast.error('FWA type is required'); return; }
    if (action === 'submit' && !startDate) { toast.error('Start date is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `FWWPE-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'FWWPE',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        fwwpdname: empName,
        fwwpdempno: empNo,
        fwwpddepartment: department,
        fwwpdcompany: company,
        details: fwaType,
        effectivedate: startDate,
        duedate: endDate,
        fwwpdreason: reason,
        fwwpdremark: remark,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'FWA request submitted');
      navigate('/hr/fwwpe');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Flexible Work', href: '/hr/fwwpe' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/fwwpe')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Flexible Work Arrangement</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Settings className="h-5 w-5" />Arrangement Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee Name <span className="text-destructive">*</span></Label><Input value={empName} onChange={e => setEmpName(e.target.value)} placeholder="Full name" /></div>
            <div className="space-y-2"><Label>Employee No.</Label><Input value={empNo} onChange={e => setEmpNo(e.target.value)} placeholder="e.g. EMP-001" /></div>
            <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" /></div>
            <div className="space-y-2"><Label>Company</Label><Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" /></div>
            <div className="space-y-2"><Label>FWA Type <span className="text-destructive">*</span></Label>
              <Select value={fwaType} onValueChange={setFwaType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{FWA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Start Date <span className="text-destructive">*</span></Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Reason for the arrangement" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Remarks</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="Additional remarks" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/fwwpe')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
