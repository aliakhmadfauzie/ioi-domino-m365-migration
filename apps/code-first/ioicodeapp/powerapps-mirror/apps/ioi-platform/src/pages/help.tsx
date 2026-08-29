// Help & Support Page - Comprehensive support resources for IOI Acidchem Enterprise Platform

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Home,
  FileCheck,
  Settings,
  Building2,
  ClipboardList,
  Shield,
  Zap,
  Monitor,
  Smartphone,
  Key,
  RefreshCw,
  Send,
  Eye,
  Download,
  Filter,
  BarChart3,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface GuideStep {
  step: number;
  title: string;
  description: string;
}

interface Resource {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  type: 'document' | 'video' | 'guide' | 'page';
}

interface Department {
  code: string;
  name: string;
  description: string;
  modules: string[];
}

// Comprehensive FAQs organized by category
const faqs: FAQ[] = [
  // Getting Started
  {
    question: 'How do I access the IOI Acidchem Enterprise Platform?',
    answer: 'The platform is accessible via your web browser at the company portal. Login is handled through your Microsoft 365 account - simply use your company email and password. The platform supports both desktop and mobile browsers.',
    category: 'getting-started',
  },
  {
    question: 'What are the different user roles in the system?',
    answer: 'There are four main roles: Employee (Initiator) - can submit forms and track their own submissions; Manager - can approve requests from their team and access team reports; Approver - designated approval authority for specific workflows; Administrator - full system access including reports, user management, and configuration.',
    category: 'getting-started',
  },
  {
    question: 'How do I navigate between departments?',
    answer: 'From the Home page, you will see all available departments displayed as cards. Click on any department card to access its modules and forms. Use the "Back" button or sidebar navigation to return to the home page. On mobile devices, use the bottom navigation bar to switch between sections.',
    category: 'getting-started',
  },
  
  // Submissions
  {
    question: 'How do I submit a new request or form?',
    answer: 'Navigate to the appropriate department (IT, HR, Store, Finance, etc.) and select the relevant module. Click on the form you need and fill in all required fields. Required fields are marked with an asterisk (*). Review your information, add any attachments if needed, then click "Submit". You will receive a confirmation with a reference number.',
    category: 'submissions',
  },
  {
    question: 'Can I save a form as draft and complete it later?',
    answer: 'Yes, most forms support draft saving. Click "Save as Draft" instead of "Submit" to save your progress. Access your drafts from "My Submissions" and filter by "Draft" status. Drafts are automatically saved every few minutes to prevent data loss.',
    category: 'submissions',
  },
  {
    question: 'How do I track my submission status?',
    answer: 'Go to "My Submissions" from the sidebar or home page. You will see all your requests with current status. Click on any submission to view detailed workflow history, current stage, and approval progress. You can also filter submissions by status, date range, or department.',
    category: 'submissions',
  },
  {
    question: 'What do the different status colors mean?',
    answer: 'Green (Approved/Completed) - Request fully approved and processed. Yellow/Orange (Pending) - Awaiting approval at current stage. Blue (In Progress) - Being processed or reviewed. Red (Rejected) - Request was denied. Gray (Draft) - Not yet submitted, saved for later.',
    category: 'submissions',
  },
  {
    question: 'How do I attach documents to my submission?',
    answer: 'When filling out a form, look for the "Attachments" or "Supporting Documents" section. Click "Add Files" or drag and drop files. Supported formats include PDF, Word (.doc, .docx), Excel (.xls, .xlsx), and images (JPG, PNG). Maximum file size is 10MB per file.',
    category: 'submissions',
  },
  {
    question: 'Can I withdraw or cancel a submitted request?',
    answer: 'You can withdraw a pending submission before it is approved. Go to "My Submissions", click on the request, and select "Withdraw" if available. Once a request is approved or processed, it cannot be withdrawn - you will need to submit a new request or contact the relevant department.',
    category: 'submissions',
  },
  {
    question: 'How do I use Quick Submit for field workers?',
    answer: 'Quick Submit is available from the home page via the "Quick Submit" button or at /quick-submit. This simplified interface is optimized for mobile devices and allows field workers to submit common forms quickly. Select your department, choose a form type, fill in essential details, and submit.',
    category: 'submissions',
  },
  
  // Approvals
  {
    question: 'How do I approve a request as a manager?',
    answer: 'Access "Approval Queue" from the sidebar or home page. Review pending items assigned to you. Click on any item to see full details. Use the "Approve", "Return for Revision", or "Reject" buttons. Always add comments explaining your decision, especially for rejections.',
    category: 'approvals',
  },
  {
    question: 'What is Batch Approvals and how do I use it?',
    answer: 'Batch Approvals (available at /batch-approvals) lets managers process multiple similar requests at once. Select multiple items by checking the boxes, then click "Batch Approve" or "Batch Reject". This is efficient for routine approvals like overtime requests or leave applications.',
    category: 'approvals',
  },
  {
    question: 'Can I delegate my approvals to someone else?',
    answer: 'Yes, contact your administrator or use Settings to configure delegation. You can set up automatic delegation for vacation periods or assign a permanent backup approver. You can also escalate individual requests to another approver using the "Escalate" button on the submission detail page.',
    category: 'approvals',
  },
  {
    question: 'What happens if I reject a request?',
    answer: 'When you reject a request, the submitter receives a notification with your rejection reason. They can view the feedback, make necessary changes, and resubmit if appropriate. Always provide clear, actionable feedback in your rejection comments.',
    category: 'approvals',
  },
  {
    question: 'How do I view approval history for my team?',
    answer: 'As a manager, access the Manager Dashboard from the home page or sidebar. This shows your team\'s submissions, approval statistics, and workflow metrics. You can also view detailed audit trails for any submission you have access to.',
    category: 'approvals',
  },
  
  // Departments & Forms
  {
    question: 'What departments are available in the system?',
    answer: 'The platform supports: IT (User Access, Support, Hardware, Infrastructure, SAP, Documentation, Disaster Recovery), HR (Recruitment, Leave, Health, Performance, Lifecycle, Succession, Compliance), Store/STR (Operations, Requisition, Procurement, Disposal, Compliance), Finance/FIN (Capital, Credit, Insurance, Service Entry, Vendor), QA (Audits, Defects, CAPAs, Documents, Training, Reports), QC (Laboratory, Specifications, Testing, Certificates, Actions), Production/PROD (SAM Database, TPM, CCP Monitoring, Material Master, Reports, Process Control), SHE (Incidents, HIRADC, Chemical, Fire, PPE, Environment, Occupational Health).',
    category: 'departments',
  },
  {
    question: 'How do I find a specific form?',
    answer: 'Use the global search (Ctrl+K or click the search icon) to search for forms by name or code. Alternatively, navigate to the relevant department, then browse modules to find your form. Common forms are also accessible from the department home page.',
    category: 'departments',
  },
  {
    question: 'What is the IT External Access Form (EAF) used for?',
    answer: 'The External Access Form (EAF) is used to request VPN access, Citrix remote access, or other external connectivity to company systems. Submit this form when you need to work remotely or access company resources from outside the office network. Requires manager approval and IT processing.',
    category: 'departments',
  },
  {
    question: 'How do I submit an IT Support ticket?',
    answer: 'Go to IT Department > IT Support module and select "IT Support & Service Request (ITSSR)". Describe your issue clearly, select the priority level, and attach screenshots if helpful. For urgent issues, also contact the IT Help Desk directly at Ext. 1234.',
    category: 'departments',
  },
  {
    question: 'How do I apply for leave?',
    answer: 'Navigate to HR Department > Leave Management module > Leave Application (LVE). Select your leave type, enter dates, and provide a reason. The request goes to your manager for approval, then HR for processing. Check your leave balance before applying.',
    category: 'departments',
  },
  {
    question: 'What is the Material Requisition Form (MRF)?',
    answer: 'The MRF is used to request materials from the store. Go to Store Department > Requisition module > Material Requisition Form. Specify items needed, quantities, and purpose. Requires HOD approval before store processing.',
    category: 'departments',
  },
  
  // Reports & Analytics
  {
    question: 'How do I access reports and analytics?',
    answer: 'The Reports section is accessible from the sidebar. Managers and administrators can view department-specific reports, submission statistics, approval metrics, and trend analysis. Use filters to narrow down by date range, department, or form type.',
    category: 'reports',
  },
  {
    question: 'Can I export data from the system?',
    answer: 'Yes, most list views and reports support export to Excel. Look for the "Export" or "Download" button. You can export your submissions, approval history, or generate custom reports based on selected filters.',
    category: 'reports',
  },
  {
    question: 'What is the Manager Dashboard?',
    answer: 'The Manager Dashboard provides an overview of your team\'s activity including: pending approvals requiring your action, team submission statistics, workflow bottlenecks, and performance metrics. Access it from the home page if you have manager or approver role.',
    category: 'reports',
  },
  
  // Account & Security
  {
    question: 'How do I reset my password?',
    answer: 'Password management is handled through Microsoft 365. Visit portal.office.com, click "Forgot password" and follow the instructions. For immediate assistance, contact IT Help Desk at Ext. 1234. The platform does not have a separate password - it uses your M365 credentials.',
    category: 'account',
  },
  {
    question: 'Who can see my submissions?',
    answer: 'Your submissions are visible to: yourself, your direct approvers in the workflow chain, department administrators, and system administrators. Other employees cannot see your personal submissions unless they are part of the approval workflow.',
    category: 'account',
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Profile information (name, email, department) is synchronized from Microsoft 365 and cannot be changed directly in this platform. Contact HR to update your official records, which will then sync to this system.',
    category: 'account',
  },
  {
    question: 'How do I change my notification preferences?',
    answer: 'Go to Settings (gear icon in sidebar or header) > Notifications. You can toggle email notifications, push notifications, approval reminders, status updates, and weekly digest emails. Changes are saved automatically.',
    category: 'account',
  },
  
  // Mobile & Accessibility
  {
    question: 'Is there a mobile app?',
    answer: 'The platform is fully responsive and works on mobile browsers. There is no separate mobile app required - simply access the platform URL from your mobile browser. The interface automatically adapts to your screen size with optimized navigation.',
    category: 'mobile',
  },
  {
    question: 'How do I use the Field Worker view?',
    answer: 'Field Worker view (/field-worker) provides a simplified mobile-optimized interface for submitting forms on the go. It features large touch targets, streamlined forms, and quick access to common submissions. Ideal for staff working in the field or factory floor.',
    category: 'mobile',
  },
  
  // Troubleshooting
  {
    question: 'Why can\'t I submit a form?',
    answer: 'Check for: (1) Required fields not filled - look for red error messages, (2) Invalid data format - ensure dates and numbers are correct, (3) Missing attachments if required, (4) Session timeout - refresh the page and try again, (5) Network issues - check your internet connection.',
    category: 'troubleshooting',
  },
  {
    question: 'Why is my submission stuck in pending?',
    answer: 'A submission may be pending because: (1) Approver has not yet reviewed it, (2) Approver is on leave - check with their backup, (3) Additional information is required, (4) System processing delay. Check the submission detail page for the current stage and approver.',
    category: 'troubleshooting',
  },
  {
    question: 'I\'m getting an error message. What should I do?',
    answer: 'Note the exact error message and when it occurred. Try: (1) Refresh the page, (2) Clear browser cache, (3) Try a different browser, (4) Check if the issue persists. If the problem continues, contact IT Help Desk with the error details, your browser type, and steps to reproduce.',
    category: 'troubleshooting',
  },
];

