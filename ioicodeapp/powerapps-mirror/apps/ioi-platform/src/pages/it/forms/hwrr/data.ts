import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';

export const HWRR_FORM_CODE = 'HWRR';
export const HWRR_FORM_NAME = 'Hardware Request Form';

export const SITES = [
  { value: 'MY-PR', label: 'Prai (MY-PR)' },
  { value: 'MY-JH', label: 'Johor (MY-JH)' },
];

export const REQUEST_TYPES = [
  { value: 'NEW', label: 'New Hardware' },
  { value: 'REPLACEMENT', label: 'Replacement' },
  { value: 'UPGRADE', label: 'Upgrade' },
  { value: 'DISPOSAL', label: 'Disposal' },
  { value: 'TRANSFER', label: 'Transfer' },
];

export const HARDWARE_TYPES = [
  { value: 'LAPTOP', label: 'Laptop' },
  { value: 'DESKTOP', label: 'Desktop PC' },
  { value: 'MONITOR', label: 'Monitor' },
  { value: 'PRINTER', label: 'Printer' },
  { value: 'SCANNER', label: 'Scanner' },
  { value: 'UPS', label: 'UPS' },
  { value: 'KEYBOARD', label: 'Keyboard' },
  { value: 'MOUSE', label: 'Mouse' },
  { value: 'HEADSET', label: 'Headset' },
  { value: 'WEBCAM', label: 'Webcam' },
  { value: 'DOCKING_STATION', label: 'Docking Station' },
  { value: 'EXTERNAL_DRIVE', label: 'External Hard Drive' },
  { value: 'PROJECTOR', label: 'Projector' },
  { value: 'NETWORK', label: 'Network Equipment' },
  { value: 'SERVER', label: 'Server' },
  { value: 'TABLET', label: 'Tablet' },
  { value: 'MOBILE', label: 'Mobile Device' },
  { value: 'OTHER', label: 'Other' },
];

export const REPLACEMENT_REASONS = [
  { value: 'FAULTY', label: 'Faulty/Defective' },
  { value: 'END_OF_LIFE', label: 'End of Life' },
  { value: 'PERFORMANCE', label: 'Performance Issues' },
  { value: 'OBSOLETE', label: 'Obsolete/Outdated' },
  { value: 'DAMAGE', label: 'Physical Damage' },
  { value: 'OTHER', label: 'Other' },
];

export const UPGRADE_REASONS = [
  { value: 'PERFORMANCE', label: 'Performance Requirements' },
  { value: 'SOFTWARE', label: 'Software Requirements' },
  { value: 'CAPACITY', label: 'Storage/Capacity' },
  { value: 'JOB_CHANGE', label: 'Job Role Change' },
  { value: 'OTHER', label: 'Other' },
];

export const DISPOSAL_REASONS = [
  { value: 'END_OF_LIFE', label: 'End of Life' },
  { value: 'IRREPARABLE', label: 'Beyond Repair' },
  { value: 'OBSOLETE', label: 'Obsolete' },
  { value: 'POLICY', label: 'Policy Requirement' },
];

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const FORM_STEPS = [
  { id: 1, label: 'Requestor', description: 'Your information' },
  { id: 2, label: 'Hardware', description: 'Hardware details' },
  { id: 3, label: 'Justification', description: 'Business need' },
  { id: 4, label: 'Review', description: 'Confirm & submit' },
];

export interface HWRRFormInput {
  Company: string;
  Site: string;
  Department: string;
  PhoneExt: string;
  EmailAddress: string;
  RequestType: string;
  HardwareType: string;
  Quantity: number;
  Specifications: string;
  Location: string;
  OldAssetTag: string;
  OldSerialNumber: string;
  ReplacementReason: string;
  CurrentAssetTag: string;
  CurrentSpecs: string;
  DesiredSpecs: string;
  UpgradeReason: string;
  DisposalAssetTag: string;
  DisposalSerialNumber: string;
  DisposalReason: string;
  DataWipeConfirm: boolean;
  BusinessJustification: string;
  RequiredDate: Date | undefined;
  Priority: string;
  Remarks: string;
}

export interface HWRRSelectedForUser {
  email?: string;
}

