
import React from 'react';
import { Card } from '@/components/ui/card';

const AppFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center">
      <Card className="medication-card calm-gradient">
        <p className="text-sm text-gray-300">
          💙 Remember: You're doing great by taking care of your health. Every step forward matters.
        </p>
      </Card>
    </div>
  );
};

export default AppFooter;
