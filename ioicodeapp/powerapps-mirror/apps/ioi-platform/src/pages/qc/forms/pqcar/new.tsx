/**
 * PQCAR - Product Quality Corrective Action Request - New Form
 * QC Form for initiating corrective actions for quality issues
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Target,
  User,
  Package,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Zap,
  Search,
  Upload,
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
import { format } from 'date-fns';

const WORKFLOW_STAGES = [
  { id: 1, name: 'Initiator Submit', status: 'current' },
  { id: 2, name: 'QC Review', status: 'pending' },
  { id: 3, name: 'Investigation', status: 'pending' },
  { id: 4, name: 'Action Plan', status: 'pending' },
  { id: 5, name: 'Verification', status: 'pending' },
  { id: 6, name: 'Close', status: 'pending' },
];

const ISSUE_CATEGORIES = [
  { id: 'oos', name: 'Out of Specification', description: 'Test result outside accepted limits' },
  { id: 'customer', name: 'Customer Complaint', description: 'Quality issue reported by customer' },
  { id: 'process', name: 'Process Deviation', description: 'Manufacturing process deviation' },
  { id: 'contamination', name: 'Contamination', description: 'Foreign matter or cross-contamination' },
  { id: 'packaging', name: 'Packaging Defect', description: 'Packaging or labeling issues' },
  { id: 'documentation', name: 'Documentation Error', description: 'Record or documentation issues' },
];

const SEVERITY_LEVELS = [
  { id: 'critical', name: 'Critical', description: 'Immediate action required, product recall risk', icon: Flame, color: 'destructive' },
  { id: 'major', name: 'Major', description: 'Significant impact, requires prompt action', icon: Zap, color: 'amber' },
  { id: 'minor', name: 'Minor', description: 'Limited impact, standard corrective action', icon: AlertTriangle, color: 'secondary' },
];

const SITES = ['PRAI', 'JHR', 'PENANG', 'KUANTAN'];
const DEPARTMENTS = ['Production', 'QC', 'R&D', 'Warehouse', 'Logistics', 'Packaging'];

export default function NewPQCARPage() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    site: '',
    department: '',
    productName: '',
    batchNo: '',
    issueCategory: '',
    severity: '',
    issueDescription: '',
    immediateAction: '',
    relatedOOS: '',
    affectedQuantity: '',
    discoveryDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('PQCAR submitted successfully!', {
      description: `PQCAR-2026-${Math.floor(Math.random() * 100).toString().padStart(3, '0')} has been created`,
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
                <div className="h-9 w-9 rounded-lg bg-secondary/500 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">New PQCAR</h1>
                  <p className="text-xs text-muted-foreground">Product Quality Corrective Action Request</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-secondary/500/10 text-secondary-foreground border-violet-500">
              Stage 1 of 6
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Workflow Progress */}
        <motion.div initial="hidden" animate="show" variants={itemVariants} className="mb-6">
          <Card className="border-violet-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {WORKFLOW_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center min-w-max">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                          stage.status === 'current'
                            ? 'bg-secondary/500 text-white'
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
                            ? 'text-secondary-foreground dark:text-violet-400 font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        {stage.name}
                      </span>
                    </div>
                    {idx < WORKFLOW_STAGES.length - 1 && (
                      <div
                        className={cn(
                          'h-0.5 w-8 mx-1',
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
          {/* Basic Info */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary-foreground" />
                  PQCAR Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>PQCAR Title *</Label>
                  <Input
                    placeholder="Brief description of the quality issue"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label>Discovery Date *</Label>
                    <Input
                      type="date"
                      value={formData.discoveryDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, discoveryDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-secondary-foreground" />
                  Affected Product
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    placeholder="e.g., Glycerin 99.7% USP"
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
                    placeholder="e.g., GL-2026-0325"
                    value={formData.batchNo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, batchNo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Affected Quantity</Label>
                  <Input
                    placeholder="e.g., 500 kg"
                    value={formData.affectedQuantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, affectedQuantity: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3 space-y-2">
                  <Label>Related OOS Reference (if any)</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search OOS reference (e.g., OOS-2026-012)"
                      className="pl-9"
                      value={formData.relatedOOS}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, relatedOOS: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Issue Classification */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-secondary-foreground" />
                  Issue Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Issue Category *</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ISSUE_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, issueCategory: cat.id })}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          formData.issueCategory === cat.id
                            ? 'border-violet-500 bg-secondary/500/10'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        <p
                          className={cn(
                            'text-sm font-medium',
                            formData.issueCategory === cat.id
                              ? 'text-secondary-foreground dark:text-violet-400'
                              : 'text-foreground'
                          )}
                        >
                          {cat.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Severity Level *</Label>
                  <RadioGroup
                    value={formData.severity}
                    onValueChange={(value: string) => setFormData({ ...formData, severity: value })}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    {SEVERITY_LEVELS.map((sev) => {
                      const Icon = sev.icon;
                      return (
                        <div key={sev.id} className="flex items-center">
                          <RadioGroupItem value={sev.id} id={sev.id} className="sr-only" />
                          <Label
                            htmlFor={sev.id}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all flex-1',
                              formData.severity === sev.id
                                ? sev.color === 'destructive'
                                  ? 'border-destructive bg-destructive/10'
                                  : sev.color === 'amber'
                                  ? 'border-accent bg-accent/500/10'
                                  : 'border-secondary bg-secondary/50'
                                : 'border-border hover:border-muted-foreground'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-5 w-5',
                                formData.severity === sev.id
                                  ? sev.color === 'destructive'
                                    ? 'text-destructive'
                                    : sev.color === 'amber'
                                    ? 'text-accent-foreground'
                                    : 'text-muted-foreground'
                                  : 'text-muted-foreground'
                              )}
                            />
                            <div>
                              <p
                                className={cn(
                                  'text-sm font-medium',
                                  formData.severity === sev.id
                                    ? sev.color === 'destructive'
                                      ? 'text-destructive'
                                      : sev.color === 'amber'
                                      ? 'text-accent-foreground dark:text-accent-foreground'
                                      : 'text-foreground'
                                    : 'text-foreground'
                                )}
                              >
                                {sev.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{sev.description}</p>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Issue Description */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary-foreground" />
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Detailed Issue Description *</Label>
                  <Textarea
                    placeholder="Describe the quality issue in detail: What happened? When was it discovered? What are the symptoms?"
                    value={formData.issueDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, issueDescription: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Immediate Containment Action Taken</Label>
                  <Textarea
                    placeholder="Describe any immediate actions taken to contain the issue (e.g., quarantine, stop production, notify customers)"
                    value={formData.immediateAction}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, immediateAction: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="p-4 rounded-lg border border-dashed border-muted-foreground/50 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Drag and drop supporting documents, images, or test reports
                  </p>
                  <Button type="button" variant="outline" size="sm" className="mt-3">
                    Browse Files
                  </Button>
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
              <Button type="submit" disabled={isSubmitting} className="bg-secondary/500 hover:bg-violet-600">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit PQCAR
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
