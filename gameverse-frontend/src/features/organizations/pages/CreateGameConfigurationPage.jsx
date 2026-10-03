import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrganizationBySlugQuery } from '../api/useOrganizationQueries';
import { useGameConfigurationTemplateMutations } from '../api/useGameConfigurationTemplateMutations';
import { useGames } from '../../games/hooks/useGameQueries';
import { ChevronRight, Save, X, Settings, Trophy, Shield, GitBranch, List, Map, Gamepad2, Users, AlertTriangle, Crosshair } from 'lucide-react';
import { GameConfigSidebar } from '../components/game-config/GameConfigSidebar';
import { toast } from 'react-hot-toast';

import { BasicInfoSection } from '../components/game-config/sections/BasicInfoSection';
import { MatchFormatSection } from '../components/game-config/sections/MatchFormatSection';
import { TournamentStructureSection } from '../components/game-config/sections/TournamentStructureSection';
import { ScoringSection } from '../components/game-config/sections/ScoringSection';
import { TiebreakerSection } from '../components/game-config/sections/TiebreakerSection';
import { MapPoolSection } from '../components/game-config/sections/MapPoolSection';
import { LobbyRulesSection } from '../components/game-config/sections/LobbyRulesSection';
import { RulesSection } from '../components/game-config/sections/RulesSection';

