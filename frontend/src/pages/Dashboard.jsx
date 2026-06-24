import React from 'react';
import { useDishes } from '../hooks/useDishes';
import { FileText, CheckCircle, XCircle, Activity, Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function timeAgo(dateString) {
  if (!dateString) return 'just now';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' mins ago';
  return Math.floor(seconds) + ' secs ago';
}

export default function Dashboard() {
  const { dishes, isLoading, activities } = useDishes();

  if (isLoading) return <div className="p-8 text-gray-400">Loading dashboard...</div>;

  const totalDishes = dishes?.length || 0;
  const publishedDishes = (dishes || []).filter(d => d.isPublished).length || 0;
  const unpublishedDishes = totalDishes - publishedDishes;
  
  const totalUsers = 2; // Simulated total users
  
  // Data for Charts
  const pieData = [
    { name: 'Published', value: publishedDishes, color: '#22c55e' },
    { name: 'Unpublished', value: unpublishedDishes, color: '#f97316' }
  ];

  const categoryCounts = (dishes || []).reduce((acc, dish) => {
    const cat = dish.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">System analytics and reports</p>
        </div>
        <Link to="/admin/dishes" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20">
          <Plus className="w-4 h-4" /> Add New Dish
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between group hover:border-green-500/50 transition-colors">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Total Dishes</p>
            <h3 className="text-3xl font-bold text-white">{totalDishes}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between group hover:border-green-500/50 transition-colors">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Published</p>
            <h3 className="text-3xl font-bold text-white">{publishedDishes}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between group hover:border-green-500/50 transition-colors">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Unpublished</p>
            <h3 className="text-3xl font-bold text-white">{unpublishedDishes}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <XCircle className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between group hover:border-green-500/50 transition-colors">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-white">{totalUsers}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl p-6 min-h-[400px] flex flex-col">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            System Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-medium text-slate-400 mb-4">Publish Status</h4>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-medium text-slate-400 mb-4">Dishes by Category</h4>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => {
                        const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
                        return <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-xl p-6 flex flex-col max-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white">Recent Activity</h3>
            <button className="text-green-500 text-sm font-medium hover:underline">View all</button>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {activities?.length > 0 ? activities.slice(0, 10).map((activity, idx) => (
              <div key={idx} className="flex items-start justify-between pb-4 border-b border-slate-700 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-white">{activity.dishName}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{timeAgo(activity.timestamp)}</span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
