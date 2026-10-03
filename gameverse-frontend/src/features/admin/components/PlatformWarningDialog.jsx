import React, { useState } from 'react';
import { X, ShieldAlert, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PlatformWarningDialog({ isOpen, onClose, dispute, onConfirm }) {
  const [target, setTarget] = useState('Team');
  const [severity, setSeverity] = useState('Warning');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !dispute) return null;

  const handleConfirm = () => {
    if (reason.trim().length < 30) {
      setError('Administrative reason must be at least 30 characters long.');
      return;
    }
    onConfirm({ target, severity, reason });
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
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-amber-500/10">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Issue Platform Action
            </h2>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="flex gap-4 p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl">
              <AlertOctagon className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-300">Administrative Enforcement</p>
                <p className="text-xs text-slate-300 mt-1">
                  Issue a formal platform-level warning or restriction to the parties involved in this dispute.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Target</label>
                <select 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Team">Team ({dispute.teamName})</option>
                  <option value="Organization">Organization ({dispute.organizationName})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Severity</label>
                <select 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Warning">Formal Warning</option>
                  <option value="Temporary Restriction">Temporary Restriction</option>
                  <option value="Platform Ban">Platform Ban</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Administrative Reason</label>
                <textarea 
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setError(''); }}
                  placeholder="Explain why this action is being taken..."
                  className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 min-h-[100px] resize-none`}
                />
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                  <span className={`text-[10px] font-medium ${reason.trim().length >= 30 ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {reason.trim().length} / 30 min chars
                  </span>
                </div>
              </div>
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
              Issue {severity.split(' ')[0]}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
