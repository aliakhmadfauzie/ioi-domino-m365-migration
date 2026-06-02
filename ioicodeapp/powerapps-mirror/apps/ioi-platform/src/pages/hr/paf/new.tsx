/** PAF — New Performance Appraisal Form (HRAppraisalRecords table) */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Award } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { useCreateHRAppraisalRecords } from '@/generated/hooks/use-hrappraisal-records';

const RATINGS = ['5 - Exceptional', '4 - Exceeds Expectations', '3 - Meets Expectations', '2 - Needs Improvement', '1 - Unsatisfactory'];
const PERIODS = ['Jan – Jun', 'Jul – Dec', 'Full Year'];

export default function PAFNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMutation = useCreateHRAppraisalRecords();
  const [employeeNo, setEmployeeNo] = useState('');
  const [cycleYear, setCycleYear] = useState(String(new Date().getFullYear()));
  const [period, setPeriod] = useState('Full Year');
  const [rating, setRating] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState(user?.userPrincipalName || '');

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !employeeNo.trim()) { toast.error('Employee number is required'); return; }
    try {
      const appraisalNo = `PAF-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      await createMutation.mutateAsync({
        title: appraisalNo,
        appraisalNo,
        cycleYear: `${cycleYear} ${period}`,
        employeeNo,
        rating: action === 'draft' ? '' : rating,
        reviewerEmail,
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
      });
      toast.success(action === 'draft' ? 'Draft saved' : 'Appraisal submitted');
      navigate('/hr/paf');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Performance Appraisals', href: '/hr/paf' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/paf')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Performance Appraisal</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Award className="h-5 w-5" />Appraisal Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee No. <span className="text-destructive">*</span></Label><Input value={employeeNo} onChange={e => setEmployeeNo(e.target.value)} placeholder="e.g. EMP-001" /></div>
            <div className="space-y-2"><Label>Reviewer Email</Label><EmployeePicker value={reviewerEmail} onChange={email => setReviewerEmail(email)} placeholder="Reviewer / HOD email" /></div>
            <div className="space-y-2"><Label>Cycle Year</Label><Input value={cycleYear} onChange={e => setCycleYear(e.target.value)} placeholder="e.g. 2025" /></div>
            <div className="space-y-2"><Label>Review Period</Label><Select value={period} onValueChange={setPeriod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Overall Rating</Label><Select value={rating} onValueChange={setRating}><SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger><SelectContent>{RATINGS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/paf')} disabled={createMutation.isPending}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={createMutation.isPending}>{createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={createMutation.isPending}>{createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
