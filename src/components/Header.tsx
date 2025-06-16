
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Smartphone } from 'lucide-react';
import { NotificationService } from '@/services/NotificationService';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  notificationsEnabled: boolean;
  onNotificationsChange: (enabled: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ notificationsEnabled, onNotificationsChange }) => {
  const { toast } = useToast();
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const enableNotifications = async () => {
    try {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        await NotificationService.scheduleMedicationReminders();
        onNotificationsChange(true);
        localStorage.setItem('notificationsEnabled', 'true');
        toast({
          title: "Notifications enabled! 🔔",
          description: "You'll receive medication reminders on your mobile device",
        });
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your device settings to receive reminders",
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: "Error",
        description: "Unable to enable notifications. Please try again.",
      });
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="wellness-gradient rounded-2xl p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">Wellness Companion</h1>
        <p className="text-lg opacity-90">Managing your health journey with care</p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm opacity-80">
          <Calendar size={16} />
          <span>{currentDate}</span>
        </div>
        
        {/* Mobile Notification Setup */}
        {!notificationsEnabled && (
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smartphone size={16} />
              <span className="text-sm font-medium">Enable Mobile Notifications</span>
            </div>
            <Button 
              onClick={enableNotifications}
              className="bg-white text-black hover:bg-gray-100"
              size="sm"
            >
              <Bell size={14} className="mr-1" />
              Set Up Reminders
            </Button>
          </div>
        )}
        
        {notificationsEnabled && (
          <div className="mt-4 p-2 bg-white/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Bell size={14} />
              <span>Mobile notifications active ✓</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
