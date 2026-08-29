/**
 * SAPTR — SAP Transport Request Detail / Approval Screen
 * 3-Stage Workflow: Request → IT Manager Review → BASIS Execute
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Shield, Upload, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';
import { useUser } from '@/hooks/use-user';
import { recordITApprovalAction, statusActionType } from '@/lib/it-approval-actions';

const asRead = (r: any) => r;

const STAGE_ACTIONS: Record<string, { action: string; label: string; variant: 'approve' | 'reject'; stage: string }[]> = {
  'CurrentstatusKey9': [ // Pending Approval A — IT Manager Review
    { action: 'CurrentstatusKey13', label: 'Approve → BASIS Execute', variant: 'approve', stage: 'IT Manager' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'IT Manager' },
  ],
  'CurrentstatusKey13': [ // Pending BASIS
    { action: 'CurrentstatusKey1', label: 'Complete Transport', variant: 'approve', stage: 'BASIS' },
  ],
};

const STAGE_ORDER = ['CurrentstatusKey9', 'CurrentstatusKey13', 'CurrentstatusKey1'];

function SAPTRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');

  const { data: raw, isLoading, error, refetch } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => {
      if (!id) return null;
      const records = await MainDBITService.getAll({ filter: `id eq ${id}` });
      return records[0] || null;
    },
    enabled: !!id,
  });
  const record = raw ? asRead(raw) : undefined;
  const statusKey = String(record?.currentStatus || '');
  const statusLabel = MainDBITCurrentstatusKeyToLabel[statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel] || statusKey;
  const availableActions = STAGE_ACTIONS[statusKey] || [];

  const handleAction = async (action: string) => {
    if (!id) return;
    const selectedAction = availableActions.find((item) => item.action === action);
    setLoading(true);
    try {
      const update: Record<string, any> = { currentStatus: action, workflowstage: 2 };
      if (action === 'CurrentstatusKey6') update.workflowstage = 0;
      await recordITApprovalAction({
        id,
        record,
        user,
        nextStatus: action,
        stageName: selectedAction?.stage || selectedAction?.label || 'SAPTR Approval',
        actionType: statusActionType(action, selectedAction?.variant),
        comment: remark,
        workflowstage: update.workflowstage,
      });
      toast.success('Status updated');
      setRemark('');
      await refetch();
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6 text-center">Record not found</div>;

  const stageNames = ['IT Manager Review', 'BASIS Execution', 'Completed'];
  const stageIcons = [Shield, Upload, CheckCircle2];

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/saptr')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.title || `SAPTR-${id}`}</h1>
            <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {record.requestoremail || ''} &middot; Submitted {record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader><CardTitle className="text-lg"><GitBranch className="h-5 w-5 inline mr-2" />Transport Request Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium mt-0.5">{record.title || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Form Code</dt><dd className="font-medium mt-0.5">{record.formcode || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{statusLabel}</dd></div>
                <div><dt className="text-muted-foreground">Requestor</dt><dd className="font-medium mt-0.5">{record.requestoremail || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium mt-0.5">{record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : '-'}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {/* Stages */}
          {STAGE_ORDER.map((stageKey, idx) => {
            const StageIcon = stageIcons[idx];
            const isActive = statusKey === stageKey;
            const isPast = STAGE_ORDER.indexOf(statusKey) > idx;
            const isFuture = !isActive && !isPast;
            return (
              <Card key={stageKey} className={isActive ? 'border-amber-300' : isPast ? 'border-emerald-200' : isFuture ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StageIcon className="h-5 w-5" />
                    {stageNames[idx]}
                    {isPast && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    {isActive && <Badge className="ml-auto bg-amber-100 text-amber-800">Current</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{isPast ? 'Completed' : isActive ? 'Awaiting action' : 'Pending'}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sidebar */}
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
                <div className="space-y-2"><Label>Comment</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} placeholder="Optional remark..." /></div>
                {availableActions.map(a => (
                  <Button key={a.action} className="w-full" variant={a.variant === 'approve' ? 'default' : 'destructive'} onClick={() => handleAction(a.action)} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{a.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default SAPTRDetailPage;
