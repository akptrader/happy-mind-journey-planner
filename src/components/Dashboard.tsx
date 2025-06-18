
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Activity, 
  TrendingUp, 
  List, 
  Dumbbell, 
  Apple,
  Briefcase,
  Pill,
  Database
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [todayProgress, setTodayProgress] = useState({
    medications: 0,
    totalMedications: 0,
    checklistItems: 0,
    totalChecklistItems: 0
  });

  useEffect(() => {
    // Calculate today's progress
    const today = new Date().toDateString();
    
    // Medication progress
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
    const todayMedLogs = medicationLog.filter((log: any) => 
      new Date(log.timestamp).toDateString() === today && log.taken
    );
    
    // Checklist progress
    const checklistItems = JSON.parse(localStorage.getItem('checklistItems') || '[]');
    const completedToday = checklistItems.filter((item: any) => 
      item.completed && new Date(item.completedAt || '').toDateString() === today
    ).length;

    setTodayProgress({
      medications: todayMedLogs.length,
      totalMedications: medications.length,
      checklistItems: completedToday,
      totalChecklistItems: checklistItems.length
    });
  }, []);

  const quickActions = [
    {
      icon: Pill,
      label: 'Medications',
      description: 'Track daily medications',
      color: 'text-hot-pink',
      action: () => onNavigate('medications')
    },
    {
      icon: Brain,
      label: 'Mood Tracker',
      description: 'Log your mental state',
      color: 'text-blue-400',
      action: () => onNavigate('mood')
    },
    {
      icon: Heart,
      label: 'Health Metrics',
      description: 'Monitor vital signs',
      color: 'text-red-400',
      action: () => onNavigate('health')
    },
    {
      icon: List,
      label: 'Daily Checklist',
      description: 'Complete daily tasks',
      color: 'text-green-400',
      action: () => onNavigate('checklist')
    },
    {
      icon: Dumbbell,
      label: 'Exercise',
      description: 'Track workouts',
      color: 'text-purple-400',
      action: () => onNavigate('exercise')
    },
    {
      icon: Apple,
      label: 'Diet',
      description: 'Log meals & nutrition',
      color: 'text-orange-400',
      action: () => onNavigate('diet')
    },
    {
      icon: Briefcase,
      label: 'Work Tracker',
      description: 'Monitor productivity',
      color: 'text-yellow-400',
      action: () => onNavigate('work')
    },
    {
      icon: Activity,
      label: 'Supplements',
      description: 'Track supplements',
      color: 'text-teal-400',
      action: () => onNavigate('supplements')
    }
  ];

  const utilityActions = [
    {
      icon: TrendingUp,
      label: 'Analytics',
      description: 'View insights & trends',
      color: 'text-indigo-400',
      action: () => onNavigate('analytics')
    },
    {
      icon: Database,
      label: 'Data Management',
      description: 'Backup & restore data',
      color: 'text-cyan-400',
      action: () => onNavigate('data-backup')
    }
  ];

  const medicationProgress = todayProgress.totalMedications > 0 
    ? (todayProgress.medications / todayProgress.totalMedications) * 100 
    : 0;
  
  const checklistProgress = todayProgress.totalChecklistItems > 0 
    ? (todayProgress.checklistItems / todayProgress.totalChecklistItems) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Happy Mind Journey 🌟
        </h1>
        <p className="text-muted-foreground">
          Your personal wellness companion
        </p>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="medication-card wellness-gradient text-white p-4">
          <h3 className="font-semibold mb-2">Today's Medications</h3>
          <div className="flex items-center gap-3">
            <Progress value={medicationProgress} className="flex-1 h-2" />
            <span className="text-sm whitespace-nowrap">
              {todayProgress.medications}/{todayProgress.totalMedications}
            </span>
          </div>
        </Card>

        <Card className="medication-card calm-gradient text-white p-4">
          <h3 className="font-semibold mb-2">Daily Tasks</h3>
          <div className="flex items-center gap-3">
            <Progress value={checklistProgress} className="flex-1 h-2" />
            <span className="text-sm whitespace-nowrap">
              {todayProgress.checklistItems}/{todayProgress.totalChecklistItems}
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Health Tracking</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <Card key={index} className="medication-card hover:bg-gray-700 transition-colors cursor-pointer" onClick={action.action}>
              <div className="text-center p-4">
                <action.icon className={`${action.color} mx-auto mb-2`} size={24} />
                <h3 className="font-medium text-foreground text-sm mb-1">{action.label}</h3>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Utility Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Tools & Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {utilityActions.map((action, index) => (
            <Card key={index} className="medication-card hover:bg-gray-700 transition-colors cursor-pointer" onClick={action.action}>
              <div className="flex items-center p-4 gap-3">
                <action.icon className={`${action.color}`} size={24} />
                <div>
                  <h3 className="font-medium text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <Card className="medication-card calm-gradient text-white text-center p-6">
        <p className="text-sm">
          💙 Every step you take towards better health matters. You're doing great!
        </p>
      </Card>
    </div>
  );
};

export default Dashboard;
