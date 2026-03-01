import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

/**
 * Wraps routes that require authentication and optionally a specific role.
 * @param {string[]} roles  - allowed roles e.g. ['ADMIN', 'LAB_ANALYST']
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
