import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ArrowLeft, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { DetailModal } from '@/components/database-view';
import type { FieldGroup, ApprovalHistoryItem } from '@/components/database-view';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { getFormattedPICNames, getFormattedPICEmails } from '@/lib/rs-pic-routing';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import { MainDBITCurrentstatusKeyToLabel, MainDBITSiteKeyToLabel, type MainDBIT, type MainDBITSiteKey } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

// Combined record interface for RS submissions
interface RSRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  requestedBy: string;
  requestedByEmail: string;
  userName: string;
  designation: string;
  company: string;
  department: string;
  extensionNumber: string;
  location: 'PENANG' | 'JOHOR';
  applicationType: string;
  resetType: string;
  systemLoginId: string;
  reasonForReset: string;
  status: string;
  client?: string;
  clientName?: string;
  bank?: string;
  unlockOption?: string;
  approverEmail?: string;
  assignedPIC?: string;
  assignedPICEmail?: string;
  // Raw data references
  mainRecord?: MainDBIT;
  extRecord?: MainDBITExtAccess;
}

// Map site key to location
function mapSiteToLocation(siteKey?: MainDBITSiteKey): 'PENANG' | 'JOHOR' {
  if (!siteKey) return 'JOHOR';
  const siteLabel = MainDBITSiteKeyToLabel[siteKey];
  if (siteLabel?.toLowerCase().includes('penang') || siteLabel?.toLowerCase().includes('prai')) {
    return 'PENANG';
  }
  return 'JOHOR';
}

