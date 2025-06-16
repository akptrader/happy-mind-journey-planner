
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  time: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'seroquel' | 'caplyta' | 'lantus' | 'custom';
  dosage: string;
  frequency: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  taken: boolean;
  notes?: string;
}

interface MedicationSummaryProps {
  medications: Medication[];
  medicationLog: MedicationLog[];
}

const MedicationSummary = ({ medications, medicationLog }: MedicationSummaryProps) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    generateSummary();
  }, [timeRange, medications, medicationLog]);

  const generateSummary = () => {
    const now = new Date();
    let startDate = new Date();
    let periodLabel = '';

    switch (timeRange) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        periodLabel = 'Today';
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        periodLabel = 'Last 7 Days';
        break;
      case 'monthly':
        startDate.setDate(now.getDate() - 30);
        periodLabel = 'Last 30 Days';
        break;
    }

    const periodLogs = medicationLog.filter(log => 
      new Date(log.timestamp) >= startDate
    );

    const summary = {
      period: periodLabel,
      totalMedications: medications.length,
      totalLogs: periodLogs.length,
      takenCount: periodLogs.filter(log => log.taken).length,
      missedCount: periodLogs.filter(log => !log.taken).length,
      adherenceRate: periodLogs.length > 0 ? 
        Math.round((periodLogs.filter(log => log.taken).length / periodLogs.length) * 100) : 0,
      medicationBreakdown: medications.map(med => {
        const medLogs = periodLogs.filter(log => log.medicationId === med.id);
        const taken = medLogs.filter(log => log.taken).length;
        const missed = medLogs.filter(log => !log.taken).length;
        const total = medLogs.length;
        
        return {
          name: med.name,
          dosage: med.dosage,
          taken,
          missed,
          total,
          adherenceRate: total > 0 ? Math.round((taken / total) * 100) : 0
        };
      }),
      insights: generateInsights(periodLogs, medications, timeRange)
    };

    setSummaryData(summary);
  };

  const generateInsights = (logs: MedicationLog[], meds: Medication[], range: string) => {
    const insights = [];
    
    if (logs.length === 0) {
      insights.push("No medication logs recorded for this period.");
      return insights;
    }

    const adherenceRate = Math.round((logs.filter(log => log.taken).length / logs.length) * 100);
    
    if (adherenceRate >= 90) {
      insights.push("🎉 Excellent adherence! You're doing great with your medication routine.");
    } else if (adherenceRate >= 70) {
      insights.push("👍 Good adherence, but there's room for improvement.");
    } else {
      insights.push("⚠️ Consider setting up reminders to improve medication adherence.");
    }

    // Find most missed medication
    const medicationMissed = meds.map(med => ({
      name: med.name,
      missed: logs.filter(log => log.medicationId === med.id && !log.taken).length
    })).sort((a, b) => b.missed - a.missed);

    if (medicationMissed[0]?.missed > 0) {
      insights.push(`Most missed: ${medicationMissed[0].name} (${medicationMissed[0].missed} times)`);
    }

    return insights;
  };

  const exportSummary = () => {
    if (!summaryData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medication Summary - ${summaryData.period}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            .summary-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            .insights { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Medication Summary - ${summaryData.period}</h1>
          <p>Generated on ${currentDate}</p>
          
          <div class="summary-card">
            <h2>Overview</h2>
            <div class="metric">
              <strong>Total Medications:</strong> ${summaryData.totalMedications}
            </div>
            <div class="metric">
              <strong>Adherence Rate:</strong> ${summaryData.adherenceRate}%
            </div>
            <div class="metric">
              <strong>Doses Taken:</strong> ${summaryData.takenCount}
            </div>
            <div class="metric">
              <strong>Doses Missed:</strong> ${summaryData.missedCount}
            </div>
          </div>

          <div class="insights">
            <h3>Insights</h3>
            ${summaryData.insights.map((insight: string) => `<p>• ${insight}</p>`).join('')}
          </div>

          <h2>Medication Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Taken</th>
                <th>Missed</th>
                <th>Adherence Rate</th>
              </tr>
            </thead>
            <tbody>
              ${summaryData.medicationBreakdown.map((med: any) => `
                <tr>
                  <td>${med.name}</td>
                  <td>${med.dosage}</td>
                  <td>${med.taken}</td>
                  <td>${med.missed}</td>
                  <td>${med.adherenceRate}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  if (!summaryData) {
    return <div className="text-center p-4">Loading summary...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Medication Summary</h2>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={exportSummary}
            className="bg-hot-pink text-black hover:bg-hot-pink/90 flex items-center gap-2"
          >
            <Download size={18} />
            Export Summary
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-400" size={20} />
            <span className="text-sm text-muted-foreground">Period</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{summaryData.period}</div>
        </Card>
        
        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-400" size={20} />
            <span className="text-sm text-muted-foreground">Adherence</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.adherenceRate}%</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-blue-400" size={20} />
            <span className="text-sm text-muted-foreground">Taken</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{summaryData.takenCount}</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-red-400" size={20} />
            <span className="text-sm text-muted-foreground">Missed</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{summaryData.missedCount}</div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Insights</h3>
        <div className="space-y-2">
          {summaryData.insights.map((insight: string, index: number) => (
            <p key={index} className="text-muted-foreground">{insight}</p>
          ))}
        </div>
      </Card>

      {/* Medication Breakdown */}
      <Card className="bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Medication Breakdown</h3>
        <div className="space-y-3">
          {summaryData.medicationBreakdown.map((med: any, index: number) => (
            <Card key={index} className="bg-gray-700 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-foreground">{med.name}</h4>
                  <p className="text-sm text-muted-foreground">{med.dosage}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gold">{med.adherenceRate}%</div>
                  <div className="text-sm text-muted-foreground">
                    {med.taken} taken, {med.missed} missed
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MedicationSummary;
