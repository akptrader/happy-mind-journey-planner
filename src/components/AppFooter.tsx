
import React from 'react';
import { Card } from '@/components/ui/card';

const AppFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center">
      <Card className="medication-card calm-gradient">
        <p className="text-sm text-gray-300">
          💊 Stay consistent with your medication routine - your health matters!
        </p>
      </Card>
    </div>
  );
};

export default AppFooter;