export const WORKFLOW_STAGES = [
  { id: 1, key: 'SUBMISSION', label: 'Submitted', action: 'Submit' },
  { id: 2, key: 'HOD_APPROVAL', label: 'HOD Approval', action: 'HOD Review' },
  { id: 3, key: 'IT_REVIEW', label: 'IT Review', action: 'IT Assessment' },
  { id: 4, key: 'PROCUREMENT', label: 'Procurement', action: 'Procurement' },
  { id: 5, key: 'IT_SETUP', label: 'IT Setup', action: 'Setup' },
  { id: 6, key: 'HANDOVER', label: 'Handover', action: 'Complete' },
];

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SUBMITTED: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: '#3B82F6' },
  PENDING: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: '#F59E0B' },
  APPROVED: { bg: 'rgba(22, 163, 74, 0.1)', text: '#16A34A', border: '#16A34A' },
  REJECTED: { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626', border: '#DC2626' },
  COMPLETED: { bg: 'rgba(22, 163, 74, 0.1)', text: '#16A34A', border: '#16A34A' },
  IN_PROGRESS: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6', border: '#3B82F6' },
  PROCUREMENT: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8B5CF6', border: '#8B5CF6' },
};

export const REQUEST_TYPE_LABELS: Record<string, string> = {
  NEW: 'New Hardware',
  REPLACEMENT: 'Replacement',
  UPGRADE: 'Upgrade',
  DISPOSAL: 'Disposal',
  TRANSFER: 'Transfer',
};

export const HARDWARE_TYPE_LABELS: Record<string, string> = {
  LAPTOP: 'Laptop',
  DESKTOP: 'Desktop PC',
  MONITOR: 'Monitor',
  PRINTER: 'Printer',
  SCANNER: 'Scanner',
  UPS: 'UPS',
  KEYBOARD: 'Keyboard',
  MOUSE: 'Mouse',
  HEADSET: 'Headset',
  WEBCAM: 'Webcam',
  DOCKING_STATION: 'Docking Station',
  EXTERNAL_DRIVE: 'External Hard Drive',
  PROJECTOR: 'Projector',
  NETWORK: 'Network Equipment',
  SERVER: 'Server',
  TABLET: 'Tablet',
  MOBILE: 'Mobile Device',
  OTHER: 'Other',
};

export const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Low', color: '#6B7280' },
  MEDIUM: { label: 'Medium', color: '#F59E0B' },
  HIGH: { label: 'High', color: '#EA580C' },
  URGENT: { label: 'Urgent', color: '#DC2626' },
};

export function getRequestTypeLabel(value: string) {
  return REQUEST_TYPES.find((t) => t.value === value)?.label || value;
}

export function getHardwareTypeLabel(value: string) {
  return HARDWARE_TYPES.find((t) => t.value === value)?.label || value;
}

export function getPriorityLabel(value: string) {
  return PRIORITY_OPTIONS.find((p) => p.value === value)?.label || value;
}

export function getSiteLabel(value: string) {
  return SITES.find((s) => s.value === value)?.label || value;
}

export function buildHWRRMainDBITSubmission(
  formData: HWRRFormInput,
  userEmail: string
): Omit<MainDBIT, 'id'> {
  const siteKey = formData.Site === 'MY-JH' ? 'SiteKey0' : 'SiteKey2';
  return {
    title: `HWRR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0')}`,
    formcode: HWRR_FORM_CODE,
    currentStatus: 'CurrentstatusKey1',
    siteKey,
    requestoremail: userEmail,
    submitteddate: new Date().toISOString(),
  };
}

export function buildHWRRExtAssetRecord(
  formData: HWRRFormInput,
  selectedForUser?: HWRRSelectedForUser | null
): Omit<MainDBITExtAssets, 'id'> {
  return {
    title: `Asset Request for ${formData.Company || 'Unknown'}`,
    hICompany: formData.Company || 'N/A',
    hIDepartment: formData.Department || 'N/A',
    hIUsedByEmail: selectedForUser?.email || '',
    hILocation: formData.Location || 'N/A',
    hIType: formData.HardwareType || 'N/A',
  } as Omit<MainDBITExtAssets, 'id'>;
}
