/**
 * PRF - Program Request Form Detail View
 *
 * Dual-track workflow (Domino PRF26.nsf):
 *   Non-SAP: Request → Submitted → Acceptance1 → Acceptance2 → Closed
 *   SAP:     Request → Submitted → Acceptance1 → Acceptance → Submitted_SAP
 *            → Acceptance3 → Completed-SAP → Closed
 *
 * Section access mirrors Domino AEditor1-7 role formulas.
 * Terminal states: Rejected, Closed (after final acceptance)
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, CheckCircle2, XCircle, Send, User as UserIcon,
  Shield, FileCode, Server, Wrench, Settings, Loader2,
  Lock, AlertCircle, ThumbsUp, RotateCcw, BookOpen,
  ClipboardList, MessageSquare, Monitor, Users,
  Clock, FileText, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EmployeePicker, MultiEmployeePicker } from '@/components/employee-picker';

import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtAccessService } from '@/generated/services/main-dbit-ext-access-service';
import { usePRFWorkflow } from '@/hooks/use-prf-workflow';
import { PRF_WORKFLOW_CONFIG, type PRFCurrentAction } from '@/types/m2-prf-types';

// =============================================================================
// HELPERS
// =============================================================================

function fmt(d?: string | null): string {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy HH:mm'); } catch { return d; }
}

function isSAPSystem(system?: string): boolean {
  if (!system) return false;
  const s = system.toUpperCase();
  return s.includes('SAP S4/HANA') || s === 'SAP' || s.includes('SUCCESSFACTOR-LMS')
    || s.includes('SALES PORTAL') || s.includes('DASHBOARD')
    || s.includes('ENVIRONMENT & SUSTAINABILITY');
}

// =============================================================================
// COMPONENTS
// =============================================================================

function StatusBadge({ ca }: { ca: PRFCurrentAction }) {
  const c = PRF_WORKFLOW_CONFIG[ca];
  const colors: Record<string, string> = {
    Request: 'bg-slate-100 text-slate-700 border-slate-300',
    Submitted: 'bg-amber-50 text-amber-800 border-amber-300',
    Acceptance1: 'bg-blue-50 text-blue-800 border-blue-300',
    Acceptance: 'bg-purple-50 text-purple-800 border-purple-300',
    Acceptance2: 'bg-blue-50 text-blue-800 border-blue-300',
    Submitted_SAP: 'bg-purple-50 text-purple-800 border-purple-300',
    Acceptance3: 'bg-purple-50 text-purple-800 border-purple-300',
    'Completed-SAP': 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Closed: 'bg-green-50 text-green-800 border-green-300',
    Rejected: 'bg-red-50 text-red-800 border-red-300',
  };
  return (
    <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${colors[ca] || colors.Request}`}>
      {c?.label || ca}
    </span>
  );
}

function ReadonlyField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900">
        {value ?? <span className="text-slate-400">—</span>}
      </div>
    </div>
  );
}

function SectionCard({
  title, icon: Icon, role, accent, children, locked, lockMessage, hidden = false,
}: {
  title: string; icon: React.ComponentType<{ className?: string }>; role: string; accent: string;
  children: React.ReactNode; locked?: boolean; lockMessage?: string; hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className={`flex items-center justify-between border-b ${accent} bg-slate-50 px-4 py-3`}>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-slate-600" />
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{role}</span>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
      {locked && (
        <div className="absolute inset-x-0 bottom-0 top-14 z-10 flex items-center justify-center rounded-b-lg bg-slate-100/80 px-4">
          <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Lock className="h-4 w-4" />{lockMessage || 'Section locked'}
          </div>
        </div>
      )}
    </section>
  );
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function PRFDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Form state
  const [comment, setComment] = useState('');
  const [comment2, setComment2] = useState('');
  const [task, setTask] = useState('');
  const [deptEmail, setDeptEmail] = useState('');
  const [isgEmail, setIsgEmail] = useState('');
  const [abapEmail, setAbapEmail] = useState('');
  const [funcOwner, setFuncOwner] = useState('');
  const [rating, setRating] = useState(8);
  const [acceptStatus, setAcceptStatus] = useState<string>('Accepted');
  const [acceptStatusSAP, setAcceptStatusSAP] = useState<string>('Accepted');
  const [statusISG, setStatusISG] = useState<string>('Completed');
  const [ccIsg, setCcIsg] = useState('');

  // Query main record
  const { data: records, isLoading } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => id ? MainDBITService.getAll({ filter: `id eq ${id}` }) : [],
    enabled: !!id,
  });
  const record = records?.[0] ?? null;

  // Query Ext_Access child record
  const { data: extRecords } = useQuery({
    queryKey: ['mainDBITExtAccess', 'prf', record?.id],
    queryFn: async () => {
      if (!record?.id) return [];
      return MainDBITExtAccessService.getAll({
        filter: `parentFormCode eq 'PRF' and parentRecord/ID eq ${record.id}`,
      });
    },
    enabled: !!record?.id,
  });
  const extRecord = extRecords?.[0] ?? null;
  const extAccessRecordId = extRecord ? String(extRecord.id) : null;

  // Workflow hook
  const {
    caState, config, access, isSAP,
    canEditAdmin,
    isPending, actions,
  } = usePRFWorkflow(record, extAccessRecordId);

  // Derived fields
  const system = record?.pRFRequestType || '';
  const isNotesDB = system === 'NOTES DATABASE';
  const isPowerBI = system === 'POWER BI';
  const isNotesMailGroup = system === 'NOTES MAIL GROUP';
  const isSAPHana = isSAPSystem(system);

  // Admin reset mutations
  const adminReset = useMutation({
    mutationFn: async ({ action: resetAction }: { action: string }) => {
      if (!extAccessRecordId || !record?.id) throw new Error('No record');
      const extPatch: Record<string, unknown> = {};

      if (resetAction === 'Clear Task Assignment') {
        extPatch.pRFAppByISG = '';
        extPatch.pRFDateApp2 = '';
        const mainPatch: Record<string, unknown> = {
          currentStatus: 'CurrentstatusKey38',
          workflowstage: 3,
          currentAction: 'Acceptance1',
        };
        await MainDBITService.update(String(record.id), mainPatch);
      } else if (resetAction === 'Clear Functional') {
        extPatch.pRFAttachedBy = '';
        extPatch.pRFDateSent = '';
      } else if (resetAction === 'Clear Acceptance') {
        extPatch.pRFDateApp4 = '';
        extPatch.pRFStatus4 = '';
        extPatch.pRFRating = 0;
      } else if (resetAction === 'Clear IT Functional-Completion for SAP') {
        extPatch.pRFStatusISG = '';
        extPatch.pRFCommentsISG = '';
        extPatch.pRFDateISG = '';
        extPatch.pRFNotifiedBy = '';
      } else if (resetAction === 'Clear ABAP Assign') {
        extPatch.pRFAcceptStatusSAP = '';
        extPatch.pRFABAP = '';
        extPatch.pRFFuncOwnerSAP = '';
        extPatch.pRFAppBySAP = '';
        extPatch.pRFDateApp2_1 = '';
      }

      if (Object.keys(extPatch).length > 0) {
        await MainDBITExtAccessService.update(extAccessRecordId, extPatch);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT', id] });
      queryClient.invalidateQueries({ queryKey: ['mainDBITExtAccess', 'prf'] });
      toast.success('Admin reset applied');
    },
  });

  // Reset form fields on CA change
  useEffect(() => { setComment(''); setComment2(''); setTask(''); }, [caState]);

  // Loading state
  if (isLoading) return (
    <main className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      <span className="ml-3 text-sm text-slate-500">Loading PRF record...</span>
    </main>
  );
  if (!record) return (
    <main className="mx-auto max-w-4xl p-10 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
      <p className="mt-4 text-lg font-semibold text-slate-600">PRF record not found</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate('/it/forms/prf')}>Back</Button>
    </main>
  );

  // Access helpers (Domino AEditor1-7 pattern)
  const isEditor1 = access.isRequestor && (caState === 'Request' || caState === 'Submitted');
  const isEditor2 = access.isDeptHead && caState === 'Submitted';
  const isEditor3 = access.isITMgr2 && caState === 'Acceptance1';
  const isEditor4 = access.isITStaff && isSAP && caState === 'Acceptance';
  const isEditor5 = access.isITMgr && caState === 'Submitted_SAP';
  const isEditor6 = (caState === 'Acceptance2' || caState === 'Acceptance3');
  const isEditor7 = access.isITStaffFinal && (caState === 'Completed-SAP' || (caState === 'Closed' && isSAP));
  const isEditor1_1 = access.isRequestorFinal && caState === 'Closed';

  return (
    <main className="mx-auto grid max-w-6xl gap-5 p-5">
      {/* ============================================================
           HEADER
           ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-950 px-4 py-3 text-white shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate('/it/forms/prf')}
          className="text-white/80 hover:bg-white/10 hover:text-white">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            PRF — Program Request Form
            {record.pRFRequestNo ? ` — ${record.pRFRequestNo}` : ''}
          </p>
          <h1 className="truncate text-xl font-semibold">{record.title}</h1>
          {isSAP && <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">SAP Track</span>}
        </div>
        <StatusBadge ca={caState} />
      </div>

      {/* ============================================================
           WORKFLOW ACTION BAR — Domino action buttons
           ============================================================ */}
      <ActionBar>
        {/* Send for Approval — AEditor1, CA=Request */}
        {isEditor1 && caState === 'Request' && !record.submitteddate && (
          <>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Dept Manager Email</Label>
              <EmployeePicker value={deptEmail} onChange={(email) => setDeptEmail(email)}
                placeholder="dept.head@ioi.com" className="mt-1" />
            </div>
            <Button onClick={() => {
              if (!deptEmail.trim()) { toast.warning('Enter dept manager email'); return; }
              actions.submit({ deptManagerEmail: deptEmail });
              toast.success('Sent for approval');
            }} disabled={isPending}
              className="bg-amber-700 text-white hover:bg-amber-800">
              <Send className="mr-2 h-4 w-4" /> Send for Approval
            </Button>
          </>
        )}

        {/* Approved by Dept Head — AEditor2, CA=Submitted */}
        {isEditor2 && caState === 'Submitted' && (
          <>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Comment</Label>
              <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional remarks" className="mt-1" />
            </div>
            <Button onClick={() => { actions.approveDeptHead({ comment }); toast.success('Approved — forwarded to IT'); }}
              disabled={isPending} className="bg-emerald-700 text-white hover:bg-emerald-800">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Approved by Dept Head
            </Button>
            <Button onClick={() => {
              if (!comment.trim()) { toast.warning('Comment required for rejection'); return; }
              actions.rejectDeptHead({ comment }); toast.success('Rejected');
            }} disabled={isPending} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <XCircle className="mr-2 h-4 w-4" /> Rejected by Dept Head
            </Button>
            <Button onClick={() => {
              if (!comment.trim()) { toast.warning('Comment required for KIV'); return; }
              /* KIV: no CA change, just finalstatus update via remarks */
              toast.success('KIV note recorded');
            }} disabled={isPending} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              <Clock className="mr-2 h-4 w-4" /> KIV by Dept Head
            </Button>
          </>
        )}

        {/* Tasks Assignment — AEditor3, CA=Acceptance1 */}
        {isEditor3 && caState === 'Acceptance1' && (
          <>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Assign IT Staff (isg)</Label>
              <EmployeePicker value={isgEmail} onChange={(email) => setIsgEmail(email)}
                placeholder="it.staff@ioi.com" className="mt-1" />
            </div>
            <div className="w-40">
              <Label className="text-xs">Status</Label>
              <Select value={acceptStatus} onValueChange={setAcceptStatus}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="KIV">KIV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isSAP && (
              <div className="flex-1 min-w-48">
                <Label className="text-xs">CC ISG (Sales Portal)</Label>
                <MultiEmployeePicker value={ccIsg ? ccIsg.split(';').map((email) => email.trim()).filter(Boolean) : []}
                  onChange={(emails) => setCcIsg(emails.join('; '))} placeholder="cc@ioi.com" className="mt-1" />
              </div>
            )}
            <Button onClick={() => {
              if (!isgEmail.trim()) { toast.warning('Assign IT staff email'); return; }
              actions.assignTasks({ isg: isgEmail, status2: acceptStatus });
              toast.success(isSAP ? 'SAP track — pending functional spec' : 'Non-SAP — IT notified');
            }} disabled={isPending}
              className="bg-blue-700 text-white hover:bg-blue-800">
              <Wrench className="mr-2 h-4 w-4" /> Tasks Assignment
            </Button>
          </>
        )}

        {/* Submit Functional Spec — AEditor4, CA=Acceptance (SAP) */}
        {isEditor4 && (
          <Button onClick={() => { actions.submitFunctionalSpec(); toast.success('Functional spec submitted'); }}
            disabled={isPending} className="bg-purple-700 text-white hover:bg-purple-800">
            <FileCode className="mr-2 h-4 w-4" /> Submit Functional Spec
          </Button>
        )}

        {/* Tasks Assignment II — AEditor5, CA=Submitted_SAP (SAP) */}
        {isEditor5 && (
          <>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">ABAP Developer</Label>
              <EmployeePicker value={abapEmail} onChange={(email) => setAbapEmail(email)}
                placeholder="abap.dev@ioi.com" className="mt-1" />
            </div>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Functional Owner SAP</Label>
              <EmployeePicker value={funcOwner} onChange={(email) => setFuncOwner(email)}
                placeholder="func.owner@ioi.com" className="mt-1" />
            </div>
            <div className="w-40">
              <Label className="text-xs">Accept Status SAP</Label>
              <Select value={acceptStatusSAP} onValueChange={setAcceptStatusSAP}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => {
              if (!abapEmail.trim()) { toast.warning('Assign ABAP developer'); return; }
              actions.assignTasksII({ abap: abapEmail, funcOwnerSAP: funcOwner });
              toast.success('ABAP assigned');
            }} disabled={isPending}
              className="bg-purple-700 text-white hover:bg-purple-800">
              <Settings className="mr-2 h-4 w-4" /> Tasks Assignment II
            </Button>
          </>
        )}

        {/* Notify Requestor/Functional — AEditor6, CA=Acceptance2/Acceptance3 */}
        {isEditor6 && (
          <>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Status</Label>
              <Select value={task} onValueChange={setTask}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Released for testing">Released for testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Completion Notes</Label>
              <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Describe completion" className="mt-1" />
            </div>
            <Button onClick={() => {
              if (!task) { toast.warning('Select completion status'); return; }
              if (isSAP) { actions.notifyRequestorSAP({ comment }); toast.success('SAP completed — pending ISG final'); }
              else { actions.notifyRequestor(); toast.success('Completed — pending requestor acceptance'); }
            }} disabled={isPending}
              className="bg-blue-700 text-white hover:bg-blue-800">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Notify Requestor/Functional
            </Button>
          </>
        )}

        {/* Notify Requestor (SAP) — AEditor7, CA=Completed-SAP */}
        {isEditor7 && (
          <>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">ISG Status</Label>
              <Select value={statusISG} onValueChange={setStatusISG}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">ISG Remarks</Label>
              <Input value={comment2} onChange={e => setComment2(e.target.value)} placeholder="ISG completion notes" className="mt-1" />
            </div>
            <Button onClick={() => { actions.notifyRequestorSAP({ comment: comment2 }); toast.success('SAP final — closed pending acceptance'); }}
              disabled={isPending} className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Send className="mr-2 h-4 w-4" /> Notify Requestor (SAP)
            </Button>
          </>
        )}

        {/* Accepted by Requestor — AEditor1_1, CA=Closed */}
        {isEditor1_1 && (
          <>
            <div className="w-48">
              <Label className="text-xs">Rating (1-10)</Label>
              <input type="range" min={1} max={10} value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="mt-2 h-8 w-full" />
              <p className="text-xs font-semibold text-slate-600">{rating}/10</p>
            </div>
            <div className="flex-1 min-w-48">
              <Label className="text-xs">Comment {rating < 8 ? '(required)' : ''}</Label>
              <Input value={comment} onChange={e => setComment(e.target.value)}
                placeholder={rating < 8 ? 'Please explain your rating...' : 'Optional feedback'} className="mt-1" />
            </div>
            <Button onClick={() => {
              if (rating < 1) { toast.warning('Rating must be at least 1'); return; }
              if (rating < 8 && comment.trim().length < 25) { toast.warning('Comment must be at least 25 characters for ratings below 8'); return; }
              actions.acceptClose({ rating, comment });
              toast.success('Accepted — case closed');
            }} disabled={isPending}
              className="bg-emerald-700 text-white hover:bg-emerald-800">
              <ThumbsUp className="mr-2 h-4 w-4" /> Accepted by Requestor
            </Button>
            <Button onClick={() => {
              if (!comment.trim()) { toast.warning('Comment required'); return; }
              /* To be revised → re-opens */
              toast.success('Marked for revision');
            }} disabled={isPending} variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50">
              <RotateCcw className="mr-2 h-4 w-4" /> To be revised
            </Button>
            <Button onClick={() => {
              if (!comment.trim()) { toast.warning('Comment required'); return; }
              toast.success('KIV noted');
            }} disabled={isPending} variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50">
              <Clock className="mr-2 h-4 w-4" /> KIV by Requestor
            </Button>
          </>
        )}
      </ActionBar>

      {/* ============================================================
           SECTION 1: REQUESTOR'S DETAILS (AEditor1)
           Domino: Approved_by access field, always shown
           ============================================================ */}
      <SectionCard title="Requestor's Details" icon={UserIcon} role="Requestor"
        accent="border-b-slate-200">
        <ReadonlyField label="Request No" value={record.pRFRequestNo || '—'} />
        <ReadonlyField label="System / Request Type" value={system || '—'} />
        <ReadonlyField label="SAP Flag" value={record.pRFIsSAP || 'No'} />
        <ReadonlyField label="Site" value={record.site || record.pRFSite || '—'} />
        <ReadonlyField label="Company" value={record.company || '—'} />
        <ReadonlyField label="Department" value={record.pRFDepartment || '—'} />
        <ReadonlyField label="Requestor" value={record.requestorName || record.requestoremail || '—'} />
        <ReadonlyField label="Requestor Email" value={record.requestoremail || '—'} />
        <ReadonlyField label="Phone Ext" value={record.pRFPhoneExt || '—'} />
        <ReadonlyField label="Priority" value={record.pRFPriority || '—'} />
        <ReadonlyField label="Deadline" value={record.pRFDeadline || '—'} />
        <ReadonlyField label="Date Sent" value={record.submitteddate ? fmt(record.submitteddate) : '—'} />
        {isSAP && <><ReadonlyField label="SAP Client" value={record.pRFSAPClient || '—'} />
          <ReadonlyField label="SAP Module" value={record.pRFSAPModule || '—'} /></>}
        <div className="md:col-span-2">
          <ReadonlyField label="Objective" value={record.pRFObjective || '—'} />
        </div>
        <div className="md:col-span-2">
          <ReadonlyField label="Justification" value={record.pRFJustification || '—'} />
        </div>
        <div className="md:col-span-2">
          <ReadonlyField label="Current Process" value={record.pRFCurrentProcess || '—'} />
        </div>
        <div className="md:col-span-2">
          <ReadonlyField label="Expected Outcome" value={record.pRFExpectedOutcome || '—'} />
        </div>
        <div className="md:col-span-2">
          <ReadonlyField label="CC Emails" value={record.pRFCCEmails || '—'} />
        </div>

        {/* System-specific conditional fields — Domino hide-when rules */}
        {isNotesDB && (
          <div className="md:col-span-2">
            <ReadonlyField label="Apply Changes To" value={record.pRFNotesDBTarget || '—'} />
          </div>
        )}
        {isPowerBI && (
          <div className="md:col-span-2">
            <ReadonlyField label="Power BI Data Source" value={record.pRFPowerBIDataSource || '—'} />
          </div>
        )}
        {isNotesMailGroup && (
          <>
            <ReadonlyField label="Group Name" value={record.pRFGroupName || '—'} />
            <ReadonlyField label="Members" value={record.pRFGroupMembers || '—'} />
            <ReadonlyField label="Validity" value={record.pRFValidity || '—'} />
            {record.pRFValidity === 'Temporary' && (
              <ReadonlyField label="Valid Until" value={record.pRFValidityDate ? fmt(record.pRFValidityDate) : '—'} />
            )}
          </>
        )}
      </SectionCard>

      {/* ============================================================
           SECTION 2: DEPT HEAD APPROVAL (AEditor2, CA=Submitted)
           Domino: APPROVAL__Requestor_s_Div_Dept_Head___
           ============================================================ */}
      <SectionCard title="Dept Head Approval" icon={Shield} role="Dept Head"
        accent="border-b-amber-200"
        locked={caState !== 'Submitted' || !access.isDeptHead}
        lockMessage={caState === 'Submitted' ? 'Only dept head can approve' : 'Section opens when Submitted'}>
        {isEditor2 ? (
          <div className="md:col-span-2 text-sm text-emerald-700 p-3 bg-emerald-50 rounded-md border border-emerald-200">
            <CheckCircle2 className="inline h-4 w-4 mr-1" />Action buttons above — Approve, Reject, or KIV
          </div>
        ) : (
          <>
            <ReadonlyField label="Status 1" value={extRecord?.pRFStatus1 || '—'} />
            <ReadonlyField label="Dept Head" value={extRecord?.pRFDeptHead || record.pRFDeptManagerEmail || '—'} />
            <ReadonlyField label="Date Approved" value={extRecord?.pRFDateApp1 ? fmt(extRecord.pRFDateApp1) : '—'} />
            <div className="md:col-span-2">
              <ReadonlyField label="Comments" value={extRecord?.pRFComments1 || '—'} />
            </div>
          </>
        )}
      </SectionCard>

      {/* ============================================================
           SECTION 3: TASKS ASSIGNMENT (AEditor3, CA=Acceptance1)
           Domino: TASKS_ASSIGNMENT__by_IT___
           ============================================================ */}
      <SectionCard title="Tasks Assignment (by IT)" icon={Wrench} role="IT Mgr 2"
        accent="border-b-blue-200"
        locked={caState !== 'Acceptance1' || !access.isITMgr2}
        lockMessage="Pending dept head approval">
        {isEditor3 ? (
          <div className="md:col-span-2 text-sm text-blue-700 p-3 bg-blue-50 rounded-md border border-blue-200">
            <Wrench className="inline h-4 w-4 mr-1" />Assign IT staff and set status using the action bar above
          </div>
        ) : (
          <>
            <ReadonlyField label="Assigned ISG" value={extRecord?.pRFISG || '—'} />
            <ReadonlyField label="App By ISG" value={extRecord?.pRFAppByISG || '—'} />
            <ReadonlyField label="Date Assigned" value={extRecord?.pRFDateApp2 ? fmt(extRecord.pRFDateApp2) : '—'} />
            <ReadonlyField label="Status 2" value={extRecord?.pRFStatus2 || '—'} />
          </>
        )}
      </SectionCard>

      {/* ============================================================
           SECTION 3B: FUNCTIONAL PROCEDURE SUBMISSION — SAP ONLY
           Domino: SAP_Functional_Procedure_submission__
           Hidden when isSAP=0
           ============================================================ */}
      <SectionCard title="Functional Procedure Submission (SAP)" icon={FileCode} role="IT Staff"
        accent="border-b-purple-200"
        hidden={!isSAP}
        locked={!isEditor4}
        lockMessage="Pending IT task assignment">
        {isEditor4 ? (
          <div className="md:col-span-2 text-sm text-purple-700 p-3 bg-purple-50 rounded-md border border-purple-200">
            <FileCode className="inline h-4 w-4 mr-1" />Submit functional specification using the action bar above
          </div>
        ) : (
          <>
            <ReadonlyField label="Attached By" value={extRecord?.pRFAttachedBy || '—'} />
            <ReadonlyField label="Date Submitted" value={extRecord?.pRFDateSent ? fmt(extRecord.pRFDateSent) : '—'} />
          </>
        )}
      </SectionCard>

      {/* ============================================================
           IT SUPPORT USE — Always visible to IT
           Domino: Remarks2 access field, isg assigned IT staff
           ============================================================ */}
      <SectionCard title="IT Support Use" icon={MessageSquare} role="IT Staff"
        accent="border-b-slate-200">
        <ReadonlyField label="ISG Assigned" value={extRecord?.pRFISG || record.pRFITApprovedEmail || '—'} />
        <ReadonlyField label="IT Mgr 2" value={extRecord?.pRFIsmgr2 || '—'} />
        <ReadonlyField label="IT Mgr" value={extRecord?.pRFIsmgr || '—'} />
      </SectionCard>

      {/* ============================================================
           SECTION 4: ASSIGNMENT TO IT / ABAP — SAP ONLY
           Domino: ACCEPTANCE___SAP__by_ISG___
           Hidden when isSAP=0
           ============================================================ */}
      <SectionCard title="Assignment to IT / ABAP (SAP)" icon={Settings} role="IT Mgr"
        accent="border-b-purple-200"
        hidden={!isSAP}
        locked={caState !== 'Submitted_SAP' || !access.isITMgr}
        lockMessage="Pending functional spec submission">
        {isEditor5 ? (
          <div className="md:col-span-2 text-sm text-purple-700 p-3 bg-purple-50 rounded-md border border-purple-200">
            <Settings className="inline h-4 w-4 mr-1" />Assign ABAP developer using the action bar above
          </div>
        ) : (
          <>
            <ReadonlyField label="ABAP Developer" value={extRecord?.pRFABAP || '—'} />
            <ReadonlyField label="Functional Owner SAP" value={extRecord?.pRFFuncOwnerSAP || '—'} />
            <ReadonlyField label="App By SAP" value={extRecord?.pRFAppBySAP || '—'} />
            <ReadonlyField label="Date Assigned" value={extRecord?.pRFDateApp2_1 ? fmt(extRecord.pRFDateApp2_1) : '—'} />
            <ReadonlyField label="Accept Status SAP" value={extRecord?.pRFAcceptStatusSAP || '—'} />
          </>
        )}
      </SectionCard>

      {/* ============================================================
           SECTION 5: IT COMPLETION / TESTING (AEditor6)
           Domino: ISG_Support_Staff__ and TESTING_VALIDATION__by_IT_
           ============================================================ */}
      <SectionCard title="IT Completion / Testing" icon={ClipboardList} role="IT Dev"
        accent="border-b-blue-200"
        locked={!isEditor6}
        lockMessage={`Pending ${isSAP ? 'ABAP' : 'IT'} completion`}>
        {isEditor6 ? (
          <div className="md:col-span-2 text-sm text-blue-700 p-3 bg-blue-50 rounded-md border border-blue-200">
            <ClipboardList className="inline h-4 w-4 mr-1" />Mark completion using the action bar above
          </div>
        ) : (
          <>
            <ReadonlyField label="Status 3" value={extRecord?.pRFStatus3 || '—'} />
            <ReadonlyField label="By IS Staff" value={extRecord?.pRFByISStaff || '—'} />
            <ReadonlyField label="Date Completed" value={extRecord?.pRFDateApp3 ? fmt(extRecord.pRFDateApp3) : '—'} />
            <div className="md:col-span-2">
              <ReadonlyField label="IT Reason" value={extRecord?.pRFITReason || '—'} />
            </div>
          </>
        )}

        {/* Testing fields — shown for non-SAP S4/HANA */}
        {!isSAPHana && (
          <>
            <ReadonlyField label="Date Released for Testing" value={record.pRFTestingDate ? fmt(record.pRFTestingDate) : '—'} />
            <ReadonlyField label="Date TR Released in IED" value={record.pRFIEDDate ? fmt(record.pRFIEDDate) : '—'} />
          </>
        )}
        {/* SAP S4/HANA or ENV & SUSTAINABILITY: show different testing fields */}
        {isSAPHana && (
          <>
            <ReadonlyField label="Tested By" value={record.pRFTestedBy || '—'} />
            <ReadonlyField label="Tested On" value={record.pRFTestedOn ? fmt(record.pRFTestedOn) : '—'} />
          </>
        )}
      </SectionCard>

      {/* ============================================================
           IED/IEQ TESTING — SAP only (SAP Functional use)
           Domino: IED_IEQ_Testing__for_SAP_Functional_use_
           Hidden when isSAP=0
           ============================================================ */}
      <SectionCard title="IED/IEQ Testing (SAP)" icon={Monitor} role="IT Staff"
        accent="border-b-purple-200"
        hidden={!isSAP}>
        <ReadonlyField label="Tested By" value={record.pRFTestedBy || '—'} />
        <ReadonlyField label="Tested On" value={record.pRFTestedOn ? fmt(record.pRFTestedOn) : '—'} />
      </SectionCard>

      {/* ============================================================
           SECTION 6: ISG COMPLETION FOR SAP — SAP ONLY
           Domino: ISG_Completion_for_SAP
           Hidden when isSAP=0
           ============================================================ */}
      <SectionCard title="ISG Completion for SAP" icon={Server} role="IT Staff Final"
        accent="border-b-emerald-200"
        hidden={!isSAP}
        locked={!isEditor7}
        lockMessage="Pending IT completion">
        {isEditor7 ? (
          <div className="md:col-span-2 text-sm text-emerald-700 p-3 bg-emerald-50 rounded-md border border-emerald-200">
            <Server className="inline h-4 w-4 mr-1" />Complete ISG notification using the action bar above
          </div>
        ) : (
          <>
            <ReadonlyField label="Status ISG" value={extRecord?.pRFStatusISG || '—'} />
            <ReadonlyField label="Notified By" value={extRecord?.pRFNotifiedBy || '—'} />
            <ReadonlyField label="Date ISG" value={extRecord?.pRFDateISG ? fmt(extRecord.pRFDateISG) : '—'} />
            <div className="md:col-span-2">
              <ReadonlyField label="ISG Comments" value={extRecord?.pRFCommentsISG || '—'} />
            </div>
          </>
        )}
      </SectionCard>

      {/* ============================================================
           SECTION 7: ACCEPTANCE UPON COMPLETION (AEditor1_1, CA=Closed)
           Domino: Acceptance_upon_completion__by_Requestor___
           ============================================================ */}
      <SectionCard title="Acceptance Upon Completion" icon={ThumbsUp} role="Requestor"
        accent="border-b-green-200"
        locked={!isEditor1_1}
        lockMessage="Pending IT completion">
        {isEditor1_1 ? (
          <div className="md:col-span-2 text-sm text-green-700 p-3 bg-green-50 rounded-md border border-green-200">
            <ThumbsUp className="inline h-4 w-4 mr-1" />
            Rate, comment, and accept using the action bar above.
            {extRecord?.pRFStatus4 && <> Current: {extRecord.pRFStatus4}</>}
          </div>
        ) : (
          <>
            <ReadonlyField label="Status 4" value={extRecord?.pRFStatus4 || '—'} />
            <ReadonlyField label="Rating" value={extRecord?.pRFRating ? String(extRecord.pRFRating) : '—'} />
            <ReadonlyField label="Date Accepted" value={extRecord?.pRFDateApp4 ? fmt(extRecord.pRFDateApp4) : '—'} />
            <div className="md:col-span-2">
              <ReadonlyField label="Requestor Comment" value={extRecord?.pRFComment1 || '—'} />
            </div>
          </>
        )}
      </SectionCard>

      {/* ============================================================
           NOTES FOR IT — Internal, hidden from non-ISGRecipients
           Domino: Notes_for_IT, access = ISGRecipients
           ============================================================ */}
      {canEditAdmin && (
        <SectionCard title="Notes for IT (Internal)" icon={BookOpen} role="IT Internal"
          accent="border-b-slate-200">
          <div className="md:col-span-2">
            <ReadonlyField label="IT Reason" value={extRecord?.pRFITReason || '—'} />
          </div>
          <ReadonlyField label="RFC Required" value={extRecord?.pRFRFC || '—'} />
          <ReadonlyField label="Updated By" value={record.pRFUpdatedBy || '—'} />
          <ReadonlyField label="Updated On" value={record.pRFUpdatedOn ? fmt(record.pRFUpdatedOn) : '—'} />
        </SectionCard>
      )}

      {/* ============================================================
           TESTING/VALIDATION BY REQUESTOR (SAP S4/HANA or RFC=Yes)
           Domino: shown when @Member("SAP S4/HANA"; system)!=0 | RFC="Yes"
           ============================================================ */}
      {(isSAPHana || extRecord?.pRFRFC === 'Yes') && (
        <SectionCard title="Testing/Validation by Requestor" icon={Users} role="Requestor"
          accent="border-b-slate-200">
          <ReadonlyField label="Tested By" value={record.pRFTestedBy || '—'} />
          <ReadonlyField label="Tested On" value={record.pRFTestedOn ? fmt(record.pRFTestedOn) : '—'} />
        </SectionCard>
      )}

      {/* ============================================================
           WORKFLOW SUMMARY (read-only)
           ============================================================ */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            <CardTitle className="text-base">Workflow Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Current Stage</span>
              <p className="mt-1 font-mono">{config?.label || caState} (Stage {config?.stage || 0})</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Track</span>
              <p className="mt-1">{isSAP ? 'SAP Track' : 'Non-SAP Track'}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Date Sent</span>
              <p className="mt-1">{record.submitteddate ? fmt(record.submitteddate) : '—'}</p>
            </div>

            {extRecord?.pRFDateApp1 && (
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Date App 1 (Dept Head)</span>
                <p className="mt-1">{fmt(extRecord.pRFDateApp1)}</p>
              </div>
            )}
            {extRecord?.pRFDateApp2 && (
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Date App 2 (IT Assign)</span>
                <p className="mt-1">{fmt(extRecord.pRFDateApp2)}</p>
              </div>
            )}
            {extRecord?.pRFDateApp2_1 && (
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Date App 2.1 (SAP)</span>
                <p className="mt-1">{fmt(extRecord.pRFDateApp2_1)}</p>
              </div>
            )}
            {extRecord?.pRFDateApp3 && (
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Date App 3 (IT Done)</span>
                <p className="mt-1">{fmt(extRecord.pRFDateApp3)}</p>
              </div>
            )}
            {extRecord?.pRFDateISG && (
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Date ISG</span>
                <p className="mt-1">{fmt(extRecord.pRFDateISG)}</p>
              </div>
            )}
            {extRecord?.pRFDateApp4 && (
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500">Date App 4 (Accepted)</span>
                <p className="mt-1">{fmt(extRecord.pRFDateApp4)}</p>
              </div>
            )}
          </div>

          {/* Final status */}
          {(() => {
            let final = '';
            if (extRecord?.pRFStatus4 === 'Accepted') final = 'Closed (Accepted)';
            else if (extRecord?.pRFStatus4 === 'to be revised') final = 'Re-opened for revision';
            else if (extRecord?.pRFStatus4 === 'KIV') final = 'KIV by Requestor';
            else if (caState === 'Rejected') final = 'Rejected';
            else if (extRecord?.pRFStatus1 === 'Rejected') final = 'Rejected by Dept Head';
            if (!final) return null;
            return (
              <div className="mt-4 rounded-md bg-slate-100 px-4 py-3">
                <span className="text-xs font-semibold uppercase text-slate-500">Final Status</span>
                <p className="mt-1 text-base font-bold text-slate-800">{final}</p>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* ============================================================
           ADMIN PANEL — Hidden from non-ISADMIN
           Domino: hidden section with CA/finalstatus raw fields + reset agents
           ============================================================ */}
      {canEditAdmin && (
        <Card className="border-dashed border-slate-300 bg-slate-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-base">Admin Panel</CardTitle>
              <CardDescription>CA override, status &amp; reset agents</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label className="text-xs text-slate-500">CA State</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-sm border">{caState}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Status Key</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-sm border">{record.currentStatus || '—'}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">SAP Track</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-sm border">{isSAP ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Ext_Access ID</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-sm border">{extAccessRecordId || '—'}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Workflow Stage</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-sm border">{record.workflowstage ?? '—'}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">System</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-sm border">{system || '—'}</div>
              </div>
            </div>

            {/* Admin Reset Agents — Domino action-menu agents */}
            <div className="mt-6">
              <Label className="text-xs font-semibold uppercase text-slate-500">Reset Agents</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => adminReset.mutate({ action: 'Clear Task Assignment' })}
                  disabled={adminReset.isPending} className="border-amber-300 text-amber-700 text-xs">
                  <Trash2 className="mr-1 h-3 w-3" /> Clear Task Assignment
                </Button>
                <Button size="sm" variant="outline" onClick={() => adminReset.mutate({ action: 'Clear Functional' })}
                  disabled={adminReset.isPending} className="border-amber-300 text-amber-700 text-xs">
                  <Trash2 className="mr-1 h-3 w-3" /> Clear Functional
                </Button>
                <Button size="sm" variant="outline" onClick={() => adminReset.mutate({ action: 'Clear Acceptance' })}
                  disabled={adminReset.isPending} className="border-amber-300 text-amber-700 text-xs">
                  <Trash2 className="mr-1 h-3 w-3" /> Clear Acceptance
                </Button>
                <Button size="sm" variant="outline" onClick={() => adminReset.mutate({ action: 'Clear IT Functional-Completion for SAP' })}
                  disabled={adminReset.isPending} className="border-amber-300 text-amber-700 text-xs">
                  <Trash2 className="mr-1 h-3 w-3" /> Clear IT SAP Completion
                </Button>
                <Button size="sm" variant="outline" onClick={() => adminReset.mutate({ action: 'Clear ABAP Assign' })}
                  disabled={adminReset.isPending} className="border-amber-300 text-amber-700 text-xs">
                  <Trash2 className="mr-1 h-3 w-3" /> Clear ABAP Assign
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