// Map status key to readable status
function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<RSRecord>[] = [
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
    key: 'userName',
    header: 'User Name',
    sortable: true,
    width: '150px',
  },
  {
    key: 'location',
    header: 'Site',
    sortable: true,
    width: '100px',
    render: (value: unknown) => {
      const location = String(value);
      return (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: location === 'PENANG' ? '#DBEAFE' : '#FEF3C7',
            color: location === 'PENANG' ? '#1E40AF' : '#92400E',
          }}
        >
          {location}
        </span>
      );
    },
  },
  {
    key: 'applicationType',
    header: 'Application',
    sortable: true,
    width: '130px',
    render: (value: unknown) => {
      const colors: Record<string, { bg: string; text: string }> = {
        'SAP S4/HANA': { bg: '#FEF3C7', text: '#92400E' },
        'BANK': { bg: '#D1FAE5', text: '#065F46' },
        'DOMAIN ID': { bg: '#DBEAFE', text: '#1E40AF' },
        'ESKER': { bg: '#EDE9FE', text: '#5B21B6' },
        'VPN': { bg: '#FCE7F3', text: '#9D174D' },
        'SOLMAN': { bg: '#FEE2E2', text: '#991B1B' },
        'HCL NOTES': { bg: '#E0F2FE', text: '#0369A1' },
        'WEIGHBRIDGE': { bg: '#ECFDF5', text: '#047857' },
        'WHAT 8': { bg: '#FFF7ED', text: '#C2410C' },
        'SALES PORTAL': { bg: '#F0FDF4', text: '#166534' },
      };
      const style = colors[String(value)] || { bg: '#F3F4F6', text: '#374151' };
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
    key: 'resetType',
    header: 'Reset Type',
    sortable: true,
    width: '140px',
    render: (value: unknown) => {
      // Handle both old display labels and new codes
      const val = String(value);
      const isUnlock = val === 'Unlock ID' || val === 'UNLOCK_ID' || val === 'UNLOCK_ONLY' || val === 'UNLOCK' || val === 'UNLOCK_RESET';
      return (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: isUnlock ? '#FEE2E2' : '#DBEAFE',
            color: isUnlock ? '#991B1B' : '#1E40AF',
          }}
        >
          {String(value) || '-'}
        </span>
      );
    },
  },
  {
    key: 'systemLoginId',
    header: 'System Login ID',
    sortable: true,
    width: '130px',
    render: (value: unknown) => (
      <span className="font-mono text-sm">{String(value) || '-'}</span>
    ),
  },
  {
    key: 'assignedPIC',
    header: 'Assigned PIC',
    sortable: true,
    width: '150px',
    render: (value: unknown, row?: RSRecord) => {
      const picNames = row ? getFormattedPICNames(row.applicationType, row.location) : String(value);
      const picEmails = row ? getFormattedPICEmails(row.applicationType, row.location) : '';
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help">
                <UserCheck className="h-3.5 w-3.5" style={{ color: '#003366' }} />
                <span className="text-sm truncate max-w-[120px]">{picNames}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="text-xs">
                <p className="font-medium">Assigned PIC(s):</p>
                <p className="text-muted-foreground">{picEmails}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

export default function RSDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<RSRecord | null>(null);

  // Fetch main IT records filtered by formcode = 'RS'
  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'RS'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch extension records for RS (Access module)
  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtAccessList({
    filter: "parentFormCode eq 'RS'",
  });

  const isLoading = mainLoading || extLoading;

  // Combine main records with extension data
  const rsData: RSRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    // Create a map of extension records by parent record ID
    const extMap = new Map<number, MainDBITExtAccess>();
    extRecords.forEach((ext: MainDBITExtAccess) => {
      if (ext.parentRecord?.id) {
        extMap.set(ext.parentRecord.id, ext);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const ext = extMap.get(main.id);
      const location = mapSiteToLocation(main.siteKey);
      const status = mapStatusToLabel(main.currentStatus);
      
      // Parse remarks JSON for form data stored by DynamicFormRenderer
      let remarksData: Record<string, string> = {};
      try {
        remarksData = JSON.parse(main.remarks || '{}');
      } catch { /* not JSON, ignore */ }

      // Extract application type from title or extension data
      // Title format typically: "RS - [Application Type] - [User Name]"
      let applicationType = '';
      if (main.title) {
        const parts = main.title.split(' - ');
        if (parts.length >= 2) {
          applicationType = parts[1]?.trim() || '';
        }
      }

      return {
        id: String(main.id),
        recordNo: main.title || `RS-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        requestedBy: main.requestoremail?.split('@')[0] || 'Unknown',
        requestedByEmail: main.requestoremail || '',
        userName: main.rSUserName || remarksData['UserName'] || (main.rSTargetUserEmail || '')?.split('@')[0] || 'Unknown',
        designation: main.rSDesignation || remarksData['Designation'] || '',
        company: main.rSCompany || main.company || remarksData['Company'] || '',
        department: main.rSDepartment || remarksData['Department'] || '',
        extensionNumber: remarksData['ExtensionNumber'] || '',
        location: (main.rSLocation as 'PENANG' | 'JOHOR') || remarksData['Location'] as 'PENANG' | 'JOHOR' || location,
        applicationType: main.rSRequestType || remarksData['ApplicationType'] || applicationType,
        resetType: main.rSResetType || remarksData['ResetType'] || 'Reset Password',
        systemLoginId: remarksData['SystemLoginId'] || (main.rSTargetUserEmail || '')?.split('@')[0]?.toUpperCase() || '',
        reasonForReset: main.rSReasonForReset || remarksData['ReasonForReset'] || main.remarks || '',
        status,
        client: main.rSSAPClient || remarksData['SAPClient'] || '',
        clientName: main.rSIEPClientName || remarksData['IEPClientName'] || '',
        bank: main.rSBankTokenSerial || remarksData['RS_Bank'] || '',
        approverEmail: main.rSExecutiveDirectorEmail || '',
        assignedPIC: getFormattedPICNames(applicationType, location),
        assignedPICEmail: getFormattedPICEmails(applicationType, location),
        mainRecord: main,
        extRecord: ext,
      };
    });
  }, [mainRecords, extRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const groups: FieldGroup[] = [
      {
        title: 'User Information',
        fields: [
          { label: 'User Name / Employee Name', value: selectedRecord.userName },
          { label: 'Designation', value: selectedRecord.designation || '-' },
          { label: 'Company', value: selectedRecord.company || '-' },
          { label: 'Department', value: selectedRecord.department || '-' },
          { label: 'Extension Number', value: selectedRecord.extensionNumber || '-' },
          { label: 'Location/Site', value: selectedRecord.location, type: 'badge' },
        ],
      },
      {
        title: 'Reset Request Details',
        fields: [
          { label: 'Application Type', value: selectedRecord.applicationType || '-', type: 'badge' },
          { label: 'Reset Type', value: selectedRecord.resetType || '-' },
        ],
      },
    ];

    // Conditional: Client (SAP S4/HANA)
    if (selectedRecord.applicationType === 'SAP S4/HANA' && selectedRecord.client) {
      groups[1].fields.push({ label: 'Client', value: selectedRecord.client });
      // Conditional: Client Name (IEP Live System)
      if (selectedRecord.client === 'IEP (Live System)' && selectedRecord.clientName) {
        groups[1].fields.push({ label: 'Client Name', value: selectedRecord.clientName });
      }
    }

    // Conditional: Bank (BANK application)
    if (selectedRecord.applicationType === 'BANK' && selectedRecord.bank) {
      groups[1].fields.push({ label: 'Bank', value: selectedRecord.bank });
    }

    // Conditional: Unlock Options (SAP/SOLMAN/ESKER + Unlock ID)
    if (
      ['SAP S4/HANA', 'SOLMAN', 'ESKER'].includes(selectedRecord.applicationType) &&
      (selectedRecord.resetType === 'Unlock ID' || selectedRecord.resetType === 'UNLOCK_ID') &&
      selectedRecord.unlockOption
    ) {
      groups[1].fields.push({ label: 'Unlock Options', value: selectedRecord.unlockOption });
    }

    // Add remaining fields
    groups[1].fields.push(
      { label: 'System Login ID', value: selectedRecord.systemLoginId || '-' },
      { label: 'Reason for Reset', value: selectedRecord.reasonForReset || '-', fullWidth: true }
    );

    // Assignment section - shows auto-assigned PIC
    const picNames = getFormattedPICNames(selectedRecord.applicationType, selectedRecord.location);
    const picEmails = getFormattedPICEmails(selectedRecord.applicationType, selectedRecord.location);
    groups.push({
      title: 'PIC Assignment',
      fields: [
        { label: 'Assigned PIC(s)', value: picNames, type: 'badge' },
        { label: 'PIC Email(s)', value: picEmails, fullWidth: true },
        { label: 'Note', value: 'PIC is auto-assigned based on Application Type and Location', fullWidth: true },
      ],
    });

    return groups;
  }, [selectedRecord]);

  const isBankType = selectedRecord?.applicationType === 'BANK' || !!selectedRecord?.bank;
  const needsEDApproval = isBankType && selectedRecord?.status === 'Completed';

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

    if (selectedRecord.status === 'Completed') {
      history.push({
        action: 'Processed by IT',
        actionBy: 'IT Department',
        actionDate: new Date(),
        comments: 'Password/ID reset completed',
        status: 'approved',
      });
      // BANK type: ED must confirm after IT completes
      if (isBankType) {
        history.push({
          action: 'Pending ED Confirmation',
          actionBy: 'Executive Director',
          actionDate: '-',
          comments: 'BANK type — awaiting ED sign-off',
          status: 'pending',
        });
      }
    } else if (selectedRecord.status === 'Approved') {
      history.push({
        action: 'Received by IT',
        actionBy: 'IT Department',
        actionDate: new Date(),
        comments: 'Request is being processed',
        status: 'pending',
      });
    } else if (selectedRecord.status === 'Submitted' || selectedRecord.status === 'Under_Review') {
      history.push({
        action: 'Pending IT Processing',
        actionBy: 'IT Department',
        actionDate: '-',
        status: 'pending',
      });
    }

    return history;
  }, [selectedRecord, isBankType]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return rsData;
    return rsData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [rsData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => rsData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [rsData, userEmail]
  );
  const myActionsCount = useMemo(
    () => rsData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [rsData, userEmail]
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
              <h1 className="text-xl font-bold text-white">Reset Password (RS)</h1>
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
              View and manage all Reset Password submissions
            </p>
            <Link to="/it/forms/rs/new">
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
                <p className="text-muted-foreground">Loading RS submissions from SharePoint...</p>
              </div>
            ) : rsData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No RS submissions found</EmptyTitle>
                  <EmptyDescription>
                    There are no Reset Password submissions in the SharePoint list yet.
                    Click "New Request" to create one.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={rsData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: RSRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by record number, application, login ID..."
                dateField="dateSubmitted"
                initiatorEmailField="requestedByEmail"
                approverEmailField="approverEmail"
                statusField="status"
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`Reset Password — ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.applicationType || ''} - ${selectedRecord?.resetType || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        // IT can approve/reject when Submitted; ED can confirm/reject when Completed + BANK type
        canApprove={selectedRecord?.status === 'Submitted' || selectedRecord?.status === 'Under_Review' || needsEDApproval}
        onApprove={(comments: string) => {
          if (needsEDApproval) {
            console.log('ED Confirmed:', comments);
          } else {
            console.log('IT Approved:', comments);
          }
          setSelectedRecord(null);
        }}
        onReject={(comments: string) => {
          if (needsEDApproval) {
            console.log('ED Rejected:', comments);
          } else {
            console.log('IT Rejected:', comments);
          }
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
