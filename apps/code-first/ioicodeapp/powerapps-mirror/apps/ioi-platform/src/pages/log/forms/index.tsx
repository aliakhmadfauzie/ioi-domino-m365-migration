/**
 * Logistics Forms Index Page
 * 
 * List all available Logistics forms with search and filter.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Container,
  ClipboardCheck,
  AlertTriangle,
  Scale,
  Droplets,
  Calendar,
  ArrowRight,
  Filter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LOG_FORMS, type LOGFormDefinition } from '@/types/log-forms';

// Icon mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  Container: <Container className="h-6 w-6" />,
  ClipboardCheck: <ClipboardCheck className="h-6 w-6" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6" />,
  Scale: <Scale className="h-6 w-6" />,
  Droplets: <Droplets className="h-6 w-6" />,
  Calendar: <Calendar className="h-6 w-6" />,
};

const CATEGORIES = ['All', 'Shipment', 'Inspection', 'Breakdown', 'Delivery', 'Maintenance'];

export default function LogisticsFormsIndexPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter forms
  const filteredForms = LOG_FORMS.filter((form: LOGFormDefinition) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-6">
          <Link to="/log">
            <Button variant="ghost" size="sm" className="mb-4 text-[#5C5C5C] hover:text-[#003366]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Logistics
            </Button>
          </Link>

          <h1 className="font-['Segoe_UI'] text-[24px] font-bold text-[#1C1C1C]">
            Logistics Forms
          </h1>
          <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
            Select a form to create a new submission
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="h-11 bg-white pl-10 border-[#D0D0D0]"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="h-11 w-[180px] bg-white border-[#D0D0D0]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredForms.map((form: LOGFormDefinition, index: number) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => navigate(form.route)}
                className="flex w-full items-start gap-4 rounded-xl bg-white p-6 text-left shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
              >
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${form.color}15`, color: form.color }}
                >
                  {ICON_MAP[form.icon]}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      LOG-{form.id}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                      style={{ backgroundColor: `${form.color}20`, color: form.color }}
                    >
                      {form.category}
                    </Badge>
                  </div>

                  <h3 className="mb-1 font-['Segoe_UI'] text-[16px] font-semibold text-[#1C1C1C]">
                    {form.title}
                  </h3>

                  <p className="mb-3 font-['Segoe_UI'] text-[13px] text-[#5C5C5C] line-clamp-2">
                    {form.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {form.sections.slice(0, 3).map((section) => (
                        <span
                          key={section}
                          className="rounded bg-[#F5F5F5] px-2 py-0.5 font-['Segoe_UI'] text-[10px] text-[#5C5C5C]"
                        >
                          {section}
                        </span>
                      ))}
                      {form.sections.length > 3 && (
                        <span className="rounded bg-[#F5F5F5] px-2 py-0.5 font-['Segoe_UI'] text-[10px] text-[#5C5C5C]">
                          +{form.sections.length - 3} more
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#5C5C5C]" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredForms.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
            <Search className="mx-auto mb-4 h-12 w-12 text-[#D0D0D0]" />
            <h3 className="mb-2 font-['Segoe_UI'] text-[16px] font-semibold text-[#1C1C1C]">
              No forms found
            </h3>
            <p className="font-['Segoe_UI'] text-[14px] text-[#5C5C5C]">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Form Count */}
        <div className="mt-6 text-center">
          <p className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
            Showing {filteredForms.length} of {LOG_FORMS.length} forms
          </p>
        </div>
      </div>
    </div>
  );
}