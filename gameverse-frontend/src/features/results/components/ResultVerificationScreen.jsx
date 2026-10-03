import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, AlertTriangle, Image as ImageIcon, Eye, Download, Info } from 'lucide-react';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';

export const ResultVerificationScreen = ({ matchResult, onSuccess }) => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);

  const verifyMutation = useMutation({
    mutationFn: async (status) => {
      const response = await api.put(`/v1/results/${matchResult.resultId}/verify?status=${status}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', matchResult.matchId] });
      if (onSuccess) onSuccess();
    }
  });

  const totalKills = matchResult.teamScores?.reduce((sum, team) => sum + (team.rawKills || 0), 0) || 0;
  const isUnusualKills = totalKills > 100;

  // Mock screenshots (in reality, fetched from matchResult.screenshotUrl or a list of URLs)
  const screenshots = matchResult.screenshotUrl ? matchResult.screenshotUrl.split(',') : [];

  return (
    <Card className="bg-slate-800 border-slate-700 mt-6 shadow-2xl ring-1 ring-white/5 overflow-hidden">
      <CardHeader className="bg-slate-900/50 border-b border-slate-700 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Director Verification
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Review the submitted results before publishing to the leaderboard.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {matchResult.status === 'disputed' ? (
              <Badge variant="destructive" className="animate-pulse bg-rose-500/20 text-rose-400 border-rose-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> DISPUTED
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10">
                Status: {matchResult.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Anomalies Section (FR-10-025) */}
        {matchResult.anomalies && matchResult.anomalies.length > 0 && (
          <div className="bg-amber-900/20 border-b border-amber-500/30 px-6 py-4">
            <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Statistical Anomalies Detected
            </h4>
            <ul className="list-disc list-inside text-sm text-amber-200/80 space-y-1">
              {matchResult.anomalies.map((anomaly, idx) => (
                <li key={idx}>{anomaly}</li>
              ))}
            </ul>
            <p className="text-xs text-amber-500/60 mt-2 italic">These are warnings, not errors. You may still approve if the data is accurate.</p>
          </div>
        )}
        {/* Screenshots Section */}
        {screenshots.length > 0 && (
          <div className="bg-slate-900/40 px-6 py-4 border-b border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Uploaded Evidence
            </h4>
            <div className="flex gap-3">
              {screenshots.map((url, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div className="w-24 h-16 bg-slate-800 border border-slate-700 rounded cursor-pointer overflow-hidden group relative">
                      <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">Evidence Screenshot {idx + 1}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 rounded overflow-hidden">
                      <img src={url} alt="Evidence Full" className="w-full h-auto" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => window.open(url, '_blank')}>
                        <Download className="w-4 h-4 mr-2" /> Download Original
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="p-4 pl-6">Team</th>
                <th className="p-4 text-center">Place</th>
                <th className="p-4 text-center">Kills</th>
                <th className="p-4 text-center">Bonuses</th>
                <th className="p-4 text-right pr-6">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {matchResult.teamScores?.map((score, idx) => (
                <tr key={score.teamId} className={`hover:bg-slate-800/50 transition-colors ${score.placement === 1 ? 'bg-amber-500/5' : ''}`}>
                  <td className="p-4 pl-6 font-medium text-white flex items-center gap-2">
                    {score.placement === 1 && <Trophy className="w-4 h-4 text-amber-400" />}
                    {score.team?.name || `Team ${score.teamId.substring(0, 4)}`}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${score.placement === 1 ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-800 border border-slate-700'}`}>
                      {score.placement}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {score.rawKills}
                    {score.rawKills > score.effectiveKills && (
                      <span className="text-xs text-rose-400 ml-1 block">(Cap: {score.effectiveKills})</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-1">
                      {score.gotFirstBlood && <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/30">FB</Badge>}
                      {score.gotMvp && <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/30">MVP</Badge>}
                      {score.teamWipes > 0 && <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/30">Wipe x{score.teamWipes}</Badge>}
                      {(!score.gotFirstBlood && !score.gotMvp && score.teamWipes === 0) && <span className="text-slate-600">-</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <span className="font-mono text-lg font-bold text-emerald-400">{score.totalPoints}</span>
                  </td>
                </tr>
              ))}
              {(!matchResult.teamScores || matchResult.teamScores.length === 0) && (
                <tr>
                  <td className="p-8 text-center text-slate-500 italic" colSpan="5">
                    No team scores found in this result payload.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Info className="w-4 h-4" /> Please verify all flags and points before publishing.
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              disabled={verifyMutation.isPending}
              onClick={() => verifyMutation.mutate('rejected')}
            >
              <XCircle className="w-4 h-4 mr-2" /> Request Correction
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
              disabled={verifyMutation.isPending}
              onClick={() => verifyMutation.mutate('verified')}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approve & Publish
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
