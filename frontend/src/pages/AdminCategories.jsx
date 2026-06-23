import React from 'react';
import { useDishes } from '../hooks/useDishes';

const AdminCategories = () => {
  const { dishes, isLoading } = useDishes();

  if (isLoading) return <div className="p-8">Loading categories...</div>;

  const categoryStats = (dishes || []).reduce((acc, dish) => {
    const cat = dish.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = { name: cat, total: 0, published: 0, unpublished: 0, image: dish.imageUrl || '' };
    }
    if (!acc[cat].image && dish.imageUrl) {
      acc[cat].image = dish.imageUrl;
    }
    acc[cat].total++;
    if (dish.isPublished) acc[cat].published++;
    else acc[cat].unpublished++;
    return acc;
  }, {});

  const categories = Object.values(categoryStats).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categories Management</h1>
          <p className="text-slate-400 text-sm mt-1">Visually manage your dishes across {categories.length} categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="group relative h-48 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-brand-purple/50 transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-in-out opacity-60 mix-blend-overlay" />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col h-full justify-between p-5 text-white">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg group-hover:text-brand-purple transition-colors">{cat.name}</h3>
                <span className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 font-bold px-3 py-1 rounded-lg text-sm shadow-sm text-slate-200">
                  {cat.total} Total
                </span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <div className="flex-1 bg-green-500/20 border border-green-500/30 backdrop-blur-md rounded-lg p-2 text-center">
                  <div className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Published</div>
                  <div className="text-xl font-bold text-green-300">{cat.published}</div>
                </div>
                <div className="flex-1 bg-orange-500/20 border border-orange-500/30 backdrop-blur-md rounded-lg p-2 text-center">
                  <div className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">Hidden</div>
                  <div className="text-xl font-bold text-orange-300">{cat.unpublished}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-800/50 rounded-xl border border-slate-700">
            No categories found. Start by adding some dishes!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
