import React, { useState, useEffect } from 'react';
import { Check, Plus, Target, Trash2 } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  category: 'fitness' | 'nutrition' | 'wellness' | 'other';
  points: number;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    title: '',
    description: '',
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    completed: false,
    category: 'fitness',
    points: 50
  });

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('healthGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Set some example goals if none exist
      const exampleGoals: Goal[] = [
        {
          id: 1,
          title: 'Daily Steps',
          description: 'Walk 10,000 steps every day',
          target: 10000,
          current: 7500,
          unit: 'steps',
          deadline: '2025-12-31',
          completed: false,
          category: 'fitness',
          points: 100
        },
        {
          id: 2,
          title: 'Drink Water',
          description: 'Drink 8 glasses of water daily',
          target: 8,
          current: 5,
          unit: 'glasses',
          deadline: '2025-12-31',
          completed: false,
          category: 'nutrition',
          points: 50
        },
        {
          id: 3,
          title: 'Meditation',
          description: 'Meditate for 10 minutes daily',
          target: 10,
          current: 10,
          unit: 'minutes',
          deadline: '2025-12-31',
          completed: true,
          category: 'wellness',
          points: 75
        }
      ];
      setGoals(exampleGoals);
      localStorage.setItem('healthGoals', JSON.stringify(exampleGoals));
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('healthGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: Goal = {
        ...newGoal,
        id: Date.now()
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        target: 0,
        current: 0,
        unit: '',
        deadline: '',
        completed: false,
        category: 'fitness',
        points: 50
      });
      setShowAddGoal(false);
    }
  };

  const handleUpdateProgress = (id: number, newCurrent: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const updated = { 
          ...goal, 
          current: newCurrent,
          completed: newCurrent >= goal.target
        };
        
        // If goal was just completed, update points in localStorage
        if (updated.completed && !goal.completed) {
          const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
          localStorage.setItem('rewardPoints', (currentPoints + goal.points).toString());
        }
        
        return updated;
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'wellness': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Health Goals</h1>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Goal
        </button>
      </div>

      {/* Goal List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No goals yet</h3>
            <p className="text-gray-500 mt-1">Create your first health goal to get started</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className={`bg-white rounded-xl shadow-sm p-5 ${goal.completed ? 'border-l-4 border-green-500' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-gray-800">{goal.title}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                    {goal.completed && (
                      <span className="ml-2 flex items-center text-green-600 text-sm">
                        <Check className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{goal.description}</p>
                  
                  {goal.deadline && (
                    <p className="text-sm text-gray-500 mt-1">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium text-purple-600">
                      {goal.points} points
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Progress: {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${goal.completed ? 'bg-green-600' : 'bg-blue-600'} h-2.5 rounded-full`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {!goal.completed && (
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Update progress:</span>
                  <input
                    type="number"
                    min="0"
                    max={goal.target}
                    value={goal.current}
                    onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="ml-1 text-sm text-gray-600">{goal.unit}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Goal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Daily Steps"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Describe your goal"
                  rows={2}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input
                    type="number"
                    min="1"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., steps, glasses"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="wellness">Wellness</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Points</label>
                <input
                  type="number"
                  min="1"
                  value={newGoal.points}
                  onChange={(e) => setNewGoal({...newGoal, points: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowAddGoal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;