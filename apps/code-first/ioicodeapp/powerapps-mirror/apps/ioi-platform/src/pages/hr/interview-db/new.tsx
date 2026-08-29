/** INTERVIEWDB — New Interview Pipeline Record (HRInterviewPipeline table) */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Send, Users } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useCreateHRInterviewPipeline } from '@/generated/hooks/use-hrinterview-pipeline';
import type { HRInterviewPipelineSiteKey } from '@/generated/models/hr-interview-pipeline-model';

export default function InterviewDBNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateHRInterviewPipeline();
  const [candidateName, setCandidateName] = useState('');
  const [position, setPosition] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [siteKey, setSiteKey] = useState<HRInterviewPipelineSiteKey>('SiteKey0');
  const [stage, setStage] = useState('Screening');

  const handleSubmit = async () => {
    if (!candidateName.trim()) { toast.error('Candidate name is required'); return; }
    try {
      const pipelineNo = `INT-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      await createMutation.mutateAsync({
        title: pipelineNo,
        pipelineNo,
        candidateName,
        position,
        ownerEmail,
        siteKey,
        stage,
      });
      toast.success('Interview record added');
      navigate('/hr/interview-db');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Interview Database', href: '/hr/interview-db' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/interview-db')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Interview Record</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5" />Candidate Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Candidate Name <span className="text-destructive">*</span></Label><Input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="Full name" /></div>
            <div className="space-y-2"><Label>Position Applied</Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Job title" /></div>
            <div className="space-y-2">
              <Label>Owner / Recruiter</Label>
              <EmployeePicker value={ownerEmail} onChange={email => setOwnerEmail(email)} placeholder="Recruiter email" />
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={siteKey} onValueChange={v => setSiteKey(v as HRInterviewPipelineSiteKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SiteKey0">Prai</SelectItem>
                  <SelectItem value="SiteKey1">Johor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Initial Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Screening', 'Interview', 'Offer', 'Joined', 'Declined'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/interview-db')} disabled={createMutation.isPending}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={createMutation.isPending}>
          {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Add Record
        </Button>
      </div>
    </motion.div>
  );
}
