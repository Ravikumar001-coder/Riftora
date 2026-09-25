import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ForceCompleteDialog({ isOpen, onClose, tournament, onConfirm }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !tournament) return null;

  const handleConfirm = () => {
    if (reason.trim().length < 20) {
      setError('Reason must be at least 20 characters.');
      return;
    }
    onConfirm(tournament.id, reason);
    setReason('');
    setError('');
  };

  const handleCancel = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={handleCancel}
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-amber-500/10">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Force-complete tournament?
            </h2>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="flex gap-4 p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-200">You are overriding:</p>
                <p className="text-base font-bold text-white mt-0.5">{tournament.name}</p>
                <div className="flex gap-2 mt-2 items-center">
                  <span className="text-[10px] font-mono text-slate-400">{tournament.id}</span>
                  <span className="text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded">{tournament.status}</span>
                </div>
                <p className="text-xs text-amber-300 mt-2">
                  This is a Super Admin override and may finalize the tournament before the organizer's normal completion flow.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Reason for override</label>
              <textarea 
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(''); }}
                placeholder="Enter justification (min 20 characters)..."
                className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 min-h-[100px] resize-none`}
              />
              {error && <p className="text-xs text-red-400 font-medium mt-1.5">{error}</p>}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
            <button 
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Force Complete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
