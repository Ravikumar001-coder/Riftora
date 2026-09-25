import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import { popularGuides } from '../../../../services/docsData';

export function FeaturedGuides() {
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Popular Guides</h2>
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularGuides.map((guide) => (
          <button
            key={guide.id}
            onClick={() => navigate(guide.path)}
            className="flex flex-col text-left p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/60 transition-all group"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {guide.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {guide.title}
            </h3>
            
            <p className="text-sm text-slate-400 mb-4 flex-grow line-clamp-2">
              {guide.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Guide
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {guide.readTime}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
