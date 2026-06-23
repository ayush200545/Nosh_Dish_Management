import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDish } from '../hooks/useDish';
import { useUser } from '../hooks/useUserHook';
import { WS_BASE_URL } from '../config';
import { ChevronLeft, Clock, Users, Star, MessageSquare, ChefHat, Heart, Utensils } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

export default function DishDetail() {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const { dish, isLoading, error, addReview, cookDish } = useDish(dishId);
  const { user } = useUser();
  
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    let ws;
    if (dishId) {
      ws = new WebSocket(`${WS_BASE_URL}/api/v1/ws/viewing/${dishId}`);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'VIEWER_COUNT') {
            setViewers(data.count);
          }
        } catch (e) {}
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [dishId]);

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading amazing flavors...</div>;
  if (error || !dish) return <div className="p-8 text-center text-red-500">Dish not found!</div>;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    await addReview.mutateAsync({
      user: user?.name || 'Anonymous Gourmand',
      rating,
      comment: reviewText,
      date: new Date().toISOString()
    });
    setReviewText('');
    setRating(5);
  };

  const handleCookDish = () => {
    cookDish.mutate();
  };

  const avgRating = dish.reviews && dish.reviews.length > 0 
    ? (dish.reviews.reduce((acc, rev) => acc + rev.rating, 0) / dish.reviews.length).toFixed(1)
    : 'New';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-brand-purple transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Dishes</span>
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-purple/5 border border-slate-100 flex flex-col md:flex-row">
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <img 
            src={dish.imageUrl} 
            alt={dish.dishName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-slate-800 shadow-lg flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            {avgRating}
          </div>
        </div>
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="inline-block px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-sm font-semibold mb-4 w-fit">
            {dish.category || 'Uncategorized'}
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">{dish.dishName}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            {dish.description || 'A delicious culinary creation that will tantalize your taste buds. Prepared with love and perfect for any occasion.'}
          </p>
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-5 h-5 text-brand-purple" />
              <span className="font-medium">{dish.prepTime || '30 mins'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{dish.usageCount || 0} Cooked This</span>
            </div>
          </div>
          
          <div className="mb-6 inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm font-semibold animate-pulse border border-red-100 w-fit">
            <span>🔥</span> {viewers} {viewers === 1 ? 'person is' : 'people are'} looking at this recipe right now!
          </div>

          <div className="flex gap-4">
            {user?.cookedDishes?.includes(dishId) ? (
              <button 
                disabled
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 opacity-90 cursor-default"
              >
                <ChefHat className="w-5 h-5" />
                You Cooked This!
              </button>
            ) : (
              <button 
                onClick={handleCookDish}
                disabled={cookDish.isLoading}
                className="flex-1 bg-brand-purple hover:bg-[#4435cc] text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
              >
                <ChefHat className="w-5 h-5" />
                {cookDish.isLoading ? 'Cooking...' : 'I Cooked This!'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Ingredients & Recipe */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Ingredients */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-brand-purple" />
              Ingredients
            </h2>
            {dish.ingredients && dish.ingredients.length > 0 ? (
              <ul className="grid sm:grid-cols-2 gap-4">
                {dish.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No ingredients listed yet.</p>
            )}
          </div>

          {/* Recipe Markdown */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm prose prose-slate max-w-none prose-headings:text-brand-purple prose-a:text-blue-600">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 not-prose">
              <ChefHat className="w-6 h-6 text-brand-purple" />
              Instructions
            </h2>
            {dish.recipe ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {dish.recipe}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-500 italic not-prose">The chef hasn't revealed the secret recipe yet.</p>
            )}
          </div>

        </div>

        {/* Right Column: Reviews */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-purple" />
              Reviews ({dish.reviews?.length || 0})
            </h2>

            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-700 mb-3 text-sm">Write a Review</h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`focus:outline-none transition-colors ${rating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-500' : ''}`} />
                  </button>
                ))}
              </div>
              <textarea
                required
                rows="3"
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple resize-none mb-3"
                placeholder="What did you think of this dish?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition-colors text-sm"
              >
                Submit Review
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {dish.reviews && dish.reviews.length > 0 ? (
                dish.reviews.slice().reverse().map((review, idx) => (
                  <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800 text-sm">{review.user}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic text-center py-4">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
