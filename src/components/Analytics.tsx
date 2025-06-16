
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Calendar, Activity, Heart, Zap } from 'lucide-react';
import MedicationAnalytics from './MedicationAnalytics';
import MoodAnalytics from './MoodAnalytics';
import HealthMetricsAnalytics from './HealthMetricsAnalytics';
import CorrelationAnalytics from './CorrelationAnalytics';
import InsightsPanel from './InsightsPanel';

interface AnalyticsProps {
  onBack: () => void;
}

const Analytics = ({ onBack }: AnalyticsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-2">
          <TrendingUp className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Analytics & Insights</h2>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? 'bg-hot-pink text-black hover:bg-hot-pink/90' : ''}
          >
            7 days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? 'bg-hot-pink text-black hover:bg-hot-pink/90' : ''}
          >
            30 days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
            className={timeRange === '90d' ? 'bg-hot-pink text-black hover:bg-hot-pink/90' : ''}
          >
            90 days
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Calendar size={18} />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="correlations" className="flex items-center gap-2">
            <Zap size={18} />
            <span className="hidden sm:inline">Correlations</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Activity size={18} />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Heart size={18} />
            <span className="hidden sm:inline">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <TrendingUp size={18} />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-fade-in">
          <InsightsPanel timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="correlations" className="animate-fade-in">
          <CorrelationAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="medications" className="animate-fade-in">
          <MedicationAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="mood" className="animate-fade-in">
          <MoodAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="health" className="animate-fade-in">
          <HealthMetricsAnalytics timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
