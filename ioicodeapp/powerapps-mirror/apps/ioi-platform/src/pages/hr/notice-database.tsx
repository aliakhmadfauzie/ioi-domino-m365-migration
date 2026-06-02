/**
 * HR Notice Database
 * Company announcements and HR notices
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Pin,
  Eye,
  Download,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  FileText,
  Tag,
  Megaphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isAfter, subDays } from 'date-fns';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  author: string;
  department: string;
  site: string;
  publishDate: Date;
  expiryDate?: Date;
  isPinned: boolean;
  views: number;
  attachments: number;
}

const MOCK_NOTICES: Notice[] = [
  {
    id: '1',
    title: 'Public Holiday Notice - Hari Raya Aidilfitri 2026',
    content: 'Please be informed that the office will be closed on the following dates for Hari Raya Aidilfitri celebrations. All employees are advised to complete urgent tasks before the holiday period.',
    category: 'holiday',
    priority: 'high',
    author: 'HR Department',
    department: 'Human Resources',
    site: 'All Sites',
    publishDate: new Date(2026, 4, 1),
    expiryDate: new Date(2026, 4, 15),
    isPinned: true,
    views: 342,
    attachments: 1,
  },
  {
    id: '2',
    title: 'Updated Leave Policy - Effective June 2026',
    content: 'The company has revised its leave policy to provide more flexibility. Key changes include increased annual leave entitlement and introduction of wellness days.',
    category: 'policy',
    priority: 'high',
    author: 'HR Director',
    department: 'Human Resources',
    site: 'All Sites',
    publishDate: new Date(2026, 4, 3),
    isPinned: true,
    views: 856,
    attachments: 2,
  },
  {
    id: '3',
    title: 'Annual Health Screening Schedule',
    content: 'Annual health screening for all employees will be conducted from May 20-30, 2026. Please register through the HR portal.',
    category: 'health',
    priority: 'medium',
    author: 'Occupational Health',
    department: 'Human Resources',
    site: 'Prai',
    publishDate: new Date(2026, 4, 5),
    expiryDate: new Date(2026, 5, 1),
    isPinned: false,
    views: 234,
    attachments: 1,
  },
  {
    id: '4',
    title: 'New Employee Orientation - May Batch',
    content: 'Welcome to IOI Oleochemical! New employee orientation will be held on May 15, 2026. Please arrive by 8:30 AM.',
    category: 'training',
    priority: 'medium',
    author: 'Training Team',
    department: 'Human Resources',
    site: 'All Sites',
    publishDate: new Date(2026, 4, 2),
    expiryDate: new Date(2026, 4, 16),
    isPinned: false,
    views: 67,
    attachments: 0,
  },
  {
    id: '5',
    title: 'Safety Reminder - Proper PPE Usage',
    content: 'A reminder to all production staff to wear appropriate PPE at all times in designated areas. Safety is everyone\'s responsibility.',
    category: 'safety',
    priority: 'high',
    author: 'SHE Department',
    department: 'Safety, Health & Environment',
    site: 'All Sites',
    publishDate: new Date(2026, 3, 28),
    isPinned: false,
    views: 445,
    attachments: 1,
  },
  {
    id: '6',
    title: 'IT System Maintenance - May 10, 2026',
    content: 'Scheduled maintenance will be performed on core systems. Please save your work and log out by 6 PM.',
    category: 'it',
    priority: 'low',
    author: 'IT Department',
    department: 'Information Technology',
    site: 'All Sites',
    publishDate: new Date(2026, 4, 7),
    expiryDate: new Date(2026, 4, 11),
    isPinned: false,
    views: 189,
    attachments: 0,
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'holiday': return Calendar;
    case 'policy': return FileText;
    case 'health': return CheckCircle2;
    case 'training': return User;
    case 'safety': return AlertCircle;
    case 'it': return Info;
    default: return Bell;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'holiday': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-accent-foreground';
    case 'policy': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
    case 'health': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
    case 'training': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
    case 'safety': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
    case 'it': return 'bg-muted text-foreground dark:bg-muted dark:text-muted-foreground';
    default: return 'bg-muted';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
    case 'medium': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
    case 'low': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
    default: return 'bg-muted';
  }
};

export default function NoticeDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotices = MOCK_NOTICES.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    const matchesSite = siteFilter === 'all' || notice.site === siteFilter || notice.site === 'All Sites';
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'pinned' && notice.isPinned) ||
      (activeTab === 'recent' && isAfter(notice.publishDate, subDays(new Date(), 7)));
    return matchesSearch && matchesCategory && matchesSite && matchesTab;
  });

  const pinnedNotices = filteredNotices.filter((n) => n.isPinned);
  const regularNotices = filteredNotices.filter((n) => !n.isPinned);

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
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">HR Notice Database</h1>
                  <p className="text-xs text-muted-foreground">Company Announcements</p>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="hidden sm:flex">
              {MOCK_NOTICES.length} Notices
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="it">IT</SelectItem>
            </SelectContent>
          </Select>
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              <SelectItem value="Prai">Prai</SelectItem>
              <SelectItem value="Johor">Johor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="pinned">
              <Pin className="h-3 w-3 mr-1" />
              Pinned
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="h-3 w-3 mr-1" />
              Recent
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pinned Notices */}
        {activeTab === 'all' && pinnedNotices.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Pin className="h-4 w-4" /> Pinned Notices
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {pinnedNotices.map((notice) => {
                const CategoryIcon = getCategoryIcon(notice.category);
                return (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -2 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', getCategoryColor(notice.category))}>
                            <CategoryIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm line-clamp-2">{notice.title}</h4>
                              <Pin className="h-4 w-4 text-primary shrink-0" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={cn('text-xs', getPriorityColor(notice.priority))}>
                                {notice.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notice.publishDate, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Notices */}
        <div className="space-y-3">
          {activeTab === 'all' && pinnedNotices.length > 0 && (
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Bell className="h-4 w-4" /> All Notices
            </h3>
          )}
          <div className="space-y-3">
            {(activeTab === 'all' ? regularNotices : filteredNotices).map((notice) => {
              const CategoryIcon = getCategoryIcon(notice.category);
              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 4 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <Card className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', getCategoryColor(notice.category))}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">{notice.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{notice.content}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {notice.category}
                            </Badge>
                            <Badge className={cn('text-xs', getPriorityColor(notice.priority))}>
                              {notice.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {notice.views}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(notice.publishDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No notices found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Notice Detail Dialog */}
      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNotice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(selectedNotice.category)}>
                    {selectedNotice.category}
                  </Badge>
                  <Badge className={getPriorityColor(selectedNotice.priority)}>
                    {selectedNotice.priority}
                  </Badge>
                  {selectedNotice.isPinned && (
                    <Badge variant="outline">
                      <Pin className="h-3 w-3 mr-1" /> Pinned
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-lg">{selectedNotice.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> {selectedNotice.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" /> {selectedNotice.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> {format(selectedNotice.publishDate, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p>{selectedNotice.content}</p>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                </div>
                {selectedNotice.attachments > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Attachments</p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Download ({selectedNotice.attachments} file{selectedNotice.attachments > 1 ? 's' : ''})
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {selectedNotice.views} views
                  </span>
                  {selectedNotice.expiryDate && (
                    <span>Expires: {format(selectedNotice.expiryDate, 'MMM d, yyyy')}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
