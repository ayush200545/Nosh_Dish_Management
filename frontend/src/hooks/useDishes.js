import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL, WS_URL } from '../config';
import toast from 'react-hot-toast';

export function useDishes() {
  const queryClient = useQueryClient();

  const { data: dishes, isLoading: isDishesLoading, error: dishesError } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/dishes`);
      return response.data;
    }
  });

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/api/v1/activities`);
      return response.data;
    }
  });

  const toggleDishStatus = useMutation({
    mutationFn: async ({ dishId, isPublished }) => {
      await axios.patch(`${API_URL}/api/v1/dishes/${dishId}/toggle`, { isPublished }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    },
    onSuccess: () => toast.success('Dish status updated'),
    onError: () => toast.error('Failed to update dish status')
  });

  const addDish = useMutation({
    mutationFn: async (dishData) => {
      const response = await axios.post(`${API_URL}/api/v1/dishes`, dishData);
      return response.data;
    },
    onSuccess: () => toast.success('Dish added successfully'),
    onError: () => toast.error('Failed to add dish')
  });

  const updateDish = useMutation({
    mutationFn: async ({ dishId, dishData }) => {
      const response = await axios.put(`${API_URL}/api/v1/dishes/${dishId}`, dishData);
      return response.data;
    },
    onSuccess: () => toast.success('Dish updated successfully'),
    onError: () => toast.error('Failed to update dish')
  });

  const deleteDish = useMutation({
    mutationFn: async (dishId) => {
      await axios.delete(`${API_URL}/api/v1/dishes/${dishId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    },
    onSuccess: () => toast.success('Dish deleted successfully'),
    onError: () => toast.error('Failed to delete dish')
  });

  useEffect(() => {
    let ws;
    let reconnectTimeout;

    const connectWebSocket = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => console.log('WebSocket Connected');

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'DISH_UPDATED' || data.type === 'DISH_CREATED' || data.type === 'DISH_DELETED') {
          queryClient.invalidateQueries({ queryKey: ['dishes'] });
        } else if (data.type === 'NEW_ACTIVITY') {
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        } else if (data.type === 'USER_ACHIEVEMENT') {
          toast.success(`🎉 Achievement Unlocked: ${data.badge}!`, {
            duration: 5000,
            icon: '🏆',
            style: {
              background: '#4f46e5',
              color: '#fff',
              fontWeight: 'bold'
            }
          });
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
      };

      ws.onerror = (error) => console.error('WebSocket Error:', error);
      
      ws.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting...');
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [queryClient]);

  return {
    dishes,
    activities: activities || [],
    isLoading: isDishesLoading,
    isActivitiesLoading,
    error: dishesError,
    toggleDishStatus,
    addDish,
    updateDish,
    deleteDish
  };
}
