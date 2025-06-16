
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Activity, Pill, Moon, Zap } from 'lucide-react';

interface CorrelationAnalyticsProps {
  timeRange: string;
}

const CorrelationAnalytics = ({ timeRange }: CorrelationAnalyticsProps) => {
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const loadCorrelationData = () => {
      const medications = JSON.parse(localStorage.getItem('medications') || '[]');
      const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
      const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
      const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');

      const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToCheck);

      // Create daily correlation data
      const dailyData = [];
      for (let i = daysToCheck - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();

        // Get data for this day
        const dayMedLogs = medicationLog.filter((log: any) => 
          new Date(log.timestamp).toDateString() === dateStr
        );
        const dayMoods = moodEntries.filter((entry: any) => 
          new Date(entry.timestamp).toDateString() === dateStr
        );
        const dayHealthMetrics = healthMetrics.filter((metric: any) => 
          new Date(metric.timestamp).toDateString() === dateStr
        );
        const dayExercises = exercises.filter((exercise: any) => 
          new Date(exercise.timestamp).toDateString() === dateStr
        );

        // Calculate averages and totals
        const avgMood = dayMoods.length > 0 
          ? dayMoods.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / dayMoods.length
          : null;
        
        const bloodSugar = dayHealthMetrics.find((m: any) => m.type === 'blood-sugar')?.value || null;
        const sleepHours = dayHealthMetrics.find((m: any) => m.type === 'sleep')?.value || null;
        const exerciseMinutes = dayExercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
        const medicationAdherence = medications.length > 0 ? (dayMedLogs.length / medications.length) * 100 : 0;

        dailyData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
          bloodSugar,
          sleep: sleepHours,
          exercise: exerciseMinutes,
          medicationAdherence: Math.round(medicationAdherence)
        });
      }

      setCorrelationData(dailyData);

      // Generate insights
      const newInsights = [];
      
      // Mood vs Exercise correlation
      const validMoodExercise = dailyData.filter(d => d.mood !== null && d.exercise > 0);
      if (validMoodExercise.length >= 3) {
        const avgMoodWithExercise = validMoodExercise.reduce((sum, d) => sum + d.mood, 0) / validMoodExercise.length;
        const avgMoodWithoutExercise = dailyData.filter(d => d.mood !== null && d.exercise === 0)
          .reduce((sum, d, _, arr) => arr.length > 0 ? sum + d.mood / arr.length : 0, 0);
        
        if (avgMoodWithExercise > avgMoodWithoutExercise + 0.5) {
          newInsights.push({
            type: 'positive',
            title: 'Exercise Boosts Mood',
            description: `Your mood averages ${avgMoodWithExercise.toFixed(1)}/10 on exercise days vs ${avgMoodWithoutExercise.toFixed(1)}/10 on non-exercise days.`,
            icon: <Zap className="text-green-500" size={16} />
          });
        }
      }

      // Blood sugar patterns
      const validBloodSugar = dailyData.filter(d => d.bloodSugar !== null);
      if (validBloodSugar.length >= 3) {
        const avgBS = validBloodSugar.reduce((sum, d) => sum + d.bloodSugar, 0) / validBloodSugar.length;
        const highBSDays = validBloodSugar.filter(d => d.bloodSugar > 140).length;
        
        if (highBSDays > validBloodSugar.length * 0.3) {
          newInsights.push({
            type: 'warning',
            title: 'Blood Sugar Patterns',
            description: `${highBSDays} out of ${validBloodSugar.length} days had elevated blood sugar (>140 mg/dL).`,
            icon: <Activity className="text-yellow-500" size={16} />
          });
        }
      }

      // Sleep correlation
      const validSleep = dailyData.filter(d => d.sleep !== null && d.mood !== null);
      if (validSleep.length >= 3) {
        const goodSleepDays = validSleep.filter(d => d.sleep >= 7);
        const poorSleepDays = validSleep.filter(d => d.sleep < 6);
        
        if (goodSleepDays.length > 0 && poorSleepDays.length > 0) {
          const avgMoodGoodSleep = goodSleepDays.reduce((sum, d) => sum + d.mood, 0) / goodSleepDays.length;
          const avgMoodPoorSleep = poorSleepDays.reduce((sum, d) => sum + d.mood, 0) / poorSleepDays.length;
          
          if (avgMoodGoodSleep > avgMoodPoorSleep + 0.5) {
            newInsights.push({
              type: 'positive',
              title: 'Sleep Quality Matters',
              description: `Your mood is ${(avgMoodGoodSleep - avgMoodPoorSleep).toFixed(1)} points higher with 7+ hours of sleep.`,
              icon: <Moon className="text-blue-500" size={16} />
            });
          }
        }
      }

      setInsights(newInsights);
    };

    loadCorrelationData();
  }, [timeRange]);

  const chartConfig = {
    mood: {
      label: "Mood Level",
      color: "#ec4899",
    },
    bloodSugar: {
      label: "Blood Sugar",
      color: "#ef4444",
    },
    sleep: {
      label: "Sleep Hours",
      color: "#3b82f6",
    },
    exercise: {
      label: "Exercise Minutes",
      color: "#10b981",
    },
  };

  return (
    <div className="space-y-6">
      {/* Multi-metric correlation chart */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Health Metrics Correlation</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#ec4899" 
              strokeWidth={2}
              connectNulls={false}
              name="Mood (0-10)"
            />
            <Line 
              type="monotone" 
              dataKey="bloodSugar" 
              stroke="#ef4444" 
              strokeWidth={2}
              connectNulls={false}
              name="Blood Sugar (mg/dL ÷ 10)"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="sleep" 
              stroke="#3b82f6" 
              strokeWidth={2}
              connectNulls={false}
              name="Sleep (hours)"
            />
            <Line 
              type="monotone" 
              dataKey="exercise" 
              stroke="#10b981" 
              strokeWidth={2}
              connectNulls={false}
              name="Exercise (min ÷ 10)"
              strokeDasharray="2 2"
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Note: Blood Sugar values are divided by 10, Exercise minutes by 10 for better visualization</p>
        </div>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="medication-card bg-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-hot-pink" size={20} />
            <h3 className="text-lg font-semibold text-foreground">Key Correlations & Insights</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'bg-green-900/20 border-green-500' :
                insight.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500' :
                'bg-blue-900/20 border-blue-500'
              }`}>
                {insight.icon}
                <div>
                  <p className="font-medium text-foreground">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CorrelationAnalytics;
