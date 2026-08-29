import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Database,
  Save,
  ExternalLink,
  Cloud,
  Server,
  Table2,
  Link2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TestTube,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

type DataSourceType = 'SHAREPOINT' | 'DATAVERSE' | 'SQL_SERVER' | 'REST_API' | 'EXCEL';
type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING';

interface DataSourceMapping {
  id: string;
  name: string;
  description?: string;
  sourceType: DataSourceType;
  connectionString: string;
  targetTable?: string;
  status: ConnectionStatus;
  lastSync?: string;
  lastError?: string;
  isActive: boolean;
  mappedFields: {
    sourceField: string;
    targetField: string;
    dataType: string;
    transform?: string;
  }[];
  syncSchedule?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}

const SOURCE_TYPE_CONFIG: Record<DataSourceType, { icon: typeof Database; label: string; color: string }> = {
  SHAREPOINT: { icon: Cloud, label: 'SharePoint', color: 'text-primary' },
  DATAVERSE: { icon: Database, label: 'Dataverse', color: 'text-primary' },
  SQL_SERVER: { icon: Server, label: 'SQL Server', color: 'text-primary' },
  REST_API: { icon: Link2, label: 'REST API', color: 'text-primary' },
  EXCEL: { icon: Table2, label: 'Excel', color: 'text-primary' },
};

