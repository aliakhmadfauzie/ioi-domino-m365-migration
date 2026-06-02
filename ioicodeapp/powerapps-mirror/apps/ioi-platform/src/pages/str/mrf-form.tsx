/**
 * MRF Form - Material Requisition Form Approval
 * Complete 130-field form with all workflow stages
 * 
 * Sections:
 * 1. Information (INO, Title, etc.)
 * 2. Requisition Details (Items, Quantities, Specs)
 * 3. Warehouse Review
 * 4. Site Coordinator Review
 * 5. CFO Approval
 * 6. Warehouse Admin
 * 7. Logistics & Receiving
 */

import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Save,
  Send,
  CheckCircle,
  Circle,
  Package,
  Building2,
  MapPin,
  User,
  Calendar,
  Truck,
  ClipboardCheck,
  DollarSign,
  Warehouse,
  Users,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { useCreateSTRSubmission } from '@/hooks/use-str-submissions';
import { STR_SITES, STR_ENVIRONMENTS, STR_MODULES } from '@/config/str-constants';
import { getActiveDepartments } from '@/config/departments';
import { toast } from 'sonner';

const MODULE = STR_MODULES.M2;

// MRF Form workflow steps
const FORM_STEPS = [
  { id: 'info', label: 'Information', icon: FileText, description: 'Basic request information' },
  { id: 'requisition', label: 'Requisition', icon: Package, description: 'Items and materials' },
  { id: 'warehouse-review', label: 'Warehouse Review', icon: Warehouse, description: 'Availability check' },
  { id: 'coordinator', label: 'Site Coordinator', icon: Users, description: 'Coordinator approval' },
  { id: 'cfo', label: 'CFO Approval', icon: DollarSign, description: 'Financial approval' },
  { id: 'warehouse-admin', label: 'Warehouse Admin', icon: ClipboardCheck, description: 'Processing' },
  { id: 'logistics', label: 'Logistics', icon: Truck, description: 'Delivery & receiving' },
] as const;

// Item categories for requisition
const ITEM_CATEGORIES = [
  'Raw Materials',
  'Packaging Materials',
  'Spare Parts',
  'Safety Equipment',
  'Office Supplies',
  'Chemicals',
  'Electrical Components',
  'Mechanical Parts',
  'Tools & Equipment',
  'Consumables',
  'Other',
];

// Priority levels
const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-secondary text-secondary-foreground' },
  { value: 'normal', label: 'Normal', color: 'bg-primary/10 text-primary' },
  { value: 'high', label: 'High', color: 'bg-accent text-accent-foreground' },
  { value: 'urgent', label: 'Urgent', color: 'bg-destructive text-destructive-foreground' },
];

// Unit of measure options
const UOM_OPTIONS = [
  'Each', 'Box', 'Case', 'Pallet', 'Kg', 'Lbs', 'Meter', 'Feet', 'Liter', 'Gallon', 'Roll', 'Set', 'Pair', 'Bundle',
];

// Requisition line item type
interface LineItem {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
  specifications: string;
  preferredVendor: string;
  alternateVendor: string;
  remarks: string;
  // Warehouse fields
  warehouseAvailable: boolean;
  warehouseQty: number;
  warehouseLocation: string;
  // Recommendation
  recommended: boolean;
  recommendedQty: number;
}

// Form data type
interface MRFFormData {
  // Section 1: Information
  site: string;
  environment: string;
  department: string;
  costCenter: string;
  projectCode: string;
  requestDate: Date | undefined;
  requiredDate: Date | undefined;
  priority: string;
  requestType: string;
  justification: string;
  additionalNotes: string;
  
  // Section 2: Requisition Details
  lineItems: LineItem[];
  totalEstimatedCost: number;
  budgetAvailable: boolean;
  budgetCode: string;
  
  // Section 3: Warehouse Review
  warehouseReviewDate: Date | undefined;
  warehouseReviewer: string;
  warehouseComments: string;
  stockCheckComplete: boolean;
  alternativesOffered: boolean;
  
  // Section 4: Site Coordinator Review
  coordinatorReviewDate: Date | undefined;
  coordinatorName: string;
  coordinatorApproval: string;
  coordinatorComments: string;
  priorityOverride: string;
  
