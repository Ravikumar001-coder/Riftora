import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { docsCategories } from '../../../../services/docsData';

export function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <h2 className="text-2xl font-bold text-white mb-8">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {docsCategories.map((category) => {
          const IconComponent = Icons[category.icon] || Icons.FileText;
          return (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="gameverse-card p-6 rounded-xl border border-white/5 hover:border-blue-500/30 text-left transition-all group flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-transform">
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{category.title}</h3>
              <p className="text-sm text-slate-400 mb-6 flex-grow">{category.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                  {category.articleCount} Articles
                </span>
                <span className="text-sm font-medium text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <Icons.ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
