import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import type { UserRoleInfo } from '@/hooks/use-dynamic-role-access';
import type { User } from '@/hooks/use-user';

type LooseRecord = Record<string, unknown>;

export interface ITCurrentActionAccess {
  canAct: boolean;
  currentUserEmail: string;
  expectedActorEmails: string[];
  expectedActorLabel: string;
  hasExplicitActor: boolean;
  isInitiator: boolean;
  reason: string;
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const ACTOR_KEY_RE = /(approver|approval|hod|head|manager|assigned|sendto|pic|owner|tba|tbv|verifier|checker|director|coo|ed|isg|abap|basis|functional)/i;
const SKIP_KEY_RE = /(requestor|submittedby|createdby|modifiedby|actionby|approvedbyname|approvedbyemail)/i;

export function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') return '';
  const match = value.match(EMAIL_RE);
  return (match?.[0] || value).trim().toLowerCase();
}

export function emailListFromValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(emailListFromValue);
  }
  if (typeof value !== 'string') return [];

  const matches = value.match(EMAIL_RE);
  if (matches?.length) {
    return matches.map(normalizeEmail).filter(Boolean);
  }

  const normalized = normalizeEmail(value);
  return normalized.includes('@') ? [normalized] : [];
}

export function userEmail(user?: User | null): string {
  return normalizeEmail(user?.userPrincipalName || user?.email);
}

export function isITStatusActionable(statusKey?: string, statusLabel?: string, currentAction?: string): boolean {
  const key = String(statusKey || '');
  const label = String(statusLabel || '').toLowerCase();
  const action = String(currentAction || '').toLowerCase();

  if (!key && !label && !action) return false;
  if (key === 'CurrentstatusKey3' || label === 'draft') return false;
  if (['CurrentstatusKey0', 'CurrentstatusKey1', 'CurrentstatusKey2', 'CurrentstatusKey4', 'CurrentstatusKey5', 'CurrentstatusKey6'].includes(key)) {
    return false;
  }
  if (/(approved|rejected|withdrawn|closed|completed|active|sent|verified)\b/.test(label)) {
    return false;
  }

  return /(pending|submitted|review|approval|action|verification|acceptance|completion|approver)/.test(label)
    || /(pending|review|approval|action|verification|acceptance|approver)/.test(action);
}

function addEmails(target: Set<string>, value: unknown, requestorEmail: string) {
  emailListFromValue(value).forEach((email) => {
    if (email && email !== requestorEmail) target.add(email);
  });
}

function addStageEmails(target: Set<string>, value: unknown) {
  emailListFromValue(value).forEach((email) => {
    if (email) target.add(email);
  });
}

function eafStageActorEmails(statusKey: string, extAccess?: MainDBITExtAccess): string[] {
  const emails = new Set<string>();
  if (!extAccess) return [];

  if (statusKey === 'CurrentstatusKey27') {
    addStageEmails(emails, extAccess.eAFDeptHeadEmail);
  }
  if (statusKey === 'CurrentstatusKey11') {
    addStageEmails(emails, extAccess.eAFHigherApproverEmail);
  }
  if (statusKey === 'CurrentstatusKey12') {
    // IT Manager stage — no dedicated email field on the extension table.
    // The approver was recorded as eAFITManagerApprovedBy (display name, not email).
    // Role-based fallback (user with canApprove + IT Manager role) will be used.
    // If a dedicated IT Manager email field is added later, addStageEmails here.
  }

  return Array.from(emails);
}

function scanAssignedActorEmails(sources: LooseRecord[], requestorEmail: string): string[] {
  const emails = new Set<string>();

  sources.forEach((source) => {
    Object.entries(source).forEach(([key, value]) => {
      if (SKIP_KEY_RE.test(key)) return;
      if (!ACTOR_KEY_RE.test(key)) return;
      addEmails(emails, value, requestorEmail);
    });
  });

  return Array.from(emails);
}

export function getITCurrentActionAccess({
  record,
  user,
  roleAccess,
  statusLabel,
  currentStageName,
  sources = [],
  explicitActorEmails = [],
  blockInitiator = false,
}: {
  record: MainDBIT;
  user?: User | null;
  roleAccess?: Pick<UserRoleInfo, 'canApprove' | 'isAdmin' | 'hasGlobalApprovalAccess'>;
  statusLabel?: string;
  currentStageName?: string;
  sources?: LooseRecord[];
  explicitActorEmails?: string[];
  blockInitiator?: boolean;
}): ITCurrentActionAccess {
  const currentUserEmail = userEmail(user);
  const requestorEmail = normalizeEmail(record.requestoremail);
  const isInitiator = !!currentUserEmail && currentUserEmail === requestorEmail;
  const expected = new Set<string>();

  explicitActorEmails.forEach((email) => addEmails(expected, email, requestorEmail));

  if (record.formcode?.toUpperCase() === 'EAF') {
    const extAccess = sources.find((source) => 'eAFDeptHeadEmail' in source || 'eAFHigherApproverEmail' in source) as unknown as MainDBITExtAccess | undefined;
    eafStageActorEmails(record.currentStatus, extAccess).forEach((email) => expected.add(email));
  }

  scanAssignedActorEmails([record as unknown as LooseRecord, ...sources], requestorEmail).forEach((email) => expected.add(email));

  const expectedActorEmails = Array.from(expected);
  const hasExplicitActor = expectedActorEmails.length > 0;
  const initiatorBlocked = blockInitiator && isInitiator;
  const matchesExplicitActor = !!currentUserEmail && expectedActorEmails.includes(currentUserEmail);
  const roleFallbackAllowed = !hasExplicitActor && !!roleAccess?.canApprove && !initiatorBlocked;
  const canAct = !initiatorBlocked && (matchesExplicitActor || roleFallbackAllowed);
  const stageLabel = currentStageName || statusLabel || 'current action';

  let reason = '';
  if (!currentUserEmail) {
    reason = 'Sign in is required before actions can be taken.';
  } else if (initiatorBlocked) {
    reason = 'The initiator cannot approve this stage.';
  } else if (hasExplicitActor && !matchesExplicitActor) {
    reason = `Waiting for ${expectedActorEmails.join(', ')}.`;
  } else if (!hasExplicitActor && !roleAccess?.canApprove) {
    reason = `Waiting for an assigned approver for ${stageLabel}.`;
  }

  return {
    canAct,
    currentUserEmail,
    expectedActorEmails,
    expectedActorLabel: hasExplicitActor ? expectedActorEmails.join(', ') : `an IT approver for ${stageLabel}`,
    hasExplicitActor,
    isInitiator,
    reason,
  };
}
