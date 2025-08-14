import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RootRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, go to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users to their appropriate dashboard
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/customer-portal/dashboard" replace />;
  }
}