import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Factory,
  CalendarCheck,
  Package,
  FileText,
  Users,
  BarChart3,
  ClipboardList,
  ArrowDownUp,
  Clock,
  TrendingDown,
  BarChart2,
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
    id: 'planning',
    label: 'Production Planning',
    icon: CalendarCheck,
    color: '#6366f1',
    forms: [
      { code: 'ops-pps', name: 'Production Planning Schedule', description: 'Weekly / monthly production schedule and target output plan', icon: CalendarCheck },
      { code: 'ops-cap', name: 'Capacity Plan', description: 'Machine and manpower capacity planning for production runs', icon: BarChart2 },
      { code: 'ops-res', name: 'Resource Allocation Request', description: 'Request allocation of manpower, machines, or materials for a production run', icon: Users },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory Control',
    icon: Package,
    color: '#10b981',
    forms: [
      { code: 'ops-req', name: 'Stock Requisition', description: 'Request raw materials or consumables from the store', icon: ClipboardList, priority: 'high' },
      { code: 'ops-adj', name: 'Inventory Adjustment', description: 'Record inventory count variances and request adjustments', icon: ArrowDownUp },
      { code: 'ops-mt', name: 'Material Transfer', description: 'Transfer materials between production lines, shifts, or cost centres', icon: Package },
    ],
  },
  {
    id: 'workorders',
    label: 'Work Orders',
    icon: FileText,
    color: '#f59e0b',
    forms: [
      { code: 'ops-wo', name: 'Work Order Request', description: 'Initiate a work order for a production or processing task', icon: FileText },
      { code: 'ops-woc', name: 'Work Order Completion Report', description: 'Record output, time taken, and sign-off for a completed work order', icon: ClipboardList },
      { code: 'ops-nco', name: 'Non-Conformance / Rework Order', description: 'Document a non-conformance and authorise a rework operation', icon: FileText, priority: 'high' },
    ],
  },
  {
    id: 'shifts',
    label: 'Shift Management',
    icon: Users,
    color: '#8b5cf6',
    forms: [
      { code: 'ops-sss', name: 'Shift Schedule Request', description: 'Submit or modify a shift schedule for the production floor', icon: CalendarCheck },
      { code: 'ops-sho', name: 'Shift Handover Report', description: 'Document the shift-end handover — output, issues, and pending tasks', icon: FileText },
      { code: 'ops-ot', name: 'Overtime Request', description: 'Request overtime hours for a shift or team', icon: Clock },
    ],
  },
  {
    id: 'performance',
    label: 'Performance Monitoring',
    icon: BarChart3,
    color: '#ef4444',
    forms: [
      { code: 'ops-oee', name: 'OEE Report', description: 'Record Overall Equipment Effectiveness — availability, performance, quality', icon: BarChart3 },
      { code: 'ops-dt', name: 'Downtime Report', description: 'Log unplanned machine or line stoppages with root cause', icon: TrendingDown, priority: 'high' },
      { code: 'ops-ppr', name: 'Production Performance Report', description: 'Daily / weekly production summary against targets', icon: BarChart2 },
      { code: 'ops-spc', name: 'Process Performance (SPC)', description: 'Statistical process control measurement and charting', icon: BarChart3 },
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

export default function OPSFormsIndexPage() {
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
      <motion.div variants={itemVariants} className="flex items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Factory className="h-5 w-5 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Operations Forms</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[52px]">
            {totalForms} forms across {MODULES.length} modules
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveModule(null)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${!activeModule ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-border bg-background text-foreground hover:bg-muted'}`}>
          All Modules
        </button>
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <button key={mod.id} type="button" onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${activeModule === mod.id ? 'border-transparent text-white' : 'border-border bg-background text-foreground hover:bg-muted'}`}
              style={activeModule === mod.id ? { backgroundColor: mod.color, borderColor: mod.color } : {}}>
              <Icon className="h-3 w-3" />{mod.label}
            </button>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search forms by name or code..." value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} className="pl-9 h-11" />
      </motion.div>

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
                          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${mod.color}18` }}>
                            <FIcon className="h-4 w-4" style={{ color: mod.color }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-foreground">{form.name}</span>
                              <Badge variant="outline" className="text-xs shrink-0 uppercase">{form.code}</Badge>
                              {form.priority === 'high' && <Badge className="text-xs shrink-0 bg-destructive text-destructive-foreground">Urgent</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{form.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 hidden sm:flex"
                            onClick={() => navigate(`/ops/forms/${form.code}`)}>
                            <ChevronRight className="h-3.5 w-3.5" />View
                          </Button>
                          <Button size="sm" className="h-8 gap-1.5"
                            onClick={() => navigate(`/ops/forms/${form.code}/new`)}>
                            <Plus className="h-3.5 w-3.5" />New
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
          <Factory className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No forms match your search</p>
          <p className="text-sm mt-1">Try a different keyword or clear the filter</p>
        </motion.div>
      )}
    </motion.div>
  );
}
