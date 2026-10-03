import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationBell } from '../../../features/notifications/components/NotificationBell';

export function PlayerHeader({ onMenuClick, isScrolled }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">
            Search tournaments, teams, players...
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-500"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white placeholder:text-slate-500 focus:ring-0 sm:text-sm"
            placeholder="Search tournaments, teams, players..."
            type="search"
            name="search"
            autoComplete="off"
          />
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <NotificationBell />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-800" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button 
              className="-m-1.5 flex items-center p-1.5"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-300 ring-1 ring-slate-700">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden lg:flex lg:items-center gap-2">
                <span className="text-sm font-semibold leading-6 text-white" aria-hidden="true">
                  {user?.username || 'Player'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-slate-500" aria-hidden="true" />
              </span>
            </button>
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 z-50 mt-2.5 w-48 origin-top-right rounded-md bg-slate-900 py-2 shadow-lg ring-1 ring-slate-800 focus:outline-none">
                  <Link to="/profile/me" className="block px-3 py-1 text-sm leading-6 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  <Link to="/teams/my-team/manage" className="block px-3 py-1 text-sm leading-6 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setDropdownOpen(false)}>My Team</Link>
                  <Link to="/notifications" className="block px-3 py-1 text-sm leading-6 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setDropdownOpen(false)}>Notifications</Link>
                  <Link to="/profile/me#settings" className="block px-3 py-1 text-sm leading-6 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setDropdownOpen(false)}>Settings</Link>
                  <div className="my-1 border-t border-slate-800" />
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-1 text-sm leading-6 text-slate-300 hover:bg-slate-800 hover:text-white">Sign Out</button>
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
