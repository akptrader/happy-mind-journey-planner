
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, StickyNote } from 'lucide-react';

interface MedicationRecord {
  id: string;
  medicationId: string;
  name: string;
  takenAt: string;
  note?: string;
  type: 'cobenfy' | 'latuda' | 'anti-nausea';
}

interface MedicationHistoryProps {
  history: MedicationRecord[];
  onBack: () => void;
}

const MedicationHistory = ({ history, onBack }: MedicationHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cobenfy':
        return 'border-l-hot-pink bg-gray-800';
      case 'latuda':
        return 'border-l-gold bg-gray-800';
      case 'anti-nausea':
        return 'border-l-champagne-dark bg-gray-800';
      default:
        return 'border-l-gray-300 bg-gray-800';
    }
  };

  // Group history by date
  const groupedHistory = history.reduce((acc, record) => {
    const date = new Date(record.takenAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, MedicationRecord[]>);

  const dates = Object.keys(groupedHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
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
        <h2 className="text-2xl font-semibold text-foreground">Medication History</h2>
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
          <p className="text-muted-foreground">No medication history found.</p>
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
            
            {groupedHistory[date]
              .sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())
              .map(record => (
                <Card key={record.id} className={`medication-card border-l-4 ${getTypeColor(record.type)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="font-medium text-gold">
                          {new Date(record.takenAt).toLocaleTimeString()}
                        </span>
                        <span className="font-semibold text-foreground">{record.name}</span>
                      </div>
                      {record.note && (
                        <div className="flex items-start gap-2 ml-7">
                          <StickyNote size={14} className="text-champagne mt-0.5" />
                          <p className="text-sm text-champagne">{record.note}</p>
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

export default MedicationHistory;
