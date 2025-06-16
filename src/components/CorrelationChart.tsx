
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DailyCorrelationData } from '@/types/analytics';

interface CorrelationChartProps {
  data: DailyCorrelationData[];
}

const CorrelationChart = ({ data }: CorrelationChartProps) => {
  const chartConfig = {
    mood: {
      label: "Mood Level",
      color: "#ec4899",
    },
    bloodSugar: {
      label: "Blood Sugar",
      color: "#ef4444",
    },
    sleep: {
      label: "Sleep Hours",
      color: "#3b82f6",
    },
    exercise: {
      label: "Exercise Minutes",
      color: "#10b981",
    },
    productivity: {
      label: "Productivity",
      color: "#ffd700",
    },
    focus: {
      label: "Focus",
      color: "#f5deb3",
    },
  };

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-hot-pink" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Complete Health & Work Correlation</h3>
      </div>
      <ChartContainer config={chartConfig} className="h-80">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#ec4899" 
            strokeWidth={2}
            connectNulls={false}
            name="Mood (0-10)"
          />
          <Line 
            type="monotone" 
            dataKey="productivity" 
            stroke="#ffd700" 
            strokeWidth={2}
            connectNulls={false}
            name="Productivity (0-10)"
          />
          <Line 
            type="monotone" 
            dataKey="focus" 
            stroke="#f5deb3" 
            strokeWidth={2}
            connectNulls={false}
            name="Focus (0-10)"
            strokeDasharray="2 2"
          />
          <Line 
            type="monotone" 
            dataKey="sleep" 
            stroke="#3b82f6" 
            strokeWidth={2}
            connectNulls={false}
            name="Sleep (hours)"
          />
          <Line 
            type="monotone" 
            dataKey="exercise" 
            stroke="#10b981" 
            strokeWidth={2}
            connectNulls={false}
            name="Exercise (min ÷ 10)"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ChartContainer>
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Note: Exercise minutes are divided by 10 for better visualization. Days with Seroquel are marked with higher medication adherence.</p>
      </div>
    </Card>
  );
};

export default CorrelationChart;
