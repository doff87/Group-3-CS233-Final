import { useState } from 'react';
import { FoodEntry } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { DayDetails } from './DayDetails';
import { CURRENT_DATE } from '../utils/constants';
import { calculateTotals, groupEntriesByDate } from '../utils/nutrition';

interface PastEntriesProps {
  entries: FoodEntry[];
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  onSwitchToToday: () => void;
}

export function PastEntries({ entries, onAddEntry, onDeleteEntry, onSwitchToToday }: PastEntriesProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Set current month to November 2025 (current month)
  const [currentMonth, setCurrentMonth] = useState(new Date(CURRENT_DATE));

  // Group entries by date
  const entriesByDate = groupEntriesByDate(entries);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date(CURRENT_DATE);
    const yesterday = new Date(CURRENT_DATE);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) return 'Today';
    if (dateString === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  // If a date is selected, show the detailed view
  if (selectedDate) {
    return (
      <DayDetails
        date={selectedDate}
        entries={entries}
        onAddEntry={onAddEntry}
        onDeleteEntry={onDeleteEntry}
        onBack={() => setSelectedDate(null)}
        title={formatDate(selectedDate)}
        description={selectedDate}
      />
    );
  }

  // Calendar view
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Calendar View</h2>
        <p className="text-gray-500">Click on any day to view details</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm text-gray-500 p-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateString = getDateString(day);
              const hasEntries = entriesByDate[dateString];
              const dayTotal = hasEntries ? calculateTotals(hasEntries).calories : 0;
              const isToday = dateString === CURRENT_DATE;
              
              // Check if date is within 7 days in the future
              const currentDate = new Date(CURRENT_DATE);
              const thisDate = new Date(dateString);
              const diffTime = thisDate.getTime() - currentDate.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isFutureClickable = diffDays > 0 && diffDays <= 7;
              const isClickable = isToday || hasEntries || isFutureClickable;

              const handleDayClick = () => {
                if (isToday) {
                  onSwitchToToday();
                } else if (isClickable) {
                  setSelectedDate(dateString);
                }
              };

              return (
                <button
                  key={day}
                  onClick={handleDayClick}
                  disabled={!isClickable}
                  className={`
                    p-3 rounded-lg text-center transition-colors
                    ${isToday
                      ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer border-2 border-blue-400'
                      : isFutureClickable
                        ? 'bg-purple-100 hover:bg-purple-200 cursor-pointer border-2 border-purple-300'
                        : hasEntries 
                          ? 'bg-emerald-100 hover:bg-emerald-200 cursor-pointer border-2 border-emerald-300' 
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={isToday ? 'text-blue-700' : isFutureClickable ? 'text-purple-700' : 'text-gray-900'}>{day}</div>
                  {isToday && (
                    <div className="text-xs text-blue-700 mt-1">Today</div>
                  )}
                  {isFutureClickable && !isToday && (
                    <div className="text-xs text-purple-700 mt-1">Plan</div>
                  )}
                  {!isToday && !isFutureClickable && hasEntries && (
                    <div className="text-xs text-emerald-700 mt-1">{dayTotal} kcal</div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}