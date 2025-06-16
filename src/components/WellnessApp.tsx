
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MedicationTracker from './MedicationTracker';
import DailyChecklist from './DailyChecklist';
import SelfCareReminders from './SelfCareReminders';
import TimingTimer from './TimingTimer';
import EditMode from './EditMode';
import ExerciseTracker from './ExerciseTracker';
import PersonalTodos from './PersonalTodos';
import DietTracker from './DietTracker';
import HealthMetrics from './HealthMetrics';
import Analytics from './Analytics';
import WorkProductivityTracker from './WorkProductivityTracker';
import QuickActions from './QuickActions';
import { Bell, List, Heart, Calendar, Timer, Edit, Smartphone, Dumbbell, CheckSquare, Apple, TrendingUp, Activity, Briefcase } from 'lucide-react';
import { NotificationService } from '@/services/NotificationService';
import { useToast } from '@/hooks/use-toast';

const WellnessApp = () => {
  const [activeTab, setActiveTab] = useState('medications');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    // Check if notifications are already enabled
    const notifEnabled = localStorage.getItem('notificationsEnabled');
    if (notifEnabled === 'true') {
      setNotificationsEnabled(true);
    }
  }, []);

  const enableNotifications = async () => {
    try {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        await NotificationService.scheduleMedicationReminders();
        setNotificationsEnabled(true);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
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

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10 mb-8">
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Bell size={18} />
              <span className="hidden sm:inline">Meds</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity size={18} />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer size={18} />
              <span className="hidden sm:inline">Timer</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <List size={18} />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="exercise" className="flex items-center gap-2">
              <Dumbbell size={18} />
              <span className="hidden sm:inline">Exercise</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <Apple size={18} />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="work" className="flex items-center gap-2">
              <Briefcase size={18} />
              <span className="hidden sm:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <CheckSquare size={18} />
              <span className="hidden sm:inline">To-Do</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit size={18} />
              <span className="hidden sm:inline">Edit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="animate-slide-in">
            <MedicationTracker />
          </TabsContent>

          <TabsContent value="health" className="animate-slide-in">
            <HealthMetrics />
          </TabsContent>

          <TabsContent value="timer" className="animate-slide-in">
            <TimingTimer />
          </TabsContent>

          <TabsContent value="checklist" className="animate-slide-in">
            <DailyChecklist />
          </TabsContent>

          <TabsContent value="exercise" className="animate-slide-in">
            <ExerciseTracker />
          </TabsContent>

          <TabsContent value="diet" className="animate-slide-in">
            <DietTracker />
          </TabsContent>

          <TabsContent value="work" className="animate-slide-in">
            <WorkProductivityTracker />
          </TabsContent>

          <TabsContent value="todos" className="animate-slide-in">
            <PersonalTodos />
          </TabsContent>

          <TabsContent value="analytics" className="animate-slide-in">
            <Analytics />
          </TabsContent>

          <TabsContent value="edit" className="animate-slide-in">
            <EditMode />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="medication-card calm-gradient">
            <p className="text-sm text-gray-300">
              💙 Remember: You're doing great by taking care of your health. Every step forward matters.
            </p>
          </Card>
        </div>
      </div>

      {/* Quick Actions FAB */}
      <QuickActions />
    </div>
  );
};

export default WellnessApp;
