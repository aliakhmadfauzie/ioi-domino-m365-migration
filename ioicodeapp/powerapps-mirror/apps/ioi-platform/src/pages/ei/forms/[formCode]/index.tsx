import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, type Column, type DataRecord } from '@/components/shared/database-table';
import { DetailModal, type FieldGroup, type ApprovalHistoryItem } from '@/components/shared/detail-modal';

const FORM_CONFIGS: Record<string, { title: string; columns: Column[]; fieldGroups: FieldGroup[] }> = {
  'ei-ins-001': {
    title: 'E&I Inspection Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'inspectionDate', header: 'Date', width: '100px', sortable: true },
      { key: 'area', header: 'Area', width: '150px', sortable: true },
      { key: 'equipmentId', header: 'Equipment Tag', width: '130px', sortable: true },
      { key: 'overallCondition', header: 'Condition', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Inspection Details', fields: [{ label: 'Date', key: 'inspectionDate' }, { label: 'Inspector', key: 'inspector' }, { label: 'Area', key: 'area' }, { label: 'Equipment Tag', key: 'equipmentId' }, { label: 'Type', key: 'inspectionType' }, { label: 'Condition', key: 'overallCondition' }] },
      { title: 'Findings', fields: [{ label: 'Findings', key: 'findings', fullWidth: true }, { label: 'Immediate Action', key: 'actionTaken', fullWidth: true }, { label: 'Follow-up Required', key: 'followUpRequired' }, { label: 'Target Date', key: 'targetDate' }] },
    ],
  },
  'ei-ins-002': {
    title: 'Loop Test Record',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'testDate', header: 'Date', width: '100px', sortable: true },
      { key: 'loopTag', header: 'Loop Tag', width: '120px', sortable: true },
      { key: 'loopDescription', header: 'Description', sortable: true },
      { key: 'testResult', header: 'Result', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Loop Test', fields: [{ label: 'Test Date', key: 'testDate' }, { label: 'Tested By', key: 'testedBy' }, { label: 'Loop Tag', key: 'loopTag' }, { label: 'Description', key: 'loopDescription' }, { label: 'Range', key: 'instrumentRange' }, { label: 'As-Found', key: 'asFoundReading' }, { label: 'As-Left', key: 'asLeftReading' }, { label: 'Result', key: 'testResult' }] },
    ],
  },
  'ei-ins-003': {
    title: 'Insulation Resistance Test',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'testDate', header: 'Date', width: '100px', sortable: true },
      { key: 'equipmentId', header: 'Equipment Tag', width: '130px', sortable: true },
      { key: 'equipmentType', header: 'Type', width: '140px', sortable: true },
      { key: 'testResult', header: 'Result', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Test Details', fields: [{ label: 'Test Date', key: 'testDate' }, { label: 'Tested By', key: 'testedBy' }, { label: 'Equipment Tag', key: 'equipmentId' }, { label: 'Equipment Type', key: 'equipmentType' }, { label: 'Voltage Rating', key: 'voltageRating' }, { label: 'Test Voltage (V)', key: 'testVoltage' }] },
      { title: 'Results', fields: [{ label: 'Phase 1 to Earth (MΩ)', key: 'phase1ToEarth' }, { label: 'Phase 2 to Earth (MΩ)', key: 'phase2ToEarth' }, { label: 'Phase 3 to Earth (MΩ)', key: 'phase3ToEarth' }, { label: 'Min Acceptable (MΩ)', key: 'minimumAcceptable' }, { label: 'Result', key: 'testResult' }] },
    ],
  },
  'ei-enm-001': {
    title: 'Energy Meter Reading',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'readingDate', header: 'Date', width: '100px', sortable: true },
      { key: 'meterTag', header: 'Meter Tag', width: '120px', sortable: true },
      { key: 'meterLocation', header: 'Location', width: '150px', sortable: true },
      { key: 'consumption', header: 'Consumption', width: '120px', sortable: true },
      { key: 'unit', header: 'Unit', width: '80px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Reading', fields: [{ label: 'Date', key: 'readingDate' }, { label: 'Time', key: 'readingTime' }, { label: 'Recorded By', key: 'recordedBy' }, { label: 'Meter Tag', key: 'meterTag' }, { label: 'Location', key: 'meterLocation' }, { label: 'Meter Type', key: 'meterType' }, { label: 'Previous Reading', key: 'previousReading' }, { label: 'Current Reading', key: 'currentReading' }, { label: 'Consumption', key: 'consumption' }, { label: 'Unit', key: 'unit' }] },
    ],
  },
  'ei-enm-002': {
    title: 'Energy Anomaly Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'reportDate', header: 'Date', width: '100px', sortable: true },
      { key: 'area', header: 'Area', width: '140px', sortable: true },
      { key: 'anomalyType', header: 'Anomaly Type', width: '160px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Anomaly Details', fields: [{ label: 'Report Date', key: 'reportDate' }, { label: 'Reported By', key: 'reportedBy' }, { label: 'Area', key: 'area' }, { label: 'Anomaly Type', key: 'anomalyType' }, { label: 'Expected', key: 'expectedValue' }, { label: 'Actual', key: 'actualValue' }] },
      { title: 'Action', fields: [{ label: 'Description', key: 'description', fullWidth: true }, { label: 'Probable Cause', key: 'possibleCause', fullWidth: true }, { label: 'Action Taken', key: 'actionTaken', fullWidth: true }] },
    ],
  },
  'ei-enm-003': {
    title: 'ENMS Monthly Summary',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'month', header: 'Month', width: '100px', sortable: true },
      { key: 'year', header: 'Year', width: '80px', sortable: true },
      { key: 'electricityConsumption', header: 'Electricity (kWh)', width: '150px', sortable: true },
      { key: 'totalEnergyCost', header: 'Cost (RM)', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '120px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Consumption', fields: [{ label: 'Month', key: 'month' }, { label: 'Year', key: 'year' }, { label: 'Electricity (kWh)', key: 'electricityConsumption' }, { label: 'Gas (m³)', key: 'gasConsumption' }, { label: 'Water (m³)', key: 'waterConsumption' }, { label: 'Total Cost (RM)', key: 'totalEnergyCost' }, { label: 'Production (tonnes)', key: 'productionOutput' }, { label: 'SEC (kWh/tonne)', key: 'specificEnergyConsumption' }] },
      { title: 'Performance', fields: [{ label: 'Target vs Actual', key: 'targetVsActual', fullWidth: true }, { label: 'Improvements', key: 'improvements', fullWidth: true }] },
    ],
  },
  'ei-ast-001': {
    title: 'E&I Asset Register',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'assetTag', header: 'Asset Tag', width: '120px', sortable: true },
      { key: 'assetName', header: 'Asset Name', sortable: true },
      { key: 'assetType', header: 'Type', width: '150px', sortable: true },
      { key: 'location', header: 'Location', width: '140px', sortable: true },
      { key: 'criticality', header: 'Criticality', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Asset Details', fields: [{ label: 'Asset Tag', key: 'assetTag' }, { label: 'Asset Type', key: 'assetType' }, { label: 'Manufacturer', key: 'manufacturer' }, { label: 'Model', key: 'modelNumber' }, { label: 'Serial No', key: 'serialNumber' }, { label: 'Location', key: 'location' }, { label: 'Installation Date', key: 'installationDate' }, { label: 'Criticality', key: 'criticality' }, { label: 'PM Frequency', key: 'pmFrequency' }] },
    ],
  },
  'ei-ast-002': {
    title: 'Equipment Failure Report',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'failureDate', header: 'Date', width: '100px', sortable: true },
      { key: 'assetTag', header: 'Asset Tag', width: '120px', sortable: true },
      { key: 'location', header: 'Location', width: '140px', sortable: true },
      { key: 'failureMode', header: 'Failure Mode', width: '150px', sortable: true },
      { key: 'productionImpact', header: 'Impact', width: '150px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Failure Details', fields: [{ label: 'Date', key: 'failureDate' }, { label: 'Time', key: 'failureTime' }, { label: 'Reported By', key: 'reportedBy' }, { label: 'Asset Tag', key: 'assetTag' }, { label: 'Location', key: 'location' }, { label: 'Failure Mode', key: 'failureMode' }, { label: 'Impact', key: 'productionImpact' }, { label: 'Downtime (hrs)', key: 'downtime' }] },
      { title: 'Analysis', fields: [{ label: 'Description', key: 'failureDescription', fullWidth: true }, { label: 'Immediate Action', key: 'immediateAction', fullWidth: true }, { label: 'Root Cause', key: 'rootCause', fullWidth: true }, { label: 'Preventive Action', key: 'preventiveAction', fullWidth: true }] },
    ],
  },
  'ei-gen-001': {
    title: 'Generator Running Log',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'logDate', header: 'Date', width: '100px', sortable: true },
      { key: 'shift', header: 'Shift', width: '130px', sortable: true },
      { key: 'generatorTag', header: 'Generator', width: '120px', sortable: true },
      { key: 'fuelConsumed', header: 'Fuel (L)', width: '100px', sortable: true },
      { key: 'outputKWH', header: 'Output (kWh)', width: '120px', sortable: true },
      { key: 'status', header: 'Status', width: '100px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Running Log', fields: [{ label: 'Date', key: 'logDate' }, { label: 'Shift', key: 'shift' }, { label: 'Operator', key: 'operatorName' }, { label: 'Generator Tag', key: 'generatorTag' }, { label: 'Hours Start', key: 'runningHoursStart' }, { label: 'Hours End', key: 'runningHoursEnd' }, { label: 'Fuel Start (%)', key: 'fuelLevelStart' }, { label: 'Fuel End (%)', key: 'fuelLevelEnd' }, { label: 'Fuel Consumed (L)', key: 'fuelConsumed' }, { label: 'Load (%)', key: 'loadPercentage' }, { label: 'Output (kWh)', key: 'outputKWH' }] },
    ],
  },
  'ei-gen-002': {
    title: 'Generator PM Checklist',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'pmDate', header: 'Date', width: '100px', sortable: true },
      { key: 'generatorTag', header: 'Generator', width: '120px', sortable: true },
      { key: 'pmType', header: 'PM Type', width: '160px', sortable: true },
      { key: 'overallStatus', header: 'PM Status', width: '200px', sortable: true },
    ],
    fieldGroups: [
      { title: 'PM Details', fields: [{ label: 'Date', key: 'pmDate' }, { label: 'Technician', key: 'technicianName' }, { label: 'Generator Tag', key: 'generatorTag' }, { label: 'PM Type', key: 'pmType' }, { label: 'Running Hours', key: 'runningHours' }] },
      { title: 'Checklist', fields: [{ label: 'Engine Oil', key: 'engineOil' }, { label: 'Coolant', key: 'coolant' }, { label: 'Air Filter', key: 'airFilter' }, { label: 'Battery', key: 'batteryCondition' }, { label: 'Fuel System', key: 'fuelSystem' }, { label: 'Overall Status', key: 'overallStatus' }] },
    ],
  },
  'ei-cal-001': {
    title: 'Instrument Calibration Record',
    columns: [
      { key: 'recordNumber', header: 'Record No', width: '130px', sortable: true },
      { key: 'calibrationDate', header: 'Date', width: '100px', sortable: true },
      { key: 'instrumentTag', header: 'Instrument Tag', width: '130px', sortable: true },
      { key: 'instrumentType', header: 'Type', width: '160px', sortable: true },
      { key: 'calibrationResult', header: 'Result', width: '150px', sortable: true },
      { key: 'nextCalibrationDate', header: 'Next Due', width: '110px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Calibration Details', fields: [{ label: 'Date', key: 'calibrationDate' }, { label: 'Calibrated By', key: 'calibratedBy' }, { label: 'Instrument Tag', key: 'instrumentTag' }, { label: 'Type', key: 'instrumentType' }, { label: 'Location', key: 'location' }, { label: 'Range', key: 'range' }, { label: 'Accuracy', key: 'accuracy' }, { label: 'As-Found Error', key: 'asFoundError' }, { label: 'As-Left Error', key: 'asLeftError' }, { label: 'Result', key: 'calibrationResult' }, { label: 'Next Due', key: 'nextCalibrationDate' }, { label: 'Certificate No.', key: 'certificateReference' }] },
    ],
  },
  'ei-cal-002': {
    title: 'Calibration Due Register',
    columns: [
      { key: 'instrumentTag', header: 'Instrument Tag', width: '130px', sortable: true },
      { key: 'instrumentDescription', header: 'Description', sortable: true },
      { key: 'location', header: 'Location', width: '140px', sortable: true },
      { key: 'calibrationFrequency', header: 'Frequency', width: '120px', sortable: true },
      { key: 'nextCalibrationDate', header: 'Next Due', width: '110px', sortable: true },
      { key: 'status', header: 'Status', width: '150px', sortable: true },
    ],
    fieldGroups: [
      { title: 'Calibration Schedule', fields: [{ label: 'Instrument Tag', key: 'instrumentTag' }, { label: 'Description', key: 'instrumentDescription' }, { label: 'Location', key: 'location' }, { label: 'Frequency', key: 'calibrationFrequency' }, { label: 'Last Calibration', key: 'lastCalibrationDate' }, { label: 'Next Due', key: 'nextCalibrationDate' }, { label: 'Technician', key: 'responsibleTechnician' }, { label: 'Status', key: 'status' }] },
    ],
  },
};

