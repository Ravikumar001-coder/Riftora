import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { AuroraBackground } from '../../../components/ui/aurora-background';
import { Loader2 } from 'lucide-react';

const OrgRoleGuardLoadingState = () => (
  <AuroraBackground>
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-6" />
      <h2 className="text-xl font-bold text-white mb-2">Verifying organization access...</h2>
    </div>
  </AuroraBackground>
);

export function OrgRoleGuard({ children, allowedRoles = [], redirectTo = '/', requireOrgId = false }) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { orgId } = useParams();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsVerifying(false);
      setIsAuthorized(false);
      navigate(redirectTo, { replace: true });
      return;
    }

    if (requireOrgId && !orgId) {
      setIsVerifying(false);
      setIsAuthorized(false);
      navigate(redirectTo, { replace: true });
      return;
    }
    
    // Super Admin overrides everything
    if (user.platformRole === 'super_admin') {
      setIsAuthorized(true);
      setIsVerifying(false);
      return;
    }

    let hasRole = false;

    if (orgId && user.orgRoles) {
      const orgRoleObj = user.orgRoles.find(r => r.orgId === orgId);
      if (orgRoleObj && allowedRoles.includes(orgRoleObj.orgRole)) {
        hasRole = true;
      }
    } else if (!requireOrgId && user.orgRoles) {
      // If any of the user's org roles match the allowed roles
      hasRole = user.orgRoles.some(r => allowedRoles.includes(r.orgRole));
    }
    
    if (!hasRole) {
      setIsVerifying(false);
      setIsAuthorized(false);
      navigate(redirectTo, { replace: true });
    } else {
      setIsAuthorized(true);
      setIsVerifying(false);
    }
  }, [isAuthenticated, user, allowedRoles, redirectTo, navigate, orgId, requireOrgId]);

  if (isVerifying) return <OrgRoleGuardLoadingState />;
  if (!isAuthorized) return null;

  return <>{children}</>;
}
