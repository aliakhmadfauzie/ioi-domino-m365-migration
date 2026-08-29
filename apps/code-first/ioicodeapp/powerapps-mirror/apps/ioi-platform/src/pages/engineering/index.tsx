import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Wrench, FileText, ClipboardList, Settings, Cog, Building, HardHat, Cpu, Search, Plus, Database, Clock, ChevronRight } from 'lucide-react';

const modules = [
  {
    id: 'projects',
    title: 'Project Management',
    description: 'Engineering projects and capital works',
    icon: Building,
    color: 'bg-blue-500',
    forms: [
      { id: 'pp', label: 'Project Proposal', description: 'Submit project proposals', count: 28 },
      { id: 'ps', label: 'Project Status', description: 'Project progress updates', count: 145 },
      { id: 'pc', label: 'Project Completion', description: 'Project handover reports', count: 22 },
    ],
  },
  {
    id: 'moc',
    title: 'Management of Change',
    description: 'MOC requests and approvals',
    icon: Settings,
    color: 'bg-amber-500',
    forms: [
      { id: 'moc', label: 'MOC Request', description: 'Change management requests', count: 35 },
      { id: 'mocr', label: 'MOC Review', description: 'MOC review records', count: 28 },
      { id: 'mocc', label: 'MOC Closure', description: 'MOC closure reports', count: 20 },
    ],
  },
  {
    id: 'drawings',
    title: 'Technical Drawings',
    description: 'Drawing requests and revisions',
    icon: FileText,
    color: 'bg-green-500',
    forms: [
      { id: 'dr', label: 'Drawing Request', description: 'Request technical drawings', count: 85 },
      { id: 'du', label: 'Drawing Update', description: 'Update existing drawings', count: 45 },
      { id: 'dc', label: 'Drawing Control', description: 'Drawing revision control', count: 120 },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Equipment specifications and installation',
    icon: Cog,
    color: 'bg-purple-500',
    forms: [
      { id: 'es', label: 'Equipment Specification', description: 'Equipment specs', count: 65 },
      { id: 'ei', label: 'Equipment Installation', description: 'Installation records', count: 42 },
      { id: 'ec', label: 'Equipment Commissioning', description: 'Commissioning reports', count: 35 },
    ],
  },
  {
    id: 'ei',
    title: 'Electrical & Instrumentation',
    description: 'E&I documentation and records',
    icon: Cpu,
    color: 'bg-red-500',
    forms: [
      { id: 'eir', label: 'E&I Request', description: 'Electrical/Instrumentation work', count: 78 },
      { id: 'il', label: 'Instrument Log', description: 'Instrument records', count: 150 },
      { id: 'cl', label: 'Calibration Log', description: 'Calibration records', count: 200 },
    ],
  },
];

export default function EngineeringDepartmentHomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<{ id: string; label: string; moduleId: string } | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);

  const handleFormClick = (form: { id: string; label: string }, moduleId: string) => {
    setSelectedForm({ ...form, moduleId });
    setShowFormDialog(true);
  };

  const handleNavigate = (type: 'database' | 'submissions' | 'pending' | 'new') => {
    if (!selectedForm) return;
    setShowFormDialog(false);
    switch (type) {
      case 'database':
        navigate(`/engineering/forms/${selectedForm.id}`);
        break;
      case 'submissions':
        navigate(`/engineering/forms/${selectedForm.id}?filter=my-submissions`);
        break;
      case 'pending':
        navigate(`/engineering/forms/${selectedForm.id}?filter=my-pending-tasks`);
        break;
      case 'new':
        navigate(`/engineering/forms/${selectedForm.id}/new`);
        break;
    }
  };

  const filteredModules = modules.map((module) => ({
    ...module,
    forms: module.forms.filter((form) =>
      form.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((module) => module.forms.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engineering</h1>
          <p className="text-muted-foreground">Project management, MOC, drawings, equipment, and E&I documentation</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Modules */}
      <div className="grid gap-6">
        {filteredModules.map((module, idx) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${module.color}`}>
                    <module.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {module.forms.map((form) => (
                    <Card
                      key={form.id}
                      className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                      onClick={() => handleFormClick(form, module.id)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{form.label}</p>
                          <p className="text-sm text-muted-foreground">{form.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{form.count}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Form Selection Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedForm?.label}</DialogTitle>
            <DialogDescription>Choose an action for this form</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button variant="outline" className="justify-start gap-3 h-auto py-3" onClick={() => handleNavigate('database')}>
              <Database className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">View Database</p>
                <p className="text-sm text-muted-foreground">Browse all submissions</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-auto py-3" onClick={() => handleNavigate('submissions')}>
              <ClipboardList className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <p className="font-medium">My Submissions</p>
                <p className="text-sm text-muted-foreground">Forms I have submitted</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-auto py-3" onClick={() => handleNavigate('pending')}>
              <Clock className="h-5 w-5 text-amber-500" />
              <div className="text-left">
                <p className="font-medium">My Pending Tasks</p>
                <p className="text-sm text-muted-foreground">Forms awaiting my action</p>
              </div>
            </Button>
            <Button className="justify-start gap-3 h-auto py-3" onClick={() => handleNavigate('new')}>
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Create New</p>
                <p className="text-sm text-muted-foreground">Start a new submission</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}