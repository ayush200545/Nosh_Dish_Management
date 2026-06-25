import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import RoleSelection from './pages/RoleSelection';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Dishes from './pages/Dishes';

// New Functional Mock Pages
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminLiveSupport from './pages/AdminLiveSupport';
import Settings from './pages/Settings';
import UserCategories from './pages/UserCategories';
import DishDetail from './pages/DishDetail';
import UserFavorites from './pages/UserFavorites';

// Layouts
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

import UserRegister from './pages/UserRegister';

function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={isAuthenticated && role === 'user' ? <Navigate to="/home" replace /> : <UserLogin />} />
      <Route path="/register" element={isAuthenticated && role === 'user' ? <Navigate to="/home" replace /> : <UserRegister />} />
      <Route path="/admin/login" element={isAuthenticated && role === 'admin' ? <Navigate to="/admin" replace /> : <AdminLogin />} />

      {/* User Protected Routes */}
      <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/dishes/:dishId" element={<DishDetail />} />
          <Route path="/categories" element={<UserCategories />} />
          <Route path="/favorites" element={<UserFavorites />} />
          <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dishes" element={<Dishes />} />
          <Route path="dishes/:dishId" element={<DishDetail />} />
          <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="support" element={<AdminLiveSupport />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallbacks */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
