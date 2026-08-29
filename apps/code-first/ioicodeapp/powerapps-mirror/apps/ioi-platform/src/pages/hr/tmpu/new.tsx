/** TMPU — New Training & Development Request Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, GraduationCap } from 'lucide-react';
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

const TRAINING_TYPES = ['Internal', 'External', 'Online / E-Learning', 'Conference', 'Seminar', 'Certification'];

export default function TMPUNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || ''); // → employeename
  const [programme, setProgramme] = useState('');  // → vacancyTitle
  const [provider, setProvider] = useState('');    // → company
  const [trainingType, setTrainingType] = useState(''); // → details prefix
  const [trainingDate, setTrainingDate] = useState(''); // → effectivedate
  const [duration, setDuration] = useState('');    // included in details
  const [cost, setCost] = useState('');
  const [objective, setObjective] = useState('');  // → description

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !programme.trim()) { toast.error('Programme name is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `TMPU-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'TMPU',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        requesttypeKey: 'RequesttypeKey2',  // Training
        employeename: empName,
        vacancyTitle: programme,
        company: provider,
        details: [trainingType, duration, cost ? `Estimated Cost: RM ${cost}` : null].filter(Boolean).join(' | '),
        effectivedate: trainingDate,
        description: objective,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Training request submitted');
      navigate('/hr/tmpu');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Training & Development', href: '/hr/tmpu' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/tmpu')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Training Request</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5" />Training Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee <span className="text-destructive">*</span></Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>Training Type</Label>
              <Select value={trainingType} onValueChange={setTrainingType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{TRAINING_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Programme Name <span className="text-destructive">*</span></Label><Input value={programme} onChange={e => setProgramme(e.target.value)} placeholder="e.g. Advanced Excel for Finance" /></div>
            <div className="space-y-2"><Label>Provider / Organiser</Label><Input value={provider} onChange={e => setProvider(e.target.value)} placeholder="Training provider name" /></div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={trainingDate} onChange={e => setTrainingDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Duration</Label><Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 2 days" /></div>
            <div className="space-y-2"><Label>Estimated Cost (RM)</Label><Input value={cost} onChange={e => setCost(e.target.value)} placeholder="e.g. 500" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Learning Objectives</Label><Textarea value={objective} onChange={e => setObjective(e.target.value)} rows={3} placeholder="What skills or knowledge will be gained?" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/tmpu')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
