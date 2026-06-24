import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import toast from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Request Interceptor
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor for Global Error Handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the backend is reachable
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status } = error.response;
    
    if (status === 401) {
      // Auto-logout if token is expired or unauthorized
      if (sessionStorage.getItem('token')) {
        toast.error('Your session has expired. Please login again.');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        window.location.href = '/';
      }
    } else if (status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (status >= 500) {
      toast.error('An unexpected server error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
