import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, HardDrive, Send, Save, Package, MapPin, Receipt, Activity, Server, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useSharePointCompanies, useSharePointDepartments } from '@/hooks/use-sharepoint-config';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { MainDBITExtAssetsService } from '@/generated/services/main-dbit-ext-assets-service';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';

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

const EQUIPMENT_TYPES = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'desktop', label: 'Desktop PC' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'printer', label: 'Printer' },
  { value: 'scanner', label: 'Scanner' },
  { value: 'projector', label: 'Projector' },
  { value: 'server', label: 'Server' },
  { value: 'network_switch', label: 'Network Switch' },
  { value: 'router', label: 'Router' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'ups', label: 'UPS' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'headset', label: 'Headset' },
  { value: 'webcam', label: 'Webcam' },
  { value: 'external_drive', label: 'External Drive' },
  { value: 'docking_station', label: 'Docking Station' },
  { value: 'mobile_device', label: 'Mobile Device' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'other', label: 'Other' },
];

const SITES = [
  { value: 'MY-PR', label: 'MY-PR (Prai, Penang)' },
  { value: 'MY-JH', label: 'MY-JH (Johor)' },
  { value: 'MY-KL', label: 'MY-KL (Kuala Lumpur)' },
  { value: 'MY-SBH', label: 'MY-SBH (Sabah)' },
  { value: 'MY-SRW', label: 'MY-SRW (Sarawak)' },
];

const CPU_OPTIONS = [
  { value: 'intel_i3', label: 'Intel Core i3' },
  { value: 'intel_i5', label: 'Intel Core i5' },
  { value: 'intel_i7', label: 'Intel Core i7' },
  { value: 'intel_i9', label: 'Intel Core i9' },
  { value: 'amd_ryzen3', label: 'AMD Ryzen 3' },
  { value: 'amd_ryzen5', label: 'AMD Ryzen 5' },
  { value: 'amd_ryzen7', label: 'AMD Ryzen 7' },
  { value: 'amd_ryzen9', label: 'AMD Ryzen 9' },
  { value: 'xeon', label: 'Intel Xeon' },
  { value: 'other', label: 'Other' },
];

const RAM_OPTIONS = [
  { value: '4GB', label: '4 GB' },
  { value: '8GB', label: '8 GB' },
  { value: '16GB', label: '16 GB' },
  { value: '32GB', label: '32 GB' },
  { value: '64GB', label: '64 GB' },
  { value: '128GB', label: '128 GB' },
  { value: '256GB', label: '256 GB' },
];

const HDD_SIZE_OPTIONS = [
  { value: '128GB', label: '128 GB' },
  { value: '256GB', label: '256 GB' },
  { value: '512GB', label: '512 GB' },
  { value: '1TB', label: '1 TB' },
  { value: '2TB', label: '2 TB' },
  { value: '4TB', label: '4 TB' },
  { value: '8TB', label: '8 TB' },
];

const HDD_TYPE_OPTIONS = [
  { value: 'hdd', label: 'HDD (Mechanical)' },
  { value: 'ssd', label: 'SSD (Solid State)' },
  { value: 'nvme', label: 'NVMe' },
  { value: 'hybrid', label: 'Hybrid (SSHD)' },
];

const OS_OPTIONS = [
  { value: 'win11', label: 'Windows 11' },
  { value: 'win10', label: 'Windows 10' },
  { value: 'win_server2022', label: 'Windows Server 2022' },
  { value: 'win_server2019', label: 'Windows Server 2019' },
  { value: 'win_server2016', label: 'Windows Server 2016' },
  { value: 'ubuntu', label: 'Ubuntu Linux' },
  { value: 'centos', label: 'CentOS' },
  { value: 'macos', label: 'macOS' },
  { value: 'other', label: 'Other' },
];

const MS_OFFICE_OPTIONS = [
  { value: 'm365', label: 'Microsoft 365 Apps' },
  { value: 'office2021', label: 'Office 2021' },
  { value: 'office2019', label: 'Office 2019' },
  { value: 'office2016', label: 'Office 2016' },
  { value: 'not_installed', label: 'Not Installed' },
];

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'retired', label: 'Retired/End of Life' },
];

const STATUSES = [
  { value: 'active', label: 'Active (In Use)' },
  { value: 'spare', label: 'Spare/Standby' },
  { value: 'maintenance', label: 'Under Maintenance' },
  { value: 'disposed', label: 'Disposed' },
  { value: 'lost', label: 'Lost/Stolen' },
];