  // Section 5: CFO Approval
  cfoReviewDate: Date | undefined;
  cfoName: string;
  cfoApproval: string;
  cfoComments: string;
  budgetImpact: string;
  costCenterVerified: boolean;
  
  // Section 6: Warehouse Admin
  warehouseAdminDate: Date | undefined;
  warehouseAdminName: string;
  poNumber: string;
  poDate: Date | undefined;
  vendorSelected: string;
  vendorContact: string;
  expectedDeliveryDate: Date | undefined;
  shippingMethod: string;
  trackingNumber: string;
  
  // Section 7: Logistics & Receiving
  receivingDate: Date | undefined;
  receivedBy: string;
  deliveryCondition: string;
  quantityReceived: number;
  discrepancyNotes: string;
  inspectionComplete: boolean;
  qualityCheckPass: boolean;
  storageLocation: string;
  inventoryUpdated: boolean;
}

const createEmptyLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  itemCode: '',
  description: '',
  category: '',
  quantity: 1,
  uom: 'Each',
  unitPrice: 0,
  totalPrice: 0,
  specifications: '',
  preferredVendor: '',
  alternateVendor: '',
  remarks: '',
  warehouseAvailable: false,
  warehouseQty: 0,
  warehouseLocation: '',
  recommended: false,
  recommendedQty: 0,
});

