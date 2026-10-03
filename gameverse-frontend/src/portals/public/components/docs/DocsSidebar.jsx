import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { docsCategories } from '../../../../services/docsData';

// Mock hierarchy for sidebar
const sidebarNavigation = [
  {
    title: "Getting Started",
    links: [
      { name: "Introduction", path: "/docs/getting-started" },
      { name: "Create Account", path: "/docs/getting-started/create-account" },
      { name: "Onboarding", path: "/docs/getting-started/onboarding" }
    ]
  },
  {
    title: "Tournaments",
    links: [
      { name: "Discover Tournaments", path: "/docs/tournaments" },
      { name: "Registration", path: "/docs/tournaments/registration" },
      { name: "Check-In", path: "/docs/tournaments/check-in" },
      { name: "Match Day", path: "/docs/tournaments/match-day" },
      { name: "Results", path: "/docs/tournaments/results" }
    ]
  },
  {
    title: "Teams",
    links: [
      { name: "Create Team", path: "/docs/teams" },
      { name: "Manage Roster", path: "/docs/teams/manage-roster" }
    ]
  },
  {
    title: "Organizations",
    links: [
      { name: "Create Organization", path: "/docs/organizations" },
      { name: "Manage Members", path: "/docs/organizations/manage-members" }
    ]
  },
  {
    title: "Developers",
    links: [
      { name: "API Documentation", path: "/docs/api" },
      { name: "WebSockets", path: "/docs/api/websockets" },
      { name: "Rate Limits", path: "/docs/api/rate-limits" },
      { name: "Errors", path: "/docs/errors" }
    ]
  }
];

export function DocsSidebar({ mobileOpen, setMobileOpen }) {
  // Simplistic expansion state
  const [expandedGroups, setExpandedGroups] = useState({
    "Getting Started": true,
    "Tournaments": true,
    "Developers": true
  });

  const toggleGroup = (title) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block pt-20 lg:pt-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
        
        {/* Mobile Close Button (Optional, handled by parent usually, but good to have) */}
        {mobileOpen && (
          <button 
            className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        )}

        <nav className="space-y-6">
          {sidebarNavigation.map((group) => (
            <div key={group.title}>
              <button 
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full text-left text-sm font-bold text-slate-200 tracking-wider uppercase mb-2 hover:text-white transition-colors"
              >
                {group.title}
                {expandedGroups[group.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              <div className={`space-y-1 overflow-hidden transition-all ${expandedGroups[group.title] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {group.links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) => 
                      `block px-3 py-1.5 text-sm rounded-md transition-colors ${
                        isActive 
                          ? 'bg-blue-500/10 text-blue-400 font-medium' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
