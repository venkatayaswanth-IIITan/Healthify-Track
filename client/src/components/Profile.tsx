import React, { useState, useEffect } from 'react';
import { User, Settings, Award, BarChart2, Edit, Save, Camera } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  goalWeight: number;
  goalSteps: number;
  profileImage: string;
}


//
const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    age: 32,
    weight: 75,
    height: 175,
    gender: 'Male',
    goalWeight: 70,
    goalSteps: 10000,
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  });

  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [stats, setStats] = useState({
    totalPoints: 0,
    completedGoals: 0,
    totalSteps: 0,
    streakDays: 0
  });
  const [darkMode, setDarkMode] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setEditedProfile(JSON.parse(savedProfile));
    }

    // Load stats
    const points = parseInt(localStorage.getItem('rewardPoints') || '0');

    // Mock other stats
    setStats({
      totalPoints: points,
      completedGoals: Math.floor(Math.random() * 10) + 5,
      totalSteps: Math.floor(Math.random() * 100000) + 50000,
      streakDays: Math.floor(Math.random() * 10) + 3
    });

    // Load dark mode preference
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if(darkMode){
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setEditing(false);
  };

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());

    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  return (
    <div className={`space-y-6 pb-20 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Profile Header */}
      <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row items-center">
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>

            <div className="flex flex-wrap justify-center sm:justify-start mt-2 gap-2">
              <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                {profile.gender}
              </span>
              <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                {profile.age} years
              </span>
              <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                {stats.streakDays} day streak
              </span>
            </div>
          </div>

          <div className="ml-auto mt-4 sm:mt-0">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-purple-100 rounded-full mb-2">
            <Award className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-sm text-gray-500">Total Points</span>
          <span className="text-xl font-bold">{stats.totalPoints}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <BarChart2 className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm text-gray-500">Goals Completed</span>
          <span className="text-xl font-bold">{stats.completedGoals}</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-sm text-gray-500">BMI</span>
          <span className="text-xl font-bold">{calculateBMI()}</span>
          <span className={`text-xs ${getBMICategory().color}`}>
            {getBMICategory().category}
          </span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
          <div className="p-2 bg-orange-100 rounded-full mb-2">
            <Settings className="h-5 w-5 text-orange-600" />
          </div>
          <span className="text-sm text-gray-500">Total Steps</span>
          <span className="text-xl font-bold">{stats.totalSteps.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
        
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={editedProfile.gender}
                  onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={editedProfile.height}
                  onChange={(e) => setEditedProfile({...editedProfile, height: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  value={editedProfile.weight}
                  onChange={(e) => setEditedProfile({...editedProfile, weight: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Weight (kg)</label>
                <input
                  type="number"
                  value={editedProfile.goalWeight}
                  onChange={(e) => setEditedProfile({...editedProfile, goalWeight: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Step Goal</label>
                <input
                  type="number"
                  value={editedProfile.goalSteps}
                  onChange={(e) => setEditedProfile({...editedProfile, goalSteps: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{profile.age} years</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{profile.gender}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-medium">{profile.height} cm</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Weight</p>
                <p className="font-medium">{profile.weight} kg</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Goal Weight</p>
                <p className="font-medium">{profile.goalWeight} kg</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Daily Step Goal</p>
                <p className="font-medium">{profile.goalSteps.toLocaleString()} steps</p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                {profile.weight > profile.goalWeight 
                  ? `You're ${profile.weight - profile.goalWeight}kg away from your goal weight.`
                  : profile.weight < profile.goalWeight
                    ? `You're ${profile.goalWeight - profile.weight}kg below your goal weight.`
                    : `You've reached your goal weight!`}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* App Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">App Settings</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700">Push Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700">Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-500 mr-3" />
              <span className="text-gray-700">Use Metric System</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;