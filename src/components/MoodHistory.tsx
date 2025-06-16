
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, TrendingDown, Zap } from 'lucide-react';

interface MoodEntry {
  id: string;
  timestamp: string;
  moodLevel: number;
  type: 'normal' | 'rapid-cycling' | 'panic-attack' | 'mixed-episode' | 'depression' | 'hypomania' | 'mania';
  notes?: string;
  triggers?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
}

interface MoodHistoryProps {
  entries: MoodEntry[];
  onBack: () => void;
}

const MoodHistory = ({ entries, onBack }: MoodHistoryProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'depression':
        return <TrendingDown className="text-blue-600" size={18} />;
      case 'hypomania':
        return <TrendingUp className="text-yellow-500" size={18} />;
      case 'mania':
        return <Zap className="text-red-500" size={18} />;
      case 'rapid-cycling':
        return <TrendingUp className="text-orange-500" size={18} />;
      case 'panic-attack':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'mixed-episode':
        return <Brain className="text-purple-500" size={18} />;
      default:
        return <Brain className="text-blue-500" size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'depression':
        return 'border-l-blue-600';
      case 'hypomania':
        return 'border-l-yellow-500';
      case 'mania':
        return 'border-l-red-500';
      case 'rapid-cycling':
        return 'border-l-orange-500';
      case 'panic-attack':
        return 'border-l-red-500';
      case 'mixed-episode':
        return 'border-l-purple-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getMoodColor = (level: number) => {
    if (level <= 3) return 'text-red-400';
    if (level <= 5) return 'text-yellow-400';
    if (level <= 7) return 'text-blue-400';
    return 'text-green-400';
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  return (
    <div className="space-y-4">
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
          <Brain className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Mood History</h2>
        </div>
      </div>

      {Object.keys(groupedEntries).length === 0 ? (
        <Card className="medication-card bg-gray-800 p-6 text-center">
          <p className="text-muted-foreground">No mood entries found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedEntries)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, dayEntries]) => (
              <Card key={date} className="medication-card bg-gray-800 p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <div className="space-y-3">
                  {dayEntries
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((entry) => (
                      <Card key={entry.id} className={`border-l-4 ${getTypeColor(entry.type)} bg-gray-700`}>
                        <div className="flex items-start justify-between p-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getTypeIcon(entry.type)}
                              <span className="font-medium text-foreground capitalize">
                                {entry.type.replace('-', ' ')}
                              </span>
                              <span className={`font-bold text-lg ${getMoodColor(entry.moodLevel)}`}>
                                {entry.moodLevel}/10
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(entry.timestamp).toLocaleTimeString()}
                              </span>
                              {entry.severity && (
                                <span className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded">
                                  {entry.severity}
                                </span>
                              )}
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-champagne ml-6">{entry.notes}</p>
                            )}
                            {entry.triggers && entry.triggers.length > 0 && (
                              <div className="ml-6 mt-1">
                                <span className="text-xs text-muted-foreground">Triggers: </span>
                                <span className="text-xs text-gold">{entry.triggers.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
