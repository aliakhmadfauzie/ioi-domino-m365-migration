import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CalendarCheck,
  FileSpreadsheet,
  Flame,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

interface FormConfig {
  code: string;
  sharePointCode: string;
  name: string;
  description: string;
  icon: LucideIcon;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const forms: FormConfig[] = [
  {
    code: 'FAR',
    sharePointCode: 'FAILANALREPO',
    name: 'Failure Analysis Report',
    description: 'Equipment failure root cause analysis and corrective actions (IMS Critical)',
    icon: AlertTriangle,
    priority: 'critical',
  },
  {
    code: 'MTP',
    sharePointCode: 'MAINPLAN',
    name: 'Maintenance Plan',
    description: 'Preventive and predictive maintenance scheduling',
    icon: CalendarCheck,
    priority: 'high',
  },
  {
    code: 'PMD',
    sharePointCode: 'PLANMAINDOCU',
    name: 'Plant Maintenance Documentation',
    description: 'Plant equipment maintenance records and history',
    icon: FileSpreadsheet,
    priority: 'medium',
  },
  {
    code: 'MECP',
    sharePointCode: 'MTNEMERCHAN',
    name: 'MTN Emergency Change Procedure',
    description: 'Emergency maintenance change requests and approvals',
    icon: Flame,
    priority: 'critical',
  },
  {
    code: 'EPI',
    sharePointCode: 'EQUIPREINSP',
    name: 'Equipment Pre-Inspection',
    description: 'Pre-operation equipment safety and readiness checks',
    icon: Eye,
    priority: 'high',
  },
];

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">critical</Badge>;
    case 'high':
      return <Badge variant="default">high</Badge>;
    case 'medium':
      return <Badge variant="secondary">medium</Badge>;
    default:
      return <Badge variant="outline">low</Badge>;
  }
}

export default function MTRFormsIndexPage() {
  return (
    <motion.div
      className="p-4 md:p-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/mtr">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Maintenance
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">Maintenance Forms</h1>
        <p className="text-muted-foreground">Select a form to create a new submission</p>
      </motion.div>

      <motion.div variants={containerVariants} className="space-y-3">
        {forms.map((form: FormConfig) => {
          const FormIcon = form.icon;
          return (
            <motion.div key={form.code} variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <FormIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                        <Badge variant="outline" className="font-mono text-xs">{form.sharePointCode}</Badge>
                        <span className="font-semibold">{form.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{form.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPriorityBadge(form.priority)}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/mtr/forms/${form.code.toLowerCase()}`}>View Rows</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/mtr/forms/${form.code.toLowerCase()}/new`}>New</Link>
                      </Button>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
