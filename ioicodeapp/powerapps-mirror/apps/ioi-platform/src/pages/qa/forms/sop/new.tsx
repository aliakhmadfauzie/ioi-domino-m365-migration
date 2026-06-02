/**
 * SOP - Standard Operating Procedure Form
 * Document Header + SOP Content Sections
 * Multi-stage approval with parallel authority workflow
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
  FileText,
  Building2,
  Calendar,
  Hash,
  Settings,
  Target,
  BookOpen,
  List,
  FileCode,
  Paperclip,
  Users,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// SOP Form Schema based on uploaded data
const sopFormSchema = z.object({
  // Document Header
  documentNo: z.string().optional(),
  documentType: z.string().min(1, { error: 'Document type is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  number: z.string().min(1, { error: 'Document number is required' }),
  company: z.string().min(1, { error: 'Company is required' }),
  issueNo: z.string().min(1, { error: 'Issue number is required' }),
  system: z.string().min(1, { error: 'System is required' }),
  dateIssued: z.date({ error: 'Date issued is required' }),
  effectiveDate: z.date({ error: 'Effective date is required' }),
  status: z.string().optional(),
  processName: z.string().min(1, { error: 'Process name/title is required' }),
  
  // SOP Content Sections
  objective: z.string().min(10, { error: 'Objective must be at least 10 characters' }),
  scope: z.string().min(10, { error: 'Scope must be at least 10 characters' }),
  definitions: z.string().optional(),
  procedure: z.string().min(20, { error: 'Procedure must be at least 20 characters' }),
  referenceDocument: z.string().optional(),
  recordsRetention: z.string().optional(),
  attachments: z.string().optional(),
  distributionList: z.string().optional(),
});

type SOPFormValues = z.infer<typeof sopFormSchema>;

const DEPARTMENTS = [
  'Quality Assurance',
  'Production',
  'Operations',
  'Warehouse',
  'Engineering',
  'Maintenance',
  'HSE',
  'HR',
  'IT',
  'Finance',
];

const SYSTEMS = [
  'ISO 9001',
  'ISO 14001',
  'HACCP',
  'GMP',
  'HALAL',
  'OHSAS 18001',
  'ISO 45001',
];

const COMPANIES = [
  'IOI Acidchem Sdn Bhd - PRAI',
  'IOI Acidchem Sdn Bhd - JHR',
  'IOI Oleochemical Industries',
];

export default function SOPNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const form = useForm<SOPFormValues>({
    resolver: zodResolver(sopFormSchema),
    defaultValues: {
      documentNo: '',
      documentType: 'SOP',
      department: '',
      number: '',
      company: '',
      issueNo: '1.0',
      system: '',
      status: 'Draft',
      processName: '',
      objective: '',
      scope: '',
      definitions: '',
      procedure: '',
      referenceDocument: '',
      recordsRetention: '',
      attachments: '',
      distributionList: '',
    },
  });

  const onSubmit = async (data: SOPFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('SOP Form Data:', data);
      toast.success('SOP submitted successfully for approval');
      navigate('/qa/documents');
    } catch (error) {
      toast.error('Failed to submit SOP');
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
                to="/qa/documents"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/50/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Standard Operating Procedure</h1>
                  <p className="text-xs text-muted-foreground">New SOP Document</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Draft
              </Badge>
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
            {/* Document Header Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Document Header</CardTitle>
                  </div>
                  <CardDescription>
                    Basic document identification and metadata
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SOP">SOP</SelectItem>
                              <SelectItem value="WI">Work Instruction</SelectItem>
                              <SelectItem value="Policy">Policy</SelectItem>
                              <SelectItem value="Form">Form</SelectItem>
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
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., QA-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COMPANIES.map((comp: string) => (
                                <SelectItem key={comp} value={comp}>
                                  {comp}
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
                      name="issueNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue No.</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1.0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="system"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select system" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SYSTEMS.map((sys: string) => (
                                <SelectItem key={sys} value={sys}>
                                  {sys}
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
                      name="dateIssued"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date Issued</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Effective Date</FormLabel>
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
                    name="processName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process Name / Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the process name or document title"
                            className="text-lg font-medium"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be the main title of the SOP document
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* SOP Content Sections */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">SOP Content Sections</CardTitle>
                  </div>
                  <CardDescription>
                    Define the standard operating procedure content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 1. Objective */}
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          1. Objective
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the purpose and objective of this procedure..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 2. Scope */}
                  <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-secondary-foreground" />
                          2. Scope
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Define the scope and applicability of this procedure..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 3. Definitions */}
                  <FormField
                    control={form.control}
                    name="definitions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-secondary-foreground" />
                          3. Definitions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Define key terms and abbreviations used in this document..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Optional: Define technical terms</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 4. Procedure */}
                  <FormField
                    control={form.control}
                    name="procedure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <List className="h-4 w-4 text-accent-foreground" />
                          4. Procedure
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detail the step-by-step procedure...\n\n1. Step one...\n2. Step two...\n3. Step three..."
                            className="min-h-[200px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Rich text supported for detailed procedures</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 5. Reference Document */}
                  <FormField
                    control={form.control}
                    name="referenceDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-secondary-foreground" />
                          5. Reference Document
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List related documents, standards, or references..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 6. Records Retention */}
                  <FormField
                    control={form.control}
                    name="recordsRetention"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-destructive" />
                          6. Records Retention
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 5 years from date of issue"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 7. Attachments */}
                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-accent-foreground" />
                          7. Attachments
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS up to 10MB</p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 8. Distribution List */}
                  <FormField
                    control={form.control}
                    name="distributionList"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-secondary-foreground" />
                          8. Distribution To
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter names or departments for distribution...\nQA Department\nProduction Department\nOperations Team"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>List all recipients of this SOP</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Workflow Info */}
            <motion.div variants={itemVariants}>
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Approval Workflow</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This SOP will go through the following stages: Submit → Review → QA Manager Approval → Department Head Approval → Publish
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Actions */}
            <motion.div variants={itemVariants} className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/qa/documents')}>
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
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
              </div>
            </motion.div>
          </motion.main>
        </form>
      </Form>
    </div>
  );
}
