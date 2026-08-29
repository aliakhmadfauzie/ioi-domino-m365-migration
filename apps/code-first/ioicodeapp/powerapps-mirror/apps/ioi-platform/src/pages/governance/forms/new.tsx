import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Send, Loader2, Shield } from 'lucide-react';
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

const DEPTS = ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering', 'All Departments'];

const FORM_CONFIGS: Record<string, FormConfig> = {
  'pol-001': {
    title: 'Policy Register',
    description: 'Register a new corporate or departmental policy.',
    module: 'Policy Management',
    sections: [
      {
        title: 'Policy Details',
        fields: [
          { name: 'policyTitle', label: 'Policy Title', type: 'text', required: true },
          { name: 'policyCode', label: 'Policy Code / Reference', type: 'text', required: true, hint: 'e.g., GOV-POL-001' },
          { name: 'policyType', label: 'Policy Type', type: 'select', required: true, options: ['Corporate Policy', 'Departmental Policy', 'Standard Operating Procedure', 'Work Instruction', 'Guideline'] },
          { name: 'applicableDept', label: 'Applicable Department(s)', type: 'select', required: true, options: DEPTS },
          { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { name: 'reviewDate', label: 'Next Review Date', type: 'date', required: true },
        ],
      },
      {
        title: 'Content Summary',
        fields: [
          { name: 'objective', label: 'Policy Objective', type: 'textarea', required: true, hint: 'Briefly describe the purpose of this policy' },
          { name: 'scope', label: 'Scope', type: 'textarea', required: true, hint: 'Who and what does this policy apply to?' },
          { name: 'keyPoints', label: 'Key Provisions / Requirements', type: 'textarea', required: true },
          { name: 'documentLink', label: 'Document Link / SharePoint Path', type: 'text', hint: 'URL or path to the full policy document' },
        ],
      },
      {
        title: 'Ownership',
        fields: [
          { name: 'policyOwner', label: 'Policy Owner', type: 'text', required: true },
          { name: 'approvedBy', label: 'Approved By', type: 'text' },
          { name: 'version', label: 'Version', type: 'text', required: true, hint: 'e.g., 1.0' },
        ],
      },
    ],
  },
  'pol-002': {
    title: 'Policy Review',
    description: 'Document the periodic review of an existing policy.',
    module: 'Policy Management',
    sections: [
      {
        title: 'Policy Reference',
        fields: [
          { name: 'policyCode', label: 'Policy Code / Reference', type: 'text', required: true },
          { name: 'policyTitle', label: 'Policy Title', type: 'text', required: true },
          { name: 'currentVersion', label: 'Current Version', type: 'text', required: true },
          { name: 'reviewDate', label: 'Review Date', type: 'date', required: true },
          { name: 'reviewedBy', label: 'Reviewed By', type: 'text', required: true },
        ],
      },
      {
        title: 'Review Findings',
        fields: [
          { name: 'reviewOutcome', label: 'Review Outcome', type: 'select', required: true, options: ['No Changes Required', 'Minor Amendments', 'Major Revision Required', 'Policy to be Retired'] },
          { name: 'changesRequired', label: 'Changes Required', type: 'textarea', hint: 'Describe what changes are needed, if any' },
          { name: 'reason', label: 'Reason for Changes', type: 'textarea', hint: 'Regulatory update, process change, audit finding, etc.' },
          { name: 'nextReviewDate', label: 'Next Review Date', type: 'date', required: true },
          { name: 'newVersion', label: 'New Version (if revised)', type: 'text' },
        ],
      },
    ],
  },
  'pol-003': {
    title: 'Policy Exception Request',
    description: 'Request a temporary or permanent exemption from a policy.',
    module: 'Policy Management',
    sections: [
      {
        title: 'Policy Reference',
        fields: [
          { name: 'policyCode', label: 'Policy Code / Reference', type: 'text', required: true },
          { name: 'policyTitle', label: 'Policy Title', type: 'text', required: true },
          { name: 'affectedClause', label: 'Affected Clause / Section', type: 'text', required: true, hint: 'Specify the exact clause or section you are requesting an exception to' },
        ],
      },
      {
        title: 'Exception Details',
        fields: [
          { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
          { name: 'exceptionType', label: 'Exception Type', type: 'select', required: true, options: ['Temporary Exception', 'Permanent Exception', 'Conditional Exception'] },
          { name: 'startDate', label: 'Start Date', type: 'date', required: true },
          { name: 'endDate', label: 'End Date (if temporary)', type: 'date' },
          { name: 'justification', label: 'Business Justification', type: 'textarea', required: true, hint: 'Why is this exception necessary?' },
          { name: 'riskMitigation', label: 'Risk Mitigation Measures', type: 'textarea', required: true, hint: 'What controls will be put in place to manage the risk during the exception period?' },
        ],
      },
    ],
  },
  'com-001': {
    title: 'Compliance Assessment',
    description: 'Assess departmental compliance against applicable regulations.',
    module: 'Compliance',
    sections: [
      {
        title: 'Assessment Details',
        fields: [
          { name: 'department', label: 'Department', type: 'select', required: true, options: DEPTS },
          { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
          { name: 'assessedBy', label: 'Assessed By', type: 'text', required: true },
          { name: 'regulatoryArea', label: 'Regulatory Area', type: 'select', required: true, options: ['Labour Law', 'Environmental Regulation', 'Safety & Health (OSHA)', 'Data Protection (PDPA)', 'Financial Regulation', 'Industry Standard', 'Internal Policy'] },
          { name: 'referenceStandard', label: 'Reference Standard / Law', type: 'text', required: true, hint: 'e.g., OSHA 1994, ISO 14001, PDPA 2010' },
        ],
      },
      {
        title: 'Findings',
        fields: [
          { name: 'complianceStatus', label: 'Overall Compliance Status', type: 'select', required: true, options: ['Compliant', 'Partially Compliant', 'Non-Compliant'] },
          { name: 'nonConformities', label: 'Non-Conformities Identified', type: 'textarea', hint: 'List specific gaps or violations found' },
          { name: 'correctiveActions', label: 'Corrective Actions Required', type: 'textarea', hint: 'Actions to address identified gaps' },
          { name: 'targetDate', label: 'Target Completion Date', type: 'date' },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  'com-002': {
    title: 'Regulatory Register',
    description: 'Maintain a register of applicable laws and regulations.',
    module: 'Compliance',
    sections: [
      {
        title: 'Regulation Details',
        fields: [
          { name: 'regulationName', label: 'Regulation / Law Name', type: 'text', required: true },
          { name: 'regulationCode', label: 'Reference Code', type: 'text', required: true, hint: 'e.g., OSHA 1994, ISO 45001:2018' },
          { name: 'regulatoryBody', label: 'Issuing / Regulatory Body', type: 'text', required: true },
          { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { name: 'applicableDept', label: 'Applicable Department(s)', type: 'select', required: true, options: DEPTS },
          { name: 'complianceOwner', label: 'Compliance Owner', type: 'text', required: true },
        ],
      },
      {
        title: 'Requirements Summary',
        fields: [
          { name: 'requirements', label: 'Key Requirements', type: 'textarea', required: true, hint: 'Summarise the main obligations imposed by this regulation' },
          { name: 'currentStatus', label: 'Current Compliance Status', type: 'select', required: true, options: ['Compliant', 'Partially Compliant', 'Non-Compliant', 'Under Review'] },
          { name: 'lastReviewDate', label: 'Last Reviewed', type: 'date' },
          { name: 'nextReviewDate', label: 'Next Review Date', type: 'date', required: true },
        ],
      },
    ],
  },
  'com-003': {
    title: 'Legal Compliance Audit',
    description: 'Document results of legal and regulatory compliance audits.',
    module: 'Compliance',
    sections: [
      {
        title: 'Audit Information',
        fields: [
          { name: 'auditTitle', label: 'Audit Title', type: 'text', required: true },
          { name: 'auditDate', label: 'Audit Date', type: 'date', required: true },
          { name: 'auditorName', label: 'Lead Auditor', type: 'text', required: true },
          { name: 'auditorType', label: 'Auditor Type', type: 'select', required: true, options: ['Internal Auditor', 'External Auditor', 'Regulatory Authority', 'Third-Party Certifier'] },
          { name: 'department', label: 'Department / Scope', type: 'select', required: true, options: DEPTS },
          { name: 'regulatoryReference', label: 'Regulatory Reference', type: 'text', required: true },
        ],
      },
      {
        title: 'Audit Findings',
        fields: [
          { name: 'auditOutcome', label: 'Audit Outcome', type: 'select', required: true, options: ['Pass — No Findings', 'Pass — Minor Observations', 'Conditional Pass — Major Findings', 'Fail — Critical Non-Conformance'] },
          { name: 'findingsSummary', label: 'Findings Summary', type: 'textarea', required: true },
          { name: 'correctiveActions', label: 'Corrective Actions Required', type: 'textarea' },
          { name: 'closureDate', label: 'Expected Closure Date', type: 'date' },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  'rsk-001': {
    title: 'Risk Register',
    description: 'Identify and document organisational risks.',
    module: 'Risk Management',
    sections: [
      {
        title: 'Risk Identification',
        fields: [
          { name: 'riskTitle', label: 'Risk Title', type: 'text', required: true },
          { name: 'riskCategory', label: 'Risk Category', type: 'select', required: true, options: ['Strategic', 'Operational', 'Financial', 'Legal / Compliance', 'Reputational', 'Environmental', 'Technology', 'People'] },
          { name: 'department', label: 'Department / Business Unit', type: 'select', required: true, options: DEPTS },
          { name: 'riskOwner', label: 'Risk Owner', type: 'text', required: true },
          { name: 'identifiedDate', label: 'Date Identified', type: 'date', required: true },
        ],
      },
      {
        title: 'Risk Description',
        fields: [
          { name: 'riskDescription', label: 'Risk Description', type: 'textarea', required: true, hint: 'Describe the risk event and its potential causes' },
          { name: 'potentialImpact', label: 'Potential Impact', type: 'textarea', required: true, hint: 'What could happen if this risk materialises?' },
          { name: 'existingControls', label: 'Existing Controls', type: 'textarea', required: true, hint: 'What controls are currently in place to manage this risk?' },
        ],
      },
    ],
  },
  'rsk-002': {
    title: 'Risk Assessment',
    description: 'Assess likelihood, impact, and controls for identified risks.',
    module: 'Risk Management',
    sections: [
      {
        title: 'Risk Reference',
        fields: [
          { name: 'riskTitle', label: 'Risk Title', type: 'text', required: true },
          { name: 'riskOwner', label: 'Risk Owner', type: 'text', required: true },
          { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
          { name: 'assessedBy', label: 'Assessed By', type: 'text', required: true },
        ],
      },
      {
        title: 'Inherent Risk Rating',
        fields: [
          { name: 'inherentLikelihood', label: 'Inherent Likelihood', type: 'select', required: true, options: ['1 - Rare', '2 - Unlikely', '3 - Possible', '4 - Likely', '5 - Almost Certain'] },
          { name: 'inherentImpact', label: 'Inherent Impact', type: 'select', required: true, options: ['1 - Insignificant', '2 - Minor', '3 - Moderate', '4 - Major', '5 - Catastrophic'] },
        ],
      },
      {
        title: 'Residual Risk Rating',
        fields: [
          { name: 'controlsDescription', label: 'Additional Controls to Implement', type: 'textarea', hint: 'Controls beyond what currently exists' },
          { name: 'residualLikelihood', label: 'Residual Likelihood (after controls)', type: 'select', required: true, options: ['1 - Rare', '2 - Unlikely', '3 - Possible', '4 - Likely', '5 - Almost Certain'] },
          { name: 'residualImpact', label: 'Residual Impact (after controls)', type: 'select', required: true, options: ['1 - Insignificant', '2 - Minor', '3 - Moderate', '4 - Major', '5 - Catastrophic'] },
          { name: 'riskAcceptance', label: 'Risk Acceptance Decision', type: 'select', required: true, options: ['Accept', 'Treat', 'Transfer', 'Terminate'] },
          { name: 'nextReviewDate', label: 'Next Review Date', type: 'date', required: true },
        ],
      },
    ],
  },
  'rsk-003': {
    title: 'Risk Treatment Plan',
    description: 'Define and track actions to mitigate or accept identified risks.',
    module: 'Risk Management',
    sections: [
      {
        title: 'Risk Reference',
        fields: [
          { name: 'riskTitle', label: 'Risk Title', type: 'text', required: true },
          { name: 'riskOwner', label: 'Risk Owner', type: 'text', required: true },
          { name: 'treatmentStrategy', label: 'Treatment Strategy', type: 'select', required: true, options: ['Reduce Likelihood', 'Reduce Impact', 'Transfer Risk (Insurance)', 'Avoid Risk', 'Accept Risk'] },
        ],
      },
      {
        title: 'Treatment Actions',
        fields: [
          { name: 'actions', label: 'Treatment Actions', type: 'textarea', required: true, hint: 'List specific actions to implement this treatment strategy' },
          { name: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true },
          { name: 'startDate', label: 'Start Date', type: 'date', required: true },
          { name: 'targetDate', label: 'Target Completion Date', type: 'date', required: true },
          { name: 'estimatedCost', label: 'Estimated Cost (RM)', type: 'number' },
          { name: 'successCriteria', label: 'Success Criteria', type: 'textarea', required: true, hint: 'How will you measure whether the treatment has been effective?' },
          { name: 'progressUpdate', label: 'Progress Update', type: 'textarea' },
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

export default function GovernanceFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = formCode?.toLowerCase() ?? '';
  const config = FORM_CONFIGS[key] ?? {
    title: 'Governance Form',
    description: 'Complete all required fields below.',
    module: 'Governance',
    sections: [{ title: 'Details', fields: [{ name: 'description', label: 'Description', type: 'textarea' as FieldType, required: true }] }],
  };

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      policyOwner: user.fullName || '',
      reviewedBy: user.fullName || '',
      assessedBy: user.fullName || '',
      auditorName: user.fullName || '',
      riskOwner: user.fullName || '',
      assessedBy2: user.fullName || '',
      requestedBy: user.fullName || '',
      responsiblePerson: user.fullName || '',
      submittedBy: user.fullName || '',
      complianceOwner: user.fullName || '',
      ...prev,
    }));
  }, [user]);

  const handleChange = (name: string, value: string) => setFormData((prev) => ({ ...prev, [name]: value }));

  const generateId = () => {
    const code = (formCode || 'GOV').toUpperCase();
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
    if (!isDraft) navigate('/governance/forms');
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/governance/forms')} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-indigo-600" />
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
        <Button variant="outline" onClick={() => navigate('/governance/forms')} className="h-11 px-6">Cancel</Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-11 px-6">
          <Save className="h-4 w-4 mr-2" />Save Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-11 px-8">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button variant="outline" onClick={() => navigate('/governance/forms')} className="h-14 flex-1">Cancel</Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-14 flex-[2] text-base">
          {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
}
