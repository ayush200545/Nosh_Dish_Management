import React, { useState } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUserHook';
import LiveChatWidget from './LiveChatWidget';

const UserNavbar = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const getInitials = (name) => {
    if (!name) return 'US';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-800 font-bold">N</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Nosh</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link to="/home" className="text-green-600 font-semibold">Home</Link>
        <Link to="/dishes" className="hover:text-green-600 transition-colors">Dishes</Link>
        <Link to="/categories" className="hover:text-green-600 transition-colors">Categories</Link>
        <Link to="/favorites" className="hover:text-green-600 transition-colors">My Favorites</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Search dishes... (Press Enter)" 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                window.location.href = `/dishes?search=${encodeURIComponent(e.target.value.trim())}`;
              }
            }}
            className="bg-gray-100 border-none rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                 {user?.profileImage ? (
                   <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-blue-800 font-bold text-sm">{getInitials(user?.name)}</span>
                 )}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            {showDropdown && (
              <div className="absolute top-14 right-0 bg-white shadow-xl rounded-xl border border-gray-100 py-2 min-w-[180px] flex flex-col z-50 animate-in slide-in-from-top-2 duration-200">
                 <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-slate-50/50">
                   <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                   <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
                   <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md w-fit">
                     ⭐ {user?.points || 0} Points
                   </div>
                   {user?.badges && user.badges.length > 0 && (
                     <div className="mt-2 flex flex-wrap gap-1">
                       {user.badges.map(badge => (
                         <span key={badge} className="text-[10px] bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{badge}</span>
                       ))}
                     </div>
                   )}
                 </div>
                 <Link to="/settings" onClick={() => setShowDropdown(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-purple/5 hover:text-brand-purple transition-colors font-medium flex items-center gap-2">⚙️ Settings</Link>
                 <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2">🚪 Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const UserLayout = () => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated || role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <UserNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8">
        <Outlet />
      </main>
      <LiveChatWidget />
    </div>
  );
};

export default UserLayout;
