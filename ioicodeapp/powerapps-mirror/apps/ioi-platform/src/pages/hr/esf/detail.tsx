/** ESF — Employee Separation Form Detail View */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, UserX, FileText } from 'lucide-react';
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
import {
  MainDBHRExitCategoryKeyToLabel, MainDBHRExitTypeKeyToLabel,
  type MainDBHRExitCategoryKey, type MainDBHRExitTypeKey,
} from '@/generated/models/main-dbhr-model';

const asRead = (r: any): Record<string, any> => r;
const ACTIONS: Record<string, { nextAction: string; label: string; variant: 'approve' | 'reject' | 'submit' }[]> = {
  Submitted: [{ nextAction: 'HODApproval', label: 'HOD Acknowledge', variant: 'approve' }],
  HODApproval: [{ nextAction: 'Completed', label: 'HR Complete', variant: 'approve' }],
};

export default function ESFDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: raw, isLoading, error } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;
  const handleAction = async (nextAction: string) => {
    if (!id) return; setLoading(true);
    try { await MainDBHRService.update(id, { currentaction: nextAction } as any); toast.success(`Status updated`); }
    catch (err: any) { toast.error(err?.message || 'Failed'); } finally { setLoading(false); }
  };
  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle></EmptyHeader><Button onClick={() => navigate('/hr/esf')} className="mt-4">Back</Button></Empty></div>;
  const ca = record.CurrentAction || record.currentaction;
  const exitCatLabel = record.ExitCategoryKey ? MainDBHRExitCategoryKeyToLabel[record.ExitCategoryKey as MainDBHRExitCategoryKey] : '-';
  const exitTypeLabel = record.ExitTypeKey ? MainDBHRExitTypeKeyToLabel[record.ExitTypeKey as MainDBHRExitTypeKey] : '-';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Separation Forms', href: '/hr/esf' }, { label: record.EmployeeName || record.Title || `ESF-${record.ID}` }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/esf')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3"><h1 className="text-2xl font-bold">{record.EmployeeName || record.employeename || record.Title || `ESF-${record.ID}`}</h1><StatusBadge status={ca} size="lg" /></div>
          <p className="text-sm text-muted-foreground mt-1">{record.Department || '-'} &middot; Last day: {record.LastWorkingDay ? format(new Date(record.LastWorkingDay), 'dd MMM yyyy') : '-'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><UserX className="h-5 w-5" />Separation Details</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Employee</dt><dd className="font-medium mt-0.5">{record.EmployeeName || record.employeename || '-'}</dd></div>
              <div><dt className="text-muted-foreground">IC / Staff No.</dt><dd className="font-medium mt-0.5">{record.EmployeeID || record.employeeid || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium mt-0.5">{record.Department || record.department || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Position</dt><dd className="font-medium mt-0.5">{record.JobDesignation || record.jobdesignation || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Last Working Day</dt><dd className="font-medium mt-0.5">{record.LastWorkingDay ? format(new Date(record.LastWorkingDay), 'dd MMM yyyy') : '-'}</dd></div>
              <div><dt className="text-muted-foreground">Exit Category</dt><dd className="font-medium mt-0.5">{exitCatLabel}</dd></div>
              <div><dt className="text-muted-foreground">Exit Type</dt><dd className="font-medium mt-0.5">{exitTypeLabel}</dd></div>
              <div><dt className="text-muted-foreground">Notice Period</dt><dd className="font-medium mt-0.5">{record.Details || record.details || '-'}</dd></div>
              <div className="col-span-2"><dt className="text-muted-foreground">Reason for Leaving</dt><dd className="font-medium mt-0.5">{record.ReasonForLeaving || record.reasonForLeaving || record.Description || '-'}</dd></div>
            </dl></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ApprovalActionPanel currentAction={ca} actions={ACTIONS[ca ?? ''] || []} onAction={handleAction} loading={loading} />
          <RecordInfoPanel formCode="ESF" recordId={record.ID || record.id} created={record.Created} modified={record.Modified} />
        </div>
      </div>
    </motion.div>
  );
}
