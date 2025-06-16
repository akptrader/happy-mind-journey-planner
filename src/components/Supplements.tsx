
import React from 'react';
import SupplementTracker from './SupplementTracker';

interface SupplementsProps {
  onBack: () => void;
}

const Supplements = ({ onBack }: SupplementsProps) => {
  return <SupplementTracker onBack={onBack} />;
};

export default Supplements;
