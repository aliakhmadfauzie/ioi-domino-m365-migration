import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  GitBranch,
  Plus,
  Search,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Clock,
  Building2,
  MapPin,
  ArrowLeft,
  Filter,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
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
  DialogFooter,
  DialogDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useITRoutingMatrixList,
  useCreateITRoutingMatrix,
  useUpdateITRoutingMatrix,
  useDeleteITRoutingMatrix,
} from '@/generated/hooks/use-itrouting-matrix';
import {
  ITRoutingMatrixSiteScopeKeyToLabel,
  type ITRoutingMatrix,
  type ITRoutingMatrixSiteScopeKey,
} from '@/generated/models/it-routing-matrix-model';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
} as const;

interface FormData {
  title: string;
  formName: string;
  stageKey: string;
  stageLabel: string;
  approverRole: string;
  approverSPGroup: string;
  escalationDays: number;
  siteScopeKey: ITRoutingMatrixSiteScopeKey | '';
  isActive: boolean;
}

const initialFormData: FormData = {
  title: '',
  formName: '',
  stageKey: '',
  stageLabel: '',
  approverRole: '',
  approverSPGroup: '',
  escalationDays: 3,
  siteScopeKey: '',
  isActive: true,
};

// Common form names for quick selection
const COMMON_FORMS = [
  'EAF',
  'NIR',
  'ITSSR',
  'RS',
  'PRF',
  'HI',
  'ITDR',
  'SAPAMR',
  'SAPTR',
  'SAPCA',
  'SAPCR',
  'SAPDRP',
];

// Stage key options
const STAGE_OPTIONS = [
  { key: 'STAGE_1', label: 'Stage 1 - Initial Submission' },
  { key: 'STAGE_2', label: 'Stage 2 - Manager Review' },
  { key: 'STAGE_3', label: 'Stage 3 - Department Approval' },
  { key: 'STAGE_4', label: 'Stage 4 - Final Approval' },
  { key: 'STAGE_5', label: 'Stage 5 - IT Admin Review' },
];