// Platform features guide
const platformFeatures = [
  {
    icon: Home,
    title: 'Department Hub',
    description: 'Central landing page showing all available departments',
    path: '/',
  },
  {
    icon: FileText,
    title: 'My Submissions',
    description: 'Track all your submitted forms and their status',
    path: '/my-submissions',
  },
  {
    icon: CheckCircle,
    title: 'Approval Queue',
    description: 'Review and action pending approvals',
    path: '/approvals',
  },
  {
    icon: ClipboardList,
    title: 'Batch Approvals',
    description: 'Process multiple approvals simultaneously',
    path: '/batch-approvals',
  },
  {
    icon: BarChart3,
    title: 'Manager Dashboard',
    description: 'Team overview and performance metrics',
    path: '/manager-dashboard',
  },
  {
    icon: Zap,
    title: 'Quick Submit',
    description: 'Simplified form submission for field workers',
    path: '/quick-submit',
  },
  {
    icon: Settings,
    title: 'Settings',
    description: 'Manage notifications and preferences',
    path: '/settings',
  },
  {
    icon: BarChart3,
    title: 'Reports',
    description: 'Analytics and data exports',
    path: '/reports',
  },
];

// Step-by-step guides
const submitFormGuide: GuideStep[] = [
  { step: 1, title: 'Navigate to Department', description: 'From the home page, click on the relevant department card (IT, HR, Store, etc.)' },
  { step: 2, title: 'Select Module', description: 'Choose the appropriate module within the department that contains your form' },
  { step: 3, title: 'Choose Form', description: 'Click on the specific form you need to submit' },
  { step: 4, title: 'Fill Required Fields', description: 'Complete all required fields marked with asterisk (*). Review carefully.' },
  { step: 5, title: 'Add Attachments', description: 'Upload any supporting documents if needed (PDF, Word, Excel, Images up to 10MB)' },
  { step: 6, title: 'Submit', description: 'Click "Submit" button. You will receive a confirmation with reference number.' },
];

const approvalGuide: GuideStep[] = [
  { step: 1, title: 'Access Approval Queue', description: 'Click "Approval Queue" or "Tasks" from sidebar or home page' },
  { step: 2, title: 'Review Pending Items', description: 'View list of items awaiting your approval with summary information' },
  { step: 3, title: 'Open Request Details', description: 'Click on an item to view full details, attachments, and history' },
  { step: 4, title: 'Make Decision', description: 'Choose Approve, Return for Revision, or Reject' },
  { step: 5, title: 'Add Comments', description: 'Provide comments explaining your decision (required for rejections)' },
  { step: 6, title: 'Confirm', description: 'Submit your decision. Submitter will be notified of the outcome.' },
];

// Resources
const resources: Resource[] = [
  {
    title: 'User Guide',
    description: 'Complete guide to using the IOI Platform',
    icon: Book,
    link: '#',
    type: 'document',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video walkthroughs',
    icon: Video,
    link: '#',
    type: 'video',
  },
  {
    title: 'Form Templates',
    description: 'Sample completed forms for reference',
    icon: FileText,
    link: '#',
    type: 'document',
  },
  {
    title: 'Approval Workflow Guide',
    description: 'Understanding approval processes',
    icon: CheckCircle,
    link: '#',
    type: 'guide',
  },
  {
    title: 'Quick Submit Guide',
    description: 'Using the mobile-optimized submission',
    icon: Smartphone,
    link: '/quick-submit',
    type: 'page',
  },
  {
    title: 'IT Forms Reference',
    description: 'All IT department forms explained',
    icon: Monitor,
    link: '/it',
    type: 'page',
  },
  {
    title: 'HR Forms Reference',
    description: 'All HR department forms explained',
    icon: Users,
    link: '/hr',
    type: 'page',
  },
  {
    title: 'Settings Guide',
    description: 'Customize your experience',
    icon: Settings,
    link: '/settings',
    type: 'page',
  },
];

