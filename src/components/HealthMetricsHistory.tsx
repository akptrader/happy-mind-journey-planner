
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Heart, Moon, Activity } from 'lucide-react';

interface HealthMetric {
  id: string;
  timestamp: string;
  type: 'heart-rate-variability' | 'sleep' | 'blood-pressure' | 'weight';
  value: number;
  unit: string;
  notes?: string;
  additionalData?: Record<string, any>;
}

interface HealthMetricsHistoryProps {
  metrics: HealthMetric[];
  onBack: () => void;
}

const HealthMetricsHistory = ({ metrics, onBack }: HealthMetricsHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'heart-rate-variability':
        return <Heart className="text-red-500" size={16} />;
      case 'sleep':
        return <Moon className="text-blue-500" size={16} />;
      case 'blood-pressure':
        return <Activity className="text-purple-500" size={16} />;
      case 'weight':
        return <Activity className="text-green-500" size={16} />;
      default:
        return <Activity className="text-gray-500" size={16} />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'heart-rate-variability':
        return 'border-l-red-500';
      case 'sleep':
        return 'border-l-blue-500';
      case 'blood-pressure':
        return 'border-l-purple-500';
      case 'weight':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  // Group metrics by date
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const date = new Date(metric.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(metric);
    return acc;
  }, {} as Record<string, HealthMetric[]>);

  const dates = Object.keys(groupedMetrics).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const filteredDates = selectedDate ? [selectedDate] : dates;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <h2 className="text-2xl font-semibold text-foreground">Health Metrics History</h2>
      </div>

      {dates.length > 1 && (
        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-hot-pink" />
            <span className="font-medium">Filter by date:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedDate('')}
              variant={selectedDate === '' ? 'default' : 'outline'}
              size="sm"
            >
              All dates
            </Button>
            {dates.slice(0, 7).map(date => (
              <Button
                key={date}
                onClick={() => setSelectedDate(date)}
                variant={selectedDate === date ? 'default' : 'outline'}
                size="sm"
              >
                {new Date(date).toLocaleDateString()}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {filteredDates.length === 0 ? (
        <Card className="medication-card bg-gray-800 p-6 text-center">
          <p className="text-muted-foreground">No health metrics found.</p>
        </Card>
      ) : (
        filteredDates.map(date => (
          <div key={date} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-hot-pink" />
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {groupedMetrics[date]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(metric => (
                <Card key={metric.id} className={`medication-card border-l-4 ${getMetricColor(metric.type)} bg-gray-800`}>
                  <div className="flex items-start justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getMetricIcon(metric.type)}
                        <span className="font-medium text-gold">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="font-semibold text-foreground capitalize">
                          {metric.type.replace('-', ' ')}
                        </span>
                        <span className="font-bold text-lg text-gold">
                          {metric.value}{metric.unit}
                        </span>
                      </div>
                      {metric.notes && (
                        <p className="text-sm text-champagne ml-7 mb-2">{metric.notes}</p>
                      )}
                      {metric.additionalData && Object.keys(metric.additionalData).length > 0 && (
                        <div className="ml-7">
                          {Object.entries(metric.additionalData).map(([key, value]) => (
                            <div key={key} className="text-xs text-muted-foreground">
                              <span className="capitalize">{key.replace('-', ' ')}: </span>
                              <span className="text-gold">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default HealthMetricsHistory;
