import { MainDBITCurrentstatusKeyToLabel, type MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import { getStatusStyle, getPriorityStyle, type StatusStyle, type PriorityStyle } from './color-tokens';

export type { MainDBITCurrentstatusKey };

export type StatusType = 'initial' | 'in-progress' | 'terminal';

interface StatusConfig {
  label: string;
  type: StatusType;
  color: string;
  bgColor: string;
}

/** Convert a plain text status string back to a legacy key for lookup */
function statusTextToKey(statusText: string): MainDBITCurrentstatusKey | undefined {
  const entry = Object.entries(MainDBITCurrentstatusKeyToLabel).find(
    ([_, label]) => label === statusText
  );
  return entry?.[0] as MainDBITCurrentstatusKey | undefined;
}

// Color palette by type
const INITIAL_STYLE  = { color: 'text-muted-foreground',       bgColor: 'bg-muted' };
const PENDING_STYLE  = { color: 'text-amber-700',               bgColor: 'bg-amber-50' };
const TERMINAL_STYLE = { color: 'text-emerald-700',             bgColor: 'bg-emerald-50' };
const ACTIVE_STYLE   = { color: 'text-primary',                 bgColor: 'bg-primary/10' };
const CLOSED_STYLE   = { color: 'text-muted-foreground',        bgColor: 'bg-muted' };

export const statusConfig: Record<MainDBITCurrentstatusKey, StatusConfig> = {
  // ── Terminal / Initial ──────────────────────────────────────────────────────
  'CurrentstatusKey0':  { label: 'Active',              type: 'terminal',    ...ACTIVE_STYLE },
  'CurrentstatusKey1':  { label: 'Approved',            type: 'terminal',    ...TERMINAL_STYLE },
  'CurrentstatusKey2':  { label: 'Closed',              type: 'terminal',    ...CLOSED_STYLE },
  'CurrentstatusKey3':  { label: 'Draft',               type: 'initial',     ...INITIAL_STYLE },
  'CurrentstatusKey4':  { label: 'Sent',                type: 'terminal',    ...TERMINAL_STYLE },
  'CurrentstatusKey5':  { label: 'Verified',            type: 'terminal',    ...TERMINAL_STYLE },
  'CurrentstatusKey6':  { label: 'Withdrawn',           type: 'terminal',    ...CLOSED_STYLE },
  // ── Pending (In-Progress) ───────────────────────────────────────────────────
  'CurrentstatusKey7':  { label: 'Pending ABAPER',           type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey8':  { label: 'Pending Acceptance',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey9':  { label: 'Pending Approval A',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey10': { label: 'Pending Approval B',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey11': { label: 'Pending Authority 1',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey12': { label: 'Pending Authority 2',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey13': { label: 'Pending BASIS',            type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey14': { label: 'Pending BPO',              type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey15': { label: 'Pending BPO Sign-Off',     type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey16': { label: 'Pending Backup Admin',     type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey17': { label: 'Pending Bank IT',          type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey18': { label: 'Pending Bank Token',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey19': { label: 'Pending Close',            type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey20': { label: 'Pending Completion',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey21': { label: 'Pending Div/Dept Head',    type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey22': { label: 'Pending Div Head',         type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey23': { label: 'Pending ED',               type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey24': { label: 'Pending Endorsement',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey25': { label: 'Pending Finance',          type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey26': { label: 'Pending Func. Procedure',  type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey27': { label: 'Pending HOD',              type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey28': { label: 'Pending HOD Acceptance',   type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey29': { label: 'Pending ISG Action',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey30': { label: 'Pending IT',               type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey31': { label: 'Pending IT Action',        type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey32': { label: 'Pending IT Approver',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey33': { label: 'Pending IT Checker',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey34': { label: 'Pending IT Config',        type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey35': { label: 'Pending IT Func. Complete',type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey36': { label: 'Pending IT Hardware',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey37': { label: 'Pending IT Manager',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey38': { label: 'Pending IT PIC',           type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey39': { label: 'Pending IT Staff',         type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey40': { label: 'Pending IT Superior',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey41': { label: 'Pending IT Support Use',   type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey42': { label: 'Pending IT Task Assign',   type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey43': { label: 'Pending IT Testing',       type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey44': { label: 'Pending IT Verifier',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey45': { label: 'Pending Impl. Status',     type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey46': { label: 'Pending Initiator',        type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey47': { label: 'Pending KU Sign-Off',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey48': { label: 'Pending Notes Admin',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey49': { label: 'Pending Owner',            type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey50': { label: 'Pending PM',               type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey51': { label: 'Pending Req. Acceptance',  type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey52': { label: 'Pending SAP ABAP Assign',  type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey53': { label: 'Pending SAP IT',           type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey54': { label: 'Pending SAP Std',          type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey55': { label: 'Pending Section B',        type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey56': { label: 'Pending Transport',        type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey57': { label: 'Pending Transport A',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey58': { label: 'Pending Transport B',      type: 'in-progress', ...PENDING_STYLE },
  'CurrentstatusKey59': { label: 'Pending Verification',     type: 'in-progress', ...PENDING_STYLE },
};

export const getStatusLabel = (status: string) => {
  const key = statusTextToKey(status) ?? status;
  const cfg = statusConfig[key as MainDBITCurrentstatusKey];
  return cfg?.label ?? status;
};
export const getStatusType  = (status: string): StatusType => {
  const key = statusTextToKey(status) ?? status;
  return statusConfig[key as MainDBITCurrentstatusKey]?.type ?? 'in-progress';
};

export const isPendingStatus = (status: string) => {
  const key = statusTextToKey(status) ?? status;
  return statusConfig[key as MainDBITCurrentstatusKey]?.type === 'in-progress';
};
export const isTerminalStatus = (status: string) => {
  const key = statusTextToKey(status) ?? status;
  return statusConfig[key as MainDBITCurrentstatusKey]?.type === 'terminal';
};

// Priority configuration
export type PriorityKey = 'low' | 'normal' | 'high' | 'critical';

export const priorityConfig: Record<PriorityKey, { label: string; color: string; bgColor: string }> = {
  'low':      { label: 'Low',      color: 'text-muted-foreground',     bgColor: 'bg-muted' },
  'normal':   { label: 'Normal',   color: 'text-secondary-foreground', bgColor: 'bg-secondary' },
  'high':     { label: 'High',     color: 'text-primary',              bgColor: 'bg-primary/10' },
  'critical': { label: 'Critical', color: 'text-destructive-foreground', bgColor: 'bg-destructive' },
};

export const getPriorityLabel = (key: PriorityKey) => priorityConfig[key]?.label ?? 'Unknown';

// Re-export from color-tokens for convenience
export { getStatusStyle, getPriorityStyle };
export type { StatusStyle, PriorityStyle };
