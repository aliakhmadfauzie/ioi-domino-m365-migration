import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Settings,
  RefreshCw,
  Save,
  Type,
  Hash,
  ToggleLeft,
  ToggleRight,
  Code,
  Shield,
  Bell,
  Palette,
  Plug,
  Cog,
  FolderCog,
  Database,
  Loader2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  useAppSettingsList,
  useCreateAppSettings,
  useUpdateAppSettings,
  useDeleteAppSettings,
  AppSettings_DATA_SOURCE_TYPE,
} from '@/generated/hooks/use-app-settings';
import type { AppSettings, AppSettingsCategoryKey, AppSettingsDataTypeKey } from '@/generated/models/app-settings-model';
import { AppSettingsCategoryKeyToLabel, AppSettingsDataTypeKeyToLabel } from '@/generated/models/app-settings-model';

// Category type for UI grouping
type SettingCategory = 'GENERAL' | 'WORKFLOW' | 'NOTIFICATION' | 'SECURITY' | 'UI' | 'INTEGRATION';

const SETTING_CATEGORY_LABELS: Record<SettingCategory, string> = {
  GENERAL: 'General',
  WORKFLOW: 'Workflow',
  NOTIFICATION: 'Notifications',
  SECURITY: 'Security',
  UI: 'User Interface',
  INTEGRATION: 'Integration',
};

// Map AppSettings category keys to our internal category
const mapCategoryKeyToCategory = (key?: AppSettingsCategoryKey): SettingCategory => {
  if (!key) return 'GENERAL';
  switch (key) {
    case 'CategoryKey0': return 'GENERAL';
    case 'CategoryKey1': return 'WORKFLOW';
    case 'CategoryKey2': return 'UI';
    case 'CategoryKey3': return 'NOTIFICATION';
    case 'CategoryKey4': return 'SECURITY';
    default: return 'GENERAL';
  }
};

const mapCategoryToKey = (cat: SettingCategory): AppSettingsCategoryKey => {
  switch (cat) {
    case 'GENERAL': return 'CategoryKey0';
    case 'WORKFLOW': return 'CategoryKey1';
    case 'UI': return 'CategoryKey2';
    case 'NOTIFICATION': return 'CategoryKey3';
    case 'SECURITY': return 'CategoryKey4';
    case 'INTEGRATION': return 'CategoryKey0'; // Map to general as fallback
    default: return 'CategoryKey0';
  }
};

// Map data type keys
const mapDataTypeKeyToType = (key?: AppSettingsDataTypeKey): 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' => {
  if (!key) return 'STRING';
  switch (key) {
    case 'DataTypeKey0': return 'STRING';
    case 'DataTypeKey1': return 'NUMBER';
    case 'DataTypeKey2': return 'BOOLEAN';
    case 'DataTypeKey3': return 'JSON';
    case 'DataTypeKey4': return 'STRING'; // Date -> String for display
    default: return 'STRING';
  }
};

const mapTypeToDataTypeKey = (type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'): AppSettingsDataTypeKey => {
  switch (type) {
    case 'STRING': return 'DataTypeKey0';
    case 'NUMBER': return 'DataTypeKey1';
    case 'BOOLEAN': return 'DataTypeKey2';
    case 'JSON': return 'DataTypeKey3';
    default: return 'DataTypeKey0';
  }
};

const CATEGORY_ICONS: Record<SettingCategory, typeof Settings> = {
  GENERAL: Cog,
  WORKFLOW: FolderCog,
  NOTIFICATION: Bell,
  SECURITY: Shield,
  UI: Palette,
  INTEGRATION: Plug,
};

