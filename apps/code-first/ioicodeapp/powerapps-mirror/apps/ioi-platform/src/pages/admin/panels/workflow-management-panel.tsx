import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GitBranch,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Loader2,
  Database,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Shield,
  AlertCircle,
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
  useITRoutingMatrixList,
  useCreateITRoutingMatrix,
  useUpdateITRoutingMatrix,
  useDeleteITRoutingMatrix,
  ITRoutingMatrix_DATA_SOURCE_TYPE,
} from '@/generated/hooks/use-itrouting-matrix';
import type { ITRoutingMatrix, ITRoutingMatrixSiteScopeKey } from '@/generated/models/it-routing-matrix-model';
import { ITRoutingMatrixSiteScopeKeyToLabel } from '@/generated/models/it-routing-matrix-model';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WorkflowDefinition {
  formName: string;
  stages: ITRoutingMatrix[];
  isActive: boolean;
  totalStages: number;
  sites: string[];
}

export function WorkflowManagementPanel() {
  const { data: routingRules = [], isLoading, error } = useITRoutingMatrixList();
  const createMutation = useCreateITRoutingMatrix();
  const updateMutation = useUpdateITRoutingMatrix();
  const deleteMutation = useDeleteITRoutingMatrix();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set());
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<ITRoutingMatrix | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const [stageFormData, setStageFormData] = useState({
    stageKey: '',
    stageLabel: '',
    approverRole: '',
    approverSPGroup: '',
    siteScopeKey: 'SiteScopeKey4' as ITRoutingMatrixSiteScopeKey,
    escalationDays: 3,
    isActive: true,
  });

  // Group routing rules by form name to create workflow definitions
  const workflows = useMemo((): WorkflowDefinition[] => {
    const grouped = routingRules.reduce(
      (acc: Record<string, ITRoutingMatrix[]>, rule: ITRoutingMatrix) => {
        if (!acc[rule.formName]) {
          acc[rule.formName] = [];
        }
        acc[rule.formName].push(rule);
        return acc;
      },
      {} as Record<string, ITRoutingMatrix[]>
    );

    return Object.entries(grouped)
      .map(([formName, stages]: [string, ITRoutingMatrix[]]) => {
        const sortedStages = stages.sort((a: ITRoutingMatrix, b: ITRoutingMatrix) => {
          const aNum = parseInt(a.stageKey.replace(/\D/g, '') || '0');
          const bNum = parseInt(b.stageKey.replace(/\D/g, '') || '0');
          return aNum - bNum;
        });

        const sites = [...new Set(sortedStages.map((s: ITRoutingMatrix) => s.siteScopeKey || 'All'))].filter(Boolean);

        return {
          formName,
          stages: sortedStages,
          isActive: sortedStages.some((s: ITRoutingMatrix) => s.isActive),
          totalStages: sortedStages.length,
          sites,
        };
      })
      .filter(
        (w: WorkflowDefinition) =>
          w.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.stages.some((s: ITRoutingMatrix) =>
            s.stageLabel?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
  }, [routingRules, searchTerm]);

  const toggleWorkflowExpanded = (formName: string) => {
    setExpandedWorkflows((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(formName)) {
        newSet.delete(formName);
      } else {
        newSet.add(formName);
      }
      return newSet;
    });
  };

  const openAddStageDialog = (formName: string) => {
    setSelectedWorkflow(formName);
    setEditingStage(null);
    setStageFormData({
      stageKey: `Stage${(workflows.find((w: WorkflowDefinition) => w.formName === formName)?.totalStages || 0) + 1}`,
      stageLabel: '',
      approverRole: '',
      approverSPGroup: '',
      siteScopeKey: 'SiteScopeKey4',
      escalationDays: 3,
      isActive: true,
    });
    setIsStageDialogOpen(true);
  };

  const openEditStageDialog = (stage: ITRoutingMatrix) => {
    setSelectedWorkflow(stage.formName);
    setEditingStage(stage);
    setStageFormData({
      stageKey: stage.stageKey,
      stageLabel: stage.stageLabel || '',
      approverRole: stage.approverRole || '',
      approverSPGroup: stage.approverSPGroup || '',
      siteScopeKey: stage.siteScopeKey || 'SiteScopeKey4',
      escalationDays: stage.escalationDays || 3,
      isActive: stage.isActive ?? true,
    });
    setIsStageDialogOpen(true);
  };

  const handleSaveStage = async () => {
    if (!selectedWorkflow || !stageFormData.stageKey) {
      toast.error('Stage key is required');
      return;
    }

    const stageData = {
      title: `${selectedWorkflow} - ${stageFormData.stageKey}`,
      formName: selectedWorkflow,
      stageKey: stageFormData.stageKey,
      stageLabel: stageFormData.stageLabel || undefined,
      approverRole: stageFormData.approverRole || undefined,
      approverSPGroup: stageFormData.approverSPGroup || undefined,
      siteScopeKey: stageFormData.siteScopeKey,
      escalationDays: stageFormData.escalationDays,
      isActive: stageFormData.isActive,
    };

    try {
      if (editingStage) {
        await updateMutation.mutateAsync({
          id: String(editingStage.id),
          changedFields: stageData,
        });
        toast.success('Stage updated successfully');
      } else {
        await createMutation.mutateAsync(stageData);
        toast.success('Stage added successfully');
      }
      setIsStageDialogOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save stage');
    }
  };

  const handleDeleteStage = async (stage: ITRoutingMatrix) => {
    if (confirm(`Delete stage "${stage.stageLabel || stage.stageKey}" from ${stage.formName}?`)) {
      try {
        await deleteMutation.mutateAsync(String(stage.id));
        toast.success('Stage deleted');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete stage');
      }
    }
  };

  const handleToggleStageActive = async (stage: ITRoutingMatrix) => {
    try {
      await updateMutation.mutateAsync({
        id: String(stage.id),
        changedFields: { isActive: !stage.isActive },
      });
      toast.success(`Stage ${stage.isActive ? 'deactivated' : 'activated'}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (error) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive">Failed to load workflows: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Workflow Management</h2>
            <Badge variant="outline" className="gap-1 text-xs">
              <Database className="h-3 w-3" />
              {ITRoutingMatrix_DATA_SOURCE_TYPE}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            View and manage approval workflows derived from routing rules
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search workflows or stages..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Workflows List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : workflows.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground rounded-lg border border-dashed border-border">
          <GitBranch className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-4">No workflows found</p>
          <p className="text-sm">Workflows are created from routing rules in the Approval Routing panel</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {workflows.map((workflow: WorkflowDefinition) => (
              <motion.div
                key={workflow.formName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Workflow Header */}
                <button
                  onClick={() => toggleWorkflowExpanded(workflow.formName)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedWorkflows.has(workflow.formName) ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <GitBranch className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <span className="font-mono font-semibold text-foreground">
                        {workflow.formName}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {workflow.totalStages} stage{workflow.totalStages !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {workflow.sites.map((site: string) => (
                      <Badge key={site} variant="outline" className="text-xs">
                        {ITRoutingMatrixSiteScopeKeyToLabel[site as ITRoutingMatrixSiteScopeKey] || site}
                      </Badge>
                    ))}
                    <Badge
                      variant={workflow.isActive ? 'default' : 'secondary'}
                      className={cn(
                        'text-xs',
                        workflow.isActive && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </button>

                {/* Workflow Stages (Expanded) */}
                <AnimatePresence>
                  {expandedWorkflows.has(workflow.formName) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border bg-muted/20"
                    >
                      <div className="p-4 space-y-3">
                        {/* Stage Flow Visualization */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {workflow.stages.map((stage: ITRoutingMatrix, idx: number) => (
                            <div key={stage.id} className="flex items-center">
                              <div
                                className={cn(
                                  'flex items-center gap-2 px-3 py-2 rounded-lg border',
                                  stage.isActive
                                    ? 'bg-card border-primary/30'
                                    : 'bg-muted/50 border-border'
                                )}
                              >
                                <div
                                  className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                                    stage.isActive
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  )}
                                >
                                  {idx + 1}
                                </div>
                                <span className="text-sm font-medium whitespace-nowrap">
                                  {stage.stageLabel || stage.stageKey}
                                </span>
                              </div>
                              {idx < workflow.stages.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Stage Details Table */}
                        <div className="rounded-lg border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left px-4 py-2 font-medium">Stage</th>
                                <th className="text-left px-4 py-2 font-medium">Approver</th>
                                <th className="text-left px-4 py-2 font-medium">Group</th>
                                <th className="text-left px-4 py-2 font-medium">Escalation</th>
                                <th className="text-left px-4 py-2 font-medium">Status</th>
                                <th className="text-right px-4 py-2 font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {workflow.stages.map((stage: ITRoutingMatrix) => (
                                <tr key={stage.id} className="bg-card hover:bg-muted/30">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {stage.isActive ? (
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <span className="font-medium">
                                        {stage.stageLabel || stage.stageKey}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {stage.approverRole?.toLowerCase().includes('hod') ? (
                                        <Shield className="h-4 w-4 text-amber-500" />
                                      ) : (
                                        <Users className="h-4 w-4 text-blue-500" />
                                      )}
                                      <span>{stage.approverRole || '—'}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-muted-foreground">
                                    {stage.approverSPGroup || '—'}
                                  </td>
                                  <td className="px-4 py-3">
                                    {stage.escalationDays ? (
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        {stage.escalationDays}d
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleStageActive(stage)}
                                      className="gap-1.5 h-8 px-2"
                                      disabled={updateMutation.isPending}
                                    >
                                      {stage.isActive ? (
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
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => openEditStageDialog(stage)}
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteStage(stage)}
                                        disabled={deleteMutation.isPending}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Stage Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAddStageDialog(workflow.formName)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Stage to {workflow.formName}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Stage Dialog */}
      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {editingStage ? 'Edit Stage' : 'Add Stage'} — {selectedWorkflow}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stage Key *</Label>
                <Input
                  placeholder="e.g., Stage1, HOD_Review"
                  value={stageFormData.stageKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStageFormData({ ...stageFormData, stageKey: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stage Label</Label>
                <Input
                  placeholder="e.g., HOD Approval"
                  value={stageFormData.stageLabel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStageFormData({ ...stageFormData, stageLabel: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Approver Role</Label>
                <Input
                  placeholder="e.g., HOD, Manager"
                  value={stageFormData.approverRole}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStageFormData({ ...stageFormData, approverRole: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>SP Group</Label>
                <Input
                  placeholder="e.g., IT Approvers"
                  value={stageFormData.approverSPGroup}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStageFormData({ ...stageFormData, approverSPGroup: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Scope</Label>
                <Select
                  value={stageFormData.siteScopeKey}
                  onValueChange={(val: ITRoutingMatrixSiteScopeKey) =>
                    setStageFormData({ ...stageFormData, siteScopeKey: val })
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
                  value={stageFormData.escalationDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStageFormData({
                      ...stageFormData,
                      escalationDays: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsStageDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveStage}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingStage ? 'Save Changes' : 'Add Stage'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}