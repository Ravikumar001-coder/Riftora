import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useOrganizationMutations } from '../../../features/organizations/api/useOrganizationMutations';
import { useAuthStore } from '../../../store/authStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export default function JoinOrganizationPage() {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { acceptInvite, acceptJoinLink } = useOrganizationMutations();

  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Determine if it's a direct invite or a shareable link based on a query param or trying both
  // For simplicity, we can assume the URL has ?type=invite or ?type=link
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || 'link'; // default to link

  useEffect(() => {
    if (!isAuthenticated) {
      // Save intent and redirect to login
      sessionStorage.setItem('postLoginRedirect', location.pathname + location.search);
      navigate('/login');
      return;
    }

    const processToken = async () => {
      try {
        if (type === 'invite') {
          await acceptInvite.mutateAsync(token);
        } else {
          await acceptJoinLink.mutateAsync(token);
        }
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.response?.data?.message || 'Failed to join organization. The link may be expired or invalid.');
      }
    };

    processToken();
  }, [token, type, isAuthenticated, navigate, location, acceptInvite, acceptJoinLink]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0b1b36] border border-slate-800 rounded-xl p-8 text-center shadow-2xl">
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Joining Organization...</h2>
            <p className="text-slate-400">Please wait while we verify your invitation.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Successfully Joined!</h2>
            <p className="text-slate-400 mb-6">You have been added to the organization.</p>
            <Button onClick={() => navigate('/')} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invitation Failed</h2>
            <p className="text-slate-400 mb-6">{errorMessage}</p>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
              Return Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
