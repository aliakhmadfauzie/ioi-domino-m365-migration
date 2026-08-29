import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, User as UserIcon, Loader2, X, Check, ChevronDown, Building2, Mail, Briefcase, Keyboard, Cloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEmployeeLookup, type EmployeeRecord } from '@/hooks/use-employee-lookup';
import { cn } from '@/lib/utils';

/** Represents a selected employee from the employee directory */
export interface SelectedEmployee {
  id: string | number;
  fullName: string;
  email: string;
  title?: string;
  department?: string;
  designation?: string;
}

/** Represents a manually entered person */
export interface ManualPerson {
  id: string;
  fullName: string;
  email?: string;
  source: 'manual';
}

function isManualPerson(person: SelectedEmployee | ManualPerson): person is ManualPerson {
  return 'source' in person && person.source === 'manual';
}

interface EmployeePickerProps {
  /** Selected employee email (primary identifier) */
  value?: string;
  /** Callback when selection changes - receives email as primary value */
  onChange: (email: string, employee: SelectedEmployee | ManualPerson | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** Show email in the display */
  showEmail?: boolean;
  /** Show title/position in dropdown */
  showTitle?: boolean;
  /** Filter by department */
  departmentFilter?: string;
  /** Required field indicator */
  required?: boolean;
  /** Error state */
  error?: boolean;
  /** Helper text */
  helperText?: string;
  /** Default input mode */
  defaultMode?: 'directory' | 'manual';
  /** Allow switching between modes */
  allowModeSwitch?: boolean;
}

/**
 * Employee Picker component that uses the employee directory for lookups.
 *
 * The employee directory structure:
 * - title: Position/title (e.g., "Senior Manager")
 * - configKey: Full name (e.g., "Ahmad bin Abdullah")
 * - configValue: Email (e.g., "ahmad@ioi.com.my")
 *
 * Use this component for:
 * - HoD (Head of Department) selection
 * - Manager selection
 * - Any person/email field that should reference internal employees
 */
export function EmployeePicker({
  value,
  onChange,
  placeholder = 'Search employee...',
  label,
  disabled = false,
  className,
  showEmail = true,
  showTitle = true,
  departmentFilter,
  required = false,
  error = false,
  helperText,
  defaultMode = 'directory',
  allowModeSwitch = true,
}: EmployeePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'directory' | 'manual'>(defaultMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPerson, setManualPerson] = useState<ManualPerson | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch employees from directory
  const { employees, allEmployees, isLoading } = useEmployeeLookup(debouncedSearch, isOpen && mode === 'directory');

  // Filter by department if specified
  const filteredEmployees = useMemo(() => {
    let result = employees;

    if (departmentFilter && result.length > 0) {
      result = result.filter((emp: EmployeeRecord) =>
        emp.department?.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    return result;
  }, [employees, departmentFilter]);

  // Find selected employee by email
  const selectedEmployee = useMemo<SelectedEmployee | null>(() => {
    if (!value || !allEmployees.length) return null;

    const valueLower = value.toLowerCase();

    // Try exact email match first
    let found = allEmployees.find((emp: EmployeeRecord) => emp.email.toLowerCase() === valueLower);

    // If not found, handle formats like "Full Name <email@domain>" by extracting email
    if (!found && value.includes('<') && value.includes('>')) {
      const m = value.match(/<(.*)>/);
      if (m && m[1]) {
        const extracted = m[1].trim().toLowerCase();
        found = allEmployees.find((emp: EmployeeRecord) => emp.email.toLowerCase() === extracted);
      }
    }

    // If still not found, try matching by full name (case-insensitive)
    if (!found) {
      found = allEmployees.find((emp: EmployeeRecord) => emp.fullName && emp.fullName.toLowerCase() === valueLower);
    }

    if (found) {
      return {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        title: found.designation,
        department: found.department,
        designation: found.designation,
      };
    }

    return null;
  }, [value, allEmployees]);

  // Determine display info - prefer directory match, fall back to manual
  const displayItem = selectedEmployee || manualPerson;

  const handleSelectEmployee = (emp: EmployeeRecord) => {
    setManualPerson(null);
    const selected: SelectedEmployee = {
      id: emp.id,
      fullName: emp.fullName,
      email: emp.email,
      title: emp.designation,
      department: emp.department,
      designation: emp.designation,
    };
    onChange(emp.email, selected);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddManual = () => {
    const trimmedName = manualName.trim();
    const trimmedEmail = manualEmail.trim();

    if (!trimmedName) return;

    const person: ManualPerson = {
      id: `manual-${crypto.randomUUID()}`,
      fullName: trimmedName,
      email: trimmedEmail || undefined,
      source: 'manual',
    };
    setManualPerson(person);
    onChange(trimmedEmail || trimmedName, person);
    setIsOpen(false);
    setManualName('');
    setManualEmail('');
  };

  const handleClear = () => {
    setManualPerson(null);
    onChange('', null);
    setSearchTerm('');
  };

  // Get initials for avatar
  const getInitials = (name: string): string => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="text-label-md text-[#1C1C1C] block mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled}
            className={cn(
              "w-full h-11 justify-between text-left font-normal border-[#D0D0D0] bg-white",
              "hover:bg-[#F5F5F5] focus:border-[#003366] focus:ring-[#003366]",
              !value && "text-[#5C5C5C]",
              error && "border-destructive focus:border-destructive focus:ring-destructive"
            )}
          >
            {displayItem ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0",
                  isManualPerson(displayItem) ? 'bg-amber-600' : 'bg-[#003366]'
                )}>
                  {getInitials(displayItem.fullName)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate text-[#1C1C1C]">
                      {displayItem.fullName}
                    </span>
                    {isManualPerson(displayItem) && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                        Manual
                      </span>
                    )}
                  </div>
                  {showEmail && (displayItem as SelectedEmployee).email && (
                    <span className="text-xs text-[#5C5C5C] truncate">
                      {(displayItem as SelectedEmployee).email || (displayItem as ManualPerson).email}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#5C5C5C]">
                <UserIcon className="h-4 w-4" />
                <span>{placeholder}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-[#E8E8E8] cursor-pointer"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      handleClear();
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-[#5C5C5C]" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[400px] p-0"
          align="start"
          onOpenAutoFocus={(e: Event) => {
            e.preventDefault();
            if (mode === 'directory') inputRef.current?.focus();
          }}
        >
          {allowModeSwitch ? (
            <Tabs value={mode} onValueChange={(v: string) => setMode(v as 'directory' | 'manual')} className="w-full">
              <div className="border-b px-2 pt-2">
                <TabsList className="w-full h-9 bg-muted/50">
                  <TabsTrigger value="directory" className="flex-1 gap-1.5 text-xs">
                    <Building2 className="h-3.5 w-3.5" />
                    Employee Directory
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex-1 gap-1.5 text-xs">
                    <Keyboard className="h-3.5 w-3.5" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="directory" className="mt-0">
                <div className="p-3 border-b border-[#EEEEEE]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5C5C]" />
                    <Input
                      ref={inputRef}
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-9 h-10 border-[#D0D0D0] focus:border-[#003366] focus:ring-[#003366]"
                    />
                  </div>
                </div>

                <div className="max-h-[280px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#003366]" />
                      <span className="ml-2 text-sm text-[#5C5C5C]">Searching employees...</span>
                    </div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="p-6 text-center">
                      <UserIcon className="h-10 w-10 text-[#D0D0D0] mx-auto mb-3" />
                      <p className="text-sm font-medium text-[#5C5C5C]">
                        {searchTerm && searchTerm.length >= 2
                          ? 'No employees found'
                          : searchTerm && searchTerm.length === 1
                            ? 'Type at least 2 characters'
                            : 'Start typing to search'}
                      </p>
                      {searchTerm && searchTerm.length >= 2 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs text-[#7C7C7C]">Try searching by name or email</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setManualName(searchTerm);
                              setMode('manual');
                            }}
                          >
                            <Keyboard className="h-3.5 w-3.5 mr-1.5" />
                            Add manually
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-1">
                      {filteredEmployees.map((emp: EmployeeRecord) => (
                        <button
                          key={String(emp.id)}
                          onClick={() => handleSelectEmployee(emp)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#F5F5F5] transition-colors",
                            value === emp.email && "bg-[#E8F4FF]"
                          )}
                        >
                          <div className="h-9 w-9 rounded-full bg-[#003366] flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5">
                            {getInitials(emp.fullName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#1C1C1C] truncate">
                                {emp.fullName}
                              </span>
                              {value === emp.email && (
                                <Check className="h-4 w-4 text-[#003366] flex-shrink-0" />
                              )}
                            </div>

                            {emp.email && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3 text-[#7C7C7C]" />
                                <span className="text-xs text-[#5C5C5C] truncate">
                                  {emp.email}
                                </span>
                              </div>
                            )}

                            {showTitle && emp.designation && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Briefcase className="h-3 w-3 text-[#7C7C7C]" />
                                <span className="text-xs text-[#7C7C7C] truncate">
                                  {emp.designation}
                                </span>
                              </div>
                            )}

                            {emp.department && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Building2 className="h-3 w-3 text-[#7C7C7C]" />
                                <span className="text-xs text-[#7C7C7C] truncate">
                                  {emp.department}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredEmployees.length > 0 && (
                  <div className="p-2 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                    <p className="text-xs text-[#5C5C5C] text-center">
                      Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manual" className="mt-0">
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name *</label>
                    <Input
                      value={manualName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualName(e.target.value)}
                      placeholder="Enter full name"
                      className="h-10"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      Email (optional)
                    </label>
                    <Input
                      type="email"
                      value={manualEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="h-10"
                    />
                  </div>
                  <Button
                    onClick={handleAddManual}
                    disabled={!manualName.trim()}
                    className="w-full h-10 bg-[#003366] hover:bg-[#002244]"
                  >
                    <UserIcon className="h-4 w-4 mr-1.5" />
                    Add Person
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Use this option when the person is not in the employee directory
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          ) : mode === 'directory' ? (
            <>
              <div className="p-3 border-b border-[#EEEEEE]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5C5C]" />
                  <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-9 h-10 border-[#D0D0D0] focus:border-[#003366] focus:ring-[#003366]"
                  />
                </div>
              </div>

              <div className="max-h-[280px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#003366]" />
                    <span className="ml-2 text-sm text-[#5C5C5C]">Searching employees...</span>
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="p-6 text-center">
                    <UserIcon className="h-10 w-10 text-[#D0D0D0] mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#5C5C5C]">
                      {searchTerm && searchTerm.length >= 2
                        ? 'No employees found'
                        : searchTerm && searchTerm.length === 1
                          ? 'Type at least 2 characters'
                          : 'Start typing to search'}
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredEmployees.map((emp: EmployeeRecord) => (
                      <button
                        key={String(emp.id)}
                        onClick={() => handleSelectEmployee(emp)}
                        className={cn(
                          "w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#F5F5F5] transition-colors",
                          value === emp.email && "bg-[#E8F4FF]"
                        )}
                      >
                        <div className="h-9 w-9 rounded-full bg-[#003366] flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5">
                          {getInitials(emp.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#1C1C1C] truncate">
                              {emp.fullName}
                            </span>
                            {value === emp.email && (
                              <Check className="h-4 w-4 text-[#003366] flex-shrink-0" />
                            )}
                          </div>
                          {emp.email && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Mail className="h-3 w-3 text-[#7C7C7C]" />
                              <span className="text-xs text-[#5C5C5C] truncate">{emp.email}</span>
                            </div>
                          )}
                          {showTitle && emp.designation && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Briefcase className="h-3 w-3 text-[#7C7C7C]" />
                              <span className="text-xs text-[#7C7C7C] truncate">{emp.designation}</span>
                            </div>
                          )}
                          {emp.department && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Building2 className="h-3 w-3 text-[#7C7C7C]" />
                              <span className="text-xs text-[#7C7C7C] truncate">{emp.department}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {filteredEmployees.length > 0 && (
                <div className="p-2 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                  <p className="text-xs text-[#5C5C5C] text-center">
                    Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name *</label>
                <Input
                  value={manualName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualName(e.target.value)}
                  placeholder="Enter full name"
                  className="h-10"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Email (optional)
                </label>
                <Input
                  type="email"
                  value={manualEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="h-10"
                />
              </div>
              <Button
                onClick={handleAddManual}
                disabled={!manualName.trim()}
                className="w-full h-10 bg-[#003366] hover:bg-[#002244]"
              >
                <UserIcon className="h-4 w-4 mr-1.5" />
                Add Person
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {helperText && (
        <p className={cn(
          "text-xs mt-1.5",
          error ? "text-destructive" : "text-[#5C5C5C]"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Multi-select employee picker for selecting multiple employees
 */
interface MultiEmployeePickerProps {
  value?: string[];
  onChange: (emails: string[], employees: SelectedEmployee[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  maxSelections?: number;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export function MultiEmployeePicker({
  value = [],
  onChange,
  placeholder = 'Select employees...',
  label,
  disabled = false,
  className,
  maxSelections,
  required = false,
  error = false,
  helperText,
}: MultiEmployeePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { employees, allEmployees, isLoading } = useEmployeeLookup(debouncedSearch, isOpen);

  // Get selected employees
  const selectedEmployees = useMemo<SelectedEmployee[]>(() => {
    if (!value.length || !allEmployees.length) return [];

    const valueLower = value.map((v: string) => v.toLowerCase());
    return allEmployees
      .filter((emp: EmployeeRecord) => valueLower.includes(emp.email.toLowerCase()))
      .map((emp: EmployeeRecord) => ({
        id: emp.id,
        fullName: emp.fullName,
        email: emp.email,
        title: emp.designation,
        department: emp.department,
        designation: emp.designation,
      }));
  }, [value, allEmployees]);

  const handleToggleEmployee = (emp: EmployeeRecord) => {
    const emailLower = emp.email.toLowerCase();
    const isSelected = value.some((v: string) => v.toLowerCase() === emailLower);

    if (isSelected) {
      // Remove
      const newValue = value.filter((v: string) => v.toLowerCase() !== emailLower);
      const newEmployees = selectedEmployees.filter((e: SelectedEmployee) =>
        e.email.toLowerCase() !== emailLower
      );
      onChange(newValue, newEmployees);
    } else {
      // Add (check max)
      if (maxSelections && value.length >= maxSelections) return;

      const selected: SelectedEmployee = {
        id: emp.id,
        fullName: emp.fullName,
        email: emp.email,
        title: emp.designation,
        department: emp.department,
        designation: emp.designation,
      };
      onChange([...value, emp.email], [...selectedEmployees, selected]);
    }
  };

  const handleRemove = (email: string) => {
    const emailLower = email.toLowerCase();
    const newValue = value.filter((v: string) => v.toLowerCase() !== emailLower);
    const newEmployees = selectedEmployees.filter((e: SelectedEmployee) =>
      e.email.toLowerCase() !== emailLower
    );
    onChange(newValue, newEmployees);
  };

  const getInitials = (name: string): string => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="text-label-md text-[#1C1C1C] block mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled}
            className={cn(
              "w-full min-h-11 h-auto justify-between text-left font-normal border-[#D0D0D0] bg-white py-2",
              "hover:bg-[#F5F5F5] focus:border-[#003366] focus:ring-[#003366]",
              error && "border-destructive"
            )}
          >
            {selectedEmployees.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 flex-1">
                {selectedEmployees.map((emp: SelectedEmployee) => (
                  <span
                    key={emp.email}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8F4FF] text-[#003366] rounded-md text-xs font-medium"
                  >
                    {emp.fullName}
                    <button
                      type="button"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleRemove(emp.email);
                      }}
                      className="hover:bg-[#003366]/10 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#5C5C5C]">
                <UserIcon className="h-4 w-4" />
                <span>{placeholder}</span>
              </div>
            )}
            <ChevronDown className="h-4 w-4 text-[#5C5C5C] flex-shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[400px] p-0"
          align="start"
        >
          <Tabs defaultValue="directory" className="w-full">
            <div className="border-b px-2 pt-2">
              <TabsList className="w-full h-9 bg-muted/50">
                <TabsTrigger value="directory" className="flex-1 gap-1.5 text-xs">
                  <Building2 className="h-3.5 w-3.5" />
                  Employee Directory
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex-1 gap-1.5 text-xs">
                  <Keyboard className="h-3.5 w-3.5" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="directory" className="mt-0">
              <div className="p-3 border-b border-[#EEEEEE]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5C5C]" />
                  <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-9 h-10 border-[#D0D0D0] focus:border-[#003366] focus:ring-[#003366]"
                  />
                </div>
                {maxSelections && (
                  <p className="text-xs text-[#5C5C5C] mt-2">
                    {value.length} of {maxSelections} selected
                  </p>
                )}
              </div>

              <div className="max-h-[280px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#003366]" />
                    <span className="ml-2 text-sm text-[#5C5C5C]">Searching...</span>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="p-6 text-center">
                    <UserIcon className="h-10 w-10 text-[#D0D0D0] mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#5C5C5C]">
                      {searchTerm && searchTerm.length >= 2
                        ? 'No employees found'
                        : 'Type at least 2 characters'}
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    {employees.map((emp: EmployeeRecord) => {
                      const isSelected = value.some((v: string) =>
                        v.toLowerCase() === emp.email.toLowerCase()
                      );
                      const isDisabled = !!(maxSelections && value.length >= maxSelections && !isSelected);

                  return (
                    <button
                      key={String(emp.id)}
                      onClick={() => handleToggleEmployee(emp)}
                      disabled={isDisabled}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        isSelected ? "bg-[#E8F4FF]" : "hover:bg-[#F5F5F5]",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                        isSelected
                          ? "bg-[#003366] border-[#003366]"
                          : "border-[#D0D0D0]"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="h-8 w-8 rounded-full bg-[#003366] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {getInitials(emp.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-[#1C1C1C] truncate block">
                          {emp.fullName}
                        </span>
                        {emp.email && (
                          <span className="text-xs text-[#5C5C5C] truncate block">
                            {emp.email}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="manual" className="mt-0">
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name *</label>
              <Input
                value={manualName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualName(e.target.value)}
                placeholder="Enter full name"
                className="h-10"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email (optional)
              </label>
              <Input
                type="email"
                value={manualEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualEmail(e.target.value)}
                placeholder="Enter email address"
                className="h-10"
              />
            </div>
            <Button
              onClick={() => {
                const trimmedName = manualName.trim();
                const trimmedEmail = manualEmail.trim();
                if (!trimmedName) return;
                const newEmail = trimmedEmail || `manual-${crypto.randomUUID()}@manual`;
                const newValue = [...value, newEmail];
                onChange(newValue, [...selectedEmployees, {
                  id: `manual-${crypto.randomUUID()}`,
                  fullName: trimmedName,
                  email: newEmail,
                }]);
                setManualName('');
                setManualEmail('');
              }}
              disabled={!manualName.trim()}
              className="w-full h-10 bg-[#003366] hover:bg-[#002244]"
            >
              <UserIcon className="h-4 w-4 mr-1.5" />
              Add Person
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </PopoverContent>
      </Popover>

      {helperText && (
        <p className={cn(
          "text-xs mt-1.5",
          error ? "text-destructive" : "text-[#5C5C5C]"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export type { EmployeeRecord };
