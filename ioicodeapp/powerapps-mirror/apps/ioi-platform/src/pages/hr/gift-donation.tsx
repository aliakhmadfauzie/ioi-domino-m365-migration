import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Gift,
  Save,
  Send,
  AlertCircle,
  FileText,
  Clock,
  Building2,
  DollarSign,
  Calendar,
  Users,
  ExternalLink,
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
  requestType: z.enum(['gift', 'donation', 'sponsorship'], { error: 'Select request type' }),
  requestorName: z.string().min(1, { error: 'Name is required' }),
  requestorId: z.string().min(1, { error: 'Employee ID is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  site: z.string().min(1, { error: 'Site is required' }),
  recipientName: z.string().min(1, { error: 'Recipient name is required' }),
  recipientOrganization: z.string().optional(),
  recipientRelationship: z.string().min(1, { error: 'Relationship is required' }),
  eventDate: z.string().min(1, { error: 'Event date is required' }),
  eventDescription: z.string().min(1, { error: 'Event description is required' }),
  estimatedValue: z.string().min(1, { error: 'Estimated value is required' }),
  currency: z.string().min(1, { error: 'Currency is required' }),
  purpose: z.string().min(1, { error: 'Purpose is required' }),
  justification: z.string().min(1, { error: 'Justification is required' }),
  attachments: z.string().optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type RequestStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected';
type RequestType = 'Gift' | 'Donation' | 'Sponsorship';

interface GDSRequest {
  id: string;
  type: RequestType;
  recipient: string;
  value: string;
  date: string;
  status: RequestStatus;
  approver: string;
}

const mockRequests: GDSRequest[] = [
  {
    id: 'GDSN-2025-001',
    type: 'Gift',
    recipient: 'Client ABC Sdn Bhd',
    value: 'RM 500',
    date: '2025-05-01',
    status: 'Pending',
    approver: 'Head of Department',
  },
  {
    id: 'GDSN-2025-002',
    type: 'Donation',
    recipient: 'Orphanage Home',
    value: 'RM 2,000',
    date: '2025-04-20',
    status: 'Approved',
    approver: 'Managing Director',
  },
  {
    id: 'GDSN-2025-003',
    type: 'Sponsorship',
    recipient: 'Local School Sports Day',
    value: 'RM 5,000',
    date: '2025-04-15',
    status: 'Approved',
    approver: 'CEO',
  },
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const variants: Record<RequestStatus, string> = {
    Draft: 'bg-secondary text-secondary-foreground',
    Pending: 'bg-primary/10 text-primary border border-primary/20',
    Approved: 'bg-accent text-accent-foreground',
    Rejected: 'bg-destructive text-destructive-foreground',
  };

  return <Badge className={variants[status]}>{status}</Badge>;
}

function TypeBadge({ type }: { type: RequestType }) {
  const icons: Record<RequestType, React.ReactNode> = {
    Gift: <Gift className="h-3 w-3" />,
    Donation: <DollarSign className="h-3 w-3" />,
    Sponsorship: <Users className="h-3 w-3" />,
  };

  return (
    <Badge variant="outline" className="gap-1">
      {icons[type]}
      {type}
    </Badge>
  );
}

export default function GiftDonationPage() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('form');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: 'gift',
      requestorName: user?.fullName || '',
      requestorId: '',
      department: '',
      site: '',
      currency: 'myr',
    },
  });

  const watchRequestType = form.watch('requestType');

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast.success('Gift/Donation/Sponsorship request submitted successfully');
    form.reset();
  };

  const onSaveDraft = () => {
    toast.info('Draft saved');
  };

  const getTypeTitle = () => {
    switch (watchRequestType) {
      case 'gift':
        return 'Gift Details';
      case 'donation':
        return 'Donation Details';
      case 'sponsorship':
        return 'Sponsorship Details';
      default:
        return 'Request Details';
    }
  };

  return (
    <HRLayout title="Gift, Donation & Sponsorship">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-accent/500/10 rounded-lg">
                <Gift className="h-6 w-6 text-accent-foreground" />
              </div>
              Gift, Donation & Sponsorship (GDSN)
            </h1>
            <p className="text-muted-foreground mt-1">
              Submit requests for corporate gifts, donations, or event sponsorships
            </p>
          </div>
        </motion.div>

        {/* Compliance Notice */}
        <Card className="border-l-4 border-l-amber-500 bg-accent/50/50 dark:bg-accent/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent-foreground mt-0.5" />
              <div>
                <p className="font-medium text-accent-foreground dark:text-accent-foreground">Compliance Reminder</p>
                <p className="text-sm text-accent-foreground dark:text-accent-foreground">
                  All gifts, donations, and sponsorships must comply with IOI Group's Anti-Bribery & Corruption Policy.
                  Requests above RM 1,000 require additional approval from Legal & Compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              {/* Request Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Type</CardTitle>
                  <CardDescription>Select the type of request you are making</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={form.watch('requestType')}
                    onValueChange={(val: 'gift' | 'donation' | 'sponsorship') => form.setValue('requestType', val)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="gift" id="gift" className="peer sr-only" />
                      <Label
                        htmlFor="gift"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <Gift className="h-8 w-8 mb-2 text-primary" />
                        <span className="font-medium">Gift</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Corporate gifts for clients or partners
                        </span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="donation" id="donation" className="peer sr-only" />
                      <Label
                        htmlFor="donation"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <DollarSign className="h-8 w-8 mb-2 text-primary" />
                        <span className="font-medium">Donation</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Charitable contributions & CSR activities
                        </span>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="sponsorship" id="sponsorship" className="peer sr-only" />
                      <Label
                        htmlFor="sponsorship"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <Users className="h-8 w-8 mb-2 text-primary" />
                        <span className="font-medium">Sponsorship</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Event or program sponsorships
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

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
                      {form.formState.errors.requestorName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.requestorName.message}
                        </p>
                      )}
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
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
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

              {/* Recipient & Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    {getTypeTitle()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name *</Label>
                      <Input
                        id="recipientName"
                        {...form.register('recipientName')}
                        placeholder="Person or organization name"
                      />
                      {form.formState.errors.recipientName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.recipientName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientOrganization">Organization (if applicable)</Label>
                      <Input
                        id="recipientOrganization"
                        {...form.register('recipientOrganization')}
                        placeholder="Company or organization"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientRelationship">Relationship *</Label>
                      <Select
                        value={form.watch('recipientRelationship') || ''}
                        onValueChange={(val: string) => form.setValue('recipientRelationship', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="vendor">Vendor/Supplier</SelectItem>
                          <SelectItem value="government">Government Agency</SelectItem>
                          <SelectItem value="ngo">NGO/Charity</SelectItem>
                          <SelectItem value="community">Community Organization</SelectItem>
                          <SelectItem value="educational">Educational Institution</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event/Delivery Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        {...form.register('eventDate')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDescription">Event/Occasion Description *</Label>
                    <Textarea
                      id="eventDescription"
                      {...form.register('eventDescription')}
                      placeholder="Describe the event or occasion for this request"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estimatedValue">Estimated Value *</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        {...form.register('estimatedValue')}
                        placeholder="Amount"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        value={form.watch('currency') || ''}
                        onValueChange={(val: string) => form.setValue('currency', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="myr">MYR (RM)</SelectItem>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="sgd">SGD (S$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Textarea
                      id="purpose"
                      {...form.register('purpose')}
                      placeholder="What is the purpose of this gift/donation/sponsorship?"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justification">Business Justification *</Label>
                    <Textarea
                      id="justification"
                      {...form.register('justification')}
                      placeholder="Explain why this expenditure is necessary and beneficial to the company"
                      rows={3}
                    />
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
                <CardTitle>My Requests</CardTitle>
                <CardDescription>Track status of your gift, donation, and sponsorship requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request: GDSRequest) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <TypeBadge type={request.type} />
                        </TableCell>
                        <TableCell>{request.recipient}</TableCell>
                        <TableCell>{request.value}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{request.approver}</TableCell>
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
