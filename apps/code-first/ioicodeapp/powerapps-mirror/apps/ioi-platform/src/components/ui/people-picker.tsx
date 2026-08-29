import { useState, useCallback } from 'react';
import { X, Search, Loader2, User as UserIcon, Users, Keyboard, Building2, Mail, Briefcase, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmployeeLookup, type EmployeeRecord } from '@/hooks/use-employee-lookup';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/** Represents a person - either from directory or manually entered */
export interface PersonValue {
  /** Unique identifier (email or generated for manual) */
  id: string;
  /** Display name */
  displayName: string;
  /** Email address */
  email?: string;
  /** Department (optional) */
  department?: string;
  /** Job title (optional) */
  jobTitle?: string;
  /** Source of the entry */
  source: 'directory' | 'manual';
}

export interface PeoplePickerProps {
  /** Selected person(s) - accepts PersonValue or arrays of either */
  value?: PersonValue | PersonValue[] | null;
  /** Callback when selection changes - returns PersonValue format */
  onChange?: (value: PersonValue | PersonValue[] | null) => void;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className for the trigger */
  className?: string;
  /** Label for the picker */
  label?: string;
  /** Show helper text */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Default input mode */
  defaultMode?: 'directory' | 'manual';
  /** Allow switching between modes */
  allowModeSwitch?: boolean;
  /** Required fields for manual entry */
  manualRequireEmail?: boolean;
}

// Check if a value is a PersonValue type
function isPersonValue(val: unknown): val is PersonValue {
  return val !== null && typeof val === 'object' && 'id' in val && 'displayName' in val && 'source' in val;
}

// Normalize value to PersonValue array
function normalizeToPersonValues(value: PersonValue | PersonValue[] | null | undefined): PersonValue[] {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items.filter(isPersonValue);
}

// Convert EmployeeRecord to PersonValue
export function employeeToPersonValue(emp: EmployeeRecord): PersonValue {
  return {
    id: emp.email,
    displayName: emp.fullName,
    email: emp.email,
    department: emp.department,
    jobTitle: emp.designation,
    source: 'directory',
  };
}

// Create a manual PersonValue
export function createManualPerson(name: string, email?: string): PersonValue {
  return {
    id: `manual-${crypto.randomUUID()}`,
    displayName: name.trim(),
    email: email?.trim(),
    source: 'manual',
  };
}

