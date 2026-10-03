import React, { useState } from 'react';
import { 
  X, ShieldAlert, CheckCircle, AlertTriangle, AlertOctagon, Info,
  Eye, CornerUpLeft, MessageSquare, History, FileText, ChevronRight,
  TrendingUp, Scaling, Check, XCircle, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export function DisputeDetailDrawer({ 
  disputeId, 
  disputes, 
  onClose,
  onResolve,
  onIssueWarning,
  onTournamentAction
}) {
  const [resolutionType, setResolutionType] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [correctionValue, setCorrectionValue] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [lightboxImage, setLightboxImage] = useState(null);

  const dispute = disputes?.find(d => d.id === disputeId);

  // Reset form when dispute changes
  React.useEffect(() => {
    if (dispute) {
      setResolutionType('');
      setResolutionNote('');
      if (dispute.linkedResult?.kills) {
        setCorrectionValue(dispute.linkedResult.kills.toString());
      }
      setActiveTab('details');
    }
  }, [dispute]);

  if (!disputeId || !dispute) return null;

  const isResolved = dispute.status.includes('Resolved') || dispute.status === 'Dismissed';
  
  const handleFinalizeDecision = () => {
    if (resolutionNote.trim().length < 30) return;
    
    onResolve(dispute.id, {
      type: resolutionType,
      note: resolutionNote,
      correction: resolutionType === 'Override — Correction Made' ? correctionValue : null
    });
  };

  const renderBadge = (status) => {
    const isEscalated = status === 'Escalated';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        isEscalated ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
        status.includes('Resolved') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
        status === 'Dismissed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      }`}>
        {isEscalated && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
        {status}
      </span>
    );
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-slate-900 border-l border-slate-700 shadow-2xl shadow-black flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <ShieldAlert className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-black text-white">{dispute.referenceNumber}</h2>
                  {renderBadge(dispute.status)}
                  {dispute.priority === 'Critical' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">
                      Critical Priority
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  {dispute.type} • Escalated {new Date(dispute.escalatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 hidden sm:block">
                Final Super Admin Review
              </span>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 px-6 border-b border-slate-800 bg-slate-900">
            {[
              { id: 'details', label: 'Dispute Details' },
              { id: 'evidence', label: 'Evidence', count: dispute.evidence?.length || 0 },
              { id: 'history', label: 'Audit History', count: dispute.history?.length || 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    activeTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
            
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Context & Information */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Escalation Context */}
                  <div className="bg-purple-950/20 border border-purple-900/50 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <CornerUpLeft className="w-4 h-4" /> Why was this escalated?
                    </h3>
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/20 p-2 rounded-lg shrink-0">
                        <AlertTriangle className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white mb-1">{dispute.escalationReason}</p>
                        <p className="text-sm text-slate-300">
                          {dispute.escalationReason === 'Captain Appeal' && "The Team Captain appealed the Tournament Director's decision. Super Admin review required for final determination."}
                          {dispute.escalationReason === 'Conflict of Interest' && "Flagged for potential conflict of interest involving the organizer. Neutral review required."}
                          {dispute.escalationReason === 'Unresolved >24h' && "SLA breached. This dispute remained unresolved for over 24 hours during an active tournament phase."}
                          {dispute.escalationReason === 'DQ Appeal' && "Disqualification appeals automatically require elevated review depending on issuer hierarchy."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disputing Parties */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Disputing Team</h4>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={dispute.teamLogo} alt="" className="w-10 h-10 rounded-lg bg-slate-800" />
                        <div>
                          <p className="text-sm font-bold text-white">{dispute.teamName}</p>
                          <p className="text-xs text-slate-400">ID: {dispute.teamId}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Captain</span>
                          <span className="font-medium text-slate-300">{dispute.captain}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Tournament & Org</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Tournament</p>
                          <p className="text-sm font-bold text-white">{dispute.tournamentName}</p>
                          <p className="text-xs text-blue-400">{dispute.game}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                          <p className="text-xs text-slate-500 mb-0.5">Organization</p>
                          <p className="text-sm font-bold text-white">{dispute.organizationName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DQ Context if applicable */}
                  {dispute.dqStatus && (
                    <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-red-400 mb-3 uppercase tracking-wider">Disqualification Status</h3>
                      <div className="flex items-start gap-4">
                        <div className="bg-red-500/20 p-2 rounded-lg shrink-0">
                          <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500 text-white mb-2">
                            Currently Disqualified
                          </span>
                          <p className="text-sm font-bold text-white mb-1">Reason: "{dispute.dqStatus.reason}"</p>
                          <p className="text-xs text-slate-400">
                            Issued by {dispute.dqStatus.issuedBy} at {new Date(dispute.dqStatus.issuedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-slate-300 mb-4">Dispute Description</h3>
                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-sm text-slate-300 mb-4">
                      {dispute.description}
                    </div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2">Requested Resolution</h4>
                    <p className="text-sm font-medium text-white p-3 bg-blue-950/20 border border-blue-900/30 rounded-lg">
                      {dispute.requestedResolution}
                    </p>
                  </div>

                  {/* Director Decision Comparison */}
                  {dispute.directorResolution && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-slate-700" />
                      <h3 className="text-sm font-bold text-slate-300 mb-4">Tournament Director Decision</h3>
                      
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 font-bold text-sm rounded-lg border border-slate-700">
                          {dispute.directorResolution.decision}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-400 italic mb-4 border-l-2 border-slate-700 pl-3">
                        "{dispute.directorResolution.note}"
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                        <span>Decision by: {dispute.directorResolution.resolvedBy}</span>
                        <span>{new Date(dispute.directorResolution.resolvedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Result Comparison */}
                  {dispute.linkedResult && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <h3 className="text-sm font-bold text-slate-300 mb-4">Result Comparison</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Original Recorded Result</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Placement</span>
                              <span className="text-sm font-bold text-white">{dispute.linkedResult.placement}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-400">Kills</span>
                              <span className="text-sm font-bold text-white">{dispute.linkedResult.kills}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-800">
                              <span className="text-sm text-slate-400">Points</span>
                              <span className="text-sm font-bold text-blue-400">{dispute.linkedResult.points}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-lg">
                          <h4 className="text-xs font-bold text-blue-400 uppercase mb-3">Leaderboard Impact</h4>
                          {dispute.leaderboardImpact ? (
                            <div className="space-y-3">
                              <div>
                                <span className="text-xs text-slate-500 block">Projected Points</span>
                                <span className="text-lg font-black text-emerald-400">{dispute.leaderboardImpact.projectedPointsChange}</span>
                              </div>
                              <div>
                                <span className="text-xs text-slate-500 block">Projected Rank</span>
                                <span className="text-sm font-bold text-white">{dispute.leaderboardImpact.projectedRankChange}</span>
                              </div>
                              {dispute.leaderboardImpact.advancementImpact && (
                                <div className="text-xs font-bold text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20 mt-2">
                                  {dispute.leaderboardImpact.advancementImpact}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">No impact calculated.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Column: Resolution Panel */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    
                    {/* Final State Banner */}
                    {isResolved ? (
                      <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-xl p-5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400 border-b border-emerald-900/30 pb-3">
                          <CheckCircle className="w-5 h-5" />
                          <h3 className="font-black uppercase tracking-wider">FINAL DECISION</h3>
                        </div>
                        
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1.5 bg-slate-950 text-white font-bold text-sm rounded-lg border border-slate-700">
                            {dispute.superAdminResolution.resolution}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-300 italic mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                          "{dispute.superAdminResolution.note}"
                        </p>
                        
                        <div className="text-xs text-slate-500 space-y-1">
                          <p>Resolved by: {dispute.superAdminResolution.resolvedBy}</p>
                          <p>{new Date(dispute.superAdminResolution.resolvedAt).toLocaleString()}</p>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-medium text-slate-400 text-center">
                          No further appeal is available.
                        </div>
                      </div>
                    ) : (
                      /* Resolution Form */
                      <div className="bg-slate-900 border-2 border-blue-500/30 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.1)] overflow-hidden">
                        <div className="bg-blue-500/10 px-5 py-4 border-b border-blue-900/30">
                          <h3 className="font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            Super Admin Resolution
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 font-medium">
                            Super Admin resolutions are final and cannot be appealed.
                          </p>
                        </div>
                        
                        <div className="p-5 space-y-5">
                          
                          {dispute.dqStatus ? (
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-slate-300">Resolution Decision</label>
                              <div className="flex flex-col gap-2">
                                {[
                                  'Uphold Disqualification',
                                  'Overturn Disqualification'
                                ].map(opt => (
                                  <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    resolutionType === opt ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                                  }`}>
                                    <input 
                                      type="radio" 
                                      name="resolution" 
                                      value={opt}
                                      checked={resolutionType === opt}
                                      onChange={(e) => setResolutionType(e.target.value)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      resolutionType === opt ? 'border-blue-500' : 'border-slate-600'
                                    }`}>
                                      {resolutionType === opt && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="text-sm font-bold">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {resolutionType === 'Overturn Disqualification' && (
                                <div className="text-xs font-bold text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                  Team will be reinstated. Leaderboard recalculation required.
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-slate-300">Resolution Decision</label>
                              <div className="flex flex-col gap-2">
                                {[
                                  'Override — Correction Made',
                                  'Confirm Director Decision',
                                  'Dismiss'
                                ].map(opt => (
                                  <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    resolutionType === opt ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                                  }`}>
                                    <input 
                                      type="radio" 
                                      name="resolution" 
                                      value={opt}
                                      checked={resolutionType === opt}
                                      onChange={(e) => setResolutionType(e.target.value)}
                                      className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      resolutionType === opt ? 'border-blue-500' : 'border-slate-600'
                                    }`}>
                                      {resolutionType === opt && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                    </div>
                                    <span className="text-sm font-bold">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {resolutionType === 'Override — Correction Made' && dispute.linkedResult && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
                            >
                              <label className="block text-xs font-bold text-slate-400 uppercase">Correction</label>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <span className="text-xs text-slate-500 block mb-1">Recorded Kills</span>
                                  <div className="h-10 bg-slate-900 border border-slate-700 rounded-lg px-3 flex items-center text-sm text-slate-400">
                                    {dispute.linkedResult.kills}
                                  </div>
                                </div>
                                <div className="flex items-center justify-center pt-5">
                                  <ChevronRight className="w-4 h-4 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-xs text-slate-500 block mb-1">New Kills</span>
                                  <input 
                                    type="number"
                                    value={correctionValue}
                                    onChange={(e) => setCorrectionValue(e.target.value)}
                                    className="w-full h-10 bg-slate-900 border border-blue-500 rounded-lg px-3 text-sm font-bold text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {resolutionType === 'Confirm Director Decision' && (
                            <div className="text-xs font-bold text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                              No score correction will be applied. The Tournament Director's decision stands.
                            </div>
                          )}

                          {resolutionType && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <label className="block text-sm font-bold text-slate-300 mb-2">Resolution Note</label>
                              <textarea 
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                placeholder="Explain your decision clearly. State what evidence you reviewed and why you reached this final decision."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
                              />
                              <div className="flex justify-end mt-1.5">
                                <span className={`text-[10px] font-bold ${
                                  resolutionNote.trim().length >= 30 
                                    ? (resolutionNote.length > 1000 ? 'text-red-500' : 'text-emerald-500') 
                                    : 'text-slate-500'
                                }`}>
                                  {resolutionNote.length} / 1000 chars (30 min)
                                </span>
                              </div>
                              
                              <button 
                                onClick={handleFinalizeDecision}
                                disabled={resolutionNote.trim().length < 30 || resolutionNote.length > 1000}
                                className="w-full mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                              >
                                Finalize Decision
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Administrative Actions */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Administrative Actions</h4>
                      
                      <button 
                        onClick={() => onIssueWarning(dispute)}
                        className="flex items-center justify-between px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white">Issue Platform Warning/Ban</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>

                      <button 
                        onClick={() => onTournamentAction(dispute)}
                        className="flex items-center justify-between px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white">Tournament Integrity Action</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Evidence Tab */}
            {activeTab === 'evidence' && (
              <div className="space-y-6">
                {!dispute.evidence || dispute.evidence.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-xl text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No evidence submitted</h3>
                    <p className="text-slate-400 text-sm">No screenshots or files were attached to this dispute.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dispute.evidence.map(ev => (
                      <div key={ev.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
                        <div 
                          className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
                          onClick={() => setLightboxImage(ev.url)}
                        >
                          <img src={ev.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                            <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur text-white text-xs font-bold rounded-lg flex items-center gap-2">
                              <Scaling className="w-4 h-4" /> Expand
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                              {ev.type}
                            </span>
                            <span className="text-xs text-slate-500">{new Date(ev.submittedAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm font-medium text-white mb-1">{ev.description || 'No description provided.'}</p>
                          <p className="text-xs text-slate-500">Submitted by: {ev.submittedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audit History Tab */}
            {activeTab === 'history' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" /> Lifecycle Events
                  </h3>
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                    View Full Audit Log <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
                  {dispute.history?.map((event, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700" />
                      <div className="mb-1 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-bold text-white">{event.newStatus}</span>
                        <span className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{event.note}</p>
                      <div className="text-xs text-slate-500 font-medium">
                        By: <span className="text-slate-300">{event.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={lightboxImage} 
              alt="Evidence" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10 shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
