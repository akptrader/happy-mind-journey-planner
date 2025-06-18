
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Database, AlertTriangle } from 'lucide-react';

const DataBackup = () => {
  const [backupData, setBackupData] = useState('');
  const [importDataText, setImportDataText] = useState('');
  const { toast } = useToast();

  const getAllStoredData = () => {
    const allData = {
      medications: JSON.parse(localStorage.getItem('medications') || '[]'),
      medicationLog: JSON.parse(localStorage.getItem('medicationLog') || '[]'),
      moodEntries: JSON.parse(localStorage.getItem('moodEntries') || '[]'),
      healthMetrics: JSON.parse(localStorage.getItem('healthMetrics') || '[]'),
      exercises: JSON.parse(localStorage.getItem('exercises') || '[]'),
      workEntries: JSON.parse(localStorage.getItem('workEntries') || '[]'),
      sideEffects: JSON.parse(localStorage.getItem('sideEffects') || '[]'),
      dosageEntries: JSON.parse(localStorage.getItem('dosageEntries') || '[]'),
      dietEntries: JSON.parse(localStorage.getItem('dietEntries') || '[]'),
      supplements: JSON.parse(localStorage.getItem('supplements') || '[]'),
      checklistItems: JSON.parse(localStorage.getItem('checklistItems') || '[]'),
      personalTodos: JSON.parse(localStorage.getItem('personalTodos') || '[]'),
      exportTimestamp: new Date().toISOString()
    };
    return allData;
  };

  const getDataSummary = () => {
    const data = getAllStoredData();
    return {
      medications: data.medications.length,
      medicationLogs: data.medicationLog.length,
      moodEntries: data.moodEntries.length,
      healthMetrics: data.healthMetrics.length,
      exercises: data.exercises.length,
      workEntries: data.workEntries.length,
      sideEffects: data.sideEffects.length,
      dosageEntries: data.dosageEntries.length,
      dietEntries: data.dietEntries.length,
      supplements: data.supplements.length,
      checklistItems: data.checklistItems.length,
      personalTodos: data.personalTodos.length
    };
  };

  const exportData = () => {
    const data = getAllStoredData();
    const jsonString = JSON.stringify(data, null, 2);
    setBackupData(jsonString);

    // Create downloadable file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported! 📁",
      description: "Your backup file has been downloaded and displayed below",
    });
  };

  const handleImportData = () => {
    try {
      const data = JSON.parse(importDataText);
      
      // Validate data structure
      const expectedKeys = [
        'medications', 'medicationLog', 'moodEntries', 'healthMetrics',
        'exercises', 'workEntries', 'sideEffects', 'dosageEntries',
        'dietEntries', 'supplements', 'checklistItems', 'personalTodos'
      ];

      const isValidBackup = expectedKeys.some(key => Array.isArray(data[key]));
      
      if (!isValidBackup) {
        throw new Error('Invalid backup format');
      }

      // Import data to localStorage
      Object.keys(data).forEach(key => {
        if (key !== 'exportTimestamp' && Array.isArray(data[key])) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });

      toast({
        title: "Data imported successfully! ✅",
        description: "Your health data has been restored. Please refresh the page.",
      });

      // Refresh page to show imported data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast({
        title: "Import failed ❌",
        description: "Please check that your backup data is valid JSON format",
        variant: "destructive"
      });
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      const keysToRemove = [
        'medications', 'medicationLog', 'moodEntries', 'healthMetrics',
        'exercises', 'workEntries', 'sideEffects', 'dosageEntries',
        'dietEntries', 'supplements', 'checklistItems', 'personalTodos'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "All data cleared",
        description: "Your health tracking data has been removed",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const summary = getDataSummary();
  const hasData = Object.values(summary).some(count => count > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="text-hot-pink" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Data Management</h2>
      </div>

      {/* Current Data Status */}
      <Card className="medication-card bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Data Status</h3>
        {hasData ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-hot-pink">{summary.medications}</div>
              <div className="text-muted-foreground">Medications</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{summary.medicationLogs}</div>
              <div className="text-muted-foreground">Med Logs</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{summary.moodEntries}</div>
              <div className="text-muted-foreground">Mood Entries</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">{summary.healthMetrics}</div>
              <div className="text-muted-foreground">Health Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{summary.exercises}</div>
              <div className="text-muted-foreground">Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{summary.dietEntries}</div>
              <div className="text-muted-foreground">Diet Entries</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto mb-3 text-red-400" size={48} />
            <p className="text-red-400 font-medium">No data found in local storage</p>
            <p className="text-muted-foreground text-sm mt-2">
              Your health tracking data appears to be empty. You can import a backup if you have one.
            </p>
          </div>
        )}
      </Card>

      {/* Export Section */}
      <Card className="medication-card bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Data</h3>
        <p className="text-muted-foreground mb-4">
          Download all your health tracking data as a backup file.
        </p>
        <Button 
          onClick={exportData}
          className="bg-hot-pink text-black hover:bg-hot-pink/90"
          disabled={!hasData}
        >
          <Download size={16} className="mr-2" />
          Export All Data
        </Button>
        
        {backupData && (
          <div className="mt-4">
            <label className="text-sm font-medium text-foreground">Backup Data (Copy this as additional backup):</label>
            <Textarea
              value={backupData}
              readOnly
              className="mt-2 font-mono text-xs"
              rows={10}
            />
          </div>
        )}
      </Card>

      {/* Import Section */}
      <Card className="medication-card bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Import Data</h3>
        <p className="text-muted-foreground mb-4">
          Restore your health tracking data from a backup file.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Paste backup data here:
            </label>
            <Textarea
              value={importDataText}
              onChange={(e) => setImportDataText(e.target.value)}
              placeholder="Paste your backup JSON data here..."
              className="font-mono text-xs"
              rows={8}
            />
          </div>
          
          <Button 
            onClick={handleImportData}
            disabled={!importDataText.trim()}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Upload size={16} className="mr-2" />
            Import Data
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="medication-card bg-red-900/20 border-red-500/20 p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        <p className="text-muted-foreground mb-4">
          Permanently delete all your health tracking data. This cannot be undone.
        </p>
        <Button 
          onClick={clearAllData}
          variant="destructive"
          disabled={!hasData}
        >
          Clear All Data
        </Button>
      </Card>
    </div>
  );
};

export default DataBackup;
