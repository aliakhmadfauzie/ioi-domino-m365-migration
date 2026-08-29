import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  Plus,
  Building2,
  DollarSign,
  Calculator,
  Receipt,
  CreditCard,
  TrendingUp,
  FileCheck,
  FileText,
  Info,
  CheckCircle2,
  Users,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useCreateMainDBFIN } from '@/generated/hooks/use-main-dbfin';
import { useUser } from '@/hooks/use-user';
import type { MainDBFIN } from '@/generated/models/main-dbfin-model';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

// Section color themes
const sectionThemes = {
  blue: {
    bgColor: 'bg-secondary/50 dark:bg-secondary/30',
    borderColor: 'border-l-4 border-l-blue-500',
    iconBgColor: 'bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground',
  },
  violet: {
    bgColor: 'bg-secondary/50 dark:bg-violet-950/30',
    borderColor: 'border-l-4 border-l-violet-500',
    iconBgColor: 'bg-secondary dark:bg-violet-900 text-secondary-foreground dark:text-violet-300',
  },
  amber: {
    bgColor: 'bg-accent/50 dark:bg-accent/30',
    borderColor: 'border-l-4 border-l-amber-500',
    iconBgColor: 'bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground',
  },
  emerald: {
    bgColor: 'bg-primary/5 dark:bg-primary/30',
    borderColor: 'border-l-4 border-l-emerald-500',
    iconBgColor: 'bg-primary/10 dark:bg-primary text-primary dark:text-primary',
  },
  slate: {
    bgColor: 'bg-muted/50 dark:bg-background/30',
    borderColor: 'border-l-4 border-l-slate-400',
    iconBgColor: 'bg-muted dark:bg-muted text-foreground dark:text-muted-foreground',
  },
};

interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  fieldIds: string[];
}

interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'file' | 'currency';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
}

interface FormConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  sections: SectionConfig[];
  fields: FieldConfig[];
}

type FinanceFormValues = Record<string, string | boolean>;

