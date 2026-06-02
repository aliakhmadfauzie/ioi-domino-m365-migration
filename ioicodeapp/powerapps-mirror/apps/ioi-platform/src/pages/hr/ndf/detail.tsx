/** NDF — New Document Form Detail View */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, FileText } from 'lucide-react';
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
  Draft: [{ nextAction: 'HODApproval', label: 'Submit for HOD Approval', variant: 'submit' }],
  HODApproval: [{ nextAction: 'HRApproval', label: 'HOD Approve', variant: 'approve' }, { nextAction: 'Rejected', label: 'Reject', variant: 'reject' }],
  HRApproval: [{ nextAction: 'Published', label: 'Publish Document', variant: 'approve' }, { nextAction: 'Rejected', label: 'Reject', variant: 'reject' }],
};

export default function NDFDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: raw, isLoading, error } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;
  const handleAction = async (nextAction: string) => {
    if (!id) return; setLoading(true);
    try { await MainDBHRService.update(id, { currentaction: nextAction } as any); toast.success('Status updated'); }
    catch (err: any) { toast.error(err?.message || 'Failed'); } finally { setLoading(false); }
  };
  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle></EmptyHeader><Button onClick={() => navigate('/hr/ndf')} className="mt-4">Back</Button></Empty></div>;
  const ca = record.CurrentAction || record.currentaction;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'New Document Forms', href: '/hr/ndf' }, { label: record.VacancyTitle || record.Title || `NDF-${record.ID}` }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/ndf')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3"><h1 className="text-2xl font-bold">{record.VacancyTitle || record.vacancyTitle || record.Title || `NDF-${record.ID}`}</h1><StatusBadge status={ca} size="lg" /></div>
          <p className="text-sm text-muted-foreground mt-1">{record.DocumentType || record.documenttype || '-'} &middot; v{record.FormVersion || record.formversion || '1.0'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" />Document Details</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Doc No.</dt><dd className="font-medium mt-0.5">{record.DocumentNo || record.documentno || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium mt-0.5">{record.VacancyTitle || record.vacancyTitle || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium mt-0.5">{record.DocumentType || record.documenttype || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Version</dt><dd className="font-medium mt-0.5">{record.FormVersion || record.formversion || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Revision No.</dt><dd className="font-medium mt-0.5">{record.RevisionNo || record.revisionno || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Effective Date</dt><dd className="font-medium mt-0.5">{record.EffectiveDate ? format(new Date(record.EffectiveDate), 'dd MMM yyyy') : '-'}</dd></div>
              <div><dt className="text-muted-foreground">Review Cycle</dt><dd className="font-medium mt-0.5">{record.Details || record.details || '-'}</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Content Summary</dt><dd className="font-medium mt-0.5">{record.Description || record.description || '-'}</dd></div>
            </dl></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ApprovalActionPanel currentAction={ca} actions={ACTIONS[ca ?? ''] || []} onAction={handleAction} loading={loading} />
          <RecordInfoPanel formCode="NDF" recordId={record.ID || record.id} created={record.Created} modified={record.Modified} />
        </div>
      </div>
    </motion.div>
  );
}
