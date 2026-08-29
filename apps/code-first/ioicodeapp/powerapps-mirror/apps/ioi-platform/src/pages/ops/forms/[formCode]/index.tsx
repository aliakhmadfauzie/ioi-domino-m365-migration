import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, type Column, type DataRecord } from '@/components/shared/database-table';
import { DetailModal, type FieldGroup, type ApprovalHistoryItem } from '@/components/shared/detail-modal';

const FORM_CONFIGS: Record<string, { title: string; columns: Column[]; fieldGroups: FieldGroup[] }> = {
  'ops-pps': {
    title: 'Production Planning Schedule',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'planType', header: 'Plan Type', width: '100px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '140px', sortable: true },
      { key: 'product', header: 'Product', sortable: true },
      { key: 'targetQuantity', header: 'Target Qty', width: '110px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Schedule', fields: [{ label: 'Plan Type', key: 'planType' }, { label: 'Start Date', key: 'startDate' }, { label: 'End Date', key: 'endDate' }, { label: 'Production Line', key: 'productionLine' }, { label: 'Product', key: 'product' }, { label: 'Target Quantity', key: 'targetQuantity' }, { label: 'Unit', key: 'targetUnit' }, { label: 'Prepared By', key: 'preparedBy' }] },
    ],
  },
  'ops-cap': {
    title: 'Capacity Plan',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'dateSubmitted', header: 'Date', width: '100px', sortable: true },
      { key: 'planPeriod', header: 'Period', width: '100px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '140px', sortable: true },
      { key: 'capacityUtilisation', header: 'Utilisation %', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Capacity', fields: [{ label: 'Period', key: 'planPeriod' }, { label: 'From', key: 'startDate' }, { label: 'To', key: 'endDate' }, { label: 'Line', key: 'productionLine' }, { label: 'Available Hours', key: 'availableHours' }, { label: 'Planned Hours', key: 'plannedHours' }, { label: 'Available Headcount', key: 'availableHeadcount' }, { label: 'Required Headcount', key: 'plannedHeadcount' }, { label: 'Utilisation (%)', key: 'capacityUtilisation' }] },
      { title: 'Risks', fields: [{ label: 'Constraints', key: 'constraints', fullWidth: true }] },
    ],
  },
  'ops-req': {
    title: 'Stock Requisition',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'requisitionDate', header: 'Date', width: '100px', sortable: true },
      { key: 'requestedBy', header: 'Requested By', width: '140px', sortable: true },
      { key: 'itemDescription', header: 'Item', sortable: true },
      { key: 'quantity', header: 'Qty', width: '80px', sortable: true },
      { key: 'urgency', header: 'Urgency', width: '130px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Requisition', fields: [{ label: 'Date', key: 'requisitionDate' }, { label: 'Requested By', key: 'requestedBy' }, { label: 'Department', key: 'department' }, { label: 'Required Date', key: 'requiredDate' }, { label: 'Urgency', key: 'urgency' }] },
      { title: 'Items', fields: [{ label: 'Item Code', key: 'itemCode' }, { label: 'Item Description', key: 'itemDescription' }, { label: 'Quantity', key: 'quantity' }, { label: 'Unit', key: 'unit' }, { label: 'Purpose', key: 'purpose', fullWidth: true }] },
    ],
  },
  'ops-wo': {
    title: 'Work Order Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'requestDate', header: 'Date', width: '100px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '130px', sortable: true },
      { key: 'product', header: 'Product', sortable: true },
      { key: 'workType', header: 'Work Type', width: '150px', sortable: true },
      { key: 'priority', header: 'Priority', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Work Order', fields: [{ label: 'Date', key: 'requestDate' }, { label: 'Requested By', key: 'requestedBy' }, { label: 'Line', key: 'productionLine' }, { label: 'Work Type', key: 'workType' }, { label: 'Product', key: 'product' }, { label: 'Target Qty', key: 'targetQuantity' }, { label: 'Planned Start', key: 'plannedStart' }, { label: 'Planned End', key: 'plannedEnd' }, { label: 'Priority', key: 'priority' }] },
      { title: 'Instructions', fields: [{ label: 'Instructions', key: 'instructions', fullWidth: true }] },
    ],
  },
  'ops-woc': {
    title: 'Work Order Completion Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'completionDate', header: 'Date', width: '100px', sortable: true },
      { key: 'workOrderNo', header: 'WO No.', width: '120px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '120px', sortable: true },
      { key: 'actualQuantity', header: 'Actual Qty', width: '110px', sortable: true },
      { key: 'qualityResult', header: 'Quality', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Completion', fields: [{ label: 'WO No.', key: 'workOrderNo' }, { label: 'Line', key: 'productionLine' }, { label: 'Completed By', key: 'completedBy' }, { label: 'Target Qty', key: 'targetQuantity' }, { label: 'Actual Qty', key: 'actualQuantity' }, { label: 'Planned Hours', key: 'plannedHours' }, { label: 'Actual Hours', key: 'actualHours' }, { label: 'Rejected Qty', key: 'rejectedQty' }, { label: 'Quality Result', key: 'qualityResult' }] },
    ],
  },
  'ops-nco': {
    title: 'Non-Conformance / Rework Order',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'detectionDate', header: 'Date', width: '100px', sortable: true },
      { key: 'product', header: 'Product / Batch', sortable: true },
      { key: 'ncType', header: 'NC Type', width: '150px', sortable: true },
      { key: 'affectedQuantity', header: 'Affected Qty', width: '120px', sortable: true },
      { key: 'disposition', header: 'Disposition', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Non-Conformance', fields: [{ label: 'Date', key: 'detectionDate' }, { label: 'Detected By', key: 'detectedBy' }, { label: 'Line', key: 'productionLine' }, { label: 'Product / Batch', key: 'product' }, { label: 'Affected Qty', key: 'affectedQuantity' }, { label: 'NC Type', key: 'ncType' }] },
      { title: 'Disposition', fields: [{ label: 'Description', key: 'ncDescription', fullWidth: true }, { label: 'Root Cause', key: 'rootCause', fullWidth: true }, { label: 'Disposition', key: 'disposition' }, { label: 'Authorised By', key: 'authorisedBy' }] },
    ],
  },
  'ops-sho': {
    title: 'Shift Handover Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'handoverDate', header: 'Date', width: '100px', sortable: true },
      { key: 'shift', header: 'Shift', width: '160px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '130px', sortable: true },
      { key: 'actualOutput', header: 'Output', width: '100px', sortable: true },
      { key: 'equipmentStatus', header: 'Equip. Status', width: '160px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Handover', fields: [{ label: 'Date', key: 'handoverDate' }, { label: 'Outgoing Shift', key: 'shift' }, { label: 'Outgoing Supervisor', key: 'outgoingSupervisor' }, { label: 'Incoming Supervisor', key: 'incomingSupervisor' }, { label: 'Line', key: 'productionLine' }, { label: 'Target Output', key: 'targetOutput' }, { label: 'Actual Output', key: 'actualOutput' }, { label: 'Downtime (min)', key: 'downtimeMinutes' }, { label: 'Equipment Status', key: 'equipmentStatus' }] },
      { title: 'Notes', fields: [{ label: 'Issues Encountered', key: 'issuesEncountered', fullWidth: true }, { label: 'Pending Tasks', key: 'pendingTasks', fullWidth: true }] },
    ],
  },
  'ops-ot': {
    title: 'Overtime Request',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'overtimeDate', header: 'OT Date', width: '100px', sortable: true },
      { key: 'requestedBy', header: 'Requested By', width: '140px', sortable: true },
      { key: 'department', header: 'Department', width: '130px', sortable: true },
      { key: 'overtimeType', header: 'OT Type', width: '140px', sortable: true },
      { key: 'headcount', header: 'Headcount', width: '100px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Overtime Details', fields: [{ label: 'OT Date', key: 'overtimeDate' }, { label: 'Requested By', key: 'requestedBy' }, { label: 'Department', key: 'department' }, { label: 'OT Type', key: 'overtimeType' }, { label: 'Start Time', key: 'startTime' }, { label: 'End Time', key: 'endTime' }, { label: 'Headcount', key: 'headcount' }, { label: 'Est. Cost (RM)', key: 'estimatedCost' }] },
      { title: 'Justification', fields: [{ label: 'Employees', key: 'employeeNames', fullWidth: true }, { label: 'Reason', key: 'reason', fullWidth: true }] },
    ],
  },
  'ops-oee': {
    title: 'OEE Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'reportDate', header: 'Date', width: '100px', sortable: true },
      { key: 'shift', header: 'Shift', width: '160px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '130px', sortable: true },
      { key: 'availability', header: 'Avail %', width: '90px', sortable: true },
      { key: 'performance', header: 'Perf %', width: '90px', sortable: true },
      { key: 'quality', header: 'Quality %', width: '100px', sortable: true },
      { key: 'oeeTotal', header: 'OEE %', width: '90px', sortable: true },
    ],
    fieldGroups: [
      { title: 'OEE Data', fields: [{ label: 'Date', key: 'reportDate' }, { label: 'Shift', key: 'shift' }, { label: 'Line', key: 'productionLine' }, { label: 'Product', key: 'product' }, { label: 'Availability (%)', key: 'availability' }, { label: 'Performance (%)', key: 'performance' }, { label: 'Quality (%)', key: 'quality' }, { label: 'OEE Total (%)', key: 'oeeTotal' }, { label: 'Downtime (min)', key: 'unplannedDowntime' }] },
      { title: 'Notes', fields: [{ label: 'Remarks', key: 'remarks', fullWidth: true }] },
    ],
  },
  'ops-dt': {
    title: 'Downtime Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'downtimeDate', header: 'Date', width: '100px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '130px', sortable: true },
      { key: 'equipmentId', header: 'Equipment', width: '130px', sortable: true },
      { key: 'durationMinutes', header: 'Duration (min)', width: '130px', sortable: true },
      { key: 'downtimeCategory', header: 'Category', width: '160px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Downtime Event', fields: [{ label: 'Date', key: 'downtimeDate' }, { label: 'Start Time', key: 'startTime' }, { label: 'End Time', key: 'endTime' }, { label: 'Duration (min)', key: 'durationMinutes' }, { label: 'Line', key: 'productionLine' }, { label: 'Equipment', key: 'equipmentId' }, { label: 'Category', key: 'downtimeCategory' }, { label: 'Production Lost', key: 'productionLoss' }] },
      { title: 'Analysis', fields: [{ label: 'Description', key: 'description', fullWidth: true }, { label: 'Root Cause', key: 'rootCause', fullWidth: true }, { label: 'Action Taken', key: 'actionTaken', fullWidth: true }] },
    ],
  },
  'ops-ppr': {
    title: 'Production Performance Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'reportDate', header: 'Date', width: '100px', sortable: true },
      { key: 'reportType', header: 'Type', width: '90px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '130px', sortable: true },
      { key: 'targetOutput', header: 'Target', width: '100px', sortable: true },
      { key: 'actualOutput', header: 'Actual', width: '100px', sortable: true },
      { key: 'achievement', header: 'Achievement %', width: '130px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Performance', fields: [{ label: 'Date', key: 'reportDate' }, { label: 'Report Type', key: 'reportType' }, { label: 'Line', key: 'productionLine' }, { label: 'Target', key: 'targetOutput' }, { label: 'Actual', key: 'actualOutput' }, { label: 'Achievement (%)', key: 'achievement' }, { label: 'OEE (%)', key: 'oee' }, { label: 'Reject Rate (%)', key: 'rejectRate' }, { label: 'Downtime (min)', key: 'totalDowntime' }] },
      { title: 'Notes', fields: [{ label: 'Highlights', key: 'highlights', fullWidth: true }, { label: 'Issues & Actions', key: 'issues', fullWidth: true }] },
    ],
  },
  'ops-spc': {
    title: 'Process Performance (SPC)',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'measurementDate', header: 'Date', width: '100px', sortable: true },
      { key: 'productionLine', header: 'Line', width: '130px', sortable: true },
      { key: 'parameter', header: 'Parameter', sortable: true },
      { key: 'outOfControl', header: 'OOC Points', width: '160px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Measurement', fields: [{ label: 'Date', key: 'measurementDate' }, { label: 'Shift', key: 'shift' }, { label: 'Line', key: 'productionLine' }, { label: 'Product', key: 'product' }, { label: 'Parameter', key: 'parameter' }, { label: 'UCL', key: 'ucl' }, { label: 'LCL', key: 'lcl' }, { label: 'Target', key: 'target' }, { label: 'OOC Points', key: 'outOfControl' }] },
      { title: 'Readings & Action', fields: [{ label: 'Sample Readings', key: 'readings', fullWidth: true }, { label: 'Action Taken', key: 'action', fullWidth: true }] },
    ],
  },
};

