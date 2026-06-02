/**
 * Multi-Stage Form View Component
 * 
 * Displays submission details with stage-based read/edit permissions:
 * - Stage 1: Original request (read-only after submission)
 * - Stage 2: IT triage & assignment (editable when current stage = 2)
 * - Stage 3: Resolution & acceptance (editable when current stage = 3)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Wrench,
  CheckCircle2,
  Clock,
  Lock,
  MessageSquare,
  FileText,
  Building2,
  Phone,
  Laptop,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

// =============================================================================
// TYPES
// =============================================================================

export type SubmissionStage = 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Completed';

interface ParsedRemarks {
  caseStatus?: string;
  // Stage 1 fields
  company?: string;
  department?: string;
  extension?: string;
  serviceType?: string;
  hardware?: string;
  application?: string;
  module?: string;
  problemDescription?: string;
  requestorName?: string;
  // Stage 2 fields
  assignedToEmail?: string;
  assignedToName?: string;
  dateStarted?: string;
  // Stage 3 fields
  solution?: string;
  probCat?: string;
  probCat2?: string;
  classification?: string;
  supportMethod?: string;
  dateResolved?: string;
  dateNotifiedRequestor?: string;
  // Acceptance fields
  satisfactionRating?: number;
  requestorComment?: string;
  dateAccepted?: string;
  // IT Feedback
  itFeedback?: ITFeedbackEntry[];
}

interface ITFeedbackEntry {
  stage: number;
  from: string;
  fromName?: string;
  message: string;
  timestamp: string;
}

interface StageConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STAGE_CONFIG: StageConfig[] = [
  {
    id: 1,
    title: 'Requestor Details',
    description: 'Original request information',
    icon: User,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 2,
    title: 'IT Admin Triage',
    description: 'Assignment and initial review',
    icon: Users,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 3,
    title: 'IT Resolution',
    description: 'Solution and resolution details',
    icon: Wrench,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function parseRemarks(remarks: string | null | undefined): ParsedRemarks {
  try {
    return JSON.parse(remarks || '{}');
  } catch {
    return {};
  }
}

function getCurrentStageNumber(caseStatus: string | undefined): number {
  switch (caseStatus) {
    case 'Draft':
    case 'Submitted':
      return 1;
    case 'InProgress':
      return 2;
    case 'Resolved':
      return 3;
    case 'Accepted':
    case 'Closed':
      return 4; // Completed
    default:
      return 1;
  }
}

function canEditStage(stageNumber: number, currentStage: number, isRequestor: boolean, isITPIC: boolean): boolean {
  // Stage 1: Never editable after submission
  if (stageNumber === 1) return false;
  
  // Stage 2: Editable by IT when current stage is 2 (Submitted -> InProgress transition)
  if (stageNumber === 2 && currentStage === 1 && isITPIC) return true;
  
  // Stage 3: Editable by IT when current stage is 2 (InProgress)
  if (stageNumber === 3 && currentStage === 2 && isITPIC) return true;
  
  // Acceptance (part of stage 3 view): Editable by requestor when stage is 3 (Resolved)
  if (stageNumber === 3 && currentStage === 3 && isRequestor) return true;
  
  return false;
}

function isStageVisible(stageNumber: number, currentStage: number): boolean {
  // Stage 1: Always visible
  if (stageNumber === 1) return true;
  
  // Stage 2: Visible when current stage >= 1 (after submission)
  if (stageNumber === 2) return currentStage >= 1;
  
  // Stage 3: Visible when current stage >= 2 (after assignment)
  if (stageNumber === 3) return currentStage >= 2;
  
  return false;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface FieldRowProps {
  label: string;
  value: string | number | undefined | null;
  icon?: React.ElementType;
}

function FieldRow({ label, value, icon: Icon }: FieldRowProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

interface ITFeedbackPanelProps {
  feedback: ITFeedbackEntry[];
  stage: number;
}

function ITFeedbackPanel({ feedback, stage }: ITFeedbackPanelProps) {
  const stageFeedback = feedback.filter((f: ITFeedbackEntry) => f.stage === stage);
  
  if (stageFeedback.length === 0) return null;
  
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        IT Support Responses
      </div>
      {stageFeedback.map((entry: ITFeedbackEntry, index: number) => (
        <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50 border">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {(entry.fromName || entry.from)?.[0]?.toUpperCase() || 'IT'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{entry.fromName || entry.from}</span>
              <span className="text-xs text-muted-foreground">
                {entry.timestamp ? format(parseISO(entry.timestamp), 'MMM d, yyyy h:mm a') : ''}
              </span>
            </div>
            <p className="text-sm text-foreground">{entry.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface StageSectionProps {
  config: StageConfig;
  currentStage: number;
  isRequestor: boolean;
  isITPIC: boolean;
  remarks: ParsedRemarks;
  submission: MainDBIT;
  defaultExpanded?: boolean;
}

function StageSection({
  config,
  currentStage,
  isRequestor,
  isITPIC,
  remarks,
  submission,
  defaultExpanded = false,
}: StageSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const isVisible = isStageVisible(config.id, currentStage);
  const canEdit = canEditStage(config.id, currentStage, isRequestor, isITPIC);
  const isCompleted = config.id < currentStage || (config.id === currentStage && currentStage === 4);
  const isActive = config.id === currentStage || (config.id === 3 && currentStage === 3);
  
  const Icon = config.icon;

  // Content for each stage
  const renderStageContent = () => {
    switch (config.id) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldRow label="Company" value={remarks.company} icon={Building2} />
              <FieldRow label="Department" value={remarks.department} icon={Users} />
              <FieldRow label="Extension" value={remarks.extension} icon={Phone} />
              <FieldRow label="Service Type" value={remarks.serviceType} icon={Laptop} />
            </div>
            <div>
              <FieldRow label="Hardware" value={remarks.hardware} icon={Laptop} />
              <FieldRow label="Application" value={remarks.application} icon={FileText} />
              <FieldRow label="Module" value={remarks.module} />
            </div>
            <div className="col-span-full">
              <div className="py-2">
                <p className="text-sm text-muted-foreground mb-1">Problem Description</p>
                <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
                  {remarks.problemDescription || submission.title || 'No description provided'}
                </p>
              </div>
            </div>
            {remarks.itFeedback && (
              <div className="col-span-full">
                <ITFeedbackPanel feedback={remarks.itFeedback} stage={1} />
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldRow label="Assigned To" value={remarks.assignedToName || remarks.assignedToEmail} icon={User} />
              <FieldRow 
                label="Date Started" 
                value={remarks.dateStarted ? format(parseISO(remarks.dateStarted), 'MMM d, yyyy h:mm a') : undefined} 
                icon={Clock} 
              />
            </div>
            {!remarks.assignedToEmail && currentStage === 1 && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Waiting for IT Admin to assign this request
                </p>
              </div>
            )}
            {remarks.itFeedback && (
              <ITFeedbackPanel feedback={remarks.itFeedback} stage={2} />
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            {/* Resolution Section */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                IT Resolution
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="Problem Category" value={remarks.probCat} />
                <FieldRow label="Secondary Category" value={remarks.probCat2} />
                <FieldRow label="Classification" value={remarks.classification} />
                <FieldRow label="Support Method" value={remarks.supportMethod} />
                <FieldRow 
                  label="Date Resolved" 
                  value={remarks.dateResolved ? format(parseISO(remarks.dateResolved), 'MMM d, yyyy h:mm a') : undefined} 
                  icon={Clock}
                />
              </div>
              {remarks.solution && (
                <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-2">Solution Provided:</p>
                  <p className="text-sm text-blue-900 whitespace-pre-wrap">{remarks.solution}</p>
                </div>
              )}
            </div>
            
            {/* Acceptance Section (visible when resolved) */}
            {currentStage >= 3 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Your Acceptance
                  </h4>
                  {remarks.satisfactionRating !== undefined ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(10)].map((_, i: number) => (
                            <div
                              key={i}
                              className={`h-2 w-4 rounded-sm ${
                                i < (remarks.satisfactionRating || 0)
                                  ? 'bg-primary'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-primary">
                          {remarks.satisfactionRating}/10
                        </span>
                      </div>
                      <FieldRow 
                        label="Accepted On" 
                        value={remarks.dateAccepted ? format(parseISO(remarks.dateAccepted), 'MMM d, yyyy h:mm a') : undefined}
                        icon={CheckCircle2}
                      />
                      {remarks.requestorComment && (
                        <div className="col-span-full">
                          <p className="text-sm text-muted-foreground mb-1">Your Feedback</p>
                          <p className="text-sm font-medium text-foreground">{remarks.requestorComment}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    currentStage === 3 && isRequestor ? (
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm text-green-800">
                          <CheckCircle2 className="h-4 w-4 inline mr-2" />
                          IT has resolved your request. Please review and accept the solution.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">
                          Waiting for requestor to accept the resolution
                        </p>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
            
            {remarks.itFeedback && (
              <ITFeedbackPanel feedback={remarks.itFeedback} stage={3} />
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Lock overlay for hidden stages
  if (!isVisible) {
    return (
      <Card className="relative overflow-hidden opacity-60">
        <div className="absolute inset-0 bg-muted/80 z-10 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              {config.id === 2
                ? 'Waiting for submission'
                : 'Waiting for IT assignment'}
            </p>
          </div>
        </div>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-base">Stage {config.id} — {config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-24" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: config.id * 0.1 }}
    >
      <Card className={`${config.borderColor} border-l-4 transition-shadow hover:shadow-md`}>
        <CardHeader className="pb-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Stage {config.id} — {config.title}</CardTitle>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {isActive && !isCompleted && (
                    <Badge className="bg-blue-100 text-blue-700 border-0">
                      <Clock className="h-3 w-3 mr-1" />
                      Current
                    </Badge>
                  )}
                  {canEdit && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Editable
                    </Badge>
                  )}
                </div>
                <CardDescription>{config.description}</CardDescription>
              </div>
            </div>
            <div className="p-2">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </CardHeader>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>{renderStageContent()}</CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface MultiStageFormViewProps {
  submission: MainDBIT;
  userEmail: string;
  onEdit?: (stageNumber: number) => void;
}

export function MultiStageFormView({ submission, userEmail, onEdit }: MultiStageFormViewProps) {
  const remarks = parseRemarks(submission.remarks);
  const currentStage = getCurrentStageNumber(remarks.caseStatus);
  
  const isRequestor = submission.requestoremail?.toLowerCase() === userEmail.toLowerCase();
  const isITPIC = remarks.assignedToEmail?.toLowerCase() === userEmail.toLowerCase();
  const isAdmin = userEmail.toLowerCase().includes('admin') || userEmail.toLowerCase().includes('it');

  return (
    <div className="space-y-4">
      {STAGE_CONFIG.map((config: StageConfig) => (
        <StageSection
          key={config.id}
          config={config}
          currentStage={currentStage}
          isRequestor={isRequestor}
          isITPIC={isITPIC || isAdmin}
          remarks={remarks}
          submission={submission}
          defaultExpanded={config.id === currentStage || config.id === 1}
        />
      ))}
    </div>
  );
}

export { getCurrentStageNumber, parseRemarks, canEditStage };
export type { ParsedRemarks, ITFeedbackEntry };