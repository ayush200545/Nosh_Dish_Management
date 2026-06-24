import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

export function useUser() {
  const queryClient = useQueryClient();

  const getHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const url = `${API_URL}/api/v1/users/me?t=${new Date().getTime()}`;
      console.log("Fetching user from:", url);
      const response = await axios.get(url, { headers: getHeaders() });
      return response.data;
    },
    retry: false
  });

  const updateUser = useMutation({
    mutationFn: async (userData) => {
      const response = await axios.put(`${API_URL}/api/v1/users/me`, userData, { headers: getHeaders() });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', 'me'], updatedUser);
      toast.success('Profile updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    }
  });

  return { user, isLoading, updateUser };
}
