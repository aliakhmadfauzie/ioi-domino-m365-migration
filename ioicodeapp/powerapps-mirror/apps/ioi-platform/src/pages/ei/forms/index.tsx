import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Zap,
  ClipboardCheck,
  FileText,
  Activity,
  Settings,
  Gauge,
  AlertTriangle,
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
  priority?: 'high';
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
    id: 'inspection',
    label: 'Inspection & Testing',
    icon: ClipboardCheck,
    color: '#6366f1',
    forms: [
      { code: 'ei-ins-001', name: 'E&I Inspection Report', description: 'Routine inspection of electrical and instrumentation equipment', icon: ClipboardCheck },
      { code: 'ei-ins-002', name: 'Loop Test Record', description: 'Control loop function testing and verification', icon: Activity },
      { code: 'ei-ins-003', name: 'Insulation Resistance Test', description: 'Megger / IR testing record for electrical equipment', icon: Zap, priority: 'high' },
    ],
  },
  {
    id: 'energy',
    label: 'Energy Monitoring',
    icon: Gauge,
    color: '#f59e0b',
    forms: [
      { code: 'ei-enm-001', name: 'Energy Meter Reading', description: 'Daily / weekly energy meter readings per utility point', icon: Gauge },
      { code: 'ei-enm-002', name: 'Energy Anomaly Report', description: 'Report unexpected energy consumption anomalies', icon: AlertTriangle, priority: 'high' },
      { code: 'ei-enm-003', name: 'ENMS Monthly Summary', description: 'Energy Management System monthly performance summary (ISO 50001)', icon: FileText },
    ],
  },
  {
    id: 'assets',
    label: 'Asset Management',
    icon: Settings,
    color: '#10b981',
    forms: [
      { code: 'ei-ast-001', name: 'E&I Asset Register', description: 'Register new or updated E&I assets in the plant asset list', icon: FileText },
      { code: 'ei-ast-002', name: 'Equipment Failure Report', description: 'Report failure or fault of an E&I asset', icon: AlertTriangle, priority: 'high' },
    ],
  },
  {
    id: 'generator',
    label: 'Generator & Utilities',
    icon: Zap,
    color: '#ef4444',
    forms: [
      { code: 'ei-gen-001', name: 'Generator Running Log', description: 'Daily generator operation and fuel consumption log', icon: Activity },
      { code: 'ei-gen-002', name: 'Generator PM Checklist', description: 'Preventive maintenance checklist for standby generators', icon: ClipboardCheck },
    ],
  },
  {
    id: 'calibration',
    label: 'Calibration',
    icon: Gauge,
    color: '#8b5cf6',
    forms: [
      { code: 'ei-cal-001', name: 'Instrument Calibration Record', description: 'Calibration certificate and result for process instruments', icon: Gauge },
      { code: 'ei-cal-002', name: 'Calibration Due Register', description: 'Track upcoming instrument calibration schedules', icon: ClipboardCheck },
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

export default function EIFormsIndexPage() {
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
            <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">E&I Forms</h1>
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
              ? 'border-yellow-600 bg-yellow-600 text-white'
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
                      <div key={form.code} className="flex items-center justify-between py-3 gap-4 min-h-[60px]">
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
                              {form.priority === 'high' && (
                                <Badge className="text-xs shrink-0 bg-destructive text-destructive-foreground">High Priority</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{form.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 hidden sm:flex"
                            onClick={() => navigate(`/ei/forms/${form.code}`)}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 gap-1.5"
                            onClick={() => navigate(`/ei/forms/${form.code}/new`)}
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
          <Zap className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No forms match your search</p>
          <p className="text-sm mt-1">Try a different keyword or clear the filter</p>
        </motion.div>
      )}
    </motion.div>
  );
}
