import { atom } from "jotai";

export interface RealtimeNotification {
  id: string;
  type?: string;
  title: string;
  message?: string;
  formCode?: string;
  submissionId?: number;
  department?: string;
  requestor?: string;
  requestorName?: string;
  requestorEmail?: string;
  createdAt?: string;
  timestamp: Date | string;
  urgency: "low" | "medium" | "high" | "critical";
  read: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  showToasts: boolean;
}

export const notificationsAtom = atom<RealtimeNotification[]>([]);
export const realtimeNotificationsAtom = notificationsAtom;

export const unreadCountAtom = atom<number>((get) =>
  get(notificationsAtom).filter((n) => !n.read).length
);

export const urgentUnreadCountAtom = atom<number>((get) =>
  get(notificationsAtom).filter(
    (n) => !n.read && (n.urgency === "critical" || n.urgency === "high")
  ).length
);

export const connectionStatusAtom = atom<"connected" | "disconnected" | "connecting">("disconnected");

export const lastNotificationTimestampAtom = atom<string>('');

export const notificationPreferencesAtom = atom<NotificationPreferences>({
  enabled: true,
  soundEnabled: true,
  desktopEnabled: false,
  showToasts: true,
});
