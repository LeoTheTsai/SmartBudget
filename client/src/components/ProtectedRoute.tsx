import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or return a spinner

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
