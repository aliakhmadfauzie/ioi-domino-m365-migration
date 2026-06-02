import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileCode, Send, Save, Info, Server, Target, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useSharePointCompanies, useSharePointDepartments } from '@/hooks/use-sharepoint-config';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtAccess } from '@/generated/hooks/use-main-dbitext-access';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { cn } from '@/lib/utils';
import { FormSubmissionLayout, type FormConfig } from '@/components/forms/form-submission-layout';
import type { FormStep } from '@/components/multi-step-form';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: 'easeOut' as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const SYSTEMS = [
  { value: 'SAP_ECC', label: 'SAP ECC', isSAP: true },
  { value: 'SAP_BW', label: 'SAP BW', isSAP: true },
  { value: 'SAP_HANA', label: 'SAP S/4HANA', isSAP: true },
  { value: 'SAP_PI', label: 'SAP PI/PO', isSAP: true },
  { value: 'SAP_FIORI', label: 'SAP Fiori', isSAP: true },
  { value: 'SHAREPOINT', label: 'SharePoint', isSAP: false },
  { value: 'POWER_APPS', label: 'Power Apps', isSAP: false },
  { value: 'POWER_BI', label: 'Power BI', isSAP: false },
  { value: 'SQL_SERVER', label: 'SQL Server', isSAP: false },
  { value: 'EXCEL_VBA', label: 'Excel/VBA', isSAP: false },
  { value: 'WEB_APP', label: 'Web Application', isSAP: false },
  { value: 'MOBILE_APP', label: 'Mobile Application', isSAP: false },
  { value: 'LOTUS_NOTES', label: 'Lotus Notes', isSAP: false },
  { value: 'OTHER', label: 'Other', isSAP: false },
];

const FORM_CONFIG: FormConfig = {
  code: 'PRF',
  name: 'Program Request Form',
  basePath: '/it/forms/prf',
  initialStatus: 'CurrentstatusKey27',
  initialStage: 1,
};

