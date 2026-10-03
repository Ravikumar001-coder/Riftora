import React from 'react';
import { Download, FileText, Clock } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';

export function RulesMetadata({ metadata }) {
  if (!metadata) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-900/50 border border-white/10 rounded-xl mb-8 gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-600 hover:bg-blue-600 text-white font-bold tracking-wider px-3 py-1">
            OFFICIAL RULEBOOK
          </Badge>
          {metadata.version && (
            <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Version {metadata.version}
            </span>
          )}
        </div>
        
        {metadata.lastUpdated && (
          <p className="text-slate-400 text-sm flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Last Updated: <span className="text-white">{formatDate(metadata.lastUpdated)}</span>
          </p>
        )}
      </div>

      {metadata.downloadUrl && (
        <Button 
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors w-full md:w-auto"
          onClick={() => window.open(metadata.downloadUrl, '_blank')}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Rulebook
        </Button>
      )}
    </div>
  );
}