// Support channels
const supportChannels = [
  {
    title: 'IT Help Desk',
    description: 'For technical issues, system access, and platform errors',
    icon: Phone,
    contact: 'Ext. 1234',
    email: 'it.helpdesk@ioi.com.my',
    hours: 'Mon-Fri, 8:00 AM - 6:00 PM',
    color: 'bg-primary',
    priority: 'Technical issues, login problems, system errors',
  },
  {
    title: 'HR Support',
    description: 'For HR-related form inquiries and leave questions',
    icon: Users,
    contact: 'Ext. 2345',
    email: 'hr.support@ioi.com.my',
    hours: 'Mon-Fri, 9:00 AM - 5:00 PM',
    color: 'bg-primary',
    priority: 'Leave, recruitment, personnel matters',
  },
  {
    title: 'Finance Support',
    description: 'For finance forms and payment-related queries',
    icon: Building2,
    contact: 'Ext. 3456',
    email: 'finance.support@ioi.com.my',
    hours: 'Mon-Fri, 9:00 AM - 5:00 PM',
    color: 'bg-primary',
    priority: 'Capital requests, vendor, credit management',
  },
  {
    title: 'General Support',
    description: 'For general platform inquiries and feedback',
    icon: Mail,
    contact: 'support@ioi.com.my',
    email: 'support@ioi.com.my',
    hours: 'Response within 24 hours',
    color: 'bg-primary',
    priority: 'General questions, suggestions, feedback',
  },
];

