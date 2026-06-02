import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Users,
  MapPin,
  Shield,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Building,
  Clock,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DialogDescription,
  DialogFooter,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  useFormApprovers,
  useSiteRouting,
  useUserRolePermissions,
  type ApproverInfo,
  type SiteRoutingConfig,
} from '@/hooks/use-approver-matrix';
import {
  useUserRolesITList,
  useCreateUserRolesIT,
  useUpdateUserRolesIT,
  useDeleteUserRolesIT,
} from '@/generated/hooks/use-user-roles-it';
import type { UserRolesIT, UserRolesITRoleCodeKey } from '@/generated/models/user-roles-it-model';
import { UserRolesITSiteKeyToLabel } from '@/generated/models/user-roles-it-model';

const FORM_CODES = [
  { code: 'EAF', name: 'External Access Form (VPN/Citrix)' },
  { code: 'NIR', name: 'Notes ID Request' },
  { code: 'RS', name: 'Reset Password / Unlock ID' },
  { code: 'SFAR', name: 'Share Folder Access Requisition' },
  { code: 'UR', name: 'User ID Requisition Form' },
  { code: 'ITSSR', name: 'IT Support & Service Request' },
  { code: 'PRF', name: 'Program Request Form' },
  { code: 'ITDR', name: 'IT Daily Report' },
  { code: 'IAL1', name: 'Server Reboot Log' },
  { code: 'IAL2', name: 'Data Center Access Log' },
  { code: 'IAL3', name: 'IT Event' },
  { code: 'IAL4', name: 'Server Records' },
  { code: 'IAL5', name: 'Data Restoration Request' },
  { code: 'HI', name: 'Hardware Inventory Form' },
];

const APPROVAL_ROLES = [
  { value: 'Approver', label: 'Approver (First Level)' },
  { value: 'HoD', label: 'Head of Department' },
  { value: 'Manager', label: 'Manager' },
  { value: 'ITAdmin', label: 'IT Administrator' },
  { value: 'SecurityOfficer', label: 'Security Officer' },
  { value: 'ExecutiveDirector', label: 'Executive Director' },
  { value: 'NotesAdmin', label: 'Notes Administrator' },
  { value: 'FolderOwner', label: 'Folder Owner' },
];

const SECURITY_ROLES = [
  { value: 'Admin', label: 'System Administrator' },
  { value: 'SuperAdmin', label: 'Super Administrator' },
  { value: 'ITAdmin', label: 'IT Administrator' },
  { value: 'Manager', label: 'IT Manager' },
  { value: 'HoD', label: 'Head of Department' },
  { value: 'SecurityOfficer', label: 'Security Officer' },
  { value: 'ExecutiveDirector', label: 'Executive Director' },
  { value: 'Viewer', label: 'Read Only' },
];

const SITES = [
  { value: 'PRAI', label: 'Prai (MY-PR)' },
  { value: 'JOHOR', label: 'Johor (MY-JH)' },
  { value: 'ALL', label: 'All Sites' },
];

interface ApproverMatrixFormData {
  id?: number;
  formCode: string;
  stage: string;
  approverRole: string;
  approverName: string;
  approverEmail: string;
  department: string;
  escalationDays: number;
  site: string;
  isActive: boolean;
}

interface UserRoleFormData {
  id?: number;
  userEmail: string;
  userName: string;
  securityRole: string;
  department: string;
  site: string;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
}

// Type alias for ConfigApproverMatrix (not available in generated models)
interface ConfigApproverMatrix {
  id: number;
  configKey?: string;
  title: string;
  configValue?: string;
  category?: string;
  description?: string;
  isActive?: boolean;
}

