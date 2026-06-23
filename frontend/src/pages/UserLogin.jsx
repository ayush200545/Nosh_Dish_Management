import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, Bot, LayoutGrid, Star, ArrowRight, ChefHat } from 'lucide-react';

const UserLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, new URLSearchParams({
        username: email,
        password: password
      }));
      const { access_token, role } = response.data;
      login(access_token, role);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      
      {/* Left Side: Welcome Area */}
      <div className="lg:w-1/2 p-8 lg:p-16 relative z-10 flex flex-col min-h-screen bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)]">
        
        <Link to="/" className="flex items-center gap-3 z-20 w-max mb-12">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Nosh</h1>
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider">AI Cooking Robot</p>
          </div>
        </Link>

        <div className="relative z-20 mt-10">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Discover <span className="text-green-500">120+ Dishes</span>
          </h2>
          <div className="max-w-md">
            <p className="text-xl text-gray-800 font-bold mb-3">
              Prepared by the Nosh AI Cooking Robot
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              Explore recipes, save favorites, and experience intelligent cooking.
            </p>
          </div>
        </div>

        {/* Hero Food Image - Responsive, part of document flow or absolute on large screens */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] lg:h-[75%] z-0 pointer-events-none">
          <img src="/images/user_login_food.png" alt="Delicious Food Bowls" className="w-full h-full object-cover object-left-bottom opacity-90 mix-blend-multiply" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)' }} />
        </div>

        {/* Stats overlay */}
        <div className="mt-auto relative z-20 flex gap-4 max-w-md pb-8 overflow-x-auto snap-x">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white shadow-lg shrink-0 w-28 snap-center">
            <LayoutGrid className="text-green-500 mb-2" size={24} />
            <h4 className="text-xl font-bold text-gray-900">120+</h4>
            <p className="text-[9px] font-bold text-gray-500 uppercase">Dishes</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white shadow-lg shrink-0 w-28 snap-center">
            <User className="text-orange-500 mb-2" size={24} />
            <h4 className="text-xl font-bold text-gray-900">10K+</h4>
            <p className="text-[9px] font-bold text-gray-500 uppercase text-center leading-tight">Happy<br/>Users</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white shadow-lg shrink-0 w-28 snap-center">
            <Star className="text-blue-500 mb-2" size={24} />
            <h4 className="text-xl font-bold text-gray-900">4.8★</h4>
            <p className="text-[9px] font-bold text-gray-500 uppercase">Rating</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white shadow-lg shrink-0 w-28 snap-center">
            <Bot className="text-purple-500 mb-2" size={24} />
            <h4 className="text-xl font-bold text-gray-900">AI</h4>
            <p className="text-[9px] font-bold text-gray-500 uppercase">Powered</p>
          </div>
        </div>

      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        
        {/* Abstract background shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative z-10">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 group transition-all hover:bg-green-100">
              <User size={32} className="group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">User Login</h2>
            <p className="text-gray-500 text-sm font-medium">Sign in to continue to Nosh</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between text-sm py-1">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-3 block text-gray-600 cursor-pointer font-medium">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 mt-4 rounded-2xl shadow-[0_10px_20px_rgba(34,197,94,0.2)] text-md font-bold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all hover:-translate-y-1"
            >
              {isLoading ? 'Authenticating...' : (
                <span className="flex items-center gap-2">Sign In <ArrowRight size={18} /></span>
              )}
            </button>
            
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
            </div>
          </div>

          <button className="mt-8 w-full flex items-center justify-center gap-3 py-4 px-4 border border-gray-200 rounded-2xl bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-600 font-medium">
            Don't have an account? <Link to="/register" className="font-bold text-green-600 hover:text-green-500 hover:underline">Create Account</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserLogin;
