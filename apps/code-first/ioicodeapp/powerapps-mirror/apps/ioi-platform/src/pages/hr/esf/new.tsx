/** ESF — New Employee Separation Form (uses ESF-prefixed + exit columns in MainDBHR) */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, UserX } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';
import type { MainDBHRExitCategoryKey, MainDBHRExitTypeKey } from '@/generated/models/main-dbhr-model';

export default function ESFNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState('');           // → employeename
  const [empId, setEmpId] = useState('');               // → employeeid (IC)
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');         // → jobdesignation
  const [lastDay, setLastDay] = useState('');           // → lastWorkingDay
  const [exitCategory, setExitCategory] = useState<MainDBHRExitCategoryKey>('ExitCategoryKey0');
  const [exitType, setExitType] = useState<MainDBHRExitTypeKey>('ExitTypeKey0');
  const [reason, setReason] = useState('');             // → reasonForLeaving
  const [noticePeriod, setNoticePeriod] = useState(''); // → details

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !empName.trim()) { toast.error('Employee name is required'); return; }
    if (action === 'submit' && !lastDay) { toast.error('Last working day is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `ESF-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'ESF',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: empName,
        employeeid: empId,
        department,
        jobdesignation: position,
        lastWorkingDay: lastDay,
        exitCategoryKey: exitCategory,
        exitTypeKey: exitType,
        reasonForLeaving: reason,
        details: noticePeriod ? `Notice: ${noticePeriod}` : '',
        esfcategory: exitCategory,
        esfdatesubmitted: new Date().toISOString(),
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Separation form submitted');
      navigate('/hr/esf');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Separation Forms', href: '/hr/esf' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/esf')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Employee Separation Form</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><UserX className="h-5 w-5" />Separation Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>IC / Staff No.</Label><Input value={empId} onChange={e => setEmpId(e.target.value)} placeholder="IC number" /></div>
            <div className="space-y-2"><Label>Department</Label><SharePointLookupSelect kind="department" value={department} onChange={setDepartment} placeholder="Select department" /></div>
            <div className="space-y-2"><Label>Position</Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Job title" /></div>
            <div className="space-y-2"><Label>Last Working Day <span className="text-destructive">*</span></Label><Input type="date" value={lastDay} onChange={e => setLastDay(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Exit Category</Label>
              <Select value={exitCategory} onValueChange={v => setExitCategory(v as MainDBHRExitCategoryKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ExitCategoryKey0">Resignation</SelectItem>
                  <SelectItem value="ExitCategoryKey1">Retirement</SelectItem>
                  <SelectItem value="ExitCategoryKey2">Termination</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exit Type</Label>
              <Select value={exitType} onValueChange={v => setExitType(v as MainDBHRExitTypeKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ExitTypeKey0">Voluntary</SelectItem>
                  <SelectItem value="ExitTypeKey1">Involuntary</SelectItem>
                  <SelectItem value="ExitTypeKey2">Mutual Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notice Period</Label><Input value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)} placeholder="e.g. 1 month" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Reason for Leaving</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Reason for separation" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/esf')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
