import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Shirt,
  Save,
  Send,
  AlertCircle,
  FileText,
  Clock,
  Plus,
  Trash2,
  Package,
  User,
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
  employeeName: z.string().min(1, { error: 'Name is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  site: z.string().min(1, { error: 'Site is required' }),
  requestType: z.string().min(1, { error: 'Request type is required' }),
  reason: z.string().min(1, { error: 'Reason is required' }),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UniformItem {
  id: string;
  type: string;
  size: string;
  quantity: number;
}

type RequestStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Delivered';

interface UniformRequest {
  id: string;
  requestDate: string;
  type: string;
  items: string;
  status: RequestStatus;
  deliveryDate: string | null;
}

const mockRequests: UniformRequest[] = [
  {
    id: 'COMP-2025-001',
    requestDate: '2025-04-15',
    type: 'New Employee',
    items: 'Shirt (M) x2, Pants (32) x2',
    status: 'Delivered',
    deliveryDate: '2025-04-20',
  },
  {
    id: 'COMP-2025-002',
    requestDate: '2025-04-28',
    type: 'Replacement',
    items: 'Safety Boots (42) x1',
    status: 'Approved',
    deliveryDate: null,
  },
  {
    id: 'COMP-2025-003',
    requestDate: '2025-05-01',
    type: 'Size Change',
    items: 'Shirt (L) x2',
    status: 'Pending',
    deliveryDate: null,
  },
];

const uniformTypes = [
  { value: 'shirt', label: 'Company Shirt', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { value: 'pants', label: 'Work Pants', sizes: ['28', '30', '32', '34', '36', '38', '40'] },
  { value: 'jacket', label: 'Jacket', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { value: 'boots', label: 'Safety Boots', sizes: ['38', '39', '40', '41', '42', '43', '44', '45'] },
  { value: 'cap', label: 'Cap', sizes: ['One Size'] },
  { value: 'ppe', label: 'PPE Set', sizes: ['S', 'M', 'L', 'XL'] },
];

function StatusBadge({ status }: { status: RequestStatus }) {
  const variants: Record<RequestStatus, string> = {
    Draft: 'bg-secondary text-secondary-foreground',
    Pending: 'bg-primary/10 text-primary border border-primary/20',
    Approved: 'bg-accent text-accent-foreground',
    Rejected: 'bg-destructive text-destructive-foreground',
    Delivered: 'bg-accent text-accent-foreground',
  };

  return <Badge className={variants[status]}>{status}</Badge>;
}

export default function UniformRequestPage() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('form');
  const [items, setItems] = useState<UniformItem[]>([{ id: '1', type: '', size: '', quantity: 1 }]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: '',
      employeeName: user?.fullName || '',
      department: '',
      site: '',
      requestType: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (items.some((item: UniformItem) => !item.type || !item.size)) {
      toast.error('Please complete all uniform item details');
      return;
    }
    console.log('Form submitted:', data, items);
    toast.success('Uniform request submitted successfully');
    form.reset();
    setItems([{ id: '1', type: '', size: '', quantity: 1 }]);
  };

  const onSaveDraft = () => {
    toast.info('Draft saved');
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), type: '', size: '', quantity: 1 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item: UniformItem) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof UniformItem, value: string | number) => {
    setItems(
      items.map((item: UniformItem) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const getAvailableSizes = (type: string) => {
    const uniformType = uniformTypes.find((u) => u.value === type);
    return uniformType?.sizes || [];
  };

  return (
    <HRLayout title="Uniform Request">
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
                <Shirt className="h-6 w-6 text-secondary-foreground" />
              </div>
              Company Uniform Request (COMP)
            </h1>
            <p className="text-muted-foreground mt-1">
              Request new uniforms, replacements, or size changes
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
              {/* Employee Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Employee Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        {...form.register('employeeId')}
                        placeholder="IOI-12345"
                      />
                      {form.formState.errors.employeeId && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.employeeId.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeName">Full Name *</Label>
                      <Input
                        id="employeeName"
                        {...form.register('employeeName')}
                        placeholder="Full name"
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

              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requestType">Request Type *</Label>
                      <Select
                        value={form.watch('requestType') || ''}
                        onValueChange={(val: string) => form.setValue('requestType', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Employee</SelectItem>
                          <SelectItem value="replacement">Replacement (Worn Out)</SelectItem>
                          <SelectItem value="size">Size Change</SelectItem>
                          <SelectItem value="additional">Additional Set</SelectItem>
                          <SelectItem value="damaged">Damaged/Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Request *</Label>
                      <Textarea
                        id="reason"
                        {...form.register('reason')}
                        placeholder="Explain why you need the uniform..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Uniform Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5 text-primary" />
                    Uniform Items
                  </CardTitle>
                  <CardDescription>Add the uniform items you need</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item: UniformItem, index: number) => (
                    <div key={item.id} className="flex items-end gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label>Item Type</Label>
                        <Select
                          value={item.type}
                          onValueChange={(val: string) => {
                            updateItem(item.id, 'type', val);
                            updateItem(item.id, 'size', '');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniformTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-32 space-y-2">
                        <Label>Size</Label>
                        <Select
                          value={item.size}
                          onValueChange={(val: string) => updateItem(item.id, 'size', val)}
                          disabled={!item.type}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableSizes(item.type).map((size: string) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-24 space-y-2">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={item.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                          }
                        />
                      </div>

                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addItem} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Remarks */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Additional Remarks</Label>
                    <Textarea
                      id="remarks"
                      {...form.register('remarks')}
                      placeholder="Any special requirements or notes..."
                      rows={3}
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
                  Submit Request
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Uniform Requests</CardTitle>
                <CardDescription>Track status of your uniform requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request: UniformRequest) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.items}</TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                        <TableCell>{request.deliveryDate || '-'}</TableCell>
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
