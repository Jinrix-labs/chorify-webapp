// Browser push notifications utility

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

export const checkNotificationPermission = (): NotificationPermissionStatus => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export interface ChoreNotificationData {
  title: string;
  body: string;
  emoji?: string;
  tag?: string;
}

export const sendNotification = (data: ChoreNotificationData): void => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  try {
    const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
      body: data.body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: data.tag || 'chore-notification',
      vibrate: [200, 100, 200], // Vibration pattern for mobile
      requireInteraction: false,
      silent: false,
    };
    
    const notification = new Notification(data.title, notificationOptions);

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Notification templates
export const notifications = {
  choreAssigned: (assignedBy: string, choreTitle: string, emoji: string) => {
    sendNotification({
      title: `${assignedBy} assigned you a chore!`,
      body: `${choreTitle} ${emoji}`,
      tag: 'chore-assigned',
    });
  },

  choreClaimed: (userName: string, choreTitle: string, emoji: string) => {
    sendNotification({
      title: `${userName} claimed a chore!`,
      body: `${choreTitle} ${emoji}`,
      tag: 'chore-claimed',
    });
  },

  choreCompleted: (userName: string, choreTitle: string, points: number, emoji: string) => {
    sendNotification({
      title: `${userName} crushed a chore! 🔥`,
      body: `${choreTitle} +${points} points! ${emoji}`,
      tag: 'chore-completed',
    });
  },
};
