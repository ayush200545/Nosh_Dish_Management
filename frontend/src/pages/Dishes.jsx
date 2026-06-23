import { useState } from 'react';
import { useDishes } from '../hooks/useDishes';
import { useFavorites } from '../hooks/useFavorites';
import { Search, Plus, Edit2, Trash2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import DishModal from '../components/DishModal';
import axios from 'axios';

export default function Dishes() {
  const { dishes, isLoading, toggleDishStatus, addDish, updateDish, deleteDish } = useDishes();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { role } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showAdminControls = role === 'admin' && isAdminRoute;
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // Extract query params for category filtering
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [prepTimeFilter, setPrepTimeFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  const handleOpenAddModal = () => {
    setEditingDish(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (editingDish) {
      await updateDish.mutateAsync({ dishId: editingDish.dishId, dishData: formData });
    } else {
      await addDish.mutateAsync(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (dishId) => {
    if (window.confirm('Are you sure you want to delete this dish? This action cannot be undone.')) {
      await deleteDish.mutateAsync(dishId);
    }
  };

  const handleDragStart = (e, index) => {
    if (!showAdminControls) return;
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (e, index) => {
    if (!showAdminControls) return;
    e.preventDefault();
  };

  const handleDrop = async (e, targetIndex) => {
    if (!showAdminControls || draggedItemIndex === null) return;
    e.preventDefault();
    
    // Create a new array and move the item
    const newDishesList = [...filteredDishes];
    const draggedItem = newDishesList[draggedItemIndex];
    newDishesList.splice(draggedItemIndex, 1);
    newDishesList.splice(targetIndex, 0, draggedItem);
    
    // Create the payload mapping dishId to new orderIndex
    const reorderPayload = newDishesList.map((dish, idx) => ({
      dishId: dish.dishId,
      orderIndex: idx
    }));
    
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/dishes/reorder`, reorderPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // The backend will broadcast a DISH_UPDATED event, triggering a refetch automatically!
    } catch (err) {
      console.error('Failed to reorder:', err);
    }
    setDraggedItemIndex(null);
  };

  if (isLoading) return <div className="p-8">Loading dishes...</div>;

  const filteredDishes = (dishes || []).filter(dish => {
    const searchStr = (searchTerm || '').toLowerCase();
    const dishName = (dish.dishName || '').toLowerCase();
    const category = (dish.category || '').toLowerCase();
    
    const matchesSearch = dishName.includes(searchStr) || category.includes(searchStr);
    
    // If it's a User route, ONLY show published dishes
    const isUserRoute = !isAdminRoute;
    if (isUserRoute && !dish.isPublished) return false;

    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Published' ? dish.isPublished : !dish.isPublished;
      
    const matchesCategoryParam = categoryParam ? dish.category === categoryParam : true;
      
    // Rating Filter
    const avgRating = dish.reviews?.length ? (dish.reviews.reduce((a,r)=>a+r.rating,0)/dish.reviews.length) : 0;
    const matchesRating = ratingFilter === 'All' 
      ? true 
      : ratingFilter === '4+' ? avgRating >= 4 : true;
      
    // Prep Time Filter
    let matchesPrep = true;
    if (prepTimeFilter !== 'All') {
      const timeStr = dish.prepTime?.toLowerCase() || '';
      const isUnder30 = timeStr.includes('15') || timeStr.includes('20') || timeStr.includes('25') || timeStr.includes('30');
      if (prepTimeFilter === 'Under 30') matchesPrep = isUnder30;
      if (prepTimeFilter === 'Over 30') matchesPrep = !isUnder30 && timeStr !== '';
    }
      
    return matchesSearch && matchesStatus && matchesCategoryParam && matchesRating && matchesPrep;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {categoryParam ? `${categoryParam} Dishes` : 'Dishes'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {showAdminControls ? 'Manage all dishes in your system' : 'Browse and favorite our delicious offerings'}
          </p>
        </div>
        {showAdminControls && (
          <button onClick={handleOpenAddModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Dish
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple text-sm w-64"
            />
          </div>
          
          <div className="flex gap-4">
            {showAdminControls && (
              <select 
                className="border border-slate-200 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:border-brand-purple"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            )}
            
            <select 
              className="border border-slate-200 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:border-brand-purple"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="4+">⭐ 4+ Stars</option>
            </select>
            
            <select 
              className="border border-slate-200 rounded-md px-4 py-2 bg-white text-sm focus:outline-none focus:border-brand-purple"
              value={prepTimeFilter}
              onChange={(e) => setPrepTimeFilter(e.target.value)}
            >
              <option value="All">Any Prep Time</option>
              <option value="Under 30">⚡ Under 30 mins</option>
              <option value="Over 30">🕒 Over 30 mins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Dish</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Dish ID</th>
                {showAdminControls ? (
                  <th className="p-4 font-medium text-right">Actions</th>
                ) : (
                  <th className="p-4 font-medium text-right">Favorite</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDishes?.map((dish, index) => (
                <tr 
                  key={dish.dishId || dish._id} 
                  className={`hover:bg-slate-50/50 transition-colors ${showAdminControls ? 'cursor-move' : ''}`}
                  draggable={showAdminControls}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <td className="p-4">
                    <Link to={showAdminControls ? `/admin/dishes/${dish.dishId || dish._id}` : `/dishes/${dish.dishId || dish._id}`} className="flex items-center gap-3 group cursor-pointer">
                      <img src={dish.imageUrl} alt={dish.dishName} className="w-10 h-10 rounded-md object-cover group-hover:opacity-80 transition-opacity" />
                      <span className="font-medium text-slate-800 group-hover:text-brand-purple transition-colors">{dish.dishName}</span>
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{dish.category || 'Uncategorized'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dish.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {dish.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{dish.dishId || dish._id}</td>
                  
                  {showAdminControls ? (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={dish.isPublished}
                            onChange={(e) => toggleDishStatus.mutate({ dishId: dish.dishId || dish._id, isPublished: e.target.checked })}
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                        <button onClick={() => handleOpenEditModal(dish)} className="text-slate-400 hover:text-blue-500 transition-colors p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(dish.dishId || dish._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleFavorite(dish.dishId)} 
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 inline-flex justify-end"
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(dish.dishId) ? 'text-red-500 fill-red-500' : ''}`} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {filteredDishes?.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No dishes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DishModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingDish}
      />
    </div>
  );
}
