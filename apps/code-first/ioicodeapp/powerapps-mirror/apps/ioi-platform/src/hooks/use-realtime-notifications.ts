// Real-time Notifications Hook
// Simulates real-time notification delivery with polling and toast alerts

import { useEffect, useCallback, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'sonner';
import {
  notificationsAtom,
  notificationPreferencesAtom,
  unreadCountAtom,
  urgentUnreadCountAtom,
  connectionStatusAtom,
  lastNotificationTimestampAtom,
  type RealtimeNotification,
} from '@/store/notification-store';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

// Sample notification messages for simulation
const SAMPLE_MESSAGES = [
  { title: 'New Access Request', type: 'approval_pending' as const, department: 'IT' },
  { title: 'Equipment Requisition', type: 'approval_pending' as const, department: 'IT' },
  { title: 'Leave Application', type: 'approval_pending' as const, department: 'HR' },
  { title: 'Budget Approval Needed', type: 'approval_pending' as const, department: 'Finance' },
  { title: 'Contract Review Required', type: 'approval_pending' as const, department: 'Legal' },
  { title: 'Request Escalated', type: 'escalation' as const, department: 'IT' },
  { title: 'Approval Reminder', type: 'reminder' as const, department: 'HR' },
];

const FORM_CODES = ['IT-AR-001', 'IT-EQ-002', 'HR-LV-001', 'FN-BG-001', 'LG-CT-001', 'IT-SC-003'];
const REQUESTORS = [
  { name: 'Ahmad Razif', email: 'ahmad.razif@ioi.com' },
  { name: 'Siti Aminah', email: 'siti.aminah@ioi.com' },
  { name: 'Lee Wei Ming', email: 'lee.weiming@ioi.com' },
  { name: 'Priya Sharma', email: 'priya.sharma@ioi.com' },
  { name: 'Tan Chee Hong', email: 'tan.cheehong@ioi.com' },
];

function generateMockNotification(): RealtimeNotification {
  const sample = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
  const requestor = REQUESTORS[Math.floor(Math.random() * REQUESTORS.length)];
  const formCode = FORM_CODES[Math.floor(Math.random() * FORM_CODES.length)];
  const urgencies: RealtimeNotification['urgency'][] = ['low', 'medium', 'high', 'critical'];
  const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: sample.type,
    title: sample.title,
    message: `${requestor.name} submitted a request requiring your approval`,
    formCode,
    submissionId: Math.floor(Math.random() * 1000) + 1,
    department: sample.department,
    urgency,
    timestamp: new Date(),
    read: false,
    actionUrl: '/approvals',
    requestorName: requestor.name,
    requestorEmail: requestor.email,
  };
}

// Notification sound removed - silent notifications only

export interface UseRealtimeNotificationsOptions {
  enableSimulation?: boolean;
  simulationIntervalMs?: number;
  simulationProbability?: number;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const {
    enableSimulation = true,
    simulationIntervalMs = 30000, // Check every 30 seconds
    simulationProbability = 0.3, // 30% chance of new notification
  } = options;

  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const preferences = useAtomValue(notificationPreferencesAtom);
  const unreadCount = useAtomValue(unreadCountAtom);
  const urgentUnreadCount = useAtomValue(urgentUnreadCountAtom);
  const [connectionStatus, setConnectionStatus] = useAtom(connectionStatusAtom);
  const setLastTimestamp = useSetAtom(lastNotificationTimestampAtom);
  
  const { data: submissions = [] } = useMainDBITList();
  const previousSubmissionsRef = useRef<MainDBIT[]>([]);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  // Show toast for new notification
  const showNotificationToast = useCallback((notification: RealtimeNotification) => {
    if (!preferences.showToasts) return;

    const urgencyColors = {
      critical: 'destructive' as const,
      high: 'warning' as const,
      medium: 'default' as const,
      low: 'default' as const,
    };

    const toastType = notification.urgency === 'critical' || notification.urgency === 'high'
      ? toast.warning
      : toast.info;

    toastType(
      notification.title,
      {
        description: notification.message,
        duration: notification.urgency === 'critical' ? 10000 : 5000,
        action: notification.actionUrl ? {
          label: 'View',
          onClick: () => window.location.href = notification.actionUrl!,
        } : undefined,
      }
    );
  }, [preferences.showToasts]);

  // Add a new notification
  const addNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications((prev: RealtimeNotification[]) => {
      // Prevent duplicates
      if (prev.some((n: RealtimeNotification) => n.id === notification.id)) return prev;
      
      // Keep only last 50 notifications
      const updated = [notification, ...prev].slice(0, 50);
      return updated;
    });

    setLastTimestamp(typeof notification.timestamp === 'string' ? notification.timestamp : notification.timestamp.toISOString());

    // Sound notification disabled

    // Show toast
    showNotificationToast(notification);
  }, [setNotifications, setLastTimestamp, preferences.soundEnabled, showNotificationToast]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev: RealtimeNotification[]) =>
      prev.map((n: RealtimeNotification) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, [setNotifications]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev: RealtimeNotification[]) =>
      prev.map((n: RealtimeNotification) => ({ ...n, read: true }))
    );
  }, [setNotifications]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  // Remove a specific notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev: RealtimeNotification[]) =>
      prev.filter((n: RealtimeNotification) => n.id !== notificationId)
    );
  }, [setNotifications]);

  // Detect real new submissions and convert to notifications
  useEffect(() => {
    if (submissions.length === 0) return;

    const prevIds = new Set(previousSubmissionsRef.current.map((s: MainDBIT) => s.id));
    const newSubmissions = submissions.filter((s: MainDBIT) => !prevIds.has(s.id));

    for (const submission of newSubmissions) {
      // Only notify for pending items that need approval
      if (submission.currentStatus === 'CurrentstatusKey1' || submission.currentStatus === 'CurrentstatusKey2') {
        const notification: RealtimeNotification = {
          id: `submission-${submission.id}-${Date.now()}`,
          type: 'approval_pending',
          title: 'New Approval Request',
          message: `${submission.requestoremail?.split('@')[0] || 'Someone'} submitted: ${submission.title}`,
          formCode: submission.formcode || 'FORM',
          submissionId: submission.id,
          department: 'IT',
          urgency: 'medium',
          timestamp: new Date(),
          read: false,
          actionUrl: '/approvals',
          requestorName: submission.requestoremail?.split('@')[0],
          requestorEmail: submission.requestoremail || undefined,
        };

        addNotification(notification);
      }
    }

    previousSubmissionsRef.current = submissions;
  }, [submissions, addNotification]);

  // Simulation effect - generates random notifications for demo
  useEffect(() => {
    if (!enableSimulation) return;

    setConnectionStatus('connected');

    simulationRef.current = setInterval(() => {
      // Random chance of getting a new notification
      if (Math.random() < simulationProbability) {
        const mockNotification = generateMockNotification();
        addNotification(mockNotification);
      }
    }, simulationIntervalMs);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [enableSimulation, simulationIntervalMs, simulationProbability, addNotification, setConnectionStatus]);

  // Trigger a manual simulation (for testing)
  const triggerTestNotification = useCallback(() => {
    const mockNotification = generateMockNotification();
    addNotification(mockNotification);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    urgentUnreadCount,
    connectionStatus,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    triggerTestNotification,
  };
}

export default useRealtimeNotifications;