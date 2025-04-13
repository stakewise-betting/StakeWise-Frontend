export interface Notification {
  id: string;
  message: string;
  notificationImageURL?: string | null | undefined; // Allow null and undefined
  timestamp: number; // Unix timestamp (ms)
  eventId?: number | string | null; // Can be number or string, optional
  read: boolean; // Simple boolean
}