import React from 'react';
import { Mail, Calendar, Info, AlertTriangle } from 'lucide-react';

export function AccountTab({ user, onToast }) {
  
  const handleVerifyEmail = () => {
    onToast("Verification email sent! Check your inbox.", false);
  };

  const handleChangeEmail = () => {
    onToast("Changing your email will require verification. Backend not connected.", true);
  };

  const isEmailVerified = user?.emailVerified ?? true; // Mock true by default if undefined

  return (
    <div className="space-y-8">
      
      {/* Account Info */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Account Details</h3>
        
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Email Address</p>
                <p className="text-white font-medium">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  Verified ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" /> Not Verified
                </span>
              )}
              
              <button 
                onClick={handleChangeEmail}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
              >
                Change
              </button>
            </div>
          </div>

          {/* Verification Banner if needed */}
          {!isEmailVerified && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-200">Verify your email address</p>
                <p className="text-xs text-amber-400/80 mt-1 mb-3">
                  Please verify your email to unlock all account features and ensure you receive tournament updates.
                </p>
                <button 
                  onClick={handleVerifyEmail}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-medium rounded-lg transition-colors border border-amber-500/30"
                >
                  Send Verification Link
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Account Created</p>
                <p className="text-slate-400">{user?.createdAt || 'January 2026'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
