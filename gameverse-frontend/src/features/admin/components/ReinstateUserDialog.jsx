import React from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReinstateUserDialog({ isOpen, onClose, user, onConfirm }) {
  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    onConfirm(user.id, 'Active');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-emerald-500/10">
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Reinstate user?
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="flex gap-4 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
              <Info className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-base font-bold text-white leading-tight">{user.displayName}</p>
                <p className="text-sm text-slate-400 font-mono mt-0.5">@{user.username}</p>
                <p className="text-xs text-emerald-300 mt-3 font-medium">
                  This user's account will be restored and they will regain normal platform access.
                </p>
              </div>
            </div>

            {user.suspension && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Previous Suspension</p>
                <p className="text-sm text-slate-300 font-medium">"{user.suspension.reason}"</p>
                <p className="text-xs text-slate-500 mt-2">Suspended: {new Date(user.suspension.suspendedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all"
            >
              Reinstate User
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
