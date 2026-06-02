import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, type Column, type DataRecord } from '@/components/shared/database-table';
import { DetailModal, type FieldGroup, type ApprovalHistoryItem } from '@/components/shared/detail-modal';

const FORM_CONFIGS: Record<string, { title: string; columns: Column[]; fieldGroups: FieldGroup[] }> = {
  'pol-001': {
    title: 'Policy Register',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'policyCode', header: 'Policy Code', width: '130px', sortable: true },
      { key: 'policyTitle', header: 'Policy Title', sortable: true },
      { key: 'policyType', header: 'Type', width: '150px', sortable: true },
      { key: 'effectiveDate', header: 'Effective', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Policy Details', fields: [{ label: 'Policy Code', key: 'policyCode' }, { label: 'Policy Type', key: 'policyType' }, { label: 'Effective Date', key: 'effectiveDate' }, { label: 'Review Date', key: 'reviewDate' }, { label: 'Policy Owner', key: 'policyOwner' }, { label: 'Version', key: 'version' }] },
      { title: 'Content', fields: [{ label: 'Objective', key: 'objective', fullWidth: true }, { label: 'Scope', key: 'scope', fullWidth: true }, { label: 'Key Provisions', key: 'keyPoints', fullWidth: true }] },
    ],
  },
  'pol-002': {
    title: 'Policy Review',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'policyCode', header: 'Policy Code', width: '130px', sortable: true },
      { key: 'policyTitle', header: 'Policy Title', sortable: true },
      { key: 'reviewOutcome', header: 'Outcome', width: '160px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Review Details', fields: [{ label: 'Policy Code', key: 'policyCode' }, { label: 'Current Version', key: 'currentVersion' }, { label: 'Review Date', key: 'reviewDate' }, { label: 'Reviewed By', key: 'reviewedBy' }, { label: 'Review Outcome', key: 'reviewOutcome' }, { label: 'Next Review Date', key: 'nextReviewDate' }] },
      { title: 'Changes', fields: [{ label: 'Changes Required', key: 'changesRequired', fullWidth: true }, { label: 'Reason', key: 'reason', fullWidth: true }] },
    ],
  },
  'pol-003': {
    title: 'Policy Exception Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'policyCode', header: 'Policy Ref', width: '130px', sortable: true },
      { key: 'requestedBy', header: 'Requested By', width: '140px', sortable: true },
      { key: 'exceptionType', header: 'Exception Type', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Exception Details', fields: [{ label: 'Policy Code', key: 'policyCode' }, { label: 'Exception Type', key: 'exceptionType' }, { label: 'Start Date', key: 'startDate' }, { label: 'End Date', key: 'endDate' }, { label: 'Requested By', key: 'requestedBy' }] },
      { title: 'Justification', fields: [{ label: 'Business Justification', key: 'justification', fullWidth: true }, { label: 'Risk Mitigation', key: 'riskMitigation', fullWidth: true }] },
    ],
  },
  'com-001': {
    title: 'Compliance Assessment',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'department', header: 'Department', width: '130px', sortable: true },
      { key: 'regulatoryArea', header: 'Regulatory Area', width: '160px', sortable: true },
      { key: 'complianceStatus', header: 'Status', width: '150px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Assessment Details', fields: [{ label: 'Department', key: 'department' }, { label: 'Assessment Date', key: 'assessmentDate' }, { label: 'Assessed By', key: 'assessedBy' }, { label: 'Regulatory Area', key: 'regulatoryArea' }, { label: 'Reference Standard', key: 'referenceStandard' }, { label: 'Compliance Status', key: 'complianceStatus' }] },
      { title: 'Findings', fields: [{ label: 'Non-Conformities', key: 'nonConformities', fullWidth: true }, { label: 'Corrective Actions', key: 'correctiveActions', fullWidth: true }] },
    ],
  },
  'com-002': {
    title: 'Regulatory Register',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'regulationCode', header: 'Regulation Code', width: '150px', sortable: true },
      { key: 'regulationName', header: 'Regulation Name', sortable: true },
      { key: 'currentStatus', header: 'Status', width: '150px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Regulation Details', fields: [{ label: 'Regulation Name', key: 'regulationName' }, { label: 'Reference Code', key: 'regulationCode' }, { label: 'Regulatory Body', key: 'regulatoryBody' }, { label: 'Effective Date', key: 'effectiveDate' }, { label: 'Compliance Owner', key: 'complianceOwner' }, { label: 'Current Status', key: 'currentStatus' }] },
      { title: 'Requirements', fields: [{ label: 'Key Requirements', key: 'requirements', fullWidth: true }] },
    ],
  },
  'com-003': {
    title: 'Legal Compliance Audit',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'auditTitle', header: 'Audit Title', sortable: true },
      { key: 'auditorName', header: 'Lead Auditor', width: '140px', sortable: true },
      { key: 'auditOutcome', header: 'Outcome', width: '180px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Audit Information', fields: [{ label: 'Audit Date', key: 'auditDate' }, { label: 'Lead Auditor', key: 'auditorName' }, { label: 'Auditor Type', key: 'auditorType' }, { label: 'Department', key: 'department' }, { label: 'Regulatory Reference', key: 'regulatoryReference' }, { label: 'Audit Outcome', key: 'auditOutcome' }] },
      { title: 'Findings', fields: [{ label: 'Findings Summary', key: 'findingsSummary', fullWidth: true }, { label: 'Corrective Actions', key: 'correctiveActions', fullWidth: true }] },
    ],
  },
  'rsk-001': {
    title: 'Risk Register',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'riskTitle', header: 'Risk Title', sortable: true },
      { key: 'riskCategory', header: 'Category', width: '130px', sortable: true },
      { key: 'riskOwner', header: 'Risk Owner', width: '140px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Risk Identification', fields: [{ label: 'Risk Category', key: 'riskCategory' }, { label: 'Department', key: 'department' }, { label: 'Risk Owner', key: 'riskOwner' }, { label: 'Date Identified', key: 'identifiedDate' }] },
      { title: 'Description', fields: [{ label: 'Risk Description', key: 'riskDescription', fullWidth: true }, { label: 'Potential Impact', key: 'potentialImpact', fullWidth: true }, { label: 'Existing Controls', key: 'existingControls', fullWidth: true }] },
    ],
  },
  'rsk-002': {
    title: 'Risk Assessment',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'riskTitle', header: 'Risk Title', sortable: true },
      { key: 'riskOwner', header: 'Risk Owner', width: '140px', sortable: true },
      { key: 'riskAcceptance', header: 'Decision', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Assessment', fields: [{ label: 'Risk Owner', key: 'riskOwner' }, { label: 'Assessment Date', key: 'assessmentDate' }, { label: 'Inherent Likelihood', key: 'inherentLikelihood' }, { label: 'Inherent Impact', key: 'inherentImpact' }, { label: 'Residual Likelihood', key: 'residualLikelihood' }, { label: 'Residual Impact', key: 'residualImpact' }, { label: 'Risk Acceptance', key: 'riskAcceptance' }, { label: 'Next Review Date', key: 'nextReviewDate' }] },
    ],
  },
  'rsk-003': {
    title: 'Risk Treatment Plan',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'riskTitle', header: 'Risk Title', sortable: true },
      { key: 'treatmentStrategy', header: 'Strategy', width: '160px', sortable: true },
      { key: 'responsiblePerson', header: 'Responsible', width: '140px', sortable: true },
      { key: 'targetDate', header: 'Target Date', width: '110px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Treatment Plan', fields: [{ label: 'Treatment Strategy', key: 'treatmentStrategy' }, { label: 'Responsible Person', key: 'responsiblePerson' }, { label: 'Start Date', key: 'startDate' }, { label: 'Target Date', key: 'targetDate' }, { label: 'Estimated Cost', key: 'estimatedCost' }] },
      { title: 'Actions & Criteria', fields: [{ label: 'Treatment Actions', key: 'actions', fullWidth: true }, { label: 'Success Criteria', key: 'successCriteria', fullWidth: true }, { label: 'Progress Update', key: 'progressUpdate', fullWidth: true }] },
    ],
  },
};

