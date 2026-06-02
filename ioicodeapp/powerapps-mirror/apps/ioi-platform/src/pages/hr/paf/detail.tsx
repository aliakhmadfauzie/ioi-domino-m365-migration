/** PAF — Performance Appraisal Detail View (HRAppraisalRecords table) */
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Award, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { ApprovalActionPanel } from '@/components/hr/approval-action-panel';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { toast } from 'sonner';
import { useHRAppraisalRecords, useUpdateHRAppraisalRecords } from '@/generated/hooks/use-hrappraisal-records';

const ACTIONS: Record<string, { nextAction: string; label: string; variant: 'approve' | 'reject' | 'submit' }[]> = {
  StatusKey0: [{ nextAction: 'StatusKey1', label: 'Submit for Review', variant: 'submit' }],
  StatusKey1: [
    { nextAction: 'StatusKey2', label: 'Start Review', variant: 'approve' },
    { nextAction: 'StatusKey0', label: 'Return to Draft', variant: 'reject' },
  ],
  StatusKey2: [
    { nextAction: 'StatusKey3', label: 'Approve', variant: 'approve' },
    { nextAction: 'StatusKey1', label: 'Return for Revision', variant: 'reject' },
  ],
};

export default function PAFDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, error } = useHRAppraisalRecords(id!);
  const updateMutation = useUpdateHRAppraisalRecords();

  const handleAction = async (nextAction: string) => {
    if (!id || !record) return;
    try {
      await updateMutation.mutateAsync({ id: String(record.id), changedFields: { statusKey: nextAction as any } });
      toast.success(`Status updated`);
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return (
    <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle></EmptyHeader>
    <Button onClick={() => navigate('/hr/paf')} className="mt-4">Back</Button></Empty></div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Performance Appraisals', href: '/hr/paf' }, { label: record.appraisalNo || record.title }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/paf')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.appraisalNo || record.title}</h1>
            <StatusBadge status={record.statusKey} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{record.cycleYear || '-'} &middot; Reviewer: {record.reviewerEmail || '-'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="h-5 w-5" />Appraisal Details</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Appraisal No.</dt><dd className="font-medium mt-0.5">{record.appraisalNo || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Employee No.</dt><dd className="font-medium mt-0.5">{record.employeeNo || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Cycle Year</dt><dd className="font-medium mt-0.5">{record.cycleYear || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Overall Rating</dt><dd className="font-medium mt-0.5">{record.rating || '-'}</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Reviewer Email</dt><dd className="font-medium mt-0.5">{record.reviewerEmail || '-'}</dd></div>
            </dl></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ApprovalActionPanel currentAction={record.statusKey} actions={ACTIONS[record.statusKey ?? ''] || []} onAction={handleAction} loading={updateMutation.isPending} />
          <RecordInfoPanel formCode="PAF" recordId={record.id} created={undefined} modified={undefined} />
        </div>
      </div>
    </motion.div>
  );
}
