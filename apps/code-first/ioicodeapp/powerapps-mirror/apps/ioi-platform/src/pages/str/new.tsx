/**
 * STR New Request (Screen 2 - Data Entry)
 * Creates a new STR submission
 * 
 * Features:
 * - Dynamic form fields based on form type
 * - People picker for relevant fields
 * - Attachment upload control
 * - Submit button triggers Power Automate workflow
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Save,
  Send,
  Upload,
  X,
  Info,
  AlertCircle,
  Building2,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

import { useUser } from '@/hooks/use-user';
import { useCreateSTRSubmission } from '@/hooks/use-str-submissions';
import { getSTRFormInfo, STR_SITES, STR_ENVIRONMENTS, STR_MODULES } from '@/config/str-constants';
import {
  getSTRFormFields,
  getSTRPrimaryDescription,
  getSTRPrimaryQuantity,
  getSTRRequiredDate,
  type STRFormFieldConfig,
} from '@/config/str-form-fields';
import { getActiveDepartments } from '@/config/departments';
import { toast } from 'sonner';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

export default function STRNewRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: user } = useUser();
  
  const formCode = searchParams.get('form') || '';
  const moduleId = searchParams.get('module') || '';
  
  const formInfo = getSTRFormInfo(formCode);
  const module = moduleId ? STR_MODULES[moduleId as keyof typeof STR_MODULES] : null;
  
  const createMutation = useCreateSTRSubmission();
  
  // Form state
  const [formData, setFormData] = useState({
    site: 'PRAI' as typeof STR_SITES[number],
    environment: 'PROD' as typeof STR_ENVIRONMENTS[number],
    department: '',
    justification: '',
    comments: '',
  });
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const formFields = useMemo(() => getSTRFormFields(formCode), [formCode]);
  
  // Pre-fill requestor info from M365 user
  useEffect(() => {
    if (user) {
      // User info is pre-filled via useUser hook
    }
  }, [user]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldValueChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const buildSubmissionPayload = (currentStatus: 'Draft' | 'Submitted') => {
    const itemDescription = getSTRPrimaryDescription(fieldValues, formCode);
    const quantity = getSTRPrimaryQuantity(fieldValues);
    const requiredDate = getSTRRequiredDate(fieldValues);
    const extraFieldLabels = Object.fromEntries(
      formFields.map((field) => [field.id, field.label])
    );

    return {
      FormType: formCode as import('@/config/str-constants').STRFormCode,
      Site: formData.site,
      EnvironmentTag: formData.environment,
      Department: formData.department,
      Requestor: user?.fullName || 'Unknown',
      RequestorEmail: user?.userPrincipalName || '',
      Comments: formData.comments,
      CurrentStatus: currentStatus,
      RequestDate: new Date(),
      SubmittedBy: currentStatus === 'Submitted' ? user?.fullName || 'Unknown' : undefined,
      SubmittedDate: currentStatus === 'Submitted' ? new Date() : undefined,
      Justification: formData.justification,
      Quantity: quantity,
      ItemDescription: itemDescription,
      RequestTitle: itemDescription || `${formCode} request`,
      RequiredDate: requiredDate,
      ExtraFields: fieldValues,
      ExtraFieldLabels: extraFieldLabels,
    };
  };

  const validateRequiredFields = () => {
    const missingField = formFields.find((field) => field.required && !fieldValues[field.id]?.trim());
    if (missingField) {
      toast.error(`Please fill in ${missingField.label}`);
      return false;
    }
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await createMutation.mutateAsync({
        ...buildSubmissionPayload('Draft'),
      });
      toast.success('Draft saved successfully');
      navigate('/my-submissions');
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.site || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!validateRequiredFields()) return;

    
    try {
      await createMutation.mutateAsync({
        ...buildSubmissionPayload('Submitted'),
      });
      toast.success('Request submitted successfully');
      navigate('/my-submissions');
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  if (!formCode || !formInfo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Invalid Form</h1>
          <p className="mt-2 text-muted-foreground">
            No form type specified or the form type is invalid.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/str">Back to Store Management</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderConfiguredField = (field: STRFormFieldConfig) => {
    const value = fieldValues[field.id] || '';
    const label = (
      <Label htmlFor={field.id} className="flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
      </Label>
    );

    if (field.type === 'textarea') {
      return (
        <div key={field.id} className="sm:col-span-2">
          {label}
          <Textarea
            id={field.id}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="mt-2"
            rows={3}
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.id}>
          {label}
          <Select value={value} onValueChange={(v) => handleFieldValueChange(field.id, v)}>
            <SelectTrigger id={field.id} className="mt-2">
              <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={field.id}>
        {label}
        <Input
          id={field.id}
          type={field.type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldValueChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className="mt-2"
        />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to={module ? module.route : '/str'}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className={`rounded-xl p-2.5 ${module?.colorLight || 'bg-secondary dark:bg-secondary/30'}`}>
              <FileText className={`h-5 w-5 ${module?.colorText || 'text-secondary-foreground'}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">New {formCode} Request</h1>
                <Badge variant="outline">Draft</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formInfo.name}
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
                className={module?.color || 'bg-primary'}
              >
                <Send className="mr-2 h-4 w-4" />
                {createMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Document Number</AlertTitle>
            <AlertDescription>
              The Document Number (INO) will be automatically generated when you submit this request.
              Format: STR-{formCode}-YYMM-NNNN
            </AlertDescription>
          </Alert>
          
          {/* Requestor Info */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <CardTitle>Requestor Information</CardTitle>
                <CardDescription>Your details from Microsoft 365</CardDescription>
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
          </motion.div>
          
          {/* Location & Environment */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Location & Environment</CardTitle>
                <CardDescription>Select the site and deployment environment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="site" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Site <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.site}
                      onValueChange={(v) => handleInputChange('site', v)}
                    >
                      <SelectTrigger id="site" className="mt-2">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {STR_SITES.map((site) => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select
                      value={formData.environment}
                      onValueChange={(v) => handleInputChange('environment', v)}
                    >
                      <SelectTrigger id="environment" className="mt-2">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        {STR_ENVIRONMENTS.map((env) => (
                          <SelectItem key={env} value={env}>{env}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(v) => handleInputChange('department', v)}
                    >
                      <SelectTrigger id="department" className="mt-2">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {getActiveDepartments().map((dept) => (
                          <SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Request Details */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Provide details for your {formCode} request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {formFields.map(renderConfiguredField)}
                </div>
                
                <div>
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea
                    id="justification"
                    value={formData.justification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('justification', e.target.value)}
                    placeholder="Provide justification for this request"
                    className="mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('comments', e.target.value)}
                    placeholder="Any additional notes or comments"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Attachments */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Upload relevant documents, spec sheets, or certificates</CardDescription>
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
                      {attachments.map((file, index) => (
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
          
          {/* Submit Actions */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Fields marked with <span className="text-destructive">*</span> are required
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link to={module ? module.route : '/str'}>Cancel</Link>
                    </Button>
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
                      className={module?.color || 'bg-primary'}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
