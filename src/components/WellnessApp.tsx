
import React, { useState } from 'react';
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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type View = 'dashboard' | 'medications' | 'mood' | 'health' | 'analytics' | 'checklist' | 'exercise' | 'diet' | 'work' | 'supplements' | 'data-backup';

const WellnessApp = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'medications':
        return <MedicationTracker onBack={() => setCurrentView('dashboard')} />;
      case 'mood':
        return <MoodTracker onBack={() => setCurrentView('dashboard')} />;
      case 'health':
        return <HealthMetrics onBack={() => setCurrentView('dashboard')} />;
      case 'analytics':
        return <Analytics onBack={() => setCurrentView('dashboard')} />;
      case 'checklist':
        return <DailyChecklist onBack={() => setCurrentView('dashboard')} />;
      case 'exercise':
        return <ExerciseTracker onBack={() => setCurrentView('dashboard')} />;
      case 'diet':
        return <DietTracker onBack={() => setCurrentView('dashboard')} />;
      case 'work':
        return <WorkProductivityTracker onBack={() => setCurrentView('dashboard')} />;
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
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {renderView()}
      </div>
    </div>
  );
};

export default WellnessApp;
