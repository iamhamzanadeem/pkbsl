import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortal } from '@/contexts/PortalContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'customer_admin' | 'viewer';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { portalName, isAdminPortal, isCustomerPortal } = usePortal();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Improved portal access logic
  if (user && portalName && portalName !== 'login' && portalName !== 'unauthorized') {
    // For admin portal - check if user has admin role
    if (isAdminPortal && user.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // For customer portal - check if user has customer access
    if (isCustomerPortal && !['customer_admin', 'viewer'].includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // General portal access check - only apply if portal access is defined
    if (user.portalAccess && user.portalAccess.length > 0 && !user.portalAccess.includes(portalName)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check role requirements
  if (requiredRole && user) {
    const roleHierarchy = {
      admin: 3,
      customer_admin: 2,
      viewer: 1,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}