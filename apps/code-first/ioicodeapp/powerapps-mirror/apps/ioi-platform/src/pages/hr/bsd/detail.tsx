/**
 * BSD — Backup Staff Detail / Approval Screen
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Users, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
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
    { nextAction: 'Approved', label: 'Approve', variant: 'approve' },
    { nextAction: 'Rejected', label: 'Reject', variant: 'reject' },
  ],
};

function BSDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: raw, isLoading, error } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;

  const handleAction = async (nextAction: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await MainDBHRService.update(id, { CurrentAction: nextAction } as any);
      toast.success(`Moved to ${nextAction}`);
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return (
    <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle><EmptyDescription>Record not found.</EmptyDescription></EmptyHeader>
    <Button onClick={() => navigate('/hr/bsd')} className="mt-4">Back</Button></Empty></div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Backup Staff', href: '/hr/bsd' }, { label: `#${record.Title || record.INO || record.ID}` }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/bsd')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.EmployeeName || record.Title || record.INO || record.ID}</h1>
            <StatusBadge status={record.CurrentAction} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{record.Department || '-'} &middot; Created {record.Created ? format(new Date(record.Created), 'dd MMM yyyy') : 'N/A'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg"><Users className="h-5 w-5 inline mr-2" />Staff Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Staff Name</dt><dd className="font-medium mt-0.5">{record.EmployeeName || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Employee No.</dt><dd className="font-medium mt-0.5">{record.EmployeeID || record.INO || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Position</dt><dd className="font-medium mt-0.5">{record.Designation || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Division</dt><dd className="font-medium mt-0.5">{record.Divison || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium mt-0.5">{record.Department || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Section</dt><dd className="font-medium mt-0.5">{record.Section || '-'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Created By</dt><dd className="font-medium mt-0.5">{record.Author?.DisplayName || 'System'}</dd></div>
                {record.Description && <div className="col-span-2"><dt className="text-muted-foreground">Remark</dt><dd className="font-medium mt-0.5">{record.Description}</dd></div>}
              </dl>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ApprovalActionPanel currentAction={record.CurrentAction} actions={ACTIONS[record.CurrentAction ?? ''] || []} onAction={handleAction} loading={loading} />
          <RecordInfoPanel formCode="BSD" recordId={record.ID} created={record.Created} modified={record.Modified} />
        </div>
      </div>
    </motion.div>
  );
}

export default BSDDetailPage;
