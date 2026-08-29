/**
 * AWHR — Rest Day & Additional Working Hours Detail / Approval Screen
 * HOS → HOD → HR 3-stage approval
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, CheckCircle2, Building2, FileText, Clock } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMainDBHRById } from '@/hooks/use-main-dbhr';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const asRead = (r: any) => r;

const STAGE_ACTIONS: Record<string, { action: string; label: string; variant: 'approve' | 'reject'; stage: string }[]> = {
  Submitted: [
    { action: 'HOSApproved', label: 'Approve as HOS', variant: 'approve', stage: 'HOS' },
    { action: 'Rejected', label: 'Reject', variant: 'reject', stage: 'HOS' },
  ],
  HOSApproved: [
    { action: 'HODApproved', label: 'Approve as HOD', variant: 'approve', stage: 'HOD' },
    { action: 'Rejected', label: 'Reject', variant: 'reject', stage: 'HOD' },
  ],
  HODApproved: [
    { action: 'Completed', label: 'Complete (HR)', variant: 'approve', stage: 'HR' },
    { action: 'Rejected', label: 'Reject', variant: 'reject', stage: 'HR' },
  ],
};

function AWHRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');
  const { data: raw, isLoading, error, refetch } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;
  const currentAction = record?.awhrCurrentAction || 'Submitted';
  const availableActions = STAGE_ACTIONS[currentAction] || [];
  let whRows: any[] = [];
  try { whRows = JSON.parse(record?.awhrWorkingHours || '[]'); } catch {}

  const handleAction = async (action: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const update: Record<string, any> = { awhrCurrentAction: action };
      if (action === 'HOSApproved') {
        update.awhrHOSName = user?.email || user?.fullName || 'System';
        update.awhrHOSDate = new Date().toISOString();
        update.awhrHOSRemark = remark;
      } else if (action === 'HODApproved') {
        update.awhrHODName = user?.email || user?.fullName || 'System';
        update.awhrHODDate = new Date().toISOString();
        update.awhrHODRemark = remark;
      } else if (action === 'Completed') {
        update.awhrHRName = user?.email || user?.fullName || 'System';
        update.awhrHRDate = new Date().toISOString();
        update.statusKey = 'StatusKey3';
      } else if (action === 'Rejected') {
        update.awhrRejectReason = remark;
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
    <div className="p-6"><Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle><EmptyDescription /></EmptyHeader>
    <Button onClick={() => navigate('/hr/awhr')} className="mt-4">Back</Button></Empty></div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Working Hours', href: '/hr/awhr' }, { label: `#${record.Title || record.ID}` }]} />
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/awhr')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.awhrSection || record.Title || '-'}</h1>
            <StatusBadge status={currentAction} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{record.awhrDepartment || '-'} &middot; {record.awhrCompany || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg"><Building2 className="h-5 w-5 inline mr-2" />Requisition Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Company</dt><dd className="font-medium mt-0.5">{record.awhrCompany || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium mt-0.5">{record.awhrCategory || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Section</dt><dd className="font-medium mt-0.5">{record.awhrSection || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium mt-0.5">{record.awhrDepartment || '-'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Exceeded Codes</dt><dd className="font-medium mt-0.5">{record.awhrExceeded || '-'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Remarks</dt><dd className="font-medium mt-0.5">{record.awhrRemarks || '-'}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {whRows.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg"><Clock className="h-5 w-5 inline mr-2" />Working Hours ({whRows.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>#</TableHead><TableHead>Emp No</TableHead><TableHead>Name</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Day</TableHead><TableHead>Shift</TableHead><TableHead>Add Hrs</TableHead><TableHead>Total</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {whRows.map((row: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{row.empNo || '-'}</TableCell>
                        <TableCell>{row.name || '-'}</TableCell>
                        <TableCell>{row.dateFrom || '-'}</TableCell>
                        <TableCell>{row.dateTo || '-'}</TableCell>
                        <TableCell>{row.dayType || '-'}</TableCell>
                        <TableCell>{row.shift || '-'}</TableCell>
                        <TableCell>{row.addHours || '-'}</TableCell>
                        <TableCell>{row.totalHours || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {['HOS', 'HOD', 'HR'].map(stage => {
            const nameField = `awhr${stage}Name`;
            const dateField = `awhr${stage}Date`;
            const remarkField = `awhr${stage}Remark`;
            const isDone = record[nameField];
            const stageLabel = stage === 'HR' ? 'HR Processing' : `${stage} Approval`;
            return (
              <Card key={stage} className={!isDone && currentAction === (stage === 'HR' ? 'HODApproved' : `${stage === 'HOS' ? 'Submitted' : `${stage === 'HOD' ? 'HOSApproved' : 'HODApproved'}`}`) ? 'border-amber-300' : ''}>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" />{stageLabel}{isDone && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}</CardTitle></CardHeader>
                <CardContent>
                  {isDone ? (
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div><dt className="text-muted-foreground">By</dt><dd className="font-medium mt-0.5">{record[nameField]}</dd></div>
                      <div><dt className="text-muted-foreground">Date</dt><dd className="font-medium mt-0.5">{record[dateField] ? format(new Date(record[dateField]), 'dd MMM yyyy HH:mm') : '-'}</dd></div>
                      {record[remarkField] && <div className="col-span-2"><dt className="text-muted-foreground">Remark</dt><dd className="font-medium mt-0.5">{record[remarkField]}</dd></div>}
                    </dl>
                  ) : <p className="text-sm text-muted-foreground">Awaiting {stageLabel.toLowerCase()}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <RecordInfoPanel createdBy={record.Author?.DisplayName || 'System'} createdDate={record.Created ? new Date(record.Created) : undefined} lastModified={record.Modified ? new Date(record.Modified) : undefined} requestorEmail={record.requestoremail || ''} />
          {availableActions.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Comment</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="Add remark..." rows={3} /></div>
                {availableActions.map(act => (
                  <Button key={act.action} className="w-full" variant={act.variant === 'approve' ? 'default' : 'destructive'} onClick={() => handleAction(act.action)} disabled={loading}>
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

export default AWHRDetailPage;
