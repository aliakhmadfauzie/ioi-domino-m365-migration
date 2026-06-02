import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Mail,
  Building2,
  ToggleLeft,
  ToggleRight,
  Shield,
  Globe,
  Folder,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserRoleAssignmentsSharePoint } from '@/hooks/use-admin-sharepoint';
import {
  DEPARTMENT_CODES,
  DEPARTMENT_LABELS,
  ROLE_LABELS,
  type DepartmentCode,
  type UserRoleAssignment,
  type RoleKey,
  type AssignmentScope,
} from '@/types/admin-config';
import { toast } from 'sonner';

export function UserRolesPanel() {
  const {
    assignments,
    isLoading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentActive,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
  } = useUserRoleAssignmentsSharePoint();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<UserRoleAssignment | null>(null);

  const [formData, setFormData] = useState({
    userPrincipalName: '',
    userName: '',
    roleKey: '' as RoleKey | '',
    assignmentScope: 'GLOBAL' as AssignmentScope,
    departmentCodeScope: '' as DepartmentCode | '',
    moduleKeyScope: '',
    notes: '',
  });

  const filteredAssignments = assignments.filter((assignment: UserRoleAssignment) => {
    const matchesSearch =
      assignment.userPrincipalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesRole =
      roleFilter === 'all' || assignment.roleKey === roleFilter;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setFormData({
      userPrincipalName: '',
      userName: '',
      roleKey: '',
      assignmentScope: 'GLOBAL',
      departmentCodeScope: '',
      moduleKeyScope: '',
      notes: '',
    });
    setEditingAssignment(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (assignment: UserRoleAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      userPrincipalName: assignment.userPrincipalName,
      userName: assignment.userName || '',
      roleKey: assignment.roleKey,
      assignmentScope: assignment.assignmentScope,
      departmentCodeScope: assignment.departmentCodeScope || '',
      moduleKeyScope: assignment.moduleKeyScope || '',
      notes: assignment.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.userPrincipalName || !formData.roleKey) {
      toast.error('Please fill in user email and role');
      return;
    }

    if (formData.assignmentScope === 'DEPARTMENT' && !formData.departmentCodeScope) {
      toast.error('Please select a department for department-scoped assignment');
      return;
    }

    try {
      const assignmentData = {
        userPrincipalName: formData.userPrincipalName,
        userName: formData.userName || undefined,
        roleKey: formData.roleKey as RoleKey,
        assignmentScope: formData.assignmentScope,
        departmentCodeScope: formData.departmentCodeScope as DepartmentCode || undefined,
        moduleKeyScope: formData.moduleKeyScope || undefined,
        notes: formData.notes || undefined,
        isActive: true,
      };

      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, assignmentData);
        toast.success('Role assignment updated');
      } else {
        await createAssignment(assignmentData);
        toast.success('Role assigned successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save role assignment');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Remove role from ${email}?`)) {
      try {
        await deleteAssignment(id);
        toast.success('Role assignment removed');
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Failed to remove role assignment');
      }
    }
  };

  const getScopeIcon = (scope: AssignmentScope) => {
    switch (scope) {
      case 'GLOBAL':
        return <Globe className="h-4 w-4" />;
      case 'DEPARTMENT':
        return <Building2 className="h-4 w-4" />;
      case 'MODULE':
        return <Folder className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: RoleKey): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'dept_admin':
      case 'approver':
      case 'manager':
        return 'default';
      case 'initiator':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">User Role Management</h2>
          <p className="text-sm text-muted-foreground">
            Assign and manage user roles across the platform
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Assign Role
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {(Object.keys(ROLE_LABELS) as RoleKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                {ROLE_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4">Loading role assignments from SharePoint...</p>
        </div>
      )}

      {/* Assignments Table */}
      {!isLoading && (
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredAssignments.map((assignment: UserRoleAssignment) => (
                <motion.tr
                  key={assignment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-border last:border-0"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {(assignment.userName || assignment.userPrincipalName)[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{assignment.userName || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {assignment.userPrincipalName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(assignment.roleKey)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {ROLE_LABELS[assignment.roleKey]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getScopeIcon(assignment.assignmentScope)}
                      <div>
                        <span className="text-sm">{assignment.assignmentScope}</span>
                        {assignment.departmentCodeScope && (
                          <p className="text-xs text-muted-foreground">
                            {DEPARTMENT_LABELS[assignment.departmentCodeScope]}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {assignment.notes || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAssignmentActive(assignment.id)}
                      className="gap-2 h-9 px-2"
                    >
                      {assignment.isActive ? (
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
                        className="h-10 w-10"
                        onClick={() => openEditDialog(assignment)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(assignment.id, assignment.userPrincipalName)}
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

        {filteredAssignments.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-4">No role assignments found</p>
            <Button variant="outline" onClick={openCreateDialog} className="mt-4">
              Assign first role
            </Button>
          </div>
        )}
      </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {editingAssignment ? 'Edit Role Assignment' : 'Assign Role'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Email *</Label>
                <Input
                  type="email"
                  placeholder="user@ioi.com"
                  value={formData.userPrincipalName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, userPrincipalName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  placeholder="John Smith"
                  value={formData.userName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                value={formData.roleKey || 'select'}
                onValueChange={(val: string) =>
                  setFormData({ ...formData, roleKey: val === 'select' ? '' : val as RoleKey })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select a role</SelectItem>
                  {(Object.keys(ROLE_LABELS) as RoleKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {ROLE_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scope Configuration */}
            <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="font-medium text-sm">Assignment Scope</h4>
              <Select
                value={formData.assignmentScope}
                onValueChange={(val: AssignmentScope) =>
                  setFormData({ ...formData, assignmentScope: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">Global (All Departments)</SelectItem>
                  <SelectItem value="DEPARTMENT">Department-Specific</SelectItem>
                  <SelectItem value="MODULE">Module-Specific</SelectItem>
                </SelectContent>
              </Select>

              {formData.assignmentScope === 'DEPARTMENT' && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={formData.departmentCodeScope || 'select'}
                    onValueChange={(val: string) =>
                      setFormData({ ...formData, departmentCodeScope: val === 'select' ? '' : val as DepartmentCode })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select">Select department</SelectItem>
                      {DEPARTMENT_CODES.map((code: DepartmentCode) => (
                        <SelectItem key={code} value={code}>
                          {code} - {DEPARTMENT_LABELS[code]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.assignmentScope === 'MODULE' && (
                <div className="space-y-2">
                  <Label>Module Key</Label>
                  <Input
                    placeholder="e.g., FORMS, KPI, APPROVALS"
                    value={formData.moduleKeyScope}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, moduleKeyScope: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes about this assignment..."
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>

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
              <Button onClick={handleSubmit}>
                {editingAssignment ? 'Save Changes' : 'Assign Role'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}