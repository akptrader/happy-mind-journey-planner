
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface MedicalSummaryProps {
  timeRange: string;
}

const MedicalSummary = ({ timeRange }: MedicalSummaryProps) => {
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    generateMedicalSummary();
  }, [timeRange]);

  const generateMedicalSummary = () => {
    // Load data from localStorage
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
    const sideEffects = JSON.parse(localStorage.getItem('sideEffects') || '[]');

    const now = new Date();
    let startDate = new Date();
    let periodLabel = '';

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        periodLabel = '7-Day';
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        periodLabel = '30-Day';
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        periodLabel = '90-Day';
        break;
    }

    const periodLogs = medicationLog.filter((log: any) => 
      new Date(log.timestamp) >= startDate
    );

    const periodMoods = moodEntries.filter((entry: any) => 
      new Date(entry.timestamp) >= startDate
    );

    const periodMetrics = healthMetrics.filter((metric: any) => 
      new Date(metric.timestamp) >= startDate
    );

    const periodSideEffects = sideEffects.filter((effect: any) => 
      new Date(effect.timestamp) >= startDate
    );

    // Calculate medication adherence
    const adherenceRate = periodLogs.length > 0 ? 
      Math.round((periodLogs.filter((log: any) => log.taken).length / periodLogs.length) * 100) : 0;

    // Calculate mood stability
    const moodValues = periodMoods.map((entry: any) => entry.level);
    const avgMood = moodValues.length > 0 ? 
      moodValues.reduce((sum: number, val: number) => sum + val, 0) / moodValues.length : 0;
    const moodVariability = moodValues.length > 1 ? 
      Math.sqrt(moodValues.reduce((sum: number, val: number) => sum + Math.pow(val - avgMood, 2), 0) / moodValues.length) : 0;

    // Side effects severity
    const avgSideEffectsSeverity = periodSideEffects.length > 0 ?
      periodSideEffects.reduce((sum: number, effect: any) => sum + effect.severity, 0) / periodSideEffects.length : 0;

    const summary = {
      period: periodLabel,
      patientCompliance: {
        adherenceRate,
        totalPrescribedDoses: periodLogs.length,
        missedDoses: periodLogs.filter((log: any) => !log.taken).length,
        assessment: adherenceRate >= 80 ? 'Good' : adherenceRate >= 60 ? 'Fair' : 'Poor'
      },
      symptomStability: {
        averageMoodScore: Math.round(avgMood * 10) / 10,
        moodVariability: Math.round(moodVariability * 10) / 10,
        stabilityAssessment: moodVariability < 1.5 ? 'Stable' : moodVariability < 2.5 ? 'Moderate' : 'Variable'
      },
      adverseEvents: {
        reportedSideEffects: periodSideEffects.length,
        averageSeverity: Math.round(avgSideEffectsSeverity * 10) / 10,
        severityCategory: avgSideEffectsSeverity < 3 ? 'Mild' : avgSideEffectsSeverity < 6 ? 'Moderate' : 'Severe'
      },
      currentRegimen: medications.map((med: any) => ({
        medication: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        indication: med.type === 'lantus' ? 'Diabetes Management' : 
                   med.type === 'seroquel' || med.type === 'cobenfy' || med.type === 'latuda' || med.type === 'caplyta' ? 
                   'Psychiatric Management' : 'As Prescribed'
      })),
      clinicalRecommendations: generateRecommendations(adherenceRate, moodVariability, avgSideEffectsSeverity, medications)
    };

    setSummaryData(summary);
  };

  const generateRecommendations = (adherence: number, moodVar: number, sideEffects: number, medications: any[]) => {
    const recommendations = [];

    if (adherence < 80) {
      recommendations.push("Consider medication adherence counseling and/or adherence aids");
    }

    if (moodVar > 2.5) {
      recommendations.push("Mood instability noted - consider dosage adjustment or additional mood stabilization");
    }

    if (sideEffects > 5) {
      recommendations.push("Significant adverse effects reported - risk-benefit assessment recommended");
    }

    if (medications.length > 3) {
      recommendations.push("Polypharmacy present - consider medication reconciliation");
    }

    if (recommendations.length === 0) {
      recommendations.push("Current regimen appears well-tolerated with good adherence");
    }

    return recommendations;
  };

  const exportMedicalReport = () => {
    if (!summaryData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Clinical Summary Report - ${summaryData.period}</title>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin: 25px 0; }
            .section h2 { color: #333; border-bottom: 1px solid #666; padding-bottom: 5px; }
            .medication-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .medication-table th, .medication-table td { border: 1px solid #666; padding: 8px; text-align: left; }
            .medication-table th { background-color: #f5f5f5; font-weight: bold; }
            .metric { margin: 10px 0; padding: 8px; background: #f9f9f9; border-left: 4px solid #007acc; }
            .recommendation { margin: 8px 0; padding: 8px; background: #fff3cd; border-left: 4px solid #ffc107; }
            .assessment { font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CLINICAL SUMMARY REPORT</h1>
            <p><strong>${summaryData.period} Assessment Period</strong></p>
            <p>Generated: ${currentDate}</p>
          </div>

          <div class="section">
            <h2>CURRENT MEDICATION REGIMEN</h2>
            <table class="medication-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Indication</th>
                </tr>
              </thead>
              <tbody>
                ${summaryData.currentRegimen.map((med: any) => `
                  <tr>
                    <td>${med.medication}</td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                    <td>${med.indication}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>MEDICATION ADHERENCE ASSESSMENT</h2>
            <div class="metric">
              <strong>Adherence Rate:</strong> ${summaryData.patientCompliance.adherenceRate}% 
              <span class="assessment">(${summaryData.patientCompliance.assessment})</span>
            </div>
            <div class="metric">
              <strong>Total Prescribed Doses:</strong> ${summaryData.patientCompliance.totalPrescribedDoses}
            </div>
            <div class="metric">
              <strong>Missed Doses:</strong> ${summaryData.patientCompliance.missedDoses}
            </div>
          </div>

          <div class="section">
            <h2>SYMPTOM STABILITY ASSESSMENT</h2>
            <div class="metric">
              <strong>Average Mood Score:</strong> ${summaryData.symptomStability.averageMoodScore}/10
            </div>
            <div class="metric">
              <strong>Mood Variability:</strong> ${summaryData.symptomStability.moodVariability} 
              <span class="assessment">(${summaryData.symptomStability.stabilityAssessment})</span>
            </div>
          </div>

          <div class="section">
            <h2>ADVERSE EVENTS</h2>
            <div class="metric">
              <strong>Reported Side Effects:</strong> ${summaryData.adverseEvents.reportedSideEffects}
            </div>
            <div class="metric">
              <strong>Average Severity:</strong> ${summaryData.adverseEvents.averageSeverity}/10 
              <span class="assessment">(${summaryData.adverseEvents.severityCategory})</span>
            </div>
          </div>

          <div class="section">
            <h2>CLINICAL RECOMMENDATIONS</h2>
            ${summaryData.clinicalRecommendations.map((rec: string) => `
              <div class="recommendation">• ${rec}</div>
            `).join('')}
          </div>

          <div class="footer">
            <p>This report is generated from patient self-reported data and should be reviewed in conjunction with clinical assessment.</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  if (!summaryData) {
    return <div className="text-center p-4">Generating medical summary...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Medical Summary</h2>
        </div>
        <Button
          onClick={exportMedicalReport}
          className="bg-hot-pink text-black hover:bg-hot-pink/90 flex items-center gap-2"
        >
          <Download size={18} />
          Export Medical Report
        </Button>
      </div>

      {/* Current Regimen */}
      <Card className="bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Medication Regimen</h3>
        <div className="space-y-2">
          {summaryData.currentRegimen.map((med: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div>
                <span className="font-medium text-foreground">{med.medication}</span>
                <span className="text-muted-foreground ml-2">({med.dosage}, {med.frequency})</span>
              </div>
              <span className="text-sm text-champagne">{med.indication}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-400" size={20} />
            <span className="text-sm text-muted-foreground">Medication Adherence</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.patientCompliance.adherenceRate}%</div>
          <div className="text-sm text-muted-foreground">{summaryData.patientCompliance.assessment}</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-400" size={20} />
            <span className="text-sm text-muted-foreground">Mood Stability</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.symptomStability.averageMoodScore}/10</div>
          <div className="text-sm text-muted-foreground">{summaryData.symptomStability.stabilityAssessment}</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <span className="text-sm text-muted-foreground">Side Effects</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.adverseEvents.averageSeverity}/10</div>
          <div className="text-sm text-muted-foreground">{summaryData.adverseEvents.severityCategory}</div>
        </Card>
      </div>

      {/* Clinical Recommendations */}
      <Card className="bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Clinical Recommendations</h3>
        <div className="space-y-2">
          {summaryData.clinicalRecommendations.map((recommendation: string, index: number) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-yellow-100/10 border-l-4 border-yellow-400 rounded">
              <span className="text-yellow-400 mt-1">•</span>
              <span className="text-foreground">{recommendation}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MedicalSummary;
