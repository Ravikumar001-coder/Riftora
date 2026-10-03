import React from 'react';
import { useParams } from 'react-router-dom';
import { useTournamentRules } from '../../../../../features/tournaments/api/useTournamentDetails';
import { BookOpen } from 'lucide-react';
import { RulesMetadata } from './RulesMetadata';
import { RulesTableOfContents } from './RulesTableOfContents';
import { RuleSection } from './RuleSection';

export function TournamentRulesView({ tournament }) {
  const { tournamentSlug } = useParams();
  const { data: rulesData, isLoading } = useTournamentRules(tournamentSlug);

  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="h-24 bg-slate-800/50 rounded-xl animate-pulse mb-8 border border-white/5"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 hidden lg:block">
            <div className="h-96 bg-slate-800/50 rounded-xl animate-pulse border border-white/5"></div>
          </div>
          <div className="lg:col-span-3 space-y-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-4">
                <div className="h-8 bg-slate-800/50 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-slate-800/50 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-800/50 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-slate-800/50 rounded w-4/6 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If rulesData doesn't exist or doesn't have the new structured format
  if (!rulesData || !rulesData.sections || rulesData.sections.length === 0) {
    return (
      <div className="gameverse-card flex flex-col items-center justify-center p-16 text-center border border-white/5 rounded-xl">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Rules Coming Soon</h3>
        <p className="text-slate-400 max-w-md">
          The official tournament rules have not been published yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-500" />
          Tournament Rules
        </h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          Review the official rules, format, eligibility requirements, and tournament regulations.
        </p>
      </div>

      <RulesMetadata metadata={rulesData.metadata} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar TOC - Desktop only */}
        <div className="lg:col-span-1 hidden lg:block">
          <RulesTableOfContents sections={rulesData.sections} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="gameverse-card p-6 md:p-10 border border-white/5 rounded-xl bg-slate-900/50 shadow-xl space-y-12">
            {rulesData.sections.map((section) => (
              <RuleSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
