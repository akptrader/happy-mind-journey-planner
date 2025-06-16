
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  List, 
  Timer, 
  Edit, 
  Dumbbell, 
  CheckSquare, 
  Apple, 
  TrendingUp, 
  Activity, 
  Briefcase,
  Home,
  Search,
  Target
} from 'lucide-react';

const TabNavigation: React.FC = () => {
  return (
    <div className="mb-8">
      {/* Primary Navigation - Most Used Features */}
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <Home size={18} />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="medications" className="flex items-center gap-2">
          <Bell size={18} />
          <span className="hidden sm:inline">Meds</span>
        </TabsTrigger>
        <TabsTrigger value="search" className="flex items-center gap-2">
          <Search size={18} />
          <span className="hidden sm:inline">Search</span>
        </TabsTrigger>
        <TabsTrigger value="correlations" className="flex items-center gap-2">
          <Target size={18} />
          <span className="hidden sm:inline">Insights</span>
        </TabsTrigger>
      </TabsList>

      {/* Secondary Navigation - Tracking Features */}
      <TabsList className="grid w-full grid-cols-6 mb-4">
        <TabsTrigger value="health" className="flex items-center gap-2">
          <Activity size={18} />
          <span className="hidden sm:inline">Health</span>
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
        <TabsTrigger value="checklist" className="flex items-center gap-2">
          <List size={18} />
          <span className="hidden sm:inline">Tasks</span>
        </TabsTrigger>
        <TabsTrigger value="todos" className="flex items-center gap-2">
          <CheckSquare size={18} />
          <span className="hidden sm:inline">To-Do</span>
        </TabsTrigger>
      </TabsList>

      {/* Tertiary Navigation - Tools & Settings */}
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="reminders" className="flex items-center gap-2">
          <Bell size={18} />
          <span className="hidden sm:inline">Reminders</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <TrendingUp size={18} />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="timer" className="flex items-center gap-2">
          <Timer size={18} />
          <span className="hidden sm:inline">Timer</span>
        </TabsTrigger>
        <TabsTrigger value="edit" className="flex items-center gap-2">
          <Edit size={18} />
          <span className="hidden sm:inline">Edit</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default TabNavigation;
