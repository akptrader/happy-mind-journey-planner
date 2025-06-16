
import React from 'react';
import { Moon, Zap, Briefcase, Droplets, Pill, Weight, Activity } from 'lucide-react';
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

  // Seroquel dosage vs Blood Sugar correlation
  const seroquelDosageDays = dailyData.filter(d => d.seroquelDosage !== null && d.bloodSugar !== null);
  if (seroquelDosageDays.length >= 3) {
    const highDoseDays = seroquelDosageDays.filter(d => d.seroquelDosage! > 50);
    const lowDoseDays = seroquelDosageDays.filter(d => d.seroquelDosage! <= 50);
    
    if (highDoseDays.length > 0 && lowDoseDays.length > 0) {
      const avgBSHighDose = highDoseDays.reduce((sum, d) => sum + d.bloodSugar!, 0) / highDoseDays.length;
      const avgBSLowDose = lowDoseDays.reduce((sum, d) => sum + d.bloodSugar!, 0) / lowDoseDays.length;
      
      if (avgBSHighDose > avgBSLowDose + 15) {
        insights.push({
          type: 'warning',
          title: 'Higher Seroquel Dosage Correlates with Higher Blood Sugar',
          description: `Blood sugar averages ${avgBSHighDose.toFixed(0)} mg/dL on high-dose days vs ${avgBSLowDose.toFixed(0)} mg/dL on lower doses.`,
          icon: <Pill className="text-red-500" size={16} />,
          priority: 'high'
        });
      }
    }
  }

  // Total medication dosage vs side effects correlation
  const dosageSideEffectDays = dailyData.filter(d => d.totalDosage > 0 && d.sideEffectsSeverity !== null);
  if (dosageSideEffectDays.length >= 3) {
    const correlation = calculateCorrelation(
      dosageSideEffectDays.map(d => d.totalDosage),
      dosageSideEffectDays.map(d => d.sideEffectsSeverity!)
    );
    
    if (correlation > 0.5) {
      insights.push({
        type: 'warning',
        title: 'Higher Total Dosage Increases Side Effects',
        description: `Strong correlation (${(correlation * 100).toFixed(0)}%) between total daily medication dosage and side effect severity.`,
        icon: <Activity className="text-orange-500" size={16} />,
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

  // Weight changes correlation with medication
  const weightData = dailyData.filter(d => d.weight !== null && d.totalDosage > 0);
  if (weightData.length >= 5) {
    const sortedByDate = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const weightChange = sortedByDate[sortedByDate.length - 1].weight! - sortedByDate[0].weight!;
    const avgDosage = sortedByDate.reduce((sum, d) => sum + d.totalDosage, 0) / sortedByDate.length;
    
    if (Math.abs(weightChange) > 2) {
      insights.push({
        type: weightChange > 0 ? 'warning' : 'info',
        title: `Weight ${weightChange > 0 ? 'Gain' : 'Loss'} with Current Medication Regimen`,
        description: `${Math.abs(weightChange).toFixed(1)} lbs ${weightChange > 0 ? 'gained' : 'lost'} with average daily dosage of ${avgDosage.toFixed(0)}mg.`,
        icon: <Weight className="text-purple-500" size={16} />,
        priority: 'medium'
      });
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

// Helper function to calculate correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}
