import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Shield, Users } from 'lucide-react';
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
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import { SAPAMR_MODULES, SAPAMR_PLANTS, SAPAMR_AUTH_TYPES } from '@/types/sap-forms';

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `SAPAMR-${year}${month}-${seq}`;
}

export default function SAPAMRNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createExtSAP } = useCreateMainDBITExtSAP();

  // Section 2: Initiation
  const [INIT_RecNo, setINIT_RecNo] = useState('');
  const [INIT_Module, setINIT_Module] = useState('');
  const [INIT_Plant, setINIT_Plant] = useState('');
  const [INIT_AuthType, setINIT_AuthType] = useState('');
  const [INIT_Remarks, setINIT_Remarks] = useState('');
  const [INIT_CC, setINIT_CC] = useState('');
  const [INIT_TBV, setINIT_TBV] = useState('');
  const [INIT_TBA, setINIT_TBA] = useState('');

  // FI module per-slot verifiers (TBV_1–TBV_5)
  const [INIT_TBV1, setINIT_TBV1] = useState('');
  const [INIT_TBV2, setINIT_TBV2] = useState('');
  const [INIT_TBV3, setINIT_TBV3] = useState('');
  const [INIT_TBV4, setINIT_TBV4] = useState('');
  const [INIT_TBV5, setINIT_TBV5] = useState('');

  // Computed: is this an FI module request?
  const isFIModule = useMemo(() => INIT_Module?.toUpperCase().startsWith('FI'), [INIT_Module]);

  // Section 3: Prepared By
  const [PREP_PreparedBy, setPREP_PreparedBy] = useState('');
  const [PREP_PreparedDate, setPREP_PreparedDate] = useState('');
  const [PREP_Comment, setPREP_Comment] = useState('');

  useEffect(() => {
    const recNo = generateRecordNo();
    setINIT_RecNo(recNo);
    setPREP_PreparedDate(new Date().toISOString());
    if (user?.userPrincipalName) {
      setPREP_PreparedBy(user.userPrincipalName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!INIT_Module) { toast.error('Module is required'); return; }
    if (!INIT_Plant) { toast.error('Plant is required'); return; }
    if (!INIT_AuthType) { toast.error('Authorization Type is required'); return; }
    // FI modules: at least one TBV_N must be assigned; non-FI: TBV is required
    if (isFIModule) {
      if (!INIT_TBV1.trim() && !INIT_TBV2.trim() && !INIT_TBV3.trim() && !INIT_TBV4.trim() && !INIT_TBV5.trim()) {
        toast.error('At least one FI verifier (TBV_1–TBV_5) is required'); return;
      }
    } else {
      if (!INIT_TBV.trim()) { toast.error('To Be Verified By is required'); return; }
    }
    if (!INIT_TBA.trim()) { toast.error('To Be Approved By is required'); return; }
    if (!PREP_PreparedBy.trim()) { toast.error('Prepared By is required'); return; }

    try {
      // Build the payload — include TBV_1-5 only when FI module
      const extraFields: Record<string, string> = {};
      if (isFIModule) {
        extraFields.sAPAMRTBV1Email = INIT_TBV1 || '';
        extraFields.sAPAMRTBV2Email = INIT_TBV2 || '';
        extraFields.sAPAMRTBV3Email = INIT_TBV3 || '';
        extraFields.sAPAMRTBV4Email = INIT_TBV4 || '';
        extraFields.sAPAMRTBV5Email = INIT_TBV5 || '';
      }

      const created = await createMainDBIT({
        title: INIT_RecNo,
        formcode: 'SAPAMR',
        // Domino initial state is 'Request' (Draft)
        currentStatus: 'Request' as MainDBITCurrentstatusKey,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        remarks: JSON.stringify({
          INIT_RecNo, INIT_Module, INIT_Plant, INIT_AuthType,
          INIT_Remarks, INIT_CC,
          INIT_TBV, INIT_TBA,
          ...(isFIModule ? {
            INIT_TBV1, INIT_TBV2, INIT_TBV3, INIT_TBV4, INIT_TBV5,
          } : {}),
          PREP_PreparedBy, PREP_PreparedDate, PREP_Comment,
        }),
      });

      // Create ExtSAP child record with SAPAMR routing fields (Option B)
      if (created?.id) {
        const extData: Omit<MainDBITExtSAP, 'id'> = {
          title: `${INIT_RecNo}-sap`,
          parentFormCode: 'SAPAMR',
          parentRecord: { id: created.id, title: INIT_RecNo },
          sAPAMRTBVEmail: INIT_TBV || '',
          sAPAMRTBAEmail: INIT_TBA || '',
          sAPAMRTBV1Email: INIT_TBV1 || '',
          sAPAMRTBV2Email: INIT_TBV2 || '',
          sAPAMRTBV3Email: INIT_TBV3 || '',
          sAPAMRTBV4Email: INIT_TBV4 || '',
          sAPAMRTBV5Email: INIT_TBV5 || '',
        };
        await createExtSAP(extData);
      }
      toast.success(`SAP Authorization Master Record submitted! Ref: ${INIT_RecNo}`);
      navigate('/it/forms/sapamr');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Link to="/it/forms/sapamr">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">SAP Authorization Master Record</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New SAP AMR</span>
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
          {/* Section 2: Initiation */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <Shield className="h-5 w-5" />
                Section 1 — Authorization Details
              </CardTitle>
              <CardDescription>SAP module, plant, and authorization type</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>Record No</Label>
                <Input
                  value={INIT_RecNo}
                  readOnly
                  className="bg-muted/50 text-muted-foreground font-mono"
                />
                <p className="text-xs text-muted-foreground">Auto-generated</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Module <span className="text-destructive">*</span></Label>
                  <Select value={INIT_Module} onValueChange={setINIT_Module}>
                    <SelectTrigger><SelectValue placeholder="Select SAP module" /></SelectTrigger>
                    <SelectContent>
                      {SAPAMR_MODULES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plant <span className="text-destructive">*</span></Label>
                  <Select value={INIT_Plant} onValueChange={setINIT_Plant}>
                    <SelectTrigger><SelectValue placeholder="Select plant" /></SelectTrigger>
                    <SelectContent>
                      {SAPAMR_PLANTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Authorization Type <span className="text-destructive">*</span></Label>
                <Select value={INIT_AuthType} onValueChange={setINIT_AuthType}>
                  <SelectTrigger><SelectValue placeholder="Select authorization type" /></SelectTrigger>
                  <SelectContent>
                    {SAPAMR_AUTH_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>To Be Verified By <span className="text-destructive">*</span></Label>
                  <Input
                    value={INIT_TBV}
                    onChange={e => setINIT_TBV(e.target.value)}
                    placeholder="Verifier name or email"
                  />
                  {!isFIModule && <p className="text-xs text-muted-foreground">Single verifier (non-FI module)</p>}
                </div>
                <div className="space-y-2">
                  <Label>To Be Approved By <span className="text-destructive">*</span></Label>
                  <Input
                    value={INIT_TBA}
                    onChange={e => setINIT_TBA(e.target.value)}
                    placeholder="Approver name or email"
                  />
                </div>
              </div>

              {/* FI Module: Per-slot verifiers TBV_1–TBV_5 */}
              {isFIModule && (
                <Card className="border-2 border-amber-200 bg-amber-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-amber-800 text-sm">
                      <Users className="h-4 w-4" />
                      FI Module — Per-Slot Verifiers (TBV_1–TBV_5)
                    </CardTitle>
                    <CardDescription className="text-amber-700 text-xs">
                      Each FI verifier must sign individually. Leave unused slots empty.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const val = n === 1 ? INIT_TBV1 : n === 2 ? INIT_TBV2 : n === 3 ? INIT_TBV3 : n === 4 ? INIT_TBV4 : INIT_TBV5;
                      const setter = n === 1 ? setINIT_TBV1 : n === 2 ? setINIT_TBV2 : n === 3 ? setINIT_TBV3 : n === 4 ? setINIT_TBV4 : setINIT_TBV5;
                      return (
                        <div key={n} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-amber-800 w-20 shrink-0">TBV_{n}</span>
                          <Input
                            value={val}
                            onChange={(e) => setter(e.target.value)}
                            placeholder={`Verifier ${n} name or email`}
                            className="border-amber-200 bg-white text-sm"
                          />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label>CC (optional)</Label>
                <Input
                  value={INIT_CC}
                  onChange={e => setINIT_CC(e.target.value)}
                  placeholder="Additional recipients to CC"
                />
              </div>

              <div className="space-y-2">
                <Label>Remarks (optional)</Label>
                <Textarea
                  value={INIT_Remarks}
                  onChange={e => setINIT_Remarks(e.target.value)}
                  placeholder="Additional remarks or notes..."
                  rows={3}
                />
              </div>

            </CardContent>
          </Card>

          {/* Section 3: Prepared By */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="text-[#003366]">Section 2 — Prepared By</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prepared By <span className="text-destructive">*</span></Label>
                  <Input
                    value={PREP_PreparedBy}
                    onChange={e => setPREP_PreparedBy(e.target.value)}
                    placeholder="Preparer name or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prepared Date</Label>
                  <Input
                    value={PREP_PreparedDate ? new Date(PREP_PreparedDate).toLocaleString() : ''}
                    readOnly
                    className="bg-muted/50 text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Auto-populated</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comment (optional)</Label>
                <Textarea
                  value={PREP_Comment}
                  onChange={e => setPREP_Comment(e.target.value)}
                  placeholder="Preparer comments..."
                  rows={3}
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate('/it/forms/sapamr')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              {isPending ? 'Submitting...' : 'Submit SAP AMR'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
