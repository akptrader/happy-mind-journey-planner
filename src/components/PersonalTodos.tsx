
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Plus, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const PersonalTodos = () => {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('personalTodos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('personalTodos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: newPriority,
      createdAt: new Date().toISOString()
    };
    
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    setNewPriority('medium');
    
    toast({
      title: "Todo added! ✅",
      description: "New task added to your list",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
    
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed) {
      toast({
        title: "Great job! 🎉",
        description: `"${todo.text}" completed`,
      });
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Todo deleted",
      description: "Task removed from your list",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Star className="text-red-500" size={16} fill="currentColor" />;
      case 'medium':
        return <Star className="text-yellow-500" size={16} fill="currentColor" />;
      case 'low':
        return <Star className="text-green-500" size={16} />;
      default:
        return null;
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📝</span>
        <h2 className="text-2xl font-semibold text-foreground">Personal To-Do List</h2>
      </div>

      {/* Progress Card */}
      {totalCount > 0 && (
        <Card className="medication-card wellness-gradient text-white">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Progress</h3>
            <div className="text-3xl font-bold mb-2">
              {Math.round((completedCount / totalCount) * 100)}%
            </div>
            <p className="text-sm opacity-90">{completedCount} of {totalCount} tasks completed</p>
            <div className="w-full bg-white/30 rounded-full h-3 mt-4">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      {/* Add Todo */}
      <Card className="medication-card bg-gray-800 p-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Button
              onClick={addTodo}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <Card className="medication-card bg-gray-800 p-6 text-center">
            <p className="text-muted-foreground">No tasks yet. Add one above!</p>
          </Card>
        ) : (
          todos
            .sort((a, b) => {
              // Sort by completed status first, then by priority, then by date
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              if (a.priority !== b.priority) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              }
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((todo) => (
              <Card 
                key={todo.id} 
                className={`medication-card border-l-4 ${getPriorityColor(todo.priority)} ${
                  todo.completed ? 'completed-task' : ''
                } cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-4 p-3">
                  <div 
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      todo.completed 
                        ? 'bg-accent border-accent text-white' 
                        : 'border-muted-foreground hover:border-accent'
                    }`}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed && <Check size={16} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(todo.priority)}
                      <span className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {todo.text}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-60 hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default PersonalTodos;
