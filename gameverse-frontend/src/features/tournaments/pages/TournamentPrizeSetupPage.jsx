import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, Trophy, Plus, MoreVertical, AlertTriangle, 
  CheckCircle2, Save, RefreshCcw, Eye, IndianRupee, GripVertical, Gift
} from 'lucide-react';
import { mockTournamentData } from '../data/mockTournamentOverview';
import { mockPrizeData } from '../data/mockPrizes';

import { useGetTournament } from '../api/useTournamentQueries';
import { useUpdateTournament } from '../api/useTournamentMutations';

export function TournamentPrizeSetupPage() {
  const { tournamentId, orgSlug } = useParams();
  
  const { data: tournament, isLoading } = useGetTournament(tournamentId);
  const { mutate: updateTournament, isPending: isSaving } = useUpdateTournament();

  // State
  const [data, setData] = useState({ prizes: [], additionalRewards: [], totalPrizePool: 0 });
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Modals
  const [prizeModal, setPrizeModal] = useState({ isOpen: false, data: null, type: 'placement' }); // type: placement | additional
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: 'placement' });
  const [previewModal, setPreviewModal] = useState(false);

  // Set initial data when tournament loads
  useEffect(() => {
    if (tournament) {
      setData({
        totalPrizePool: tournament.prizePoolTotal || 0,
        prizes: tournament.prizePositions ? tournament.prizePositions.map((p, index) => ({
          id: p.position,
          position: p.position,
          label: p.label,
          rewardType: 'Cash',
          amount: p.amount,
          percentage: p.percentage,
          category: p.category || 'Standard',
          description: '',
          sponsor: '',
          displayOrder: index
        })) : [],
        additionalRewards: []
      });
    }
  }, [tournament]);

  const t = mockTournamentData; // Keeping mock data for non-prize layout parts temporarily

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Derived State
  const { allocatedAmount, remainingAmount, allocationPercentage, isOverAllocated } = useMemo(() => {
    // Calculate total allocated from both standard prizes and additional cash rewards
    let allocated = 0;
    data.prizes.forEach(p => {
      if (p.rewardType === 'Cash' && p.amount) allocated += parseFloat(p.amount);
    });
    data.additionalRewards.forEach(ar => {
      if (ar.rewardType === 'Cash' && ar.amount) allocated += parseFloat(ar.amount);
    });

    const remaining = data.totalPrizePool - allocated;
    const percentage = data.totalPrizePool > 0 ? (allocated / data.totalPrizePool) * 100 : 0;
    const overAllocated = allocated > data.totalPrizePool;

    return { 
      allocatedAmount: allocated, 
      remainingAmount: remaining, 
      allocationPercentage: Math.min(percentage, 100), 
      isOverAllocated: overAllocated 
    };
  }, [data]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Actions
  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    if (isOverAllocated) {
      showToast('Cannot save: Prize pool is overallocated.', true);
      return;
    }
    
    // Prepare data for API
    const prizePositions = data.prizes.map((p) => ({
      position: p.position,
      label: p.label,
      amount: p.amount || 0,
      percentage: p.percentage || 0,
      category: p.category || 'Standard'
    }));

    updateTournament({
      tournamentId,
      data: { prizePositions, prizePoolTotal: data.totalPrizePool }
    }, {
      onSuccess: () => {
        setIsDirty(false);
        showToast('Prize configuration saved successfully.');
      },
      onError: (err) => {
        showToast(err?.response?.data?.error?.message || 'Failed to save', true);
      }
    });
  };

  const handleReset = () => {
    if (window.confirm("Discard Changes? Your current prize configuration has unsaved changes.")) {
      if (tournament) {
        setData({
          totalPrizePool: tournament.prizePoolTotal || 0,
          prizes: tournament.prizePositions ? tournament.prizePositions.map((p, index) => ({
            id: p.position,
            position: p.position,
            label: p.label,
            rewardType: 'Cash',
            amount: p.amount,
            percentage: p.percentage,
            category: p.category || 'Standard',
            description: '',
            sponsor: '',
            displayOrder: index
          })) : [],
          additionalRewards: []
        });
      }
      setIsDirty(false);
      showToast('Changes discarded.');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.type === 'placement') {
      setData(prev => ({ ...prev, prizes: prev.prizes.filter(p => p.id !== deleteModal.id) }));
    } else {
      setData(prev => ({ ...prev, additionalRewards: prev.additionalRewards.filter(p => p.id !== deleteModal.id) }));
    }
    setDeleteModal({ isOpen: false, id: null, type: null });
    setIsDirty(true);
  };

  // Form Submission Logic (Simplified for mock UI)
  const handlePrizeSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rewardType = formData.get('rewardType');
    const amount = formData.get('amount') ? parseFloat(formData.get('amount')) : 0;
    
    // Basic validation check (would be more robust in reality)
    if (rewardType === 'Cash' && (!amount || amount <= 0)) {
       alert("Please enter a valid amount for Cash rewards.");
       return;
    }

    const newPrize = {
      id: prizeModal.data ? prizeModal.data.id : `new_${Date.now()}`,
      position: formData.get('position'),
      label: formData.get('label') || formData.get('position'),
      rewardType: rewardType,
      amount: rewardType === 'Cash' ? amount : null,
      percentage: rewardType === 'Cash' && data.totalPrizePool > 0 ? (amount / data.totalPrizePool) * 100 : null,
      description: formData.get('description'),
      sponsor: formData.get('sponsor'),
      displayOrder: prizeModal.data ? prizeModal.data.displayOrder : 99 // Should recalculate in real app
    };

    if (prizeModal.type === 'placement') {
      if (prizeModal.data) {
        setData(prev => ({ ...prev, prizes: prev.prizes.map(p => p.id === newPrize.id ? newPrize : p) }));
      } else {
        setData(prev => ({ ...prev, prizes: [...prev.prizes, newPrize] }));
      }
    } else {
      if (prizeModal.data) {
        setData(prev => ({ ...prev, additionalRewards: prev.additionalRewards.map(p => p.id === newPrize.id ? newPrize : p) }));
      } else {
        setData(prev => ({ ...prev, additionalRewards: [...prev.additionalRewards, newPrize] }));
      }
    }

    setIsDirty(true);
    setPrizeModal({ isOpen: false, data: null, type: 'placement' });
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      
      {/* Toasts */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`border shadow-xl rounded-lg px-4 py-3 flex items-center gap-3 ${toastMessage.isError ? 'bg-amber-950 border-amber-900' : 'bg-slate-800 border-slate-700'}`}>
            {toastMessage.isError ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <p className="text-white text-sm font-medium">{toastMessage.msg}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 font-medium mb-6 px-2 lg:px-0">
        <Link to="/dashboard/organizer" className="hover:text-white transition-colors">Organizations</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/organizations/${orgSlug}/manage/overview`} className="hover:text-white transition-colors">{t.name}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to={`/manage/${tournamentId}/overview`} className="hover:text-white transition-colors">Tournaments</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-blue-500">Prizes</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 px-2 lg:px-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Prizes</h1>
          <p className="text-slate-400">Configure tournament rewards and prize distribution.</p>
          <div className="flex items-center gap-3 mt-4 text-sm font-medium">
            <span className="text-white bg-slate-800 px-2 py-1 rounded">{t.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setPreviewModal(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm border border-slate-700">
            <Eye className="w-4 h-4" /> Preview
          </button>
          {isDirty && (
            <button onClick={handleReset} className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
              <RefreshCcw className="w-4 h-4" /> Reset
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={!isDirty || isSaving || isOverAllocated}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] disabled:shadow-none flex items-center gap-2 text-sm"
          >
            {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: Configuration */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Placements Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Prize Distribution</h2>
                <p className="text-sm text-slate-400 mt-1">Define rewards for tournament placements.</p>
              </div>
              <button 
                onClick={() => setPrizeModal({ isOpen: true, data: null, type: 'placement' })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Prize
              </button>
            </div>

            {data.prizes.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
                <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No prizes configured</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">Add placement rewards and additional prizes for this tournament.</p>
                <button 
                  onClick={() => setPrizeModal({ isOpen: true, data: null, type: 'placement' })}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                  Add First Prize
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-slate-800">
                      <tr>
                        <th className="w-12 px-4 py-3"></th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Position</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Reward</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Percentage</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {data.prizes.sort((a,b) => a.displayOrder - b.displayOrder).map((prize) => (
                        <tr key={prize.id} className="hover:bg-slate-800/50 transition-colors group">
                          <td className="px-4 py-4"><GripVertical className="w-4 h-4 text-slate-600 cursor-grab" /></td>
                          <td className="px-4 py-4 text-sm font-bold text-white">{prize.position}</td>
                          <td className="px-4 py-4 text-sm font-medium text-slate-300">{prize.label}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-medium">{prize.rewardType}</span>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-emerald-400 text-right">
                            {prize.rewardType === 'Cash' ? formatCurrency(prize.amount) : '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-400 text-right font-mono">
                            {prize.rewardType === 'Cash' && prize.percentage ? `${prize.percentage.toFixed(1)}%` : '—'}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setPrizeModal({ isOpen: true, data: prize, type: 'placement' })} className="px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded">Edit</button>
                              <button onClick={() => setDeleteModal({ isOpen: true, id: prize.id, type: 'placement' })} className="px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-800">
                  {data.prizes.sort((a,b) => a.displayOrder - b.displayOrder).map((prize) => (
                    <div key={prize.id} className="p-4 bg-slate-900">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-white">{prize.position}</p>
                          <p className="text-xs text-slate-400">{prize.label}</p>
                        </div>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-medium">{prize.rewardType}</span>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div>
                           {prize.rewardType === 'Cash' && (
                             <>
                               <p className="text-lg font-bold text-emerald-400">{formatCurrency(prize.amount)}</p>
                               <p className="text-xs text-slate-500 font-mono">{prize.percentage.toFixed(1)}%</p>
                             </>
                           )}
                           {prize.rewardType !== 'Cash' && (
                             <p className="text-sm font-medium text-slate-300">{prize.description}</p>
                           )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setPrizeModal({ isOpen: true, data: prize, type: 'placement' })} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded">Edit</button>
                          <button onClick={() => setDeleteModal({ isOpen: true, id: prize.id, type: 'placement' })} className="p-2 text-red-400 hover:text-red-300 bg-red-950 rounded">Del</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Additional Rewards Section */}
          <section>
            <div className="flex items-center justify-between mb-4 mt-12">
              <div>
                <h2 className="text-xl font-bold text-white">Additional Rewards</h2>
                <p className="text-sm text-slate-400 mt-1">Special awards outside of standard placements.</p>
              </div>
              <button 
                onClick={() => setPrizeModal({ isOpen: true, data: null, type: 'additional' })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Reward
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.additionalRewards.map(reward => (
                <div key={reward.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col group relative">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => setPrizeModal({ isOpen: true, data: reward, type: 'additional' })} className="text-xs font-medium text-blue-400 hover:underline">Edit</button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: reward.id, type: 'additional' })} className="text-xs font-medium text-red-400 hover:underline">Delete</button>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{reward.position}</span>
                    <h4 className="text-lg font-bold text-white mt-1">{reward.label}</h4>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-end">
                    <div>
                      {reward.rewardType === 'Cash' ? (
                        <p className="text-xl font-bold text-emerald-400">{formatCurrency(reward.amount)}</p>
                      ) : (
                        <p className="text-sm font-medium text-slate-300 flex items-center gap-2"><Gift className="w-4 h-4 text-purple-400" /> {reward.description}</p>
                      )}
                    </div>
                    {reward.sponsor && (
                      <p className="text-[10px] uppercase text-slate-500 font-bold bg-slate-950 px-2 py-1 rounded">Sponsored by {reward.sponsor}</p>
                    )}
                  </div>
                </div>
              ))}
              {data.additionalRewards.length === 0 && (
                <div className="col-span-full text-center py-8 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-sm text-slate-500">No additional rewards configured.</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Summary */}
        <div className="w-full space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sticky top-24">
            
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" /> Prize Pool Summary
            </h3>

            <div className="space-y-6">
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Prize Pool</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(data.totalPrizePool)}</p>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-emerald-400">Allocated {allocationPercentage.toFixed(0)}%</span>
                  {isOverAllocated ? (
                    <span className="text-red-400">Overallocated!</span>
                  ) : (
                    <span className="text-slate-500">{Math.max(0, 100 - allocationPercentage).toFixed(0)}% Remaining</span>
                  )}
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-500 ${isOverAllocated ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(allocationPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Allocated</p>
                  <p className={`text-lg font-bold ${isOverAllocated ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(allocatedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Remaining</p>
                  <p className={`text-lg font-bold ${remainingAmount < 0 ? 'text-red-400' : 'text-white'}`}>
                    {remainingAmount < 0 ? `-${formatCurrency(Math.abs(remainingAmount))}` : formatCurrency(remainingAmount)}
                  </p>
                </div>
              </div>

            </div>

            {isOverAllocated && (
              <div className="mt-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 font-medium">
                  Prize amount exceeds the total prize pool. Please adjust allocations before saving.
                </p>
              </div>
            )}
            
            {isDirty && !isOverAllocated && (
              <div className="mt-6 p-4 bg-amber-950/30 border border-amber-900/50 rounded-lg">
                <p className="text-sm text-amber-400 font-medium flex justify-between items-center">
                  Unsaved changes 
                  <button onClick={handleSave} className="text-xs bg-amber-500/20 px-2 py-1 rounded hover:bg-amber-500/30">Save</button>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Prize Form Modal */}
      {prizeModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPrizeModal({ isOpen: false, data: null, type: 'placement' })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg relative z-10 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">
              {prizeModal.data ? 'Edit Prize' : (prizeModal.type === 'placement' ? 'Add Placement Prize' : 'Add Additional Reward')}
            </h3>
            
            <form onSubmit={handlePrizeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Placement / Position</label>
                  <input name="position" required type="text" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:border-blue-500" placeholder={prizeModal.type === 'placement' ? "e.g. 1st Place" : "e.g. MVP"} defaultValue={prizeModal.data?.position} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Reward Type</label>
                  <select name="rewardType" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:border-blue-500" defaultValue={prizeModal.data?.rewardType || 'Cash'}>
                    <option value="Cash">Cash</option>
                    <option value="Physical">Physical Prize</option>
                    <option value="Sponsor">Sponsor Reward</option>
                    <option value="Custom">Custom Reward</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Reward Name / Label</label>
                <input name="label" type="text" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:border-blue-500" placeholder="e.g. Champion" defaultValue={prizeModal.data?.label} />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div className="col-span-2 mb-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Configuration</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Amount (Fixed)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                    <input name="amount" type="number" min="0" step="any" className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 pl-8 focus:border-blue-500" placeholder="0" defaultValue={prizeModal.data?.amount} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Or Description (Non-cash)</label>
                  <input name="description" type="text" className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500" placeholder="e.g. Gaming Headset" defaultValue={prizeModal.data?.description} />
                </div>
              </div>

              {prizeModal.type === 'additional' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Sponsor (Optional)</label>
                  <input name="sponsor" type="text" className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 focus:border-blue-500" placeholder="e.g. Logitech" defaultValue={prizeModal.data?.sponsor} />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800 mt-6">
                <button type="button" onClick={() => setPrizeModal({ isOpen: false, data: null, type: 'placement' })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg">Save Prize</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDeleteModal({ isOpen: false, id: null, type: null })}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm relative z-10 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Prize?</h3>
            <p className="text-sm text-slate-400 mb-6">Are you sure you want to remove this prize? This change will affect the current prize distribution.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null, type: null })} className="px-4 py-2 text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg font-medium flex-1">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex-1">Delete Prize</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setPreviewModal(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-b from-blue-900/20 to-slate-900 border-b border-slate-800 text-center relative">
               <button onClick={() => setPreviewModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
               <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Tournament Prize Pool</p>
               <h2 className="text-4xl font-black text-white tracking-tight">{formatCurrency(data.totalPrizePool)}</h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
               <div className="space-y-4">
                 {data.prizes.sort((a,b) => a.displayOrder - b.displayOrder).map(prize => (
                   <div key={prize.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                     <div>
                       <p className="font-bold text-white text-lg">{prize.position}</p>
                       <p className="text-xs text-slate-400">{prize.label}</p>
                     </div>
                     <p className="font-black text-emerald-400 text-xl">
                       {prize.rewardType === 'Cash' ? formatCurrency(prize.amount) : prize.description}
                     </p>
                   </div>
                 ))}
               </div>

               {data.additionalRewards.length > 0 && (
                 <div>
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center border-b border-slate-800 pb-2">Special Awards</h4>
                   <div className="space-y-3">
                     {data.additionalRewards.map(ar => (
                       <div key={ar.id} className="flex justify-between items-center p-3 border border-slate-800 rounded-lg">
                         <div>
                           <p className="font-bold text-white text-sm">{ar.position}</p>
                           {ar.sponsor && <p className="text-[10px] text-slate-400">By {ar.sponsor}</p>}
                         </div>
                         <p className="font-bold text-purple-400 text-sm">
                           {ar.rewardType === 'Cash' ? formatCurrency(ar.amount) : ar.description}
                         </p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
