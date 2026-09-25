import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthGuard } from '../features/auth/components/AuthGuard';
import { useAuthStore } from '../store/authStore';
import { AuroraBackground } from '../components/ui/aurora-background';
import { Loader2, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const DashboardLoadingState = () => (
  <AuroraBackground>
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
      <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-10 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center text-center animate-pulse">
        <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150 mb-8" />
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-white mb-2">Preparing your workspace...</h2>
        <p className="text-slate-400 text-sm">Loading</p>
      </div>
    </div>
  </AuroraBackground>
);

const DashboardFallbackState = () => {
  return (
    <AuroraBackground>
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-10 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Unable to determine your workspace</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Your account is authenticated, but we couldn't determine which Riftora experience should be opened.
          </p>
          <Link
            to="/explore"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 text-center border border-blue-500"
          >
            Return to Explore
          </Link>
        </div>
      </div>
    </AuroraBackground>
  );
};

export function DashboardRouter() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.title = "Dashboard | Riftora";

    if (!isAuthenticated) return;

    if (!user) return;

    // Routing Decision Priority
    
    // 0. Super Admin
    if (user.roles?.includes('Super Admin')) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    // 1. Username incomplete
    if (!user.username) {
      navigate('/onboarding/username', { replace: true });
      return;
    }

    // 2. Path incomplete
    if (!user.onboarding_path) {
      navigate('/onboarding/path', { replace: true });
      return;
    }

    // 3. Organizer Onboarding incomplete
    if (user.onboarding_path === 'organizer' && (!user.onboarding_completed || !user.org_roles || user.org_roles.length === 0)) {
      navigate('/onboarding/organizer', { replace: true });
      return;
    }

    // 4. Player Onboarding incomplete
    if (user.onboarding_path === 'player' && !user.onboarding_completed) {
      navigate('/onboarding/player', { replace: true });
      return;
    }

    // 5. Fully Onboarded Role Dashboards
    if (user.onboarding_path === 'organizer' && user.onboarding_completed) {
      navigate('/dashboard/organizer', { replace: true });
      return;
    }

    if (user.onboarding_path === 'player' && user.onboarding_completed) {
      navigate('/dashboard/player', { replace: true });
      return;
    }

    if (user.onboarding_path === 'sponsor') {
      // Direct sponsor to mock tournament t1 for now
      navigate('/sponsor/t1', { replace: true });
      return;
    }

    if (user.onboarding_path === 'producer' || user.roles?.includes('B. Producer') || user.roles?.includes('T. Director')) {
      // Direct producer to mock tournament t1
      navigate('/production/t1/dashboard', { replace: true });
      return;
    }

    if (user.onboarding_path === 'viewer' || user.role === 'VIEWER') {
      navigate('/explore', { replace: true });
      return;
    }

  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return <AuthGuard requireAuth={true}><DashboardLoadingState /></AuthGuard>;
  }

  // Fallback for unexpected states
  const isCompleted = user.onboarding_completed && ['organizer', 'player', 'viewer', 'admin', 'sponsor', 'producer'].includes(user.onboarding_path) || user.role === 'VIEWER' || user.roles?.includes('Super Admin') || user.roles?.includes('SPONSOR_REP') || user.roles?.includes('B. Producer') || user.roles?.includes('T. Director');

  if (isCompleted) {
    // If completed but React hasn't navigated yet, show loading to prevent flash
    return <DashboardLoadingState />;
  }

  // Unsupported role
  return <DashboardFallbackState />;
}
