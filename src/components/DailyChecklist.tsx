import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Heart, List, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  category: 'medication' | 'meals' | 'selfcare';
  time?: string;
}

const DailyChecklist = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editCategory, setEditCategory] = useState<'medication' | 'meals' | 'selfcare'>('selfcare');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'medication' | 'meals' | 'selfcare'>('selfcare');

  const defaultChecklist: ChecklistItem[] = [
    { id: '1', title: 'Morning anti-nausea med', completed: false, category: 'medication', time: '8:00 AM' },
    { id: '2', title: 'First Cobenfy dose', completed: false, category: 'medication', time: '8:30 AM' },
    { id: '3', title: 'Breakfast (before Cobenfy)', completed: false, category: 'meals', time: '6:30 AM' },
    { id: '4', title: 'Lunch', completed: false, category: 'meals', time: '1:00 PM' },
    { id: '5', title: 'Afternoon anti-nausea med', completed: false, category: 'medication', time: '3:00 PM' },
    { id: '6', title: 'Second Cobenfy dose', completed: false, category: 'medication', time: '3:30 PM' },
    { id: '7', title: 'Dinner with 350+ calories', completed: false, category: 'meals', time: '6:00 PM' },
    { id: '8', title: 'Latuda with dinner', completed: false, category: 'medication', time: '6:00 PM' },
    { id: '9', title: '10 minutes of relaxation', completed: false, category: 'selfcare' },
    { id: '10', title: 'Call motivation hotline', completed: false, category: 'selfcare' },
    { id: '11', title: 'Journal or mood tracking', completed: false, category: 'selfcare' },
    { id: '12', title: 'Gentle movement/stretching', completed: false, category: 'selfcare' }
  ];

  useEffect(() => {
    const savedChecklist = localStorage.getItem('dailyChecklist');
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    } else {
      setChecklist(defaultChecklist);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyChecklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
    
    const item = checklist.find(item => item.id === id);
    if (item && !item.completed) {
      toast({
        title: "Great job! ✨",
        description: `${item.title} completed`,
      });
    }
  };

  const startEditing = (item: ChecklistItem) => {
    setEditingItem(item.id);
    setEditTitle(item.title);
    setEditTime(item.time || '');
    setEditCategory(item.category);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    
    setChecklist(prev => 
      prev.map(item => 
        item.id === editingItem 
          ? { ...item, title: editTitle, time: editTime || undefined, category: editCategory }
          : item
      )
    );
    
    setEditingItem(null);
    setEditTitle('');
    setEditTime('');
    toast({
      title: "Item updated! ✏️",
      description: "Checklist item has been updated",
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditTitle('');
    setEditTime('');
  };

  const deleteItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item deleted! 🗑️",
      description: "Checklist item has been removed",
    });
  };

  const addNewItem = () => {
    if (!newItemTitle.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      completed: false,
      category: newItemCategory,
      time: newItemTime || undefined
    };
    
    setChecklist(prev => [...prev, newItem]);
    setNewItemTitle('');
    setNewItemTime('');
    setNewItemCategory('selfcare');
    setAddDialogOpen(false);
    
    toast({
      title: "Item added! ➕",
      description: "New checklist item has been added",
    });
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return '💊';
      case 'meals':
        return '🍽️';
      case 'selfcare':
        return '💚';
      default:
        return '✓';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication':
        return 'border-l-hot-pink bg-gray-800';
      case 'meals':
        return 'border-l-gold bg-gray-800';
      case 'selfcare':
        return 'border-l-champagne bg-gray-800';
      default:
        return 'border-l-gray-300 bg-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="flex items-center gap-2">
          <List className="text-hot-pink" size={isMobile ? 20 : 24} />
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Daily Checklist</h2>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-hot-pink text-black hover:bg-hot-pink/90 w-full sm:w-auto min-h-[44px]">
              <Plus size={18} />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Add New Checklist Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                <Input
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Enter item title..."
                  className="min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Time (optional)</label>
                <Input
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  placeholder="e.g., 8:00 AM"
                  className="min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as 'medication' | 'meals' | 'selfcare')}
                  className="w-full p-3 min-h-[44px] rounded border bg-background text-foreground"
                >
                  <option value="selfcare">Self Care</option>
                  <option value="medication">Medication</option>
                  <option value="meals">Meals</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={addNewItem} className="flex-1 min-h-[44px]">
                  <Save size={16} />
                  <span className="ml-2">Add Item</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1 min-h-[44px]"
                >
                  <span className="ml-2">Cancel</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Card */}
      <Card className="medication-card wellness-gradient text-white">
        <div className="text-center p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Today's Progress</h3>
          <div className="text-2xl sm:text-3xl font-bold mb-2">{progressPercentage}%</div>
          <p className="text-sm opacity-90">{completedCount} of {totalCount} tasks completed</p>
          <div className="w-full bg-white/30 rounded-full h-3 mt-4">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <Card 
            key={item.id} 
            className={`medication-card border-l-4 ${getCategoryColor(item.category)} ${
              item.completed ? 'completed-task' : ''
            } transition-all duration-200`}
          >
            {editingItem === item.id ? (
              <div className="space-y-3 p-4">
                <div>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mb-3 min-h-[44px]"
                    placeholder="Item title"
                  />
                  <Input
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    placeholder="Time (optional)"
                    className="mb-3 min-h-[44px]"
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as 'medication' | 'meals' | 'selfcare')}
                    className="w-full p-3 min-h-[44px] rounded border bg-background text-foreground"
                  >
                    <option value="selfcare">Self Care</option>
                    <option value="medication">Medication</option>
                    <option value="meals">Meals</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={saveEdit} size="sm" className="min-h-[44px] flex-1">
                    <Save size={16} />
                    <span className="ml-2">Save</span>
                  </Button>
                  <Button onClick={cancelEdit} variant="outline" size="sm" className="min-h-[44px] flex-1">
                    <X size={16} />
                    <span className="ml-2">Cancel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4 p-4">
                <div className={`flex-shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center cursor-pointer touch-manipulation ${
                  item.completed 
                    ? 'bg-accent border-accent text-white' 
                    : 'border-muted-foreground'
                }`} onClick={() => toggleItem(item.id)}>
                  {item.completed && <Check size={isMobile ? 18 : 16} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      <span className={`font-medium text-sm sm:text-base ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </span>
                    </div>
                    {item.time && (
                      <span className="text-xs sm:text-sm text-muted-foreground sm:ml-auto">
                        {item.time}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1">
                  <Button 
                    onClick={() => startEditing(item)}
                    size="sm" 
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0 touch-manipulation"
                  >
                    <Edit2 size={isMobile ? 16 : 14} />
                  </Button>
                  <Button 
                    onClick={() => deleteItem(item.id)}
                    size="sm" 
                    variant="ghost"
                    className="h-10 w-10 sm:h-8 sm:w-8 p-0 text-red-400 hover:text-red-300 touch-manipulation"
                  >
                    <Trash2 size={isMobile ? 16 : 14} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyChecklist;
