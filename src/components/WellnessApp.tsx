
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
import Dashboard from './Dashboard';
import SearchAndFilter from './SearchAndFilter';
import CustomReminders from './CustomReminders';
import SymptomCorrelation from './SymptomCorrelation';
import MoodTracker from './MoodTracker';
import Header from './Header';
import TabNavigation from './TabNavigation';
import AppFooter from './AppFooter';

const WellnessApp = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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

          <TabsContent value="dashboard" className="animate-slide-in">
            <Dashboard />
          </TabsContent>

          <TabsContent value="search" className="animate-slide-in">
            <SearchAndFilter onResultsChange={setSearchResults} />
          </TabsContent>

          <TabsContent value="reminders" className="animate-slide-in">
            <CustomReminders />
          </TabsContent>

          <TabsContent value="correlations" className="animate-slide-in">
            <SymptomCorrelation />
          </TabsContent>

          <TabsContent value="medications" className="animate-slide-in">
            <MedicationTracker />
          </TabsContent>

          <TabsContent value="health" className="animate-slide-in">
            <HealthMetrics />
          </TabsContent>

          <TabsContent value="mood" className="animate-slide-in">
            <MoodTracker onBack={() => setActiveTab('dashboard')} />
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
