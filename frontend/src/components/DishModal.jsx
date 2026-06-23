import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useUpload } from '../hooks/useUpload';
import toast from 'react-hot-toast';

export default function DishModal({ isOpen, onClose, onSubmit, initialData }) {
  const { uploadFile, isUploading } = useUpload();
  const [formData, setFormData] = useState({
    dishName: '',
    category: '',
    imageUrl: '',
    isPublished: false,
    description: '',
    prepTime: '',
    ingredients: '',
    recipe: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dishName: initialData.dishName || '',
        category: initialData.category || '',
        imageUrl: initialData.imageUrl || '',
        isPublished: initialData.isPublished || false,
        description: initialData.description || '',
        prepTime: initialData.prepTime || '',
        ingredients: initialData.ingredients ? initialData.ingredients.join(', ') : '',
        recipe: initialData.recipe || ''
      });
    } else {
      setFormData({
        dishName: '',
        category: '',
        imageUrl: '',
        isPublished: false,
        description: '',
        prepTime: '',
        ingredients: '',
        recipe: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i)
    };
    onSubmit(submissionData);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const url = await uploadFile(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Dish' : 'Add New Dish'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dish Name *</label>
            <input 
              type="text" 
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
              value={formData.dishName}
              onChange={(e) => setFormData({...formData, dishName: e.target.value})}
              placeholder="e.g. Butter Chicken"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
            <input 
              type="text" 
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g. North Indian"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL or Upload *</label>
            <div className="flex gap-2">
              <input 
                type="url" 
                required
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
              />
              <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                {isUploading ? (
                  <span className="animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows="2"
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="A brief description of this dish..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                value={formData.prepTime}
                onChange={(e) => setFormData({...formData, prepTime: e.target.value})}
                placeholder="e.g. 45 mins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ingredients (comma separated)</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                placeholder="Chicken, Butter, Tomatoes..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recipe / Instructions (Markdown Supported)</label>
            <textarea 
              rows="6"
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors font-mono text-sm"
              value={formData.recipe}
              onChange={(e) => setFormData({...formData, recipe: e.target.value})}
              placeholder="## Step 1&#10;Marinate the chicken...&#10;## Step 2&#10;..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.isPublished}
                onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            <span className="text-sm font-medium text-slate-700">
              Publish immediately
            </span>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20 rounded-lg font-medium transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
