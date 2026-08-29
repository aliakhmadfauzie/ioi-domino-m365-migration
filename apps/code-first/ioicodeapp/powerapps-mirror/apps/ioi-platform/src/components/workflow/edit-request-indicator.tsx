import { motion } from 'motion/react';
import { Edit3, Clock, CheckCircle2, XCircle, AlertTriangle, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import {
  getEditRequestFromRemarks,
  getEditStateFromRemarks,
  type EditRequest,
  type EditRequestStatus,
} from '@/hooks/use-edit-request';

interface EditRequestIndicatorProps {
  remarks: string | undefined;
  variant?: 'badge' | 'inline' | 'compact';
  onRequestEdit?: () => void;
  showRequestButton?: boolean;
  className?: string;
}

export function EditRequestIndicator({
  remarks,
  variant = 'badge',
  onRequestEdit,
  showRequestButton = false,
  className = '',
}: EditRequestIndicatorProps) {
  const editState = getEditStateFromRemarks(remarks);
  const editRequest = getEditRequestFromRemarks(remarks);

  // Calculate time remaining if edit window is active
  const getTimeRemaining = (): string | null => {
    if (!editRequest?.editWindowExpires) return null;
    const expiresAt = new Date(editRequest.editWindowExpires);
    const hoursRemaining = differenceInHours(expiresAt, new Date());
    if (hoursRemaining <= 0) return 'Expired';
    if (hoursRemaining <= 24) return `${hoursRemaining}h remaining`;
    return `${Math.ceil(hoursRemaining / 24)}d remaining`;
  };

  // No edit activity - show nothing or show request button
  if (editState === 'SUBMITTED' && !editRequest) {
    if (showRequestButton && onRequestEdit) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRequestEdit}
          className={`text-muted-foreground hover:text-foreground ${className}`}
        >
          <Edit3 className="h-3.5 w-3.5 mr-1.5" />
          Request Edit
        </Button>
      );
    }
    return null;
  }

  // Render based on edit state
  const renderContent = () => {
    switch (editState) {
      case 'EDIT_REQUEST_RAISED':
        return {
          icon: <Clock className="h-3.5 w-3.5" />,
          label: 'Edit Requested',
          description: editRequest
            ? `Requested ${formatDistanceToNow(new Date(editRequest.requestedAt), { addSuffix: true })}`
            : 'Awaiting IT approval',
          bgClass: 'bg-[#FFF3E0]',
          textClass: 'text-[#7B3E00]',
          borderClass: 'border-[#7B3E00]/20',
        };

      case 'EDIT_UNLOCKED':
        const timeRemaining = getTimeRemaining();
        return {
          icon: <Unlock className="h-3.5 w-3.5" />,
          label: 'Edit Unlocked',
          description: timeRemaining || 'Ready to edit',
          bgClass: 'bg-[#E8F5E9]',
          textClass: 'text-[#1B5E20]',
          borderClass: 'border-[#1B5E20]/20',
          urgent: timeRemaining === 'Expired',
        };

      case 'EDIT_COMPLETED':
        return {
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          label: 'Edit Completed',
          description: editRequest?.editCompletedAt
            ? `Completed ${formatDistanceToNow(new Date(editRequest.editCompletedAt), { addSuffix: true })}`
            : 'Changes saved',
          bgClass: 'bg-[#EAF0FB]',
          textClass: 'text-[#1752A8]',
          borderClass: 'border-[#1752A8]/20',
        };

      case 'SUBMITTED':
        // Handle rejected state
        if (editRequest?.status === 'REJECTED') {
          return {
            icon: <XCircle className="h-3.5 w-3.5" />,
            label: 'Edit Rejected',
            description: editRequest.reviewerComments || 'Request was rejected',
            bgClass: 'bg-destructive/10',
            textClass: 'text-destructive',
            borderClass: 'border-destructive/20',
          };
        }
        return null;

      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  // Compact variant - just an icon with tooltip
  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${content.bgClass} ${className}`}
            >
              <span className={content.textClass}>{content.icon}</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="font-medium">{content.label}</p>
            <p className="text-xs text-muted-foreground">{content.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Badge variant
  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={className}
      >
        <Badge
          className={`${content.bgClass} ${content.textClass} border ${content.borderClass} font-normal gap-1.5`}
        >
          {content.icon}
          {content.label}
          {content.urgent && (
            <AlertTriangle className="h-3 w-3 ml-1 animate-pulse" />
          )}
        </Badge>
      </motion.div>
    );
  }

  // Inline variant - more detailed
  return (
    <motion.div
      initial={{ y: -4, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${content.bgClass} border ${content.borderClass} ${className}`}
    >
      <span className={content.textClass}>{content.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${content.textClass}`}>{content.label}</p>
        <p className={`text-xs ${content.textClass}/70 truncate`}>{content.description}</p>
      </div>
      {content.urgent && (
        <AlertTriangle className={`h-4 w-4 ${content.textClass} animate-pulse`} />
      )}
    </motion.div>
  );
}

// Separate component for showing edit window countdown banner
interface EditWindowBannerProps {
  remarks: string | undefined;
  onEditNow?: () => void;
  onViewChanges?: () => void;
}

export function EditWindowBanner({ remarks, onEditNow, onViewChanges }: EditWindowBannerProps) {
  const editState = getEditStateFromRemarks(remarks);
  const editRequest = getEditRequestFromRemarks(remarks);

  if (editState !== 'EDIT_UNLOCKED' || !editRequest?.editWindowExpires) {
    return null;
  }

  const expiresAt = new Date(editRequest.editWindowExpires);
  const hoursRemaining = differenceInHours(expiresAt, new Date());
  const isExpired = hoursRemaining <= 0;
  const isUrgent = hoursRemaining <= 12;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`rounded-xl border overflow-hidden ${
        isExpired
          ? 'bg-destructive/10 border-destructive/30'
          : isUrgent
          ? 'bg-[#FFF3E0] border-[#7B3E00]/30'
          : 'bg-[#E8F5E9] border-[#1B5E20]/30'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              isExpired
                ? 'bg-destructive/20'
                : isUrgent
                ? 'bg-[#7B3E00]/10'
                : 'bg-[#1B5E20]/10'
            }`}
          >
            {isExpired ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Unlock
                className={`h-5 w-5 ${
                  isUrgent ? 'text-[#7B3E00]' : 'text-[#1B5E20]'
                }`}
              />
            )}
          </div>
          <div className="flex-1">
            <h4
              className={`font-semibold ${
                isExpired
                  ? 'text-destructive'
                  : isUrgent
                  ? 'text-[#7B3E00]'
                  : 'text-[#1B5E20]'
              }`}
            >
              {isExpired
                ? 'Edit Window Expired'
                : 'Edit Window Active'}
            </h4>
            <p
              className={`text-sm mt-0.5 ${
                isExpired
                  ? 'text-destructive/80'
                  : isUrgent
                  ? 'text-[#7B3E00]/80'
                  : 'text-[#1B5E20]/80'
              }`}
            >
              {isExpired
                ? 'Your edit window has expired. Please submit a new edit request if needed.'
                : isUrgent
                ? `Only ${hoursRemaining} hours remaining to make your changes!`
                : `You have ${hoursRemaining} hours to edit this submission.`}
            </p>
            {editRequest.reviewerComments && (
              <p className="text-sm mt-2 italic text-muted-foreground">
                Approver note: "{editRequest.reviewerComments}"
              </p>
            )}
          </div>
          {!isExpired && onEditNow && (
            <Button
              size="sm"
              onClick={onEditNow}
              className={`${
                isUrgent
                  ? 'bg-[#7B3E00] hover:bg-[#5C2D00] text-white'
                  : 'bg-[#1B5E20] hover:bg-[#166534] text-white'
              }`}
            >
              <Edit3 className="h-4 w-4 mr-1.5" />
              Edit Now
            </Button>
          )}
          {isExpired && onViewChanges && (
            <Button variant="outline" size="sm" onClick={onViewChanges}>
              View History
            </Button>
          )}
        </div>

        {/* Progress bar showing time remaining */}
        {!isExpired && (
          <div className="mt-4">
            <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, (hoursRemaining / 72) * 100)}%` }}
                className={`h-full rounded-full ${
                  isUrgent ? 'bg-[#7B3E00]' : 'bg-[#1B5E20]'
                }`}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Now</span>
              <span>{hoursRemaining}h remaining</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}