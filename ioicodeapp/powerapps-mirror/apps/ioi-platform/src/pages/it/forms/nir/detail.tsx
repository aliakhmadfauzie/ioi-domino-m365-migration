/**
 * NIR - Notes ID Request Detail View
 *
 * Domino LNIDRequest.nsf workflow:
 *   Section 1: Requestor's Details     (Editor1 — CA=Request)
 *   Section 2: ISG HOD Approval        (Editor2 — CA=Submitted)
 *   Section 3: Notes Admin / PIC       (Editor3 — CA=ISGHODApproved)
 *   Section 4: HWG Configuration       (Editor4 — CA=Done)
 *   Hidden Admin Panel                 (ISADMIN always)
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Send,
  User as UserIcon,
  Shield,
  Settings,
  Wrench,
  HardDrive,
  Loader2,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { MainDBITService } from '@/generated/services/main-dbit-service';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import {
  useNIRWorkflow,
  parseNIRRecord,
  computeHWGRouting,
  getHWGLabel,
  type NIRRecord,
} from '@/hooks/use-nir-workflow';
import type { NIRCurrentAction } from '@/types/m1-forms';
import { NIR_WORKFLOW_CONFIG } from '@/types/m1-forms';

// =============================================================================
// STATUS BADGE
// =============================================================================

function NIRStatusBadge({ ca }: { ca: NIRCurrentAction }) {
  const config = NIR_WORKFLOW_CONFIG[ca];
  const colors: Record<string, string> = {
    Request: 'bg-slate-100 text-slate-700 border-slate-300',
    Submitted: 'bg-amber-50 text-amber-800 border-amber-300',
    ISGHODApproved: 'bg-blue-50 text-blue-800 border-blue-300',
    ISGHODRejected: 'bg-red-50 text-red-800 border-red-300',
    Done: 'bg-purple-50 text-purple-800 border-purple-300',
    Completed: 'bg-green-50 text-green-800 border-green-300',
    HODRejected: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${colors[ca] || colors.Request}`}>
      {config?.label || ca}
    </span>
  );
}

// =============================================================================
// STAGE TIMELINE
// =============================================================================

const STAGES = [
  { key: 'Request', label: 'Request', actor: 'Requestor' },
  { key: 'Submitted', label: 'ISG HOD', actor: 'HOD' },
  { key: 'ISGHODApproved', label: 'Notes Admin', actor: 'PIC' },
  { key: 'Done', label: 'HWG Config', actor: 'HWG' },
  { key: 'Completed', label: 'Completed', actor: 'Done' },
];

function StageTimeline({ ca }: { ca: NIRCurrentAction }) {
  const currentStage = NIR_WORKFLOW_CONFIG[ca]?.stage ?? 1;

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-5">
      {STAGES.map((stage, index) => {
        const stageNum = index + 1;
        const isPast = stageNum < currentStage;
        const isCurrent = stageNum === currentStage;
        const isTerminal = NIR_WORKFLOW_CONFIG[ca]?.isTerminal && isCurrent;

        const color = isPast
          ? 'bg-emerald-800'
          : isCurrent
            ? isTerminal
              ? 'bg-red-800'
              : 'bg-blue-800'
            : 'bg-slate-300';

        return (
          <div key={stage.key} className="flex items-center gap-3 sm:flex-col sm:items-start">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white sm:h-8 sm:w-8 sm:text-xs ${color}`}>
              {isPast ? <CheckCircle2 className="h-4 w-4" /> : stageNum}
            </span>
            <span className="text-sm font-medium text-slate-700">{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// SECTION WRAPPER
// =============================================================================

function SectionCard({
  title,
  icon: Icon,
  role,
  accent,
  locked,
  lockMessage,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  role: string;
  accent: string;
  editable: boolean;
  locked: boolean;
  lockMessage: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className={`flex items-center justify-between border-b ${accent} bg-slate-50`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Icon className="h-5 w-5 text-slate-600" />
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        </div>
        <span className="mr-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {role}
        </span>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
      {locked && (
        <div className="absolute inset-x-0 bottom-0 top-14 z-10 flex items-center justify-center rounded-b-lg bg-slate-100/80 px-4">
          <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Lock className="h-4 w-4" />
            {lockMessage}
          </div>
        </div>
      )}
    </section>
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function NIRDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch record
  const { data: records, isLoading } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => {
      if (!id) return [];
      return MainDBITService.getAll({ filter: `id eq ${id}` });
    },
    enabled: !!id,
  });

  const record: MainDBIT | null = records?.[0] ?? null;
  const nirRecord: NIRRecord | null = record ? parseNIRRecord(record) : null;
  const { caState, access, actions, isPending } = useNIRWorkflow(nirRecord);

  // Local draft state for editable fields
  const [comment, setComment] = useState('');
  const [task, setTask] = useState('');

  // Reset comment/task when CA state changes
  useEffect(() => {
    setComment('');
    setTask('');
  }, [caState]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-5">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading NIR record...</span>
        </div>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="mx-auto max-w-4xl p-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-4 text-lg font-semibold text-slate-600">NIR record not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/it/forms/nir')}>
          Back to list
        </Button>
      </main>
    );
  }

  const isEmailTypeNew = record.nIRRequestType === 'New Email' || !record.nIRRequestType;
  const isRename = record.nIRRequestType === 'Rename';
  const showExistingEmail = !isEmailTypeNew && record.nIRRequestType;

  return (
    <main className="mx-auto grid max-w-6xl gap-5 p-5">
      {/* ===== HEADER ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-950 px-4 py-3 text-white shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/it/forms/nir')}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">NIR — Notes ID Request</p>
          <h1 className="truncate text-xl font-semibold">{record.title}</h1>
        </div>
        <NIRStatusBadge ca={caState} />
      </div>

      {/* ===== STAGE TIMELINE ===== */}
      <StageTimeline ca={caState} />

      {/* ===== SECTION 1: REQUESTOR'S DETAILS ===== */}
      <SectionCard
        title="Requestor's Details"
        icon={UserIcon}
        role="Requestor"
        accent="border-b-slate-200"
        editable={access.canEditSection1}
        locked={!access.canEditSection1 && caState !== 'Request'}
        lockMessage="Read-only — request has been submitted"
      >
        <ReadonlyField label="Email Type" value={record.nIRRequestType || '—'} />
        <ReadonlyField label="Company" value={record.company || '—'} />
        <ReadonlyField label="Full Name" value={record.nIRFullName || '—'} />
        <ReadonlyField label="Employee Number" value={record.nIREmployeeNumber || '—'} />
        <ReadonlyField label="Department" value={record.nIRDepartment || '—'} />
        <ReadonlyField label="Designation" value={record.nIRDesignation || '—'} />
        <ReadonlyField label="Phone Extension" value={record.nIRPhoneExtension || '—'} />
        <ReadonlyField label="Requestor Email" value={record.requestoremail || '—'} />
        <ReadonlyField label="Date Sent" value={record.submitteddate ? format(new Date(record.submitteddate), 'MMM dd, yyyy HH:mm') : '—'} />

        {/* Conditional fields per Domino hide-when rules */}
        {showExistingEmail && (
          <ReadonlyField label="Existing Email Address" value={record.nIRExistingEmailAddress || '—'} />
        )}
        {isRename && (
          <ReadonlyField label="Change To (Rename)" value={record.nIRExistingEmailAddress || '—'} />
        )}
      </SectionCard>

      {/* ===== SECTION 2: ISG HOD APPROVAL ===== */}
      <SectionCard
        title="ISG HOD Approval"
        icon={Shield}
        role="ISG HOD"
        accent="border-b-amber-200"
        editable={access.canEditSection2}
        locked={!access.canEditSection2 && caState !== 'Submitted'}
        lockMessage="Waiting for requestor submission"
      >
        {access.canEditSection2 && caState === 'Submitted' ? (
          <>
            <div className="md:col-span-2">
              <Label>Decision Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your remarks (required for rejection)"
                className="mt-1 min-h-24"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button
                onClick={() => {
                  actions.approveHOD({ comment });
                  toast.success('Request approved — forwarded to Notes Admin');
                }}
                disabled={isPending}
                className="flex-1 bg-emerald-800 text-white hover:bg-emerald-900"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approved
              </Button>
              <Button
                onClick={() => {
                  if (!comment.trim()) {
                    toast.warning('Please enter a reason for rejection');
                    return;
                  }
                  actions.rejectHOD({ comment });
                  toast.success('Request rejected');
                }}
                disabled={isPending}
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" /> Rejected
              </Button>
            </div>
          </>
        ) : (
          <>
            <ReadonlyField label="HOD Status" value={record.nIRHODApprovalStatus || 'Pending'} />
            <ReadonlyField label="HOD Name" value={record.nIRHODApprovedBy || '—'} />
            <ReadonlyField label="HOD Date" value={record.nIRHODApprovedDate ? format(new Date(record.nIRHODApprovedDate), 'MMM dd, yyyy HH:mm') : '—'} />
          </>
        )}
      </SectionCard>

      {/* ===== SECTION 3: NOTES ADMIN / PIC ===== */}
      <SectionCard
        title="Notes Admin / PIC"
        icon={Wrench}
        role="PIC"
        accent="border-b-blue-200"
        editable={access.canEditSection3}
        locked={!access.canEditSection3 && caState !== 'ISGHODApproved'}
        lockMessage="Waiting for HOD approval"
      >
        {access.canEditSection3 && caState === 'ISGHODApproved' ? (
          <>
            <div className="md:col-span-2">
              <Label>Provisioning Task Details</Label>
              <Textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Describe the Notes ID provisioning tasks completed"
                className="mt-1 min-h-24"
              />
            </div>
            {isEmailTypeNew && (
              <div className="md:col-span-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                New ID request — HWG will be notified for configuration after marking Done.
              </div>
            )}
            <div className="md:col-span-2">
              <Button
                onClick={() => {
                  if (!task.trim()) {
                    toast.warning('Please describe the provisioning task completed');
                    return;
                  }
                  actions.markDone({ task });
                  toast.success('Notes ID marked as Done — forwarded to HWG');
                }}
                disabled={isPending}
                className="w-full bg-blue-800 text-white hover:bg-blue-900 sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" /> Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <ReadonlyField label="Notes Admin Status" value={record.nIRNotesAdminStatus || '—'} />
            <ReadonlyField label="Notes Admin By" value={record.nIRNotesAdminBy || '—'} />
            <ReadonlyField label="Notes Admin Date" value={record.nIRNotesAdminDate ? format(new Date(record.nIRNotesAdminDate), 'MMM dd, yyyy HH:mm') : '—'} />
          </>
        )}
      </SectionCard>

      {/* ===== SECTION 4: HWG CONFIGURATION ===== */}
      <SectionCard
        title="HWG Configuration"
        icon={HardDrive}
        role="HWG"
        accent="border-b-purple-200"
        editable={access.canEditSection4}
        locked={!access.canEditSection4 && caState !== 'Done'}
        lockMessage="Waiting for Notes Admin to complete provisioning"
      >
        {access.canEditSection4 && caState === 'Done' ? (
          <>
            <div className="md:col-span-2">
              <Label>Configuration Task Details</Label>
              <Textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Describe the HWG/Lotus Notes configuration completed"
                className="mt-1 min-h-24"
              />
            </div>
            <div className="md:col-span-2">
              <Button
                onClick={() => {
                  if (!task.trim()) {
                    toast.warning('Please describe the configuration completed');
                    return;
                  }
                  actions.markCompleted({ task });
                  toast.success('Configuration completed — case closed');
                }}
                disabled={isPending}
                className="w-full bg-purple-800 text-white hover:bg-purple-900 sm:w-auto"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
              </Button>
            </div>
          </>
        ) : (
          <>
            <ReadonlyField label="HWG Status" value={record.nIRITHardwareStatus || '—'} />
            <ReadonlyField label="HWG By" value={record.nIRITHardwareBy || '—'} />
          </>
        )}
      </SectionCard>

      {/* ===== HIDDEN ADMIN PANEL ===== */}
      {access.canEditAdmin && (
        <Card className="border-dashed border-slate-300 bg-slate-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-base">Admin Panel</CardTitle>
              <CardDescription>CA override &amp; manual corrections</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label className="text-xs text-slate-500">Current CA</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 text-sm font-mono text-slate-900 border">
                  {caState}
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Current Status Key</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 text-sm font-mono text-slate-900 border">
                  {record.currentStatus || '—'}
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Workflow Stage</Label>
                <div className="mt-1 rounded-md bg-white px-3 py-2 text-sm font-mono text-slate-900 border">
                  {record.workflowstage ?? '—'}
                </div>
              </div>
              <div className="flex items-end">
                {caState === 'Done' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      actions.adminSetHODRejected({ comment: 'Admin override — HOD rejected' });
                      toast.success('CA set to HODRejected');
                    }}
                    disabled={isPending}
                  >
                    <XCircle className="mr-1 h-4 w-4" /> SET → HODRejected
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== HWG ROUTING INFO ===== */}
      {(isEmailTypeNew && caState === 'ISGHODApproved') || caState === 'Done' ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">HWG Routing</p>
          {(() => {
            const routing = computeHWGRouting(record.company);
            return (
              <>
                <p className="mt-1 text-blue-800">
                  Company: <strong>{record.company || '—'}</strong>
                  {' → '}
                  HWG Group: <strong>{getHWGLabel(routing.group)}</strong>
                </p>
                <p className="mt-2 text-xs text-blue-700">
                  {caState === 'ISGHODApproved'
                    ? 'After marking Done, the PIC notification will route to this HWG team.'
                    : 'The PIC has notified this HWG team for Lotus Notes configuration.'}
                </p>
              </>
            );
          })()}
        </div>
      ) : null}
    </main>
  );
}