const FORM_STEPS: FormStep[] = [
  { id: '0', name: 'Request', description: 'Submit your program request' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', description: 'Non-urgent, can wait' },
  { value: 'medium', label: 'Medium', description: 'Standard priority' },
  { value: 'high', label: 'High', description: 'Urgent, affects operations' },
  { value: 'critical', label: 'Critical', description: 'Business critical' },
];

export default function PRFNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMutation = useCreateMainDBIT();
  const createExtAccessMutation = useCreateMainDBITExtAccess();
  const [currentStep, setCurrentStep] = useState(0);
  const { companies, isLoading: companiesLoading } = useSharePointCompanies();
  const { departments, isLoading: departmentsLoading } = useSharePointDepartments();

  const [formData, setFormData] = useState({
    system: '',
    isSAP: false,
    sapClient: '',
    sapModule: '',
    company: '',
    department: '',
    requestorName: user?.fullName || '',
    requestorEmail: user?.userPrincipalName || '',
    phoneExt: '',
    priority: 'medium',
    objective: '',
    justification: '',
    currentProcess: '',
    expectedOutcome: '',
    deadline: '',
    attachments: '',
    ccEmails: '',
  });

  // Update requestor fields when user data loads asynchronously
  useEffect(() => {
    if (user?.fullName && !formData.requestorName) {
      setFormData((prev) => ({ ...prev, requestorName: user.fullName || '' }));
    }
    if (user?.userPrincipalName && !formData.requestorEmail) {
      setFormData((prev) => ({ ...prev, requestorEmail: user.userPrincipalName || '' }));
    }
  }, [user]);

  // Section tracking for progress indicator
  const sections = [
    { id: 'system', label: 'System Selection' },
    { id: 'requestor', label: 'Requestor Info' },
    { id: 'objective', label: 'Objective' },
    { id: 'additional', label: 'Additional' },
  ];
  const totalSections = sections.length;

  const handleSystemChange = (value: string) => {
    const selectedSystem = SYSTEMS.find((s) => s.value === value);
    setFormData({
      ...formData,
      system: value,
      isSAP: selectedSystem?.isSAP || false,
      sapClient: selectedSystem?.isSAP ? formData.sapClient : '',
      sapModule: selectedSystem?.isSAP ? formData.sapModule : '',
    });
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft) {
      if (!formData.system || !formData.company || !formData.department) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!formData.objective || !formData.justification) {
        toast.error('Please provide objective and justification');
        return;
      }
      if (formData.isSAP && !formData.sapClient) {
        toast.error('Please select SAP Client');
        return;
      }
    }

    try {
      const now = new Date();
      const submittedAt = now.toISOString();
      const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      const requestNo = `PRF-${ts}-${rand}`;

      const parentRecord = await createMutation.mutateAsync({
        title: requestNo,
        formcode: 'PRF',
        currentStatus: isDraft ? 'CurrentstatusKey3' : 'CurrentstatusKey27',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: submittedAt,
        company: formData.company || '',
        remarks: JSON.stringify({
          prfCA: 'Request',
          prfObjective: formData.objective,
          prfJustification: formData.justification,
          prfCurrentProcess: formData.currentProcess,
          prfExpectedOutcome: formData.expectedOutcome,
        }),
        workflowstage: isDraft ? 1 : 1,
        pRFRequestNo: requestNo,
        pRFRequestType: formData.system || '',
        pRFIsSAP: formData.isSAP ? 'Yes' : 'No',
        pRFSAPClient: formData.sapClient || '',
        pRFSAPModule: formData.sapModule || '',
        pRFDepartment: formData.department || '',
        pRFPriority: formData.priority || '',
        pRFDeadline: formData.deadline || '',
        pRFPhoneExt: formData.phoneExt || '',
        pRFCCEmails: formData.ccEmails || '',
      });

      try {
        await createExtAccessMutation.mutateAsync({
          title: `Workflow for ${requestNo}`,
          parentFormCode: 'PRF',
          parentRecord: {
            id: parentRecord.id,
            title: parentRecord.title,
          },
          pRFFinalStatus: isDraft ? 'Draft' : 'Request',
          pRFStatus1: isDraft ? 'Draft' : 'Pending',
          pRFDateSent: isDraft ? undefined : submittedAt,
          pRFDeptHead: '',
          pRFIsmgr: '',
          pRFIsmgr2: '',
          pRFRFC: formData.isSAP ? 'Yes' : 'No',
        });
      } catch (childError) {
        try {
          await MainDBITService.delete(String(parentRecord.id));
        } catch (deleteError) {
          console.error('[PRF] Failed to delete parent record after ExtAccess create failed:', deleteError);
        }
        throw childError;
      }

      toast.success(isDraft ? 'Draft saved successfully' : 'Program request submitted successfully');
      navigate('/it/my-submissions');
    } catch (error: unknown) {
      toast.error('Failed to submit request');
      console.error(error);
    }
  };

  return (
    <FormSubmissionLayout
      formConfig={FORM_CONFIG}
      steps={FORM_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      formData={formData}
      onFieldChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value as string }))}
      fields={[]}
      isSubmitting={createMutation.isPending || createExtAccessMutation.isPending}
      onSubmit={async () => handleSubmit(false)}
      onSaveDraft={async () => handleSubmit(true)}
      submissionResult={null}
      notificationSent={false}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* System Selection */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <CardTitle>System Selection</CardTitle>
                </div>
                <CardDescription>Select the system for your program request</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      System <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.system} onValueChange={handleSystemChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select system" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">SAP Systems</div>
                        {SYSTEMS.filter((s) => s.isSAP).map((system) => (
                          <SelectItem key={system.value} value={system.value}>
                            {system.label}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-t mt-1 pt-2">Other Systems</div>
                        {SYSTEMS.filter((s) => !s.isSAP).map((system) => (
                          <SelectItem key={system.value} value={system.value}>
                            {system.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.isSAP && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        SAP System Selected
                      </Badge>
                    </div>
                  )}
                </div>

                {/* SAP-specific fields - auto-shown when SAP system selected */}
                {formData.isSAP && (
                  <motion.div
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 400 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        SAP Client <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.sapClient} onValueChange={(v) => setFormData({ ...formData, sapClient: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SAP client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IEP">IEP (Production)</SelectItem>
                          <SelectItem value="IEQ">IEQ (Quality)</SelectItem>
                          <SelectItem value="IED">IED (Development)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">SAP Module</Label>
                      <Select value={formData.sapModule} onValueChange={(v) => setFormData({ ...formData, sapModule: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FI">FI (Financial Accounting)</SelectItem>
                          <SelectItem value="CO">CO (Controlling)</SelectItem>
                          <SelectItem value="MM">MM (Materials Management)</SelectItem>
                          <SelectItem value="SD">SD (Sales & Distribution)</SelectItem>
                          <SelectItem value="PP">PP (Production Planning)</SelectItem>
                          <SelectItem value="QM">QM (Quality Management)</SelectItem>
                          <SelectItem value="PM">PM (Plant Maintenance)</SelectItem>
                          <SelectItem value="HR">HR (Human Resources)</SelectItem>
                          <SelectItem value="WM">WM (Warehouse Management)</SelectItem>
                          <SelectItem value="ABAP">ABAP Development</SelectItem>
                          <SelectItem value="BASIS">BASIS</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Requestor Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Requestor Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company <span className="text-destructive">*</span></Label>
                    {companiesLoading ? (
                      <div className="h-10 bg-muted rounded-md animate-pulse" />
                    ) : (
                      <Select value={formData.company} onValueChange={(v) => setFormData({ ...formData, company: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder={companies.length === 0 ? 'No companies available' : 'Select company'} />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.length === 0 ? (
                            <div className="px-2 py-4 text-sm text-muted-foreground text-center">No companies loaded</div>
                          ) : (
                            companies.map((company) => (
                              <SelectItem key={company.code} value={company.name}>
                                {company.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Department <span className="text-destructive">*</span></Label>
                    {departmentsLoading ? (
                      <div className="h-10 bg-muted rounded-md animate-pulse" />
                    ) : (
                      <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder={departments.length === 0 ? 'No departments available' : 'Select department'} />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.length === 0 ? (
                            <div className="px-2 py-4 text-sm text-muted-foreground text-center">No departments loaded</div>
                          ) : (
                            departments.map((dept) => (
                              <SelectItem key={dept.code} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Requestor Name</Label>
                    <Input value={formData.requestorName} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={formData.requestorEmail} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Extension</Label>
                    <Input
                      value={formData.phoneExt}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phoneExt: e.target.value })}
                      placeholder="e.g., 1234"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {PRIORITY_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setFormData({ ...formData, priority: option.value })}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          formData.priority === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary active:border-primary'
                        )}
                      >
                        <div className="flex items-center gap-2 pointer-events-none">
                          <div className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0',
                            formData.priority === option.value ? 'border-primary bg-primary' : 'border-border'
                          )}>
                            {formData.priority === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Objective & Justification */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="bg-primary/5">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Objective & Justification</CardTitle>
                </div>
                <CardDescription>Clearly describe what you need and why</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>
                    Objective <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    value={formData.objective}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="What do you want to achieve with this program/development?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Justification <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    value={formData.justification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, justification: e.target.value })}
                    placeholder="Why is this development needed? What problem does it solve?"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Process (if any)</Label>
                  <Textarea
                    value={formData.currentProcess}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, currentProcess: e.target.value })}
                    placeholder="Describe the current process or workaround being used"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Outcome</Label>
                  <Textarea
                    value={formData.expectedOutcome}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                    placeholder="What results do you expect after implementation?"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Details */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Additional Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expected Deadline</Label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CC (Email addresses)</Label>
                    <Input
                      value={formData.ccEmails}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, ccEmails: e.target.value })}
                      placeholder="Separate multiple emails with comma"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => document.getElementById('prf-attachments')?.click()}
                    onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('prf-attachments')?.click(); }}
                  >
                    <input
                      type="file"
                      id="prf-attachments"
                      className="hidden"
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files;
                        if (files?.length) {
                          setFormData({ ...formData, attachments: Array.from(files).map(f => f.name).join(', ') });
                          toast.success(`${files.length} file(s) selected`);
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">Max file size: 10MB</p>
                    {formData.attachments && (
                      <p className="text-sm text-primary mt-2 font-medium">{formData.attachments}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
    </FormSubmissionLayout>
  );
}
