/**
 * CSD - Container Shipment Database Form (New)
 *
 * Form ID: 01
 * Sections: Header, SECTION A, SECTION A: Table (50 rows)
 *
 * Schema Reference: Logistics_PowerApps_Data_Schema.xlsx
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  Container,
  Check,
  Send,
  Loader2,
  CheckCircle,
  Copy,
  AlertCircle,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Upload,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { MainDBLOGService } from '@/generated/services/main-dblog-service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import type { CSDFormInput } from '@/types/log-forms';
import { LOG_SITES, LOG_CONTAINER_TYPES } from '@/types/log-forms';

// =============================================================================
// STEP DEFINITIONS
// =============================================================================

const FORM_STEPS = [
  { id: 1, label: 'Header', description: 'Site selection' },
  { id: 2, label: 'Shipment Details', description: 'SO, booking, customer info' },
  { id: 3, label: 'Container List', description: 'Enter container numbers' },
  { id: 4, label: 'Review & Submit', description: 'Confirm and submit' },
];

// Mock customers for DS lookup
const MOCK_CUSTOMERS = [
  'Wilmar International',
  'Cargill',
  'Bunge',
  'ADM',
  'Louis Dreyfus',
  'Olam International',
  'Musim Mas',
  'Golden Agri-Resources',
  'Sime Darby Oils',
  'FGV Holdings',
];

export default function CSDNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [closingDate, setClosingDate] = useState<Date | undefined>(undefined);

  // Form data
  const [formData, setFormData] = useState<Partial<CSDFormInput>>({
    Site: '',
    SoNo: '',
    Quantity: 0,
    BookingNo: '',
    Volume: 0,
    Type: '',
    IncotermA: '',
    DestA: '',
    ClosingDate: '',
    ClosingTime: '',
    Customer: '',
    ContainerNumbers: [],
  });

  // Container numbers for the 50-row table
  const [containerNumbers, setContainerNumbers] = useState<string[]>([]);

  // Computed total containers
  const totalContainers = useMemo(() => {
    return containerNumbers.filter((cn: string) => cn.trim() !== '').length;
  }, [containerNumbers]);

  // Update form field
  const updateField = <K extends keyof CSDFormInput>(field: K, value: CSDFormInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Add container number
  const addContainerNumber = () => {
    if (containerNumbers.length < 50) {
      setContainerNumbers([...containerNumbers, '']);
    }
  };

  // Update container number
  const updateContainerNumber = (index: number, value: string) => {
    const updated = [...containerNumbers];
    updated[index] = value.toUpperCase();
    setContainerNumbers(updated);
  };

  // Remove container number
  const removeContainerNumber = (index: number) => {
    setContainerNumbers(containerNumbers.filter((_: string, i: number) => i !== index));
  };

  // Navigate steps
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate ticket ID
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      const newTicketId = `CSD-${year}${month}-${seq}`;

      // Build MainDBLOG record
      const record = {
        title: newTicketId,
        formCode: 'CSD',
        currentStatus: 'Submitted',
        submittedBy: user?.email || '',
        submittedDate: now.toISOString(),
        cShipContainerNo: containerNumbers.join(', '),
        cShipSealNo: (formData as Record<string, string | undefined>).SealNo || '',
        cShipLoadingDate: (formData as Record<string, string | undefined>).SoDate ? new Date((formData as Record<string, string>).SoDate).toISOString() : undefined,
        cShipCustomer: (formData as Record<string, string | undefined>).CustomerName || formData.Customer || '',
        cShipProduct: (formData as Record<string, string | undefined>).CargoDescription || '',
        cShipQuantityMT: (formData as Record<string, number | undefined>).NetWeightMT ? Number((formData as Record<string, number>).NetWeightMT) : undefined,
        cShipVesselName: (formData as Record<string, string | undefined>).VesselName || '',
        cShipBLNo: formData.BookingNo || '',
        cShipRemarks: (formData as Record<string, string | undefined>).Remarks || '',
      };

      await MainDBLOGService.create(record);

      setTicketId(newTicketId);
      setIsSubmitted(true);
      toast.success('Container Shipment Database entry submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy ticket ID
  const copyTicketId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      toast.success('Ticket ID copied!');
    }
  };

  // Get step status
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  // Success Screen
  if (isSubmitted && ticketId) {
    return (
      <div className="min-h-screen bg-muted p-6">
        <div className="mx-auto max-w-[800px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="rounded-xl bg-white p-8 shadow-lg"
          >
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-10 w-10 text-[#166534]" />
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                Shipment Record Created Successfully!
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
                Your container shipment has been recorded in the database.
              </p>
            </div>

            {/* Ticket ID Box */}
            <div className="mb-6 rounded-lg border-2 border-[#003366] bg-primary/10 p-4">
              <div className="mb-2 text-center font-['Segoe_UI'] text-[13px] font-semibold text-[#003366]">
                RECORD NUMBER
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-['Segoe_UI'] text-[24px] font-bold text-[#003366]">
                  {ticketId}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyTicketId}
                  className="text-[#003366] hover:bg-primary/10"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6 rounded-lg bg-[#FAFAFA] p-4">
              <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                Shipment Summary
              </h3>
              <div className="grid gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Site:</span>
                  <span className="font-medium text-foreground">{formData.Site}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">SO Number:</span>
                  <span className="font-medium text-foreground">{formData.SoNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Booking Number:</span>
                  <span className="font-medium text-foreground">{formData.BookingNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Customer:</span>
                  <span className="font-medium text-foreground">{formData.Customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5C5C]">Total Containers:</span>
                  <span className="font-medium text-foreground">{totalContainers}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/log')}
              >
                Back to Logistics
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-[#002244]"
                onClick={() => {
                  setIsSubmitted(false);
                  setTicketId(null);
                  setCurrentStep(1);
                  setFormData({
                    Site: '',
                    SoNo: '',
                    Quantity: 0,
                    BookingNo: '',
                    Volume: 0,
                    Type: '',
                    IncotermA: '',
                    DestA: '',
                    ClosingDate: '',
                    ClosingTime: '',
                    Customer: '',
                    ContainerNumbers: [],
                  });
                  setContainerNumbers([]);
                }}
              >
                Create Another Record
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="mx-auto max-w-[900px]">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/log/forms')}
            className="mb-4 text-[#5C5C5C] hover:text-[#003366]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Container className="h-6 w-6 text-[#003366]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">LOG-01</Badge>
                <h1 className="font-['Segoe_UI'] text-[20px] font-bold text-foreground">
                  Container Shipment Database
                </h1>
              </div>
              <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                Track container shipments with booking details and container numbers
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index: number) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-['Segoe_UI'] text-[14px] font-semibold transition-all duration-200 ${
                          status === 'completed'
                            ? 'bg-[#166534] text-white'
                            : status === 'active'
                              ? 'bg-primary text-white'
                              : 'bg-[#E0E0E0] text-[#5C5C5C]'
                        }`}
                      >
                        {status === 'completed' ? <Check className="h-5 w-5" /> : step.id}
                      </div>
                      <span
                        className={`mt-2 font-['Segoe_UI'] text-[12px] font-semibold ${
                          status === 'pending' ? 'text-[#5C5C5C]' : 'text-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < FORM_STEPS.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 ${
                          status === 'completed' ? 'bg-[#166534]' : 'bg-[#D0D0D0]'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Header - Site Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Site Selection
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Select the site for this shipment record.
                    </p>
                  </div>

                  <div>
                    <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      Site <span className="text-[#9B2F23]">*</span>
                    </Label>
                    <Select
                      value={formData.Site || ''}
                      onValueChange={(value: string) => updateField('Site', value)}
                    >
                      <SelectTrigger className="mt-2 h-11 bg-[#E8E8E8] border-border">
                        <SelectValue placeholder="Select site..." />
                      </SelectTrigger>
                      <SelectContent>
                        {LOG_SITES.map((site) => (
                          <SelectItem key={site} value={site}>
                            {site}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Shipment Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Shipment Details
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Enter SO number, booking details, and customer information.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* SO Number */}
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        SO NO./ITEM <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        value={formData.SoNo || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('SoNo', e.target.value)}
                        placeholder="Enter SO number"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        QUANTITY (MTS) <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={formData.Quantity || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Quantity', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>

                    {/* Booking Number */}
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        BOOKING NO. <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        value={formData.BookingNo || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('BookingNo', e.target.value)}
                        placeholder="Enter booking number"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>

                    {/* Volume */}
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        VOLUME
                      </Label>
                      <Input
                        type="number"
                        value={formData.Volume || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('Volume', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>

                    {/* Container Type */}
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        TYPE OF CONTAINER <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Select
                        value={formData.Type || ''}
                        onValueChange={(value: string) => updateField('Type', value)}
                      >
                        <SelectTrigger className="mt-2 h-11 bg-[#E8E8E8] border-border">
                          <SelectValue placeholder="Select container type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {LOG_CONTAINER_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Customer */}
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        CUSTOMER <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Select
                        value={formData.Customer || ''}
                        onValueChange={(value: string) => updateField('Customer', value)}
                      >
                        <SelectTrigger className="mt-2 h-11 bg-[#E8E8E8] border-border">
                          <SelectValue placeholder="Select customer..." />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_CUSTOMERS.map((customer) => (
                            <SelectItem key={customer} value={customer}>
                              {customer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Incoterm */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        INCOTERM
                      </Label>
                      <Input
                        value={formData.IncotermA || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('IncotermA', e.target.value)}
                        placeholder="e.g., FOB, CIF, CFR"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        DESTINATION
                      </Label>
                      <Input
                        value={formData.DestA || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('DestA', e.target.value)}
                        placeholder="Enter destination port"
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>
                  </div>

                  {/* Closing Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        <Calendar className="mr-2 inline h-4 w-4" />
                        CLOSING DATE <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'mt-2 h-11 w-full justify-start bg-[#E8E8E8] border-border text-left font-normal',
                              !closingDate && 'text-muted-foreground'
                            )}
                          >
                            {closingDate ? format(closingDate, 'PPP') : 'Select date...'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={closingDate}
                            onSelect={(date: Date | undefined) => {
                              setClosingDate(date);
                              if (date) {
                                updateField('ClosingDate', format(date, 'yyyy-MM-dd'));
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                        <Clock className="mr-2 inline h-4 w-4" />
                        CLOSING TIME <span className="text-[#9B2F23]">*</span>
                      </Label>
                      <Input
                        type="time"
                        value={formData.ClosingTime || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('ClosingTime', e.target.value)}
                        className="mt-2 h-11 bg-[#E8E8E8] border-border"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Container List (50 rows) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                        Container Numbers
                      </h2>
                      <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                        Enter container numbers (up to 50). Format: XXXX1234567
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-[14px]">
                        Total: {totalContainers} / 50
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addContainerNumber}
                        disabled={containerNumbers.length >= 50}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Container
                      </Button>
                    </div>
                  </div>

                  {/* Container Table */}
                  <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                          <TableHead className="w-[60px] text-center">#</TableHead>
                          <TableHead>Container Number</TableHead>
                          <TableHead className="w-[80px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {containerNumbers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="py-8 text-center text-[#5C5C5C]">
                              <Container className="mx-auto mb-2 h-8 w-8 text-[#D0D0D0]" />
                              <p>No containers added yet.</p>
                              <p className="text-[12px]">Click "Add Container" to start.</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          containerNumbers.map((cn: string, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="text-center font-mono text-[#5C5C5C]">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={cn}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateContainerNumber(index, e.target.value)}
                                  placeholder="e.g., MSCU1234567"
                                  className="h-9 bg-white font-mono uppercase"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => removeContainerNumber(index)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Quick Add */}
                  {containerNumbers.length < 50 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const toAdd = Math.min(5, 50 - containerNumbers.length);
                          setContainerNumbers([...containerNumbers, ...Array(toAdd).fill('')]);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add 5 Rows
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const toAdd = Math.min(10, 50 - containerNumbers.length);
                          setContainerNumbers([...containerNumbers, ...Array(toAdd).fill('')]);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add 10 Rows
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-foreground">
                      Review Your Submission
                    </h2>
                    <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                      Please verify all information before submitting.
                    </p>
                  </div>

                  {/* Summary Sections */}
                  <div className="space-y-4">
                    {/* Header Info */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Site Information
                      </h3>
                      <div className="grid gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Site:</span>
                          <span className="font-medium text-foreground">{formData.Site}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipment Details */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Shipment Details
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-[13px]">
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">SO Number:</span>
                          <span className="font-medium text-foreground">{formData.SoNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Quantity:</span>
                          <span className="font-medium text-foreground">{formData.Quantity} MTS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Booking No:</span>
                          <span className="font-medium text-foreground">{formData.BookingNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Container Type:</span>
                          <span className="font-medium text-foreground">{formData.Type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Customer:</span>
                          <span className="font-medium text-foreground">{formData.Customer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5C5C5C]">Closing:</span>
                          <span className="font-medium text-foreground">
                            {formData.ClosingDate} {formData.ClosingTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Container Summary */}
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 font-['Segoe_UI'] text-[14px] font-semibold text-[#003366]">
                        Container Summary
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-[#5C5C5C]">
                          Total Containers (CM - Computed):
                        </span>
                        <Badge className="bg-primary text-[16px]">
                          {totalContainers}
                        </Badge>
                      </div>
                      {containerNumbers.filter((cn: string) => cn.trim()).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {containerNumbers
                            .filter((cn: string) => cn.trim())
                            .slice(0, 10)
                            .map((cn: string, index: number) => (
                              <Badge key={index} variant="outline" className="font-mono text-[11px]">
                                {cn}
                              </Badge>
                            ))}
                          {containerNumbers.filter((cn: string) => cn.trim()).length > 10 && (
                            <Badge variant="secondary" className="text-[11px]">
                              +{containerNumbers.filter((cn: string) => cn.trim()).length - 10} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="rounded-lg bg-[#FAFAFA] p-4">
                    <h3 className="mb-2 font-['Segoe_UI'] text-[14px] font-semibold text-foreground">
                      System Generated Fields
                    </h3>
                    <div className="grid gap-2 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-[#5C5C5C]">Created By (SG):</span>
                        <span className="font-medium text-foreground">{user?.fullName || 'Current User'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5C5C5C]">Created Date (SG):</span>
                        <span className="font-medium text-foreground">{format(new Date(), 'PPP')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Notice */}
                  <div className="rounded-lg border-l-4 border-[#1752A8] bg-[#EAF0FB] p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-[#1752A8]" />
                      <span className="font-['Segoe_UI'] text-[13px] font-semibold text-[#1752A8]">
                        Ready to Submit
                      </span>
                    </div>
                    <p className="mt-1 font-['Segoe_UI'] text-[13px] text-[#1752A8]/80">
                      Once submitted, this record will be stored in the Container Shipment Database.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className="h-11 px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < FORM_STEPS.length ? (
              <Button
                onClick={goToNextStep}
                className="h-11 bg-primary px-6 hover:bg-[#002244]"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-11 bg-primary px-6 hover:bg-[#002244]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Record
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
