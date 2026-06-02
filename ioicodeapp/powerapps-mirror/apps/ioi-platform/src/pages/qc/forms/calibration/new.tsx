/**
 * Equipment Calibration Request - New Form
 * QC Form for scheduling equipment calibration
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Settings,
  User,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Thermometer,
  Wrench,
  Calendar,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { format, addDays } from 'date-fns';

const WORKFLOW_STAGES = [
  { id: 1, name: 'Request', status: 'current' },
  { id: 2, name: 'Schedule', status: 'pending' },
  { id: 3, name: 'Calibration', status: 'pending' },
  { id: 4, name: 'Verification', status: 'pending' },
  { id: 5, name: 'Complete', status: 'pending' },
];

const EQUIPMENT_TYPES = [
  { id: 'chromatography', name: 'Chromatography Systems', examples: 'HPLC, GC, LC-MS' },
  { id: 'spectroscopy', name: 'Spectroscopy Equipment', examples: 'UV-VIS, IR, NIR' },
  { id: 'analytical', name: 'Analytical Instruments', examples: 'pH meters, Conductivity' },
  { id: 'physical', name: 'Physical Testing', examples: 'Viscometers, Density meters' },
  { id: 'balance', name: 'Balances & Scales', examples: 'Analytical, Precision' },
  { id: 'temperature', name: 'Temperature Equipment', examples: 'Thermometers, Ovens, Freezers' },
  { id: 'volumetric', name: 'Volumetric Equipment', examples: 'Pipettes, Burettes' },
];

const CALIBRATION_TYPES = [
  { id: 'scheduled', name: 'Scheduled Calibration', description: 'Regular periodic calibration' },
  { id: 'unscheduled', name: 'Unscheduled Calibration', description: 'Due to malfunction or repair' },
  { id: 'verification', name: 'Verification Check', description: 'Performance verification only' },
  { id: 'requalification', name: 'Requalification', description: 'After maintenance or repair' },
];

const SERVICE_PROVIDERS = [
  { id: 'internal', name: 'Internal Calibration', description: 'QC Lab team' },
  { id: 'external-certified', name: 'External Certified', description: 'ISO 17025 accredited lab' },
  { id: 'oem', name: 'OEM Service', description: 'Equipment manufacturer' },
];

const SITES = ['PRAI', 'JHR', 'PENANG', 'KUANTAN'];
const LABS = ['Lab A', 'Lab B', 'Lab C', 'Production Lab', 'R&D Lab'];

export default function NewCalibrationRequestPage() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    equipmentId: '',
    equipmentName: '',
    equipmentType: '',
    serialNumber: '',
    site: '',
    location: '',
    calibrationType: '',
    serviceProvider: '',
    lastCalibrationDate: '',
    requestedDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    priority: 'normal',
    reason: '',
    specialRequirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Calibration Request submitted successfully!', {
      description: `CAL-2026-${Math.floor(Math.random() * 100).toString().padStart(3, '0')} has been created`,
    });

    setIsSubmitting(false);
    navigate('/qc/forms');
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/qc/forms"
                className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-accent/500 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">New Calibration Request</h1>
                  <p className="text-xs text-muted-foreground">Equipment Calibration Form</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent/500/10 text-accent-foreground border-accent">
              Stage 1 of 5
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Workflow Progress */}
        <motion.div initial="hidden" animate="show" variants={itemVariants} className="mb-6">
          <Card className="border-accent/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {WORKFLOW_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center min-w-max">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                          stage.status === 'current'
                            ? 'bg-accent/500 text-white'
                            : stage.status === 'complete'
                            ? 'bg-primary/50 text-white'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {stage.status === 'complete' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          stage.id
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-xs mt-1 whitespace-nowrap',
                          stage.status === 'current'
                            ? 'text-accent-foreground dark:text-accent-foreground font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        {stage.name}
                      </span>
                    </div>
                    {idx < WORKFLOW_STAGES.length - 1 && (
                      <div
                        className={cn(
                          'h-0.5 w-12 mx-2',
                          stage.status === 'complete' ? 'bg-primary/50' : 'bg-muted'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Information */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-accent-foreground" />
                  Equipment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Equipment ID *</Label>
                    <Input
                      placeholder="e.g., LAB-001"
                      value={formData.equipmentId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, equipmentId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Serial Number</Label>
                    <Input
                      placeholder="Manufacturer serial number"
                      value={formData.serialNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, serialNumber: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Equipment Name *</Label>
                  <Input
                    placeholder="e.g., HPLC System - Agilent 1260"
                    value={formData.equipmentName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, equipmentName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label>Equipment Type *</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {EQUIPMENT_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setFormData({ ...formData, equipmentType: type.id })}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          formData.equipmentType === type.id
                            ? 'border-accent bg-accent/500/10'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        <p
                          className={cn(
                            'text-sm font-medium',
                            formData.equipmentType === type.id
                              ? 'text-accent-foreground dark:text-accent-foreground'
                              : 'text-foreground'
                          )}
                        >
                          {type.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{type.examples}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-accent-foreground" />
                  Equipment Location
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site *</Label>
                  <Select
                    value={formData.site}
                    onValueChange={(value: string) => setFormData({ ...formData, site: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {SITES.map((site) => (
                        <SelectItem key={site} value={site}>
                          {site}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lab/Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value: string) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LABS.map((lab) => (
                        <SelectItem key={lab} value={lab}>
                          {lab}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calibration Details */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-accent-foreground" />
                  Calibration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Calibration Type *</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {CALIBRATION_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setFormData({ ...formData, calibrationType: type.id })}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          formData.calibrationType === type.id
                            ? 'border-accent bg-accent/500/10'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        <p
                          className={cn(
                            'text-sm font-medium',
                            formData.calibrationType === type.id
                              ? 'text-accent-foreground dark:text-accent-foreground'
                              : 'text-foreground'
                          )}
                        >
                          {type.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Service Provider *</Label>
                  <RadioGroup
                    value={formData.serviceProvider}
                    onValueChange={(value: string) => setFormData({ ...formData, serviceProvider: value })}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    {SERVICE_PROVIDERS.map((provider) => (
                      <div key={provider.id} className="flex items-center">
                        <RadioGroupItem value={provider.id} id={provider.id} className="sr-only" />
                        <Label
                          htmlFor={provider.id}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1',
                            formData.serviceProvider === provider.id
                              ? 'border-accent bg-accent/500/10'
                              : 'border-border hover:border-muted-foreground'
                          )}
                        >
                          <div>
                            <p
                              className={cn(
                                'text-sm font-medium',
                                formData.serviceProvider === provider.id
                                  ? 'text-accent-foreground dark:text-accent-foreground'
                                  : 'text-foreground'
                              )}
                            >
                              {provider.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{provider.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Schedule */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  Schedule & Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Last Calibration Date</Label>
                    <Input
                      type="date"
                      value={formData.lastCalibrationDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, lastCalibrationDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Requested Calibration Date *</Label>
                    <Input
                      type="date"
                      value={formData.requestedDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, requestedDate: e.target.value })
                      }
                      min={format(new Date(), 'yyyy-MM-dd')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: string) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason for Calibration</Label>
                  <Textarea
                    placeholder="Why is this calibration needed? (e.g., scheduled maintenance, equipment drift noticed, post-repair)"
                    value={formData.reason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Special Requirements</Label>
                  <Textarea
                    placeholder="Any special calibration requirements, standards to be used, or specific points to calibrate"
                    value={formData.specialRequirements}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, specialRequirements: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="flex items-center justify-between pt-4 border-t"
          >
            <Button type="button" variant="outline" onClick={() => navigate('/qc/forms')}>
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-accent/500 hover:bg-accent">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </main>
    </div>
  );
}