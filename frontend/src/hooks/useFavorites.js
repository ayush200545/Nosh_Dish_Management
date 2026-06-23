import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('nosh_favorites');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('nosh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (dishId) => {
    setFavorites(prev => {
      if (prev.includes(dishId)) {
        return prev.filter(id => id !== dishId);
      } else {
        return [...prev, dishId];
      }
    });
  };

  const isFavorite = (dishId) => favorites.includes(dishId);

  return { favorites, toggleFavorite, isFavorite };
}
