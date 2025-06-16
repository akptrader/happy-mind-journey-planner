
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart3, Activity, Heart, Pill, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import FlexibleAnalytics from './FlexibleAnalytics';
import MoodAnalytics from './MoodAnalytics';
import HealthMetricsAnalytics from './HealthMetricsAnalytics';
import MedicationAnalytics from './MedicationAnalytics';
import MedicalSummary from './MedicalSummary';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (value !== 'custom') {
      setShowCustomRange(false);
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    } else {
      setShowCustomRange(true);
    }
  };

  const getEffectiveTimeRange = () => {
    if (timeRange === 'custom' && customStartDate && customEndDate) {
      return `custom:${customStartDate.toISOString()}:${customEndDate.toISOString()}`;
    }
    return timeRange;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Analytics & Insights</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {showCustomRange && (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !customStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customStartDate ? format(customStartDate, "MMM dd, yyyy") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-40 justify-start text-left font-normal",
                      !customEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customEndDate ? format(customEndDate, "MMM dd, yyyy") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
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
          <MedicalSummary timeRange={getEffectiveTimeRange()} />
        </TabsContent>

        <TabsContent value="flexible" className="animate-fade-in">
          <FlexibleAnalytics timeRange={getEffectiveTimeRange()} />
        </TabsContent>

        <TabsContent value="mood" className="animate-fade-in">
          <MoodAnalytics timeRange={getEffectiveTimeRange()} />
        </TabsContent>

        <TabsContent value="health" className="animate-fade-in">
          <HealthMetricsAnalytics timeRange={getEffectiveTimeRange()} />
        </TabsContent>

        <TabsContent value="dosage" className="animate-fade-in">
          <MedicationAnalytics timeRange={getEffectiveTimeRange()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
