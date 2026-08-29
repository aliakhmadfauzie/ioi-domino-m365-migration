/**
 * DRD — Duty Roster detail and approval screen.
 * HOS: Submitted -> HOSApproved
 * HOD: HOSApproved -> HODApproved
 * HR: HODApproved -> Completed
 */

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { StatusBadge } from '@/components/hr/status-badge';
import { WorkflowTimeline } from '@/components/hr/workflow-timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMainDBHRById } from '@/hooks/use-main-dbhr';
import { useUser } from '@/hooks/use-user';
import { WorkflowAuditLogService } from '@/generated/services/workflow-audit-log-service';
import { MainDBHRService } from '@/services/main-dbhr-service';
import {
  DRD_FORM_CODE,
  DRD_STAGES,
  DRD_SHIFT_CODES,
  type DRDRecord,
  type DRDStatus,
  fieldValue,
  formatDateTime,
  logDRDWorkflowAction,
  monthLabel,
  recordId,
  recordTitle,
} from './drd-utils';

type ActionStage = 'HOS' | 'HOD' | 'HR';

const ACTION_COPY: Record<ActionStage, { title: string; button: string; nextState: DRDStatus }> = {
  HOS: { title: 'HOS Approval', button: 'Approve as HOS', nextState: 'HOSApproved' },
  HOD: { title: 'HOD Approval', button: 'Approve as HOD', nextState: 'HODApproved' },
  HR: { title: 'HR Processing', button: 'Complete as HR', nextState: 'Completed' },
};

function DetailRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium mt-0.5 whitespace-pre-wrap">{fieldValue(value) || '-'}</dd>
    </div>
  );
}

function resolveStage(status: string): ActionStage | undefined {
  if (status === 'Submitted') return 'HOS';
  if (status === 'HOSApproved') return 'HOD';
  if (status === 'HODApproved') return 'HR';
  return undefined;
}

function DRDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: rawRecord, isLoading, error, refetch } = useMainDBHRById(id || '');
  const record = rawRecord as DRDRecord | undefined;
  const itemId = recordId(record);
  const title = recordTitle(record);
  const currentAction = fieldValue(record?.drdCurrentAction || record?.currentaction || 'Submitted') as DRDStatus;
  const currentStage = resolveStage(currentAction);
  const currentUserEmail = user?.email || user?.userPrincipalName || '';
  const currentUserName = user?.fullName || currentUserEmail || 'System';

  const { data: auditRows = [], refetch: refetchAudit } = useQuery({
    queryKey: ['workflow-audit-log', DRD_FORM_CODE, itemId],
    queryFn: () => WorkflowAuditLogService.getAll({
      filter: `FormCode eq '${DRD_FORM_CODE}' and RequestItemID eq ${Number(itemId)}`,
    }),
    enabled: !!itemId && !Number.isNaN(Number(itemId)),
    staleTime: 5 * 60 * 1000,
  });

  const sortedAuditRows = useMemo(
    () => [...auditRows].sort((a, b) => fieldValue(b.timestamp).localeCompare(fieldValue(a.timestamp))),
    [auditRows]
  );

  const handleWorkflowAction = async () => {
    if (!record || !itemId || !currentStage) return;
    if (!currentUserEmail) { toast.error('User not authenticated'); return; }
    if ((currentStage === 'HOS' || currentStage === 'HOD') && !remark.trim()) {
      toast.error('Remark is required for approval');
      return;
    }

    const action = ACTION_COPY[currentStage];
    const now = new Date().toISOString();
    const changes: Record<string, any> = {
      drdCurrentAction: action.nextState,
      currentaction: action.nextState,
      currentstage: action.nextState === 'Completed' ? 'Completed' : action.title,
      statusKey: action.nextState === 'Completed' ? 'StatusKey5' : 'StatusKey2',
    };

    if (currentStage === 'HOS') {
      changes.drdHOSName = currentUserEmail;
      changes.drdHOSDate = now;
      changes.drdHOSRemark = remark.trim();
      changes.drdHOSApp = true;
    } else if (currentStage === 'HOD') {
      changes.drdHODName = currentUserEmail;
      changes.drdHODDate = now;
      changes.drdHODRemark = remark.trim();
      changes.drdHODApp = true;
    } else {
      changes.drdHRName = currentUserEmail;
      changes.drdHRDate = now;
      changes.drdHRApp = true;
    }

    setSubmitting(true);
    try {
      await MainDBHRService.update(itemId, changes as any);
      await logDRDWorkflowAction({
        record,
        actorName: currentUserName,
        actorEmail: currentUserEmail,
        stage: action.title,
        action: currentStage === 'HR' ? 'Acknowledged' : 'Approved',
        previousState: currentAction,
        newState: action.nextState,
        comments: remark.trim() || action.title,
      });
      toast.success(currentStage === 'HR' ? 'Duty roster completed' : 'Duty roster approved');
      setRemark('');
      await Promise.all([refetch(), refetchAudit()]);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update duty roster');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !record || fieldValue(record.formcode) !== DRD_FORM_CODE) {
    return (
      <div className="p-6">
        <Empty>
          <EmptyHeader>
            <FileText className="h-8 w-8" />
            <EmptyTitle>Duty roster not found</EmptyTitle>
            <EmptyDescription>The requested DRD record could not be loaded.</EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => navigate('/hr/drd')} className="mt-4">Back to Duty Roster</Button>
        </Empty>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Duty Roster', href: '/hr/drd' }, { label: title }]} />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/drd')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <StatusBadge status={currentAction} size="lg" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {monthLabel(record.drdMonth)} {fieldValue(record.drdYear)} · {fieldValue(record.drdDepartment) || 'HR'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" /> Roster Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <DetailRow label="Company" value={record.drdCompany} />
                <DetailRow label="Category" value={record.drdCategory} />
                <DetailRow label="Department" value={record.drdDepartment} />
                <DetailRow label="Section" value={record.drdSection} />
                <DetailRow label="Employee Name" value={record.drdEmpName} />
                <DetailRow label="CC" value={record.drdCC} />
                <DetailRow label="Month" value={monthLabel(record.drdMonth)} />
                <DetailRow label="Year" value={record.drdYear} />
                <DetailRow label="Section Head" value={record.drdHOS} />
                <DetailRow label="Department Head" value={record.drdHOD} />
                <DetailRow label="Submitted By" value={record.drdSubmittedBy} />
                <DetailRow label="Submitted Date" value={formatDateTime(record.drdSubmittedDate || record.submittedon)} />
                <div className="md:col-span-2">
                  <DetailRow label="Changes Against Last Month" value={record.drdChanges} />
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="h-5 w-5" /> Approval Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <DetailRow label="HOS Name" value={record.drdHOSName} />
                <DetailRow label="HOS Date" value={formatDateTime(record.drdHOSDate)} />
                <div className="md:col-span-2"><DetailRow label="HOS Remark" value={record.drdHOSRemark} /></div>
                <DetailRow label="HOD Name" value={record.drdHODName} />
                <DetailRow label="HOD Date" value={formatDateTime(record.drdHODDate)} />
                <div className="md:col-span-2"><DetailRow label="HOD Remark" value={record.drdHODRemark} /></div>
                <DetailRow label="HR Name" value={record.drdHRName} />
                <DetailRow label="HR Date" value={formatDateTime(record.drdHRDate)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedAuditRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No workflow audit entries found for this roster yet.</p>
              ) : (
                <div className="space-y-3">
                  {sortedAuditRows.map((row) => (
                    <div key={row.id || `${row.actionTaken}-${row.timestamp}`} className="rounded-md border px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{fieldValue(row.actionTaken)}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(row.timestamp)}</span>
                      </div>
                      <div className="text-muted-foreground mt-1">{fieldValue(row.actorName || row.actorEmail)}</div>
                      <div className="mt-1">{fieldValue(row.comment)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Workflow</CardTitle></CardHeader>
            <CardContent><WorkflowTimeline stages={DRD_STAGES} currentKey={currentAction} /></CardContent>
          </Card>

          {currentStage && (
            <Card>
              <CardHeader><CardTitle className="text-lg">{ACTION_COPY[currentStage].title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {currentStage !== 'HR' && (
                  <div className="space-y-2">
                    <Label>Remark *</Label>
                    <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={4} />
                  </div>
                )}
                <Button onClick={handleWorkflowAction} disabled={submitting} className="w-full">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {ACTION_COPY[currentStage].button}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">Shift Codes</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {DRD_SHIFT_CODES.map((shift) => (
                  <div key={shift.code} className="rounded-md border px-2 py-1.5">
                    <div className="text-sm font-semibold">{shift.code}</div>
                    <div className="text-xs text-muted-foreground">{shift.hours}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <RecordInfoPanel formCode={DRD_FORM_CODE} recordId={itemId} created={record.Created} modified={record.Modified} />
        </div>
      </div>
    </motion.div>
  );
}

export default DRDDetailPage;
