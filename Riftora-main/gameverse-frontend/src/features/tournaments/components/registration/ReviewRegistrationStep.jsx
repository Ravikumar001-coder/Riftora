import React, { useState, useRef, useEffect } from 'react';
import { Calendar, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useSubmitRules, useGetRegistrationById } from '../../api/useRegistrationQueries';

export function ReviewRegistrationStep({ tournament, team, registrationId, onNext, onBack }) {
  const [confirmed, setConfirmed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const rulesRef = useRef(null);
  
  const { mutateAsync: submitRules, isPending: isSubmitting } = useSubmitRules();
  const { data: registration, isLoading } = useGetRegistrationById(registrationId, { enabled: !!registrationId });

  useEffect(() => {
    // Check if the content is short enough that it doesn't need scrolling
    if (rulesRef.current) {
      if (rulesRef.current.scrollHeight <= rulesRef.current.clientHeight) {
        setHasScrolled(true);
      }
    }
  }, [tournament.rulesText]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setHasScrolled(true);
    }
  };

  const handleNext = async () => {
    try {
      await submitRules(registrationId);
      onNext();
    } catch (err) {
      console.error("Failed to submit rules:", err);
    }
  };

  const mainPlayers = team.roster?.filter(p => p.role === 'player' || p.role === 'captain')?.length || 0;
  const subs = team.roster?.filter(p => p.role === 'substitute')?.length || 0;
  
  const registrationDeadline = tournament.registrationClosesAt 
    ? new Date(tournament.registrationClosesAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Not specified';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Review Registration</h2>
        <p className="text-slate-400">Please review your registration details before confirming.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <>
          {registration?.correctionNotes && (
            <div className={`p-4 rounded-lg mb-6 border flex items-start gap-3 ${registration.flagScore === 'red' ? 'bg-red-950/30 border-red-900/50' : 'bg-yellow-950/30 border-yellow-900/50'}`}>
               <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${registration.flagScore === 'red' ? 'text-red-500' : 'text-yellow-500'}`} />
               <div>
                 <h4 className={`text-sm font-bold mb-1 ${registration.flagScore === 'red' ? 'text-red-400' : 'text-yellow-400'}`}>Registration Flagged</h4>
                 <p className={`text-sm ${registration.flagScore === 'red' ? 'text-red-300/80' : 'text-yellow-300/80'}`}>{registration.correctionNotes}</p>
               </div>
            </div>
          )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Tournament</p>
              <p className="text-sm font-medium text-white">{tournament.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Game</p>
              <p className="text-sm font-medium text-white">{tournament.game}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Team</p>
              <p className="text-sm font-medium text-white">{team.name} <span className="text-slate-400">({team.tag})</span></p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Captain</p>
              <p className="text-sm font-medium text-white">You</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Main Players</p>
              <p className="text-sm font-medium text-white">{mainPlayers}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Substitute</p>
              <p className="text-sm font-medium text-white">{subs}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Registration Deadline
              </p>
              <p className="text-sm font-medium text-white">{registrationDeadline}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Registration Fee</p>
              <p className="text-sm font-medium text-green-400">{tournament.entryFee > 0 ? tournament.prizePoolString : 'Free'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Tournament Rules & Code of Conduct</h4>
          
          <div 
            ref={rulesRef}
            onScroll={handleScroll}
            className="w-full h-64 overflow-y-auto bg-slate-950/50 border border-slate-800 rounded-lg p-4 mb-4 text-sm text-slate-300 whitespace-pre-wrap"
          >
            {tournament.rulesText || "No additional rules provided for this tournament. Please adhere to the standard GameVerse Code of Conduct."}
          </div>
          
          <label className={`flex items-start gap-3 cursor-pointer group ${!hasScrolled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="mt-0.5 relative flex items-center justify-center">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={confirmed}
                onChange={(e) => hasScrolled && setConfirmed(e.target.checked)}
                disabled={!hasScrolled}
              />
              <div className="w-5 h-5 border-2 border-slate-600 rounded bg-slate-950 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors" />
              <CheckCircle2 className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
              I have read and agree to the tournament rules and code of conduct.
            </span>
          </label>
          {!hasScrolled && <p className="text-xs text-yellow-500 mt-2 ml-8">Please scroll to the end of the rules to enable acknowledgment.</p>}
        </div>
        </div>
        </>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!confirmed || isSubmitting || registration?.status === 'correction_requested'}>
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isSubmitting ? 'Processing...' : 'Continue to Confirmation'}
        </Button>
      </div>
    </div>
  );
}
