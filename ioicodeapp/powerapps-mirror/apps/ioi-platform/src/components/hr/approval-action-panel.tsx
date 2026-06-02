/**
 * Shared ApprovalActionPanel component.
 * Renders contextual action buttons based on CurrentAction.
 * Shows different buttons per workflow stage.
 */

import { useState } from 'react';
import { Loader2, ThumbsUp, ThumbsDown, Send, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface ApprovalAction {
  /** The next CurrentAction value this button sets */
  nextAction: string;
  /** Button label */
  label: string;
  /** Visual style */
  variant?: 'approve' | 'reject' | 'submit' | 'draft' | 'default';
}

interface ApprovalActionPanelProps {
  /** Current workflow state */
  currentAction: string | undefined;
  /** Available actions for the current state */
  actions: ApprovalAction[];
  /** Called when an action is triggered with remarks */
  onAction: (nextAction: string, remarks?: string) => Promise<void>;
  /** Loading state */
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  approve: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  reject: 'bg-red-600 hover:bg-red-700 text-white',
  submit: '',
  draft: '',
  default: '',
};

const variantIcons: Record<string, React.ReactNode> = {
  approve: <ThumbsUp className="mr-2 h-4 w-4" />,
  reject: <ThumbsDown className="mr-2 h-4 w-4" />,
  submit: <Send className="mr-2 h-4 w-4" />,
  draft: <Clock className="mr-2 h-4 w-4" />,
};

export function ApprovalActionPanel({ currentAction, actions, onAction, loading = false, className = '' }: ApprovalActionPanelProps) {
  const [remarks, setRemarks] = useState('');

  const handleAction = async (action: ApprovalAction) => {
    await onAction(action.nextAction, remarks);
  };

  // Terminal states — show status message instead of buttons
  if (currentAction === 'Completed' || currentAction === 'Accepted' || currentAction === 'Approved') {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>This request has been completed.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentAction === 'Denied' || currentAction === 'Rejected') {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            <span>This request was {currentAction?.toLowerCase()}.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="action-remarks">Remarks</Label>
            <Textarea
              id="action-remarks"
              placeholder="Add remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
            />
          </div>
        )}
        <div className="flex gap-2">
          {actions.map((action) => {
            const isReject = action.variant === 'reject';
            return (
              <Button
                key={action.nextAction}
                className={`flex-1 ${variantStyles[action.variant ?? ''] || ''}`}
                variant={isReject ? 'destructive' : action.variant === 'approve' || action.variant === 'submit' ? 'default' : 'secondary'}
                onClick={() => handleAction(action)}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : variantIcons[action.variant ?? '']}
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
