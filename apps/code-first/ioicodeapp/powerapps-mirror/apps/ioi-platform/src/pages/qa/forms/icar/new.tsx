/**
 * ICAR - Internal Corrective Action Report Form
 * Multi-stage workflow: Draft -> Reply -> Review -> Verify
 * Root cause analysis methods and effectiveness verification
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Save,
  Send,
  AlertTriangle,
  FileWarning,
  Search,
  CheckCircle,
  Target,
  ClipboardCheck,
  Users,
  Calendar,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// ICAR Form Schema
const icarFormSchema = z.object({
  // ICAR Header
  icarNo: z.string().optional(),
  nonConformanceDescription: z.string().min(20, { error: 'Description must be at least 20 characters' }),
  source: z.string().min(1, { error: 'Source is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  site: z.string().min(1, { error: 'Site is required' }),
  reportedBy: z.string().min(1, { error: 'Reported by is required' }),
  reportedDate: z.date({ error: 'Date is required' }),
  severity: z.string().min(1, { error: 'Severity is required' }),
  
  // Root Cause Analysis
  rootCauseMethod: z.string().min(1, { error: 'Root cause method is required' }),
  rootCauseAnalysis: z.string().min(20, { error: 'Root cause analysis is required' }),
  rootCauseCategory: z.string().min(1, { error: 'Root cause category is required' }),
  
  // Corrective Action
  correctiveAction: z.string().min(20, { error: 'Corrective action is required' }),
  responsiblePerson: z.string().min(1, { error: 'Responsible person is required' }),
  targetDate: z.date({ error: 'Target date is required' }),
  
  // Verification
  verificationStatus: z.string().optional(),
  effectivenessVerification: z.string().optional(),
  
  // Workflow
  currentAction: z.string().optional(),
});

type ICARFormValues = z.infer<typeof icarFormSchema>;

const DEPARTMENTS = [
  'Quality Assurance',
  'Production',
  'Operations',
  'Warehouse',
  'Engineering',
  'Maintenance',
  'HSE',
  'Packaging',
  'Procurement',
];

const SITES = ['PRAI', 'JHR'];

const SOURCES = [
  'Internal Audit',
  'External Audit',
  'Customer Complaint',
  'Process Deviation',
  'Product Non-conformance',
  'Supplier Issue',
  'Management Review',
  'Employee Observation',
];

const ROOT_CAUSE_METHODS = [
  { id: 'fiveWhy', label: '5 Why Analysis', description: 'Ask "Why" five times to find root cause' },
  { id: 'fishbone', label: 'Fishbone Diagram', description: 'Ishikawa cause-and-effect diagram' },
  { id: 'fmea', label: 'FMEA', description: 'Failure Mode and Effects Analysis' },
  { id: 'fta', label: 'Fault Tree Analysis', description: 'Top-down deductive failure analysis' },
];

const ROOT_CAUSE_CATEGORIES = [
  'Man (Personnel)',
  'Machine (Equipment)',
  'Method (Process)',
  'Material (Raw Material)',
  'Measurement',
  'Environment',
  'Management',
];

const SEVERITIES = [
  { value: 'critical', label: 'Critical', color: 'bg-destructive text-destructive-foreground' },
  { value: 'major', label: 'Major', color: 'bg-accent/500 text-white' },
  { value: 'minor', label: 'Minor', color: 'bg-secondary/500 text-white' },
  { value: 'observation', label: 'Observation', color: 'bg-secondary text-secondary-foreground' },
];

export default function ICARNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const form = useForm<ICARFormValues>({
    resolver: zodResolver(icarFormSchema),
    defaultValues: {
      icarNo: '',
      nonConformanceDescription: '',
      source: '',
      department: '',
      site: '',
      reportedBy: user?.fullName || '',
      severity: '',
      rootCauseMethod: '',
      rootCauseAnalysis: '',
      rootCauseCategory: '',
      correctiveAction: '',
      responsiblePerson: '',
      verificationStatus: '',
      effectivenessVerification: '',
      currentAction: 'Draft',
    },
  });

  const onSubmit = async (data: ICARFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('ICAR Form Data:', data);
      toast.success('ICAR submitted successfully');
      navigate('/qa/defects');
    } catch (error) {
      toast.error('Failed to submit ICAR');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const data = form.getValues();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Draft saved:', data);
      toast.success('Draft saved successfully');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const selectedSeverity = SEVERITIES.find((s) => s.value === form.watch('severity'));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  } as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/qa/defects"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <FileWarning className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Internal Corrective Action Report</h1>
                  <p className="text-xs text-muted-foreground">New ICAR</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Draft
              </Badge>
              {selectedSeverity && (
                <Badge className={cn('text-xs', selectedSeverity.color)}>
                  {selectedSeverity.label}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.main
            className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* ICAR Header Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-base">ICAR Header</CardTitle>
                  </div>
                  <CardDescription>
                    Non-conformance identification and details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="icarNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ICAR No. (Display)</FormLabel>
                          <FormControl>
                            <Input placeholder="Auto-generated" disabled {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SOURCES.map((src: string) => (
                                <SelectItem key={src} value={src}>
                                  {src}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SEVERITIES.map((sev) => (
                                <SelectItem key={sev.value} value={sev.value}>
                                  <span className="flex items-center gap-2">
                                    <span className={cn('h-2 w-2 rounded-full', sev.color.replace('text-white', '').replace('text-destructive-foreground', ''))} />
                                    {sev.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEPARTMENTS.map((dept: string) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="site"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select site" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SITES.map((site: string) => (
                                <SelectItem key={site} value={site}>
                                  {site}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reportedDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Reported Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="nonConformanceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Non-conformance Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the non-conformance in detail...\n\nInclude: What happened, Where it occurred, When it was discovered, Impact assessment"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Provide a comprehensive description of the issue</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reportedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reported By</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Root Cause Analysis Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Root Cause Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Identify and categorize the root cause
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="rootCauseMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Root Cause Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                          >
                            {ROOT_CAUSE_METHODS.map((method) => (
                              <div key={method.id} className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={method.id} />
                                </FormControl>
                                <div className="space-y-0.5">
                                  <FormLabel className="font-medium cursor-pointer">
                                    {method.label}
                                  </FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rootCauseAnalysis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Root Cause Analysis Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Document your root cause analysis...\n\nFor 5 Why:\nWhy 1: ...\nWhy 2: ...\nWhy 3: ...\nWhy 4: ...\nWhy 5 (Root Cause): ..."
                            className="min-h-[180px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rootCauseCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Root Cause Categorization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ROOT_CAUSE_CATEGORIES.map((cat: string) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>6M categorization for root cause</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Corrective Action Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Corrective Action</CardTitle>
                  </div>
                  <CardDescription>
                    Define corrective actions to address the root cause
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="correctiveAction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corrective Action Plan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the corrective actions to be taken...\n\n1. Immediate containment action\n2. Short-term corrective action\n3. Long-term preventive action"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="responsiblePerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsible Person</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Target Completion Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Workflow Info */}
            <motion.div variants={itemVariants}>
              <Card className="border-accent bg-accent/50 dark:border-accent dark:bg-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ClipboardCheck className="h-5 w-5 text-accent-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Multi-Stage Workflow</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This ICAR will progress through: <span className="font-medium">Draft → Reply → Review → Verify</span>. 
                        Effectiveness verification is required before closure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Actions */}
            <motion.div variants={itemVariants} className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/qa/defects')}>
                Cancel
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={isSavingDraft}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingDraft ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit ICAR'}
                </Button>
              </div>
            </motion.div>
          </motion.main>
        </form>
      </Form>
    </div>
  );
}
