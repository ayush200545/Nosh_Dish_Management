import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.imageUrl;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}
