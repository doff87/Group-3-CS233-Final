import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Search } from 'lucide-react';
import { FoodEntry } from '../App';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CURRENT_DATE } from '../utils/constants';

interface AddFoodDialogProps {
  date?: string;
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
}

// Mock database foods for demonstration
const mockDatabaseFoods = [
  { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fats: 1.8 },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { name: 'Greek Yogurt (Plain)', calories: 100, protein: 17, carbs: 6, fats: 0.4 },
  { name: 'Salmon Fillet', calories: 280, protein: 40, carbs: 0, fats: 13 },
  { name: 'Avocado', calories: 240, protein: 3, carbs: 13, fats: 22 },
  { name: 'Oatmeal (1 cup)', calories: 150, protein: 5, carbs: 27, fats: 3 },
  { name: 'Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fats: 10 },
  { name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fats: 0.1 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 4, carbs: 11, fats: 0.6 },
];

export function AddFoodDialog({ date = CURRENT_DATE, onAddEntry }: AddFoodDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  // Filter database foods based on search query
  const filteredFoods = mockDatabaseFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDatabaseSelect = (food: typeof mockDatabaseFoods[0]) => {
    onAddEntry({
      date,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
    });
    
    setSearchQuery('');
    setOpen(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddEntry({
      date,
      name: formData.name,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fats: Number(formData.fats),
    });

    // Reset form
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition-colors">
        <Plus className="h-4 w-4 mr-2" />
        Add Food
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Food Entry</DialogTitle>
          <DialogDescription>
            Log a new food item for {date}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="database">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="database" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Food</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for food..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredFoods.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchQuery ? 'No foods found. Try a different search.' : 'Start typing to search foods...'}
                </p>
              ) : (
                filteredFoods.map((food) => (
                  <button
                    key={food.name}
                    type="button"
                    onClick={() => handleDatabaseSelect(food)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-gray-900">{food.name}</span>
                      <span className="text-emerald-600">{food.calories} kcal</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>F: {food.fats}g</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="manual" className="mt-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Food Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Add Entry
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}