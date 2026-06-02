import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, type Column, type DataRecord } from '@/components/shared/database-table';
import { DetailModal, type FieldGroup, type ApprovalHistoryItem } from '@/components/shared/detail-modal';

// Form configurations
const FORM_CONFIGS: Record<string, {
  title: string;
  columns: Column[];
  fieldGroups: FieldGroup[];
}> = {
  vr: {
    title: 'Visitor Registration',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'visitorName', header: 'Visitor Name', width: '150px', sortable: true },
      { key: 'company', header: 'Company', width: '150px', sortable: true },
      { key: 'purpose', header: 'Purpose', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Visitor Information',
        fields: [
          { label: 'Visitor Name', key: 'visitorName' },
          { label: 'Company', key: 'company' },
          { label: 'Contact Number', key: 'contactNumber' },
          { label: 'ID Number', key: 'idNumber' },
        ],
      },
      {
        title: 'Visit Details',
        fields: [
          { label: 'Purpose', key: 'purpose' },
          { label: 'Host', key: 'host' },
          { label: 'Visit Date', key: 'visitDate' },
          { label: 'Expected Duration', key: 'duration' },
        ],
      },
    ],
  },
  vp: {
    title: 'Visitor Pass',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'visitorName', header: 'Visitor', width: '150px', sortable: true },
      { key: 'passType', header: 'Pass Type', width: '120px', sortable: true },
      { key: 'validUntil', header: 'Valid Until', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Pass Details',
        fields: [
          { label: 'Visitor Name', key: 'visitorName' },
          { label: 'Pass Type', key: 'passType' },
          { label: 'Valid From', key: 'validFrom' },
          { label: 'Valid Until', key: 'validUntil' },
        ],
      },
    ],
  },
  vl: {
    title: 'Visitor Log',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'visitorName', header: 'Visitor', width: '150px', sortable: true },
      { key: 'checkIn', header: 'Check In', width: '100px', sortable: true },
      { key: 'checkOut', header: 'Check Out', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Log Details',
        fields: [
          { label: 'Visitor Name', key: 'visitorName' },
          { label: 'Check In', key: 'checkIn' },
          { label: 'Check Out', key: 'checkOut' },
          { label: 'Duration', key: 'duration' },
        ],
      },
    ],
  },
  ve: {
    title: 'Vehicle Entry',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'vehicleNumber', header: 'Vehicle No', width: '120px', sortable: true },
      { key: 'driverName', header: 'Driver', width: '150px', sortable: true },
      { key: 'purpose', header: 'Purpose', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Vehicle Details',
        fields: [
          { label: 'Vehicle Number', key: 'vehicleNumber' },
          { label: 'Vehicle Type', key: 'vehicleType' },
          { label: 'Driver Name', key: 'driverName' },
          { label: 'Driver IC', key: 'driverIC' },
        ],
      },
      {
        title: 'Entry Details',
        fields: [
          { label: 'Purpose', key: 'purpose' },
          { label: 'Entry Time', key: 'entryTime' },
          { label: 'Exit Time', key: 'exitTime' },
          { label: 'Gate', key: 'gate' },
        ],
      },
    ],
  },
  pp: {
    title: 'Parking Permit',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'employeeName', header: 'Employee', width: '150px', sortable: true },
      { key: 'vehicleNumber', header: 'Vehicle No', width: '120px', sortable: true },
      { key: 'parkingZone', header: 'Zone', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Permit Details',
        fields: [
          { label: 'Employee Name', key: 'employeeName' },
          { label: 'Department', key: 'department' },
          { label: 'Vehicle Number', key: 'vehicleNumber' },
          { label: 'Parking Zone', key: 'parkingZone' },
        ],
      },
    ],
  },
  ki: {
    title: 'Key Issuance',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'recipientName', header: 'Recipient', width: '150px', sortable: true },
      { key: 'keyType', header: 'Key Type', width: '120px', sortable: true },
      { key: 'location', header: 'Location', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Issuance Details',
        fields: [
          { label: 'Recipient Name', key: 'recipientName' },
          { label: 'Department', key: 'department' },
          { label: 'Key Type', key: 'keyType' },
          { label: 'Location', key: 'location' },
        ],
      },
    ],
  },
  kr: {
    title: 'Key Return',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'returnedBy', header: 'Returned By', width: '150px', sortable: true },
      { key: 'keyType', header: 'Key Type', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Return Details',
        fields: [
          { label: 'Returned By', key: 'returnedBy' },
          { label: 'Key Type', key: 'keyType' },
          { label: 'Original Issue Date', key: 'originalIssueDate' },
          { label: 'Return Date', key: 'returnDate' },
        ],
      },
    ],
  },
  ac: {
    title: 'Access Card Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'employeeName', header: 'Employee', width: '150px', sortable: true },
      { key: 'requestType', header: 'Type', width: '100px', sortable: true },
      { key: 'accessLevel', header: 'Access Level', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Request Details',
        fields: [
          { label: 'Employee Name', key: 'employeeName' },
          { label: 'Department', key: 'department' },
          { label: 'Request Type', key: 'requestType' },
          { label: 'Access Level', key: 'accessLevel' },
        ],
      },
    ],
  },
  pr: {
    title: 'Patrol Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'patrolOfficer', header: 'Officer', width: '150px', sortable: true },
      { key: 'shift', header: 'Shift', width: '100px', sortable: true },
      { key: 'incidents', header: 'Incidents', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Patrol Details',
        fields: [
          { label: 'Patrol Officer', key: 'patrolOfficer' },
          { label: 'Shift', key: 'shift' },
          { label: 'Start Time', key: 'startTime' },
          { label: 'End Time', key: 'endTime' },
        ],
      },
      {
        title: 'Report',
        fields: [
          { label: 'Areas Covered', key: 'areasCovered', fullWidth: true },
          { label: 'Incidents', key: 'incidents', fullWidth: true },
          { label: 'Remarks', key: 'remarks', fullWidth: true },
        ],
      },
    ],
  },
  vx: {
    title: 'Vehicle Exit',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'vehicleNumber', header: 'Vehicle No', width: '120px', sortable: true },
      { key: 'driverName', header: 'Driver', width: '150px', sortable: true },
      { key: 'exitTime', header: 'Exit Time', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Exit Details',
        fields: [
          { label: 'Vehicle Number', key: 'vehicleNumber' },
          { label: 'Driver Name', key: 'driverName' },
          { label: 'Entry Time', key: 'entryTime' },
          { label: 'Exit Time', key: 'exitTime' },
        ],
      },
    ],
  },
};

