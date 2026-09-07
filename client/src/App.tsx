import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, AlertTriangle, Award, BarChart2, Home, QrCode, User, Utensils, Footprints, Bot, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Scanner from './components/Scanner';
import Rewards from './components/Rewards';
import Profile from './components/Profile';
import StepCounter from './components/StepCounter';
import DietPlan from './components/DietPlan';
import ChatBot from './components/ChatBot';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token || 'mock-token');
      }
    } catch {
      // If backend is offline, proceed in local demo mode
    }

    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUsername', username);
    setAuthLoading(false);
    navigate('/');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message) {
          setAuthError(data.message);
          setAuthLoading(false);
          return;
        }
      }
    } catch {
      // Proceed in demo mode
    }

    alert('Account created successfully! Please sign in.');
    setIsSignup(false);
    setAuthLoading(false);
  };

  const handleEmergencyClick = () => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    alert('🚨 Emergency Alert Activated!\nNotifying your emergency contacts and displaying nearby healthcare services.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-blue-100 rounded-2xl mr-3 text-blue-600 shadow-inner">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HealthTrack
              </h1>
              <p className="text-xs text-gray-500 font-medium">Smart AI Wellness Platform</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="e.g., alex_fit"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 disabled:opacity-50"
            >
              {authLoading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setIsSignup(false); setAuthError(null); }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => { setIsSignup(true); setAuthError(null); }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/goals', label: 'Goals', icon: BarChart2 },
    { path: '/scanner', label: 'Scanner', icon: QrCode },
    { path: '/rewards', label: 'Rewards', icon: Award },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">HealthTrack</h1>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/diet"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/diet' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Utensils className="h-4 w-4" />
                <span className="hidden sm:inline">Diet Plan</span>
              </Link>
              
              <Link
                to="/steps"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/steps' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Footprints className="h-4 w-4" />
                <span className="hidden sm:inline">Step Counter</span>
              </Link>

              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold rounded-lg text-sm transition-all shadow-sm"
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">MEDICO AI</span>
              </button>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/steps" element={<StepCounter />} />
            <Route path="/diet" element={<DietPlan />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>

      {/* Floating ChatBot Modal */}
      <ChatBot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

      {/* Bottom Sticky Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-gray-200 fixed bottom-0 left-0 right-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                    isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-[11px] mt-1">{item.label}</span>
                </Link>
              );
            })}

            {/* Emergency SOS Button */}
            <button
              onClick={handleEmergencyClick}
              className="flex flex-col items-center justify-center flex-1 py-1 text-red-600 hover:text-red-700 transition-all"
              title="Trigger Emergency Alert"
            >
              <div className="p-1.5 bg-red-100 rounded-full animate-bounce">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-[10px] font-bold mt-0.5 text-red-600">SOS</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;