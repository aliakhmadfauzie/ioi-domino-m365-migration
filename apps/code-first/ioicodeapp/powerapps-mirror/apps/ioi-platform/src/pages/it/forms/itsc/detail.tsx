/**
 * ITSC — IT Server Checklist Detail Screen (Consolidated)
 * Single unified view for ITSC records with comprehensive field mapping
 * 2-Stage: Monitoring → Systems Manager Review
 * Fields from MainDB_IT_Ext_Assets model columns (DEC-2026-007 compliant)
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Shield, Server, Activity, Database, HardDrive, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtAssetsService } from '@/generated/services/main-dbit-ext-assets-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';
import { useUser } from '@/hooks/use-user';
import { recordITApprovalAction, statusActionType } from '@/lib/it-approval-actions';

const asRead = (r: any) => r;

const ACTIONS: Record<string, { action: string; label: string; variant: 'approve' | 'reject' }[]> = {
  'CurrentstatusKey4': [
    { action: 'CurrentstatusKey1', label: 'Approve as Systems Manager', variant: 'approve' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject' },
  ],
};
const STAGES = ['CurrentstatusKey4', 'CurrentstatusKey1'];
const STAGE_NAMES = ['Systems Manager Review', 'Approved'];

function ITSCDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');

  const { data: raw, isLoading, error, refetch } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => { if (!id) return null; const r = await MainDBITService.getAll({ filter: `id eq ${id}` }); return r[0] || null; },
    enabled: !!id,
  });
  const record = raw ? asRead(raw) : undefined;
  const statusKey = String(record?.currentStatus || '');
  const statusLabel = MainDBITCurrentstatusKeyToLabel[statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel] || statusKey;

  // Extension record with ITSC model columns
  const { data: extRaw } = useQuery({
    queryKey: ['mainDBITExtAssets', 'ITSC', id],
    queryFn: async () => { if (!id) return null; const r = await MainDBITExtAssetsService.getAll({ filter: `parentRecord/id eq ${id}` }); return r?.[0] || null; },
    enabled: !!id,
  });
  const ext = extRaw ? asRead(extRaw) as MainDBITExtAssets : undefined;

  // Parse remarks for additional fields
  let remarksData: Record<string, string | undefined> = {};
  try {
    remarksData = JSON.parse(record?.remarks || '{}');
  } catch {
    // ignore parse errors
  }

  const actions = ACTIONS[statusKey] || [];

  const handleAction = async (action: string) => {
    if (!id) return;
    const selectedAction = actions.find((item) => item.action === action);
    setLoading(true);
    try {
      await recordITApprovalAction({
        id,
        record,
        user,
        nextStatus: action,
        stageName: selectedAction?.label || 'ITSC Approval',
        actionType: statusActionType(action, selectedAction?.variant),
        comment: remark,
      });
      toast.success('Updated');
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/itsc')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{ext?.iTSCServerName || record.title || `ITSC-${id}`}</h1>
            <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Server Identification — model columns */}
          <Card><CardHeader><CardTitle className="text-lg"><Server className="h-5 w-5 inline mr-2" />Server Identification</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Server Name</dt><dd className="font-medium mt-0.5">{ext?.iTSCServerName || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{statusLabel}</dd></div>
              <div><dt className="text-muted-foreground">Checklist Year</dt><dd className="font-medium mt-0.5">{ext?.iTSCChecklistYear || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Reviewed By</dt><dd className="font-medium mt-0.5">{ext?.iTSCReviewedBy || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Reviewed Date</dt><dd className="font-medium mt-0.5">{ext?.iTSCReviewedDate ? format(new Date(ext.iTSCReviewedDate), 'dd MMM yyyy') : '-'}</dd></div>
            </dl></CardContent></Card>

          {/* Health Metrics — model columns */}
          <Card><CardHeader><CardTitle className="text-lg"><Activity className="h-5 w-5 inline mr-2" />Health Metrics</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-3 gap-4 text-sm">
              <div><dt className="text-muted-foreground">CPU Usage</dt><dd className="font-medium mt-0.5">{ext?.iTSCCPUUsage || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Memory Used</dt><dd className="font-medium mt-0.5">{ext?.iTSCMemoryUsed || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Full Memory</dt><dd className="font-medium mt-0.5">{ext?.iTSCFullMemory || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Drive Available</dt><dd className="font-medium mt-0.5">{ext?.iTSCDriveAvailable || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Drive Size</dt><dd className="font-medium mt-0.5">{ext?.iTSCDriveSize || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Drive Type</dt><dd className="font-medium mt-0.5">{ext?.iTSCDriveType || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Virus Def Date</dt><dd className="font-medium mt-0.5">{ext?.iTSCVirusDefDate || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Disk Cleanup</dt><dd className="font-medium mt-0.5">{ext?.iTSCDiskCleanup || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Win Updates</dt><dd className="font-medium mt-0.5">{ext?.iTSCWinUpdates || '-'}</dd></div>
            </dl></CardContent></Card>

          {/* Database — model columns */}
          <Card><CardHeader><CardTitle className="text-lg"><Database className="h-5 w-5 inline mr-2" />Database</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Tenant</dt><dd className="font-medium mt-0.5">{ext?.iTSCTenant || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Volume 1 (Data)</dt><dd className="font-medium mt-0.5">{ext?.iTSCVolume1 || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Volume 2 (Log)</dt><dd className="font-medium mt-0.5">{ext?.iTSCVolume2 || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Volume 3 (Trace)</dt><dd className="font-medium mt-0.5">{ext?.iTSCVolume3 || '-'}</dd></div>
            </dl></CardContent></Card>

          {/* Backup — model columns */}
          <Card><CardHeader><CardTitle className="text-lg"><HardDrive className="h-5 w-5 inline mr-2" />Backup</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Time Start</dt><dd className="font-medium mt-0.5">{ext?.iTSCTimeStart || '-'}</dd></div>
              <div><dt className="text-muted-foreground">Time End</dt><dd className="font-medium mt-0.5">{ext?.iTSCTimeEnd || '-'}</dd></div>
            </dl></CardContent></Card>

          {/* File System — remarks fields */}
          <Card><CardHeader><CardTitle className="text-lg"><HardDrive className="h-5 w-5 inline mr-2" />File System</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Physical</dt><dd className="font-medium mt-0.5">{remarksData.FS_Physical || '-'}</dd></div>
              {remarksData.FS_Size1 && <div><dt className="text-muted-foreground">FS Size</dt><dd className="font-medium mt-0.5">{remarksData.FS_Size1}</dd></div>}
              {remarksData.FS_Type3 && <div><dt className="text-muted-foreground">FS Type</dt><dd className="font-medium mt-0.5">{remarksData.FS_Type3}</dd></div>}
              {remarksData.FS_LogData && <div><dt className="text-muted-foreground">Log Data</dt><dd className="font-medium mt-0.5">{remarksData.FS_LogData}</dd></div>}
            </dl></CardContent></Card>

          {/* Personnel & Remarks */}
          <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" />Personnel & Remarks</CardTitle></CardHeader>
            <CardContent><dl className="grid grid-cols-1 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Reviewed By</dt><dd className="font-medium mt-0.5">{ext?.iTSCReviewedBy || '-'}</dd></div>
              {ext?.iTSCRemarks && <div><dt className="text-muted-foreground">Remarks</dt><dd className="font-medium mt-0.5 whitespace-pre-wrap text-xs">{ext.iTSCRemarks}</dd></div>}
            </dl></CardContent></Card>

          {STAGES.map((sk, i) => {
            const active = statusKey === sk;
            const past = STAGES.indexOf(statusKey) > i;
            return (<Card key={sk} className={active ? 'border-amber-300' : past ? 'border-emerald-200' : 'opacity-60'}>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5" />{STAGE_NAMES[i]}{past && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}{active && <Badge className="ml-auto bg-amber-100 text-amber-800">Current</Badge>}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{past ? 'Completed' : active ? 'Awaiting action' : 'Pending'}</p></CardContent></Card>);
          })}
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle className="text-sm font-semibold">Record Info</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-xs">Record #</span>
                  <p className="font-medium">{record.title}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-xs">Requestor</span>
                  <p className="font-medium">{record.requestorName || record.requestoremail || '-'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-xs">Submitted</span>
                  <p className="font-medium">{record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy HH:mm') : '-'}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-muted-foreground text-xs">Status</span>
                  <p className="font-medium">{statusLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {actions.length > 0 && (
            <Card><CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Comment</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} /></div>
                {actions.map(a => (
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

export default ITSCDetailPage;
