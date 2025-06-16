
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, List, Timer, Edit, Dumbbell, CheckSquare, Apple, TrendingUp, Activity, Briefcase } from 'lucide-react';

const TabNavigation: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-10 mb-8">
      <TabsTrigger value="medications" className="flex items-center gap-2">
        <Bell size={18} />
        <span className="hidden sm:inline">Meds</span>
      </TabsTrigger>
      <TabsTrigger value="health" className="flex items-center gap-2">
        <Activity size={18} />
        <span className="hidden sm:inline">Health</span>
      </TabsTrigger>
      <TabsTrigger value="timer" className="flex items-center gap-2">
        <Timer size={18} />
        <span className="hidden sm:inline">Timer</span>
      </TabsTrigger>
      <TabsTrigger value="checklist" className="flex items-center gap-2">
        <List size={18} />
        <span className="hidden sm:inline">Tasks</span>
      </TabsTrigger>
      <TabsTrigger value="exercise" className="flex items-center gap-2">
        <Dumbbell size={18} />
        <span className="hidden sm:inline">Exercise</span>
      </TabsTrigger>
      <TabsTrigger value="diet" className="flex items-center gap-2">
        <Apple size={18} />
        <span className="hidden sm:inline">Diet</span>
      </TabsTrigger>
      <TabsTrigger value="work" className="flex items-center gap-2">
        <Briefcase size={18} />
        <span className="hidden sm:inline">Work</span>
      </TabsTrigger>
      <TabsTrigger value="todos" className="flex items-center gap-2">
        <CheckSquare size={18} />
        <span className="hidden sm:inline">To-Do</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <TrendingUp size={18} />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger value="edit" className="flex items-center gap-2">
        <Edit size={18} />
        <span className="hidden sm:inline">Edit</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
