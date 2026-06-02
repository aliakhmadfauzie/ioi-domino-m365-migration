/**
 * HR Info Centre
 * Employee self-service information hub
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  HelpCircle,
  Search,
  Book,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Heart,
  GraduationCap,
  Shield,
  Briefcase,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Download,
  MessageSquare,
  Star,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface InfoCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  articles: number;
}

const INFO_CATEGORIES: InfoCategory[] = [
  { id: 'leave', title: 'Leave & Absence', description: 'Annual leave, medical leave, emergency leave', icon: Calendar, color: 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground', articles: 12 },
  { id: 'payroll', title: 'Payroll & Benefits', description: 'Salary, allowances, deductions', icon: DollarSign, color: 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary', articles: 8 },
  { id: 'medical', title: 'Medical & Insurance', description: 'Health benefits, claims, panel clinics', icon: Heart, color: 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive', articles: 15 },
  { id: 'training', title: 'Learning & Development', description: 'Training programs, certifications', icon: GraduationCap, color: 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-accent-foreground', articles: 10 },
  { id: 'policies', title: 'Company Policies', description: 'HR policies, code of conduct', icon: Shield, color: 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground', articles: 20 },
  { id: 'career', title: 'Career & Growth', description: 'Promotions, transfers, job postings', icon: Briefcase, color: 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground', articles: 6 },
];

const QUICK_LINKS = [
  { title: 'Apply for Leave', href: '/hr/requests', icon: Calendar },
  { title: 'Submit Expense Claim', href: '/hr/requests', icon: DollarSign },
  { title: 'Update Personal Info', href: '/hr/employee-update', icon: Users },
  { title: 'View Payslip', href: '#', icon: FileText },
  { title: 'Book Training', href: '/hr/training', icon: GraduationCap },
  { title: 'Report Problem', href: '/hr/problem-reporting', icon: MessageSquare },
];

const FAQS = [
  {
    category: 'leave',
    question: 'How many days of annual leave am I entitled to?',
    answer: 'Annual leave entitlement depends on your years of service. Employees with less than 2 years get 14 days, 2-5 years get 18 days, and more than 5 years get 22 days per year.',
  },
  {
    category: 'leave',
    question: 'Can I carry forward unused annual leave?',
    answer: 'Yes, up to 5 days of unused annual leave can be carried forward to the next year. Carried forward leave must be utilized within the first quarter (Q1).',
  },
  {
    category: 'medical',
    question: 'How do I claim medical expenses?',
    answer: 'Submit your medical claim through the HR portal within 30 days of the visit. Attach the original receipt and medical certificate (if applicable). Claims are processed within 5 working days.',
  },
  {
    category: 'medical',
    question: 'Which panel clinics can I visit?',
    answer: 'Visit the HR Info Centre > Medical & Insurance section for the full list of panel clinics. You can also download the Panel Clinic Directory PDF.',
  },
  {
    category: 'payroll',
    question: 'When is salary credited?',
    answer: 'Salary is credited on the 25th of each month. If the 25th falls on a weekend or public holiday, salary will be credited on the preceding working day.',
  },
  {
    category: 'payroll',
    question: 'How do I update my bank account details?',
    answer: 'Submit the Bank Account Change Form through HR Portal with a copy of your new bank statement or passbook. Allow 1 pay cycle for the change to take effect.',
  },
  {
    category: 'training',
    question: 'How do I apply for external training?',
    answer: 'Submit the Training Request Form at least 2 weeks before the training date. Include course details, costs, and justification. Approval depends on budget and relevance to your role.',
  },
];

const HR_CONTACTS = [
  { name: 'HR Helpdesk (Prai)', phone: '+604-380 8888', email: 'hr.prai@ioigroup.com', hours: 'Mon-Fri 8:00 AM - 5:00 PM' },
  { name: 'HR Helpdesk (Johor)', phone: '+607-252 8888', email: 'hr.johor@ioigroup.com', hours: 'Mon-Fri 8:00 AM - 5:00 PM' },
  { name: 'Payroll Inquiries', phone: '+604-380 8800', email: 'payroll@ioigroup.com', hours: 'Mon-Fri 9:00 AM - 4:00 PM' },
];

export default function InfoCentrePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/hr" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">HR Info Centre</h1>
                  <p className="text-xs text-muted-foreground">Employee Self-Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, FAQs, policies..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base"
          />
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.title} to={link.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary/30 hover:bg-primary/5 transition-colors text-center"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium line-clamp-2">{link.title}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Browse by Topic
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INFO_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className="cursor-pointer"
                >
                  <Card className={cn(
                    'h-full transition-colors',
                    selectedCategory === category.id && 'border-primary ring-1 ring-primary/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', category.color)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{category.title}</h3>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {category.articles} articles
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              {selectedCategory ? `Showing FAQs for ${INFO_CATEGORIES.find((c) => c.id === selectedCategory)?.title}` : 'Browse common questions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQs.map((faq, index: number) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-sm text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm">No FAQs found matching your search</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Common Forms & Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Leave Application Form', type: 'PDF' },
                { name: 'Medical Claim Form', type: 'PDF' },
                { name: 'Training Request Form', type: 'DOCX' },
                { name: 'Employee Handbook 2026', type: 'PDF' },
                { name: 'Panel Clinic Directory', type: 'PDF' },
                { name: 'Code of Conduct', type: 'PDF' },
              ].map((doc) => (
                <Button key={doc.name} variant="outline" className="justify-start h-auto py-3">
                  <FileText className="h-4 w-4 mr-2 shrink-0" />
                  <span className="text-left text-sm truncate">{doc.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">{doc.type}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact HR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact HR
            </CardTitle>
            <CardDescription>Need help? Reach out to our HR team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {HR_CONTACTS.map((contact) => (
                <div key={contact.name} className="p-4 rounded-lg border">
                  <h4 className="font-medium text-sm">{contact.name}</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {contact.phone}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {contact.email}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {contact.hours}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
