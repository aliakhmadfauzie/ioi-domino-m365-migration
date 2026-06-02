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
  tna: {
    title: 'Training Needs Analysis',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'department', header: 'Department', width: '150px', sortable: true },
      { key: 'analysisType', header: 'Analysis Type', width: '150px', sortable: true },
      { key: 'priority', header: 'Priority', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Analysis Information',
        fields: [
          { label: 'Department', key: 'department' },
          { label: 'Analysis Type', key: 'analysisType' },
          { label: 'Priority', key: 'priority' },
          { label: 'Year', key: 'year' },
        ],
      },
      {
        title: 'Details',
        fields: [
          { label: 'Skills Gap Identified', key: 'skillsGap', fullWidth: true },
          { label: 'Recommended Training', key: 'recommendedTraining', fullWidth: true },
        ],
      },
    ],
  },
  atp: {
    title: 'Annual Training Plan',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'year', header: 'Year', width: '80px', sortable: true },
      { key: 'department', header: 'Department', width: '150px', sortable: true },
      { key: 'totalCourses', header: 'Total Courses', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Plan Details',
        fields: [
          { label: 'Year', key: 'year' },
          { label: 'Department', key: 'department' },
          { label: 'Total Courses', key: 'totalCourses' },
          { label: 'Total Budget', key: 'totalBudget' },
        ],
      },
    ],
  },
  tr: {
    title: 'Training Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'trainingTitle', header: 'Training Title', width: '200px', sortable: true },
      { key: 'requestedBy', header: 'Requested By', width: '150px', sortable: true },
      { key: 'participants', header: 'Participants', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Training Details',
        fields: [
          { label: 'Training Title', key: 'trainingTitle' },
          { label: 'Training Type', key: 'trainingType' },
          { label: 'Requested By', key: 'requestedBy' },
          { label: 'Number of Participants', key: 'participants' },
        ],
      },
      {
        title: 'Schedule',
        fields: [
          { label: 'Proposed Date', key: 'proposedDate' },
          { label: 'Duration', key: 'duration' },
          { label: 'Location', key: 'location' },
          { label: 'Estimated Cost', key: 'estimatedCost' },
        ],
      },
    ],
  },
  cr: {
    title: 'Course Registration',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'courseName', header: 'Course Name', width: '200px', sortable: true },
      { key: 'participantName', header: 'Participant', width: '150px', sortable: true },
      { key: 'courseDate', header: 'Course Date', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Registration Details',
        fields: [
          { label: 'Course Name', key: 'courseName' },
          { label: 'Participant Name', key: 'participantName' },
          { label: 'Department', key: 'department' },
          { label: 'Course Date', key: 'courseDate' },
        ],
      },
    ],
  },
  ta: {
    title: 'Training Attendance',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'courseName', header: 'Course Name', width: '200px', sortable: true },
      { key: 'attendanceRate', header: 'Attendance', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Attendance Details',
        fields: [
          { label: 'Course Name', key: 'courseName' },
          { label: 'Course Date', key: 'courseDate' },
          { label: 'Total Registered', key: 'totalRegistered' },
          { label: 'Total Attended', key: 'totalAttended' },
        ],
      },
    ],
  },
  ce: {
    title: 'Course Evaluation',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'courseName', header: 'Course Name', width: '200px', sortable: true },
      { key: 'overallRating', header: 'Rating', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Evaluation Details',
        fields: [
          { label: 'Course Name', key: 'courseName' },
          { label: 'Trainer', key: 'trainer' },
          { label: 'Overall Rating', key: 'overallRating' },
          { label: 'Recommendation', key: 'recommendation' },
        ],
      },
    ],
  },
  ccr: {
    title: 'Certification Renewal',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'employeeName', header: 'Employee', width: '150px', sortable: true },
      { key: 'certification', header: 'Certification', width: '200px', sortable: true },
      { key: 'expiryDate', header: 'Expiry Date', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Certification Details',
        fields: [
          { label: 'Employee Name', key: 'employeeName' },
          { label: 'Certification Name', key: 'certification' },
          { label: 'Current Expiry Date', key: 'expiryDate' },
          { label: 'Renewal Date', key: 'renewalDate' },
        ],
      },
    ],
  },
  cc: {
    title: 'Competency Certification',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'employeeName', header: 'Employee', width: '150px', sortable: true },
      { key: 'competency', header: 'Competency', width: '200px', sortable: true },
      { key: 'level', header: 'Level', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Competency Details',
        fields: [
          { label: 'Employee Name', key: 'employeeName' },
          { label: 'Competency', key: 'competency' },
          { label: 'Level', key: 'level' },
          { label: 'Assessment Date', key: 'assessmentDate' },
        ],
      },
    ],
  },
  cer: {
    title: 'Certificate Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'employeeName', header: 'Employee', width: '150px', sortable: true },
      { key: 'courseName', header: 'Course', width: '200px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Request Details',
        fields: [
          { label: 'Employee Name', key: 'employeeName' },
          { label: 'Course Name', key: 'courseName' },
          { label: 'Completion Date', key: 'completionDate' },
          { label: 'Certificate Type', key: 'certificateType' },
        ],
      },
    ],
  },
  etr: {
    title: 'External Training Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'trainingTitle', header: 'Training Title', width: '200px', sortable: true },
      { key: 'provider', header: 'Provider', width: '150px', sortable: true },
      { key: 'estimatedCost', header: 'Est. Cost', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Training Details',
        fields: [
          { label: 'Training Title', key: 'trainingTitle' },
          { label: 'Provider', key: 'provider' },
          { label: 'Location', key: 'location' },
          { label: 'Duration', key: 'duration' },
        ],
      },
      {
        title: 'Cost Details',
        fields: [
          { label: 'Estimated Cost', key: 'estimatedCost' },
          { label: 'Travel Required', key: 'travelRequired' },
          { label: 'Accommodation Required', key: 'accommodationRequired' },
        ],
      },
    ],
  },
  etb: {
    title: 'External Training Budget',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'department', header: 'Department', width: '150px', sortable: true },
      { key: 'year', header: 'Year', width: '80px', sortable: true },
      { key: 'totalBudget', header: 'Total Budget', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Budget Details',
        fields: [
          { label: 'Department', key: 'department' },
          { label: 'Year', key: 'year' },
          { label: 'Total Budget', key: 'totalBudget' },
          { label: 'Utilized', key: 'utilized' },
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
    department: ['IT', 'HR', 'Finance', 'Production'][i % 4],
    analysisType: ['Skills Gap', 'Compliance', 'Performance', 'Career Development'][i % 4],
    priority: ['High', 'Medium', 'Low'][i % 3],
    year: '2026',
    skillsGap: 'Technical skills need improvement in SAP modules',
    recommendedTraining: 'SAP S/4HANA Training, Excel Advanced',
    totalCourses: String(10 + i),
    totalBudget: `RM ${(50000 + i * 5000).toLocaleString()}`,
    trainingTitle: ['SAP S/4HANA Fundamentals', 'Excel Advanced', 'Leadership Skills', 'Safety Training'][i % 4],
    trainingType: ['Technical', 'Soft Skills', 'Compliance', 'Management'][i % 4],
    requestedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    participants: String(5 + (i % 10)),
    proposedDate: format(new Date(Date.now() + (i + 7) * 86400000), 'dd/MM/yyyy'),
    duration: ['1 day', '2 days', '3 days', '1 week'][i % 4],
    location: ['Training Room A', 'Training Room B', 'External Venue', 'Online'][i % 4],
    estimatedCost: `RM ${(2000 + i * 500).toLocaleString()}`,
    courseName: ['SAP S/4HANA Fundamentals', 'Excel Advanced', 'Leadership Skills', 'Safety Training'][i % 4],
    participantName: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    courseDate: format(new Date(Date.now() + (i + 7) * 86400000), 'dd/MM/yyyy'),
    attendanceRate: `${85 + (i % 15)}%`,
    totalRegistered: String(20 + i),
    totalAttended: String(18 + i),
    overallRating: `${4 + (i % 2)}.${i % 10}/5`,
    trainer: ['External Trainer A', 'Internal Trainer', 'Consultant B'][i % 3],
    recommendation: ['Highly Recommended', 'Recommended', 'Needs Improvement'][i % 3],
    employeeName: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    certification: ['ISO 9001 Internal Auditor', 'HRDF Trainer', 'First Aid', 'Fire Safety'][i % 4],
    expiryDate: format(new Date(Date.now() + (30 + i) * 86400000), 'dd/MM/yyyy'),
    renewalDate: format(new Date(Date.now() + (60 + i) * 86400000), 'dd/MM/yyyy'),
    competency: ['Technical Skills', 'Leadership', 'Communication', 'Problem Solving'][i % 4],
    level: ['Basic', 'Intermediate', 'Advanced', 'Expert'][i % 4],
    assessmentDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    completionDate: format(new Date(Date.now() - (i + 7) * 86400000), 'dd/MM/yyyy'),
    certificateType: ['Completion', 'Attendance', 'Achievement'][i % 3],
    provider: ['HRDF', 'External Provider', 'University', 'Professional Body'][i % 4],
    travelRequired: i % 2 === 0 ? 'Yes' : 'No',
    accommodationRequired: i % 3 === 0 ? 'Yes' : 'No',
    utilized: `RM ${(20000 + i * 2000).toLocaleString()}`,
  }));
};

export default function TrainingFormDatabaseView() {
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
          <Button onClick={() => navigate('/training')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Training
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
      step: 'HOD Review',
      status: selectedRecord.status === 'Draft' ? 'pending' as const : 
              selectedRecord.status === 'Pending Approval' ? 'current' as const : 'completed' as const,
      actor: 'Department Head',
      date: selectedRecord.status !== 'Draft' ? String(selectedRecord.dateSubmitted || '') : undefined,
    },
    {
      step: 'Training Dept Approval',
      status: selectedRecord.status === 'Completed' || selectedRecord.status === 'Approved' ? 'completed' as const : 'pending' as const,
      actor: selectedRecord.status === 'Completed' || selectedRecord.status === 'Approved' ? 'Training Manager' : 'Pending',
    },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' - My Submissions' : 
                     filter === 'my-pending-tasks' ? ' - My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/training')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View - {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/training/forms/${formCode}/new`)}>
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