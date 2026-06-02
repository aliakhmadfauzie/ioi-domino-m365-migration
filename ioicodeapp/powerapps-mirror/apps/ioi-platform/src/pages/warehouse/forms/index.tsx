// Warehouse Forms Library
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Search,
  FileText,
  ArrowRight,
  PackageOpen,
  ArrowLeftRight,
  Truck,
  ClipboardList,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const formCategories = [
  {
    id: 'goods-receipt',
    name: 'Goods Receipt',
    icon: PackageOpen,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'GRN', name: 'Goods Receipt Note', description: 'Record incoming shipments', priority: 'critical' },
      { code: 'RCV', name: 'Receiving Report', description: 'Detailed receiving documentation', priority: 'high' },
      { code: 'INS', name: 'Inspection Report', description: 'Quality inspection on receipt', priority: 'high' },
      { code: 'POD', name: 'Proof of Delivery', description: 'Delivery confirmation', priority: 'medium' },
      { code: 'UNL', name: 'Unloading Checklist', description: 'Vehicle unloading verification', priority: 'medium' },
    ],
  },
  {
    id: 'stock-transfer',
    name: 'Stock Transfer',
    icon: ArrowLeftRight,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      { code: 'STO', name: 'Stock Transfer Order', description: 'Inter-warehouse transfer', priority: 'critical' },
      { code: 'BIN', name: 'Bin Transfer', description: 'Move stock between bins', priority: 'high' },
      { code: 'LOC', name: 'Location Change', description: 'Update storage location', priority: 'high' },
      { code: 'IWT', name: 'Inter-Warehouse Transfer', description: 'Cross-facility movement', priority: 'critical' },
      { code: 'PLT', name: 'Pallet Transfer', description: 'Full pallet movement', priority: 'medium' },
    ],
  },
  {
    id: 'delivery',
    name: 'Delivery Orders',
    icon: Truck,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'DO', name: 'Delivery Order', description: 'Outbound shipment order', priority: 'critical' },
      { code: 'PKL', name: 'Picking List', description: 'Order picking document', priority: 'critical' },
      { code: 'PKG', name: 'Packing List', description: 'Package contents list', priority: 'high' },
      { code: 'DIS', name: 'Dispatch Note', description: 'Shipment dispatch record', priority: 'high' },
      { code: 'BOL', name: 'Bill of Lading', description: 'Shipping documentation', priority: 'critical' },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory Adjustment',
    icon: ClipboardList,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'ADJ', name: 'Stock Adjustment', description: 'Inventory quantity adjustment', priority: 'critical' },
      { code: 'CYC', name: 'Cycle Count', description: 'Regular inventory count', priority: 'high' },
      { code: 'PHY', name: 'Physical Inventory', description: 'Full physical count', priority: 'critical' },
      { code: 'WRT', name: 'Write-Off Request', description: 'Damaged/expired stock', priority: 'high' },
      { code: 'VAR', name: 'Variance Report', description: 'Stock discrepancy report', priority: 'high' },
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

export default function WarehouseFormsPage() {
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
              <Warehouse className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Warehouse Forms</h1>
          </div>
          <p className="text-muted-foreground">{totalForms} forms across {formCategories.length} categories</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/warehouse">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Dashboard
          </Link>
        </Button>
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
              <Card className={`h-full border-l-4 ${category.borderClass}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${category.colorClass}`}>
                      <category.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
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
          basePath="/warehouse/forms"
          databaseCount={Math.floor(Math.random() * 100) + 20}
          mySubmissionsCount={Math.floor(Math.random() * 15)}
          myPendingCount={Math.floor(Math.random() * 8)}
        />
      )}
    </motion.div>
  );
}