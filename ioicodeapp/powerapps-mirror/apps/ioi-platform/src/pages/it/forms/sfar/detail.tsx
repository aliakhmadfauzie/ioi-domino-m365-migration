/**
 * SFAR — Share Folder Access Request Detail / Approval Screen
 * Owner review → IT Verification → IT Processing workflow
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/hr/status-badge';
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
  'CurrentstatusKey49': [ // Pending Owner
    { action: 'CurrentstatusKey44', label: 'Verify & Approve', variant: 'approve', stage: 'Owner' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'Owner' },
  ],
  'CurrentstatusKey44': [ // Pending IT Verifier
    { action: 'CurrentstatusKey1', label: 'Complete Processing', variant: 'approve', stage: 'IT' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'IT' },
  ],
};

function SFARDetailPage() {
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
      await recordITApprovalAction({
        id,
        record,
        user,
        nextStatus: action,
        stageName: selectedAction?.stage || selectedAction?.label || 'SFAR Approval',
        actionType: statusActionType(action, selectedAction?.variant),
        comment: remark,
      });
      toast.success(`Status updated`);
      setRemark('');
      await refetch();
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6 text-center">Record not found</div>;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/sfar')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.title || `SFAR-${id}`}</h1>
            <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{record.requestoremail || ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg"><FileText className="h-5 w-5 inline mr-2" />Request Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium mt-0.5">{record.title || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{statusLabel}</dd></div>
                <div><dt className="text-muted-foreground">Requestor</dt><dd className="font-medium mt-0.5">{record.requestoremail || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium mt-0.5">{record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : '-'}</dd></div>
              </dl>
            </CardContent>
          </Card>

          {['CurrentstatusKey49', 'CurrentstatusKey44'].map((sk, idx) => {
            const names = ['Folder Owner Review', 'IT Verification'];
            const isActive = statusKey === sk;
            const order = ['CurrentstatusKey49', 'CurrentstatusKey44', 'CurrentstatusKey1'];
            const isPast = order.indexOf(statusKey) > idx || statusKey === 'CurrentstatusKey1';
            return (
              <Card key={sk} className={isActive ? 'border-amber-300' : isPast ? 'border-emerald-200' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />{names[idx]}
                    {isPast && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{isPast ? 'Completed' : isActive ? 'Awaiting action' : 'Pending'}</p>
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
    </div>
  );
}

export default SFARDetailPage;
