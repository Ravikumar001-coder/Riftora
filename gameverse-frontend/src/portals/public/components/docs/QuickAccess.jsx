import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code2, MonitorPlay, AlertTriangle, ArrowRight } from 'lucide-react';

export function QuickAccess() {
  const navigate = useNavigate();

  const links = [
    {
      id: "platform-guides",
      title: "Platform Guides",
      description: "Learn how to use Riftora's core features.",
      icon: BookOpen,
      path: "/docs/getting-started",
      color: "text-blue-400",
      bg: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    {
      id: "api-docs",
      title: "API Documentation",
      description: "Integrate with the Riftora platform.",
      icon: Code2,
      path: "/docs/api",
      color: "text-purple-400",
      bg: "bg-purple-500/10 hover:bg-purple-500/20"
    },
    {
      id: "obs-overlays",
      title: "OBS Overlay Setup",
      description: "Configure your live stream graphics.",
      icon: MonitorPlay,
      path: "/docs/overlays",
      color: "text-green-400",
      bg: "bg-green-500/10 hover:bg-green-500/20"
    },
    {
      id: "error-reference",
      title: "Error Code Reference",
      description: "Troubleshoot common platform issues.",
      icon: AlertTriangle,
      path: "/docs/errors",
      color: "text-red-400",
      bg: "bg-red-500/10 hover:bg-red-500/20"
    }
  ];

  return (
    <div className="py-16">
      <h2 className="text-2xl font-bold text-white mb-8">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              onClick={() => navigate(link.path)}
              className="gameverse-card p-5 rounded-xl border border-white/5 hover:border-white/10 text-left transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${link.bg}`}>
                <Icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <h3 className="text-white font-bold mb-1 flex items-center justify-between">
                {link.title}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
              </h3>
              <p className="text-sm text-slate-400">{link.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
