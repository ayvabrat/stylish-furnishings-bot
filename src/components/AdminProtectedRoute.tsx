
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
