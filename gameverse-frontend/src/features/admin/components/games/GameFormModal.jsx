import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Validation Schema
const gameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  shortName: z.string().min(2, "Short name must be at least 2 characters").max(20),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  publisher: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  tournamentFormats: z.array(z.string()).min(1, "Select at least one format"),
  matchTypes: z.array(z.string()).optional(),
  lobbySize: z.number().int().nonnegative().optional(),
  teamSize: z.number().int().positive("Team size must be at least 1").optional(),
  scoringModel: z.string().optional(),
  supportsMultipleMatches: z.boolean(),
  supportsGroups: z.boolean(),
  supportsAdvancement: z.boolean(),
  supportsLiveLeaderboard: z.boolean(),
});

const CATEGORIES = ["Battle Royale", "Tactical Shooter", "MOBA", "Sports", "Racing", "Fighting", "Other"];
const PLATFORMS = ["Android", "iOS", "Windows", "Console", "Cross-platform"];
const FORMATS = ["Battle Royale", "Squad", "Point Table", "Standard 5v5", "Search and Destroy", "Hardpoint", "1v1"];
const MATCH_TYPES = ["Battle Royale", "Team Deathmatch", "Clash Squad", "Head-to-Head"];

export function GameFormModal({ isOpen, onClose, initialData, onSave }) {
  const isEditing = !!initialData;

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      name: '',
      shortName: '',
      slug: '',
      description: '',
      publisher: '',
      category: '',
      platforms: [],
      tournamentFormats: [],
      matchTypes: [],
      lobbySize: 16,
      teamSize: 4,
      scoringModel: '',
      supportsMultipleMatches: false,
      supportsGroups: false,
      supportsAdvancement: false,
      supportsLiveLeaderboard: false,
    }
  });

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name,
        shortName: initialData.shortName,
        slug: initialData.slug,
        description: initialData.description || '',
        publisher: initialData.publisher || '',
        category: initialData.category,
        platforms: initialData.platforms || [],
        tournamentFormats: initialData.tournamentFormats || [],
        matchTypes: initialData.matchTypes || [],
        lobbySize: initialData.lobbySize || 0,
        teamSize: initialData.teamSize || 1,
        scoringModel: initialData.scoringModel || '',
        supportsMultipleMatches: !!initialData.supportsMultipleMatches,
        supportsGroups: !!initialData.supportsGroups,
        supportsAdvancement: !!initialData.supportsAdvancement,
        supportsLiveLeaderboard: !!initialData.supportsLiveLeaderboard,
      });
    } else if (isOpen) {
      reset({
        name: '',
        shortName: '',
        slug: '',
        description: '',
        publisher: '',
        category: '',
        platforms: [],
        tournamentFormats: [],
        matchTypes: [],
        lobbySize: 16,
        teamSize: 4,
        scoringModel: '',
        supportsMultipleMatches: true,
        supportsGroups: true,
        supportsAdvancement: true,
        supportsLiveLeaderboard: true,
      });
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex-none p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">{isEditing ? 'Edit Game' : 'Add Game'}</h2>
              <p className="text-sm text-slate-400 mt-1">
                {isEditing ? 'Update the game catalog details.' : 'Add a new game to the Riftora catalog.'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="game-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Information */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Game Name <span className="text-red-500">*</span></label>
                    <input 
                      {...register("name")}
                      className={`w-full bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="e.g. Battlegrounds Mobile India"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Short Name <span className="text-red-500">*</span></label>
                    <input 
                      {...register("shortName")}
                      className={`w-full bg-slate-950 border ${errors.shortName ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="e.g. BGMI"
                    />
                    {errors.shortName && <p className="text-red-500 text-xs mt-1">{errors.shortName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Slug <span className="text-red-500">*</span></label>
                    <input 
                      {...register("slug")}
                      className={`w-full bg-slate-950 border ${errors.slug ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="e.g. bgmi"
                    />
                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Publisher</label>
                    <input 
                      {...register("publisher")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Krafton"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                    <textarea 
                      {...register("description")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Short description of the game"
                      rows={2}
                    />
                  </div>
                </div>
              </section>

              {/* Classification */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Classification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Category <span className="text-red-500">*</span></label>
                    <select 
                      {...register("category")}
                      className={`w-full bg-slate-950 border ${errors.category ? 'border-red-500' : 'border-slate-800'} rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors`}
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Platforms <span className="text-red-500">*</span></label>
                    <Controller
                      name="platforms"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {PLATFORMS.map(p => {
                            const isSelected = field.value.includes(p);
                            return (
                              <button
                                type="button"
                                key={p}
                                onClick={() => {
                                  const newValue = isSelected 
                                    ? field.value.filter(val => val !== p)
                                    : [...field.value, p];
                                  field.onChange(newValue);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                  isSelected 
                                    ? 'bg-blue-600 border-blue-500 text-white' 
                                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                                }`}
                              >
                                {p}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.platforms && <p className="text-red-500 text-xs mt-1">{errors.platforms.message}</p>}
                  </div>
                </div>
              </section>

              {/* Tournament Support */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Tournament Defaults</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Lobby Size (Teams)</label>
                    <input 
                      type="number"
                      {...register("lobbySize", { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. 16"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">E.g., 16 for BGMI, 12 for Free Fire.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Team Size (Players)</label>
                    <input 
                      type="number"
                      {...register("teamSize", { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. 4"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Supported Formats <span className="text-red-500">*</span></label>
                    <Controller
                      name="tournamentFormats"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {FORMATS.map(f => {
                            const isSelected = field.value.includes(f);
                            return (
                              <button
                                type="button"
                                key={f}
                                onClick={() => {
                                  const newValue = isSelected 
                                    ? field.value.filter(val => val !== f)
                                    : [...field.value, f];
                                  field.onChange(newValue);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                  isSelected 
                                    ? 'bg-purple-600 border-purple-500 text-white' 
                                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                                }`}
                              >
                                {f}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.tournamentFormats && <p className="text-red-500 text-xs mt-1">{errors.tournamentFormats.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Scoring Model</label>
                    <input 
                      {...register("scoringModel")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Placement + Finish/Kill Points"
                    />
                  </div>

                  <div className="md:col-span-2 bg-slate-950 rounded-lg border border-slate-800 p-4 grid grid-cols-2 gap-4 mt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("supportsMultipleMatches")} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                      <span className="text-sm font-medium text-slate-300">Supports Multiple Matches</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("supportsGroups")} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                      <span className="text-sm font-medium text-slate-300">Supports Groups Phase</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("supportsAdvancement")} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                      <span className="text-sm font-medium text-slate-300">Supports Advancement</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("supportsLiveLeaderboard")} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950" />
                      <span className="text-sm font-medium text-slate-300">Supports Live Leaderboard</span>
                    </label>
                  </div>

                </div>
              </section>

            </form>
          </div>

          {/* Footer */}
          <div className="flex-none p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="game-form"
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Game'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
