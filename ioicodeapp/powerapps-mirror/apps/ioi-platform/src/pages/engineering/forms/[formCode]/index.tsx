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
  pp: {
    title: 'Project Proposal',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'projectTitle', header: 'Project Title', width: '200px', sortable: true },
      { key: 'proposedBy', header: 'Proposed By', width: '150px', sortable: true },
      { key: 'estimatedBudget', header: 'Est. Budget', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Project Information',
        fields: [
          { label: 'Project Title', key: 'projectTitle' },
          { label: 'Proposed By', key: 'proposedBy' },
          { label: 'Department', key: 'department' },
          { label: 'Project Type', key: 'projectType' },
        ],
      },
      {
        title: 'Budget & Timeline',
        fields: [
          { label: 'Estimated Budget', key: 'estimatedBudget' },
          { label: 'Start Date', key: 'startDate' },
          { label: 'End Date', key: 'endDate' },
          { label: 'Priority', key: 'priority' },
        ],
      },
      {
        title: 'Description',
        fields: [
          { label: 'Project Scope', key: 'projectScope', fullWidth: true },
          { label: 'Justification', key: 'justification', fullWidth: true },
        ],
      },
    ],
  },
  ps: {
    title: 'Project Status',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'projectTitle', header: 'Project Title', width: '200px', sortable: true },
      { key: 'progress', header: 'Progress', width: '100px', sortable: true },
      { key: 'phase', header: 'Phase', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Project Status',
        fields: [
          { label: 'Project Title', key: 'projectTitle' },
          { label: 'Current Phase', key: 'phase' },
          { label: 'Progress', key: 'progress' },
          { label: 'Budget Utilized', key: 'budgetUtilized' },
        ],
      },
    ],
  },
  pc: {
    title: 'Project Closure',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'projectTitle', header: 'Project Title', width: '200px', sortable: true },
      { key: 'completionDate', header: 'Completed', width: '120px', sortable: true },
      { key: 'finalCost', header: 'Final Cost', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Closure Details',
        fields: [
          { label: 'Project Title', key: 'projectTitle' },
          { label: 'Completion Date', key: 'completionDate' },
          { label: 'Final Cost', key: 'finalCost' },
          { label: 'Budget Variance', key: 'budgetVariance' },
        ],
      },
    ],
  },
  moc: {
    title: 'Management of Change',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'changeTitle', header: 'Change Title', width: '200px', sortable: true },
      { key: 'changeType', header: 'Type', width: '120px', sortable: true },
      { key: 'riskLevel', header: 'Risk Level', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Change Information',
        fields: [
          { label: 'Change Title', key: 'changeTitle' },
          { label: 'Change Type', key: 'changeType' },
          { label: 'Risk Level', key: 'riskLevel' },
          { label: 'Impacted Areas', key: 'impactedAreas' },
        ],
      },
      {
        title: 'Details',
        fields: [
          { label: 'Description', key: 'description', fullWidth: true },
          { label: 'Justification', key: 'justification', fullWidth: true },
        ],
      },
    ],
  },
  mocr: {
    title: 'MOC Review',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'mocReference', header: 'MOC Ref', width: '120px', sortable: true },
      { key: 'reviewerName', header: 'Reviewer', width: '150px', sortable: true },
      { key: 'recommendation', header: 'Recommendation', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Review Details',
        fields: [
          { label: 'MOC Reference', key: 'mocReference' },
          { label: 'Reviewer Name', key: 'reviewerName' },
          { label: 'Review Date', key: 'reviewDate' },
          { label: 'Recommendation', key: 'recommendation' },
        ],
      },
    ],
  },
  mocc: {
    title: 'MOC Closure',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'mocReference', header: 'MOC Ref', width: '120px', sortable: true },
      { key: 'closureDate', header: 'Closed', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Closure Details',
        fields: [
          { label: 'MOC Reference', key: 'mocReference' },
          { label: 'Closure Date', key: 'closureDate' },
          { label: 'Implementation Status', key: 'implementationStatus' },
          { label: 'Lessons Learned', key: 'lessonsLearned' },
        ],
      },
    ],
  },
  dr: {
    title: 'Drawing Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'drawingTitle', header: 'Drawing Title', width: '200px', sortable: true },
      { key: 'requestedBy', header: 'Requested By', width: '150px', sortable: true },
      { key: 'drawingType', header: 'Type', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Drawing Details',
        fields: [
          { label: 'Drawing Title', key: 'drawingTitle' },
          { label: 'Drawing Type', key: 'drawingType' },
          { label: 'Requested By', key: 'requestedBy' },
          { label: 'Required Date', key: 'requiredDate' },
        ],
      },
    ],
  },
  du: {
    title: 'Drawing Update',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'drawingNumber', header: 'Drawing No', width: '150px', sortable: true },
      { key: 'revision', header: 'Revision', width: '80px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Update Details',
        fields: [
          { label: 'Drawing Number', key: 'drawingNumber' },
          { label: 'Current Revision', key: 'currentRevision' },
          { label: 'New Revision', key: 'revision' },
          { label: 'Change Description', key: 'changeDescription' },
        ],
      },
    ],
  },
  dc: {
    title: 'Drawing Control',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'drawingNumber', header: 'Drawing No', width: '150px', sortable: true },
      { key: 'controlAction', header: 'Action', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Control Details',
        fields: [
          { label: 'Drawing Number', key: 'drawingNumber' },
          { label: 'Control Action', key: 'controlAction' },
          { label: 'Effective Date', key: 'effectiveDate' },
          { label: 'Reason', key: 'reason' },
        ],
      },
    ],
  },
  es: {
    title: 'Equipment Specification',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'equipmentName', header: 'Equipment', width: '200px', sortable: true },
      { key: 'category', header: 'Category', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Equipment Details',
        fields: [
          { label: 'Equipment Name', key: 'equipmentName' },
          { label: 'Category', key: 'category' },
          { label: 'Manufacturer', key: 'manufacturer' },
          { label: 'Model', key: 'model' },
        ],
      },
    ],
  },
  ei: {
    title: 'Equipment Installation',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'equipmentName', header: 'Equipment', width: '200px', sortable: true },
      { key: 'location', header: 'Location', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Installation Details',
        fields: [
          { label: 'Equipment Name', key: 'equipmentName' },
          { label: 'Location', key: 'location' },
          { label: 'Installation Date', key: 'installationDate' },
          { label: 'Contractor', key: 'contractor' },
        ],
      },
    ],
  },
  ec: {
    title: 'Equipment Commissioning',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'equipmentName', header: 'Equipment', width: '200px', sortable: true },
      { key: 'commissioningDate', header: 'Commissioned', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Commissioning Details',
        fields: [
          { label: 'Equipment Name', key: 'equipmentName' },
          { label: 'Commissioning Date', key: 'commissioningDate' },
          { label: 'Test Results', key: 'testResults' },
          { label: 'Sign-off By', key: 'signoffBy' },
        ],
      },
    ],
  },
  eir: {
    title: 'E&I Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'requestTitle', header: 'Request Title', width: '200px', sortable: true },
      { key: 'requestType', header: 'Type', width: '120px', sortable: true },
      { key: 'priority', header: 'Priority', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Request Details',
        fields: [
          { label: 'Request Title', key: 'requestTitle' },
          { label: 'Request Type', key: 'requestType' },
          { label: 'Priority', key: 'priority' },
          { label: 'Location', key: 'location' },
        ],
      },
    ],
  },
  il: {
    title: 'Instrument Loop',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'loopTag', header: 'Loop Tag', width: '150px', sortable: true },
      { key: 'loopType', header: 'Type', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Loop Details',
        fields: [
          { label: 'Loop Tag', key: 'loopTag' },
          { label: 'Loop Type', key: 'loopType' },
          { label: 'Process Area', key: 'processArea' },
          { label: 'Calibration Status', key: 'calibrationStatus' },
        ],
      },
    ],
  },
  cl: {
    title: 'Calibration Log',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '120px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'instrumentTag', header: 'Instrument', width: '150px', sortable: true },
      { key: 'calibrationDate', header: 'Calibrated', width: '120px', sortable: true },
      { key: 'nextDue', header: 'Next Due', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      {
        title: 'Calibration Details',
        fields: [
          { label: 'Instrument Tag', key: 'instrumentTag' },
          { label: 'Calibration Date', key: 'calibrationDate' },
          { label: 'Next Due Date', key: 'nextDue' },
          { label: 'Result', key: 'result' },
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
    projectTitle: ['Plant Upgrade', 'New Production Line', 'Automation System', 'Safety Enhancement'][i % 4],
    proposedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    department: ['Engineering', 'Production', 'Maintenance', 'E&I'][i % 4],
    projectType: ['CAPEX', 'OPEX', 'Improvement', 'Compliance'][i % 4],
    estimatedBudget: `RM ${(100000 + i * 25000).toLocaleString()}`,
    startDate: format(new Date(Date.now() + (i + 7) * 86400000), 'dd/MM/yyyy'),
    endDate: format(new Date(Date.now() + (i + 90) * 86400000), 'dd/MM/yyyy'),
    priority: ['High', 'Medium', 'Low'][i % 3],
    projectScope: 'Upgrade existing equipment to improve efficiency',
    justification: 'Required to meet production targets',
    progress: `${(i + 1) * 10}%`,
    phase: ['Planning', 'Design', 'Procurement', 'Execution', 'Commissioning'][i % 5],
    budgetUtilized: `RM ${(50000 + i * 10000).toLocaleString()}`,
    completionDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    finalCost: `RM ${(95000 + i * 25000).toLocaleString()}`,
    budgetVariance: `${i % 2 === 0 ? '-' : '+'}${(i + 1) * 2}%`,
    changeTitle: ['Process Modification', 'Equipment Change', 'Material Change', 'Procedure Update'][i % 4],
    changeType: ['Temporary', 'Permanent'][i % 2],
    riskLevel: ['High', 'Medium', 'Low'][i % 3],
    impactedAreas: 'Production, Quality, Safety',
    description: 'Change to improve process efficiency',
    mocReference: `MOC-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    reviewerName: ['Engineer A', 'Engineer B', 'Engineer C'][i % 3],
    reviewDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    recommendation: ['Approved', 'Approved with Conditions', 'Rejected'][i % 3],
    closureDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    implementationStatus: ['Completed', 'In Progress', 'Pending'][i % 3],
    lessonsLearned: 'Document all changes thoroughly',
    drawingTitle: ['P&ID Update', 'Layout Drawing', 'Isometric', 'Electrical Schematic'][i % 4],
    drawingType: ['P&ID', 'Layout', 'Isometric', 'Electrical', 'Instrumentation'][i % 5],
    requestedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming'][i % 3],
    requiredDate: format(new Date(Date.now() + (i + 14) * 86400000), 'dd/MM/yyyy'),
    drawingNumber: `DWG-${1000 + i}`,
    revision: String.fromCharCode(65 + (i % 5)),
    currentRevision: String.fromCharCode(65 + ((i - 1) % 5)),
    changeDescription: 'Updated dimensions and specifications',
    controlAction: ['Issue', 'Revise', 'Obsolete'][i % 3],
    effectiveDate: format(new Date(Date.now() + (i + 7) * 86400000), 'dd/MM/yyyy'),
    reason: 'As per project requirements',
    equipmentName: ['Pump P-101', 'Compressor C-201', 'Heat Exchanger E-301', 'Tank T-401'][i % 4],
    category: ['Rotating', 'Static', 'Electrical', 'Instrumentation'][i % 4],
    manufacturer: ['ABB', 'Siemens', 'Emerson', 'Schneider'][i % 4],
    model: `Model-${1000 + i}`,
    location: ['Plant A', 'Plant B', 'Utility Area', 'Tank Farm'][i % 4],
    installationDate: format(new Date(Date.now() + (i + 30) * 86400000), 'dd/MM/yyyy'),
    contractor: ['Contractor A', 'Contractor B', 'In-house'][i % 3],
    commissioningDate: format(new Date(Date.now() + (i + 45) * 86400000), 'dd/MM/yyyy'),
    testResults: ['Pass', 'Pass with Remarks', 'Retest Required'][i % 3],
    signoffBy: ['Project Manager', 'Engineering Manager'][i % 2],
    requestTitle: ['New Installation', 'Repair', 'Modification', 'Upgrade'][i % 4],
    requestType: ['Electrical', 'Instrumentation', 'Control System'][i % 3],
    loopTag: `FIC-${100 + i}`,
    loopType: ['Flow', 'Temperature', 'Pressure', 'Level'][i % 4],
    processArea: ['Production', 'Utility', 'Storage'][i % 3],
    calibrationStatus: ['Due', 'Completed', 'Overdue'][i % 3],
    instrumentTag: `TI-${100 + i}`,
    calibrationDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    nextDue: format(new Date(Date.now() + (365 - i) * 86400000), 'dd/MM/yyyy'),
    result: ['Pass', 'Pass', 'Adjusted'][i % 3],
  }));
};

export default function EngineeringFormDatabaseView() {
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
          <Button onClick={() => navigate('/engineering')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Engineering
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
      step: 'Engineering Review',
      status: selectedRecord.status === 'Draft' ? 'pending' as const : 
              selectedRecord.status === 'Pending Approval' ? 'current' as const : 'completed' as const,
      actor: 'Engineering Manager',
      date: selectedRecord.status !== 'Draft' ? String(selectedRecord.dateSubmitted || '') : undefined,
    },
    {
      step: 'Plant Manager Approval',
      status: selectedRecord.status === 'Completed' || selectedRecord.status === 'Approved' ? 'completed' as const : 'pending' as const,
      actor: selectedRecord.status === 'Completed' || selectedRecord.status === 'Approved' ? 'Plant Manager' : 'Pending',
    },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' - My Submissions' : 
                     filter === 'my-pending-tasks' ? ' - My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/engineering')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View - {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/engineering/forms/${formCode}/new`)}>
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