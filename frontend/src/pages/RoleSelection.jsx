import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, BarChart3, ShieldCheck, User, Shield, CheckCircle2, LayoutGrid, ArrowRight, ChefHat } from 'lucide-react';

const RoleSelection = () => {
  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-[#f8f9fa] overflow-x-hidden font-sans relative">
      {/* Left Side: Hero Section */}
      <div className="xl:w-[40%] flex flex-col p-8 md:p-12 lg:p-16 relative bg-white shadow-[0_0_60px_rgba(0,0,0,0.03)] z-10 xl:rounded-r-[3rem] min-h-[100vh] xl:min-h-0">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Nosh</h1>
            <p className="text-xs font-semibold text-gray-500 tracking-wider">AI Cooking Robot</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 w-max mb-6">
          <Bot size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">AI Powered • Smart</span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-[1.15] tracking-tight relative z-20">
          Welcome to <br />
          <span className="text-green-500">Nosh</span>
        </h2>
        
        <p className="text-base text-gray-600 max-w-sm mb-6 leading-relaxed relative z-20">
          The AI-Powered Cooking Robot Platform that helps you discover, manage and analyze delicious dishes in real-time.
        </p>

        {/* Hero Image - Placed directly in document flow, no overlap */}
        <div className="w-full max-w-[320px] mx-auto my-6 relative pointer-events-none z-10">
          <img 
            src="/images/hero_robot_chef.png" 
            alt="Robot Chef" 
            className="w-full h-auto drop-shadow-xl mix-blend-multiply"
          />
        </div>

        {/* Feature Badges - Moved below the image */}
        <div className="grid grid-cols-2 gap-3 mt-auto max-w-sm mx-auto relative z-20 w-full">
          <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Bot className="text-green-500 mb-1" size={24} />
            <span className="text-[11px] font-bold text-gray-800">AI Powered</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Zap className="text-yellow-500 mb-1" size={24} />
            <span className="text-[11px] font-bold text-gray-800">Real Time</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <BarChart3 className="text-blue-500 mb-1" size={24} />
            <span className="text-[11px] font-bold text-gray-800">Analytics</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <ShieldCheck className="text-purple-500 mb-1" size={24} />
            <span className="text-[11px] font-bold text-gray-800">Secure</span>
          </div>
        </div>

      </div>

      {/* Right Side: Action Cards */}
      <div className="xl:w-[60%] flex flex-col justify-center items-center p-6 lg:p-12 relative min-h-screen xl:min-h-0">
        
        <div className="absolute top-6 right-6 z-20">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:-translate-y-0.5 transition-all">
            <Shield size={16} />
            About Nosh
          </button>
        </div>

        <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-8 relative z-10 w-full mb-24 mt-16 xl:mt-0">
          
          {/* User Card */}
          <div className="flex-1 bg-white rounded-[2rem] p-10 shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] border border-green-50 flex flex-col relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(34,197,94,0.25)] transition-all">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors"></div>
            
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-8 mx-auto group-hover:scale-110 transition-transform">
              <User size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Explore as <span className="text-green-500">User</span></h3>
            <p className="text-base text-gray-500 text-center mb-10">Discover amazing dishes, save favorites and get personalized recommendations.</p>
            
            <ul className="space-y-4 mb-12 flex-1">
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-green-500" size={22} /> Browse & search dishes
              </li>
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-green-500" size={22} /> Save your favorites
              </li>
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-green-500" size={22} /> Personalized suggestions
              </li>
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-green-500" size={22} /> Track order history
              </li>
            </ul>
            
            <Link to="/login" className="w-full mt-auto">
              <button className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/30 transition-all hover:shadow-green-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                Continue as User
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Admin Card */}
          <div className="flex-1 bg-white rounded-[2rem] p-10 shadow-[0_20px_40px_-15px_rgba(85,66,246,0.15)] border border-purple-50 flex flex-col relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(85,66,246,0.25)] transition-all">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
            
            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 mx-auto group-hover:scale-110 transition-transform shadow-inner">
              <Shield size={40} fill="currentColor" className="opacity-20 absolute" />
              <Shield size={36} className="relative z-10" />
            </div>
            
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Login as <span className="text-purple-600">Admin</span></h3>
            <p className="text-base text-gray-500 text-center mb-10">Manage dishes, users, categories and view smart analytics.</p>
            
            <ul className="space-y-4 mb-12 flex-1">
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-purple-600" size={22} /> Manage all dishes
              </li>
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-purple-600" size={22} /> Control publishing
              </li>
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-purple-600" size={22} /> View analytics & reports
              </li>
              <li className="flex items-center gap-4 text-base text-gray-700 font-medium">
                <CheckCircle2 className="text-purple-600" size={22} /> Manage users & categories
              </li>
            </ul>
            
            <Link to="/admin/login" className="w-full mt-auto">
              <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/30 transition-all hover:shadow-purple-600/40 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                Continue as Admin
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
        </div>

      </div>

      {/* Bottom Stats Bar - Fixed to bottom of screen instead of absolute to right container */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center w-full z-30 pointer-events-none px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center bg-white/90 backdrop-blur-xl px-6 md:px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 pointer-events-auto max-w-full overflow-x-auto">
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-green-100 text-green-600 p-2 rounded-xl">
              <LayoutGrid size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 leading-none">120+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Dishes</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 leading-none">10K+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Happy Users</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 leading-none">4.8★</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Average Rating</span>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-xl">
              <Bot size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 leading-none">AI</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Powered</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RoleSelection;
