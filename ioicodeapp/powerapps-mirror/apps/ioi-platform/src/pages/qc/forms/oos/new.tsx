/**
 * OOS Report - Out of Specification Report - New Form
 * QC Form for reporting test results outside specifications
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  AlertTriangle,
  User,
  Package,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  TestTube,
  Scale,
  Target,
  Microscope,
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';

const WORKFLOW_STAGES = [
  { id: 1, name: 'Analyst Submit', status: 'current' },
  { id: 2, name: 'Supervisor Review', status: 'pending' },
  { id: 3, name: 'Phase 1 Investigation', status: 'pending' },
  { id: 4, name: 'Phase 2 Investigation', status: 'pending' },
  { id: 5, name: 'Resolution', status: 'pending' },
  { id: 6, name: 'Close', status: 'pending' },
];

const TEST_PARAMETERS = [
  { id: 'purity', name: 'Purity', unit: '%' },
  { id: 'acid-value', name: 'Acid Value', unit: 'mg KOH/g' },
  { id: 'iodine-value', name: 'Iodine Value', unit: 'g I₂/100g' },
  { id: 'color', name: 'Color', unit: 'R (Lovibond)' },
  { id: 'moisture', name: 'Moisture Content', unit: '%' },
  { id: 'ash', name: 'Ash Content', unit: '%' },
  { id: 'viscosity', name: 'Viscosity', unit: 'cP' },
  { id: 'ph', name: 'pH', unit: '' },
  { id: 'density', name: 'Density', unit: 'g/mL' },
  { id: 'melting-point', name: 'Melting Point', unit: '°C' },
];

const OOS_TYPES = [
  { id: 'out-of-spec', name: 'Out of Specification', description: 'Result outside product specification limits' },
  { id: 'out-of-trend', name: 'Out of Trend', description: 'Result shows abnormal trend deviation' },
  { id: 'atypical', name: 'Atypical Result', description: 'Unexpected or unusual result pattern' },
];

const SITES = ['PRAI', 'JHR', 'PENANG', 'KUANTAN'];

export default function NewOOSReportPage() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    site: '',
    productName: '',
    batchNo: '',
    lwrReference: '',
    oosType: '',
    parameter: '',
    specLimitLow: '',
    specLimitHigh: '',
    actualResult: '',
    unit: '',
    testMethod: '',
    testDate: format(new Date(), 'yyyy-MM-dd'),
    equipmentUsed: '',
    initialObservation: '',
    sampleRetained: 'yes',
  });

  const handleParameterChange = (value: string) => {
    const param = TEST_PARAMETERS.find((p) => p.id === value);
    setFormData({
      ...formData,
      parameter: value,
      unit: param?.unit || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('OOS Report submitted successfully!', {
      description: `OOS-2026-${Math.floor(Math.random() * 100).toString().padStart(3, '0')} has been created`,
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
                <div className="h-9 w-9 rounded-lg bg-destructive flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">New OOS Report</h1>
                  <p className="text-xs text-muted-foreground">Out of Specification Investigation</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
              Stage 1 of 6
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Critical Alert */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={itemVariants}
          className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">OOS Investigation Required</p>
              <p className="text-sm text-muted-foreground">
                All out-of-specification results must be investigated immediately. Retain all samples and documentation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Workflow Progress */}
        <motion.div initial="hidden" animate="show" variants={itemVariants} className="mb-6">
          <Card className="border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {WORKFLOW_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center min-w-max">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                          stage.status === 'current'
                            ? 'bg-destructive text-white'
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
                            ? 'text-destructive dark:text-destructive font-medium'
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
          {/* Sample Information */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-destructive" />
                  Sample Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Label>LWR Reference</Label>
                  <Input
                    placeholder="e.g., LWR-2026-158"
                    value={formData.lwrReference}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lwrReference: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Test Date *</Label>
                  <Input
                    type="date"
                    value={formData.testDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, testDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sample Retained? *</Label>
                  <Select
                    value={formData.sampleRetained}
                    onValueChange={(value: string) => setFormData({ ...formData, sampleRetained: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes - Sample retained</SelectItem>
                      <SelectItem value="no">No - Sample consumed</SelectItem>
                      <SelectItem value="partial">Partial - Some remaining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* OOS Classification */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-destructive" />
                  OOS Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>OOS Type *</Label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {OOS_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setFormData({ ...formData, oosType: type.id })}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          formData.oosType === type.id
                            ? 'border-destructive bg-destructive/10'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        <p
                          className={cn(
                            'text-sm font-medium',
                            formData.oosType === type.id
                              ? 'text-destructive dark:text-destructive'
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Test Results */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-destructive" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Parameter Tested *</Label>
                    <Select value={formData.parameter} onValueChange={handleParameterChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEST_PARAMETERS.map((param) => (
                          <SelectItem key={param.id} value={param.id}>
                            {param.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Test Method</Label>
                    <Input
                      placeholder="e.g., USP Method 123"
                      value={formData.testMethod}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, testMethod: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Equipment Used</Label>
                    <Input
                      placeholder="e.g., HPLC-001"
                      value={formData.equipmentUsed}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, equipmentUsed: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Specification vs Actual</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Spec Lower Limit</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Min"
                          value={formData.specLimitLow}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, specLimitLow: e.target.value })
                          }
                        />
                        <span className="flex items-center text-sm text-muted-foreground">
                          {formData.unit}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Spec Upper Limit</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Max"
                          value={formData.specLimitHigh}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, specLimitHigh: e.target.value })
                          }
                        />
                        <span className="flex items-center text-sm text-muted-foreground">
                          {formData.unit}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Actual Result *</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Result"
                          className="border-destructive bg-destructive/5"
                          value={formData.actualResult}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, actualResult: e.target.value })
                          }
                          required
                        />
                        <span className="flex items-center text-sm text-muted-foreground">
                          {formData.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Initial Observations */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-destructive" />
                  Initial Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Analyst's Initial Observations *</Label>
                  <Textarea
                    placeholder="Document your initial observations: Was the test performed correctly? Any anomalies during testing? Sample condition? Equipment status?"
                    value={formData.initialObservation}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, initialObservation: e.target.value })
                    }
                    rows={4}
                    required
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
              <Button type="submit" disabled={isSubmitting} className="bg-destructive hover:bg-destructive">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit OOS Report
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