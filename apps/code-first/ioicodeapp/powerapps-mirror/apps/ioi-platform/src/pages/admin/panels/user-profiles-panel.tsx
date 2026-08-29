import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  BadgeCheck,
  XCircle,
  Upload,
  RefreshCw,
  Download,
  Filter,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useUserProfilesList,
  useCreateUserProfiles,
  useUpdateUserProfiles,
  useDeleteUserProfiles,
} from '@/generated/hooks/use-user-profiles';
import {
  UserProfilesDepartmentKeyToLabel,
  UserProfilesSiteKeyToLabel,
  type UserProfilesDepartmentKey,
  type UserProfilesSiteKey,
  type UserProfiles,
} from '@/generated/models/user-profiles-model';
import { toast } from 'sonner';

const DEPARTMENT_OPTIONS = Object.entries(UserProfilesDepartmentKeyToLabel).map(
  ([key, label]) => ({ key: key as UserProfilesDepartmentKey, label })
);

const SITE_OPTIONS = Object.entries(UserProfilesSiteKeyToLabel).map(
  ([key, label]) => ({ key: key as UserProfilesSiteKey, label })
);

interface ProfileFormData {
  title: string;
  displayName: string;
  email: string;
  employeeID: string;
  phone: string;
  departmentKey: UserProfilesDepartmentKey | '';
  siteKey: UserProfilesSiteKey | '';
  profilePhotoURL: string;
  userID: string;
  isActive: boolean;
}

const initialFormData: ProfileFormData = {
  title: '',
  displayName: '',
  email: '',
  employeeID: '',
  phone: '',
  departmentKey: '',
  siteKey: '',
  profilePhotoURL: '',
  userID: '',
  isActive: true,
};

