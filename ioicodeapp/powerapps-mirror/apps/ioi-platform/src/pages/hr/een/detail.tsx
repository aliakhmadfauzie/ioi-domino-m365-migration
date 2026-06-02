/**
 * EEN — Employee Exit Notification Detail / Approval Screen
 * HOD → ED 2-stage approval workflow
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, CheckCircle2, User, Building2, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMainDBHRById } from '@/hooks/use-main-dbhr';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const asRead = (r: any): Record<string, any> => r;

const STAGE_ACTIONS: Record<string, { action: string; label: string; variant: 'approve' | 'reject' | 'submit'; stage: string }[]> = {
  Submitted: [
    { action: 'HODApproved', label: 'Approve as HOD', variant: 'approve', stage: 'HOD' },
    { action: 'Rejected', label: 'Reject', variant: 'reject', stage: 'HOD' },
  ],
  HODApproved: [
    { action: 'EDApproved', label: 'Approve as ED', variant: 'approve', stage: 'ED' },
    { action: 'Rejected', label: 'Reject', variant: 'reject', stage: 'ED' },
  ],
};

function getActionBadge(action: string | undefined) {
  switch (action) {
    case 'Submitted': return <Badge className="bg-amber-100 text-amber-800">Pending HOD</Badge>;
    case 'HODApproved': return <Badge className="bg-blue-100 text-blue-800">HOD Approved</Badge>;
    case 'EDApproved': return <Badge className="bg-purple-100 text-purple-800">ED Approved</Badge>;
    case 'Completed': return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge variant="outline">{action || 'Unknown'}</Badge>;
  }
}

function EENDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');
  const { data: raw, isLoading, error, refetch } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;
  const currentAction = record?.eenCurrentAction || 'Submitted';
  const availableActions = STAGE_ACTIONS[currentAction] || [];

  const handleAction = async (action: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const update: Record<string, any> = { eenCurrentAction: action };
      if (action === 'HODApproved') {
        update.eenHODName = user?.email || user?.fullName || 'System';
        update.eenHODDate = new Date().toISOString();
        update.eenHODRemark = remark;
      } else if (action === 'EDApproved') {
        update.eenEDName = user?.email || user?.fullName || 'System';
        update.eenEDDate = new Date().toISOString();
        update.eenEDRemark = remark;
        update.statusKey = 'StatusKey3';
      } else if (action === 'Rejected') {
        update.eenRejectReason = remark;
        update.statusKey = 'StatusKey4';
      }
      await MainDBHRService.update(id, update as any);
      toast.success(`Moved to ${action}`);
      setRemark('');
      await refetch();
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return (
    <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle><EmptyDescription>Record not found.</EmptyDescription></EmptyHeader>
    <Button onClick={() => navigate('/hr/een')} className="mt-4">Back</Button></Empty></div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[
        { label: 'HR Dashboard', href: '/hr' },
        { label: 'Exit Notifications', href: '/hr/een' },
        { label: `#${record.Title || record.INO || record.ID}` },
      ]} />

      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/een')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.eenEmpName || record.Title || '-'}</h1>
            <StatusBadge status={currentAction} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {record.eenCompany || '-'} &middot; {record.eenSection || '-'} &middot;
            Resign: {record.eenResignDate ? format(new Date(record.eenResignDate), 'dd MMM yyyy') : '-'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg"><User className="h-5 w-5 inline mr-2" />Employee Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Name</dt><dd className="font-medium mt-0.5">{record.eenEmpName || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium mt-0.5">{record.eenEmpEmail || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Employee No.</dt><dd className="font-medium mt-0.5">{record.eenEmpNo || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Position</dt><dd className="font-medium mt-0.5">{record.eenPosition || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Section</dt><dd className="font-medium mt-0.5">{record.eenSection || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Company</dt><dd className="font-medium mt-0.5">{record.eenCompany || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium mt-0.5">{record.eenCategory || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Type</dt><dd className="font-medium mt-0.5">{record.eenType || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Resignation Date</dt><dd className="font-medium mt-0.5">{record.eenResignDate ? format(new Date(record.eenResignDate), 'dd MMM yyyy') : '-'}</dd></div>
                <div><dt className="text-muted-foreground">Last Working Day</dt><dd className="font-medium mt-0.5">{record.eenLastWorkDate ? format(new Date(record.eenLastWorkDate), 'dd MMM yyyy') : '-'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Remarks</dt><dd className="font-medium mt-0.5">{record.eenRemarks || '-'}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {/* HOD Approval Section */}
          <Card className={currentAction === 'Submitted' ? 'border-amber-300' : ''}>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" /> HOD Approval
              {currentAction === 'HODApproved' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}</CardTitle></CardHeader>
            <CardContent>
              {record.eenHODName ? (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-muted-foreground">Approved By</dt><dd className="font-medium mt-0.5">{record.eenHODName}</dd></div>
                  <div><dt className="text-muted-foreground">Date</dt><dd className="font-medium mt-0.5">{record.eenHODDate ? format(new Date(record.eenHODDate), 'dd MMM yyyy HH:mm') : '-'}</dd></div>
                  <div className="col-span-2"><dt className="text-muted-foreground">Remark</dt><dd className="font-medium mt-0.5">{record.eenHODRemark || '-'}</dd></div>
                </dl>
              ) : <p className="text-sm text-muted-foreground">Awaiting HOD approval</p>}
            </CardContent>
          </Card>

          {/* ED Approval Section */}
          <Card className={currentAction === 'HODApproved' ? 'border-blue-300' : ''}>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" /> ED Approval
              {currentAction === 'EDApproved' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}</CardTitle></CardHeader>
            <CardContent>
              {record.eenEDName ? (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-muted-foreground">Approved By</dt><dd className="font-medium mt-0.5">{record.eenEDName}</dd></div>
                  <div><dt className="text-muted-foreground">Date</dt><dd className="font-medium mt-0.5">{record.eenEDDate ? format(new Date(record.eenEDDate), 'dd MMM yyyy HH:mm') : '-'}</dd></div>
                  <div className="col-span-2"><dt className="text-muted-foreground">Remark</dt><dd className="font-medium mt-0.5">{record.eenEDRemark || '-'}</dd></div>
                </dl>
              ) : <p className="text-sm text-muted-foreground">Awaiting ED approval</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <RecordInfoPanel
            createdBy={record.Author?.DisplayName || 'System'}
            createdDate={record.Created ? new Date(record.Created) : undefined}
            lastModified={record.Modified ? new Date(record.Modified) : undefined}
            requestorEmail={record.requestoremail || ''}
          />
          {availableActions.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="Add remark..." rows={3} />
                </div>
                {availableActions.map((act) => (
                  <Button key={act.action} className="w-full"
                    variant={act.variant === 'approve' ? 'default' : 'destructive'}
                    onClick={() => handleAction(act.action)} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{act.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default EENDetailPage;
