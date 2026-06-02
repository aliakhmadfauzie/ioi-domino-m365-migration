/**
 * QA Forms Index - Complete listing of 180+ QA forms
 * Organized by category matching IOI AcidChem QA structure
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  FileQuestion,
  Lightbulb,
  BookOpen,
  Shield,
  AlertOctagon,
  Beaker,
  Scale,
  Thermometer,
  FlaskConical,
  Microscope,
  FileCheck,
  FileWarning,
  FilePlus,
  FileEdit,
  FileSearch,
  FileClock,
  FileX,
  FileSpreadsheet,
  FileBarChart,
  FileBox,
  Package,
  Truck,
  Building2,
  Users,
  GraduationCap,
  Settings,
  Wrench,
  Gauge,
  Target,
  Activity,
  Zap,
  Flame,
  Droplet,
  Wind,
  Leaf,
  Bug,
  Star,
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

// Form category type
type FormCategory = 
  | 'food-safety'
  | 'ncr-audit'
  | 'change-control'
  | 'validation'
  | 'haccp'
  | 'ghs-sds'
  | 'lab-equipment'
  | 'product-spec'
  | 'customer-complaint'
  | 'supplier-quality'
  | 'documentation'
  | 'training'
  | 'calibration'
  | 'environmental'
  | 'process-control';

interface QAForm {
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: FormCategory;
  site: 'PRAI' | 'JHR' | 'BOTH';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// Complete QA Forms list based on Excel migration data
const QA_FORMS: QAForm[] = [
  // Food Safety Manual Forms
  { code: 'FSM-001', name: 'Food Safety Manual', description: 'Master food safety management system documentation', icon: BookOpen, category: 'food-safety', site: 'BOTH', priority: 'critical' },
  { code: 'FSM-002', name: 'Food Safety Policy', description: 'Food safety policy declarations and commitments', icon: Shield, category: 'food-safety', site: 'BOTH', priority: 'critical' },
  { code: 'FSM-003', name: 'Food Safety Objectives', description: 'Annual food safety objectives and targets', icon: Target, category: 'food-safety', site: 'BOTH', priority: 'high' },
  { code: 'FSM-004', name: 'Food Safety Team', description: 'Food safety team composition and responsibilities', icon: Users, category: 'food-safety', site: 'BOTH', priority: 'high' },
  { code: 'FSM-005', name: 'Allergen Management', description: 'Allergen control and management procedures', icon: AlertTriangle, category: 'food-safety', site: 'BOTH', priority: 'critical' },
  { code: 'FSM-006', name: 'Food Defense Plan', description: 'Food defense and security measures', icon: Shield, category: 'food-safety', site: 'BOTH', priority: 'high' },
  { code: 'FSM-007', name: 'Traceability System', description: 'Product traceability and recall procedures', icon: FileSearch, category: 'food-safety', site: 'BOTH', priority: 'critical' },
  { code: 'FSM-008', name: 'Food Fraud Vulnerability', description: 'Food fraud vulnerability assessment', icon: AlertOctagon, category: 'food-safety', site: 'BOTH', priority: 'high' },

  // NCR & Audit Forms
  { code: 'NCR-001', name: 'Non-Conformance Report', description: 'Document and track non-conforming products or processes', icon: AlertOctagon, category: 'ncr-audit', site: 'BOTH', priority: 'critical' },
  { code: 'NCR-002', name: 'Internal Audit Report', description: 'Internal quality audit findings and observations', icon: ClipboardCheck, category: 'ncr-audit', site: 'BOTH', priority: 'high' },
  { code: 'NCR-003', name: 'External Audit Finding', description: 'External/certification audit findings', icon: FileCheck, category: 'ncr-audit', site: 'BOTH', priority: 'critical' },
  { code: 'NCR-004', name: 'Supplier Audit Report', description: 'Supplier quality audit documentation', icon: Building2, category: 'ncr-audit', site: 'BOTH', priority: 'high' },
  { code: 'NCR-005', name: 'Process Audit Checklist', description: 'Process-specific audit checklists', icon: ClipboardCheck, category: 'ncr-audit', site: 'BOTH', priority: 'medium' },
  { code: 'NCR-006', name: 'CAPA Request', description: 'Corrective and preventive action request', icon: Target, category: 'ncr-audit', site: 'BOTH', priority: 'critical' },
  { code: 'NCR-007', name: 'Root Cause Analysis', description: 'Root cause investigation and analysis', icon: FileSearch, category: 'ncr-audit', site: 'BOTH', priority: 'high' },
  { code: 'NCR-008', name: 'Effectiveness Check', description: 'CAPA effectiveness verification', icon: CheckCircle2, category: 'ncr-audit', site: 'BOTH', priority: 'high' },
  { code: 'NCR-009', name: 'Management Review Input', description: 'Input data for management review', icon: FileBarChart, category: 'ncr-audit', site: 'BOTH', priority: 'high' },
  { code: 'NCR-010', name: 'Audit Schedule', description: 'Annual internal audit schedule', icon: FileClock, category: 'ncr-audit', site: 'BOTH', priority: 'medium' },

  // Change Control Forms
  { code: 'CC-001', name: 'Change Request Form', description: 'Initiate product or process change request', icon: FileEdit, category: 'change-control', site: 'BOTH', priority: 'critical' },
  { code: 'CC-002', name: 'Change Impact Assessment', description: 'Assess impact of proposed changes', icon: Scale, category: 'change-control', site: 'BOTH', priority: 'critical' },
  { code: 'CC-003', name: 'Formula Change Request', description: 'Product formula modification request', icon: FlaskConical, category: 'change-control', site: 'BOTH', priority: 'critical' },
  { code: 'CC-004', name: 'Packaging Change Request', description: 'Packaging specification changes', icon: Package, category: 'change-control', site: 'BOTH', priority: 'high' },
  { code: 'CC-005', name: 'Process Change Request', description: 'Manufacturing process modifications', icon: Settings, category: 'change-control', site: 'BOTH', priority: 'high' },
  { code: 'CC-006', name: 'Supplier Change Notification', description: 'Raw material supplier changes', icon: Truck, category: 'change-control', site: 'BOTH', priority: 'high' },
  { code: 'CC-007', name: 'Equipment Change Request', description: 'Production equipment modifications', icon: Wrench, category: 'change-control', site: 'BOTH', priority: 'high' },
  { code: 'CC-008', name: 'Document Change Request', description: 'Quality document revision request', icon: FileQuestion, category: 'change-control', site: 'BOTH', priority: 'medium' },
  { code: 'CC-009', name: 'Label Change Request', description: 'Product labeling modifications', icon: FileText, category: 'change-control', site: 'BOTH', priority: 'high' },
  { code: 'CC-010', name: 'Change Implementation Report', description: 'Change implementation verification', icon: CheckCircle2, category: 'change-control', site: 'BOTH', priority: 'high' },

  // Validation Database Forms
  { code: 'VAL-001', name: 'Process Validation Protocol', description: 'Manufacturing process validation protocol', icon: FileCheck, category: 'validation', site: 'BOTH', priority: 'critical' },
  { code: 'VAL-002', name: 'Cleaning Validation Protocol', description: 'Equipment cleaning validation', icon: Droplet, category: 'validation', site: 'BOTH', priority: 'critical' },
  { code: 'VAL-003', name: 'Method Validation Protocol', description: 'Analytical method validation', icon: Microscope, category: 'validation', site: 'BOTH', priority: 'critical' },
  { code: 'VAL-004', name: 'Equipment Qualification', description: 'Equipment IQ/OQ/PQ documentation', icon: Wrench, category: 'validation', site: 'BOTH', priority: 'high' },
  { code: 'VAL-005', name: 'Computer System Validation', description: 'Computer system validation protocol', icon: Settings, category: 'validation', site: 'BOTH', priority: 'high' },
  { code: 'VAL-006', name: 'Validation Master Plan', description: 'Site validation master plan', icon: BookOpen, category: 'validation', site: 'BOTH', priority: 'critical' },
  { code: 'VAL-007', name: 'Validation Summary Report', description: 'Validation study summary and conclusions', icon: FileBarChart, category: 'validation', site: 'BOTH', priority: 'high' },
  { code: 'VAL-008', name: 'Revalidation Assessment', description: 'Periodic revalidation assessment', icon: FileClock, category: 'validation', site: 'BOTH', priority: 'medium' },
  { code: 'VAL-009', name: 'Validation Deviation Report', description: 'Validation study deviations', icon: AlertTriangle, category: 'validation', site: 'BOTH', priority: 'high' },
  { code: 'VAL-010', name: 'Process Capability Study', description: 'Statistical process capability analysis', icon: Activity, category: 'validation', site: 'BOTH', priority: 'high' },

  // HACCP Forms
  { code: 'HACCP-001', name: 'Hazard Analysis', description: 'Hazard identification and analysis', icon: AlertTriangle, category: 'haccp', site: 'BOTH', priority: 'critical' },
  { code: 'HACCP-002', name: 'CCP Determination', description: 'Critical control point determination', icon: Target, category: 'haccp', site: 'BOTH', priority: 'critical' },
  { code: 'HACCP-003', name: 'HACCP Plan', description: 'HACCP plan documentation', icon: BookOpen, category: 'haccp', site: 'BOTH', priority: 'critical' },
  { code: 'HACCP-004', name: 'CCP Monitoring Record', description: 'Critical control point monitoring log', icon: Gauge, category: 'haccp', site: 'BOTH', priority: 'critical' },
  { code: 'HACCP-005', name: 'CCP Deviation Report', description: 'CCP deviation and corrective action', icon: AlertOctagon, category: 'haccp', site: 'BOTH', priority: 'critical' },
  { code: 'HACCP-006', name: 'HACCP Verification Record', description: 'HACCP plan verification activities', icon: CheckCircle2, category: 'haccp', site: 'BOTH', priority: 'high' },
  { code: 'HACCP-007', name: 'OPRP Monitoring', description: 'Operational prerequisite program monitoring', icon: ClipboardCheck, category: 'haccp', site: 'BOTH', priority: 'high' },
  { code: 'HACCP-008', name: 'Flow Diagram', description: 'Process flow diagram for HACCP', icon: Activity, category: 'haccp', site: 'BOTH', priority: 'high' },
  { code: 'HACCP-009', name: 'Prerequisite Program Checklist', description: 'PRP compliance verification', icon: ClipboardCheck, category: 'haccp', site: 'BOTH', priority: 'high' },
  { code: 'HACCP-010', name: 'HACCP Team Meeting Minutes', description: 'HACCP team meeting documentation', icon: Users, category: 'haccp', site: 'BOTH', priority: 'medium' },

  // GHS-SDS Forms
  { code: 'GHS-001', name: 'Safety Data Sheet', description: 'Product safety data sheet (SDS)', icon: FileWarning, category: 'ghs-sds', site: 'BOTH', priority: 'critical' },
  { code: 'GHS-002', name: 'GHS Label Request', description: 'GHS compliant label creation request', icon: FileText, category: 'ghs-sds', site: 'BOTH', priority: 'high' },
  { code: 'GHS-003', name: 'Chemical Inventory', description: 'Hazardous chemical inventory list', icon: FileSpreadsheet, category: 'ghs-sds', site: 'BOTH', priority: 'high' },
  { code: 'GHS-004', name: 'Hazard Classification', description: 'Chemical hazard classification', icon: AlertTriangle, category: 'ghs-sds', site: 'BOTH', priority: 'critical' },
  { code: 'GHS-005', name: 'SDS Review Checklist', description: 'Incoming SDS review and approval', icon: ClipboardCheck, category: 'ghs-sds', site: 'BOTH', priority: 'high' },
  { code: 'GHS-006', name: 'Emergency Procedure Card', description: 'Chemical emergency response card', icon: Zap, category: 'ghs-sds', site: 'BOTH', priority: 'high' },
  { code: 'GHS-007', name: 'Chemical Exposure Assessment', description: 'Workplace chemical exposure assessment', icon: Flame, category: 'ghs-sds', site: 'BOTH', priority: 'high' },
  { code: 'GHS-008', name: 'Transport Document', description: 'Dangerous goods transport documentation', icon: Truck, category: 'ghs-sds', site: 'BOTH', priority: 'high' },

  // Lab Equipment Forms
  { code: 'LAB-001', name: 'Equipment Logbook', description: 'Laboratory equipment usage log', icon: FileSpreadsheet, category: 'lab-equipment', site: 'BOTH', priority: 'high' },
  { code: 'LAB-002', name: 'Equipment Maintenance Record', description: 'Preventive maintenance documentation', icon: Wrench, category: 'lab-equipment', site: 'BOTH', priority: 'high' },
  { code: 'LAB-003', name: 'Equipment Qualification', description: 'Lab equipment IQ/OQ/PQ', icon: CheckCircle2, category: 'lab-equipment', site: 'BOTH', priority: 'high' },
  { code: 'LAB-004', name: 'Equipment Issue Report', description: 'Equipment malfunction/issue report', icon: AlertOctagon, category: 'lab-equipment', site: 'BOTH', priority: 'high' },
  { code: 'LAB-005', name: 'Calibration Request', description: 'Equipment calibration request', icon: Gauge, category: 'calibration', site: 'BOTH', priority: 'high' },
  { code: 'LAB-006', name: 'Calibration Certificate', description: 'Calibration certificate record', icon: Award, category: 'calibration', site: 'BOTH', priority: 'critical' },
  { code: 'LAB-007', name: 'Calibration Schedule', description: 'Equipment calibration schedule', icon: FileClock, category: 'calibration', site: 'BOTH', priority: 'high' },
  { code: 'LAB-008', name: 'Reference Standard Log', description: 'Reference standard inventory and usage', icon: Star, category: 'lab-equipment', site: 'BOTH', priority: 'high' },
  { code: 'LAB-009', name: 'Reagent Inventory', description: 'Laboratory reagent inventory control', icon: FlaskConical, category: 'lab-equipment', site: 'BOTH', priority: 'medium' },
  { code: 'LAB-010', name: 'Lab Work Request', description: 'Laboratory analysis request form', icon: Beaker, category: 'lab-equipment', site: 'BOTH', priority: 'high' },

  // Product Specification Forms
  { code: 'SPEC-001', name: 'Product Specification', description: 'Finished product specification', icon: FileText, category: 'product-spec', site: 'BOTH', priority: 'critical' },
  { code: 'SPEC-002', name: 'Raw Material Specification', description: 'Raw material quality specification', icon: Package, category: 'product-spec', site: 'BOTH', priority: 'critical' },
  { code: 'SPEC-003', name: 'Packaging Specification', description: 'Packaging material specification', icon: FileBox, category: 'product-spec', site: 'BOTH', priority: 'high' },
  { code: 'SPEC-004', name: 'In-Process Specification', description: 'In-process quality parameters', icon: Activity, category: 'product-spec', site: 'BOTH', priority: 'high' },
  { code: 'SPEC-005', name: 'Certificate of Analysis', description: 'Product certificate of analysis', icon: FileCheck, category: 'product-spec', site: 'BOTH', priority: 'critical' },
  { code: 'SPEC-006', name: 'Stability Study Protocol', description: 'Product stability study protocol', icon: Thermometer, category: 'product-spec', site: 'BOTH', priority: 'high' },
  { code: 'SPEC-007', name: 'Stability Data Report', description: 'Stability study results and trending', icon: FileBarChart, category: 'product-spec', site: 'BOTH', priority: 'high' },
  { code: 'SPEC-008', name: 'Shelf Life Determination', description: 'Product shelf life establishment', icon: FileClock, category: 'product-spec', site: 'BOTH', priority: 'high' },
  { code: 'SPEC-009', name: 'OOS Investigation', description: 'Out-of-specification investigation', icon: AlertOctagon, category: 'product-spec', site: 'BOTH', priority: 'critical' },
  { code: 'SPEC-010', name: 'Release Decision Form', description: 'Product batch release decision', icon: CheckCircle2, category: 'product-spec', site: 'BOTH', priority: 'critical' },

  // Customer Complaint Forms
  { code: 'CC-101', name: 'Customer Complaint Form', description: 'Customer complaint registration', icon: AlertTriangle, category: 'customer-complaint', site: 'BOTH', priority: 'critical' },
  { code: 'CC-102', name: 'Complaint Investigation', description: 'Customer complaint investigation', icon: FileSearch, category: 'customer-complaint', site: 'BOTH', priority: 'critical' },
  { code: 'CC-103', name: 'Return Sample Analysis', description: 'Returned product analysis report', icon: Microscope, category: 'customer-complaint', site: 'BOTH', priority: 'high' },
  { code: 'CC-104', name: 'Customer Response Letter', description: 'Formal customer response', icon: FileText, category: 'customer-complaint', site: 'BOTH', priority: 'high' },
  { code: 'CC-105', name: 'CCRR Form', description: 'Customer complaint resolution report', icon: CheckCircle2, category: 'customer-complaint', site: 'BOTH', priority: 'high' },
  { code: 'CC-106', name: 'Complaint Trend Analysis', description: 'Customer complaint trending report', icon: FileBarChart, category: 'customer-complaint', site: 'BOTH', priority: 'medium' },

  // Supplier Quality Forms
  { code: 'SQ-001', name: 'Supplier Qualification', description: 'New supplier qualification assessment', icon: Building2, category: 'supplier-quality', site: 'BOTH', priority: 'critical' },
  { code: 'SQ-002', name: 'Supplier Audit Checklist', description: 'Supplier quality audit checklist', icon: ClipboardCheck, category: 'supplier-quality', site: 'BOTH', priority: 'high' },
  { code: 'SQ-003', name: 'Supplier Performance Score', description: 'Supplier performance evaluation', icon: Star, category: 'supplier-quality', site: 'BOTH', priority: 'high' },
  { code: 'SQ-004', name: 'Incoming Inspection Report', description: 'Raw material incoming inspection', icon: FileCheck, category: 'supplier-quality', site: 'BOTH', priority: 'critical' },
  { code: 'SQ-005', name: 'Supplier NCR', description: 'Supplier non-conformance report', icon: XCircle, category: 'supplier-quality', site: 'BOTH', priority: 'high' },
  { code: 'SQ-006', name: 'Approved Supplier List', description: 'Approved supplier list maintenance', icon: FileSpreadsheet, category: 'supplier-quality', site: 'BOTH', priority: 'high' },
  { code: 'SQ-007', name: 'Supplier Agreement', description: 'Quality agreement with suppliers', icon: FileText, category: 'supplier-quality', site: 'BOTH', priority: 'high' },
  { code: 'SQ-008', name: 'COA Review', description: 'Supplier COA verification', icon: FileCheck, category: 'supplier-quality', site: 'BOTH', priority: 'high' },

  // Documentation Control Forms
  { code: 'DOC-001', name: 'Document Change Request', description: 'Quality document revision request', icon: FileEdit, category: 'documentation', site: 'BOTH', priority: 'high' },
  { code: 'DOC-002', name: 'Document Distribution List', description: 'Controlled document distribution', icon: FileSpreadsheet, category: 'documentation', site: 'BOTH', priority: 'medium' },
  { code: 'DOC-003', name: 'Document Review Log', description: 'Periodic document review record', icon: FileClock, category: 'documentation', site: 'BOTH', priority: 'medium' },
  { code: 'DOC-004', name: 'Obsolete Document Form', description: 'Document obsolescence request', icon: FileX, category: 'documentation', site: 'BOTH', priority: 'medium' },
  { code: 'DOC-005', name: 'External Document Log', description: 'External document control log', icon: FileText, category: 'documentation', site: 'BOTH', priority: 'medium' },
  { code: 'DOC-006', name: 'SOP Template', description: 'Standard operating procedure template', icon: BookOpen, category: 'documentation', site: 'BOTH', priority: 'high' },
  { code: 'DOC-007', name: 'Work Instruction Template', description: 'Work instruction template', icon: FileText, category: 'documentation', site: 'BOTH', priority: 'high' },
  { code: 'DOC-008', name: 'Form Template', description: 'Quality form template', icon: FilePlus, category: 'documentation', site: 'BOTH', priority: 'medium' },

  // Training Forms
  { code: 'TRN-001', name: 'Training Request', description: 'Quality training request', icon: GraduationCap, category: 'training', site: 'BOTH', priority: 'high' },
  { code: 'TRN-002', name: 'Training Record', description: 'Employee training documentation', icon: FileCheck, category: 'training', site: 'BOTH', priority: 'high' },
  { code: 'TRN-003', name: 'Training Matrix', description: 'Department training matrix', icon: FileSpreadsheet, category: 'training', site: 'BOTH', priority: 'high' },
  { code: 'TRN-004', name: 'Competency Assessment', description: 'Employee competency evaluation', icon: Award, category: 'training', site: 'BOTH', priority: 'high' },
  { code: 'TRN-005', name: 'Training Effectiveness', description: 'Training effectiveness evaluation', icon: CheckCircle2, category: 'training', site: 'BOTH', priority: 'medium' },
  { code: 'TRN-006', name: 'Annual Training Plan', description: 'Annual QA training schedule', icon: FileClock, category: 'training', site: 'BOTH', priority: 'medium' },

  // Environmental Monitoring Forms
  { code: 'ENV-001', name: 'Environmental Monitoring', description: 'Environmental monitoring record', icon: Thermometer, category: 'environmental', site: 'BOTH', priority: 'high' },
  { code: 'ENV-002', name: 'Pest Control Log', description: 'Pest control activity log', icon: Bug, category: 'environmental', site: 'BOTH', priority: 'high' },
  { code: 'ENV-003', name: 'Air Quality Monitoring', description: 'Clean room air quality monitoring', icon: Wind, category: 'environmental', site: 'BOTH', priority: 'high' },
  { code: 'ENV-004', name: 'Water Quality Testing', description: 'Water quality testing record', icon: Droplet, category: 'environmental', site: 'BOTH', priority: 'high' },
  { code: 'ENV-005', name: 'Waste Disposal Log', description: 'Quality waste disposal record', icon: FileX, category: 'environmental', site: 'BOTH', priority: 'medium' },
  { code: 'ENV-006', name: 'Environmental Deviation', description: 'Environmental excursion report', icon: AlertTriangle, category: 'environmental', site: 'BOTH', priority: 'high' },

  // Process Control Forms
  { code: 'PC-001', name: 'Batch Record', description: 'Production batch record', icon: FileSpreadsheet, category: 'process-control', site: 'BOTH', priority: 'critical' },
  { code: 'PC-002', name: 'In-Process Check', description: 'In-process quality check record', icon: ClipboardCheck, category: 'process-control', site: 'BOTH', priority: 'high' },
  { code: 'PC-003', name: 'Line Clearance', description: 'Production line clearance checklist', icon: CheckCircle2, category: 'process-control', site: 'BOTH', priority: 'high' },
  { code: 'PC-004', name: 'Process Deviation', description: 'Process deviation report', icon: AlertTriangle, category: 'process-control', site: 'BOTH', priority: 'critical' },
  { code: 'PC-005', name: 'Rework Authorization', description: 'Product rework authorization', icon: Settings, category: 'process-control', site: 'BOTH', priority: 'high' },
  { code: 'PC-006', name: 'Blend/Mix Record', description: 'Blending/mixing operation record', icon: FlaskConical, category: 'process-control', site: 'BOTH', priority: 'high' },
  { code: 'PC-007', name: 'Yield Reconciliation', description: 'Batch yield reconciliation', icon: Scale, category: 'process-control', site: 'BOTH', priority: 'high' },
  { code: 'PC-008', name: 'Sampling Plan', description: 'Quality sampling plan', icon: Target, category: 'process-control', site: 'BOTH', priority: 'high' },

  // Calibration Forms
  { code: 'CAL-001', name: 'Calibration Request', description: 'Instrument calibration request', icon: Gauge, category: 'calibration', site: 'BOTH', priority: 'high' },
  { code: 'CAL-002', name: 'Calibration Record', description: 'Calibration execution record', icon: FileCheck, category: 'calibration', site: 'BOTH', priority: 'critical' },
  { code: 'CAL-003', name: 'Calibration Due List', description: 'Calibration due date tracking', icon: FileClock, category: 'calibration', site: 'BOTH', priority: 'high' },
  { code: 'CAL-004', name: 'Out-of-Calibration Report', description: 'Calibration failure investigation', icon: AlertOctagon, category: 'calibration', site: 'BOTH', priority: 'critical' },
  { code: 'CAL-005', name: 'Reference Standard Certificate', description: 'Reference standard traceability', icon: Award, category: 'calibration', site: 'BOTH', priority: 'high' },
];

// Category metadata
const CATEGORY_META: Record<FormCategory, { label: string; icon: LucideIcon; color: string }> = {
  'food-safety': { label: 'Food Safety Manual', icon: BookOpen, color: 'bg-accent' },
  'ncr-audit': { label: 'NCR & Audit', icon: ClipboardCheck, color: 'bg-destructive' },
  'change-control': { label: 'Change Control', icon: FileEdit, color: 'bg-primary' },
  'validation': { label: 'Validation Database', icon: CheckCircle2, color: 'bg-primary' },
  'haccp': { label: 'HACCP', icon: Target, color: 'bg-primary' },
  'ghs-sds': { label: 'GHS-SDS', icon: AlertTriangle, color: 'bg-secondary' },
  'lab-equipment': { label: 'Lab Equipment', icon: Microscope, color: 'bg-primary' },
  'product-spec': { label: 'Product Specification', icon: FileText, color: 'bg-accent' },
  'customer-complaint': { label: 'Customer Complaint', icon: AlertTriangle, color: 'bg-destructive' },
  'supplier-quality': { label: 'Supplier Quality', icon: Building2, color: 'bg-primary' },
  'documentation': { label: 'Documentation Control', icon: FileText, color: 'bg-muted' },
  'training': { label: 'Training', icon: GraduationCap, color: 'bg-secondary' },
  'calibration': { label: 'Calibration', icon: Gauge, color: 'bg-primary' },
  'environmental': { label: 'Environmental', icon: Leaf, color: 'bg-accent' },
  'process-control': { label: 'Process Control', icon: Activity, color: 'bg-primary' },
};

const PRIORITY_STYLES: Record<QAForm['priority'], string> = {
  critical: 'bg-destructive text-destructive-foreground',
  high: 'bg-primary text-primary-foreground',
  medium: 'bg-secondary text-secondary-foreground',
  low: 'bg-muted text-muted-foreground',
};

export default function QAFormsIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter forms
  const filteredForms = useMemo(() => {
    return QA_FORMS.filter((form: QAForm) => {
      const matchesSearch = searchQuery === '' || 
        form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
      const matchesSite = selectedSite === 'all' || form.site === selectedSite || form.site === 'BOTH';
      
      return matchesSearch && matchesCategory && matchesSite;
    });
  }, [searchQuery, selectedCategory, selectedSite]);

  // Group forms by category for display
  const groupedForms = useMemo(() => {
    const groups: Record<string, QAForm[]> = {};
    filteredForms.forEach((form: QAForm) => {
      if (!groups[form.category]) {
        groups[form.category] = [];
      }
      groups[form.category].push(form);
    });
    return groups;
  }, [filteredForms]);

  const categories = Object.keys(CATEGORY_META) as FormCategory[];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/qa" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold">QA Forms Library</h1>
                <p className="text-sm text-muted-foreground">{QA_FORMS.length} forms available</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms by name, code, or description..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat: FormCategory) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_META[cat].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger className="w-[120px]">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    <SelectItem value="PRAI">Prai</SelectItem>
                    <SelectItem value="JHR">Johor</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredForms.length} of {QA_FORMS.length} forms
          </p>
        </div>

        {/* Forms by Category */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {Object.entries(groupedForms).map(([category, forms]) => {
            const meta = CATEGORY_META[category as FormCategory];
            const CategoryIcon = meta.icon;
            
            return (
              <motion.section key={category} variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', meta.color)}>
                    <CategoryIcon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold">{meta.label}</h2>
                  <Badge variant="secondary">{forms.length}</Badge>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {forms.map((form: QAForm) => {
                      const FormIcon = form.icon;
                      return (
                        <motion.div key={form.code} variants={itemVariants}>
                          <Card className="hover:shadow-md transition-all group h-full">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className={cn('p-2 rounded-lg', meta.color + '/10')}>
                                  <FormIcon className="h-4 w-4 text-foreground" />
                                </div>
                                <div className="flex gap-1">
                                  <Badge variant="outline" className="text-xs">{form.code}</Badge>
                                  {form.priority === 'critical' && (
                                    <Badge className={cn('text-xs', PRIORITY_STYLES[form.priority])}>Critical</Badge>
                                  )}
                                </div>
                              </div>
                              <CardTitle className="text-sm mt-2 line-clamp-2">{form.name}</CardTitle>
                              <CardDescription className="text-xs line-clamp-2">{form.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <Button asChild size="sm" className="w-full mt-2">
                                <Link to={`/qa/forms/${form.code.toLowerCase()}/new`}>
                                  Create Form <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {forms.map((form: QAForm) => {
                      const FormIcon = form.icon;
                      return (
                        <motion.div key={form.code} variants={itemVariants}>
                          <Card className="hover:shadow-sm transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className={cn('p-2 rounded-lg shrink-0', meta.color + '/10')}>
                                  <FormIcon className="h-4 w-4 text-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                                    <span className="font-medium truncate">{form.name}</span>
                                    {form.priority === 'critical' && (
                                      <Badge className={cn('text-xs shrink-0', PRIORITY_STYLES[form.priority])}>Critical</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">{form.description}</p>
                                </div>
                                <Badge variant="outline" className="shrink-0">{form.site}</Badge>
                                <Button asChild size="sm" className="shrink-0">
                                  <Link to={`/qa/forms/${form.code.toLowerCase()}/new`}>
                                    Create <ChevronRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.section>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredForms.length === 0 && (
          <Card className="p-12 text-center">
            <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No forms found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSite('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}