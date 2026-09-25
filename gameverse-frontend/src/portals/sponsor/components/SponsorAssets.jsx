import React from 'react';
import { Image, Upload, AlertCircle, Check } from 'lucide-react';

export function SponsorAssets({ assets }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-5">Brand Assets</h2>
      
      <div className="space-y-3 mb-5">
        {assets.map((asset) => (
          <div key={asset.id} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${asset.status === 'UPLOADED' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                <Image className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-200">{asset.name}</span>
            </div>
            
            {asset.status === 'UPLOADED' ? (
              <span className="flex items-center text-xs text-green-400 font-medium">
                <Check className="w-3.5 h-3.5 mr-1" />
                Uploaded
              </span>
            ) : (
              <span className="flex items-center text-xs text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Missing
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-center border-dashed">
        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-white mb-1">Upload New Asset</p>
        <p className="text-xs text-slate-400">PNG / SVG • 1920×1080 recommended</p>
        <button className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors">
          Select File
        </button>
      </div>
    </div>
  );
}
