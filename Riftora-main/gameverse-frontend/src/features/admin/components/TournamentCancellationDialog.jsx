import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TournamentCancellationDialog({ isOpen, onClose, dispute, onConfirm }) {
  const [action, setAction] = useState('Partial Cancellation');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !dispute) return null;

  const handleConfirm = () => {
    if (action !== 'No Tournament Action' && reason.trim().length < 30) {
      setError('Cancellation justification must be at least 30 characters long.');
      return;
    }
    onConfirm({ action, reason });
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
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-red-500/10">
            <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Integrity Action
            </h2>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="flex gap-4 p-4 bg-red-950/30 border border-red-900/50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-400">Tournament Intervention</p>
                <p className="text-xs text-red-300 mt-1">
                  Tournament cancellation may affect registered teams, standings, and prize distribution. This action is reserved for severe integrity compromises.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Action</label>
                <select 
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="No Tournament Action">No Tournament Action</option>
                  <option value="Partial Cancellation">Partial Cancellation</option>
                  <option value="Full Cancellation">Full Cancellation</option>
                </select>
              </div>

              {action !== 'No Tournament Action' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-bold text-slate-300 mb-2">Cancellation Justification</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => { setReason(e.target.value); setError(''); }}
                    placeholder="Provide detailed justification for cancelling parts or all of this tournament..."
                    className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 min-h-[100px] resize-none`}
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-xs text-red-400 font-medium">{error}</p>
                    <span className={`text-[10px] font-medium ${reason.trim().length >= 30 ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {reason.trim().length} / 30 min chars
                    </span>
                  </div>
                </motion.div>
              )}
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
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                action === 'No Tournament Action' 
                  ? 'bg-slate-700 hover:bg-slate-600 shadow-slate-900/20' 
                  : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
              }`}
            >
              Apply Action
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