// Generate sample data
const generateSampleData = (formCode: string): DataRecord[] => {
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Completed'];
  return Array.from({ length: 15 }, (_: unknown, i: number) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    dateSubmitted: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    submittedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    submittedByEmail: ['ahmad@ioi.com', 'siti@ioi.com', 'tan@ioi.com', 'kumar@ioi.com'][i % 4],
    status: statuses[i % 4],
    visitorName: ['John Smith', 'Lee Mei Ling', 'Muhammad Ali', 'Sarah Connor'][i % 4],
    company: ['ABC Corp', 'XYZ Ltd', 'Tech Solutions', 'Global Inc'][i % 4],
    purpose: ['Meeting', 'Delivery', 'Audit', 'Interview'][i % 4],
    host: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming'][i % 3],
    contactNumber: `+60${Math.floor(Math.random() * 900000000 + 100000000)}`,
    idNumber: `${Math.floor(Math.random() * 900000 + 100000)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    visitDate: format(new Date(Date.now() + i * 86400000), 'dd/MM/yyyy'),
    duration: ['1 hour', '2 hours', 'Half day', 'Full day'][i % 4],
    vehicleNumber: `W${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))} ${1000 + i}`,
    vehicleType: ['Car', 'Van', 'Lorry', 'Motorcycle'][i % 4],
    driverName: ['Driver A', 'Driver B', 'Driver C', 'Driver D'][i % 4],
    driverIC: `${Math.floor(Math.random() * 900000 + 100000)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    entryTime: `${8 + (i % 4)}:${String(i * 5 % 60).padStart(2, '0')} AM`,
    exitTime: `${4 + (i % 4)}:${String(i * 5 % 60).padStart(2, '0')} PM`,
    gate: ['Gate 1', 'Gate 2', 'Gate 3'][i % 3],
    employeeName: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    department: ['IT', 'HR', 'Finance', 'Production'][i % 4],
    parkingZone: ['Zone A', 'Zone B', 'Zone C'][i % 3],
    recipientName: ['Staff A', 'Staff B', 'Staff C'][i % 3],
    keyType: ['Office Key', 'Cabinet Key', 'Room Key'][i % 3],
    location: ['Building A', 'Building B', 'Building C'][i % 3],
    returnedBy: ['Staff A', 'Staff B', 'Staff C'][i % 3],
    originalIssueDate: format(new Date(Date.now() - (i + 30) * 86400000), 'dd/MM/yyyy'),
    returnDate: format(new Date(), 'dd/MM/yyyy'),
    requestType: ['New', 'Replacement', 'Upgrade'][i % 3],
    accessLevel: ['Basic', 'Standard', 'Full Access'][i % 3],
    patrolOfficer: ['Officer A', 'Officer B', 'Officer C'][i % 3],
    shift: ['Morning', 'Afternoon', 'Night'][i % 3],
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    areasCovered: 'All buildings, parking lots, perimeter fence',
    incidents: i % 3 === 0 ? 'None' : 'Minor incident reported',
    remarks: 'All clear. No issues to report.',
    passType: ['Day Pass', 'Week Pass', 'Month Pass'][i % 3],
    validFrom: format(new Date(), 'dd/MM/yyyy'),
    validUntil: format(new Date(Date.now() + 7 * 86400000), 'dd/MM/yyyy'),
    checkIn: `${8 + (i % 4)}:${String(i * 5 % 60).padStart(2, '0')} AM`,
    checkOut: `${4 + (i % 4)}:${String(i * 5 % 60).padStart(2, '0')} PM`,
  }));
};

