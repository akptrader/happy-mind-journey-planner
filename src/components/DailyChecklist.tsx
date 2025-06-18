
import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ChecklistHeader from './checklist/ChecklistHeader';
import ProgressCard from './checklist/ProgressCard';
import ChecklistItem from './checklist/ChecklistItem';
import EditChecklistItem from './checklist/EditChecklistItem';
import AddItemDialog from './checklist/AddItemDialog';

interface ChecklistItemData {
  id: string;
  title: string;
  completed: boolean;
  category: 'medication' | 'meals' | 'selfcare';
  time?: string;
}

const DailyChecklist = () => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItemData[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editCategory, setEditCategory] = useState<'medication' | 'meals' | 'selfcare'>('selfcare');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'medication' | 'meals' | 'selfcare'>('selfcare');

  const defaultChecklist: ChecklistItemData[] = [
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

  const startEditing = (item: ChecklistItemData) => {
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
    
    const newItem: ChecklistItemData = {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <ChecklistHeader 
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
      />

      <ProgressCard 
        completedCount={completedCount}
        totalCount={totalCount}
        progressPercentage={progressPercentage}
      />

      <div className="space-y-3">
        {checklist.map((item) => (
          editingItem === item.id ? (
            <EditChecklistItem
              key={item.id}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editTime={editTime}
              setEditTime={setEditTime}
              editCategory={editCategory}
              setEditCategory={setEditCategory}
              onSave={saveEdit}
              onCancel={cancelEdit}
            />
          ) : (
            <ChecklistItem
              key={item.id}
              item={item}
              onToggle={toggleItem}
              onEdit={startEditing}
              onDelete={deleteItem}
            />
          )
        ))}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <AddItemDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          newItemTitle={newItemTitle}
          setNewItemTitle={setNewItemTitle}
          newItemTime={newItemTime}
          setNewItemTime={setNewItemTime}
          newItemCategory={newItemCategory}
          setNewItemCategory={setNewItemCategory}
          onSubmit={addNewItem}
        />
      </Dialog>
    </div>
  );
};

export default DailyChecklist;
