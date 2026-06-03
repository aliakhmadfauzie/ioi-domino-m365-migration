/**
 * ITSC - IT Service Continuity (Server Health Checklist)
 *
 * Server health checklist covering health metrics, database, backup,
 * file system, and personnel tracking.
 *
 * Data stored in MainDB_IT_Ext_Assets (via parent record link to MainDB_IT)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Server, Activity, Database, HardDrive, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtAssets } from '@/generated/hooks/use-main-dbitext-assets';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import type { MainDBITSiteKey } from '@/generated/models/main-dbit-model';
import { EmployeePicker } from '@/components/employee-picker';

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ITSC-${year}${month}-${seq}`;
}

const DRIVE_TYPES = ['HDD', 'SSD', 'NVMe', 'SAN', 'NAS', 'Other'] as const;
const DISK_CLEANUP_OPTIONS = ['Done', 'Not Done', 'N/A'] as const;
const SITES = ['Prai', 'Penang', 'Johor', 'Kuala Lumpur', 'All Sites'] as const;

export default function ITSCNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending: isPendingMain } = useCreateMainDBIT();
  const { mutateAsync: createExtAssets, isPending: isPendingExt } = useCreateMainDBITExtAssets();

  // --- Section 1: Checklist Header ---
  const [HDR_Server, setHDR_Server] = useState('');
  const [HDR_CreateDate, setHDR_CreateDate] = useState('');
  const [HDR_SvrName, setHDR_SvrName] = useState('');
  const [HDR_SvrName2, setHDR_SvrName2] = useState('');
  const [HDR_NW, setHDR_NW] = useState('');
  const [HDR_Site, setHDR_Site] = useState('');

  // --- Section 2: Health Metrics ---
  const [HLT_Nav, setHLT_Nav] = useState('');
  const [HLT_CPU, setHLT_CPU] = useState('');
  const [HLT_CPUPct, setHLT_CPUPct] = useState('');
  const [HLT_Memory, setHLT_Memory] = useState('');
  const [HLT_FullMemory, setHLT_FullMemory] = useState('');
  const [HLT_Drive, setHLT_Drive] = useState('');
  const [HLT_Size, setHLT_Size] = useState('');
  const [HLT_Type, setHLT_Type] = useState('');
  const [HLT_FullSpace, setHLT_FullSpace] = useState('');
  // Additional drives
  const [HLT_Drive1, setHLT_Drive1] = useState('');
  const [HLT_Size1, setHLT_Size1] = useState('');
  const [HLT_Type1, setHLT_Type1] = useState('');
  const [HLT_Drive2, setHLT_Drive2] = useState('');
  const [HLT_Size2, setHLT_Size2] = useState('');
  const [HLT_Type2, setHLT_Type2] = useState('');
  const [HLT_Drive3, setHLT_Drive3] = useState('');
  const [HLT_Size3, setHLT_Size3] = useState('');
  const [HLT_Type3, setHLT_Type3] = useState('');
  const [HLT_DiskCleanup, setHLT_DiskCleanup] = useState('');
  const [HLT_Defrag, setHLT_Defrag] = useState('');
  const [HLT_WinUpd, setHLT_WinUpd] = useState('');
  const [HLT_Event, setHLT_Event] = useState('');

  // --- Section 3: Database — Memory ---
  const [DB_MDC, setDB_MDC] = useState('');
  const [DB_Tenant, setDB_Tenant] = useState('');

  // --- Section 4: Database — Disk Usage ---
  const [DB_Volume1, setDB_Volume1] = useState('');
  const [DB_Volume2, setDB_Volume2] = useState('');
  const [DB_Volume3, setDB_Volume3] = useState('');

  // --- Section 5: Backup ---
  const [BKP_DateStart, setBKP_DateStart] = useState('');
  const [BKP_TimeStart, setBKP_TimeStart] = useState('');
  const [BKP_DateEnd, setBKP_DateEnd] = useState('');
  const [BKP_TimeEnd, setBKP_TimeEnd] = useState('');

  // --- Section 6: Remarks ---
  const [REM_Remarks, setREM_Remarks] = useState('');

  // --- Section 7: File System ---
  const [FS_Size1, setFS_Size1] = useState('');
  const [FS_Type3, setFS_Type3] = useState('');
  const [FS_LogData, setFS_LogData] = useState('');
  const [FS_Type1, setFS_Type1] = useState('');
  const [FS_Physical, setFS_Physical] = useState('');
  const [FS_Type2, setFS_Type2] = useState('');
  const [FS_ComFac, setFS_ComFac] = useState('');

  // --- Section 8: Personnel ---
  const [PER_CreatedBy, setPER_CreatedBy] = useState('');

  // Auto-populate date & personnel
  useEffect(() => {
    const now = new Date();
    setHDR_CreateDate(now.toISOString().split('T')[0]);
    if (user?.userPrincipalName) {
      setPER_CreatedBy(user.userPrincipalName);
    }
  }, [user]);

  const isPending = isPendingMain || isPendingExt;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!HDR_SvrName.trim()) { toast.error('Server Name is required'); return; }
    if (!HDR_Site) { toast.error('Site is required'); return; }

    try {
      const recordNo = generateRecordNo();

      // 1. Create MainDB_IT record — only lightweight metadata, no duplicate JSON
      const mainRecord = await createMainDBIT({
        title: recordNo,
        formcode: 'ITSC',
        currentStatus: 'sent',
        siteKey: HDR_Site as MainDBITSiteKey,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        islocked: false,
        subject: HDR_SvrName,
      });

      // 2. Create MainDB_IT_Ext_Assets record linked to parent
      await createExtAssets({
        title: `ITSC-Assets-${recordNo}`,
        parentFormCode: 'ITSC',
        parentRecord: { id: mainRecord.id, title: recordNo },
        parentSite: HDR_Site,
        iTSCChecklistYear: String(new Date().getFullYear()),
        iTSCReviewedBy: PER_CreatedBy,
        iTSCReviewedDate: new Date().toISOString(),
        iTSCServerName: HDR_SvrName,
        iTSCVirusDefDate: HLT_Nav,
        iTSCCPUUsage: HLT_CPU,
        iTSCMemoryUsed: HLT_Memory,
        iTSCFullMemory: HLT_FullMemory,
        iTSCDriveAvailable: HLT_Drive,
        iTSCDriveSize: HLT_Size,
        iTSCDriveType: HLT_Type,
        iTSCDiskCleanup: HLT_DiskCleanup,
        iTSCWinUpdates: HLT_WinUpd,
        iTSCAntivirus: HLT_Nav,
        iTSCPhysical: FS_Physical,
        iTSCTenant: DB_Tenant,
        iTSCVolume1: DB_Volume1,
        iTSCVolume2: DB_Volume2,
        iTSCVolume3: DB_Volume3,
        iTSCTimeStart: BKP_TimeStart,
        iTSCTimeEnd: BKP_TimeEnd,
        iTSCRemarks: REM_Remarks,
      });

      toast.success(`ITSC Checklist submitted! Ref: ${recordNo}`);
      navigate('/it/forms/itsc');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">IT Service Continuity Checklist</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <span className="hover:text-white cursor-pointer" onClick={() => navigate('/it')}>IT</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New Checklist</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
          className="space-y-6"
        >
          {/* Section 1: Checklist Header */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <Server className="h-5 w-5" />
                Section 1 — Checklist Header
              </CardTitle>
              <CardDescription>Server identification and checklist metadata</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Server <span className="text-destructive">*</span></Label>
                <Input value={HDR_Server} onChange={e => setHDR_Server(e.target.value)} placeholder="e.g. Server, VM, or physical host" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Create Date</Label>
                  <Input type="date" value={HDR_CreateDate} onChange={e => setHDR_CreateDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Site <span className="text-destructive">*</span></Label>
                  <Select value={HDR_Site} onValueChange={setHDR_Site}>
                    <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                    <SelectContent>
                      {SITES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Server Name <span className="text-destructive">*</span></Label>
                  <Input value={HDR_SvrName} onChange={e => setHDR_SvrName(e.target.value)} placeholder="Primary server name" />
                </div>
                <div className="space-y-2">
                  <Label>Server Name 2</Label>
                  <Input value={HDR_SvrName2} onChange={e => setHDR_SvrName2(e.target.value)} placeholder="Secondary server (if any)" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Non-Windows Servers</Label>
                <Input value={HDR_NW} onChange={e => setHDR_NW(e.target.value)} placeholder="Non-Windows server names in scope" />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Health Metrics */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <Activity className="h-5 w-5" />
                Section 2 — Health Metrics
              </CardTitle>
              <CardDescription>CPU, memory, disk, and system health checks</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Virus Def Date</Label>
                  <Input type="date" value={HLT_Nav} onChange={e => setHLT_Nav(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CPU Usage (%)</Label>
                  <Input value={HLT_CPU} onChange={e => setHLT_CPU(e.target.value)} placeholder="e.g. 45%" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CPU % (alt)</Label>
                  <Input value={HLT_CPUPct} onChange={e => setHLT_CPUPct(e.target.value)} placeholder="Alternate CPU reading" />
                </div>
                <div className="space-y-2">
                  <Label>Memory (Used)</Label>
                  <Input value={HLT_Memory} onChange={e => setHLT_Memory(e.target.value)} placeholder="e.g. 8GB / 16GB" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Memory (Total)</Label>
                  <Input value={HLT_FullMemory} onChange={e => setHLT_FullMemory(e.target.value)} placeholder="Total installed memory" />
                </div>
                <div className="space-y-2">
                  <Label>Drive (Available)</Label>
                  <Input value={HLT_Drive} onChange={e => setHLT_Drive(e.target.value)} placeholder="Available disk space" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Drive Size</Label>
                  <Input value={HLT_Size} onChange={e => setHLT_Size(e.target.value)} placeholder="Total drive capacity" />
                </div>
                <div className="space-y-2">
                  <Label>Drive Type</Label>
                  <Select value={HLT_Type} onValueChange={setHLT_Type}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {DRIVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Space (Available)</Label>
                <Input value={HLT_FullSpace} onChange={e => setHLT_FullSpace(e.target.value)} placeholder="Full available space across drives" />
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-[#003366] mb-3">Additional Drives</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Drive 1</Label>
                    <Input value={HLT_Drive1} onChange={e => setHLT_Drive1(e.target.value)} placeholder="Label" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Size 1</Label>
                    <Input value={HLT_Size1} onChange={e => setHLT_Size1(e.target.value)} placeholder="Size" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Type 1</Label>
                    <Select value={HLT_Type1} onValueChange={setHLT_Type1}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="-" /></SelectTrigger>
                      <SelectContent>
                        {DRIVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Drive 2</Label>
                    <Input value={HLT_Drive2} onChange={e => setHLT_Drive2(e.target.value)} placeholder="Label" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Size 2</Label>
                    <Input value={HLT_Size2} onChange={e => setHLT_Size2(e.target.value)} placeholder="Size" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Type 2</Label>
                    <Select value={HLT_Type2} onValueChange={setHLT_Type2}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="-" /></SelectTrigger>
                      <SelectContent>
                        {DRIVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Drive 3</Label>
                    <Input value={HLT_Drive3} onChange={e => setHLT_Drive3(e.target.value)} placeholder="Label" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Size 3</Label>
                    <Input value={HLT_Size3} onChange={e => setHLT_Size3(e.target.value)} placeholder="Size" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Type 3</Label>
                    <Select value={HLT_Type3} onValueChange={setHLT_Type3}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="-" /></SelectTrigger>
                      <SelectContent>
                        {DRIVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="space-y-2">
                  <Label>Disk Cleanup</Label>
                  <Select value={HLT_DiskCleanup} onValueChange={setHLT_DiskCleanup}>
                    <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                    <SelectContent>
                      {DISK_CLEANUP_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Defrag</Label>
                  <Select value={HLT_Defrag} onValueChange={setHLT_Defrag}>
                    <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
                    <SelectContent>
                      {DISK_CLEANUP_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Last Windows Update</Label>
                  <Input type="date" value={HLT_WinUpd} onChange={e => setHLT_WinUpd(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Viewer Alerts</Label>
                <Textarea value={HLT_Event} onChange={e => setHLT_Event(e.target.value)} rows={3} placeholder="Event viewer alerts summary" />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Database — Memory */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <Database className="h-5 w-5" />
                Section 3 — Database Memory
              </CardTitle>
              <CardDescription>Database memory and tenant usage</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>MDC (Multi-Dimensional Clustering)</Label>
                  <Input value={DB_MDC} onChange={e => setDB_MDC(e.target.value)} placeholder="MDC memory usage" />
                </div>
                <div className="space-y-2">
                  <Label>Tenant</Label>
                  <Input value={DB_Tenant} onChange={e => setDB_Tenant(e.target.value)} placeholder="Tenant memory usage" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Database — Disk Usage */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <HardDrive className="h-5 w-5" />
                Section 4 — Database Disk Usage
              </CardTitle>
              <CardDescription>Database volume disk usage</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Volume 1 (Data)</Label>
                  <Input value={DB_Volume1} onChange={e => setDB_Volume1(e.target.value)} placeholder="Data volume" />
                </div>
                <div className="space-y-2">
                  <Label>Volume 2 (Log)</Label>
                  <Input value={DB_Volume2} onChange={e => setDB_Volume2(e.target.value)} placeholder="Log volume" />
                </div>
                <div className="space-y-2">
                  <Label>Volume 3 (Trace)</Label>
                  <Input value={DB_Volume3} onChange={e => setDB_Volume3(e.target.value)} placeholder="Trace volume" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Backup */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <HardDrive className="h-5 w-5" />
                Section 5 — Backup Catalog
              </CardTitle>
              <CardDescription>Backup window information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Backup Start Date</Label>
                  <Input type="date" value={BKP_DateStart} onChange={e => setBKP_DateStart(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Backup Start Time</Label>
                  <Input type="time" value={BKP_TimeStart} onChange={e => setBKP_TimeStart(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Backup End Date</Label>
                  <Input type="date" value={BKP_DateEnd} onChange={e => setBKP_DateEnd(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Backup End Time</Label>
                  <Input type="time" value={BKP_TimeEnd} onChange={e => setBKP_TimeEnd(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Remarks */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <FileText className="h-5 w-5" />
                Section 6 — Remarks
              </CardTitle>
              <CardDescription>General remarks, issues found, or notes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea value={REM_Remarks} onChange={e => setREM_Remarks(e.target.value)} rows={4} placeholder="Issues found, notes, or comments" />
              </div>
            </CardContent>
          </Card>

          {/* Section 7: File System */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <HardDrive className="h-5 w-5" />
                Section 7 — File System
              </CardTitle>
              <CardDescription>File system size, type, and compression</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>File System Size</Label>
                  <Input value={FS_Size1} onChange={e => setFS_Size1(e.target.value)} placeholder="Total size" />
                </div>
                <div className="space-y-2">
                  <Label>File System Type</Label>
                  <Input value={FS_Type3} onChange={e => setFS_Type3(e.target.value)} placeholder="e.g. NTFS, ext4" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Log Data</Label>
                  <Input value={FS_LogData} onChange={e => setFS_LogData(e.target.value)} placeholder="Log partition data" />
                </div>
                <div className="space-y-2">
                  <Label>Log Type</Label>
                  <Input value={FS_Type1} onChange={e => setFS_Type1(e.target.value)} placeholder="Log file system type" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Physical</Label>
                  <Input value={FS_Physical} onChange={e => setFS_Physical(e.target.value)} placeholder="Physical storage details" />
                </div>
                <div className="space-y-2">
                  <Label>Physical Type</Label>
                  <Input value={FS_Type2} onChange={e => setFS_Type2(e.target.value)} placeholder="Physical drive type" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Compression Factor</Label>
                <Input value={FS_ComFac} onChange={e => setFS_ComFac(e.target.value)} placeholder="File system compression ratio" />
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Personnel */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <User className="h-5 w-5" />
                Section 8 — Personnel
              </CardTitle>
              <CardDescription>IT admin who ran the checklist</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Created By</Label>
                <EmployeePicker value={PER_CreatedBy} onChange={(email) => setPER_CreatedBy(email)} placeholder="IT Admin name / email" />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? 'Submitting...' : 'Submit Checklist'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
