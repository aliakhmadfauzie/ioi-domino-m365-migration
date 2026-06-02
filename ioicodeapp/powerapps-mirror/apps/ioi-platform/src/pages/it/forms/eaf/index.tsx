import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { MainDBIT } from '@/generated/models';

interface EAFRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  submittedBy: string;
  submittedByEmail: string;
  company: string;
  targetUser: string;
  applicationType: string;
  systemName: string;
  status: string;
  hodApprover: string;
  hodApproverEmail: string;
  hodremarks: string;
  ccRecipients: string;
  remarks: string;
  userId: string;
  itManagerStatus?: string;
  itCompletionStatus?: string;
  mainRecord?: MainDBIT;
  extRecord?: MainDBITExtAccess;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return status;
}

function extractUsernameFromEmail(email?: string | null): string {
  if (!email) return 'Unknown';
  const parts = email.split('@');
  return parts[0] || 'Unknown';
}

const columns: ColumnDef<EAFRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '120px',
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
    key: 'company',
    header: 'Company',
    sortable: true,
  },
  {
    key: 'targetUser',
    header: 'Target User',
    sortable: true,
  },
  {
    key: 'systemName',
    header: 'System',
    sortable: true,
    render: (value: unknown) => (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
      >
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'applicationType',
    header: 'App Type',
    sortable: true,
    render: (value: unknown) => (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}
      >
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function EAFDatabaseView() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<EAFRecord | null>(null);

  // Fetch main IT records filtered by formcode = 'EAF'
  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'EAF'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch extension records for EAF
  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtAccessList({
    filter: "parentFormCode eq 'EAF'",
  });

  const isLoading = mainLoading || extLoading;

  // Combine main records with extension data
  const eafData: EAFRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    const extMap = new Map<number, MainDBITExtAccess>();
    extRecords.forEach((ext: MainDBITExtAccess) => {
      if (ext.parentRecord?.id) {
        extMap.set(ext.parentRecord.id, ext);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const ext = extMap.get(main.id);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `EAF-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        submittedBy: extractUsernameFromEmail(main.requestoremail),
        submittedByEmail: main.requestoremail || '',
        company: main.company || '',
        targetUser: extractUsernameFromEmail(ext?.eAFTargetUserEmail),
        applicationType: ext?.eAFApplication || '',
        systemName: ext?.eAFSystemName || '',
        status,
        hodApprover: extractUsernameFromEmail(ext?.eAFDeptHeadEmail),
        hodApproverEmail: ext?.eAFDeptHeadEmail || '',
        ccRecipients: '',
        remarks: ext?.eAFJustification || main.remarks || '',
        hodremarks: ext?.eAFDeptHeadComment || '',
        userId: extractUsernameFromEmail(ext?.eAFTargetUserEmail)?.toUpperCase() || '',
        mainRecord: main,
        extRecord: ext,
      };
    });
  }, [mainRecords, extRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];

    return [
      {
        title: 'Request Information',
        fields: [
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Submitted', value: selectedRecord.dateSubmitted, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.submittedBy, type: 'user' },
          { label: 'Company', value: selectedRecord.company || '-' },
        ],
      },
      {
        title: 'Access Details',
        fields: [
          { label: 'Target User', value: selectedRecord.targetUser, type: 'user' },
          { label: 'User ID', value: selectedRecord.userId || '-' },
          { label: 'Application Type', value: selectedRecord.applicationType || '-', type: 'badge' },
          { label: 'System Name', value: selectedRecord.systemName || '-' },
        ],
      },
      {
        title: 'Approval & Notifications',
        fields: [
          { label: 'HOD Approver', value: selectedRecord.hodApprover || '-', type: 'user' },
          { label: 'CC Recipients', value: selectedRecord.ccRecipients || '-' },
          { label: 'Remarks', value: selectedRecord.remarks || '-', fullWidth: true },
          { label: 'HOD Remarks', value: selectedRecord.hodremarks || '-', fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);

  const approvalHistory: ApprovalHistoryItem[] = useMemo(() => {
    if (!selectedRecord) return [];

    const history: ApprovalHistoryItem[] = [
      {
        action: 'Form Submitted',
        actionBy: selectedRecord.submittedBy,
        actionDate: selectedRecord.dateSubmitted || new Date(),
        status: 'completed',
      },
    ];

    const main = selectedRecord.mainRecord;
    const ext = selectedRecord.extRecord;
    const normalizedStatus = selectedRecord.status?.toLowerCase() || '';

    // Stage 2: HOD Approval
    if (ext?.eAFDeptHeadEmail && normalizedStatus !== 'draft') {
      const isHodDone = !!main?.workflowstage && main.workflowstage >= 2;
      history.push({
        action: isHodDone ? 'Approved by HOD' : 'Pending HOD Approval',
        actionBy: isHodDone ? selectedRecord.hodApprover || 'HOD' : selectedRecord.hodApprover || 'Dept Head',
        actionDate: isHodDone ? new Date() : '-',
        comments: isHodDone ? 'Approved' : undefined,
        status: isHodDone ? 'approved' : 'pending',
      });
    }

    // Stage 3: Division Director / COO
    const isDDDone = !!main?.workflowstage && main.workflowstage >= 3;
    if (isDDDone || normalizedStatus === 'approved' || normalizedStatus === 'completed') {
      history.push({
        action: isDDDone ? 'Approved by Division Director / COO' : 'Pending Division Director / COO Approval',
        actionBy: isDDDone ? 'Division Director' : 'Division Director',
        actionDate: isDDDone ? new Date() : '-',
        status: isDDDone ? 'approved' : 'pending',
      });
    }

    // Stage 4: IT Manager
    const isITMgrDone = !!main?.workflowstage && main.workflowstage >= 4;
    if (isITMgrDone || normalizedStatus === 'completed') {
      history.push({
        action: isITMgrDone ? 'Approved by IT Manager' : 'Pending IT Manager Approval',
        actionBy: isITMgrDone ? 'IT Manager' : 'IT Manager',
        actionDate: isITMgrDone ? new Date() : '-',
        status: isITMgrDone ? 'approved' : 'pending',
      });
    }

    // Stage 5: IT Provisioning
    const isITDone = normalizedStatus === 'completed' || normalizedStatus === 'closed';
    if (isITDone) {
      history.push({
        action: 'Completed by IT',
        actionBy: 'IT Team',
        actionDate: new Date(),
        status: 'completed',
      });
    }

    // Terminal states
    if (normalizedStatus === 'rejected') {
      history.push({
        action: 'Rejected',
        actionBy: 'Approver',
        actionDate: new Date(),
        comments: 'Request was rejected',
        status: 'rejected',
      });
    }

    return history;
  }, [selectedRecord]);

  const handleRowClick = useCallback((row: EAFRecord) => {
    setSelectedRecord(row);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecord(null);
  }, []);

  const handleApprove = useCallback((comments: string) => {
    console.log('Approved with comments:', comments);
    setSelectedRecord(null);
  }, []);

  const handleReject = useCallback((comments: string) => {
    console.log('Rejected with comments:', comments);
    setSelectedRecord(null);
  }, []);

  const canApprove = selectedRecord?.status === 'Submitted' || selectedRecord?.status === 'Under_Review';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">External Access Form (EAF)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View - All Submissions from SharePoint
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
              View and manage all External Access Form submissions
            </p>
            <Link to="/it/forms/eaf/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading EAF submissions from SharePoint...</p>
              </div>
            ) : eafData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No EAF submissions found</EmptyTitle>
                  <EmptyDescription>
                    There are no External Access Form submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={eafData}
                columns={columns}
                onRowClick={handleRowClick}
                searchPlaceholder="Search by record number, user, company..."
                dateField="dateSubmitted"
                initiatorEmailField="submittedByEmail"
                approverEmailField="hodApproverEmail"
                statusField="status"
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={handleCloseModal}
        title={`EAF - ${selectedRecord?.recordNo || ''}`}
        subtitle={`External Access Request for ${selectedRecord?.targetUser || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        canApprove={canApprove}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
