/** OWP — New Overtime / Work Pass Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send } from 'lucide-react';
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

const OT_TYPES = ['Normal Overtime', 'Rest Day Work', 'Public Holiday Work', 'Shift Replacement'];

export default function OWPNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || ''); // → employeename
  const [otDate, setOtDate] = useState('');    // → effectivedate
  const [otType, setOtType] = useState('');    // → details
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hours, setHours] = useState('');
  const [workDesc, setWorkDesc] = useState(''); // → description
  const [reason, setReason] = useState('');

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !otDate) { toast.error('Date is required'); return; }
    if (action === 'submit' && !otType) { toast.error('OT type is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `OWP-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'OWP',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: empName,
        effectivedate: otDate,
        details: [
          otType,
          hours ? `${hours} hrs` : null,
          startTime || endTime ? `${startTime}-${endTime}` : null,
        ].filter(Boolean).join(' | '),
        description: workDesc || reason,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'OT request submitted');
      navigate('/hr/owp');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Overtime / Work Pass', href: '/hr/owp' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/owp')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Overtime / Work Pass Request</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5" />OT Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>OT Type <span className="text-destructive">*</span></Label>
              <Select value={otType} onValueChange={setOtType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{OT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date <span className="text-destructive">*</span></Label><Input type="date" value={otDate} onChange={e => setOtDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Total Hours</Label><Input value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 4" /></div>
            <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
            <div className="space-y-2"><Label>End Time</Label><Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Work Description / Reason</Label><Textarea value={workDesc} onChange={e => setWorkDesc(e.target.value)} rows={3} placeholder="Describe work performed and reason for overtime" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/owp')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
