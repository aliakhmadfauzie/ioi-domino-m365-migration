/**
 * IOIP — IOI Policy Detail / Approval Screen
 * 4-Stage Workflow: Draft → PendingApproval (3-Level) → Distributed → Archived
 * Extension list: MainDB_IT_Ext_Policy holds detailed policy fields
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Shield, FileText, Archive, Send } from 'lucide-react';
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
import { MainDBITExtPolicyService } from '@/generated/services/main-dbit-ext-policy-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';
import { useUser } from '@/hooks/use-user';
import { recordITApprovalAction, statusActionType } from '@/lib/it-approval-actions';

const asRead = (r: any) => r;

const STAGE_ACTIONS: Record<string, { action: string; label: string; variant: 'approve' | 'reject'; stage: string }[]> = {
  'CurrentstatusKey3': [ // Draft — submit for approval
    { action: 'CurrentstatusKey55', label: 'Submit for Approval', variant: 'approve', stage: 'Draft' },
  ],
  'CurrentstatusKey55': [ // Pending Approver 1
    { action: 'CurrentstatusKey56', label: 'Approve as Approver 1', variant: 'approve', stage: 'Approver 1' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'Approver 1' },
  ],
  'CurrentstatusKey56': [ // Pending Approver 2
    { action: 'CurrentstatusKey57', label: 'Approve as Approver 2', variant: 'approve', stage: 'Approver 2' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'Approver 2' },
  ],
  'CurrentstatusKey57': [ // Pending Approver 3
    { action: 'CurrentstatusKey4', label: 'Approve as Approver 3', variant: 'approve', stage: 'Approver 3' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'Approver 3' },
  ],
  'CurrentstatusKey4': [ // Distributed — can archive
    { action: 'CurrentstatusKey44', label: 'Archive Policy', variant: 'approve', stage: 'Distributed' },
  ],
};

const STAGE_ORDER = ['CurrentstatusKey3', 'CurrentstatusKey55', 'CurrentstatusKey56', 'CurrentstatusKey57', 'CurrentstatusKey4', 'CurrentstatusKey44'];

function IOIPDetailPage() {
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

  // Fetch extension record for policy details
  const { data: extRaw } = useQuery({
    queryKey: ['mainDBITExtPolicy', id],
    queryFn: async () => {
      if (!id) return null;
      const records = await MainDBITExtPolicyService.getList({ filter: `parentRecord/id eq ${id}` });
      return records[0] || null;
    },
    enabled: !!id,
  });
  const extRecord = extRaw ? asRead(extRaw) : undefined;

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
        stageName: selectedAction?.stage || selectedAction?.label || 'IOIP Approval',
        actionType: statusActionType(action, selectedAction?.variant),
        comment: remark,
        workflowstage: update.workflowstage,
      });
      toast.success(`Status updated`);
      setRemark('');
      await refetch();
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6 text-center">Record not found</div>;

  const stageNames = ['Draft', 'Approver 1 Review', 'Approver 2 Review', 'Approver 3 Review', 'Distributed', 'Archived'];
  const stageIcons = [FileText, Shield, Shield, Shield, Send, Archive];

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/ioip')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.title || `IOIP-${id}`}</h1>
            <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {record.requestoremail || ''} &middot; Submitted {record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Policy Details Card */}
          <Card>
            <CardHeader><CardTitle className="text-lg"><FileText className="h-5 w-5 inline mr-2" />Policy Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Policy No</dt><dd className="font-medium mt-0.5">{extRecord?.iOIPPolicyNo || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Subject</dt><dd className="font-medium mt-0.5">{extRecord?.iOIPSubject || record?.title || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Revision</dt><dd className="font-medium mt-0.5">{extRecord?.iOIPReviNum || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Effective Date</dt><dd className="font-medium mt-0.5">{extRecord?.iOIPDateIssue ? format(new Date(extRecord.iOIPDateIssue), 'dd MMM yyyy') : '-'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{statusLabel}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {/* Policy Body Card */}
          {extRecord?.iOIPBody && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Policy Content</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap rounded-lg bg-muted p-4 max-h-96 overflow-y-auto">
                  {extRecord.iOIPBody}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval Stages */}
          {STAGE_ORDER.map((stageKey, idx) => {
            const StageIcon = stageIcons[idx];
            const stageName = stageNames[idx];
            const isActive = statusKey === stageKey;
            const isPast = STAGE_ORDER.indexOf(statusKey) > idx;
            const isFuture = !isActive && !isPast;
            return (
              <Card key={stageKey} className={isActive ? 'border-amber-300' : isPast ? 'border-emerald-200' : isFuture ? 'opacity-60' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StageIcon className="h-5 w-5" />
                    {stageName}
                    {isPast && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    {isActive && <Badge className="ml-auto bg-amber-100 text-amber-800">Current</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPast && <p className="text-sm text-emerald-600">Completed</p>}
                  {isActive && <p className="text-sm text-amber-600">Awaiting action</p>}
                  {isFuture && <p className="text-sm text-muted-foreground">Pending</p>}

                  {/* Show approver details for completed/active approval stages */}
                  {idx >= 1 && idx <= 3 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {extRecord?.[`iOIPApp${idx}_1` as keyof typeof extRecord] && (
                        <span>Approver: {String(extRecord[`iOIPApp${idx}_1` as keyof typeof extRecord])}</span>
                      )}
                      {extRecord?.[`iOIPStatus${idx}` as keyof typeof extRecord] === '1' && isPast && (
                        <span className="ml-3 text-emerald-600">&#10003; Approved</span>
                      )}
                    </div>
                  )}
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

          {/* Distribution Info */}
          {extRecord?.iOIPDefaultList && (
            <Card>
              <CardHeader><CardTitle className="text-base">Distribution</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div><span className="text-muted-foreground">Default:</span> {extRecord.iOIPDefaultList}</div>
                {extRecord.iOIPDistributionList && (
                  <div><span className="text-muted-foreground">Additional:</span> {extRecord.iOIPDistributionList}</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {availableActions.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} placeholder="Optional remark..." />
                </div>
                {availableActions.map(a => (
                  <Button
                    key={a.action}
                    className="w-full"
                    variant={a.variant === 'approve' ? 'default' : 'destructive'}
                    onClick={() => handleAction(a.action)}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {a.label}
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

export default IOIPDetailPage;