const generateSampleData = (formCode: string): DataRecord[] => {
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Completed'];
  return Array.from({ length: 15 }, (_: unknown, i: number) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    dateSubmitted: format(new Date(Date.now() - i * 86400000 * 2), 'dd/MM/yyyy'),
    submittedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    submittedByEmail: ['ahmad@ioi.com', 'siti@ioi.com', 'tan@ioi.com', 'kumar@ioi.com'][i % 4],
    status: statuses[i % 4],
    inspectionDate: format(new Date(Date.now() - i * 86400000 * 2), 'dd/MM/yyyy'),
    inspector: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan'][i % 4],
    area: ['Utilities Building', 'Production Plant A', 'Substation 1', 'Generator Room'][i % 4],
    equipmentId: `EQ-${String(1000 + i).padStart(4, '0')}`,
    equipmentDescription: ['Motor MV-101', 'Transformer TX-201', 'MCC Panel A', 'Control Valve CV-301'][i % 4],
    inspectionType: ['Routine Daily', 'Weekly', 'Monthly', 'Annual'][i % 4],
    overallCondition: ['Good', 'Satisfactory', 'Requires Attention'][i % 3],
    findings: 'Minor surface rust on cable tray. No immediate risk.',
    actionTaken: 'Area marked for scheduled maintenance.',
    followUpRequired: ['No', 'Yes — Scheduled Maintenance'][i % 2],
    targetDate: format(new Date(Date.now() + 30 * 86400000), 'dd/MM/yyyy'),
    testDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    testedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    loopTag: `FIC-${String(100 + i).padStart(3, '0')}`,
    loopDescription: ['Flow Control Loop', 'Temperature Control Loop', 'Pressure Control Loop'][i % 3],
    instrumentRange: '0–100 bar',
    asFoundReading: `${49 + (i % 3)} bar`,
    asLeftReading: '50 bar',
    testResult: ['Pass', 'Fail — Adjusted', 'Conditional Pass — Minor Deviation'][i % 3],
    equipmentType: ['Motor', 'Transformer', 'Switchboard / MCC', 'Cable System'][i % 4],
    voltageRating: ['415V', '11kV', '33kV'][i % 3],
    testVoltage: [500, 1000, 5000][i % 3],
    phase1ToEarth: String(100 + i * 50),
    phase2ToEarth: String(120 + i * 40),
    phase3ToEarth: String(90 + i * 60),
    minimumAcceptable: '100',
    readingDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    readingTime: ['08:00', '14:00', '20:00'][i % 3],
    recordedBy: ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming'][i % 3],
    meterTag: `MTR-${String(100 + i).padStart(3, '0')}`,
    meterLocation: ['Utilities Building', 'Production Plant A', 'Production Plant B'][i % 3],
    meterType: 'Electricity (kWh)',
    previousReading: String(50000 + i * 1000),
    currentReading: String(50000 + (i + 1) * 1000),
    consumption: '1000',
    unit: 'kWh',
    reportDate: format(new Date(Date.now() - i * 86400000 * 3), 'dd/MM/yyyy'),
    reportedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    anomalyType: ['Unexplained Spike', 'Significant Drop', 'Billing Discrepancy'][i % 3],
    expectedValue: '1000 kWh',
    actualValue: `${1800 + i * 100} kWh`,
    description: 'Energy consumption 80% above baseline during weekend.',
    possibleCause: 'Possible air conditioning left running over weekend.',
    actionTaken2: 'HVAC schedule reviewed and corrected.',
    month: ['January', 'February', 'March', 'April', 'May', 'June'][i % 6],
    year: '2026',
    preparedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    electricityConsumption: String(250000 + i * 5000),
    gasConsumption: String(15000 + i * 500),
    waterConsumption: String(8000 + i * 200),
    totalEnergyCost: `RM ${(180000 + i * 3000).toLocaleString()}`,
    productionOutput: String(5000 + i * 100),
    specificEnergyConsumption: '50',
    targetVsActual: 'Achieved 98% of monthly target. Electricity 2% above budget.',
    improvements: 'Compressed air pressure optimisation implemented.',
    assetTag: `EI-${String(1000 + i).padStart(4, '0')}`,
    assetName: ['Motor Drive MV-101', 'Pressure Transmitter PT-205', 'Flow Meter FT-301'][i % 3],
    assetType: ['Motor', 'Pressure Transmitter', 'Flow Meter', 'Control Valve Positioner'][i % 4],
    manufacturer: ['ABB', 'Siemens', 'Endress+Hauser', 'Yokogawa'][i % 4],
    modelNumber: `MODEL-${1000 + i}`,
    serialNumber: `SN-${Date.now() + i}`,
    location: ['Utilities Building', 'Production Plant A', 'Substation 1'][i % 3],
    installationDate: format(new Date(2020, i % 12, (i % 28) + 1), 'dd/MM/yyyy'),
    criticality: ['Critical — No Standby', 'Critical — With Standby', 'Important', 'Non-Critical'][i % 4],
    pmFrequency: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'][i % 4],
    failureDate: format(new Date(Date.now() - i * 86400000 * 5), 'dd/MM/yyyy'),
    failureTime: ['09:30', '14:15', '22:00'][i % 3],
    failureMode: ['Electrical Fault', 'Mechanical Fault', 'Instrument Drift', 'Wear & Tear'][i % 4],
    productionImpact: ['No Impact', 'Minor — Reduced Capacity', 'Moderate — Partial Shutdown'][i % 3],
    downtime: String(i % 8),
    failureDescription: 'Motor tripped on overload during startup sequence.',
    immediateAction: 'Isolated equipment and notified maintenance team.',
    rootCause: 'Overload relay setting too low for ambient temperature.',
    logDate: format(new Date(Date.now() - i * 86400000), 'dd/MM/yyyy'),
    shift: ['Day Shift (06:00–18:00)', 'Night Shift (18:00–06:00)'][i % 2],
    operatorName: ['Ahmad Razak', 'Tan Wei Ming'][i % 2],
    generatorTag: `GEN-${String(i % 3 + 1).padStart(2, '0')}`,
    runningHoursStart: String(5000 + i * 24),
    runningHoursEnd: String(5000 + (i + 1) * 24),
    fuelLevelStart: String(85 - i * 3),
    fuelLevelEnd: String(70 - i * 3),
    fuelConsumed: '450',
    loadPercentage: String(65 + i % 20),
    outputKWH: '2400',
    pmDate: format(new Date(Date.now() - i * 86400000 * 14), 'dd/MM/yyyy'),
    technicianName: ['Ahmad Razak', 'Tan Wei Ming'][i % 2],
    pmType: ['250-Hour Service', '500-Hour Service', 'Monthly Inspection'][i % 3],
    runningHours: String(5000 + i * 24),
    engineOil: ['OK', 'Topped Up', 'Changed'][i % 3],
    coolant: ['OK', 'Topped Up'][i % 2],
    airFilter: ['OK', 'Cleaned', 'Replaced'][i % 3],
    batteryCondition: ['OK', 'Charged'][i % 2],
    fuelSystem: 'OK',
    overallStatus: ['Completed — Satisfactory', 'Completed — Requires Follow-up'][i % 2],
    calibrationDate: format(new Date(Date.now() - i * 86400000 * 30), 'dd/MM/yyyy'),
    calibratedBy: ['Ahmad Razak', 'Siti Nurhaliza'][i % 2],
    instrumentTag: `PT-${String(100 + i).padStart(3, '0')}`,
    instrumentDescription: ['Pressure Transmitter', 'Temperature Transmitter', 'Flow Meter'][i % 3],
    instrumentType: ['Pressure Transmitter', 'Temperature Transmitter', 'Flow Meter'][i % 3],
    range: '0–10 bar',
    accuracy: '±0.5%',
    asFoundError: '±0.3%',
    asLeftError: '±0.1%',
    calibrationResult: ['Pass', 'Fail — Adjusted'][i % 2],
    nextCalibrationDate: format(new Date(Date.now() + 365 * 86400000), 'dd/MM/yyyy'),
    certificateReference: `CAL-2026-${String(i + 1).padStart(3, '0')}`,
    calibrationFrequency: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'][i % 4],
    lastCalibrationDate: format(new Date(Date.now() - (90 + i * 10) * 86400000), 'dd/MM/yyyy'),
    responsibleTechnician: ['Ahmad Razak', 'Tan Wei Ming'][i % 2],
  }));
};

