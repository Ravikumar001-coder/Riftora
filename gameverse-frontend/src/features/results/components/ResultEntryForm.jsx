import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trophy, AlertTriangle, Save, CheckCircle, UploadCloud, Info } from 'lucide-react';
import api from '@/lib/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Validation Schema
const scoreSchema = z.object({
  teamScores: z.array(z.object({
    teamId: z.string(),
    teamName: z.string(),
    placement: z.number().min(1),
    rawKills: z.number().min(0).max(99, "Max 99 kills"),
    damage: z.number().min(0).optional(),
    isChickenDinner: z.boolean(),
  })),
  screenshots: z.array(z.any()).max(3, "Max 3 screenshots allowed").optional()
}).refine(data => {
  const placements = data.teamScores.map(t => t.placement);
  const uniquePlacements = new Set(placements);
  return uniquePlacements.size === placements.length;
}, {
  message: "Placements must be unique",
  path: ["teamScores"]
});

// Mock Scoring Template for Live Preview (In a real app, fetched from Match/Tournament)
const MOCK_SCORING_TEMPLATE = {
  killPtsEach: 1,
  killCap: 15,
  placementPoints: {
    1: 10, 2: 6, 3: 5, 4: 5, 5: 4, 6: 4, 7: 4, 8: 4, 
    9: 2, 10: 2, 11: 2, 12: 2, 13: 1, 14: 1, 15: 1, 16: 1
  }
};

