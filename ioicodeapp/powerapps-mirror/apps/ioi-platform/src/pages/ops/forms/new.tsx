import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Send, Loader2, Factory } from 'lucide-react';
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
  module: string;
  sections: SectionDef[];
}

const DEPTS = ['Production', 'Maintenance', 'QA', 'QC', 'Warehouse', 'Logistics', 'IT', 'HR', 'Finance', 'Engineering', 'Administration'];
const LINES = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Blending Unit A', 'Blending Unit B', 'Packaging Line 1', 'Packaging Line 2', 'Utility Plant'];
const SHIFTS = ['Morning (06:00–14:00)', 'Afternoon (14:00–22:00)', 'Night (22:00–06:00)', 'Day (08:00–17:00)'];
const UNITS = ['Units', 'Tonnes', 'Litres', 'kg', 'Cartons', 'Pallets', 'metres', 'boxes', 'drums'];

const FORM_CONFIGS: Record<string, FormConfig> = {
  'ops-pps': {
    title: 'Production Planning Schedule',
    module: 'Production Planning',
    sections: [
      { title: 'Schedule Period', fields: [
        { name: 'planType', label: 'Plan Type', type: 'select', required: true, options: ['Daily', 'Weekly', 'Monthly', 'Quarterly'] },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'endDate', label: 'End Date', type: 'date', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'Production Targets', fields: [
        { name: 'product', label: 'Product / SKU', type: 'text', required: true },
        { name: 'targetQuantity', label: 'Target Quantity', type: 'number', required: true },
        { name: 'targetUnit', label: 'Unit of Measure', type: 'select', required: true, options: UNITS },
        { name: 'rawMaterialRequired', label: 'Raw Material Required', type: 'textarea', hint: 'List key raw materials and quantities needed' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]},
    ],
  },
  'ops-cap': {
    title: 'Capacity Plan',
    module: 'Production Planning',
    sections: [
      { title: 'Planning Details', fields: [
        { name: 'planPeriod', label: 'Plan Period', type: 'select', required: true, options: ['Weekly', 'Monthly', 'Quarterly'] },
        { name: 'startDate', label: 'From', type: 'date', required: true },
        { name: 'endDate', label: 'To', type: 'date', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'Capacity Assessment', fields: [
        { name: 'availableHours', label: 'Available Machine Hours', type: 'number', required: true },
        { name: 'plannedHours', label: 'Planned Production Hours', type: 'number', required: true },
        { name: 'availableHeadcount', label: 'Available Headcount', type: 'number', required: true },
        { name: 'plannedHeadcount', label: 'Required Headcount', type: 'number', required: true },
        { name: 'capacityUtilisation', label: 'Expected Utilisation (%)', type: 'number' },
        { name: 'constraints', label: 'Capacity Constraints / Risks', type: 'textarea', hint: 'Machine downtime, material shortage, absenteeism' },
      ]},
    ],
  },
  'ops-res': {
    title: 'Resource Allocation Request',
    module: 'Production Planning',
    sections: [
      { title: 'Request Details', fields: [
        { name: 'requestDate', label: 'Request Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'requiredDate', label: 'Resources Required From', type: 'date', required: true },
      ]},
      { title: 'Resource Requirements', fields: [
        { name: 'resourceType', label: 'Resource Type', type: 'select', required: true, options: ['Manpower', 'Machine / Equipment', 'Material', 'All of the above'] },
        { name: 'manpowerRequired', label: 'Manpower Required (headcount)', type: 'number' },
        { name: 'machineRequired', label: 'Machine / Equipment Required', type: 'text' },
        { name: 'materialRequired', label: 'Materials Required', type: 'textarea' },
        { name: 'duration', label: 'Duration Required', type: 'select', required: true, options: ['1 shift', '1 day', '2–3 days', '1 week', 'Ongoing'] },
        { name: 'justification', label: 'Justification', type: 'textarea', required: true },
      ]},
    ],
  },
  'ops-req': {
    title: 'Stock Requisition',
    module: 'Inventory Control',
    sections: [
      { title: 'Requisition Details', fields: [
        { name: 'requisitionDate', label: 'Requisition Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
        { name: 'requiredDate', label: 'Required By Date', type: 'date', required: true },
        { name: 'urgency', label: 'Urgency', type: 'select', required: true, options: ['Normal', 'Urgent', 'Critical — Production Stoppage Risk'] },
      ]},
      { title: 'Items Requested', fields: [
        { name: 'itemCode', label: 'Item Code / SAP Material No.', type: 'text', hint: 'Leave blank if unknown' },
        { name: 'itemDescription', label: 'Item Description', type: 'text', required: true },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'additionalItems', label: 'Additional Items', type: 'textarea', hint: 'List other items: description, qty, unit' },
        { name: 'purpose', label: 'Purpose / Usage', type: 'textarea', required: true },
      ]},
    ],
  },
  'ops-adj': {
    title: 'Inventory Adjustment',
    module: 'Inventory Control',
    sections: [
      { title: 'Adjustment Details', fields: [
        { name: 'adjustmentDate', label: 'Adjustment Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'location', label: 'Stock Location', type: 'select', required: true, options: ['Warehouse A', 'Warehouse B', 'Production Store', 'Finished Goods', 'Quarantine Area'] },
        { name: 'adjustmentType', label: 'Adjustment Type', type: 'select', required: true, options: ['Stock Count Variance', 'Damage Write-Off', 'Expired / Obsolete', 'Transfer Error Correction', 'System Error'] },
      ]},
      { title: 'Item Details', fields: [
        { name: 'itemCode', label: 'Item Code', type: 'text' },
        { name: 'itemDescription', label: 'Item Description', type: 'text', required: true },
        { name: 'systemQty', label: 'System Quantity', type: 'number', required: true },
        { name: 'physicalQty', label: 'Physical Count Quantity', type: 'number', required: true },
        { name: 'varianceQty', label: 'Variance Quantity', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'reason', label: 'Reason for Variance', type: 'textarea', required: true },
        { name: 'correctiveAction', label: 'Corrective Action', type: 'textarea' },
      ]},
    ],
  },
  'ops-mt': {
    title: 'Material Transfer',
    module: 'Inventory Control',
    sections: [
      { title: 'Transfer Details', fields: [
        { name: 'transferDate', label: 'Transfer Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'fromLocation', label: 'From Location', type: 'select', required: true, options: ['Warehouse A', 'Warehouse B', 'Production Store', 'Line 1 Buffer', 'Line 2 Buffer', 'Finished Goods'] },
        { name: 'toLocation', label: 'To Location', type: 'select', required: true, options: ['Warehouse A', 'Warehouse B', 'Production Store', 'Line 1 Buffer', 'Line 2 Buffer', 'Finished Goods'] },
      ]},
      { title: 'Material Details', fields: [
        { name: 'itemCode', label: 'Item Code', type: 'text' },
        { name: 'itemDescription', label: 'Item Description', type: 'text', required: true },
        { name: 'quantity', label: 'Quantity to Transfer', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'reason', label: 'Reason for Transfer', type: 'textarea', required: true },
      ]},
    ],
  },
  'ops-wo': {
    title: 'Work Order Request',
    module: 'Work Orders',
    sections: [
      { title: 'Work Order Details', fields: [
        { name: 'requestDate', label: 'Request Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'workType', label: 'Work Type', type: 'select', required: true, options: ['Production Run', 'Re-processing', 'Rework', 'Blending', 'Packaging', 'Testing / Sampling'] },
        { name: 'priority', label: 'Priority', type: 'select', required: true, options: ['Normal', 'High', 'Urgent'] },
      ]},
      { title: 'Task Specification', fields: [
        { name: 'product', label: 'Product / Material', type: 'text', required: true },
        { name: 'targetQuantity', label: 'Target Quantity', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'plannedStart', label: 'Planned Start Date', type: 'date', required: true },
        { name: 'plannedEnd', label: 'Planned End Date', type: 'date', required: true },
        { name: 'instructions', label: 'Work Instructions / Special Requirements', type: 'textarea', required: true },
      ]},
    ],
  },
  'ops-woc': {
    title: 'Work Order Completion Report',
    module: 'Work Orders',
    sections: [
      { title: 'Work Order Reference', fields: [
        { name: 'workOrderNo', label: 'Work Order No.', type: 'text', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'completionDate', label: 'Completion Date', type: 'date', required: true },
        { name: 'completedBy', label: 'Completed By (Operator)', type: 'text', required: true },
        { name: 'supervisedBy', label: 'Supervised By', type: 'text', required: true },
      ]},
      { title: 'Output & Quality', fields: [
        { name: 'targetQuantity', label: 'Target Quantity', type: 'number', required: true },
        { name: 'actualQuantity', label: 'Actual Output Quantity', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'plannedHours', label: 'Planned Hours', type: 'number', required: true },
        { name: 'actualHours', label: 'Actual Hours Taken', type: 'number', required: true },
        { name: 'rejectedQty', label: 'Rejected / Waste Quantity', type: 'number' },
        { name: 'qualityResult', label: 'Quality Result', type: 'select', required: true, options: ['Pass — All within spec', 'Conditional Pass', 'Fail — Rework required', 'Fail — Scrap'] },
        { name: 'remarks', label: 'Remarks / Issues', type: 'textarea' },
      ]},
    ],
  },
  'ops-nco': {
    title: 'Non-Conformance / Rework Order',
    module: 'Work Orders',
    sections: [
      { title: 'Non-Conformance Details', fields: [
        { name: 'detectionDate', label: 'Detection Date', type: 'date', required: true },
        { name: 'detectedBy', label: 'Detected By', type: 'text', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'product', label: 'Product / Batch No.', type: 'text', required: true },
        { name: 'affectedQuantity', label: 'Affected Quantity', type: 'number', required: true },
        { name: 'ncType', label: 'Non-Conformance Type', type: 'select', required: true, options: ['Off-Spec Product', 'Process Deviation', 'Packaging Defect', 'Label Error', 'Foreign Matter', 'Contamination'] },
      ]},
      { title: 'Disposition & Rework', fields: [
        { name: 'ncDescription', label: 'Non-Conformance Description', type: 'textarea', required: true },
        { name: 'rootCause', label: 'Root Cause', type: 'textarea' },
        { name: 'disposition', label: 'Disposition Decision', type: 'select', required: true, options: ['Rework', 'Scrap', 'Use As-Is (concession)', 'Return to Supplier', 'Hold for QA Review'] },
        { name: 'reworkInstruction', label: 'Rework Instructions', type: 'textarea' },
        { name: 'authorisedBy', label: 'Authorised By', type: 'text', required: true },
      ]},
    ],
  },
  'ops-sss': {
    title: 'Shift Schedule Request',
    module: 'Shift Management',
    sections: [
      { title: 'Schedule Details', fields: [
        { name: 'scheduleWeek', label: 'Schedule Week Starting', type: 'date', required: true },
        { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'submittedBy', label: 'Submitted By (Supervisor)', type: 'text', required: true },
        { name: 'totalHeadcount', label: 'Total Headcount per Shift', type: 'number', required: true },
      ]},
      { title: 'Shift Assignments', fields: [
        { name: 'mondayShift', label: 'Monday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'tuesdayShift', label: 'Tuesday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'wednesdayShift', label: 'Wednesday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'thursdayShift', label: 'Thursday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'fridayShift', label: 'Friday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'saturdayShift', label: 'Saturday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'sundayShift', label: 'Sunday Shift', type: 'select', options: [...SHIFTS, 'Off'] },
        { name: 'remarks', label: 'Remarks', type: 'textarea' },
      ]},
    ],
  },
  'ops-sho': {
    title: 'Shift Handover Report',
    module: 'Shift Management',
    sections: [
      { title: 'Shift Information', fields: [
        { name: 'handoverDate', label: 'Handover Date', type: 'date', required: true },
        { name: 'shift', label: 'Outgoing Shift', type: 'select', required: true, options: SHIFTS },
        { name: 'outgoingSupervisor', label: 'Outgoing Supervisor', type: 'text', required: true },
        { name: 'incomingSupervisor', label: 'Incoming Supervisor', type: 'text', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
      ]},
      { title: 'Shift Summary', fields: [
        { name: 'targetOutput', label: 'Target Output', type: 'number', required: true },
        { name: 'actualOutput', label: 'Actual Output Achieved', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'downtimeMinutes', label: 'Total Downtime (minutes)', type: 'number' },
        { name: 'issuesEncountered', label: 'Issues / Abnormalities Encountered', type: 'textarea', required: true },
        { name: 'pendingTasks', label: 'Pending Tasks for Incoming Shift', type: 'textarea', required: true },
        { name: 'equipmentStatus', label: 'Equipment Status', type: 'select', required: true, options: ['All OK', 'Minor Issue — Monitoring', 'Fault — Maintenance Notified', 'Fault — Waiting for Parts'] },
      ]},
    ],
  },
  'ops-ot': {
    title: 'Overtime Request',
    module: 'Shift Management',
    sections: [
      { title: 'Request Details', fields: [
        { name: 'requestDate', label: 'Request Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By (Supervisor)', type: 'text', required: true },
        { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
        { name: 'overtimeDate', label: 'Overtime Date', type: 'date', required: true },
        { name: 'overtimeType', label: 'Overtime Type', type: 'select', required: true, options: ['Weekday OT', 'Weekend OT', 'Public Holiday OT', 'Shift Extension'] },
      ]},
      { title: 'Overtime Details', fields: [
        { name: 'startTime', label: 'Start Time', type: 'text', required: true, hint: 'e.g., 18:00' },
        { name: 'endTime', label: 'End Time', type: 'text', required: true, hint: 'e.g., 22:00' },
        { name: 'headcount', label: 'Number of Employees', type: 'number', required: true },
        { name: 'employeeNames', label: 'Employee Names', type: 'textarea', required: true },
        { name: 'reason', label: 'Reason for Overtime', type: 'textarea', required: true },
        { name: 'estimatedCost', label: 'Estimated OT Cost (RM)', type: 'number' },
      ]},
    ],
  },
  'ops-oee': {
    title: 'OEE Report',
    module: 'Performance Monitoring',
    sections: [
      { title: 'Reporting Period', fields: [
        { name: 'reportDate', label: 'Report Date', type: 'date', required: true },
        { name: 'shift', label: 'Shift', type: 'select', required: true, options: SHIFTS },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'product', label: 'Product Run', type: 'text', required: true },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'OEE Components', fields: [
        { name: 'plannedProductionTime', label: 'Planned Production Time (min)', type: 'number', required: true },
        { name: 'unplannedDowntime', label: 'Unplanned Downtime (min)', type: 'number', required: true },
        { name: 'availability', label: 'Availability (%)', type: 'number', required: true },
        { name: 'actualOutput', label: 'Actual Output', type: 'number', required: true },
        { name: 'performance', label: 'Performance (%)', type: 'number', required: true },
        { name: 'goodUnits', label: 'Good Units Produced', type: 'number', required: true },
        { name: 'quality', label: 'Quality (%)', type: 'number', required: true },
        { name: 'oeeTotal', label: 'OEE Total (%)', type: 'number', required: true },
        { name: 'remarks', label: 'Key Losses / Remarks', type: 'textarea' },
      ]},
    ],
  },
  'ops-dt': {
    title: 'Downtime Report',
    module: 'Performance Monitoring',
    sections: [
      { title: 'Downtime Event', fields: [
        { name: 'downtimeDate', label: 'Date', type: 'date', required: true },
        { name: 'startTime', label: 'Start Time', type: 'text', required: true, hint: 'e.g., 14:30' },
        { name: 'endTime', label: 'End Time', type: 'text', required: true },
        { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'equipmentId', label: 'Equipment / Machine ID', type: 'text', required: true },
        { name: 'reportedBy', label: 'Reported By', type: 'text', required: true },
      ]},
      { title: 'Root Cause & Action', fields: [
        { name: 'downtimeCategory', label: 'Downtime Category', type: 'select', required: true, options: ['Mechanical Failure', 'Electrical Failure', 'Process Upset', 'Material Issue', 'Changeover / Setup', 'Operator Error', 'External Factor'] },
        { name: 'productionLoss', label: 'Production Lost (units)', type: 'number' },
        { name: 'description', label: 'Downtime Description', type: 'textarea', required: true },
        { name: 'rootCause', label: 'Root Cause', type: 'textarea', required: true },
        { name: 'actionTaken', label: 'Action Taken to Restore', type: 'textarea', required: true },
        { name: 'preventiveAction', label: 'Preventive Action', type: 'textarea' },
      ]},
    ],
  },
  'ops-ppr': {
    title: 'Production Performance Report',
    module: 'Performance Monitoring',
    sections: [
      { title: 'Report Period', fields: [
        { name: 'reportType', label: 'Report Type', type: 'select', required: true, options: ['Daily', 'Weekly', 'Monthly'] },
        { name: 'reportDate', label: 'Report Date', type: 'date', required: true },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'Performance Data', fields: [
        { name: 'targetOutput', label: 'Target Output', type: 'number', required: true },
        { name: 'actualOutput', label: 'Actual Output', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: UNITS },
        { name: 'achievement', label: 'Achievement (%)', type: 'number', required: true },
        { name: 'totalDowntime', label: 'Total Downtime (min)', type: 'number' },
        { name: 'oee', label: 'OEE (%)', type: 'number' },
        { name: 'rejectRate', label: 'Reject / Waste Rate (%)', type: 'number' },
        { name: 'highlights', label: 'Key Highlights', type: 'textarea', required: true },
        { name: 'issues', label: 'Issues & Actions', type: 'textarea' },
      ]},
    ],
  },
  'ops-spc': {
    title: 'Process Performance (SPC)',
    module: 'Performance Monitoring',
    sections: [
      { title: 'Measurement Details', fields: [
        { name: 'measurementDate', label: 'Measurement Date', type: 'date', required: true },
        { name: 'shift', label: 'Shift', type: 'select', required: true, options: SHIFTS },
        { name: 'productionLine', label: 'Production Line', type: 'select', required: true, options: LINES },
        { name: 'product', label: 'Product / Batch', type: 'text', required: true },
        { name: 'parameter', label: 'Process Parameter Monitored', type: 'text', required: true, hint: 'e.g., Fill Weight, Viscosity, pH' },
        { name: 'measuredBy', label: 'Measured By', type: 'text', required: true },
      ]},
      { title: 'Control Limits & Readings', fields: [
        { name: 'ucl', label: 'Upper Control Limit (UCL)', type: 'number', required: true },
        { name: 'lcl', label: 'Lower Control Limit (LCL)', type: 'number', required: true },
        { name: 'target', label: 'Target Value', type: 'number', required: true },
        { name: 'readings', label: 'Sample Readings', type: 'textarea', required: true, hint: 'Enter values separated by commas, e.g. 98.2, 99.1, 97.8' },
        { name: 'outOfControl', label: 'Out-of-Control Points?', type: 'select', required: true, options: ['None', 'Yes — Above UCL', 'Yes — Below LCL', 'Yes — Trend Detected'] },
        { name: 'action', label: 'Corrective Action Taken', type: 'textarea' },
      ]},
    ],
  },
};

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } } as const;
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } } as const;

export default function OPSFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = formCode?.toLowerCase() ?? '';
  const config = FORM_CONFIGS[key] ?? {
    title: 'Operations Form',
    module: 'Operations',
    sections: [{ title: 'Details', fields: [{ name: 'description', label: 'Description', type: 'textarea' as FieldType, required: true }] }],
  };

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      preparedBy: user.fullName || '',
      requestedBy: user.fullName || '',
      submittedBy: user.fullName || '',
      completedBy: user.fullName || '',
      outgoingSupervisor: user.fullName || '',
      reportedBy: user.fullName || '',
      detectedBy: user.fullName || '',
      measuredBy: user.fullName || '',
      ...prev,
    }));
  }, [user]);

  const handleChange = (name: string, value: string) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (isDraft: boolean) => {
    const required = config.sections.flatMap((s) => s.fields).filter((f) => f.required && !formData[f.name]);
    if (!isDraft && required.length > 0) {
      toast.warning(`Please fill in: ${required.map((f) => f.label).join(', ')}`);
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    const id = `${(formCode || 'OPS').toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`;
    toast.success(isDraft ? 'Draft saved.' : `${config.title} submitted (${id})`);
    if (!isDraft) navigate('/ops/forms');
  };

  const renderField = (field: FieldDef) => (
    <div key={field.name} className="space-y-1.5">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}{field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.type === 'select' && field.options ? (
        <Select value={formData[field.name] || ''} onValueChange={(v) => handleChange(field.name, v)}>
          <SelectTrigger id={field.name} className="h-11"><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
          <SelectContent>{field.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/ops/forms')} className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0"><Factory className="h-5 w-5 text-indigo-600" /></div>
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
              {section.fields.some((f) => f.required) && <CardDescription>Fields marked <span className="text-destructive">*</span> are required</CardDescription>}
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>{renderField(field)}</div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <div className="hidden md:flex gap-3 justify-end sticky bottom-6 bg-background/80 backdrop-blur p-4 -mx-6 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={() => navigate('/ops/forms')} className="h-11 px-6">Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-11 px-6"><Save className="h-4 w-4 mr-2" />Save Draft</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-11 px-8">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button variant="outline" onClick={() => navigate('/ops/forms')} className="h-14 flex-1">Cancel</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-14 flex-[2] text-base">
          {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
}
