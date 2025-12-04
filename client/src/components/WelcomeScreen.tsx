import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const { updateDailyGoals } = useNutrition();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });

  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    const res = await login(username, password);
    if (!res.ok) {
      setError(res.message || 'Invalid credentials');
      return;
    }
    onComplete();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    const res = await register(username, password);
    if (!res.ok) {
      setError(res.message || 'Unable to create account');
      return;
    }
    updateDailyGoals(goals);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-gray-800 mb-4">
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-700">
            {mode === 'login' 
              ? 'Log in to track your nutrition' 
              : "Let's set up your account and nutrition goals"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-3xl p-8 shadow-xl">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-white text-red-500 p-2 rounded">{error}</div>
              )}
              <div>
                <label className="block text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-red-500 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setMode('signup')}
                className="w-full py-4 bg-white text-red-500 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
              >
                Create Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="bg-white text-red-500 p-2 rounded">{error}</div>
              )}
              <div>
                <label className="block text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                  placeholder="Choose a password"
                />
              </div>

              <div className="border-t-2 border-white border-opacity-30 pt-4">
                <h3 className="text-white mb-4">Daily Nutrition Goals</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">
                      Daily Calorie Goal
                    </label>
                    <input
                      type="number"
                      value={goals.calories}
                      onChange={(e) => setGoals({ ...goals, calories: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                      placeholder="2000"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">
                      Protein Goal (g)
                    </label>
                    <input
                      type="number"
                      value={goals.protein}
                      onChange={(e) => setGoals({ ...goals, protein: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">
                      Carbs Goal (g)
                    </label>
                    <input
                      type="number"
                      value={goals.carbs}
                      onChange={(e) => setGoals({ ...goals, carbs: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                      placeholder="200"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">
                      Fats Goal (g)
                    </label>
                    <input
                      type="number"
                      value={goals.fats}
                      onChange={(e) => setGoals({ ...goals, fats: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-white bg-white bg-opacity-90 focus:outline-none focus:bg-opacity-100 transition-all"
                      placeholder="65"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-red-500 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-4 bg-white text-red-500 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};