// Shared sample data generator
const generateSampleData = (formCode: string): DataRecord[] => {
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Completed'];
  const lines = ['Line 1', 'Line 2', 'Line 3', 'Packaging Line 1'];
  return Array.from({ length: 15 }, (_: unknown, i: number) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    dateSubmitted: format(new Date(Date.now() - i * 86400000 * 2), 'dd/MM/yyyy'),
    submittedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    submittedByEmail: ['ahmad@ioi.com', 'siti@ioi.com', 'tan@ioi.com', 'kumar@ioi.com'][i % 4],
    status: statuses[i % 4],
    planType: ['Daily', 'Weekly', 'Monthly'][i % 3],
    startDate: format(new Date(Date.now() - i * 86400000 * 7), 'dd/MM/yyyy'),
    endDate: format(new Date(Date.now() + (7 - i) * 86400000), 'dd/MM/yyyy'),
    productionLine: lines[i % 4],
    preparedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    product: ['Product A (SKU-001)', 'Product B (SKU-002)', 'Product C (SKU-003)', 'Product D (SKU-004)'][i % 4],
    targetQuantity: String(1000 + i * 200),
    targetUnit: 'Units',
    unit: 'Units',
    planPeriod: ['Weekly', 'Monthly'][i % 2],
    availableHours: String(160 - i * 4),
    plannedHours: String(140 - i * 3),
    availableHeadcount: String(20 + i % 5),
    plannedHeadcount: String(18 + i % 4),
    capacityUtilisation: String(85 + i % 10),
    constraints: 'Scheduled maintenance on Line 2 from 15–16 June.',
    requestDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    requestedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming'][i % 3],
    department: ['Production', 'Maintenance', 'QA', 'Warehouse'][i % 4],
    requiredDate: format(new Date(Date.now() + 3 * 86400000), 'dd/MM/yyyy'),
    urgency: ['Normal', 'Urgent', 'Critical — Production Stoppage Risk'][i % 3],
    itemCode: `MAT-${String(1000 + i).padStart(4, '0')}`,
    itemDescription: ['Palm Oil RBD', 'Packaging Film', 'Lubricating Oil', 'Cleaning Chemical'][i % 4],
    quantity: String(50 + i * 10),
    purpose: 'Required for production run on Line 1.',
    workOrderNo: `WO-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    workType: ['Production Run', 'Rework', 'Blending', 'Packaging'][i % 4],
    priority: ['Normal', 'High', 'Urgent'][i % 3],
    plannedStart: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    plannedEnd: format(new Date(Date.now() + (3 - i) * 86400000), 'dd/MM/yyyy'),
    instructions: 'Follow SOP-PROD-001. Use FIFO for raw material selection.',
    completionDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    completedBy: ['Ahmad Razak', 'Tan Wei Ming'][i % 2],
    supervisedBy: ['Siti Nurhaliza', 'Kumar Rajan'][i % 2],
    actualQuantity: String(950 + i * 180),
    plannedHours2: String(8),
    actualHours: String(7 + i % 3),
    rejectedQty: String(i % 20),
    qualityResult: ['Pass — All within spec', 'Conditional Pass', 'Fail — Rework required'][i % 3],
    detectionDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    detectedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    affectedQuantity: String(100 + i * 20),
    ncType: ['Off-Spec Product', 'Process Deviation', 'Packaging Defect'][i % 3],
    ncDescription: 'Viscosity out of specification range.',
    rootCause: 'Temperature fluctuation during blending.',
    disposition: ['Rework', 'Scrap', 'Use As-Is (concession)'][i % 3],
    authorisedBy: 'QA Manager',
    handoverDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    shift: ['Morning (06:00–14:00)', 'Afternoon (14:00–22:00)', 'Night (22:00–06:00)'][i % 3],
    outgoingSupervisor: ['Ahmad Razak', 'Tan Wei Ming'][i % 2],
    incomingSupervisor: ['Siti Nurhaliza', 'Kumar Rajan'][i % 2],
    targetOutput: String(1000),
    actualOutput: String(950 + i * 10),
    downtimeMinutes: String(i * 5),
    issuesEncountered: 'Minor seal failure on Line 2 — maintenance notified.',
    pendingTasks: 'Complete batch record for Batch B-2026-042.',
    equipmentStatus: ['All OK', 'Minor Issue — Monitoring', 'Fault — Maintenance Notified'][i % 3],
    overtimeDate: format(new Date(Date.now() + (i + 1) * 86400000), 'dd/MM/yyyy'),
    overtimeType: ['Weekday OT', 'Weekend OT', 'Public Holiday OT'][i % 3],
    startTime: '18:00',
    endTime: '22:00',
    headcount: String(5 + i % 5),
    employeeNames: 'Ahmad Razak, Tan Wei Ming, Kumar Rajan',
    reason: 'Backlog from equipment downtime on 2 June 2026.',
    estimatedCost: `RM ${(500 + i * 100).toLocaleString()}`,
    reportDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    reportType: ['Daily', 'Weekly', 'Monthly'][i % 3],
    availability: String(90 - i % 10),
    performance: String(85 + i % 8),
    quality: String(98 - i % 3),
    oeeTotal: String(Math.round((90 - i % 10) * (85 + i % 8) * (98 - i % 3) / 10000)),
    unplannedDowntime: String(i * 8),
    plannedProductionTime: '480',
    actualOutput2: String(950 + i * 15),
    goodUnits: String(940 + i * 14),
    downtimeDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    equipmentId: `MCH-${String(100 + i).padStart(3, '0')}`,
    durationMinutes: String(30 + i * 10),
    downtimeCategory: ['Mechanical Failure', 'Electrical Failure', 'Process Upset', 'Changeover / Setup'][i % 4],
    productionLoss: String(i * 50),
    description: 'Filling nozzle blocked causing line stoppage.',
    actionTaken: 'Nozzle cleaned and line restarted within 30 minutes.',
    oee: String(75 + i % 15),
    rejectRate: String(i % 5),
    totalDowntime: String(i * 15),
    achievement: String(90 + i % 8),
    highlights: 'Target achieved. No safety incidents. Efficiency at 95%.',
    issues: 'Minor downtime on Line 3 — to be investigated.',
    measurementDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    parameter: ['Fill Weight (g)', 'Viscosity (cP)', 'pH', 'Temperature (°C)'][i % 4],
    ucl: String(100.5),
    lcl: String(99.5),
    target: String(100),
    readings: '99.8, 100.1, 100.2, 99.9, 100.3, 100.0',
    outOfControl: ['None', 'Yes — Above UCL', 'None'][i % 3],
    action: 'Calibrated filling nozzle and re-sampled.',
  }));
};

export default function OPSFormDatabaseView() {
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
        <p className="text-muted-foreground mt-2">The requested form does not exist.</p>
        <Button onClick={() => navigate('/ops/forms')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Back to Operations Forms</Button>
      </div>
    );
  }

  const approvalHistory: ApprovalHistoryItem[] = selectedRecord ? [
    { step: 'Submitted', status: 'completed', actor: String(selectedRecord.submittedBy || ''), date: String(selectedRecord.dateSubmitted || '') },
    { step: 'Supervisor Review', status: selectedRecord.status === 'Draft' ? 'pending' : selectedRecord.status === 'Pending Approval' ? 'current' : 'completed', actor: 'Shift Supervisor' },
    { step: 'Manager Approval', status: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'completed' : 'pending', actor: 'Operations Manager' },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' — My Submissions' : filter === 'my-pending-tasks' ? ' — My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ops/forms')}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View — {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/ops/forms/${formCode}/new`)}><Plus className="mr-2 h-4 w-4" />New Record</Button>
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
