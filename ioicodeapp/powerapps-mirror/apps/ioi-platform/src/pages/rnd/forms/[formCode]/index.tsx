import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, type Column, type DataRecord } from '@/components/shared/database-table';
import { DetailModal, type FieldGroup, type ApprovalHistoryItem } from '@/components/shared/detail-modal';

const FORM_CONFIGS: Record<string, { title: string; columns: Column[]; fieldGroups: FieldGroup[] }> = {
  rnddb: {
    title: 'R&D Database',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'projectCode', header: 'Project Code', width: '130px', sortable: true },
      { key: 'projectTitle', header: 'Project Title', sortable: true },
      { key: 'projectType', header: 'Type', width: '180px', sortable: true },
      { key: 'projectLead', header: 'Lead', width: '130px', sortable: true },
      { key: 'status', header: 'Status', width: '130px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Project Details', fields: [{ label: 'Project Code', key: 'projectCode' }, { label: 'Project Type', key: 'projectType' }, { label: 'Department', key: 'department' }, { label: 'Start Date', key: 'startDate' }, { label: 'Target End', key: 'targetEndDate' }, { label: 'Status', key: 'status' }, { label: 'Budget (RM)', key: 'budget' }, { label: 'Project Lead', key: 'projectLead' }] },
      { title: 'Scope', fields: [{ label: 'Objective', key: 'objective', fullWidth: true }, { label: 'Scope', key: 'scope', fullWidth: true }, { label: 'Expected Outcome', key: 'expectedOutcome', fullWidth: true }] },
    ],
  },
  rndprj: {
    title: 'R&D Project Form',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'initiationDate', header: 'Date', width: '100px', sortable: true },
      { key: 'projectTitle', header: 'Project Title', sortable: true },
      { key: 'projectCategory', header: 'Category', width: '180px', sortable: true },
      { key: 'priority', header: 'Priority', width: '180px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Project', fields: [{ label: 'Category', key: 'projectCategory' }, { label: 'Initiated By', key: 'initiatedBy' }, { label: 'Target Launch', key: 'targetLaunchDate' }, { label: 'Priority', key: 'priority' }, { label: 'Budget (RM)', key: 'estimatedBudget' }, { label: 'Expected Revenue', key: 'expectedRevenue' }] },
      { title: 'Business Case', fields: [{ label: 'Justification', key: 'businessJustification', fullWidth: true }, { label: 'Target Market', key: 'targetMarket', fullWidth: true }, { label: 'Technical Objectives', key: 'technicalObjectives', fullWidth: true }, { label: 'Milestones', key: 'keyMilestones', fullWidth: true }] },
    ],
  },
  rnmr: {
    title: 'Raw / New Material Record',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'receivedDate', header: 'Date', width: '100px', sortable: true },
      { key: 'materialName', header: 'Material Name', sortable: true },
      { key: 'supplier', header: 'Supplier', width: '140px', sortable: true },
      { key: 'batchNumber', header: 'Batch No.', width: '120px', sortable: true },
      { key: 'specificationStatus', header: 'Spec Status', sortable: true },
    ],
    fieldGroups: [
      { title: 'Material', fields: [{ label: 'Material Name', key: 'materialName' }, { label: 'Material Code', key: 'materialCode' }, { label: 'Supplier', key: 'supplier' }, { label: 'Country', key: 'supplierCountry' }, { label: 'Type', key: 'materialType' }, { label: 'Date Received', key: 'receivedDate' }, { label: 'Batch No.', key: 'batchNumber' }, { label: 'Quantity', key: 'quantity' }, { label: 'Unit', key: 'unit' }] },
      { title: 'Technical Data', fields: [{ label: 'Appearance', key: 'appearance' }, { label: 'pH', key: 'ph' }, { label: 'Purity (%)', key: 'purity' }, { label: 'Moisture (%)', key: 'moistureContent' }, { label: 'Spec Status', key: 'specificationStatus' }, { label: 'Storage', key: 'storageCondition' }, { label: 'Remarks', key: 'testRemarks', fullWidth: true }] },
    ],
  },
  newprdreq: {
    title: 'New Product Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'requestDate', header: 'Date', width: '100px', sortable: true },
      { key: 'productName', header: 'Product Name', sortable: true },
      { key: 'productCategory', header: 'Category', width: '160px', sortable: true },
      { key: 'priority', header: 'Priority', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Product Request', fields: [{ label: 'Product Name', key: 'productName' }, { label: 'Category', key: 'productCategory' }, { label: 'Requested By', key: 'requestedBy' }, { label: 'Department', key: 'requestingDept' }, { label: 'Target Launch', key: 'targetLaunchDate' }, { label: 'Priority', key: 'priority' }, { label: 'Target Volume', key: 'expectedVolume' }] },
      { title: 'Requirements', fields: [{ label: 'Target Customer', key: 'targetCustomer', fullWidth: true }, { label: 'Description', key: 'productDescription', fullWidth: true }, { label: 'Technical Requirements', key: 'technicalRequirements', fullWidth: true }] },
    ],
  },
  'cmf-a': {
    title: 'Customer / Market Form A — Requirements',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'captureDate', header: 'Date', width: '100px', sortable: true },
      { key: 'customerName', header: 'Customer', sortable: true },
      { key: 'customerCountry', header: 'Country', width: '120px', sortable: true },
      { key: 'productRequired', header: 'Product', sortable: true },
      { key: 'annualVolume', header: 'Annual Volume', width: '130px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Customer', fields: [{ label: 'Customer Name', key: 'customerName' }, { label: 'Country', key: 'customerCountry' }, { label: 'Contact', key: 'customerContact' }, { label: 'Captured By', key: 'capturedBy' }, { label: 'Date', key: 'captureDate' }] },
      { title: 'Requirements', fields: [{ label: 'Product Required', key: 'productRequired' }, { label: 'Annual Volume', key: 'annualVolume' }, { label: 'Target Price', key: 'targetPrice' }, { label: 'Application', key: 'applicationUse', fullWidth: true }, { label: 'Key Specs', key: 'keySpecs', fullWidth: true }, { label: 'Certifications', key: 'certifications', fullWidth: true }] },
    ],
  },
  'cmf-b': {
    title: 'Customer / Market Form B — Market Analysis',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'analysisDate', header: 'Date', width: '100px', sortable: true },
      { key: 'marketName', header: 'Market / Segment', sortable: true },
      { key: 'geographicFocus', header: 'Geography', width: '150px', sortable: true },
      { key: 'product', header: 'Product', sortable: true },
      { key: 'recommendation', header: 'Recommendation', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Market Overview', fields: [{ label: 'Market Segment', key: 'marketName' }, { label: 'Geography', key: 'geographicFocus' }, { label: 'Product', key: 'product' }, { label: 'Market Size', key: 'marketSize' }, { label: 'Growth Rate (%)', key: 'growthRate' }] },
      { title: 'Analysis', fields: [{ label: 'Key Drivers', key: 'keyDrivers', fullWidth: true }, { label: 'Key Barriers', key: 'keyBarriers', fullWidth: true }, { label: 'Main Competitors', key: 'mainCompetitors', fullWidth: true }, { label: 'IOI Differentiation', key: 'ioiDifferentiation', fullWidth: true }, { label: 'Recommendation', key: 'recommendation', fullWidth: true }] },
    ],
  },
  'cmf-c': {
    title: 'Customer / Market Form C — Product Specifications',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'productName', header: 'Product Name', sortable: true },
      { key: 'productCode', header: 'Product Code', width: '130px', sortable: true },
      { key: 'specVersion', header: 'Version', width: '90px', sortable: true },
      { key: 'effectiveDate', header: 'Effective', width: '110px', sortable: true },
      { key: 'customerSignOff', header: 'Sign-Off Status', sortable: true },
    ],
    fieldGroups: [
      { title: 'Specification Header', fields: [{ label: 'Product Code', key: 'productCode' }, { label: 'Version', key: 'specVersion' }, { label: 'Effective Date', key: 'effectiveDate' }, { label: 'Prepared By', key: 'preparedBy' }, { label: 'Approved By', key: 'approvedBy' }, { label: 'Customer Sign-Off', key: 'customerSignOff' }] },
      { title: 'Specifications', fields: [{ label: 'Appearance', key: 'appearance' }, { label: 'Colour', key: 'colour' }, { label: 'Purity (%)', key: 'purity' }, { label: 'Moisture (%, max)', key: 'moistureContent' }, { label: 'FFA (%, max)', key: 'ffa' }, { label: 'Iodine Value', key: 'iv' }, { label: 'Pack Size', key: 'packSize' }, { label: 'Shelf Life', key: 'shelfLife' }, { label: 'Storage', key: 'storageCondition' }, { label: 'Certifications', key: 'certifications' }] },
    ],
  },
};

