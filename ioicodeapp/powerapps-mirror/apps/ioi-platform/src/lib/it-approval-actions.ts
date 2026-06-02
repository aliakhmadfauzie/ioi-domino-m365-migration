import { ApprovalRecordsService } from '@/generated/services/approval-records-service';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import type { ApprovalRecordsActionKey } from '@/generated/models/approval-records-model';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { User } from '@/hooks/use-user';

type ITApprovalActionType = 'approved' | 'rejected' | 'returned' | 'submitted' | 'completed';

const ACTION_KEY_BY_TYPE: Record<ITApprovalActionType, ApprovalRecordsActionKey> = {
  approved: 'ActionKey0',
  rejected: 'ActionKey1',
  returned: 'ActionKey2',
  submitted: 'ActionKey3',
  completed: 'ActionKey4',
};

function actorEmail(user?: User | null): string {
  return user?.userPrincipalName || user?.email || 'Unknown';
}

function actorName(user?: User | null): string {
  return user?.fullName || actorEmail(user);
}

export async function recordITApprovalAction({
  id,
  record,
  user,
  nextStatus,
  stageName,
  actionType,
  comment,
  workflowstage,
  mainPatch = {},
}: {
  id: string;
  record?: MainDBIT | null;
  user?: User | null;
  nextStatus: string;
  stageName: string;
  actionType: ITApprovalActionType;
  comment?: string;
  workflowstage?: number;
  mainPatch?: Partial<Omit<MainDBIT, 'id'>> & Record<string, unknown>;
}): Promise<MainDBIT> {
  const byEmail = actorEmail(user);
  const byName = actorName(user);
  const currentAction = `${stageName}: ${actionType}`;

  const updated = await MainDBITService.update(id, {
    ...mainPatch,
    currentStatus: nextStatus,
    currentAction,
    approvedByEmail: byEmail,
    approvedByName: byName,
    ...(workflowstage !== undefined ? { workflowstage } : {}),
  });

  try {
    await ApprovalRecordsService.create({
      stagename: stageName,
      actionbyid: byEmail,
      actionbyname: byName,
      actiondate: new Date().toISOString(),
      actionKey: ACTION_KEY_BY_TYPE[actionType],
      comments: comment?.trim() || '',
      formcode: record?.formcode || '',
      formid: String(record?.id ?? id),
      nextstage: nextStatus,
      stagenumber: workflowstage,
    });
  } catch (error) {
    console.warn('[recordITApprovalAction] Approval history write failed:', error);
  }

  return updated;
}

export function statusActionType(action: string, variant?: 'approve' | 'reject'): ITApprovalActionType {
  if (variant === 'reject' || action === 'CurrentstatusKey6') return 'rejected';
  if (action === 'CurrentstatusKey3') return 'submitted';
  if (action === 'CurrentstatusKey1') return 'completed';
  return 'approved';
}
