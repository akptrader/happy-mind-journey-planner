
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Dashboard from './Dashboard';
import MedicationTracker from './MedicationTracker';
import MoodTracker from './MoodTracker';
import HealthMetrics from './HealthMetrics';
import Analytics from './Analytics';
import DailyChecklist from './DailyChecklist';
import ExerciseTracker from './ExerciseTracker';
import DietTracker from './DietTracker';
import WorkProductivityTracker from './WorkProductivityTracker';
import SupplementTracker from './SupplementTracker';
import DataBackup from './DataBackup';
import AuthPage from './AuthPage';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

type View = 'dashboard' | 'medications' | 'mood' | 'health' | 'analytics' | 'checklist' | 'exercise' | 'diet' | 'work' | 'supplements' | 'data-backup';

const WellnessApp = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'medications':
        return <MedicationTracker />;
      case 'mood':
        return <MoodTracker onBack={() => setCurrentView('dashboard')} />;
      case 'health':
        return <HealthMetrics />;
      case 'analytics':
        return <Analytics />;
      case 'checklist':
        return <DailyChecklist />;
      case 'exercise':
        return <ExerciseTracker />;
      case 'diet':
        return <DietTracker />;
      case 'work':
        return <WorkProductivityTracker />;
      case 'supplements':
        return <SupplementTracker onBack={() => setCurrentView('dashboard')} />;
      case 'data-backup':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setCurrentView('dashboard')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </div>
            <DataBackup />
          </div>
        );
      default:
        return <Dashboard onNavigate={(view: string) => setCurrentView(view as View)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            Welcome back, {user.email}
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
        {renderView()}
      </div>
    </div>
  );
};

export default WellnessApp;
