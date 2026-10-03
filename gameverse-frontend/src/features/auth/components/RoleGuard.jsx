import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Loader2 } from 'lucide-react';

const RoleGuardLoadingState = () => (
  <>
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-6" />
      <h2 className="text-xl font-bold text-white mb-2">Verifying access...</h2>
    </div>
  </>
);

export function RoleGuard({ children, allowedRoles = [], redirectTo = '/' }) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If not authenticated, let AuthGuard handle it or redirect to home if used standalone
    if (!isAuthenticated || !user) {
      setIsVerifying(false);
      setIsAuthorized(false);
      navigate(redirectTo, { replace: true });
      return;
    }

    const hasRole = user.roles && allowedRoles.some(role => user.roles.includes(role));
    
    if (!hasRole) {
      setIsVerifying(false);
      setIsAuthorized(false);
      navigate(redirectTo, { replace: true });
    } else {
      setIsAuthorized(true);
      setIsVerifying(false);
    }
  }, [isAuthenticated, user, allowedRoles, redirectTo, navigate]);

  if (isVerifying) return <RoleGuardLoadingState />;
  if (!isAuthorized) return null;

  return <>{children}</>;
}