export default function WorkflowMatrixPage() {
  const [activeTab, setActiveTab] = useState('approvers');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormCode, setFilterFormCode] = useState<string>('all');
  const [filterSite, setFilterSite] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ApproverMatrixFormData | UserRoleFormData | null>(null);
  const [expandedForms, setExpandedForms] = useState<string[]>([]);

  // Data hooks
  const { allApprovers, isLoading: approversLoading } = useFormApprovers();
  const { johorRouting, penangRouting, isLoading: routingLoading } = useSiteRouting();
  const { isITAdmin, isManager } = useUserRolePermissions();

  // SharePoint data hooks - matrix not available
  const { data: rolesData, isLoading: rolesLoading, refetch: refetchRoles } = useUserRolesITList();

  // Mutations - only user roles available
  const createRole = useCreateUserRolesIT();
  const updateRole = useUpdateUserRolesIT();
  const deleteRole = useDeleteUserRolesIT();

  // Matrix entries - use static empty array since ConfigApproverMatrix is not available
  const matrixEntries: ConfigApproverMatrix[] = [];
  const matrixLoading = false;
  const refetchMatrix = () => {};

  // Parse roles data
  const userRoles = useMemo(() => {
    const rawData = rolesData as { value?: UserRolesIT[] } | UserRolesIT[] | undefined;
    return Array.isArray(rawData) ? rawData : rawData?.value || [];
  }, [rolesData]);

  // Filter matrix entries - empty since no matrix available
  const filteredMatrix = matrixEntries;

  // Filter user roles
  const filteredRoles = useMemo(() => {
    return userRoles.filter((role: UserRolesIT) => {
      const matchesSearch = !searchQuery || 
        role.userDisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSite = filterSite === 'all' || (role.siteKey ? UserRolesITSiteKeyToLabel[role.siteKey] : 'ALL') === filterSite;
      return matchesSearch && matchesSite;
    });
  }, [userRoles, searchQuery, filterSite]);

  // Group matrix by form code - empty since no matrix available
  const groupedMatrix: Record<string, ConfigApproverMatrix[]> = {};

  const toggleFormExpand = (formCode: string) => {
    setExpandedForms((prev: string[]) => 
      prev.includes(formCode) 
        ? prev.filter((f: string) => f !== formCode) 
        : [...prev, formCode]
    );
  };

  const handleSaveMatrix = async (_data: ApproverMatrixFormData) => {
    // ConfigApproverMatrix hooks not available
    toast.error('Approver matrix configuration is not available');
  };

  const handleSaveRole = async (data: UserRoleFormData) => {
    try {
      if (data.id) {
        await updateRole.mutateAsync({
          id: String(data.id),
          changedFields: {
            title: data.userName,
            userEmail: data.userEmail,
            userDisplayName: data.userName,
            securityRole: data.securityRole,
            department: data.department,
            isActive: data.isActive,
          },
        });
        toast.success('User role updated successfully');
      } else {
        await createRole.mutateAsync({
          title: data.userName,
          userEmail: data.userEmail,
          userDisplayName: data.userName,
          securityRole: data.securityRole,
          department: data.department,
          isActive: data.isActive,
          roleCodeKey: 'RoleCodeKey0', // Default to INITIATOR
        });
        toast.success('User role created');
      }
      refetchRoles();
      setShowAddDialog(false);
      setEditingItem(null);
    } catch (err) {
      toast.error('Failed to save user role');
      console.error(err);
    }
  };

  const handleDeleteMatrix = async (_id: number) => {
    // ConfigApproverMatrix hooks not available
    toast.error('Approver matrix configuration is not available');
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user role?')) return;
    try {
      await deleteRole.mutateAsync(String(id));
      toast.success('User role deleted');
      refetchRoles();
    } catch (err) {
      toast.error('Failed to delete user role');
      console.error(err);
    }
  };

  const canEdit = isITAdmin || isManager;

  const isLoading = approversLoading || routingLoading || matrixLoading || rolesLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Workflow Configuration</h1>
                <p className="text-muted-foreground">Manage approval matrices, routing, and user permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { refetchMatrix(); refetchRoles(); }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              {canEdit && (
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="approvers" className="gap-2">
              <Users className="h-4 w-4" />
              Approver Matrix
            </TabsTrigger>
            <TabsTrigger value="routing" className="gap-2">
              <MapPin className="h-4 w-4" />
              Site Routing
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              User Roles
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === 'approvers' && (
              <Select value={filterFormCode} onValueChange={setFilterFormCode}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {FORM_CODES.map((form) => (
                    <SelectItem key={form.code} value={form.code}>{form.code} - {form.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {activeTab === 'roles' && (
              <Select value={filterSite} onValueChange={setFilterSite}>
                <SelectTrigger className="w-[200px]">
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {SITES.map((site) => (
                    <SelectItem key={site.value} value={site.value}>{site.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Approver Matrix Tab */}
          <TabsContent value="approvers">
            {isLoading ? (
              <div className="flex items-center justify-center py-12" aria-hidden="true">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              </div>
            ) : Object.keys(groupedMatrix).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Approver Matrix Entries</h3>
                  <p className="mt-2 text-muted-foreground">Add entries to configure approval workflows for forms</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedMatrix).map(([formCode, entries]) => {
                  const formInfo = FORM_CODES.find((f) => f.code === formCode);
                  const isExpanded = expandedForms.includes(formCode);

                  return (
                    <Collapsible key={formCode} open={isExpanded} onOpenChange={() => toggleFormExpand(formCode)}>
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                <div>
                                  <CardTitle className="text-lg">{formCode}</CardTitle>
                                  <CardDescription>{formInfo?.name || 'Unknown Form'}</CardDescription>
                                </div>
                              </div>
                              <Badge variant="secondary">{entries.length} approver(s)</Badge>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Stage</TableHead>
                                  <TableHead>Approver Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Role</TableHead>
                                  <TableHead>Escalation</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {entries.map((entry: ConfigApproverMatrix) => {
                                  const [, stage, escalation] = (entry.configKey || '').split('_');
                                  return (
                                    <TableRow key={entry.id}>
                                      <TableCell>
                                        <Badge variant="outline">{stage || 'S1'}</Badge>
                                      </TableCell>
                                      <TableCell className="font-medium">{entry.title}</TableCell>
                                      <TableCell className="text-muted-foreground">{entry.configValue}</TableCell>
                                      <TableCell>
                                        <Badge>{entry.category || 'Approver'}</Badge>
                                      </TableCell>
                                      <TableCell>
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {escalation || '3'} days
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {canEdit && (
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="ghost"
                                              size="icon-sm"
                                              onClick={() => {
                                                setEditingItem({
                                                  id: entry.id,
                                                  formCode,
                                                  stage: stage || 'S1',
                                                  approverRole: entry.category || 'Approver',
                                                  approverName: entry.title,
                                                  approverEmail: entry.configValue || '',
                                                  department: entry.description || '',
                                                  escalationDays: parseInt(escalation || '3', 10),
                                                  site: 'ALL',
                                                  isActive: true,
                                                });
                                                setShowAddDialog(true);
                                              }}
                                            >
                                              <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon-sm"
                                              className="text-destructive hover:text-destructive"
                                              onClick={() => entry.id && handleDeleteMatrix(entry.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Site Routing Tab */}
          <TabsContent value="routing">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Johor Routing */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Johor (MY-JH)</CardTitle>
                      <CardDescription>{johorRouting.length} routing rules</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {johorRouting.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No routing rules configured</p>
                  ) : (
                    <div className="space-y-3">
                      {johorRouting.slice(0, 10).map((config: SiteRoutingConfig, idx: number) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{config.configKey}</p>
                            <p className="text-sm text-muted-foreground">{config.category}</p>
                          </div>
                          <Badge variant="outline">{config.configValue || 'N/A'}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Penang Routing */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Building className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <CardTitle>Penang / Prai (MY-PR)</CardTitle>
                      <CardDescription>{penangRouting.length} routing rules</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {penangRouting.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No routing rules configured</p>
                  ) : (
                    <div className="space-y-3">
                      {penangRouting.slice(0, 10).map((config: SiteRoutingConfig, idx: number) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{config.configKey}</p>
                            <p className="text-sm text-muted-foreground">{config.category}</p>
                          </div>
                          <Badge variant="outline">{config.configValue || 'N/A'}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Roles Tab */}
          <TabsContent value="roles">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Security Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-muted-foreground">No user roles found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRoles.map((role: UserRolesIT) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.userDisplayName || role.title}</TableCell>
                          <TableCell className="text-muted-foreground">{role.userEmail}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{role.securityRole}</Badge>
                          </TableCell>
                          <TableCell>{role.department || '-'}</TableCell>
                          <TableCell>{role.siteKey ? UserRolesITSiteKeyToLabel[role.siteKey] : 'ALL'}</TableCell>
                          <TableCell>
                            {role.isActive !== false ? (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {canEdit && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => {
                                    setEditingItem({
                                      id: role.id,
                                      userEmail: role.userEmail,
                                      userName: role.userDisplayName || role.title,
                                      securityRole: role.securityRole,
                                      department: role.department || '',
                                      site: role.siteKey ? UserRolesITSiteKeyToLabel[role.siteKey] : 'ALL',
                                      isActive: role.isActive !== false,
                                    });
                                    setShowAddDialog(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => role.id && handleDeleteRole(role.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Entry' : activeTab === 'approvers' ? 'Add Approver' : 'Add User Role'}
            </DialogTitle>
            <DialogDescription>
              {activeTab === 'approvers'
                ? 'Configure an approver for a specific form and stage'
                : 'Assign security roles to users'}
            </DialogDescription>
          </DialogHeader>

          {activeTab === 'approvers' ? (
            <ApproverMatrixForm
              initialData={editingItem as ApproverMatrixFormData}
              allApprovers={allApprovers}
              onSave={handleSaveMatrix}
              onCancel={() => { setShowAddDialog(false); setEditingItem(null); }}
              isLoading={false}
            />
          ) : (
            <UserRoleForm
              initialData={editingItem as UserRoleFormData}
              onSave={handleSaveRole}
              onCancel={() => { setShowAddDialog(false); setEditingItem(null); }}
              isLoading={createRole.isPending || updateRole.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Approver Matrix Form Component
function ApproverMatrixForm({
  initialData,
  allApprovers,
  onSave,
  onCancel,
  isLoading,
}: {
  initialData?: ApproverMatrixFormData | null;
  allApprovers: ApproverInfo[];
  onSave: (data: ApproverMatrixFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<ApproverMatrixFormData>(
    initialData || {
      formCode: 'EAF',
      stage: 'S1',
      approverRole: 'Approver',
      approverName: '',
      approverEmail: '',
      department: '',
      escalationDays: 3,
      site: 'ALL',
      isActive: true,
    }
  );

  const handleApproverSelect = (email: string) => {
    const approver = allApprovers.find((a: ApproverInfo) => a.email === email);
    if (approver) {
      setFormData((prev) => ({
        ...prev,
        approverName: approver.name,
        approverEmail: approver.email,
        department: approver.department || '',
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Form</Label>
          <Select value={formData.formCode} onValueChange={(v) => setFormData((p) => ({ ...p, formCode: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORM_CODES.map((form) => (
                <SelectItem key={form.code} value={form.code}>{form.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Stage</Label>
          <Select value={formData.stage} onValueChange={(v) => setFormData((p) => ({ ...p, stage: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S1">S1 - Submission</SelectItem>
              <SelectItem value="S2">S2 - First Approval</SelectItem>
              <SelectItem value="S3">S3 - Second Approval</SelectItem>
              <SelectItem value="S4">S4 - Final Approval</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Approver Role</Label>
        <Select value={formData.approverRole} onValueChange={(v) => setFormData((p) => ({ ...p, approverRole: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {APPROVAL_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Select Existing Approver</Label>
        <Select onValueChange={handleApproverSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose from existing approvers" />
          </SelectTrigger>
          <SelectContent>
            {allApprovers.filter((a: ApproverInfo) => a.email).map((approver: ApproverInfo) => (
              <SelectItem key={approver.id} value={approver.email}>
                {approver.name} ({approver.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Approver Name</Label>
          <Input
            value={formData.approverName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p) => ({ ...p, approverName: e.target.value }))}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <Label>Approver Email</Label>
          <Input
            type="email"
            value={formData.approverEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p) => ({ ...p, approverEmail: e.target.value }))}
            placeholder="email@ioi.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Escalation Days</Label>
          <Input
            type="number"
            min={1}
            max={30}
            value={formData.escalationDays}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p) => ({ ...p, escalationDays: parseInt(e.target.value, 10) || 3 }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Site</Label>
          <Select value={formData.site} onValueChange={(v) => setFormData((p) => ({ ...p, site: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SITES.map((site) => (
                <SelectItem key={site.value} value={site.value}>{site.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading || !formData.approverName || !formData.approverEmail}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}

// User Role Form Component
function UserRoleForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
}: {
  initialData?: UserRoleFormData | null;
  onSave: (data: UserRoleFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<UserRoleFormData>(
    initialData || {
      userEmail: '',
      userName: '',
      securityRole: 'Viewer',
      department: '',
      site: 'ALL',
      isActive: true,
    }
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>User Name</Label>
          <Input
            value={formData.userName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p) => ({ ...p, userName: e.target.value }))}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <Label>User Email</Label>
          <Input
            type="email"
            value={formData.userEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p) => ({ ...p, userEmail: e.target.value }))}
            placeholder="email@ioi.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Security Role</Label>
        <Select value={formData.securityRole} onValueChange={(v) => setFormData((p) => ({ ...p, securityRole: v }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECURITY_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Department</Label>
          <Input
            value={formData.department}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p) => ({ ...p, department: e.target.value }))}
            placeholder="IT, HR, Finance..."
          />
        </div>
        <div className="space-y-2">
          <Label>Site</Label>
          <Select value={formData.site} onValueChange={(v) => setFormData((p) => ({ ...p, site: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SITES.map((site) => (
                <SelectItem key={site.value} value={site.value}>{site.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label>Active Status</Label>
          <p className="text-sm text-muted-foreground">User can access the system</p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked: boolean) => setFormData((p) => ({ ...p, isActive: checked }))}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading || !formData.userName || !formData.userEmail}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  );
}