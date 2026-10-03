import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthGuard } from '../../../../features/auth/components/AuthGuard';
import { useAuthStore } from '../../../../store/authStore';
import { PlayerSetupForm } from '../../../../features/onboarding/components/PlayerSetupForm';
import logo from '../../../../assets/logo.png';
import { CheckCircle2 } from 'lucide-react';

export function PlayerSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard');

  useEffect(() => {
    document.title = "Build Your Player Profile | Riftora";

    // Validating Onboarding State
    if (user) {
      if (!user.username) {
        navigate('/onboarding/username', { replace: true });
        return;
      }
      if (user.onboarding_path !== 'player') {
        navigate('/dashboard', { replace: true });
        return;
      }
      if (user.onboarding_completed) {
        // Automatically forward to their dashboard if they are fully done
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
  if (!user || !user.username || user.onboarding_path !== 'player' || user.onboarding_completed) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true}>
      <>
        <div className="min-h-screen w-full flex flex-col relative z-10 px-6 sm:px-12 py-8">
          
          {/* Header */}
          <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 lg:mb-12">
            <Link to="/" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-opacity hover:opacity-80">
              <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
            </Link>
            <div className="text-slate-400 font-medium text-sm border border-slate-700/50 rounded-full px-4 py-1.5 bg-slate-900/50 backdrop-blur-sm">
              Step 3 of Onboarding
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
                  Profile Ready! 🎉
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  You're all set. Let's get you into Riftora.
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
                    Build Your Profile
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                    Set up your player profile to get started on Riftora.
                  </p>
                </div>

                <PlayerSetupForm onSuccess={handleSuccess} />

              </div>
            )}
          </main>
          
          {/* Footer */}
          <footer className="w-full max-w-5xl mx-auto flex items-center justify-center lg:justify-start mt-8 text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Riftora Esports. All rights reserved.
          </footer>
        </div>
      </>
    </AuthGuard>
  );
}
