
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface MoodEntry {
  id: string;
  timestamp: string;
  moodLevel: number;
  type: 'normal' | 'rapid-cycling' | 'panic-attack' | 'mixed-episode';
  notes?: string;
  triggers?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
}

interface MoodHistoryProps {
  entries: MoodEntry[];
  onBack: () => void;
}

const MoodHistory = ({ entries, onBack }: MoodHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rapid-cycling':
        return <TrendingUp className="text-orange-500" size={16} />;
      case 'panic-attack':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'mixed-episode':
        return <Brain className="text-purple-500" size={16} />;
      default:
        return <Brain className="text-blue-500" size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  const dates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const filteredDates = selectedDate ? [selectedDate] : dates;

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
        <h2 className="text-2xl font-semibold text-foreground">Mood History</h2>
      </div>

      {dates.length > 1 && (
        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-hot-pink" />
            <span className="font-medium">Filter by date:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedDate('')}
              variant={selectedDate === '' ? 'default' : 'outline'}
              size="sm"
            >
              All dates
            </Button>
            {dates.slice(0, 7).map(date => (
              <Button
                key={date}
                onClick={() => setSelectedDate(date)}
                variant={selectedDate === date ? 'default' : 'outline'}
                size="sm"
              >
                {new Date(date).toLocaleDateString()}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {filteredDates.length === 0 ? (
        <Card className="medication-card bg-gray-800 p-6 text-center">
          <p className="text-muted-foreground">No mood entries found.</p>
        </Card>
      ) : (
        filteredDates.map(date => (
          <div key={date} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-hot-pink" />
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {groupedEntries[date]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(entry => (
                <Card key={entry.id} className={`medication-card border-l-4 ${getTypeColor(entry.type)} bg-gray-800`}>
                  <div className="flex items-start justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(entry.type)}
                        <span className="font-medium text-gold">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="font-semibold text-foreground capitalize">
                          {entry.type.replace('-', ' ')}
                        </span>
                        <span className={`font-bold text-lg ${getMoodColor(entry.moodLevel)}`}>
                          {entry.moodLevel}/10
                        </span>
                        {entry.severity && (
                          <span className="text-sm text-gold bg-gray-700 px-2 py-1 rounded">
                            {entry.severity}
                          </span>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-champagne ml-7 mb-2">{entry.notes}</p>
                      )}
                      {entry.triggers && entry.triggers.length > 0 && (
                        <div className="ml-7">
                          <span className="text-xs text-muted-foreground">Triggers: </span>
                          <span className="text-xs text-gold">{entry.triggers.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default MoodHistory;
