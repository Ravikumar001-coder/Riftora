import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '../../../../features/auth/api/auth.service';
import logo from '../../../../assets/logo.png';

export function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  // Use a ref to prevent double-firing in strict mode
  const hasAttemptedRef = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: (verifyToken) => authService.verifyEmailToken(verifyToken),
    onSuccess: () => {
      // Assuming verification returns us to a login state
      // (The exact behavior here is dependent on missing backend functionality)
    },
    onError: (error) => {
      // Backend error is caught here
    }
  });

  useEffect(() => {
    document.title = "Verify Email | Riftora";
    
    if (token && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;
      verifyMutation.mutate(token);
    }
  }, [token, verifyMutation]);

  // Determine state
  const isMissingToken = !token;
  const isVerifying = verifyMutation.isPending && !isMissingToken;
  const isSuccess = verifyMutation.isSuccess;
  const isError = verifyMutation.isError || isMissingToken;

  return (
    <>
      <div className="min-h-screen w-full flex flex-col relative z-10 px-6 sm:px-12 py-8">
        
        {/* Header */}
        <header className="w-full max-w-4xl mx-auto flex items-center justify-center lg:justify-start mb-16 lg:mb-32">
          <Link to="/" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-opacity hover:opacity-80">
            <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-start items-center">
          <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-10 md:p-14 rounded-3xl shadow-2xl shadow-black/50 text-center flex flex-col items-center">
            
            {/* Loading State */}
            {isVerifying && (
              <div aria-live="polite" className="flex flex-col items-center">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  Verifying Your Email
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
                  Please wait while we securely verify your email address.
                </p>
              </div>
            )}

            {/* Success State */}
            {isSuccess && (
              <div aria-live="polite" className="flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  Email Verified
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10">
                  Your email address has been successfully verified. You can now access your Riftora dashboard.
                </p>
                <button 
                  onClick={() => navigate('/auth/login')}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-lg"
                >
                  Continue to Login
                </button>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div aria-live="assertive" className="flex flex-col items-center w-full">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  Verification Failed
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10">
                  {isMissingToken 
                    ? "This verification link is not valid or is missing the secure token."
                    : "We couldn't verify your email address. The link may have expired or is invalid."}
                </p>
                
                <div className="w-full flex flex-col gap-4">
                  <button 
                    onClick={() => navigate('/auth/login')}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-lg"
                  >
                    Go to Login
                  </button>
                  <button 
                    onClick={() => navigate('/auth/register')}
                    className="w-full py-4 bg-transparent border border-slate-600 hover:bg-slate-800 text-white font-medium rounded-xl transition-all text-lg"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
        
        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto flex items-center justify-center lg:justify-start mt-8 text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} Riftora Esports. All rights reserved.
        </footer>
      </div>
    </>
  );
}