const generateSampleData = (formCode: string): DataRecord[] => {
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Completed'];
  const people = ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'];
  const emails = ['ahmad@ioi.com', 'siti@ioi.com', 'tan@ioi.com', 'kumar@ioi.com'];
  return Array.from({ length: 12 }, (_: unknown, i: number) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    dateSubmitted: format(new Date(Date.now() - i * 86400000 * 14), 'dd/MM/yyyy'),
    submittedBy: people[i % 4],
    submittedByEmail: emails[i % 4],
    status: statuses[i % 4],
    projectCode: `RND-2026-${String(i + 1).padStart(3, '0')}`,
    projectTitle: ['Palm Oleic Acid Refinement Study', 'Low-Trans Margarine Formulation', 'High-Oleic Sunflower Alternative', 'RSPO-Certified Palm Kernel Oil'][i % 4],
    projectType: ['New Product Development', 'Product Improvement', 'Process Improvement', 'Material Research'][i % 4],
    projectCategory: ['New Product Development', 'Product Reformulation', 'Cost Reduction', 'Regulatory Compliance'][i % 4],
    department: ['R&D', 'Production', 'QA'][i % 3],
    startDate: format(new Date(Date.now() - (i + 30) * 86400000), 'dd/MM/yyyy'),
    targetEndDate: format(new Date(Date.now() + (180 - i * 10) * 86400000), 'dd/MM/yyyy'),
    projectLead: people[i % 4],
    initiatedBy: people[i % 4],
    initiationDate: format(new Date(Date.now() - i * 86400000 * 30), 'dd/MM/yyyy'),
    targetLaunchDate: format(new Date(Date.now() + (365 - i * 20) * 86400000), 'dd/MM/yyyy'),
    priority: ['Critical — Regulatory / Contractual', 'High — Key Customer Request', 'Medium — Market Opportunity'][i % 3],
    objective: 'Develop a refined oleic acid fraction with >85% purity suitable for personal care applications.',
    scope: 'Lab-scale to pilot-scale production. Excludes commercial scale-up.',
    expectedOutcome: 'Validated formulation with COA, stability data, and customer trial results.',
    budget: String(150000 + i * 20000),
    estimatedBudget: String(100000 + i * 15000),
    expectedRevenue: String(2000000 + i * 200000),
    businessJustification: 'Key customer in EU requires RSPO-certified high-oleic fraction. Current product does not meet new specification.',
    targetMarket: 'European personal care manufacturers. Estimated market size 15,000 MT/year.',
    technicalObjectives: '1. Achieve oleic content >85%. 2. Colour <1.5 Gardner. 3. FFA <0.1%.',
    keyMilestones: 'M1: Formulation trial — July 2026. M2: Stability test — Sept 2026. M3: Customer trial — Nov 2026.',
    materialName: ['RBD Palm Olein', 'Palm Kernel Stearin', 'Sunflower Oil Fraction', 'Shea Butter Extract'][i % 4],
    materialCode: `MAT-RND-${String(1000 + i).padStart(4, '0')}`,
    supplier: ['Supplier A (Malaysia)', 'Supplier B (Indonesia)', 'Supplier C (Ghana)'][i % 3],
    supplierCountry: ['Malaysia', 'Indonesia', 'Ghana', 'Netherlands'][i % 4],
    materialType: ['Raw Material', 'Chemical / Reagent', 'Additive'][i % 3],
    receivedDate: format(new Date(Date.now() - i * 86400000 * 7), 'dd/MM/yyyy'),
    batchNumber: `BATCH-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(3, '0')}`,
    quantity: String(25 + i * 5),
    unit: ['kg', 'litres', 'drums'][i % 3],
    recordedBy: people[i % 4],
    appearance: ['Clear pale yellow liquid', 'Solid white mass', 'Amber viscous liquid'][i % 3],
    ph: String(6.5 + (i % 5) * 0.1),
    purity: String(98 + (i % 3) * 0.5),
    moistureContent: String(0.1 + (i % 5) * 0.02),
    specificationStatus: ['Yes — Conforms', 'Conditional — Minor Deviation', 'Testing In Progress'][i % 3],
    storageCondition: ['Ambient (15–30°C)', 'Cool (2–15°C)', 'Refrigerated (2–8°C)'][i % 3],
    testRemarks: 'All parameters within specification. Approved for trial use.',
    productName: ['IOI Olein Select', 'Palm Kernel Oil Ultra', 'High-Oleic Fraction HO85', 'Specialty Stearin ST40'][i % 4],
    productCode: `SKU-${String(1000 + i).padStart(4, '0')}`,
    requestedBy: people[i % 4],
    requestingDept: ['Sales', 'Marketing', 'Production'][i % 3],
    requestDate: format(new Date(Date.now() - i * 86400000 * 5), 'dd/MM/yyyy'),
    productCategory: ['Food Grade', 'Industrial Grade', 'Pharmaceutical Grade'][i % 3],
    expectedVolume: `${500 + i * 100} MT/year`,
    targetSellingPrice: String(3000 + i * 200),
    productDescription: 'High-purity fractionated palm olein with enhanced oxidative stability for food applications.',
    technicalRequirements: 'Oleic >85%, FFA <0.1%, Colour <1.5 Gardner, RSPO Certified, Halal, Kosher.',
    customerName: ['Unilever EU', 'Beiersdorf AG', 'L\'Oréal France', 'Nestle Switzerland'][i % 4],
    customerCountry: ['Netherlands', 'Germany', 'France', 'Switzerland'][i % 4],
    customerContact: 'John Smith / jane.doe@company.com',
    capturedBy: people[i % 4],
    captureDate: format(new Date(Date.now() - i * 86400000 * 10), 'dd/MM/yyyy'),
    productRequired: ['High-Oleic Fraction', 'Palm Kernel Stearin', 'RBD Palm Olein'][i % 3],
    annualVolume: `${1000 + i * 200} MT`,
    targetPrice: `USD ${800 + i * 50}/MT`,
    applicationUse: 'Cosmetic formulation — skin cream base and emollient.',
    keySpecs: 'Oleic >80%, FFA <0.1%, Colour <2 Gardner, IV 80–90.',
    certifications: 'RSPO SG, Halal JAKIM, ISO 9001',
    marketName: ['Personal Care Emollients', 'Food Fats & Oils', 'Specialty Chemicals'][i % 3],
    geographicFocus: ['EU / Western Europe', 'Southeast Asia', 'Middle East'][i % 3],
    analysisDate: format(new Date(Date.now() - i * 86400000 * 21), 'dd/MM/yyyy'),
    preparedBy: people[i % 4],
    product: ['High-Oleic Palm Fraction', 'Palm Kernel Stearin', 'Specialty Olein'][i % 3],
    marketSize: `USD ${500 + i * 50}M / ${5000 + i * 500} MT`,
    growthRate: String(4 + i % 4),
    keyDrivers: 'Growing demand for sustainable, RSPO-certified oils in cosmetics. Clean label trend.',
    keyBarriers: 'Price competition from sunflower oil. Strict EU deforestation regulation (EUDR).',
    mainCompetitors: 'Wilmar International, AAK AB, Cargill Specialty Fats.',
    ioiDifferentiation: 'RSPO certified, competitive pricing, established EU customer relationships, flexible MOQ.',
    recommendation: ['Strongly Recommend — Strong Opportunity', 'Recommend — Moderate Opportunity'][i % 2],
    conclusion: 'Market is growing at 4–6% CAGR. IOI has a competitive position and should pursue.',
    specVersion: `${i % 3 + 1}.${i % 2}`,
    effectiveDate: format(new Date(Date.now() - (i + 14) * 86400000), 'dd/MM/yyyy'),
    approvedBy: 'R&D Director',
    colour: `${1 + (i % 5) * 0.3} Gardner`,
    ffa: String(0.05 + (i % 5) * 0.01),
    iv: `${80 + i % 10}–${90 + i % 10}`,
    packSize: ['25 kg PE bag', '200 L drum', 'Flexi-tank 20MT'][i % 3],
    packagingMaterial: ['Polyethylene bag', 'Steel drum', 'Food-grade ISO tank'][i % 3],
    shelfLife: ['12 months', '18 months', '24 months'][i % 3],
    customerSignOff: ['Customer Approved', 'Pending Customer Review', 'Customer Requested Changes'][i % 3],
  }));
};

export default function RNDFormDatabaseView() {
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
        <Button onClick={() => navigate('/rnd/forms')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      </div>
    );
  }

  const approvalHistory: ApprovalHistoryItem[] = selectedRecord ? [
    { step: 'Submitted', status: 'completed', actor: String(selectedRecord.submittedBy || ''), date: String(selectedRecord.dateSubmitted || '') },
    { step: 'R&D Manager Review', status: selectedRecord.status === 'Pending Approval' ? 'current' : selectedRecord.status === 'Draft' ? 'pending' : 'completed', actor: 'R&D Manager' },
    { step: 'Director Approval', status: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'completed' : 'pending', actor: 'R&D Director' },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' — My Submissions' : filter === 'my-pending-tasks' ? ' — My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/rnd/forms')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View — {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/rnd/forms/${formCode}/new`)}><Plus className="mr-2 h-4 w-4" />New Record</Button>
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
