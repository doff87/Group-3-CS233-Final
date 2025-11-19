import { FoodEntry } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Calendar, TrendingUp, Utensils, Plus, PieChartIcon } from 'lucide-react';
import { AddFoodDialog } from './AddFoodDialog';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DASHBOARD_DATE, DAILY_CALORIE_GOAL } from '../utils/constants';
import { calculateTotals, createPieData, filterEntriesByDate, filterEntriesByDateRange } from '../utils/nutrition';

interface DashboardProps {
  entries: FoodEntry[];
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
}

export function Dashboard({ entries, onAddEntry }: DashboardProps) {
  const today = DASHBOARD_DATE;
  const dailyGoal = DAILY_CALORIE_GOAL;

  // Calculate today's totals
  const todayEntries = filterEntriesByDate(entries, today);
  const todayTotals = calculateTotals(todayEntries);

  // Calculate weekly totals
  const weekStart = new Date('2025-11-08');
  const weekEnd = new Date('2025-11-14');
  const weeklyEntries = filterEntriesByDateRange(entries, weekStart, weekEnd);
  const weeklyTotals = calculateTotals(weeklyEntries);
  const weeklyAverage = Math.round(weeklyTotals.calories / 7);

  // Prepare pie chart data for weekly breakdown
  const weeklyPieData = createPieData(weeklyTotals);

  const progressPercentage = Math.min((todayTotals.calories / dailyGoal) * 100, 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-500">Here's your nutrition overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Summary */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <CardTitle>Today's Summary</CardTitle>
              </div>
              <CardDescription>Friday, November 14, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Calories</span>
                  <span className="text-emerald-600">{todayTotals.calories} / {dailyGoal} kcal</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Protein</div>
                  <div className="text-emerald-600">{todayTotals.protein}g</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Carbs</div>
                  <div className="text-emerald-600">{todayTotals.carbs}g</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Fats</div>
                  <div className="text-emerald-600">{todayTotals.fats}g</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Utensils className="h-4 w-4" />
                  <span>{todayEntries.length} meals logged today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <CardTitle>Weekly Overview</CardTitle>
              </div>
              <CardDescription>Nov 8 - Nov 14, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Calories</span>
                  <span className="text-emerald-600">{weeklyTotals.calories.toLocaleString()} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Average</span>
                  <span className="text-emerald-600">{weeklyAverage.toLocaleString()} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Meals</span>
                  <span className="text-emerald-600">{weeklyEntries.length} logged</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Food Card */}
        <div className="lg:col-span-1">
          <Card className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                <CardTitle>Quick Add</CardTitle>
              </div>
              <CardDescription>Log a food item for today</CardDescription>
            </CardHeader>
            <CardContent>
              <AddFoodDialog onAddEntry={onAddEntry} />
            </CardContent>
          </Card>

          {/* Weekly Macro Breakdown */}
          <Card className="border-emerald-200 mt-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-emerald-600" />
                <CardTitle>Weekly Macros</CardTitle>
              </div>
              <CardDescription>Total macro breakdown for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                {/* Pie Chart */}
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={weeklyPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {weeklyPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Calories */}
                <div className="text-center">
                  <div className="text-gray-500 text-sm">Total Calories</div>
                  <div className="text-emerald-600">{weeklyTotals.calories.toLocaleString()} kcal</div>
                </div>

                {/* Legend */}
                <div className="space-y-2 w-full">
                  {weeklyPieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm">{item.grams}g</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}