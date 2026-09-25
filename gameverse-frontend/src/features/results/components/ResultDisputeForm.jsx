import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, Send } from 'lucide-react';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export const ResultDisputeForm = ({ resultId, teamId, onDisputeSubmitted }) => {
  const [claimedPlacement, setClaimedPlacement] = useState('');
  const [claimedKills, setClaimedKills] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState(''); // Simple text input for demo purposes
  const [error, setError] = useState('');

  const disputeMutation = useMutation({
    mutationFn: async (payload) => {
      // Endpoint created in ResultController
      const response = await api.post(`/v1/results/${resultId}/disputes`, null, { params: payload });
      return response.data;
    },
    onSuccess: () => {
      if (onDisputeSubmitted) onDisputeSubmitted();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to submit dispute. The window may have closed.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!claimedPlacement && !claimedKills) {
      setError('Please provide at least one claimed correction (placement or kills).');
      return;
    }

    disputeMutation.mutate({
      teamId,
      claimedPlacement: claimedPlacement || 0,
      claimedKills: claimedKills || 0,
      evidenceUrl
    });
  };

  return (
    <Card className="bg-slate-900 border-rose-500/30 w-full max-w-md mx-auto shadow-2xl">
      <CardHeader className="bg-rose-500/10 border-b border-rose-500/20">
        <CardTitle className="text-rose-400 flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5" /> Raise Result Dispute
        </CardTitle>
        <p className="text-xs text-rose-300/70 mt-1">
          You have 30 minutes from publication to dispute this result.
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {error && (
            <div className="p-3 bg-red-900/40 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Claimed Placement</Label>
              <Input 
                type="number"
                min="1"
                placeholder="e.g. 3"
                value={claimedPlacement}
                onChange={(e) => setClaimedPlacement(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Claimed Kills</Label>
              <Input 
                type="number"
                min="0"
                placeholder="e.g. 12"
                value={claimedKills}
                onChange={(e) => setClaimedKills(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Evidence Screenshot URL</Label>
            <Input 
              type="url"
              placeholder="https://example.com/screenshot.png"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-500 italic">Optional, but highly recommended to speed up verification.</p>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3 pt-4 pb-4 px-6">
          <Button 
            type="submit" 
            className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20"
            disabled={disputeMutation.isPending}
          >
            <Send className="w-4 h-4 mr-2" /> Submit Dispute
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
