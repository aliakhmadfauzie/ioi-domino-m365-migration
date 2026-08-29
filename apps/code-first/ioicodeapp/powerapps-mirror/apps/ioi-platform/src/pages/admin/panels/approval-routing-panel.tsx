import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Route,
  GitMerge,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Clock,
  Users,
  Shield,
  Building2,
  Loader2,
  Database,
  AlertCircle,
  Filter,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  useITRoutingMatrixList,
  useCreateITRoutingMatrix,
  useUpdateITRoutingMatrix,
  useDeleteITRoutingMatrix,
  ITRoutingMatrix_DATA_SOURCE_TYPE,
} from '@/generated/hooks/use-itrouting-matrix';
import type {
  ITRoutingMatrix,
  ITRoutingMatrixSiteScopeKey,
} from '@/generated/models/it-routing-matrix-model';
import { ITRoutingMatrixSiteScopeKeyToLabel } from '@/generated/models/it-routing-matrix-model';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ApprovalRoutingPanel() {
  const { data: rules = [], isLoading, error } = useITRoutingMatrixList();
  const createMutation = useCreateITRoutingMatrix();
  const updateMutation = useUpdateITRoutingMatrix();
  const deleteMutation = useDeleteITRoutingMatrix();

  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ITRoutingMatrix | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    formName: '',
    stageKey: '',
    stageLabel: '',
    approverRole: '',
    approverSPGroup: '',
    siteScopeKey: 'SiteScopeKey4' as ITRoutingMatrixSiteScopeKey,
    escalationDays: 3,
    isActive: true,
  });

  // Get unique form names for filter
  const formNames = useMemo(() => {
    return [...new Set(rules.map((r: ITRoutingMatrix) => r.formName))].sort();
  }, [rules]);

  // Get unique sites for filter
  const sites = useMemo(() => {
    return [...new Set(rules.map((r: ITRoutingMatrix) => r.siteScopeKey).filter(Boolean))] as ITRoutingMatrixSiteScopeKey[];
  }, [rules]);

  const filteredRules = useMemo(() => {
    return rules
      .filter((rule: ITRoutingMatrix) => {
        const matchesSearch =
          rule.formName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rule.stageKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rule.stageLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rule.approverRole?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesForm = formFilter === 'all' || rule.formName === formFilter;
        const matchesSite = siteFilter === 'all' || rule.siteScopeKey === siteFilter;
        return matchesSearch && matchesForm && matchesSite;
      })
      .sort((a: ITRoutingMatrix, b: ITRoutingMatrix) => {
        // Sort by form name, then by stage number
        const formComp = a.formName.localeCompare(b.formName);
        if (formComp !== 0) return formComp;
        const aNum = parseInt(a.stageKey.replace(/\D/g, '') || '0');
        const bNum = parseInt(b.stageKey.replace(/\D/g, '') || '0');
        return aNum - bNum;
      });
  }, [rules, searchTerm, formFilter, siteFilter]);

  const stats = useMemo(() => {
    const total = rules.length;
    const active = rules.filter((r: ITRoutingMatrix) => r.isActive).length;
    const forms = new Set(rules.map((r: ITRoutingMatrix) => r.formName)).size;
    const avgEscalation =
      rules.length > 0
        ? Math.round(
            rules.reduce((sum: number, r: ITRoutingMatrix) => sum + (r.escalationDays || 0), 0) /
              rules.length
          )
        : 0;
    return { total, active, forms, avgEscalation };
  }, [rules]);

  const resetForm = () => {
    setFormData({
      title: '',
      formName: '',
      stageKey: '',
      stageLabel: '',
      approverRole: '',
      approverSPGroup: '',
      siteScopeKey: 'SiteScopeKey4',
      escalationDays: 3,
      isActive: true,
    });
    setEditingRule(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (rule: ITRoutingMatrix) => {
    setEditingRule(rule);
    setFormData({
      title: rule.title || '',
      formName: rule.formName || '',
      stageKey: rule.stageKey || '',
      stageLabel: rule.stageLabel || '',
      approverRole: rule.approverRole || '',
      approverSPGroup: rule.approverSPGroup || '',
      siteScopeKey: rule.siteScopeKey || 'SiteScopeKey4',
      escalationDays: rule.escalationDays || 3,
      isActive: rule.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.formName || !formData.stageKey) {
      toast.error('Form name and Stage key are required');
      return;
    }

    const ruleData = {
      title: formData.title || `${formData.formName} - ${formData.stageKey}`,
      formName: formData.formName,
      stageKey: formData.stageKey,
      stageLabel: formData.stageLabel || undefined,
      approverRole: formData.approverRole || undefined,
      approverSPGroup: formData.approverSPGroup || undefined,
      siteScopeKey: formData.siteScopeKey,
      escalationDays: formData.escalationDays,
      isActive: formData.isActive,
    };

    try {
      if (editingRule) {
        await updateMutation.mutateAsync({
          id: String(editingRule.id),
          changedFields: ruleData,
        });
        toast.success('Routing rule updated');
      } else {
        await createMutation.mutateAsync(ruleData);
        toast.success('Routing rule created');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save routing rule');
    }
  };

  const handleDelete = async (id: number, label: string) => {
    if (confirm(`Delete routing rule "${label}"?`)) {
      try {
        await deleteMutation.mutateAsync(String(id));
        toast.success('Routing rule deleted');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  const handleToggleActive = async (rule: ITRoutingMatrix) => {
    try {
      await updateMutation.mutateAsync({
        id: String(rule.id),
        changedFields: { isActive: !rule.isActive },
      });
      toast.success(`Rule ${rule.isActive ? 'deactivated' : 'activated'}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const duplicateRule = (rule: ITRoutingMatrix) => {
    setEditingRule(null);
    setFormData({
      title: `${rule.formName} - Copy`,
      formName: rule.formName,
      stageKey: `${rule.stageKey}_copy`,
      stageLabel: rule.stageLabel ? `${rule.stageLabel} (Copy)` : '',
      approverRole: rule.approverRole || '',
      approverSPGroup: rule.approverSPGroup || '',
      siteScopeKey: rule.siteScopeKey || 'SiteScopeKey4',
      escalationDays: rule.escalationDays || 3,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  if (error) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive">Failed to load routing rules: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Approval Routing Rules</h2>
            <Badge variant="outline" className="gap-1 text-xs">
              <Database className="h-3 w-3" />
              {ITRoutingMatrix_DATA_SOURCE_TYPE}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure form approval workflows and routing stages
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Routing Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GitMerge className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Rules</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ToggleRight className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Rules</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Route className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.forms}</p>
              <p className="text-xs text-muted-foreground">Form Types</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.avgEscalation}d</p>
              <p className="text-xs text-muted-foreground">Avg Escalation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by form, stage, or approver..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={formFilter} onValueChange={setFormFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Forms</SelectItem>
            {formNames.map((name: string) => (
              <SelectItem key={name} value={name}>
                {name}
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
            {sites.map((site: ITRoutingMatrixSiteScopeKey) => (
              <SelectItem key={site} value={site}>
                {ITRoutingMatrixSiteScopeKeyToLabel[site]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rules Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Form</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>SP Group</TableHead>
                <TableHead>Site</TableHead>
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
                      <Badge variant="outline" className="font-mono">
                        {rule.formName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                            rule.isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {rule.stageKey.replace(/\D/g, '') || '?'}
                        </div>
                        <span className="font-medium">
                          {rule.stageLabel || rule.stageKey}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {rule.approverRole?.toLowerCase().includes('hod') ? (
                          <Shield className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Users className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="text-sm">
                          {rule.approverRole || <span className="text-muted-foreground">—</span>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rule.approverSPGroup || '—'}
                    </TableCell>
                    <TableCell>
                      {rule.siteScopeKey ? (
                        <Badge variant="outline" className="text-xs">
                          {ITRoutingMatrixSiteScopeKeyToLabel[rule.siteScopeKey]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {rule.escalationDays ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {rule.escalationDays} days
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 h-8 px-2"
                        onClick={() => handleToggleActive(rule)}
                        disabled={updateMutation.isPending}
                      >
                        {rule.isActive ? (
                          <>
                            <ToggleRight className="h-4 w-4 text-primary" />
                            <span className="text-xs text-primary">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Off</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => duplicateRule(rule)}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => openEditDialog(rule)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive"
                          onClick={() =>
                            handleDelete(rule.id, rule.stageLabel || rule.stageKey)
                          }
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

        {!isLoading && filteredRules.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <GitMerge className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-4">No routing rules found</p>
            <Button variant="outline" onClick={openCreateDialog} className="mt-4">
              Create first routing rule
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitMerge className="h-5 w-5" />
              {editingRule ? 'Edit Routing Rule' : 'Add Routing Rule'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Form Name *</Label>
                <Input
                  placeholder="e.g., ITSSR, EAF, NIR"
                  value={formData.formName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, formName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stage Key *</Label>
                <Input
                  placeholder="e.g., Stage1, HOD_Review"
                  value={formData.stageKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, stageKey: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stage Label</Label>
                <Input
                  placeholder="e.g., HOD Approval"
                  value={formData.stageLabel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, stageLabel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., ITSSR - Stage1"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Approver Role</Label>
                <Input
                  placeholder="e.g., HOD, Manager, IT Admin"
                  value={formData.approverRole}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, approverRole: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>SP Group</Label>
                <Input
                  placeholder="SharePoint group name"
                  value={formData.approverSPGroup}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, approverSPGroup: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Scope</Label>
                <Select
                  value={formData.siteScopeKey}
                  onValueChange={(val: ITRoutingMatrixSiteScopeKey) =>
                    setFormData({ ...formData, siteScopeKey: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                    setFormData({
                      ...formData,
                      escalationDays: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label>Active</Label>
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
                {editingRule ? 'Save Changes' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}