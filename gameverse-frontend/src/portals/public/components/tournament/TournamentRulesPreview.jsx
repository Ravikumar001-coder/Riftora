import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTournamentRules } from '../../../../features/tournaments/api/useTournamentDetails';

export function TournamentRulesPreview({ tournament }) {
  const navigate = useNavigate();
  const { data: rules, isLoading } = useTournamentRules(tournament.slug);

  if (isLoading || !rules) return null;

  const isLegacyArray = Array.isArray(rules);
  let previewRules = [];
  if (isLegacyArray) {
    previewRules = rules;
  } else if (rules.sections) {
    for (const section of rules.sections) {
      if (section.blocks) {
        for (const block of section.blocks) {
          if (block.type === 'paragraph' && typeof block.content === 'string') {
            previewRules.push(block.content);
          } else if (block.type === 'list' && Array.isArray(block.items)) {
            previewRules.push(...block.items);
          }
        }
      }
    }
  }

  if (previewRules.length === 0) return null;

  return (
    <div className="gameverse-card rounded-xl p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          Rules Preview
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-400 hover:text-blue-300"
          onClick={() => navigate(`/t/${tournament.slug}/rules`)}
        >
          Read Full Rules
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {previewRules.slice(0, 3).map((rule, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">{rule}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 mt-4">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-200 leading-relaxed">
          Players are expected to follow the complete ruleset. Ignorance of the rules is not an excuse for violations.
        </p>
      </div>
    </div>
  );
}
