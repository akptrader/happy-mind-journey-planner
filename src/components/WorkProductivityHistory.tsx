
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

interface WorkEntry {
  id: string;
  timestamp: string;
  productivityLevel: number;
  focusLevel: number;
  energyLevel: number;
  tasksCompleted: number;
  hoursWorked: number;
  workType: 'creative' | 'analytical' | 'administrative' | 'meetings' | 'mixed';
  distractions: string[];
  notes?: string;
}

interface WorkProductivityHistoryProps {
  workEntries: WorkEntry[];
  onBack: () => void;
}

const WorkProductivityHistory = ({ workEntries, onBack }: WorkProductivityHistoryProps) => {
  const [timeRange, setTimeRange] = useState('7d');

  const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToCheck);

  const recentEntries = workEntries.filter(entry => 
    new Date(entry.timestamp) >= startDate
  );

  // Generate daily averages
  const dailyData = [];
  for (let i = daysToCheck - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    
    const dayEntries = recentEntries.filter(entry => 
      new Date(entry.timestamp).toDateString() === dateStr
    );
    
    if (dayEntries.length > 0) {
      dailyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        productivity: Math.round((dayEntries.reduce((sum, entry) => sum + entry.productivityLevel, 0) / dayEntries.length) * 10) / 10,
        focus: Math.round((dayEntries.reduce((sum, entry) => sum + entry.focusLevel, 0) / dayEntries.length) * 10) / 10,
        energy: Math.round((dayEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / dayEntries.length) * 10) / 10,
        tasks: dayEntries.reduce((sum, entry) => sum + entry.tasksCompleted, 0),
        hours: Math.round(dayEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0) * 10) / 10
      });
    }
  }

  const chartConfig = {
    productivity: {
      label: "Productivity",
      color: "#ffd700",
    },
    focus: {
      label: "Focus",
      color: "#f5deb3",
    },
    energy: {
      label: "Energy",
      color: "#ec4899",
    },
  };

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
          <Briefcase className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Work Productivity History</h2>
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
        </div>
      </div>

      {/* Productivity Trend */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Productivity Levels Over Time</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis domain={[0, 10]} stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              stroke="#ffd700" 
              strokeWidth={2}
              name="Productivity"
            />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#f5deb3" 
              strokeWidth={2}
              name="Focus"
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#ec4899" 
              strokeWidth={2}
              name="Energy"
            />
          </LineChart>
        </ChartContainer>
      </Card>

      {/* Tasks and Hours */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Daily Output</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="tasks" fill="#10b981" name="Tasks Completed" />
            <Bar dataKey="hours" fill="#3b82f6" name="Hours Worked" />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
};

export default WorkProductivityHistory;
