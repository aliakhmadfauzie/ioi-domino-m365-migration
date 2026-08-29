import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Save, RotateCcw, Download, Eye, EyeOff,
  ChevronDown, ChevronRight, Plus, Trash2, GripVertical,
  AlertCircle, CheckCircle2, Code2, List, Columns,
  Pencil, X, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DynamicForm } from '@/components/dynamic-form/DynamicForm';
import { useFormSchemaAdmin } from '@/hooks/use-form-schema';
import type { FormSchema, SectionSchema, FieldSchema, FieldType, AutoValueKind } from '@/types/form-schema';

// ─── Helpers ────────────────────────────────────────────────────────────────

function countFields(schema: FormSchema) {
  return schema.sections.reduce((n, s) => n + s.fields.length, 0);
}

const FIELD_TYPES: FieldType[] = [
  'text', 'choice', 'multiline', 'people', 'date', 'datetime', 'time', 'boolean', 'attachment',
];
const SP_TABLES = ['MainDB_IT', 'ExtSupport', 'ExtAccess', 'ExtAssets', 'ExtSAP'] as const;
const AUTO_VALUES: AutoValueKind[] = ['timestamp', 'currentUser', 'generateRecordNo'];
const NONE = '__none__' as const;

// ─── Field Properties Editor ─────────────────────────────────────────────────

interface FieldEditorProps {
  field: FieldSchema;
  onChange(updated: FieldSchema): void;
  onClose(): void;
}

