import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Lock, Eye, EyeOff, Mail, ArrowRight, LayoutDashboard, LineChart as ChartIcon, FileText, Database, ChefHat } from 'lucide-react';

const AdminLogin = () => {
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
      
      if (role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      login(access_token, role);
      toast.success('Admin authentication successful');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f0b1e] font-sans relative overflow-x-hidden">
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <img src="/images/admin_dark_bg.png" alt="Dark Space Background" className="w-full h-full object-cover mix-blend-screen" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Left Side: System Preview & Branding */}
      <div className="lg:w-[55%] p-8 lg:p-16 relative flex flex-col min-h-[50vh] lg:min-h-screen z-10 border-r border-white/5">
        
        <Link to="/" className="flex items-center gap-3 z-20 w-max mb-6 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-500/50">
            <ChefHat size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Nosh Admin</h1>
            <p className="text-[10px] font-semibold text-purple-300 tracking-widest uppercase">System Control</p>
          </div>
        </Link>
        
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-max text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>

        {/* Mock Dashboard UI */}
        <div className="w-full max-w-2xl bg-[#130f26]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
              <p className="text-gray-400 text-xs font-semibold mb-1">Total Dishes</p>
              <h3 className="text-white text-3xl font-bold mb-2 tracking-tight">120</h3>
              <p className="text-green-400 text-xs flex items-center gap-1 font-medium">
                <div className="w-2 h-2 rounded-sm bg-green-500/20 flex items-center justify-center text-[8px]">✦</div> +12 this week
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
              <p className="text-gray-400 text-xs font-semibold mb-1">Published</p>
              <h3 className="text-white text-3xl font-bold mb-2 tracking-tight">87</h3>
              <p className="text-blue-400 text-xs flex items-center gap-1 font-medium">
                <div className="w-2 h-2 rounded-sm bg-blue-500/20 flex items-center justify-center text-[8px]">✦</div> +7.25%
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
              <p className="text-gray-400 text-xs font-semibold mb-1">Users</p>
              <h3 className="text-white text-3xl font-bold mb-2 tracking-tight">10,000</h3>
              <p className="text-purple-400 text-xs flex items-center gap-1 font-medium">
                <div className="w-2 h-2 rounded-sm bg-purple-500/20 flex items-center justify-center text-[8px]">✦</div> +230 this week
              </p>
            </div>
          </div>

          {/* Chart Mockup */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6 shadow-inner relative">
            <p className="text-white text-sm font-bold mb-6">Dishes Overview</p>
            <div className="h-32 w-full flex items-end justify-between relative px-2">
              <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between z-0">
                <div className="border-b border-white/5 w-full h-0"></div>
                <div className="border-b border-white/5 w-full h-0"></div>
                <div className="border-b border-white/5 w-full h-0"></div>
                <div className="border-b border-white/5 w-full h-0"></div>
              </div>
              {/* Fake Line Chart SVGs */}
              <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none">
                <path d="M0,80 Q50,40 100,70 T200,30 T300,50 T400,20 T500,40" fill="none" stroke="#00e676" strokeWidth="3" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,230,118,0.3))' }} />
                <path d="M0,100 Q50,90 100,110 T200,80 T300,100 T400,60 T500,90" fill="none" stroke="#9d4edd" strokeWidth="3" style={{ filter: 'drop-shadow(0px 4px 6px rgba(157,78,221,0.3))' }} />
                
                {/* Dots */}
                <circle cx="100" cy="70" r="4" fill="#130f26" stroke="#00e676" strokeWidth="2" />
                <circle cx="200" cy="30" r="4" fill="#130f26" stroke="#00e676" strokeWidth="2" />
                <circle cx="300" cy="50" r="4" fill="#130f26" stroke="#00e676" strokeWidth="2" />
                <circle cx="400" cy="20" r="4" fill="#00e676" />
                
                <circle cx="100" cy="110" r="4" fill="#130f26" stroke="#9d4edd" strokeWidth="2" />
                <circle cx="200" cy="80" r="4" fill="#130f26" stroke="#9d4edd" strokeWidth="2" />
                <circle cx="300" cy="100" r="4" fill="#130f26" stroke="#9d4edd" strokeWidth="2" />
                <circle cx="400" cy="60" r="4" fill="#9d4edd" />
              </svg>
              {/* X axis labels */}
              <div className="absolute -bottom-6 w-full flex justify-between text-[9px] text-gray-500 font-medium px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-6 text-[10px] text-gray-400 font-medium">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></div> Published</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#9d4edd] shadow-[0_0_8px_#9d4edd]"></div> Unpublished</span>
            </div>
          </div>

          {/* Recent Activity Mockup */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner w-full sm:w-[60%] lg:w-[65%]">
            <p className="text-white text-sm font-bold mb-4">Recent Activity</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=100&q=80" alt="Butter Chicken" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-300 text-xs font-medium">Butter Chicken <span className="text-gray-500">published</span></span>
                </div>
                <span className="text-gray-500 text-[10px]">2m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&q=80" alt="Paneer Tikka" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-300 text-xs font-medium">Paneer Tikka <span className="text-gray-500">reviewed</span></span>
                </div>
                <span className="text-gray-500 text-[10px]">10m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shadow-sm">
                    <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&q=80" alt="Biryani" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-300 text-xs font-medium">Biryani <span className="text-gray-500">added</span></span>
                </div>
                <span className="text-gray-500 text-[10px]">20m ago</span>
              </div>
            </div>
          </div>

          {/* Steak / Food Overlay Image on Dashboard */}
          <div className="hidden sm:block absolute -bottom-16 -right-16 w-80 h-80 z-20 pointer-events-none drop-shadow-2xl">
            <img src="https://images.unsplash.com/photo-1544025162-8111f4a56b6a?w=400&q=80" alt="Steak Overlay" className="w-full h-full object-cover rounded-full border-4 border-[#130f26] shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} />
          </div>

        </div>

      </div>

      {/* Right Side: Admin Login Form */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 lg:p-12 z-10 relative">
        <div className="w-full max-w-[440px] bg-[#0c081e]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_80px_rgba(79,57,246,0.15)] border border-white/5 relative overflow-hidden transition-all hover:bg-[#0c081e]/80 hover:border-white/10">
          
          {/* Subtle top border highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4f39f6]/50 to-transparent"></div>

          <div className="flex flex-col items-center text-center mb-10 relative">
            {/* Glowing Lock Icon */}
            <div className="w-20 h-20 mb-6 relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-[#4f39f6] rounded-full blur-[20px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="w-16 h-16 bg-[#161033] border-2 border-[#4f39f6]/40 rounded-3xl flex items-center justify-center text-[#9d4edd] shadow-[inset_0_0_20px_rgba(79,57,246,0.2)] relative z-10 transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
                <Lock size={28} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>
            
            <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">Admin Portal</h2>
            <p className="text-gray-400 text-sm font-medium">Secure access to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#9d4edd] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-black/30 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#4f39f6]/50 focus:border-[#4f39f6] outline-none transition-all placeholder:text-gray-600 font-medium shadow-inner hover:bg-black/40"
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#9d4edd] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-black/30 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#4f39f6]/50 focus:border-[#4f39f6] outline-none transition-all placeholder:text-gray-600 font-medium shadow-inner hover:bg-black/40"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-[#4f39f6] focus:ring-[#4f39f6] border-white/20 bg-black/50 rounded cursor-pointer transition-colors" />
                <label htmlFor="remember-me" className="ml-3 block text-gray-400 cursor-pointer font-medium hover:text-gray-300 transition-colors">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-semibold text-[#9d4edd] hover:text-[#b876f1] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 mt-4 rounded-2xl shadow-[0_10px_30px_rgba(79,57,246,0.3)] text-md font-bold text-white bg-gradient-to-r from-[#5942f6] to-[#8d40f5] hover:from-[#4a34d6] hover:to-[#7633d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f39f6] focus:ring-offset-[#0c081e] disabled:opacity-50 transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(79,57,246,0.4)] group"
            >
              {isLoading ? 'Authenticating...' : (
                <span className="flex items-center gap-2">Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              )}
            </button>
            
          </form>

          {/* Bottom Security Badges */}
          <div className="mt-12 grid grid-cols-4 gap-2 pt-6 border-t border-white/5">
             <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  <ChartIcon size={14} />
                </div>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Real-Time<br/>Monitoring</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  <LayoutDashboard size={14} />
                </div>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Analytics<br/>& Reports</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  <Database size={14} />
                </div>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Dish<br/>Management</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  <Shield size={14} />
                </div>
                <span className="text-[9px] text-gray-500 font-medium leading-tight">Secure &<br/>Reliable</span>
             </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-4 right-8 z-10">
        <p className="text-[10px] text-gray-600 font-medium">© 2026 Nosh. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
