import React, { useState } from 'react';
import { useDishes } from '../hooks/useDishes';
import { Link, useNavigate } from 'react-router-dom';
import { Dices, BellRing } from 'lucide-react';

const Home = () => {
  const { dishes, activities, isLoading } = useDishes();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);

  const publishedDishes = dishes?.filter(dish => dish.isPublished) || [];

  const handleSpinWheel = () => {
    if (publishedDishes.length === 0) return;
    setIsSpinning(true);
    
    // Fake a delay for the spin animation
    setTimeout(() => {
      const randomDish = publishedDishes[Math.floor(Math.random() * publishedDishes.length)];
      navigate(`/dishes/${randomDish.dishId}`);
    }, 1500);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Main Content (Dishes) */}
      <div className="flex-1 space-y-8">
        
        {/* Spin the Wheel Hero */}
        <div className="bg-gradient-to-r from-brand-purple to-[#5b48ec] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">Don't know what to eat?</h1>
            <p className="text-brand-purple-50 text-lg sm:text-xl font-medium max-w-lg mb-8">
              Let fate decide! Spin the wheel and we'll pick a delicious recipe for your next meal.
            </p>
            <button 
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="bg-white text-brand-purple hover:bg-slate-50 font-bold py-3 px-8 rounded-full shadow-lg shadow-black/10 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
            >
              <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>
          </div>
          <div className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full border-8 border-white/20 flex items-center justify-center bg-white/10 shadow-inner">
            <span className="text-5xl">🎡</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore All Dishes</h2>
          
          {publishedDishes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No dishes available</h3>
              <p className="text-gray-500">Check back later for new delicious recipes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedDishes.map((dish) => (
                <div key={dish.dishId} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"} 
                      alt={dish.dishName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-amber-500 shadow-sm flex items-center gap-1">
                      ⭐ {dish.reviews?.length ? (dish.reviews.reduce((a,r)=>a+r.rating,0)/dish.reviews.length).toFixed(1) : 'New'}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{dish.dishName}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {dish.description || 'A delicious culinary creation.'}
                    </p>
                    <Link to={`/dishes/${dish.dishId}`} className="block w-full bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-center">
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Live Social Feed) */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          <div className="bg-slate-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-brand-purple" />
              Live Activity
            </h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          
          <div className="p-5 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
            {activities && activities.length > 0 ? (
              activities.filter(a => ['Cooked', 'Reviewed'].includes(a.action)).slice(0, 15).map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0 text-brand-purple text-sm">
                    {activity.action === 'Cooked' ? '👨‍🍳' : '⭐'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 leading-tight">
                      <span className="font-semibold">{activity.user}</span> 
                      {' '}{activity.action === 'Cooked' ? 'just cooked' : 'reviewed'}{' '}
                      <span className="font-semibold text-brand-purple">{activity.dishName}</span>!
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-8">Waiting for activity...</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
