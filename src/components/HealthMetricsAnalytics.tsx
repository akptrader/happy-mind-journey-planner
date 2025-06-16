
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Heart, Moon, TrendingUp, Droplets } from 'lucide-react';

interface HealthMetricsAnalyticsProps {
  timeRange: string;
}

interface HealthMetric {
  id: string;
  timestamp: string;
  type: 'heart-rate-variability' | 'sleep' | 'blood-pressure' | 'weight' | 'blood-sugar';
  value: number;
  unit: string;
  notes?: string;
  additionalData?: Record<string, any>;
}

const HealthMetricsAnalytics = ({ timeRange }: HealthMetricsAnalyticsProps) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [averageData, setAverageData] = useState<any[]>([]);

  const parseCustomTimeRange = (timeRange: string) => {
    if (!timeRange.startsWith('custom:')) return null;
    
    const parts = timeRange.split(':');
    if (parts.length !== 3) return null;
    
    return {
      startDate: new Date(parts[1]),
      endDate: new Date(parts[2])
    };
  };

  const getDateRange = (timeRange: string) => {
    if (timeRange.startsWith('custom:')) {
      const customRange = parseCustomTimeRange(timeRange);
      if (customRange) {
        const diffTime = Math.abs(customRange.endDate.getTime() - customRange.startDate.getTime());
        const daysToCheck = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { startDate: customRange.startDate, endDate: customRange.endDate, daysToCheck };
      }
    }
    
    const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysToCheck);
    
    return { startDate, endDate, daysToCheck };
  };

  useEffect(() => {
    const loadData = () => {
      const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]') as HealthMetric[];
      
      const { startDate, endDate, daysToCheck } = getDateRange(timeRange);

      const recentMetrics = healthMetrics.filter((metric: HealthMetric) => {
        const metricDate = new Date(metric.timestamp);
        return metricDate >= startDate && metricDate <= endDate;
      });

      setMetrics(recentMetrics);

      // Generate trend data for each metric type
      const metricTypes = ['heart-rate-variability', 'sleep', 'blood-pressure', 'weight', 'blood-sugar'] as const;
      const trends = [];
      
      for (let i = daysToCheck - 1; i >= 0; i--) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (daysToCheck - 1 - i));
        
        // Skip dates beyond our end date
        if (date > endDate) continue;
        
        const dateStr = date.toDateString();
        
        const dayEntry: any = {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        
        metricTypes.forEach(type => {
          const dayMetrics = recentMetrics.filter((metric: HealthMetric) => 
            new Date(metric.timestamp).toDateString() === dateStr && metric.type === type
          );
          
          if (dayMetrics.length > 0) {
            const avgValue = dayMetrics.reduce((sum: number, metric: HealthMetric) => sum + metric.value, 0) / dayMetrics.length;
            dayEntry[type] = Math.round(avgValue * 10) / 10;
          } else {
            dayEntry[type] = null;
          }
        });
        
        trends.push(dayEntry);
      }
      setTrendData(trends);

      // Calculate averages by type
      const averages = metricTypes.map(type => {
        const typeMetrics = recentMetrics.filter((metric: HealthMetric) => metric.type === type);
        if (typeMetrics.length === 0) return null;
        
        const average = typeMetrics.reduce((sum: number, metric: HealthMetric) => sum + metric.value, 0) / typeMetrics.length;
        const unit = typeMetrics[0]?.unit || '';
        
        return {
          type: type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          average: Math.round(average * 10) / 10,
          unit,
          count: typeMetrics.length
        };
      }).filter(Boolean);
      
      setAverageData(averages);
    };

    loadData();
  }, [timeRange]);

  const chartConfig = {
    'heart-rate-variability': {
      label: "HRV",
      color: "#ef4444",
    },
    sleep: {
      label: "Sleep",
      color: "#3b82f6",
    },
    'blood-pressure': {
      label: "BP",
      color: "#8b5cf6",
    },
    weight: {
      label: "Weight",
      color: "#10b981",
    },
    'blood-sugar': {
      label: "Blood Sugar",
      color: "#f59e0b",
    },
  };

  const getMetricIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'heart rate variability':
        return <Heart className="text-red-500" size={20} />;
      case 'sleep':
        return <Moon className="text-blue-500" size={20} />;
      case 'blood pressure':
        return <Activity className="text-purple-500" size={20} />;
      case 'weight':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'blood sugar':
        return <Droplets className="text-yellow-500" size={20} />;
      default:
        return <Activity className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Trend */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Health Metrics Trend</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="heart-rate-variability" 
              stroke="#ef4444" 
              strokeWidth={2}
              connectNulls={false}
              name="HRV (ms)"
            />
            <Line 
              type="monotone" 
              dataKey="sleep" 
              stroke="#3b82f6" 
              strokeWidth={2}
              connectNulls={false}
              name="Sleep (hrs)"
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#10b981" 
              strokeWidth={2}
              connectNulls={false}
              name="Weight (lbs)"
            />
            <Line 
              type="monotone" 
              dataKey="blood-sugar" 
              stroke="#f59e0b" 
              strokeWidth={2}
              connectNulls={false}
              name="Blood Sugar (mg/dL)"
            />
          </LineChart>
        </ChartContainer>
      </Card>

      {/* Average Values */}
      {averageData.length > 0 && (
        <Card className="medication-card bg-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-hot-pink" size={20} />
            <h3 className="text-lg font-semibold text-foreground">Average Values</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {averageData.map((item, index) => (
              <Card key={index} className="bg-gray-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getMetricIcon(item.type)}
                  <span className="font-medium text-foreground">{item.type}</span>
                </div>
                <div className="text-2xl font-bold text-gold">
                  {item.average}{item.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.count} recordings
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HealthMetricsAnalytics;
