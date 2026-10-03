import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

export function AuthGuard({ children, requireAuth = true, redirectTo = '/auth/login' }) {
  const { isAuthenticated, accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Self-healing: If authenticated but no token is present, force logout
    if (isAuthenticated && !accessToken) {
      logout();
      navigate(redirectTo, { state: { from: location.pathname }, replace: true });
      return;
    }

    // If route requires auth but user is not authenticated, redirect to login
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, { state: { from: location.pathname }, replace: true });
    }
    // If route is public-only (e.g., register/login) and user IS authenticated, redirect to dashboard
    else if (!requireAuth && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, requireAuth, navigate, location.pathname, redirectTo]);

  // Wait until we have decided if they can see the page or not
  if (requireAuth && !isAuthenticated) return null;
  if (!requireAuth && isAuthenticated) return null;

  return <>{children}</>;
}
