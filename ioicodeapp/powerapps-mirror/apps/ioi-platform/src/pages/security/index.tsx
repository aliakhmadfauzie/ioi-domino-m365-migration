import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Shield,
  Users,
  Car,
  KeyRound,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  Camera,
  UserCheck,
  BadgeCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const SECURITY_MODULES = [
  {
    id: 'visitor',
    title: 'Visitor Management',
    description: 'Visitor registration, passes, and tracking',
    icon: Users,
    color: 'bg-blue-500',
    forms: [
      { code: 'VR', name: 'Visitor Registration', description: 'Register new visitors' },
      { code: 'VP', name: 'Visitor Pass', description: 'Issue visitor passes' },
      { code: 'VL', name: 'Visitor Log', description: 'Daily visitor log records' },
    ],
  },
  {
    id: 'vehicle',
    title: 'Vehicle Control',
    description: 'Vehicle entry, exit, and parking management',
    icon: Car,
    color: 'bg-green-500',
    forms: [
      { code: 'VE', name: 'Vehicle Entry', description: 'Record vehicle entry' },
      { code: 'PP', name: 'Parking Permit', description: 'Issue parking permits' },
      { code: 'VX', name: 'Vehicle Exit', description: 'Record vehicle exit' },
    ],
  },
  {
    id: 'access',
    title: 'Access Control',
    description: 'Key management and access permissions',
    icon: KeyRound,
    color: 'bg-purple-500',
    forms: [
      { code: 'KI', name: 'Key Issuance', description: 'Issue keys to personnel' },
      { code: 'KR', name: 'Key Return', description: 'Return issued keys' },
      { code: 'AC', name: 'Access Card Request', description: 'Request access cards' },
    ],
  },
  {
    id: 'patrol',
    title: 'Patrol & Monitoring',
    description: 'Security patrol and surveillance records',
    icon: Camera,
    color: 'bg-orange-500',
    forms: [
      { code: 'PR', name: 'Patrol Report', description: 'Daily patrol reports' },
    ],
  },
];

export default function SecurityDepartmentHomePage() {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState<{
    code: string;
    name: string;
    path: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFormClick = (formCode: string, formName: string) => {
    setSelectedForm({
      code: formCode,
      name: formName,
      path: `/security/forms/${formCode.toLowerCase()}`,
    });
    setDialogOpen(true);
  };

  const handleNavigate = (filter?: string) => {
    if (!selectedForm) return;
    const path = filter
      ? `${selectedForm.path}?filter=${filter}`
      : selectedForm.path;
    navigate(path);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Department</h1>
          <p className="text-muted-foreground mt-1">
            Visitor management, access control, and security operations
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Shield className="h-5 w-5 mr-2" />
          SEC
        </Badge>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECURITY_MODULES.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.forms.map((form) => (
                    <button
                      key={form.code}
                      onClick={() => handleFormClick(form.code, form.name)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{form.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {form.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{form.code}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Form Navigation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedForm?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={() => handleNavigate()}
            >
              <ClipboardCheck className="h-5 w-5 mr-3 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">View Database</p>
                <p className="text-xs text-muted-foreground">See all submissions</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={() => handleNavigate('my-submissions')}
            >
              <UserCheck className="h-5 w-5 mr-3 text-green-500" />
              <div className="text-left">
                <p className="font-medium">My Submissions</p>
                <p className="text-xs text-muted-foreground">Records I submitted</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={() => handleNavigate('my-pending-tasks')}
            >
              <AlertTriangle className="h-5 w-5 mr-3 text-orange-500" />
              <div className="text-left">
                <p className="font-medium">My Pending Tasks</p>
                <p className="text-xs text-muted-foreground">Awaiting my action</p>
              </div>
            </Button>
            <div className="pt-2 border-t">
              <Button
                className="w-full"
                onClick={() => {
                  navigate(`${selectedForm?.path}/new`);
                  setDialogOpen(false);
                }}
              >
                <BadgeCheck className="h-4 w-4 mr-2" />
                Create New Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}