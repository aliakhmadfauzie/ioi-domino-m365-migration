/**
 * Delegation Dialog Component
 * 
 * Allows approvers to delegate their approval responsibility to another user.
 * Features:
 * - User search and selection
 * - Reason for delegation (required)
 * - Optional expiry date
 * - Confirmation before delegation
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Search,
  AlertTriangle,
  ArrowRight,
  Mail,
  Building2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApproverRoleType } from '@/types/it-approval-workflow';

// =============================================================================
// TYPES
// =============================================================================

export interface DelegationTarget {
  id: string;
  name: string;
  email: string;
  department: string;
  role: ApproverRoleType;
  avatarUrl?: string;
}

export interface DelegationRequest {
  delegateToId: string;
  delegateToName: string;
  delegateToEmail: string;
  reason: string;
  expiryDate?: Date;
}

interface DelegationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  formCode: string;
  currentApprover: {
    id: string;
    name: string;
    email: string;
  };
  availableDelegates: DelegationTarget[];
  onDelegate: (request: DelegationRequest) => Promise<void>;
  isProcessing?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DelegationDialog({
  open,
  onOpenChange,
  ticketId,
  formCode,
  currentApprover,
  availableDelegates,
  onDelegate,
  isProcessing = false,
}: DelegationDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelegate, setSelectedDelegate] = useState<DelegationTarget | null>(null);
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  
  // Filter delegates based on search
  const filteredDelegates = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return availableDelegates.filter(
      (d: DelegationTarget) =>
        d.name?.toLowerCase().includes(query) ||
        d.email?.toLowerCase().includes(query) ||
        d.department?.toLowerCase().includes(query)
    );
  }, [availableDelegates, searchQuery]);
  
  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSearchQuery('');
      setSelectedDelegate(null);
      setReason('');
      setStep('select');
    }
    onOpenChange(newOpen);
  };
  
  // Handle delegate selection
  const handleSelectDelegate = (delegate: DelegationTarget) => {
    setSelectedDelegate(delegate);
  };
  
  // Handle proceed to confirmation
  const handleProceed = () => {
    if (selectedDelegate && reason.trim()) {
      setStep('confirm');
    }
  };
  
  // Handle back to selection
  const handleBack = () => {
    setStep('select');
  };
  
  // Handle delegation submission
  const handleSubmit = async () => {
    if (!selectedDelegate || !reason.trim()) return;
    
    await onDelegate({
      delegateToId: selectedDelegate.id,
      delegateToName: selectedDelegate.name,
      delegateToEmail: selectedDelegate.email,
      reason: reason.trim(),
    });
    
    handleOpenChange(false);
  };
  
  const canProceed = selectedDelegate && reason.trim().length >= 10;
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden bg-card">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Delegate Approval
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {ticketId} • {formCode}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'select' ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-4"
            >
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              
              {/* Delegate List */}
              <ScrollArea className="h-[200px] rounded-lg border border-border bg-background">
                <div className="p-2 space-y-1">
                  {filteredDelegates.length === 0 ? (
                    <div className="flex items-center justify-center h-[160px] text-muted-foreground text-sm">
                      No matching delegates found
                    </div>
                  ) : (
                    filteredDelegates.map((delegate: DelegationTarget) => (
                      <button
                        key={delegate.id}
                        onClick={() => handleSelectDelegate(delegate)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
                          selectedDelegate?.id === delegate.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted border border-transparent'
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                            {delegate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground truncate">{delegate.name}</span>
                            {selectedDelegate?.id === delegate.id && (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{delegate.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Building2 className="h-3 w-3" />
                            <span>{delegate.department}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {delegate.role}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              {/* Reason */}
              <div className="mt-4 space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason for Delegation <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for delegation (min. 10 characters)..."
                  value={reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                  className="min-h-[80px] bg-background resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {reason.length}/10 characters minimum
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-4"
            >
              {/* Confirmation View */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 py-4">
                  {/* From */}
                  <div className="text-center">
                    <Avatar className="h-12 w-12 mx-auto mb-2">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {currentApprover.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">{currentApprover.name}</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRight className="h-6 w-6 text-primary" />
                  
                  {/* To */}
                  <div className="text-center">
                    <Avatar className="h-12 w-12 mx-auto mb-2 ring-2 ring-primary ring-offset-2 ring-offset-background">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedDelegate?.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">{selectedDelegate?.name}</p>
                    <p className="text-xs text-muted-foreground">Delegate</p>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delegate Email</p>
                      <p className="text-sm text-foreground">{selectedDelegate?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm text-foreground">{selectedDelegate?.department}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                    <p className="text-sm text-foreground">{reason}</p>
                  </div>
                </div>
                
                {/* Warning */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Confirm Delegation</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Once delegated, {selectedDelegate?.name} will receive approval authority for this request. 
                      You will be notified of the outcome.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
          {step === 'select' ? (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleProceed}
                disabled={!canProceed}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className="min-w-[120px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Delegating...
                  </>
                ) : (
                  'Confirm Delegation'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DelegationDialog;