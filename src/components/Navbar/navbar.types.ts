// src/components/navbar/navbar.types.ts
export interface Notification {
    id: string;
    message: string;
    notificationImageURL?: string;
    read: boolean;
    timestamp: number;
  }
  
  // Add any other types shared between navbar components if needed