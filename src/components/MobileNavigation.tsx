
import React from 'react';
import { 
  Home, 
  Bell, 
  Brain, 
  Search, 
  Activity, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';

type View = 'dashboard' | 'medications' | 'mood' | 'health' | 'analytics' | 'checklist' | 'exercise' | 'diet' | 'work' | 'supplements' | 'data-backup' | 'search';

interface MobileNavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, onNavigate }) => {
  const primaryTabs = [
    { id: 'dashboard' as View, icon: Home, label: 'Home' },
    { id: 'medications' as View, icon: Bell, label: 'Meds' },
    { id: 'mood' as View, icon: Brain, label: 'Mood' },
    { id: 'search' as View, icon: Search, label: 'Search' },
  ];

  const secondaryTabs = [
    { id: 'health' as View, label: 'Health Metrics' },
    { id: 'exercise' as View, label: 'Exercise' },
    { id: 'diet' as View, label: 'Diet' },
    { id: 'work' as View, label: 'Work' },
    { id: 'checklist' as View, label: 'Daily Tasks' },
    { id: 'supplements' as View, label: 'Supplements' },
    { id: 'analytics' as View, label: 'Analytics' },
    { id: 'data-backup' as View, label: 'Data Backup' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Primary navigation tabs */}
        {primaryTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={currentView === tab.id ? "default" : "ghost"}
            size="sm"
            className="flex flex-col items-center gap-1 h-14 px-3"
            onClick={() => onNavigate(tab.id)}
          >
            <tab.icon size={18} />
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}

        {/* More menu drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-14 px-3"
            >
              <Menu size={18} />
              <span className="text-xs">More</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[60vh]">
            <DrawerHeader className="flex flex-row items-center justify-between">
              <DrawerTitle>More Options</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X size={18} />
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="grid grid-cols-2 gap-3 p-4">
              {secondaryTabs.map((tab) => (
                <DrawerClose key={tab.id} asChild>
                  <Button
                    variant={currentView === tab.id ? "default" : "outline"}
                    className="h-12 text-left justify-start"
                    onClick={() => onNavigate(tab.id)}
                  >
                    {tab.label}
                  </Button>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default MobileNavigation;
