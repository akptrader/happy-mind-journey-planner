
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Brain, Pill, Activity, AlertTriangle, Target } from 'lucide-react';

interface CorrelationData {
  date: string;
  mood: number | null;
  medication: boolean;
  sideEffects: number | null;
  sleep: number | null;
  exercise: number;
  bloodSugar: number | null;
  triggers: string[];
}

interface SymptomPattern {
  symptom: string;
  correlations: {
    factor: string;
    strength: number; // -1 to 1
    confidence: number; // 0 to 1
    description: string;
  }[];
  recommendations: string[];
}

const SymptomCorrelation = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedSymptom, setSelectedSymptom] = useState('mood');
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [patterns, setPatterns] = useState<SymptomPattern[]>([]);

  useEffect(() => {
    loadCorrelationData();
  }, [timeRange]);

  useEffect(() => {
    analyzePatterns();
  }, [correlationData, selectedSymptom]);

  const loadCorrelationData = () => {
    const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data: CorrelationData[] = [];

    // Load all data sources
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
    const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    const sideEffects = JSON.parse(localStorage.getItem('sideEffects') || '[]');

    for (let i = daysToCheck - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      // Get data for this day
      const dayMoods = moodEntries.filter((entry: any) => 
        new Date(entry.timestamp).toDateString() === dateStr
      );
      const dayMedications = medicationLog.filter((log: any) => 
        new Date(log.timestamp).toDateString() === dateStr
      );
      const dayHealthMetrics = healthMetrics.filter((metric: any) => 
        new Date(metric.timestamp).toDateString() === dateStr
      );
      const dayExercises = exercises.filter((exercise: any) => 
        new Date(exercise.timestamp).toDateString() === dateStr
      );
      const daySideEffects = sideEffects.filter((effect: any) => 
        new Date(effect.timestamp).toDateString() === dateStr
      );

      // Calculate averages and extract triggers
      const avgMood = dayMoods.length > 0 
        ? dayMoods.reduce((sum: number, entry: any) => sum + entry.moodLevel, 0) / dayMoods.length
        : null;

      const triggers = dayMoods.flatMap((mood: any) => mood.triggers || []);
      const sleepHours = dayHealthMetrics.find((m: any) => m.type === 'sleep')?.value || null;
      const bloodSugar = dayHealthMetrics.find((m: any) => m.type === 'blood-sugar')?.value || null;
      const exerciseMinutes = dayExercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
      const avgSideEffects = daySideEffects.length > 0 
        ? daySideEffects.reduce((sum: number, effect: any) => sum + effect.severity, 0) / daySideEffects.length
        : null;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
        medication: dayMedications.length > 0,
        sideEffects: avgSideEffects ? Math.round(avgSideEffects * 10) / 10 : null,
        sleep: sleepHours,
        exercise: exerciseMinutes,
        bloodSugar,
        triggers
      });
    }

    setCorrelationData(data);
  };

  const analyzePatterns = () => {
    if (correlationData.length < 7) return; // Need at least a week of data

    const newPatterns: SymptomPattern[] = [];

    // Analyze mood correlations
    if (selectedSymptom === 'mood') {
      const moodData = correlationData.filter(d => d.mood !== null);
      const correlations = [];

      // Sleep correlation
      const sleepCorr = calculateCorrelation(
        moodData.filter(d => d.sleep !== null),
        'mood',
        'sleep'
      );
      if (Math.abs(sleepCorr) > 0.3) {
        correlations.push({
          factor: 'Sleep',
          strength: sleepCorr,
          confidence: 0.8,
          description: sleepCorr > 0 
            ? 'Better sleep is associated with improved mood'
            : 'Poor sleep appears to negatively impact your mood'
        });
      }

      // Exercise correlation
      const exerciseCorr = calculateCorrelation(moodData, 'mood', 'exercise');
      if (Math.abs(exerciseCorr) > 0.25) {
        correlations.push({
          factor: 'Exercise',
          strength: exerciseCorr,
          confidence: 0.7,
          description: exerciseCorr > 0 
            ? 'Exercise sessions are linked to better mood'
            : 'Lack of exercise may be affecting your mood'
        });
      }

      // Side effects correlation
      const sideEffectsCorr = calculateCorrelation(
        moodData.filter(d => d.sideEffects !== null),
        'mood',
        'sideEffects'
      );
      if (Math.abs(sideEffectsCorr) > 0.3) {
        correlations.push({
          factor: 'Side Effects',
          strength: sideEffectsCorr,
          confidence: 0.75,
          description: sideEffectsCorr < 0 
            ? 'Higher side effect severity correlates with lower mood'
            : 'Side effects seem to have unexpected positive correlation'
        });
      }

      // Generate recommendations
      const recommendations = [];
      if (sleepCorr > 0.3) {
        recommendations.push('Prioritize consistent sleep schedule for mood stability');
      }
      if (exerciseCorr > 0.25) {
        recommendations.push('Regular exercise appears to boost your mood significantly');
      }
      if (sideEffectsCorr < -0.3) {
        recommendations.push('Consider discussing side effect management with your doctor');
      }

      newPatterns.push({
        symptom: 'Mood',
        correlations,
        recommendations
      });
    }

    setPatterns(newPatterns);
  };

  const calculateCorrelation = (data: any[], xKey: string, yKey: string): number => {
    const validData = data.filter(d => d[xKey] !== null && d[yKey] !== null);
    if (validData.length < 3) return 0;

    const n = validData.length;
    const xValues = validData.map(d => d[xKey]);
    const yValues = validData.map(d => d[yKey]);

    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let xSumSquares = 0;
    let ySumSquares = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      numerator += xDiff * yDiff;
      xSumSquares += xDiff * xDiff;
      ySumSquares += yDiff * yDiff;
    }

    const denominator = Math.sqrt(xSumSquares * ySumSquares);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const getCorrelationStrength = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const getCorrelationColor = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.7) return strength > 0 ? 'text-green-400' : 'text-red-400';
    if (abs >= 0.4) return strength > 0 ? 'text-blue-400' : 'text-orange-400';
    return 'text-gray-400';
  };

  const chartData = correlationData.map(d => ({
    date: d.date,
    mood: d.mood,
    sleep: d.sleep ? d.sleep * 1.2 : null, // Scale for visibility
    exercise: d.exercise / 10, // Scale down minutes
    sideEffects: d.sideEffects
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Symptom Correlation Analysis</h2>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mood">Mood</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Correlation Chart */}
      <Card className="medication-card p-4">
        <h3 className="font-medium text-foreground mb-4">Trend Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#EC4899" 
                strokeWidth={2}
                name="Mood (1-10)"
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Sleep (scaled)"
              />
              <Line 
                type="monotone" 
                dataKey="exercise" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Exercise (scaled)"
              />
              {selectedSymptom === 'mood' && (
                <Line 
                  type="monotone" 
                  dataKey="sideEffects" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Side Effects"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Correlation Analysis */}
      {patterns.map((pattern, index) => (
        <Card key={index} className="medication-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-blue-400" size={20} />
            <h3 className="font-medium text-foreground">{pattern.symptom} Correlations</h3>
          </div>

          <div className="space-y-4">
            {pattern.correlations.map((corr, corrIndex) => (
              <div key={corrIndex} className="border border-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{corr.factor}</Badge>
                    <span className={`text-sm font-medium ${getCorrelationColor(corr.strength)}`}>
                      {getCorrelationStrength(corr.strength)} {corr.strength > 0 ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(corr.confidence * 100)}% confidence
                  </div>
                </div>
                
                <Progress 
                  value={Math.abs(corr.strength) * 100} 
                  className="h-2 mb-2"
                />
                
                <p className="text-sm text-champagne">{corr.description}</p>
              </div>
            ))}

            {pattern.correlations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle size={48} className="mx-auto mb-3 opacity-50" />
                <p>Not enough data to identify strong correlations</p>
                <p className="text-xs mt-1">Keep tracking for more insights</p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {pattern.recommendations.length > 0 && (
            <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-sm font-medium text-green-400">Recommendations</span>
              </div>
              <ul className="space-y-1">
                {pattern.recommendations.map((rec, recIndex) => (
                  <li key={recIndex} className="text-sm text-champagne flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ))}

      {/* Data Requirements Notice */}
      {correlationData.filter(d => d.mood !== null).length < 7 && (
        <Card className="medication-card p-4 border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            <span className="font-medium text-yellow-500">Insufficient Data</span>
          </div>
          <p className="text-sm text-champagne">
            Continue tracking your mood, medications, and activities for at least a week to see meaningful correlations and patterns.
          </p>
        </Card>
      )}
    </div>
  );
};

export default SymptomCorrelation;
