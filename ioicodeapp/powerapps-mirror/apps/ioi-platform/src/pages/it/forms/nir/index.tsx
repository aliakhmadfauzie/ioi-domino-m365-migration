import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { useUser } from '@/hooks/use-user';
import { recordITApprovalAction } from '@/lib/it-approval-actions';
import { toast } from 'sonner';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface NIRRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  requestedBy: string;
  requestedByEmail: string;
  company: string;
  department: string;
  requestType: string;
  employeeType: string;
  existingEmail?: string;
  status: string;
  hodApprover: string;
  hodApproverEmail: string;
  fullName: string;
  mainRecord?: MainDBIT;
  extRecord?: MainDBITExtAccess;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<NIRRecord>[] = [
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
    key: 'fullName',
    header: 'Full Name',
    sortable: true,
    width: '150px',
  },
  {
    key: 'department',
    header: 'Department',
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
        'New': { bg: '#D1FAE5', text: '#065F46' },
        'Rename': { bg: '#DBEAFE', text: '#1E40AF' },
        'Delete': { bg: '#FEE2E2', text: '#991B1B' },
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
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '120px',
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function NIRDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<NIRRecord | null>(null);
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  // Fetch main IT records filtered by formcode = 'NIR'
  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'NIR'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch extension records for NIR
  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtAccessList({
    filter: "parentFormCode eq 'NIR'",
  });

  const isLoading = mainLoading || extLoading;

  // Combine main records with extension data
  const nirData: NIRRecord[] = useMemo(() => {
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
        recordNo: main.title || `NIR-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        requestedBy: main.requestoremail?.split('@')[0] || 'Unknown',
        requestedByEmail: main.requestoremail || '',
        company: main.company || '',
        department: main.nIRDepartment || ext?.nIRDepartment || '',
        requestType: main.nIRRequestType || ext?.nIRRequestType || 'New',
        employeeType: main.nIREmployeeType || '',
        existingEmail: main.nIRExistingEmailAddress || '',
        status,
        hodApprover: (main.nIRHODApprovedBy || ext?.nIRHODApprovedBy || '')?.split('@')[0] || '',
        hodApproverEmail: main.nIRHODApprovedBy || ext?.nIRHODApprovedBy || '',
        fullName: main.nIRFullName || ext?.nIRFullName || '',
        mainRecord: main,
        extRecord: ext,
      };
    });
  }, [mainRecords, extRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const groups: FieldGroup[] = [
      {
        title: 'Request Information',
        fields: [
          { label: 'Request Type', value: selectedRecord.requestType || '-', type: 'badge' },
          { label: 'Full Name', value: selectedRecord.fullName || '-' },
          { label: 'Department', value: selectedRecord.department || '-' },
          { label: 'Employee Type', value: selectedRecord.employeeType || '-' },
        ],
      },
    ];

    if (selectedRecord.requestType === 'Rename' || selectedRecord.requestType === 'Delete') {
      groups[0].fields.push({
        label: 'Existing Email',
        value: selectedRecord.existingEmail || '-',
      });
    }

    groups.push({
      title: 'Approval',
      fields: [
        { label: 'HOD Approver', value: selectedRecord.hodApprover || '-', type: 'user' },
      ],
    });

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

    if (selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed') {
      history.push({
        action: 'Approved by HOD',
        actionBy: selectedRecord.hodApprover || 'Approver',
        actionDate: new Date(),
        comments: 'Request approved',
        status: 'approved',
      });
    } else if (selectedRecord.status === 'Submitted' || selectedRecord.status === 'Under_Review') {
      history.push({
        action: 'Pending HOD Approval',
        actionBy: selectedRecord.hodApprover || 'Approver',
        actionDate: '-',
        status: 'pending',
      });
    }

    return history;
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return nirData;
    return nirData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [nirData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => nirData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [nirData, userEmail]
  );
  const myActionsCount = useMemo(
    () => nirData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [nirData, userEmail]
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
              <h1 className="text-xl font-bold text-white">Notes ID Request (NIR)</h1>
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
              View and manage all Notes ID Request submissions
            </p>
            <Link to="/it/forms/nir/new">
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
                <p className="text-muted-foreground">Loading NIR submissions from SharePoint...</p>
              </div>
            ) : nirData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No NIR submissions found</EmptyTitle>
                  <EmptyDescription>
                    There are no Notes ID Request submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={nirData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: NIRRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by record number, name, company..."
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
        title={`Notes ID Request — ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.requestType || ''} Request`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        canApprove={selectedRecord?.mainRecord?.currentStatus === 'CurrentstatusKey27' || selectedRecord?.status === 'Pending HOD'}
        onApprove={async (comments: string) => {
          if (!selectedRecord?.mainRecord?.id) return;
          try {
            await recordITApprovalAction({
              id: String(selectedRecord.mainRecord.id),
              record: selectedRecord.mainRecord,
              user,
              nextStatus: 'CurrentstatusKey38',
              stageName: 'NIR HOD Approval',
              actionType: 'approved',
              comment: comments,
              workflowstage: 3,
              mainPatch: {
              nIRHODApprovalStatus: 'Approved',
              nIRHODApprovedBy: user?.userPrincipalName || selectedRecord.mainRecord.nIRHODApprovedBy || '',
              nIRHODApprovedDate: new Date().toISOString(),
              currentAction: 'ISGHODApproved',
              hODApproverRemarks: comments || undefined,
              },
            });
            await queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] });
            await queryClient.invalidateQueries({ queryKey: ['mainDBIT', String(selectedRecord.mainRecord.id)] });
            toast.success('Request approved — forwarded to Notes Admin');
          } catch {
            toast.error('Failed to approve request');
          }
          setSelectedRecord(null);
        }}
        onReject={async (comments: string) => {
          if (!selectedRecord?.mainRecord?.id) return;
          try {
            await recordITApprovalAction({
              id: String(selectedRecord.mainRecord.id),
              record: selectedRecord.mainRecord,
              user,
              nextStatus: 'CurrentstatusKey2',
              stageName: 'NIR HOD Approval',
              actionType: 'rejected',
              comment: comments || 'Rejected by HOD',
              workflowstage: 0,
              mainPatch: {
              nIRHODApprovalStatus: 'Rejected',
              nIRHODApprovedBy: user?.userPrincipalName || selectedRecord.mainRecord.nIRHODApprovedBy || '',
              nIRHODApprovedDate: new Date().toISOString(),
              currentAction: 'ISGHODRejected',
              hODApproverRemarks: comments || 'Rejected by HOD',
              },
            });
            await queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] });
            await queryClient.invalidateQueries({ queryKey: ['mainDBIT', String(selectedRecord.mainRecord.id)] });
            toast.success('Request rejected');
          } catch {
            toast.error('Failed to reject request');
          }
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
