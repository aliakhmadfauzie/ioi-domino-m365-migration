import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  TrendingUp,
  Receipt,
  CreditCard,
  Calculator,
  Wallet,
  Landmark,
  BarChart3,
  FileCheck,
  FileText,
  ArrowRight,
  Plus,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

// All finance forms (52+)
const allForms = [
  // Capital Expenditure (10)
  { code: 'CAR', name: 'Capital Appropriation Request', category: 'capital-expenditure', priority: 'critical', site: 'both' },
  { code: 'CARV', name: 'CAR Variation Request', category: 'capital-expenditure', priority: 'high', site: 'both' },
  { code: 'CARC', name: 'CAR Closure Form', category: 'capital-expenditure', priority: 'high', site: 'both' },
  { code: 'ProjEval', name: 'Project Evaluation Report', category: 'capital-expenditure', priority: 'high', site: 'both' },
  { code: 'ROICalc', name: 'ROI Calculator', category: 'capital-expenditure', priority: 'medium', site: 'both' },
  { code: 'AssetReg', name: 'Asset Registration Form', category: 'capital-expenditure', priority: 'critical', site: 'both' },
  { code: 'AssetTrf', name: 'Asset Transfer Form', category: 'capital-expenditure', priority: 'medium', site: 'both' },
  { code: 'AssetDisp', name: 'Asset Disposal Request', category: 'capital-expenditure', priority: 'high', site: 'both' },
  { code: 'BudgetReq', name: 'CAPEX Budget Request', category: 'capital-expenditure', priority: 'critical', site: 'both' },
  { code: 'CapexTrack', name: 'CAPEX Tracking Report', category: 'capital-expenditure', priority: 'medium', site: 'both' },

  // Expense & Claims (8)
  { code: 'EARF', name: 'Expense Approval Request Form', category: 'expense-claims', priority: 'critical', site: 'both' },
  { code: 'TClaim', name: 'Travel Claim Form', category: 'expense-claims', priority: 'high', site: 'both' },
  { code: 'EClaim', name: 'Entertainment Claim', category: 'expense-claims', priority: 'medium', site: 'both' },
  { code: 'PCard', name: 'P-Card Reconciliation', category: 'expense-claims', priority: 'high', site: 'both' },
  { code: 'Advance', name: 'Cash Advance Request', category: 'expense-claims', priority: 'high', site: 'both' },
  { code: 'AdvSettle', name: 'Advance Settlement', category: 'expense-claims', priority: 'high', site: 'both' },
  { code: 'Reimburse', name: 'Reimbursement Request', category: 'expense-claims', priority: 'medium', site: 'both' },
  { code: 'MileageClaim', name: 'Mileage Claim Form', category: 'expense-claims', priority: 'low', site: 'both' },

  // Credit Management (6)
  { code: 'CreditApp', name: 'Credit Application', category: 'credit-management', priority: 'critical', site: 'both' },
  { code: 'CreditRev', name: 'Credit Review Form', category: 'credit-management', priority: 'critical', site: 'both' },
  { code: 'CreditLimit', name: 'Credit Limit Change', category: 'credit-management', priority: 'high', site: 'both' },
  { code: 'OverdueRpt', name: 'Overdue Account Report', category: 'credit-management', priority: 'high', site: 'both' },
  { code: 'BadDebt', name: 'Bad Debt Write-off', category: 'credit-management', priority: 'critical', site: 'both' },
  { code: 'CollAction', name: 'Collection Action Log', category: 'credit-management', priority: 'medium', site: 'both' },

  // Budgeting & Planning (6)
  { code: 'AnnBudget', name: 'Annual Budget Template', category: 'budgeting', priority: 'critical', site: 'both' },
  { code: 'BudgetVar', name: 'Budget Variance Report', category: 'budgeting', priority: 'high', site: 'both' },
  { code: 'Forecast', name: 'Rolling Forecast', category: 'budgeting', priority: 'high', site: 'both' },
  { code: 'CostCenter', name: 'Cost Center Request', category: 'budgeting', priority: 'medium', site: 'both' },
  { code: 'BudgetTrf', name: 'Budget Transfer Request', category: 'budgeting', priority: 'high', site: 'both' },
  { code: 'RevBudget', name: 'Revised Budget Submission', category: 'budgeting', priority: 'critical', site: 'both' },

  // Accounts Payable (6)
  { code: 'InvApproval', name: 'Invoice Approval Form', category: 'accounts-payable', priority: 'critical', site: 'both' },
  { code: 'PayReq', name: 'Payment Request', category: 'accounts-payable', priority: 'critical', site: 'both' },
  { code: 'EarlyPay', name: 'Early Payment Request', category: 'accounts-payable', priority: 'medium', site: 'both' },
  { code: 'VendorPay', name: 'Vendor Payment Status', category: 'accounts-payable', priority: 'high', site: 'both' },
  { code: 'DebitNote', name: 'Debit Note Request', category: 'accounts-payable', priority: 'medium', site: 'both' },
  { code: 'CreditNote', name: 'Credit Note Processing', category: 'accounts-payable', priority: 'medium', site: 'both' },

  // Banking & Treasury (6)
  { code: 'BankRecon', name: 'Bank Reconciliation', category: 'banking', priority: 'critical', site: 'both' },
  { code: 'FXReq', name: 'Foreign Exchange Request', category: 'banking', priority: 'high', site: 'both' },
  { code: 'BankSig', name: 'Bank Signatory Update', category: 'banking', priority: 'critical', site: 'both' },
  { code: 'LoanReq', name: 'Loan Facility Request', category: 'banking', priority: 'high', site: 'both' },
  { code: 'CashFlow', name: 'Cash Flow Forecast', category: 'banking', priority: 'critical', site: 'both' },
  { code: 'BankGuarantee', name: 'Bank Guarantee Request', category: 'banking', priority: 'high', site: 'both' },

  // Financial Reporting (5)
  { code: 'MonthClose', name: 'Month-End Checklist', category: 'reporting', priority: 'critical', site: 'both' },
  { code: 'InterCo', name: 'Intercompany Transaction', category: 'reporting', priority: 'high', site: 'both' },
  { code: 'JournalReq', name: 'Journal Entry Request', category: 'reporting', priority: 'high', site: 'both' },
  { code: 'Accrual', name: 'Accrual Submission', category: 'reporting', priority: 'high', site: 'both' },
  { code: 'Provision', name: 'Provision Request', category: 'reporting', priority: 'medium', site: 'both' },

  // Tax & Compliance (5)
  { code: 'TaxInv', name: 'Tax Invoice Request', category: 'tax-compliance', priority: 'high', site: 'both' },
  { code: 'WHT', name: 'Withholding Tax Form', category: 'tax-compliance', priority: 'critical', site: 'both' },
  { code: 'SST', name: 'SST Declaration', category: 'tax-compliance', priority: 'critical', site: 'both' },
  { code: 'TaxExempt', name: 'Tax Exemption Certificate', category: 'tax-compliance', priority: 'medium', site: 'both' },
  { code: 'TransferPrice', name: 'Transfer Pricing Doc', category: 'tax-compliance', priority: 'high', site: 'both' },
];

