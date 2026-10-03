import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationBell } from '../../../features/notifications/components/NotificationBell';
import { useOrganizationQuery } from '../../../features/organizations/api/useOrganizationQueries';
export function OrganizerHeader({ onMenuClick, isScrolled, hasActiveOrg }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  const orgRoles = user?.orgRoles || user?.org_roles || [];
  const activeRoleObj = orgRoles[0]; // Simplified for header
  const orgId = activeRoleObj?.org_id || activeRoleObj?.orgId;
  
  const { data: orgData, isLoading } = useOrganizationQuery(orgId);

  let organization;
  if (hasActiveOrg) {
    if (orgData) {
      organization = {
        name: orgData.org_name,
        slug: orgData.org_slug,
        role: (activeRoleObj?.org_role || activeRoleObj?.orgRole)?.replace('org_', 'Org ') || 'Org Owner'
      };
    } else {
      organization = { name: isLoading ? 'Loading...' : 'Select Organization', slug: '', role: '' };
    }
  } else {
    organization = { name: 'Personal Account', slug: '', role: '' };
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className={`transition-all duration-300 ${isScrolled ? 'px-4 sm:px-6 lg:px-8 pt-4' : ''}`}>
      <header className={`
        flex shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300
        ${isScrolled 
          ? 'h-14 rounded-full border border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)]'
          : 'h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md'
        }
      `}>
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-slate-400 hover:text-white lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-between">
        
        {/* Organization Selector */}
        <div className="relative flex items-center">
          <button 
            className="flex items-center gap-2 hover:bg-slate-900 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            onClick={() => setOrgOpen(!orgOpen)}
          >
            <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
              <span className="text-white font-bold text-sm">{organization.name.charAt(0)}</span>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-bold text-white leading-tight">{organization.name}</span>
              <span className="text-xs text-slate-500 font-medium">{organization.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {orgOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOrgOpen(false)} />
              <div className="absolute left-0 top-12 z-50 mt-2 w-64 origin-top-left rounded-xl bg-slate-900 py-2 shadow-2xl ring-1 ring-slate-800 focus:outline-none">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Organizations</div>
                {hasActiveOrg && orgData && (
                  <Link to={`/dashboard/organizer/${organization.slug}`} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition-colors" onClick={() => setOrgOpen(false)}>
                    <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                      <span className="text-white font-bold text-sm">{organization.name.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{organization.name}</span>
                      <span className="text-xs text-amber-500">{organization.role}</span>
                    </div>
                  </Link>
                )}
                {(!hasActiveOrg || !orgData) && (
                  <div className="flex items-center gap-3 px-4 py-2 opacity-50">
                    <span className="text-sm text-white">No active organization</span>
                  </div>
                )}
                <div className="my-2 border-t border-slate-800" />
                <Link to="/dashboard/select-org" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setOrgOpen(false)}>
                  Switch Organization
                </Link>
                <Link to="/onboarding/organizer" className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:bg-slate-800 hover:text-blue-300 transition-colors" onClick={() => setOrgOpen(false)}>
                  <PlusCircle className="w-4 h-4" /> Add Organization
                </Link>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <form className="relative hidden md:flex" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
            <Search className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-slate-500" aria-hidden="true" />
            <input
              className="block w-64 rounded-full border-0 bg-slate-900 py-1.5 pl-9 pr-4 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-slate-700 sm:text-sm sm:leading-6 border border-slate-800"
              placeholder="Search tournaments..."
              type="search"
            />
          </form>

          <NotificationBell className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-full transition-colors" />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-800" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button 
              className="-m-1.5 flex items-center p-1.5"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 ring-1 ring-slate-700">
                {user?.username?.charAt(0).toUpperCase() || 'O'}
              </div>
            </button>
            
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 z-50 mt-2.5 w-48 origin-top-right rounded-xl bg-slate-900 py-2 shadow-2xl ring-1 ring-slate-800 focus:outline-none overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-800 mb-1">
                    <p className="text-sm font-medium text-white truncate">{user?.username || 'Organizer'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link to="/profile/me" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setProfileOpen(false)}>My Profile</Link>
                  {hasActiveOrg && orgData && (
                    <Link to={`/dashboard/organizer/${organization.slug}`} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setProfileOpen(false)}>Organization</Link>
                  )}
                  <Link to="/dashboard/organizer/notifications" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setProfileOpen(false)}>Notifications</Link>
                  <div className="my-1 border-t border-slate-800" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors">Sign Out</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </header>
    </div>
  );
}