const getTextValue = (values: FinanceFormValues, ...fieldIds: string[]) => {
  for (const fieldId of fieldIds) {
    const value = values[fieldId];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
};

const getNumberValue = (values: FinanceFormValues, ...fieldIds: string[]) => {
  const raw = getTextValue(values, ...fieldIds);
  if (!raw) return undefined;
  const parsed = Number(raw.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const summarizeValues = (config: FormConfig, values: FinanceFormValues) => {
  return config.fields
    .filter((field) => field.type !== 'file')
    .map((field) => {
      const value = values[field.id];
      if (value === undefined || value === '') return null;
      return `${field.label}: ${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}`;
    })
    .filter((line): line is string => Boolean(line))
    .join('\n');
};

// Form configurations
const formConfigs: Record<string, FormConfig> = {
  CAR: {
    title: 'Capital Appropriation Request',
    description: 'Request approval for capital expenditure',
    icon: TrendingUp,
    sections: [
      {
        id: 'project-info',
        title: 'Project Information',
        description: 'Basic project identification and classification',
        icon: Briefcase,
        ...sectionThemes.blue,
        fieldIds: ['projectTitle', 'projectType', 'department'],
      },
      {
        id: 'financials',
        title: 'Financial Details',
        description: 'Budget and cost information',
        icon: DollarSign,
        ...sectionThemes.emerald,
        fieldIds: ['requestedAmount', 'budgetCode', 'roiPeriod'],
      },
      {
        id: 'justification',
        title: 'Business Justification',
        description: 'Explain the need and expected benefits',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['justification', 'expectedBenefits'],
      },
      {
        id: 'timeline',
        title: 'Project Timeline',
        description: 'Start and completion dates',
        icon: Calculator,
        ...sectionThemes.amber,
        fieldIds: ['startDate', 'completionDate'],
      },
      {
        id: 'attachments',
        title: 'Supporting Documents',
        description: 'Upload vendor quotes and specifications',
        icon: Upload,
        ...sectionThemes.slate,
        fieldIds: ['vendorQuotes', 'technicalSpecs'],
      },
    ],
    fields: [
      { id: 'projectTitle', label: 'Project Title', type: 'text', required: true, hint: 'Brief descriptive title' },
      { id: 'projectType', label: 'Project Type', type: 'select', required: true, options: ['New Equipment', 'Replacement', 'Expansion', 'IT Infrastructure', 'Safety/Compliance', 'Cost Reduction', 'Other'] },
      { id: 'department', label: 'Requesting Department', type: 'select', required: true, options: ['Production', 'QA', 'QC', 'Maintenance', 'R&D', 'IT', 'Admin', 'Logistics', 'HR'] },
      { id: 'requestedAmount', label: 'Requested Amount (RM)', type: 'currency', required: true },
      { id: 'budgetCode', label: 'Budget Code', type: 'text', required: true, hint: 'e.g., CAPEX-2024-001' },
      { id: 'roiPeriod', label: 'ROI Period (months)', type: 'number', hint: 'Expected payback period' },
      { id: 'justification', label: 'Business Justification', type: 'textarea', required: true, hint: 'Explain why this expenditure is necessary' },
      { id: 'expectedBenefits', label: 'Expected Benefits', type: 'textarea', required: true, hint: 'Quantifiable benefits where possible' },
      { id: 'startDate', label: 'Project Start Date', type: 'date', required: true },
      { id: 'completionDate', label: 'Expected Completion', type: 'date', required: true },
      { id: 'vendorQuotes', label: 'Vendor Quotations', type: 'file' },
      { id: 'technicalSpecs', label: 'Technical Specifications', type: 'file' },
    ],
  },
  EARF: {
    title: 'Expense Approval Request Form',
    description: 'Request approval for operational expenses',
    icon: Receipt,
    sections: [
      {
        id: 'expense-type',
        title: 'Expense Classification',
        description: 'Type and cost center information',
        icon: Receipt,
        ...sectionThemes.blue,
        fieldIds: ['expenseType', 'costCenter', 'glAccount'],
      },
      {
        id: 'amount-details',
        title: 'Amount & Payment',
        description: 'Financial details and payment method',
        icon: DollarSign,
        ...sectionThemes.emerald,
        fieldIds: ['amount', 'incurredDate', 'paymentMethod'],
      },
      {
        id: 'description',
        title: 'Expense Details',
        description: 'Description and business purpose',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['description', 'businessPurpose'],
      },
      {
        id: 'receipts',
        title: 'Supporting Documents',
        description: 'Upload receipts and invoices',
        icon: Upload,
        ...sectionThemes.slate,
        fieldIds: ['receipts'],
      },
    ],
    fields: [
      { id: 'expenseType', label: 'Expense Type', type: 'select', required: true, options: ['Travel', 'Training', 'Equipment', 'Supplies', 'Services', 'Maintenance', 'Marketing', 'Other'] },
      { id: 'costCenter', label: 'Cost Center', type: 'text', required: true },
      { id: 'glAccount', label: 'GL Account', type: 'text' },
      { id: 'amount', label: 'Total Amount (RM)', type: 'currency', required: true },
      { id: 'incurredDate', label: 'Date Incurred', type: 'date', required: true },
      { id: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Bank Transfer', 'P-Card', 'Cash', 'Cheque'] },
      { id: 'description', label: 'Expense Description', type: 'textarea', required: true },
      { id: 'businessPurpose', label: 'Business Purpose', type: 'textarea', required: true, hint: 'Justify the business need' },
      { id: 'receipts', label: 'Receipts/Invoices', type: 'file', required: true },
    ],
  },
  CMF_A: {
    title: 'Approval for Credit Application Form',
    description: 'Request approval for a new customer credit application',
    icon: CreditCard,
    sections: [
      {
        id: 'customer-info',
        title: 'Customer Information',
        description: 'Customer and business identification',
        icon: Users,
        ...sectionThemes.blue,
        fieldIds: ['customerName', 'customerCode', 'businessArea'],
      },
      {
        id: 'credit-request',
        title: 'Credit Request',
        description: 'Requested limit, terms, and supporting reason',
        icon: CreditCard,
        ...sectionThemes.emerald,
        fieldIds: ['requestedLimit', 'paymentTerms', 'reasonForChange'],
      },
      {
        id: 'routing',
        title: 'Review Routing',
        description: 'Finance and management review details',
        icon: FileCheck,
        ...sectionThemes.violet,
        fieldIds: ['recipientHODEmail', 'targetDate', 'remarks'],
      },
    ],
    fields: [
      { id: 'customerName', label: 'Customer Name', type: 'text', required: true },
      { id: 'customerCode', label: 'Customer Code', type: 'text' },
      { id: 'businessArea', label: 'Business Area', type: 'text', required: true },
      { id: 'requestedLimit', label: 'Requested Credit Limit (RM)', type: 'currency', required: true },
      { id: 'paymentTerms', label: 'Payment Terms', type: 'select', required: true, options: ['COD', '30 Days', '60 Days', '90 Days', 'Other'] },
      { id: 'reasonForChange', label: 'Credit Justification', type: 'textarea', required: true },
      { id: 'recipientHODEmail', label: 'Recipient HOD Email', type: 'text' },
      { id: 'targetDate', label: 'Target Approval Date', type: 'date' },
      { id: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
  CMF_B: {
    title: 'Temporary Credit Limit Change Form',
    description: 'Request temporary customer credit limit changes',
    icon: CreditCard,
    sections: [
      {
        id: 'customer-info',
        title: 'Customer Information',
        description: 'Customer and current credit information',
        icon: Users,
        ...sectionThemes.blue,
        fieldIds: ['customerName', 'customerCode', 'currentLimit'],
      },
      {
        id: 'temporary-change',
        title: 'Temporary Change',
        description: 'Temporary limit amount and expiry',
        icon: TrendingUp,
        ...sectionThemes.emerald,
        fieldIds: ['requestedLimit', 'effectiveDate', 'expiryDate'],
      },
      {
        id: 'justification',
        title: 'Justification',
        description: 'Business reason and collection plan',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['reasonForChange', 'collectionPlan', 'remarks'],
      },
    ],
    fields: [
      { id: 'customerName', label: 'Customer Name', type: 'text', required: true },
      { id: 'customerCode', label: 'Customer Code', type: 'text' },
      { id: 'currentLimit', label: 'Current Credit Limit (RM)', type: 'currency' },
      { id: 'requestedLimit', label: 'Temporary Credit Limit (RM)', type: 'currency', required: true },
      { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { id: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
      { id: 'reasonForChange', label: 'Reason for Temporary Change', type: 'textarea', required: true },
      { id: 'collectionPlan', label: 'Collection / Settlement Plan', type: 'textarea' },
      { id: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
  CMF_C: {
    title: 'Review of Customers on Credit',
    description: 'Review existing customers with credit exposure',
    icon: Calculator,
    sections: [
      {
        id: 'review-scope',
        title: 'Review Scope',
        description: 'Review period and customer grouping',
        icon: FileCheck,
        ...sectionThemes.blue,
        fieldIds: ['reviewPeriod', 'businessArea', 'customerName'],
      },
      {
        id: 'credit-position',
        title: 'Credit Position',
        description: 'Outstanding balances and proposed action',
        icon: DollarSign,
        ...sectionThemes.emerald,
        fieldIds: ['outstandingBalance', 'overdueAmount', 'requestedLimit'],
      },
      {
        id: 'review-notes',
        title: 'Review Notes',
        description: 'Findings and recommended action',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['paymentHistory', 'reasonForChange', 'remarks'],
      },
    ],
    fields: [
      { id: 'reviewPeriod', label: 'Review Period', type: 'text', required: true, placeholder: 'e.g., 2026 Q2' },
      { id: 'businessArea', label: 'Business Area', type: 'text' },
      { id: 'customerName', label: 'Customer / Customer Group', type: 'text', required: true },
      { id: 'outstandingBalance', label: 'Outstanding Balance (RM)', type: 'currency' },
      { id: 'overdueAmount', label: 'Overdue Amount (RM)', type: 'currency' },
      { id: 'requestedLimit', label: 'Recommended Credit Limit (RM)', type: 'currency' },
      { id: 'paymentHistory', label: 'Payment History', type: 'select', options: ['Good', 'Watchlist', 'Overdue', 'Hold'] },
      { id: 'reasonForChange', label: 'Recommended Action', type: 'textarea', required: true },
      { id: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
  RSES: {
    title: 'Reversal Service Entry Sheet',
    description: 'Request reversal of a service entry sheet',
    icon: Receipt,
    sections: [
      {
        id: 'ses-info',
        title: 'Service Entry Information',
        description: 'Document numbers and reversal amount',
        icon: Receipt,
        ...sectionThemes.blue,
        fieldIds: ['serviceEntrySheetNo', 'poNumber', 'amount'],
      },
      {
        id: 'reversal-reason',
        title: 'Reversal Reason',
        description: 'Reason and supporting detail for Finance review',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['reasonForChange', 'targetDate', 'remarks'],
      },
    ],
    fields: [
      { id: 'serviceEntrySheetNo', label: 'Service Entry Sheet No', type: 'text', required: true },
      { id: 'poNumber', label: 'PO Number', type: 'text' },
      { id: 'amount', label: 'Reversal Amount (RM)', type: 'currency', required: true },
      { id: 'reasonForChange', label: 'Reason for Reversal', type: 'textarea', required: true },
      { id: 'targetDate', label: 'Target Reversal Date', type: 'date' },
      { id: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
  INSUCLAI: {
    title: 'Insurance Claim',
    description: 'Submit insurance claim details for Finance review',
    icon: FileCheck,
    sections: [
      {
        id: 'claim-details',
        title: 'Claim Details',
        description: 'Policy, incident, and claim amount information',
        icon: FileCheck,
        ...sectionThemes.blue,
        fieldIds: ['title', 'documentNo', 'amount'],
      },
      {
        id: 'incident',
        title: 'Incident Information',
        description: 'Describe the incident and supporting reason',
        icon: FileText,
        ...sectionThemes.violet,
        fieldIds: ['description', 'incurredDate', 'remarks'],
      },
    ],
    fields: [
      { id: 'title', label: 'Claim Title', type: 'text', required: true },
      { id: 'documentNo', label: 'Policy / Claim No', type: 'text', required: true },
      { id: 'amount', label: 'Claim Amount (RM)', type: 'currency', required: true },
      { id: 'incurredDate', label: 'Incident Date', type: 'date', required: true },
      { id: 'description', label: 'Incident Description', type: 'textarea', required: true },
      { id: 'remarks', label: 'Remarks', type: 'textarea' },
    ],
  },
  VENDREGIFINA: {
    title: 'Vendor Registration Form (Finance & HR)',
    description: 'Register or update vendor finance details',
    icon: Building2,
    sections: [
      {
        id: 'vendor-details',
        title: 'Vendor Details',
        description: 'Vendor identity and business area',
        icon: Building2,
        ...sectionThemes.blue,
        fieldIds: ['customerName', 'businessArea', 'documentNo'],
      },
      {
        id: 'finance-review',
        title: 'Finance Review',
        description: 'Finance routing and supporting remarks',
        icon: Users,
        ...sectionThemes.violet,
        fieldIds: ['recipientHODEmail', 'targetDate', 'remarks'],
      },
    ],
    fields: [
      { id: 'customerName', label: 'Vendor Name', type: 'text', required: true },
      { id: 'businessArea', label: 'Business Area', type: 'text', required: true },
      { id: 'documentNo', label: 'Vendor / Registration No', type: 'text' },
      { id: 'recipientHODEmail', label: 'Finance Reviewer Email', type: 'text' },
      { id: 'targetDate', label: 'Target Review Date', type: 'date' },
      { id: 'remarks', label: 'Remarks', type: 'textarea', required: true },
    ],
  },
  CreditRev: {
    title: 'Credit Review Form',
    description: 'Review customer credit terms and limits',
    icon: CreditCard,
    sections: [
      {
        id: 'customer-info',
        title: 'Customer Information',
        description: 'Customer identification details',
        icon: Users,
        ...sectionThemes.blue,
        fieldIds: ['customerName', 'customerCode'],
      },
      {
        id: 'current-terms',
        title: 'Current Credit Terms',
        description: 'Existing credit limit and payment terms',
        icon: CreditCard,
        ...sectionThemes.violet,
        fieldIds: ['currentLimit', 'paymentTerms', 'avgMonthlyPurchase'],
      },
      {
        id: 'requested-terms',
        title: 'Requested Changes',
        description: 'New credit limit and terms requested',
        icon: TrendingUp,
        ...sectionThemes.emerald,
        fieldIds: ['requestedLimit', 'newPaymentTerms'],
      },
      {
        id: 'payment-history',
        title: 'Payment Performance',
        description: 'Historical payment behavior',
        icon: Calculator,
        ...sectionThemes.amber,
        fieldIds: ['paymentHistory', 'outstandingBalance', 'overdueAmount'],
      },
      {
        id: 'justification',
        title: 'Supporting Information',
        description: 'Justification and financial documents',
        icon: FileText,
        ...sectionThemes.slate,
        fieldIds: ['justification', 'financialStatements'],
      },
    ],
    fields: [
      { id: 'customerName', label: 'Customer Name', type: 'text', required: true },
      { id: 'customerCode', label: 'Customer Code', type: 'text', required: true },
      { id: 'currentLimit', label: 'Current Credit Limit (RM)', type: 'currency', required: true },
      { id: 'paymentTerms', label: 'Current Payment Terms', type: 'select', required: true, options: ['COD', '7 Days', '14 Days', '30 Days', '45 Days', '60 Days', '90 Days'] },
      { id: 'avgMonthlyPurchase', label: 'Avg Monthly Purchase (RM)', type: 'currency' },
      { id: 'requestedLimit', label: 'Requested Credit Limit (RM)', type: 'currency', required: true },
      { id: 'newPaymentTerms', label: 'Requested Payment Terms', type: 'select', options: ['COD', '7 Days', '14 Days', '30 Days', '45 Days', '60 Days', '90 Days'] },
      { id: 'paymentHistory', label: 'Payment History', type: 'select', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
      { id: 'outstandingBalance', label: 'Current Outstanding (RM)', type: 'currency' },
      { id: 'overdueAmount', label: 'Overdue Amount (RM)', type: 'currency' },
      { id: 'justification', label: 'Justification for Change', type: 'textarea', required: true },
      { id: 'financialStatements', label: 'Financial Statements', type: 'file' },
    ],
  },
  TClaim: {
    title: 'Travel Claim Form',
    description: 'Submit travel expense claims for reimbursement',
    icon: Receipt,
    sections: [
      {
        id: 'travel-info',
        title: 'Travel Information',
        description: 'Trip details and purpose',
        icon: Briefcase,
        ...sectionThemes.blue,
        fieldIds: ['travelPurpose', 'destination', 'departureDate', 'returnDate'],
      },
      {
        id: 'expenses',
        title: 'Expense Breakdown',
        description: 'Itemized travel costs',
        icon: Receipt,
        ...sectionThemes.emerald,
        fieldIds: ['transportCost', 'accommodationCost', 'mealsCost', 'otherCost'],
      },
      {
        id: 'totals',
        title: 'Total & Advance',
        description: 'Final claim amount and advance received',
        icon: DollarSign,
        ...sectionThemes.amber,
        fieldIds: ['totalClaim', 'advanceReceived'],
      },
      {
        id: 'receipts',
        title: 'Supporting Documents',
        description: 'Upload all receipts',
        icon: Upload,
        ...sectionThemes.slate,
        fieldIds: ['receipts'],
      },
    ],
    fields: [
      { id: 'travelPurpose', label: 'Purpose of Travel', type: 'textarea', required: true },
      { id: 'destination', label: 'Destination', type: 'text', required: true },
      { id: 'departureDate', label: 'Departure Date', type: 'date', required: true },
      { id: 'returnDate', label: 'Return Date', type: 'date', required: true },
      { id: 'transportCost', label: 'Transport Cost (RM)', type: 'currency' },
      { id: 'accommodationCost', label: 'Accommodation Cost (RM)', type: 'currency' },
      { id: 'mealsCost', label: 'Meals Cost (RM)', type: 'currency' },
      { id: 'otherCost', label: 'Other Expenses (RM)', type: 'currency' },
      { id: 'totalClaim', label: 'Total Claim Amount (RM)', type: 'currency', required: true },
      { id: 'advanceReceived', label: 'Advance Received (RM)', type: 'currency' },
      { id: 'receipts', label: 'All Receipts', type: 'file', required: true },
    ],
  },
  MonthClose: {
    title: 'Month-End Checklist',
    description: 'Month-end closing activities checklist',
    icon: Calculator,
    sections: [
      {
        id: 'period',
        title: 'Closing Period',
        description: 'Select the month and year',
        icon: Calculator,
        ...sectionThemes.blue,
        fieldIds: ['closingMonth', 'closingYear'],
      },
      {
        id: 'ap-ar',
        title: 'AP/AR Activities',
        description: 'Accounts payable and receivable cutoff',
        icon: Receipt,
        ...sectionThemes.emerald,
        fieldIds: ['apCutoff', 'arCutoff'],
      },
      {
        id: 'assets',
        title: 'Assets & Inventory',
        description: 'Fixed assets and inventory valuation',
        icon: Briefcase,
        ...sectionThemes.violet,
        fieldIds: ['inventoryValuation', 'fixedAssets'],
      },
      {
        id: 'adjustments',
        title: 'Adjustments',
        description: 'Accruals, prepayments, and intercompany',
        icon: Calculator,
        ...sectionThemes.amber,
        fieldIds: ['accruals', 'prepayments', 'intercompany'],
      },
      {
        id: 'reconciliation',
        title: 'Reconciliation',
        description: 'Bank reconciliation and trial balance',
        icon: CheckCircle2,
        ...sectionThemes.slate,
        fieldIds: ['bankRecon', 'trialBalance', 'remarks'],
      },
    ],
    fields: [
      { id: 'closingMonth', label: 'Closing Month', type: 'select', required: true, options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
      { id: 'closingYear', label: 'Year', type: 'text', required: true },
      { id: 'apCutoff', label: 'AP Cutoff Completed', type: 'checkbox' },
      { id: 'arCutoff', label: 'AR Cutoff Completed', type: 'checkbox' },
      { id: 'inventoryValuation', label: 'Inventory Valuation Done', type: 'checkbox' },
      { id: 'fixedAssets', label: 'Fixed Assets Updated', type: 'checkbox' },
      { id: 'accruals', label: 'Accruals Posted', type: 'checkbox' },
      { id: 'prepayments', label: 'Prepayments Adjusted', type: 'checkbox' },
      { id: 'intercompany', label: 'Intercompany Reconciled', type: 'checkbox' },
      { id: 'bankRecon', label: 'Bank Reconciliation Done', type: 'checkbox' },
      { id: 'trialBalance', label: 'Trial Balance Reviewed', type: 'checkbox' },
      { id: 'remarks', label: 'Remarks/Issues', type: 'textarea' },
    ],
  },
};

// Default form config
const defaultConfig: FormConfig = {
  title: 'Finance Form',
  description: 'Complete this form and submit for approval',
  icon: DollarSign,
  sections: [
    {
      id: 'details',
      title: 'Form Details',
      description: 'Basic information',
      icon: FileText,
      ...sectionThemes.blue,
      fieldIds: ['title', 'amount', 'description'],
    },
  ],
  fields: [
    { id: 'title', label: 'Title', type: 'text', required: true },
    { id: 'amount', label: 'Amount (RM)', type: 'currency', required: true },
    { id: 'description', label: 'Description', type: 'textarea', required: true },
  ],
};

const getSharePointFinanceFormCode = (code?: string) => {
  switch (code) {
    case 'CreditRev':
    case 'CMF_C':
      return 'CMF_A';
    case 'CreditApp':
      return 'CMF_A';
    case 'CreditLimit':
    case 'CMF_B':
      return 'CMF_A';
    default:
      return code && ['CAR', 'CMF_A', 'INSUCLAI', 'RSES', 'VENDREGIFINA', 'EARF'].includes(code) ? code : 'CAR';
  }
};

export default function FinanceFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const [site, setSite] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();
  const createRecord = useCreateMainDBFIN();

  const config = formConfigs[formCode || ''] || defaultConfig;
  const FormIcon = config.icon;

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const generateFormId = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${getSharePointFinanceFormCode(formCode)}-${dateStr}-${random}`;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    const formId = generateFormId();

    try {
      const submittedOn = new Date().toISOString();
      const fieldSummary = summarizeValues(config, formData);
      const requestTitle =
        getTextValue(formData, 'projectTitle', 'title', 'customerName', 'travelPurpose', 'description') ||
        config.title;
      const primaryDescription = getTextValue(formData, 'description', 'businessPurpose', 'justification', 'remarks');

      const record: Omit<MainDBFIN, 'id'> = {
        title: formId,
        formCode: getSharePointFinanceFormCode(formCode),
        departmentKey: 'DepartmentKey03' as const,
        statusKey: isDraft ? 'StatusKey0' as const : 'StatusKey1' as const,
        currentStage: isDraft ? 'Draft' : 'Submitted',
        siteKey: site === 'Johor' ? 'SiteKey1' as const : 'SiteKey0' as const,
        submittedOn,
        requestorEmail: user?.userPrincipalName || '',
        requestorDisplayName: user?.fullName || user?.userPrincipalName || '',
        requestedBy: user?.fullName || user?.userPrincipalName || '',
        appName: config.title,
        requestTitle,
        amount: getNumberValue(
          formData,
          'requestedAmount',
          'amount',
          'requestedLimit',
          'totalClaim',
          'currentLimit',
          'outstandingBalance',
          'overdueAmount'
        ),
        contractAmount: getNumberValue(formData, 'currentLimit', 'outstandingBalance'),
        businessArea: getTextValue(formData, 'businessArea', 'projectType', 'expenseType', 'paymentHistory', 'closingMonth'),
        documentNo: getTextValue(
          formData,
          'budgetCode',
          'documentNo',
          'serviceEntrySheetNo',
          'poNumber',
          'customerCode',
          'costCenter',
          'glAccount'
        ),
        documentType: getSharePointFinanceFormCode(formCode),
        dueDate: getTextValue(formData, 'expiryDate', 'targetDate', 'completionDate', 'returnDate', 'incurredDate'),
        effectiveDate: getTextValue(formData, 'effectiveDate', 'startDate', 'departureDate'),
        targetDate: getTextValue(formData, 'targetDate', 'expiryDate', 'completionDate', 'returnDate'),
        paybackPeriod: getTextValue(formData, 'roiPeriod'),
        problemDesc: fieldSummary || primaryDescription,
        reasonForChange: getTextValue(formData, 'reasonForChange', 'justification', 'businessPurpose', 'collectionPlan'),
        recipientHODEmail: getTextValue(formData, 'recipientHODEmail'),
        statusRequest: getTextValue(formData, 'paymentTerms', 'paymentMethod', 'paymentHistory', 'reviewPeriod'),
        section: fieldSummary ? fieldSummary.slice(0, 255) : undefined,
        description: primaryDescription || config.description,
        workflowAction: isDraft ? 'Save Draft' : 'Submit',
      };

      await createRecord.mutateAsync(record);

      if (isDraft) {
        toast.success('Draft saved successfully');
      } else {
        toast.success(`${config.title} submitted to SharePoint for approval`);
        navigate(`/fin/forms/${getSharePointFinanceFormCode(formCode)}`);
      }
    } catch (error: unknown) {
      toast.error('Failed to submit form', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
    setIsSubmitting(false);
  };

  const getFieldById = (fieldId: string) => {
    return config.fields.find((f) => f.id === fieldId);
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.id];

    return (
      <div key={field.id} className="space-y-2">
        {field.type !== 'checkbox' && (
          <Label htmlFor={field.id} className="text-sm font-semibold text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        {field.type === 'text' && (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {(field.type === 'number' || field.type === 'currency') && (
          <div className="relative">
            {field.type === 'currency' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">RM</span>
            )}
            <Input
              id={field.id}
              type="number"
              className={`bg-background border-2 focus:border-primary transition-colors ${field.type === 'currency' ? 'pl-12' : ''}`}
              value={(value as string) || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            />
          </div>
        )}
        
        {field.type === 'textarea' && (
          <Textarea
            id={field.id}
            rows={3}
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors resize-none"
          />
        )}
        
        {field.type === 'select' && field.options && (
          <Select
            value={(value as string) || ''}
            onValueChange={(val: string) => handleFieldChange(field.id, val)}
          >
            <SelectTrigger className="bg-background border-2 focus:border-primary transition-colors">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {field.type === 'date' && (
          <Input
            id={field.id}
            type="date"
            value={(value as string) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.id, e.target.value)}
            className="bg-background border-2 focus:border-primary transition-colors"
          />
        )}
        
        {field.type === 'checkbox' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border-2">
            <Checkbox
              id={field.id}
              checked={!!value}
              onCheckedChange={(checked: boolean) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="font-medium cursor-pointer">{field.label}</Label>
          </div>
        )}
        
        {field.type === 'file' && (
          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Drag & drop files or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS, JPG up to 10MB</p>
            <Button variant="outline" size="sm" className="mt-3">
              <Plus className="h-4 w-4 mr-2" />
              Add Files
            </Button>
          </div>
        )}

        {field.hint && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {field.hint}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="space-y-6 p-6 max-w-4xl mx-auto pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link to="/fin/forms">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FormIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">{config.title}</h1>
              <p className="text-muted-foreground text-sm">{config.description}</p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-sm shrink-0">{formCode}</Badge>
      </motion.div>

      {/* Progress indicator */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sections:</span>
        <div className="flex gap-1">
          {config.sections.map((section) => (
            <div
              key={section.id}
              className={`h-2 w-8 rounded-full ${
                section.fieldIds.some((id) => formData[id])
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
              title={section.title}
            />
          ))}
        </div>
      </motion.div>

      {/* Site Selection */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              Site Selection
              <span className="text-destructive">*</span>
            </CardTitle>
            <CardDescription>Select the site this form applies to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={site === 'Prai' ? 'default' : 'outline'}
                onClick={() => setSite('Prai')}
                className="flex-1 h-14 text-base"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Prai (Penang)
              </Button>
              <Button
                variant={site === 'Johor' ? 'default' : 'outline'}
                onClick={() => setSite('Johor')}
                className="flex-1 h-14 text-base"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Pasir Gudang (Johor)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Sections */}
      {config.sections.map((section) => {
        const SectionIcon = section.icon;
        const sectionFields = section.fieldIds
          .map((id) => getFieldById(id))
          .filter((f): f is FieldConfig => f !== undefined);

        if (sectionFields.length === 0) return null;

        return (
          <motion.div key={section.id} variants={itemVariants}>
            <Card className={`${section.bgColor} ${section.borderColor} border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${section.iconBgColor}`}>
                    <SectionIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-lg">{section.title}</span>
                    <CardDescription className="font-normal mt-0.5">
                      {section.description}
                    </CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="bg-card/80 backdrop-blur rounded-lg p-5 space-y-5 border">
                  {sectionFields.map((field) => renderField(field))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* SharePoint Info */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Connected to SharePoint (MainDB_FIN)</p>
              <p className="text-sm text-muted-foreground mt-1">
                This form saves directly to the Finance SharePoint list and routes to Finance Manager for approval.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex gap-3 justify-end sticky bottom-6 bg-background/80 backdrop-blur p-4 -mx-6 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-12 px-6">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-12 px-8">
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      </motion.div>
    </motion.div>
  );
}
