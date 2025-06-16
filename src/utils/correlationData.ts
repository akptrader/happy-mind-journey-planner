
import { DailyCorrelationData } from '@/types/analytics';

export const loadDailyCorrelationData = (timeRange: string): DailyCorrelationData[] => {
  const medications = JSON.parse(localStorage.getItem('medications') || '[]');
  const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
  const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
  const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
  const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
  const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');

  const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const dailyData: DailyCorrelationData[] = [];

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

  return dailyData;
};
