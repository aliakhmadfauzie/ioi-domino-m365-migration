// Sales & Marketing Forms Library (Placeholder)
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  ArrowRight,
  Users,
  FileCheck,
  Gift,
  MessageSquare,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { FormNavigationDialog } from '@/components/form-navigation-dialog';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

// Placeholder form categories
const formCategories = [
  {
    id: 'customer-requests',
    name: 'Customer Requests',
    icon: Users,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'CRQ', name: 'Customer Request', description: 'General customer inquiry', priority: 'high' },
      { code: 'ACC', name: 'Account Request', description: 'New account setup', priority: 'high' },
      { code: 'INQ', name: 'Product Inquiry', description: 'Product information request', priority: 'medium' },
      { code: 'SVC', name: 'Service Request', description: 'Customer service request', priority: 'medium' },
    ],
  },
  {
    id: 'quotations',
    name: 'Quotations',
    icon: FileCheck,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      { code: 'QUO', name: 'Quotation', description: 'Price quotation', priority: 'critical' },
      { code: 'PRP', name: 'Proposal', description: 'Business proposal', priority: 'high' },
      { code: 'TND', name: 'Tender Response', description: 'Tender submission', priority: 'critical' },
      { code: 'RFQ', name: 'RFQ Response', description: 'Request for quotation response', priority: 'high' },
    ],
  },
  {
    id: 'samples',
    name: 'Sample Requests',
    icon: Gift,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'SMP', name: 'Sample Request', description: 'Product sample request', priority: 'high' },
      { code: 'TRL', name: 'Trial Order', description: 'Trial order request', priority: 'high' },
      { code: 'DMO', name: 'Demo Request', description: 'Product demonstration', priority: 'medium' },
      { code: 'EVL', name: 'Evaluation Request', description: 'Product evaluation', priority: 'medium' },
    ],
  },
  {
    id: 'complaints',
    name: 'Customer Complaints',
    icon: MessageSquare,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'CMP', name: 'Complaint Form', description: 'Customer complaint', priority: 'critical' },
      { code: 'RTN', name: 'Return Request', description: 'Product return', priority: 'high' },
      { code: 'CLM', name: 'Claim Form', description: 'Customer claim', priority: 'high' },
      { code: 'FBK', name: 'Feedback Form', description: 'Customer feedback', priority: 'medium' },
    ],
  },
];

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">critical</Badge>;
    case 'high':
      return <Badge variant="default">high</Badge>;
    case 'medium':
      return <Badge variant="secondary">medium</Badge>;
    default:
      return <Badge variant="outline">low</Badge>;
  }
}

export default function SalesFormsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<{ code: string; name: string } | null>(null);

  const filteredCategories = useMemo(() => {
    return formCategories.filter((category) => {
      if (selectedCategory && category.id !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.forms.some(
            (form) =>
              form.name.toLowerCase().includes(query) ||
              form.code.toLowerCase().includes(query) ||
              form.description.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const totalForms = formCategories.reduce((acc, cat) => acc + cat.forms.length, 0);

  const handleFormClick = (form: { code: string; name: string }) => {
    setSelectedForm(form);
    setDialogOpen(true);
  };

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-xl">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Sales & Marketing Forms</h1>
            <Badge variant="secondary">Placeholder</Badge>
          </div>
          <p className="text-muted-foreground">{totalForms} placeholder forms across {formCategories.length} categories</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/sales">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Dashboard
          </Link>
        </Button>
      </motion.div>

      {/* Placeholder Alert */}
      <motion.div variants={itemVariants}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Placeholder Forms</AlertTitle>
          <AlertDescription>
            These are placeholder forms. The actual Sales & Marketing forms will be configured separately based on your requirements.
          </AlertDescription>
        </Alert>
      </motion.div>

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
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All ({totalForms})
          </Button>
          {formCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name.split(' ')[0]} ({cat.forms.length})
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Form Categories */}
      {filteredCategories.length === 0 ? (
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyTitle>No forms found</EmptyTitle>
            <EmptyDescription>Try adjusting your search or filter criteria</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-4">
          {filteredCategories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Card className={`h-full border-l-4 ${category.borderClass} opacity-75`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${category.colorClass}`}>
                      <category.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.name}
                        <Badge variant="outline" className="text-xs">Placeholder</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{category.forms.length} forms</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  {category.forms.map((form) => (
                    <button
                      key={form.code}
                      type="button"
                      onClick={() => handleFormClick(form)}
                      className="w-full flex items-center justify-between p-3 rounded-md bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                        <span className="text-sm truncate">{form.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getPriorityBadge(form.priority)}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Navigation Dialog */}
      {selectedForm && (
        <FormNavigationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          formCode={selectedForm.code}
          formName={selectedForm.name}
          basePath="/sales/forms"
          databaseCount={0}
          mySubmissionsCount={0}
          myPendingCount={0}
        />
      )}
    </motion.div>
  );
}