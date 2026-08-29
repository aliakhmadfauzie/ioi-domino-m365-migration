/**
 * Lab Work Request (LWR) - New Form
 * QC Form for requesting laboratory testing
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  TestTube,
  Calendar,
  User,
  Building2,
  Package,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Upload,
  Beaker,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';

const WORKFLOW_STAGES = [
  { id: 1, name: 'Requester Submit', status: 'current' },
  { id: 2, name: 'Lab Receive', status: 'pending' },
  { id: 3, name: 'Testing', status: 'pending' },
  { id: 4, name: 'Review', status: 'pending' },
  { id: 5, name: 'Complete', status: 'pending' },
];

const TEST_TYPES = [
  { id: 'full', name: 'Full Analysis', description: 'Complete product specification testing' },
  { id: 'purity', name: 'Purity Check', description: 'Purity and concentration analysis' },
  { id: 'micro', name: 'Microbiological', description: 'Microbial contamination testing' },
  { id: 'physical', name: 'Physical Properties', description: 'Viscosity, color, odor testing' },
  { id: 'stability', name: 'Stability Testing', description: 'Shelf-life and stability analysis' },
  { id: 'custom', name: 'Custom Tests', description: 'Specify custom test requirements' },
];

const PRIORITY_LEVELS = [
  { id: 'normal', name: 'Normal', days: '3-5 days', color: 'secondary' },
  { id: 'urgent', name: 'Urgent', days: '1-2 days', color: 'amber' },
  { id: 'critical', name: 'Critical', days: 'Same day', color: 'destructive' },
];

const SITES = ['PRAI', 'JHR', 'PENANG', 'KUANTAN'];
const DEPARTMENTS = ['Production', 'R&D', 'QC', 'Warehouse', 'Customer Service'];

export default function NewLabWorkRequestPage() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    batchNo: '',
    site: '',
    department: '',
    sampleType: '',
    quantity: '',
    testType: '',
    priority: 'normal',
    requiredDate: '',
    specialInstructions: '',
    attachSample: false,
    notifyEmail: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Lab Work Request submitted successfully!', {
      description: `LWR-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')} has been created`,
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
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">New Lab Work Request</h1>
                  <p className="text-xs text-muted-foreground">LWR Form • Stage 1 of 5</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-secondary-foreground border-primary">
              Draft
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Workflow Progress */}
        <motion.div initial="hidden" animate="show" variants={itemVariants} className="mb-6">
          <Card className="border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {WORKFLOW_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center min-w-max">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                          stage.status === 'current'
                            ? 'bg-primary text-white'
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
                            ? 'text-secondary-foreground dark:text-primary font-medium'
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
          {/* Requester Info */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Requester Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Requester Name</Label>
                  <Input value={user?.fullName || ''} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Request Date</Label>
                  <Input value={format(new Date(), 'PPP')} disabled className="bg-muted" />
                </div>
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
                  <Label>Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value: string) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sample Details */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Sample Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    placeholder="e.g., Oleic Acid 90%"
                    value={formData.productName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch Number *</Label>
                  <Input
                    placeholder="e.g., OA-2026-0512"
                    value={formData.batchNo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, batchNo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sample Type *</Label>
                  <Select
                    value={formData.sampleType}
                    onValueChange={(value: string) => setFormData({ ...formData, sampleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finished">Finished Product</SelectItem>
                      <SelectItem value="raw">Raw Material</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="packaging">Packaging Material</SelectItem>
                      <SelectItem value="environmental">Environmental Sample</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sample Quantity</Label>
                  <Input
                    placeholder="e.g., 500ml"
                    value={formData.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Test Requirements */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-primary" />
                  Test Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Test Type *</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TEST_TYPES.map((test) => (
                      <div
                        key={test.id}
                        onClick={() => setFormData({ ...formData, testType: test.id })}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          formData.testType === test.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        <p
                          className={cn(
                            'text-sm font-medium',
                            formData.testType === test.id
                              ? 'text-secondary-foreground dark:text-primary'
                              : 'text-foreground'
                          )}
                        >
                          {test.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{test.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Priority Level *</Label>
                  <div className="flex flex-wrap gap-3">
                    {PRIORITY_LEVELS.map((priority) => (
                      <div
                        key={priority.id}
                        onClick={() => setFormData({ ...formData, priority: priority.id })}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all',
                          formData.priority === priority.id
                            ? priority.color === 'destructive'
                              ? 'border-destructive bg-destructive/10'
                              : priority.color === 'amber'
                              ? 'border-accent bg-accent/500/10'
                              : 'border-primary bg-primary/10'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        <Clock
                          className={cn(
                            'h-4 w-4',
                            formData.priority === priority.id
                              ? priority.color === 'destructive'
                                ? 'text-destructive'
                                : priority.color === 'amber'
                                ? 'text-accent-foreground'
                                : 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                        <div>
                          <p
                            className={cn(
                              'text-sm font-medium',
                              formData.priority === priority.id
                                ? priority.color === 'destructive'
                                  ? 'text-destructive'
                                  : priority.color === 'amber'
                                  ? 'text-accent-foreground dark:text-accent-foreground'
                                  : 'text-secondary-foreground dark:text-primary'
                                : 'text-foreground'
                            )}
                          >
                            {priority.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{priority.days}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Completion Date</Label>
                  <Input
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, requiredDate: e.target.value })
                    }
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Textarea
                    placeholder="Any specific requirements, handling instructions, or additional tests..."
                    value={formData.specialInstructions}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, specialInstructions: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sample Handling */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  Sample Handling & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="attachSample"
                    checked={formData.attachSample}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, attachSample: checked })
                    }
                  />
                  <div>
                    <Label htmlFor="attachSample" className="cursor-pointer">
                      Physical sample to be delivered
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Sample will be delivered to lab separately
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notifyEmail"
                    checked={formData.notifyEmail}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, notifyEmail: checked })
                    }
                  />
                  <div>
                    <Label htmlFor="notifyEmail" className="cursor-pointer">
                      Email notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates on test progress and results
                    </p>
                  </div>
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
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary">
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