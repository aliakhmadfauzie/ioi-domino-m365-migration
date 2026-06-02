/** INTERVIEWDB — Interview Pipeline Detail (HRInterviewPipeline table) */
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Users, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { ApprovalActionPanel } from '@/components/hr/approval-action-panel';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { toast } from 'sonner';
import { useHRInterviewPipeline, useUpdateHRInterviewPipeline } from '@/generated/hooks/use-hrinterview-pipeline';

const ACTIONS: Record<string, { nextAction: string; label: string; variant: 'approve' | 'reject' | 'submit' }[]> = {
  Screening: [{ nextAction: 'Interview', label: 'Schedule Interview', variant: 'submit' }],
  Interview: [
    { nextAction: 'Offer', label: 'Proceed to Offer', variant: 'approve' },
    { nextAction: 'Declined', label: 'Not Recommended', variant: 'reject' },
  ],
  Offer: [
    { nextAction: 'Joined', label: 'Candidate Joined', variant: 'approve' },
    { nextAction: 'Declined', label: 'Offer Declined', variant: 'reject' },
  ],
};

export default function InterviewDBDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, error } = useHRInterviewPipeline(id!);
  const updateMutation = useUpdateHRInterviewPipeline();

  const handleAction = async (nextStage: string) => {
    if (!record) return;
    try {
      await updateMutation.mutateAsync({ id: String(record.id), changedFields: { stage: nextStage } });
      toast.success(`Stage updated to ${nextStage}`);
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return (
    <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle></EmptyHeader>
    <Button onClick={() => navigate('/hr/interview-db')} className="mt-4">Back</Button></Empty></div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Interview Database', href: '/hr/interview-db' }, { label: record.candidateName || record.title }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/interview-db')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.candidateName || record.title}</h1>
            <StatusBadge status={record.stage} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{record.position || '-'} &middot; {record.siteKey || '-'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" />Candidate Details</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Pipeline No.</dt><dd className="font-medium mt-0.5">{record.pipelineNo || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Candidate Name</dt><dd className="font-medium mt-0.5">{record.candidateName || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Position Applied</dt><dd className="font-medium mt-0.5">{record.position || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Site</dt><dd className="font-medium mt-0.5">{record.siteKey || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Owner / Recruiter</dt><dd className="font-medium mt-0.5">{record.ownerEmail || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Current Stage</dt><dd className="font-medium mt-0.5">{record.stage || '-'}</dd></div>
            </dl></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ApprovalActionPanel currentAction={record.stage} actions={ACTIONS[record.stage ?? ''] || []} onAction={handleAction} loading={updateMutation.isPending} />
          <RecordInfoPanel formCode="INTERVIEWDB" recordId={record.id} created={undefined} modified={undefined} />
        </div>
      </div>
    </motion.div>
  );
}
