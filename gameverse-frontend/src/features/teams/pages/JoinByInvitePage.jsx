import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuroraBackground } from '../../../components/ui/aurora-background';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useJoinTeamByCode } from '../api/useTeamQueries';
import { useAuthStore } from '../../../store/authStore';

export function JoinByInvitePage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const joinTeam = useJoinTeamByCode();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { returnTo: `/invite/${inviteCode}` } });
      return;
    }

    try {
      setError(null);
      const team = await joinTeam.mutateAsync(inviteCode);
      setSuccess(team);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join team. The link may be invalid or expired.');
    }
  };

  return (
    <AuroraBackground showRadialGradient={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md gameverse-card p-8 text-center"
        >
          {success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 font-rajdhani">Welcome to the Team!</h1>
              <p className="text-slate-400 mb-8">
                You have successfully joined {success.teamName}.
              </p>
              <Link 
                to={`/player/teams`}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center transition-colors"
              >
                Go to My Teams
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 font-rajdhani">Team Invitation</h1>
              <p className="text-slate-400 mb-8">
                You've been invited to join a team. Click below to accept the invitation.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleJoin}
                  disabled={joinTeam.isPending}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
                >
                  {joinTeam.isPending ? 'Joining...' : (isAuthenticated ? 'Join Team' : 'Login to Join')}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-transparent hover:bg-white/5 border border-white/10 text-white rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
