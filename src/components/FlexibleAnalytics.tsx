
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Settings, X, Download } from 'lucide-react';
import { loadFlexibleAnalyticsData } from '@/utils/flexibleAnalyticsData';

interface MetricOption {
  id: string;
  label: string;
  category: string;
  color: string;
  dataKey: string;
  unit?: string;
  scale?: number; // For scaling values for better visualization
}

interface FlexibleAnalyticsProps {
  timeRange: string;
}

const FlexibleAnalytics = ({ timeRange }: FlexibleAnalyticsProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['mood', 'bloodSugar']);
  const [showSettings, setShowSettings] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const metricOptions: MetricOption[] = [
    // Health Metrics
    { id: 'mood', label: 'Mood Level', category: 'Mental Health', color: '#ec4899', dataKey: 'mood', unit: '/10' },
    { id: 'rapidCycling', label: 'Rapid Cycling Episodes', category: 'Mental Health', color: '#f97316', dataKey: 'rapidCycling', unit: 'episodes' },
    { id: 'anxietyLevel', label: 'Anxiety Level', category: 'Mental Health', color: '#ef4444', dataKey: 'anxietyLevel', unit: '/10' },
    { id: 'depressionLevel', label: 'Depression Level', category: 'Mental Health', color: '#8b5cf6', dataKey: 'depressionLevel', unit: '/10' },
    
    // Physical Health
    { id: 'bloodSugar', label: 'Blood Sugar', category: 'Physical Health', color: '#f59e0b', dataKey: 'bloodSugar', unit: 'mg/dL' },
    { id: 'weight', label: 'Weight', category: 'Physical Health', color: '#10b981', dataKey: 'weight', unit: 'lbs' },
    { id: 'hrv', label: 'Heart Rate Variability', category: 'Physical Health', color: '#ef4444', dataKey: 'hrv', unit: 'ms' },
    { id: 'bloodPressure', label: 'Blood Pressure', category: 'Physical Health', color: '#8b5cf6', dataKey: 'bloodPressure', unit: 'mmHg', scale: 0.1 },
    { id: 'sleep', label: 'Sleep Hours', category: 'Physical Health', color: '#3b82f6', dataKey: 'sleep', unit: 'hrs' },
    
    // Medications
    { id: 'seroquelDosage', label: 'Seroquel Dosage', category: 'Medications', color: '#8b5cf6', dataKey: 'seroquelDosage', unit: 'mg', scale: 0.1 },
    { id: 'lantusDosage', label: 'Lantus Dosage', category: 'Medications', color: '#06b6d4', dataKey: 'lantusDosage', unit: 'units' },
    { id: 'cobenfyDosage', label: 'Cobenfy Dosage', category: 'Medications', color: '#a855f7', dataKey: 'cobenfyDosage', unit: 'mg', scale: 0.1 },
    { id: 'sideEffectsSeverity', label: 'Side Effects Severity', category: 'Medications', color: '#f97316', dataKey: 'sideEffectsSeverity', unit: '/10' },
    
    // Lifestyle
    { id: 'exercise', label: 'Exercise Minutes', category: 'Lifestyle', color: '#10b981', dataKey: 'exercise', unit: 'min', scale: 0.1 },
    { id: 'productivity', label: 'Productivity', category: 'Work', color: '#ffd700', dataKey: 'productivity', unit: '/10' },
    { id: 'focus', label: 'Focus Level', category: 'Work', color: '#f5deb3', dataKey: 'focus', unit: '/10' },
    { id: 'energy', label: 'Energy Level', category: 'Work', color: '#22c55e', dataKey: 'energy', unit: '/10' },
    
    // Nutrition
    { id: 'calories', label: 'Daily Calories', category: 'Nutrition', color: '#f59e0b', dataKey: 'calories', unit: 'cal', scale: 0.001 },
    { id: 'protein', label: 'Protein Intake', category: 'Nutrition', color: '#ef4444', dataKey: 'protein', unit: 'g', scale: 0.1 },
    { id: 'carbs', label: 'Carbohydrates', category: 'Nutrition', color: '#8b5cf6', dataKey: 'carbs', unit: 'g', scale: 0.1 },
    { id: 'fat', label: 'Fat Intake', category: 'Nutrition', color: '#f97316', dataKey: 'fat', unit: 'g', scale: 0.1 },
  ];

  const categories = [...new Set(metricOptions.map(option => option.category))];

  useEffect(() => {
    const data = loadFlexibleAnalyticsData(timeRange, selectedMetrics, metricOptions);
    setChartData(data);
  }, [timeRange, selectedMetrics]);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const removeMetric = (metricId: string) => {
    setSelectedMetrics(prev => prev.filter(id => id !== metricId));
  };

  const exportToCSV = () => {
    if (chartData.length === 0) return;

    // Create CSV headers
    const headers = ['Date', ...selectedMetricOptions.map(option => `${option.label}${option.unit ? ` (${option.unit})` : ''}`)];
    
    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...chartData.map(row => {
        const values = [
          row.date,
          ...selectedMetricOptions.map(option => row[option.dataKey] ?? '')
        ];
        return values.join(',');
      })
    ];

    // Create and download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `custom-analytics-${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedMetricOptions = metricOptions.filter(option => selectedMetrics.includes(option.id));

  const chartConfig = selectedMetricOptions.reduce((config, option) => {
    config[option.dataKey] = {
      label: option.label,
      color: option.color,
    };
    return config;
  }, {} as any);

  return (
    <div className="space-y-6">
      {/* Selected Metrics Display */}
      <Card className="medication-card bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-hot-pink" size={20} />
            <h3 className="text-lg font-semibold text-foreground">Custom Analytics</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              disabled={chartData.length === 0}
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="sm"
            >
              <Settings size={16} className="mr-2" />
              Customize
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedMetricOptions.map(option => (
            <Badge 
              key={option.id} 
              variant="secondary" 
              className="flex items-center gap-1"
              style={{ backgroundColor: `${option.color}20`, color: option.color }}
            >
              {option.label}
              <X 
                size={12} 
                className="cursor-pointer hover:text-red-500"
                onClick={() => removeMetric(option.id)}
              />
            </Badge>
          ))}
        </div>

        {showSettings && (
          <div className="border-t border-gray-600 pt-4 mt-4">
            {categories.map(category => (
              <div key={category} className="mb-4">
                <h4 className="text-md font-medium text-foreground mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {metricOptions
                    .filter(option => option.category === category)
                    .map(option => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={selectedMetrics.includes(option.id)}
                          onCheckedChange={() => toggleMetric(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Chart */}
      <Card className="medication-card bg-gray-800 p-6">
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            {selectedMetricOptions.map((option, index) => (
              <Line
                key={option.id}
                type="monotone"
                dataKey={option.dataKey}
                stroke={option.color}
                strokeWidth={2}
                connectNulls={false}
                name={`${option.label}${option.unit ? ` (${option.unit})` : ''}`}
                strokeDasharray={index % 2 === 1 ? "3 3" : undefined}
              />
            ))}
          </LineChart>
        </ChartContainer>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Note: Some values may be scaled for better visualization. Hover over data points for exact values.</p>
        </div>
      </Card>
    </div>
  );
};

export default FlexibleAnalytics;
