import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Gamepad2, Trophy, AlertCircle } from 'lucide-react';
import { AuthGuard } from '../../../../features/auth/components/AuthGuard';
import { useAuthStore } from '../../../../store/authStore';
import { authService } from '../../../../features/auth/api/auth.service';
import logo from '../../../../assets/logo.png';

export function PathSelectionPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    document.title = "Choose Your Path | Riftora";

    // 1. If user doesn't have a username, they must go back to the previous step
    if (user && !user.username) {
      navigate('/onboarding/username', { replace: true });
      return;
    }

    // 2. If user already selected a path, forward them to the dashboard 
    //    so the global router can evaluate the next sequence
    if (user && user.onboarding_path) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const saveMutation = useMutation({
    mutationFn: (path) => authService.updateProfile({ 
      onboarding_path: path
    }),
    onSuccess: (data, variables) => {
      // Update global auth store state (data is the updated user from backend)
      updateUser(data);
      // Let the dashboard router figure out exactly where they go next based on new state
      navigate('/dashboard');
    }
  });

  const handleContinue = () => {
    if (!selectedPath) return;
    saveMutation.mutate(selectedPath);
  };

  // Prevent UI flashing
  if (!user || !user.username || user.onboarding_path) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true}>
      <>
        <div className="min-h-screen w-full flex flex-col relative z-10 px-6 sm:px-12 py-8">
          
          {/* Header */}
          <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-12 lg:mb-20">
            <Link to="/" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-opacity hover:opacity-80">
              <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
            </Link>
            <div className="text-slate-400 font-medium text-sm border border-slate-700/50 rounded-full px-4 py-1.5 bg-slate-900/50 backdrop-blur-sm">
              Step 2 of Onboarding
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col justify-start items-center">
            <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-10 md:p-14 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center">
              
              <div className="text-center mb-12 w-full">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                  Choose Your Path
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
                  How would you like to get started on Riftora?
                </p>
              </div>

              {/* Path Selection Cards */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" role="radiogroup" aria-label="Select your primary path">
                
                {/* Player Card */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPath === 'player'}
                  onClick={() => setSelectedPath('player')}
                  disabled={saveMutation.isPending}
                  className={`relative flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-300 text-left outline-none ${
                    selectedPath === 'player' 
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.2)]' 
                      : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800 focus:border-blue-500/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className={`p-4 rounded-full mb-6 transition-colors duration-300 ${
                    selectedPath === 'player' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700 text-slate-300'
                  }`}>
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center">PLAYER</h3>
                  <p className="text-slate-400 text-center text-sm leading-relaxed mb-4">
                    Join tournaments, build your team, and compete.
                  </p>
                  
                  {/* Selected Indicator */}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPath === 'player' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                  }`}>
                    {selectedPath === 'player' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>

                {/* Organizer Card */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedPath === 'organizer'}
                  onClick={() => setSelectedPath('organizer')}
                  disabled={saveMutation.isPending}
                  className={`relative flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-300 text-left outline-none ${
                    selectedPath === 'organizer' 
                      ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                      : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800 focus:border-amber-500/50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className={`p-4 rounded-full mb-6 transition-colors duration-300 ${
                    selectedPath === 'organizer' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-700 text-slate-300'
                  }`}>
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center">ORGANIZER</h3>
                  <p className="text-slate-400 text-center text-sm leading-relaxed mb-4">
                    Create and manage esports events and tournaments.
                  </p>

                  {/* Selected Indicator */}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPath === 'organizer' ? 'border-amber-500 bg-amber-500' : 'border-slate-600'
                  }`}>
                    {selectedPath === 'organizer' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>

              {/* Action Area */}
              <div className="w-full max-w-sm flex flex-col gap-4">
                <button
                  onClick={handleContinue}
                  disabled={!selectedPath || saveMutation.isPending}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:hover:shadow-none flex items-center justify-center gap-2 text-lg"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Setting up your journey...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>

                {/* API Error Feedback */}
                {saveMutation.isError && (
                  <p className="text-red-400 text-sm flex items-center justify-center gap-1.5" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    We couldn't save your selection. Please try again.
                  </p>
                )}
              </div>

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
