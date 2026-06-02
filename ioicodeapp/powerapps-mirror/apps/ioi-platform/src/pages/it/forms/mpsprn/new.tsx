import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Printer, Send, Save, Network, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useSharePointDepartments } from '@/hooks/use-sharepoint-config';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: 'easeOut' as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const PRINTER_MODELS = [
  { value: 'hp_laserjet_pro', label: 'HP LaserJet Pro' },
  { value: 'hp_laserjet_enterprise', label: 'HP LaserJet Enterprise' },
  { value: 'hp_color_laserjet', label: 'HP Color LaserJet' },
  { value: 'hp_pagewide', label: 'HP PageWide' },
  { value: 'canon_imagerunner', label: 'Canon imageRUNNER' },
  { value: 'canon_imageclass', label: 'Canon imageCLASS' },
  { value: 'epson_workforce', label: 'Epson WorkForce' },
  { value: 'brother_mfc', label: 'Brother MFC' },
  { value: 'xerox_versalink', label: 'Xerox VersaLink' },
  { value: 'xerox_altalink', label: 'Xerox AltaLink' },
  { value: 'ricoh_mp', label: 'Ricoh MP Series' },
  { value: 'konica_bizhub', label: 'Konica Minolta bizhub' },
  { value: 'sharp_mx', label: 'Sharp MX Series' },
  { value: 'kyocera_taskalfa', label: 'Kyocera TASKalfa' },
  { value: 'lexmark_cx', label: 'Lexmark CX Series' },
  { value: 'other', label: 'Other' },
];

const SITES = [
  { value: 'PANCEN', label: 'IOI PanCentury Oleochemicals' },
  { value: 'MY-PR', label: 'MY-PR (Prai, Penang)' },
  { value: 'MY-JH', label: 'MY-JH (Johor)' },
  { value: 'MY-KL', label: 'MY-KL (Kuala Lumpur)' },
  { value: 'MY-SBH', label: 'MY-SBH (Sabah)' },
  { value: 'MY-SRW', label: 'MY-SRW (Sarawak)' },
];

export default function MPSPRNNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMutation = useCreateMainDBIT();
  const { departments } = useSharePointDepartments();

  const [formData, setFormData] = useState({
    printerName: '',
    model: '',
    customModel: '',
    ipAddress: '',
    serialNumber: '',
    site: 'PANCEN',
    department: '',
    location: '',
    remark: '',
    itAdmin: '',
  });

  const validateIPAddress = (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft) {
      if (!formData.printerName || !formData.serialNumber || !formData.ipAddress || !formData.department || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!validateIPAddress(formData.ipAddress)) {
        toast.error('Please enter a valid IP address');
        return;
      }
    }

    try {
      const printerId = `PRN-${formData.serialNumber || Date.now()}`;
      const displayModel = formData.model === 'other' ? formData.customModel : PRINTER_MODELS.find(m => m.value === formData.model)?.label || formData.model;

      await createMutation.mutateAsync({
        title: printerId,
        formcode: 'MPSPRN',
        currentStatus: isDraft ? 'CurrentstatusKey0' : 'CurrentstatusKey3',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        remarks: [
          `Form Type: MPS Network Printer`,
          `Printer ID: ${printerId}`,
          `Printer Name: ${formData.printerName}`,
          `Model: ${displayModel}`,
          `IP Address: ${formData.ipAddress}`,
          `Serial Number: ${formData.serialNumber}`,
          `Site: ${formData.site}`,
          `Department: ${formData.department}`,
          `Location: ${formData.location}`,
          formData.remark ? `Remark: ${formData.remark}` : null,
          formData.itAdmin ? `IT Admin: ${formData.itAdmin}` : null,
          `Registered By: ${user?.fullName || 'N/A'}`,
          `Registered Date: ${new Date().toISOString()}`,
        ].filter(Boolean).join('\n'),
      });

      toast.success(isDraft ? 'Draft saved successfully' : 'Network printer registered successfully');
      navigate('/it/my-submissions');
    } catch (error: unknown) {
      toast.error('Failed to register printer');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-background to-blue-50 dark:from-cyan-950/20 dark:via-background dark:to-blue-950/20">
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <Printer className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">MPS Network Printer Form</h1>
                  <p className="text-sm text-muted-foreground">Register managed print service network printer</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={createMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={createMutation.isPending} className="bg-cyan-600 hover:bg-cyan-700">
                <Send className="h-4 w-4 mr-2" />
                Register Printer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
          {/* Printer Details */}
          <motion.div variants={itemVariants}>
            <Card className="border-cyan-200 dark:border-cyan-800">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-cyan-500" />
                  <CardTitle>Printer Details</CardTitle>
                </div>
                <CardDescription>Network printer identification and specifications</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Printer Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={formData.printerName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, printerName: e.target.value })}
                      placeholder="e.g., PRN-IT-001, FinancePrinter1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Model <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.model} onValueChange={(v) => setFormData({ ...formData, model: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select printer model" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRINTER_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.model === 'other' && (
                  <div className="space-y-2">
                    <Label>
                      Custom Model <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={formData.customModel}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, customModel: e.target.value })}
                      placeholder="Enter printer make and model"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      IP Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={formData.ipAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, ipAddress: e.target.value })}
                      placeholder="e.g., 192.168.1.100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Serial Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={formData.serialNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, serialNumber: e.target.value })}
                      placeholder="Enter serial number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location & Assignment */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Location & Assignment</CardTitle>
                </div>
                <CardDescription>Printer location and department assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Site <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.site} onValueChange={(v) => setFormData({ ...formData, site: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITES.map((site) => (
                          <SelectItem key={site.value} value={site.value}>
                            {site.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.code} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={formData.location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Level 3, Finance Department, Near Room 301"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IT Admin Responsible</Label>
                  <Input
                    value={formData.itAdmin}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, itAdmin: e.target.value })}
                    placeholder="IT administrator name or email"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Remarks */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Additional Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.remark}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, remark: e.target.value })}
                    placeholder="Additional notes or status remarks about this printer"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submission Info */}
          <motion.div variants={itemVariants}>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitting as: </span>
                    <span className="font-medium">{user?.fullName || 'Loading...'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Form Code: </span>
                    <span className="font-mono font-medium">MPSPRN</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}