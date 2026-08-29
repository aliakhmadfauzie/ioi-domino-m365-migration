import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { DetailModal } from '@/components/database-view';
import type { FieldGroup, ApprovalHistoryItem } from '@/components/database-view';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT, type MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import { parseRemarks } from '@/lib/parse-remarks';
import { SAPCR_STATE_LABELS } from '@/types/sap-forms';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface SAPCRRecord {
  id: string;
  changeRequestNo: string;
  dateSubmitted: Date | null;
  submittedBy: string;
  system: string;
  projectPhase: string;
  description: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  // Try SAPCR state labels first, fall back to SharePoint choice labels
  const label = SAPCR_STATE_LABELS[status as keyof typeof SAPCR_STATE_LABELS];
  if (label) return label;
  return MainDBITCurrentstatusKeyToLabel[status as MainDBITCurrentstatusKey] || status || 'Draft';
}

const columns: ColumnDef<SAPCRRecord>[] = [
  {
    key: 'changeRequestNo',
    header: 'CR No',
    sortable: true,
    width: '150px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'dateSubmitted',
    header: 'Date',
    sortable: true,
    width: '100px',
    render: (value: unknown) => {
      if (!value) return '-';
      try {
        return format(value as Date, 'dd MMM yyyy');
      } catch {
        return '-';
      }
    },
  },
  {
    key: 'submittedBy',
    header: 'Submitted By',
    sortable: true,
  },
  {
    key: 'system',
    header: 'System',
    sortable: true,
    render: (value: unknown) => (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}
      >
        {String(value)}
      </span>
    ),
  },
  {
    key: 'projectPhase',
    header: 'Phase',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SAPCRDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<SAPCRRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'SAPCR'",
    orderBy: ['submitteddate desc'],
  });

  const sapcrData: SAPCRRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        changeRequestNo: main.title || `SAPCR-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        submittedBy: main.requestoremail || main.requestorName || '',
        system: String(parsed.system || ''),
        projectPhase: String(parsed.projectPhase || ''),
        description: String(parsed.changeDescription || ''),
        status,
        mainRecord: main,
      };
    });
  }, [mainRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const parsed = selectedRecord.mainRecord ? parseRemarks(selectedRecord.mainRecord.remarks) : {};
    return [
      {
        title: 'Request Information',
        fields: [
          { label: 'Change Request No', value: selectedRecord.changeRequestNo },
          { label: 'Date Submitted', value: selectedRecord.dateSubmitted, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.submittedBy, type: 'user' },
          { label: 'Project Phase', value: selectedRecord.projectPhase || '-' },
          { label: 'System', value: selectedRecord.system || '-', type: 'badge' },
        ],
      },
      {
        title: 'Change Details',
        fields: [
          { label: 'Description', value: selectedRecord.description || '-', fullWidth: true },
          { label: 'Business Justification', value: String(parsed.businessJustification || '-'), fullWidth: true },
          { label: 'Priority', value: String(parsed.priority || '-') },
        ],
      },
      {
        title: 'Scheduling',
        fields: [
          { label: 'Requested Date', value: String(parsed.requestedDate || '-') },
          { label: 'Planned Start', value: String(parsed.plannedStartDate || '-') },
          { label: 'Planned End', value: String(parsed.plannedEndDate || '-') },
        ],
      },
      {
        title: 'Approvers',
        fields: [
          { label: 'Technical Reviewer', value: String(parsed.technicalReviewer || '-') },
          { label: 'Functional Approver', value: String(parsed.functionalApprover || '-') },
          { label: 'CAB Approver', value: String(parsed.cabApprover || '-') },
        ],
      },
    ];
  }, [selectedRecord]);

  const approvalHistory: ApprovalHistoryItem[] = useMemo(() => {
    if (!selectedRecord) return [];
    const history: ApprovalHistoryItem[] = [
      {
        action: 'CR Submitted',
        actionBy: selectedRecord.submittedBy || 'System',
        actionDate: selectedRecord.dateSubmitted,
        status: 'completed',
      },
    ];
    return history;
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return sapcrData;
    return sapcrData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [sapcrData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => sapcrData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [sapcrData, userEmail]
  );
  const myActionsCount = useMemo(
    () => sapcrData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [sapcrData, userEmail]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/it">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">SAP & WB Change Request (SAPCR)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View - All Change Requests from SharePoint
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm" style={{ color: '#5C5C5C' }}>
              {sapcrData.length} change request(s) found
            </p>
            <Link to="/it/forms/sapcr/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Change Request
              </Button>
            </Link>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#003366' }} />
              </div>
            ) : sapcrData.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No records found</EmptyTitle>
                  <EmptyDescription>
                    No SAPCR change requests have been submitted yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={sapcrData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: SAPCRRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by CR number, system, phase..."
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`SAP & WB Change Request — ${selectedRecord?.changeRequestNo || ''}`}
        subtitle={`${selectedRecord?.system || ''} - ${selectedRecord?.projectPhase || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
      />
    </div>
  );
}