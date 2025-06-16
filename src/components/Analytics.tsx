
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Activity, Heart, Pill, FileText } from 'lucide-react';
import FlexibleAnalytics from './FlexibleAnalytics';
import MoodAnalytics from './MoodAnalytics';
import HealthMetricsAnalytics from './HealthMetricsAnalytics';
import MedicationAnalytics from './MedicationAnalytics';
import MedicalSummary from './MedicalSummary';

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

      <Tabs defaultValue="medical-summary" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="medical-summary" className="flex items-center gap-2">
            <FileText size={18} />
            Medical Summary
          </TabsTrigger>
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
          <TabsTrigger value="dosage" className="flex items-center gap-2">
            <Pill size={18} />
            Dosage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medical-summary" className="animate-fade-in">
          <MedicalSummary timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="flexible" className="animate-fade-in">
          <FlexibleAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="mood" className="animate-fade-in">
          <MoodAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="health" className="animate-fade-in">
          <HealthMetricsAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="dosage" className="animate-fade-in">
          <MedicationAnalytics timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
