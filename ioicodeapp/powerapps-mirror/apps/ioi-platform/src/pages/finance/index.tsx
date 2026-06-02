import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  PieChart,
  BarChart3,
  Building2,
  Receipt,
  Wallet,
  ArrowRight,
  Plus,
  Calculator,
  Landmark,
  FileCheck,
  Users,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

// Finance KPIs
const kpis = [
  { label: 'Pending CARs', value: '12', icon: FileText, trend: '-3', isPositive: true },
  { label: 'Open EARFs', value: '8', icon: Receipt, trend: '+2', isPositive: false },
  { label: 'Credit Reviews', value: '5', icon: CreditCard, trend: '0', isPositive: true },
  { label: 'Monthly Budget', value: 'RM 4.2M', icon: DollarSign, trend: '-8%', isPositive: true },
];

// Promoted Finance categories from FXB-001 and FXB-002 source analysis.
const formCategories = [
  {
    id: 'capital-expenditure',
    name: 'Capital Expenditure',
    icon: TrendingUp,
    count: 1,
    forms: [
      { code: 'CAR', name: 'Capital Appropriation Request', priority: 'critical' },
    ],
  },
  {
    id: 'expense-claims',
    name: 'Expense Approval',
    icon: Receipt,
    count: 1,
    forms: [
      { code: 'EARF', name: 'Expense Approval Request Form', priority: 'critical' },
    ],
  },
  {
    id: 'credit-management',
    name: 'Credit Management',
    icon: CreditCard,
    count: 1,
    forms: [
      { code: 'CMF_A', name: 'Credit Management Forms', priority: 'critical' },
    ],
  },
  {
    id: 'accounts-payable',
    name: 'Service Entry',
    icon: Wallet,
    count: 1,
    forms: [
      { code: 'RSES', name: 'Reversal Service Entry Sheet', priority: 'high' },
    ],
  },
  {
    id: 'claims-registration',
    name: 'Claims & Registration',
    icon: FileCheck,
    count: 2,
    forms: [
      { code: 'INSUCLAI', name: 'Insurance Claim', priority: 'high' },
      { code: 'VENDREGIFINA', name: 'Vendor Registration Form (Finance & HR)', priority: 'high' },
    ],
  },
];

// Quick actions
const quickActions = [
  { label: 'New CAR', href: '/fin/forms/CAR/new', icon: Plus, variant: 'default' as const },
  { label: 'Submit EARF', href: '/fin/forms/EARF/new', icon: Receipt, variant: 'outline' as const },
  { label: 'Credit Management', href: '/fin/forms/CMF_A/new', icon: CreditCard, variant: 'outline' as const },
];

// Recent activities
const recentActivities = [
  { action: 'CAR-2024-0089 approved', amount: 'RM 250,000', time: '1 hour ago', status: 'approved' },
  { action: 'EARF-2024-0456 submitted', amount: 'RM 12,500', time: '3 hours ago', status: 'pending' },
  { action: 'Credit limit increased', amount: 'RM 500,000', time: '1 day ago', status: 'completed' },
  { action: 'Budget variance flagged', amount: '-RM 45,000', time: '2 days ago', status: 'alert' },
];

export default function FinanceDepartmentHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = formCategories.filter((category) => {
    if (selectedCategory && category.id !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        category.name.toLowerCase().includes(query) ||
        category.forms.some(
          (form) =>
            form.name.toLowerCase().includes(query) || form.code.toLowerCase().includes(query)
        )
      );
    }
    return true;
  });

  const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusVariant = (status: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'alert':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
      <motion.div
        className="space-y-8 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finance Department</h1>
            <p className="text-muted-foreground mt-1">Capital expenditure, budgeting & financial reporting</p>
          </div>
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <Button key={action.label} variant={action.variant} asChild>
                <Link to={action.href}>
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    <p className={`text-xs mt-1 ${kpi.isPositive ? 'text-accent-foreground' : 'text-muted-foreground'}`}>{kpi.trend} this month</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <kpi.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="forms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="forms">Forms Library</TabsTrigger>
            <TabsTrigger value="dashboard">Financial Dashboard</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-6">
            {/* Search and Filter */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms by name or code..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {formCategories.slice(0, 4).map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Form Categories Grid */}
            <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.count} forms</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {category.forms.slice(0, 5).map((form) => (
                        <Link
                          key={form.code}
                          to={`/fin/forms/${form.code}/new`}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{form.code}</span>
                            <span className="text-sm">{form.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityVariant(form.priority)} className="text-xs">
                              {form.priority}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))}
                      {category.forms.length > 5 && (
                        <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                          <Link to={`/fin/forms?category=${category.id}`}>
                            View all {category.forms.length} forms
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* CAPEX Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent-foreground" />
                    CAPEX YTD
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">RM 12.4M</div>
                  <p className="text-sm text-muted-foreground mt-1">of RM 18M budget (69%)</p>
                  <div className="w-full h-2 bg-muted rounded-full mt-3">
                    <div className="h-full w-[69%] bg-primary rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">23</div>
                  <p className="text-sm text-muted-foreground mt-1">Total value: RM 890K</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Overdue Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">7</div>
                  <p className="text-sm text-muted-foreground mt-1">Value: RM 156K</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Connect to SAP/financial systems for live data</p>
                  <Button variant="outline" className="mt-4">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Data Source
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.amount}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={getStatusVariant(activity.status)}
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
  );
}
