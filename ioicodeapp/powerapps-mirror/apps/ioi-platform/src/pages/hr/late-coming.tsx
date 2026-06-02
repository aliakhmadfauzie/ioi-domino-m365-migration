/**
 * Late Coming Notification Form
 * Employee late arrival reporting
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Save,
  Loader2,
  Calendar,
  User,
  AlertCircle,
  FileText,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { format, differenceInMinutes, parse } from 'date-fns';

export default function LateComingPage() {
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '08:00',
    actualArrivalTime: '',
    department: '',
    site: '',
    reason: '',
    reasonDetails: '',
    supervisorName: '',
    attachEvidence: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateLateMinutes = () => {
    if (!formData.scheduledTime || !formData.actualArrivalTime) return 0;
    const scheduled = parse(formData.scheduledTime, 'HH:mm', new Date());
    const actual = parse(formData.actualArrivalTime, 'HH:mm', new Date());
    return Math.max(0, differenceInMinutes(actual, scheduled));
  };

  const lateMinutes = calculateLateMinutes();

  const getLateCategory = (minutes: number) => {
    if (minutes === 0) return { label: 'On Time', color: 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary' };
    if (minutes <= 15) return { label: 'Minor (≤15 min)', color: 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground' };
    if (minutes <= 30) return { label: 'Moderate (16-30 min)', color: 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground' };
    return { label: 'Significant (>30 min)', color: 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive' };
  };

  const handleSubmit = async () => {
    if (!formData.actualArrivalTime || !formData.reason || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success('Late coming notification submitted');
  };

  const LATE_REASONS = [
    { id: 'traffic', label: 'Traffic Congestion' },
    { id: 'public-transport', label: 'Public Transport Delay' },
    { id: 'vehicle-breakdown', label: 'Vehicle Breakdown' },
    { id: 'medical', label: 'Medical Appointment' },
    { id: 'family-emergency', label: 'Family Emergency' },
    { id: 'weather', label: 'Bad Weather' },
    { id: 'accident', label: 'Road Accident (Witness/Involved)' },
    { id: 'other', label: 'Other' },
  ];

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
                <div className="h-10 w-10 rounded-lg bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Late Coming Notification</h1>
                  <p className="text-xs text-muted-foreground">Report late arrival</p>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Employee Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-medium">{user?.fullName || 'Employee Name'}</p>
                <p className="text-sm text-muted-foreground">{user?.userPrincipalName || 'email@ioigroup.com'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Notification Date</p>
                <p className="text-sm font-medium">{format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Late Arrival Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Arrival Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Site</Label>
                <Select value={formData.site} onValueChange={(v: string) => updateField('site', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prai">IOI Oleochemical - Prai</SelectItem>
                    <SelectItem value="johor">IOI Oleochemical - Johor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Start Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('scheduledTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualArrivalTime">Actual Arrival Time *</Label>
                <Input
                  id="actualArrivalTime"
                  type="time"
                  value={formData.actualArrivalTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('actualArrivalTime', e.target.value)}
                />
              </div>
            </div>

            {/* Late Duration Display */}
            {formData.actualArrivalTime && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-muted"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Late Duration</p>
                    <p className="text-2xl font-bold">
                      {lateMinutes > 0 ? (
                        <>{Math.floor(lateMinutes / 60) > 0 && `${Math.floor(lateMinutes / 60)}h `}{lateMinutes % 60}min</>
                      ) : (
                        'On Time'
                      )}
                    </p>
                  </div>
                  <Badge className={getLateCategory(lateMinutes).color}>
                    {getLateCategory(lateMinutes).label}
                  </Badge>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label>Department *</Label>
              <Select value={formData.department} onValueChange={(v: string) => updateField('department', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="qc">Quality Control</SelectItem>
                  <SelectItem value="qa">Quality Assurance</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisorName">Supervisor Name</Label>
              <Input
                id="supervisorName"
                value={formData.supervisorName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('supervisorName', e.target.value)}
                placeholder="Your direct supervisor's name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Reason for Late Arrival
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reason *</Label>
              <Select value={formData.reason} onValueChange={(v: string) => updateField('reason', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {LATE_REASONS.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>{reason.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonDetails">Details *</Label>
              <Textarea
                id="reasonDetails"
                value={formData.reasonDetails}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('reasonDetails', e.target.value)}
                placeholder="Please provide details about why you were late..."
                rows={4}
              />
            </div>

            {lateMinutes > 30 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-accent/50 dark:bg-accent/30 border border-accent dark:border-accent"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-accent-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent-foreground dark:text-accent-foreground">Supporting Evidence Required</p>
                    <p className="text-xs text-accent-foreground dark:text-accent-foreground mt-1">
                      For late arrivals exceeding 30 minutes, supporting evidence (photos, documents) may be requested by HR.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Declaration</p>
                <p className="text-xs text-muted-foreground mt-1">
                  I confirm that the information provided above is accurate and true. I understand that repeated late arrivals may result in disciplinary action as per company policy.
                </p>
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
              <Save className="h-4 w-4 mr-2" />
            )}
            Submit Notification
          </Button>
        </div>
      </main>
    </div>
  );
}
