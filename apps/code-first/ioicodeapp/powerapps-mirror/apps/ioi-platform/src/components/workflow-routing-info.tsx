/**
 * Workflow Routing Info Component
 * Displays current routing configuration for testing/development
 */

import { AlertCircle, ArrowRight, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  isRoutingEnabled,
  getSubmissionApproverEmail,
  getSubmissionApproverName,
  getTestUsers,
  type TestUserRole,
} from '@/config/workflow-routing';

interface WorkflowRoutingInfoProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function WorkflowRoutingInfo({ variant = 'compact', className = '' }: WorkflowRoutingInfoProps) {
  if (!isRoutingEnabled()) {
    return null;
  }

  const testUsers = getTestUsers();
  const firstApprover = getSubmissionApproverName();
  const firstApproverEmail = getSubmissionApproverEmail();

  const getRoleBadgeVariant = (role: TestUserRole) => {
    switch (role) {
      case 'approver':
        return 'default';
      case 'initiator_approver':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: TestUserRole) => {
    switch (role) {
      case 'approver':
        return 'Approver';
      case 'initiator_approver':
        return 'Initiator & Approver';
      case 'initiator':
        return 'Initiator';
      default:
        return role;
    }
  };

  if (variant === 'compact') {
    return (
      <Alert className={`border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 ${className}`}>
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">Test Routing Active</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          All submissions route to <span className="font-semibold">{firstApprover}</span>{' '}
          <span className="text-sm opacity-75">({firstApproverEmail})</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 ${className}`}>
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-200">Test Workflow Routing Active</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 space-y-3">
        <p className="flex items-center gap-2">
          <span>New submissions</span>
          <ArrowRight className="h-4 w-4" />
          <span className="font-semibold">{firstApprover}</span>{' '}
          <span className="text-sm opacity-75">({firstApproverEmail})</span>
        </p>
        
        <div className="border-t border-amber-400/30 pt-2 mt-2">
          <p className="text-sm font-medium mb-2">Test Users:</p>
          <div className="space-y-1">
            {testUsers.map((user) => (
              <div key={user.email} className="flex items-center gap-2 text-sm">
                <User className="h-3 w-3" />
                <span>{user.name}</span>
                <span className="opacity-60">({user.email})</span>
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default WorkflowRoutingInfo;