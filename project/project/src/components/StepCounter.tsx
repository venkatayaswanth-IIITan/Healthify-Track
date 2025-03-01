import React, { useState, useEffect } from 'react';
import { Activity, Calendar, TrendingUp, Award } from 'lucide-react';

interface DailySteps {
  date: string;
  steps: number;
  goal: number;
}

const StepCounter = () => {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [stepHistory, setStepHistory] = useState<DailySteps[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  // Load step data from localStorage
  useEffect(() => {
    const savedSteps = localStorage.getItem('currentSteps');
    if (savedSteps) {
      setCurrentSteps(parseInt(savedSteps));
    }

    const savedGoal = localStorage.getItem('stepGoal');
    if (savedGoal) {
      setStepGoal(parseInt(savedGoal));
    }

    const savedHistory = localStorage.getItem('stepHistory');
    if (savedHistory) {
      setStepHistory(JSON.parse(savedHistory));
    } else {
      // Generate mock history data if none exists
      const mockHistory = generateMockStepHistory();
      setStepHistory(mockHistory);
      localStorage.setItem('stepHistory', JSON.stringify(mockHistory));
    }

    const trackingStatus = localStorage.getItem('isTrackingSteps');
    setIsTracking(trackingStatus === 'true');
  }, []);

  // Save step data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentSteps', currentSteps.toString());
    localStorage.setItem('stepGoal', stepGoal.toString());
    localStorage.setItem('stepHistory', JSON.stringify(stepHistory));
    localStorage.setItem('isTrackingSteps', isTracking.toString());
  }, [currentSteps, stepGoal, stepHistory, isTracking]);

  // Calculate weekly average
  useEffect(() => {
    if (stepHistory.length > 0) {
      const lastSevenDays = stepHistory.slice(0, 7);
      const sum = lastSevenDays.reduce((total, day) => total + day.steps, 0);
      setWeeklyAverage(Math.round(sum / lastSevenDays.length));
    }
  }, [stepHistory]);

  // Simulate step tracking
  useEffect(() => {
    let interval: number | null = null;
    
    if (isTracking) {
      interval = window.setInterval(() => {
        // Simulate random step increase (1-5 steps)
        const stepIncrease = Math.floor(Math.random() * 5) + 1;
        setCurrentSteps(prev => prev + stepIncrease);
      }, 2000); // Update every 2 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  // Check if goal is reached and award points
  useEffect(() => {
    if (currentSteps >= stepGoal) {
      // Check if we already awarded points today
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = stepHistory.find(day => day.date === today);
      
      if (todayRecord && todayRecord.steps < stepGoal) {
        // Award points for reaching the goal
        const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
        const pointsToAward = 50; // Points for reaching daily step goal
        localStorage.setItem('rewardPoints', (currentPoints + pointsToAward).toString());
        
        // Update today's record
        updateTodaySteps();
      }
    }
  }, [currentSteps, stepGoal]);

  // Generate mock step history data
  const generateMockStepHistory = (): DailySteps[] => {
    const history: DailySteps[] = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const steps = Math.floor(Math.random() * 5000) + 5000; // Random steps between 5000-10000
      
      history.push({
        date: date.toISOString().split('T')[0],
        steps,
        goal: 10000
      });
    }
    
    return history;
  };

  // Update today's steps in history
  const updateTodaySteps = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHistory = [...stepHistory];
    const todayIndex = updatedHistory.findIndex(day => day.date === today);
    
    if (todayIndex >= 0) {
      updatedHistory[todayIndex] = {
        ...updatedHistory[todayIndex],
        steps: currentSteps
      };
    } else {
      updatedHistory.unshift({
        date: today,
        steps: currentSteps,
        goal: stepGoal
      });
    }
    
    setStepHistory(updatedHistory);
  };

  // Reset steps for a new day
  const resetSteps = () => {
    // Save yesterday's steps to history first
    updateTodaySteps();
    
    // Reset current steps
    setCurrentSteps(0);
  };

  // Toggle step tracking
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  // Calculate step progress percentage
  const stepProgress = Math.min((currentSteps / stepGoal) * 100, 100);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-800">Step Counter</h1>
      
      {/* Step Counter Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">{currentSteps.toLocaleString()}</span>
                <p className="text-gray-500 text-sm">of {stepGoal.toLocaleString()} steps</p>
              </div>
            </div>
            
            {/* Circular Progress */}
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#E5E7EB" 
                strokeWidth="8"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * stepProgress / 100)}
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <div className="flex space-x-2 mb-4">
            {stepProgress >= 100 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Award className="h-4 w-4 mr-1" />
                Goal Reached!
              </span>
            )}
            
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <TrendingUp className="h-4 w-4 mr-1" />
              {weeklyAverage.toLocaleString()} avg/day
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={toggleTracking}
              className={`px-4 py-2 rounded-lg font-medium ${
                isTracking 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </button>
            
            <button
              onClick={resetSteps}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Step Goal Adjustment */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Adjust Daily Step Goal</h2>
        
        <div className="flex items-center">
          <input
            type="range"
            min="1000"
            max="20000"
            step="500"
            value={stepGoal}
            onChange={(e) => setStepGoal(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>1,000</span>
          <span>5,000</span>
          <span>10,000</span>
          <span>15,000</span>
          <span>20,000</span>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Health Tip:</span> The recommended daily step count for adults is 10,000 steps, which is approximately 5 miles or 8 kilometers.
          </p>
        </div>
      </div>
      
      {/* Step History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Step History</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            Last 7 Days
          </div>
        </div>
        
        <div className="space-y-4">
          {stepHistory.slice(0, 7).map((day, index) => {
            const progress = Math.min((day.steps / day.goal) * 100, 100);
            const isToday = day.date === new Date().toISOString().split('T')[0];
            
            return (
              <div key={index} className={`p-3 rounded-lg ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <Activity className={`h-4 w-4 mr-2 ${isToday ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                      {isToday ? 'Today' : formatDate(day.date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {day.steps.toLocaleString()} / {day.goal.toLocaleString()}
                    </span>
                    {progress >= 100 && (
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepCounter;