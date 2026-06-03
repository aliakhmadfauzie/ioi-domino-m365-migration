import { useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { SharePointLookupSelect, isSharePointLookupField } from '@/components/sharepoint-lookup-select';
import type { FieldSchema } from '@/types/form-schema';
import { setPendingFiles } from '@/lib/pending-attachments';
import { Upload, X, FileText } from 'lucide-react';

interface FieldRendererProps {
  field: FieldSchema;
  value: string | boolean | string[] | null;
  error?: string;
  onChange: (value: string | boolean | string[] | null) => void;
}

const ALLOWED_EXTENSIONS = ['pdf','doc','docx','xls','xlsx','png','jpg','jpeg','gif','txt','csv','zip'];
const MAX_SIZE_MB = 10;

function AttachmentField({
  field,
  onChange,
}: {
  field: FieldSchema;
  onChange: (value: string[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid: File[] = [];
    Array.from(incoming).forEach(f => {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) return;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return;
      valid.push(f);
    });
    setFiles(prev => {
      const merged = [...prev, ...valid];
      setPendingFiles(field.fieldId, merged);
      onChange(merged.map(f => f.name));
      return merged;
    });
  }, [field.fieldId, onChange]);

  const removeFile = (index: number) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== index);
      setPendingFiles(field.fieldId, next);
      onChange(next.map(f => f.name));
      return next;
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <div
        onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded border-2 border-dashed p-4 cursor-pointer transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={ALLOWED_EXTENSIONS.map(e => `.${e}`).join(',')}
          onChange={e => addFiles(e.target.files)}
        />
        <Upload className="h-5 w-5 text-muted-foreground mb-1" />
        <p className="text-sm text-muted-foreground">
          Click or drag files here · max {MAX_SIZE_MB}MB
        </p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">
          {ALLOWED_EXTENSIONS.join(', ')}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 rounded bg-muted/50 px-2 py-1 text-sm">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {(f.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeFile(i); }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        Files will be attached to the record after submission.
      </p>
    </div>
  );
}

function PeopleField({ field, value, error, onChange }: FieldRendererProps) {
  const [mode, setMode] = useState<'lookup' | 'manual'>('lookup');
  const strVal = typeof value === 'string' ? value : '';

  if (mode === 'manual') {
    return (
      <div className="space-y-1">
        <Input
          value={strVal}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || 'Enter name or email'}
          className={error ? 'border-destructive' : ''}
        />
        <button
          type="button"
          className="text-xs text-primary hover:underline"
          onClick={() => { setMode('lookup'); onChange(null); }}
        >
          ← Search employee directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <EmployeePicker
        value={strVal}
        onChange={email => onChange(email || null)}
        placeholder={field.placeholder || 'Search by name or email...'}
        error={!!error}
        showEmail
        showTitle
      />
      <button
        type="button"
        className="text-xs text-muted-foreground hover:text-primary hover:underline"
        onClick={() => setMode('manual')}
      >
        Type manually instead
      </button>
    </div>
  );
}

export function FieldRenderer({ field, value, error, onChange }: FieldRendererProps) {
  const { fieldType, readOnly, options, placeholder, autoValue } = field;
  const strVal = typeof value === 'string' ? value : '';
  const boolVal = typeof value === 'boolean' ? value : false;
  const errClass = error ? 'border-destructive' : '';

  if (readOnly) {
    let displayVal = strVal;
    if (fieldType === 'datetime' && strVal) {
      try { displayVal = new Date(strVal).toLocaleString(); } catch { /* keep raw */ }
    }
    return (
      <div className="space-y-1">
        <Input
          value={displayVal}
          readOnly
          className={`bg-muted/50 text-muted-foreground ${autoValue === 'generateRecordNo' ? 'font-mono' : ''}`}
        />
        {autoValue && (
          <p className="text-xs text-muted-foreground">
            {autoValue === 'generateRecordNo' ? 'Auto-generated' : 'Auto-populated'}
          </p>
        )}
      </div>
    );
  }

  switch (fieldType) {
    case 'people':
      return <PeopleField field={field} value={value} error={error} onChange={onChange} />;

    case 'text':
      {
        const lookupKind = isSharePointLookupField(field);
        if (lookupKind) {
          return (
            <SharePointLookupSelect
              kind={lookupKind}
              value={strVal}
              onChange={(val) => onChange(val)}
              placeholder={placeholder || `Select ${field.label}`}
              className={errClass}
              fallbackOptions={options}
            />
          );
        }
      }
      return (
        <Input
          value={strVal}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={errClass}
        />
      );

    case 'multiline':
      return (
        <Textarea
          value={strVal}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={errClass}
        />
      );

    case 'choice':
      {
        const lookupKind = isSharePointLookupField(field);
        if (lookupKind) {
          return (
            <SharePointLookupSelect
              kind={lookupKind}
              value={strVal}
              onChange={(val) => onChange(val)}
              placeholder={placeholder || `Select ${field.label}`}
              className={errClass}
              fallbackOptions={options}
            />
          );
        }
      }
      return (
        <Select value={strVal} onValueChange={val => onChange(val)}>
          <SelectTrigger className={errClass}>
            <SelectValue placeholder={placeholder || `Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {(options || []).map(opt => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'date':
      return (
        <Input
          type="date"
          value={strVal}
          onChange={e => onChange(e.target.value)}
          className={errClass}
        />
      );

    case 'datetime':
      return (
        <Input
          type="datetime-local"
          value={strVal}
          onChange={e => onChange(e.target.value)}
          className={errClass}
        />
      );

    case 'time':
      return (
        <Input
          type="time"
          value={strVal}
          onChange={e => onChange(e.target.value)}
          className={errClass}
        />
      );

    case 'boolean':
      return (
        <div className="flex items-center gap-2 pt-1">
          <Switch
            checked={boolVal}
            onCheckedChange={checked => onChange(checked)}
          />
          <span className="text-sm text-muted-foreground">{boolVal ? 'Yes' : 'No'}</span>
        </div>
      );

    case 'attachment':
      return <AttachmentField field={field} onChange={onChange} />;

    default:
      return (
        <Input
          value={strVal}
          onChange={e => onChange(e.target.value)}
          className={errClass}
        />
      );
  }
}
