
export interface DailyCorrelationData {
  date: string;
  mood: number | null;
  bloodSugar: number | null;
  sleep: number | null;
  exercise: number;
  productivity: number | null;
  focus: number | null;
  energy: number | null;
  seroquelTaken: boolean;
  seroquelDosage: number | null;
  totalDosage: number;
  sideEffectsSeverity: number | null;
  weight: number | null;
}

export interface AnalyticsInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

export interface SideEffect {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  effects: string[];
  severity: number; // 1-10 scale
  notes?: string;
}

export interface DosageEntry {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  dosage: number;
  unit: string;
  notes?: string;
}
