import React, { useMemo } from 'react';
import { Activity, TrendingUp, Users } from 'lucide-react';
import { useDishes } from '../hooks/useDishes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminAnalytics = () => {
  const { dishes, activities, isLoading } = useDishes();

  const { topDishes, categoryData, totalCooks } = useMemo(() => {
    if (!dishes) return { topDishes: [], categoryData: [], totalCooks: 0 };
    
    // Top Dishes by usage count
    const sorted = [...dishes].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 5);
    const top = sorted.map(d => ({ name: d.dishName, cooks: d.usageCount || 0 }));
    
    // Total overall cooks
    const total = dishes.reduce((acc, d) => acc + (d.usageCount || 0), 0);
    
    // Category Distribution
    const catMap = dishes.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});
    const cats = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    return { topDishes: top, categoryData: cats, totalCooks: total };
  }, [dishes]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time system performance and usage statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Total Activity Logs</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{activities?.length || 0}</p>
          <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Live WebSockets Active
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 text-brand-purple rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-700">Total Dishes Cooked</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{totalCooks}</p>
          <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Across all users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Top 5 Most Cooked Dishes</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDishes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} tickFormatter={(val) => val.length > 10 ? val.substring(0,10)+'...' : val} />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="cooks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Dishes by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
