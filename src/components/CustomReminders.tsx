
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Edit, Trash2, Clock, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'weekdays' | 'once';
  category: 'medication' | 'exercise' | 'mood' | 'food' | 'custom';
  isActive: boolean;
  nextReminder: string; // ISO date string
  lastTriggered?: string;
}

const CustomReminders = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    time: '09:00',
    frequency: 'daily',
    category: 'custom',
    isActive: true
  });

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    saveReminders();
  }, [reminders]);

  const loadReminders = () => {
    const saved = localStorage.getItem('customReminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    }
  };

  const saveReminders = () => {
    localStorage.setItem('customReminders', JSON.stringify(reminders));
  };

  const calculateNextReminder = (time: string, frequency: string): string => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);

    // If time has passed today, move to next occurrence
    if (next <= now) {
      switch (frequency) {
        case 'daily':
          next.setDate(next.getDate() + 1);
          break;
        case 'weekly':
          next.setDate(next.getDate() + 7);
          break;
        case 'weekdays':
          do {
            next.setDate(next.getDate() + 1);
          } while (next.getDay() === 0 || next.getDay() === 6); // Skip weekends
          break;
        case 'once':
          next.setDate(next.getDate() + 1);
          break;
      }
    }

    return next.toISOString();
  };

  const handleAddReminder = () => {
    if (!newReminder.title?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reminder title",
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description || '',
      time: newReminder.time || '09:00',
      frequency: newReminder.frequency || 'daily',
      category: newReminder.category || 'custom',
      isActive: newReminder.isActive !== false,
      nextReminder: calculateNextReminder(newReminder.time || '09:00', newReminder.frequency || 'daily')
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      title: '',
      description: '',
      time: '09:00',
      frequency: 'daily',
      category: 'custom',
      isActive: true
    });
    setIsAddingReminder(false);

    toast({
      title: "Reminder created! 🔔",
      description: "Your reminder has been set up successfully",
    });
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { 
            ...reminder, 
            isActive: !reminder.isActive,
            nextReminder: !reminder.isActive 
              ? calculateNextReminder(reminder.time, reminder.frequency)
              : reminder.nextReminder
          }
        : reminder
    ));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "The reminder has been removed",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-hot-pink/20 text-hot-pink';
      case 'exercise': return 'bg-green-500/20 text-green-400';
      case 'mood': return 'bg-blue-500/20 text-blue-400';
      case 'food': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Every day';
      case 'weekly': return 'Weekly';
      case 'weekdays': return 'Weekdays only';
      case 'once': return 'One time';
      default: return frequency;
    }
  };

  const getNextReminderText = (nextReminder: string) => {
    const next = new Date(nextReminder);
    const now = new Date();
    const diffMs = next.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 1) {
      return `in ${diffDays} days`;
    } else if (diffDays === 1) {
      return 'tomorrow';
    } else if (diffHours > 0) {
      return `in ${diffHours}h`;
    } else {
      return 'soon';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Custom Reminders</h2>
        </div>
        <Button
          onClick={() => setIsAddingReminder(true)}
          className="bg-hot-pink text-black hover:bg-hot-pink/90 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Reminder
        </Button>
      </div>

      {/* Add/Edit Reminder Form */}
      {isAddingReminder && (
        <Card className="medication-card p-4 space-y-4">
          <h3 className="font-medium text-foreground">New Reminder</h3>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
            <Input
              value={newReminder.title || ''}
              onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Take morning vitamins"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description (optional)</label>
            <Textarea
              value={newReminder.description || ''}
              onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
              <Input
                type="time"
                value={newReminder.time || '09:00'}
                onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <Select
                value={newReminder.category || 'custom'}
                onValueChange={(value) => setNewReminder(prev => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="mood">Mood Check</SelectItem>
                  <SelectItem value="food">Food/Nutrition</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Frequency</label>
            <Select
              value={newReminder.frequency || 'daily'}
              onValueChange={(value) => setNewReminder(prev => ({ ...prev, frequency: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="weekdays">Weekdays only</SelectItem>
                <SelectItem value="once">One time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingReminder(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddReminder}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              Create Reminder
            </Button>
          </div>
        </Card>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <Card className="medication-card p-8 text-center">
            <Bell className="mx-auto text-muted-foreground mb-3" size={48} />
            <p className="text-muted-foreground">No custom reminders set up yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first reminder to get started</p>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id} className={`medication-card p-4 ${!reminder.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(reminder.category)}>
                      {reminder.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{reminder.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Repeat size={12} />
                      <span>{getFrequencyText(reminder.frequency)}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-foreground">{reminder.title}</h4>
                  {reminder.description && (
                    <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                  )}
                  
                  {reminder.isActive && (
                    <p className="text-xs text-green-400 mt-2">
                      Next reminder {getNextReminderText(reminder.nextReminder)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Switch
                    checked={reminder.isActive}
                    onCheckedChange={() => handleToggleReminder(reminder.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomReminders;
