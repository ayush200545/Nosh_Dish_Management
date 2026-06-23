import React, { useState } from 'react';
import { Users as UsersIcon, Shield, MoreVertical, Edit2, Ban, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@nosh.com', role: 'Admin', status: 'Active', joinDate: '2023-10-12' },
    { id: 2, name: 'Bob Jones', email: 'user@nosh.com', role: 'User', status: 'Active', joinDate: '2023-11-05' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@nosh.com', role: 'User', status: 'Inactive', joinDate: '2024-01-22' },
  ]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(`${u.name} is now ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    setActiveDropdown(null);
  };

  const changeRole = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'Admin' ? 'User' : 'Admin';
        toast.success(`${u.name} role changed to ${newRole}`);
        return { ...u, role: newRole };
      }
      return u;
    }));
    setActiveDropdown(null);
  };

  const deleteUser = (userId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success(`${name} deleted`);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" onClick={() => setActiveDropdown(null)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system access and roles</p>
        </div>
        <button className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-[#4435cc] transition-colors font-medium">
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                      ${user.role === 'Admin' ? 'bg-brand-purple' : 'bg-blue-500'}`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === 'Admin' ? <Shield className="w-4 h-4 text-brand-purple" /> : <UsersIcon className="w-4 h-4 text-slate-400" />}
                    <span className="font-medium text-slate-700">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{user.joinDate}</td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === user.id ? null : user.id);
                    }}
                    className="text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeDropdown === user.id && (
                    <div className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
                      <button 
                        onClick={(e) => { e.stopPropagation(); changeRole(user.id); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-brand-purple" />
                        Make {user.role === 'Admin' ? 'User' : 'Admin'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(user.id); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        {user.status === 'Active' ? <Ban className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                        {user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                      </button>
                      <div className="border-t border-slate-100"></div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteUser(user.id, user.name); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
