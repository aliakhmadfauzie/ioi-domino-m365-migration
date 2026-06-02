import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Route,
  Shield,
  Lock,
  Unlock,
  Globe,
  Building2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Loader2,
  Database,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  useRoutePermissionsList,
  useCreateRoutePermissions,
  useUpdateRoutePermissions,
  useDeleteRoutePermissions,
  RoutePermissions_DATA_SOURCE_TYPE,
} from '@/generated/hooks/use-route-permissions';
import type {
  RoutePermissions,
  RoutePermissionsAllowedRolesKeys,
  RoutePermissionsDepartmentKey,
} from '@/generated/models/route-permissions-model';
import {
  RoutePermissionsAllowedRolesKeysToLabel,
  RoutePermissionsDepartmentKeyToLabel,
} from '@/generated/models/route-permissions-model';
import { toast } from 'sonner';

export function RoutePermissionsPanel() {
  const { data: routes = [], isLoading, error } = useRoutePermissionsList();
  const createMutation = useCreateRoutePermissions();
  const updateMutation = useUpdateRoutePermissions();
  const deleteMutation = useDeleteRoutePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RoutePermissions | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    routePath: '',
    routeName: '',
    departmentKey: '' as RoutePermissionsDepartmentKey | '',
    allowedRolesKeys: [] as RoutePermissionsAllowedRolesKeys[],
    requiresAuth: true,
    isPublic: false,
    redirectPath: '',
  });

  const filteredRoutes = useMemo(() => {
    return routes.filter((route: RoutePermissions) => {
      const matchesSearch =
        route.routePath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === 'all' || route.departmentKey === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [routes, searchTerm, departmentFilter]);

  const stats = useMemo(() => {
    const total = routes.length;
    const publicRoutes = routes.filter((r: RoutePermissions) => r.isPublic).length;
    const authRequired = routes.filter((r: RoutePermissions) => r.requiresAuth).length;
    const restricted = routes.filter(
      (r: RoutePermissions) => r.allowedRolesKeys && r.allowedRolesKeys.length > 0
    ).length;
    return { total, publicRoutes, authRequired, restricted };
  }, [routes]);

  const resetForm = () => {
    setFormData({
      title: '',
      routePath: '',
      routeName: '',
      departmentKey: '',
      allowedRolesKeys: [],
      requiresAuth: true,
      isPublic: false,
      redirectPath: '',
    });
    setEditingRoute(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (route: RoutePermissions) => {
    setEditingRoute(route);
    setFormData({
      title: route.title,
      routePath: route.routePath,
      routeName: route.routeName || '',
      departmentKey: route.departmentKey || '',
      allowedRolesKeys: route.allowedRolesKeys || [],
      requiresAuth: route.requiresAuth ?? true,
      isPublic: route.isPublic ?? false,
      redirectPath: route.redirectPath || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.routePath || !formData.title) {
      toast.error('Route path and title are required');
      return;
    }

    const routeData = {
      title: formData.title,
      routePath: formData.routePath,
      routeName: formData.routeName || undefined,
      departmentKey: formData.departmentKey as RoutePermissionsDepartmentKey || undefined,
      allowedRolesKeys: formData.allowedRolesKeys.length > 0 ? formData.allowedRolesKeys : undefined,
      requiresAuth: formData.requiresAuth,
      isPublic: formData.isPublic,
      redirectPath: formData.redirectPath || undefined,
    };

    try {
      if (editingRoute) {
        await updateMutation.mutateAsync({
          id: String(editingRoute.id),
          changedFields: routeData,
        });
        toast.success('Route permission updated');
      } else {
        await createMutation.mutateAsync(routeData);
        toast.success('Route permission created');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save route permission');
    }
  };

  const handleDelete = async (id: number, path: string) => {
    if (confirm(`Delete route permission for ${path}?`)) {
      try {
        await deleteMutation.mutateAsync(String(id));
        toast.success('Route permission deleted');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast.success('Path copied to clipboard');
  };

  const handleRoleToggle = (role: RoutePermissionsAllowedRolesKeys) => {
    setFormData((prev) => {
      const newRoles = prev.allowedRolesKeys.includes(role)
        ? prev.allowedRolesKeys.filter((r: RoutePermissionsAllowedRolesKeys) => r !== role)
        : [...prev.allowedRolesKeys, role];
      return { ...prev, allowedRolesKeys: newRoles };
    });
  };

  const getAccessIcon = (route: RoutePermissions) => {
    if (route.isPublic) return <Globe className="h-4 w-4 text-primary" />;
    if (route.allowedRolesKeys && route.allowedRolesKeys.length > 0)
      return <Lock className="h-4 w-4 text-destructive" />;
    if (route.requiresAuth) return <Unlock className="h-4 w-4 text-amber-500" />;
    return <Globe className="h-4 w-4 text-muted-foreground" />;
  };

  const getAccessLabel = (route: RoutePermissions) => {
    if (route.isPublic) return 'Public';
    if (route.allowedRolesKeys && route.allowedRolesKeys.length > 0) return 'Role Restricted';
    if (route.requiresAuth) return 'Authenticated';
    return 'Public';
  };

  const getAccessBadgeVariant = (route: RoutePermissions): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (route.isPublic) return 'outline';
    if (route.allowedRolesKeys && route.allowedRolesKeys.length > 0) return 'destructive';
    if (route.requiresAuth) return 'secondary';
    return 'outline';
  };

  if (error) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-destructive">Failed to load routes: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Route Permission Management</h2>
            <Badge variant="outline" className="gap-1 text-xs">
              <Database className="h-3 w-3" />
              {RoutePermissions_DATA_SOURCE_TYPE}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure access control for application routes and navigation
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Route
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Route className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Routes</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.authRequired}</p>
              <p className="text-xs text-muted-foreground">Auth Required</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Lock className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.restricted}</p>
              <p className="text-xs text-muted-foreground">Role Restricted</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.publicRoutes}</p>
              <p className="text-xs text-muted-foreground">Public</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by path or name..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {(Object.keys(RoutePermissionsDepartmentKeyToLabel) as RoutePermissionsDepartmentKey[]).map(
              (key: RoutePermissionsDepartmentKey) => (
                <SelectItem key={key} value={key}>
                  {RoutePermissionsDepartmentKeyToLabel[key]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Routes Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Route</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Allowed Roles</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredRoutes.map((route: RoutePermissions) => (
                  <motion.tr
                    key={route.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {route.routeName || route.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyPath(route.routePath)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          {route.routePath}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAccessIcon(route)}
                        <Badge variant={getAccessBadgeVariant(route)}>
                          {getAccessLabel(route)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {route.allowedRolesKeys && route.allowedRolesKeys.length > 0 ? (
                          route.allowedRolesKeys.slice(0, 2).map((role: RoutePermissionsAllowedRolesKeys) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {RoutePermissionsAllowedRolesKeysToLabel[role]}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">All users</span>
                        )}
                        {route.allowedRolesKeys && route.allowedRolesKeys.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{route.allowedRolesKeys.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {route.departmentKey ? (
                        <Badge variant="outline">
                          {RoutePermissionsDepartmentKeyToLabel[route.departmentKey]}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => openEditDialog(route)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(route.id, route.routePath)}
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

        {!isLoading && filteredRoutes.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Route className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-4">No route permissions found</p>
            <Button variant="outline" onClick={openCreateDialog} className="mt-4">
              Add first route
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              {editingRoute ? 'Edit Route Permission' : 'Add Route Permission'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="e.g., IT Department"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Route Path *</Label>
                <Input
                  placeholder="/it/forms"
                  value={formData.routePath}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, routePath: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Route Name</Label>
                <Input
                  placeholder="IT Forms Index"
                  value={formData.routeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, routeName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={formData.departmentKey || 'none'}
                  onValueChange={(val: string) =>
                    setFormData({
                      ...formData,
                      departmentKey: val === 'none' ? '' : (val as RoutePermissionsDepartmentKey),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No department</SelectItem>
                    {(Object.keys(RoutePermissionsDepartmentKeyToLabel) as RoutePermissionsDepartmentKey[]).map(
                      (key: RoutePermissionsDepartmentKey) => (
                        <SelectItem key={key} value={key}>
                          {RoutePermissionsDepartmentKeyToLabel[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Access Configuration */}
            <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="font-medium text-sm">Access Configuration</h4>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresAuth"
                  checked={formData.requiresAuth}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, requiresAuth: checked })
                  }
                />
                <Label htmlFor="requiresAuth" className="text-sm font-normal">
                  Requires Authentication
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, isPublic: checked })
                  }
                />
                <Label htmlFor="isPublic" className="text-sm font-normal">
                  Public Access (no auth needed)
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Redirect Path (if access denied)</Label>
                <Input
                  placeholder="/login or /unauthorized"
                  value={formData.redirectPath}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, redirectPath: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Role Selection */}
            {!formData.isPublic && (
              <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
                <h4 className="font-medium text-sm">Allowed Roles</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(RoutePermissionsAllowedRolesKeysToLabel) as RoutePermissionsAllowedRolesKeys[]).map(
                    (role: RoutePermissionsAllowedRolesKeys) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={formData.allowedRolesKeys.includes(role)}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <Label htmlFor={`role-${role}`} className="text-sm font-normal">
                          {RoutePermissionsAllowedRolesKeysToLabel[role]}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
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
                {editingRoute ? 'Save Changes' : 'Add Route'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}