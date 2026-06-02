/**
 * STR Edit/Update Screen (Screen 4)
 * Allows assigned actors to modify the record during specific workflow stages
 * 
 * Features:
 * - Role-gated field visibility
 * - Editable form sections based on current stage
 * - Save/Submit button to update and advance workflow
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Save,
  Send,
  Upload,
  X,
  AlertCircle,
  Lock,
  Building2,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useSTRSubmission, useUpdateSTRSubmission } from '@/hooks/use-str-submissions';
import { getSTRFormInfo, getSTRStatusInfo, STR_SITES, STR_MODULES } from '@/config/str-constants';
import { toast } from 'sonner';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

// Role-based field visibility
const FIELD_VISIBILITY: Record<string, { roles: string[]; stages: string[] }> = {
  department: { roles: ['requestor', 'admin'], stages: ['Draft', 'Returned'] },
  itemDescription: { roles: ['requestor', 'admin'], stages: ['Draft', 'Returned'] },
  quantity: { roles: ['requestor', 'admin'], stages: ['Draft', 'Returned'] },
  justification: { roles: ['requestor', 'admin'], stages: ['Draft', 'Returned'] },
  comments: { roles: ['requestor', 'admin', 'approver', 'manager'], stages: ['Draft', 'Returned', 'PendingReview'] },
  verifiedBy: { roles: ['admin', 'store_admin'], stages: ['PendingReview'] },
  approvalComments: { roles: ['approver', 'manager', 'hod'], stages: ['PendingApproval'] },
};

function canEditField(field: string, userRole: string, status: string): boolean {
  const visibility = FIELD_VISIBILITY[field];
  if (!visibility) return false;
  return visibility.roles.includes(userRole.toLowerCase()) && visibility.stages.includes(status);
}

export default function STREditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  
  const { data: submission, isLoading } = useSTRSubmission(id || '');
  const updateMutation = useUpdateSTRSubmission();
  
  // User role - in production, this would come from user context/groups
  const userRole = 'requestor';
  
  // Form state
  const [formData, setFormData] = useState({
    site: '',
    department: '',
    justification: '',
    quantity: '',
    itemDescription: '',
    comments: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form data from submission
  useEffect(() => {
    if (submission) {
      setFormData({
        site: submission.Site,
        department: submission.Department,
        justification: submission.Justification || '',
        quantity: submission.Quantity?.toString() || '',
        itemDescription: submission.ItemDescription || '',
        comments: submission.Comments || '',
      });
    }
  }, [submission]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
  
  const handleSave = async () => {
    if (!submission) return;
    
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        guid: submission.guid,
        data: {
          Site: formData.site as typeof STR_SITES[number],
          Department: formData.department,
          Justification: formData.justification,
          Quantity: formData.quantity ? parseInt(formData.quantity, 10) : undefined,
          ItemDescription: formData.itemDescription,
          Comments: formData.comments,
        },
      });
      toast.success('Changes saved successfully');
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!submission) return;
    
    // Validate required fields
    if (!formData.site || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await updateMutation.mutateAsync({
        guid: submission.guid,
        data: {
          Site: formData.site as typeof STR_SITES[number],
          Department: formData.department,
          Justification: formData.justification,
          Quantity: formData.quantity ? parseInt(formData.quantity, 10) : undefined,
          ItemDescription: formData.itemDescription,
          Comments: formData.comments,
          CurrentStatus: 'Submitted',
          SubmittedBy: user?.fullName || 'Unknown',
          SubmittedDate: new Date(),
        },
      });
      toast.success('Request submitted successfully');
      navigate(`/submissions/${submission.guid}`);
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!submission) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Submission Not Found</h1>
          <p className="mt-2 text-muted-foreground">The requested submission could not be found.</p>
          <Button className="mt-6" asChild>
            <Link to="/my-submissions">Back to Submissions</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if record is locked or not editable
  const isLocked = submission.IsLocked || ['Approved', 'Rejected', 'Closed'].includes(submission.CurrentStatus);
  const formInfo = getSTRFormInfo(submission.FormType);
  const statusInfo = getSTRStatusInfo(submission.CurrentStatus);
  
  if (isLocked) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Record is Locked</h1>
          <p className="mt-2 text-muted-foreground">
            This submission is {submission.CurrentStatus.toLowerCase()} and cannot be edited.
          </p>
          <Button className="mt-6" asChild>
            <Link to={`/submissions/${submission.guid}`}>View Details</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to={`/submissions/${submission.guid}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="rounded-xl bg-secondary p-2.5 dark:bg-secondary/30">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Edit {submission.INO}</h1>
                <Badge variant={statusInfo.badgeVariant}>{statusInfo.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formInfo?.name || submission.FormType}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving || updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              {submission.CurrentStatus === 'Draft' && (
                <Button
                  onClick={handleSubmit}
                  disabled={updateMutation.isPending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Role-based editing notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Role-Based Editing</AlertTitle>
            <AlertDescription>
              You can edit fields allowed for your role ({userRole}) at the current stage ({submission.CurrentStatus}).
              Some fields may be read-only.
            </AlertDescription>
          </Alert>
          
          {/* Document Info */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>These fields are system-managed and cannot be edited</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Document Number (INO)</Label>
                    <p className="mt-1 font-mono text-lg font-semibold">{submission.INO}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Form Type</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">{submission.FormType}</Badge>
                      <span className="text-sm">{formInfo?.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Requestor</Label>
                    <p className="mt-1 font-medium">{submission.Requestor}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Request Date</Label>
                    <p className="mt-1 font-medium">
                      {new Date(submission.RequestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Location & Department */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Location & Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="site" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Site
                      {!canEditField('site', userRole, submission.CurrentStatus) && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Label>
                    <Select
                      value={formData.site}
                      onValueChange={(v) => handleInputChange('site', v)}
                      disabled={!canEditField('site', userRole, submission.CurrentStatus)}
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
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Department
                      {!canEditField('department', userRole, submission.CurrentStatus) && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('department', e.target.value)}
                      disabled={!canEditField('department', userRole, submission.CurrentStatus)}
                      className="mt-2"
                    />
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="itemDescription" className="flex items-center gap-2">
                    Item Description
                    {!canEditField('itemDescription', userRole, submission.CurrentStatus) && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Label>
                  <Input
                    id="itemDescription"
                    value={formData.itemDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('itemDescription', e.target.value)}
                    disabled={!canEditField('itemDescription', userRole, submission.CurrentStatus)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity" className="flex items-center gap-2">
                    Quantity
                    {!canEditField('quantity', userRole, submission.CurrentStatus) && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('quantity', e.target.value)}
                    disabled={!canEditField('quantity', userRole, submission.CurrentStatus)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="justification" className="flex items-center gap-2">
                    Justification
                    {!canEditField('justification', userRole, submission.CurrentStatus) && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Label>
                  <Textarea
                    id="justification"
                    value={formData.justification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('justification', e.target.value)}
                    disabled={!canEditField('justification', userRole, submission.CurrentStatus)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="comments" className="flex items-center gap-2">
                    Comments
                    {!canEditField('comments', userRole, submission.CurrentStatus) && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Label>
                  <Textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('comments', e.target.value)}
                    disabled={!canEditField('comments', userRole, submission.CurrentStatus)}
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Existing attachments */}
                  {submission.Attachments && submission.Attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Existing Attachments</Label>
                      {submission.Attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1 text-sm">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload new */}
                  <div className="rounded-lg border-2 border-dashed p-6 text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Add more attachments</p>
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
                  
                  {/* New attachments */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>New Attachments</Label>
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
          
          {/* Actions */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/submissions/${submission.guid}`}>Cancel</Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      disabled={isSaving || updateMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {submission.CurrentStatus === 'Draft' && (
                      <Button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Submit Request
                      </Button>
                    )}
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
