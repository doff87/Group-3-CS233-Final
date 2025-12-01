import React, { useState } from 'react';
import { NutritionProvider } from './context/NutritionContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { WeeklyOverview } from './components/WeeklyOverview';
import { Calendar } from './components/Calendar';
import { LayoutDashboard, CalendarDays, BarChart3, LogOut } from 'lucide-react';

type Screen = 'welcome' | 'dashboard' | 'weekly' | 'calendar';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const handleSignOut = () => {
    setCurrentScreen('welcome');
  };

  if (currentScreen === 'welcome') {
    return <WelcomeScreen onComplete={() => setCurrentScreen('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-red-400 to-red-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-500">🍎</span>
              </div>
              <h1 className="text-white">Foodie</h1>
            </div>

            <nav className="flex gap-2">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  currentScreen === 'dashboard'
                    ? 'bg-white text-red-500'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentScreen('weekly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  currentScreen === 'weekly'
                    ? 'bg-white text-red-500'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <BarChart3 size={20} />
                <span className="hidden sm:inline">Weekly</span>
              </button>
              <button
                onClick={() => setCurrentScreen('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  currentScreen === 'calendar'
                    ? 'bg-white text-red-500'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <CalendarDays size={20} />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </nav>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:bg-white hover:bg-opacity-20 transition-all"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {currentScreen === 'dashboard' && <Dashboard />}
        {currentScreen === 'weekly' && <WeeklyOverview />}
        {currentScreen === 'calendar' && <Calendar />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <NutritionProvider>
      <AppContent />
    </NutritionProvider>
  );
}