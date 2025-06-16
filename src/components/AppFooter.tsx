
import React from 'react';
import { Card } from '@/components/ui/card';

const AppFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center">
      <Card className="medication-card calm-gradient">
        <p className="text-sm text-gray-300">
          🌟 Your health journey matters - track, analyze, and thrive with WellnessHub
        </p>
      </Card>
    </div>
  );
};

export default AppFooter;
