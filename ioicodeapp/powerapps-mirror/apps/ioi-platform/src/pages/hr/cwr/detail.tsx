/**
 * CWR — Contract Worker Requisition Detail / Approval Screen
 * Shows request details, multi-stage approval timeline, and actions.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Building2, User, FileText, MessageSquare, Send } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMainDBHRById } from '@/hooks/use-main-dbhr';
import { MainDBHRService } from '@/services/main-dbhr-service';


const asRead = (r: any): Record<string, any> => r;

const STAGES = [
  { key: 'Submitted', label: 'Submitted', color: 'bg-blue-500' },
  { key: 'HODApproval', label: 'HOD Approval', color: 'bg-amber-500' },
  { key: 'HRReview', label: 'HR Review', color: 'bg-purple-500' },
  { key: 'VendorAssignment', label: 'Vendor Assignment', color: 'bg-cyan-500' },
  { key: 'HODFinalApproval', label: 'HOD Final Approval', color: 'bg-amber-600' },
  { key: 'Completed', label: 'Completed', color: 'bg-green-600' },
];

function getStatusBadge(action: string | undefined) {
  switch (action) {
    case 'Request': return <Badge variant="outline">Draft</Badge>;
    case 'Submitted': return <Badge className="bg-blue-500">Submitted</Badge>;
    case 'HODApproval': return <Badge className="bg-amber-500">HOD Review</Badge>;
    case 'HRReview': return <Badge className="bg-purple-500">HR Review</Badge>;
    case 'VendorAssignment': return <Badge className="bg-cyan-500">Vendor</Badge>;
    case 'HODFinalApproval': return <Badge className="bg-amber-600">Final HOD</Badge>;
    case 'Completed': return <Badge className="bg-green-600">Completed</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    case 'Withdrawn': return <Badge variant="secondary">Withdrawn</Badge>;
    default: return <Badge variant="outline">{action || 'Unknown'}</Badge>;
  }
}

function CWRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data: raw, isLoading, error } = useMainDBHRById(id!);
  const record = raw ? asRead(raw) : undefined;

  const handleAdvance = async (nextAction: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await MainDBHRService.update(id, { CurrentAction: nextAction } as any);
      toast.success(`Moved to ${nextAction}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return (
    <div className="p-6">
      <Empty><EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Not found</EmptyTitle><EmptyDescription>This request could not be loaded.</EmptyDescription></EmptyHeader>
      <Button onClick={() => navigate('/hr/cwr')} className="mt-4">Back</Button></Empty>
    </div>
  );

  const currentIdx = STAGES.findIndex((s) => s.key === record.CurrentAction);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'CWR', href: '/hr/cwr' }, { label: `#${record.Title || record.INO || record.ID}` }]} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/hr/cwr')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Request #{record.Title || record.INO || record.ID}</h1>
              {getStatusBadge(record.CurrentAction)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{record.EntitySite?.Value || 'N/A'} • Created {record.Created ? format(new Date(record.Created), 'dd MMM yyyy') : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" /> Request Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Requestor</dt><dd className="font-medium mt-0.5">{record.Requestor_DisplayName || record.Requestor_Email || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Site</dt><dd className="font-medium mt-0.5">{record.EntitySite?.Value || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Department</dt><dd className="font-medium mt-0.5">{record.Department || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Created By</dt><dd className="font-medium mt-0.5">{record.Author?.DisplayName || record.Author?.Email || 'System'}</dd></div>
                {record.Description && <div className="col-span-2"><dt className="text-muted-foreground">Justification</dt><dd className="font-medium mt-0.5 whitespace-pre-wrap">{record.Description}</dd></div>}
              </dl>
            </CardContent>
          </Card>

          {/* Approval Timeline */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" /> Approval Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-0">
                {STAGES.map((stage, idx) => {
                  const isPast = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  return (
                    <div key={stage.key} className="flex items-start gap-3 pb-4 last:pb-0">
                      <div className={`mt-1 h-4 w-4 rounded-full shrink-0 ${isPast ? (isCurrent ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-green-500') : 'bg-gray-200'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</p>
                        {isCurrent && <p className="text-xs text-amber-600 mt-0.5">Current stage</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MessageSquare className="h-5 w-5" /> Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {record.CurrentAction === 'Request' && (
                <Button className="w-full" onClick={() => handleAdvance('Submitted')} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
                </Button>
              )}
              {(record.CurrentAction === 'Submitted' || record.CurrentAction === 'HODApproval') && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAdvance('HRReview')} disabled={loading}>
                    <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleAdvance('Rejected')} disabled={loading}>
                    <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
              {record.CurrentAction === 'HRReview' && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAdvance('VendorAssignment')} disabled={loading}>
                    <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleAdvance('Rejected')} disabled={loading}>
                    <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
              {record.CurrentAction === 'VendorAssignment' && (
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleAdvance('HODFinalApproval')} disabled={loading}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Assign Vendor & Forward
                </Button>
              )}
              {record.CurrentAction === 'HODFinalApproval' && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleAdvance('Completed')} disabled={loading}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleAdvance('Rejected')} disabled={loading}>
                    <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
              {(record.CurrentAction === 'Completed') && (
                <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle2 className="h-4 w-4" /> This request is completed.</div>
              )}
              {(record.CurrentAction === 'Rejected' || record.CurrentAction === 'Withdrawn') && (
                <div className="flex items-center gap-2 text-sm text-destructive"><XCircle className="h-4 w-4" /> This request was {record.CurrentAction?.toLowerCase()}.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Record Info</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between"><span>Form Code:</span><span className="font-mono">CWR</span></div>
              <div className="flex justify-between"><span>Record ID:</span><span className="font-mono">{record.ID}</span></div>
              <div className="flex justify-between"><span>Created:</span><span>{record.Created ? format(new Date(record.Created), 'dd MMM yyyy') : '-'}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default CWRDetailPage;