function FieldEditor({ field, onChange, onClose }: FieldEditorProps) {
  const [local, setLocal] = useState<FieldSchema>(field);

  const set = <K extends keyof FieldSchema>(key: K, value: FieldSchema[K]) => {
    setLocal(prev => ({ ...prev, [key]: value }));
  };

  const commit = () => {
    onChange(local);
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <span className="font-semibold text-sm">Edit Field: <code className="text-primary">{field.fieldId}</code></span>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="gap-1" onClick={commit}>
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4 text-sm">
        <div>
          <Label className="text-xs text-muted-foreground mb-1">Field ID (read-only)</Label>
          <Input value={local.fieldId} disabled className="font-mono text-xs" />
        </div>

        <div>
          <Label className="text-xs mb-1">Label</Label>
          <Input value={local.label} onChange={e => set('label', e.target.value)} />
        </div>

        <div>
          <Label className="text-xs mb-1">Field Type</Label>
          <Select value={local.fieldType} onValueChange={v => set('fieldType', v as FieldType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {local.fieldType === 'choice' && (
          <div>
            <Label className="text-xs mb-1">Options (one per line)</Label>
            <Textarea
              rows={5}
              value={(local.options ?? []).join('\n')}
              onChange={e => set('options', e.target.value.split('\n').filter(Boolean))}
              className="font-mono text-xs"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={local.required}
              onCheckedChange={v => set('required', v)}
              id="req"
            />
            <Label htmlFor="req" className="text-xs">Required</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={!!local.readOnly}
              onCheckedChange={v => set('readOnly', v)}
              id="ro"
            />
            <Label htmlFor="ro" className="text-xs">Read Only</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={!!local.fullWidth}
              onCheckedChange={v => set('fullWidth', v)}
              id="fw"
            />
            <Label htmlFor="fw" className="text-xs">Full Width</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={!!local.deprecated}
              onCheckedChange={v => set('deprecated', v)}
              id="dep"
            />
            <Label htmlFor="dep" className="text-xs">Deprecated</Label>
          </div>
        </div>

        <div>
          <Label className="text-xs mb-1">Auto Value</Label>
          <Select
            value={local.autoValue ?? NONE}
            onValueChange={v => set('autoValue', v === NONE ? undefined : v as AutoValueKind)}
          >
            <SelectTrigger><SelectValue placeholder="(none)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>(none)</SelectItem>
              {AUTO_VALUES.map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs mb-1">Placeholder</Label>
          <Input
            value={local.placeholder ?? ''}
            onChange={e => set('placeholder', e.target.value || undefined)}
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            SharePoint Mapping
          </p>

          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1">SP Column (internal name)</Label>
              <Input
                value={local.spColumn ?? ''}
                onChange={e => set('spColumn', e.target.value || undefined)}
                className="font-mono text-xs"
                placeholder="e.g. requestoremail"
              />
            </div>

            <div>
              <Label className="text-xs mb-1">SP Table</Label>
              <Select
                value={local.spTable ?? NONE}
                onValueChange={v => set('spTable', v === NONE ? undefined : v as FieldSchema['spTable'])}
              >
                <SelectTrigger><SelectValue placeholder="(default: MainDB_IT)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>(default: MainDB_IT)</SelectItem>
                  {SP_TABLES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs mb-1">SP Column Type</Label>
              <Select
                value={local.spColumnType ?? NONE}
                onValueChange={v => set('spColumnType', v === NONE ? undefined : v as 'text' | 'number')}
              >
                <SelectTrigger><SelectValue placeholder="text (default)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>text (default)</SelectItem>
                  <SelectItem value="number">number</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs mb-1">Notes</Label>
          <Input
            value={local.notes ?? ''}
            onChange={e => set('notes', e.target.value || undefined)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Section Editor ───────────────────────────────────────────────────────────

interface SectionEditorProps {
  section: SectionSchema;
  onChange(updated: SectionSchema): void;
  onClose(): void;
}

function SectionEditor({ section, onChange, onClose }: SectionEditorProps) {
  const [local, setLocal] = useState(section);

  const commit = () => {
    onChange(local);
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <span className="font-semibold text-sm">Edit Section</span>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" onClick={onClose}><X className="h-3.5 w-3.5" /></Button>
          <Button size="sm" className="gap-1" onClick={commit}>
            <Check className="h-3.5 w-3.5" />Apply
          </Button>
        </div>
      </div>
      <div className="px-4 py-4 space-y-4 text-sm overflow-y-auto flex-1">
        <div>
          <Label className="text-xs text-muted-foreground mb-1">Section ID (read-only)</Label>
          <Input value={local.sectionId} disabled className="font-mono text-xs" />
        </div>
        <div>
          <Label className="text-xs mb-1">Section Name</Label>
          <Input value={local.sectionName} onChange={e => setLocal(p => ({ ...p, sectionName: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs mb-1">Display Order</Label>
          <Input
            type="number"
            value={local.displayOrder}
            onChange={e => setLocal(p => ({ ...p, displayOrder: Number(e.target.value) }))}
          />
        </div>
        {local.showWhen && (
          <div className="border rounded-lg p-3 space-y-3 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visibility Condition</p>
            <div>
              <Label className="text-xs mb-1">Field ID</Label>
              <Input
                value={local.showWhen.fieldId}
                onChange={e => setLocal(p => ({ ...p, showWhen: { ...p.showWhen!, fieldId: e.target.value } }))}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs mb-1">Operator</Label>
              <Select
                value={local.showWhen.op}
                onValueChange={v => setLocal(p => ({ ...p, showWhen: { ...p.showWhen!, op: v as 'eq' | 'neq' | 'in' | 'notIn' } }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eq">eq (equals)</SelectItem>
                  <SelectItem value="neq">neq (not equals)</SelectItem>
                  <SelectItem value="in">in (any of)</SelectItem>
                  <SelectItem value="notIn">notIn (none of)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1">Value(s) (comma-separated for in/notIn)</Label>
              <Input
                value={Array.isArray(local.showWhen.value) ? local.showWhen.value.join(', ') : local.showWhen.value}
                onChange={e => {
                  const raw = e.target.value;
                  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
                  setLocal(p => ({ ...p, showWhen: { ...p.showWhen!, value: parts.length > 1 ? parts : raw } }));
                }}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => setLocal(p => { const { showWhen: _, ...rest } = p; return rest as SectionSchema; })}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Remove Condition
            </Button>
          </div>
        )}
        {!local.showWhen && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLocal(p => ({
              ...p,
              showWhen: { fieldId: '__formStage__', op: 'eq', value: '' },
            }))}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Visibility Condition
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Visual Schema Tree ───────────────────────────────────────────────────────

type Selection =
  | { type: 'field'; sectionId: string; fieldId: string }
  | { type: 'section'; sectionId: string }
  | null;

interface SchemaTreeProps {
  schema: FormSchema;
  selected: Selection;
  onSelect(sel: Selection): void;
  onSchemaChange(schema: FormSchema): void;
}

function SchemaTree({ schema, selected, onSelect, onSchemaChange }: SchemaTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(schema.sections.map(s => s.sectionId)));

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const updateSection = (sectionId: string, updated: SectionSchema) => {
    onSchemaChange({
      ...schema,
      sections: schema.sections.map(s => s.sectionId === sectionId ? updated : s),
    });
  };

  const deleteSection = (sectionId: string) => {
    onSchemaChange({ ...schema, sections: schema.sections.filter(s => s.sectionId !== sectionId) });
    if (selected?.sectionId === sectionId) onSelect(null);
  };

  const addSection = () => {
    const newSection: SectionSchema = {
      sectionId: `SEC_${Date.now()}`,
      sectionName: 'New Section',
      displayOrder: schema.sections.length + 1,
      fields: [],
    };
    onSchemaChange({ ...schema, sections: [...schema.sections, newSection] });
  };

  const updateField = (sectionId: string, fieldId: string, updated: FieldSchema) => {
    onSchemaChange({
      ...schema,
      sections: schema.sections.map(s =>
        s.sectionId === sectionId
          ? { ...s, fields: s.fields.map(f => f.fieldId === fieldId ? updated : f) }
          : s
      ),
    });
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    onSchemaChange({
      ...schema,
      sections: schema.sections.map(s =>
        s.sectionId === sectionId
          ? { ...s, fields: s.fields.filter(f => f.fieldId !== fieldId) }
          : s
      ),
    });
    if (selected?.type === 'field' && selected.fieldId === fieldId) onSelect(null);
  };

  const addField = (sectionId: string) => {
    const newField: FieldSchema = {
      fieldId: `FLD_${Date.now()}`,
      label: 'New Field',
      fieldType: 'text',
      required: false,
      displayOrder: 999,
    };
    onSchemaChange({
      ...schema,
      sections: schema.sections.map(s =>
        s.sectionId === sectionId ? { ...s, fields: [...s.fields, newField] } : s
      ),
    });
  };

  const sortedSections = [...schema.sections].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {sortedSections.map(section => {
          const isExpanded = expanded.has(section.sectionId);
          const isSectionSelected = selected?.sectionId === section.sectionId && selected.type === 'section';

          return (
            <div key={section.sectionId}>
              <div
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm group transition-colors ${
                  isSectionSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                <button onClick={() => toggle(section.sectionId)} className="p-0.5 opacity-60 hover:opacity-100">
                  {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                <span
                  className="flex-1 font-medium truncate"
                  onClick={() => onSelect({ type: 'section', sectionId: section.sectionId })}
                >
                  {section.sectionName}
                </span>
                {section.showWhen && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1 opacity-60">conditional</Badge>
                )}
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                  {section.fields.length}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-colors"
                  onClick={() => deleteSection(section.sectionId)}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {isExpanded && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {[...section.fields]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(field => {
                      const isFieldSelected = selected?.type === 'field' && selected.fieldId === field.fieldId;
                      return (
                        <div
                          key={field.fieldId}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer text-xs group transition-colors ${
                            isFieldSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                          }`}
                          onClick={() => onSelect({ type: 'field', sectionId: section.sectionId, fieldId: field.fieldId })}
                        >
                          <GripVertical className="h-3 w-3 opacity-30" />
                          <span className="flex-1 truncate">{field.label}</span>
                          <span className="opacity-50 font-mono">{field.fieldType}</span>
                          {field.spColumn && (
                            <span className="opacity-50 font-mono text-[10px]">→{field.spColumn}</span>
                          )}
                          {field.required && (
                            <span className="text-rose-500 opacity-70">*</span>
                          )}
                          <button
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-colors"
                            onClick={e => { e.stopPropagation(); deleteField(section.sectionId, field.fieldId); }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  <button
                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-primary transition-colors w-full"
                    onClick={() => addField(section.sectionId)}
                  >
                    <Plus className="h-3 w-3" />
                    Add field
                  </button>
                </div>
              )}
            </div>
          );

          void updateSection; void updateField;
        })}
      </div>

      <div className="border-t p-2">
        <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs" onClick={addSection}>
          <Plus className="h-3.5 w-3.5" />
          Add Section
        </Button>
      </div>
    </div>
  );
}

// ─── Main Editor Page ─────────────────────────────────────────────────────────

export default function FormSchemaEditorPage() {
  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const {
    getEffectiveSchema, saveSchema, resetSchema, isModified, registry,
    isSaving, applyOptimistic,
  } = useFormSchemaAdmin();

  const [tab, setTab] = useState<string>('visual');
  const [working, setWorking] = useState<FormSchema | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [selection, setSelection] = useState<Selection>(null);
  const [dirty, setDirty] = useState(false);

  const formCodeSafe = formCode ?? '';

  // Load / reset working copy
  useEffect(() => {
    const schema = getEffectiveSchema(formCodeSafe);
    if (schema) {
      setWorking(schema);
      setJsonText(JSON.stringify(schema, null, 2));
      setDirty(false);
      setSelection(null);
    }
  }, [formCodeSafe]);

  const applyWorkingToJson = useCallback((schema: FormSchema) => {
    setWorking(schema);
    setJsonText(JSON.stringify(schema, null, 2));
    setDirty(true);
  }, []);

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    setDirty(true);
    try {
      const parsed = JSON.parse(text) as FormSchema;
      setWorking(parsed);
      setJsonError('');
    } catch (e) {
      setJsonError((e as Error).message);
    }
  };

  const handleSave = async () => {
    if (!working || jsonError) {
      toast.error(jsonError || 'Invalid schema');
      return;
    }
    applyOptimistic(formCodeSafe, working);
    try {
      await saveSchema(formCodeSafe, working);
      setDirty(false);
      toast.success('Schema saved to SharePoint — all forms updated');
    } catch (e) {
      toast.error(`Save failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const handleReset = async () => {
    const original = registry[formCodeSafe];
    if (original) {
      setWorking(original);
      setJsonText(JSON.stringify(original, null, 2));
      setDirty(false);
      setJsonError('');
      setSelection(null);
    }
    try {
      await resetSchema(formCodeSafe);
      toast.success('Override deleted — forms now use the default schema');
    } catch (e) {
      toast.error(`Reset failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const handleExport = () => {
    navigator.clipboard.writeText(jsonText);
    toast.success('JSON copied to clipboard');
  };

  // Sync JSON → visual when switching tabs
  const handleTabChange = (value: string) => {
    if (value === 'visual' && jsonText && !jsonError) {
      try {
        const parsed = JSON.parse(jsonText) as FormSchema;
        setWorking(parsed);
      } catch { /* keep current */ }
    }
    if (value === 'json' && working) {
      setJsonText(JSON.stringify(working, null, 2));
    }
    setTab(value);
  };

  // Find the selected section/field for the properties pane
  const selectedSection = selection?.sectionId
    ? working?.sections.find(s => s.sectionId === selection.sectionId)
    : undefined;

  const selectedField = selection?.type === 'field' && selectedSection
    ? selectedSection.fields.find(f => f.fieldId === selection.fieldId)
    : undefined;

  const updateSelectedField = (updated: FieldSchema) => {
    if (!working || !selection || selection.type !== 'field') return;
    applyWorkingToJson({
      ...working,
      sections: working.sections.map(s =>
        s.sectionId === selection.sectionId
          ? { ...s, fields: s.fields.map(f => f.fieldId === updated.fieldId ? updated : f) }
          : s
      ),
    });
  };

  const updateSelectedSection = (updated: SectionSchema) => {
    if (!working) return;
    applyWorkingToJson({
      ...working,
      sections: working.sections.map(s => s.sectionId === updated.sectionId ? updated : s),
    });
  };

  if (!working) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <AlertCircle className="h-5 w-5 mr-2" />
        Schema not found: {formCodeSafe}
      </div>
    );
  }

  const modified = isModified(formCodeSafe);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link to="/admin/forms">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-mono text-xs shrink-0">{working.formCode}</Badge>
              <span className="font-semibold text-sm truncate">{working.title}</span>
              {modified && (
                <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-xs shrink-0">
                  overridden
                </Badge>
              )}
              {dirty && (
                <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 text-xs shrink-0">
                  unsaved changes
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {working.sections.length} sections · {countFields(working)} fields · v{working.version}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {modified && (
              <Button size="sm" variant="outline" onClick={handleReset} className="gap-1.5 text-amber-600 border-amber-300">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!!jsonError || !dirty || isSaving}
              className="gap-1.5 bg-primary"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? 'Saving...' : 'Save & Apply'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={tab} onValueChange={handleTabChange} className="flex flex-col flex-1">
          <div className="border-b bg-card/60 px-4">
            <TabsList className="h-9 bg-transparent p-0 gap-1">
              <TabsTrigger value="visual" className="gap-1.5 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                <List className="h-3.5 w-3.5" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="json" className="gap-1.5 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                <Code2 className="h-3.5 w-3.5" />
                JSON
                {jsonError && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-1.5 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Visual Tab */}
          <TabsContent value="visual" className="flex-1 overflow-hidden m-0">
            <div className="flex h-full" style={{ height: 'calc(100vh - 110px)' }}>
              {/* Left: Schema tree */}
              <div className="w-72 shrink-0 border-r bg-card/40 overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Structure
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {countFields(working)} fields
                  </span>
                </div>
                <SchemaTree
                  schema={working}
                  selected={selection}
                  onSelect={setSelection}
                  onSchemaChange={applyWorkingToJson}
                />
              </div>

              {/* Right: Properties pane */}
              <div className="flex-1 overflow-hidden bg-card/20">
                {selectedField && selection?.type === 'field' && selectedSection ? (
                  <FieldEditor
                    key={selectedField.fieldId}
                    field={selectedField}
                    onChange={updateSelectedField}
                    onClose={() => setSelection(null)}
                  />
                ) : selectedSection && selection?.type === 'section' ? (
                  <SectionEditor
                    key={selectedSection.sectionId}
                    section={selectedSection}
                    onChange={updateSelectedSection}
                    onClose={() => setSelection(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                    <Columns className="h-10 w-10 opacity-20" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Select a section or field</p>
                      <p className="text-xs mt-1 opacity-70">Click any item in the tree to edit its properties</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent value="json" className="flex-1 overflow-hidden m-0">
            <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 110px)' }}>
              {jsonError && (
                <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border-b border-destructive/20 text-destructive text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {jsonError}
                </div>
              )}
              {!jsonError && dirty && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-200 text-blue-700 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Valid JSON · click "Save &amp; Apply" to push to forms
                </div>
              )}
              <textarea
                value={jsonText}
                onChange={e => handleJsonChange(e.target.value)}
                className="flex-1 w-full resize-none bg-zinc-950 text-zinc-100 font-mono text-xs p-4 focus:outline-none leading-relaxed"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 overflow-auto m-0">
            <div className="min-h-full">
              {/* Temporarily apply working schema for preview without saving */}
              <PreviewWrapper schema={working} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Preview Wrapper ──────────────────────────────────────────────────────────
// Renders DynamicForm with the working schema bypassing the atom override,
// so the preview always reflects the current unsaved state.

function PreviewWrapper({ schema }: { schema: FormSchema }) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-700 text-xs">
        <EyeOff className="h-3.5 w-3.5" />
        Preview mode — form submission is disabled
      </div>
      <DynamicFormPreview schema={schema} />
    </div>
  );
}

// A read-only version of DynamicForm that uses a passed schema directly (not the atom).
import { isSectionVisible } from '@/hooks/use-dynamic-form';
import { SectionRenderer } from '@/components/dynamic-form/SectionRenderer';
import type { FormValues, FormErrors } from '@/types/form-schema';

function DynamicFormPreview({ schema }: { schema: FormSchema }) {
  const [values, setValues] = useState<FormValues>({});
  const [errors] = useState<FormErrors>({});

  const visibleSections = schema.sections
    .filter(s => isSectionVisible(s, values))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 pointer-events-none select-none opacity-90">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {schema.title}
      </div>
      {visibleSections.map(section => (
        <SectionRenderer
          key={section.sectionId}
          section={section}
          values={values}
          errors={errors}
          onFieldChange={(id, val) => setValues(p => ({ ...p, [id]: val }))}
        />
      ))}
      <div className="flex justify-end pb-6">
        <Button disabled className="bg-[#003366] text-white opacity-50 cursor-not-allowed">
          Submit {schema.title}
        </Button>
      </div>
    </div>
  );
}
