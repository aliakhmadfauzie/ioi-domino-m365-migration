import { MainDBITCurrentstatusKeyToLabel, MainDBITSiteKeyToLabel } from '@/generated/models/main-dbit-model';
import { MainDBHRStatusKeyToLabel, MainDBHRSiteKeyToLabel } from '@/generated/models/main-dbhr-model';
import { MainDBFINStatusKeyToLabel, MainDBFINSiteKeyToLabel } from '@/generated/models/main-dbfin-model';
import { MainDBPRDStatusKeyToLabel, MainDBPRDSiteKeyToLabel } from '@/generated/models/main-dbprd-model';
import { MainDBMTNStatusKeyToLabel, MainDBMTNSiteKeyToLabel } from '@/generated/models/main-dbmtn-model';
import { HRAppraisalRecordsStatusKeyToLabel } from '@/generated/models/hr-appraisal-records-model';
import { HRHealthRegisterStatusKeyToLabel, HRHealthRegisterSiteKeyToLabel } from '@/generated/models/hr-health-register-model';
import { HRInterviewPipelineSiteKeyToLabel } from '@/generated/models/hr-interview-pipeline-model';

const STATUS_KEY_LABELS: Record<string, string> = {
  ...MainDBHRStatusKeyToLabel,
  ...MainDBFINStatusKeyToLabel,
  ...MainDBPRDStatusKeyToLabel,
  ...MainDBMTNStatusKeyToLabel,
  ...HRAppraisalRecordsStatusKeyToLabel,
  ...HRHealthRegisterStatusKeyToLabel,
};

const CURRENT_STATUS_KEY_LABELS: Record<string, string> = {
  ...MainDBITCurrentstatusKeyToLabel,
};

const SITE_KEY_LABELS: Record<string, string> = {
  ...MainDBITSiteKeyToLabel,
  ...MainDBHRSiteKeyToLabel,
  ...MainDBFINSiteKeyToLabel,
  ...MainDBPRDSiteKeyToLabel,
  ...MainDBMTNSiteKeyToLabel,
  ...HRHealthRegisterSiteKeyToLabel,
  ...HRInterviewPipelineSiteKeyToLabel,
};

function humanizeIdentifier(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

function isChoiceKeyLike(value: string): boolean {
  return /^(Currentstatus|Status|Site|Department|Company|Module|FormType|Environmenttag|CaseStatus|Requesttype)[A-Za-z]*Key\d+$/i.test(value);
}

export function displayChoiceLabel(value: unknown, fieldName?: string): string {
  if (value === null || value === undefined || value === '') return '-';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value !== 'string') return String(value);

  const field = fieldName?.toLowerCase() ?? '';
  if (field.includes('currentstatus')) {
    return CURRENT_STATUS_KEY_LABELS[value] ?? STATUS_KEY_LABELS[value] ?? (isChoiceKeyLike(value) ? humanizeIdentifier(value) : value);
  }
  if (field.includes('status')) {
    return STATUS_KEY_LABELS[value] ?? CURRENT_STATUS_KEY_LABELS[value] ?? (isChoiceKeyLike(value) ? humanizeIdentifier(value) : value);
  }
  if (field.includes('site')) {
    return SITE_KEY_LABELS[value] ?? (isChoiceKeyLike(value) ? humanizeIdentifier(value) : value);
  }

  return (
    CURRENT_STATUS_KEY_LABELS[value] ??
    STATUS_KEY_LABELS[value] ??
    SITE_KEY_LABELS[value] ??
    (isChoiceKeyLike(value) ? humanizeIdentifier(value) : value)
  );
}
