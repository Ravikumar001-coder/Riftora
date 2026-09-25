import { useState } from 'react';
import { useOrganizationMutations } from '../api/useOrganizationMutations';
import { Loader2, Copy, Check, Mail, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ROLES = [
  { value: 'org_admin', label: 'Admin' },
  { value: 'tournament_director', label: 'Tournament Director' },
  { value: 'referee', label: 'Referee' },
  { value: 'broadcast_producer', label: 'Broadcast Producer' }
];

export function InviteModal({ isOpen, onClose, orgId }) {
  const [activeTab, setActiveTab] = useState('email');
  const [role, setRole] = useState('referee');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [maxUses, setMaxUses] = useState(1);
  const [expiryDays, setExpiryDays] = useState(7);
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { inviteUser, createJoinLink } = useOrganizationMutations();

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (activeTab === 'email') {
        if (!email) return setErrorMsg('Email is required');
        await inviteUser.mutateAsync({ orgId, data: { email, role } });
        toast.success('Email invitation sent!');
        onClose();
      } else if (activeTab === 'user') {
        if (!username) return setErrorMsg('Username is required');
        await inviteUser.mutateAsync({ orgId, data: { username, role } });
        toast.success('User invited successfully!');
        onClose();
      } else if (activeTab === 'link') {
        const result = await createJoinLink.mutateAsync({
          orgId,
          data: { role, maxUses: parseInt(maxUses) || null, expiryDays: parseInt(expiryDays) || null }
        });
        const url = `${window.location.origin}/join/${result.token}?type=link`;
        setGeneratedLink(url);
        toast.success('Join link created!');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to send invite');
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard');
  };

  const isPending = inviteUser.isPending || createJoinLink.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">Invite member</h3>
        <p className="text-sm text-slate-400 mb-6">Add someone to your organization</p>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <p className="text-sm text-red-400">{errorMsg.replace('PLAN_LIMIT_REACHED: ', '')}</p>
              {errorMsg.includes('PLAN_LIMIT_REACHED') && (
                <a href={`/dashboard/organizer/billing`} className="text-xs text-blue-400 hover:text-blue-300 mt-2 underline">
                  Upgrade Plan to increase limits
                </a>
              )}
            </div>
          </div>
        )}

        <div className="flex bg-slate-950 p-1 rounded-lg mb-6">
          <button 
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'email' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Email
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'user' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Username
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'link' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Link
          </button>
        </div>

        <form onSubmit={handleInvite}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Role *</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 appearance-none"
              >
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {activeTab === 'email' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
            )}

            {activeTab === 'user' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">GameVerse Username *</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. faker"
                  required
                />
              </div>
            )}

            {activeTab === 'link' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Max Uses</label>
                    <select
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="0">Unlimited</option>
                      <option value="10">10 uses</option>
                      <option value="50">50 uses</option>
                      <option value="100">100 uses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Expiry</label>
                    <select
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="0">Never expires</option>
                      <option value="1">1 day</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                </div>
                {generatedLink && (
                  <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-sm text-blue-400 truncate">{generatedLink}</span>
                    <button type="button" onClick={copyToClipboard} className="text-slate-400 hover:text-white">
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {(!generatedLink || activeTab !== 'link') && (
              <button 
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {activeTab === 'link' ? 'Generate Link' : 'Send Invitation'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
