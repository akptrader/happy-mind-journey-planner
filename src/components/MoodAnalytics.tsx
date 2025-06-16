
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Heart, TrendingUp, AlertTriangle } from 'lucide-react';

interface MoodAnalyticsProps {
  timeRange: string;
}

const MoodAnalytics = ({ timeRange }: MoodAnalyticsProps) => {
  const [moodTrend, setMoodTrend] = useState<any[]>([]);
  const [episodeData, setEpisodeData] = useState<any[]>([]);
  const [triggerAnalysis, setTriggerAnalysis] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      
      const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToCheck);

      const recentEntries = moodEntries.filter((entry: any) => 
        new Date(entry.timestamp) >= startDate
      );

      // Generate mood trend data
      const trendData = [];
      for (let i = daysToCheck - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const dayEntries = recentEntries.filter((entry: any) => 
          new Date(entry.timestamp).toDateString() === dateStr
        );
        
        const avgMood = dayEntries.length > 0 
          ? dayEntries.reduce((sum: number, entry: any) => sum + entry.level, 0) / dayEntries.length
          : null;
        
        trendData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
          entries: dayEntries.length
        });
      }
      setMoodTrend(trendData);

      // Analyze episodes
      const episodeTypes = ['rapid-cycling', 'panic-attack', 'anxiety', 'depression'];
      const episodeAnalysis = episodeTypes.map(type => {
        const count = recentEntries.filter((entry: any) => entry.episode === type).length;
        return {
          type: type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          count
        };
      });
      setEpisodeData(episodeAnalysis);

      // Analyze triggers
      const triggerCount: Record<string, number> = {};
      recentEntries.forEach((entry: any) => {
        if (entry.triggers && entry.triggers.length > 0) {
          entry.triggers.forEach((trigger: string) => {
            triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
          });
        }
      });

      const triggerData = Object.entries(triggerCount)
        .map(([trigger, count]) => ({ trigger, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setTriggerAnalysis(triggerData);
    };

    loadData();
  }, [timeRange]);

  const chartConfig = {
    mood: {
      label: "Mood Level",
      color: "#ec4899",
    },
    count: {
      label: "Count",
      color: "#ffd700",
    },
  };

  return (
    <div className="space-y-6">
      {/* Mood Trend */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Mood Trend Over Time</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <AreaChart data={moodTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis domain={[0, 10]} stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="mood" 
              stroke="#ec4899" 
              fill="#ec4899" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* Episode Analysis */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Episode Frequency</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <BarChart data={episodeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="type" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#ffd700" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Card>

      {/* Trigger Analysis */}
      {triggerAnalysis.length > 0 && (
        <Card className="medication-card bg-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-hot-pink" size={20} />
            <h3 className="text-lg font-semibold text-foreground">Most Common Triggers</h3>
          </div>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={triggerAnalysis} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="trigger" type="category" stroke="#9ca3af" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
      )}
    </div>
  );
};

export default MoodAnalytics;
