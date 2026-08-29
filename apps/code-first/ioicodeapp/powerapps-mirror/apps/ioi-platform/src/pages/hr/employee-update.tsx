import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  UserCog,
  Save,
  Send,
  MapPin,
  Phone,
  Mail,
  Building2,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HRLayout } from '@/components/hr/hr-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  employeeId: z.string().min(1, { error: 'Employee ID is required' }),
  fullName: z.string().min(1, { error: 'Full name is required' }),
  icNumber: z.string().min(1, { error: 'IC number is required' }),
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().min(1, { error: 'Address is required' }),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  personalPhone: z.string().min(1, { error: 'Phone number is required' }),
  personalEmail: z.string().email({ error: 'Valid email required' }).optional().or(z.literal('')),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNo: z.string().optional(),
  epfNo: z.string().optional(),
  socsoNo: z.string().optional(),
  taxNo: z.string().optional(),
  site: z.string().min(1, { error: 'Site is required' }),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type RequestStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected';

interface UpdateRequest {
  id: string;
  employeeName: string;
  updateType: string;
  submittedDate: string;
  status: RequestStatus;
  changedFields: string[];
}

const mockRequests: UpdateRequest[] = [
  {
    id: 'EPDU-2025-001',
    employeeName: 'Ahmad Bin Hassan',
    updateType: 'Address Change',
    submittedDate: '2025-05-01',
    status: 'Pending',
    changedFields: ['Address', 'Postcode', 'City'],
  },
  {
    id: 'EPDU-2025-002',
    employeeName: 'Siti Aminah',
    updateType: 'Bank Details',
    submittedDate: '2025-04-28',
    status: 'Approved',
    changedFields: ['Bank Name', 'Account Number'],
  },
  {
    id: 'EPDU-2025-003',
    employeeName: 'Rajesh Kumar',
    updateType: 'Emergency Contact',
    submittedDate: '2025-04-25',
    status: 'Approved',
    changedFields: ['Emergency Contact Name', 'Emergency Contact Phone'],
  },
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const variants: Record<RequestStatus, string> = {
    Draft: 'bg-secondary text-secondary-foreground',
    Pending: 'bg-primary/10 text-primary border border-primary/20',
    Approved: 'bg-accent text-accent-foreground',
    Rejected: 'bg-destructive text-destructive-foreground',
  };

  return (
    <Badge className={variants[status]}>
      {status}
    </Badge>
  );
}

