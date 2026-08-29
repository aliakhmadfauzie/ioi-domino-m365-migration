/**
 * IOIP — IOI Policy Detail — PDF Document Viewer
 *
 * Layout: sticky green header bar  →  gray scrollable document area (left)
 *         + sticky approval sidebar (right)
 *
 * Document area renders white "pages" with dynamic page numbering.
 * Body text is split into chunks; revision history gets its own final page.
 */
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtPolicyService } from '@/generated/services/main-dbit-ext-policy-service';
import { useUser } from '@/hooks/use-user';
import { recordITApprovalAction, statusActionType } from '@/lib/it-approval-actions';
import type { MainDBITExtPolicy } from '@/generated/models/main-dbit-ext-policy-model';

// ── Approval action map ───────────────────────────────────────────────────────

const STAGE_ACTIONS: Record<
  string,
  { action: string; label: string; variant: 'approve' | 'reject'; stage: string }[]
> = {
  CurrentstatusKey3: [
    { action: 'CurrentstatusKey55', label: 'Submit for Approval', variant: 'approve', stage: 'Draft' },
  ],
  CurrentstatusKey55: [
    { action: 'CurrentstatusKey56', label: 'Approve', variant: 'approve', stage: 'Approver 1' },
    { action: 'CurrentstatusKey6',  label: 'Reject',  variant: 'reject',  stage: 'Approver 1' },
  ],
  CurrentstatusKey56: [
    { action: 'CurrentstatusKey57', label: 'Approve', variant: 'approve', stage: 'Approver 2' },
    { action: 'CurrentstatusKey6',  label: 'Reject',  variant: 'reject',  stage: 'Approver 2' },
  ],
  CurrentstatusKey57: [
    { action: 'CurrentstatusKey4',  label: 'Approve & Distribute', variant: 'approve', stage: 'Approver 3' },
    { action: 'CurrentstatusKey6',  label: 'Reject',               variant: 'reject',  stage: 'Approver 3' },
  ],
  CurrentstatusKey4: [
    { action: 'CurrentstatusKey44', label: 'Archive Policy', variant: 'approve', stage: 'Distributed' },
  ],
};

const STAGE_ORDER = [
  'CurrentstatusKey3',
  'CurrentstatusKey55',
  'CurrentstatusKey56',
  'CurrentstatusKey57',
  'CurrentstatusKey4',
  'CurrentstatusKey44',
];

function policyPatchForAction(action: string, comment: string): Partial<MainDBITExtPolicy> {
  const now = new Date().toISOString();
  const c = comment.trim();
  switch (action) {
    case 'CurrentstatusKey55': return { iOIPFinalStatus: '1' };
    case 'CurrentstatusKey56': return { iOIPFinalStatus: '1', iOIPStatus1: '1', iOIPDateApproved1: now, iOIPComment1: c, iOIPA1replied: 'true' };
    case 'CurrentstatusKey57': return { iOIPFinalStatus: '1', iOIPStatus2: '1', iOIPDateApproved2: now, iOIPComment2: c, iOIPA2replied: 'true' };
    case 'CurrentstatusKey4':  return { iOIPFinalStatus: '4', iOIPStatus3: '1', iOIPDateApproved3: now, iOIPComment3: c, iOIPA3replied: 'true' };
    case 'CurrentstatusKey44': return { iOIPFinalStatus: '6', iOIPDateArchived: now };
    case 'CurrentstatusKey6':  return { iOIPFinalStatus: '0' };
    default: return {};
  }
}

function normalizedEmail(v: unknown): string {
  return typeof v === 'string' ? v.trim().toLowerCase() : '';
}

// ── Status badge config ───────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  CurrentstatusKey3:  { label: 'Draft',              color: '#6B7280', bg: '#F3F4F6' },
  CurrentstatusKey55: { label: 'Pending Approver 1', color: '#D97706', bg: '#FEF3C7' },
  CurrentstatusKey56: { label: 'Pending Approver 2', color: '#D97706', bg: '#FEF3C7' },
  CurrentstatusKey57: { label: 'Pending Approver 3', color: '#D97706', bg: '#FEF3C7' },
  CurrentstatusKey4:  { label: 'Distributed',        color: '#059669', bg: '#D1FAE5' },
  CurrentstatusKey44: { label: 'Archived',            color: '#6366F1', bg: '#EEF2FF' },
  CurrentstatusKey6:  { label: 'Rejected',            color: '#DC2626', bg: '#FEE2E2' },
};

