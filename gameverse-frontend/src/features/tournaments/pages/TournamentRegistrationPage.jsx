import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AuroraBackground } from '../../../components/ui/aurora-background';
import { Button } from '../../../components/ui/button';
import { Check, X, AlertTriangle } from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { useTournamentById } from '../api/useTournamentById';
import { useGetUserTeams } from '../../teams/api/useTeamQueries';
import { useRegisterTeam } from '../api/useRegistrationQueries';

import { RegistrationStepper } from '../components/registration/RegistrationStepper';
import { SelectTeamStep } from '../components/registration/SelectTeamStep';
import { VerifyRosterStep } from '../components/registration/VerifyRosterStep';
import { ReviewRegistrationStep } from '../components/registration/ReviewRegistrationStep';
import { ConfirmRegistrationStep } from '../components/registration/ConfirmRegistrationStep';

export function TournamentRegistrationPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [registrationId, setRegistrationId] = useState(null);

  // Tournament Data
  const { data: tournament, isLoading: isTourneyLoading, error: tourneyError } = useTournamentById(tournamentId);

  // User Teams
  const { data: userTeamsData, isLoading: isTeamsLoading } = useGetUserTeams(0, 50);
  const userTeams = userTeamsData?.content || [];
  
  const { mutateAsync: registerTeam, isPending: isRegistering } = useRegisterTeam();

  // Authorization & Validation
  const isCaptain = userTeams.some(t => t.captain?.userId === user?.userId || t.captain?.userId === user?.id);
  
  if (!isAuthenticated) {
    // Return URL handling if supported, else just login
    return <Navigate to="/auth/login" replace />;
  }

  if (isTourneyLoading) {
    return (
      <AuroraBackground>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </AuroraBackground>
    );
  }

  if (tourneyError || !tournament) {
    return (
      <AuroraBackground>
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-slate-500 mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Tournament not found</h1>
          <p className="text-slate-400 mb-8">The tournament you're looking for doesn't exist or is no longer available.</p>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </AuroraBackground>
    );
  }

  if (!isCaptain) {
    // If authenticated but not a captain, redirect to tournament page
    return <Navigate to={`/t/${tournament.slug || tournament.tournamentId || tournament.id}`} replace />;
  }

  // Registration Open Check
  // The prompt says: "Relevant states may include: DRAFT PUBLISHED REGISTRATION_OPEN ..."
  // "Only allow normal registration when registration is open."
  // Note: in mockData.js, the status is sometimes "upcoming", "live", etc.
  const isRegistrationOpen = tournament.status?.toLowerCase() === 'registration_open' || tournament.status?.toLowerCase() === 'upcoming';
  
  if (!isRegistrationOpen) {
    return (
      <AuroraBackground>
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Registration is closed</h1>
          <p className="text-slate-400 mb-8">This tournament is not currently accepting team registrations.</p>
          <Button onClick={() => navigate(`/t/${tournament.slug || tournament.tournamentId || tournament.id}`)}>View Tournament</Button>
        </div>
      </AuroraBackground>
    );
  }
  
  // Registration Deadline Check
  if (tournament.registrationClosesAt && new Date(tournament.registrationClosesAt) < new Date()) {
    return (
      <AuroraBackground>
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Registration closed</h1>
          <p className="text-slate-400 mb-8">This tournament is no longer accepting registrations.</p>
          <Button onClick={() => navigate(`/t/${tournament.slug || tournament.tournamentId || tournament.id}`)}>View Tournament</Button>
        </div>
      </AuroraBackground>
    );
  }
  
  // Capacity Check
  if (tournament.isFull && !tournament.waitlistEnabled) {
    return (
      <AuroraBackground>
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Registration full</h1>
          <p className="text-slate-400 mb-8">This tournament has reached its team capacity.</p>
          <Button onClick={() => navigate(`/t/${tournament.slug || tournament.tournamentId || tournament.id}`)}>View Tournament</Button>
        </div>
      </AuroraBackground>
    );
  }

  // Handle duplicate registrations dynamically if they selected a team
  if (selectedTeamId && currentStep === 1) {
    const existingRegistration = getRegistration(tournament.id, selectedTeamId);
    if (existingRegistration) {
      return (
        <AuroraBackground>
          <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
            <Check className="w-16 h-16 text-blue-500 mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">Already registered</h1>
            <p className="text-slate-400 mb-8">This team is already registered for this tournament.</p>
            <Button onClick={() => navigate(`/tournaments/${tournament.tournamentId || tournament.id}/my-registration`)}>View Registration</Button>
          </div>
        </AuroraBackground>
      );
    }
  }

  const selectedTeam = userTeams.find(t => t.teamId === selectedTeamId);

  const handleSelectTeamNext = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    // Moved to ConfirmRegistrationStep component directly since we have the hook there,
    // or we can pass it down. ConfirmRegistrationStep handles payment and confirm.
    // For now we will rely on the inner step's hooks.
    navigate(`/tournaments/${tournament.tournamentId || tournament.id}/my-registration`);
  };

  return (
    <AuroraBackground className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">Register Your Team</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">{tournament.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Registration Open
            </span>
            <span className="text-slate-600">•</span>
            <span className="font-medium">{tournament.game}</span>
            {tournament.registrationClosesAt && (
              <>
                <span className="text-slate-600">•</span>
                <span>
                  Closes {new Date(tournament.registrationClosesAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <RegistrationStepper currentStep={currentStep} />
          
          <div className="mt-8">
            {currentStep === 1 && (
              <SelectTeamStep 
                tournament={tournament} 
                userTeams={userTeams}
                selectedTeamId={selectedTeamId}
                onSelectTeam={setSelectedTeamId}
                onNext={handleSelectTeamNext}
                isLoading={isRegistering}
              />
            )}
            
            {currentStep === 2 && selectedTeam && (
              <VerifyRosterStep 
                tournament={tournament}
                team={selectedTeam}
                registrationId={registrationId}
                setRegistrationId={setRegistrationId}
                registerTeam={registerTeam}
                isRegistering={isRegistering}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && selectedTeam && (
              <ReviewRegistrationStep 
                tournament={tournament}
                team={selectedTeam}
                registrationId={registrationId}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && selectedTeam && (
              <ConfirmRegistrationStep 
                tournament={tournament}
                team={selectedTeam}
                registrationId={registrationId}
                onSuccess={handleSubmit}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
                Registration Summary
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tournament</p>
                  <p className="text-sm font-medium text-white">{tournament.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Game</p>
                  <p className="text-sm font-medium text-white">{tournament.game}</p>
                </div>
                
                {selectedTeam && (
                  <>
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">Team</p>
                      <p className="text-sm font-medium text-white">{selectedTeam.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Roster</p>
                      <p className="text-sm font-medium text-white">{selectedTeam.roster?.length || 0} Members</p>
                    </div>
                  </>
                )}
                
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentStep === 4 ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm font-medium text-white">
                      {currentStep === 4 ? 'Ready to Confirm' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
                Registration Eligibility
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">You are a Team Captain</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">Tournament registration is open</span>
                </li>
                <li className="flex items-start gap-2">
                  {selectedTeam ? <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />}
                  <span className={`text-sm ${selectedTeam ? 'text-slate-300' : 'text-slate-500'}`}>You have selected an eligible team</span>
                </li>
                <li className="flex items-start gap-2">
                  {currentStep >= 3 ? <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />}
                  <span className={`text-sm ${currentStep >= 3 ? 'text-slate-300' : 'text-slate-500'}`}>Your team has a valid roster</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
