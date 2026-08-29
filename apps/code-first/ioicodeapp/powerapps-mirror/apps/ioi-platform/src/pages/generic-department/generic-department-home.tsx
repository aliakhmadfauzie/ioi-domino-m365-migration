// =============================================================================
// Generic Department Home Page
// Auto-generated landing page for screen-builder departments.
// Displays modules as cards with links to their forms.
// =============================================================================

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Plus,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  getDepartmentByCode,
  getDepartmentModules,
  type DepartmentCode,
  type ModuleDefinition,
  type FormDefinition,
} from '@/config/departments';
import { getDepartmentDisplayName } from '@/lib/screen-builder/screen-builder-service';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] as const } },
} as const;

/**
 * Maps the module code to a consistent color.
 */
function getModuleColor(index: number): string {
  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#8b5cf6',
    '#ef4444', '#0ea5e9', '#ec4899', '#06b6d4',
    '#84cc16', '#f97316', '#14b8a6', '#a855f7',
  ];
  return colors[index % colors.length];
}

export default function GenericDepartmentHomePage() {
  const navigate = useNavigate();
  const { departmentCode } = useParams<{ departmentCode: string }>();
  const deptCode = (departmentCode ?? '').toUpperCase() as DepartmentCode;

  const department = getDepartmentByCode(deptCode);
  const modules = department?.modules ?? getDepartmentModules(deptCode);

  const [search, setSearch] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const deptPath = `/${deptCode.toLowerCase()}`;

  const filteredModules = useMemo(() => {
    if (!modules || modules.length === 0) return [];
    return modules
      .map((mod) => ({
        ...mod,
        forms: mod.forms.filter(
          (f) =>
            (!activeModule || activeModule === mod.id) &&
            (f.name.toLowerCase().includes(search.toLowerCase()) ||
              f.formCode.toLowerCase().includes(search.toLowerCase()) ||
              f.description.toLowerCase().includes(search.toLowerCase()))
        ),
      }))
      .filter((mod) => mod.forms.length > 0);
  }, [modules, search, activeModule]);

  if (!department || modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center space-y-3">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <CardTitle>Department Not Configured</CardTitle>
            <CardDescription>
              {departmentCode
                ? `Department "${departmentCode}" has no forms configured yet.`
                : 'No department specified.'}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalForms = modules.reduce((acc, m) => acc + m.forms.length, 0);

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${department.color}20`, color: department.color }}
          >
            <department.icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{department.name}</h1>
            <p className="text-sm text-muted-foreground">{department.description}</p>
          </div>
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
          All ({totalForms})
        </button>
        {modules.map((mod, i) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              activeModule === mod.id
                ? 'border-transparent text-white'
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
            style={activeModule === mod.id ? { backgroundColor: getModuleColor(i) } : {}}
          >
            {mod.forms.length} {mod.name}
          </button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11"
        />
      </motion.div>

      {/* Module cards */}
      {filteredModules.map((mod, i) => {
        const color = getModuleColor(i);
        return (
          <motion.div key={mod.id} variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {mod.name}
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {mod.forms.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">{mod.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border">
                  {mod.forms.map((form) => (
                    <div
                      key={form.formCode}
                      className="flex items-center justify-between py-3 gap-4 min-h-[60px]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-foreground">
                            {form.name}
                          </span>
                          <Badge variant="outline" className="text-xs shrink-0 uppercase">
                            {form.formCode}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {form.description}
                        </p>
                        {form.stages && form.stages.length > 0 && (
                          <p className="text-[11px] text-muted-foreground/60 mt-1">
                            {form.stages.length} stage{form.stages.length > 1 ? 's' : ''}:{' '}
                            {form.stages.map((s) => s.name).join(' → ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() =>
                            navigate(`${deptPath}/forms/${form.formCode.toLowerCase()}`)
                          }
                        >
                          <FileText className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() =>
                            navigate(
                              `${deptPath}/forms/${form.formCode.toLowerCase()}/new`
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                          New
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {filteredModules.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {search ? 'No forms match your search.' : 'No forms configured yet.'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
