
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Calendar, Activity } from 'lucide-react';

interface InsightsPanelProps {
  timeRange: string;
}

const InsightsPanel = ({ timeRange }: InsightsPanelProps) => {
  const [insights, setInsights] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadInsights = () => {
      setLoading(true);
      setTimeout(() => {
        // Mock data based on localStorage
        const medications = JSON.parse(localStorage.getItem('medications') || '[]');
        const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
        const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
        const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');

        const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysToCheck);

        // Calculate medication adherence
        const recentMedLogs = medicationLog.filter((log: any) => 
          new Date(log.timestamp) >= startDate
        );
        const adherenceRate = medications.length > 0 
          ? Math.round((recentMedLogs.length / (medications.length * daysToCheck)) * 100)
          : 0;

        // Calculate mood trends
        const recentMoods = moodEntries.filter((entry: any) => 
          new Date(entry.timestamp) >= startDate
        );
        const avgMood = recentMoods.length > 0 
          ? recentMoods.reduce((sum: number, entry: any) => sum + entry.level, 0) / recentMoods.length
          : 0;

        // Health metrics tracking
        const recentHealthMetrics = healthMetrics.filter((metric: any) => 
          new Date(metric.timestamp) >= startDate
        );

        setInsights({
          adherenceRate,
          avgMood: Math.round(avgMood * 10) / 10,
          totalMedications: medications.length,
          moodEntries: recentMoods.length,
          healthMetrics: recentHealthMetrics.length,
          daysTracked: daysToCheck
        });
        setLoading(false);
      }, 1000);
    };

    loadInsights();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="medication-card bg-gray-800 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-500';
    if (rate >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'text-green-500';
    if (mood >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Medication Adherence</p>
              <p className={`text-2xl font-bold ${getAdherenceColor(insights.adherenceRate)}`}>
                {insights.adherenceRate}%
              </p>
            </div>
            <div className="text-hot-pink">
              {insights.adherenceRate >= 90 ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
          </div>
          <Progress value={insights.adherenceRate} className="mt-2" />
        </Card>

        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Mood</p>
              <p className={`text-2xl font-bold ${getMoodColor(insights.avgMood)}`}>
                {insights.avgMood || 'N/A'}/10
              </p>
            </div>
            <div className="text-hot-pink">
              {insights.avgMood >= 7 ? <TrendingUp size={24} /> : insights.avgMood >= 4 ? <Activity size={24} /> : <TrendingDown size={24} />}
            </div>
          </div>
        </Card>

        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Mood Entries</p>
              <p className="text-2xl font-bold text-gold">{insights.moodEntries}</p>
            </div>
            <div className="text-hot-pink">
              <Calendar size={24} />
            </div>
          </div>
        </Card>

        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health Metrics</p>
              <p className="text-2xl font-bold text-gold">{insights.healthMetrics}</p>
            </div>
            <div className="text-hot-pink">
              <Activity size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Key Insights</h3>
        </div>
        
        <div className="space-y-3">
          {insights.adherenceRate >= 90 && (
            <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <CheckCircle className="text-green-500 mt-0.5" size={16} />
              <div>
                <p className="font-medium text-green-400">Excellent Medication Adherence!</p>
                <p className="text-sm text-green-300">You're maintaining a {insights.adherenceRate}% adherence rate. Keep up the great work!</p>
              </div>
            </div>
          )}

          {insights.adherenceRate < 70 && (
            <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <AlertCircle className="text-red-500 mt-0.5" size={16} />
              <div>
                <p className="font-medium text-red-400">Medication Adherence Needs Attention</p>
                <p className="text-sm text-red-300">Your adherence rate is {insights.adherenceRate}%. Consider setting more reminders or speaking with your healthcare provider.</p>
              </div>
            </div>
          )}

          {insights.avgMood && insights.avgMood < 4 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <TrendingDown className="text-yellow-500 mt-0.5" size={16} />
              <div>
                <p className="font-medium text-yellow-400">Mood Trends Worth Monitoring</p>
                <p className="text-sm text-yellow-300">Your average mood has been {insights.avgMood}/10. Consider discussing this with your healthcare provider.</p>
              </div>
            </div>
          )}

          {insights.moodEntries === 0 && (
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <Activity className="text-blue-500 mt-0.5" size={16} />
              <div>
                <p className="font-medium text-blue-400">Start Tracking Your Mood</p>
                <p className="text-sm text-blue-300">Mood tracking can help identify patterns and improve your mental health management.</p>
              </div>
            </div>
          )}

          {insights.healthMetrics === 0 && (
            <div className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
              <Activity className="text-purple-500 mt-0.5" size={16} />
              <div>
                <p className="font-medium text-purple-400">Consider Adding Health Metrics</p>
                <p className="text-sm text-purple-300">Tracking metrics like sleep, heart rate variability, or blood pressure can provide valuable health insights.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InsightsPanel;