// Department reference
const departments: Department[] = [
  {
    code: 'IT',
    name: 'Information Technology',
    description: 'IT systems, access, support, and infrastructure',
    modules: ['User & Access Management', 'IT Support', 'Hardware Management', 'Infrastructure', 'SAP Systems', 'Documentation', 'Disaster Recovery'],
  },
  {
    code: 'HR',
    name: 'Human Resources',
    description: 'HR processes, leave, recruitment, and compliance',
    modules: ['Recruitment', 'Leave Management', 'Health & Compliance', 'Performance', 'Employee Lifecycle', 'Succession Planning', 'Compliance Records'],
  },
  {
    code: 'STR',
    name: 'Store',
    description: 'Store operations, inventory, and procurement',
    modules: ['Store Operations', 'Requisition', 'Procurement', 'Disposal', 'Compliance'],
  },
  {
    code: 'FIN',
    name: 'Finance',
    description: 'Financial requests, credit, and vendor management',
    modules: ['Capital & Expenditure', 'Credit Management', 'Insurance & Claims', 'Service Entry', 'Vendor Management'],
  },
  {
    code: 'QA',
    name: 'Quality Assurance',
    description: 'Audits, defects, CAPAs, and quality documentation',
    modules: ['Audits', 'Defects', 'CAPAs', 'Documents', 'Training', 'Reports'],
  },
  {
    code: 'QC',
    name: 'Quality Control',
    description: 'Laboratory, testing, specifications, and certificates',
    modules: ['Laboratory Management', 'Product Specifications', 'Testing & Results', 'Certificates & Compliance', 'Quality Actions', 'QC Information'],
  },
  {
    code: 'PROD',
    name: 'Production',
    description: 'Production processes, monitoring, and reports',
    modules: ['SAM Database', 'TPM Database', 'CCP Monitoring', 'Material Master', 'Production Reports', 'Process Control'],
  },
  {
    code: 'SHE',
    name: 'Safety, Health & Environment',
    description: 'Safety incidents, risk assessment, and compliance',
    modules: ['Incident Reporting', 'HIRADC', 'Chemical Management', 'Fire Safety', 'PPE Management', 'Environment', 'Occupational Health'],
  },
];

const categories = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'submissions', label: 'Submissions', icon: Send },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle },
  { id: 'departments', label: 'Departments & Forms', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'mobile', label: 'Mobile Access', icon: Smartphone },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
];

