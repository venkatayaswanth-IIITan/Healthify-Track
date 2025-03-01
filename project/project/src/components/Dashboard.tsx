import React, { useState, useEffect } from 'react';
import { Activity, Award, Target, Zap } from 'lucide-react';

const Dashboard = () => {
  const [healthData, setHealthData] = useState({
    steps: 0,
    calories: 0,
    points: 0,
    activeGoals: 0
  });

  // Simulate fetching data
  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockData = {
      steps: Math.floor(Math.random() * 8000) + 2000,
      calories: Math.floor(Math.random() * 500) + 500,
      points: Math.floor(Math.random() * 200) + 50,
      activeGoals: Math.floor(Math.random() * 3) + 1
    };
    
    setHealthData(mockData);
  }, []);

  // Calculate step progress
  const stepGoal = 10000;
  const stepProgress = Math.min((healthData.steps / stepGoal) * 100, 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
        <h2 className="text-xl font-semibold">Welcome back!</h2>
        <p className="mt-2 opacity-90">You're making great progress on your health journey.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-sm text-gray-500">Steps Today</span>
          <span className="text-xl font-bold">{healthData.steps.toLocaleString()}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <Zap className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-sm text-gray-500">Calories Burned</span>
          <span className="text-xl font-bold">{healthData.calories}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-purple-100 rounded-full mb-2">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-sm text-gray-500">Reward Points</span>
          <span className="text-xl font-bold">{healthData.points}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-orange-100 rounded-full mb-2">
            <Target className="h-6 w-6 text-orange-600" />
          </div>
          <span className="text-sm text-gray-500">Active Goals</span>
          <span className="text-xl font-bold">{healthData.activeGoals}</span>
        </div>
      </div>
      
      {/* Step Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-700">Daily Step Goal</h3>
          <span className="text-sm text-gray-500">{healthData.steps} / {stepGoal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${stepProgress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {stepProgress < 100 
            ? `${Math.round(stepProgress)}% of your daily goal` 
            : 'Daily goal completed! 🎉'}
        </p>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Completed "Drink 8 glasses of water" goal</p>
              <p className="text-xs text-gray-500">Today, 2:30 PM</p>
            </div>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full mr-3">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Earned 25 reward points</p>
              <p className="text-xs text-gray-500">Today, 11:45 AM</p>
            </div>
          </div>
          
          <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Walked 5,000 steps</p>
              <p className="text-xs text-gray-500">Yesterday, 6:20 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;