import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Award, BarChart2, Home, QrCode, User, Utensils } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Scanner from './components/Scanner';
import Rewards from './components/Rewards';
import Profile from './components/Profile';
import EmergencySOSButton from './components/EmergencySOSButton';
import StepCounter from './components/StepCounter';
import DietPlan from './components/DietPlan';
 // Import Chatbot

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const [showChatbot, setShowChatbot] = useState(false);

    const handleLogin = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (username && password) {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/');
        }
    };

    const handleSignup = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (username && password) {
            alert('Signup successful! Please login.');
            setIsSignup(false);
        }
    };

    const handleEmergencyClick = () => {
        alert('Emergency button clicked! (Implement your emergency action)');
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                    <div className="flex items-center justify-center mb-8">
                        <Activity className="h-12 w-12 text-blue-600 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-800">HealthTrack</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </h2>
                    <form onSubmit={isSignup ? handleSignup : handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input type="text" id="username" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                            {isSignup ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {isSignup ? (
                            <>
                                Already have an account? <button onClick={() => setIsSignup(false)} className="text-blue-600 hover:underline">Sign in</button>
                            </>
                        ) : (
                            <>
                                Don't have an account? <button onClick={() => setIsSignup(true)} className="text-blue-600 hover:underline">Sign up</button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-#2d59eO flex flex-col">
            <header className="bg-blue-500 text-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 text-white">
                        <div className="flex items-center text-ehite">
                            <Activity className="h-8 w-8 text-white" />
                            <h1 className="ml-2 text-xl font-bold text-white">HealthTrack</h1>
                        </div>
                        <div className="flex items-center">
                            <Link to="/diet" className="flex flex-col items-center py-2 px-4 text-white rounded-full hover:border hover:border-white ">
                                <Utensils className="h-6 w-6" />
                                <span className="text-xs mt-1">Diet</span>
                            </Link>
                            <Link to="/steps" className="flex flex-col items-center py-2 px-4 text-white rounded-full hover:border hover:border-white border-5px">
                             <Activity className="h-6 w-6" />
                               <span className="text-xs mt-1">Steps</span>
                             </Link>
                            <button onClick={() => { setIsLoggedIn(false); localStorage.removeItem('isLoggedIn'); navigate('/login'); }} className="ml-4 px-3 py-1 bg-white text-sm text-black hover:bg-white rounded-md">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/scanner" element={<Scanner />} />
                        <Route path="/rewards" element={<Rewards />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/steps" element={<StepCounter />} />
                        <Route path="/diet" element={<DietPlan />} />
                        <Route path="/login" element={<App />} />
                    </Routes>
                </div>
            </main>
            <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between">
                        <Link to="/" className="flex flex-col items-center py-3 px-4 bg-blue-600 text-white hover:text-blue-600 rounded-full">
                            <Home className="h-6 w-6" />
                            <span className="text-xs mt-1">Home</span>
                        </Link>
                        <Link to="/goals" className="flex flex-col items-center py-3 px-4 bg-blue-600 text-white hover:text-blue-600 rounded-full">
                            <BarChart2 className="h-6 w-6" />
                            <span className="text-xs mt-1">Goals</span>
                        </Link>
                        <Link to="/scanner" className="flex flex-col items-center py-3 px-3 bg-blue-600 text-white hover:text-blue-600 rounded-full">
                            <QrCode className="h-6 w-6" />
                            <span className="text-xs mt-1">Scanner</span>
                        </Link>
                        <button onClick={handleEmergencyClick} className="pt-2 pb-2 px-3 text-red-600 border-red-500 rounded-full hover:border-red-500">
                            <div className="flex flex-col items-center">
                                <AlertTriangle className="h-6 w-6" />
                                <span className="text-xs mt-1">Emergency</span>
                            </div>
                        </button>
                        <Link to="/rewards" className="flex flex-col items-center py-3 px-3.5 bg-blue-600 text-white hover:text-blue-600 rounded-full">
                            <Award className="h-6 w-6" />
                            <span className="text-xs mt-1">Rewards</span>
                        </Link>
                        <Link to="/profile" className="flex flex-col items-center py-3 px-3 bg-blue-600 text-white hover:text-blue-600 rounded-full">
                            <User className="h-6 w-6" />
                            <span className="text-xs mt-1">Profile</span>
                        </Link>
                        <button onClick={() => setShowChatbot(!showChatbot)} className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-full">
                            Chatbot
                        </button>
                    </div>
                </div>
            </nav>
            {showChatbot && (
                <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-lg z-50">
                    <input type='button' id='btn'><a href='chatbot.html' target='blank'/></input>
                </div>
            )}
        </div>

        
    );
}

export default App;