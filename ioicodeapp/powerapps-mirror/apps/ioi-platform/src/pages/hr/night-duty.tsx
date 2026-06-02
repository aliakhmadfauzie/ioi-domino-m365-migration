/**
 * Night Duty Findings Form
 * Security patrol and night shift findings reporting
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Moon,
  Save,
  Loader2,
  Plus,
  Trash2,
  Clock,
  MapPin,
  AlertTriangle,
  Camera,
  User,
  CheckCircle2,
  XCircle,
  Info,
  Shield,
  Eye,
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';

interface PatrolFinding {
  id: string;
  time: string;
  location: string;
  findingType: string;
  description: string;
  actionTaken: string;
  severity: string;
}

const PATROL_LOCATIONS = [
  'Main Gate',
  'Production Area A',
  'Production Area B',
  'Warehouse',
  'Tank Farm',
  'Boiler House',
  'Laboratory',
  'Admin Building',
  'Canteen',
  'Loading Bay',
  'Pump Station',
  'Control Room',
  'Fire Station',
  'Perimeter Fence',
];

const FINDING_TYPES = [
  { id: 'safety', label: 'Safety Hazard', icon: AlertTriangle },
  { id: 'security', label: 'Security Issue', icon: Shield },
  { id: 'equipment', label: 'Equipment Malfunction', icon: Info },
  { id: 'unauthorized', label: 'Unauthorized Access', icon: XCircle },
  { id: 'observation', label: 'General Observation', icon: Eye },
];

export default function NightDutyPage() {
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [findings, setFindings] = useState<PatrolFinding[]>([]);
  const [formData, setFormData] = useState({
    dutyDate: format(new Date(), 'yyyy-MM-dd'),
    shiftTime: '',
    site: '',
    dutyOfficer: user?.fullName || '',
    relievedBy: '',
    weatherCondition: '',
    overallStatus: '',
    additionalRemarks: '',
    checklistItems: [] as string[],
  });

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFinding = () => {
    setFindings((prev) => [...prev, {
      id: Date.now().toString(),
      time: format(new Date(), 'HH:mm'),
      location: '',
      findingType: '',
      description: '',
      actionTaken: '',
      severity: 'low',
    }]);
  };

  const removeFinding = (id: string) => {
    setFindings((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFinding = (id: string, field: keyof PatrolFinding, value: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmit = async () => {
    if (!formData.shiftTime || !formData.site) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success('Night duty report submitted successfully');
  };

  const CHECKLIST_ITEMS = [
    'All doors and windows secured',
    'Fire equipment checked',
    'Emergency exits clear',
    'CCTV cameras operational',
    'Perimeter fence intact',
    'Lighting adequate',
    'No unauthorized personnel',
    'Production equipment off/secured',
    'Chemical storage locked',
    'Vehicles properly parked',
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
                <div className="h-10 w-10 rounded-lg bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Night Duty Findings</h1>
                  <p className="text-xs text-muted-foreground">Security Patrol Report</p>
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
        {/* Duty Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Duty Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dutyDate">Duty Date *</Label>
                <Input
                  id="dutyDate"
                  type="date"
                  value={formData.dutyDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dutyDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Shift Time *</Label>
                <Select value={formData.shiftTime} onValueChange={(v: string) => updateField('shiftTime', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="night-1">Night Shift 1 (6PM - 12AM)</SelectItem>
                    <SelectItem value="night-2">Night Shift 2 (12AM - 6AM)</SelectItem>
                    <SelectItem value="full-night">Full Night (6PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Site *</Label>
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
                <Label>Weather Condition</Label>
                <Select value={formData.weatherCondition} onValueChange={(v: string) => updateField('weatherCondition', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="heavy-rain">Heavy Rain</SelectItem>
                    <SelectItem value="storm">Storm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dutyOfficer">Duty Officer</Label>
                <Input
                  id="dutyOfficer"
                  value={formData.dutyOfficer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('dutyOfficer', e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relievedBy">Relieved By</Label>
                <Input
                  id="relievedBy"
                  value={formData.relievedBy}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('relievedBy', e.target.value)}
                  placeholder="Name of relieving officer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Security Checklist
            </CardTitle>
            <CardDescription>Mark all items that have been verified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {CHECKLIST_ITEMS.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={formData.checklistItems.includes(item)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        updateField('checklistItems', [...formData.checklistItems, item]);
                      } else {
                        updateField('checklistItems', formData.checklistItems.filter((i: string) => i !== item));
                      }
                    }}
                  />
                  <Label htmlFor={item} className="text-sm cursor-pointer">{item}</Label>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{formData.checklistItems.length}</span> of {CHECKLIST_ITEMS.length} items verified
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Findings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Patrol Findings
                </CardTitle>
                <CardDescription>Record any issues or observations during patrol</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addFinding}>
                <Plus className="h-4 w-4 mr-1" /> Add Finding
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {findings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Eye className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No findings recorded</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add Finding" if you observed any issues</p>
                <Badge className="mt-3" variant="outline">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  All Clear
                </Badge>
              </div>
            ) : (
              <div className="space-y-4">
                {findings.map((finding, index: number) => (
                  <motion.div
                    key={finding.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Finding #{index + 1}</Badge>
                        {finding.severity === 'high' && (
                          <Badge className="bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFinding(finding.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={finding.time}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFinding(finding.id, 'time', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Select value={finding.location} onValueChange={(v: string) => updateFinding(finding.id, 'location', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {PATROL_LOCATIONS.map((loc) => (
                              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Severity</Label>
                        <Select value={finding.severity} onValueChange={(v: string) => updateFinding(finding.id, 'severity', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label>Finding Type</Label>
                      <Select value={finding.findingType} onValueChange={(v: string) => updateFinding(finding.id, 'findingType', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {FINDING_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label>Description</Label>
                      <Textarea
                        value={finding.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFinding(finding.id, 'description', e.target.value)}
                        placeholder="Describe what you found"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Action Taken</Label>
                      <Textarea
                        value={finding.actionTaken}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFinding(finding.id, 'actionTaken', e.target.value)}
                        placeholder="Describe the action you took"
                        rows={2}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Shift Status</Label>
              <RadioGroup
                value={formData.overallStatus}
                onValueChange={(value: string) => updateField('overallStatus', value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all-clear" id="all-clear" />
                  <Label htmlFor="all-clear" className="cursor-pointer flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    All Clear
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minor-issues" id="minor-issues" />
                  <Label htmlFor="minor-issues" className="cursor-pointer flex items-center gap-1">
                    <Info className="h-4 w-4 text-accent-foreground" />
                    Minor Issues
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="major-issues" id="major-issues" />
                  <Label htmlFor="major-issues" className="cursor-pointer flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Major Issues
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalRemarks">Additional Remarks</Label>
              <Textarea
                id="additionalRemarks"
                value={formData.additionalRemarks}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('additionalRemarks', e.target.value)}
                placeholder="Any additional notes or handover instructions for the next shift"
                rows={3}
              />
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
            Submit Report
          </Button>
        </div>
      </main>
    </div>
  );
}
