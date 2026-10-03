import React, { useEffect } from 'react';
import { RegisterForm } from '../../../../features/auth/components/RegisterForm';
import { AuthGuard } from '../../../../features/auth/components/AuthGuard';
import logo from '../../../../assets/logo.png';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  useEffect(() => {
    document.title = "Create Account | Riftora";
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
                Join the Ecosystem
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 font-medium">
                Riftora is the command center for professional esports. Register now to participate in tournaments, manage your team roster, or organize world-class competitive events.
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <span>Player & Team Dashboards</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <span>Tournament Organization</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <span>Live Broadcast Integrations</span>
                </div>
              </div>
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
              <RegisterForm />
            </div>
          </div>

        </div>
      </>
    </AuthGuard>
  );
}
