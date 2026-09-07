import React, { useState } from 'react';

interface FoodItem {
  name: string;
  calories: number;
  price: number;
  meal: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  protein: number;
}

interface DietPlanResult {
  plan: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    snack: FoodItem[];
    dinner: FoodItem[];
  };
  totalCalories: number;
  totalPrice: number;
  totalProtein: number;
}

function DietPlan() {
  const [budget, setBudget] = useState('500');
  const [currency, setCurrency] = useState('INR');
  const [calories, setCalories] = useState('2000');
  const [dietPlan, setDietPlan] = useState<DietPlanResult | null>(null);

  const generateDietPlan = () => {
    const suggestedPlan: DietPlanResult['plan'] = { breakfast: [], lunch: [], snack: [], dinner: [] };
    let totalCalories = 0;
    let totalPrice = 0;
    let totalProtein = 0;
    const budgetNum = parseFloat(budget);
    const caloriesNum = parseInt(calories);

    if (isNaN(budgetNum) || isNaN(caloriesNum) || budgetNum <= 0 || caloriesNum <= 0) {
      alert("Please enter valid positive numbers for budget and calories.");
      return;
    }

    const foodItems: FoodItem[] = [
      { name: 'Oatmeal (1 cup)', calories: 150, price: 40, meal: 'breakfast', protein: 5 },
      { name: 'Banana (1 whole)', calories: 105, price: 15, meal: 'breakfast', protein: 1.3 },
      { name: 'Eggs (2 boiled)', calories: 156, price: 20, meal: 'breakfast', protein: 12 },
      { name: 'Greek Yogurt (100g)', calories: 120, price: 50, meal: 'breakfast', protein: 10 },
      { name: 'Grilled Chicken Breast (150g)', calories: 250, price: 150, meal: 'lunch', protein: 45 },
      { name: 'Brown Rice (1 cup)', calories: 216, price: 30, meal: 'lunch', protein: 5 },
      { name: 'Steamed Broccoli (100g)', calories: 55, price: 30, meal: 'lunch', protein: 3 },
      { name: 'Mixed Fresh Salad', calories: 100, price: 50, meal: 'lunch', protein: 4 },
      { name: 'Apple (1 whole)', calories: 95, price: 30, meal: 'snack', protein: 0.5 },
      { name: 'Almonds (30g)', calories: 164, price: 60, meal: 'snack', protein: 6 },
      { name: 'Protein Shake (1 scoop)', calories: 130, price: 80, meal: 'snack', protein: 25 },
      { name: 'Lentil Soup / Dal (1 bowl)', calories: 230, price: 50, meal: 'dinner', protein: 18 },
      { name: 'Sautéed Spinach & Tofu', calories: 180, price: 70, meal: 'dinner', protein: 14 },
      { name: 'Whole Wheat Roti / Flatbread (2 pcs)', calories: 160, price: 20, meal: 'dinner', protein: 6 }
    ];

    // Sort by calorie per price efficiency
    foodItems.sort((a, b) => (b.calories / b.price) - (a.calories / a.price));

    for (const item of foodItems) {
      if (totalCalories + item.calories <= caloriesNum && totalPrice + item.price <= budgetNum) {
        suggestedPlan[item.meal].push(item);
        totalCalories += item.calories;
        totalPrice += item.price;
        totalProtein += item.protein;
      }
    }

    setDietPlan({ plan: suggestedPlan, totalCalories, totalPrice, totalProtein });
  };

  const mealKeys: (keyof DietPlanResult['plan'])[] = ['breakfast', 'lunch', 'snack', 'dinner'];

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800">Diet & Nutrition Planner</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate Personalized Meal Plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Daily Food Budget
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Budget limit"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-gray-50"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Target Daily Calories (kcal)
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g. 2000"
            />
          </div>
        </div>

        <button
          onClick={generateDietPlan}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md"
        >
          Generate Diet Plan
        </button>
      </div>

      {dietPlan && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Suggested Daily Meal Plan</h3>
            <div className="flex gap-3 text-xs font-semibold">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {dietPlan.totalCalories} kcal
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                {dietPlan.totalProtein.toFixed(1)}g Protein
              </span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                {currency} {dietPlan.totalPrice.toFixed(2)} Total Cost
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b">
                  <th className="p-3">Meal</th>
                  <th className="p-3">Included Items</th>
                  <th className="p-3">Calories</th>
                  <th className="p-3">Protein</th>
                  <th className="p-3">Cost ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mealKeys.map((meal) => {
                  const items = dietPlan.plan[meal];
                  if (!items || items.length === 0) return null;
                  const mealCals = items.reduce((s, i) => s + i.calories, 0);
                  const mealProt = items.reduce((s, i) => s + i.protein, 0);
                  const mealCost = items.reduce((s, i) => s + i.price, 0);

                  return (
                    <tr key={meal} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold capitalize text-gray-800">{meal}</td>
                      <td className="p-3">
                        {items.map((item, idx) => (
                          <span key={idx} className="inline-block bg-slate-100 text-slate-700 rounded-md px-2 py-0.5 text-xs mr-1.5 mb-1">
                            {item.name}
                          </span>
                        ))}
                      </td>
                      <td className="p-3 text-gray-700">{mealCals} kcal</td>
                      <td className="p-3 text-gray-700">{mealProt.toFixed(1)}g</td>
                      <td className="p-3 text-gray-700 font-medium">{mealCost.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-gray-900 border-t">
                  <td className="p-3">Totals</td>
                  <td className="p-3"></td>
                  <td className="p-3">{dietPlan.totalCalories} kcal</td>
                  <td className="p-3">{dietPlan.totalProtein.toFixed(1)}g</td>
                  <td className="p-3">{dietPlan.totalPrice.toFixed(2)} {currency}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietPlan;