import React from 'react';
import { useDishes } from '../hooks/useDishes';
import { Link } from 'react-router-dom';

const UserCategories = () => {
  const { dishes, isLoading } = useDishes();

  if (isLoading) return <div className="p-8">Loading categories...</div>;

  const categoryStats = (dishes || [])
    .filter(dish => dish.isPublished) // Users only see published dishes
    .reduce((acc, dish) => {
      const cat = dish.category || 'Uncategorized';
      if (!acc[cat]) {
        acc[cat] = { name: cat, total: 0, image: dish.imageUrl || '' };
      }
      if (!acc[cat].image && dish.imageUrl) {
        acc[cat].image = dish.imageUrl;
      }
      acc[cat].total++;
      return acc;
    }, {});

  const categories = Object.values(categoryStats).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Explore Cuisines</h1>
          <p className="text-slate-500 mt-2 text-lg">Travel the world from your kitchen with our diverse categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <Link 
            key={idx} 
            to={`/dishes?category=${encodeURIComponent(cat.name)}`}
            className="group relative h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col h-full justify-end p-6 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold mb-1 drop-shadow-md group-hover:text-green-400 transition-colors">{cat.name}</h3>
                  <div className="w-8 h-1 bg-green-500 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
                </div>
                <span className="bg-white/20 backdrop-blur-md border border-white/30 font-medium px-4 py-1.5 rounded-full text-sm shadow-sm whitespace-nowrap">
                  {cat.total} {cat.total === 1 ? 'Recipe' : 'Recipes'}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            No categories available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCategories;
