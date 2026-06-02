/** GDSN — New General Data Subject Notification Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Lock } from 'lucide-react';
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

const NOTIFICATION_TYPES = ['New Employee Onboarding', 'Data Update Consent', 'Third Party Disclosure', 'Data Retention Notice', 'CCTV Monitoring', 'Other'];

export default function GDSNNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState('');          // → employeename
  const [notifType, setNotifType] = useState('');      // → details
  const [notifDate, setNotifDate] = useState(format(new Date(), 'yyyy-MM-dd')); // → effectivedate
  const [purpose, setPurpose] = useState('');          // → description
  const [dataCollected, setDataCollected] = useState(''); // → remarks
  const [retentionPeriod, setRetentionPeriod] = useState(''); // → duedate label via remarks

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !empName.trim()) { toast.error('Employee name is required'); return; }
    if (action === 'submit' && !notifType) { toast.error('Notification type is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `GDSN-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'GDSN',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: empName,
        details: notifType,
        effectivedate: notifDate,
        description: purpose,
        remarks: `Data: ${dataCollected}${retentionPeriod ? ` | Retention: ${retentionPeriod}` : ''}`,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Notification submitted');
      navigate('/hr/gdsn');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Data Notifications', href: '/hr/gdsn' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/gdsn')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Data Subject Notification</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lock className="h-5 w-5" />Notification Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>Notification Type <span className="text-destructive">*</span></Label>
              <Select value={notifType} onValueChange={setNotifType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{NOTIFICATION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={notifDate} onChange={e => setNotifDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Retention Period</Label><Input value={retentionPeriod} onChange={e => setRetentionPeriod(e.target.value)} placeholder="e.g. 7 years" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Purpose of Data Collection</Label><Textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={2} placeholder="Why is this data being collected/processed?" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Data Collected</Label><Textarea value={dataCollected} onChange={e => setDataCollected(e.target.value)} rows={3} placeholder="List the types of personal data being collected..." /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/gdsn')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
