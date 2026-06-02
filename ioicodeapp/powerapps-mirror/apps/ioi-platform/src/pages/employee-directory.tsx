import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  UserCircle,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeeLookup } from '@/hooks/use-employee-lookup';

interface Employee {
  id: string | number;
  title?: string;
  fullName?: string;
  employeeId?: string;
  email?: string;
  phone?: string;
  extension?: string;
  department?: string;
  designation?: string;
  position?: string;
  company?: string;
  location?: string;
  site?: string;
  manager?: string;
  status?: string;
  isActive?: boolean;
  category?: string;
  configKey?: string;
  configValue?: string;
  description?: string;
}

export default function EmployeeDirectoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Fetch employee directory from the normalized SharePoint employee lookup
  const { allEmployees: employees = [], isLoading, isFetching, refetch, error } = useEmployeeLookup('', true);

  // Extract unique departments and companies for filters
  const { departments, companies } = useMemo(() => {
    if (!employees.length) return { departments: [], companies: [] };
    const deptSet = new Set<string>();
    const companySet = new Set<string>();
    
    employees.forEach((emp: Employee) => {
      if (emp.department) deptSet.add(emp.department);
      if (emp.company) companySet.add(emp.company);
    });
    
    return {
      departments: Array.from(deptSet).sort(),
      companies: Array.from(companySet).sort(),
    };
  }, [employees]);

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: Employee) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        (emp.title?.toLowerCase().includes(searchLower)) ||
        (emp.fullName?.toLowerCase().includes(searchLower)) ||
        (emp.email?.toLowerCase().includes(searchLower)) ||
        (emp.employeeId?.toLowerCase().includes(searchLower)) ||
        (emp.department?.toLowerCase().includes(searchLower)) ||
        (emp.designation?.toLowerCase().includes(searchLower)) ||
        (emp.configKey?.toLowerCase().includes(searchLower)) ||
        (emp.configValue?.toLowerCase().includes(searchLower));
        
      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      const matchesCompany = selectedCompany === 'all' || emp.company === selectedCompany;
      
      return matchesSearch && matchesDepartment && matchesCompany;
    });
  }, [employees, searchQuery, selectedDepartment, selectedCompany]);

  // Get initials for avatar
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display name
  const getDisplayName = (emp: Employee) => {
    return emp.fullName || emp.title || emp.configKey || 'Unknown';
  };

  // Get employee info
  const getEmployeeInfo = (emp: Employee) => {
    return {
      name: getDisplayName(emp),
      email: emp.email || emp.configValue || '-',
      phone: emp.phone || emp.extension || '-',
      department: emp.department || emp.category || '-',
      designation: emp.designation || emp.position || emp.description || '-',
      company: emp.company || '-',
      location: emp.location || emp.site || '-',
      employeeId: emp.employeeId || String(emp.id) || '-',
      manager: emp.manager || '-',
      status: emp.status || (emp.isActive !== false ? 'Active' : 'Inactive'),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Employee Directory
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, ID, or department..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Department Filter */}
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept: string) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Company Filter */}
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company: string) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {error ? (
          <Card className="mb-4 border-destructive/30 bg-destructive/5">
            <CardContent className="py-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h3 className="mt-4 text-lg font-medium">SharePoint data could not be loaded</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The directory connection exists, but the list is returning an error. Check the SharePoint list permissions and the column mapping for title, configKey, configValue, and category.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {isLoading ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i: number) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Employees Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedDepartment !== 'all' || selectedCompany !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No employees in the directory yet'}
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.map((emp: Employee, index: number) => {
              const info = getEmployeeInfo(emp);
              return (
                <motion.div
                  key={emp.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.015, 0.5), duration: 0.25 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(info.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{info.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {info.designation}
                          </p>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {info.department}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t space-y-1.5">
                        {info.email !== '-' && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{info.email}</span>
                          </div>
                        )}
                        {info.phone !== '-' && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{info.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Badge
                          variant={info.status === 'Active' ? 'default' : 'secondary'}
                          className="text-sm"
                        >
                          {info.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="divide-y">
              {filteredEmployees.map((emp: Employee, index: number) => {
                const info = getEmployeeInfo(emp);
                return (
                  <motion.div
                    key={emp.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.012, 0.4), duration: 0.25 }}
                    className="p-4 hover:bg-muted/80 hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(info.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div>
                          <p className="font-medium">{info.name}</p>
                          <p className="text-sm text-muted-foreground">{info.employeeId}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-sm">{info.designation}</p>
                          <p className="text-xs text-muted-foreground">{info.department}</p>
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-sm">{info.company}</p>
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-sm">{info.email}</p>
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-sm">{info.phone}</p>
                        </div>
                        <div className="flex justify-end">
                          <Badge
                            variant={info.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {info.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Employee Details
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (() => {
            const info = getEmployeeInfo(selectedEmployee);
            return (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(info.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{info.name}</h2>
                    <p className="text-muted-foreground">{info.designation}</p>
                    <Badge
                      variant={info.status === 'Active' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {info.status}
                    </Badge>
                  </div>
                </div>

                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                        <p className="text-sm font-medium">{info.employeeId}</p>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {info.department}
                        </p>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Position</label>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {info.designation}
                        </p>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Company</label>
                        <p className="text-sm font-medium">{info.company}</p>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {info.location}
                        </p>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-muted-foreground">Manager</label>
                        <p className="text-sm font-medium">{info.manager}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-sm font-medium">{info.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Phone / Extension</label>
                          <p className="text-sm font-medium">{info.phone}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                    Close
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}