export const ResultEntryForm = ({ match, tournamentId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // Initialize form with teams from match slots
  const defaultScores = match.slots?.map((slot, index) => ({
    teamId: slot.teamId,
    teamName: slot.teamName || `Slot ${slot.slotNumber}`,
    placement: index + 1,
    rawKills: 0,
    damage: 0,
    isChickenDinner: index === 0,
    id: slot.teamId // required for dnd keys
  })) || [];

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      teamScores: defaultScores
    }
  });

  const { fields, move, replace } = useFieldArray({
    control,
    name: 'teamScores',
    keyName: 'fieldId'
  });

  const watchedScores = watch('teamScores');
  const totalKills = watchedScores.reduce((sum, team) => sum + (Number(team.rawKills) || 0), 0);

  // Live Score Calculator
  const calculatePreviewPoints = (placement, kills, isWinner) => {
    const pPts = MOCK_SCORING_TEMPLATE.placementPoints[placement] || 0;
    const effectiveKills = Math.min(kills, MOCK_SCORING_TEMPLATE.killCap || 99);
    const kPts = effectiveKills * MOCK_SCORING_TEMPLATE.killPtsEach;
    return pPts + kPts;
  };

  // Drag and Drop Handlers
  const onDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the ghost image to render before we apply any styles
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const onDragEnter = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    move(draggedIndex, targetIndex);
    setDraggedIndex(targetIndex);
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
    // After dropping, automatically re-assign placements based on new index order (Drag-to-Rank)
    const currentScores = watch('teamScores');
    const updatedScores = currentScores.map((score, idx) => ({
      ...score,
      placement: idx + 1,
      isChickenDinner: idx === 0 // 1st place gets chicken dinner flag
    }));
    replace(updatedScores);
  };

  const submitMutation = useMutation({
    mutationFn: async ({ data, isDraft }) => {
      const payload = {
        matchId: match.matchId,
        isDraft: isDraft,
        teamScores: data.teamScores.map(score => ({
          teamId: score.teamId,
          placement: parseInt(score.placement, 10),
          rawKills: parseInt(score.rawKills, 10),
          damage: parseFloat(score.damage) || 0,
          isChickenDinner: score.isChickenDinner,
          gotFirstBlood: false, // Could be bound to UI
          teamWipes: 0,
          gotMvp: false,
          gotWinnerBonus: score.isChickenDinner
        }))
      };
      // Assume endpoint accepts isDraft query param or payload field
      const response = await api.post(`/v1/results`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', match.matchId] });
      queryClient.invalidateQueries({ queryKey: ['tournaments', tournamentId, 'matches'] });
      if (onSuccess) onSuccess();
    }
  });

  const onSubmitDraft = (data) => submitMutation.mutate({ data, isDraft: true });
  const onSubmitFinal = (data) => submitMutation.mutate({ data, isDraft: false });

  if (!match.slots || match.slots.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-slate-400">
          Cannot enter results: No teams are assigned to this match.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden shadow-2xl ring-1 ring-white/5">
      <CardHeader className="bg-slate-800/50 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" />
              Advanced Result Entry
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
              Drag rows to rank teams, or use quick numeric entry. Points are previewed in real-time.
            </p>
          </div>
          {totalKills > 100 && (
            <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-4 h-4" /> Unusual Total Kills: {totalKills}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-700 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-slate-300">
             <Info className="w-4 h-4 text-blue-400" />
             <span><strong>Config:</strong> 1 Kill = {MOCK_SCORING_TEMPLATE.killPtsEach} pt (Cap: {MOCK_SCORING_TEMPLATE.killCap}) | 1st = {MOCK_SCORING_TEMPLATE.placementPoints[1]} pts, 2nd = {MOCK_SCORING_TEMPLATE.placementPoints[2]} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 rounded flex items-center gap-2 text-slate-300 transition-colors">
               <UploadCloud className="w-4 h-4" />
               Upload Evidence (Max 3)
               <input type="file" multiple accept="image/png, image/jpeg, image/webp" className="hidden" {...register('screenshots')} />
            </label>
          </div>
        </div>

        <form className="flex flex-col">
          <div className="bg-slate-900/80 px-6 py-3 border-b border-slate-700 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
            <div className="col-span-1"></div>
            <div className="col-span-4">Team</div>
            <div className="col-span-2 text-center">Place</div>
            <div className="col-span-1 text-center">Kills</div>
            <div className="col-span-2 text-center">Damage</div>
            <div className="col-span-2 text-right">Est. Points</div>
          </div>
          
          <div className="px-6 py-4 space-y-2 max-h-[60vh] overflow-y-auto">
            <AnimatePresence>
              {fields.map((field, index) => {
                const currentScore = watchedScores[index];
                const estPoints = calculatePreviewPoints(
                  currentScore.placement, 
                  currentScore.rawKills, 
                  currentScore.isChickenDinner
                );

                return (
                  <motion.div 
                    key={field.fieldId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border transition-colors ${
                      currentScore.placement === 1 
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                    }`}
                    draggable
                    onDragStart={(e) => onDragStart(e, index)}
                    onDragEnter={(e) => onDragEnter(e, index)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="col-span-1 flex justify-center cursor-grab active:cursor-grabbing text-slate-500 hover:text-white">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="col-span-4 text-white text-sm font-medium flex items-center gap-2">
                      {currentScore.placement === 1 && <Trophy className="w-4 h-4 text-amber-400" />}
                      {field.teamName}
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <input
                        type="number"
                        min="1"
                        className="w-16 bg-slate-950 border border-slate-700 rounded p-1.5 text-center text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        {...register(`teamScores.${index}.placement`, { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <input
                        type="number"
                        min="0"
                        className="w-16 bg-slate-950 border border-slate-700 rounded p-1.5 text-center text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        {...register(`teamScores.${index}.rawKills`, { valueAsNumber: true })}
                      />
                    </div>

                    <div className="col-span-2 text-center">
                      <input
                        type="number"
                        min="0"
                        className="w-20 bg-slate-950 border border-slate-700 rounded p-1.5 text-center text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        {...register(`teamScores.${index}.damage`, { valueAsNumber: true })}
                      />
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="font-mono text-lg font-bold text-emerald-400">
                        {estPoints}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">pts</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {errors.teamScores?.root && (
              <p className="text-rose-500 text-sm mt-2 font-medium">{errors.teamScores.root.message}</p>
            )}
          </div>

          <div className="bg-slate-900 px-6 py-4 border-t border-slate-700 flex justify-between items-center">
             <div className="text-sm text-slate-400">
               Total Kills Recorded: <span className="text-white font-mono">{totalKills}</span>
             </div>
             <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
                disabled={submitMutation.isPending}
                onClick={handleSubmit(onSubmitDraft)}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                type="button" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                disabled={submitMutation.isPending}
                onClick={handleSubmit(onSubmitFinal)}
              >
                {submitMutation.isPending ? 'Publishing...' : 'Finalize & Publish'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
