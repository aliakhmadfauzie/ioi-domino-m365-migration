/** EPDU — New Employee Personal Data Update Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, UserCheck } from 'lucide-react';
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

const UPDATE_TYPES = ['Name', 'IC / Passport Number', 'Address', 'Phone Number', 'Bank Account', 'Emergency Contact', 'Marital Status', 'Dependants', 'Qualification', 'Other'];

export default function EPDUNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || ''); // → employeename
  const [updateType, setUpdateType] = useState('');  // → details
  const [currentValue, setCurrentValue] = useState(''); // → remarks prefix
  const [newValue, setNewValue] = useState('');      // → description prefix
  const [reason, setReason] = useState('');          // → description

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !updateType) { toast.error('Update type is required'); return; }
    if (action === 'submit' && !newValue.trim()) { toast.error('New value is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `EPDU-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'EPDU',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        requesttypeKey: 'RequesttypeKey1',  // Personal Update
        employeename: empName,
        details: updateType,
        remarks: currentValue ? `Current: ${currentValue}` : '',
        description: `New value: ${newValue}${reason ? ` | Reason: ${reason}` : ''}`,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Update request submitted');
      navigate('/hr/epdu');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Employee Data Updates', href: '/hr/epdu' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/epdu')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Employee Data Update</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="h-5 w-5" />Update Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>Update Type <span className="text-destructive">*</span></Label>
              <Select value={updateType} onValueChange={setUpdateType}>
                <SelectTrigger><SelectValue placeholder="What to update?" /></SelectTrigger>
                <SelectContent>{UPDATE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Current Value</Label><Input value={currentValue} onChange={e => setCurrentValue(e.target.value)} placeholder="Existing information" /></div>
            <div className="space-y-2"><Label>New Value <span className="text-destructive">*</span></Label><Input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Updated information" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Reason</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Reason for update" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/epdu')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
