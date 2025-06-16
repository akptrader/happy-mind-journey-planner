
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface SearchResult {
  id: string;
  type: 'medication' | 'mood' | 'exercise' | 'food' | 'work' | 'health';
  title: string;
  description: string;
  timestamp: string;
  data: any;
}

interface SearchAndFilterProps {
  onResultsChange: (results: SearchResult[]) => void;
}

const SearchAndFilter = ({ onResultsChange }: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    performSearch();
  }, [searchQuery, selectedType, dateFrom, dateTo]);

  const performSearch = () => {
    const allData = loadAllData();
    let filteredResults = allData;

    // Filter by search query
    if (searchQuery.trim()) {
      filteredResults = filteredResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filteredResults = filteredResults.filter(item => item.type === selectedType);
    }

    // Filter by date range
    if (dateFrom) {
      filteredResults = filteredResults.filter(item => 
        new Date(item.timestamp) >= dateFrom
      );
    }

    if (dateTo) {
      filteredResults = filteredResults.filter(item => 
        new Date(item.timestamp) <= dateTo
      );
    }

    // Sort by timestamp (newest first)
    filteredResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setResults(filteredResults);
    onResultsChange(filteredResults);
  };

  const loadAllData = (): SearchResult[] => {
    const allResults: SearchResult[] = [];

    // Load medications
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
    medicationLog.forEach((log: any) => {
      const med = medications.find((m: any) => m.id === log.medicationId);
      if (med) {
        allResults.push({
          id: log.id,
          type: 'medication',
          title: `${med.name} taken`,
          description: `${med.dosage} ${med.unit} - ${med.frequency}`,
          timestamp: log.timestamp,
          data: { medication: med, log }
        });
      }
    });

    // Load mood entries
    const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    moodEntries.forEach((mood: any) => {
      allResults.push({
        id: mood.id,
        type: 'mood',
        title: `Mood: ${mood.moodLevel}/10`,
        description: `${mood.type.replace('-', ' ')} ${mood.notes ? '- ' + mood.notes : ''}`,
        timestamp: mood.timestamp,
        data: mood
      });
    });

    // Load exercises
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    exercises.forEach((exercise: any) => {
      allResults.push({
        id: exercise.id,
        type: 'exercise',
        title: `${exercise.type} - ${exercise.duration}min`,
        description: `Intensity: ${exercise.intensity} ${exercise.notes ? '- ' + exercise.notes : ''}`,
        timestamp: exercise.timestamp,
        data: exercise
      });
    });

    // Load food entries
    const foodEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    foodEntries.forEach((food: any) => {
      allResults.push({
        id: food.id,
        type: 'food',
        title: `${food.name} - ${food.calories} cal`,
        description: `${food.protein || 0}g protein, ${food.carbs || 0}g carbs, ${food.fat || 0}g fat`,
        timestamp: food.timestamp,
        data: food
      });
    });

    // Load work entries
    const workEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');
    workEntries.forEach((work: any) => {
      allResults.push({
        id: work.id,
        type: 'work',
        title: `Work session - ${work.hoursWorked}h`,
        description: `Productivity: ${work.productivityLevel}/10, Focus: ${work.focusLevel}/10`,
        timestamp: work.timestamp,
        data: work
      });
    });

    // Load health metrics
    const healthMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
    healthMetrics.forEach((metric: any) => {
      allResults.push({
        id: metric.id,
        type: 'health',
        title: `${metric.type.replace('-', ' ')}: ${metric.value}${metric.unit}`,
        description: metric.notes || 'Health metric recorded',
        timestamp: metric.timestamp,
        data: metric
      });
    });

    return allResults;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setIsFiltersOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-hot-pink/20 text-hot-pink';
      case 'mood': return 'bg-blue-500/20 text-blue-400';
      case 'exercise': return 'bg-green-500/20 text-green-400';
      case 'food': return 'bg-orange-500/20 text-orange-400';
      case 'work': return 'bg-purple-500/20 text-purple-400';
      case 'health': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search your health data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <Card className="medication-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="medication">Medications</SelectItem>
                  <SelectItem value="mood">Mood</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="health">Health Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM dd") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MMM dd") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      {(searchQuery || selectedType !== 'all' || dateFrom || dateTo) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{results.length} results found</span>
          {(searchQuery || selectedType !== 'all' || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-6 px-2"
            >
              <X size={12} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2">
        {results.slice(0, 20).map((result) => (
          <Card key={result.id} className="medication-card p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getTypeColor(result.type)}>
                    {result.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(result.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-medium text-foreground text-sm">{result.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && (searchQuery || selectedType !== 'all' || dateFrom || dateTo) && (
        <Card className="medication-card p-8 text-center">
          <p className="text-muted-foreground">No results found matching your criteria</p>
        </Card>
      )}
    </div>
  );
};

export default SearchAndFilter;
