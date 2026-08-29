import {
  Users,
  Monitor,
  FileText,
  Heart,
  TrendingUp,
  LogOut,
  ClipboardCheck,
  Shield,
  UserPlus,
  Briefcase,
  Activity,
  Award,
  FileCheck,
  Settings,
  Server,
  HardDrive,
  Database,
  BookOpen,
  AlertTriangle,
  Building2,
  Factory,
  Beaker,
  Package,
  Truck,
  Wallet,
  Wrench,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export interface NavModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  formCount: number;
}

export interface NavDepartment {
  id: string;
  code: string;
  name: string;
  color: string;
  icon: LucideIcon;
  isActive: boolean;
  modules: NavModule[];
}

// HR Operations Modules
const hrModules: NavModule[] = [
  {
    id: 'hr-recruitment',
    name: 'Recruitment',
    description: 'Contract requisitions, staffing requests, job descriptions',
    icon: UserPlus,
    path: '/hr/recruitment',
    formCount: 3,
  },
  {
    id: 'hr-health',
    name: 'Health & Compliance',
    description: 'Medical records, vaccination tracking, wellness declarations',
    icon: Heart,
    path: '/hr/health',
    formCount: 3,
  },
  {
    id: 'hr-succession',
    name: 'Succession Planning',
    description: 'Business succession documents, org chart management',
    icon: TrendingUp,
    path: '/hr/succession',
    formCount: 2,
  },
  {
    id: 'hr-lifecycle',
    name: 'Employee Lifecycle',
    description: 'Exit notifications, clearance tracking',
    icon: LogOut,
    path: '/hr/lifecycle',
    formCount: 2,
  },
  {
    id: 'hr-performance',
    name: 'Performance Appraisals',
    description: 'Employee performance reviews and evaluations',
    icon: Award,
    path: '/hr/performance',
    formCount: 1,
  },
  {
    id: 'hr-compliance',
    name: 'Compliance Records',
    description: 'Employee compliance documentation',
    icon: FileCheck,
    path: '/hr/compliance',
    formCount: 1,
  },
  {
    id: 'hr-leave',
    name: 'Leave Management',
    description: 'Leave applications and tracking',
    icon: Briefcase,
    path: '/hr/leave',
    formCount: 1,
  },
];

// IT Operations Modules
const itModules: NavModule[] = [
  {
    id: 'it-access',
    name: 'User & Access Management',
    description: 'User access requests, permissions management',
    icon: Shield,
    path: '/it/access',
    formCount: 2,
  },
  {
    id: 'it-support',
    name: 'IT Support & Service',
    description: 'Support tickets, service requests',
    icon: Activity,
    path: '/it/support',
    formCount: 2,
  },
  {
    id: 'it-hardware',
    name: 'Hardware Inventory',
    description: 'Hardware requests and inventory management',
    icon: HardDrive,
    path: '/it/hardware',
    formCount: 2,
  },
  {
    id: 'it-sap',
    name: 'SAP Management',
    description: 'SAP access requests and management',
    icon: Database,
    path: '/it/sap',
    formCount: 1,
  },
  {
    id: 'it-isg',
    name: 'M5: ISG Documentation',
    description: 'IT/ISG documentation, training manuals, and procedures',
    icon: BookOpen,
    path: '/it/isg',
    formCount: 3,
  },
  {
    id: 'it-docs',
    name: 'Policies & Guidelines',
    description: 'IT policies and guidelines',
    icon: FileText,
    path: '/it/docs',
    formCount: 1,
  },
  {
    id: 'it-disaster',
    name: 'Disaster Recovery',
    description: 'Disaster recovery planning and procedures',
    icon: AlertTriangle,
    path: '/it/disaster',
    formCount: 1,
  },
];

// All 23 Departments
export const departments: NavDepartment[] = [
  {
    id: 'hr',
    code: 'HR',
    name: 'Human Resources',
    color: '#0891b2',
    icon: Users,
    isActive: true,
    modules: hrModules,
  },
  {
    id: 'it',
    code: 'IT',
    name: 'Information Technology',
    color: '#4f46e5',
    icon: Monitor,
    isActive: true,
    modules: itModules,
  },
  {
    id: 'admin',
    code: 'ADMIN',
    name: 'Administration',
    color: '#7c3aed',
    icon: Building2,
    isActive: false,
    modules: [],
  },
  {
    id: 'production',
    code: 'PROD',
    name: 'Production',
    color: '#ea580c',
    icon: Factory,
    isActive: false,
    modules: [],
  },
  {
    id: 'qa',
    code: 'QA',
    name: 'Quality Assurance',
    color: '#16a34a',
    icon: ClipboardCheck,
    isActive: false,
    modules: [],
  },
  {
    id: 'qc',
    code: 'QC',
    name: 'Quality Control',
    color: '#059669',
    icon: Beaker,
    isActive: false,
    modules: [],
  },
  {
    id: 'warehouse',
    code: 'WH',
    name: 'Warehouse',
    color: '#ca8a04',
    icon: Package,
    isActive: false,
    modules: [],
  },
  {
    id: 'engineering',
    code: 'ENG',
    name: 'Engineering',
    color: '#dc2626',
    icon: Settings,
    isActive: false,
    modules: [],
  },
  {
    id: 'finance',
    code: 'FIN',
    name: 'Finance',
    color: '#0284c7',
    icon: Wallet,
    isActive: false,
    modules: [],
  },
  {
    id: 'logistics',
    code: 'LOG',
    name: 'Logistics',
    color: '#9333ea',
    icon: Truck,
    isActive: false,
    modules: [],
  },
  {
    id: 'maintenance',
    code: 'MAINT',
    name: 'Maintenance',
    color: '#78716c',
    icon: Wrench,
    isActive: false,
    modules: [],
  },
  {
    id: 'powerbi',
    code: 'PBI',
    name: 'Power BI / Analytics',
    color: '#f59e0b',
    icon: BarChart3,
    isActive: false,
    modules: [],
  },
  {
    id: 'plant',
    code: 'PLANT',
    name: 'Plant Operations',
    color: '#65a30d',
    icon: Server,
    isActive: false,
    modules: [],
  },
];

export const getActiveDepartments = () => departments.filter((d) => d.isActive);
export const getInactiveDepartments = () => departments.filter((d) => !d.isActive);
export const getDepartmentByCode = (code: string) => departments.find((d) => d.code === code);
export const getDepartmentById = (id: string) => departments.find((d) => d.id === id);