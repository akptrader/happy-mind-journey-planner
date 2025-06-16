
export interface DailyCorrelationData {
  date: string;
  mood: number | null;
  bloodSugar: number | null;
  sleep: number | null;
  exercise: number;
  medicationAdherence: number;
  productivity: number | null;
  focus: number | null;
  energy: number | null;
  seroquelTaken: boolean;
}

export interface AnalyticsInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}
