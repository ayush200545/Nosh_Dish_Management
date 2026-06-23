import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Dishes', path: '/admin/dishes', icon: '🍲' },
    { name: 'Categories', path: '/admin/categories', icon: '📁' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Live Support', path: '/admin/support', icon: '🎧' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#1A114A] text-white flex flex-col min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#1A114A] font-bold text-xl">N</span>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none">Nosh</h2>
            <span className="text-[10px] text-gray-300 font-medium">Admin Panel</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white font-semibold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
        >
          <span className="text-xl">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
