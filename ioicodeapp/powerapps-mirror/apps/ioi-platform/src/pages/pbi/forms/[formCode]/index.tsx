import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, type Column, type DataRecord } from '@/components/shared/database-table';
import { DetailModal, type FieldGroup, type ApprovalHistoryItem } from '@/components/shared/detail-modal';

const FORM_CONFIGS: Record<string, { title: string; columns: Column[]; fieldGroups: FieldGroup[] }> = {
  enms1: {
    title: 'ENMS Form 1 — Energy Data Collection',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'month', header: 'Month', width: '100px', sortable: true },
      { key: 'year', header: 'Year', width: '80px', sortable: true },
      { key: 'site', header: 'Site', width: '150px', sortable: true },
      { key: 'electricityKWH', header: 'Electricity (kWh)', width: '150px', sortable: true },
      { key: 'specificEnergy', header: 'SEC (kWh/t)', width: '130px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Period & Site', fields: [{ label: 'Month', key: 'month' }, { label: 'Year', key: 'year' }, { label: 'Site', key: 'site' }, { label: 'Prepared By', key: 'preparedBy' }] },
      { title: 'Energy Data', fields: [{ label: 'Electricity (kWh)', key: 'electricityKWH' }, { label: 'Electricity Cost (RM)', key: 'electricityCost' }, { label: 'Gas (m³)', key: 'naturalGasM3' }, { label: 'Diesel (L)', key: 'dieselLitres' }, { label: 'Total Cost (RM)', key: 'totalEnergyCostRM' }, { label: 'Production (t)', key: 'productionVolume' }, { label: 'SEC (kWh/t)', key: 'specificEnergy' }] },
    ],
  },
  enms2: {
    title: 'ENMS Form 2 — Energy Performance Indicators',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'month', header: 'Month', width: '100px', sortable: true },
      { key: 'year', header: 'Year', width: '80px', sortable: true },
      { key: 'enpi1Name', header: 'EnPI 1', sortable: true },
      { key: 'enpi1Actual', header: 'Actual', width: '100px', sortable: true },
      { key: 'enpi1Target', header: 'Target', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'EnPI Data', fields: [{ label: 'Month', key: 'month' }, { label: 'Year', key: 'year' }, { label: 'EnPI 1', key: 'enpi1Name' }, { label: 'Baseline', key: 'enpi1Baseline' }, { label: 'Target', key: 'enpi1Target' }, { label: 'Actual', key: 'enpi1Actual' }, { label: 'EnPI 2', key: 'enpi2Name' }, { label: 'Actual 2', key: 'enpi2Actual' }] },
      { title: 'Analysis', fields: [{ label: 'Performance Summary', key: 'performanceSummary', fullWidth: true }, { label: 'Deviations', key: 'significantDeviations', fullWidth: true }, { label: 'Actions', key: 'improvementActions', fullWidth: true }] },
    ],
  },
  iso50001br: {
    title: 'ISO 50001 Baseline Review',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'reviewDate', header: 'Review Date', width: '120px', sortable: true },
      { key: 'baselineYear', header: 'Baseline Year', width: '120px', sortable: true },
      { key: 'site', header: 'Site', width: '150px', sortable: true },
      { key: 'baselineSEC', header: 'Baseline SEC', width: '130px', sortable: true },
      { key: 'baselineStatus', header: 'Status', sortable: true },
    ],
    fieldGroups: [
      { title: 'Baseline', fields: [{ label: 'Review Date', key: 'reviewDate' }, { label: 'Baseline Year', key: 'baselineYear' }, { label: 'Site', key: 'site' }, { label: 'Electricity (kWh/yr)', key: 'baselineElectricity' }, { label: 'Production (t/yr)', key: 'baselineProduction' }, { label: 'Baseline SEC', key: 'baselineSEC' }, { label: 'Status', key: 'baselineStatus' }, { label: 'Reviewed By', key: 'reviewedBy' }, { label: 'Approved By', key: 'approvedBy' }] },
      { title: 'Revision', fields: [{ label: 'Revised Baseline', key: 'revisedBaseline' }, { label: 'Revision Reason', key: 'revisionReason', fullWidth: true }] },
    ],
  },
  iso50001ncr: {
    title: 'ISO 50001 Non-Conformance Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'ncrDate', header: 'NCR Date', width: '110px', sortable: true },
      { key: 'ncrSource', header: 'Source', width: '150px', sortable: true },
      { key: 'clauseReference', header: 'Clause', width: '150px', sortable: true },
      { key: 'severity', header: 'Severity', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'NCR Details', fields: [{ label: 'NCR Date', key: 'ncrDate' }, { label: 'Raised By', key: 'raisedBy' }, { label: 'Source', key: 'ncrSource' }, { label: 'Clause', key: 'clauseReference' }, { label: 'Severity', key: 'severity' }] },
      { title: 'Description & Action', fields: [{ label: 'Description', key: 'description', fullWidth: true }, { label: 'Root Cause', key: 'rootCause', fullWidth: true }, { label: 'Corrective Action', key: 'correctiveAction', fullWidth: true }, { label: 'Responsible', key: 'responsiblePerson' }, { label: 'Target Date', key: 'targetDate' }] },
    ],
  },
  iso50001sop: {
    title: 'ISO 50001 SOP / Procedure',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'documentCode', header: 'Doc Code', width: '130px', sortable: true },
      { key: 'documentTitle', header: 'Title', sortable: true },
      { key: 'version', header: 'Version', width: '90px', sortable: true },
      { key: 'effectiveDate', header: 'Effective', width: '110px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Document', fields: [{ label: 'Document Code', key: 'documentCode' }, { label: 'Version', key: 'version' }, { label: 'Clause Reference', key: 'clauseReference' }, { label: 'Applicable To', key: 'applicableTo' }, { label: 'Effective Date', key: 'effectiveDate' }, { label: 'Prepared By', key: 'preparedBy' }, { label: 'Approved By', key: 'approvedBy' }] },
      { title: 'Content', fields: [{ label: 'Purpose', key: 'purpose', fullWidth: true }, { label: 'Scope', key: 'scope', fullWidth: true }] },
    ],
  },
  pbisopwi: {
    title: 'PBI SOP / Work Instruction Publication',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'documentCode', header: 'Doc Code', width: '130px', sortable: true },
      { key: 'documentTitle', header: 'Title', sortable: true },
      { key: 'documentType', header: 'Type', width: '180px', sortable: true },
      { key: 'version', header: 'Version', width: '90px', sortable: true },
      { key: 'effectiveDate', header: 'Effective', width: '110px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Publication', fields: [{ label: 'Document Type', key: 'documentType' }, { label: 'Document Code', key: 'documentCode' }, { label: 'Version', key: 'version' }, { label: 'Applicable To', key: 'applicableTo' }, { label: 'Effective Date', key: 'effectiveDate' }, { label: 'Review Due', key: 'reviewDueDate' }, { label: 'Prepared By', key: 'preparedBy' }, { label: 'Approved By', key: 'approvedBy' }] },
      { title: 'Changes', fields: [{ label: 'Change Description', key: 'changeDescription', fullWidth: true }, { label: 'Reason', key: 'reasonForChange', fullWidth: true }] },
    ],
  },
  tcci: {
    title: 'Target / Cost Control Index',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'reportMonth', header: 'Month', width: '100px', sortable: true },
      { key: 'reportYear', header: 'Year', width: '80px', sortable: true },
      { key: 'department', header: 'Department', width: '140px', sortable: true },
      { key: 'budgetedCost', header: 'Budget (RM)', width: '130px', sortable: true },
      { key: 'actualCost', header: 'Actual (RM)', width: '130px', sortable: true },
      { key: 'variance', header: 'Variance (RM)', width: '130px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'KPI Performance', fields: [{ label: 'Month', key: 'reportMonth' }, { label: 'Year', key: 'reportYear' }, { label: 'Department', key: 'department' }, { label: 'KPI 1', key: 'kpi1Name' }, { label: 'Target', key: 'kpi1Target' }, { label: 'Actual', key: 'kpi1Actual' }, { label: 'Status', key: 'kpi1Status' }] },
      { title: 'Cost Control', fields: [{ label: 'Budget (RM)', key: 'budgetedCost' }, { label: 'Actual (RM)', key: 'actualCost' }, { label: 'Variance (RM)', key: 'variance' }, { label: 'Explanation', key: 'varianceExplanation', fullWidth: true }, { label: 'Action Items', key: 'actionItems', fullWidth: true }] },
    ],
  },
};

