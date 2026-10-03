import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { Building, Plus, ArrowRight, Settings, LogOut, User, ImagePlus, Activity, Users } from 'lucide-react';
import logo from '../../../assets/logo.png';

export function OrganizationSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const orgRoles = user?.orgRoles || user?.org_roles || [];
  
  console.log("DEBUG orgRoles: ", orgRoles);

  useEffect(() => {
    document.title = "Select Organization | Riftora";
    
    // If they have no roles, they should probably go to onboarding
    if (orgRoles.length === 0) {
      navigate('/onboarding/organizer', { replace: true });
    }
  }, [user, navigate, orgRoles]);

  const handleSelectOrg = (orgId, orgSlug) => {
    if (orgSlug) {
      navigate(`/dashboard/organizer/${orgSlug}`);
    } else {
      navigate('/dashboard/organizer');
    }
  };



  return (
    <div className="min-h-screen w-full flex flex-col relative z-10 px-6 sm:px-12 py-8 bg-slate-950 text-white">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      {/* Header with Layout Balancing */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8 lg:mb-12">
        <Link to="/" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-opacity hover:opacity-80">
          <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain brightness-150 saturate-150" />
        </Link>

        {/* User Account Dropdown */}
        <div className="relative group z-50">
          <button className="flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 p-1.5 pr-4 rounded-full transition-all shadow-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-600/80 to-blue-600/80 border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user?.username?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
              {user?.username || 'Account'}
            </span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden">
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/30">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Signed in as</p>
              <p className="text-sm text-slate-200 font-medium truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="p-1.5 space-y-0.5">
              <Link to="/settings/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 font-medium hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors">
                <User className="w-4 h-4" /> Global Profile
              </Link>
              <Link to="/settings/platform" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 font-medium hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors">
                <Settings className="w-4 h-4" /> Platform Settings
              </Link>
            </div>
            <div className="p-1.5 border-t border-slate-800/80 bg-slate-950/20">
              <button onClick={() => useAuthStore.getState().logout()} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 font-medium hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start items-center">
        <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/40 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-black/50">
          
          <div className="text-center mb-8 w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Select Organization
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg mx-auto">
              Choose an existing organization to manage or create a new one.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orgRoles.map((roleObj, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOrg(roleObj.org_id || roleObj.orgId, roleObj.org_slug || roleObj.orgSlug)}
                className="relative p-5 bg-slate-900/80 border border-slate-700/50 hover:border-transparent rounded-2xl transition-all group text-left h-[130px] flex flex-col justify-between overflow-hidden"
              >
                {/* Interactive Hover States: vibrant border reveal & glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="absolute inset-[1px] bg-slate-900 rounded-[15px] z-0 transition-colors group-hover:bg-slate-900/90 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute inset-0 bg-fuchsia-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 z-0"></div>
                
                <div className="relative z-10 flex items-start justify-between w-full h-full">
                  <div className="flex items-start gap-4 h-full">
                    {/* Custom Organization Logos Placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center font-bold text-lg text-slate-500 group-hover:text-fuchsia-400 group-hover:border-fuchsia-500/40 transition-all overflow-hidden shrink-0 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                      {roleObj.org_logo ? (
                        <img src={roleObj.org_logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <ImagePlus className="w-5 h-5 mb-0.5 opacity-80" />
                          <span className="text-[7px] font-bold uppercase tracking-widest opacity-70">Upload</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors truncate max-w-[150px] leading-tight">
                          {roleObj.org_name || roleObj.orgName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-slate-500 font-mono">@{roleObj.org_slug || roleObj.orgSlug}</p>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <p className="text-[10px] font-semibold text-fuchsia-400/80 capitalize">
                            {(roleObj.org_role || roleObj.orgRole)?.replace('org_', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Organization Quick Stats */}
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold bg-slate-950/60 px-2 py-1 rounded border border-slate-800 group-hover:border-slate-700 transition-colors">
                          <Activity className="w-3 h-3 text-fuchsia-400" />
                          <span>{roleObj.active_tournaments || roleObj.activeTournaments || 0} Active</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-400 font-bold bg-slate-950/60 px-2 py-1 rounded border border-slate-800 group-hover:border-slate-700 transition-colors">
                          <Users className="w-3 h-3 text-indigo-400" />
                          <span>{roleObj.total_members || roleObj.totalMembers || 1} {roleObj.total_members === 1 || roleObj.totalMembers === 1 ? 'Member' : 'Members'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-full flex items-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300">
                     <ArrowRight className="w-5 h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
                  </div>
                </div>
              </button>
            ))}

            {/* Card Consistency: matching h-[130px] */}
            <Link
              to="/onboarding/organizer"
              className="relative p-5 bg-slate-900/40 hover:bg-slate-900/80 border border-dashed border-slate-700/70 hover:border-fuchsia-500/50 rounded-2xl transition-all group h-[130px] flex items-center justify-center overflow-hidden"
            >
               {/* Subtle background glow on hover */}
               <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               
              <div className="relative z-10 flex flex-col items-center gap-3 text-slate-500 group-hover:text-fuchsia-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 group-hover:bg-fuchsia-500/20 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.2)] flex items-center justify-center transition-all">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm tracking-wide">Create New Organization</span>
              </div>
            </Link>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-center pb-4 text-xs text-slate-600 font-semibold tracking-wide">
        © {new Date().getFullYear()} RIFTORA ESPORTS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

