
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Pill, 
  Dumbbell, 
  Apple, 
  Briefcase, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const [todayData, setTodayData] = useState({
    medications: [],
    mood: null,
    exercise: 0,
    calories: 0,
    workHours: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    healthMetrics: []
  });

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = () => {
    const today = new Date().toDateString();
    
    // Load medications taken today
    const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    const todayMeds = medicationLog.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );

    // Load mood entries
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const todayMoods = moodEntries.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );

    // Load exercise
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    const todayExercise = exercises
      .filter(ex => new Date(ex.timestamp).toDateString() === today)
      .reduce((sum, ex) => sum + ex.duration, 0);

    // Load food/calories
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    const todayCalories = foodEntries
      .filter(food => new Date(food.timestamp).toDateString() === today)
      .reduce((sum, food) => sum + food.calories, 0);

    // Load work entries
    const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');
    const todayWork = workEntries.filter(work => 
      new Date(work.timestamp).toDateString() === today
    );

    // Load checklist tasks
    const tasks = JSON.parse(localStorage.getItem('checklistTasks') || '[]');
    const completedTasks = tasks.filter(task => task.completed).length;

    // Load health metrics
    const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
    const todayMetrics = healthMetrics.filter(metric => 
      new Date(metric.timestamp).toDateString() === today
    );

    setTodayData({
      medications: todayMeds,
      mood: todayMoods.length > 0 ? 
        todayMoods.reduce((sum, mood) => sum + mood.moodLevel, 0) / todayMoods.length : null,
      exercise: todayExercise,
      calories: todayCalories,
      workHours: todayWork.reduce((sum, work) => sum + work.hoursWorked, 0),
      tasksCompleted: completedTasks,
      totalTasks: tasks.length,
      healthMetrics: todayMetrics
    });
  };

  const getMoodColor = (level) => {
    if (level <= 3) return 'text-red-400';
    if (level <= 5) return 'text-yellow-400';
    if (level <= 7) return 'text-blue-400';
    return 'text-green-400';
  };

  const getTaskProgress = () => {
    return todayData.totalTasks > 0 ? (todayData.tasksCompleted / todayData.totalTasks) * 100 : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Today's Overview</h2>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button 
          onClick={loadTodayData} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <TrendingUp size={16} />
          Refresh
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="medication-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-hot-pink/20 rounded-lg">
              <Pill className="text-hot-pink" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayData.medications.length}</p>
              <p className="text-xs text-muted-foreground">Meds Taken</p>
            </div>
          </div>
        </Card>

        <Card className="medication-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Brain className="text-blue-400" size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${todayData.mood ? getMoodColor(todayData.mood) : 'text-muted-foreground'}`}>
                {todayData.mood ? `${todayData.mood.toFixed(1)}/10` : '--'}
              </p>
              <p className="text-xs text-muted-foreground">Avg Mood</p>
            </div>
          </div>
        </Card>

        <Card className="medication-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Dumbbell className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayData.exercise}</p>
              <p className="text-xs text-muted-foreground">Min Exercise</p>
            </div>
          </div>
        </Card>

        <Card className="medication-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Apple className="text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayData.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tasks Progress */}
      <Card className="medication-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            <span className="font-medium text-foreground">Daily Tasks</span>
          </div>
          <Badge variant="outline">
            {todayData.tasksCompleted}/{todayData.totalTasks}
          </Badge>
        </div>
        <Progress value={getTaskProgress()} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {getTaskProgress().toFixed(0)}% completed
        </p>
      </Card>

      {/* Recent Health Metrics */}
      {todayData.healthMetrics.length > 0 && (
        <Card className="medication-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-red-400" size={20} />
            <span className="font-medium text-foreground">Health Metrics</span>
          </div>
          <div className="space-y-2">
            {todayData.healthMetrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground capitalize">
                  {metric.type.replace('-', ' ')}
                </span>
                <span className="text-foreground font-medium">
                  {metric.value} {metric.unit}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Work Productivity */}
      {todayData.workHours > 0 && (
        <Card className="medication-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-purple-400" size={20} />
            <span className="font-medium text-foreground">Work Progress</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{todayData.workHours}h</p>
          <p className="text-xs text-muted-foreground">Hours worked today</p>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="medication-card p-4">
        <h3 className="font-medium text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus size={14} />
            Log Mood
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus size={14} />
            Add Exercise
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus size={14} />
            Log Food
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus size={14} />
            Health Metric
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
