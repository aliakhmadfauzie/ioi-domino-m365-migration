/**
 * Logistics (LOG) Department Home Page
 * 
 * Main dashboard for Logistics department with quick access to forms,
 * recent submissions, and department statistics.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Truck,
  Container,
  ClipboardCheck,
  AlertTriangle,
  Scale,
  Droplets,
  Calendar,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/use-user';
import { LOG_FORMS } from '@/types/log-forms';

// Icon mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  Container: <Container className="h-5 w-5" />,
  ClipboardCheck: <ClipboardCheck className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Scale: <Scale className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
};

// Mock statistics
const MOCK_STATS = {
  totalSubmissions: 156,
  pendingApprovals: 12,
  approvedThisMonth: 89,
  rejectedThisMonth: 4,
};

// Mock recent submissions
const MOCK_RECENT = [
  { id: 'CSD-202605-1234', form: 'Container Shipment', date: '2026-05-12', status: 'Submitted' },
  { id: 'TI-202605-5678', form: 'Tanker Inspection', date: '2026-05-11', status: 'Approved' },
  { id: 'POD-202605-9012', form: 'POD Report', date: '2026-05-11', status: 'Pending' },
  { id: 'FBN-202605-3456', form: 'Forklift Breakdown', date: '2026-05-10', status: 'Submitted' },
];

export default function LogisticsHomePage() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  // Group forms by category
  const formsByCategory = LOG_FORMS.reduce((acc, form) => {
    if (!acc[form.category]) {
      acc[form.category] = [];
    }
    acc[form.category].push(form);
    return acc;
  }, {} as Record<string, typeof LOG_FORMS>);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#003366] px-6 py-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
              <Truck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-['Segoe_UI'] text-[24px] font-bold text-white">
                Logistics Department
              </h1>
              <p className="font-['Segoe_UI'] text-[14px] text-white/80">
                Container shipments, tanker inspections, and fleet management
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg bg-white/10 p-4"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-white/70" />
                <div>
                  <p className="font-['Segoe_UI'] text-[24px] font-bold text-white">
                    {MOCK_STATS.totalSubmissions}
                  </p>
                  <p className="font-['Segoe_UI'] text-[12px] text-white/70">Total Submissions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg bg-white/10 p-4"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-['Segoe_UI'] text-[24px] font-bold text-white">
                    {MOCK_STATS.pendingApprovals}
                  </p>
                  <p className="font-['Segoe_UI'] text-[12px] text-white/70">Pending Approvals</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg bg-white/10 p-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-['Segoe_UI'] text-[24px] font-bold text-white">
                    {MOCK_STATS.approvedThisMonth}
                  </p>
                  <p className="font-['Segoe_UI'] text-[12px] text-white/70">Approved (May)</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg bg-white/10 p-4"
            >
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-['Segoe_UI'] text-[24px] font-bold text-white">
                    {MOCK_STATS.rejectedThisMonth}
                  </p>
                  <p className="font-['Segoe_UI'] text-[12px] text-white/70">Rejected (May)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Forms Section - Left 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-['Segoe_UI'] text-[16px] font-semibold text-[#1C1C1C]">
                  Quick Actions
                </h2>
                <Link to="/log/forms">
                  <Button variant="ghost" size="sm" className="text-[#003366]">
                    View All Forms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {LOG_FORMS.slice(0, 6).map((form, index: number) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => navigate(form.route)}
                      className="flex w-full items-center gap-3 rounded-lg border border-[#D0D0D0] p-3 text-left transition-all hover:border-[#003366] hover:bg-[#003366]/5"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${form.color}15`, color: form.color }}
                      >
                        {ICON_MAP[form.icon]}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate font-['Segoe_UI'] text-[13px] font-semibold text-[#1C1C1C]">
                          {form.code}
                        </p>
                        <p className="truncate font-['Segoe_UI'] text-[11px] text-[#5C5C5C]">
                          {form.title}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Forms by Category */}
            {Object.entries(formsByCategory).map(([category, forms]) => (
              <div
                key={category}
                className="rounded-xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="outline" className="text-[12px]">
                    {category}
                  </Badge>
                  <span className="font-['Segoe_UI'] text-[13px] text-[#5C5C5C]">
                    {forms.length} forms
                  </span>
                </div>

                <div className="space-y-2">
                  {forms.map((form) => (
                    <button
                      key={form.id}
                      onClick={() => navigate(form.route)}
                      className="flex w-full items-center gap-4 rounded-lg border border-transparent p-3 text-left transition-all hover:border-[#D0D0D0] hover:bg-[#FAFAFA]"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${form.color}15`, color: form.color }}
                      >
                        {ICON_MAP[form.icon]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-['Segoe_UI'] text-[11px] font-semibold text-[#5C5C5C]">
                            LOG-{form.id}
                          </span>
                          <span className="font-['Segoe_UI'] text-[14px] font-semibold text-[#1C1C1C]">
                            {form.title}
                          </span>
                        </div>
                        <p className="font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                          {form.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#5C5C5C]" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* User Welcome */}
            <div className="rounded-xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#003366]/10">
                  <span className="font-['Segoe_UI'] text-[16px] font-bold text-[#003366]">
                    {user?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-['Segoe_UI'] text-[14px] font-semibold text-[#1C1C1C]">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                    Logistics Department
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="rounded-xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
              <h3 className="mb-4 font-['Segoe_UI'] text-[16px] font-semibold text-[#1C1C1C]">
                Recent Submissions
              </h3>

              <div className="space-y-3">
                {MOCK_RECENT.map((item, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-[#E0E0E0] p-3"
                  >
                    <div>
                      <p className="font-['Segoe_UI'] text-[13px] font-semibold text-[#1C1C1C]">
                        {item.id}
                      </p>
                      <p className="font-['Segoe_UI'] text-[11px] text-[#5C5C5C]">
                        {item.form} · {item.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === 'Approved'
                          ? 'default'
                          : item.status === 'Pending'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="text-[11px]"
                    >
                      {item.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-xl border-2 border-dashed border-[#D0D0D0] bg-[#FAFAFA] p-6">
              <FileText className="mb-3 h-8 w-8 text-[#5C5C5C]" />
              <h3 className="mb-2 font-['Segoe_UI'] text-[14px] font-semibold text-[#1C1C1C]">
                Need Help?
              </h3>
              <p className="mb-4 font-['Segoe_UI'] text-[12px] text-[#5C5C5C]">
                Contact IT support for form-related issues or access problems.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}