export default function EmployeeUpdatePage() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('form');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: '',
      fullName: user?.fullName || '',
      icNumber: '',
      site: '',
      address: '',
      personalPhone: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast.success('Personal detail update request submitted successfully');
    form.reset();
    setCurrentStep(1);
  };

  const onSaveDraft = () => {
    toast.info('Draft saved');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const stepTitles = ['Personal Info', 'Contact Details', 'Financial Info', 'Review & Submit'];

  return (
    <HRLayout title="Employee Personal Detail Update">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              Employee Personal Detail Update (EPDU)
            </h1>
            <p className="text-muted-foreground mt-1">
              Update your personal information and submit for HR approval
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
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
                {stepTitles.map((title, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep > idx + 1
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === idx + 1
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > idx + 1 ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                    </div>
                    <span className="mt-2 text-xs font-medium text-muted-foreground">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>
                          Basic personal details and identification
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="employeeId">Employee ID *</Label>
                            <Input
                              id="employeeId"
                              {...form.register('employeeId')}
                              placeholder="e.g., IOI-12345"
                            />
                            {form.formState.errors.employeeId && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {form.formState.errors.employeeId.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name (as per IC) *</Label>
                            <Input
                              id="fullName"
                              {...form.register('fullName')}
                              placeholder="Enter full name"
                            />
                            {form.formState.errors.fullName && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {form.formState.errors.fullName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="icNumber">IC Number *</Label>
                            <Input
                              id="icNumber"
                              {...form.register('icNumber')}
                              placeholder="e.g., 901234-12-1234"
                            />
                            {form.formState.errors.icNumber && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {form.formState.errors.icNumber.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              {...form.register('dateOfBirth')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maritalStatus">Marital Status</Label>
                            <Select
                              value={form.watch('maritalStatus') || ''}
                              onValueChange={(val: string) => form.setValue('maritalStatus', val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Select
                              value={form.watch('nationality') || ''}
                              onValueChange={(val: string) => form.setValue('nationality', val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="malaysian">Malaysian</SelectItem>
                                <SelectItem value="singaporean">Singaporean</SelectItem>
                                <SelectItem value="indonesian">Indonesian</SelectItem>
                                <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                                <SelectItem value="myanmar">Myanmar</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                                <SelectValue placeholder="Select site" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="prai">Prai (Penang)</SelectItem>
                                <SelectItem value="johor">Pasir Gudang (Johor)</SelectItem>
                              </SelectContent>
                            </Select>
                            {form.formState.errors.site && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {form.formState.errors.site.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          Contact Details
                        </CardTitle>
                        <CardDescription>
                          Address, phone, and emergency contact information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Residential Address *</Label>
                            <Textarea
                              id="address"
                              {...form.register('address')}
                              placeholder="Enter full address"
                              rows={3}
                            />
                            {form.formState.errors.address && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {form.formState.errors.address.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input id="city" {...form.register('city')} placeholder="City" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Select
                                value={form.watch('state') || ''}
                                onValueChange={(val: string) => form.setValue('state', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="penang">Penang</SelectItem>
                                  <SelectItem value="johor">Johor</SelectItem>
                                  <SelectItem value="selangor">Selangor</SelectItem>
                                  <SelectItem value="kl">Kuala Lumpur</SelectItem>
                                  <SelectItem value="perak">Perak</SelectItem>
                                  <SelectItem value="kedah">Kedah</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postcode">Postcode</Label>
                              <Input id="postcode" {...form.register('postcode')} placeholder="Postcode" />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            Phone & Email
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="personalPhone">Personal Phone *</Label>
                              <Input
                                id="personalPhone"
                                {...form.register('personalPhone')}
                                placeholder="e.g., 012-3456789"
                              />
                              {form.formState.errors.personalPhone && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {form.formState.errors.personalPhone.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="personalEmail">Personal Email</Label>
                              <Input
                                id="personalEmail"
                                type="email"
                                {...form.register('personalEmail')}
                                placeholder="personal@email.com"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <h4 className="font-medium mb-4 flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Emergency Contact
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="emergencyContactName">Contact Name</Label>
                              <Input
                                id="emergencyContactName"
                                {...form.register('emergencyContactName')}
                                placeholder="Full name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                              <Input
                                id="emergencyContactPhone"
                                {...form.register('emergencyContactPhone')}
                                placeholder="Phone number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="emergencyContactRelation">Relationship</Label>
                              <Select
                                value={form.watch('emergencyContactRelation') || ''}
                                onValueChange={(val: string) => form.setValue('emergencyContactRelation', val)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="spouse">Spouse</SelectItem>
                                  <SelectItem value="parent">Parent</SelectItem>
                                  <SelectItem value="sibling">Sibling</SelectItem>
                                  <SelectItem value="child">Child</SelectItem>
                                  <SelectItem value="friend">Friend</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          Financial Information
                        </CardTitle>
                        <CardDescription>
                          Bank, EPF, SOCSO, and tax details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Select
                              value={form.watch('bankName') || ''}
                              onValueChange={(val: string) => form.setValue('bankName', val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="maybank">Maybank</SelectItem>
                                <SelectItem value="cimb">CIMB Bank</SelectItem>
                                <SelectItem value="publicbank">Public Bank</SelectItem>
                                <SelectItem value="rhb">RHB Bank</SelectItem>
                                <SelectItem value="hongleong">Hong Leong Bank</SelectItem>
                                <SelectItem value="ambank">AmBank</SelectItem>
                                <SelectItem value="bankislam">Bank Islam</SelectItem>
                                <SelectItem value="bsn">BSN</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bankAccountNo">Bank Account Number</Label>
                            <Input
                              id="bankAccountNo"
                              {...form.register('bankAccountNo')}
                              placeholder="Account number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="epfNo">EPF Number</Label>
                            <Input
                              id="epfNo"
                              {...form.register('epfNo')}
                              placeholder="EPF number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="socsoNo">SOCSO Number</Label>
                            <Input
                              id="socsoNo"
                              {...form.register('socsoNo')}
                              placeholder="SOCSO number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="taxNo">Tax Number (LHDN)</Label>
                            <Input
                              id="taxNo"
                              {...form.register('taxNo')}
                              placeholder="Tax reference number"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Review & Submit
                        </CardTitle>
                        <CardDescription>
                          Review your changes before submitting for approval
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Employee ID:</span>
                              <p className="font-medium">{form.watch('employeeId') || '-'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Full Name:</span>
                              <p className="font-medium">{form.watch('fullName') || '-'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">IC Number:</span>
                              <p className="font-medium">{form.watch('icNumber') || '-'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Site:</span>
                              <p className="font-medium">
                                {form.watch('site') === 'prai' ? 'Prai (Penang)' : form.watch('site') === 'johor' ? 'Pasir Gudang (Johor)' : '-'}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Address:</span>
                              <p className="font-medium">{form.watch('address') || '-'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <p className="font-medium">{form.watch('personalPhone') || '-'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Bank:</span>
                              <p className="font-medium">{form.watch('bankName') || '-'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="remarks">Additional Remarks</Label>
                          <Textarea
                            id="remarks"
                            {...form.register('remarks')}
                            placeholder="Any additional notes for HR..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onSaveDraft} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={nextStep} className="gap-2">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
                      <Send className="h-4 w-4" />
                      Submit for Approval
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Update Requests</CardTitle>
                <CardDescription>Track the status of your personal detail update requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Update Type</TableHead>
                      <TableHead>Changed Fields</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request: UpdateRequest) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.updateType}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {request.changedFields.map((field: string) => (
                              <Badge key={field} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{request.submittedDate}</TableCell>
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
