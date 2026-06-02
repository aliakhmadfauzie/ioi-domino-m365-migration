import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Send, Loader2, FlaskConical } from 'lucide-react';
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

const DEPTS = ['R&D', 'Production', 'QA', 'QC', 'Marketing', 'Sales', 'Finance', 'Engineering'];
const YEARS = ['2024', '2025', '2026', '2027'];

const FORM_CONFIGS: Record<string, FormConfig> = {
  rnddb: {
    title: 'R&D Database',
    module: 'Projects & Research',
    sections: [
      { title: 'Project Reference', fields: [
        { name: 'projectCode', label: 'Project Code / Reference', type: 'text', required: true, hint: 'e.g., RND-2026-001' },
        { name: 'projectTitle', label: 'Project Title', type: 'text', required: true },
        { name: 'projectType', label: 'Project Type', type: 'select', required: true, options: ['New Product Development', 'Product Improvement', 'Process Improvement', 'Material Research', 'Feasibility Study', 'Regulatory / Compliance'] },
        { name: 'department', label: 'Lead Department', type: 'select', required: true, options: DEPTS },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'targetEndDate', label: 'Target End Date', type: 'date', required: true },
        { name: 'status', label: 'Project Status', type: 'select', required: true, options: ['Proposed', 'Approved', 'In Progress', 'On Hold', 'Completed', 'Cancelled'] },
        { name: 'projectLead', label: 'Project Lead', type: 'text', required: true },
      ]},
      { title: 'Description', fields: [
        { name: 'objective', label: 'Project Objective', type: 'textarea', required: true },
        { name: 'scope', label: 'Scope', type: 'textarea', required: true },
        { name: 'expectedOutcome', label: 'Expected Outcome / Deliverables', type: 'textarea', required: true },
        { name: 'budget', label: 'Approved Budget (RM)', type: 'number' },
      ]},
    ],
  },
  rndprj: {
    title: 'R&D Project Form',
    module: 'Projects & Research',
    sections: [
      { title: 'Project Details', fields: [
        { name: 'projectTitle', label: 'Project Title', type: 'text', required: true },
        { name: 'projectCategory', label: 'Project Category', type: 'select', required: true, options: ['New Product Development', 'Product Reformulation', 'Cost Reduction', 'Quality Improvement', 'Regulatory Compliance', 'Sustainability'] },
        { name: 'initiatedBy', label: 'Initiated By', type: 'text', required: true },
        { name: 'initiationDate', label: 'Initiation Date', type: 'date', required: true },
        { name: 'targetLaunchDate', label: 'Target Launch / Completion Date', type: 'date', required: true },
      ]},
      { title: 'Business Case', fields: [
        { name: 'businessJustification', label: 'Business Justification', type: 'textarea', required: true, hint: 'Why is this project needed? Market gap, customer request, cost saving, regulatory?' },
        { name: 'targetMarket', label: 'Target Market / Customer', type: 'textarea', required: true },
        { name: 'expectedRevenue', label: 'Expected Revenue / Savings (RM/year)', type: 'number' },
        { name: 'estimatedBudget', label: 'Estimated R&D Budget (RM)', type: 'number', required: true },
      ]},
      { title: 'Technical Scope', fields: [
        { name: 'technicalObjectives', label: 'Technical Objectives', type: 'textarea', required: true },
        { name: 'keyMilestones', label: 'Key Milestones', type: 'textarea', required: true, hint: 'e.g., Formulation trial, stability test, pilot batch, scale-up' },
        { name: 'resourcesRequired', label: 'Resources Required', type: 'textarea', hint: 'Lab equipment, materials, external testing, headcount' },
        { name: 'risks', label: 'Identified Risks', type: 'textarea' },
        { name: 'approvedBy', label: 'Approved By', type: 'text', required: true },
      ]},
    ],
  },
  rnmr: {
    title: 'Raw / New Material Record',
    module: 'Materials',
    sections: [
      { title: 'Material Information', fields: [
        { name: 'materialName', label: 'Material Name', type: 'text', required: true },
        { name: 'materialCode', label: 'Material Code / CAS Number', type: 'text', hint: 'Internal code or CAS number for chemicals' },
        { name: 'supplier', label: 'Supplier / Manufacturer', type: 'text', required: true },
        { name: 'supplierCountry', label: 'Supplier Country of Origin', type: 'text' },
        { name: 'materialType', label: 'Material Type', type: 'select', required: true, options: ['Raw Material', 'Packaging Material', 'Chemical / Reagent', 'Additive', 'Reference Standard', 'Catalyst'] },
        { name: 'receivedDate', label: 'Date Received / Sampled', type: 'date', required: true },
        { name: 'batchNumber', label: 'Batch / Lot Number', type: 'text', required: true },
        { name: 'quantity', label: 'Quantity Received', type: 'number', required: true },
        { name: 'unit', label: 'Unit', type: 'select', required: true, options: ['kg', 'litres', 'g', 'mL', 'tonnes', 'drums'] },
        { name: 'recordedBy', label: 'Recorded By', type: 'text', required: true },
      ]},
      { title: 'Technical Data', fields: [
        { name: 'appearance', label: 'Appearance', type: 'text', hint: 'e.g., Clear liquid, white powder, amber paste' },
        { name: 'ph', label: 'pH (if applicable)', type: 'number' },
        { name: 'viscosity', label: 'Viscosity (cP, if applicable)', type: 'number' },
        { name: 'density', label: 'Density (g/mL, if applicable)', type: 'number' },
        { name: 'moistureContent', label: 'Moisture Content (%)', type: 'number' },
        { name: 'purity', label: 'Purity / Assay (%)', type: 'number' },
        { name: 'specificationStatus', label: 'Meets Specification?', type: 'select', required: true, options: ['Yes — Conforms', 'No — Out of Spec', 'Conditional — Minor Deviation', 'Testing In Progress'] },
        { name: 'testRemarks', label: 'Test Remarks', type: 'textarea' },
        { name: 'storageCondition', label: 'Storage Condition', type: 'select', required: true, options: ['Ambient (15–30°C)', 'Cool (2–15°C)', 'Refrigerated (2–8°C)', 'Frozen (<−18°C)', 'Flammable Store', 'Acid Store'] },
      ]},
    ],
  },
  newprdreq: {
    title: 'New Product Request',
    module: 'New Product Development',
    sections: [
      { title: 'Request Details', fields: [
        { name: 'requestDate', label: 'Request Date', type: 'date', required: true },
        { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        { name: 'requestingDept', label: 'Requesting Department', type: 'select', required: true, options: DEPTS },
        { name: 'productName', label: 'Proposed Product Name', type: 'text', required: true },
        { name: 'productCategory', label: 'Product Category', type: 'select', required: true, options: ['Food Grade', 'Industrial Grade', 'Pharmaceutical Grade', 'Cosmetic Grade', 'Agricultural', 'Specialty Chemical'] },
        { name: 'targetLaunchDate', label: 'Target Launch Date', type: 'date', required: true },
        { name: 'priority', label: 'Business Priority', type: 'select', required: true, options: ['Critical — Regulatory / Contractual', 'High — Key Customer Request', 'Medium — Market Opportunity', 'Low — Exploratory'] },
      ]},
      { title: 'Product Requirements', fields: [
        { name: 'targetCustomer', label: 'Target Customer / Market', type: 'textarea', required: true },
        { name: 'productDescription', label: 'Product Description & Key Features', type: 'textarea', required: true },
        { name: 'technicalRequirements', label: 'Technical / Quality Requirements', type: 'textarea', required: true, hint: 'Key specs, certifications, standards required (e.g., Halal, Kosher, ISO)' },
        { name: 'packagingRequirements', label: 'Packaging Requirements', type: 'textarea', hint: 'Pack size, material, labeling requirements' },
        { name: 'regulatoryRequirements', label: 'Regulatory / Compliance Requirements', type: 'textarea', hint: 'Applicable food laws, chemical regulations, export requirements' },
      ]},
      { title: 'Commercial Details', fields: [
        { name: 'expectedVolume', label: 'Expected Annual Volume', type: 'text', required: true, hint: 'e.g., 500 tonnes/year' },
        { name: 'targetSellingPrice', label: 'Target Selling Price (RM/unit)', type: 'number' },
        { name: 'targetCOGS', label: 'Target Cost of Goods Sold (RM/unit)', type: 'number' },
        { name: 'competitorProducts', label: 'Key Competitor Products', type: 'textarea' },
        { name: 'additionalRemarks', label: 'Additional Remarks', type: 'textarea' },
      ]},
    ],
  },
  'cmf-a': {
    title: 'Customer / Market Form A — Requirements',
    module: 'Customer & Market',
    sections: [
      { title: 'Customer Information', fields: [
        { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
        { name: 'customerCountry', label: 'Customer Country', type: 'text', required: true },
        { name: 'customerContact', label: 'Customer Contact Person', type: 'text' },
        { name: 'capturedBy', label: 'Captured By', type: 'text', required: true },
        { name: 'captureDate', label: 'Capture Date', type: 'date', required: true },
      ]},
      { title: 'Technical Requirements', fields: [
        { name: 'productRequired', label: 'Product Required', type: 'text', required: true },
        { name: 'applicationUse', label: 'Application / End Use', type: 'textarea', required: true },
        { name: 'keySpecs', label: 'Key Technical Specifications', type: 'textarea', required: true },
        { name: 'certifications', label: 'Required Certifications / Standards', type: 'textarea', hint: 'e.g., Halal, Kosher, RSPO, ISO, FDA' },
        { name: 'packagingPreference', label: 'Packaging Preference', type: 'text' },
      ]},
      { title: 'Commercial Requirements', fields: [
        { name: 'annualVolume', label: 'Estimated Annual Volume', type: 'text', required: true },
        { name: 'targetPrice', label: 'Target Price Range', type: 'text' },
        { name: 'deliveryRequirements', label: 'Delivery Requirements', type: 'textarea', hint: 'Lead time, Incoterms, shipping port' },
        { name: 'trialSampleRequired', label: 'Trial Sample Required?', type: 'select', options: ['Yes', 'No'] },
        { name: 'additionalNotes', label: 'Additional Notes', type: 'textarea' },
      ]},
    ],
  },
  'cmf-b': {
    title: 'Customer / Market Form B — Market Analysis',
    module: 'Customer & Market',
    sections: [
      { title: 'Market Overview', fields: [
        { name: 'marketName', label: 'Market / Segment Name', type: 'text', required: true },
        { name: 'geographicFocus', label: 'Geographic Focus', type: 'text', required: true, hint: 'e.g., Southeast Asia, EU, Middle East' },
        { name: 'analysisDate', label: 'Analysis Date', type: 'date', required: true },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
        { name: 'product', label: 'Product / Category Analysed', type: 'text', required: true },
      ]},
      { title: 'Market Data', fields: [
        { name: 'marketSize', label: 'Estimated Market Size (value or volume)', type: 'text', required: true },
        { name: 'growthRate', label: 'Market Growth Rate (% per year)', type: 'number' },
        { name: 'keyDrivers', label: 'Key Market Drivers', type: 'textarea', required: true },
        { name: 'keyBarriers', label: 'Key Barriers to Entry', type: 'textarea', required: true },
        { name: 'regulatoryLandscape', label: 'Regulatory Landscape', type: 'textarea', hint: 'Key regulations, import duties, certifications required' },
      ]},
      { title: 'Competitive Analysis', fields: [
        { name: 'mainCompetitors', label: 'Main Competitors', type: 'textarea', required: true, hint: 'List key competitors and their market position' },
        { name: 'competitorPricing', label: 'Competitor Pricing (range)', type: 'text' },
        { name: 'ioiDifferentiation', label: 'IOI Differentiation / Competitive Advantage', type: 'textarea', required: true },
        { name: 'recommendation', label: 'Market Entry Recommendation', type: 'select', required: true, options: ['Strongly Recommend — Strong Opportunity', 'Recommend — Moderate Opportunity', 'Caution — High Barriers', 'Not Recommended — Low Potential'] },
        { name: 'conclusion', label: 'Conclusion / Summary', type: 'textarea', required: true },
      ]},
    ],
  },
  'cmf-c': {
    title: 'Customer / Market Form C — Product Specifications',
    module: 'Customer & Market',
    sections: [
      { title: 'Product Reference', fields: [
        { name: 'productName', label: 'Product Name', type: 'text', required: true },
        { name: 'productCode', label: 'Product Code / SKU', type: 'text', required: true },
        { name: 'specVersion', label: 'Specification Version', type: 'text', required: true, hint: 'e.g., v1.0, Rev 3' },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        { name: 'preparedBy', label: 'Prepared By', type: 'text', required: true },
        { name: 'approvedBy', label: 'Approved By', type: 'text', required: true },
      ]},
      { title: 'Physical & Chemical Specifications', fields: [
        { name: 'appearance', label: 'Appearance', type: 'text', required: true },
        { name: 'colour', label: 'Colour (LOVIBOND / Gardner)', type: 'text' },
        { name: 'odour', label: 'Odour', type: 'text' },
        { name: 'purity', label: 'Purity / Assay (%)', type: 'text' },
        { name: 'moistureContent', label: 'Moisture Content (%, max)', type: 'text' },
        { name: 'ffa', label: 'Free Fatty Acid (%, max)', type: 'text' },
        { name: 'iv', label: 'Iodine Value (g I₂/100g)', type: 'text' },
        { name: 'saponificationValue', label: 'Saponification Value', type: 'text' },
        { name: 'otherSpecs', label: 'Other Key Parameters', type: 'textarea', hint: 'Any additional specification values' },
      ]},
      { title: 'Packaging & Storage', fields: [
        { name: 'packSize', label: 'Pack Size / Configuration', type: 'text', required: true, hint: 'e.g., 25 kg bag, 200 L drum, Flexi-tank' },
        { name: 'packagingMaterial', label: 'Packaging Material', type: 'text', required: true },
        { name: 'shelfLife', label: 'Shelf Life', type: 'text', required: true },
        { name: 'storageCondition', label: 'Storage Condition', type: 'select', required: true, options: ['Ambient (15–30°C)', 'Cool dry place', 'Refrigerated (2–8°C)', 'Away from direct sunlight', 'Inert atmosphere'] },
        { name: 'certifications', label: 'Product Certifications', type: 'textarea', hint: 'Halal, Kosher, RSPO, Organic, etc.' },
        { name: 'customerSignOff', label: 'Customer Sign-Off Status', type: 'select', required: true, options: ['Pending Customer Review', 'Customer Approved', 'Customer Requested Changes', 'Superseded'] },
      ]},
    ],
  },
};

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } } as const;
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } } as const;

export default function RNDFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = formCode?.toLowerCase() ?? '';
  const config = FORM_CONFIGS[key] ?? {
    title: 'R&D Form', module: 'R&D',
    sections: [{ title: 'Details', fields: [{ name: 'description', label: 'Description', type: 'textarea' as FieldType, required: true }] }],
  };

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      projectLead: user.fullName || '', initiatedBy: user.fullName || '',
      requestedBy: user.fullName || '', recordedBy: user.fullName || '',
      capturedBy: user.fullName || '', preparedBy: user.fullName || '',
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
    const id = `${(formCode || 'RND').toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`;
    toast.success(isDraft ? 'Draft saved.' : `${config.title} submitted (${id})`);
    if (!isDraft) navigate('/rnd/forms');
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/rnd/forms')} className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0"><FlaskConical className="h-5 w-5 text-violet-600" /></div>
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
        <Button variant="outline" onClick={() => navigate('/rnd/forms')} className="h-11 px-6">Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-11 px-6"><Save className="h-4 w-4 mr-2" />Save Draft</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-11 px-8">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button variant="outline" onClick={() => navigate('/rnd/forms')} className="h-14 flex-1">Cancel</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-14 flex-[2] text-base">
          {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
}
