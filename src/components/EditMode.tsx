
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditableItem {
  id: string;
  name: string;
  time: string;
  instructions: string;
  type: string;
}

const EditMode = () => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableItems, setEditableItems] = useState<EditableItem[]>([
    {
      id: '1',
      name: 'Anti-nausea medication',
      time: '08:00',
      instructions: 'Take before first Cobenfy dose',
      type: 'anti-nausea'
    },
    {
      id: '2',
      name: 'Cobenfy (Morning)',
      time: '08:30',
      instructions: '2 hours after breakfast OR 1 hour before lunch',
      type: 'cobenfy'
    }
  ]);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempItem, setTempItem] = useState<EditableItem | null>(null);

  const startEdit = (item: EditableItem) => {
    setEditingItem(item.id);
    setTempItem({ ...item });
  };

  const saveEdit = () => {
    if (tempItem) {
      setEditableItems(prev => 
        prev.map(item => 
          item.id === tempItem.id ? tempItem : item
        )
      );
      
      toast({
        title: "Saved! ✏️",
        description: `${tempItem.name} has been updated`,
      });
    }
    
    setEditingItem(null);
    setTempItem(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setTempItem(null);
  };

  const addNewItem = () => {
    const newItem: EditableItem = {
      id: Date.now().toString(),
      name: 'New Item',
      time: '12:00',
      instructions: 'Add instructions here',
      type: 'medication'
    };
    
    setEditableItems(prev => [...prev, newItem]);
    startEdit(newItem);
  };

  const deleteItem = (id: string) => {
    setEditableItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Deleted",
      description: "Item removed from your list",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Edit className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Edit Your Schedule</h2>
        </div>
        
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink"
        >
          {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </Button>
      </div>

      {isEditMode && (
        <Card className="medication-card bg-gray-800 border-l-4 border-l-gold">
          <div className="text-center">
            <Button
              onClick={addNewItem}
              className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink"
            >
              Add New Item
            </Button>
          </div>
        </Card>
      )}

      {editableItems.map((item) => (
        <Card key={item.id} className="medication-card bg-gray-800 border-l-4 border-l-champagne">
          {editingItem === item.id && tempItem ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={tempItem.name}
                    onChange={(e) => setTempItem({...tempItem, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={tempItem.time}
                    onChange={(e) => setTempItem({...tempItem, time: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Instructions</label>
                <Textarea
                  value={tempItem.instructions}
                  onChange={(e) => setTempItem({...tempItem, instructions: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={saveEdit}
                  className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink"
                >
                  <Save size={16} /> Save
                </Button>
                <Button
                  onClick={cancelEdit}
                  className="bg-gray-600 text-white hover:bg-gray-500"
                >
                  <X size={16} /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={18} className="text-muted-foreground" />
                  <span className="font-medium text-lg">{item.time}</span>
                  <span className="font-semibold text-foreground">{item.name}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-9">{item.instructions}</p>
              </div>
              
              {isEditMode && (
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => startEdit(item)}
                    size="sm"
                    className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => deleteItem(item.id)}
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-500"
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default EditMode;
