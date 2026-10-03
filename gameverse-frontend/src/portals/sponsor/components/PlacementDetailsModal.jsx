import React from 'react';
import { X } from 'lucide-react';

export function PlacementDetailsModal({ placement, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">{placement.name}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Placement Type</p>
            <p className="text-white font-medium">{placement.type}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
            <div className="inline-flex items-center text-sm font-semibold bg-slate-800 px-3 py-1.5 rounded-lg">
              {placement.status === 'ACTIVE' && <span className="text-green-400">● ACTIVE</span>}
              {placement.status === 'PENDING' && <span className="text-slate-400">PENDING</span>}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Expected Exposure</p>
            <p className="text-white">{placement.delivery.includes('/') ? placement.delivery.split('/')[1] + ' units' : 'Full tournament'}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Delivered</p>
            <p className="text-white">{placement.delivery}</p>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-400/80 uppercase tracking-wider mb-1">Estimated Impressions</p>
            <p className="text-xl font-bold text-blue-400">
              {placement.status === 'ACTIVE' ? '420,000' : '0'}
            </p>
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
