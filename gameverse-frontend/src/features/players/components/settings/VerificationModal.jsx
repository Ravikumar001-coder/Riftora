import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, Gamepad2, CheckCircle2 } from 'lucide-react';
import { useGenerateChallengeMutation, useVerifyChallengeMutation } from '../../api/useLinkedAccounts';

export function VerificationModal({ account, onClose, onToast }) {
  const generateMutation = useGenerateChallengeMutation();
  const verifyMutation = useVerifyChallengeMutation();
  const [challengeCode, setChallengeCode] = useState(account?.verificationCode || null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = () => {
    generateMutation.mutate(account.linkedId, {
      onSuccess: (res) => {
        setChallengeCode(res.data.verificationCode || res.verificationCode);
      },
      onError: (err) => {
        onToast(err.response?.data?.error?.message || "Failed to generate challenge", true);
      }
    });
  };

  const handleVerify = () => {
    verifyMutation.mutate(account.linkedId, {
      onSuccess: () => {
        setIsSuccess(true);
        onToast("Account verified successfully!", false);
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      onError: (err) => {
        onToast(err.response?.data?.error?.message || "Verification failed. Please ensure you changed your name.", true);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-green-500/30 rounded-xl p-8 max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Verified!</h2>
          <p className="text-slate-400">Your game account has been successfully verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Verify Game Account</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <Gamepad2 className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-slate-400">UID: {account.inGameUid}</p>
              <p className="text-white font-medium">{account.gameName}</p>
            </div>
          </div>

          <div className="space-y-4">
            {!challengeCode ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-300">
                  To verify ownership of this account, you will need to temporarily change your in-game name to a unique verification code.
                </p>
                <button 
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full flex justify-center items-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                >
                  {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Generate Verification Code
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-slate-300">Change your in-game name to:</p>
                  <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                    <span className="text-2xl font-mono text-blue-400 tracking-wider font-bold">{challengeCode}</span>
                  </div>
                  <p className="text-xs text-amber-500">
                    Warning: Changing your in-game name may cost in-game currency. Do this at your own risk.
                  </p>
                </div>
                
                <button 
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  className="w-full flex justify-center items-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium"
                >
                  {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  I have changed my name — Verify Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
