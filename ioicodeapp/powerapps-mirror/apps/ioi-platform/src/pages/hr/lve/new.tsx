/** LVE — New Leave Application Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Calendar } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { toast } from 'sonner';
import { format, differenceInCalendarDays } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const LEAVE_TYPES = ['Annual Leave', 'Medical Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave', 'Replacement Leave', 'Study Leave', 'Other'];

export default function LVENewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || ''); // → employeename
  const [leaveType, setLeaveType] = useState('');  // → details
  const [fromDate, setFromDate] = useState('');    // → effectivedate
  const [toDate, setToDate] = useState('');        // → duedate
  const [relief, setRelief] = useState('');        // → backupPIC
  const [reason, setReason] = useState('');        // → description

  const totalDays = fromDate && toDate
    ? Math.max(1, differenceInCalendarDays(new Date(toDate), new Date(fromDate)) + 1)
    : 0;

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !leaveType) { toast.error('Select a leave type'); return; }
    if (action === 'submit' && !fromDate) { toast.error('From date is required'); return; }
    if (action === 'submit' && !toDate) { toast.error('To date is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `LVE-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'LVE',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        requesttypeKey: 'RequesttypeKey0',  // Leave Request
        employeename: empName,
        details: `${leaveType}${totalDays ? ` | ${totalDays} day(s)` : ''}`,
        effectivedate: fromDate,
        duedate: toDate,
        backupPIC: relief,
        description: reason,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Leave application submitted');
      navigate('/hr/lve');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Leave Applications', href: '/hr/lve' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/lve')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Leave Application</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5" />Leave Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee Name <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>Leave Type <span className="text-destructive">*</span></Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger>
                <SelectContent>{LEAVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>From Date <span className="text-destructive">*</span></Label><Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>To Date <span className="text-destructive">*</span></Label><Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
            {totalDays > 0 && (
              <div className="md:col-span-2 rounded-md bg-primary/5 border border-primary/20 px-4 py-3 text-sm font-medium">
                Total: <span className="text-primary font-bold">{totalDays} day(s)</span>
              </div>
            )}
            <div className="space-y-2"><Label>Relief Staff</Label><EmployeePicker value={relief} onChange={(_, emp) => setRelief(emp?.fullName || relief)} placeholder="Who will cover?" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Reason for leave (optional)" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/lve')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Apply Leave</Button>
      </div>
    </motion.div>
  );
}
