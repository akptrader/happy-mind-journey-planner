
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ComposedChart, Bar } from 'recharts';
import { Activity, Heart, Moon, TrendingUp } from 'lucide-react';

interface HealthMetricsAnalyticsProps {
  timeRange: string;
}

const HealthMetricsAnalytics = ({ timeRange }: HealthMetricsAnalyticsProps) => {
  const [metricsData, setMetricsData] = useState<any[]>([]);
  const [metricTypes, setMetricTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadData = () => {
      const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
      
      const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToCheck);

      const recentMetrics = healthMetrics.filter((metric: any) => 
        new Date(metric.timestamp) >= startDate
      );

      // Get unique metric types
      const types = [...new Set(recentMetrics.map((m: any) => m.type))];
      setMetricTypes(types);

      // Group by date and metric type
      const dataByDate: Record<string, any> = {};
      
      for (let i = daysToCheck - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        dataByDate[dateStr] = { date: displayDate };
        
        types.forEach(type => {
          const dayMetrics = recentMetrics.filter((metric: any) => 
            new Date(metric.timestamp).toISOString().split('T')[0] === dateStr && 
            metric.type === type
          );
          
          if (dayMetrics.length > 0) {
            if (type === 'blood-pressure') {
              // For blood pressure, use systolic value
              const avgSystolic = dayMetrics.reduce((sum: number, m: any) => 
                sum + (m.additionalData?.systolic || m.value), 0) / dayMetrics.length;
              dataByDate[dateStr][type] = Math.round(avgSystolic);
            } else {
              const avgValue = dayMetrics.reduce((sum: number, m: any) => sum + m.value, 0) / dayMetrics.length;
              dataByDate[dateStr][type] = Math.round(avgValue * 100) / 100;
            }
          }
        });
      }

      const chartData = Object.values(dataByDate);
      setMetricsData(chartData);
    };

    loadData();
  }, [timeRange]);

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'heart-rate-variability':
        return <Heart className="text-red-500" size={16} />;
      case 'sleep':
        return <Moon className="text-blue-500" size={16} />;
      case 'blood-pressure':
        return <Activity className="text-purple-500" size={16} />;
      case 'weight':
        return <TrendingUp className="text-green-500" size={16} />;
      default:
        return <Activity className="text-gray-500" size={16} />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'heart-rate-variability':
        return '#ef4444';
      case 'sleep':
        return '#3b82f6';
      case 'blood-pressure':
        return '#8b5cf6';
      case 'weight':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatMetricName = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const chartConfig = metricTypes.reduce((config: any, type) => {
    config[type] = {
      label: formatMetricName(type),
      color: getMetricColor(type),
    };
    return config;
  }, {});

  if (metricTypes.length === 0) {
    return (
      <Card className="medication-card bg-gray-800 p-6 text-center">
        <Activity className="text-hot-pink mx-auto mb-4" size={48} />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Health Metrics Data</h3>
        <p className="text-muted-foreground">Start logging health metrics to see your trends and analytics here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* All Metrics Combined */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Health Metrics Trends</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <ComposedChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            {metricTypes.map((type, index) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={getMetricColor(type)}
                strokeWidth={2}
                dot={{ fill: getMetricColor(type), strokeWidth: 2, r: 3 }}
                connectNulls={false}
              />
            ))}
          </ComposedChart>
        </ChartContainer>
      </Card>

      {/* Individual Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metricTypes.map(type => {
          const typeData = metricsData.filter(d => d[type] !== undefined);
          const latestValue = typeData.length > 0 ? typeData[typeData.length - 1][type] : null;
          const previousValue = typeData.length > 1 ? typeData[typeData.length - 2][type] : null;
          const trend = latestValue && previousValue ? latestValue - previousValue : 0;

          return (
            <Card key={type} className="medication-card bg-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getMetricIcon(type)}
                  <h4 className="font-semibold text-foreground">{formatMetricName(type)}</h4>
                </div>
                {trend !== 0 && (
                  <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp 
                      size={14} 
                      className={trend < 0 ? 'rotate-180' : ''}
                    />
                    {Math.abs(trend).toFixed(1)}
                  </div>
                )}
              </div>
              
              {latestValue !== null && (
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gold">{latestValue}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {type === 'heart-rate-variability' && 'ms'}
                    {type === 'sleep' && 'hours'}
                    {type === 'blood-pressure' && 'mmHg (systolic)'}
                    {type === 'weight' && 'lbs'}
                  </span>
                </div>
              )}

              <ChartContainer config={chartConfig} className="h-32">
                <LineChart data={typeData}>
                  <Line
                    type="monotone"
                    dataKey={type}
                    stroke={getMetricColor(type)}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HealthMetricsAnalytics;
