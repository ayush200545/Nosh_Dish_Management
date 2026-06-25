import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, Bot, LayoutGrid, Star, ArrowRight, ChefHat, UserPlus } from 'lucide-react';

const UserRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
        role: "user"
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      
      {/* Left Side: Welcome Area */}
      <div className="lg:w-1/2 p-8 lg:p-16 relative z-10 flex flex-col min-h-screen bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)]">
        
        <Link to="/" className="flex items-center gap-3 z-20 w-max mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Nosh</h1>
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider">AI Cooking Robot</p>
          </div>
        </Link>
        
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 w-max text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>

        <div className="relative z-20 mt-10">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Join <span className="text-green-500">Nosh</span> Today
          </h2>
          <div className="max-w-md">
            <p className="text-xl text-gray-800 font-bold mb-3">
              Your intelligent cooking companion
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Create an account to explore 120+ recipes, save your favorites, and experience AI-powered cooking.
            </p>
          </div>
        </div>

        {/* Hero Food Image */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] lg:h-[75%] z-0 pointer-events-none">
          <img src="/images/user_login_food.png" alt="Delicious Food Bowls" className="w-full h-full object-cover object-left-bottom opacity-90 mix-blend-multiply" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)' }} />
        </div>

      </div>

      {/* Right Side: Register Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        
        {/* Abstract background shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 group transition-all hover:bg-green-100">
              <UserPlus size={32} className="group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 text-sm font-medium">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 font-medium"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 font-medium"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400 font-medium"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 mt-4 rounded-2xl shadow-[0_10px_20px_rgba(34,197,94,0.2)] text-md font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all hover:-translate-y-1"
            >
              {isLoading ? 'Creating Account...' : (
                <span className="flex items-center gap-2">Sign Up <ArrowRight size={18} /></span>
              )}
            </button>
            
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 font-medium">
            Already have an account? <Link to="/login" className="font-bold text-green-600 hover:text-green-500 hover:underline">Sign In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserRegister;
