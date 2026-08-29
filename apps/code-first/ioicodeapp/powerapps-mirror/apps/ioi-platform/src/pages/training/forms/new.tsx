import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Send, Loader2, GraduationCap } from 'lucide-react';
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

const FORM_CONFIGS: Record<string, FormConfig> = {
  tna: {
    title: 'Training Needs Analysis',
    description: 'Identify skills gaps and recommended training for a department.',
    module: 'Planning',
    sections: [
      {
        title: 'Analysis Details',
        fields: [
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'year', label: 'Year', type: 'select', required: true, options: ['2025', '2026', '2027'] },
          { name: 'analysisType', label: 'Analysis Type', type: 'select', required: true, options: ['Skills Gap', 'Compliance', 'Performance Improvement', 'Career Development', 'Succession Planning'] },
          { name: 'priority', label: 'Priority', type: 'select', required: true, options: ['High', 'Medium', 'Low'] },
        ],
      },
      {
        title: 'Gap Assessment',
        fields: [
          { name: 'skillsGap', label: 'Skills Gap Identified', type: 'textarea', required: true, hint: 'Describe the specific skills or competencies that need improvement' },
          { name: 'recommendedTraining', label: 'Recommended Training Programme(s)', type: 'textarea', required: true, hint: 'List training programmes that address the identified gaps' },
          { name: 'targetParticipants', label: 'Target Participants', type: 'text', required: true, hint: 'e.g., All engineers in Dept X, Team leads' },
          { name: 'estimatedCost', label: 'Estimated Cost (RM)', type: 'number' },
        ],
      },
      {
        title: 'Submission',
        fields: [
          { name: 'assessedBy', label: 'Assessed By', type: 'text', required: true },
          { name: 'remarks', label: 'Additional Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  atp: {
    title: 'Annual Training Plan',
    description: 'Departmental training plan with courses and budget allocation.',
    module: 'Planning',
    sections: [
      {
        title: 'Plan Details',
        fields: [
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'year', label: 'Plan Year', type: 'select', required: true, options: ['2025', '2026', '2027'] },
          { name: 'totalCourses', label: 'Total Planned Courses', type: 'number', required: true },
          { name: 'totalParticipants', label: 'Total Planned Participants', type: 'number', required: true },
        ],
      },
      {
        title: 'Budget',
        fields: [
          { name: 'totalBudget', label: 'Total Training Budget (RM)', type: 'number', required: true },
          { name: 'internalBudget', label: 'Internal Training Budget (RM)', type: 'number' },
          { name: 'externalBudget', label: 'External Training Budget (RM)', type: 'number' },
          { name: 'hrdfClaim', label: 'HRDF Claimable (RM)', type: 'number' },
        ],
      },
      {
        title: 'Programme Summary',
        fields: [
          { name: 'programmeSummary', label: 'Programme Summary', type: 'textarea', required: true, hint: 'Briefly describe the planned training programmes' },
          { name: 'submittedBy', label: 'Submitted By', type: 'text', required: true },
        ],
      },
    ],
  },
  tr: {
    title: 'Training Request',
    description: 'Request a specific training programme for staff.',
    module: 'Planning',
    sections: [
      {
        title: 'Training Details',
        fields: [
          { name: 'trainingTitle', label: 'Training Title', type: 'text', required: true },
          { name: 'trainingType', label: 'Training Type', type: 'select', required: true, options: ['Technical', 'Soft Skills', 'Compliance / Regulatory', 'Management', 'Leadership', 'Safety', 'IT / Systems'] },
          { name: 'provider', label: 'Training Provider', type: 'text', hint: 'Leave blank if not yet identified' },
          { name: 'objectives', label: 'Training Objectives', type: 'textarea', required: true, hint: 'What will participants learn or be able to do after the training?' },
        ],
      },
      {
        title: 'Schedule & Participants',
        fields: [
          { name: 'proposedDate', label: 'Proposed Date', type: 'date', required: true },
          { name: 'duration', label: 'Duration', type: 'select', required: true, options: ['Half Day', '1 Day', '2 Days', '3 Days', '1 Week', 'Online / Self-Paced'] },
          { name: 'location', label: 'Location', type: 'select', required: true, options: ['Training Room A', 'Training Room B', 'Auditorium', 'External Venue', 'Online'] },
          { name: 'participants', label: 'Number of Participants', type: 'number', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
        ],
      },
      {
        title: 'Cost & Justification',
        fields: [
          { name: 'estimatedCost', label: 'Estimated Cost (RM)', type: 'number' },
          { name: 'hrdfClaimable', label: 'HRDF Claimable', type: 'select', options: ['Yes', 'No', 'Not Sure'] },
          { name: 'justification', label: 'Justification', type: 'textarea', required: true, hint: 'Why is this training needed?' },
          { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        ],
      },
    ],
  },
  cr: {
    title: 'Course Registration',
    description: 'Register an employee for an approved course or workshop.',
    module: 'Courses',
    sections: [
      {
        title: 'Participant Details',
        fields: [
          { name: 'participantName', label: 'Participant Name', type: 'text', required: true },
          { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'jobTitle', label: 'Job Title', type: 'text' },
        ],
      },
      {
        title: 'Course Details',
        fields: [
          { name: 'courseName', label: 'Course Name', type: 'text', required: true },
          { name: 'courseProvider', label: 'Course Provider', type: 'text', required: true },
          { name: 'courseDate', label: 'Course Date', type: 'date', required: true },
          { name: 'duration', label: 'Duration', type: 'select', required: true, options: ['Half Day', '1 Day', '2 Days', '3 Days', '1 Week', 'Online / Self-Paced'] },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'registrationFee', label: 'Registration Fee (RM)', type: 'number' },
        ],
      },
      {
        title: 'Approval',
        fields: [
          { name: 'registeredBy', label: 'Registered By', type: 'text', required: true },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
  ta: {
    title: 'Training Attendance',
    description: 'Record attendance for a completed training session.',
    module: 'Courses',
    sections: [
      {
        title: 'Session Details',
        fields: [
          { name: 'courseName', label: 'Course / Training Name', type: 'text', required: true },
          { name: 'trainer', label: 'Trainer / Facilitator', type: 'text', required: true },
          { name: 'courseDate', label: 'Course Date', type: 'date', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
        ],
      },
      {
        title: 'Attendance Summary',
        fields: [
          { name: 'totalRegistered', label: 'Total Registered', type: 'number', required: true },
          { name: 'totalAttended', label: 'Total Attended', type: 'number', required: true },
          { name: 'absentees', label: 'Absentees (Names)', type: 'textarea', hint: 'List names of registered staff who did not attend' },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
          { name: 'recordedBy', label: 'Recorded By', type: 'text', required: true },
        ],
      },
    ],
  },
  ce: {
    title: 'Course Evaluation',
    description: 'Post-training evaluation by participants.',
    module: 'Courses',
    sections: [
      {
        title: 'Course Information',
        fields: [
          { name: 'courseName', label: 'Course Name', type: 'text', required: true },
          { name: 'trainer', label: 'Trainer / Facilitator', type: 'text', required: true },
          { name: 'courseDate', label: 'Course Date', type: 'date', required: true },
          { name: 'participantName', label: 'Participant Name', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
        ],
      },
      {
        title: 'Rating',
        fields: [
          { name: 'contentQuality', label: 'Content Quality', type: 'select', required: true, options: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Below Average', '1 - Poor'] },
          { name: 'trainerEffectiveness', label: 'Trainer Effectiveness', type: 'select', required: true, options: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Below Average', '1 - Poor'] },
          { name: 'facilitiesRating', label: 'Facilities & Environment', type: 'select', required: true, options: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Below Average', '1 - Poor'] },
          { name: 'overallRating', label: 'Overall Rating', type: 'select', required: true, options: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Below Average', '1 - Poor'] },
          { name: 'recommendation', label: 'Would you recommend this training?', type: 'select', required: true, options: ['Highly Recommend', 'Recommend', 'Neutral', 'Do Not Recommend'] },
        ],
      },
      {
        title: 'Feedback',
        fields: [
          { name: 'strengths', label: 'Training Strengths', type: 'textarea' },
          { name: 'improvements', label: 'Areas for Improvement', type: 'textarea' },
          { name: 'additionalComments', label: 'Additional Comments', type: 'textarea' },
        ],
      },
    ],
  },
  ccr: {
    title: 'Certification Renewal',
    description: 'Track and request renewal of expiring professional certifications.',
    module: 'Certification',
    sections: [
      {
        title: 'Employee Details',
        fields: [
          { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'jobTitle', label: 'Job Title', type: 'text' },
        ],
      },
      {
        title: 'Certification Details',
        fields: [
          { name: 'certificationName', label: 'Certification Name', type: 'text', required: true },
          { name: 'issuingBody', label: 'Issuing Body / Authority', type: 'text', required: true },
          { name: 'currentExpiryDate', label: 'Current Expiry Date', type: 'date', required: true },
          { name: 'renewalDate', label: 'Required Renewal Date', type: 'date', required: true },
          { name: 'renewalCost', label: 'Estimated Renewal Cost (RM)', type: 'number' },
        ],
      },
      {
        title: 'Justification',
        fields: [
          { name: 'justification', label: 'Justification for Renewal', type: 'textarea', required: true, hint: 'Why is this certification required for the role?' },
          { name: 'requestedBy', label: 'Requested By', type: 'text', required: true },
        ],
      },
    ],
  },
  cc: {
    title: 'Competency Certification',
    description: 'Assess and certify employee competency levels.',
    module: 'Certification',
    sections: [
      {
        title: 'Employee Details',
        fields: [
          { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
        ],
      },
      {
        title: 'Competency Assessment',
        fields: [
          { name: 'competency', label: 'Competency Area', type: 'text', required: true, hint: 'e.g., PLC Programming, Forklift Operation, SAP Finance' },
          { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
          { name: 'assessedBy', label: 'Assessed By', type: 'text', required: true },
          { name: 'assessmentMethod', label: 'Assessment Method', type: 'select', required: true, options: ['Written Exam', 'Practical Test', 'Observation', 'Interview', 'Portfolio Review'] },
          { name: 'level', label: 'Competency Level Achieved', type: 'select', required: true, options: ['Basic', 'Intermediate', 'Advanced', 'Expert'] },
          { name: 'result', label: 'Assessment Result', type: 'select', required: true, options: ['Pass', 'Fail', 'Conditional Pass'] },
        ],
      },
      {
        title: 'Remarks',
        fields: [
          { name: 'remarks', label: 'Assessor Remarks', type: 'textarea' },
          { name: 'nextAssessmentDate', label: 'Next Assessment Date', type: 'date' },
        ],
      },
    ],
  },
  cer: {
    title: 'Certificate Request',
    description: 'Request an official certificate of completion or attendance.',
    module: 'Certification',
    sections: [
      {
        title: 'Request Details',
        fields: [
          { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
        ],
      },
      {
        title: 'Certificate Information',
        fields: [
          { name: 'courseName', label: 'Course / Programme Name', type: 'text', required: true },
          { name: 'completionDate', label: 'Completion Date', type: 'date', required: true },
          { name: 'certificateType', label: 'Certificate Type', type: 'select', required: true, options: ['Certificate of Completion', 'Certificate of Attendance', 'Certificate of Achievement', 'Certificate of Participation'] },
          { name: 'urgency', label: 'Urgency', type: 'select', required: true, options: ['Normal (5–7 working days)', 'Urgent (1–2 working days)'] },
          { name: 'reason', label: 'Reason for Request', type: 'textarea', required: true },
        ],
      },
    ],
  },
  etr: {
    title: 'External Training Request',
    description: 'Request approval for attending an external training programme.',
    module: 'External Training',
    sections: [
      {
        title: 'Training Details',
        fields: [
          { name: 'trainingTitle', label: 'Training / Programme Title', type: 'text', required: true },
          { name: 'provider', label: 'Training Provider', type: 'text', required: true },
          { name: 'location', label: 'Training Location', type: 'text', required: true },
          { name: 'courseDate', label: 'Course Date(s)', type: 'date', required: true },
          { name: 'duration', label: 'Duration', type: 'select', required: true, options: ['Half Day', '1 Day', '2 Days', '3 Days', '1 Week', 'More than 1 Week'] },
        ],
      },
      {
        title: 'Participants',
        fields: [
          { name: 'participantName', label: 'Participant Name', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
          { name: 'additionalParticipants', label: 'Additional Participants', type: 'textarea', hint: 'List any other staff attending the same programme' },
        ],
      },
      {
        title: 'Cost & Claims',
        fields: [
          { name: 'registrationFee', label: 'Registration Fee (RM)', type: 'number', required: true },
          { name: 'travelCost', label: 'Estimated Travel Cost (RM)', type: 'number' },
          { name: 'accommodationCost', label: 'Estimated Accommodation Cost (RM)', type: 'number' },
          { name: 'hrdfClaimable', label: 'HRDF Claimable', type: 'select', required: true, options: ['Yes', 'No', 'Not Sure'] },
          { name: 'justification', label: 'Business Justification', type: 'textarea', required: true, hint: 'How does this training benefit the employee and the company?' },
        ],
      },
    ],
  },
  etb: {
    title: 'External Training Budget',
    description: 'Submit and track departmental external training budget.',
    module: 'External Training',
    sections: [
      {
        title: 'Budget Details',
        fields: [
          { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
          { name: 'year', label: 'Budget Year', type: 'select', required: true, options: ['2025', '2026', '2027'] },
          { name: 'totalBudget', label: 'Total External Training Budget (RM)', type: 'number', required: true },
          { name: 'hrdfAllocation', label: 'HRDF Levy Allocation (RM)', type: 'number' },
          { name: 'selfFundedAllocation', label: 'Company Self-Funded (RM)', type: 'number' },
        ],
      },
      {
        title: 'Breakdown',
        fields: [
          { name: 'breakdown', label: 'Programme Breakdown', type: 'textarea', required: true, hint: 'List the planned external programmes and their estimated costs' },
          { name: 'submittedBy', label: 'Submitted By', type: 'text', required: true },
          { name: 'remarks', label: 'Remarks', type: 'textarea' },
        ],
      },
    ],
  },
};

const DEFAULT_CONFIG: FormConfig = {
  title: 'Training Form',
  description: 'Complete all required fields below.',
  module: 'Training',
  sections: [
    {
      title: 'Form Details',
      fields: [
        { name: 'department', label: 'Department', type: 'select', required: true, options: ['Production', 'Maintenance', 'QA', 'QC', 'IT', 'HR', 'Finance', 'SHE', 'Logistics', 'Warehouse', 'Administration', 'Engineering'] },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'submittedBy', label: 'Submitted By', type: 'text', required: true },
      ],
    },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

export default function TrainingFormNewPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = formCode ? (FORM_CONFIGS[formCode.toLowerCase()] ?? DEFAULT_CONFIG) : DEFAULT_CONFIG;

  // Pre-fill submitter fields with the logged-in user
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      submittedBy: user.fullName || '',
      requestedBy: user.fullName || '',
      assessedBy: user.fullName || '',
      recordedBy: user.fullName || '',
      registeredBy: user.fullName || '',
      ...prev,
    }));
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateId = () => {
    const code = (formCode || 'TD').toUpperCase();
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
    if (!isDraft) navigate('/training/forms');
  };

  const renderField = (field: { name: string; label: string; type: FieldType; required?: boolean; options?: string[]; hint?: string }) => (
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
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : field.type === 'textarea' ? (
        <Textarea
          id={field.name}
          value={formData[field.name] || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(field.name, e.target.value)}
          rows={3}
          className="resize-none"
        />
      ) : (
        <Input
          id={field.name}
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          value={formData[field.name] || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value)}
          className="h-11"
        />
      )}
      {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
    </div>
  );

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-28 max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/training/forms')} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{config.title}</h1>
            <p className="text-sm text-muted-foreground">{config.module}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 uppercase">{formCode}</Badge>
      </motion.div>

      {/* Sections */}
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

      {/* Actions — desktop sticky bar */}
      <div className="hidden md:flex gap-3 justify-end sticky bottom-6 bg-background/80 backdrop-blur p-4 -mx-6 rounded-lg border shadow-lg">
        <Button variant="outline" onClick={() => navigate('/training/forms')} className="h-11 px-6">
          Cancel
        </Button>
        <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-11 px-6">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-11 px-8">
          {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button variant="outline" onClick={() => navigate('/training/forms')} className="h-14 flex-1">
          Cancel
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-14 flex-[2] text-base">
          {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </motion.div>
  );
}
