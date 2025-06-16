
import React from 'react';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { AnalyticsInsight } from '@/types/analytics';

interface InsightsDisplayProps {
  insights: AnalyticsInsight[];
}

const InsightsDisplay = ({ insights }: InsightsDisplayProps) => {
  if (insights.length === 0) return null;

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-hot-pink" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Key Insights for Bipolar & Diabetes Management</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
            insight.type === 'positive' ? 'bg-green-900/20 border-green-500' :
            insight.type === 'warning' ? 'bg-red-900/20 border-red-500' :
            'bg-blue-900/20 border-blue-500'
          } ${insight.priority === 'high' ? 'ring-2 ring-hot-pink/30' : ''}`}>
            {insight.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{insight.title}</p>
                {insight.priority === 'high' && (
                  <span className="text-xs bg-hot-pink text-black px-2 py-1 rounded">HIGH PRIORITY</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <p className="text-sm text-blue-200">
          <strong>Tip for Treatment-Resistant Bipolar:</strong> Track these correlations consistently to identify your personal patterns. 
          Small changes in sleep, exercise, and blood sugar management can have significant impacts on mood stability and work performance.
        </p>
      </div>
    </Card>
  );
};

export default InsightsDisplay;
