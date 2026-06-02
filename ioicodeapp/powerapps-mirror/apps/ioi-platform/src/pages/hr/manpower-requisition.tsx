import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Users,
  Save,
  Send,
  AlertCircle,
  FileText,
  Clock,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { HRLayout } from '@/components/hr/hr-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser } from '@/hooks/use-user';

const formSchema = z.object({
  requestorName: z.string().min(1, { error: 'Name is required' }),
  requestorId: z.string().min(1, { error: 'Employee ID is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  site: z.string().min(1, { error: 'Site is required' }),
  positionTitle: z.string().min(1, { error: 'Position title is required' }),
  vacancyType: z.enum(['replacement', 'new', 'contract'], { error: 'Select vacancy type' }),
  numberOfPositions: z.string().min(1, { error: 'Number of positions is required' }),
  employmentType: z.string().min(1, { error: 'Employment type is required' }),
  requiredDate: z.string().min(1, { error: 'Required date is required' }),
  reportingTo: z.string().min(1, { error: 'Reporting to is required' }),
  salaryRange: z.string().optional(),
  educationLevel: z.string().optional(),
  experienceYears: z.string().optional(),
  skills: z.string().min(1, { error: 'Required skills are needed' }),
  responsibilities: z.string().min(1, { error: 'Job responsibilities are required' }),
  justification: z.string().min(1, { error: 'Business justification is required' }),
  budgetApproved: z.string().optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type RequestStatus = 'Draft' | 'Pending HOD' | 'Pending HR' | 'Approved' | 'Rejected' | 'Filled';

interface MRFRequest {
  id: string;
  position: string;
  department: string;
  vacancies: number;
  type: string;
  requestDate: string;
  status: RequestStatus;
}

const mockRequests: MRFRequest[] = [
  {
    id: 'MPRF-2025-001',
    position: 'Process Engineer',
    department: 'Production',
    vacancies: 2,
    type: 'New',
    requestDate: '2025-04-15',
    status: 'Approved',
  },
  {
    id: 'MPRF-2025-002',
    position: 'QC Analyst',
    department: 'QC',
    vacancies: 1,
    type: 'Replacement',
    requestDate: '2025-04-28',
    status: 'Pending HR',
  },
  {
    id: 'MPRF-2025-003',
    position: 'IT Support',
    department: 'IT',
    vacancies: 1,
    type: 'Contract',
    requestDate: '2025-05-01',
    status: 'Pending HOD',
  },
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const variants: Record<RequestStatus, string> = {
    Draft: 'bg-secondary text-secondary-foreground',
    'Pending HOD': 'bg-primary/10 text-primary border border-primary/20',
    'Pending HR': 'bg-primary/10 text-primary border border-primary/20',
    Approved: 'bg-accent text-accent-foreground',
    Rejected: 'bg-destructive text-destructive-foreground',
    Filled: 'bg-accent text-accent-foreground',
  };

  return <Badge className={variants[status]}>{status}</Badge>;
}

export default function ManpowerRequisitionPage() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('form');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestorName: user?.fullName || '',
      requestorId: '',
      department: '',
      site: '',
      vacancyType: 'new',
      numberOfPositions: '1',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast.success('Manpower Requisition Form submitted successfully');
    form.reset();
  };

  const onSaveDraft = () => {
    toast.info('Draft saved');
  };

  return (
    <HRLayout title="Manpower Requisition Form">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-secondary/500/10 rounded-lg">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
              Manpower Requisition Form (MPRF)
            </h1>
            <p className="text-muted-foreground mt-1">
              Submit requests for new hires, replacements, or contract staff
            </p>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="form" className="gap-2">
              <FileText className="h-4 w-4" />
              New Request
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Requestor Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Requestor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requestorName">Requestor Name *</Label>
                      <Input
                        id="requestorName"
                        {...form.register('requestorName')}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requestorId">Employee ID *</Label>
                      <Input
                        id="requestorId"
                        {...form.register('requestorId')}
                        placeholder="IOI-12345"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={form.watch('department') || ''}
                        onValueChange={(val: string) => form.setValue('department', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="qa">QA</SelectItem>
                          <SelectItem value="qc">QC</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="she">SHE</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site">Site *</Label>
                      <Select
                        value={form.watch('site') || ''}
                        onValueChange={(val: string) => form.setValue('site', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prai">Prai (Penang)</SelectItem>
                          <SelectItem value="johor">Pasir Gudang (Johor)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vacancy Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Vacancy Type</CardTitle>
                  <CardDescription>Select the type of vacancy</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={form.watch('vacancyType')}
                    onValueChange={(val: 'replacement' | 'new' | 'contract') => form.setValue('vacancyType', val)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="replacement" id="replacement" className="peer sr-only" />
                      <Label
                        htmlFor="replacement"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <Users className="h-8 w-8 mb-2 text-primary" />
                        <span className="font-medium">Replacement</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Fill existing position (resignation/transfer)
                        </span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="new" id="new" className="peer sr-only" />
                      <Label
                        htmlFor="new"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <Briefcase className="h-8 w-8 mb-2 text-primary" />
                        <span className="font-medium">New Position</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Create new headcount
                        </span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="contract" id="contract" className="peer sr-only" />
                      <Label
                        htmlFor="contract"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <Clock className="h-8 w-8 mb-2 text-primary" />
                        <span className="font-medium">Contract</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Temporary/project-based hiring
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Position Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Position Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="positionTitle">Position Title *</Label>
                      <Input
                        id="positionTitle"
                        {...form.register('positionTitle')}
                        placeholder="e.g., Process Engineer"
                      />
                      {form.formState.errors.positionTitle && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.positionTitle.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfPositions">Number of Positions *</Label>
                      <Input
                        id="numberOfPositions"
                        type="number"
                        min={1}
                        {...form.register('numberOfPositions')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type *</Label>
                      <Select
                        value={form.watch('employmentType') || ''}
                        onValueChange={(val: string) => form.setValue('employmentType', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="parttime">Part-time</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requiredDate">Required By *</Label>
                      <Input
                        id="requiredDate"
                        type="date"
                        {...form.register('requiredDate')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reportingTo">Reporting To *</Label>
                      <Input
                        id="reportingTo"
                        {...form.register('reportingTo')}
                        placeholder="Manager/Supervisor name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salaryRange">Salary Range</Label>
                      <Select
                        value={form.watch('salaryRange') || ''}
                        onValueChange={(val: string) => form.setValue('salaryRange', val)}
                      >
                        <SelectTrigger>
                          <DollarSign className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1500-2500">RM 1,500 - RM 2,500</SelectItem>
                          <SelectItem value="2500-4000">RM 2,500 - RM 4,000</SelectItem>
                          <SelectItem value="4000-6000">RM 4,000 - RM 6,000</SelectItem>
                          <SelectItem value="6000-8000">RM 6,000 - RM 8,000</SelectItem>
                          <SelectItem value="8000+">RM 8,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="educationLevel">Minimum Education</Label>
                      <Select
                        value={form.watch('educationLevel') || ''}
                        onValueChange={(val: string) => form.setValue('educationLevel', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spm">SPM</SelectItem>
                          <SelectItem value="stpm">STPM/Diploma</SelectItem>
                          <SelectItem value="degree">Degree</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Select
                        value={form.watch('experienceYears') || ''}
                        onValueChange={(val: string) => form.setValue('experienceYears', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Fresh Graduate</SelectItem>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills & Competencies *</Label>
                    <Textarea
                      id="skills"
                      {...form.register('skills')}
                      placeholder="List required technical skills, certifications, languages, etc."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Key Responsibilities *</Label>
                    <Textarea
                      id="responsibilities"
                      {...form.register('responsibilities')}
                      placeholder="Describe the main duties and responsibilities of this position"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Justification */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Justification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="justification">Justification for Hiring *</Label>
                    <Textarea
                      id="justification"
                      {...form.register('justification')}
                      placeholder="Explain the business need for this position..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetApproved">Budget Approved</Label>
                      <Select
                        value={form.watch('budgetApproved') || ''}
                        onValueChange={(val: string) => form.setValue('budgetApproved', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes - Budget Approved</SelectItem>
                          <SelectItem value="no">No - Pending Budget Approval</SelectItem>
                          <SelectItem value="partial">Partial Approval</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Additional Remarks</Label>
                    <Textarea
                      id="remarks"
                      {...form.register('remarks')}
                      placeholder="Any additional information..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onSaveDraft} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Submit for Approval
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Requisitions</CardTitle>
                <CardDescription>Track status of your manpower requisition forms</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Vacancies</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request: MRFRequest) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.position}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.vacancies}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.type}</Badge>
                        </TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
}
