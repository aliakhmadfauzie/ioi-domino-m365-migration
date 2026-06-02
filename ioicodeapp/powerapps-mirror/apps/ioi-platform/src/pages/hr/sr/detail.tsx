/** SR — Staff Requisition Detail View */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Briefcase, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { ApprovalActionPanel } from '@/components/hr/approval-action-panel';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMainDBHRById } from '@/hooks/use-main-dbhr';
import { MainDBHRService } from '@/services/main-dbhr-service';

const asRead = (r: any): Record<string, any> => r;
const ACTIONS: Record<string, { nextAction: string; label: string; variant: 'approve' | 'reject' | 'submit' }[]> = {
  Request: [{ nextAction: 'Submitted', label: 'Submit for HOD Review', variant: 'submit' }],
  Submitted: [
    { nextAction: 'HODApproval', label: 'HOD Approve', variant: 'approve' },
    { nextAction: 'Rejected', label: 'Reject', variant: 'reject' },
  ],
  HODApproval: [
    { nextAction: 'Approved', label: 'HR Approve', variant: 'approve' },
    { nextAction: 'Rejected', label: 'Reject', variant: 'reject' },
  ],
};

export default function SRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: raw, isLoading, error } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;

  const handleAction = async (nextAction: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await MainDBHRService.update(id, { currentaction: nextAction } as any);
      toast.success(`Status updated to ${nextAction}`);
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return (
    <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle></EmptyHeader>
    <Button onClick={() => navigate('/hr/sr')} className="mt-4">Back to List</Button></Empty></div>
  );

  const ca = record.CurrentAction || record.currentaction;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Staff Requisitions', href: '/hr/sr' }, { label: record.Title || `SR-${record.ID}` }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/sr')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.Title || `SR-${record.ID}`}</h1>
            <StatusBadge status={ca} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {record.Department || record.department || '-'} &middot; Created {record.Created ? format(new Date(record.Created), 'dd MMM yyyy') : 'N/A'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Briefcase className="h-5 w-5" />Requisition Details</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Position</dt><dd className="font-medium mt-0.5">{record.VacancyTitle || record.vacancyTitle || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Grade / Level</dt><dd className="font-medium mt-0.5">{record.JobDesignation || record.jobdesignation || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium mt-0.5">{record.Department || record.department || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Priority</dt><dd className="font-medium mt-0.5">{record.Priority || record.priority || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Headcount / Details</dt><dd className="font-medium mt-0.5">{record.Details || record.details || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Date Required</dt><dd className="font-medium mt-0.5">{record.DueDate || record.duedate || '-'}</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Replacement For</dt><dd className="font-medium mt-0.5">{record.Remarks || record.remarks || '-'}</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Reason / Justification</dt><dd className="font-medium mt-0.5">{record.Description || record.description || '-'}</dd></div>
            </dl></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ApprovalActionPanel currentAction={ca} actions={ACTIONS[ca ?? ''] || []} onAction={handleAction} loading={loading} />
          <RecordInfoPanel formCode="SR" recordId={record.ID || record.id} created={record.Created} modified={record.Modified} />
        </div>
      </div>
    </motion.div>
  );
}
