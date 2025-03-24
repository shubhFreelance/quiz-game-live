import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../stores/authContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (user.role !== 'agent') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;