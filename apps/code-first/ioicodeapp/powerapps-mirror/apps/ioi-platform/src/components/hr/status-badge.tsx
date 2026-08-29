/**
 * Shared StatusBadge component for HR workflow statuses.
 * Uses the color theme from docs/page-requirements-guide.md §7.
 * 
 * Usage:
 *   <StatusBadge status={record.CurrentAction} />
 *   <StatusBadge status={record.CurrentAction} size="lg" />
 */

import { Badge } from '@/components/ui/badge';
import { displayChoiceLabel } from '@/lib/display-labels';

export type WorkflowStatus =
  | 'Request'
  | 'Draft'
  | 'Submitted'
  | 'SubmittedInspection'
  | 'HOSApproved'
  | 'HODApproved'
  | 'HODApproval'
  | 'HRReview'
  | 'VendorAssignment'
  | 'HODFinalApproval'
  | 'Accepted'
  | 'Approved'
  | 'Completed'
  | 'Closed'
  | 'Denied'
  | 'Rejected'
  | 'Withdrawn'
  | (string & {});

interface StatusBadgeProps {
  status: WorkflowStatus | undefined;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  Request:           { bg: 'bg-slate-100',  text: 'text-slate-600',  label: 'Draft' },
  Draft:             { bg: 'bg-slate-100',  text: 'text-slate-600',  label: 'Draft' },
  Submitted:         { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'Pending Review' },
  SubmittedInspection:{bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'Pending Review' },
  HOSApproved:       { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'HOS Approved' },
  HODApproved:       { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'HOD Approved' },
  HODApproval:       { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'HOD Review' },
  HRReview:          { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'HR Review' },
  VendorAssignment:  { bg: 'bg-cyan-100',   text: 'text-cyan-800',   label: 'Vendor Assignment' },
  HODFinalApproval:  { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'Final HOD' },
  Accepted:          { bg: 'bg-emerald-100',text: 'text-emerald-800',label: 'Accepted' },
  Approved:          { bg: 'bg-emerald-100',text: 'text-emerald-800',label: 'Approved' },
  Completed:         { bg: 'bg-emerald-100',text: 'text-emerald-800',label: 'Completed' },
  Closed:            { bg: 'bg-slate-100',  text: 'text-slate-500',  label: 'Closed' },
  Denied:            { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Denied' },
  Rejected:          { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Rejected' },
  Withdrawn:         { bg: 'bg-slate-100',  text: 'text-slate-500',  label: 'Withdrawn' },
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0',
  default: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
};

export function StatusBadge({ status, size = 'default', className = '' }: StatusBadgeProps) {
  const displayStatus = displayChoiceLabel(status, 'status');
  const style = status ? statusStyles[status] ?? statusStyles[displayStatus] : undefined;
  if (!style) {
    return <Badge variant="outline" className={className}>{displayStatus || 'Unknown'}</Badge>;
  }
  return (
    <Badge className={`${style.bg} ${style.text} border-none ${sizeClasses[size]} ${className}`}>
      {style.label}
    </Badge>
  );
}

/** Map a workflow status to a dot color class for timelines */
export function statusDotColor(status: WorkflowStatus | undefined): string {
  switch (status) {
    case 'Request': case 'Draft':     return 'bg-slate-400';
    case 'Submitted': case 'SubmittedInspection': case 'HODApproval': case 'HODFinalApproval':
      return 'bg-amber-500';
    case 'HOSApproved':               return 'bg-blue-500';
    case 'HODApproved':               return 'bg-indigo-500';
    case 'HRReview':                  return 'bg-blue-500';
    case 'VendorAssignment':          return 'bg-cyan-500';
    case 'Accepted': case 'Approved': case 'Completed': case 'Closed':
      return 'bg-emerald-500';
    case 'Denied': case 'Rejected':   return 'bg-red-500';
    case 'Withdrawn':                 return 'bg-slate-400';
    default:                          return 'bg-slate-300';
  }
}
