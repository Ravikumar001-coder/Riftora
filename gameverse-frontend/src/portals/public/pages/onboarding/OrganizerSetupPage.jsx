import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthGuard } from '../../../../features/auth/components/AuthGuard';
import { AuroraBackground } from '../../../../components/ui/aurora-background';
import { useAuthStore } from '../../../../store/authStore';
import { OrganizerSetupForm } from '../../../../features/onboarding/components/OrganizerSetupForm';
import logo from '../../../../assets/logo.png';
import { CheckCircle2 } from 'lucide-react';

export function OrganizerSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard');

  useEffect(() => {
    document.title = "Build Your Organization | Riftora";

    // Validating Onboarding State
    if (user) {
      if (!user.username) {
        navigate('/onboarding/username', { replace: true });
        return;
      }
      if (user.onboarding_path !== 'organizer') {
        navigate('/dashboard', { replace: true });
        return;
      }
      if (user.onboarding_completed || (user.org_roles && user.org_roles.length > 0)) {
        // Automatically forward to their dashboard if they are fully done or have roles
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSuccess = (redirectTo) => {
    setIsSuccess(true);
    if (redirectTo) {
      setRedirectPath(redirectTo);
    }
  };

  // Prevent UI flashing
  if (!user || !user.username || user.onboarding_path !== 'organizer' || user.onboarding_completed || (user.org_roles && user.org_roles.length > 0)) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true}>
      <AuroraBackground>
        <div className="min-h-screen w-full flex flex-col relative z-10 px-6 sm:px-12 py-8">
          
          {/* Header */}
          <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 lg:mb-12">
            <Link to="/" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-opacity hover:opacity-80">
              <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
            </Link>
            <div className="text-slate-400 font-medium text-sm border border-slate-700/50 rounded-full px-4 py-1.5 bg-slate-900/50 backdrop-blur-sm">
              Organizer Setup
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col justify-start items-center">
            {isSuccess ? (
              <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-10 md:p-14 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500 mt-12">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Your Organization Is Ready! 🎉
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Your Riftora organizer workspace has been created successfully.
                </p>
                <button
                  onClick={() => navigate(redirectPath)}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-lg"
                >
                  Continue to Dashboard
                </button>
              </div>
            ) : (
              <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center">
                
                <div className="text-center mb-10 w-full">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                    Build Your Organization
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                    Create your esports organization and start running tournaments on Riftora.
                  </p>
                </div>

                <OrganizerSetupForm onSuccess={handleSuccess} />

              </div>
            )}
          </main>
          
          {/* Footer */}
          <footer className="w-full max-w-5xl mx-auto flex items-center justify-center lg:justify-start mt-8 text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Riftora Esports. All rights reserved.
          </footer>
        </div>
      </AuroraBackground>
    </AuthGuard>
  );
}
