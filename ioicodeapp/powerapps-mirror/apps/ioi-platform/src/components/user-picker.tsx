import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, User as UserIcon, Loader2, X, Check, Keyboard, Building2, Mail, Briefcase, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEmployeeLookup, type EmployeeRecord } from '@/hooks/use-employee-lookup';
import { cn } from '@/lib/utils';

/** Represents a selected person - either from directory or manually entered */
export interface SelectedPerson {
  id: string;
  displayName: string;
  email?: string;
  department?: string;
  jobTitle?: string;
  source: 'directory' | 'manual';
}

interface UserPickerProps {
  value?: string; // Email or manual entry ID
  onChange: (userId: string, person: SelectedPerson | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  /** Default input mode */
  defaultMode?: 'directory' | 'manual';
  /** Allow switching between modes */
  allowModeSwitch?: boolean;
  /** Require email for manual entry */
  manualRequireEmail?: boolean;
}

// Convert EmployeeRecord to SelectedPerson
export function employeeToSelectedPerson(emp: EmployeeRecord): SelectedPerson {
  return {
    id: emp.email,
    displayName: emp.fullName,
    email: emp.email,
    department: emp.department,
    jobTitle: emp.designation,
    source: 'directory',
  };
}

// Create a manual SelectedPerson
export function createManualPerson(name: string, email?: string): SelectedPerson {
  return {
    id: `manual-${crypto.randomUUID()}`,
    displayName: name.trim(),
    email: email?.trim(),
    source: 'manual',
  };
}

export function UserPicker({
  value,
  onChange,
  placeholder = 'Search for a user...',
  label,
  disabled = false,
  className,
  defaultMode = 'directory',
  allowModeSwitch = true,
  manualRequireEmail = false,
}: UserPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'directory' | 'manual'>(defaultMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch employees from directory
  const { employees, allEmployees, isLoading } = useEmployeeLookup(debouncedSearch, isOpen && mode === 'directory');
  
  // Find selected employee from directory by email
  const selectedEmployee = useMemo(() => {
    if (!value || !allEmployees.length) return null;
    const valueLower = value.toLowerCase();
    return allEmployees.find((emp: EmployeeRecord) => emp.email.toLowerCase() === valueLower) || null;
  }, [value, allEmployees]);
  
  // Try to restore selectedPerson from stored value
  const displayPerson = useMemo(() => {
    if (selectedPerson) return selectedPerson;
    if (selectedEmployee) return employeeToSelectedPerson(selectedEmployee);
    return null;
  }, [selectedPerson, selectedEmployee]);

  const handleSelectEmployee = (emp: EmployeeRecord) => {
    const person = employeeToSelectedPerson(emp);
    setSelectedPerson(person);
    onChange(emp.email, person);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddManual = () => {
    const trimmedName = manualName.trim();
    const trimmedEmail = manualEmail.trim();
    
    if (!trimmedName) return;
    if (manualRequireEmail && !trimmedEmail) return;
    
    const person = createManualPerson(trimmedName, trimmedEmail || undefined);
    setSelectedPerson(person);
    onChange(person.id, person);
    setIsOpen(false);
    setManualName('');
    setManualEmail('');
  };
  
  const handleClear = () => {
    setSelectedPerson(null);
    onChange('', null);
    setSearchTerm('');
  };
  
  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="text-label-md text-[#1C1C1C] block mb-2">
          {label}
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
              !value && "text-[#5C5C5C]"
            )}
          >
            {displayPerson ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0",
                  displayPerson.source === 'directory' ? 'bg-[#003366]' : 'bg-amber-600'
                )}>
                  {displayPerson.displayName?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{displayPerson.displayName}</span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                      displayPerson.source === 'directory' 
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-amber-100 text-amber-700'
                    )}>
                      {displayPerson.source === 'directory' ? 'Directory' : 'Manual'}
                    </span>
                  </div>
                  {displayPerson.email && (
                    <span className="text-xs text-[#5C5C5C] truncate">{displayPerson.email}</span>
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
            inputRef.current?.focus();
          }}
        >
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
                  ) : employees.length === 0 ? (
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
                      {employees.map((emp: EmployeeRecord) => (
                        <button
                          key={String(emp.id)}
                          onClick={() => handleSelectEmployee(emp)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#F5F5F5] transition-colors",
                            value === emp.email && "bg-[#E8F4FF]"
                          )}
                        >
                          <div className="h-9 w-9 rounded-full bg-[#003366] flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5">
                            {emp.fullName.charAt(0).toUpperCase() || 'U'}
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
                            {emp.designation && (
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
                
                {employees.length > 0 && (
                  <div className="p-2 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                    <p className="text-xs text-[#5C5C5C] text-center">
                      Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
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
                      Email {manualRequireEmail ? '*' : '(optional)'}
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
                    disabled={!manualName.trim() || (manualRequireEmail && !manualEmail.trim())}
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
          ) : (
            // Single mode - no tabs (directory only)
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
              
              <div className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#003366]" />
                    <span className="ml-2 text-sm text-[#5C5C5C]">Searching employees...</span>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="p-4 text-center">
                    <UserIcon className="h-8 w-8 text-[#D0D0D0] mx-auto mb-2" />
                    <p className="text-sm text-[#5C5C5C]">
                      {searchTerm ? 'No employees found' : 'Start typing to search'}
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    {employees.map((emp: EmployeeRecord) => (
                      <button
                        key={String(emp.id)}
                        onClick={() => handleSelectEmployee(emp)}
                        className={cn(
                          "w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#F5F5F5] transition-colors",
                          value === emp.email && "bg-[#E8F4FF]"
                        )}
                      >
                        <div className="h-9 w-9 rounded-full bg-[#003366] flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-0.5">
                          {emp.fullName.charAt(0).toUpperCase() || 'U'}
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
                          {emp.designation && (
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
              
              {employees.length > 0 && (
                <div className="p-2 border-t border-[#EEEEEE] bg-[#FAFAFA]">
                  <p className="text-xs text-[#5C5C5C] text-center">
                    Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export type { EmployeeRecord } from '@/hooks/use-employee-lookup';