export default function SecurityFormDatabaseView() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const config = formCode ? FORM_CONFIGS[formCode.toLowerCase()] : null;
  
  const allData = useMemo(() => {
    if (!formCode) return [];
    return generateSampleData(formCode);
  }, [formCode]);

  // Apply filter based on URL parameter
  const filteredData = useMemo(() => {
    if (!filter) return allData;
    
    // Simulate current user email
    const currentUserEmail = 'ahmad@ioi.com';
    
    if (filter === 'my-submissions') {
      return allData.filter((record: DataRecord) => record.submittedByEmail === currentUserEmail);
    }
    if (filter === 'my-pending-tasks') {
      return allData.filter((record: DataRecord) => 
        record.status === 'Pending Approval'
      );
    }
    return allData;
  }, [allData, filter]);

  if (!config || !formCode) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Form not found</h2>
          <p className="text-muted-foreground mt-2">The requested form does not exist.</p>
          <Button onClick={() => navigate('/security')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Security
          </Button>
        </div>
      </div>
    );
  }

  const handleRowClick = (record: DataRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const approvalHistory: ApprovalHistoryItem[] = selectedRecord ? [
    {
      step: 'Submitted',
      status: 'completed' as const,
      actor: String(selectedRecord.submittedBy || 'Unknown'),
      date: String(selectedRecord.dateSubmitted || ''),
    },
    {
      step: 'Security Review',
      status: selectedRecord.status === 'Draft' ? 'pending' as const : 
              selectedRecord.status === 'Pending Approval' ? 'current' as const : 'completed' as const,
      actor: 'Security Officer',
      date: selectedRecord.status !== 'Draft' ? String(selectedRecord.dateSubmitted || '') : undefined,
    },
    {
      step: 'Completed',
      status: selectedRecord.status === 'Completed' || selectedRecord.status === 'Approved' ? 'completed' as const : 'pending' as const,
      actor: selectedRecord.status === 'Completed' || selectedRecord.status === 'Approved' ? 'System' : 'Pending',
    },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' - My Submissions' : 
                     filter === 'my-pending-tasks' ? ' - My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/security')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View - {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/security/forms/${formCode}/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Table */}
      <DatabaseTable
        data={filteredData}
        columns={config.columns}
        onRowClick={handleRowClick}
        searchPlaceholder={`Search ${config.title}...`}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'All Status', value: '' },
              { label: 'Draft', value: 'Draft' },
              { label: 'Pending Approval', value: 'Pending Approval' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Completed', value: 'Completed' },
            ],
          },
        ]}
      />

      {/* Detail Modal */}
      {selectedRecord && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={config.title}
          recordNumber={String(selectedRecord.recordNumber)}
          status={String(selectedRecord.status)}
          fieldGroups={config.fieldGroups}
          data={selectedRecord}
          approvalHistory={approvalHistory}
          showApprovalActions={selectedRecord.status === 'Pending Approval'}
        />
      )}
    </div>
  );
}