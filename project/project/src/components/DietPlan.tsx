import React, { useState } from 'react';

function DietPlan() {
    const [budget, setBudget] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [calories, setCalories] = useState('');
    const [dietPlan, setDietPlan] = useState(null);

    const generateDietPlan = () => {
        let suggestedPlan = { breakfast: [], lunch: [], snack: [], dinner: [] };
        let totalCalories = 0;
        let totalPrice = 0;
        let totalProtein = 0;
        const budgetNum = parseFloat(budget);
        const caloriesNum = parseInt(calories);

        if (isNaN(budgetNum) || isNaN(caloriesNum)) {
            alert("Please enter valid numbers for budget and calories.");
            return;
        }

        const foodItems = [
            { name: 'Oatmeal', calories: 150, price: 120, meal: 'breakfast', protein: 5 },
            { name: 'Banana', calories: 105, price: 40, meal: 'breakfast', protein: 1.3 },
            { name: 'Chicken Breast (100g)', calories: 165, price: 250, meal: 'lunch', protein: 31 },
            { name: 'Broccoli (100g)', calories: 55, price: 80, meal: 'lunch', protein: 3 },
            { name: 'Apple', calories: 95, price: 60, meal: 'snack', protein: 0.5 },
            { name: 'Brown Rice (100g)', calories: 216, price: 100, meal: 'lunch', protein: 5 },
            { name: 'Egg', calories: 78, price: 25, meal: 'breakfast', protein: 6 },
            { name: 'Spinach (100g)', calories: 23, price: 70, meal: 'dinner', protein: 3 },
            { name: 'Almonds (30g)', calories: 164, price: 180, meal: 'snack', protein: 6 },
            { name: 'Yogurt (100g)', calories: 150, price: 150, meal: 'breakfast', protein: 9 },
            { name: 'Lentil Soup (1 cup)', calories: 230, price: 120, meal: 'dinner', protein: 18 },
            { name: 'Salad (mixed)', calories: 100, price: 150, meal: 'lunch', protein: 4 },
            { name: 'Protein Shake', calories: 120, price: 200, meal: 'snack', protein: 25 }
        ];

        // Sort food items by calorie density (calories per rupee) in descending order
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

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Diet Plan Generator</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <div className="flex">
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="mt-1 p-2 border rounded w-3/4"
                    />
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="mt-1 p-2 border rounded w-1/4 ml-2"
                    >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        {/* Add more currencies as needed */}
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Calories (kcal)</label>
                <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>

            <button
                onClick={generateDietPlan}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Generate Diet Plan
            </button>

            {dietPlan && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Suggested Diet Plan:</h3>

                    <table className="w-full border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 p-2">Meal</th>
                                <th className="border border-gray-400 p-2">Items</th>
                                <th className="border border-gray-400 p-2">Calories (kcal)</th>
                                <th className="border border-gray-400 p-2">Protein (g)</th>
                                <th className="border border-gray-400 p-2">Cost ({currency})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(dietPlan.plan).map((meal) => (
                                dietPlan.plan[meal].length > 0 && (
                                    <tr key={meal}>
                                        <td className="border border-gray-400 p-2 capitalize">{meal}</td>
                                        <td className="border border-gray-400 p-2">
                                            {dietPlan.plan[meal].map((item, index) => (
                                                <div key={index}>{item.name}</div>
                                            ))}
                                        </td>
                                        <td className="border border-gray-400 p-2">
                                            {dietPlan.plan[meal].reduce((sum, item) => sum + item.calories, 0)}
                                        </td>
                                        <td className="border border-gray-400 p-2">
                                            {dietPlan.plan[meal].reduce((sum, item) => sum + item.protein, 0)}
                                        </td>
                                        <td className="border border-gray-400 p-2">
                                            {dietPlan.plan[meal].reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            ))}
                            <tr>
                                <td className="border border-gray-400 p-2 font-semibold">Total</td>
                                <td className="border border-gray-400 p-2"></td>
                                <td className="border border-gray-400 p-2 font-semibold">{dietPlan.totalCalories}</td>
                                <td className="border border-gray-400 p-2 font-semibold">{dietPlan.totalProtein.toFixed(2)}</td>
                                <td className="border border-gray-400 p-2 font-semibold">{dietPlan.totalPrice.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DietPlan;