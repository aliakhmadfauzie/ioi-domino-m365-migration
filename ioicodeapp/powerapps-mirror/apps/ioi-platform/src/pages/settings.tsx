// Settings Page - User preferences and configuration

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Check,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { useRoleAccess } from '@/hooks/use-platform';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const roleLabels: Record<string, string> = {
  initiator: 'Employee',
  manager: 'Manager',
  approver: 'Approver',
  admin: 'Administrator',
};

export default function SettingsPage() {
  const location = useLocation();
  const { data: user } = useUser();
  const { role } = useRoleAccess();
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [approvalReminders, setApprovalReminders] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // Determine back navigation based on current path
  const isInDepartment = location.pathname.startsWith('/it') || location.pathname.startsWith('/hr');
  const backPath = isInDepartment ? location.pathname.split('/').slice(0, 2).join('/') : '/';

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1B5E20] text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                <SettingsIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-white/70">Manage your preferences</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#1B5E20]" />
                Profile
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-[#1B5E20] text-white text-lg font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user?.fullName || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.userPrincipalName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{roleLabels[role] || role}</Badge>
                    <Badge variant="outline" className="text-[#1B5E20] border-[#1B5E20]">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Profile information is managed through Microsoft 365. Contact IT to update your details.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#1B5E20]" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive mobile push notifications</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Notification Types</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Approval Reminders</Label>
                    <p className="text-xs text-muted-foreground">Remind me of pending approvals</p>
                  </div>
                  <Switch
                    checked={approvalReminders}
                    onCheckedChange={setApprovalReminders}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Status Updates</Label>
                    <p className="text-xs text-muted-foreground">Notify when my submissions change status</p>
                  </div>
                  <Switch
                    checked={statusUpdates}
                    onCheckedChange={setStatusUpdates}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Digest</Label>
                    <p className="text-xs text-muted-foreground">Receive a weekly summary email</p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#1B5E20]" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={setTheme}
                  className="grid grid-cols-3 gap-3"
                >
                  <Label
                    htmlFor="theme-light"
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors',
                      theme === 'light' ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Light</span>
                    {theme === 'light' && <Check className="h-4 w-4 text-[#1B5E20]" />}
                  </Label>
                  <Label
                    htmlFor="theme-dark"
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors',
                      theme === 'dark' ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Dark</span>
                    {theme === 'dark' && <Check className="h-4 w-4 text-[#1B5E20]" />}
                  </Label>
                  <Label
                    htmlFor="theme-system"
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors',
                      theme === 'system' ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-border hover:border-muted-foreground'
                    )}
                  >
                    <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                    <Monitor className="h-6 w-6" />
                    <span className="text-sm font-medium">System</span>
                    {theme === 'system' && <Check className="h-4 w-4 text-[#1B5E20]" />}
                  </Label>
                </RadioGroup>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing for denser display</p>
                </div>
                <Switch
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language & Region Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#1B5E20]" />
                Language & Region
              </CardTitle>
              <CardDescription>Set your preferred language and format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="asia-kl">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kl">Asia/Kuala_Lumpur (GMT+8)</SelectItem>
                      <SelectItem value="asia-sg">Asia/Singapore (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#1B5E20]" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Managed through Microsoft 365</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Last Login</p>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-end gap-3"
        >
          <Button variant="outline" asChild>
            <Link to={backPath}>Cancel</Link>
          </Button>
          <Button onClick={handleSave} className="bg-[#1B5E20] hover:bg-[#2E7D32]">
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}