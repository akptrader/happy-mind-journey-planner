
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import MedicationTracker from './MedicationTracker';
import DailyChecklist from './DailyChecklist';
import SelfCareReminders from './SelfCareReminders';
import { Bell, List, Heart, Calendar } from 'lucide-react';

const WellnessApp = () => {
  const [activeTab, setActiveTab] = useState('medications');
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="wellness-gradient rounded-2xl p-6 text-white mb-6">
            <h1 className="text-3xl font-bold mb-2">Wellness Companion</h1>
            <p className="text-lg opacity-90">Managing your health journey with care</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm opacity-80">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Bell size={18} />
              <span className="hidden sm:inline">Medications</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <List size={18} />
              <span className="hidden sm:inline">Daily Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="selfcare" className="flex items-center gap-2">
              <Heart size={18} />
              <span className="hidden sm:inline">Self-Care</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="animate-slide-in">
            <MedicationTracker />
          </TabsContent>

          <TabsContent value="checklist" className="animate-slide-in">
            <DailyChecklist />
          </TabsContent>

          <TabsContent value="selfcare" className="animate-slide-in">
            <SelfCareReminders />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="medication-card calm-gradient">
            <p className="text-sm text-gray-700">
              💙 Remember: You're doing great by taking care of your health. Every step forward matters.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WellnessApp;
