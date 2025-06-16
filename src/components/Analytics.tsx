
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Activity, Heart, Pill } from 'lucide-react';
import FlexibleAnalytics from './FlexibleAnalytics';
import MoodAnalytics from './MoodAnalytics';
import HealthMetricsAnalytics from './HealthMetricsAnalytics';
import MedicationAnalytics from './MedicationAnalytics';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Analytics & Insights</h2>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="flexible" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="flexible" className="flex items-center gap-2">
            <BarChart3 size={18} />
            Custom
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Heart size={18} />
            Mood
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity size={18} />
            Health
          </TabsTrigger>
          <TabsTrigger value="medication" className="flex items-center gap-2">
            <Pill size={18} />
            Medication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flexible" className="animate-fade-in">
          <FlexibleAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="mood" className="animate-fade-in">
          <MoodAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="health" className="animate-fade-in">
          <HealthMetricsAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="medication" className="animate-fade-in">
          <MedicationAnalytics timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