// ── Body → pages splitter ─────────────────────────────────────────────────────

const CHARS_PER_PAGE = 2400;

function splitBodyIntoPages(body: string): string[] {
  const trimmed = body?.trim();
  if (!trimmed) return [];
  const pages: string[] = [];
  let remaining = trimmed;
  while (remaining.length > CHARS_PER_PAGE) {
    const slice = remaining.slice(0, CHARS_PER_PAGE);
    let breakAt = slice.lastIndexOf('\n\n');
    if (breakAt < CHARS_PER_PAGE * 0.65) breakAt = slice.lastIndexOf('\n');
    if (breakAt < CHARS_PER_PAGE * 0.65) breakAt = CHARS_PER_PAGE;
    pages.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) pages.push(remaining);
  return pages;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetaCell({ label, value, borderRight }: { label: string; value: string; borderRight?: boolean }) {
  return (
    <div style={{ padding: '7px 12px', borderRight: borderRight ? '1px solid #D0D0D0' : undefined }}>
      <p style={{ fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1C1C', wordBreak: 'break-word' }}>{value}</p>
    </div>
  );
}

function DocumentPage({
  pageNum, totalPages, policyNo, revision, children,
}: {
  pageNum: number; totalPages: number; policyNo: string; revision: string; children: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        padding: '40px 48px 28px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: pageNum === 1 ? 500 : 380,
      }}
    >
      {/* Continuation header — pages 2+ */}
      {pageNum > 1 && (
        <div
          style={{
            marginBottom: 18,
            paddingBottom: 10,
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {policyNo}
          </span>
          <span style={{ fontSize: 9.5, color: '#C0C0C0' }}>Continuation</span>
        </div>
      )}

      {/* Page content */}
      <div style={{ flex: 1 }}>{children}</div>

      {/* Page footer */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 8,
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 9,
          color: '#B0B0B0',
        }}
      >
        <span>IOI Group — Confidential</span>
        <span style={{ fontWeight: 700, color: '#6B7280', fontSize: 10 }}>
          Page {pageNum} of {totalPages}
        </span>
        <span>{policyNo}&nbsp;|&nbsp;Rev {revision}</span>
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#9CA3AF',
          marginBottom: 10,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#EBEBEB' }} />;
}

function InfoRow({ Icon, label, value }: { Icon: typeof User; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
      <Icon style={{ width: 13, height: 13, color: '#9CA3AF', flexShrink: 0, marginTop: 2 }} />
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 10, color: '#9CA3AF' }}>{label}</p>
        <p style={{ fontSize: 11, fontWeight: 500, wordBreak: 'break-all', color: '#1C1C1C' }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function IOIPDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [actionLoading, setActionLoading] = useState(false);
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

  const { data: extRaw } = useQuery({
    queryKey: ['mainDBITExtPolicy', id],
    queryFn: async () => {
      if (!id) return null;
      const records = await MainDBITExtPolicyService.getList({ filter: `parentRecordId eq ${id}` });
      return records[0] || null;
    },
    enabled: !!id,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const record = raw as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extRecord = extRaw as any;

  const statusKey = String(record?.currentStatus || '');
  const stageIdx = STAGE_ORDER.indexOf(statusKey);
  const statusInfo = STATUS_BADGE[statusKey] || { label: statusKey, color: '#6B7280', bg: '#F3F4F6' };

  const availableActions = STAGE_ACTIONS[statusKey] || [];
  const actorEmail = normalizedEmail(user?.userPrincipalName || user?.email);
  const expectedActor = (() => {
    switch (statusKey) {
      case 'CurrentstatusKey3':
      case 'CurrentstatusKey4':  return normalizedEmail(record?.requestoremail);
      case 'CurrentstatusKey55': return normalizedEmail(extRecord?.iOIPApp1_1);
      case 'CurrentstatusKey56': return normalizedEmail(extRecord?.iOIPApp2_1);
      case 'CurrentstatusKey57': return normalizedEmail(extRecord?.iOIPApp3_1);
      default: return '';
    }
  })();
  const canAct = availableActions.length > 0 && actorEmail === expectedActor;

  // Document fields
  const policyNo  = extRecord?.iOIPPolicyNo  || record?.title || `IOIP-${id}`;
  const subject   = extRecord?.iOIPSubject   || '';
  const revision  = extRecord?.iOIPReviNum   || '1.0';
  const dateIssue = extRecord?.iOIPDateIssue || '';
  const submitter = record?.requestorName || record?.requestoremail || '';
  const dateSubmit = record?.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : '';

  // Split body into pages
  const bodyPages = useMemo(
    () => splitBodyIntoPages(extRecord?.iOIPBody || ''),
    [extRecord?.iOIPBody],
  );

  // Revision history rows
  const revRows = useMemo(() => {
    if (!extRecord) return [] as { r: string; d: string; u: string }[];
    const rows: { r: string; d: string; u: string }[] = [];
    for (let i = 1; i <= 10; i++) {
      const r = extRecord[`iOIPRevR${i}`];
      const d = extRecord[`iOIPRevD${i}`];
      const u = extRecord[`iOIPRevU${i}`];
      if (r || d || u) rows.push({ r: r || '', d: d || '', u: u || '' });
    }
    if (extRecord.iOIPRevR || extRecord.iOIPRevD || extRecord.iOIPRevU) {
      rows.push({ r: extRecord.iOIPRevR || '', d: extRecord.iOIPRevD || '', u: extRecord.iOIPRevU || '' });
    }
    return rows;
  }, [extRecord]);

  const contentPageCount = Math.max(bodyPages.length, 1);
  const totalPages = contentPageCount + (revRows.length > 0 ? 1 : 0);

  // Approvers with chip status
  const approvers = useMemo(() => {
    const stageKeys = ['CurrentstatusKey55', 'CurrentstatusKey56', 'CurrentstatusKey57'];
    return [
      { n: 1, email: extRecord?.iOIPApp1_1 || '', status: extRecord?.iOIPStatus1, dateApproved: extRecord?.iOIPDateApproved1, comment: extRecord?.iOIPComment1 },
      { n: 2, email: extRecord?.iOIPApp2_1 || '', status: extRecord?.iOIPStatus2, dateApproved: extRecord?.iOIPDateApproved2, comment: extRecord?.iOIPComment2 },
      { n: 3, email: extRecord?.iOIPApp3_1 || '', status: extRecord?.iOIPStatus3, dateApproved: extRecord?.iOIPDateApproved3, comment: extRecord?.iOIPComment3 },
    ].map((a, i) => {
      const thisIdx = STAGE_ORDER.indexOf(stageKeys[i]);
      let chip: 'approved' | 'rejected' | 'current' | 'waiting' = 'waiting';
      if (a.status === 'Approved') chip = 'approved';
      else if (a.status === 'Rejected') chip = 'rejected';
      else if (stageIdx === thisIdx) chip = 'current';
      return { ...a, chip };
    });
  }, [extRecord, stageIdx]);

  const CHIP_CFG = {
    approved: { label: 'Approved', color: '#059669', Icon: CheckCircle2 },
    rejected:  { label: 'Rejected', color: '#DC2626', Icon: XCircle },
    current:   { label: 'Pending',  color: '#D97706', Icon: Clock },
    waiting:   { label: 'Waiting',  color: '#9CA3AF', Icon: Clock },
  };

  const handleAction = async (action: string) => {
    if (!id) return;
    const act = availableActions.find((a) => a.action === action);
    setActionLoading(true);
    try {
      await recordITApprovalAction({
        id,
        record,
        user,
        nextStatus: action,
        stageName: act?.stage || act?.label || 'IOIP',
        actionType: statusActionType(action, act?.variant),
        comment: remark,
        workflowstage: action === 'CurrentstatusKey6' ? 0 : 2,
      });
      if (extRecord?.id) {
        await MainDBITExtPolicyService.update(extRecord.id, policyPatchForAction(action, remark));
      }
      toast.success('Status updated');
      setRemark('');
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading / error ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 style={{ width: 28, height: 28, color: '#9CA3AF' }} className="animate-spin" />
      </div>
    );
  }
  if (error || !record) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#9CA3AF', fontSize: 14 }}>
        Record not found.
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Sticky page header ─────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          backgroundColor: '#059669',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/it/forms/ioip')}
          style={{ color: '#FFF', flexShrink: 0 }}
          className="hover:bg-white/10"
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </Button>
        <FileText style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.55)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ color: '#FFF', fontWeight: 600, fontSize: 13 }}>{policyNo}</span>
          {subject && (
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 8 }}>
              — {subject}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 99,
            backgroundColor: statusInfo.bg,
            color: statusInfo.color,
            flexShrink: 0,
          }}
        >
          {statusInfo.label}
        </span>
      </header>

      {/* ── Body row: document + sidebar ───────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ── Document viewer (scrolls with page) ── */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#DCDCDC',
            padding: '32px 28px',
            minHeight: 'calc(100vh - 114px)',
          }}
        >
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Page 1: official header + metadata + body[0] */}
            <DocumentPage pageNum={1} totalPages={totalPages} policyNo={policyNo} revision={revision}>
              {/* Company / document header box */}
              <div style={{ border: '2px solid #1C1C1C', borderRadius: 2, overflow: 'hidden', marginBottom: 20 }}>
                {/* Row 1: company name | document type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', borderBottom: '1px solid #D0D0D0' }}>
                  <div style={{ padding: '10px 14px', borderRight: '1px solid #D0D0D0' }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#1C1C1C', letterSpacing: '0.04em', lineHeight: 1.3 }}>
                      IOI ACIDCHEM SDN BHD
                    </p>
                    <p style={{ fontSize: 10, color: '#6B7280', letterSpacing: '0.02em', lineHeight: 1.3, marginTop: 2 }}>
                      PAN-CENTURY OLEOCHEMICALS SDN BHD
                    </p>
                  </div>
                  <div style={{ padding: '10px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 130 }}>
                    <p style={{ fontSize: 9.5, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Document Type</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#1C1C1C', letterSpacing: '0.04em', marginTop: 2 }}>POLICY</p>
                  </div>
                </div>
                {/* Row 2: Policy No | Revision | Effective Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #E5E7EB' }}>
                  <MetaCell label="Policy No." value={policyNo} borderRight />
                  <MetaCell label="Revision"   value={revision}  borderRight />
                  <MetaCell label="Effective Date" value={dateIssue ? format(new Date(dateIssue), 'dd MMM yyyy') : '—'} />
                </div>
                {/* Row 3: Subject | Issued By */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <MetaCell label="Subject"   value={subject || '—'} borderRight />
                  <MetaCell label="Issued By" value={submitter || '—'} />
                </div>
              </div>

              {/* Body text — page 1 chunk */}
              {bodyPages.length > 0 ? (
                <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#1C1C1C', whiteSpace: 'pre-wrap' }}>
                  {bodyPages[0]}
                </div>
              ) : (
                <p style={{ color: '#C0C0C0', fontSize: 12, fontStyle: 'italic' }}>
                  No policy content has been entered.
                </p>
              )}
            </DocumentPage>

            {/* Pages 2+: body continuation */}
            {bodyPages.slice(1).map((chunk, i) => (
              <DocumentPage
                key={`body-p${i + 2}`}
                pageNum={i + 2}
                totalPages={totalPages}
                policyNo={policyNo}
                revision={revision}
              >
                <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#1C1C1C', whiteSpace: 'pre-wrap' }}>
                  {chunk}
                </div>
              </DocumentPage>
            ))}

            {/* Revision history page */}
            {revRows.length > 0 && (
              <DocumentPage
                pageNum={contentPageCount + 1}
                totalPages={totalPages}
                policyNo={policyNo}
                revision={revision}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: '#1C1C1C',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: '1.5px solid #D0D0D0',
                  }}
                >
                  Revision History
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8F8F8' }}>
                      {['Rev.', 'Date', 'Updated By'].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: 'left',
                            padding: '6px 10px',
                            border: '1px solid #D0D0D0',
                            fontWeight: 600,
                            color: '#374151',
                            fontSize: 11,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {revRows.map((row, ri) => (
                      <tr key={ri}>
                        <td style={{ padding: '5px 10px', border: '1px solid #E5E7EB' }}>{row.r}</td>
                        <td style={{ padding: '5px 10px', border: '1px solid #E5E7EB' }}>{row.d}</td>
                        <td style={{ padding: '5px 10px', border: '1px solid #E5E7EB' }}>{row.u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DocumentPage>
            )}
          </div>
        </div>

        {/* ── Right sidebar (sticky) ── */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            position: 'sticky',
            top: 50,
            height: 'calc(100vh - 114px)',
            overflowY: 'auto',
            backgroundColor: '#FAFAFA',
            borderLeft: '1px solid #E8E8E8',
          }}
        >
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Status */}
            <SidebarSection title="Status">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: statusInfo.bg,
                  color: statusInfo.color,
                }}
              >
                {statusInfo.label}
              </span>
            </SidebarSection>

            <Divider />

            {/* Approval chain */}
            <SidebarSection title="Approval Chain">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {approvers.map((a) => {
                  const cs = CHIP_CFG[a.chip];
                  const ChipIcon = cs.Icon;
                  const circleColor =
                    a.chip === 'approved' ? '#059669' :
                    a.chip === 'current'  ? '#D97706' :
                    a.chip === 'rejected' ? '#DC2626' : '#E5E7EB';
                  const circleText =
                    a.chip === 'waiting' ? '#9CA3AF' : '#FFF';

                  return (
                    <div key={a.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 22, height: 22, borderRadius: '50%',
                          backgroundColor: circleColor, color: circleText,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
                        }}
                      >
                        {a.n}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 11.5, fontWeight: 500, color: '#1C1C1C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {a.email || `Approver ${a.n}`}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <ChipIcon style={{ width: 11, height: 11, color: cs.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: cs.color }}>{cs.label}</span>
                          {a.dateApproved && (
                            <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 2 }}>
                              · {format(new Date(a.dateApproved), 'dd/MM/yy')}
                            </span>
                          )}
                        </div>
                        {a.comment && (
                          <p style={{ fontSize: 10.5, color: '#9CA3AF', fontStyle: 'italic', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            "{a.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SidebarSection>

            {/* Action buttons */}
            {availableActions.length > 0 && (
              <>
                <Divider />
                <SidebarSection title="Actions">
                  {!canAct && expectedActor && (
                    <p
                      style={{
                        fontSize: 11, color: '#9CA3AF',
                        backgroundColor: '#F3F4F6', padding: '8px 10px',
                        borderRadius: 6, marginBottom: 10,
                      }}
                    >
                      Waiting for <strong style={{ fontWeight: 600, color: '#6B7280' }}>{expectedActor}</strong>
                    </p>
                  )}
                  <div style={{ marginBottom: 10 }}>
                    <Label style={{ fontSize: 11 }}>Comment (optional)</Label>
                    <Textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows={3}
                      placeholder="Add a remark..."
                      disabled={!canAct || actionLoading}
                      className="mt-1.5 text-xs resize-none"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {availableActions.map((a) => (
                      <Button
                        key={a.action}
                        size="sm"
                        className="w-full text-xs"
                        variant={a.variant === 'approve' ? 'default' : 'destructive'}
                        onClick={() => handleAction(a.action)}
                        disabled={actionLoading || !canAct}
                        style={a.variant === 'approve' ? { backgroundColor: '#059669' } : undefined}
                      >
                        {actionLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                        {a.label}
                      </Button>
                    ))}
                  </div>
                </SidebarSection>
              </>
            )}

            {/* Distribution */}
            {(extRecord?.iOIPDefaultList || extRecord?.iOIPDistributionList) && (
              <>
                <Divider />
                <SidebarSection title="Distribution">
                  {extRecord?.iOIPDefaultList && (
                    <p style={{ fontSize: 11, color: '#374151', wordBreak: 'break-all', marginBottom: 4 }}>
                      {extRecord.iOIPDefaultList}
                    </p>
                  )}
                  {extRecord?.iOIPDistributionList && (
                    <p style={{ fontSize: 11, color: '#6B7280', wordBreak: 'break-all' }}>
                      {extRecord.iOIPDistributionList}
                    </p>
                  )}
                </SidebarSection>
              </>
            )}

            {/* Record info */}
            <Divider />
            <SidebarSection title="Record Info">
              <InfoRow Icon={User}     label="Submitted by" value={submitter} />
              <InfoRow Icon={Calendar} label="Date"         value={dateSubmit} />
              <InfoRow Icon={Hash}     label="Record ID"    value={`#${id}`} />
            </SidebarSection>

          </div>
        </aside>
      </div>
    </div>
  );
}

export default IOIPDetailPage;
