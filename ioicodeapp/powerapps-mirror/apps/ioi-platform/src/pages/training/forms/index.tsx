import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Award,
  ExternalLink,
  GraduationCap,
  ScrollText,
  UserCheck,
  FileText,
  Plus,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormDef {
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

interface ModuleDef {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  forms: FormDef[];
}

const MODULES: ModuleDef[] = [
  {
    id: 'planning',
    label: 'Planning',
    icon: CalendarDays,
    color: '#6366f1',
    forms: [
      { code: 'tna', name: 'Training Needs Analysis', description: 'Identify skills gaps and recommend training programmes', icon: ClipboardList },
      { code: 'atp', name: 'Annual Training Plan', description: 'Departmental training plan with budget allocation for the year', icon: CalendarDays },
      { code: 'tr', name: 'Training Request', description: 'Request a specific training programme for staff', icon: FileText },
    ],
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: BookOpen,
    color: '#10b981',
    forms: [
      { code: 'cr', name: 'Course Registration', description: 'Register an employee for an approved course or workshop', icon: UserCheck },
      { code: 'ta', name: 'Training Attendance', description: 'Record attendance for a completed training session', icon: ClipboardList },
      { code: 'ce', name: 'Course Evaluation', description: 'Post-training evaluation by participants', icon: ScrollText },
    ],
  },
  {
    id: 'certification',
    label: 'Certification',
    icon: Award,
    color: '#f59e0b',
    forms: [
      { code: 'ccr', name: 'Certification Renewal', description: 'Track and request renewal of expiring professional certifications', icon: Award },
      { code: 'cc', name: 'Competency Certification', description: 'Assess and certify employee competency levels', icon: UserCheck },
      { code: 'cer', name: 'Certificate Request', description: 'Request an official certificate of completion or attendance', icon: ScrollText },
    ],
  },
  {
    id: 'external',
    label: 'External Training',
    icon: ExternalLink,
    color: '#8b5cf6',
    forms: [
      { code: 'etr', name: 'External Training Request', description: 'Request approval for attending an external training programme', icon: GraduationCap },
      { code: 'etb', name: 'External Training Budget', description: 'Submit and track departmental external training budget', icon: FileText },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

export default function TrainingFormsIndexPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const filteredModules = MODULES.map((mod) => ({
    ...mod,
    forms: mod.forms.filter(
      (f) =>
        (!activeModule || activeModule === mod.id) &&
        (f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.code.toLowerCase().includes(search.toLowerCase()) ||
          f.description.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((mod) => mod.forms.length > 0);

  const totalForms = MODULES.reduce((acc, m) => acc + m.forms.length, 0);

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Training & Development Forms</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">
            {totalForms} forms across {MODULES.length} modules
          </p>
        </div>
      </motion.div>

      {/* Module filter chips */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveModule(null)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            !activeModule
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:bg-muted'
          }`}
        >
          All Modules
        </button>
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                activeModule === mod.id
                  ? 'border-transparent text-white'
                  : 'border-border bg-background text-foreground hover:bg-muted'
              }`}
              style={activeModule === mod.id ? { backgroundColor: mod.color, borderColor: mod.color } : {}}
            >
              <Icon className="h-3 w-3" />
              {mod.label}
            </button>
          );
        })}
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forms by name or code..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="pl-9 h-11"
        />
      </motion.div>

      {/* Form groups */}
      {filteredModules.map((mod) => {
        const ModIcon = mod.icon;
        return (
          <motion.div key={mod.id} variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ModIcon className="h-4 w-4" style={{ color: mod.color }} />
                  {mod.label}
                  <Badge variant="secondary" className="ml-auto text-xs">{mod.forms.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border">
                  {mod.forms.map((form) => {
                    const FIcon = form.icon;
                    return (
                      <div
                        key={form.code}
                        className="flex items-center justify-between py-3 gap-4 min-h-[60px]"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${mod.color}18` }}
                          >
                            <FIcon className="h-4 w-4" style={{ color: mod.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-foreground">{form.name}</span>
                              <Badge variant="outline" className="text-xs shrink-0 uppercase">{form.code}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{form.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 hidden sm:flex"
                            onClick={() => navigate(`/training/forms/${form.code}`)}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 gap-1.5"
                            onClick={() => navigate(`/training/forms/${form.code}/new`)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            New
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {filteredModules.length === 0 && (
        <motion.div variants={itemVariants} className="py-16 text-center text-muted-foreground">
          <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No forms match your search</p>
          <p className="text-sm mt-1">Try a different keyword or clear the filter</p>
        </motion.div>
      )}
    </motion.div>
  );
}
