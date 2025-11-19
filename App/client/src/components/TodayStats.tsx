import { FoodEntry } from '../App';
import { DayDetails } from './DayDetails';
import { CURRENT_DATE } from '../utils/constants';

interface TodayStatsProps {
  entries: FoodEntry[];
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
}

export function TodayStats({ entries, onAddEntry, onDeleteEntry }: TodayStatsProps) {
  return (
    <DayDetails
      date={CURRENT_DATE}
      entries={entries}
      onAddEntry={onAddEntry}
      onDeleteEntry={onDeleteEntry}
      title="Today's Detailed Stats"
      description="Complete breakdown of your meals"
    />
  );
}