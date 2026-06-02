import { useState, useMemo } from 'react';
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
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';

interface URRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  submittedBy: string;
  submittedByEmail: string;
  requestType: string;
  fullName: string;
  designation: string;
  department: string;
  companies: string[];
  applications: string[];
  employeeCardNumber?: string;
  doorSelections?: string[];
  status: string;
  hodApprover: string;
  hodApproverEmail: string;
  justification: string;
  systemAccess: string;
  mainRecord?: MainDBIT;
  extRecord?: MainDBITExtAccess;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<URRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '140px',
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
    key: 'requestType',
    header: 'Request Type',
    sortable: true,
    render: (value: unknown) => {
      const colors: Record<string, { bg: string; text: string }> = {
        'New ID': { bg: '#D1FAE5', text: '#065F46' },
        'Existing ID': { bg: '#DBEAFE', text: '#1E40AF' },
        'Reactivate': { bg: '#FEF3C7', text: '#92400E' },
        'Deactivate': { bg: '#FEE2E2', text: '#991B1B' },
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
    key: 'fullName',
    header: 'Full Name',
    sortable: true,
  },
  {
    key: 'systemAccess',
    header: 'System Access',
    render: (value: unknown) => (
      <span className="text-sm truncate max-w-[150px]">
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

export default function URDatabaseView() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<URRecord | null>(null);

  // Fetch main IT records filtered by formcode = 'UR'
  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'UR'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch extension records for UR
  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtAccessList({
    filter: "parentFormCode eq 'UR'",
  });

  const isLoading = mainLoading || extLoading;

  // Combine main records with extension data
  const urData: URRecord[] = useMemo(() => {
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
        recordNo: main.title || `UR-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        submittedBy: main.requestoremail?.split('@')[0] || 'Unknown',
        submittedByEmail: main.requestoremail || '',
        requestType: main.uRRequestType || remarksData['RequestType'] || '',
        fullName: main.uRUserFullName || remarksData['FullName'] || '',
        designation: main.uRDesignation || remarksData['Designation'] || '',
        department: main.uRUserDepartment || remarksData['Department'] || '',
        companies: main.uRCompany ? [main.uRCompany] : (remarksData['Company'] ? [remarksData['Company']] : []),
        applications: main.uRSystemAccess ? [main.uRSystemAccess] : (remarksData['SystemAccess'] ? [remarksData['SystemAccess']] : []),
        status,
        hodApprover: remarksData['HODApprover']?.split('@')[0] || '',
        hodApproverEmail: remarksData['HODApprover'] || '',
        justification: main.remarks || remarksData['Remarks'] || '',
        systemAccess: main.uRSystemAccess || main.uRBankName || main.uRPlant || remarksData['SystemAccess'] || '',
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
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Submitted', value: selectedRecord.dateSubmitted, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.submittedBy, type: 'user' },
          { label: 'Request Type', value: selectedRecord.requestType || '-', type: 'badge' },
        ],
      },
      {
        title: 'User Details',
        fields: [
          { label: 'Full Name', value: selectedRecord.fullName || '-' },
          { label: 'Designation', value: selectedRecord.designation || '-' },
          { label: 'Department', value: selectedRecord.department || '-' },
          { label: 'System Access', value: selectedRecord.systemAccess || '-', fullWidth: true },
        ],
      },
    ];

    if (selectedRecord.applications.length > 0) {
      groups.push({
        title: 'Applications',
        fields: [
          { label: 'Applications Requested', value: selectedRecord.applications, type: 'list', fullWidth: true },
        ],
      });
    }

    if (selectedRecord.doorSelections && selectedRecord.doorSelections.length > 0) {
      groups.push({
        title: 'Door Access Details',
        fields: [
          { label: 'Employee Card Number', value: selectedRecord.employeeCardNumber || '-' },
          { label: 'Door Selections', value: selectedRecord.doorSelections, type: 'list', fullWidth: true },
        ],
      });
    }

    groups.push(
      {
        title: 'Justification',
        fields: [
          { label: 'Justification', value: selectedRecord.justification || '-', fullWidth: true },
        ],
      },
      {
        title: 'Approval',
        fields: [
          { label: 'HOD Approver', value: selectedRecord.hodApprover || '-', type: 'user' },
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
        actionBy: selectedRecord.submittedBy,
        actionDate: selectedRecord.dateSubmitted || new Date(),
        status: 'completed',
      },
    ];

    if (selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed') {
      history.push({
        action: 'Approved by HOD',
        actionBy: selectedRecord.hodApprover || 'Approver',
        actionDate: new Date(),
        comments: 'User ID request approved',
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">User ID Request (UR)</h1>
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
              View and manage all User ID Request submissions
            </p>
            <Link to="/it/forms/ur/new">
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
                <p className="text-muted-foreground">Loading UR submissions from SharePoint...</p>
              </div>
            ) : urData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No UR submissions found</EmptyTitle>
                  <EmptyDescription>
                    There are no User ID Request submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={urData}
                columns={columns}
                onRowClick={(row: URRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by record number, name, application..."
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
        onClose={() => setSelectedRecord(null)}
        title={`UR - ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.requestType || ''} for ${selectedRecord?.fullName || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        canApprove={selectedRecord?.status === 'Submitted' || selectedRecord?.status === 'Under_Review'}
        onApprove={(comments: string) => {
          console.log('Approved:', comments);
          setSelectedRecord(null);
        }}
        onReject={(comments: string) => {
          console.log('Rejected:', comments);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