export default function RoutingMatrixAdminPage() {
  const { data: rules = [], isLoading, refetch } = useITRoutingMatrixList();
  const createMutation = useCreateITRoutingMatrix();
  const updateMutation = useUpdateITRoutingMatrix();
  const deleteMutation = useDeleteITRoutingMatrix();

  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ITRoutingMatrix | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Get unique form names for filter
  const uniqueForms = useMemo(() => {
    const forms = new Set(rules.map((r: ITRoutingMatrix) => r.formName));
    return Array.from(forms).sort();
  }, [rules]);

  // Filter rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule: ITRoutingMatrix) => {
      const matchesSearch =
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rule.approverRole?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (rule.approverSPGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesForm = formFilter === 'all' || rule.formName === formFilter;
      const matchesSite = siteFilter === 'all' || rule.siteScopeKey === siteFilter;
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' && rule.isActive) ||
        (activeFilter === 'inactive' && !rule.isActive);

      return matchesSearch && matchesForm && matchesSite && matchesActive;
    });
  }, [rules, searchTerm, formFilter, siteFilter, activeFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = rules.length;
    const active = rules.filter((r: ITRoutingMatrix) => r.isActive).length;
    const byForm = uniqueForms.length;
    const withEscalation = rules.filter((r: ITRoutingMatrix) => (r.escalationDays ?? 0) > 0).length;
    return { total, active, byForm, withEscalation };
  }, [rules, uniqueForms]);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingRule(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (rule: ITRoutingMatrix) => {
    setEditingRule(rule);
    setFormData({
      title: rule.title,
      formName: rule.formName,
      stageKey: rule.stageKey,
      stageLabel: rule.stageLabel || '',
      approverRole: rule.approverRole || '',
      approverSPGroup: rule.approverSPGroup || '',
      escalationDays: rule.escalationDays || 0,
      siteScopeKey: rule.siteScopeKey || '',
      isActive: rule.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.formName || !formData.stageKey) {
      toast.error('Form Name and Stage Key are required');
      return;
    }

    const ruleData = {
      title: formData.title || `${formData.formName} - ${formData.stageLabel || formData.stageKey}`,
      formName: formData.formName,
      stageKey: formData.stageKey,
      stageLabel: formData.stageLabel || undefined,
      approverRole: formData.approverRole || undefined,
      approverSPGroup: formData.approverSPGroup || undefined,
      escalationDays: formData.escalationDays || undefined,
      siteScopeKey: (formData.siteScopeKey as ITRoutingMatrixSiteScopeKey) || undefined,
      isActive: formData.isActive,
    };

    try {
      if (editingRule) {
        await updateMutation.mutateAsync({
          id: String(editingRule.id),
          changedFields: ruleData,
        });
        toast.success('Routing rule updated successfully');
      } else {
        await createMutation.mutateAsync(ruleData);
        toast.success('Routing rule created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      toast.error(editingRule ? 'Failed to update rule' : 'Failed to create rule');
    }
  };

  const handleToggleActive = async (rule: ITRoutingMatrix) => {
    try {
      await updateMutation.mutateAsync({
        id: String(rule.id),
        changedFields: { isActive: !rule.isActive },
      });
      toast.success(rule.isActive ? 'Rule deactivated' : 'Rule activated');
    } catch (error: unknown) {
      toast.error('Failed to update rule status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Routing rule deleted');
      setDeleteConfirmId(null);
    } catch (error: unknown) {
      toast.error('Failed to delete rule');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Form Name', 'Stage Key', 'Stage Label', 'Approver Role', 'SP Group', 'Escalation Days', 'Site Scope', 'Active'].join(','),
      ...rules.map((r: ITRoutingMatrix) =>
        [
          `"${r.title}"`,
          r.formName,
          r.stageKey,
          r.stageLabel || '',
          r.approverRole || '',
          r.approverSPGroup || '',
          r.escalationDays || 0,
          r.siteScopeKey ? ITRoutingMatrixSiteScopeKeyToLabel[r.siteScopeKey] : '',
          r.isActive ? 'Yes' : 'No',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `it-routing-matrix-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Routing rules exported');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="p-2.5 rounded-xl bg-primary/10">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  IT Routing Matrix
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage approval routing rules from SharePoint
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Rules</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {isLoading ? <Skeleton className="h-9 w-16" /> : stats.total}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Rules</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {isLoading ? <Skeleton className="h-9 w-16" /> : stats.active}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Form Types</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {isLoading ? <Skeleton className="h-9 w-16" /> : stats.byForm}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Unique forms configured</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">With Escalation</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {isLoading ? <Skeleton className="h-9 w-16" /> : stats.withEscalation}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Auto-escalation enabled</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={formFilter} onValueChange={setFormFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              {uniqueForms.map((form: string) => (
                <SelectItem key={form} value={form}>
                  {form}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {(Object.keys(ITRoutingMatrixSiteScopeKeyToLabel) as ITRoutingMatrixSiteScopeKey[]).map(
                (key: ITRoutingMatrixSiteScopeKey) => (
                  <SelectItem key={key} value={key}>
                    {ITRoutingMatrixSiteScopeKeyToLabel[key]}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rules Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5].map((i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredRules.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <GitBranch className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4 font-medium">No routing rules found</p>
                <p className="text-sm mt-1">Try adjusting your filters or create a new rule</p>
                <Button variant="outline" onClick={openCreateDialog} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Rule
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Form</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Approver</TableHead>
                      <TableHead>Site Scope</TableHead>
                      <TableHead>Escalation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredRules.map((rule: ITRoutingMatrix) => (
                        <motion.tr
                          key={rule.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-border last:border-0"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <GitBranch className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <span className="font-mono text-sm font-medium">{rule.formName}</span>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {rule.title}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                                {rule.stageKey.replace(/\D/g, '') || '1'}
                              </span>
                              <span className="text-sm">{rule.stageLabel || rule.stageKey}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {rule.approverRole && (
                                <div className="flex items-center gap-1.5 text-sm">
                                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{rule.approverRole}</span>
                                </div>
                              )}
                              {rule.approverSPGroup && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  SP: {rule.approverSPGroup}
                                </p>
                              )}
                              {!rule.approverRole && !rule.approverSPGroup && (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {rule.siteScopeKey ? (
                              <Badge variant="outline" className="gap-1">
                                <MapPin className="h-3 w-3" />
                                {ITRoutingMatrixSiteScopeKeyToLabel[rule.siteScopeKey]}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">All Sites</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {rule.escalationDays && rule.escalationDays > 0 ? (
                              <div className="flex items-center gap-1.5 text-sm">
                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                                <span>{rule.escalationDays} days</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(rule)}
                              className="gap-2 h-8 px-2"
                            >
                              {rule.isActive ? (
                                <>
                                  <ToggleRight className="h-5 w-5 text-primary" />
                                  <span className="text-primary text-sm font-medium">Active</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                                  <span className="text-muted-foreground text-sm">Inactive</span>
                                </>
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditDialog(rule)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => setDeleteConfirmId(String(rule.id))}
                                title="Delete"
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
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Showing {filteredRules.length} of {rules.length} rules • Data source: SharePoint
        </p>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {editingRule ? 'Edit Routing Rule' : 'Create Routing Rule'}
            </DialogTitle>
            <DialogDescription>
              Configure approval routing for IT forms. Rules define who approves submissions at each stage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rule Title */}
            <div className="space-y-2">
              <Label>Rule Title</Label>
              <Input
                placeholder="Auto-generated if left blank"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Form & Stage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Form Name *</Label>
                <Select
                  value={formData.formName || 'select'}
                  onValueChange={(val: string) =>
                    setFormData({ ...formData, formName: val === 'select' ? '' : val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select a form</SelectItem>
                    {COMMON_FORMS.map((form: string) => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stage Key *</Label>
                <Select
                  value={formData.stageKey || 'select'}
                  onValueChange={(val: string) => {
                    const stage = STAGE_OPTIONS.find((s) => s.key === val);
                    setFormData({
                      ...formData,
                      stageKey: val === 'select' ? '' : val,
                      stageLabel: stage?.label || '',
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select a stage</SelectItem>
                    {STAGE_OPTIONS.map((stage) => (
                      <SelectItem key={stage.key} value={stage.key}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stage Label */}
            <div className="space-y-2">
              <Label>Stage Label</Label>
              <Input
                placeholder="e.g., Manager Approval"
                value={formData.stageLabel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, stageLabel: e.target.value })
                }
              />
            </div>

            {/* Approver Configuration */}
            <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Approver Configuration
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Approver Role</Label>
                  <Input
                    placeholder="e.g., IT_MANAGER, HOD"
                    value={formData.approverRole}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, approverRole: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SharePoint Group</Label>
                  <Input
                    placeholder="e.g., IT Approvers"
                    value={formData.approverSPGroup}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, approverSPGroup: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Site Scope & Escalation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Scope</Label>
                <Select
                  value={formData.siteScopeKey || 'all'}
                  onValueChange={(val: string) =>
                    setFormData({
                      ...formData,
                      siteScopeKey: val === 'all' ? '' : (val as ITRoutingMatrixSiteScopeKey),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sites" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {(Object.keys(ITRoutingMatrixSiteScopeKeyToLabel) as ITRoutingMatrixSiteScopeKey[]).map(
                      (key: ITRoutingMatrixSiteScopeKey) => (
                        <SelectItem key={key} value={key}>
                          {ITRoutingMatrixSiteScopeKeyToLabel[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Escalation Days</Label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  value={formData.escalationDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, escalationDays: parseInt(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">Days before auto-escalation (0 = disabled)</p>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">Enable or disable this routing rule</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
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
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : editingRule
                  ? 'Save Changes'
                  : 'Create Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Routing Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this routing rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}