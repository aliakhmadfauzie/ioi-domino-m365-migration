import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Warehouse } from 'lucide-react';
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
import { useCreateMainDBITExtSAP } from '@/generated/hooks/use-main-dbitext-sap';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import { SAPAMR_PLANTS } from '@/types/sap-forms';
import { EmployeePicker } from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';

const SAPSLCF_ULLAGE = ['Yes', 'No'] as const;

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `SAPSLCF-${year}${month}-${seq}`;
}

export default function SAPSLCFNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createExtSAP, isPending: extSAPPending } = useCreateMainDBITExtSAP();

  // Section 2: Request
  const [REQ_ReqNo, setREQ_ReqNo] = useState('');
  const [REQ_By, setREQ_By] = useState('');
  const [REQ_DeskOf, setREQ_DeskOf] = useState('');
  const [REQ_DateSubmitted, setREQ_DateSubmitted] = useState('');
  const [REQ_Designation, setREQ_Designation] = useState('');
  const [REQ_Dept, setREQ_Dept] = useState('');
  const [REQ_PhoneNo, setREQ_PhoneNo] = useState('');
  const [REQ_HOD, setREQ_HOD] = useState('');
  const [REQ_PlantCode, setREQ_PlantCode] = useState('');
  const [REQ_StorageLocCode, setREQ_StorageLocCode] = useState('');
  const [REQ_StorageLocDesc, setREQ_StorageLocDesc] = useState('');
  const [REQ_MatExtend, setREQ_MatExtend] = useState('');
  const [REQ_Ullage, setREQ_Ullage] = useState('');
  const [REQ_Remarks, setREQ_Remarks] = useState('');

  useEffect(() => {
    const recNo = generateRecordNo();
    setREQ_ReqNo(recNo);
    setREQ_DateSubmitted(new Date().toISOString());
    if (user?.userPrincipalName) {
      setREQ_By(user.userPrincipalName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!REQ_By.trim()) { toast.error('Requested By is required'); return; }
    if (!REQ_DeskOf.trim()) { toast.error('Desk Of is required'); return; }
    if (!REQ_Designation.trim()) { toast.error('Designation is required'); return; }
    if (!REQ_Dept.trim()) { toast.error('Department is required'); return; }
    if (!REQ_PhoneNo.trim()) { toast.error('Phone No is required'); return; }
    if (!REQ_HOD.trim()) { toast.error('Head of Department is required'); return; }
    if (!REQ_PlantCode) { toast.error('Plant Code is required'); return; }
    if (!REQ_StorageLocCode.trim()) { toast.error('Storage Location Code is required'); return; }
    if (!REQ_StorageLocDesc.trim()) { toast.error('Storage Location Description is required'); return; }
    if (!REQ_MatExtend.trim()) { toast.error('Material Extend is required'); return; }
    if (!REQ_Ullage) { toast.error('Ullage (Tank) field is required'); return; }

    try {
      const created = await createMainDBIT({
        title: REQ_ReqNo,
        formcode: 'SAPSLCF',
        currentStatus: 'pending-hod',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        currentAction: 'Request',
        requestorName: REQ_By,
        subject: `Storage Location ${REQ_StorageLocCode}`.trim(),
        company: REQ_DeskOf,
      });

      if (created?.id) {
        const extData: Omit<MainDBITExtSAP, 'id'> = {
          title: `${REQ_ReqNo}-sap`,
          parentFormCode: 'SAPSLCF',
          parentRecord: { id: created.id, title: REQ_ReqNo },
          parentSite: 'PRAI',
          sAPPlant: REQ_PlantCode,
          sAPModule: 'Storage Location',
          sAPRemarks: [
            `Storage Location Code: ${REQ_StorageLocCode}`,
            `Storage Location Description: ${REQ_StorageLocDesc}`,
            `Material Extend: ${REQ_MatExtend}`,
            `Ullage: ${REQ_Ullage}`,
            REQ_Remarks,
          ].filter(Boolean).join('\n'),
        };
        await createExtSAP(extData);
      }
      toast.success(`Storage Location Creation Form submitted! Ref: ${REQ_ReqNo}`);
      navigate('/it/forms/sapslcf');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Link to="/it/forms/sapslcf">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">SAP Storage Location Creation</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New Storage Location Request</span>
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
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <Warehouse className="h-5 w-5" />
                Request Details
              </CardTitle>
              <CardDescription>Storage location creation request information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Request No</Label>
                  <Input
                    value={REQ_ReqNo}
                    readOnly
                    className="bg-muted/50 text-muted-foreground font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated</p>
                </div>
                <div className="space-y-2">
                  <Label>Date Submitted</Label>
                  <Input
                    value={REQ_DateSubmitted ? new Date(REQ_DateSubmitted).toLocaleString() : ''}
                    readOnly
                    className="bg-muted/50 text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Auto-populated</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Requested By <span className="text-destructive">*</span></Label>
                  <EmployeePicker
                    value={REQ_By}
                    onChange={(email) => setREQ_By(email)}
                    placeholder="Requester name or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Desk Of <span className="text-destructive">*</span></Label>
                  <EmployeePicker
                    value={REQ_DeskOf}
                    onChange={(email) => setREQ_DeskOf(email)}
                    placeholder="On behalf of"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Designation <span className="text-destructive">*</span></Label>
                  <Input
                    value={REQ_Designation}
                    onChange={e => setREQ_Designation(e.target.value)}
                    placeholder="Job title / designation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department <span className="text-destructive">*</span></Label>
                  <SharePointLookupSelect
                    kind="department"
                    value={REQ_Dept}
                    onChange={setREQ_Dept}
                    placeholder="Department name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone No <span className="text-destructive">*</span></Label>
                  <Input
                    value={REQ_PhoneNo}
                    onChange={e => setREQ_PhoneNo(e.target.value)}
                    placeholder="Phone / extension number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Head of Department <span className="text-destructive">*</span></Label>
                  <EmployeePicker
                    value={REQ_HOD}
                    onChange={(email) => setREQ_HOD(email)}
                    placeholder="HOD name or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Plant Code <span className="text-destructive">*</span></Label>
                <Select value={REQ_PlantCode} onValueChange={setREQ_PlantCode}>
                  <SelectTrigger><SelectValue placeholder="Select plant code" /></SelectTrigger>
                  <SelectContent>
                    {SAPAMR_PLANTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Storage Location Code <span className="text-destructive">*</span></Label>
                  <Input
                    value={REQ_StorageLocCode}
                    onChange={e => setREQ_StorageLocCode(e.target.value)}
                    placeholder="e.g., SL01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Storage Location Description <span className="text-destructive">*</span></Label>
                  <Input
                    value={REQ_StorageLocDesc}
                    onChange={e => setREQ_StorageLocDesc(e.target.value)}
                    placeholder="Description of storage location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Material Extend To <span className="text-destructive">*</span></Label>
                  <Input
                    value={REQ_MatExtend}
                    onChange={e => setREQ_MatExtend(e.target.value)}
                    placeholder="Material code to extend"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tank for Ullage <span className="text-destructive">*</span></Label>
                  <Select value={REQ_Ullage} onValueChange={setREQ_Ullage}>
                    <SelectTrigger><SelectValue placeholder="Yes or No" /></SelectTrigger>
                    <SelectContent>
                      {SAPSLCF_ULLAGE.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Remarks (optional)</Label>
                <Textarea
                  value={REQ_Remarks}
                  onChange={e => setREQ_Remarks(e.target.value)}
                  placeholder="Additional remarks..."
                  rows={3}
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate('/it/forms/sapslcf')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || extSAPPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <Warehouse className="h-4 w-4 mr-2" />
              {isPending || extSAPPending ? 'Submitting...' : 'Submit Storage Location Request'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