export default function HelpPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Determine back navigation based on current path
  const isInDepartment = location.pathname.startsWith('/it') || location.pathname.startsWith('/hr');
  const backPath = isInDepartment ? location.pathname.split('/').slice(0, 2).join('/') : '/';

  const filteredFaqs = faqs.filter((faq: FAQ) => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#1B5E20] text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Help & Support</h1>
                <p className="text-white/70">IOI Acidchem Enterprise Platform Guide</p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input
                placeholder="Search help topics, forms, departments..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="bg-white border flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="faq" className="data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white">FAQs</TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white">How-To Guides</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white">Platform Features</TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white">Departments</TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white">Resources</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#1B5E20] data-[state=active]:text-white">Contact Support</TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faq">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="space-y-6"
            >
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: { id: string; label: string; icon: React.ElementType }) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'gap-1.5',
                        selectedCategory === cat.id && 'bg-[#1B5E20] hover:bg-[#2E7D32]'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>

              {/* FAQ List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#1B5E20]" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} found
                    {selectedCategory !== 'all' && ` in ${categories.find((c: { id: string; label: string }) => c.id === selectedCategory)?.label}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{searchQuery}"</p>
                      <p className="text-sm mt-1">Try different keywords or browse all topics</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq: FAQ, index: number) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-start gap-3">
                              <HelpCircle className="h-5 w-5 text-[#1B5E20] shrink-0 mt-0.5" />
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* How-To Guides Tab */}
          <TabsContent value="guides">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="space-y-6"
            >
              {/* Submit Form Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-[#1B5E20]" />
                    How to Submit a Form
                  </CardTitle>
                  <CardDescription>Step-by-step guide to submitting any form in the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submitFormGuide.map((step: GuideStep) => (
                      <div key={step.step} className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center shrink-0 font-semibold text-sm">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Approval Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#1B5E20]" />
                    How to Approve Requests (For Managers)
                  </CardTitle>
                  <CardDescription>Guide for managers and approvers to process requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {approvalGuide.map((step: GuideStep) => (
                      <div key={step.step} className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center shrink-0 font-semibold text-sm">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="bg-[#E8F5E9] border-[#1B5E20]/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#1B5E20] mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-[#1B5E20]/80">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Use <strong>Ctrl+K</strong> (or Cmd+K on Mac) to quickly search for forms, submissions, or help topics</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#1B5E20]/80">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Enable email notifications in Settings to get instant updates on your submissions</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#1B5E20]/80">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Use <strong>Batch Approvals</strong> to process multiple similar requests at once</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#1B5E20]/80">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Bookmark frequently used forms for quick access</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-[#1B5E20]/80">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Check "My Submissions" regularly to track the status of your requests</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Platform Features Tab */}
          <TabsContent value="features">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features Overview</CardTitle>
                  <CardDescription>All the key features available in the IOI Acidchem Enterprise Platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {platformFeatures.map((feature, index: number) => {
                      const Icon = feature.icon;
                      return (
                        <Link
                          key={index}
                          to={feature.path}
                          className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="h-10 w-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-[#1B5E20]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium group-hover:text-[#1B5E20] transition-colors">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#1B5E20] transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Role-based Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-[#1B5E20]" />
                    Role-Based Access
                  </CardTitle>
                  <CardDescription>Features available based on your role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>Employee</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Submit forms across all departments</li>
                        <li>• Track personal submissions</li>
                        <li>• Access Quick Submit for mobile</li>
                        <li>• Manage notification preferences</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Manager</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• All Employee features plus:</li>
                        <li>• Approve/reject team requests</li>
                        <li>• Access Manager Dashboard</li>
                        <li>• Batch approval processing</li>
                        <li>• View team analytics</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-[#1B5E20] hover:bg-[#2E7D32]">Administrator</Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• All Manager features plus:</li>
                        <li>• Full reports access</li>
                        <li>• System configuration</li>
                        <li>• User role management</li>
                        <li>• Audit logs access</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#1B5E20]" />
                    Available Departments
                  </CardTitle>
                  <CardDescription>All departments and their modules in the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {departments.map((dept: Department, index: number) => (
                      <motion.div key={dept.code} variants={fadeIn}>
                        <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">{dept.code}</Badge>
                                <h4 className="font-semibold">{dept.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                            </div>
                            <Link to={`/${dept.code.toLowerCase()}`}>
                              <Button variant="ghost" size="sm" className="text-[#1B5E20]">
                                View <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {dept.modules.map((module: string, mIndex: number) => (
                              <Badge key={mIndex} variant="secondary" className="text-xs">
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="grid md:grid-cols-2 gap-4"
            >
              {resources.map((resource: Resource, index: number) => (
                <motion.div key={index} variants={fadeIn}>
                  <Link to={resource.link}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center shrink-0">
                            <resource.icon className="h-6 w-6 text-[#1B5E20]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground group-hover:text-[#1B5E20] transition-colors">{resource.title}</h3>
                              <Badge variant="outline" className="text-xs capitalize">
                                {resource.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {resource.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#1B5E20] transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {supportChannels.map((channel, index: number) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', channel.color)}>
                            <channel.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{channel.title}</h3>
                            <p className="text-sm text-muted-foreground">{channel.description}</p>
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-[#1B5E20]" />
                                <span className="text-sm font-medium">{channel.contact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[#1B5E20]" />
                                <a href={`mailto:${channel.email}`} className="text-sm text-[#1B5E20] hover:underline">
                                  {channel.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{channel.hours}</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs text-muted-foreground">
                                <strong>Contact for:</strong> {channel.priority}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-[#1B5E20]" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#E8F5E9] rounded-lg">
                      <div className="h-3 w-3 rounded-full bg-[#1B5E20] animate-pulse" />
                      <span className="text-sm font-medium text-[#1B5E20]">All systems operational</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">Platform</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-[#1B5E20]" /> Online
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">Database</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-[#1B5E20]" /> Healthy
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">Email Notifications</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-[#1B5E20]" /> Active
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Critical System Issues</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        For critical system outages or security incidents affecting multiple users, contact the IT Emergency Line immediately.
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        IT Emergency: Ext. 1111 (24/7)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>IOI Acidchem Enterprise Platform v2.0</p>
          <p className="mt-1">Last updated: May 2026</p>
        </motion.div>
      </div>
    </div>
  );
}