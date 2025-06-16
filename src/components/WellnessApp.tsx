
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import MedicationTracker from './MedicationTracker';
import DailyChecklist from './DailyChecklist';
import TimingTimer from './TimingTimer';
import EditMode from './EditMode';
import ExerciseTracker from './ExerciseTracker';
import PersonalTodos from './PersonalTodos';
import DietTracker from './DietTracker';
import HealthMetrics from './HealthMetrics';
import Analytics from './Analytics';
import WorkProductivityTracker from './WorkProductivityTracker';
import Header from './Header';
import TabNavigation from './TabNavigation';
import AppFooter from './AppFooter';

const WellnessApp = () => {
  const [activeTab, setActiveTab] = useState('medications');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are already enabled
    const notifEnabled = localStorage.getItem('notificationsEnabled');
    if (notifEnabled === 'true') {
      setNotificationsEnabled(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Header 
          notificationsEnabled={notificationsEnabled}
          onNotificationsChange={setNotificationsEnabled}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabNavigation />

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

        <AppFooter />
      </div>
    </div>
  );
};

export default WellnessApp;