export default function HINewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMutation = useCreateMainDBIT();
  const { companies } = useSharePointCompanies();
  const { departments } = useSharePointDepartments();

  const [formData, setFormData] = useState({
    equipmentType: '',
    brand: '',
    model: '',
    serialNumber: '',
    assetTag: '',
    cpuSpeed: '',
    cpuModel: '',
    ramSize: '',
    hddSize: '',
    hddType: '',
    monitorSize: '',
    ipAddress: '',
    macAddress: '',
    osVersion: '',
    site: '',
    company: '',
    department: '',
    building: '',
    floor: '',
    room: '',
    assignedUser: '',
    assignedUserEmail: '',
    msOfficeVer: '',
    msOfficeKey: '',
    notesVer: '',
    msEmail: '',
    purchaseDate: '',
    purchasePrice: '',
    vendor: '',
    poNumber: '',
    warrantyExpiry: '',
    condition: 'new',
    status: 'active',
    specifications: '',
    notes: '',
  });

  const generateAssetTag = () => {
    const prefix = 'IOI-IT';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const tag = `${prefix}-${year}-${random}`;
    setFormData({ ...formData, assetTag: tag });
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft) {
      if (!formData.equipmentType || !formData.serialNumber || !formData.site) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    try {
      const assetId = formData.assetTag || `IOI-IT-${new Date().getFullYear().toString().slice(-2)}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const now = new Date();
      // CurrentStatus: 'CurrentstatusKey0' = Active (for registration), 'CurrentstatusKey3' = Draft (for draft saves)
      const parentRecord = await createMutation.mutateAsync({
        title: assetId,
        formcode: 'HI',
        currentStatus: isDraft ? 'CurrentstatusKey3' : 'CurrentstatusKey0',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: now.toISOString(),
        company: formData.company || '',
        remarks: formData.notes || '',
      });

      // Also create child record in MainDB_IT_Ext_Assets for hardware-specific fields
      try {
        const extAssetsData: Record<string, unknown> = {
          title: `Asset Details for ${assetId}`,
          parentFormCode: 'HI',
          parentRecord: {
            id: parentRecord.id,
            title: parentRecord.title,
          },
          hITagNo: assetId,
          hIAssetNo: assetId,
          hIType: formData.equipmentType || '',
          hIComputerName: formData.brand && formData.model ? `${formData.brand} ${formData.model}` : formData.brand || formData.model || '',
          hICompany: formData.company || '',
          hIUsedByEmail: formData.assignedUserEmail || '',
          hILocation: [formData.site, formData.building, formData.floor, formData.room].filter(Boolean).join(' / '),
          hIDepartment: formData.department || '',
          hISerialNo: formData.serialNumber || '',
          hIPurchaseDate: formData.purchaseDate || '',
          hIVendor: formData.vendor || '',
          hIStatus: formData.status || '',
          hIYear: now.getFullYear(),
          hIMonth: now.getMonth() + 1,
          hIInvoiceNo: formData.poNumber || '',
          hICondition: formData.condition || '',
          hISpecifications: formData.specifications || '',
          hIPurchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined,
          hICPU: formData.cpuSpeed || '',
          hICPUModel: formData.cpuModel || '',
          hIRAM: formData.ramSize || '',
          hIHDDSize: formData.hddSize || '',
          hIHDDType: formData.hddType || '',
          hIMonitorSize: formData.monitorSize || '',
          hIIPAddress: formData.ipAddress || '',
          hIMACAddress: formData.macAddress || '',
          hIOSVersion: formData.osVersion || '',
          hIMSOfficeVer: formData.msOfficeVer || '',
          hIMSOfficeKey: formData.msOfficeKey || '',
          hINotesVer: formData.notesVer || '',
          hIMSEmail: formData.msEmail || '',
          hIBuilding: formData.building || '',
          hIFloor: formData.floor || '',
          hIRoom: formData.room || '',
        };
        await MainDBITExtAssetsService.create(extAssetsData as unknown as Omit<MainDBITExtAssets, 'id'>);
      } catch (childError) {
        // Rollback: delete parent if child creation fails
        console.error('[HI] Ext_Assets child record creation failed, rolling back parent:', parentRecord.id);
        try {
          const { MainDBITService } = await import('@/generated/services/main-dbit-service');
          await MainDBITService.delete(String(parentRecord.id));
        } catch (deleteError) {
          console.error('[HI] Failed to delete parent record during rollback:', deleteError);
        }
        throw childError;
      }

      toast.success(isDraft ? 'Draft saved successfully' : 'Hardware asset registered successfully');
      navigate('/it/my-submissions');
    } catch (error: unknown) {
      toast.error('Failed to register asset');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/20">
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <HardDrive className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Hardware Inventory Form</h1>
                  <p className="text-sm text-muted-foreground">Register new IT hardware asset</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={createMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={createMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="h-4 w-4 mr-2" />
                Register Asset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
          {/* Equipment Information */}
          <motion.div variants={itemVariants}>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-500" />
                  <CardTitle>Equipment Information</CardTitle>
                </div>
                <CardDescription>Basic details about the hardware</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Equipment Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.equipmentType} onValueChange={(v) => setFormData({ ...formData, equipmentType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EQUIPMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Brand/Manufacturer</Label>
                    <Input
                      value={formData.brand}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Dell, HP, Lenovo"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      value={formData.model}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., Latitude 5520, ProBook 450"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Tag</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.assetTag}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, assetTag: e.target.value })}
                        placeholder="IOI-IT-XX-XXXX"
                      />
                      <Button type="button" variant="outline" onClick={generateAssetTag}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Specifications</Label>
                    <Input
                      value={formData.specifications}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, specifications: e.target.value })}
                      placeholder="e.g., Intel i7, 16GB RAM, 512GB SSD"
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label>Company</Label>
                    <Select value={formData.company} onValueChange={(v) => setFormData({ ...formData, company: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.code} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Building</Label>
                    <Input
                      value={formData.building}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, building: e.target.value })}
                      placeholder="e.g., HQ Building"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Floor</Label>
                    <Input
                      value={formData.floor}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="e.g., Level 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Room/Area</Label>
                    <Input
                      value={formData.room}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, room: e.target.value })}
                      placeholder="e.g., Server Room A"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned User</Label>
                    <Input
                      value={formData.assignedUser}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, assignedUser: e.target.value })}
                      placeholder="Employee name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>User Email</Label>
                    <Input
                      type="email"
                      value={formData.assignedUserEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, assignedUserEmail: e.target.value })}
                      placeholder="user@ioigroup.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Acquisition Details */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Acquisition Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Price (MYR)</Label>
                    <Input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vendor</Label>
                    <Input
                      value={formData.vendor}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, vendor: e.target.value })}
                      placeholder="Vendor name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>PO Number</Label>
                    <Input
                      value={formData.poNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, poNumber: e.target.value })}
                      placeholder="Purchase order number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Warranty Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hardware Configuration */}
          <motion.div variants={itemVariants}>
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  <CardTitle>Hardware Configuration</CardTitle>
                </div>
                <CardDescription>CPU, memory, storage, and network details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CPU Model</Label>
                    <Select value={formData.cpuModel} onValueChange={(v) => setFormData({ ...formData, cpuModel: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select CPU" />
                      </SelectTrigger>
                      <SelectContent>
                        {CPU_OPTIONS.map((cpu) => (
                          <SelectItem key={cpu.value} value={cpu.value}>{cpu.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>CPU Speed</Label>
                    <Input
                      value={formData.cpuSpeed}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cpuSpeed: e.target.value })}
                      placeholder="e.g., 2.5 GHz"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>RAM Size <span className="text-destructive">*</span></Label>
                    <Select value={formData.ramSize} onValueChange={(v) => setFormData({ ...formData, ramSize: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select RAM size" />
                      </SelectTrigger>
                      <SelectContent>
                        {RAM_OPTIONS.map((ram) => (
                          <SelectItem key={ram.value} value={ram.value}>{ram.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Storage Size</Label>
                    <Select value={formData.hddSize} onValueChange={(v) => setFormData({ ...formData, hddSize: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage size" />
                      </SelectTrigger>
                      <SelectContent>
                        {HDD_SIZE_OPTIONS.map((hdd) => (
                          <SelectItem key={hdd.value} value={hdd.value}>{hdd.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Storage Type</Label>
                    <Select value={formData.hddType} onValueChange={(v) => setFormData({ ...formData, hddType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage type" />
                      </SelectTrigger>
                      <SelectContent>
                        {HDD_TYPE_OPTIONS.map((hdd) => (
                          <SelectItem key={hdd.value} value={hdd.value}>{hdd.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monitor Size (inch)</Label>
                    <Input
                      value={formData.monitorSize}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, monitorSize: e.target.value })}
                      placeholder="e.g., 24"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>IP Address</Label>
                    <Input
                      value={formData.ipAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, ipAddress: e.target.value })}
                      placeholder="e.g., 192.168.1.100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>MAC Address</Label>
                    <Input
                      value={formData.macAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, macAddress: e.target.value })}
                      placeholder="e.g., 00:1A:2B:3C:4D:5E"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Operating System</Label>
                  <Select value={formData.osVersion} onValueChange={(v) => setFormData({ ...formData, osVersion: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      {OS_OPTIONS.map((os) => (
                        <SelectItem key={os.value} value={os.value}>{os.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Software & Accounts */}
          <motion.div variants={itemVariants}>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <CardTitle>Software & Accounts</CardTitle>
                </div>
                <CardDescription>Installed software and assigned accounts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>MS Office Version</Label>
                    <Select value={formData.msOfficeVer} onValueChange={(v) => setFormData({ ...formData, msOfficeVer: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {MS_OFFICE_OPTIONS.map((off) => (
                          <SelectItem key={off.value} value={off.value}>{off.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>MS Office Product Key</Label>
                    <Input
                      value={formData.msOfficeKey}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, msOfficeKey: e.target.value })}
                      placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lotus Notes Version</Label>
                    <Input
                      value={formData.notesVer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, notesVer: e.target.value })}
                      placeholder="e.g., 12.0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>M365 Email</Label>
                    <Input
                      type="email"
                      value={formData.msEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, msEmail: e.target.value })}
                      placeholder="user@ioigroup.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Condition & Status */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Condition & Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((cond) => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((stat) => (
                          <SelectItem key={stat.value} value={stat.value}>
                            {stat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this equipment"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
