
interface MetricOption {
  id: string;
  dataKey: string;
  scale?: number;
}

export const loadFlexibleAnalyticsData = (timeRange: string, selectedMetrics: string[], metricOptions: MetricOption[]) => {
  // Load all data sources
  const medications = JSON.parse(localStorage.getItem('medications') || '[]');
  const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
  const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
  const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
  const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
  const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');
  const sideEffects = JSON.parse(localStorage.getItem('sideEffects') || '[]');
  const dosageEntries = JSON.parse(localStorage.getItem('dosageEntries') || '[]');
  const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');

  const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const dailyData: any[] = [];

  for (let i = daysToCheck - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();

    // Get data for this day
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
    const dayFood = foodEntries.filter((food: any) => 
      new Date(food.timestamp).toDateString() === dateStr
    );

    const dayEntry: any = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    // Process each selected metric
    selectedMetrics.forEach(metricId => {
      const option = metricOptions.find(opt => opt.id === metricId);
      if (!option) return;

      let value = null;
      const scale = option.scale || 1;

      switch (metricId) {
        case 'mood':
          if (dayMoods.length > 0) {
            value = dayMoods.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / dayMoods.length;
          }
          break;
        
        case 'rapidCycling':
          value = dayMoods.filter((entry: any) => entry.episode === 'rapid-cycling').length;
          break;
        
        case 'anxietyLevel':
          const anxietyEntries = dayMoods.filter((entry: any) => entry.episode === 'anxiety');
          if (anxietyEntries.length > 0) {
            value = anxietyEntries.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / anxietyEntries.length;
          }
          break;
        
        case 'depressionLevel':
          const depressionEntries = dayMoods.filter((entry: any) => entry.episode === 'depression');
          if (depressionEntries.length > 0) {
            value = depressionEntries.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / depressionEntries.length;
          }
          break;

        case 'bloodSugar':
          const bloodSugarMetric = dayHealthMetrics.find((m: any) => m.type === 'blood-sugar');
          value = bloodSugarMetric?.value || null;
          break;

        case 'weight':
          const weightMetric = dayHealthMetrics.find((m: any) => m.type === 'weight');
          value = weightMetric?.value || null;
          break;

        case 'hrv':
          const hrvMetric = dayHealthMetrics.find((m: any) => m.type === 'heart-rate-variability');
          value = hrvMetric?.value || null;
          break;

        case 'bloodPressure':
          const bpMetric = dayHealthMetrics.find((m: any) => m.type === 'blood-pressure');
          value = bpMetric?.value || null;
          break;

        case 'sleep':
          const sleepMetric = dayHealthMetrics.find((m: any) => m.type === 'sleep');
          value = sleepMetric?.value || null;
          break;

        case 'seroquelDosage':
          const seroquelDosage = dayDosages.find((d: any) => 
            d.medicationName.toLowerCase().includes('seroquel')
          );
          value = seroquelDosage?.dosage || null;
          break;

        case 'lantusDosage':
          const lantusDosage = dayDosages.find((d: any) => 
            d.medicationName.toLowerCase().includes('lantus')
          );
          value = lantusDosage?.dosage || null;
          break;

        case 'cobenfyDosage':
          const cobenfyDosage = dayDosages.find((d: any) => 
            d.medicationName.toLowerCase().includes('cobenfy')
          );
          value = cobenfyDosage?.dosage || null;
          break;

        case 'sideEffectsSeverity':
          if (daySideEffects.length > 0) {
            value = daySideEffects.reduce((sum: number, effect: any) => sum + effect.severity, 0) / daySideEffects.length;
          }
          break;

        case 'exercise':
          value = dayExercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
          break;

        case 'productivity':
          if (dayWork.length > 0) {
            value = dayWork.reduce((sum: number, work: any) => sum + work.productivityLevel, 0) / dayWork.length;
          }
          break;

        case 'focus':
          if (dayWork.length > 0) {
            value = dayWork.reduce((sum: number, work: any) => sum + work.focusLevel, 0) / dayWork.length;
          }
          break;

        case 'energy':
          if (dayWork.length > 0) {
            value = dayWork.reduce((sum: number, work: any) => sum + work.energyLevel, 0) / dayWork.length;
          }
          break;

        case 'calories':
          value = dayFood.reduce((sum: number, food: any) => sum + food.calories, 0) || null;
          break;

        case 'protein':
          value = dayFood.reduce((sum: number, food: any) => sum + (food.protein || 0), 0) || null;
          break;

        case 'carbs':
          value = dayFood.reduce((sum: number, food: any) => sum + (food.carbs || 0), 0) || null;
          break;

        case 'fat':
          value = dayFood.reduce((sum: number, food: any) => sum + (food.fat || 0), 0) || null;
          break;
      }

      // Apply scaling and rounding
      if (value !== null) {
        value = Math.round(value * scale * 10) / 10;
      }

      dayEntry[option.dataKey] = value;
    });

    dailyData.push(dayEntry);
  }

  return dailyData;
};
