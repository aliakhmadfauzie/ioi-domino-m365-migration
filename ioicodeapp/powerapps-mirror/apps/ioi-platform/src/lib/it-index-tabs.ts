import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { isITStatusActionable, emailListFromValue, normalizeEmail } from './it-current-action-access';

export type ITIndexTab = 'all' | 'mine' | 'actions';

const ACTOR_KEY_RE = /(approver|approval|hod|head|manager|assigned|sendto|pic|owner|tba|tbv|verifier|checker|director|coo|ed|isg|abap|basis|functional)/i;
const SKIP_KEY_RE = /(requestor|submittedby|createdby|modifiedby|actionby|approvedbyname|approvedbyemail)/i;

export function isMySubmission(mainRecord: MainDBIT, userEmail: string): boolean {
  if (!userEmail) return false;
  return normalizeEmail(mainRecord.requestoremail) === userEmail.toLowerCase();
}

export function isMyAction(mainRecord: MainDBIT, userEmail: string): boolean {
  if (!userEmail) return false;
  if (!isITStatusActionable(mainRecord.currentStatus)) return false;
  const ue = userEmail.toLowerCase();
  const record = mainRecord as unknown as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    if (SKIP_KEY_RE.test(key)) continue;
    if (!ACTOR_KEY_RE.test(key)) continue;
    if (emailListFromValue(value).includes(ue)) return true;
  }
  return false;
}
