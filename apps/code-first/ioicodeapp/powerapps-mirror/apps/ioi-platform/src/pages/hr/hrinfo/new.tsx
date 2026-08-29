/** HRINFO — New HR Information Sheet Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Info } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const CATEGORIES = ['Policy', 'Procedure', 'Guidelines', 'FAQ', 'Announcement', 'Circular', 'Other'];
const REVIEW_CYCLES = ['6 months', '1 year', '2 years', '3 years', 'As Needed'];

export default function HRInfoNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [docTitle, setDocTitle] = useState('');          // → vacancyTitle (descriptive title)
  const [category, setCategory] = useState('');          // → documenttype
  const [version, setVersion] = useState('1.0');         // → formversion
  const [effectiveDate, setEffectiveDate] = useState(''); // → effectivedate
  const [reviewDate, setReviewDate] = useState('');       // → duedate
  const [distribution, setDistribution] = useState('All Staff'); // → details
  const [summary, setSummary] = useState('');            // → description

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !docTitle.trim()) { toast.error('Title is required'); return; }
    if (action === 'submit' && !category) { toast.error('Category is required'); return; }
    setSubmitting(true);
    try {
      const recordTitle = `HRINFO-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      await MainDBHRService.create({
        title: recordTitle,
        formcode: 'HRINFO',
        currentaction: action === 'draft' ? 'Draft' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        vacancyTitle: docTitle,
        documenttype: category,
        formversion: version,
        effectivedate: effectiveDate,
        duedate: reviewDate,
        details: `Distribution: ${distribution}`,
        description: summary,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Info sheet submitted for approval');
      navigate('/hr/hrinfo');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'HR Info Sheets', href: '/hr/hrinfo' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/hrinfo')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New HR Information Sheet</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Info className="h-5 w-5" />Sheet Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2"><Label>Title <span className="text-destructive">*</span></Label><Input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Information sheet title" /></div>
            <div className="space-y-2"><Label>Category <span className="text-destructive">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Version</Label><Input value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g. 1.0" /></div>
            <div className="space-y-2"><Label>Effective Date</Label><Input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Next Review Date</Label><Input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Distribution</Label><Input value={distribution} onChange={e => setDistribution(e.target.value)} placeholder="e.g. All Staff, Management Only" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Summary / Content</Label><Textarea value={summary} onChange={e => setSummary(e.target.value)} rows={5} placeholder="Content or summary of the information sheet..." /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/hrinfo')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit for Approval</Button>
      </div>
    </motion.div>
  );
}
