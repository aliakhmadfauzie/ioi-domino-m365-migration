import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, FileText } from 'lucide-react';
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
import { useCreateMainDBITExtSupport } from '@/generated/hooks/use-main-dbitext-support';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';

const ITDAILYRPT_CATEGORIES = [
  'IT Operations', 'Project', 'Maintenance', 'Training', 'Administration', 'Other',
] as const;

const ITDAILYRPT_TYPES = ['Meeting', 'Seminar/Training', 'OT'] as const;

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ITDAILYRPT-${year}${month}-${seq}`;
}

export default function NewITDAILYRPTPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createChildRecord, isPending: childPending } = useCreateMainDBITExtSupport();

  // Section 1: Header
  const [HDR_Subject, setHDR_Subject] = useState('');
  const [HDR_StartDate, setHDR_StartDate] = useState('');
  const [HDR_EndDate, setHDR_EndDate] = useState('');
  const [HDR_Category, setHDR_Category] = useState('');
  const [HDR_Type, setHDR_Type] = useState('');
  const [HDR_Company, setHDR_Company] = useState('');
  const [HDR_DisplayText, setHDR_DisplayText] = useState('');

  // Section 3: Meeting (shown when HDR_Type === 'Meeting')
  const [MTG_Chairman, setMTG_Chairman] = useState('');
  const [MTG_Present, setMTG_Present] = useState('');
  const [MTG_Venue, setMTG_Venue] = useState('');
  const [MTG_Date, setMTG_Date] = useState('');
  const [MTG_TimeFrom, setMTG_TimeFrom] = useState('');
  const [MTG_TimeTo, setMTG_TimeTo] = useState('');

  // Section 4: Training (shown when HDR_Type === 'Seminar/Training')
  const [TRN_Venue, setTRN_Venue] = useState('');
  const [TRN_DateStart, setTRN_DateStart] = useState('');
  const [TRN_DateEnd, setTRN_DateEnd] = useState('');
  const [TRN_Participants, setTRN_Participants] = useState('');
  const [TRN_Trainer, setTRN_Trainer] = useState('');

  // Section 5: OT (shown when HDR_Type === 'OT')
  const [OT_TimeFrom, setOT_TimeFrom] = useState('');
  const [OT_TimeTo, setOT_TimeTo] = useState('');
  const [OT_Cat, setOT_Cat] = useState('');
  const [OT_Purpose, setOT_Purpose] = useState('');

  // Section 6: Audit
  const [AUD_DocAuthor, setAUD_DocAuthor] = useState('');
  const [AUD_CDate, setAUD_CDate] = useState('');

  useEffect(() => {
    setAUD_CDate(new Date().toISOString());
    if (user?.userPrincipalName) {
      setAUD_DocAuthor(user.userPrincipalName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!HDR_Subject.trim()) { toast.error('Subject is required'); return; }
    if (!HDR_StartDate) { toast.error('Start Date is required'); return; }
    if (!HDR_EndDate) { toast.error('End Date is required'); return; }
    if (!HDR_Category) { toast.error('Category is required'); return; }
    if (!HDR_Type) { toast.error('Type is required'); return; }
    if (!AUD_DocAuthor.trim()) { toast.error('Doc Author is required'); return; }

    try {
      const recordNo = generateRecordNo();

      // 1. Create parent record (MainDBIT) with header data
      const parentRecord = await createMainDBIT({
        title: recordNo,
        formcode: 'ITDAILYRPT',
        currentStatus: 'CurrentstatusKey4' as MainDBITCurrentstatusKey,
        subject: HDR_Subject.trim(),
        company: HDR_Company.trim(),
        requestoremail: user?.email || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
      });

      // 2. Create child record (MainDBITExtSupport) with activity details
      const iTDRVenue = HDR_Type === 'Meeting' ? MTG_Venue
        : HDR_Type === 'Seminar/Training' ? TRN_Venue
        : undefined;
      const iTDRParticipants = HDR_Type === 'Meeting' ? MTG_Present
        : HDR_Type === 'Seminar/Training' ? TRN_Participants
        : undefined;
      const iTDRDateFrom = HDR_Type === 'Meeting' ? (MTG_Date || HDR_StartDate)
        : HDR_Type === 'Seminar/Training' ? (TRN_DateStart || HDR_StartDate)
        : HDR_StartDate;
      const iTDRDateTo = HDR_Type === 'Seminar/Training' ? (TRN_DateEnd || HDR_EndDate)
        : HDR_EndDate;

      await createChildRecord({
        title: `${recordNo}-activity`,
        parentFormCode: 'ITDAILYRPT',
        parentRecord: { id: parentRecord.id, title: recordNo },
        parentSite: 'PRAI',
        iTDRActivityType: HDR_Type,
        iTDRCategory: HDR_Category,
        iTDRDisplayText: HDR_DisplayText.trim(),
        iTDRDocAuthor: AUD_DocAuthor.trim(),
        iTDRAuditCreatedDate: AUD_CDate,
        iTDRDateFrom,
        iTDRDateTo,
        iTDRVenue: iTDRVenue?.trim(),
        iTDRParticipants: iTDRParticipants?.trim(),
        iTDRMeetingChairman: HDR_Type === 'Meeting' ? MTG_Chairman.trim() : undefined,
        iTDRTimeFrom: HDR_Type === 'Meeting' ? MTG_TimeFrom : HDR_Type === 'OT' ? OT_TimeFrom : undefined,
        iTDRTimeTo: HDR_Type === 'Meeting' ? MTG_TimeTo : HDR_Type === 'OT' ? OT_TimeTo : undefined,
        iTDRTrainer: HDR_Type === 'Seminar/Training' ? TRN_Trainer.trim() : undefined,
        iTDROtCategory: HDR_Type === 'OT' ? OT_Cat.trim() : undefined,
        iTDROtPurpose: HDR_Type === 'OT' ? OT_Purpose.trim() : undefined,
      });

      toast.success(`IT Daily Report submitted! Ref: ${recordNo}`);
      navigate('/it/forms/itdr');
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
            <h1 className="text-xl font-bold text-white">IT Daily Report</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New IT Daily Report</span>
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
          {/* Section 1: Header */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <FileText className="h-5 w-5" />
                Section 1 — Report Header
              </CardTitle>
              <CardDescription>Report identification and classification</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>Subject <span className="text-destructive">*</span></Label>
                <Input
                  value={HDR_Subject}
                  onChange={e => setHDR_Subject(e.target.value)}
                  placeholder="Brief subject of this report"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={HDR_StartDate} onChange={e => setHDR_StartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={HDR_EndDate} onChange={e => setHDR_EndDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category <span className="text-destructive">*</span></Label>
                  <Select value={HDR_Category} onValueChange={setHDR_Category}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {ITDAILYRPT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type <span className="text-destructive">*</span></Label>
                  <Select value={HDR_Type} onValueChange={setHDR_Type}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {ITDAILYRPT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={HDR_Company}
                  onChange={e => setHDR_Company(e.target.value)}
                  placeholder="Company name (if applicable)"
                />
              </div>

              <div className="space-y-2">
                <Label>Display Text</Label>
                <Input
                  value={HDR_DisplayText}
                  onChange={e => setHDR_DisplayText(e.target.value)}
                  placeholder="Short display text for this report"
                />
              </div>

            </CardContent>
          </Card>

          {/* Conditional Section: Meeting */}
          {HDR_Type === 'Meeting' && (
            <Card className="border-border">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="text-[#003366]">Section 2 — Meeting Details</CardTitle>
                <CardDescription>Meeting participants and schedule</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chairman</Label>
                    <Input
                      value={MTG_Chairman}
                      onChange={e => setMTG_Chairman(e.target.value)}
                      placeholder="Meeting chairman name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input
                      value={MTG_Venue}
                      onChange={e => setMTG_Venue(e.target.value)}
                      placeholder="Meeting venue or location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Attendees (Present)</Label>
                  <Textarea
                    value={MTG_Present}
                    onChange={e => setMTG_Present(e.target.value)}
                    placeholder="List of attendees present..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meeting Date</Label>
                    <Input type="date" value={MTG_Date} onChange={e => setMTG_Date(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Time From</Label>
                      <Input type="time" value={MTG_TimeFrom} onChange={e => setMTG_TimeFrom(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Time To</Label>
                      <Input type="time" value={MTG_TimeTo} onChange={e => setMTG_TimeTo(e.target.value)} />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Conditional Section: Training */}
          {HDR_Type === 'Seminar/Training' && (
            <Card className="border-border">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="text-[#003366]">Section 2 — Training Details</CardTitle>
                <CardDescription>Seminar or training session information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input
                      value={TRN_Venue}
                      onChange={e => setTRN_Venue(e.target.value)}
                      placeholder="Training venue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trainer</Label>
                    <Input
                      value={TRN_Trainer}
                      onChange={e => setTRN_Trainer(e.target.value)}
                      placeholder="Trainer name or organization"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Start</Label>
                    <Input type="date" value={TRN_DateStart} onChange={e => setTRN_DateStart(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date End</Label>
                    <Input type="date" value={TRN_DateEnd} onChange={e => setTRN_DateEnd(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Participants</Label>
                  <Textarea
                    value={TRN_Participants}
                    onChange={e => setTRN_Participants(e.target.value)}
                    placeholder="List of training participants..."
                    rows={3}
                  />
                </div>

              </CardContent>
            </Card>
          )}

          {/* Conditional Section: OT */}
          {HDR_Type === 'OT' && (
            <Card className="border-border">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="text-[#003366]">Section 2 — Overtime Details</CardTitle>
                <CardDescription>Overtime schedule and purpose</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time From</Label>
                    <Input type="time" value={OT_TimeFrom} onChange={e => setOT_TimeFrom(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time To</Label>
                    <Input type="time" value={OT_TimeTo} onChange={e => setOT_TimeTo(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>OT Category</Label>
                  <Input
                    value={OT_Cat}
                    onChange={e => setOT_Cat(e.target.value)}
                    placeholder="e.g., Scheduled, Emergency"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Textarea
                    value={OT_Purpose}
                    onChange={e => setOT_Purpose(e.target.value)}
                    placeholder="Purpose or reason for overtime..."
                    rows={3}
                  />
                </div>

              </CardContent>
            </Card>
          )}

          {/* Section: Audit / Document History */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="text-[#003366]">Document History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Doc Author <span className="text-destructive">*</span></Label>
                  <Input
                    value={AUD_DocAuthor}
                    onChange={e => setAUD_DocAuthor(e.target.value)}
                    placeholder="Author name or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Created Date</Label>
                  <Input
                    value={AUD_CDate ? new Date(AUD_CDate).toLocaleString() : ''}
                    readOnly
                    className="bg-muted/50 text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Auto-populated</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || childPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isPending || childPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
