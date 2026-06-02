import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Server, FileText, AlertCircle, CheckCircle2, Wrench, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';

const RECORD_TYPES = [
  { id: 'incident', label: 'Incident Record', icon: AlertCircle, description: 'Document server incident or outage' },
  { id: 'maintenance', label: 'Maintenance Record', icon: Wrench, description: 'Document planned maintenance activity' },
  { id: 'performance', label: 'Performance Record', icon: Server, description: 'Document performance issue or optimization' },
  { id: 'security', label: 'Security Record', icon: Shield, description: 'Document security event or vulnerability' },
];

const SERVERS = [
  'IOIPRD01 - SAP Production', 'IOIQAS01 - SAP QA', 'IOIDEV01 - SAP Development',
  'IOIBW01 - SAP BW', 'IOIHANA01 - HANA Database', 'IOIAD01 - Active Directory',
  'IOIEX01 - Exchange Server', 'IOISP01 - SharePoint', 'IOIFILE01 - File Server',
  'IOIWEB01 - Web Server', 'IOIAPP01 - Application Server', 'IOIBACKUP01 - Backup Server',
  'IOIFW01 - Firewall', 'IOIVPN01 - VPN Gateway', 'Other'
];

const SEVERITY_LEVELS = [
  { id: 'P1', label: 'P1 - Critical', description: 'Complete system outage' },
  { id: 'P2', label: 'P2 - High', description: 'Major functionality impacted' },
  { id: 'P3', label: 'P3 - Medium', description: 'Partial functionality impacted' },
  { id: 'P4', label: 'P4 - Low', description: 'Minor issue, workaround available' },
];

export default function SRRNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createMutation = useCreateMainDBIT();

  const [recordType, setRecordType] = useState<string>('');
  const [server, setServer] = useState('');
  const [severity, setSeverity] = useState('');
  const [incidentDate, setIncidentDate] = useState<Date>();
  const [recordTitle, setRecordTitle] = useState('');
  
  // Required fields from feedback
  const [summary, setSummary] = useState('');
  const [background, setBackground] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveActions, setCorrectiveActions] = useState('');
  const [preventiveActions, setPreventiveActions] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const handleSubmit = async () => {
    if (!recordType || !server || !recordTitle || !summary) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: recordTitle,
        formcode: 'SRR',
        currentStatus: 'CurrentstatusKey1',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        remarks: [
          `Form Type: SRR`,
          `Record Type: ${recordType}`,
          `Server: ${server}`,
          `Severity: ${severity}`,
          `Incident Date: ${incidentDate?.toISOString() || 'N/A'}`,
          `Summary: ${summary}`,
          `Background: ${background}`,
          `Analysis: ${analysis}`,
          `Root Cause: ${rootCause}`,
          `Corrective Actions: ${correctiveActions}`,
          `Preventive Actions: ${preventiveActions}`,
          `Lessons Learned: ${lessonsLearned}`,
          `Requestor: ${user?.fullName || 'N/A'}`,
        ].filter(Boolean).join('\n'),
      });
      toast.success('Server record created successfully');
      navigate('/it/m2');
    } catch {
      toast.error('Failed to create record');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/it/m2')}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to IT Support
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Server Records</h1>
              <p className="text-muted-foreground">Document server incidents, maintenance, and performance records</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Record Type Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Record Type
                </CardTitle>
                <CardDescription>Select the type of server record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {RECORD_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setRecordType(type.id)}
                        className={cn(
                          'p-4 rounded-lg border-2 cursor-pointer transition-all',
                          recordType === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center',
                            recordType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{type.label}</p>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Server & Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader>
                <CardTitle>Server Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Server *</Label>
                    <Select value={server} onValueChange={setServer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select server" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVERS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITY_LEVELS.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.label} - {level.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Record Title *</Label>
                    <Input
                      placeholder="Brief title for the record"
                      value={recordTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecordTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Incident Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !incidentDate && 'text-muted-foreground'
                          )}
                        >
                          {incidentDate ? format(incidentDate, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={incidentDate}
                          onSelect={setIncidentDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary - Required per feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Summary *
                </CardTitle>
                <CardDescription>Provide a brief summary of the incident/event</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Executive summary of the incident, including what happened, when, and overall impact..."
                  rows={4}
                  value={summary}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSummary(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Background - Required per feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle>Background</CardTitle>
                <CardDescription>Provide context and background information</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Background information, system configuration, previous issues, relevant history..."
                  rows={4}
                  value={background}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBackground(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Analysis - Required per feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>Document the investigation and analysis performed</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Technical analysis, investigation steps, findings, data collected..."
                  rows={4}
                  value={analysis}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnalysis(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Root Cause - Required per feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Root Cause</CardTitle>
                <CardDescription>Identify the root cause of the incident</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Root cause identification, contributing factors, why the issue occurred..."
                  rows={3}
                  value={rootCause}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRootCause(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Corrective Actions - Required per feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Corrective Actions</CardTitle>
                <CardDescription>Document actions taken to resolve the issue</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Actions taken to resolve the issue, timeline of resolution, resources used..."
                  rows={3}
                  value={correctiveActions}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCorrectiveActions(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Preventive Actions - Required per feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Preventive Actions</CardTitle>
                <CardDescription>Document actions to prevent recurrence</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Actions to prevent recurrence, process improvements, monitoring enhancements..."
                  rows={3}
                  value={preventiveActions}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPreventiveActions(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Lessons Learned */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Lessons Learned</CardTitle>
                <CardDescription>Document key takeaways and lessons learned</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Key takeaways, recommendations for future, knowledge sharing..."
                  rows={3}
                  value={lessonsLearned}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLessonsLearned(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/it/m2')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Record'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}