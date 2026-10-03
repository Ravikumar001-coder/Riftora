import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle2, User, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useGetRegistrationRoster } from '../../api/useRegistrationQueries';

export function VerifyRosterStep({ tournament, team, registrationId, setRegistrationId, registerTeam, isRegistering, onNext, onBack }) {
  const navigate = useNavigate();

  const requiredMain = tournament.maxTeamsPerMatch ? 4 : 4; 
  const requiredSub = 1;

  // Local state for the registration roster setup
  const [rosterConfig, setRosterConfig] = useState([]);
  const [apiError, setApiError] = useState(null);
  
  // If we already have a registrationId, fetch it to pre-populate (optional), 
  // but for simplicity, we initialize from team.roster if empty.
  const { data: existingRoster, isLoading: isLoadingExisting } = useGetRegistrationRoster(registrationId, {
    enabled: !!registrationId
  });

  useEffect(() => {
    if (existingRoster && existingRoster.length > 0) {
      setRosterConfig(existingRoster.map(r => ({
        teamMemberId: team.roster?.find(m => m.user?.userId === r.userId)?.memberId || '', // Need memberId
        inGameUid: r.inGameUid,
        inGameName: r.inGameName,
        role: r.role,
        userId: r.userId,
        selected: true
      })));
    } else if (team.roster && rosterConfig.length === 0) {
      setRosterConfig(team.roster.map(member => ({
        teamMemberId: member.memberId,
        inGameUid: member.inGameUid || '',
        inGameName: member.inGameName || member.user?.displayName || '',
        role: member.role === 'substitute' ? 'substitute' : 'player',
        userId: member.user?.userId,
        selected: true
      })));
    }
  }, [team.roster, existingRoster]);

  const handleUpdateConfig = (memberId, field, value) => {
    setRosterConfig(prev => prev.map(m => 
      m.teamMemberId === memberId ? { ...m, [field]: value } : m
    ));
  };

  const selectedPlayers = rosterConfig.filter(m => m.selected);
  const mainPlayers = selectedPlayers.filter(p => p.role === 'player' || p.role === 'captain');
  const subs = selectedPlayers.filter(p => p.role === 'substitute');

  const hasEnoughMain = mainPlayers.length >= requiredMain;
  
  // Validate UID formats based on tournament game regex
  let allUidsValid = true;
  let uidRegex = null;
  if (tournament.game?.uidRegex) {
    try { uidRegex = new RegExp(tournament.game.uidRegex); } catch (e) {}
  }
  
  if (uidRegex) {
    for (let player of selectedPlayers) {
      if (!uidRegex.test(player.inGameUid)) {
        allUidsValid = false;
        break;
      }
    }
  }

  const isRosterValid = hasEnoughMain && allUidsValid;

  const handleContinue = async () => {
    if (!registrationId) {
      try {
        const payload = {
          tournamentId: tournament.tournamentId || tournament.id,
          teamId: team.teamId,
          teamMembers: selectedPlayers.map(p => ({
            teamMemberId: p.teamMemberId,
            inGameUid: p.inGameUid,
            role: p.role
          }))
        };
        const data = await registerTeam(payload);
        setRegistrationId(data.registrationId);
        setApiError(null);
        onNext();
      } catch (err) {
        console.error("Failed to create registration", err);
        setApiError(err.response?.data?.message || err.message || "Failed to submit roster. Please try again.");
      }
    } else {
      // If already created, maybe we should update it, but for now we just proceed
      onNext();
    }
  };

  if (isLoadingExisting && registrationId) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Verify & Configure Roster</h2>
        <p className="text-slate-400">Select players, update their UIDs if necessary, and assign substitutes.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Shield className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white">{team.name}</h3>
              <p className="text-xs text-slate-400">{team.tag}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-300">
              <span className={hasEnoughMain ? "text-green-500" : "text-red-500"}>
                {mainPlayers.length}
              </span>
              {' '}/ {requiredMain} Main Players
            </p>
            <p className="text-xs text-slate-500">{subs.length} / {requiredSub} Substitute</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {rosterConfig.map((player) => {
              const originalMember = team.roster?.find(m => m.memberId === player.teamMemberId);
              const isValidUid = uidRegex ? uidRegex.test(player.inGameUid) : player.inGameUid?.length > 0;
              
              return (
                <div key={player.teamMemberId} className={`flex flex-col sm:flex-row gap-4 p-4 rounded-lg border ${player.selected ? 'bg-slate-950/80 border-blue-900/50' : 'bg-slate-950/30 border-slate-800 opacity-60'}`}>
                  
                  <div className="flex items-center gap-3 w-full sm:w-1/3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 cursor-pointer"
                      checked={player.selected}
                      onChange={(e) => handleUpdateConfig(player.teamMemberId, 'selected', e.target.checked)}
                    />
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate">{originalMember?.user?.displayName || player.inGameName}</p>
                      <p className="text-xs text-slate-500 truncate">@{originalMember?.user?.username}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-2/3">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">In-Game UID</label>
                      <Input 
                        value={player.inGameUid}
                        onChange={(e) => handleUpdateConfig(player.teamMemberId, 'inGameUid', e.target.value)}
                        className={`h-9 bg-slate-900 border-slate-700 text-sm ${player.selected && !isValidUid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        placeholder="Enter UID"
                        disabled={!player.selected}
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="text-xs text-slate-500 mb-1 block">Role</label>
                      <Select 
                        value={player.role} 
                        onValueChange={(val) => handleUpdateConfig(player.teamMemberId, 'role', val)}
                        disabled={!player.selected}
                      >
                        <SelectTrigger className="h-9 bg-slate-900 border-slate-700 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="player">Main</SelectItem>
                          <SelectItem value="substitute">Substitute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!isRosterValid && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-1">Configuration Incomplete</h4>
            <ul className="text-sm text-red-300/80 space-y-1 list-disc pl-4">
              {!hasEnoughMain && (
                <li>Need at least {requiredMain} main players. Currently selected: {mainPlayers.length}.</li>
              )}
              {!allUidsValid && (
                <li>One or more selected players have invalid UIDs for this game format.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {apiError && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-start gap-3 mt-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-1">Submission Failed</h4>
            <p className="text-sm text-red-300/80">{apiError}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button variant="outline" onClick={onBack} disabled={isRegistering}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!isRosterValid || isRegistering}>
          {isRegistering ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
          ) : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
}
