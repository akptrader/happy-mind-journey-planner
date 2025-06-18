
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { List, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChecklistHeaderProps {
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
}

const ChecklistHeader = ({ addDialogOpen, setAddDialogOpen }: ChecklistHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
      <div className="flex items-center gap-2">
        <List className="text-hot-pink" size={isMobile ? 20 : 24} />
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Daily Checklist</h2>
      </div>
      
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-hot-pink text-black hover:bg-hot-pink/90 w-full sm:w-auto min-h-[48px] touch-manipulation">
            <Plus size={18} />
            Add Item
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default ChecklistHeader;