const categories = [
  { id: 'capital-expenditure', name: 'Capital Expenditure', icon: TrendingUp },
  { id: 'expense-claims', name: 'Expense & Claims', icon: Receipt },
  { id: 'credit-management', name: 'Credit Management', icon: CreditCard },
  { id: 'budgeting', name: 'Budgeting & Planning', icon: Calculator },
  { id: 'accounts-payable', name: 'Accounts Payable', icon: Wallet },
  { id: 'banking', name: 'Banking & Treasury', icon: Landmark },
  { id: 'reporting', name: 'Financial Reporting', icon: BarChart3 },
  { id: 'tax-compliance', name: 'Tax & Compliance', icon: FileCheck },
];

const promotedFinanceForms = [
  { code: 'CAR', name: 'Capital Appropriation Request', category: 'capital-expenditure', priority: 'critical', site: 'Prai' },
  { code: 'CMF_A', name: 'Credit Management Forms', category: 'credit-management', priority: 'critical', site: 'Both' },
  { code: 'INSUCLAI', name: 'Insurance Claim', category: 'expense-claims', priority: 'high', site: 'Johor' },
  { code: 'RSES', name: 'Reversal Service Entry Sheet', category: 'accounts-payable', priority: 'high', site: 'Prai' },
  { code: 'VENDREGIFINA', name: 'Vendor Registration Form (Finance & HR)', category: 'accounts-payable', priority: 'high', site: 'Prai' },
  { code: 'EARF', name: 'Expenditure Appropriation Request Form', category: 'expense-claims', priority: 'critical', site: 'Prai' },
];

export default function FinanceFormsIndexPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredForms = promotedFinanceForms.filter((form) => {
    if (selectedCategory !== 'all' && form.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && form.priority !== selectedPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        form.name.toLowerCase().includes(query) ||
        form.code.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-accent/500 text-white';
      case 'medium':
        return 'bg-secondary/500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.icon || FileText;
  };

  return (
      <motion.div
        className="space-y-6 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance Forms</h1>
            <p className="text-muted-foreground">6 promoted Finance forms from FXB-001 and FXB-002 source analysis</p>
          </div>
          <Button asChild>
            <Link to="/fin/forms/CAR/new">
              <Plus className="h-4 w-4 mr-2" />
              New CAR Request
            </Link>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by form name or code..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-medium">Critical</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {promotedFinanceForms.filter((f) => f.priority === 'critical').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-accent/500/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-accent-foreground" />
                <span className="font-medium">High</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {promotedFinanceForms.filter((f) => f.priority === 'high').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/500/10 border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
                <span className="font-medium">Medium</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {promotedFinanceForms.filter((f) => f.priority === 'medium').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Promoted Forms</span>
              </div>
              <p className="text-2xl font-bold mt-1">{promotedFinanceForms.length}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forms List */}
        <motion.div variants={containerVariants} className="space-y-2">
          {filteredForms.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No forms found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredForms.map((form) => {
              const CategoryIcon = getCategoryIcon(form.category);
              return (
                <motion.div key={form.code} variants={itemVariants}>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                          <span className="font-medium">{form.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {categories.find((c) => c.id === form.category)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{form.site}</Badge>
                      <Badge className={getPriorityColor(form.priority)}>{form.priority}</Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/fin/forms/${form.code}`}>View Rows</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/fin/forms/${form.code}/new`}>New</Link>
                      </Button>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
          Showing {filteredForms.length} of {promotedFinanceForms.length} promoted forms
        </motion.div>
      </motion.div>
  );
}
