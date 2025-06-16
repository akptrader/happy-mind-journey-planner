
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Activity, Pill, Moon, Zap, Briefcase, Droplets } from 'lucide-react';

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
      const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');

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
        const dayWork = workEntries.filter((work: any) => 
          new Date(work.timestamp).toDateString() === dateStr
        );

        // Calculate averages and totals
        const avgMood = dayMoods.length > 0 
          ? dayMoods.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / dayMoods.length
          : null;
        
        const bloodSugar = dayHealthMetrics.find((m: any) => m.type === 'blood-sugar')?.value || null;
        const sleepHours = dayHealthMetrics.find((m: any) => m.type === 'sleep')?.value || null;
        const exerciseMinutes = dayExercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
        const medicationAdherence = medications.length > 0 ? (dayMedLogs.length / medications.length) * 100 : 0;
        
        // Work productivity metrics
        const avgProductivity = dayWork.length > 0 
          ? dayWork.reduce((sum: number, work: any) => sum + work.productivityLevel, 0) / dayWork.length
          : null;
        const avgFocus = dayWork.length > 0 
          ? dayWork.reduce((sum: number, work: any) => sum + work.focusLevel, 0) / dayWork.length
          : null;
        const avgEnergy = dayWork.length > 0 
          ? dayWork.reduce((sum: number, work: any) => sum + work.energyLevel, 0) / dayWork.length
          : null;

        // Check for Seroquel specifically
        const seroquelTaken = dayMedLogs.some((log: any) => {
          const med = medications.find((m: any) => m.id === log.medicationId);
          return med && med.name.toLowerCase().includes('seroquel');
        });

        dailyData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
          bloodSugar,
          sleep: sleepHours,
          exercise: exerciseMinutes,
          medicationAdherence: Math.round(medicationAdherence),
          productivity: avgProductivity ? Math.round(avgProductivity * 10) / 10 : null,
          focus: avgFocus ? Math.round(avgFocus * 10) / 10 : null,
          energy: avgEnergy ? Math.round(avgEnergy * 10) / 10 : null,
          seroquelTaken
        });
      }

      setCorrelationData(dailyData);

      // Generate enhanced insights
      const newInsights = [];
      
      // Sleep vs Work Performance correlation
      const validSleepWork = dailyData.filter(d => d.sleep !== null && d.productivity !== null);
      if (validSleepWork.length >= 3) {
        const goodSleepDays = validSleepWork.filter(d => d.sleep >= 7);
        const poorSleepDays = validSleepWork.filter(d => d.sleep < 6);
        
        if (goodSleepDays.length > 0 && poorSleepDays.length > 0) {
          const avgProductivityGoodSleep = goodSleepDays.reduce((sum, d) => sum + d.productivity, 0) / goodSleepDays.length;
          const avgProductivityPoorSleep = poorSleepDays.reduce((sum, d) => sum + d.productivity, 0) / poorSleepDays.length;
          
          if (avgProductivityGoodSleep > avgProductivityPoorSleep + 1) {
            newInsights.push({
              type: 'positive',
              title: 'Sleep Dramatically Affects Work Performance',
              description: `Your productivity is ${(avgProductivityGoodSleep - avgProductivityPoorSleep).toFixed(1)} points higher with 7+ hours of sleep vs <6 hours.`,
              icon: <Moon className="text-blue-500" size={16} />,
              priority: 'high'
            });
          }
        }
      }

      // Seroquel vs Blood Sugar correlation
      const seroquelDays = dailyData.filter(d => d.seroquelTaken && d.bloodSugar !== null);
      const nonSeroquelDays = dailyData.filter(d => !d.seroquelTaken && d.bloodSugar !== null);
      
      if (se oquelDays.length >= 2 && nonSeroquelDays.length >= 2) {
        const avgBSWithSeroquel = seroquelDays.reduce((sum, d) => sum + d.bloodSugar, 0) / seroquelDays.length;
        const avgBSWithoutSeroquel = nonSeroquelDays.reduce((sum, d) => sum + d.bloodSugar, 0) / nonSeroquelDays.length;
        
        if (avgBSWithSeroquel > avgBSWithoutSeroquel + 20) {
          newInsights.push({
            type: 'warning',
            title: 'Seroquel May Be Affecting Blood Sugar',
            description: `Blood sugar averages ${avgBSWithSeroquel.toFixed(0)} mg/dL on Seroquel days vs ${avgBSWithoutSeroquel.toFixed(0)} mg/dL on non-Seroquel days.`,
            icon: <Droplets className="text-red-500" size={16} />,
            priority: 'high'
          });
        }
      }

      // Exercise vs Mood vs Work correlation
      const validExerciseMoodWork = dailyData.filter(d => d.exercise > 0 && d.mood !== null && d.productivity !== null);
      if (validExerciseMoodWork.length >= 3) {
        const avgMoodWithExercise = validExerciseMoodWork.reduce((sum, d) => sum + d.mood, 0) / validExerciseMoodWork.length;
        const avgProductivityWithExercise = validExerciseMoodWork.reduce((sum, d) => sum + d.productivity, 0) / validExerciseMoodWork.length;
        
        const noExerciseDays = dailyData.filter(d => d.exercise === 0 && d.mood !== null && d.productivity !== null);
        if (noExerciseDays.length > 0) {
          const avgMoodNoExercise = noExerciseDays.reduce((sum, d) => sum + d.mood, 0) / noExerciseDays.length;
          const avgProductivityNoExercise = noExerciseDays.reduce((sum, d) => sum + d.productivity, 0) / noExerciseDays.length;
          
          if (avgMoodWithExercise > avgMoodNoExercise + 0.5 && avgProductivityWithExercise > avgProductivityNoExercise + 0.5) {
            newInsights.push({
              type: 'positive',
              title: 'Exercise Boosts Both Mood and Work Performance',
              description: `Exercise days show ${(avgMoodWithExercise - avgMoodNoExercise).toFixed(1)} higher mood and ${(avgProductivityWithExercise - avgProductivityNoExercise).toFixed(1)} higher productivity.`,
              icon: <Zap className="text-green-500" size={16} />,
              priority: 'high'
            });
          }
        }
      }

      // High blood sugar impact on focus
      const highBSWork = dailyData.filter(d => d.bloodSugar > 140 && d.focus !== null);
      const normalBSWork = dailyData.filter(d => d.bloodSugar <= 140 && d.bloodSugar > 0 && d.focus !== null);
      
      if (highBSWork.length >= 2 && normalBSWork.length >= 2) {
        const avgFocusHighBS = highBSWork.reduce((sum, d) => sum + d.focus, 0) / highBSWork.length;
        const avgFocusNormalBS = normalBSWork.reduce((sum, d) => sum + d.focus, 0) / normalBSWork.length;
        
        if (avgFocusNormalBS > avgFocusHighBS + 1) {
          newInsights.push({
            type: 'warning',
            title: 'High Blood Sugar Hurts Focus',
            description: `Focus drops by ${(avgFocusNormalBS - avgFocusHighBS).toFixed(1)} points when blood sugar >140 mg/dL.`,
            icon: <Briefcase className="text-orange-500" size={16} />,
            priority: 'high'
          });
        }
      }

      // Sort insights by priority
      newInsights.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        return 0;
      });

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
    productivity: {
      label: "Productivity",
      color: "#ffd700",
    },
    focus: {
      label: "Focus",
      color: "#f5deb3",
    },
  };

  return (
    <div className="space-y-6">
      {/* Enhanced multi-metric correlation chart */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Complete Health & Work Correlation</h3>
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
              dataKey="productivity" 
              stroke="#ffd700" 
              strokeWidth={2}
              connectNulls={false}
              name="Productivity (0-10)"
            />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#f5deb3" 
              strokeWidth={2}
              connectNulls={false}
              name="Focus (0-10)"
              strokeDasharray="2 2"
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
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Note: Exercise minutes are divided by 10 for better visualization. Days with Seroquel are marked with higher medication adherence.</p>
        </div>
      </Card>

      {/* Enhanced insights with bipolar & diabetes focus */}
      {insights.length > 0 && (
        <Card className="medication-card bg-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-hot-pink" size={20} />
            <h3 className="text-lg font-semibold text-foreground">Key Insights for Bipolar & Diabetes Management</h3>
          </div>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'bg-green-900/20 border-green-500' :
                insight.type === 'warning' ? 'bg-red-900/20 border-red-500' :
                'bg-blue-900/20 border-blue-500'
              } ${insight.priority === 'high' ? 'ring-2 ring-hot-pink/30' : ''}`}>
                {insight.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{insight.title}</p>
                    {insight.priority === 'high' && (
                      <span className="text-xs bg-hot-pink text-black px-2 py-1 rounded">HIGH PRIORITY</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-200">
              <strong>Tip for Treatment-Resistant Bipolar:</strong> Track these correlations consistently to identify your personal patterns. 
              Small changes in sleep, exercise, and blood sugar management can have significant impacts on mood stability and work performance.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CorrelationAnalytics;
