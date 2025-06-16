
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, Pill } from 'lucide-react';

interface MedicationAnalyticsProps {
  timeRange: string;
}

const MedicationAnalytics = ({ timeRange }: MedicationAnalyticsProps) => {
  const [adherenceData, setAdherenceData] = useState<any[]>([]);
  const [medicationBreakdown, setMedicationBreakdown] = useState<any[]>([]);
  const [timeDistribution, setTimeDistribution] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const medications = JSON.parse(localStorage.getItem('medications') || '[]');
      const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
      
      const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToCheck);

      // Generate adherence data by day
      const adherenceByDay = [];
      for (let i = daysToCheck - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const dayLogs = medicationLog.filter((log: any) => 
          new Date(log.timestamp).toDateString() === dateStr
        );
        
        const adherenceRate = medications.length > 0 
          ? Math.round((dayLogs.length / medications.length) * 100)
          : 0;
        
        adherenceByDay.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          adherence: adherenceRate,
          taken: dayLogs.length,
          total: medications.length
        });
      }
      setAdherenceData(adherenceByDay);

      // Calculate medication breakdown
      const medBreakdown = medications.map((med: any) => {
        const medLogs = medicationLog.filter((log: any) => 
          log.medicationId === med.id && new Date(log.timestamp) >= startDate
        );
        return {
          name: med.name,
          taken: medLogs.length,
          scheduled: daysToCheck * (med.frequency === 'Twice daily' ? 2 : 1),
          adherence: Math.round((medLogs.length / (daysToCheck * (med.frequency === 'Twice daily' ? 2 : 1))) * 100)
        };
      });
      setMedicationBreakdown(medBreakdown);

      // Calculate time distribution
      const timeSlots = {
        'Morning (6-12)': 0,
        'Afternoon (12-18)': 0,
        'Evening (18-24)': 0,
        'Night (0-6)': 0
      };

      medicationLog.forEach((log: any) => {
        if (new Date(log.timestamp) >= startDate) {
          const hour = new Date(log.timestamp).getHours();
          if (hour >= 6 && hour < 12) timeSlots['Morning (6-12)']++;
          else if (hour >= 12 && hour < 18) timeSlots['Afternoon (12-18)']++;
          else if (hour >= 18 && hour < 24) timeSlots['Evening (18-24)']++;
          else timeSlots['Night (0-6)']++;
        }
      });

      const timeData = Object.entries(timeSlots).map(([time, count]) => ({
        time,
        count
      }));
      setTimeDistribution(timeData);
    };

    loadData();
  }, [timeRange]);

  const COLORS = ['#ec4899', '#ffd700', '#10b981', '#3b82f6'];

  const chartConfig = {
    adherence: {
      label: "Adherence %",
      color: "#ec4899",
    },
    taken: {
      label: "Taken",
      color: "#ffd700",
    },
  };

  return (
    <div className="space-y-6">
      {/* Adherence Trend */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Daily Adherence Trend</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={adherenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="adherence" 
              stroke="#ec4899" 
              strokeWidth={3}
              dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </Card>

      {/* Medication Breakdown */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Medication Adherence by Type</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <BarChart data={medicationBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="adherence" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Card>

      {/* Time Distribution */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Medication Timing Distribution</h3>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <ChartContainer config={chartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={timeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="flex flex-col gap-2">
            {timeDistribution.map((entry, index) => (
              <div key={entry.time} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-foreground">{entry.time}</span>
                <span className="text-sm text-muted-foreground">({entry.count})</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MedicationAnalytics;
