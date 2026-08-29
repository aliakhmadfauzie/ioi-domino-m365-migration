import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSharePointCompanies, useSharePointDepartments } from '@/hooks/use-sharepoint-config';

export type SharePointLookupKind = 'company' | 'department';

interface LookupSelectProps {
  kind: SharePointLookupKind;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fallbackOptions?: ReadonlyArray<string | { value: string; label: string }>;
}

function normalizeOptions(options: LookupSelectProps['fallbackOptions'] = []) {
  return options
    .map((option) => {
      if (typeof option === 'string') return { value: option, label: option };
      return option;
    })
    .filter((option) => option.value);
}

export function isSharePointLookupField(field: { id?: string; fieldId?: string; label?: string }): SharePointLookupKind | null {
  const id = String(field.id ?? field.fieldId ?? '').toLowerCase();
  const label = String(field.label ?? '').toLowerCase();
  const compactId = id.replace(/[^a-z]/g, '');
  const compactLabel = label.replace(/[^a-z]/g, '');
  const personExclusions = ['head', 'hod', 'approver', 'approved', 'pic', 'owner'];

  if (
    compactLabel === 'company' ||
    compactLabel === 'requestorcompany' ||
    compactLabel === 'requestercompany' ||
    compactId === 'company' ||
    compactId === 'coname' ||
    compactId === 'requestorcompany' ||
    compactId === 'requestercompany'
  ) {
    return 'company';
  }

  const looksLikeDepartment =
    compactLabel === 'department' ||
    compactLabel === 'dept' ||
    compactLabel === 'requestordepartment' ||
    compactLabel === 'requesterdepartment' ||
    compactLabel === 'userdepartment' ||
    compactId === 'department' ||
    compactId === 'dept' ||
    compactId === 'lstdept' ||
    compactId === 'cbodep' ||
    compactId === 'requestordept' ||
    compactId === 'requesterdepartment' ||
    compactId === 'userdepartment';

  if (looksLikeDepartment && !personExclusions.some((word) => compactLabel.includes(word) || compactId.includes(word))) {
    return 'department';
  }

  return null;
}

export function SharePointLookupSelect({
  kind,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  fallbackOptions,
}: LookupSelectProps) {
  const companies = useSharePointCompanies();
  const departments = useSharePointDepartments();
  const source = kind === 'company' ? companies : departments;
  const lookupOptions = kind === 'company'
    ? companies.companies.map((company) => ({ value: company.name, label: company.name }))
    : departments.departments.map((department) => ({ value: department.name, label: department.name }));
  const options = lookupOptions.length > 0 ? lookupOptions : normalizeOptions(fallbackOptions);
  const isLoading = source.isLoading && lookupOptions.length === 0;
  const emptyLabel = kind === 'company' ? 'No companies found' : 'No departments found';
  const loadingLabel = kind === 'company' ? 'Loading companies...' : 'Loading departments...';

  return (
    <Select value={value || ''} onValueChange={onChange} disabled={disabled || isLoading}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder || `Select ${kind}`} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="__loading" disabled>{loadingLabel}</SelectItem>
        ) : options.length > 0 ? (
          options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="__empty" disabled>{emptyLabel}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
