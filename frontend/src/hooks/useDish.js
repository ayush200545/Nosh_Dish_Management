import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

export function useDish(dishId) {
  const queryClient = useQueryClient();

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: dish, isLoading, error } = useQuery({
    queryKey: ['dish', dishId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/dishes/${dishId}`);
      return response.data;
    },
    enabled: !!dishId
  });

  const addReview = useMutation({
    mutationFn: async (reviewData) => {
      const response = await axios.post(`${API_URL}/api/v1/dishes/${dishId}/reviews`, reviewData, { headers: getHeaders() });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['dish', dishId], (oldDish) => {
        if (!oldDish) return oldDish;
        return {
          ...oldDish,
          reviews: [...(oldDish.reviews || []), data.review]
        };
      });
      toast.success('Review added successfully');
    },
    onError: () => toast.error('Failed to add review')
  });

  const cookDish = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_URL}/api/v1/dishes/${dishId}/cook`, {}, { headers: getHeaders() });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['dish', dishId], (oldDish) => {
        if (!oldDish) return oldDish;
        return { ...oldDish, usageCount: data.usageCount };
      });
      queryClient.setQueryData(['user', 'me'], (oldUser) => {
        if (!oldUser) return oldUser;
        return { ...oldUser, cookedDishes: data.cookedDishes || [...(oldUser.cookedDishes || []), dishId] };
      });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] }); // Refresh user profile to get new points/badges/cookedDishes
      toast.success("Marked as cooked!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to mark as cooked');
    }
  });

  return {
    dish,
    isLoading,
    error,
    addReview,
    cookDish
  };
}