const generateSampleData = (formCode: string): DataRecord[] => {
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Completed'];
  return Array.from({ length: 12 }, (_: unknown, i: number) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    dateSubmitted: format(new Date(Date.now() - i * 86400000 * 3), 'dd/MM/yyyy'),
    submittedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    submittedByEmail: ['ahmad@ioi.com', 'siti@ioi.com', 'tan@ioi.com', 'kumar@ioi.com'][i % 4],
    status: statuses[i % 4],
    department: ['Production', 'IT', 'Finance', 'HR'][i % 4],
    policyCode: `GOV-POL-${String(i + 1).padStart(3, '0')}`,
    policyTitle: ['Data Protection Policy', 'IT Security Policy', 'Code of Conduct', 'Procurement Policy'][i % 4],
    policyType: ['Corporate Policy', 'Departmental Policy', 'Standard Operating Procedure', 'Guideline'][i % 4],
    effectiveDate: format(new Date(Date.now() - (i + 30) * 86400000), 'dd/MM/yyyy'),
    reviewDate: format(new Date(Date.now() + (365 - i * 10) * 86400000), 'dd/MM/yyyy'),
    policyOwner: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    version: `${i % 3 + 1}.0`,
    objective: 'To establish standards and guidelines for compliance with applicable regulations.',
    scope: 'All employees and contractors within IOI Group.',
    keyPoints: 'Mandatory compliance, regular reviews, incident reporting obligations.',
    currentVersion: `${i % 3 + 1}.0`,
    reviewDate2: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    reviewedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    reviewOutcome: ['No Changes Required', 'Minor Amendments', 'Major Revision Required'][i % 3],
    nextReviewDate: format(new Date(Date.now() + 365 * 86400000), 'dd/MM/yyyy'),
    changesRequired: 'Update section 3.2 to reflect new PDPA amendments.',
    reason: 'Regulatory update from PDPC issued in Q1 2026.',
    requestedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    exceptionType: ['Temporary Exception', 'Conditional Exception'][i % 2],
    startDate: format(new Date(), 'dd/MM/yyyy'),
    endDate: format(new Date(Date.now() + 90 * 86400000), 'dd/MM/yyyy'),
    justification: 'Business critical project requires temporary deviation during transition period.',
    riskMitigation: 'Enhanced manual controls and weekly monitoring reports will be implemented.',
    assessmentDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    assessedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    regulatoryArea: ['Labour Law', 'Environmental Regulation', 'Safety & Health (OSHA)', 'Data Protection (PDPA)'][i % 4],
    referenceStandard: ['OSHA 1994', 'ISO 14001', 'PDPA 2010', 'ISO 45001'][i % 4],
    complianceStatus: ['Compliant', 'Partially Compliant', 'Non-Compliant'][i % 3],
    nonConformities: 'Section 4(b) records not maintained as required.',
    correctiveActions: 'Update records management procedure and conduct staff briefing by 30 June 2026.',
    regulationCode: ['OSHA-1994', 'PDPA-2010', 'ISO-14001', 'ISO-45001'][i % 4],
    regulationName: ['Occupational Safety & Health Act 1994', 'Personal Data Protection Act 2010', 'ISO 14001 Environmental Management', 'ISO 45001 OH&S Management'][i % 4],
    regulatoryBody: ['DOSH', 'PDPC', 'ISO', 'DOSH'][i % 4],
    complianceOwner: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    requirements: 'Mandatory compliance with all applicable sections. Annual self-assessment required.',
    currentStatus: ['Compliant', 'Partially Compliant', 'Under Review'][i % 3],
    auditTitle: `Legal Compliance Audit Q${(i % 4) + 1} 2026`,
    auditDate: format(new Date(Date.now() - i * 86400000 * 7), 'dd/MM/yyyy'),
    auditorName: ['External Auditor', 'Internal Audit Team'][i % 2],
    auditorType: ['External Auditor', 'Internal Auditor', 'Third-Party Certifier'][i % 3],
    regulatoryReference: ['OSHA 1994', 'ISO 45001', 'PDPA 2010'][i % 3],
    auditOutcome: ['Pass — No Findings', 'Pass — Minor Observations', 'Conditional Pass — Major Findings'][i % 3],
    findingsSummary: 'Emergency procedure documentation incomplete for 2 out of 5 buildings.',
    riskTitle: ['Cybersecurity Breach', 'Supply Chain Disruption', 'Regulatory Non-Compliance', 'Key Person Risk'][i % 4],
    riskCategory: ['Strategic', 'Operational', 'Legal / Compliance', 'People'][i % 4],
    riskOwner: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    identifiedDate: format(new Date(Date.now() - i * 86400000 * 14), 'dd/MM/yyyy'),
    riskDescription: 'Risk of unauthorized access to sensitive company and customer data.',
    potentialImpact: 'Data loss, regulatory fines, reputational damage.',
    existingControls: 'Firewall, MFA, annual penetration testing.',
    inherentLikelihood: ['3 - Possible', '4 - Likely', '2 - Unlikely'][i % 3],
    inherentImpact: ['4 - Major', '3 - Moderate', '5 - Catastrophic'][i % 3],
    residualLikelihood: ['2 - Unlikely', '1 - Rare', '3 - Possible'][i % 3],
    residualImpact: ['3 - Moderate', '2 - Minor', '4 - Major'][i % 3],
    riskAcceptance: ['Treat', 'Accept', 'Transfer'][i % 3],
    treatmentStrategy: ['Reduce Likelihood', 'Reduce Impact', 'Transfer Risk (Insurance)'][i % 3],
    responsiblePerson: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    targetDate: format(new Date(Date.now() + (30 + i * 7) * 86400000), 'dd/MM/yyyy'),
    estimatedCost: `RM ${(10000 + i * 2500).toLocaleString()}`,
    actions: 'Implement endpoint detection & response (EDR) solution, conduct quarterly security training.',
    successCriteria: 'Zero critical security incidents in 12 months; all staff complete training.',
    progressUpdate: 'EDR solution deployed on 80% of endpoints. Training scheduled for Q3 2026.',
  }));
};

