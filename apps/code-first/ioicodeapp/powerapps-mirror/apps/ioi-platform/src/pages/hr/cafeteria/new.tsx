/**
 * CIR — New Cafeteria Inspection Form
 * Non-approval form: simple Submitted → Accepted status (DXL-confirmed).
 * Parent record writes metadata to MainDB_HR.
 * Inspection details write to MainDB_HR_Ext_Cafeteria.
 * No approval workflow panel.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Loader2,
  Send,
  Building2,
} from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { EmployeePicker } from '@/components/employee-picker';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';
import { MainDBHRExtCafeteriaService } from '@/services/main-dbhr-ext-cafeteria-service';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

const SITE_OPTIONS = [
  { value: 'ACM Cafeteria', label: 'ACM Cafeteria' },
  { value: 'ECM Cafeteria', label: 'ECM Cafeteria' },
];

function CafeteriaNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  // Form state — mapped to schema internal names (cir*)
  const [site, setSite] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [inspector, setInspector] = useState('');
  const [insDate, setInsDate] = useState('');
  const [insTime, setInsTime] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = async () => {
    if (!user?.email) {
      toast.error('User not authenticated');
      return;
    }

    // Validation
    if (!site) { toast.error('Please select a Site'); return; }
    if (!insDate) { toast.error('Please select an Inspection Date'); return; }
    if (!insTime) { toast.error('Please select an Inspection Time'); return; }

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const title = `CIR-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      const inspectorValue = inspector || user.email;

      const parentRecord = await MainDBHRService.create({
        title,
        formcode: 'CIR',
        requesttitle: title,
        requestedby: user.email,
        submittedon: now,
        statusKey: 'StatusKey1',
        department: 'HR',
      } as any);
      const parentRecordId = String(
        (parentRecord as any).ID || (parentRecord as any).id || (parentRecord as any).ItemInternalId || ''
      );

      if (!parentRecordId) {
        throw new Error('Parent record was created without a readable ID');
      }

      await MainDBHRExtCafeteriaService.create({
        Title: title,
        ParentRecord: parentRecordId,
        ParentFormCode: 'CIR',
        cirSite: site,
        cirTeamMembers2: teamMembers.join(';'),
        cirInspector: inspectorValue,
        cirInsDate: insDate,
        cirInsTime: insTime,
        cirRemarks: remarks,
        cirSubmittedBy: user.email,
        cirSubmittedDate: now,
        cirCurrentAction: 'Submitted',
        cirINO: title,
      } as any);

      toast.success('Inspection submitted');
      navigate('/hr/cafeteria');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save inspection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 p-6">
      <HRBreadcrumb
        items={[
          { label: 'HR Dashboard', href: '/hr' },
          { label: 'Cafeteria Inspections', href: '/hr/cafeteria' },
          { label: 'New Inspection' },
        ]}
      />

      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/cafeteria')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Cafeteria Inspection</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record a new cafeteria hygiene inspection
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Inspection Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site */}
              <div className="space-y-2">
                <Label htmlFor="site">Site *</Label>
                <Select value={site} onValueChange={setSite}>
                  <SelectTrigger id="site">
                    <SelectValue placeholder="Select cafeteria site" />
                  </SelectTrigger>
                  <SelectContent>
                    {SITE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Members — Multi-person picker */}
              <div className="space-y-2">
                <Label htmlFor="teamMembers">Team Members</Label>
                <EmployeePicker
                  value={teamMembers[teamMembers.length - 1] || ''}
                  onChange={(email) => {
                    if (email && !teamMembers.includes(email)) {
                      setTeamMembers([...teamMembers, email]);
                    }
                  }}
                  placeholder="Add team member..."
                  showEmail
                />
                {teamMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teamMembers.map((email, i) => (
                      <span key={email} className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs">
                        {email}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Inspector */}
              <div className="space-y-2">
                <Label htmlFor="inspector">Inspector</Label>
                <EmployeePicker
                  value={inspector}
                  onChange={(email) => setInspector(email)}
                  placeholder="Search inspector..."
                  showEmail
                  showTitle
                />
              </div>

              {/* Inspection Date */}
              <div className="space-y-2">
                <Label htmlFor="insDate">Inspection Date *</Label>
                <Input
                  id="insDate"
                  type="date"
                  value={insDate}
                  onChange={(e) => setInsDate(e.target.value)}
                />
              </div>

              {/* Inspection Time */}
              <div className="space-y-2">
                <Label htmlFor="insTime">Inspection Time *</Label>
                <Input
                  id="insTime"
                  type="time"
                  value={insTime}
                  onChange={(e) => setInsTime(e.target.value)}
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Inspection notes, findings, or corrective actions..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/hr/cafeteria')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Inspection
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default CafeteriaNewPage;
