
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, StickyNote } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  timestamp: string;
}

interface MedicationHistoryProps {
  medications: Medication[];
  medicationLog: MedicationLog[];
  onBack: () => void;
}

const MedicationHistory = ({ medications, medicationLog, onBack }: MedicationHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getTypeColor = (medicationId: string) => {
    const medication = medications.find(med => med.id === medicationId);
    if (!medication) return 'border-l-gray-300 bg-gray-800';
    
    // Simple color assignment based on medication name
    const name = medication.name.toLowerCase();
    if (name.includes('cobenfy')) return 'border-l-hot-pink bg-gray-800';
    if (name.includes('latuda')) return 'border-l-gold bg-gray-800';
    if (name.includes('seroquel')) return 'border-l-purple-500 bg-gray-800';
    if (name.includes('caplyta')) return 'border-l-blue-500 bg-gray-800';
    if (name.includes('lantus')) return 'border-l-green-500 bg-gray-800';
    return 'border-l-champagne-dark bg-gray-800';
  };

  // Create enriched records by joining medications and logs
  const enrichedHistory = medicationLog.map(log => {
    const medication = medications.find(med => med.id === log.medicationId);
    return {
      id: log.id,
      medicationId: log.medicationId,
      name: medication?.name || 'Unknown Medication',
      takenAt: log.timestamp,
      dosage: medication?.dosage,
      type: 'custom' as const
    };
  });

  // Group history by date
  const groupedHistory = enrichedHistory.reduce((acc, record) => {
    const date = new Date(record.takenAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof enrichedHistory>);

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
                <Card key={record.id} className={`medication-card border-l-4 ${getTypeColor(record.medicationId)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="font-medium text-gold">
                          {new Date(record.takenAt).toLocaleTimeString()}
                        </span>
                        <span className="font-semibold text-foreground">{record.name}</span>
                        {record.dosage && (
                          <span className="text-sm text-gold bg-gray-700 px-2 py-1 rounded">
                            {record.dosage}
                          </span>
                        )}
                      </div>
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
