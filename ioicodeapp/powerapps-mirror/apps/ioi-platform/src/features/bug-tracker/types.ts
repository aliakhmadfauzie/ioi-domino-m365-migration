// Bug Tracker Types and Configuration

export type BugSeverity = 'critical' | 'major' | 'minor' | 'cosmetic';
export type BugCategory = 'ui' | 'data' | 'functionality' | 'performance' | 'other';
export type BugStatus = 'new' | 'in-progress' | 'resolved' | 'closed' | 'wontfix';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 encoded file
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  category: BugCategory;
  status: BugStatus;
  currentPage: string;
  stepsToReproduce?: string;
  screenshot?: string; // Base64 encoded image
  attachments?: FileAttachment[]; // File attachments
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  assignedTo?: {
    id: string;
    displayName: string;
    email: string;
  };
  resolution?: string;
  browserInfo?: string;
}

export interface BugReportInput {
  title: string;
  description: string;
  severity: BugSeverity;
  category: BugCategory;
  currentPage: string;
  stepsToReproduce?: string;
  screenshot?: string; // Base64 encoded image
  attachments?: FileAttachment[]; // File attachments
  assignedTo?: {
    id: string;
    displayName: string;
    email: string;
  };
}

export interface BugStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

// Configuration for severity levels
export const severityConfig: Record<BugSeverity, { label: string; color: string; bgColor: string }> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  major: {
    label: 'Major',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  minor: {
    label: 'Minor',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  cosmetic: {
    label: 'Cosmetic',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
};

// Configuration for categories
export const categoryConfig: Record<BugCategory, { label: string; icon: string }> = {
  ui: { label: 'UI/Visual', icon: 'palette' },
  data: { label: 'Data Issue', icon: 'database' },
  functionality: { label: 'Functionality', icon: 'cog' },
  performance: { label: 'Performance', icon: 'zap' },
  other: { label: 'Other', icon: 'help-circle' },
};

// Configuration for status
export const statusConfig: Record<BugStatus, { label: string; color: string; bgColor: string }> = {
  new: {
    label: 'New',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  closed: {
    label: 'Closed',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  wontfix: {
    label: "Won't Fix",
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
  },
};