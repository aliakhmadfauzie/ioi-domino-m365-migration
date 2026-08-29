// Notifications Panel - Slide-out panel with real-time task alerts

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  ChevronRight,
  Zap,
  Calendar,
  Eye,

  Inbox,
  RefreshCw,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  CheckCheck,
  Trash2,
  TestTube2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import {
  type MainDBIT,
} from '@/generated/models/main-dbit-model';
import { formatDistanceToNow, differenceInDays, differenceInHours } from 'date-fns';
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications';
import { useAtom } from 'jotai';
import { notificationPreferencesAtom, type RealtimeNotification } from '@/store/notification-store';

interface NotificationItem {
  id: number;
  title: string;
  formCode: string;
  requestor: string;
  submittedDate: string | undefined;
  status: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  urgencyLabel: string;
  department: string;
  workflowStage: number;
}

function getUrgencyFromDate(submittedDate: string | undefined): { level: 'low' | 'medium' | 'high' | 'critical'; label: string } {
  if (!submittedDate) return { level: 'low', label: 'Normal' };
  
  const hours = differenceInHours(new Date(), new Date(submittedDate));
  const days = differenceInDays(new Date(), new Date(submittedDate));
  
  if (days >= 7) return { level: 'critical', label: 'Overdue' };
  if (days >= 3) return { level: 'high', label: 'Urgent' };
  if (hours >= 24) return { level: 'medium', label: 'Pending' };
  return { level: 'low', label: 'New' };
}

const urgencyStyles = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-l-red-500',
    text: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle,
    badgeBg: 'bg-red-100 dark:bg-red-950/50',
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-l-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    icon: Zap,
    badgeBg: 'bg-orange-100 dark:bg-orange-950/50',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-l-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    icon: Clock,
    badgeBg: 'bg-amber-100 dark:bg-amber-950/50',
  },
  low: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-l-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle,
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/50',
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
} as const;

function NotificationCard({ item, onNavigate }: { item: NotificationItem; onNavigate: (path: string) => void }) {
  const style = urgencyStyles[item.urgencyLevel];
  const UrgencyIcon = style.icon;
  
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'relative p-4 rounded-xl border border-l-4 transition-all duration-200 cursor-pointer group',
        'hover:shadow-md hover:-translate-y-0.5',
        'bg-card',
        style.border
      )}
      onClick={() => onNavigate(`/approvals`)}
    >
      {/* Urgency indicator */}
      <div className="flex items-start gap-3">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
          style.badgeBg
        )}>
          <FileText className={cn('h-5 w-5', style.text)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono px-1.5 py-0">
              {item.formCode}
            </Badge>
            <Badge className={cn('text-xs', style.badgeBg, style.text, 'border-0')}>
              <UrgencyIcon className="h-3 w-3 mr-1" />
              {item.urgencyLabel}
            </Badge>
          </div>
          
          <h4 className="font-medium text-foreground text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {item.title || 'Untitled Request'}
          </h4>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.requestor?.split('@')[0] || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {item.submittedDate 
                ? formatDistanceToNow(new Date(item.submittedDate), { addSuffix: true })
                : 'Just now'}
            </span>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </motion.div>
  );
}

// Real-time notification card
function RealtimeNotificationCard({ 
  notification, 
  onNavigate,
  onMarkRead,
  onRemove,
}: { 
  notification: RealtimeNotification; 
  onNavigate: (path: string) => void;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const style = urgencyStyles[notification.urgency];
  const UrgencyIcon = style.icon;
  
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'relative p-4 rounded-xl border border-l-4 transition-all duration-200 cursor-pointer group',
        'hover:shadow-md hover:-translate-y-0.5',
        notification.read ? 'bg-muted/50' : 'bg-card',
        style.border,
        !notification.read && 'ring-1 ring-primary/20'
      )}
      onClick={() => {
        onMarkRead(notification.id);
        if (notification.actionUrl) onNavigate(notification.actionUrl);
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
      )}
      
      <div className="flex items-start gap-3 pr-4">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
          style.badgeBg
        )}>
          <FileText className={cn('h-5 w-5', style.text)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono px-1.5 py-0">
              {notification.formCode}
            </Badge>
            <Badge className={cn('text-xs', style.badgeBg, style.text, 'border-0')}>
              <UrgencyIcon className="h-3 w-3 mr-1" />
              {notification.urgency}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {notification.department}
            </Badge>
          </div>
          
          <h4 className={cn(
            'font-medium text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors',
            notification.read ? 'text-muted-foreground' : 'text-foreground'
          )}>
            {notification.title}
          </h4>
          
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {notification.requestorName && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {notification.requestorName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
      
      {/* Quick actions on hover */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          className="h-6 w-6 rounded bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center text-destructive transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

interface NotificationsPanelProps {
  triggerClassName?: string;
}

export function NotificationsPanel({ triggerClassName }: NotificationsPanelProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'realtime' | 'pending' | 'urgent'>('realtime');
  const [preferences, setPreferences] = useAtom(notificationPreferencesAtom);
  
  // Real-time notifications
  const {
    notifications: realtimeNotifications,
    unreadCount,
    urgentUnreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    triggerTestNotification,
  } = useRealtimeNotifications({ enableSimulation: false });
  
  const { data: submissions = [], isLoading, refetch } = useMainDBITList();
  
  // Transform submissions into notification items (pending tasks)
  const pendingNotifications = useMemo(() => {
    const pendingSubmissions = submissions.filter((s: MainDBIT) => 
      s.currentStatus === 'Submitted' || 
      s.currentStatus === 'PendingIT' || 
      s.currentStatus === 'Under Review' || 
      s.currentStatus === 'In Progress' || 
      s.currentStatus === 'PendingITPIC'
    );
    
    return pendingSubmissions.map((s: MainDBIT): NotificationItem => {
      const urgency = getUrgencyFromDate(s.submitteddate);
      return {
        id: s.id,
        title: s.title || 'Untitled Request',
        formCode: s.formcode || 'FORM',
        requestor: s.requestoremail || 'Unknown',
        submittedDate: s.submitteddate,
        status: s.currentStatus || 'Unknown',
        urgencyLevel: urgency.level,
        urgencyLabel: urgency.label,
        department: 'IT',
        workflowStage: s.workflowstage || 1,
      };
    }).sort((a: NotificationItem, b: NotificationItem) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const urgencyDiff = urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
      if (urgencyDiff !== 0) return urgencyDiff;
      
      const aDate = a.submittedDate ? new Date(a.submittedDate).getTime() : Date.now();
      const bDate = b.submittedDate ? new Date(b.submittedDate).getTime() : Date.now();
      return aDate - bDate;
    });
  }, [submissions]);
  
  const urgentPendingCount = useMemo(() => 
    pendingNotifications.filter((n: NotificationItem) => n.urgencyLevel === 'critical' || n.urgencyLevel === 'high').length,
    [pendingNotifications]
  );
  
  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };
  
  const totalCount = realtimeNotifications.length + pendingNotifications.length;
  const hasCritical = realtimeNotifications.some((n: RealtimeNotification) => n.urgency === 'critical') || 
    pendingNotifications.some((n: NotificationItem) => n.urgencyLevel === 'critical');
  
  const toggleSound = () => {
    setPreferences((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'relative bg-white/10 hover:bg-white/20 text-white border-white/20',
            triggerClassName
          )}
        >
          <Bell className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Notifications</span>
          {totalCount > 0 && (
            <Badge 
              className={cn(
                'ml-2 h-5 min-w-5 px-1.5 text-xs border-0',
                hasCritical 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : unreadCount > 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/20 text-white'
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount > 0 ? unreadCount : totalCount}
            </Badge>
          )}
          {/* Live indicator */}
          <span className={cn(
            'absolute -top-1 -right-1 flex h-3 w-3',
            connectionStatus !== 'connected' && 'opacity-50'
          )}>
            {hasCritical ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </>
            ) : unreadCount > 0 ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-white/20" />
            )}
          </span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-blue-800 text-white p-6">
          <SheetHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-white text-lg flex items-center gap-2">
                    Notifications
                    {/* Connection status */}
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={cn(
                          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
                          connectionStatus === 'connected' && 'bg-emerald-500/20 text-emerald-200',
                          connectionStatus === 'connecting' && 'bg-amber-500/20 text-amber-200',
                          connectionStatus === 'disconnected' && 'bg-red-500/20 text-red-200'
                        )}>
                          {connectionStatus === 'connected' && <><Wifi className="h-3 w-3" /> Live</>}
                          {connectionStatus === 'connecting' && <><Wifi className="h-3 w-3 animate-pulse" /> Connecting</>}
                          {connectionStatus === 'disconnected' && <><WifiOff className="h-3 w-3" /> Offline</>}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Real-time notifications are {connectionStatus}
                      </TooltipContent>
                    </Tooltip>
                  </SheetTitle>
                  <p className="text-white/80 text-sm">
                    {unreadCount} unread • {totalCount} total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      onClick={toggleSound}
                    >
                      {preferences.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {preferences.soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => refetch()}
                      disabled={isLoading}
                    >
                      <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SheetHeader>
          
          {/* Quick Stats */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xl font-bold text-white">{unreadCount}</p>
              <p className="text-xs text-white/70">Unread</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xl font-bold text-white">{pendingNotifications.length}</p>
              <p className="text-xs text-white/70">Pending</p>
            </div>
            {urgentUnreadCount > 0 && (
              <div className="flex-1 bg-red-500/20 rounded-lg px-3 py-2 border border-red-400/30">
                <p className="text-xl font-bold text-white">{urgentUnreadCount}</p>
                <p className="text-xs text-red-200">Urgent</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'realtime' | 'pending' | 'urgent')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="realtime" className="text-xs sm:text-sm">
                <Wifi className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
                Live ({realtimeNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pending ({pendingNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-xs sm:text-sm">
                <AlertTriangle className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
                Urgent ({urgentPendingCount + urgentUnreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Quick Actions Bar */}
        {activeTab === 'realtime' && realtimeNotifications.length > 0 && (
          <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{unreadCount} unread notifications</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={clearAll}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          </div>
        )}
        
        {/* Notifications List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {/* Realtime Tab */}
              {activeTab === 'realtime' && (
                realtimeNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Wifi className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      No new notifications
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Real-time alerts will appear here
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={triggerTestNotification}
                    >
                      <TestTube2 className="h-4 w-4 mr-2" />
                      Test Notification
                    </Button>
                  </motion.div>
                ) : (
                  realtimeNotifications.map((notification: RealtimeNotification) => (
                    <RealtimeNotificationCard
                      key={notification.id}
                      notification={notification}
                      onNavigate={handleNavigate}
                      onMarkRead={markAsRead}
                      onRemove={removeNotification}
                    />
                  ))
                )
              )}
              
              {/* Pending Tab */}
              {activeTab === 'pending' && (
                pendingNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
                      <Inbox className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      All caught up!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      No pending tasks at the moment
                    </p>
                  </motion.div>
                ) : (
                  pendingNotifications.map((item: NotificationItem) => (
                    <NotificationCard 
                      key={item.id} 
                      item={item} 
                      onNavigate={handleNavigate}
                    />
                  ))
                )
              )}
              
              {/* Urgent Tab */}
              {activeTab === 'urgent' && (
                <>
                  {/* Urgent realtime notifications */}
                  {realtimeNotifications
                    .filter((n: RealtimeNotification) => n.urgency === 'critical' || n.urgency === 'high')
                    .map((notification: RealtimeNotification) => (
                      <RealtimeNotificationCard
                        key={notification.id}
                        notification={notification}
                        onNavigate={handleNavigate}
                        onMarkRead={markAsRead}
                        onRemove={removeNotification}
                      />
                    ))
                  }
                  
                  {/* Urgent pending tasks */}
                  {pendingNotifications
                    .filter((n: NotificationItem) => n.urgencyLevel === 'critical' || n.urgencyLevel === 'high')
                    .map((item: NotificationItem) => (
                      <NotificationCard 
                        key={item.id} 
                        item={item} 
                        onNavigate={handleNavigate}
                      />
                    ))
                  }
                  
                  {/* Empty state */}
                  {urgentPendingCount + urgentUnreadCount === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground">
                        No urgent items
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        No critical or high priority tasks pending
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
        
        {/* Footer Actions */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-border bg-muted/30">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleNavigate('/approvals')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View All Tasks
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default NotificationsPanel;