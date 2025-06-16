
import { DailyCorrelationData } from '@/types/analytics';

export const loadDailyCorrelationData = (timeRange: string): DailyCorrelationData[] => {
  const medications = JSON.parse(localStorage.getItem('medications') || '[]');
  const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
  const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
  const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
  const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
  const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');
  const sideEffects = JSON.parse(localStorage.getItem('sideEffects') || '[]');
  const dosageEntries = JSON.parse(localStorage.getItem('dosageEntries') || '[]');

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
    const daySideEffects = sideEffects.filter((effect: any) => 
      new Date(effect.timestamp).toDateString() === dateStr
    );
    const dayDosages = dosageEntries.filter((dosage: any) => 
      new Date(dosage.timestamp).toDateString() === dateStr
    );

    // Calculate averages and totals
    const avgMood = dayMoods.length > 0 
      ? dayMoods.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / dayMoods.length
      : null;
    
    const bloodSugar = dayHealthMetrics.find((m: any) => m.type === 'blood-sugar')?.value || null;
    const sleepHours = dayHealthMetrics.find((m: any) => m.type === 'sleep')?.value || null;
    const weight = dayHealthMetrics.find((m: any) => m.type === 'weight')?.value || null;
    const exerciseMinutes = dayExercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
    
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

    // Check for Seroquel specifically and get dosage
    const seroquelMed = medications.find((m: any) => m.name.toLowerCase().includes('seroquel'));
    const seroquelLog = dayMedLogs.find((log: any) => {
      const med = medications.find((m: any) => m.id === log.medicationId);
      return med && med.name.toLowerCase().includes('seroquel');
    });
    const seroquelTaken = !!seroquelLog;
    const seroquelDosage = seroquelTaken && seroquelMed ? 
      dayDosages.find((d: any) => d.medicationId === seroquelMed.id)?.dosage || null : null;

    // Calculate total daily dosage across all medications
    const totalDosage = dayDosages.reduce((sum: number, dosage: any) => sum + dosage.dosage, 0);

    // Calculate average side effects severity
    const avgSideEffectsSeverity = daySideEffects.length > 0 
      ? daySideEffects.reduce((sum: number, effect: any) => sum + effect.severity, 0) / daySideEffects.length
      : null;

    dailyData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
      bloodSugar,
      sleep: sleepHours,
      exercise: exerciseMinutes,
      productivity: avgProductivity ? Math.round(avgProductivity * 10) / 10 : null,
      focus: avgFocus ? Math.round(avgFocus * 10) / 10 : null,
      energy: avgEnergy ? Math.round(avgEnergy * 10) / 10 : null,
      seroquelTaken,
      seroquelDosage,
      totalDosage,
      sideEffectsSeverity: avgSideEffectsSeverity ? Math.round(avgSideEffectsSeverity * 10) / 10 : null,
      weight
    });
  }

  return dailyData;
};