export function CreateGameConfigurationPage() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const { data: orgData } = useOrganizationBySlugQuery(orgSlug);
  const { data: games = [] } = useGames();
  const { createTemplate } = useGameConfigurationTemplateMutations();

  const [activeTab, setActiveTab] = useState('basic');
  
  // Master Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gameId: '',
    matchFormat: { type: 'LEAGUE', teamsPerMatch: 16, teamSize: 4, perspective: 'TPP' },
    tournamentStructure: { stages: [] },
    scoringSystem: { killPoints: 1, placementPoints: {} },
    tiebreakers: [],
    mapPool: [],
    mapRotation: [],
    inGameRules: {},
    rosterRules: {},
    lobbyRules: {},
    advancementRules: {},
    matchRules: {},
    resultRules: {},
    championRush: { enabled: false, pointsThreshold: 80 }
  });

  const selectedGame = games.find(g => (g.gameId || g.game_id) === formData.gameId);
  const gameName = selectedGame?.gameName || selectedGame?.game_name;
  const isFreeFire = gameName?.toLowerCase()?.includes('free fire') || false;
  const isBGMI = gameName?.toLowerCase()?.includes('bgmi') || gameName?.toLowerCase()?.includes('battlegrounds');

  const handleSave = () => {
    if (!formData.name || !formData.gameId) {
      toast.error("Name and Game are required.");
      return;
    }
    
    // Map to backend expected JSON schema (CreateGameConfigurationTemplateRequest)
    const requestData = {
      orgId: orgData.orgId,
      gameId: formData.gameId,
      name: formData.name,
      description: formData.description,
      matchFormat: formData.matchFormat,
      tournamentStructure: formData.tournamentStructure,
      scoringSystem: formData.scoringSystem,
      tiebreakers: formData.tiebreakers,
      mapPool: formData.mapPool,
      mapRotation: formData.mapRotation,
      inGameRules: formData.inGameRules,
      rosterRules: formData.rosterRules,
      lobbyRules: formData.lobbyRules,
      advancementRules: formData.advancementRules,
      resultRules: formData.resultRules,
      championRush: isFreeFire ? formData.championRush : null,
    };

    createTemplate.mutate({
      orgId: orgData.orgId,
      data: requestData
    }, {
      onSuccess: () => {
        toast.success("Template saved successfully.");
        navigate(`/organizations/${orgSlug}/manage/game-configurations`);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      {/* Background Effects (Subtle, professional) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="relative z-10">
        <nav className="flex items-center text-sm text-slate-500 font-medium mb-6 px-2 lg:px-0 pt-4">
          <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{orgData?.orgName || orgSlug}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={`/organizations/${orgSlug}/manage/game-configurations`} className="hover:text-white transition-colors">Game Configurations</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-blue-500">Create Template</span>
        </nav>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-2 lg:px-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create Game Configuration Template</h1>
            <p className="text-slate-400 max-w-2xl text-sm">Define a reusable master ruleset for tournaments.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
            <button onClick={() => navigate(-1)} className="px-5 py-2 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2 text-sm shadow-[0_0_10px_rgba(37,99,235,0.2)]">
              <Save className="w-4 h-4" /> Save Template
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start px-2 lg:px-0">
          {/* Left Sidebar */}
          <GameConfigSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isFreeFire={isFreeFire} 
          />

          {/* Right Active Workspace */}
          <div className="flex-1 w-full flex flex-col gap-8">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 lg:p-8 backdrop-blur-sm min-h-[500px]">
               {activeTab === 'basic' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Settings className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Basic Information</h2>
                        <p className="text-sm text-slate-400">Set the name, game, and description for this template.</p>
                      </div>
                    </div>
                    <BasicInfoSection formData={formData} setFormData={setFormData} games={games} />
                 </div>
               )}
               {activeTab === 'format' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Trophy className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Match Format</h2>
                        <p className="text-sm text-slate-400">Define the default competitive match configuration for this template.</p>
                      </div>
                    </div>
                    <MatchFormatSection formData={formData} setFormData={setFormData} isBGMI={isBGMI} isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'structure' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <GitBranch className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Tournament Structure</h2>
                        <p className="text-sm text-slate-400">Design the multi-stage roadmap for your tournament progression.</p>
                      </div>
                    </div>
                    <TournamentStructureSection formData={formData} setFormData={setFormData} />
                 </div>
               )}
               {activeTab === 'scoring' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Scoring System</h2>
                        <p className="text-sm text-slate-400">Configure the placement and elimination points matrix.</p>
                      </div>
                    </div>
                    <ScoringSection formData={formData} setFormData={setFormData} isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'tiebreakers' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <List className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Tiebreaker Hierarchy</h2>
                        <p className="text-sm text-slate-400">Determine how ties are resolved. Enable or disable rules below, and use arrows to reorder priority.</p>
                      </div>
                    </div>
                    <TiebreakerSection formData={formData} setFormData={setFormData} />
                 </div>
               )}
               {activeTab === 'maps' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Map className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Map Pool & Rotation</h2>
                        <p className="text-sm text-slate-400">Configure the maps available for this template and their default rotation sequence.</p>
                      </div>
                    </div>
                    <MapPoolSection formData={formData} setFormData={setFormData} isBGMI={isBGMI} isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'lobby' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Gamepad2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Lobby & Room Rules</h2>
                        <p className="text-sm text-slate-400">Settings for the match lobby and custom room creation.</p>
                      </div>
                    </div>
                    <LobbyRulesSection formData={formData} setFormData={setFormData} />
                 </div>
               )}
               {activeTab === 'in_game' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Gamepad2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">In-Game Rules</h2>
                        <p className="text-sm text-slate-400">Specific settings applied inside the game engine.</p>
                      </div>
                    </div>
                    <RulesSection formData={formData} setFormData={setFormData} ruleKey="inGameRules" isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'roster' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Roster Rules</h2>
                        <p className="text-sm text-slate-400">Requirements for team composition and player eligibility.</p>
                      </div>
                    </div>
                    <RulesSection formData={formData} setFormData={setFormData} ruleKey="rosterRules" isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'advancement' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <GitBranch className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Advancement Rules</h2>
                        <p className="text-sm text-slate-400">Define how teams progress between tournament stages.</p>
                      </div>
                    </div>
                    <RulesSection formData={formData} setFormData={setFormData} ruleKey="advancementRules" isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'results' && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <AlertTriangle className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Result & Dispute Rules</h2>
                        <p className="text-sm text-slate-400">Policies for reporting match results and handling conflicts.</p>
                      </div>
                    </div>
                    <RulesSection formData={formData} setFormData={setFormData} ruleKey="resultRules" isFreeFire={isFreeFire} />
                 </div>
               )}
               {activeTab === 'championRush' && isFreeFire && (
                 <div>
                    <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                         <Crosshair className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Champion Rush</h2>
                        <p className="text-sm text-slate-400">Configure Free Fire specific Match Point format.</p>
                      </div>
                    </div>
                    <RulesSection formData={formData} setFormData={setFormData} ruleKey="championRush" isFreeFire={isFreeFire} />
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
    </div>
  );
}