export default function GovernanceFormDatabaseView() {
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
    const currentUserEmail = 'ahmad@ioi.com';
    if (filter === 'my-submissions') return allData.filter((r: DataRecord) => r.submittedByEmail === currentUserEmail);
    if (filter === 'my-pending-tasks') return allData.filter((r: DataRecord) => r.status === 'Pending Approval');
    return allData;
  }, [allData, filter]);

  if (!config || !formCode) {
    return (
      <div className="p-6 text-center py-12">
        <h2 className="text-xl font-semibold">Form not found</h2>
        <p className="text-muted-foreground mt-2">The requested form does not exist.</p>
        <Button onClick={() => navigate('/governance/forms')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Governance Forms
        </Button>
      </div>
    );
  }

  const approvalHistory: ApprovalHistoryItem[] = selectedRecord ? [
    { step: 'Submitted', status: 'completed', actor: String(selectedRecord.submittedBy || ''), date: String(selectedRecord.dateSubmitted || '') },
    {
      step: 'Governance Review',
      status: selectedRecord.status === 'Draft' ? 'pending' : selectedRecord.status === 'Pending Approval' ? 'current' : 'completed',
      actor: 'Governance Officer',
      date: selectedRecord.status !== 'Draft' ? String(selectedRecord.dateSubmitted || '') : undefined,
    },
    {
      step: 'Management Approval',
      status: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'completed' : 'pending',
      actor: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'Management' : 'Pending',
    },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' — My Submissions' : filter === 'my-pending-tasks' ? ' — My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/governance/forms')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View — {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/governance/forms/${formCode}/new`)}>
          <Plus className="mr-2 h-4 w-4" /> New Record
        </Button>
      </div>

      <DatabaseTable
        data={filteredData}
        columns={config.columns}
        onRowClick={(record) => { setSelectedRecord(record); setIsModalOpen(true); }}
        searchPlaceholder={`Search ${config.title}...`}
        filters={[{ key: 'status', label: 'Status', options: [{ label: 'All Status', value: '' }, { label: 'Draft', value: 'Draft' }, { label: 'Pending Approval', value: 'Pending Approval' }, { label: 'Approved', value: 'Approved' }, { label: 'Completed', value: 'Completed' }] }]}
      />

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
