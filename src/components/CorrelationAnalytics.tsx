
import React, { useState, useEffect } from 'react';
import CorrelationChart from './CorrelationChart';
import InsightsDisplay from './InsightsDisplay';
import { loadDailyCorrelationData } from '@/utils/correlationData';
import { generateInsights } from '@/utils/insightsGenerator';
import { DailyCorrelationData, AnalyticsInsight } from '@/types/analytics';

interface CorrelationAnalyticsProps {
  timeRange: string;
}

const CorrelationAnalytics = ({ timeRange }: CorrelationAnalyticsProps) => {
  const [correlationData, setCorrelationData] = useState<DailyCorrelationData[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);

  useEffect(() => {
    const loadData = () => {
      const dailyData = loadDailyCorrelationData(timeRange);
      const generatedInsights = generateInsights(dailyData);
      
      setCorrelationData(dailyData);
      setInsights(generatedInsights);
    };

    loadData();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <CorrelationChart data={correlationData} />
      <InsightsDisplay insights={insights} />
    </div>
  );
};

export default CorrelationAnalytics;
