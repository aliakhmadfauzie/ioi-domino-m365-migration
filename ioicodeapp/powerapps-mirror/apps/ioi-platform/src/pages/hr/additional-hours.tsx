/**
 * Additional Working Hours Form
 * Overtime and extra hours request
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Timer,
  Save,
  Loader2,
  Calendar,
  Plus,
  Trash2,
  Clock,
  User,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calculator,
  Building2,
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { EmployeePicker } from '@/components/employee-picker';
import { MainDBHRService } from '@/services/main-dbhr-service';
import { format, differenceInMinutes, parse } from 'date-fns';

interface OvertimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  overtimeType: string;
}

export default function AdditionalHoursPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entries, setEntries] = useState<OvertimeEntry[]>([]);
  const [formData, setFormData] = useState({
    department: '',
    site: '',
    project: '',
    reason: '',
    reasonDetails: '',
    compensationType: 'payment',
    supervisorApproval: '',
  });

  const requestorEmail = user?.email || user?.userPrincipalName || '';
  const requestorName = user?.fullName || requestorEmail || 'Employee';

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, {
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '18:00',
      endTime: '21:00',
      breakMinutes: 0,
      overtimeType: 'weekday',
    }]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof OvertimeEntry, value: string | number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const calculateEntryHours = (entry: OvertimeEntry) => {
    if (!entry.startTime || !entry.endTime) return 0;
    const start = parse(entry.startTime, 'HH:mm', new Date());
    const end = parse(entry.endTime, 'HH:mm', new Date());
    const totalMinutes = differenceInMinutes(end, start) - entry.breakMinutes;
    return Math.max(0, totalMinutes / 60);
  };

  const getOvertimeRate = (type: string) => {
    switch (type) {
      case 'weekday': return 1.5;
      case 'weekend': return 2.0;
      case 'holiday': return 3.0;
      default: return 1.0;
    }
  };

  const totalHours = entries.reduce((sum, entry) => sum + calculateEntryHours(entry), 0);
  const totalWeightedHours = entries.reduce((sum, entry) => {
    return sum + (calculateEntryHours(entry) * getOvertimeRate(entry.overtimeType));
  }, 0);

  const getDayTypeLabel = (type: string) => {
    switch (type) {
      case 'weekend': return 'Rest Day';
      case 'holiday': return 'Public Holiday';
      default: return 'Weekday';
    }
  };

  const getSiteKey = (site: string) => {
    switch (site) {
      case 'johor': return 'SiteKey1';
      case 'prai':
      default: return 'SiteKey0';
    }
  };

  const handleSubmit = async () => {
    if (entries.length === 0) {
      toast.error('Please add at least one overtime entry');
      return;
    }
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }
    if (!formData.reason) {
      toast.error('Please provide a reason for overtime');
      return;
    }
    if (!formData.reasonDetails.trim()) {
      toast.error('Please provide overtime details');
      return;
    }
    if (!formData.supervisorApproval) {
      toast.error('Please select the supervisor who pre-approved the overtime');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const title = `AWHR-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      const workingHours = entries.map((entry) => {
        const actualHours = calculateEntryHours(entry);
        const weightedHours = actualHours * getOvertimeRate(entry.overtimeType);

        return {
          empNo: '',
          name: requestorName,
          category: formData.compensationType,
          dateFrom: entry.date,
          dateTo: entry.date,
          dayType: getDayTypeLabel(entry.overtimeType),
          shift: `${entry.startTime}-${entry.endTime}`,
          addHours: actualHours.toFixed(2),
          totalHours: weightedHours.toFixed(2),
          startTime: entry.startTime,
          endTime: entry.endTime,
          breakMinutes: entry.breakMinutes,
          overtimeType: entry.overtimeType,
        };
      });

      await MainDBHRService.create({
        title,
        formcode: 'AWHR',
        formType: 'Rest Day & Additional Working Hours Requisition',
        formversion: '1.0',
        currentaction: 'Submitted',
        statusKey: 'StatusKey1',
        siteKey: getSiteKey(formData.site) as any,
        department: formData.department,
        dept: formData.department,
        employeeid: requestorEmail,
        employeename: requestorName,
        requestoremail: requestorEmail,
        requestordisplayname: requestorName,
        requestedby: requestorName,
        submittedon: now,
        description: formData.reasonDetails.trim(),
        details: formData.reason,
        remarks: formData.reasonDetails.trim(),
        currentapproveremail: formData.supervisorApproval,
        awhrCompany: formData.site || 'prai',
        awhrCategory: formData.compensationType,
        awhrSection: formData.project,
        awhrDepartment: formData.department,
        awhrHOS: formData.supervisorApproval,
        awhrHOD: formData.supervisorApproval,
        awhrCC: requestorEmail,
        awhrRemarks: `${formData.reason}: ${formData.reasonDetails.trim()}`,
        awhrExceeded: '',
        awhrWorkingHours: JSON.stringify(workingHours),
        awhrSubmittedBy: requestorEmail,
        awhrSubmittedDate: now,
        awhrCurrentAction: 'Submitted',
      } as any);

      toast.success('Overtime request submitted for approval');
      navigate('/hr/awhr');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit overtime request');
    } finally {
      setIsSubmitting(false);
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
                <div className="h-10 w-10 rounded-lg bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-secondary-foreground dark:text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Additional Working Hours</h1>
                  <p className="text-xs text-muted-foreground">Overtime Request</p>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={isSubmitting || entries.length === 0}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Submit Request
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
                <p className="text-xs text-muted-foreground">Request Date</p>
                <p className="text-sm font-medium">{format(new Date(), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Work Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
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
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project / Cost Center</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('project', e.target.value)}
                placeholder="e.g., CC-PROD-001 or Project Name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Overtime Entries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Overtime Hours
                </CardTitle>
                <CardDescription>Add the dates and times for overtime work</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addEntry}>
                <Plus className="h-4 w-4 mr-1" /> Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Timer className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No overtime entries</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Entry" to record overtime hours</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={addEntry}>
                  <Plus className="h-4 w-4 mr-1" /> Add First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, index: number) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Entry #{index + 1}</Badge>
                        <Badge className="bg-primary/10 text-primary">
                          {calculateEntryHours(entry).toFixed(1)} hrs
                        </Badge>
                        <Badge variant="secondary">
                          x{getOvertimeRate(entry.overtimeType)} rate
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeEntry(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-5 gap-3">
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <Input
                          type="date"
                          value={entry.date}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEntry(entry.id, 'date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Time *</Label>
                        <Input
                          type="time"
                          value={entry.startTime}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEntry(entry.id, 'startTime', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time *</Label>
                        <Input
                          type="time"
                          value={entry.endTime}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEntry(entry.id, 'endTime', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Break (min)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={120}
                          value={entry.breakMinutes}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEntry(entry.id, 'breakMinutes', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type *</Label>
                        <Select value={entry.overtimeType} onValueChange={(v: string) => updateEntry(entry.id, 'overtimeType', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekday">Weekday (1.5x)</SelectItem>
                            <SelectItem value="weekend">Weekend (2.0x)</SelectItem>
                            <SelectItem value="holiday">Public Holiday (3.0x)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Summary */}
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Summary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Actual Hours</p>
                      <p className="text-xl font-bold">{totalHours.toFixed(1)} hrs</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Weighted Hours</p>
                      <p className="text-xl font-bold text-primary">{totalWeightedHours.toFixed(1)} hrs</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Reason for Overtime
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
                  <SelectItem value="production-demand">Production Demand</SelectItem>
                  <SelectItem value="urgent-order">Urgent Customer Order</SelectItem>
                  <SelectItem value="maintenance">Equipment Maintenance</SelectItem>
                  <SelectItem value="project-deadline">Project Deadline</SelectItem>
                  <SelectItem value="stocktake">Stocktake / Inventory</SelectItem>
                  <SelectItem value="audit">Audit Preparation</SelectItem>
                  <SelectItem value="emergency">Emergency Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reasonDetails">Details *</Label>
              <Textarea
                id="reasonDetails"
                value={formData.reasonDetails}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('reasonDetails', e.target.value)}
                placeholder="Provide details about the overtime work performed..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Compensation Preference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.compensationType}
              onValueChange={(value: string) => updateField('compensationType', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="payment" id="payment" />
                <Label htmlFor="payment" className="flex-1 cursor-pointer">
                  <span className="font-medium">Overtime Payment</span>
                  <p className="text-xs text-muted-foreground">Receive payment based on weighted hours</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="timeoff" id="timeoff" />
                <Label htmlFor="timeoff" className="flex-1 cursor-pointer">
                  <span className="font-medium">Time Off in Lieu (TOIL)</span>
                  <p className="text-xs text-muted-foreground">Convert to compensatory leave</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                  <span className="font-medium">Mixed (50/50)</span>
                  <p className="text-xs text-muted-foreground">Half payment, half time off</p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Approval */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Supervisor Pre-Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="supervisorApproval">Supervisor Name (for pre-approval)</Label>
              <EmployeePicker
                value={formData.supervisorApproval}
                onChange={(value: string) => updateField('supervisorApproval', value)}
                placeholder="Select supervisor..."
              />
              <p className="text-xs text-muted-foreground">Overtime should be pre-approved by your supervisor before submission</p>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Important Notes</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                  <li>Overtime must be pre-approved by your supervisor</li>
                  <li>Maximum overtime is 104 hours per month as per Employment Act</li>
                  <li>Submit claims within 7 days of overtime completion</li>
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
          <Button onClick={handleSubmit} disabled={isSubmitting || entries.length === 0}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Submit Request
          </Button>
        </div>
      </main>
    </div>
  );
}
