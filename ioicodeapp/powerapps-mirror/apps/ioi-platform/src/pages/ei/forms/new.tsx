import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Send, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'number';

interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  hint?: string;
}

interface SectionDef {
  title: string;
  fields: FieldDef[];
}

interface FormConfig {
  title: string;
  description: string;
  module: string;
  sections: SectionDef[];
}

const AREAS = ['Utilities Building', 'Production Plant A', 'Production Plant B', 'Substation 1', 'Substation 2', 'Generator Room', 'Control Room', 'Pump House', 'Cooling Tower', 'Warehouse'];

const FORM_CONFIGS: Record<string, FormConfig> = {
  'ei-ins-001': {
    title: 'E&I Inspection Report',
    description: 'Routine inspection of electrical and instrumentation equipment.',
    module: 'Inspection & Testing',
    sections: [
      {
        title: 'Inspection Details',
        fields: [
          { name: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
          { name: 'inspector', label: 'Inspector Name', type: 'text', required: true },
          { name: 'area', label: 'Area / Location', type: 'select', required: true, options: AREAS },
          { name: 'equipmentId', label: 'Equipment Tag / ID', type: 'text', required: true },
          { name: 'equipmentDescription', label: 'Equipment Description', type: 'text', required: true },
          { name: 'inspectionType', label: 'Inspection Type', type: 'select', required: true, options: ['Routine Daily', 'Weekly', 'Monthly', 'Annual', 'Post-Maintenance', 'Incident Follow-up'] },
        ],
      },
      {
        title: 'Inspection Findings',
        fields: [
          { name: 'overallCondition', label: 'Overall Condition', type: 'select', required: true, options: ['Good', 'Satisfactory', 'Requires Attention', 'Critical — Immediate Action Required'] },
          { name: 'findings', label: 'Findings / Observations', type: 'textarea', required: true, hint: 'Describe any abnormalities, wear, or defects observed' },
          { name: 'actionTaken', label: 'Immediate Action Taken', type: 'textarea', hint: 'Any corrective action taken on-site during the inspection' },
          { name: 'followUpRequired', label: 'Follow-up Required?', type: 'select', required: true, options: ['No', 'Yes — Scheduled Maintenance', 'Yes — Urgent Repair', 'Yes — Replacement Required'] },
          { name: 'targetDate', label: 'Follow-up Target Date', type: 'date' },
        ],
      },
    ],
  },
  'ei-ins-002': {
    title: 'Loop Test Record',
    description: 'Control loop function testing and verification.',
    module: 'Inspection & Testing',
    sections: [
      {
        title: 'Loop Information',
        fields: [
          { name: 'testDate', label: 'Test Date', type: 'date', required: true },
          { name: 'testedBy', label: 'Tested By', type: 'text', required: true },
          { name: 'loopTag', label: 'Loop Tag Number', type: 'text', required: true, hint: 'e.g., FIC-101, TIC-205' },
          { name: 'loopDescription', label: 'Loop Description', type: 'text', required: true },
          { name: 'area', label: 'Area / Unit', type: 'select', required: true, options: AREAS },
        ],
      },
      {
        title: 'Test Results',
        fields: [
          { name: 'instrumentRange', label: 'Instrument Range', type: 'text', required: true, hint: 'e.g., 0–100 bar, 0–150°C' },
          { name: 'setpoint', label: 'Setpoint / Reference', type: 'text' },
          { name: 'asFoundReading', label: 'As-Found Reading', type: 'text', required: true },
          { name: 'asLeftReading', label: 'As-Left Reading', type: 'text', required: true },
          { name: 'testResult', label: 'Test Result', type: 'select', required: true, options: ['Pass', 'Fail', 'Conditional Pass — Minor Deviation'] },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-ins-003': {
    title: 'Insulation Resistance Test',
    description: 'Megger / IR testing record for electrical equipment.',
    module: 'Inspection & Testing',
    sections: [
      {
        title: 'Equipment Details',
        fields: [
          { name: 'testDate', label: 'Test Date', type: 'date', required: true },
          { name: 'testedBy', label: 'Tested By', type: 'text', required: true },
          { name: 'equipmentId', label: 'Equipment Tag / ID', type: 'text', required: true },
          { name: 'equipmentType', label: 'Equipment Type', type: 'select', required: true, options: ['Motor', 'Transformer', 'Switchboard', 'Cable', 'MCC', 'Generator', 'Panel'] },
          { name: 'voltageRating', label: 'Voltage Rating (kV)', type: 'text', required: true },
          { name: 'testVoltage', label: 'Test Voltage Applied (V)', type: 'number', required: true },
        ],
      },
      {
        title: 'Measurement Results',
        fields: [
          { name: 'phase1ToEarth', label: 'Phase 1 to Earth (MΩ)', type: 'number', required: true },
          { name: 'phase2ToEarth', label: 'Phase 2 to Earth (MΩ)', type: 'number', required: true },
          { name: 'phase3ToEarth', label: 'Phase 3 to Earth (MΩ)', type: 'number', required: true },
          { name: 'phase1To2', label: 'Phase 1 to Phase 2 (MΩ)', type: 'number' },
          { name: 'phase2To3', label: 'Phase 2 to Phase 3 (MΩ)', type: 'number' },
          { name: 'minimumAcceptable', label: 'Minimum Acceptable Value (MΩ)', type: 'number', required: true },
          { name: 'testResult', label: 'Test Result', type: 'select', required: true, options: ['Pass', 'Fail', 'Borderline — Monitor Closely'] },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-enm-001': {
    title: 'Energy Meter Reading',
    description: 'Daily / weekly energy meter readings per utility point.',
    module: 'Energy Monitoring',
    sections: [
      {
        title: 'Reading Details',
        fields: [
          { name: 'readingDate', label: 'Reading Date', type: 'date', required: true },
          { name: 'readingTime', label: 'Reading Time', type: 'text', required: true, hint: 'e.g., 08:00' },
          { name: 'recordedBy', label: 'Recorded By', type: 'text', required: true },
          { name: 'meterTag', label: 'Meter Tag / ID', type: 'text', required: true },
          { name: 'meterLocation', label: 'Meter Location', type: 'select', required: true, options: AREAS },
          { name: 'meterType', label: 'Meter Type', type: 'select', required: true, options: ['Electricity (kWh)', 'Gas (m³)', 'Water (m³)', 'Steam (tonnes)', 'Compressed Air (m³)'] },
        ],
      },
      {
        title: 'Consumption Data',
        fields: [
          { name: 'previousReading', label: 'Previous Reading', type: 'number', required: true },
          { name: 'currentReading', label: 'Current Reading', type: 'number', required: true },
          { name: 'consumption', label: 'Consumption (Current − Previous)', type: 'number', required: true },
          { name: 'unit', label: 'Unit', type: 'select', required: true, options: ['kWh', 'm³', 'tonnes', 'litres'] },
          { name: 'remarks', label: 'Remarks / Anomaly Notes', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-enm-002': {
    title: 'Energy Anomaly Report',
    description: 'Report unexpected energy consumption anomalies.',
    module: 'Energy Monitoring',
    sections: [
      {
        title: 'Anomaly Details',
        fields: [
          { name: 'reportDate', label: 'Report Date', type: 'date', required: true },
          { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
          { name: 'area', label: 'Area / Meter Location', type: 'select', required: true, options: AREAS },
          { name: 'anomalyType', label: 'Anomaly Type', type: 'select', required: true, options: ['Unexplained Spike', 'Significant Drop', 'Meter Malfunction', 'Leakage Suspected', 'Billing Discrepancy'] },
          { name: 'anomalyDate', label: 'Date Anomaly Occurred', type: 'date', required: true },
        ],
      },
      {
        title: 'Description & Action',
        fields: [
          { name: 'expectedValue', label: 'Expected Consumption', type: 'text', required: true },
          { name: 'actualValue', label: 'Actual Consumption Recorded', type: 'text', required: true },
          { name: 'description', label: 'Description of Anomaly', type: 'textarea', required: true },
          { name: 'possibleCause', label: 'Probable Cause', type: 'textarea', hint: 'Equipment fault, operational change, metering error, etc.' },
          { name: 'actionTaken', label: 'Action Taken / Recommended', type: 'textarea', required: true },
          { name: 'targetDate', label: 'Resolution Target Date', type: 'date' },
        ],
      },
    ],
  },
  'ei-enm-003': {
    title: 'ENMS Monthly Summary',
    description: 'Energy Management System monthly performance summary (ISO 50001).',
    module: 'Energy Monitoring',
    sections: [
      {
        title: 'Reporting Period',
        fields: [
          { name: 'month', label: 'Month', type: 'select', required: true, options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
          { name: 'year', label: 'Year', type: 'select', required: true, options: ['2024', '2025', '2026', '2027'] },
          { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
        ],
      },
      {
        title: 'Energy Consumption Data',
        fields: [
          { name: 'electricityConsumption', label: 'Electricity Consumption (kWh)', type: 'number', required: true },
          { name: 'gasConsumption', label: 'Natural Gas Consumption (m³)', type: 'number' },
          { name: 'waterConsumption', label: 'Water Consumption (m³)', type: 'number' },
          { name: 'totalEnergyCost', label: 'Total Energy Cost (RM)', type: 'number', required: true },
          { name: 'productionOutput', label: 'Production Output (tonnes)', type: 'number', hint: 'Used for energy intensity calculation' },
          { name: 'specificEnergyConsumption', label: 'Specific Energy Consumption (kWh/tonne)', type: 'number' },
        ],
      },
      {
        title: 'Performance & Actions',
        fields: [
          { name: 'targetVsActual', label: 'Target vs Actual Performance', type: 'textarea', required: true },
          { name: 'significantEnergyUses', label: 'Significant Energy Uses (SEUs)', type: 'textarea', hint: 'List areas with highest energy consumption this month' },
          { name: 'improvements', label: 'Energy Improvement Actions Taken', type: 'textarea' },
          { name: 'nextMonthActions', label: 'Planned Actions for Next Month', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-ast-001': {
    title: 'E&I Asset Register',
    description: 'Register new or updated E&I assets in the plant asset list.',
    module: 'Asset Management',
    sections: [
      {
        title: 'Asset Information',
        fields: [
          { name: 'assetTag', label: 'Asset Tag / ID', type: 'text', required: true },
          { name: 'assetName', label: 'Asset Name / Description', type: 'text', required: true },
          { name: 'assetType', label: 'Asset Type', type: 'select', required: true, options: ['Motor', 'Transformer', 'Switchboard / MCC', 'Transmitter', 'Control Valve', 'Analyser', 'UPS', 'PLC / DCS', 'Generator', 'Cable System'] },
          { name: 'manufacturer', label: 'Manufacturer', type: 'text', required: true },
          { name: 'modelNumber', label: 'Model / Part Number', type: 'text' },
          { name: 'serialNumber', label: 'Serial Number', type: 'text' },
        ],
      },
      {
        title: 'Location & Technical Details',
        fields: [
          { name: 'location', label: 'Installation Location', type: 'select', required: true, options: AREAS },
          { name: 'installationDate', label: 'Installation Date', type: 'date', required: true },
          { name: 'voltage', label: 'Voltage Rating', type: 'text', hint: 'e.g., 415V, 11kV' },
          { name: 'powerRating', label: 'Power Rating (kW)', type: 'number' },
          { name: 'criticality', label: 'Asset Criticality', type: 'select', required: true, options: ['Critical — No Standby', 'Critical — With Standby', 'Important', 'Non-Critical'] },
          { name: 'warrantyExpiry', label: 'Warranty Expiry Date', type: 'date' },
          { name: 'pmFrequency', label: 'PM Frequency', type: 'select', required: true, options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual'] },
          { name: 'registeredBy', label: 'Registered By', type: 'text', required: true },
        ],
      },
    ],
  },
  'ei-ast-002': {
    title: 'Equipment Failure Report',
    description: 'Report failure or fault of an E&I asset.',
    module: 'Asset Management',
    sections: [
      {
        title: 'Failure Details',
        fields: [
          { name: 'failureDate', label: 'Failure Date', type: 'date', required: true },
          { name: 'failureTime', label: 'Failure Time', type: 'text', required: true, hint: 'e.g., 14:35' },
          { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
          { name: 'assetTag', label: 'Asset Tag / ID', type: 'text', required: true },
          { name: 'assetDescription', label: 'Asset Description', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'select', required: true, options: AREAS },
        ],
      },
      {
        title: 'Impact & Root Cause',
        fields: [
          { name: 'failureMode', label: 'Failure Mode', type: 'select', required: true, options: ['Electrical Fault', 'Mechanical Fault', 'Instrument Drift', 'Communication Failure', 'Power Surge', 'Wear & Tear', 'External Damage', 'Unknown'] },
          { name: 'productionImpact', label: 'Production Impact', type: 'select', required: true, options: ['No Impact', 'Minor — Reduced Capacity', 'Moderate — Partial Shutdown', 'Critical — Full Shutdown'] },
          { name: 'downtime', label: 'Estimated Downtime (hours)', type: 'number' },
          { name: 'failureDescription', label: 'Failure Description', type: 'textarea', required: true },
          { name: 'immediateAction', label: 'Immediate Action Taken', type: 'textarea', required: true },
          { name: 'rootCause', label: 'Root Cause (if known)', type: 'textarea' },
          { name: 'preventiveAction', label: 'Preventive Action Recommended', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-gen-001': {
    title: 'Generator Running Log',
    description: 'Daily generator operation and fuel consumption log.',
    module: 'Generator & Utilities',
    sections: [
      {
        title: 'Running Log Entry',
        fields: [
          { name: 'logDate', label: 'Log Date', type: 'date', required: true },
          { name: 'shift', label: 'Shift', type: 'select', required: true, options: ['Day Shift (06:00–18:00)', 'Night Shift (18:00–06:00)', 'Full Day'] },
          { name: 'operatorName', label: 'Operator Name', type: 'text', required: true },
          { name: 'generatorTag', label: 'Generator Tag / ID', type: 'text', required: true },
          { name: 'runningHoursStart', label: 'Running Hours at Start', type: 'number', required: true },
          { name: 'runningHoursEnd', label: 'Running Hours at End', type: 'number', required: true },
        ],
      },
      {
        title: 'Fuel & Load Data',
        fields: [
          { name: 'fuelLevelStart', label: 'Fuel Level at Start (%)', type: 'number', required: true },
          { name: 'fuelLevelEnd', label: 'Fuel Level at End (%)', type: 'number', required: true },
          { name: 'fuelConsumed', label: 'Fuel Consumed (litres)', type: 'number', required: true },
          { name: 'loadPercentage', label: 'Average Load (%)', type: 'number' },
          { name: 'outputKWH', label: 'Output (kWh)', type: 'number' },
          { name: 'remarks', label: 'Remarks / Abnormalities', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-gen-002': {
    title: 'Generator PM Checklist',
    description: 'Preventive maintenance checklist for standby generators.',
    module: 'Generator & Utilities',
    sections: [
      {
        title: 'PM Details',
        fields: [
          { name: 'pmDate', label: 'PM Date', type: 'date', required: true },
          { name: 'technicianName', label: 'Technician Name', type: 'text', required: true },
          { name: 'generatorTag', label: 'Generator Tag / ID', type: 'text', required: true },
          { name: 'pmType', label: 'PM Type', type: 'select', required: true, options: ['250-Hour Service', '500-Hour Service', '1000-Hour Service', 'Annual Overhaul', 'Monthly Inspection'] },
          { name: 'runningHours', label: 'Current Running Hours', type: 'number', required: true },
        ],
      },
      {
        title: 'Checklist Results',
        fields: [
          { name: 'engineOil', label: 'Engine Oil Level / Condition', type: 'select', required: true, options: ['OK', 'Topped Up', 'Changed', 'N/A'] },
          { name: 'coolant', label: 'Coolant Level', type: 'select', required: true, options: ['OK', 'Topped Up', 'Replaced', 'N/A'] },
          { name: 'airFilter', label: 'Air Filter', type: 'select', required: true, options: ['OK', 'Cleaned', 'Replaced', 'N/A'] },
          { name: 'batteryCondition', label: 'Battery Condition', type: 'select', required: true, options: ['OK', 'Charged', 'Replaced', 'N/A'] },
          { name: 'fuelSystem', label: 'Fuel System Check', type: 'select', required: true, options: ['OK', 'Leak Found & Repaired', 'Requires Follow-up'] },
          { name: 'overallStatus', label: 'Overall PM Status', type: 'select', required: true, options: ['Completed — Satisfactory', 'Completed — Requires Follow-up', 'Incomplete — Parts Pending'] },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-cal-001': {
    title: 'Instrument Calibration Record',
    description: 'Calibration certificate and result for process instruments.',
    module: 'Calibration',
    sections: [
      {
        title: 'Instrument Details',
        fields: [
          { name: 'calibrationDate', label: 'Calibration Date', type: 'date', required: true },
          { name: 'calibratedBy', label: 'Calibrated By', type: 'text', required: true },
          { name: 'instrumentTag', label: 'Instrument Tag', type: 'text', required: true, hint: 'e.g., PT-101, TT-205, FT-301' },
          { name: 'instrumentDescription', label: 'Instrument Description', type: 'text', required: true },
          { name: 'instrumentType', label: 'Instrument Type', type: 'select', required: true, options: ['Pressure Transmitter', 'Temperature Transmitter', 'Flow Meter', 'Level Transmitter', 'Analyser', 'Control Valve Positioner', 'Thermocouple / RTD'] },
          { name: 'location', label: 'Location', type: 'select', required: true, options: AREAS },
        ],
      },
      {
        title: 'Calibration Data',
        fields: [
          { name: 'range', label: 'Measurement Range', type: 'text', required: true, hint: 'e.g., 0–10 bar, 0–300°C' },
          { name: 'accuracy', label: 'Required Accuracy (±)', type: 'text', required: true, hint: 'e.g., ±0.5%, ±1°C' },
          { name: 'asFoundError', label: 'As-Found Error', type: 'text', required: true },
          { name: 'asLeftError', label: 'As-Left Error', type: 'text', required: true },
          { name: 'calibrationResult', label: 'Calibration Result', type: 'select', required: true, options: ['Pass', 'Fail — Adjusted', 'Fail — Out of Service'] },
          { name: 'nextCalibrationDate', label: 'Next Calibration Due Date', type: 'date', required: true },
          { name: 'certificateReference', label: 'Calibration Certificate No.', type: 'text' },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  'ei-cal-002': {
    title: 'Calibration Due Register',
    description: 'Track upcoming instrument calibration schedules.',
    module: 'Calibration',
    sections: [
      {
        title: 'Instrument Entry',
        fields: [
          { name: 'instrumentTag', label: 'Instrument Tag', type: 'text', required: true },
          { name: 'instrumentDescription', label: 'Description', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'select', required: true, options: AREAS },
          { name: 'calibrationFrequency', label: 'Calibration Frequency', type: 'select', required: true, options: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', '2-Yearly', 'Other'] },
          { name: 'lastCalibrationDate', label: 'Last Calibration Date', type: 'date', required: true },
          { name: 'nextCalibrationDate', label: 'Next Calibration Due Date', type: 'date', required: true },
          { name: 'responsibleTechnician', label: 'Responsible Technician', type: 'text', required: true },
          { name: 'status', label: 'Status', type: 'select', required: true, options: ['Up to Date', 'Due Within 30 Days', 'Overdue', 'Out of Service'] },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

export default function EIFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = formCode?.toLowerCase() ?? '';
  const config = FORM_CONFIGS[key] ?? {
    title: 'E&I Form',
    description: 'Complete all required fields below.',
    module: 'E&I',
    sections: [{ title: 'Details', fields: [{ name: 'description', label: 'Description', type: 'textarea' as FieldType, required: true }] }],
  };

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      inspector: user.fullName || '',
      testedBy: user.fullName || '',
      recordedBy: user.fullName || '',
      reportedBy: user.fullName || '',
      preparedBy: user.fullName || '',
      registeredBy: user.fullName || '',
      operatorName: user.fullName || '',
      technicianName: user.fullName || '',
      calibratedBy: user.fullName || '',
      responsibleTechnician: user.fullName || '',
      ...prev,
    }));
  }, [user]);

  const handleChange = (name: string, value: string) => setFormData((prev) => ({ ...prev, [name]: value }));

  const generateId = () => {
    const code = (formCode || 'EI').toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `${code}-${date}-${rand}`;
  };

  const handleSubmit = async (isDraft: boolean) => {
    const required = config.sections.flatMap((s) => s.fields).filter((f) => f.required && !formData[f.name]);
    if (!isDraft && required.length > 0) {
      toast.warning(`Please fill in: ${required.map((f) => f.label).join(', ')}`);
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    const id = generateId();
    toast.success(isDraft ? 'Draft saved.' : `${config.title} submitted (${id})`);
    if (!isDraft) navigate('/ei/forms');
  };

  const renderField = (field: FieldDef) => (
    <div key={field.name} className="space-y-1.5">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.type === 'select' && field.options ? (
        <Select value={formData[field.name] || ''} onValueChange={(v) => handleChange(field.name, v)}>
          <SelectTrigger id={field.name} className="h-11">
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : field.type === 'textarea' ? (
        <Textarea id={field.name} value={formData[field.name] || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(field.name, e.target.value)} rows={3} className="resize-none" />
      ) : (
        <Input id={field.name} type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} value={formData[field.name] || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value)} className="h-11" />
      )}
      {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
    </div>
  );

  return (
    <motion.div className="space-y-6 p-4 md:p-6 pb-28 max-w-3xl mx-auto" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/ei/forms')} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{config.title}</h1>
            <p className="text-sm text-muted-foreground">{config.module}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 uppercase">{formCode}</Badge>
      </motion.div>

      {config.sections.map((section) => (
        <motion.div key={section.title} variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.title}</CardTitle>
              {section.fields.some((f) => f.required) && (
                <CardDescription>Fields marked <span className="text-destructive">*</span> are required</CardDescription>
              )}
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <div className="hidden md:flex gap-3 justify-end sticky bottom-6 bg-background/80 backdrop-blur p-4 -mx-6 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={() => navigate('/ei/forms')} className="h-11 px-6">Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-11 px-6">
          <Save className="h-4 w-4 mr-2" />Save Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-11 px-8">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button variant="outline" onClick={() => navigate('/ei/forms')} className="h-14 flex-1">Cancel</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-14 flex-[2] text-base">
          {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
}
