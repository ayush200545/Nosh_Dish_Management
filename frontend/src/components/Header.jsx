import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useUser } from '../hooks/useUserHook';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useDishes } from '../hooks/useDishes';
import { toast } from 'react-hot-toast';

export default function Header() {
  const { user } = useUser();
  const { logout } = useAuth();
  const { activities } = useDishes();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-[#1e293b] border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search dishes... (Press Enter)" 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                window.location.href = `/admin/dishes?search=${encodeURIComponent(e.target.value.trim())}`;
              }
            }}
            className="pl-10 pr-4 py-2 border border-slate-700 rounded-full bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 text-sm transition-all placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer group" onClick={() => {
          // Reset notifications logic could go here
          toast('Notifications center coming soon!', { icon: '🔔' });
        }}>
          <button className="relative text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            {activities && activities.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                {activities.length > 9 ? '9+' : activities.length}
              </span>
            )}
          </button>
        </div>
        
        <div className="relative">
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 border-l border-slate-700 pl-6 cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden border border-green-500">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 ml-1"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          
          {showDropdown && (
            <div className="absolute top-14 right-0 bg-[#0f172a] shadow-xl rounded-lg border border-slate-700 py-2 min-w-[160px] z-50 animate-in slide-in-from-top-2 duration-200">
               <div className="px-4 py-2 border-b border-slate-700/50 mb-1">
                 <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                 <p className="text-xs text-slate-400 truncate">{user?.email}</p>
               </div>
               <Link to="/admin/settings" onClick={() => setShowDropdown(false)} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white block">⚙️ Settings</Link>
               <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300">🚪 Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