export default function EIFormDatabaseView() {
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
        <Button onClick={() => navigate('/ei/forms')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to E&I Forms
        </Button>
      </div>
    );
  }

  const approvalHistory: ApprovalHistoryItem[] = selectedRecord ? [
    { step: 'Submitted', status: 'completed', actor: String(selectedRecord.submittedBy || ''), date: String(selectedRecord.dateSubmitted || '') },
    {
      step: 'E&I Supervisor Review',
      status: selectedRecord.status === 'Draft' ? 'pending' : selectedRecord.status === 'Pending Approval' ? 'current' : 'completed',
      actor: 'E&I Supervisor',
      date: selectedRecord.status !== 'Draft' ? String(selectedRecord.dateSubmitted || '') : undefined,
    },
    {
      step: 'E&I Manager Approval',
      status: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'completed' : 'pending',
      actor: selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed' ? 'E&I Manager' : 'Pending',
    },
  ] : [];

  const filterLabel = filter === 'my-submissions' ? ' — My Submissions' : filter === 'my-pending-tasks' ? ' — My Pending Tasks' : '';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ei/forms')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{config.title}{filterLabel}</h1>
            <p className="text-muted-foreground">Database View — {filteredData.length} records</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/ei/forms/${formCode}/new`)}>
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
          recordNumber={String(selectedRecord.recordNumber || selectedRecord.instrumentTag || selectedRecord.id)}
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
