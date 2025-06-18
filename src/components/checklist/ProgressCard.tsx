
import React from 'react';
import { Card } from '@/components/ui/card';

interface ProgressCardProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

const ProgressCard = ({ completedCount, totalCount, progressPercentage }: ProgressCardProps) => {
  return (
    <Card className="medication-card wellness-gradient text-white">
      <div className="text-center p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Today's Progress</h3>
        <div className="text-2xl sm:text-3xl font-bold mb-2">{progressPercentage}%</div>
        <p className="text-sm opacity-90">{completedCount} of {totalCount} tasks completed</p>
        <div className="w-full bg-white/30 rounded-full h-3 mt-4">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;
