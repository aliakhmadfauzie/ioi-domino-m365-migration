/**
 * SAPSOF2 - SAP UAT Sign-Off Database View
 * Shows all UAT sign-off submissions with detail modal
 * Displays test evidence and approval records as child tables
 * 
 * Final Closure Rules:
 * - Only IT Admin or IT Functional Owner can close
 * - Status must be Closed
 * - FinalDecision and FinalDecisionDate must be set
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Plus,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  Shield,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { useUser } from '@/hooks/use-user';
import { useSAPRoutingEmails } from '@/hooks/use-app-settings-lookup';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useApprovalRecordsList } from '@/generated/hooks/use-approval-records';
import { useITSAPSOFTestEvidenceList } from '@/generated/hooks/use-it-sapsof-test-evidence';
import {
  ApprovalRecordsActionKeyToLabel,
  type ApprovalRecords,
} from '@/generated/models/approval-records-model';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { ITSAPSOFTestEvidence } from '@/generated/models/it-sapsof-test-evidence-model';
import { getITFormCodeAliases, getITFormCodeFilter } from '@/lib/it-form-routes';
import { recordITApprovalAction } from '@/lib/it-approval-actions';

import type {
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';
  SAPSOF2Stage,
  SAPSOF2Status,
  SAPSOF2FinalDecision,
} from '@/types/sap-forms';

// Extended record type for display
interface SAPSOF2Record {
  id: string;
  ticketId: string;
  submittedDate: Date;
  submittedBy: string;
  submittedByEmail: string;
  client: string;
  clientNumber: string;
  plant: string;
  moduleName: string;
  referenceName?: string;
  trNumber: string;
  itRemarks?: string;
  itFunctionalOwner: string;
  currentStage: SAPSOF2Stage;
  status: SAPSOF2Status;
  isBPORequired: boolean;
  // Key Users
  keyUsers: Array<{ slot: string; name: string; email: string; decision: string; locked: boolean }>;
  // BPO Approvers
  bpoApprovers: Array<{ slot: string; name: string; email: string; decision: string; locked: boolean }>;
  // Test Evidence
  testEvidence: Array<{
    scenarioNumber: number;
    description: string;
    tCode: string;
    expectedResult: string;
    actualResult: string;
    passFail: 'Pass' | 'Fail';
  }>;
}

type ParsedSAPSOF2Remarks = {
  values: Record<string, string>;
  keyUsers: SAPSOF2Record['keyUsers'];
  bpoApprovers: SAPSOF2Record['bpoApprovers'];
  testEvidence: SAPSOF2Record['testEvidence'];
};

const SAPSOF2_STAGE_BY_WORKFLOW: Record<number, SAPSOF2Stage> = {
  1: 'Draft',
  2: 'KeyUserSignoff',
  3: 'BPOApproval',
  4: 'FinalReview',
  5: 'Closed',
};

function statusKeyToLabel(statusKey?: string): string {
  if (!statusKey) return '';
  return MainDBITCurrentstatusKeyToLabel[
    statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel
  ] ?? statusKey;
}

function toSAPSOF2Status(value: string): SAPSOF2Status {
  if (value === 'Draft' || value === 'Submitted' || value === 'InProgress' || value === 'Approved' || value === 'Rejected' || value === 'Closed') {
    return value;
  }
  if (value.toLowerCase().includes('reject')) return 'Rejected';
  if (value.toLowerCase().includes('approv')) return 'Approved';
  if (value.toLowerCase().includes('clos')) return 'Closed';
  if (value.toLowerCase().includes('draft')) return 'Draft';
  return 'Submitted';
}

function toSAPSOF2Stage(value: string | undefined, workflowStage?: number): SAPSOF2Stage {
  if (value === 'Draft' || value === 'KeyUserSignoff' || value === 'BPOApproval' || value === 'FinalReview' || value === 'Closed') {
    return value;
  }
  return SAPSOF2_STAGE_BY_WORKFLOW[workflowStage ?? 0] ?? 'KeyUserSignoff';
}

function splitPerson(value: string): { name: string; email: string } {
  const match = value.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (!match) return { name: value, email: '' };
  return { name: match[1].trim(), email: match[2].trim() };
}

function parseSAPSOF2Remarks(remarks?: string | null): ParsedSAPSOF2Remarks {
  const values: Record<string, string> = {};
  const keyUsers = new Map<string, SAPSOF2Record['keyUsers'][number]>();
  const bpoApprovers = new Map<string, SAPSOF2Record['bpoApprovers'][number]>();
  const testEvidence: SAPSOF2Record['testEvidence'] = [];
  const lines = remarks?.split(/\r?\n/) ?? [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const slotMatch = line.match(/^(KU[1-5]|BPO[1-3]):\s*(.*?)\s*\((.*?)\)(?:\s*-\s*(.*))?$/);
    if (slotMatch) {
      const [, slot, name, email, decision = 'Pending'] = slotMatch;
      const entry = {
        slot,
        name: name.trim(),
        email: email.trim(),
        decision: decision.trim() || 'Pending',
        locked: decision.trim() !== '' && decision.trim() !== 'Pending',
      };

      if (slot.startsWith('KU')) keyUsers.set(slot, entry);
      else bpoApprovers.set(slot, entry);
      continue;
    }

    const scenarioMatch = line.match(/^Scenario #(\d+):\s*(.*)$/);
    if (scenarioMatch) {
      const evidence = {
        scenarioNumber: Number(scenarioMatch[1]),
        description: scenarioMatch[2].trim(),
        tCode: '',
        expectedResult: '',
        actualResult: '',
        passFail: 'Pass' as 'Pass' | 'Fail',
      };

      for (let offset = index + 1; offset < lines.length; offset += 1) {
        const nestedLine = lines[offset].trim();
        if (nestedLine.startsWith('Scenario #') || nestedLine.startsWith('---')) break;
        if (nestedLine.startsWith('T-Code:')) {
          const [tCodePart, resultPart] = nestedLine.split('|');
          evidence.tCode = tCodePart.replace('T-Code:', '').trim();
          evidence.passFail = resultPart?.replace('Result:', '').trim() === 'Fail' ? 'Fail' : 'Pass';
        } else if (nestedLine.startsWith('Expected:')) {
          evidence.expectedResult = nestedLine.replace('Expected:', '').trim();
        } else if (nestedLine.startsWith('Actual:')) {
          evidence.actualResult = nestedLine.replace('Actual:', '').trim();
        }
      }

      testEvidence.push(evidence);
      continue;
    }

    const valueMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (valueMatch) {
      values[valueMatch[1].trim()] = valueMatch[2].trim();
    }
  }

  return {
    values,
    keyUsers: Array.from(keyUsers.values()),
    bpoApprovers: Array.from(bpoApprovers.values()),
    testEvidence,
  };
}

function parseSubmittedDate(value?: string): Date {
  const date = value ? new Date(value) : new Date(0);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function slotSortValue(slot: string): number {
  const match = slot.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function childMatchesSAPSOF2Parent(formid: string | undefined, main: MainDBIT): boolean {
  return formid === String(main.id) || (!!main.title && formid === main.title);
}

const SAPSOF2_FORM_CODES = new Set(getITFormCodeAliases('SAPSOF2'));

function approvalSlot(record: ApprovalRecords): string | undefined {
  const match = `${record.stagename} ${record.comments ?? ''}`.match(/\b(KU[1-5]|BPO[1-3])\b/);
  return match?.[1];
}

function approvalDecision(record: ApprovalRecords): string {
  const label = record.actionKey ? ApprovalRecordsActionKeyToLabel[record.actionKey] : '';
  return !label || label === 'Submitted' ? 'Pending' : label;
}

function mapApprovalChildren(
  main: MainDBIT,
  records: ApprovalRecords[],
  fallbackKeyUsers: SAPSOF2Record['keyUsers'],
  fallbackBpoApprovers: SAPSOF2Record['bpoApprovers']
): Pick<SAPSOF2Record, 'keyUsers' | 'bpoApprovers'> {
  const slots = records
    .filter((record) => SAPSOF2_FORM_CODES.has(record.formcode ?? '') && childMatchesSAPSOF2Parent(record.formid, main))
    .map((record) => {
      const slot = approvalSlot(record);
      if (!slot) return undefined;
      const decision = approvalDecision(record);
      return {
        slot,
        name: record.actionbyname || record.actionbyid || '',
        email: record.actionbyid || '',
        decision,
        locked: decision !== 'Pending',
      };
    })
    .filter((record): record is SAPSOF2Record['keyUsers'][number] => !!record)
    .sort((a, b) => slotSortValue(a.slot) - slotSortValue(b.slot));

  if (slots.length === 0) {
    return {
      keyUsers: fallbackKeyUsers,
      bpoApprovers: fallbackBpoApprovers,
    };
  }

  const keyUsers = slots.filter((record) => record.slot.startsWith('KU'));
  const bpoApprovers = slots.filter((record) => record.slot.startsWith('BPO'));

  return {
    keyUsers: keyUsers.length > 0 ? keyUsers : fallbackKeyUsers,
    bpoApprovers: bpoApprovers.length > 0 ? bpoApprovers : fallbackBpoApprovers,
  };
}

function evidenceParentMatches(record: ITSAPSOFTestEvidence, main: MainDBIT): boolean {
  return record.parentFormCode === 'SAPSOF2'
    && (
      String(record.parentRecord?.id ?? '') === String(main.id)
      || (!!main.title && record.parentRecord?.title === main.title)
    );
}

function parseEvidenceMetadata(remarks?: string): { tCode?: string } {
  if (!remarks) return {};
  const tCodeLine = remarks.split(/\r?\n/).find((line) => line.trim().startsWith('T-Code:'));
  return { tCode: tCodeLine?.replace('T-Code:', '').trim() };
}

function mapEvidenceChildren(
  main: MainDBIT,
  records: ITSAPSOFTestEvidence[],
  fallback: SAPSOF2Record['testEvidence']
): SAPSOF2Record['testEvidence'] {
  const evidence = records
    .filter((record) => evidenceParentMatches(record, main))
    .map((record) => {
      const metadata = parseEvidenceMetadata(record.evidenceRemarks);
      return {
        scenarioNumber: Number(record.evidenceTestNo) || 0,
        description: record.evidenceDescription || '',
        tCode: metadata.tCode || '',
        expectedResult: record.evidenceExpectedResult || '',
        actualResult: record.evidenceActualResult || '',
        passFail: record.evidenceStatus === 'Fail' ? 'Fail' as const : 'Pass' as const,
      };
    })
    .sort((a, b) => a.scenarioNumber - b.scenarioNumber);

  return evidence.length > 0 ? evidence : fallback;
}

function mapSAPSOF2Record(
  main: MainDBIT,
  approvalRecords: ApprovalRecords[],
  testEvidenceRecords: ITSAPSOFTestEvidence[]
): SAPSOF2Record {
  const parsed = parseSAPSOF2Remarks(main.remarks);
  const submittedBy = splitPerson(parsed.values.Submitted || '');
  const status = toSAPSOF2Status(parsed.values.Status || statusKeyToLabel(main.currentStatus));
  const childApprovals = mapApprovalChildren(main, approvalRecords, parsed.keyUsers, parsed.bpoApprovers);
  const childEvidence = mapEvidenceChildren(main, testEvidenceRecords, parsed.testEvidence);

  return {
    id: String(main.id),
    ticketId: main.title || `SAPSOF2-${main.id}`,
    submittedDate: parseSubmittedDate(main.submitteddate || parsed.values.Submitted),
    submittedBy: main.requestorName || submittedBy.name || 'Unknown',
    submittedByEmail: main.requestoremail || submittedBy.email || '',
    client: parsed.values.Client || '',
    clientNumber: parsed.values['Client Number'] || '',
    plant: parsed.values.Plant || '',
    moduleName: parsed.values.Module || '',
    referenceName: parsed.values['Reference Name'] === 'N/A' ? '' : parsed.values['Reference Name'],
    trNumber: parsed.values['TR Number'] || '',
    itRemarks: parsed.values['IT Remarks'] === 'N/A' ? '' : parsed.values['IT Remarks'],
    itFunctionalOwner: parsed.values.Name || parsed.values.Email || '',
    currentStage: toSAPSOF2Stage(parsed.values['Current Stage'], main.workflowstage),
    status,
    isBPORequired: parsed.values['BPO Required'] === 'Yes' || childApprovals.bpoApprovers.length > 0,
    keyUsers: childApprovals.keyUsers,
    bpoApprovers: childApprovals.bpoApprovers,
    testEvidence: childEvidence,
  };
}

// Column definitions
const columns: ColumnDef<SAPSOF2Record>[] = [
  {
    key: 'ticketId',
    header: 'Ticket ID',
    sortable: true,
    width: '180px',
    render: (value: unknown) => (
      <span className="font-mono font-medium text-primary">
        {String(value)}
      </span>
    ),
  },
  {
    key: 'submittedDate',
    header: 'Date',
    sortable: true,
    width: '110px',
    render: (value: unknown) => format(value as Date, 'dd MMM yyyy'),
  },
  {
    key: 'moduleName',
    header: 'Module',
    sortable: true,
    render: (value: unknown) => (
      <Badge variant="secondary">{String(value)}</Badge>
    ),
  },
  {
    key: 'client',
    header: 'Client',
    sortable: true,
    render: (value: unknown) => (
      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
        {String(value)}
      </Badge>
    ),
  },
  {
    key: 'trNumber',
    header: 'TR Number',
    sortable: true,
    render: (value: unknown) => (
      <span className="font-mono text-sm">{String(value)}</span>
    ),
  },
  {
    key: 'currentStage',
    header: 'Stage',
    sortable: true,
    render: (value: unknown) => {
      const stage = String(value);
      const stageConfig: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
        'Draft': { bg: 'bg-muted', text: 'text-muted-foreground', icon: Clock },
        'KeyUserSignoff': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Users },
        'BPOApproval': { bg: 'bg-amber-100', text: 'text-amber-800', icon: FileText },
        'FinalReview': { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle2 },
        'Closed': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      };
      const config = stageConfig[stage] || stageConfig['Draft'];
      const Icon = config.icon;
      return (
        <Badge className={cn(config.bg, config.text, 'border-0')}>
          <Icon className="h-3 w-3 mr-1" />
          {stage === 'KeyUserSignoff' ? 'Key User' : stage === 'BPOApproval' ? 'BPO' : stage}
        </Badge>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SAPSOF2DatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<SAPSOF2Record | null>(null);
  const [showClosureDialog, setShowClosureDialog] = useState(false);
  const [closureDecision, setClosureDecision] = useState<SAPSOF2FinalDecision | null>(null);
  const [closureRemarks, setClosureRemarks] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const { data: mainRecords = [], isLoading, refetch: refetchMainRecords } = useMainDBITList({
    filter: getITFormCodeFilter('SAPSOF2'),
    orderBy: ['submitteddate desc'],
  });
  const { data: approvalRecords = [], isLoading: isApprovalRecordsLoading } = useApprovalRecordsList();
  const { data: testEvidenceRecords = [], isLoading: isTestEvidenceLoading } = useITSAPSOFTestEvidenceList();
  const isDataLoading = isLoading || isApprovalRecordsLoading || isTestEvidenceLoading;
  
  // Get current user to check if they can close
  const { data: user } = useUser();
  
  // Get SAP admin email from Config_AppSettings for authorization check
  const { sapAdminEmail } = useSAPRoutingEmails();
  
  // Check if current user can perform final closure
  // Only IT Admin or IT Functional Owner can close
  const canPerformClosure = useMemo(() => {
    if (!user || !selectedRecord) return false;
    const userEmail = user.userPrincipalName?.toLowerCase();
    
    // Check if user is IT Functional Owner
    const isITFunctionalOwner = userEmail === selectedRecord.submittedByEmail.toLowerCase();
    
    // Check if user is IT Admin (from Config_AppSettings)
    const isITAdmin = sapAdminEmail && userEmail === sapAdminEmail.toLowerCase();
    
    // Check if record is in a closeable state (FinalReview stage)
    const isCloseableStage = selectedRecord.currentStage === 'FinalReview';
    
    return (isITFunctionalOwner || isITAdmin) && isCloseableStage;
  }, [user, selectedRecord, sapAdminEmail]);

  const sapsof2Data = useMemo(
    () => mainRecords.map((record: MainDBIT) => mapSAPSOF2Record(record, approvalRecords, testEvidenceRecords)),
    [mainRecords, approvalRecords, testEvidenceRecords]
  );

  const selectedMainRecord = useMemo(
    () => mainRecords.find((record: MainDBIT) => String(record.id) === selectedRecord?.id),
    [mainRecords, selectedRecord?.id],
  );

  const buildClosureComment = (record: MainDBIT) => [
    record.hODApproverRemarks || '',
    '--- Final Closure ---',
    `Final Decision: ${closureDecision}`,
    `Final Decision Date: ${new Date().toISOString()}`,
    `Final Decision By: ${user?.fullName || 'Unknown'} (${user?.userPrincipalName || ''})`,
    `Closure Remarks: ${closureRemarks.trim() || 'N/A'}`,
    'Current Stage: Closed',
    'Status: Closed',
  ].join('\n').trim();
  
  // Handle final closure
  const handleFinalClosure = async () => {
    if (!selectedRecord || !selectedMainRecord || !closureDecision) return;
    
    setIsClosing(true);
    try {
      await recordITApprovalAction({
        id: selectedRecord.id,
        record: selectedMainRecord,
        user,
        nextStatus: 'CurrentstatusKey2',
        stageName: 'Final Closure',
        actionType: 'completed',
        workflowstage: 99,
        comment: closureRemarks,
        mainPatch: {
          hODApproverRemarks: buildClosureComment(selectedMainRecord),
          currentAction: `Final Closure: ${closureDecision}`,
        },
      });
      
      toast.success(`UAT Sign-Off ${closureDecision}`, {
        description: `${selectedRecord.ticketId} has been closed with decision: ${closureDecision}`,
      });
      
      setShowClosureDialog(false);
      setClosureDecision(null);
      setClosureRemarks('');
      setSelectedRecord(null);
      await refetchMainRecords();
    } catch (error: unknown) {
      toast.error('Failed to close record', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsClosing(false);
    }
  };

  const filteredData = useMemo(() => {
    if (activeTab === 'all') return sapsof2Data;
    return sapsof2Data.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [sapsof2Data, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => sapsof2Data.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [sapsof2Data, userEmail]
  );
  const myActionsCount = useMemo(
    () => sapsof2Data.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [sapsof2Data, userEmail]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white">
      {/* Header */}
      <div className="bg-[#003366] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/it/sap">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">SAP UAT Sign-Off (SAPSOF2)</h1>
              <p className="text-white/70 text-sm">Database View - All Sign-Off Requests</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              View all SAP UAT sign-off submissions
            </p>
            <Link to="/it/forms/sapsof2/new">
              <Button className="bg-[#003366]">
                <Plus className="h-4 w-4 mr-2" />
                New UAT Sign-Off
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {isDataLoading ? (
                <div className="flex min-h-[220px] items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-[#003366]" />
                </div>
              ) : sapsof2Data.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No SAPSOF2 submissions found</EmptyTitle>
                    <EmptyDescription>
                      Submitted SAP UAT sign-off records will appear here after they are saved to SharePoint.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={sapsof2Data.length}
          />
                <DatabaseTable
                  data={filteredData}
                  columns={columns}
                  onRowClick={(row: SAPSOF2Record) => setSelectedRecord(row)}
                  searchPlaceholder="Search by ticket ID, module, client, TR number..."
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Detail Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-primary">{selectedRecord?.ticketId}</span>
              <Badge variant="secondary">{selectedRecord?.moduleName}</Badge>
              <Badge variant="outline" className="border-amber-300 bg-amber-50">{selectedRecord?.client}</Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Package Details</TabsTrigger>
                <TabsTrigger value="evidence">Test Evidence ({selectedRecord.testEvidence.length})</TabsTrigger>
                <TabsTrigger value="approvals">Approvals</TabsTrigger>
              </TabsList>
              
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Client / Number</p>
                      <p className="font-medium">{selectedRecord.client} / {selectedRecord.clientNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plant</p>
                      <p className="font-medium">{selectedRecord.plant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Module</p>
                      <Badge variant="secondary">{selectedRecord.moduleName}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reference (SSR/CR/PRF)</p>
                      <p className="font-medium">{selectedRecord.referenceName || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Transport Request</p>
                      <p className="font-mono font-medium text-primary">{selectedRecord.trNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">IT Functional Owner</p>
                      <p className="font-medium">{selectedRecord.itFunctionalOwner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">{format(selectedRecord.submittedDate, 'dd MMM yyyy')} by {selectedRecord.submittedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">BPO Required</p>
                      <Badge variant={selectedRecord.isBPORequired ? "default" : "outline"}>
                        {selectedRecord.isBPORequired ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {selectedRecord.itRemarks && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm text-muted-foreground mb-1">IT Remarks</p>
                    <p className="text-sm">{selectedRecord.itRemarks}</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Test Evidence Tab */}
              <TabsContent value="evidence" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Business Scenario</TableHead>
                      <TableHead className="w-24">T-Code</TableHead>
                      <TableHead>Expected</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead className="w-24">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecord.testEvidence.map((evidence, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{evidence.scenarioNumber}</TableCell>
                        <TableCell className="max-w-xs">{evidence.description}</TableCell>
                        <TableCell className="font-mono">{evidence.tCode}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{evidence.expectedResult}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{evidence.actualResult}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            evidence.passFail === 'Pass'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          )}>
                            {evidence.passFail === 'Pass' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {evidence.passFail}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              {/* Approvals Tab */}
              <TabsContent value="approvals" className="space-y-6 mt-4">
                {/* Key Users */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Key User Sign-Off
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Slot</TableHead>
                        <TableHead>Approver</TableHead>
                        <TableHead className="w-28">Decision</TableHead>
                        <TableHead className="w-20">Lock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRecord.keyUsers.map((ku, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono font-medium">{ku.slot}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{ku.name}</p>
                              <p className="text-xs text-muted-foreground">{ku.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              ku.decision === 'Approved' ? 'bg-green-100 text-green-800' :
                              ku.decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-muted text-muted-foreground'
                            )}>
                              {ku.decision === 'Approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {ku.decision === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {ku.decision === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                              {ku.decision}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {ku.locked ? (
                              <Lock className="h-4 w-4 text-amber-600" />
                            ) : (
                              <Unlock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* BPO Approvers */}
                {selectedRecord.isBPORequired && selectedRecord.bpoApprovers.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      BPO Approval
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Required
                      </Badge>
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Slot</TableHead>
                          <TableHead>Approver</TableHead>
                          <TableHead className="w-28">Decision</TableHead>
                          <TableHead className="w-20">Lock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRecord.bpoApprovers.map((bpo, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono font-medium">{bpo.slot}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{bpo.name}</p>
                                <p className="text-xs text-muted-foreground">{bpo.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={cn(
                                bpo.decision === 'Approved' ? 'bg-green-100 text-green-800' :
                                bpo.decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-muted text-muted-foreground'
                              )}>
                                {bpo.decision === 'Approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {bpo.decision === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                {bpo.decision === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                                {bpo.decision}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {bpo.locked ? (
                                <Lock className="h-4 w-4 text-amber-600" />
                              ) : (
                                <Unlock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {/* Workflow Status */}
                <Separator />
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-semibold mb-3">Current Workflow Status</h4>
                  <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
                    <Badge className={cn(
                      selectedRecord.currentStage === 'Draft' ? 'bg-primary text-primary-foreground' : 'bg-green-100 text-green-800'
                    )}>
                      IT Submission
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className={cn(
                      'KeyUserSignoff' === selectedRecord.currentStage ? 'bg-primary text-primary-foreground' :
                      ['BPOApproval', 'FinalReview', 'Closed'].includes(selectedRecord.currentStage) ? 'bg-green-100 text-green-800' :
                      'bg-muted text-muted-foreground'
                    )}>
                      Key User Sign-Off
                    </Badge>
                    {selectedRecord.isBPORequired && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <Badge className={cn(
                          'BPOApproval' === selectedRecord.currentStage ? 'bg-primary text-primary-foreground' :
                          ['FinalReview', 'Closed'].includes(selectedRecord.currentStage) ? 'bg-green-100 text-green-800' :
                          'bg-muted text-muted-foreground'
                        )}>
                          BPO Approval
                        </Badge>
                      </>
                    )}
                    <span className="text-muted-foreground">→</span>
                    <Badge className={cn(
                      'FinalReview' === selectedRecord.currentStage ? 'bg-primary text-primary-foreground' :
                      'Closed' === selectedRecord.currentStage ? 'bg-green-100 text-green-800' :
                      'bg-muted text-muted-foreground'
                    )}>
                      Final IT Review
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge className={cn(
                      'Closed' === selectedRecord.currentStage ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                    )}>
                      Closed
                    </Badge>
                  </div>
                </div>
                
                {/* Final Closure Action */}
                {canPerformClosure && (
                  <div className="mt-6 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-primary">Final Closure Action</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      As IT Functional Owner or IT Admin, you can perform the final closure for this UAT sign-off.
                      This action requires setting a Final Decision (Approved/Rejected) and is irreversible.
                    </p>
                    <Button onClick={() => setShowClosureDialog(true)} className="bg-primary">
                      <Lock className="h-4 w-4 mr-2" />
                      Perform Final Closure
                    </Button>
                  </div>
                )}
                
                {/* Show why user cannot close */}
                {!canPerformClosure && selectedRecord?.currentStage === 'FinalReview' && (
                  <div className="mt-6 p-4 rounded-lg border border-amber-300 bg-amber-50/50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        Only the IT Functional Owner ({selectedRecord?.itFunctionalOwner}) or IT Admin can perform final closure.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Final Closure Confirmation Dialog */}
      <AlertDialog open={showClosureDialog} onOpenChange={setShowClosureDialog}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Final Closure - {selectedRecord?.ticketId}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently close the UAT Sign-Off record. Please select a final decision and provide any closure remarks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className="font-semibold">Final Decision <span className="text-destructive">*</span></Label>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setClosureDecision('Approved')}
                  className={cn(
                    'flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2',
                    closureDecision === 'Approved'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-border bg-white hover:bg-muted/50'
                  )}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Approved</span>
                </button>
                <button
                  type="button"
                  onClick={() => setClosureDecision('Rejected')}
                  className={cn(
                    'flex-1 p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2',
                    closureDecision === 'Rejected'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-border bg-white hover:bg-muted/50'
                  )}
                >
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Rejected</span>
                </button>
              </div>
            </div>
            
            <div>
              <Label>Closure Remarks</Label>
              <Textarea
                value={closureRemarks}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setClosureRemarks(e.target.value)}
                placeholder="Add any final remarks or notes..."
                rows={3}
                className="mt-2"
              />
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground">
                <strong>Closed by:</strong> {user?.fullName || 'Unknown'}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Date:</strong> {format(new Date(), 'dd MMM yyyy HH:mm')}
              </p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalClosure}
              disabled={!closureDecision || isClosing}
              className={cn(
                closureDecision === 'Approved' ? 'bg-green-600 hover:bg-green-700' :
                closureDecision === 'Rejected' ? 'bg-red-600 hover:bg-red-700' :
                'bg-primary'
              )}
            >
              {isClosing ? 'Closing...' : `Close as ${closureDecision || '...'}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
