import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SuspendOrganizationDialog({ isOpen, onClose, organization, onConfirm }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !organization) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Reason is required to suspend an organization.');
      return;
    }
    onConfirm(organization.id, 'Suspended', reason);
    setReason('');
    setError('');
  };

  const handleCancel = () => {
    setReason('');
    setError('');
    onClose();
  };

  const predefinedReasons = [
    'Policy violation',
    'Fraud / abuse',
    'Payment issue',
    'Compliance issue',
    'Other'
  ];

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
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-red-500/10">
            <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Suspend Organization
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
                <p className="text-sm font-medium text-slate-200">You are about to suspend:</p>
                <p className="text-base font-bold text-white mt-0.5">{organization.name}</p>
                <p className="text-xs text-red-300 mt-2">
                  Suspending this organization will prevent normal organization operations according to platform policy.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Reason</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedReasons.map(r => (
                  <button 
                    key={r}
                    onClick={() => { setReason(r); setError(''); }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                      reason === r 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea 
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(''); }}
                placeholder="Select or enter reason..."
                className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 min-h-[100px] resize-none`}
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
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> Suspend Organization
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
