import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Send, Loader2, Leaf } from 'lucide-react';
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

interface FieldDef { name: string; label: string; type: FieldType; required?: boolean; options?: string[]; hint?: string }
interface SectionDef { title: string; fields: FieldDef[] }
interface FormConfig { title: string; module: string; sections: SectionDef[] }

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = ['2024', '2025', '2026', '2027'];
const DEPTS = ['Production', 'Utilities', 'Maintenance', 'Warehouse', 'Administration', 'All Departments'];

const FORM_CONFIGS: Record<string, FormConfig> = {
  enms1: {
    title: 'ENMS Form 1 — Energy Data Collection',
    module: 'Energy Management (ISO 50001)',
    sections: [
      { title: 'Reporting Period', fields: [
        { name: 'month', label: 'Month', type: 'select', required: true, options: MONTHS },
        { name: 'year', label: 'Year', type: 'select', required: true, options: YEARS },
        { name: 'site', label: 'Site', type: 'select', required: true, options: ['Prai (Penang)', 'Pasir Gudang (Johor)'] },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'Electricity Consumption', fields: [
        { name: 'electricityKWH', label: 'Total Electricity (kWh)', type: 'number', required: true },
        { name: 'electricityCost', label: 'Electricity Cost (RM)', type: 'number', required: true },
        { name: 'peakDemandKW', label: 'Peak Demand (kW)', type: 'number' },
        { name: 'powerFactor', label: 'Average Power Factor', type: 'number', hint: 'e.g., 0.92' },
      ]},
      { title: 'Other Energy Sources', fields: [
        { name: 'naturalGasM3', label: 'Natural Gas (m³)', type: 'number' },
        { name: 'dieselLitres', label: 'Diesel (litres)', type: 'number' },
        { name: 'steamTonnes', label: 'Steam (tonnes)', type: 'number' },
        { name: 'compressedAirM3', label: 'Compressed Air (m³)', type: 'number' },
        { name: 'totalEnergyCostRM', label: 'Total Energy Cost (RM)', type: 'number', required: true },
      ]},
      { title: 'Production Context', fields: [
        { name: 'productionVolume', label: 'Production Volume (tonnes)', type: 'number', required: true, hint: 'Used to calculate specific energy consumption' },
        { name: 'specificEnergy', label: 'Specific Energy Consumption (kWh/tonne)', type: 'number' },
        { name: 'remarks', label: 'Remarks / Anomalies', type: 'textarea' },
      ]},
    ],
  },
  enms2: {
    title: 'ENMS Form 2 — Energy Performance Indicators',
    module: 'Energy Management (ISO 50001)',
    sections: [
      { title: 'Reporting Period', fields: [
        { name: 'month', label: 'Month', type: 'select', required: true, options: MONTHS },
        { name: 'year', label: 'Year', type: 'select', required: true, options: YEARS },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'Energy Performance Indicators (EnPIs)', fields: [
        { name: 'enpi1Name', label: 'EnPI 1 — Name', type: 'text', required: true, hint: 'e.g., Specific Electricity per tonne' },
        { name: 'enpi1Baseline', label: 'EnPI 1 — Baseline Value', type: 'number', required: true },
        { name: 'enpi1Target', label: 'EnPI 1 — Target', type: 'number', required: true },
        { name: 'enpi1Actual', label: 'EnPI 1 — Actual Value', type: 'number', required: true },
        { name: 'enpi2Name', label: 'EnPI 2 — Name', type: 'text', hint: 'e.g., Diesel per tonne' },
        { name: 'enpi2Baseline', label: 'EnPI 2 — Baseline Value', type: 'number' },
        { name: 'enpi2Target', label: 'EnPI 2 — Target', type: 'number' },
        { name: 'enpi2Actual', label: 'EnPI 2 — Actual Value', type: 'number' },
      ]},
      { title: 'Analysis', fields: [
        { name: 'performanceSummary', label: 'Performance vs Target Summary', type: 'textarea', required: true },
        { name: 'significantDeviations', label: 'Significant Deviations', type: 'textarea', hint: 'Any EnPI that missed target by >5% — explain why' },
        { name: 'improvementActions', label: 'Improvement Actions Taken / Planned', type: 'textarea' },
      ]},
    ],
  },
  iso50001br: {
    title: 'ISO 50001 Baseline Review',
    module: 'Energy Management (ISO 50001)',
    sections: [
      { title: 'Baseline Details', fields: [
        { name: 'reviewDate', label: 'Review Date', type: 'date', required: true },
        { name: 'baselineYear', label: 'Baseline Reference Year', type: 'select', required: true, options: ['2022', '2023', '2024', '2025'] },
        { name: 'reviewedBy', label: 'Reviewed By', type: 'text', required: true },
        { name: 'site', label: 'Site', type: 'select', required: true, options: ['Prai (Penang)', 'Pasir Gudang (Johor)'] },
      ]},
      { title: 'Baseline Data', fields: [
        { name: 'baselineElectricity', label: 'Baseline Electricity (kWh/year)', type: 'number', required: true },
        { name: 'baselineGas', label: 'Baseline Natural Gas (m³/year)', type: 'number' },
        { name: 'baselineDiesel', label: 'Baseline Diesel (litres/year)', type: 'number' },
        { name: 'baselineProduction', label: 'Baseline Production Volume (tonnes/year)', type: 'number', required: true },
        { name: 'baselineSEC', label: 'Baseline SEC (kWh/tonne)', type: 'number', required: true, hint: 'Specific Energy Consumption at baseline year' },
      ]},
      { title: 'Review Findings', fields: [
        { name: 'baselineStatus', label: 'Baseline Status', type: 'select', required: true, options: ['Confirmed — No Change', 'Revised — Normalisation Applied', 'Revised — Boundary Change', 'Revised — Static Factor Change'] },
        { name: 'revisedBaseline', label: 'Revised Baseline (if applicable)', type: 'number', hint: 'New SEC in kWh/tonne after revision' },
        { name: 'revisionReason', label: 'Reason for Revision', type: 'textarea' },
        { name: 'approvedBy', label: 'Approved By', type: 'text', required: true },
      ]},
    ],
  },
  iso50001ncr: {
    title: 'ISO 50001 Non-Conformance Report',
    module: 'Energy Management (ISO 50001)',
    sections: [
      { title: 'NCR Details', fields: [
        { name: 'ncrDate', label: 'NCR Date', type: 'date', required: true },
        { name: 'raisedBy', label: 'Raised By', type: 'text', required: true },
        { name: 'ncrSource', label: 'NCR Source', type: 'select', required: true, options: ['Internal Audit', 'External Audit', 'Management Review', 'Monitoring Data', 'Incident Report'] },
        { name: 'clauseReference', label: 'ISO 50001 Clause Reference', type: 'text', required: true, hint: 'e.g., Clause 6.3 — Energy Baseline' },
        { name: 'severity', label: 'Severity', type: 'select', required: true, options: ['Major Non-Conformance', 'Minor Non-Conformance', 'Observation'] },
      ]},
      { title: 'Description & Root Cause', fields: [
        { name: 'description', label: 'Non-Conformance Description', type: 'textarea', required: true },
        { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea', required: true },
        { name: 'immediateAction', label: 'Immediate Containment Action', type: 'textarea', required: true },
      ]},
      { title: 'Corrective Action', fields: [
        { name: 'correctiveAction', label: 'Corrective Action Plan', type: 'textarea', required: true },
        { name: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true },
        { name: 'targetDate', label: 'Target Closure Date', type: 'date', required: true },
        { name: 'verificationMethod', label: 'Verification Method', type: 'textarea', hint: 'How will effectiveness be verified?' },
      ]},
    ],
  },
  iso50001sop: {
    title: 'ISO 50001 SOP / Procedure',
    module: 'Energy Management (ISO 50001)',
    sections: [
      { title: 'Document Details', fields: [
        { name: 'documentTitle', label: 'Document Title', type: 'text', required: true },
        { name: 'documentCode', label: 'Document Code', type: 'text', required: true, hint: 'e.g., PBI-SOP-001' },
        { name: 'version', label: 'Version', type: 'text', required: true, hint: 'e.g., 1.0' },
        { name: 'clauseReference', label: 'ISO 50001 Clause Reference', type: 'text', hint: 'e.g., Clause 8.1 — Operational Planning' },
        { name: 'applicableTo', label: 'Applicable To', type: 'select', required: true, options: DEPTS },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      ]},
      { title: 'Content Summary', fields: [
        { name: 'purpose', label: 'Purpose / Objective', type: 'textarea', required: true },
        { name: 'scope', label: 'Scope', type: 'textarea', required: true },
        { name: 'procedureSummary', label: 'Procedure Summary', type: 'textarea', required: true, hint: 'Summarise the key steps — attach the full document separately' },
        { name: 'documentLink', label: 'SharePoint Document Link', type: 'text' },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
        { name: 'reviewedBy', label: 'Reviewed By', type: 'text', required: true },
        { name: 'approvedBy', label: 'Approved By', type: 'text', required: true },
      ]},
    ],
  },
  pbisopwi: {
    title: 'PBI SOP / Work Instruction Publication',
    module: 'Documentation',
    sections: [
      { title: 'Document Details', fields: [
        { name: 'documentType', label: 'Document Type', type: 'select', required: true, options: ['Standard Operating Procedure (SOP)', 'Work Instruction (WI)', 'Policy', 'Guideline', 'Form Template'] },
        { name: 'documentTitle', label: 'Document Title', type: 'text', required: true },
        { name: 'documentCode', label: 'Document Code', type: 'text', required: true },
        { name: 'version', label: 'Version', type: 'text', required: true },
        { name: 'applicableTo', label: 'Applicable To', type: 'select', required: true, options: DEPTS },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        { name: 'reviewDueDate', label: 'Next Review Date', type: 'date', required: true },
      ]},
      { title: 'Publication Details', fields: [
        { name: 'changeDescription', label: 'Description of Change', type: 'textarea', required: true, hint: 'What changed from the previous version?' },
        { name: 'reasonForChange', label: 'Reason for Change', type: 'textarea', required: true },
        { name: 'documentLink', label: 'SharePoint Document Link', type: 'text', required: true },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
        { name: 'approvedBy', label: 'Approved By', type: 'text', required: true },
      ]},
    ],
  },
  tcci: {
    title: 'Target / Cost Control Index',
    module: 'KPI & Cost Control',
    sections: [
      { title: 'Reporting Period', fields: [
        { name: 'reportMonth', label: 'Month', type: 'select', required: true, options: MONTHS },
        { name: 'reportYear', label: 'Year', type: 'select', required: true, options: YEARS },
        { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
      ]},
      { title: 'KPI Performance', fields: [
        { name: 'kpi1Name', label: 'KPI 1 — Name', type: 'text', required: true, hint: 'e.g., Production Efficiency' },
        { name: 'kpi1Target', label: 'KPI 1 — Target', type: 'text', required: true },
        { name: 'kpi1Actual', label: 'KPI 1 — Actual', type: 'text', required: true },
        { name: 'kpi1Status', label: 'KPI 1 — Status', type: 'select', required: true, options: ['On Track', 'At Risk', 'Off Track'] },
        { name: 'kpi2Name', label: 'KPI 2 — Name', type: 'text' },
        { name: 'kpi2Target', label: 'KPI 2 — Target', type: 'text' },
        { name: 'kpi2Actual', label: 'KPI 2 — Actual', type: 'text' },
        { name: 'kpi2Status', label: 'KPI 2 — Status', type: 'select', options: ['On Track', 'At Risk', 'Off Track'] },
      ]},
      { title: 'Cost Control', fields: [
        { name: 'budgetedCost', label: 'Budgeted Cost (RM)', type: 'number', required: true },
        { name: 'actualCost', label: 'Actual Cost (RM)', type: 'number', required: true },
        { name: 'variance', label: 'Variance (RM)', type: 'number', required: true, hint: 'Actual − Budget. Negative = under budget.' },
        { name: 'varianceExplanation', label: 'Variance Explanation', type: 'textarea', hint: 'Required if variance > ±5%' },
        { name: 'actionItems', label: 'Action Items', type: 'textarea', required: true },
      ]},
    ],
  },
};

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } } as const;
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } } as const;