const generateSampleData = (formCode: string): DataRecord[] => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June'];
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Completed'];
  return Array.from({ length: 12 }, (_: unknown, i: number) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    dateSubmitted: format(new Date(Date.now() - i * 86400000 * 30), 'dd/MM/yyyy'),
    submittedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming'][i % 3],
    submittedByEmail: ['ahmad@ioi.com', 'siti@ioi.com', 'tan@ioi.com'][i % 3],
    status: statuses[i % 4],
    month: months[i % 6],
    year: '2026',
    site: ['Prai (Penang)', 'Pasir Gudang (Johor)'][i % 2],
    preparedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    electricityKWH: String(250000 + i * 5000),
    electricityCost: String(180000 + i * 3000),
    peakDemandKW: String(500 + i * 10),
    naturalGasM3: String(15000 + i * 300),
    dieselLitres: String(3000 + i * 100),
    totalEnergyCostRM: String(210000 + i * 4000),
    productionVolume: String(5000 + i * 100),
    specificEnergy: String((250000 + i * 5000) / (5000 + i * 100)),
    enpi1Name: 'Specific Electricity (kWh/tonne)',
    enpi1Baseline: '50.0',
    enpi1Target: '47.5',
    enpi1Actual: String(48 + (i % 5) * 0.5),
    enpi2Name: 'Diesel per Tonne (L/tonne)',
    enpi2Baseline: '0.6',
    enpi2Target: '0.55',
    enpi2Actual: String(0.57 + (i % 3) * 0.02),
    performanceSummary: 'EnPI 1 within target. EnPI 2 slightly above target — action in progress.',
    significantDeviations: 'EnPI 2 — diesel consumption 3.6% above target due to generator usage during TNB outage on 12 June.',
    improvementActions: 'Review generator scheduling and explore renewable energy sources.',
    reviewDate: format(new Date(Date.now() - i * 86400000 * 90), 'dd/MM/yyyy'),
    baselineYear: '2023',
    reviewedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    approvedBy: 'Plant Director',
    baselineElectricity: '2800000',
    baselineProduction: '56000',
    baselineSEC: '50.0',
    baselineStatus: ['Confirmed — No Change', 'Revised — Normalisation Applied'][i % 2],
    revisedBaseline: '49.5',
    revisionReason: 'New production line added in Q2 2024. Normalisation factor updated.',
    ncrDate: format(new Date(Date.now() - i * 86400000 * 14), 'dd/MM/yyyy'),
    raisedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    ncrSource: ['Internal Audit', 'External Audit', 'Monitoring Data'][i % 3],
    clauseReference: [`Clause 6.${i % 5 + 1}`, 'Clause 8.1', 'Clause 9.1.1'][i % 3],
    severity: ['Major Non-Conformance', 'Minor Non-Conformance', 'Observation'][i % 3],
    description: 'Energy monitoring records for SEU-3 not maintained as per procedure.',
    rootCause: 'Responsible person on extended leave — no backup designated.',
    correctiveAction: 'Appoint backup personnel and update the responsibility matrix by 30 June 2026.',
    responsiblePerson: 'Ahmad Razak',
    targetDate: format(new Date(Date.now() + 30 * 86400000), 'dd/MM/yyyy'),
    documentCode: `PBI-SOP-${String(i + 1).padStart(3, '0')}`,
    documentTitle: ['Energy Monitoring Procedure', 'Baseline Calculation SOP', 'EnPI Review Work Instruction'][i % 3],
    version: `${i % 3 + 1}.0`,
    clauseRef2: 'Clause 8.1',
    applicableTo: ['Production', 'Utilities', 'All Departments'][i % 3],
    effectiveDate: format(new Date(Date.now() - (i + 30) * 86400000), 'dd/MM/yyyy'),
    reviewDueDate: format(new Date(Date.now() + (365 - i * 10) * 86400000), 'dd/MM/yyyy'),
    documentType: ['Standard Operating Procedure (SOP)', 'Work Instruction (WI)'][i % 2],
    changeDescription: 'Section 4.2 updated to reflect new meter installation at SEU-3.',
    reasonForChange: 'New sub-metering installed as part of ISO 50001 enhancement project.',
    reportMonth: months[i % 6],
    reportYear: '2026',
    department: ['Production', 'Utilities', 'Maintenance', 'All Departments'][i % 4],
    kpi1Name: 'Production Efficiency',
    kpi1Target: '95%',
    kpi1Actual: `${91 + i % 8}%`,
    kpi1Status: ['On Track', 'At Risk', 'Off Track'][i % 3],
    budgetedCost: String(500000 + i * 20000),
    actualCost: String(490000 + i * 18000),
    variance: String(-10000 + i * 2000),
    varianceExplanation: 'Under budget due to deferred maintenance activity.',
    actionItems: 'Review deferred maintenance schedule and reschedule for Q3.',
  }));
};

