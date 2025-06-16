
import React from 'react';
import { Moon, Zap, Briefcase, Droplets } from 'lucide-react';
import { DailyCorrelationData, AnalyticsInsight } from '@/types/analytics';

export const generateInsights = (dailyData: DailyCorrelationData[]): AnalyticsInsight[] => {
  const insights: AnalyticsInsight[] = [];
  
  // Sleep vs Work Performance correlation
  const validSleepWork = dailyData.filter(d => d.sleep !== null && d.productivity !== null);
  if (validSleepWork.length >= 3) {
    const goodSleepDays = validSleepWork.filter(d => d.sleep! >= 7);
    const poorSleepDays = validSleepWork.filter(d => d.sleep! < 6);
    
    if (goodSleepDays.length > 0 && poorSleepDays.length > 0) {
      const avgProductivityGoodSleep = goodSleepDays.reduce((sum, d) => sum + d.productivity!, 0) / goodSleepDays.length;
      const avgProductivityPoorSleep = poorSleepDays.reduce((sum, d) => sum + d.productivity!, 0) / poorSleepDays.length;
      
      if (avgProductivityGoodSleep > avgProductivityPoorSleep + 1) {
        insights.push({
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
  
  if (seroquelDays.length >= 2 && nonSeroquelDays.length >= 2) {
    const avgBSWithSeroquel = seroquelDays.reduce((sum, d) => sum + d.bloodSugar!, 0) / seroquelDays.length;
    const avgBSWithoutSeroquel = nonSeroquelDays.reduce((sum, d) => sum + d.bloodSugar!, 0) / nonSeroquelDays.length;
    
    if (avgBSWithSeroquel > avgBSWithoutSeroquel + 20) {
      insights.push({
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
    const avgMoodWithExercise = validExerciseMoodWork.reduce((sum, d) => sum + d.mood!, 0) / validExerciseMoodWork.length;
    const avgProductivityWithExercise = validExerciseMoodWork.reduce((sum, d) => sum + d.productivity!, 0) / validExerciseMoodWork.length;
    
    const noExerciseDays = dailyData.filter(d => d.exercise === 0 && d.mood !== null && d.productivity !== null);
    if (noExerciseDays.length > 0) {
      const avgMoodNoExercise = noExerciseDays.reduce((sum, d) => sum + d.mood!, 0) / noExerciseDays.length;
      const avgProductivityNoExercise = noExerciseDays.reduce((sum, d) => sum + d.productivity!, 0) / noExerciseDays.length;
      
      if (avgMoodWithExercise > avgMoodNoExercise + 0.5 && avgProductivityWithExercise > avgProductivityNoExercise + 0.5) {
        insights.push({
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
  const highBSWork = dailyData.filter(d => d.bloodSugar && d.bloodSugar > 140 && d.focus !== null);
  const normalBSWork = dailyData.filter(d => d.bloodSugar && d.bloodSugar <= 140 && d.bloodSugar > 0 && d.focus !== null);
  
  if (highBSWork.length >= 2 && normalBSWork.length >= 2) {
    const avgFocusHighBS = highBSWork.reduce((sum, d) => sum + d.focus!, 0) / highBSWork.length;
    const avgFocusNormalBS = normalBSWork.reduce((sum, d) => sum + d.focus!, 0) / normalBSWork.length;
    
    if (avgFocusNormalBS > avgFocusHighBS + 1) {
      insights.push({
        type: 'warning',
        title: 'High Blood Sugar Hurts Focus',
        description: `Focus drops by ${(avgFocusNormalBS - avgFocusHighBS).toFixed(1)} points when blood sugar >140 mg/dL.`,
        icon: <Briefcase className="text-orange-500" size={16} />,
        priority: 'high'
      });
    }
  }

  // Sort insights by priority
  insights.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (b.priority === 'high' && a.priority !== 'high') return 1;
    return 0;
  });

  return insights;
};
