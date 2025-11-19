import { FoodEntry } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Trash2, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { AddFoodDialog } from './AddFoodDialog';
import { calculateTotals, createPieData, filterEntriesByDate } from '../utils/nutrition';

interface DayDetailsProps {
  date: string;
  entries: FoodEntry[];
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  onBack?: () => void;
  title?: string;
  description?: string;
}

export function DayDetails({ 
  date, 
  entries, 
  onAddEntry, 
  onDeleteEntry, 
  onBack,
  title,
  description 
}: DayDetailsProps) {
  // Filter entries for this specific date
  const dayEntries = filterEntriesByDate(entries, date);

  // Calculate totals
  const totals = calculateTotals(dayEntries);

  // Prepare pie chart data
  const pieData = createPieData(totals);

  return (
    <div className="space-y-6">
      {/* Back button (if provided) */}
      {onBack && (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calendar
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">{title || date}</h2>
        {description && <p className="text-gray-500">{description}</p>}
      </div>

      {/* Macro Summary */}
      <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
        <CardHeader>
          <CardTitle>Nutritional Breakdown</CardTitle>
          <CardDescription>Total macros for this day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Pie Chart */}
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              <div className="text-center md:text-left mb-4">
                <div className="text-gray-500 text-sm">Total Calories</div>
                <div className="text-emerald-600">{totals.calories} kcal</div>
              </div>
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.grams}g</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Foods Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Foods Eaten</CardTitle>
            <CardDescription>All items logged for this day</CardDescription>
          </div>
          <AddFoodDialog date={date} onAddEntry={onAddEntry} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Name</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
                <TableHead className="text-right">Fats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell className="text-right">{entry.calories} kcal</TableCell>
                  <TableCell className="text-right">{entry.protein}g</TableCell>
                  <TableCell className="text-right">{entry.carbs}g</TableCell>
                  <TableCell className="text-right">{entry.fats}g</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-emerald-50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right text-emerald-600">{totals.calories} kcal</TableCell>
                <TableCell className="text-right text-emerald-600">{totals.protein}g</TableCell>
                <TableCell className="text-right text-emerald-600">{totals.carbs}g</TableCell>
                <TableCell className="text-right text-emerald-600">{totals.fats}g</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}