const initialFormData: MRFFormData = {
  site: 'PRAI',
  environment: 'PROD',
  department: '',
  costCenter: '',
  projectCode: '',
  requestDate: new Date(),
  requiredDate: undefined,
  priority: 'normal',
  requestType: 'standard',
  justification: '',
  additionalNotes: '',
  lineItems: [createEmptyLineItem()],
  totalEstimatedCost: 0,
  budgetAvailable: false,
  budgetCode: '',
  warehouseReviewDate: undefined,
  warehouseReviewer: '',
  warehouseComments: '',
  stockCheckComplete: false,
  alternativesOffered: false,
  coordinatorReviewDate: undefined,
  coordinatorName: '',
  coordinatorApproval: 'pending',
  coordinatorComments: '',
  priorityOverride: '',
  cfoReviewDate: undefined,
  cfoName: '',
  cfoApproval: 'pending',
  cfoComments: '',
  budgetImpact: '',
  costCenterVerified: false,
  warehouseAdminDate: undefined,
  warehouseAdminName: '',
  poNumber: '',
  poDate: undefined,
  vendorSelected: '',
  vendorContact: '',
  expectedDeliveryDate: undefined,
  shippingMethod: '',
  trackingNumber: '',
  receivingDate: undefined,
  receivedBy: '',
  deliveryCondition: 'good',
  quantityReceived: 0,
  discrepancyNotes: '',
  inspectionComplete: false,
  qualityCheckPass: false,
  storageLocation: '',
  inventoryUpdated: false,
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

export default function MRFFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMutation = useCreateSTRSubmission();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<MRFFormData>(initialFormData);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<LineItem | null>(null);
  
  // Calculate totals
  const calculateTotals = useCallback(() => {
    const total = formData.lineItems.reduce((sum: number, item: LineItem) => sum + item.totalPrice, 0);
    setFormData((prev: MRFFormData) => ({ ...prev, totalEstimatedCost: total }));
  }, [formData.lineItems]);
  
  const updateField = <K extends keyof MRFFormData>(field: K, value: MRFFormData[K]) => {
    setFormData((prev: MRFFormData) => ({ ...prev, [field]: value }));
  };
  
  const addLineItem = () => {
    setEditingItem(createEmptyLineItem());
    setShowItemDialog(true);
  };
  
  const saveLineItem = (item: LineItem) => {
    const itemWithTotal = { ...item, totalPrice: item.quantity * item.unitPrice };
    setFormData((prev: MRFFormData) => {
      const existingIndex = prev.lineItems.findIndex((i: LineItem) => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...prev.lineItems];
        updated[existingIndex] = itemWithTotal;
        return { ...prev, lineItems: updated };
      }
      return { ...prev, lineItems: [...prev.lineItems, itemWithTotal] };
    });
    setShowItemDialog(false);
    setEditingItem(null);
    setTimeout(calculateTotals, 0);
  };
  
  const removeLineItem = (id: string) => {
    setFormData((prev: MRFFormData) => ({
      ...prev,
      lineItems: prev.lineItems.filter((i: LineItem) => i.id !== id),
    }));
    setTimeout(calculateTotals, 0);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev: File[]) => [...prev, ...newFiles]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
  };
  
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await createMutation.mutateAsync({
        FormType: 'MRFAPP',
        Site: formData.site as typeof STR_SITES[number],
        EnvironmentTag: formData.environment as typeof STR_ENVIRONMENTS[number],
        Department: formData.department,
        Requestor: user?.fullName || 'Unknown',
        RequestorEmail: user?.userPrincipalName || '',
        Comments: formData.additionalNotes,
        CurrentStatus: 'Draft',
        RequestDate: formData.requestDate || new Date(),
        Justification: formData.justification,
        ItemDescription: formData.lineItems.map((i: LineItem) => i.description).join(', '),
        Quantity: formData.lineItems.reduce((sum: number, i: LineItem) => sum + i.quantity, 0),
        RequestTitle: formData.lineItems[0]?.description || 'Material Requisition',
        Priority: formData.priority,
        RequiredDate: formData.requiredDate,
        RequestType: formData.requestType,
        CostCenter: formData.costCenter,
        ProjectCode: formData.projectCode,
        BudgetCode: formData.budgetCode,
        BudgetAvailable: formData.budgetAvailable,
        TotalEstimatedCost: formData.totalEstimatedCost,
        lineItems: formData.lineItems,
      });
      toast.success('Draft saved successfully');
      navigate('/str/requisition');
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }
    if (formData.lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }
    
    try {
      await createMutation.mutateAsync({
        FormType: 'MRFAPP',
        Site: formData.site as typeof STR_SITES[number],
        EnvironmentTag: formData.environment as typeof STR_ENVIRONMENTS[number],
        Department: formData.department,
        Requestor: user?.fullName || 'Unknown',
        RequestorEmail: user?.userPrincipalName || '',
        Comments: formData.additionalNotes,
        CurrentStatus: 'Submitted',
        RequestDate: formData.requestDate || new Date(),
        SubmittedBy: user?.fullName || 'Unknown',
        SubmittedDate: new Date(),
        Justification: formData.justification,
        ItemDescription: formData.lineItems.map((i: LineItem) => i.description).join(', '),
        Quantity: formData.lineItems.reduce((sum: number, i: LineItem) => sum + i.quantity, 0),
        RequestTitle: formData.lineItems[0]?.description || 'Material Requisition',
        Priority: formData.priority,
        RequiredDate: formData.requiredDate,
        RequestType: formData.requestType,
        CostCenter: formData.costCenter,
        ProjectCode: formData.projectCode,
        BudgetCode: formData.budgetCode,
        BudgetAvailable: formData.budgetAvailable,
        TotalEstimatedCost: formData.totalEstimatedCost,
        lineItems: formData.lineItems,
      });
      toast.success('MRF submitted successfully');
      navigate('/str/requisition');
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep((prev: number) => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev: number) => prev - 1);
    }
  };
  
  // Render date picker helper
  const renderDatePicker = (label: string, value: Date | undefined, onChange: (date: Date | undefined) => void, required?: boolean) => (
    <div>
      <Label className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "mt-2 w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
  
  // Section 1: Information
  const renderInformationSection = () => (
    <motion.div
      key="info"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      {/* Requestor Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Requestor Information
          </CardTitle>
          <CardDescription>Auto-filled from Microsoft 365</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="mt-1 font-medium">{user?.fullName || 'Loading...'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="mt-1 font-medium">{user?.userPrincipalName || 'Loading...'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Location & Department */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Location & Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="site" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Site <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.site} onValueChange={(v: string) => updateField('site', v)}>
                <SelectTrigger id="site" className="mt-2">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {STR_SITES.map((site: string) => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="environment">Environment</Label>
              <Select value={formData.environment} onValueChange={(v: string) => updateField('environment', v)}>
                <SelectTrigger id="environment" className="mt-2">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {STR_ENVIRONMENTS.map((env: string) => (
                    <SelectItem key={env} value={env}>{env}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="department" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Department <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.department} onValueChange={(v: string) => updateField('department', v)}>
                <SelectTrigger id="department" className="mt-2">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {getActiveDepartments().map((dept: { code: string; name: string }) => (
                    <SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="costCenter">Cost Center</Label>
              <Input
                id="costCenter"
                value={formData.costCenter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('costCenter', e.target.value)}
                placeholder="Enter cost center"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="projectCode">Project Code</Label>
              <Input
                id="projectCode"
                value={formData.projectCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('projectCode', e.target.value)}
                placeholder="Enter project code"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderDatePicker('Request Date', formData.requestDate, (d: Date | undefined) => updateField('requestDate', d))}
            {renderDatePicker('Required By Date', formData.requiredDate, (d: Date | undefined) => updateField('requiredDate', d), true)}
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(v: string) => updateField('priority', v)}>
                <SelectTrigger id="priority" className="mt-2">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((p: { value: string; label: string }) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="requestType">Request Type</Label>
              <Select value={formData.requestType} onValueChange={(v: string) => updateField('requestType', v)}>
                <SelectTrigger id="requestType" className="mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="project">Project-based</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="justification">Justification <span className="text-destructive">*</span></Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('justification', e.target.value)}
              placeholder="Provide detailed justification for this requisition"
              className="mt-2"
              rows={4}
            />
          </div>
          
          <div className="mt-4">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('additionalNotes', e.target.value)}
              placeholder="Any additional information or special instructions"
              className="mt-2"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Section 2: Requisition Details
  const renderRequisitionSection = () => (
    <motion.div
      key="requisition"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Line Items
              </CardTitle>
              <CardDescription>Add materials and items to requisition</CardDescription>
            </div>
            <Button onClick={addLineItem} className={MODULE.color}>
              <Plus className="mr-2 h-4 w-4" />Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.lineItems.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No items added yet</p>
              <Button variant="outline" className="mt-4" onClick={addLineItem}>
                <Plus className="mr-2 h-4 w-4" />Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.lineItems.map((item: LineItem, index: number) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.description || 'Untitled Item'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.itemCode && `${item.itemCode} • `}
                          {item.category || 'No category'} • {item.quantity} {item.uom}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    {item.specifications && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Specs: {item.specifications}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingItem(item);
                        setShowItemDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeLineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <span className="font-medium">Total Estimated Cost</span>
                <span className="text-xl font-bold">
                  ${formData.lineItems.reduce((sum: number, i: LineItem) => sum + i.totalPrice, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Budget Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="budgetAvailable"
                checked={formData.budgetAvailable}
                onCheckedChange={(checked: boolean) => updateField('budgetAvailable', checked)}
              />
              <Label htmlFor="budgetAvailable">Budget Available</Label>
            </div>
            
            <div>
              <Label htmlFor="budgetCode">Budget Code</Label>
              <Input
                id="budgetCode"
                value={formData.budgetCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('budgetCode', e.target.value)}
                placeholder="Enter budget code"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <CardDescription>Upload specifications, quotes, or supporting documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed p-6 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag and drop files here, or</p>
              <label className="mt-2 inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
                  Browse files
                </span>
              </label>
            </div>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file: File, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Section 3: Warehouse Review
  const renderWarehouseReviewSection = () => (
    <motion.div
      key="warehouse-review"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Warehouse Review Stage</AlertTitle>
        <AlertDescription>
          This section is completed by the Warehouse team to verify stock availability.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Stock Availability Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderDatePicker('Review Date', formData.warehouseReviewDate, (d: Date | undefined) => updateField('warehouseReviewDate', d))}
            
            <div>
              <Label htmlFor="warehouseReviewer">Reviewer Name</Label>
              <Input
                id="warehouseReviewer"
                value={formData.warehouseReviewer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('warehouseReviewer', e.target.value)}
                placeholder="Enter reviewer name"
                className="mt-2"
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stockCheckComplete"
                checked={formData.stockCheckComplete}
                onCheckedChange={(checked: boolean) => updateField('stockCheckComplete', checked)}
              />
              <Label htmlFor="stockCheckComplete">Stock Check Complete</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alternativesOffered"
                checked={formData.alternativesOffered}
                onCheckedChange={(checked: boolean) => updateField('alternativesOffered', checked)}
              />
              <Label htmlFor="alternativesOffered">Alternatives Offered (if applicable)</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="warehouseComments">Warehouse Comments</Label>
            <Textarea
              id="warehouseComments"
              value={formData.warehouseComments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('warehouseComments', e.target.value)}
              placeholder="Enter any comments or notes about stock availability"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Per-item warehouse check */}
      <Card>
        <CardHeader>
          <CardTitle>Item Availability Details</CardTitle>
          <CardDescription>Stock status for each requested item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.lineItems.map((item: LineItem, index: number) => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{item.description || `Item ${index + 1}`}</p>
                    <p className="text-sm text-muted-foreground">Requested: {item.quantity} {item.uom}</p>
                  </div>
                  <Badge variant={item.warehouseAvailable ? 'default' : 'secondary'}>
                    {item.warehouseAvailable ? 'In Stock' : 'Not Available'}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs">Available Qty</Label>
                    <Input
                      type="number"
                      value={item.warehouseQty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...formData.lineItems];
                        updated[index] = { ...item, warehouseQty: parseInt(e.target.value) || 0 };
                        updateField('lineItems', updated);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Warehouse Location</Label>
                    <Input
                      value={item.warehouseLocation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updated = [...formData.lineItems];
                        updated[index] = { ...item, warehouseLocation: e.target.value };
                        updateField('lineItems', updated);
                      }}
                      placeholder="e.g., A-12-3"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.warehouseAvailable}
                        onCheckedChange={(checked: boolean) => {
                          const updated = [...formData.lineItems];
                          updated[index] = { ...item, warehouseAvailable: checked };
                          updateField('lineItems', updated);
                        }}
                      />
                      <Label className="text-xs">Available</Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Section 4: Site Coordinator Review
  const renderCoordinatorSection = () => (
    <motion.div
      key="coordinator"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Site Coordinator Review</AlertTitle>
        <AlertDescription>
          This section is completed by the Site Coordinator to verify and approve the requisition.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Coordinator Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderDatePicker('Review Date', formData.coordinatorReviewDate, (d: Date | undefined) => updateField('coordinatorReviewDate', d))}
            
            <div>
              <Label htmlFor="coordinatorName">Coordinator Name</Label>
              <Input
                id="coordinatorName"
                value={formData.coordinatorName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('coordinatorName', e.target.value)}
                placeholder="Enter coordinator name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="coordinatorApproval">Approval Decision</Label>
              <Select value={formData.coordinatorApproval} onValueChange={(v: string) => updateField('coordinatorApproval', v)}>
                <SelectTrigger id="coordinatorApproval" className="mt-2">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="revision">Needs Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priorityOverride">Priority Override</Label>
              <Select value={formData.priorityOverride || formData.priority} onValueChange={(v: string) => updateField('priorityOverride', v)}>
                <SelectTrigger id="priorityOverride" className="mt-2">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((p: { value: string; label: string }) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="coordinatorComments">Comments</Label>
            <Textarea
              id="coordinatorComments"
              value={formData.coordinatorComments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('coordinatorComments', e.target.value)}
              placeholder="Enter approval comments or feedback"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Section 5: CFO Approval
  const renderCFOSection = () => (
    <motion.div
      key="cfo"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>CFO Approval</AlertTitle>
        <AlertDescription>
          This section is completed by the CFO for financial approval of requisitions above threshold.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderDatePicker('Review Date', formData.cfoReviewDate, (d: Date | undefined) => updateField('cfoReviewDate', d))}
            
            <div>
              <Label htmlFor="cfoName">CFO Name</Label>
              <Input
                id="cfoName"
                value={formData.cfoName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('cfoName', e.target.value)}
                placeholder="Enter CFO name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="cfoApproval">Approval Decision</Label>
              <Select value={formData.cfoApproval} onValueChange={(v: string) => updateField('cfoApproval', v)}>
                <SelectTrigger id="cfoApproval" className="mt-2">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="escalated">Escalated to CEO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budgetImpact">Budget Impact Assessment</Label>
              <Select value={formData.budgetImpact} onValueChange={(v: string) => updateField('budgetImpact', v)}>
                <SelectTrigger id="budgetImpact" className="mt-2">
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal Impact</SelectItem>
                  <SelectItem value="moderate">Moderate Impact</SelectItem>
                  <SelectItem value="significant">Significant Impact</SelectItem>
                  <SelectItem value="critical">Critical - Requires Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox
              id="costCenterVerified"
              checked={formData.costCenterVerified}
              onCheckedChange={(checked: boolean) => updateField('costCenterVerified', checked)}
            />
            <Label htmlFor="costCenterVerified">Cost Center Verified</Label>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="cfoComments">Comments</Label>
            <Textarea
              id="cfoComments"
              value={formData.cfoComments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('cfoComments', e.target.value)}
              placeholder="Enter financial review comments"
              className="mt-2"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Section 6: Warehouse Admin
  const renderWarehouseAdminSection = () => (
    <motion.div
      key="warehouse-admin"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Warehouse Administration</AlertTitle>
        <AlertDescription>
          This section is for Warehouse Admin to process the approved requisition.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Purchase Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderDatePicker('Processing Date', formData.warehouseAdminDate, (d: Date | undefined) => updateField('warehouseAdminDate', d))}
            
            <div>
              <Label htmlFor="warehouseAdminName">Processed By</Label>
              <Input
                id="warehouseAdminName"
                value={formData.warehouseAdminName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('warehouseAdminName', e.target.value)}
                placeholder="Enter name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="poNumber">PO Number</Label>
              <Input
                id="poNumber"
                value={formData.poNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('poNumber', e.target.value)}
                placeholder="Enter PO number"
                className="mt-2"
              />
            </div>
            
            {renderDatePicker('PO Date', formData.poDate, (d: Date | undefined) => updateField('poDate', d))}
            
            <div>
              <Label htmlFor="vendorSelected">Selected Vendor</Label>
              <Input
                id="vendorSelected"
                value={formData.vendorSelected}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('vendorSelected', e.target.value)}
                placeholder="Enter vendor name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="vendorContact">Vendor Contact</Label>
              <Input
                id="vendorContact"
                value={formData.vendorContact}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('vendorContact', e.target.value)}
                placeholder="Enter contact info"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderDatePicker('Expected Delivery', formData.expectedDeliveryDate, (d: Date | undefined) => updateField('expectedDeliveryDate', d))}
            
            <div>
              <Label htmlFor="shippingMethod">Shipping Method</Label>
              <Select value={formData.shippingMethod} onValueChange={(v: string) => updateField('shippingMethod', v)}>
                <SelectTrigger id="shippingMethod" className="mt-2">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">Ground Shipping</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="freight">Freight</SelectItem>
                  <SelectItem value="pickup">Self Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('trackingNumber', e.target.value)}
                placeholder="Enter tracking number"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Section 7: Logistics & Receiving
  const renderLogisticsSection = () => (
    <motion.div
      key="logistics"
      variants={itemVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="space-y-6"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Receiving & Inspection</AlertTitle>
        <AlertDescription>
          This section is completed upon delivery and receiving of materials.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Receiving Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {renderDatePicker('Receiving Date', formData.receivingDate, (d: Date | undefined) => updateField('receivingDate', d))}
            
            <div>
              <Label htmlFor="receivedBy">Received By</Label>
              <Input
                id="receivedBy"
                value={formData.receivedBy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('receivedBy', e.target.value)}
                placeholder="Enter name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="deliveryCondition">Delivery Condition</Label>
              <Select value={formData.deliveryCondition} onValueChange={(v: string) => updateField('deliveryCondition', v)}>
                <SelectTrigger id="deliveryCondition" className="mt-2">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good - No Issues</SelectItem>
                  <SelectItem value="minor">Minor Damage</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantityReceived">Total Quantity Received</Label>
              <Input
                id="quantityReceived"
                type="number"
                value={formData.quantityReceived}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('quantityReceived', parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="storageLocation">Storage Location</Label>
              <Input
                id="storageLocation"
                value={formData.storageLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('storageLocation', e.target.value)}
                placeholder="e.g., Warehouse A, Rack 12"
                className="mt-2"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="discrepancyNotes">Discrepancy Notes</Label>
            <Textarea
              id="discrepancyNotes"
              value={formData.discrepancyNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('discrepancyNotes', e.target.value)}
              placeholder="Note any discrepancies between ordered and received items"
              className="mt-2"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quality & Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inspectionComplete"
                checked={formData.inspectionComplete}
                onCheckedChange={(checked: boolean) => updateField('inspectionComplete', checked)}
              />
              <Label htmlFor="inspectionComplete">Inspection Complete</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="qualityCheckPass"
                checked={formData.qualityCheckPass}
                onCheckedChange={(checked: boolean) => updateField('qualityCheckPass', checked)}
              />
              <Label htmlFor="qualityCheckPass">Quality Check Passed</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inventoryUpdated"
                checked={formData.inventoryUpdated}
                onCheckedChange={(checked: boolean) => updateField('inventoryUpdated', checked)}
              />
              <Label htmlFor="inventoryUpdated">Inventory System Updated</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderInformationSection();
      case 1:
        return renderRequisitionSection();
      case 2:
        return renderWarehouseReviewSection();
      case 3:
        return renderCoordinatorSection();
      case 4:
        return renderCFOSection();
      case 5:
        return renderWarehouseAdminSection();
      case 6:
        return renderLogisticsSection();
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to="/str/requisition">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className={`rounded-xl p-2.5 ${MODULE.colorLight}`}>
              <FileText className={`h-5 w-5 ${MODULE.colorText}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Material Requisition Form</h1>
                <Badge variant="outline">MRFAPP</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete form with all workflow stages
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving || createMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className={MODULE.color}
              >
                <Send className="mr-2 h-4 w-4" />
                {createMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Step Progress */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {FORM_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "flex min-w-[120px] flex-col items-center gap-2 rounded-lg p-3 transition-all",
                    isActive && "bg-primary/10",
                    !isActive && "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-primary/20 text-primary",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      isActive && "text-primary",
                      !isActive && "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          {/* Auto-generated INO notice */}
          {currentStep === 0 && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Document Number</AlertTitle>
              <AlertDescription>
                The Document Number (INO) will be automatically generated when you submit: STR-MRFAPP-YYMM-NNNN
              </AlertDescription>
            </Alert>
          )}
          
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {FORM_STEPS.length}
              </span>
            </div>
            
            {currentStep < FORM_STEPS.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className={MODULE.color}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit MRF
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Line Item Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem?.itemCode ? 'Edit' : 'Add'} Line Item</DialogTitle>
            <DialogDescription>Enter item details for the requisition</DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input
                    id="itemCode"
                    value={editingItem.itemCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, itemCode: e.target.value })}
                    placeholder="e.g., MAT-001"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={editingItem.category} onValueChange={(v: string) => setEditingItem({ ...editingItem, category: v })}>
                    <SelectTrigger id="category" className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEM_CATEGORIES.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                <Input
                  id="description"
                  value={editingItem.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Enter item description"
                  className="mt-2"
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <Label htmlFor="quantity">Quantity <span className="text-destructive">*</span></Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="uom">Unit</Label>
                  <Select value={editingItem.uom} onValueChange={(v: string) => setEditingItem({ ...editingItem, uom: v })}>
                    <SelectTrigger id="uom" className="mt-2">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UOM_OPTIONS.map((uom: string) => (
                        <SelectItem key={uom} value={uom}>{uom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="unitPrice">Unit Price ($)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={editingItem.unitPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Total</Label>
                  <div className="mt-2 flex h-10 items-center rounded-md bg-muted px-3 font-medium">
                    ${(editingItem.quantity * editingItem.unitPrice).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  value={editingItem.specifications}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingItem({ ...editingItem, specifications: e.target.value })}
                  placeholder="Enter technical specifications, dimensions, etc."
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="preferredVendor">Preferred Vendor</Label>
                  <Input
                    id="preferredVendor"
                    value={editingItem.preferredVendor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, preferredVendor: e.target.value })}
                    placeholder="Enter vendor name"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alternateVendor">Alternate Vendor</Label>
                  <Input
                    id="alternateVendor"
                    value={editingItem.alternateVendor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingItem({ ...editingItem, alternateVendor: e.target.value })}
                    placeholder="Enter alternate vendor"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={editingItem.remarks}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingItem({ ...editingItem, remarks: e.target.value })}
                  placeholder="Additional notes or remarks"
                  className="mt-2"
                  rows={2}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingItem && saveLineItem(editingItem)}
              disabled={!editingItem?.description}
            >
              {editingItem?.itemCode ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