function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function PersonItem({
  person,
  onSelect,
  isSelected,
}: {
  person: PersonValue;
  onSelect: (person: PersonValue) => void;
  isSelected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(person)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-md',
        isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50'
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={cn(
          'text-xs font-medium',
          isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {getInitials(person.displayName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">{person.displayName}</p>
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
            person.source === 'manual' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
          )}>
            {person.source === 'manual' ? 'Manual' : 'M365'}
          </span>
        </div>
        {person.email && (
          <p className="text-xs text-muted-foreground truncate">{person.email}</p>
        )}
        {person.department && (
          <p className="text-xs text-muted-foreground/70 truncate">{person.department}</p>
        )}
      </div>
    </button>
  );
}

function DirectoryEmployeeItem({
  employee,
  onSelect,
  isSelected,
}: {
  employee: EmployeeRecord;
  onSelect: (employee: EmployeeRecord) => void;
  isSelected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(employee)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-md',
        isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50'
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={cn(
          'text-xs font-medium',
          isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {getInitials(employee.fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">{employee.fullName}</p>
          <span className="text-[10px] px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded-full font-medium">Directory</span>
        </div>
        {employee.email && (
          <div className="flex items-center gap-1 mt-0.5">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground truncate">{employee.email}</p>
          </div>
        )}
        {employee.designation && (
          <div className="flex items-center gap-1 mt-0.5">
            <Briefcase className="h-3 w-3 text-muted-foreground/70" />
            <p className="text-xs text-muted-foreground/70 truncate">{employee.designation}</p>
          </div>
        )}
        {employee.department && (
          <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{employee.department}</p>
        )}
      </div>
    </button>
  );
}

export function PeoplePicker({
  value,
  onChange,
  multiple = false,
  placeholder = 'Search for a person...',
  disabled = false,
  className,
  label,
  helperText,
  error,
  errorMessage,
  defaultMode = 'directory',
  allowModeSwitch = true,
  manualRequireEmail = false,
}: PeoplePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'directory' | 'manual'>(defaultMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedManualName = useDebounce(manualName, 300);

  // Directory search for manual name suggestions — only active when popover is open and mode is manual
  const { employees: manualSuggestions, isLoading: manualSearching } = useEmployeeLookup(
    debouncedManualName,
    open && mode === 'manual' && debouncedManualName.trim().length >= 2
  );

  const { employees, isLoading } = useEmployeeLookup(debouncedSearch, open && mode === 'directory');

  const selectedPersons: PersonValue[] = normalizeToPersonValues(value);

  const isPersonSelected = useCallback(
    (person: PersonValue) =>
      selectedPersons.some(
        (selected: PersonValue) =>
          selected.id === person.id || (selected.email && selected.email === person.email)
      ),
    [selectedPersons]
  );

  const isEmployeeSelected = useCallback(
    (emp: EmployeeRecord) =>
      selectedPersons.some(
        (selected: PersonValue) =>
          selected.id === emp.email || selected.email === emp.email
      ),
    [selectedPersons]
  );

  const handleSelectPerson = useCallback(
    (person: PersonValue) => {
      if (multiple) {
        const isSelected = isPersonSelected(person);
        const newValue = isSelected
          ? selectedPersons.filter((selected: PersonValue) => selected.id !== person.id)
          : [...selectedPersons, person];
        
        const result = newValue.length > 0 ? newValue : null;
        onChange?.(result);
      } else {
        onChange?.(person);
        setOpen(false);
      }
      setSearchTerm('');
    },
    [multiple, isPersonSelected, selectedPersons, onChange]
  );

  const handleSelectDirectoryEmployee = useCallback(
    (emp: EmployeeRecord) => {
      const person = employeeToPersonValue(emp);
      handleSelectPerson(person);
    },
    [handleSelectPerson]
  );

  const handleAddManual = useCallback(() => {
    const trimmedName = manualName.trim();
    const trimmedEmail = manualEmail.trim();
    
    if (!trimmedName) return;
    if (manualRequireEmail && !trimmedEmail) return;
    
    const person = createManualPerson(trimmedName, trimmedEmail || undefined);
    handleSelectPerson(person);
    setManualName('');
    setManualEmail('');
  }, [manualName, manualEmail, manualRequireEmail, handleSelectPerson]);

  const handleRemove = useCallback(
    (person: PersonValue) => {
      if (multiple) {
        const newValue = selectedPersons.filter((selected: PersonValue) => selected.id !== person.id);
        const result = newValue.length > 0 ? newValue : null;
        onChange?.(result);
      } else {
        onChange?.(null);
      }
    },
    [multiple, selectedPersons, onChange]
  );

  const hasSelection = selectedPersons.length > 0;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setOpen(true)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!disabled) setOpen(true);
              }
            }}
            className={cn(
              'w-full min-h-[38px] px-3 py-1.5 text-left border rounded-md',
              'flex flex-wrap items-center gap-1.5',
              'bg-white transition-colors cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
              disabled && 'opacity-50 cursor-not-allowed bg-muted/50',
              error && 'border-destructive focus:ring-destructive',
              !error && !disabled && 'border-border hover:border-muted-foreground/50',
              className
            )}
          >
            {hasSelection ? (
              <>
                {selectedPersons.map((person: PersonValue) => (
                  <span
                    key={person.id}
                    className={cn(
                      'inline-flex items-center gap-1 pl-1 pr-1.5 py-1 h-auto rounded-md text-xs',
                      person.source === 'directory' 
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    <span className={cn(
                      'flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-medium',
                      person.source === 'directory' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {getInitials(person.displayName)}
                    </span>
                    <span className="font-medium truncate max-w-[120px]">
                      {person.displayName}
                    </span>
                    {!disabled && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleRemove(person);
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            e.preventDefault();
                            handleRemove(person);
                          }
                        }}
                        className={cn(
                          'ml-0.5 rounded-full p-0.5 transition-colors cursor-pointer',
                          person.source === 'directory' ? 'hover:bg-sky-200' : 'hover:bg-amber-200'
                        )}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </span>
                ))}
                <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
              </>
            ) : (
              <>
                <span className="text-muted-foreground text-sm flex items-center gap-2 flex-1">
                  {multiple ? <Users className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                  {placeholder}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-0" align="start" sideOffset={4}>
          {allowModeSwitch ? (
            <Tabs value={mode} onValueChange={(v: string) => setMode(v as 'directory' | 'manual')} className="w-full">
              <div className="border-b px-2 pt-2">
                <TabsList className="w-full h-9 bg-muted/50">
                  <TabsTrigger value="manual" className="flex-1 gap-1.5 text-xs">
                    <Keyboard className="h-3.5 w-3.5" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="directory" className="flex-1 gap-1.5 text-xs">
                    <Building2 className="h-3.5 w-3.5" />
                    Employee Directory
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="directory" className="mt-0">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-8 h-9 bg-muted/50 border-border"
                      autoFocus
                    />
                  </div>
                </div>
                <ScrollArea className="h-[200px]">
                  <div className="p-1">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Searching employees...</span>
                      </div>
                    ) : employees.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <UserIcon className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">
                          {debouncedSearch && debouncedSearch.trim().length >= 2
                            ? 'No employees found'
                            : debouncedSearch && debouncedSearch.trim().length === 1
                              ? 'Type at least 2 characters'
                              : 'Start typing to search'}
                        </p>
                        {debouncedSearch && debouncedSearch.trim().length >= 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => {
                              setManualName(debouncedSearch);
                              setMode('manual');
                            }}
                          >
                            <Keyboard className="h-3.5 w-3.5 mr-1.5" />
                            Add manually
                          </Button>
                        )}
                      </div>
                    ) : (
                      employees.map((emp: EmployeeRecord) => (
                        <DirectoryEmployeeItem
                          key={String(emp.id)}
                          employee={emp}
                          onSelect={handleSelectDirectoryEmployee}
                          isSelected={isEmployeeSelected(emp)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="manual" className="mt-0">
                <div className="p-3 space-y-3">
                  <div className="relative">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                    <Input
                      value={manualName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualName(e.target.value)}
                      placeholder="Enter full name"
                      className="h-9"
                      autoFocus
                    />
                    {/* Directory suggestions while typing */}
                    {debouncedManualName.trim().length >= 2 && manualSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-10 rounded-md border bg-popover shadow-md">
                        <ScrollArea className="max-h-[160px]">
                          <div className="p-1">
                            <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              Directory suggestions
                            </p>
                            {manualSuggestions.slice(0, 5).map((emp: EmployeeRecord) => (
                              <button
                                key={String(emp.id)}
                                type="button"
                                onClick={() => {
                                  setManualName(emp.fullName);
                                  setManualEmail(emp.email || '');
                                }}
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                    {(emp.fullName.match(/\b\w/g) || []).slice(0, 2).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium">{emp.fullName}</p>
                                  {emp.email && <p className="truncate text-xs text-muted-foreground">{emp.email}</p>}
                                  {emp.department && <p className="truncate text-[10px] text-muted-foreground/70">{emp.department}</p>}
                                </div>
                                <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Pick</span>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    {manualSearching && debouncedManualName.trim().length >= 2 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-10 rounded-md border bg-popover p-3 text-center text-xs text-muted-foreground shadow-md">
                        <Loader2 className="h-3.5 w-3.5 inline animate-spin mr-1" /> Searching directory...
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Email {manualRequireEmail ? '*' : '(optional)'}
                    </label>
                    <Input
                      type="email"
                      value={manualEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="h-9"
                    />
                  </div>
                  <Button
                    onClick={handleAddManual}
                    disabled={!manualName.trim() || (manualRequireEmail && !manualEmail.trim())}
                    className="w-full"
                    size="sm"
                  >
                    <UserIcon className="h-4 w-4 mr-1.5" />
                    Add Person
                  </Button>
                </div>
                
                {selectedPersons.length > 0 && (
                  <div className="border-t">
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Selected ({selectedPersons.length})</p>
                      <ScrollArea className="max-h-[120px]">
                        <div className="space-y-1">
                          {selectedPersons.map((person: PersonValue) => (
                            <PersonItem
                              key={person.id}
                              person={person}
                              onSelect={() => handleRemove(person)}
                              isSelected={true}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            mode === 'directory' ? (
              <>
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-8 h-9 bg-muted/50 border-border"
                      autoFocus
                    />
                  </div>
                </div>
                <ScrollArea className="h-[240px]">
                  <div className="p-1">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Searching employees...</span>
                      </div>
                    ) : employees.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <UserIcon className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">
                          {debouncedSearch && debouncedSearch.trim().length >= 2 ? 'No employees found' : 'Start typing to search'}
                        </p>
                      </div>
                    ) : (
                      employees.map((emp: EmployeeRecord) => (
                        <DirectoryEmployeeItem
                          key={String(emp.id)}
                          employee={emp}
                          onSelect={handleSelectDirectoryEmployee}
                          isSelected={isEmployeeSelected(emp)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="p-3 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                  <Input
                    value={manualName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-9"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Email {manualRequireEmail ? '*' : '(optional)'}
                  </label>
                  <Input
                    type="email"
                    value={manualEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="h-9"
                  />
                </div>
                <Button
                  onClick={handleAddManual}
                  disabled={!manualName.trim() || (manualRequireEmail && !manualEmail.trim())}
                  className="w-full"
                  size="sm"
                >
                  <UserIcon className="h-4 w-4 mr-1.5" />
                  Add Person
                </Button>
              </div>
            )
          )}
        </PopoverContent>
      </Popover>
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
      {error && errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
    </div>
  );
}

export type { EmployeeRecord } from '@/hooks/use-employee-lookup';
export default PeoplePicker;