export function UserProfilesPanel() {
  const { data: profiles = [], isLoading, refetch } = useUserProfilesList();
  const createProfile = useCreateUserProfiles();
  const updateProfile = useUpdateUserProfiles();
  const deleteProfile = useDeleteUserProfiles();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfiles | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);

  const filteredProfiles = (profiles as UserProfiles[]).filter((profile: UserProfiles) => {
    const matchesSearch =
      profile.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.employeeID?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'all' || profile.departmentKey === departmentFilter;
    const matchesSite = siteFilter === 'all' || profile.siteKey === siteFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && profile.isActive) ||
      (statusFilter === 'inactive' && !profile.isActive);
    return matchesSearch && matchesDepartment && matchesSite && matchesStatus;
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProfile(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (profile: UserProfiles) => {
    setEditingProfile(profile);
    setFormData({
      title: profile.title || '',
      displayName: profile.displayName || '',
      email: profile.email || '',
      employeeID: profile.employeeID || '',
      phone: profile.phone || '',
      departmentKey: profile.departmentKey || '',
      siteKey: profile.siteKey || '',
      profilePhotoURL: profile.profilePhotoURL || '',
      userID: profile.userID || '',
      isActive: profile.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.displayName || !formData.email) {
      toast.error('Display name and email are required');
      return;
    }

    try {
      const profileData = {
        title: formData.title || formData.displayName,
        displayName: formData.displayName,
        email: formData.email,
        employeeID: formData.employeeID || undefined,
        phone: formData.phone || undefined,
        departmentKey: (formData.departmentKey as UserProfilesDepartmentKey) || undefined,
        siteKey: (formData.siteKey as UserProfilesSiteKey) || undefined,
        profilePhotoURL: formData.profilePhotoURL || undefined,
        userID: formData.userID || undefined,
        isActive: formData.isActive,
      };

      if (editingProfile) {
        await updateProfile.mutateAsync({
          id: String(editingProfile.id),
          changedFields: profileData,
        });
        toast.success('Profile updated successfully');
      } else {
        await createProfile.mutateAsync(profileData);
        toast.success('Profile created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    }
  };

  const handleDelete = async (profile: UserProfiles) => {
    if (confirm(`Delete profile for ${profile.displayName}?`)) {
      try {
        await deleteProfile.mutateAsync(String(profile.id));
        toast.success('Profile deleted successfully');
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete profile');
      }
    }
  };

  const handleToggleStatus = async (profile: UserProfiles) => {
    try {
      await updateProfile.mutateAsync({
        id: String(profile.id),
        changedFields: { isActive: !profile.isActive },
      });
      toast.success(`Profile ${profile.isActive ? 'deactivated' : 'activated'}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const activeCount = (profiles as UserProfiles[]).filter((p: UserProfiles) => p.isActive).length;
  const inactiveCount = (profiles as UserProfiles[]).length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Profile Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage employee profiles across the organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <BadgeCheck className="h-3 w-3" />
            {activeCount} Active
          </Badge>
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3" />
            {inactiveCount} Inactive
          </Badge>
          <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Profile
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[160px]">
            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <SelectItem key={dept.key} value={dept.key}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-[140px]">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {SITE_OPTIONS.map((site) => (
              <SelectItem key={site.key} value={site.key}>
                {site.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading user profiles...</p>
        </div>
      )}

      {/* Profiles Table */}
      {!isLoading && (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredProfiles.map((profile: UserProfiles) => (
                  <motion.tr
                    key={profile.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {profile.profilePhotoURL && (
                            <AvatarImage src={profile.profilePhotoURL} alt={profile.displayName} />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getInitials(profile.displayName || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{profile.displayName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">
                        {profile.employeeID || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {profile.departmentKey ? (
                        <Badge variant="secondary">
                          <Building2 className="h-3 w-3 mr-1" />
                          {UserProfilesDepartmentKeyToLabel[profile.departmentKey]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile.siteKey ? (
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {UserProfilesSiteKeyToLabel[profile.siteKey]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile.phone ? (
                        <span className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {profile.phone}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(profile)}
                        className="gap-2 h-8 px-2"
                      >
                        {profile.isActive ? (
                          <>
                            <BadgeCheck className="h-4 w-4 text-primary" />
                            <span className="text-primary text-sm">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
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
                          className="h-9 w-9"
                          onClick={() => openEditDialog(profile)}
                          title="Edit profile"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(profile)}
                          title="Delete profile"
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

          {filteredProfiles.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <User className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-4">No user profiles found</p>
              <Button variant="outline" onClick={openCreateDialog} className="mt-4">
                Add first profile
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {editingProfile ? 'Edit User Profile' : 'Create User Profile'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {formData.profilePhotoURL && (
                  <AvatarImage src={formData.profilePhotoURL} alt={formData.displayName} />
                )}
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                  {formData.displayName ? getInitials(formData.displayName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label>Profile Photo URL</Label>
                <Input
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profilePhotoURL}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, profilePhotoURL: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name *</Label>
                <Input
                  placeholder="John Smith"
                  value={formData.displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="john.smith@ioi.com"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input
                  placeholder="EMP-001"
                  value={formData.employeeID}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, employeeID: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>User ID (Azure AD)</Label>
                <Input
                  placeholder="Azure AD Object ID"
                  value={formData.userID}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, userID: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Contact & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  placeholder="+60 12-345 6789"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Senior Engineer"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Department & Site */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={formData.departmentKey || 'none'}
                  onValueChange={(val: string) =>
                    setFormData({
                      ...formData,
                      departmentKey: val === 'none' ? '' : (val as UserProfilesDepartmentKey),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No department</SelectItem>
                    {DEPARTMENT_OPTIONS.map((dept) => (
                      <SelectItem key={dept.key} value={dept.key}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Site</Label>
                <Select
                  value={formData.siteKey || 'none'}
                  onValueChange={(val: string) =>
                    setFormData({
                      ...formData,
                      siteKey: val === 'none' ? '' : (val as UserProfilesSiteKey),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No site</SelectItem>
                    {SITE_OPTIONS.map((site) => (
                      <SelectItem key={site.key} value={site.key}>
                        {site.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div>
                <Label className="text-base">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive
                    ? 'User can access the platform'
                    : 'User access is disabled'}
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isActive: checked })
                }
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
              <Button
                onClick={handleSubmit}
                disabled={createProfile.isPending || updateProfile.isPending}
              >
                {createProfile.isPending || updateProfile.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {editingProfile ? 'Save Changes' : 'Create Profile'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}