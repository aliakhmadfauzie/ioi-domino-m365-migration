import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Heart,
  Save,
  Send,
  AlertCircle,
  FileText,
  Clock,
  Stethoscope,
  Calendar,
  Activity,
  Plus,
  Trash2,
} from 'lucide-react';
import { HRLayout } from '@/components/hr/hr-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser } from '@/hooks/use-user';

const formSchema = z.object({
  employeeId: z.string().min(1, { error: 'Employee ID is required' }),
  employeeName: z.string().min(1, { error: 'Name is required' }),
  department: z.string().min(1, { error: 'Department is required' }),
  site: z.string().min(1, { error: 'Site is required' }),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  lastMedicalCheckup: z.string().optional(),
  doctorName: z.string().optional(),
  doctorContact: z.string().optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  status: string;
  attachments: number;
}

const mockRecords: MedicalRecord[] = [
  {
    id: 'EPHR-2025-001',
    date: '2025-04-15',
    type: 'Annual Checkup',
    description: 'Complete health screening',
    status: 'Completed',
    attachments: 3,
  },
  {
    id: 'EPHR-2025-002',
    date: '2025-03-20',
    type: 'Vaccination',
    description: 'Typhoid vaccination',
    status: 'Completed',
    attachments: 1,
  },
  {
    id: 'EPHR-2025-003',
    date: '2025-02-10',
    type: 'Medical Leave',
    description: 'Flu symptoms',
    status: 'Approved',
    attachments: 2,
  },
];

const healthConditions = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Asthma',
  'Epilepsy',
  'Arthritis',
  'Back Pain',
  'Vision Problems',
  'Hearing Problems',
  'None',
];

export default function HealthRecordPage() {
  const { data: user } = useUser();
  const [activeTab, setActiveTab] = useState('record');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [vaccinations, setVaccinations] = useState<{ name: string; date: string }[]>([
    { name: '', date: '' },
  ]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: '',
      employeeName: user?.fullName || '',
      department: '',
      site: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data, selectedConditions, vaccinations);
    toast.success('Health record updated successfully');
  };

  const onSaveDraft = () => {
    toast.info('Draft saved');
  };

  const addVaccination = () => {
    setVaccinations([...vaccinations, { name: '', date: '' }]);
  };

  const removeVaccination = (index: number) => {
    setVaccinations(vaccinations.filter((_: { name: string; date: string }, i: number) => i !== index));
  };

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c: string) => c !== condition));
    } else {
      if (condition === 'None') {
        setSelectedConditions(['None']);
      } else {
        setSelectedConditions([...selectedConditions.filter((c: string) => c !== 'None'), condition]);
      }
    }
  };

  return (
    <HRLayout title="Personal Health Record">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Heart className="h-6 w-6 text-destructive" />
              </div>
              Personal Health Record (EPHR)
            </h1>
            <p className="text-muted-foreground mt-1">
              Maintain your health information for workplace safety
            </p>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="record" className="gap-2">
              <FileText className="h-4 w-4" />
              Health Profile
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Medical History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Employee Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        {...form.register('employeeId')}
                        placeholder="IOI-12345"
                      />
                      {form.formState.errors.employeeId && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.employeeId.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeName">Full Name *</Label>
                      <Input
                        id="employeeName"
                        {...form.register('employeeName')}
                        placeholder="Full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        value={form.watch('department') || ''}
                        onValueChange={(val: string) => form.setValue('department', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="qa">Quality Assurance</SelectItem>
                          <SelectItem value="qc">Quality Control</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="she">SHE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site">Site *</Label>
                      <Select
                        value={form.watch('site') || ''}
                        onValueChange={(val: string) => form.setValue('site', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prai">Prai (Penang)</SelectItem>
                          <SelectItem value="johor">Pasir Gudang (Johor)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Health Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        value={form.watch('bloodType') || ''}
                        onValueChange={(val: string) => form.setValue('bloodType', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a+">A+</SelectItem>
                          <SelectItem value="a-">A-</SelectItem>
                          <SelectItem value="b+">B+</SelectItem>
                          <SelectItem value="b-">B-</SelectItem>
                          <SelectItem value="ab+">AB+</SelectItem>
                          <SelectItem value="ab-">AB-</SelectItem>
                          <SelectItem value="o+">O+</SelectItem>
                          <SelectItem value="o-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastMedicalCheckup">Last Medical Checkup</Label>
                      <Input
                        id="lastMedicalCheckup"
                        type="date"
                        {...form.register('lastMedicalCheckup')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Primary Doctor</Label>
                      <Input
                        id="doctorName"
                        {...form.register('doctorName')}
                        placeholder="Doctor name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Known Health Conditions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {healthConditions.map((condition: string) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={selectedConditions.includes(condition)}
                            onCheckedChange={() => toggleCondition(condition)}
                          />
                          <label htmlFor={condition} className="text-sm cursor-pointer">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        {...form.register('allergies')}
                        placeholder="List any known allergies (medications, food, environmental)"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">Current Medications</Label>
                      <Textarea
                        id="currentMedications"
                        {...form.register('currentMedications')}
                        placeholder="List current medications"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vaccination Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Vaccination Records
                  </CardTitle>
                  <CardDescription>
                    Record your vaccination history for occupational health requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vaccinations.map((vax: { name: string; date: string }, index: number) => (
                    <div key={index} className="flex items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>Vaccination Name</Label>
                        <Input
                          value={vax.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...vaccinations];
                            updated[index].name = e.target.value;
                            setVaccinations(updated);
                          }}
                          placeholder="e.g., Typhoid, Hepatitis B, COVID-19"
                        />
                      </div>
                      <div className="w-48 space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={vax.date}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updated = [...vaccinations];
                            updated[index].date = e.target.value;
                            setVaccinations(updated);
                          }}
                        />
                      </div>
                      {vaccinations.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeVaccination(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addVaccination} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vaccination
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Medical Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Contact Name</Label>
                      <Input
                        id="emergencyContactName"
                        {...form.register('emergencyContactName')}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        {...form.register('emergencyContactPhone')}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Additional Medical Notes</Label>
                    <Textarea
                      id="remarks"
                      {...form.register('remarks')}
                      placeholder="Any additional medical information HR should know..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onSaveDraft} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Update Health Record
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>View your medical checkups, vaccinations, and health records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Attachments</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecords.map((record: MedicalRecord) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.attachments} files</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-accent text-accent-foreground">
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
}
