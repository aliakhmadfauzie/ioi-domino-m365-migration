/**
 * WI - Work Instruction Form
 * Document Header + WI Content Sections + Record of Issues (120 rows)
 * Dept Head endorsement workflow
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  BookOpen,
  Target,
  List,
  Plus,
  Trash2,
  ClipboardList,
  CheckCircle,
  User,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

// WI Form Schema
const issueRowSchema = z.object({
  issueNo: z.string(),
  description: z.string(),
  date: z.string(),
  remarks: z.string(),
});

const wiFormSchema = z.object({
  // Document Header
  documentNo: z.string().optional(),
  processName: z.string().min(1, { error: 'Process name/title is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  
  // WI Content Sections
  title: z.string().min(1, { error: 'Title is required' }),
  objective: z.string().min(10, { error: 'Objective must be at least 10 characters' }),
  procedure: z.string().min(20, { error: 'Procedure must be at least 20 characters' }),
  
  // Endorsement
  endorsedBy: z.string().optional(),
  
  // Record of Issues
  issues: z.array(issueRowSchema).optional(),
});

type WIFormValues = z.infer<typeof wiFormSchema>;

const DEPARTMENTS = [
  'Quality Assurance',
  'Production',
  'Operations',
  'Warehouse',
  'Engineering',
  'Maintenance',
  'HSE',
  'QC',
];

export default function WINewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const form = useForm<WIFormValues>({
    resolver: zodResolver(wiFormSchema),
    defaultValues: {
      documentNo: '',
      processName: '',
      department: '',
      title: '',
      objective: '',
      procedure: '',
      endorsedBy: '',
      issues: [
        { issueNo: '1', description: '', date: '', remarks: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'issues',
  });

  const onSubmit = async (data: WIFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('WI Form Data:', data);
      toast.success('Work Instruction submitted for endorsement');
      navigate('/qa/documents');
    } catch (error) {
      toast.error('Failed to submit Work Instruction');
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
                <div className="h-10 w-10 rounded-xl bg-secondary/500/10 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Work Instruction</h1>
                  <p className="text-xs text-muted-foreground">New WI Document</p>
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
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Document Header</CardTitle>
                  </div>
                  <CardDescription>
                    Basic document identification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="documentNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Auto-generated" disabled {...field} />
                          </FormControl>
                          <FormDescription>Will be generated on submission</FormDescription>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="processName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Process Name)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the process name or document title"
                            className="text-lg font-medium"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* WI Content Sections */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">WI Content Sections</CardTitle>
                  </div>
                  <CardDescription>
                    Define the work instruction content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 1. Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the work instruction title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 2. Objective */}
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          2. Objective (Purpose)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the purpose of this work instruction..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 7. Procedure */}
                  <FormField
                    control={form.control}
                    name="procedure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <List className="h-4 w-4 text-accent-foreground" />
                          7. Procedure
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detail the step-by-step work instruction...\n\n1. Step one...\n2. Step two...\n3. Step three..."
                            className="min-h-[250px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Rich text supported for detailed instructions</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Record of Issues Table */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">Record of Issues</CardTitle>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ issueNo: String(fields.length + 1), description: '', date: '', remarks: '' })}
                      disabled={fields.length >= 60}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Issue
                    </Button>
                  </div>
                  <CardDescription>
                    Track revision history (up to 60 regular + 60 extension rows)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[80px]">Issue No.</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[140px]">Date</TableHead>
                          <TableHead>Remarks</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index: number) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Input
                                {...form.register(`issues.${index}.issueNo`)}
                                placeholder="#"
                                className="h-8 text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`issues.${index}.description`)}
                                placeholder="Issue description"
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`issues.${index}.date`)}
                                type="date"
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                {...form.register(`issues.${index}.remarks`)}
                                placeholder="Remarks"
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {fields.length} of 60 regular rows used
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Endorsement Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Endorsement</CardTitle>
                  </div>
                  <CardDescription>
                    Department Head endorsement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="endorsedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endorsed By (Dept Head)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Select or enter Department Head name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The Department Head will receive this for endorsement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Workflow Info */}
            <motion.div variants={itemVariants}>
              <Card className="border-secondary bg-secondary/50 dark:border-secondary dark:bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Endorsement Workflow</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This Work Instruction will be sent to the Department Head for endorsement. 
                        Rejected submissions will be routed back via the rejection notification list.
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
                  {isSubmitting ? 'Submitting...' : 'Submit for Endorsement'}
                </Button>
              </div>
            </motion.div>
          </motion.main>
        </form>
      </Form>
    </div>
  );
}