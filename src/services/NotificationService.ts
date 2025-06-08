
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  static async requestPermissions() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Not on native platform, skipping notification permissions');
      return false;
    }

    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleMedicationReminders() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Not on native platform, skipping notification scheduling');
      return;
    }

    try {
      // Clear existing notifications first
      await LocalNotifications.cancel({ notifications: [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
      ]});

      const now = new Date();
      const notifications = [
        {
          id: 1,
          title: 'Anti-nausea medication',
          body: 'Time to take your morning anti-nausea medication',
          schedule: { 
            at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0),
            repeats: true,
            every: 'day' as const
          },
        },
        {
          id: 2,
          title: 'Cobenfy (Morning)',
          body: 'Time for your first Cobenfy dose - 2 hours after breakfast',
          schedule: { 
            at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0),
            repeats: true,
            every: 'day' as const
          },
        },
        {
          id: 3,
          title: 'Anti-nausea medication',
          body: 'Time to take your afternoon anti-nausea medication',
          schedule: { 
            at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0, 0),
            repeats: true,
            every: 'day' as const
          },
        },
        {
          id: 4,
          title: 'Cobenfy (Afternoon)',
          body: 'Time for your second Cobenfy dose - 2 hours after lunch',
          schedule: { 
            at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30, 0),
            repeats: true,
            every: 'day' as const
          },
        },
        {
          id: 5,
          title: 'Latuda with dinner',
          body: 'Time for Latuda - take with 350+ calories',
          schedule: { 
            at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0),
            repeats: true,
            every: 'day' as const
          },
        },
      ];

      await LocalNotifications.schedule({ notifications });
      console.log('Medication reminders scheduled successfully');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  static async scheduleCustomNotification(title: string, body: string, scheduleTime: Date) {
    if (!Capacitor.isNativePlatform()) {
      console.log('Not on native platform, skipping custom notification');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title,
          body,
          schedule: { at: scheduleTime }
        }]
      });
    } catch (error) {
      console.error('Error scheduling custom notification:', error);
    }
  }
}