const STATUS_CONFIG: Record<ConnectionStatus, { icon: typeof CheckCircle2; label: string; color: string; bgColor: string }> = {
  CONNECTED: { icon: CheckCircle2, label: 'Connected', color: 'text-primary', bgColor: 'bg-primary/10' },
  DISCONNECTED: { icon: XCircle, label: 'Disconnected', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  ERROR: { icon: AlertCircle, label: 'Error', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  PENDING: { icon: RefreshCw, label: 'Pending', color: 'text-primary', bgColor: 'bg-primary/10' },
};

export function DataSourceMappingPanel() {
  const [dataSources, setDataSources] = useState<DataSourceMapping[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSourceMapping | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceType: 'SHAREPOINT' as DataSourceType,
    connectionString: '',
    targetTable: '',
    syncSchedule: '',
    isActive: true,
  });

  const filteredSources = useMemo(() => {
    return dataSources.filter((ds: DataSourceMapping) => {
      const matchesSearch =
        ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ds.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ds.connectionString.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || ds.sourceType === selectedType;
      const matchesStatus = selectedStatus === 'all' || ds.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [dataSources, searchTerm, selectedType, selectedStatus]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sourceType: 'SHAREPOINT',
      connectionString: '',
      targetTable: '',
      syncSchedule: '',
      isActive: true,
    });
    setEditingSource(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (source: DataSourceMapping) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      description: source.description || '',
      sourceType: source.sourceType,
      connectionString: source.connectionString,
      targetTable: source.targetTable || '',
      syncSchedule: source.syncSchedule || '',
      isActive: source.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.connectionString) {
      toast.error('Please fill in name and connection string');
      return;
    }

    const sourceData: DataSourceMapping = {
      id: editingSource?.id || String(Date.now()),
      name: formData.name,
      description: formData.description || undefined,
      sourceType: formData.sourceType,
      connectionString: formData.connectionString,
      targetTable: formData.targetTable || undefined,
      status: 'PENDING',
      isActive: formData.isActive,
      mappedFields: editingSource?.mappedFields || [],
      syncSchedule: formData.syncSchedule || undefined,
      createdBy: editingSource?.createdBy || 'admin@ioi.com',
      createdDate: editingSource?.createdDate || new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    };

    if (editingSource) {
      setDataSources((prev: DataSourceMapping[]) =>
        prev.map((ds: DataSourceMapping) => (ds.id === editingSource.id ? sourceData : ds))
      );
      toast.success('Data source updated');
    } else {
      setDataSources((prev: DataSourceMapping[]) => [...prev, sourceData]);
      toast.success('Data source created');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete data source "${name}"?`)) {
      setDataSources((prev: DataSourceMapping[]) => prev.filter((ds: DataSourceMapping) => ds.id !== id));
      toast.success('Data source deleted');
    }
  };

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    setDataSources((prev: DataSourceMapping[]) =>
      prev.map((ds: DataSourceMapping) =>
        ds.id === id
          ? { ...ds, status: 'ERROR', lastError: 'Live connection testing is not implemented for this source.', lastSync: undefined }
          : ds
      )
    );
    setTestingId(null);
    toast.error('Live connection testing is not implemented for this source');
  };

  const handleToggleActive = (id: string) => {
    setDataSources((prev: DataSourceMapping[]) =>
      prev.map((ds: DataSourceMapping) => (ds.id === id ? { ...ds, isActive: !ds.isActive } : ds))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Data Source Mapping</h2>
          <p className="text-sm text-muted-foreground">
            Configure connections to external data sources
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Data Source
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search data sources..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Source Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(Object.keys(SOURCE_TYPE_CONFIG) as DataSourceType[]).map((type: DataSourceType) => (
              <SelectItem key={type} value={type}>
                {SOURCE_TYPE_CONFIG[type].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {(Object.keys(STATUS_CONFIG) as ConnectionStatus[]).map((status: ConnectionStatus) => (
              <SelectItem key={status} value={status}>
                {STATUS_CONFIG[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Sources Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredSources.map((source: DataSourceMapping) => {
            const typeConfig = SOURCE_TYPE_CONFIG[source.sourceType];
            const TypeIcon = typeConfig.icon;
            const statusConfig = STATUS_CONFIG[source.status];
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className={cn(
                    'border-border hover:border-primary/30 transition-colors',
                    !source.isActive && 'opacity-60'
                  )}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2.5 rounded-lg', 'bg-primary/10')}>
                          <TypeIcon className={cn('h-5 w-5', typeConfig.color)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{source.name}</h3>
                          <p className="text-xs text-muted-foreground">{typeConfig.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn('gap-1', statusConfig.color, statusConfig.bgColor)}
                        >
                          <StatusIcon
                            className={cn('h-3 w-3', testingId === source.id && 'animate-spin')}
                          />
                          {testingId === source.id ? 'Testing...' : statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    {source.description && (
                      <p className="text-sm text-muted-foreground mb-4">{source.description}</p>
                    )}

                    {/* Connection Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground truncate max-w-[280px]">
                          {source.connectionString}
                        </code>
                      </div>
                      {source.targetTable && (
                        <div className="flex items-center gap-2 text-sm">
                          <Table2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-mono text-foreground">{source.targetTable}</span>
                        </div>
                      )}
                    </div>

                    {/* Field Mappings */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">
                        {source.mappedFields.length} field mappings
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {source.mappedFields.slice(0, 4).map((field: { sourceField: string; targetField: string; dataType: string; transform?: string }, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {field.sourceField} → {field.targetField}
                          </Badge>
                        ))}
                        {source.mappedFields.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{source.mappedFields.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Error message */}
                    {source.status === 'ERROR' && source.lastError && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {source.lastError}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={source.isActive}
                          onCheckedChange={() => handleToggleActive(source.id)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {source.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTestConnection(source.id)}
                          disabled={testingId === source.id}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(source)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(source.id, source.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Last sync */}
                    {source.lastSync && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Last sync: {format(new Date(source.lastSync), 'MMM d, HH:mm')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSources.length === 0 && (
        <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
          <Database className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-4">No data sources found</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {editingSource ? 'Edit Data Source' : 'Add Data Source'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                placeholder="HR Employee List"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Source Type</Label>
              <Select
                value={formData.sourceType}
                onValueChange={(val: DataSourceType) => setFormData({ ...formData, sourceType: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SOURCE_TYPE_CONFIG) as DataSourceType[]).map((type: DataSourceType) => (
                    <SelectItem key={type} value={type}>
                      {SOURCE_TYPE_CONFIG[type].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Connection String *</Label>
              <Input
                placeholder="https://sharepoint.com/sites/... or connection string"
                value={formData.connectionString}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, connectionString: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Target Table</Label>
              <Input
                placeholder="Table name in the app"
                value={formData.targetTable}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, targetTable: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Sync Schedule</Label>
              <Select
                value={formData.syncSchedule}
                onValueChange={(val: string) => setFormData({ ...formData, syncSchedule: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Real-time">Real-time</SelectItem>
                  <SelectItem value="Every 5 minutes">Every 5 minutes</SelectItem>
                  <SelectItem value="Every 15 minutes">Every 15 minutes</SelectItem>
                  <SelectItem value="Every 30 minutes">Every 30 minutes</SelectItem>
                  <SelectItem value="Every hour">Every hour</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Description of this data source..."
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
              />
              <div>
                <p className="font-medium text-foreground">Active</p>
                <p className="text-xs text-muted-foreground">Enable sync for this data source</p>
              </div>
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
              <Button onClick={handleSubmit} className="gap-2">
                <Save className="h-4 w-4" />
                {editingSource ? 'Save Changes' : 'Add Data Source'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