export default function PBIFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = formCode?.toLowerCase() ?? '';
  const config = FORM_CONFIGS[key] ?? {
    title: 'PBI Form', module: 'PBI',
    sections: [{ title: 'Details', fields: [{ name: 'description', label: 'Description', type: 'textarea' as FieldType, required: true }] }],
  };

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      preparedBy: user.fullName || '', reviewedBy: user.fullName || '',
      raisedBy: user.fullName || '', responsiblePerson: user.fullName || '',
      ...prev,
    }));
  }, [user]);

  const handleChange = (name: string, value: string) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (isDraft: boolean) => {
    const required = config.sections.flatMap((s) => s.fields).filter((f) => f.required && !formData[f.name]);
    if (!isDraft && required.length > 0) { toast.warning(`Please fill in: ${required.map((f) => f.label).join(', ')}`); return; }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    const id = `${(formCode || 'PBI').toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`;
    toast.success(isDraft ? 'Draft saved.' : `${config.title} submitted (${id})`);
    if (!isDraft) navigate('/pbi/forms');
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/pbi/forms')} className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><Leaf className="h-5 w-5 text-amber-600" /></div>
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
        <Button variant="outline" onClick={() => navigate('/pbi/forms')} className="h-11 px-6">Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-11 px-6"><Save className="h-4 w-4 mr-2" />Save Draft</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-11 px-8">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button variant="outline" onClick={() => navigate('/pbi/forms')} className="h-14 flex-1">Cancel</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-14 flex-[2] text-base">
          {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
}