export default function PBIFormDatabaseView() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const key = formCode?.toLowerCase() ?? '';
  const config = FORM_CONFIGS[key];
  const allData = useMemo(() => (formCode ? generateSampleData(formCode) : []), [formCode]);
  const filteredData = useMemo(() => {
    if (!filter) return allData;
    const email = 'ahmad@ioi.com';
    if (filter === 'my-submissions') return allData.filter((r: DataRecord) => r.submittedByEmail === email);
    if (filter === 'my-pending-tasks') return allData.filter((r: DataRecord) => r.status === 'Pending Approval');
    return allData;
  }, [allData, filter]);

  if (!config || !formCode) {
    return (
      <div className="p-6 text-center py-12">
        <h2 className="text-xl font-semibold">Form not found</h2>
        <Button onClick={() => navigate('/pbi/forms')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      </div>
    );
  }

  const approvalHistory: ApprovalHistoryItem[] = selectedRecord ? [
    { step: 'Submitted', status: 'completed', actor: String(selectedRecord.submittedBy || ''), date: String(selectedRecord.dateSubmitted || '') },
    { step: 'PBI Review', status: selectedRecord.status === 'Pending Approval' ? 'current' : selectedRecord.status === 'Draft' ? 'pending' : 'completed', actor: 'PBI Manager' },
    { step: 'Director Approval', status: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'completed' : 'pending', actor: 'Plant Director' },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' — My Submissions' : filter === 'my-pending-tasks' ? ' — My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/pbi/forms')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View — {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/pbi/forms/${formCode}/new`)}><Plus className="mr-2 h-4 w-4" />New Record</Button>
      </div>
      <DatabaseTable data={filteredData} columns={config.columns} onRowClick={(r) => { setSelectedRecord(r); setIsModalOpen(true); }}
        searchPlaceholder={`Search ${config.title}...`}
        filters={[{ key: 'status', label: 'Status', options: [{ label: 'All Status', value: '' }, { label: 'Draft', value: 'Draft' }, { label: 'Pending Approval', value: 'Pending Approval' }, { label: 'Approved', value: 'Approved' }, { label: 'Completed', value: 'Completed' }] }]} />
      {selectedRecord && (
        <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={config.title}
          recordNumber={String(selectedRecord.recordNumber)} status={String(selectedRecord.status)}
          fieldGroups={config.fieldGroups} data={selectedRecord} approvalHistory={approvalHistory}
          showApprovalActions={selectedRecord.status === 'Pending Approval'} />
      )}
    </div>
  );
}
