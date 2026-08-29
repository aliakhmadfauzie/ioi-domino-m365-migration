/**
 * Delegation Dialog Component
 * 
 * Allows approvers to delegate their approval responsibility to another user.
 * Features:
 * - People picker with live search
 * - Reason input with validation
 * - Optional expiry date
 * - Confirmation flow
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus,
  Search,
  Calendar,
  AlertCircle,
  Check,
  X,
  User,
  Mail,
  Building2,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useFormApprovers, type ApproverInfo } from '@/hooks/use-approver-matrix';
import { useLiveApproverSearch } from '@/hooks/use-live-approver-search';
import type { DelegationRequest } from '@/services/workflow-orchestration-service';

interface DelegationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  formCode: string;
  ticketId: string;
  currentApprover: {
    id: string;
    name: string;
    email: string;
  };
  onDelegate: (request: DelegationRequest) => Promise<void>;
  isProcessing?: boolean;
}

export function DelegationDialog({
  open,
  onOpenChange,
  formId,
  formCode,
  ticketId,
  currentApprover,
  onDelegate,
  isProcessing = false,
}: DelegationDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelegate, setSelectedDelegate] = useState<ApproverInfo | null>(null);
  const [reason, setReason] = useState('');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get approvers from matrix
  const { allApprovers, isLoading: isLoadingApprovers } = useFormApprovers(formCode);
  
  // Live search (if Graph API is available)
  const { 
    results: liveResults, 
    isSearching,
    searchUsers 
  } = useLiveApproverSearch();

  // Filter approvers based on search
  const filteredApprovers = useMemo(() => {
    if (!searchQuery.trim()) return allApprovers.slice(0, 10);
    
    const query = searchQuery.toLowerCase();
    return allApprovers.filter((approver: ApproverInfo) =>
      approver.name?.toLowerCase().includes(query) ||
      approver.email?.toLowerCase().includes(query) ||
      approver.department?.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [allApprovers, searchQuery]);

  // Combine local and live results
  const displayResults = useMemo(() => {
    if (liveResults.length > 0) {
      return liveResults;
    }
    return filteredApprovers;
  }, [filteredApprovers, liveResults]);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      searchUsers(value);
    }
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedDelegate) {
      newErrors.delegate = 'Please select a delegate';
    }
    
    if (!reason.trim()) {
      newErrors.reason = 'Please provide a reason for delegation';
    } else if (reason.length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }
    
    if (selectedDelegate?.email === currentApprover.email) {
      newErrors.delegate = 'Cannot delegate to yourself';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle delegation
  const handleDelegate = async () => {
    if (!validate() || !selectedDelegate) return;
    
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    const request: DelegationRequest = {
      formId,
      formCode,
      currentApproverId: currentApprover.id,
      currentApproverName: currentApprover.name,
      delegateToId: selectedDelegate.id,
      delegateToName: selectedDelegate.name,
      delegateToEmail: selectedDelegate.email,
      reason,
      expiryDate,
    };
    
    await onDelegate(request);
    
    // Reset form
    setSelectedDelegate(null);
    setReason('');
    setExpiryDate(undefined);
    setShowConfirmation(false);
    setSearchQuery('');
  };

  // Reset on close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedDelegate(null);
      setReason('');
      setExpiryDate(undefined);
      setShowConfirmation(false);
      setSearchQuery('');
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Delegate Approval
          </DialogTitle>
          <DialogDescription>
            Delegate your approval responsibility for ticket <strong>{ticketId}</strong> to another approver.
          </DialogDescription>
        </DialogHeader>

        {showConfirmation ? (
          // Confirmation View
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Confirm Delegation</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    You are about to delegate your approval responsibility to:
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedDelegate?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDelegate?.email}</p>
                  {selectedDelegate?.department && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {selectedDelegate.department}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Reason:</strong> {reason}
                </p>
                {expiryDate && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Expires:</strong> {format(expiryDate, 'PPP')}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {selectedDelegate?.name} will receive a notification and will be able to approve or reject this request.
            </p>
          </motion.div>
        ) : (
          // Form View
          <div className="space-y-4 py-4">
            {/* Delegate Selection */}
            <div className="space-y-2">
              <Label htmlFor="delegate-search">Select Delegate</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="delegate-search"
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>
              {errors.delegate && (
                <p className="text-sm text-destructive">{errors.delegate}</p>
              )}

              {/* Results List */}
              <ScrollArea className="h-48 rounded-md border border-border">
                {isLoadingApprovers ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : displayResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <User className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No approvers found</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {displayResults.map((approver: ApproverInfo) => (
                      <button
                        key={approver.id}
                        onClick={() => setSelectedDelegate(approver)}
                        disabled={approver.email === currentApprover.email}
                        className={cn(
                          'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                          selectedDelegate?.id === approver.id
                            ? 'bg-primary/10 border border-primary'
                            : 'hover:bg-muted',
                          approver.email === currentApprover.email && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {approver.name}
                            {approver.email === currentApprover.email && ' (You)'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{approver.email}</p>
                          {approver.department && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{approver.department}</span>
                            </div>
                          )}
                        </div>
                        {selectedDelegate?.id === approver.id && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Selected Delegate Badge */}
              {selectedDelegate && (
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{selectedDelegate.name}</span>
                  <span className="text-sm text-muted-foreground">{selectedDelegate.email}</span>
                  <button
                    onClick={() => setSelectedDelegate(null)}
                    className="ml-auto p-1 hover:bg-muted rounded"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Delegation</Label>
              <Textarea
                id="reason"
                placeholder="Explain why you are delegating this approval..."
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                rows={3}
                className={cn(errors.reason && 'border-destructive')}
              />
              {errors.reason && (
                <p className="text-sm text-destructive">{errors.reason}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This reason will be visible in the approval history.
              </p>
            </div>

            {/* Expiry Date (Optional) */}
            <div className="space-y-2">
              <Label>Delegation Expiry (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !expiryDate && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, 'PPP') : 'Set expiry date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={(date: Date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                If set, the delegation will automatically expire on this date.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {showConfirmation ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
              >
                Go Back
              </Button>
              <Button
                onClick={handleDelegate}
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Delegating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Delegation
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelegate}
                disabled={!selectedDelegate || !reason.trim()}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Continue
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}