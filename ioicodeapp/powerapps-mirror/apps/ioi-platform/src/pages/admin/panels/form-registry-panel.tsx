import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Building2,
  Loader2,
  Database,
  Calendar,
  User,
  Eye,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useITFormsList,
  useCreateITForms,
  useUpdateITForms,
  useDeleteITForms,
  ITForms_DATA_SOURCE_TYPE,
} from '@/generated/hooks/use-itforms';
import type { ITForms, ITFormsStatusKey, ITFormsSiteKey, ITFormsEnvironmentTagKey } from '@/generated/models/it-forms-model';
import { ITFormsStatusKeyToLabel, ITFormsSiteKeyToLabel, ITFormsEnvironmentTagKeyToLabel } from '@/generated/models/it-forms-model';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function FormRegistryPanel() {
  const { data: forms = [], isLoading, error } = useITFormsList();
  const createMutation = useCreateITForms();
  const updateMutation = useUpdateITForms();
  const deleteMutation = useDeleteITForms();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<ITForms | null>(null);
  const [viewingForm, setViewingForm] = useState<ITForms | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    formCode: '',
    applicantName: '',
    department: '',
    designation: '',
    statusKey: 'StatusKey1' as ITFormsStatusKey,
    siteKey: 'SiteKey0' as ITFormsSiteKey,
    environmentTagKey: 'EnvironmentTagKey2' as ITFormsEnvironmentTagKey,
    currentStage: '',
    currentAction: '',
    justification: '',
    comments: '',
  });

  const filteredForms = useMemo(() => {
    return forms.filter((form: ITForms) => {
      const matchesSearch =
        form.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.formCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || form.statusKey === statusFilter;
      const matchesSite = siteFilter === 'all' || form.siteKey === siteFilter;
      return matchesSearch && matchesStatus && matchesSite;
    });
  }, [forms, searchTerm, statusFilter, siteFilter]);

  const formStats = useMemo(() => {
    const total = forms.length;
    const submitted = forms.filter((f: ITForms) => f.statusKey === 'StatusKey1').length;
    const underReview = forms.filter((f: ITForms) => f.statusKey === 'StatusKey2').length;
    const approved = forms.filter((f: ITForms) => f.statusKey === 'StatusKey3').length;
    const draft = forms.filter((f: ITForms) => f.statusKey === 'StatusKey0').length;
    return { total, submitted, underReview, approved, draft };
  }, [forms]);

  const resetForm = () => {
    setFormData({
      title: '',
      formCode: '',
      applicantName: '',
      department: '',
      designation: '',
      statusKey: 'StatusKey1',
      siteKey: 'SiteKey0',
      environmentTagKey: 'EnvironmentTagKey2',
      currentStage: '',
      currentAction: '',
      justification: '',
      comments: '',
    });
    setEditingForm(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (form: ITForms) => {
    setEditingForm(form);
    setFormData({
      title: form.title || '',
      formCode: form.formCode || '',
      applicantName: form.applicantName || '',
      department: form.department || '',
      designation: form.designation || '',
      statusKey: form.statusKey || 'StatusKey1',
      siteKey: form.siteKey || 'SiteKey0',
      environmentTagKey: form.environmentTagKey || 'EnvironmentTagKey2',
      currentStage: form.currentStage || '',
      currentAction: form.currentAction || '',
      justification: form.justification || '',
      comments: form.comments || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.formCode) {
      toast.error('Title and Form Code are required');
      return;
    }

    const submitData = {
      title: formData.title,
      formCode: formData.formCode,
      applicantName: formData.applicantName || undefined,
      department: formData.department || undefined,
      designation: formData.designation || undefined,
      statusKey: formData.statusKey,
      siteKey: formData.siteKey,
      environmentTagKey: formData.environmentTagKey,
      currentStage: formData.currentStage || undefined,
      currentAction: formData.currentAction || undefined,
      justification: formData.justification || undefined,
      comments: formData.comments || undefined,
    };

    try {
      if (editingForm) {
        await updateMutation.mutateAsync({
          id: String(editingForm.id),
          changedFields: submitData,
        });
        toast.success('Form updated successfully');
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success('Form registered successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save form');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Delete form "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(String(id));
        toast.success('Form deleted');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete form');
      }
    }
  };

  const getStatusBadgeVariant = (status: ITFormsStatusKey | undefined) => {
    switch (status) {
      case 'StatusKey0':
        return 'secondary'; // Draft
      case 'StatusKey1':
        return 'default'; // Submitted
      case 'StatusKey2':
        return 'outline'; // Under Review
      case 'StatusKey3':
        return 'default'; // Approved
      case 'StatusKey4':
        return 'destructive'; // Rejected
      default:
        return 'outline';
    }
  };

  if (error) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive">Failed to load forms: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Form Registry</h2>
            <Badge variant="outline" className="gap-1 text-xs">
              <Database className="h-3 w-3" />
              {ITForms_DATA_SOURCE_TYPE}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage IT form submissions and their workflow status
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Register Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Forms</p>
          <p className="text-2xl font-bold text-foreground">{formStats.total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Submitted</p>
          <p className="text-2xl font-bold text-primary">{formStats.submitted}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Under Review</p>
          <p className="text-2xl font-bold text-primary">{formStats.underReview}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-primary">{formStats.approved}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Draft</p>
          <p className="text-2xl font-bold text-muted-foreground">{formStats.draft}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search forms by title, code, applicant, or department..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.keys(ITFormsStatusKeyToLabel) as ITFormsStatusKey[]).map((key: ITFormsStatusKey) => (
              <SelectItem key={key} value={key}>
                {ITFormsStatusKeyToLabel[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-[150px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {(Object.keys(ITFormsSiteKeyToLabel) as ITFormsSiteKey[]).map((key: ITFormsSiteKey) => (
              <SelectItem key={key} value={key}>
                {ITFormsSiteKeyToLabel[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Forms Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Form ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredForms.map((form: ITForms) => (
                  <motion.tr
                    key={form.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm font-medium">{form.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {form.formCode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{form.applicantName || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {form.department || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {form.siteKey ? ITFormsSiteKeyToLabel[form.siteKey] : '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {form.currentStage || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(form.statusKey)}>
                        {form.statusKey ? ITFormsStatusKeyToLabel[form.statusKey] : '—'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {form.submittedDate ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(form.submittedDate), 'dd MMM yyyy')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setViewingForm(form)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => openEditDialog(form)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(form.id, form.title)}
                          title="Delete"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}

        {!isLoading && filteredForms.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-4">No forms found</p>
            <Button variant="outline" onClick={openCreateDialog} className="mt-4">
              Register your first form
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingForm ? 'Edit Form' : 'Register Form'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Form Title *</Label>
                <Input
                  placeholder="e.g., EAF-20260428-001"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Form Code *</Label>
                <Input
                  placeholder="e.g., EAF, NIR, ITSSR"
                  value={formData.formCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, formCode: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applicant Name</Label>
                <Input
                  placeholder="Full name"
                  value={formData.applicantName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, applicantName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  placeholder="e.g., IT Operations"
                  value={formData.department}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  placeholder="e.g., Senior Administrator"
                  value={formData.designation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Site</Label>
                <Select
                  value={formData.siteKey}
                  onValueChange={(val: ITFormsSiteKey) =>
                    setFormData({ ...formData, siteKey: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ITFormsSiteKeyToLabel) as ITFormsSiteKey[]).map((key: ITFormsSiteKey) => (
                      <SelectItem key={key} value={key}>
                        {ITFormsSiteKeyToLabel[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.statusKey}
                  onValueChange={(val: ITFormsStatusKey) =>
                    setFormData({ ...formData, statusKey: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ITFormsStatusKeyToLabel) as ITFormsStatusKey[]).map((key: ITFormsStatusKey) => (
                      <SelectItem key={key} value={key}>
                        {ITFormsStatusKeyToLabel[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select
                  value={formData.environmentTagKey}
                  onValueChange={(val: ITFormsEnvironmentTagKey) =>
                    setFormData({ ...formData, environmentTagKey: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ITFormsEnvironmentTagKeyToLabel) as ITFormsEnvironmentTagKey[]).map((key: ITFormsEnvironmentTagKey) => (
                      <SelectItem key={key} value={key}>
                        {ITFormsEnvironmentTagKeyToLabel[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Stage</Label>
                <Input
                  placeholder="e.g., Manager Approval"
                  value={formData.currentStage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, currentStage: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Current Action</Label>
                <Input
                  placeholder="e.g., Pending Manager Review"
                  value={formData.currentAction}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, currentAction: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Justification</Label>
              <Input
                placeholder="Reason for this form submission"
                value={formData.justification}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, justification: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Comments</Label>
              <Input
                placeholder="Additional comments"
                value={formData.comments}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingForm ? 'Save Changes' : 'Register Form'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewingForm} onOpenChange={() => setViewingForm(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Form Details
            </DialogTitle>
          </DialogHeader>

          {viewingForm && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Form ID</p>
                  <p className="font-mono font-medium">{viewingForm.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Form Code</p>
                  <Badge variant="outline">{viewingForm.formCode}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p>{viewingForm.applicantName || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{viewingForm.department || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Site</p>
                  <Badge variant="outline">
                    {viewingForm.siteKey ? ITFormsSiteKeyToLabel[viewingForm.siteKey] : '—'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(viewingForm.statusKey)}>
                    {viewingForm.statusKey ? ITFormsStatusKeyToLabel[viewingForm.statusKey] : '—'}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Current Stage</p>
                <p>{viewingForm.currentStage || '—'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Current Action</p>
                <p>{viewingForm.currentAction || '—'}</p>
              </div>

              {viewingForm.justification && (
                <div>
                  <p className="text-sm text-muted-foreground">Justification</p>
                  <p className="text-sm">{viewingForm.justification}</p>
                </div>
              )}

              {viewingForm.comments && (
                <div>
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p className="text-sm">{viewingForm.comments}</p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setViewingForm(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}