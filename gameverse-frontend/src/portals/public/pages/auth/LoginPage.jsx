import React, { useEffect } from 'react';
import { LoginForm } from '../../../../features/auth/components/LoginForm';
import { AuthGuard } from '../../../../features/auth/components/AuthGuard';
import logo from '../../../../assets/logo.png';
import { Link } from 'react-router-dom';

export function LoginPage() {
  useEffect(() => {
    document.title = "Sign In | Riftora";
  }, []);

  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <>
        <div className="min-h-screen w-full flex flex-col lg:flex-row relative z-10">
          
          {/* Left Side: Branding & Context (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 relative p-12 xl:p-24 flex-col justify-between border-r border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
            <div>
              <Link to="/" className="inline-block hover:opacity-80 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
              </Link>
            </div>
            
            <div className="max-w-md">
              <h1 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                Welcome Back
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 font-medium">
                Sign in to Riftora to access your dashboards, manage tournaments, and oversee your esports operations.
              </p>
            </div>
            
            <div className="text-sm text-slate-500 font-medium">
              © {new Date().getFullYear()} Riftora Esports. All rights reserved.
            </div>
          </div>

          {/* Right Side: Form Container */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
            
            {/* Mobile Header (Only visible on lg:hidden) */}
            <div className="lg:hidden w-full max-w-md mx-auto flex items-center justify-center mb-10">
              <Link to="/" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
              </Link>
            </div>

            <div className="w-full max-w-md mx-auto">
              <LoginForm />
            </div>
          </div>

        </div>
      </>
    </AuthGuard>
  );
}
