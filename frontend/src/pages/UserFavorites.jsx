import React from 'react';
import { Heart } from 'lucide-react';
import { useDishes } from '../hooks/useDishes';
import { useFavorites } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';

const UserFavorites = () => {
  const { dishes, isLoading } = useDishes();
  const { favorites, toggleFavorite } = useFavorites();

  if (isLoading) return <div className="p-8">Loading favorites...</div>;

  const favoriteDishes = (dishes || []).filter(dish => favorites.includes(dish.dishId) && dish.isPublished);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" /> My Favorites
        </h1>
        <p className="text-slate-500 mt-2">Your personalized collection of loved dishes</p>
      </div>

      {favoriteDishes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
           <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-700">No favorites yet</h3>
           <p className="text-slate-500 mt-2 mb-6">Start exploring dishes and click the heart icon to save them here.</p>
           <Link to="/dishes" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
             Browse Dishes
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteDishes.map((dish) => (
            <div key={dish.dishId} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 group relative">
              <div className="aspect-[4/3] relative">
                <img 
                  src={dish.imageUrl} 
                  alt={dish.dishName}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => toggleFavorite(dish.dishId)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 text-lg mb-1">{dish.dishName}</h3>
                <p className="text-sm text-slate-500">{dish.category || 'Uncategorized'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
