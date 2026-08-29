/**
 * HR Applications Problem Reporting
 * Report issues with HR systems and applications
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bug,
  Save,
  Loader2,
  Monitor,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  CheckCircle2,
  Upload,
  Camera,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';

const HR_APPLICATIONS = [
  { id: 'success-factors', label: 'SAP SuccessFactors' },
  { id: 'workday', label: 'Workday' },
  { id: 'time-attendance', label: 'Time & Attendance System' },
  { id: 'leave-system', label: 'Leave Management System' },
  { id: 'payroll', label: 'Payroll System' },
  { id: 'recruitment', label: 'Recruitment Portal' },
  { id: 'training-portal', label: 'Training Portal / LMS' },
  { id: 'employee-portal', label: 'Employee Self-Service Portal' },
  { id: 'hr-forms', label: 'HR Forms (SharePoint)' },
  { id: 'other', label: 'Other' },
];

const ISSUE_TYPES = [
  { id: 'login', label: 'Login / Access Issue', icon: '🔐' },
  { id: 'data', label: 'Data Error / Missing Data', icon: '📊' },
  { id: 'performance', label: 'Slow Performance', icon: '🐌' },
  { id: 'error', label: 'System Error / Bug', icon: '🐛' },
  { id: 'feature', label: 'Feature Not Working', icon: '⚙️' },
  { id: 'display', label: 'Display / UI Issue', icon: '🖥️' },
  { id: 'integration', label: 'Integration Problem', icon: '🔗' },
  { id: 'other', label: 'Other', icon: '❓' },
];

export default function ProblemReportingPage() {
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    application: '',
    issueType: '',
    severity: 'medium',
    subject: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    browser: '',
    device: '',
    errorMessage: '',
    dateOccurred: format(new Date(), 'yyyy-MM-dd'),
    timeOccurred: format(new Date(), 'HH:mm'),
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.application || !formData.issueType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success('Problem report submitted. Ticket ID: HR-' + Math.floor(Math.random() * 10000));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'high': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'medium': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'low': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/hr" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <Bug className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Problem Reporting</h1>
                  <p className="text-xs text-muted-foreground">HR Application Issues</p>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Submit Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Reporter Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-medium">{user?.fullName || 'Reporter Name'}</p>
                <p className="text-sm text-muted-foreground">{user?.userPrincipalName || 'email@ioigroup.com'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="text-sm font-medium">{format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application & Issue Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Issue Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Application *</Label>
                <Select value={formData.application} onValueChange={(v: string) => updateField('application', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {HR_APPLICATIONS.map((app) => (
                      <SelectItem key={app.id} value={app.id}>{app.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issue Type *</Label>
                <Select value={formData.issueType} onValueChange={(v: string) => updateField('issueType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.icon} {type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Severity *</Label>
              <RadioGroup
                value={formData.severity}
                onValueChange={(value: string) => updateField('severity', value)}
                className="flex flex-wrap gap-3"
              >
                {[
                  { value: 'critical', label: 'Critical', desc: 'System down, blocking all users' },
                  { value: 'high', label: 'High', desc: 'Major feature broken' },
                  { value: 'medium', label: 'Medium', desc: 'Feature impacted but workaround exists' },
                  { value: 'low', label: 'Low', desc: 'Minor issue, cosmetic' },
                ].map((sev) => (
                  <div key={sev.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={sev.value} id={sev.value} />
                    <Label htmlFor={sev.value} className="cursor-pointer">
                      <Badge className={getSeverityColor(sev.value)}>{sev.label}</Badge>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOccurred">Date Occurred</Label>
                <Input
                  id="dateOccurred"
                  type="date"
                  value={formData.dateOccurred}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dateOccurred', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOccurred">Time Occurred</Label>
                <Input
                  id="timeOccurred"
                  type="time"
                  value={formData.timeOccurred}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('timeOccurred', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Problem Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('subject', e.target.value)}
                placeholder="Brief summary of the problem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('description', e.target.value)}
                placeholder="Describe the problem in detail..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
              <Textarea
                id="stepsToReproduce"
                value={formData.stepsToReproduce}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('stepsToReproduce', e.target.value)}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                rows={3}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedBehavior">Expected Behavior</Label>
                <Textarea
                  id="expectedBehavior"
                  value={formData.expectedBehavior}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('expectedBehavior', e.target.value)}
                  placeholder="What should happen?"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualBehavior">Actual Behavior</Label>
                <Textarea
                  id="actualBehavior"
                  value={formData.actualBehavior}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('actualBehavior', e.target.value)}
                  placeholder="What actually happens?"
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="errorMessage">Error Message (if any)</Label>
              <Input
                id="errorMessage"
                value={formData.errorMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('errorMessage', e.target.value)}
                placeholder="Copy and paste the error message here"
              />
            </div>
          </CardContent>
        </Card>

        {/* Environment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Environment
            </CardTitle>
            <CardDescription>Help us understand your setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Browser</Label>
                <Select value={formData.browser} onValueChange={(v: string) => updateField('browser', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select browser" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chrome">Google Chrome</SelectItem>
                    <SelectItem value="edge">Microsoft Edge</SelectItem>
                    <SelectItem value="firefox">Mozilla Firefox</SelectItem>
                    <SelectItem value="safari">Safari</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Device</Label>
                <Select value={formData.device} onValueChange={(v: string) => updateField('device', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop-windows">Desktop (Windows)</SelectItem>
                    <SelectItem value="desktop-mac">Desktop (Mac)</SelectItem>
                    <SelectItem value="laptop-windows">Laptop (Windows)</SelectItem>
                    <SelectItem value="laptop-mac">Laptop (Mac)</SelectItem>
                    <SelectItem value="mobile-android">Mobile (Android)</SelectItem>
                    <SelectItem value="mobile-ios">Mobile (iOS)</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screenshot Upload Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Screenshots
            </CardTitle>
            <CardDescription>Attach screenshots to help illustrate the problem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drop screenshots here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB each</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Upload className="h-4 w-4 mr-1" /> Upload Screenshot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">What happens next?</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Your report will be assigned a ticket number</li>
                  <li>IT/HR team will review within 1 business day</li>
                  <li>You'll receive email updates on progress</li>
                  <li>For critical issues, contact IT Helpdesk directly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link to="/hr">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Bug className="h-4 w-4 mr-2" />
            )}
            Submit Report
          </Button>
        </div>
      </main>
    </div>
  );
}
