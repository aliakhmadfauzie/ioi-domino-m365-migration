import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { DetailModal } from '@/components/database-view';
import type { FieldGroup, ApprovalHistoryItem } from '@/components/database-view';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { useUser } from '@/hooks/use-user';
import { recordITApprovalAction, statusActionType } from '@/lib/it-approval-actions';

interface SFARRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  requestedBy: string;
  requestedByEmail: string;
  requestType: string;
  folderType: string;
  company: string;
  department: string;
  extensionNumber: string;
  serverName: string;
  folderPath: string;
  permission: string;
  grantAccessTo: string;
  accessToNames: string[];
  accessToIds: string[];
  status: string;
  hodApprover: string;
  hodApproverEmail: string;
  ccRecipients: string;
  remarks: string;
  itVerifier?: string;
  verificationDate?: Date | null;
  verificationComments?: string;
  mainRecord?: MainDBIT;
  extRecord?: MainDBITExtAccess;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SFARRecord>[] = [
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
    header: 'Date Submitted',
    sortable: true,
    width: '120px',
    render: (value: unknown) => {
      if (!value) return '-';
      try {
        return format(value as Date, 'dd/MM/yyyy');
      } catch {
        return '-';
      }
    },
  },
  {
    key: 'requestedBy',
    header: 'Requester',
    sortable: true,
    width: '150px',
  },
  {
    key: 'requestType',
    header: 'Request Type',
    sortable: true,
    width: '130px',
    render: (value: unknown) => {
      const colors: Record<string, { bg: string; text: string }> = {
        'Grant Access': { bg: '#D1FAE5', text: '#065F46' },
        'Remove Access': { bg: '#FEE2E2', text: '#991B1B' },
        'Delete Folder': { bg: '#FEF3C7', text: '#92400E' },
      };
      const style = colors[String(value)] || { bg: '#E8E8E8', text: '#5C5C5C' };
      return (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          {String(value) || '-'}
        </span>
      );
    },
  },
  {
    key: 'serverName',
    header: 'Server Name',
    sortable: true,
    width: '150px',
    render: (value: unknown) => (
      <span className="font-mono text-sm">{String(value) || '-'}</span>
    ),
  },
  {
    key: 'folderPath',
    header: 'Folder Path',
    sortable: true,
    width: '200px',
    render: (value: unknown) => (
      <span className="font-mono text-xs truncate block max-w-[200px]" title={String(value)}>
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'permission',
    header: 'Permission',
    sortable: true,
    width: '100px',
    render: (value: unknown) => {
      if (String(value) === '-' || !value) return <span className="text-muted-foreground">-</span>;
      const isWrite = String(value).includes('Write');
      return (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: isWrite ? '#DBEAFE' : '#F3F4F6',
            color: isWrite ? '#1E40AF' : '#374151',
          }}
        >
          {String(value)}
        </span>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '120px',
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SFARDatabaseView() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [selectedRecord, setSelectedRecord] = useState<SFARRecord | null>(null);

  // Fetch main IT records filtered by formcode = 'SFAR'
  const { data: mainRecords = [], isLoading: mainLoading, refetch: refetchMainRecords } = useMainDBITList({
    filter: "formcode eq 'SFAR'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch extension records for SFAR
  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtAccessList({
    filter: "parentFormCode eq 'SFAR'",
  });

  const isLoading = mainLoading || extLoading;

  const resolveNextStatus = (record: SFARRecord, variant: 'approve' | 'reject') => {
    if (variant === 'reject') {
      return { status: 'CurrentstatusKey6', stage: 'SFAR Rejection', workflowstage: record.mainRecord?.workflowstage };
    }

    if (record.mainRecord?.currentStatus === 'CurrentstatusKey49') {
      return { status: 'CurrentstatusKey44', stage: 'Folder Owner Review', workflowstage: 3 };
    }

    return { status: 'CurrentstatusKey1', stage: 'IT Verification', workflowstage: 4 };
  };

  const handleModalAction = async (variant: 'approve' | 'reject', comments: string) => {
    if (!selectedRecord?.mainRecord) return;
    const next = resolveNextStatus(selectedRecord, variant);
    try {
      await recordITApprovalAction({
        id: selectedRecord.id,
        record: selectedRecord.mainRecord,
        user,
        nextStatus: next.status,
        stageName: next.stage,
        actionType: statusActionType(next.status, variant),
        workflowstage: next.workflowstage,
        comment: comments,
      });
      toast.success(variant === 'approve' ? 'SFAR request approved' : 'SFAR request rejected');
      setSelectedRecord(null);
      await refetchMainRecords();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update SFAR request');
    }
  };

  // Combine main records with extension data
  const sfarData: SFARRecord[] = useMemo(() => {
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

      // Parse remarks JSON for form data stored by DynamicFormRenderer
      let remarksData: Record<string, string> = {};
      try { remarksData = JSON.parse(main.remarks || '{}'); } catch { /* ignore */ }

      return {
        id: String(main.id),
        recordNo: main.title || `SFAR-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        requestedBy: main.requestoremail?.split('@')[0] || 'Unknown',
        requestedByEmail: main.requestoremail || '',
        requestType: main.sFARRequestType || remarksData['RequestType'] || '',
        folderType: main.sFARFolderType || remarksData['FolderType'] || '',
        company: main.sFARCompany || main.company || remarksData['Company'] || '',
        department: main.sFARDepartment || remarksData['Department'] || '',
        extensionNumber: main.sFARExtension || remarksData['Extension'] || '',
        serverName: main.sFARServerName || remarksData['ServerName'] || '',
        folderPath: main.sFARFolderPath || remarksData['FolderPath'] || '',
        permission: main.sFARAccessLevel || remarksData['AccessLevel'] || '-',
        grantAccessTo: main.sFARAccessTo || remarksData['AccessTo'] || '',
        accessToNames: main.sFARAccessToName ? [main.sFARAccessToName] : (remarksData['AccessToName'] ? [remarksData['AccessToName']] : []),
        accessToIds: main.sFARAccessTo ? [main.sFARAccessTo] : [],
        status,
        hodApprover: main.sFARHODEmail?.split('@')[0] || remarksData['HODEmail']?.split('@')[0] || '',
        hodApproverEmail: main.sFARHODEmail || remarksData['HODEmail'] || '',
        ccRecipients: remarksData['CC'] || '',
        remarks: main.sFARPurpose || main.sFARJustification || remarksData['Purpose'] || remarksData['Justification'] || main.remarks || '',
        itVerifier: (main.sFARReviewedBy || ext?.sFARReviewedBy || '')?.split('@')[0] || '',
        verificationDate: main.sFARReviewedDate ? new Date(main.sFARReviewedDate) : ext?.sFARReviewedDate ? new Date(ext.sFARReviewedDate) : null,
        verificationComments: '',
        mainRecord: main,
        extRecord: ext,
      };
    });
  }, [mainRecords, extRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const groups: FieldGroup[] = [
      {
        title: 'Requester Information',
        fields: [
          { label: 'Requested By', value: selectedRecord.requestedBy, type: 'user' },
          { label: 'Company', value: selectedRecord.company || '-' },
          { label: 'Department', value: selectedRecord.department || '-' },
          { label: 'Extension Number', value: selectedRecord.extensionNumber || '-' },
        ],
      },
      {
        title: 'Folder Access Details',
        fields: [
          { label: 'Request Type', value: selectedRecord.requestType || '-', type: 'badge' },
          { label: 'Folder Type', value: selectedRecord.folderType || '-' },
          { label: 'Server Name', value: selectedRecord.serverName || '-' },
          { label: 'Folder Path', value: selectedRecord.folderPath || '-', fullWidth: true },
        ],
      },
    ];

    if (selectedRecord.requestType !== 'Delete Folder') {
      groups[1].fields.push(
        { label: 'Permission', value: selectedRecord.permission || '-', type: 'badge' },
        { label: 'Grant Access To', value: selectedRecord.grantAccessTo || '-', type: 'user' }
      );

      if (selectedRecord.accessToNames.length > 0) {
        groups.push({
          title: 'Access Users List',
          fields: [
            { label: 'Windows ID', value: selectedRecord.accessToIds, type: 'list' },
            { label: 'Full Name', value: selectedRecord.accessToNames, type: 'list' },
          ],
        });
      }
    }

    if (selectedRecord.itVerifier) {
      groups.push({
        title: 'IT Verification',
        fields: [
          { label: 'IT Verifier Name', value: selectedRecord.itVerifier, type: 'user' },
          { label: 'Verification Date', value: selectedRecord.verificationDate || 'Pending', type: 'date' },
          { label: 'Verification Comments', value: selectedRecord.verificationComments || '-', fullWidth: true },
        ],
      });
    }

    groups.push(
      {
        title: 'Remarks',
        fields: [
          { label: 'Remarks', value: selectedRecord.remarks || '-', fullWidth: true },
        ],
      },
      {
        title: 'Approval',
        fields: [
          { label: 'HOD Approver', value: selectedRecord.hodApprover || '-', type: 'user' },
          { label: 'CC Recipients', value: selectedRecord.ccRecipients || '-' },
        ],
      }
    );

    return groups;
  }, [selectedRecord]);

  const approvalHistory: ApprovalHistoryItem[] = useMemo(() => {
    if (!selectedRecord) return [];
    const history: ApprovalHistoryItem[] = [
      {
        action: 'Form Submitted',
        actionBy: selectedRecord.requestedBy,
        actionDate: selectedRecord.dateSubmitted || new Date(),
        status: 'completed',
      },
    ];

    if (selectedRecord.itVerifier) {
      history.push({
        action: 'IT Verification Completed',
        actionBy: selectedRecord.itVerifier,
        actionDate: selectedRecord.verificationDate || new Date(),
        comments: selectedRecord.verificationComments,
        status: 'completed',
      });
    }

    if (selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed') {
      history.push({
        action: 'Approved by HOD',
        actionBy: selectedRecord.hodApprover || 'Approver',
        actionDate: new Date(),
        comments: 'Access request approved',
        status: 'approved',
      });
      if (selectedRecord.status === 'Completed') {
        history.push({
          action: 'Access Granted',
          actionBy: 'IT Department',
          actionDate: new Date(),
          comments: 'Folder access has been configured',
          status: 'approved',
        });
      }
    } else if (selectedRecord.status === 'Submitted' || selectedRecord.status === 'Under_Review') {
      history.push({
        action: 'Pending HOD Approval',
        actionBy: selectedRecord.hodApprover || 'Approver',
        actionDate: '-',
        status: 'pending',
      });
    } else if (selectedRecord.status === 'Rejected') {
      history.push({
        action: 'Rejected by HOD',
        actionBy: selectedRecord.hodApprover || 'Approver',
        actionDate: new Date(),
        comments: 'Request denied',
        status: 'rejected',
      });
    }

    return history;
  }, [selectedRecord]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Share Folder Access Request (SFAR)</h1>
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
              View and manage all Share Folder Access Request submissions
            </p>
            <Link to="/it/forms/sfar/new">
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
                <p className="text-muted-foreground">Loading SFAR submissions from SharePoint...</p>
              </div>
            ) : sfarData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No SFAR submissions found</EmptyTitle>
                  <EmptyDescription>
                    There are no Share Folder Access Request submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={sfarData}
                columns={columns}
                onRowClick={(row: SFARRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by record number, server, folder path..."
                dateField="dateSubmitted"
                initiatorEmailField="requestedByEmail"
                approverEmailField="hodApproverEmail"
                statusField="status"
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`SFAR - ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.requestType || ''} - ${selectedRecord?.serverName || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        canApprove={selectedRecord?.mainRecord?.currentStatus === 'CurrentstatusKey49' || selectedRecord?.mainRecord?.currentStatus === 'CurrentstatusKey44'}
        onApprove={(comments: string) => void handleModalAction('approve', comments)}
        onReject={(comments: string) => void handleModalAction('reject', comments)}
      />
    </div>
  );
}
