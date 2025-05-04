
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles && currentUser) {
    if (!allowedRoles.includes(currentUser.role)) {
      // User doesn't have permission, redirect to dashboard with notification
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
