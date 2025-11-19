import { useState } from 'react';
import { SignIn } from './components/SignIn';
import { Dashboard } from './components/Dashboard';
import { TodayStats } from './components/TodayStats';
import { PastEntries } from './components/PastEntries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Mock data for demonstration
export interface FoodEntry {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const mockEntries: FoodEntry[] = [
  // Today's entries
  { id: '1', date: '2025-11-17', name: 'Oatmeal with berries', calories: 320, protein: 10, carbs: 54, fats: 8 },
  { id: '2', date: '2025-11-17', name: 'Greek yogurt', calories: 150, protein: 15, carbs: 12, fats: 4 },
  { id: '3', date: '2025-11-17', name: 'Grilled chicken salad', calories: 420, protein: 35, carbs: 18, fats: 22 },
  { id: '4', date: '2025-11-17', name: 'Apple with almond butter', calories: 180, protein: 4, carbs: 22, fats: 9 },
  
  // This week
  { id: '5', date: '2025-11-13', name: 'Scrambled eggs', calories: 280, protein: 18, carbs: 4, fats: 20 },
  { id: '6', date: '2025-11-13', name: 'Turkey sandwich', calories: 450, protein: 28, carbs: 48, fats: 15 },
  { id: '7', date: '2025-11-13', name: 'Salmon with rice', calories: 580, protein: 42, carbs: 52, fats: 18 },
  
  { id: '8', date: '2025-11-12', name: 'Protein shake', calories: 220, protein: 25, carbs: 18, fats: 5 },
  { id: '9', date: '2025-11-12', name: 'Chicken wrap', calories: 480, protein: 32, carbs: 42, fats: 18 },
  { id: '10', date: '2025-11-12', name: 'Pasta with vegetables', calories: 520, protein: 16, carbs: 68, fats: 18 },
  
  { id: '11', date: '2025-11-11', name: 'Avocado toast', calories: 340, protein: 12, carbs: 38, fats: 16 },
  { id: '12', date: '2025-11-11', name: 'Beef burrito bowl', calories: 620, protein: 38, carbs: 58, fats: 24 },
  { id: '13', date: '2025-11-11', name: 'Grilled fish with veggies', calories: 380, protein: 40, carbs: 22, fats: 14 },
];

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [entries, setEntries] = useState<FoodEntry[]>(mockEntries);
  const [activeTab, setActiveTab] = useState('dashboard');

  const addEntry = (entry: Omit<FoodEntry, 'id'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries([...entries, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  if (!isSignedIn) {
    return <SignIn onSignIn={() => setIsSignedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-emerald-600">Foodie</h1>
            <p className="text-gray-500 text-sm">Your Personal Food Journal</p>
          </div>
          <button
            onClick={() => setIsSignedIn(false)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard entries={entries} onAddEntry={addEntry} />
          </TabsContent>

          <TabsContent value="today" className="mt-6">
            <TodayStats entries={entries} onAddEntry={addEntry} onDeleteEntry={deleteEntry} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <PastEntries 
              entries={entries} 
              onAddEntry={addEntry} 
              onDeleteEntry={deleteEntry}
              onSwitchToToday={() => setActiveTab('today')}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}