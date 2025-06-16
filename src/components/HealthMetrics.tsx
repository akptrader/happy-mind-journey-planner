
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Moon, Activity, Plus, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddHealthMetricDialog from './AddHealthMetricDialog';
import HealthMetricsHistory from './HealthMetricsHistory';

interface HealthMetric {
  id: string;
  timestamp: string;
  type: 'heart-rate-variability' | 'sleep' | 'blood-pressure' | 'weight';
  value: number;
  unit: string;
  notes?: string;
  additionalData?: Record<string, any>;
}

interface HealthMetricsProps {
  onBack?: () => void;
}

const HealthMetrics = ({ onBack }: HealthMetricsProps) => {
  const { toast } = useToast();
  const [addMetricOpen, setAddMetricOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [metrics, setMetrics] = useState<HealthMetric[]>(() => {
    const saved = localStorage.getItem('healthMetrics');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('healthMetrics', JSON.stringify(metrics));
  }, [metrics]);

  const handleAddMetric = (metric: Omit<HealthMetric, 'id' | 'timestamp'>) => {
    const newMetric: HealthMetric = {
      ...metric,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setMetrics(prev => [newMetric, ...prev]);
    setAddMetricOpen(false);
    
    toast({
      title: "Health metric logged! 📊",
      description: `${metric.type.replace('-', ' ')} recorded: ${metric.value}${metric.unit}`,
    });
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'heart-rate-variability':
        return <Heart className="text-red-500" size={18} />;
      case 'sleep':
        return <Moon className="text-blue-500" size={18} />;
      case 'blood-pressure':
        return <Activity className="text-purple-500" size={18} />;
      case 'weight':
        return <Activity className="text-green-500" size={18} />;
      default:
        return <Activity className="text-gray-500" size={18} />;
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

  if (showHistory) {
    return (
      <HealthMetricsHistory 
        metrics={metrics}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  const todayMetrics = metrics.filter(metric => 
    new Date(metric.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Activity className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Health Metrics</h2>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setAddMetricOpen(true)}
            className="bg-hot-pink text-black hover:bg-hot-pink/90"
          >
            <Plus size={18} />
            Add Metric
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History size={18} />
            History
          </Button>
        </div>
      </div>

      <Card className="medication-card bg-gray-800 p-4">
        <h3 className="font-semibold text-foreground mb-3">Today's Metrics</h3>
        {todayMetrics.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No health metrics logged today</p>
        ) : (
          <div className="space-y-3">
            {todayMetrics.map((metric) => (
              <Card key={metric.id} className={`border-l-4 ${getMetricColor(metric.type)} bg-gray-700`}>
                <div className="flex items-start justify-between p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getMetricIcon(metric.type)}
                      <span className="font-medium text-foreground capitalize">
                        {metric.type.replace('-', ' ')}
                      </span>
                      <span className="font-bold text-lg text-gold">
                        {metric.value}{metric.unit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {metric.notes && (
                      <p className="text-sm text-champagne ml-6">{metric.notes}</p>
                    )}
                    {metric.additionalData && Object.keys(metric.additionalData).length > 0 && (
                      <div className="ml-6 mt-1">
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
        )}
      </Card>

      <AddHealthMetricDialog
        open={addMetricOpen}
        onOpenChange={setAddMetricOpen}
        onSubmit={handleAddMetric}
      />
    </div>
  );
};

export default HealthMetrics;
