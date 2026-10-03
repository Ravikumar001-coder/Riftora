import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, ArrowLeft, AlertTriangle, AlertCircle, 
  MessageSquare, Clock, Paperclip, CheckCircle2, XCircle, 
  ChevronLeft, ChevronRight as ChevronRightIcon, ZoomIn, ZoomOut, RotateCcw, X, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDisputes, mockDisputeStatuses } from '../data/mockDisputes';
import { mockTournamentConfig } from '../data/mockLeaderboard';

// Helper components for UI primitives (using tailwind since we want to avoid over-componentizing)
const Badge = ({ children, className }) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${className}`}>
    {children}
  </span>
);

export function TournamentDisputeDetailPage() {
  const { tournamentId, disputeId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedResolution, setSelectedResolution] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Derived
  const isConflictOfInterest = dispute?.teamId === 'current-user-team-id'; // Simulated
  const isResolved = ['Resolved', 'Dismissed'].includes(dispute?.status);

  // Initialize data
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const foundDispute = mockDisputes.find(d => d.disputeId === disputeId);
    setTimeout(() => {
      if (foundDispute) {
        setDispute({...foundDispute}); // Clone so we can mutate locally
      } else {
        setError('Dispute not found');
      }
      setLoading(false);
    }, 400);
  }, [disputeId]);

  // Lightbox Keyboard Controls
  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }, [lightboxOpen, activeImageIndex, dispute]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = (index) => {
    setActiveImageIndex(index);
    setZoomLevel(1);
    setLightboxOpen(true);
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    if (!dispute?.evidence) return;
    setActiveImageIndex((prev) => (prev === dispute.evidence.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    if (!dispute?.evidence) return;
    setActiveImageIndex((prev) => (prev === 0 ? dispute.evidence.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  // Resolution Actions
  const handleStatusChange = (newStatus) => {
    setDispute(prev => ({ ...prev, status: newStatus }));
  };

  const handleResolve = () => {
    if (resolutionNote.length < 30 || resolutionNote.length > 1000) return;
    
    // Process resolution
    const isCorrection = selectedResolution === 'Correction Made';
    setDispute(prev => ({
      ...prev,
      status: isCorrection ? 'Resolved' : 'Dismissed',
      resolutionOutcome: isCorrection ? 'Resolved — Correction Made' : (selectedResolution === 'No Change' ? 'Resolved — No Change' : 'Dismissed'),
      resolutionNote: resolutionNote,
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'Tournament Director'
    }));
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-6">
        <div className="h-10 w-1/3 bg-slate-800 rounded animate-pulse"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="h-40 bg-slate-800 rounded-xl animate-pulse"></div>
            <div className="h-40 bg-slate-800 rounded-xl animate-pulse"></div>
          </div>
          <div className="w-full lg:w-96 h-96 bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Dispute not found</h2>
        <p className="text-slate-400 mb-6">The dispute may have been removed from the current frontend dataset or the reference is invalid.</p>
        <Link to={`/command-center/${tournamentId}/disputes`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors">
          Back to Disputes
        </Link>
      </div>
    );
  }

  const timeDiffMins = Math.floor((new Date() - new Date(dispute.submittedAt)) / 60000);
  const timeOpenText = timeDiffMins > 60 ? `${Math.floor(timeDiffMins / 60)}h ${timeDiffMins % 60}m` : `${timeDiffMins} minutes`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 pb-24 lg:pb-6">
        
        {/* Breadcrumb & Back */}
        <div className="mb-4">
          <Link to={`/command-center/${tournamentId}/disputes`} className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Disputes
          </Link>
          <nav className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <Link to={`/command-center/${tournamentId}`} className="hover:text-blue-400 transition-colors">Command Center</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <Link to={`/command-center/${tournamentId}/disputes`} className="hover:text-blue-400 transition-colors">Disputes</Link>
            <ChevronRight className="w-3 h-3 mx-2" />
            <span className="text-slate-300">{dispute.referenceNumber}</span>
          </nav>
        </div>

        {/* Page Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{dispute.referenceNumber}</h1>
              {dispute.priority === 'Critical' && (
                <div className="group relative">
                  <Badge className="bg-red-950/80 border border-red-900 text-red-500 cursor-help">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> CRITICAL PRIORITY
                  </Badge>
                  <div className="absolute top-full mt-2 left-0 w-64 bg-slate-800 border border-slate-700 text-slate-300 text-xs p-2 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <strong>Critical</strong><br />This dispute affects the current/next match or involves a potential disqualification.
                  </div>
                </div>
              )}
              {dispute.priority === 'High' && (
                <div className="group relative">
                  <Badge className="bg-amber-950/80 border border-amber-900 text-amber-500 cursor-help">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> HIGH PRIORITY
                  </Badge>
                  <div className="absolute top-full mt-2 left-0 w-64 bg-slate-800 border border-slate-700 text-slate-300 text-xs p-2 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <strong>High Priority</strong><br />This dispute may affect leaderboard standings or advancement.
                  </div>
                </div>
              )}
              {dispute.priority === 'Normal' && (
                <Badge className="bg-slate-800 border border-slate-700 text-slate-400">NORMAL PRIORITY</Badge>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-300 mb-1">{dispute.disputeType}</h2>
            <p className="text-sm text-slate-400">{dispute.teamName} • {dispute.matchName} • {dispute.round}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-400">Status:</span>
            <span className="px-3 py-1 bg-blue-950/30 text-blue-400 border border-blue-900/50 rounded font-bold text-sm">
              {dispute.status}
            </span>
          </div>
        </div>

        {/* Critical Alerts */}
        {dispute.priority === 'Critical' && dispute.status === 'Open' && (
          <div className="bg-red-950 border border-red-900 rounded-xl p-4 mb-6 flex gap-3 items-start">
             <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
             <div>
                <h4 className="font-bold text-red-500">⚠ Critical Dispute</h4>
                <p className="text-sm text-red-300 mt-1">Immediate review recommended. This dispute may affect an active or upcoming match.</p>
                {dispute.currentMatchImpact && <p className="text-sm font-bold text-red-400 mt-2">⚠ May affect {dispute.matchName || 'the current match'}</p>}
             </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          
          {/* Main Content (Left) */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Dispute Information */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-bold text-white text-lg">Dispute Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Team</p>
                  <div className="flex items-center gap-3">
                    {dispute.teamLogo ? (
                      <img src={dispute.teamLogo} alt={dispute.teamName} className="w-10 h-10 rounded-md bg-slate-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center font-bold text-slate-400">{dispute.teamTag}</div>
                    )}
                    <div>
                      <Link to={`/teams/${dispute.teamTag}`} className="font-bold text-blue-400 hover:text-blue-300">{dispute.teamName}</Link>
                      <p className="text-xs text-slate-400">{dispute.teamTag} • {dispute.submittedBy}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Submission</p>
                  <p className="font-bold text-white">{new Date(dispute.submittedAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-400">
                    {isResolved ? 'Resolved' : `Open for ${timeOpenText}`}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Captain's Description</p>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {dispute.description}
                    </p>
                  </div>
                </div>
                {dispute.requestedResolution && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Requested Resolution</p>
                    <div className="bg-blue-950/10 border border-blue-900/30 rounded-lg p-4">
                      <p className="text-sm text-blue-200 whitespace-pre-wrap leading-relaxed">
                        {dispute.requestedResolution}
                      </p>
                    </div>
                  </div>
                )}
                {!dispute.requestedResolution && (
                  <div className="md:col-span-2">
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Requested Resolution</p>
                     <p className="text-sm text-slate-500 italic">No specific resolution requested.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Match Context & Result Comparison */}
            {dispute.matchId && (
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h3 className="font-bold text-white">Match Context</h3>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <h4 className="text-2xl font-black text-white">{dispute.matchName}</h4>
                    <p className="text-slate-400 mb-4">{dispute.round}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded">Completed</span>
                    </div>
                    <Link to={`/command-center/${tournamentId}/matches/${dispute.matchId}`} className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors w-fit">
                      View Match
                    </Link>
                  </div>
                </div>

                {dispute.recordedValues && dispute.claimedValues ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                      <h3 className="font-bold text-white">Result Comparison</h3>
                      <Link to={`/command-center/${tournamentId}/scoring/${dispute.matchId}`} className="text-xs font-bold text-blue-400 hover:text-blue-300">View Result</Link>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4 h-full">
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recorded</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Kills:</span><span className="text-sm font-bold text-white">{dispute.recordedValues.kills}</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Placement:</span><span className="text-sm font-bold text-white">{dispute.recordedValues.placement}</span></div>
                          <div className="pt-2 border-t border-slate-800 flex justify-between items-center"><span className="text-sm font-bold text-slate-300">Points:</span><span className="text-sm font-black text-white">{dispute.recordedValues.points}</span></div>
                        </div>
                      </div>
                      <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Claimed</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Kills:</span><span className="text-sm font-bold text-blue-400">{dispute.claimedValues.kills}</span></div>
                          <div className="flex justify-between items-center"><span className="text-sm text-slate-400">Placement:</span><span className="text-sm font-bold text-blue-400">{dispute.claimedValues.placement}</span></div>
                          <div className="pt-2 border-t border-blue-900/30 flex justify-between items-center"><span className="text-sm font-bold text-slate-300">Potential:</span><span className="text-sm font-black text-blue-400">{dispute.claimedValues.points}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-6 text-slate-500">
                    No result comparison available.
                  </div>
                )}
              </section>
            )}

            {/* Leaderboard Impact */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-white">Leaderboard Impact</h3>
                <Link to={`/command-center/${tournamentId}/leaderboard`} className="text-xs font-bold text-blue-400 hover:text-blue-300">View Leaderboard Impact</Link>
              </div>
              <div className="p-6">
                {dispute.leaderboardImpact && dispute.leaderboardDetails ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-amber-950/10 border border-amber-900/30 rounded-lg p-4 flex items-center justify-between">
                      <div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Position</p>
                         <p className="text-2xl font-black text-white">{dispute.leaderboardDetails.currentPosition}th</p>
                      </div>
                      <ChevronRightIcon className="w-6 h-6 text-slate-600" />
                      <div className="text-right">
                         <p className="text-xs font-bold text-amber-500/70 uppercase tracking-widest mb-1">Potential Position</p>
                         <p className="text-2xl font-black text-amber-500">{dispute.leaderboardDetails.potentialPosition}nd</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Point Difference</p>
                       <p className="text-xl font-bold text-emerald-400">+{dispute.leaderboardDetails.pointDifference} points</p>
                       <p className="text-xs font-bold text-amber-500 flex items-center gap-1 mt-2">
                         <AlertTriangle className="w-3 h-3" /> ⚠ Affects Standings
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400">
                    <p className="font-bold text-white mb-1">No current leaderboard impact</p>
                    <p className="text-sm">This dispute does not currently affect advancement standings.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Evidence Gallery */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-white">Evidence</h3>
                {dispute.evidence?.length > 0 && (
                  <span className="text-xs font-bold text-slate-400">{dispute.evidence.length} evidence files</span>
                )}
              </div>
              <div className="p-6">
                {dispute.evidence?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {dispute.evidence.map((ev, index) => (
                      <button 
                        key={ev.id}
                        onClick={() => openLightbox(index)}
                        className="flex-shrink-0 group relative rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all"
                        aria-label={`View evidence screenshot ${index + 1} of ${dispute.evidence.length}`}
                      >
                        <div className="w-40 h-32 bg-slate-800 relative">
                          <img src={ev.url} alt={`Evidence ${index+1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-6 h-6 text-white mb-1" />
                            <span className="text-xs font-bold text-white">View Full</span>
                          </div>
                        </div>
                        <div className="p-2 bg-slate-950 border-t border-slate-800 text-left">
                          <p className="text-xs font-bold text-slate-300 truncate">Screenshot {index + 1}</p>
                          <p className="text-[10px] text-slate-500 truncate">{new Date(ev.uploadedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="font-bold text-white mb-1">No evidence attached</p>
                    <p className="text-sm text-slate-400">The team did not submit screenshot evidence with this dispute.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Audit Timeline */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-bold text-white">Linked Audit Events</h3>
              </div>
              <div className="p-6">
                {dispute.auditEvents?.length > 0 ? (
                  <div className="relative border-l border-slate-800 ml-3 space-y-6">
                    {dispute.auditEvents.map((event, idx) => (
                      <div key={event.id} className="relative pl-6">
                        <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900"></span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="text-xs font-bold text-white">{event.actor}</span>
                            <Badge className="bg-slate-800 text-slate-300 border border-slate-700 ml-2">{event.action.replace(/_/g, ' ')}</Badge>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{event.summary}</p>
                          {event.hasTechnicalDetails && (
                            <details className="mt-2 group">
                              <summary className="text-xs font-bold text-blue-400 cursor-pointer list-none hover:text-blue-300 flex items-center gap-1">
                                <ChevronRightIcon className="w-3 h-3 group-open:rotate-90 transition-transform" /> View Technical Details
                              </summary>
                              <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">
                                <pre className="text-[10px] text-green-400 font-mono">
                                  {JSON.stringify(JSON.parse(event.technicalDetails), null, 2)}
                                </pre>
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No audit events available.</p>
                )}
              </div>
            </section>

          </div>

          {/* Resolution Panel (Right Sidebar) */}
          <div className="w-full xl:w-96 flex-shrink-0">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden sticky top-6 flex flex-col">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-bold text-white">Resolution</h3>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Status</p>
                  {isResolved ? (
                    <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-emerald-400">{dispute.resolutionOutcome}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-blue-950/30 text-blue-400 border border-blue-900/50 rounded font-bold text-sm">
                        {dispute.status}
                      </span>
                    </div>
                  )}
                </div>

                {isResolved && dispute.resolutionNote && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Resolution Note</p>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{dispute.resolutionNote}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-bold text-slate-500 uppercase mb-1">Resolved By</p>
                        <p className="text-slate-300">{dispute.resolvedBy}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-500 uppercase mb-1">Resolved At</p>
                        <p className="text-slate-300">{new Date(dispute.resolvedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {isConflictOfInterest && !isResolved && (
                  <div className="bg-red-950 border border-red-900 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-red-500 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" /> Conflict of Interest
                    </h4>
                    <p className="text-sm text-red-300">You cannot resolve a dispute involving your own team's results. This dispute requires escalation to the Org Owner.</p>
                    <button className="w-full mt-4 px-4 py-2 bg-red-900 hover:bg-red-800 text-white font-bold rounded-lg transition-colors">
                      Escalate Dispute
                    </button>
                  </div>
                )}

                {dispute.disputeType === 'Disqualification Appeal' && !isResolved && (
                  <div className="bg-amber-950 border border-amber-900 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-amber-500 flex items-center gap-2 mb-2">
                      ⛔ Disqualification Appeal
                    </h4>
                    <p className="text-sm text-amber-300 mb-2">Escalation Required.</p>
                    <p className="text-sm text-amber-400 font-bold">Current DQ Status: Active</p>
                  </div>
                )}

                {!isResolved && !isConflictOfInterest && (
                  <>
                    <div className="mb-6">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Workflow Actions</p>
                      <div className="grid grid-cols-1 gap-2">
                        {dispute.status === 'Open' && (
                          <button 
                            onClick={() => handleStatusChange('Under Review')}
                            className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors text-left"
                          >
                            Mark Under Review
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusChange('Pending Evidence')}
                          className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors text-left flex justify-between items-center"
                        >
                          Request Additional Evidence
                          {dispute.status === 'Pending Evidence' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </button>
                      </div>
                      {dispute.status === 'Pending Evidence' && (
                        <p className="text-xs text-amber-400 mt-2">Waiting for additional evidence</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Decision</p>
                      <div className="space-y-2">
                        {['Correction Made', 'No Change', 'Dismissed'].map(res => (
                          <label key={res} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedResolution === res ? 'bg-blue-950/20 border-blue-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                            <input 
                              type="radio" 
                              name="resolution" 
                              value={res} 
                              checked={selectedResolution === res}
                              onChange={(e) => setSelectedResolution(e.target.value)}
                              className="w-4 h-4 text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-900"
                            />
                            <span className="text-sm font-bold text-white">{res === 'Dismissed' ? 'Dismissed' : `Resolved — ${res}`}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedResolution && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-bold text-slate-300">Resolution Note *</p>
                            <div className="group relative">
                              <Info className="w-4 h-4 text-slate-500 cursor-help" />
                              <div className="absolute bottom-full mb-2 right-0 w-64 bg-slate-800 border border-slate-700 text-slate-300 text-xs p-3 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <strong>Plain Language Guidelines</strong><br />
                                Explain your decision clearly. Your note will be shown to the disputing team. Be specific about what evidence you reviewed and why you made this decision.
                              </div>
                            </div>
                          </div>
                          
                          <textarea 
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            placeholder="Explain your decision..."
                            className="w-full h-32 p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                          />
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs ${resolutionNote.length < 30 ? 'text-red-400' : 'text-slate-500'}`}>
                              {resolutionNote.length < 30 ? 'Minimum 30 characters required.' : ''}
                            </span>
                            <span className={`text-xs ${resolutionNote.length > 1000 ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                              {resolutionNote.length} / 1000
                            </span>
                          </div>

                          {selectedResolution === 'Correction Made' && (
                            <p className="text-xs text-slate-500 italic mt-3 bg-slate-950 p-2 rounded border border-slate-800">
                              Example: Reviewed screenshot evidence. The team clearly had 9 kills. Correcting the recorded kill count from 7 to 9.
                            </p>
                          )}
                          {selectedResolution === 'No Change' && (
                            <p className="text-xs text-slate-500 italic mt-3 bg-slate-950 p-2 rounded border border-slate-800">
                              Example: Reviewed the submitted evidence. The official results screen confirms 7 kills. No correction is warranted.
                            </p>
                          )}
                          
                          {selectedResolution === 'Correction Made' && (
                            <div className="mt-4 bg-amber-950/20 border border-amber-900/50 rounded-lg p-3">
                              <p className="text-xs font-bold text-amber-500 mb-1">⚠ Score Correction</p>
                              <p className="text-xs text-amber-200">This resolution indicates that the recorded result should be corrected. The production system will later recalculate the affected standings.</p>
                            </div>
                          )}

                          <button 
                            onClick={() => setShowConfirmDialog(true)}
                            disabled={resolutionNote.length < 30 || resolutionNote.length > 1000}
                            className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                          >
                            {selectedResolution === 'Correction Made' ? 'Resolve & Apply Correction' : (selectedResolution === 'No Change' ? 'Resolve — No Change' : 'Dismiss Dispute')}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="border-t border-slate-800 pt-4 mt-2">
                       <button className="w-full px-4 py-2 text-slate-400 hover:text-white text-sm font-bold rounded-lg transition-colors text-center border border-transparent hover:border-slate-700">
                         Escalate Dispute
                       </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Evidence Lightbox */}
      <AnimatePresence>
        {lightboxOpen && dispute.evidence && dispute.evidence.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label="Close evidence viewer"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
              <div className="text-white">
                <p className="font-bold">Evidence screenshot {activeImageIndex + 1} of {dispute.evidence.length}</p>
                <p className="text-xs text-slate-400">Uploaded by {dispute.evidence[activeImageIndex].uploadedBy}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoomLevel(prev => prev + 0.5)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Zoom In"><ZoomIn className="w-5 h-5" /></button>
                <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.5))} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
                <button onClick={() => setZoomLevel(1)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Reset Zoom"><RotateCcw className="w-5 h-5" /></button>
                <button onClick={() => setLightboxOpen(false)} className="p-2 text-white hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors ml-4" aria-label="Close"><X className="w-6 h-6" /></button>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
               <motion.img 
                 key={activeImageIndex}
                 src={dispute.evidence[activeImageIndex].url} 
                 alt={`Evidence ${activeImageIndex + 1}`}
                 className="max-w-full max-h-full object-contain"
                 animate={{ scale: zoomLevel }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 drag={zoomLevel > 1}
                 dragConstraints={{ top: -200, bottom: 200, left: -200, right: 200 }}
               />
            </div>

            {/* Navigation */}
            {dispute.evidence.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black text-white rounded-full transition-colors" aria-label="Previous">
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black text-white rounded-full transition-colors" aria-label="Next">
                  <ChevronRightIcon className="w-8 h-8" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Confirm Resolution</h2>
                <p className="text-slate-300 mb-4">
                  You are about to resolve <strong className="text-white">{dispute.referenceNumber}</strong> as:
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
                  <p className="font-bold text-blue-400">Resolved — {selectedResolution}</p>
                </div>
                <p className="text-sm text-slate-400 mb-2">Resolution note:</p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-6 max-h-32 overflow-y-auto">
                  <p className="text-sm text-slate-300 italic">"{resolutionNote}"</p>
                </div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest text-center">
                  This decision is final for the Tournament Director.
                </p>
              </div>
              <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                <button 
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleResolve}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                >
                  Confirm Resolution
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
