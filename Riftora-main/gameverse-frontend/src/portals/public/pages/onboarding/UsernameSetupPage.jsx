import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsernameForm } from '../../../../features/onboarding/components/UsernameForm';
import { AuthGuard } from '../../../../features/auth/components/AuthGuard';
import { useAuthStore } from '../../../../store/authStore';
import logo from '../../../../assets/logo.png';

export function UsernameSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = "Choose Your Username | Riftora";

    // If the user already has a username, they shouldn't be on this onboarding step.
    if (user?.username) {
      // Centralized dashboard routing will handle the exact next step if onboarding is still incomplete
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    // When username is successfully saved, redirect to the dashboard router 
    // to evaluate the next onboarding step.
    navigate('/dashboard');
  };

  // Prevent UI flashing if we are about to redirect
  if (user?.username) {
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
              Step 1 of Onboarding
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center">
              
              <div className="text-center mb-8 w-full">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Choose Your Identity
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  Your username will identify you across Riftora and appear on your public profile.
                </p>
              </div>

              <UsernameForm onSuccess={handleSuccess} />

            </div>
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