export function SystemSettingsPanel() {
  // Fetch from SharePoint
  const { data: rawSettings = [], isLoading, error, refetch } = useAppSettingsList();
  const createSetting = useCreateAppSettings();
  const updateSetting = useUpdateAppSettings();
  const deleteSetting = useDeleteAppSettings();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSettingId, setEditingSettingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    settingKey: '',
    title: '',
    settingValue: '',
    settingType: 'STRING' as 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON',
    settingCategory: 'GENERAL' as SettingCategory,
    description: '',
  });

  // Transform settings for display
  const settings = useMemo(() => {
    return rawSettings.map((s: AppSettings) => ({
      id: s.id,
      title: s.title,
      settingKey: s.settingKey,
      settingValue: s.settingValue || '',
      settingType: mapDataTypeKeyToType(s.dataTypeKey),
      settingCategory: mapCategoryKeyToCategory(s.categoryKey),
      description: s.description,
      isEditable: s.isEditable ?? true,
    }));
  }, [rawSettings]);

  const filteredSettings = useMemo(() => {
    return settings.filter((setting) => {
      const matchesSearch =
        setting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.settingKey.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || setting.settingCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [settings, searchTerm, selectedCategory]);

  const settingsByCategory = useMemo(() => {
    const grouped: Record<SettingCategory, typeof settings> = {
      GENERAL: [],
      WORKFLOW: [],
      NOTIFICATION: [],
      SECURITY: [],
      UI: [],
      INTEGRATION: [],
    };
    filteredSettings.forEach((setting) => {
      grouped[setting.settingCategory].push(setting);
    });
    return grouped;
  }, [filteredSettings]);

  const resetForm = () => {
    setFormData({
      settingKey: '',
      title: '',
      settingValue: '',
      settingType: 'STRING',
      settingCategory: 'GENERAL',
      description: '',
    });
    setEditingSettingId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (setting: typeof settings[0]) => {
    setEditingSettingId(setting.id);
    setFormData({
      settingKey: setting.settingKey,
      title: setting.title,
      settingValue: setting.settingValue,
      settingType: setting.settingType,
      settingCategory: setting.settingCategory,
      description: setting.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.settingKey || !formData.title) {
      toast.error('Please fill in key and title');
      return;
    }

    try {
      if (editingSettingId) {
        await updateSetting.mutateAsync({
          id: String(editingSettingId),
          changedFields: {
            title: formData.title,
            settingKey: formData.settingKey,
            settingValue: formData.settingValue,
            dataTypeKey: mapTypeToDataTypeKey(formData.settingType),
            categoryKey: mapCategoryToKey(formData.settingCategory),
            description: formData.description || undefined,
            isEditable: true,
          },
        });
        toast.success('Setting updated');
      } else {
        await createSetting.mutateAsync({
          title: formData.title,
          settingKey: formData.settingKey,
          settingValue: formData.settingValue,
          dataTypeKey: mapTypeToDataTypeKey(formData.settingType),
          categoryKey: mapCategoryToKey(formData.settingCategory),
          description: formData.description || undefined,
          isEditable: true,
        });
        toast.success('Setting created');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save setting');
    }
  };

  const handleDelete = async (id: number, key: string) => {
    if (confirm(`Delete setting ${key}?`)) {
      try {
        await deleteSetting.mutateAsync(String(id));
        toast.success('Setting deleted');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete setting');
      }
    }
  };

  const handleBooleanToggle = async (id: number, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    try {
      await updateSetting.mutateAsync({
        id: String(id),
        changedFields: { settingValue: newValue },
      });
      toast.success('Setting saved');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Settings refreshed');
  };

  const getTypeIcon = (type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON') => {
    switch (type) {
      case 'STRING':
        return <Type className="h-4 w-4" />;
      case 'NUMBER':
        return <Hash className="h-4 w-4" />;
      case 'BOOLEAN':
        return <ToggleLeft className="h-4 w-4" />;
      case 'JSON':
        return <Code className="h-4 w-4" />;
    }
  };

  const renderSettingValue = (setting: typeof settings[0]) => {
    if (setting.settingType === 'BOOLEAN') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={setting.settingValue === 'true'}
            onCheckedChange={() => handleBooleanToggle(setting.id, setting.settingValue)}
            disabled={!setting.isEditable || updateSetting.isPending}
          />
          <span className="text-sm">{setting.settingValue === 'true' ? 'Enabled' : 'Disabled'}</span>
        </div>
      );
    }
    if (setting.settingType === 'JSON') {
      return (
        <div className="max-w-[300px]">
          <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground block truncate">
            {setting.settingValue}
          </code>
        </div>
      );
    }
    return (
      <span className="font-mono text-sm text-foreground">{setting.settingValue}</span>
    );
  };

  const renderSettingCard = (setting: typeof settings[0]) => (
    <motion.div
      key={setting.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            {getTypeIcon(setting.settingType)}
            <h4 className="font-medium text-foreground">{setting.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{setting.settingKey}</p>
          {setting.description && (
            <p className="text-sm text-muted-foreground mt-2">{setting.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {setting.settingType}
          </Badge>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div>{renderSettingValue(setting)}</div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => openEditDialog(setting)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-destructive hover:text-destructive"
            onClick={() => handleDelete(setting.id, setting.settingKey)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">System Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure platform-wide settings and preferences (SharePoint Connected)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Database className="h-3 w-3" />
            {AppSettings_DATA_SOURCE_TYPE}
          </Badge>
          <Button variant="outline" onClick={handleRefresh} className="gap-2" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Setting
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Error loading settings</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading settings from SharePoint...</p>
        </div>
      )}

      {/* Search and Filter */}
      {!isLoading && (
        <>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or key..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(Object.keys(SETTING_CATEGORY_LABELS) as SettingCategory[]).map((cat: SettingCategory) => (
                  <SelectItem key={cat} value={cat}>
                    {SETTING_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-7 h-auto">
              <TabsTrigger value="all" className="gap-2">
                <Settings className="h-4 w-4" />
                All
              </TabsTrigger>
              {(Object.keys(SETTING_CATEGORY_LABELS) as SettingCategory[]).map((cat: SettingCategory) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <TabsTrigger key={cat} value={cat} className="gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{cat}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {(Object.keys(settingsByCategory) as SettingCategory[]).map((cat: SettingCategory) => {
                const catSettings = settingsByCategory[cat];
                if (catSettings.length === 0) return null;
                const Icon = CATEGORY_ICONS[cat];

                return (
                  <div key={cat} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{SETTING_CATEGORY_LABELS[cat]}</h3>
                      <Badge variant="secondary">{catSettings.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <AnimatePresence mode="popLayout">
                        {catSettings.map((setting) => renderSettingCard(setting))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}

              {filteredSettings.length === 0 && (
                <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                  <Settings className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-4">No settings found</p>
                  <Button variant="outline" onClick={openCreateDialog} className="mt-4">
                    Add your first setting
                  </Button>
                </div>
              )}
            </TabsContent>

            {(Object.keys(SETTING_CATEGORY_LABELS) as SettingCategory[]).map((cat: SettingCategory) => (
              <TabsContent key={cat} value={cat} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {settingsByCategory[cat].map((setting) => renderSettingCard(setting))}
                  </AnimatePresence>
                </div>
                {settingsByCategory[cat].length === 0 && (
                  <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                    <Settings className="mx-auto h-12 w-12 opacity-50" />
                    <p className="mt-4">No settings in this category</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {editingSettingId ? 'Edit Setting' : 'Add Setting'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Setting Key *</Label>
                <Input
                  placeholder="MAX_FILE_SIZE_MB"
                  value={formData.settingKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, settingKey: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') })
                  }
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input
                  placeholder="Max File Size (MB)"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value Type</Label>
                <Select
                  value={formData.settingType}
                  onValueChange={(val: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON') =>
                    setFormData({ ...formData, settingType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STRING">String</SelectItem>
                    <SelectItem value="NUMBER">Number</SelectItem>
                    <SelectItem value="BOOLEAN">Boolean</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.settingCategory}
                  onValueChange={(val: SettingCategory) =>
                    setFormData({ ...formData, settingCategory: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SETTING_CATEGORY_LABELS) as SettingCategory[]).map((cat: SettingCategory) => (
                      <SelectItem key={cat} value={cat}>
                        {SETTING_CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              {formData.settingType === 'BOOLEAN' ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Switch
                    checked={formData.settingValue === 'true'}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, settingValue: checked ? 'true' : 'false' })
                    }
                  />
                  <span>{formData.settingValue === 'true' ? 'Enabled' : 'Disabled'}</span>
                </div>
              ) : formData.settingType === 'JSON' ? (
                <Textarea
                  placeholder='{"key": "value"}'
                  value={formData.settingValue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, settingValue: e.target.value })
                  }
                  className="font-mono text-sm"
                  rows={4}
                />
              ) : (
                <Input
                  type={formData.settingType === 'NUMBER' ? 'number' : 'text'}
                  placeholder="Enter value"
                  value={formData.settingValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, settingValue: e.target.value })
                  }
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Description of what this setting controls..."
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
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
                className="gap-2"
                disabled={createSetting.isPending || updateSetting.isPending}
              >
                {(createSetting.isPending || updateSetting.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingSettingId ? 'Save Changes' : 'Add Setting'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}