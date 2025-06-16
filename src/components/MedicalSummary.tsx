
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
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');

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

    const periodMoods = moodEntries.filter((entry: any) => 
      new Date(entry.timestamp) >= startDate
    );

    const periodMetrics = healthMetrics.filter((metric: any) => 
      new Date(metric.timestamp) >= startDate
    );

    const periodSideEffects = sideEffects.filter((effect: any) => 
      new Date(effect.timestamp) >= startDate
    );

    const periodExercises = exercises.filter((exercise: any) => 
      new Date(exercise.timestamp) >= startDate
    );

    const periodWork = workEntries.filter((work: any) => 
      new Date(work.timestamp) >= startDate
    );

    // Calculate mood stability
    const moodValues = periodMoods.map((entry: any) => entry.level);
    const avgMood = moodValues.length > 0 ? 
      moodValues.reduce((sum: number, val: number) => sum + val, 0) / moodValues.length : 0;
    const moodVariability = moodValues.length > 1 ? 
      Math.sqrt(moodValues.reduce((sum: number, val: number) => sum + Math.pow(val - avgMood, 2), 0) / moodValues.length) : 0;

    // Side effects severity
    const avgSideEffectsSeverity = periodSideEffects.length > 0 ?
      periodSideEffects.reduce((sum: number, effect: any) => sum + effect.severity, 0) / periodSideEffects.length : 0;

    // Sleep patterns
    const sleepMetrics = periodMetrics.filter((m: any) => m.type === 'sleep');
    const avgSleep = sleepMetrics.length > 0 ?
      sleepMetrics.reduce((sum: number, m: any) => sum + m.value, 0) / sleepMetrics.length : 0;

    // Blood sugar patterns  
    const bloodSugarMetrics = periodMetrics.filter((m: any) => m.type === 'blood-sugar');
    const avgBloodSugar = bloodSugarMetrics.length > 0 ?
      bloodSugarMetrics.reduce((sum: number, m: any) => sum + m.value, 0) / bloodSugarMetrics.length : 0;

    // Exercise patterns
    const totalExerciseMinutes = periodExercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
    const avgExercisePerDay = periodExercises.length > 0 ? totalExerciseMinutes / 7 : 0;

    // Work productivity patterns
    const avgProductivity = periodWork.length > 0 ? 
      periodWork.reduce((sum: number, work: any) => sum + work.productivityLevel, 0) / periodWork.length : 0;
    const avgFocus = periodWork.length > 0 ? 
      periodWork.reduce((sum: number, work: any) => sum + work.focusLevel, 0) / periodWork.length : 0;
    const avgEnergy = periodWork.length > 0 ? 
      periodWork.reduce((sum: number, work: any) => sum + work.energyLevel, 0) / periodWork.length : 0;

    const summary = {
      period: periodLabel,
      symptomStability: {
        averageMoodScore: Math.round(avgMood * 10) / 10,
        moodVariability: Math.round(moodVariability * 10) / 10,
        stabilityAssessment: moodVariability < 1.5 ? 'Stable' : moodVariability < 2.5 ? 'Moderate' : 'Variable',
        moodEntryCount: periodMoods.length
      },
      adverseEvents: {
        reportedSideEffects: periodSideEffects.length,
        averageSeverity: Math.round(avgSideEffectsSeverity * 10) / 10,
        severityCategory: avgSideEffectsSeverity < 3 ? 'Mild' : avgSideEffectsSeverity < 6 ? 'Moderate' : 'Severe'
      },
      sleepPatterns: {
        averageHours: Math.round(avgSleep * 10) / 10,
        entriesRecorded: sleepMetrics.length,
        assessment: avgSleep >= 7 ? 'Adequate' : avgSleep >= 6 ? 'Borderline' : 'Insufficient'
      },
      metabolicHealth: {
        averageBloodSugar: Math.round(avgBloodSugar),
        entriesRecorded: bloodSugarMetrics.length,
        assessment: avgBloodSugar <= 100 ? 'Normal' : avgBloodSugar <= 125 ? 'Prediabetic Range' : 'Diabetic Range'
      },
      activityLevel: {
        totalExerciseMinutes,
        averagePerDay: Math.round(avgExercisePerDay),
        sessionsRecorded: periodExercises.length
      },
      cognitiveFunction: {
        averageProductivity: Math.round(avgProductivity * 10) / 10,
        averageFocus: Math.round(avgFocus * 10) / 10,
        averageEnergy: Math.round(avgEnergy * 10) / 10,
        entriesRecorded: periodWork.length
      },
      currentRegimen: medications.map((med: any) => ({
        medication: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        indication: med.type === 'lantus' ? 'Diabetes Management' : 
                   med.type === 'seroquel' || med.type === 'cobenfy' || med.type === 'latuda' || med.type === 'caplyta' ? 
                   'Psychiatric Management' : 'As Prescribed'
      })),
      clinicalObservations: generateObservations(avgMood, moodVariability, avgSideEffectsSeverity, avgSleep, avgBloodSugar, avgProductivity, avgFocus, avgEnergy, periodExercises.length)
    };

    setSummaryData(summary);
  };

  const generateObservations = (avgMood: number, moodVar: number, sideEffects: number, sleep: number, bloodSugar: number, productivity: number, focus: number, energy: number, exerciseCount: number) => {
    const observations = [];

    // Mood patterns
    if (moodVar > 2.5) {
      observations.push("Significant mood variability noted - consider evaluating triggers or medication timing");
    } else if (moodVar < 1.0) {
      observations.push("Mood appears stable with minimal fluctuation");
    }

    if (avgMood < 4) {
      observations.push("Average mood scores indicate persistent low mood");
    } else if (avgMood > 7) {
      observations.push("Mood scores consistently in positive range");
    }

    // Sleep correlation
    if (sleep > 0 && sleep < 6) {
      observations.push("Sleep duration consistently below recommended levels - may impact mood and cognitive function");
    } else if (sleep >= 8) {
      observations.push("Sleep duration appears adequate for optimal functioning");
    }

    // Metabolic observations
    if (bloodSugar > 125) {
      observations.push("Blood sugar levels averaging above normal range - diabetes management may need adjustment");
    } else if (bloodSugar > 0 && bloodSugar <= 100) {
      observations.push("Blood sugar levels well-controlled within normal range");
    }

    // Cognitive function patterns
    if (productivity > 0 && focus > 0 && energy > 0) {
      if (productivity < 5 || focus < 5 || energy < 5) {
        observations.push("Cognitive function scores indicate potential impact on daily functioning");
      } else if (productivity >= 7 && focus >= 7 && energy >= 7) {
        observations.push("Cognitive function scores indicate good daily functioning");
      }
    }

    // Activity level - more neutral observations
    if (exerciseCount === 0) {
      observations.push("No structured exercise activity recorded during this period");
    } else if (exerciseCount >= 3) {
      observations.push("Regular structured exercise activity documented throughout period");
    } else if (exerciseCount > 0) {
      observations.push("Some structured exercise activity recorded during period");
    }

    // Side effects impact
    if (sideEffects >= 6) {
      observations.push("Side effects severity may be impacting quality of life - consider risk-benefit assessment");
    } else if (sideEffects > 0 && sideEffects < 3) {
      observations.push("Side effects reported at minimal levels");
    }

    if (observations.length === 0) {
      observations.push("Patient appears to be managing well with current treatment approach");
    }

    return observations;
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
            .observation { margin: 8px 0; padding: 8px; background: #fff3cd; border-left: 4px solid #ffc107; }
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
            <h2>SYMPTOM STABILITY ASSESSMENT</h2>
            <div class="metric">
              <strong>Average Mood Score:</strong> ${summaryData.symptomStability.averageMoodScore}/10 
              <span class="assessment">(${summaryData.symptomStability.stabilityAssessment})</span>
            </div>
            <div class="metric">
              <strong>Mood Variability:</strong> ${summaryData.symptomStability.moodVariability}
            </div>
            <div class="metric">
              <strong>Mood Entries Recorded:</strong> ${summaryData.symptomStability.moodEntryCount}
            </div>
          </div>

          <div class="section">
            <h2>SLEEP PATTERNS</h2>
            <div class="metric">
              <strong>Average Sleep Duration:</strong> ${summaryData.sleepPatterns?.averageHours || 0} hours 
              <span class="assessment">(${summaryData.sleepPatterns?.assessment || 'No Data'})</span>
            </div>
            <div class="metric">
              <strong>Sleep Entries Recorded:</strong> ${summaryData.sleepPatterns?.entriesRecorded || 0}
            </div>
          </div>

          <div class="section">
            <h2>METABOLIC HEALTH</h2>
            <div class="metric">
              <strong>Average Blood Sugar:</strong> ${summaryData.metabolicHealth?.averageBloodSugar || 0} mg/dL 
              <span class="assessment">(${summaryData.metabolicHealth?.assessment || 'No Data'})</span>
            </div>
            <div class="metric">
              <strong>Blood Sugar Entries:</strong> ${summaryData.metabolicHealth?.entriesRecorded || 0}
            </div>
          </div>

          <div class="section">
            <h2>COGNITIVE FUNCTION</h2>
            <div class="metric">
              <strong>Average Productivity:</strong> ${summaryData.cognitiveFunction?.averageProductivity || 0}/10
            </div>
            <div class="metric">
              <strong>Average Focus:</strong> ${summaryData.cognitiveFunction?.averageFocus || 0}/10
            </div>
            <div class="metric">
              <strong>Average Energy:</strong> ${summaryData.cognitiveFunction?.averageEnergy || 0}/10
            </div>
            <div class="metric">
              <strong>Work Entries Recorded:</strong> ${summaryData.cognitiveFunction?.entriesRecorded || 0}
            </div>
          </div>

          <div class="section">
            <h2>PHYSICAL ACTIVITY</h2>
            <div class="metric">
              <strong>Total Exercise Minutes:</strong> ${summaryData.activityLevel?.totalExerciseMinutes || 0}
            </div>
            <div class="metric">
              <strong>Average Per Day:</strong> ${summaryData.activityLevel?.averagePerDay || 0} minutes
            </div>
            <div class="metric">
              <strong>Exercise Sessions:</strong> ${summaryData.activityLevel?.sessionsRecorded || 0}
            </div>
          </div>

          <div class="section">
            <h2>ADVERSE EVENTS</h2>
            <div class="metric">
              <strong>Reported Side Effects:</strong> ${summaryData.adverseEvents?.reportedSideEffects || 0}
            </div>
            <div class="metric">
              <strong>Average Severity:</strong> ${summaryData.adverseEvents?.averageSeverity || 0}/10 
              <span class="assessment">(${summaryData.adverseEvents?.severityCategory || 'No Data'})</span>
            </div>
          </div>

          <div class="section">
            <h2>CLINICAL OBSERVATIONS</h2>
            ${summaryData.clinicalObservations?.map((obs: string) => `
              <div class="observation">• ${obs}</div>
            `).join('') || '<div class="observation">No observations available</div>'}
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
          {summaryData.currentRegimen?.map((med: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <div>
                <span className="font-medium text-foreground">{med.medication}</span>
                <span className="text-muted-foreground ml-2">({med.dosage}, {med.frequency})</span>
              </div>
              <span className="text-sm text-champagne">{med.indication}</span>
            </div>
          )) || <div className="text-muted-foreground">No medications recorded</div>}
        </div>
      </Card>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-400" size={20} />
            <span className="text-sm text-muted-foreground">Mood Stability</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.symptomStability?.averageMoodScore || 0}/10</div>
          <div className="text-sm text-muted-foreground">{summaryData.symptomStability?.stabilityAssessment || 'No Data'}</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <span className="text-sm text-muted-foreground">Side Effects</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.adverseEvents?.averageSeverity || 0}/10</div>
          <div className="text-sm text-muted-foreground">{summaryData.adverseEvents?.severityCategory || 'No Data'}</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-green-400" size={20} />
            <span className="text-sm text-muted-foreground">Sleep Average</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.sleepPatterns?.averageHours || 0}h</div>
          <div className="text-sm text-muted-foreground">{summaryData.sleepPatterns?.assessment || 'No Data'}</div>
        </Card>

        <Card className="bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-purple-400" size={20} />
            <span className="text-sm text-muted-foreground">Blood Sugar</span>
          </div>
          <div className="text-2xl font-bold text-gold">{summaryData.metabolicHealth?.averageBloodSugar || 0}</div>
          <div className="text-sm text-muted-foreground">{summaryData.metabolicHealth?.assessment || 'No Data'}</div>
        </Card>
      </div>

      {/* Clinical Observations */}
      <Card className="bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Clinical Observations</h3>
        <div className="space-y-2">
          {summaryData.clinicalObservations?.map((observation: string, index: number) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-blue-100/10 border-l-4 border-blue-400 rounded">
              <span className="text-blue-400 mt-1">•</span>  
              <span className="text-foreground">{observation}</span>
            </div>
          )) || <div className="text-muted-foreground">No observations available</div>}
        </div>
      </Card>
    </div>
  );
};

export default MedicalSummary;
