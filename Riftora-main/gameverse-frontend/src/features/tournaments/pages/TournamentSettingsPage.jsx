import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, LayoutTemplate, Image } from 'lucide-react';
import { useGetTournament } from '../api/useTournamentQueries';
import { useUpdateTournament } from '../api/useTournamentMutations';
import { GraphicPreviewModal } from '../../graphics/components/GraphicPreviewModal';
import { api } from '../../../services/api';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { StreamSettingsPanel } from '../../broadcast/components/StreamSettingsPanel';

const settingsSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  themeType: z.enum(['USE_ORG', 'DARK', 'LIGHT', 'CUSTOM']),
  logoUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  accentColor: z.string().optional().nullable(),
});

export function TournamentSettingsPage() {
  const { tournamentId } = useParams();
  const { data: tournament, isLoading } = useGetTournament(tournamentId);
  const { mutate: updateTournament, isPending } = useUpdateTournament();

  // Graphic Engine State
  const [isGraphicModalOpen, setIsGraphicModalOpen] = useState(false);
  const [generatedGraphicUrl, setGeneratedGraphicUrl] = useState(null);
  const [currentGraphicType, setCurrentGraphicType] = useState('');
  const sectionRefs = useRef({});

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: tournament?.name || '',
      themeType: tournament?.themeType || 'USE_ORG',
    }
  });

  // Effect to update form when tournament loads
  React.useEffect(() => {
    if (tournament) {
      register('name').onChange({ target: { value: tournament.name, name: 'name' } });
      register('themeType').onChange({ target: { value: tournament.themeType || 'USE_ORG', name: 'themeType' } });
      register('logoUrl').onChange({ target: { value: tournament.logoUrl || '', name: 'logoUrl' } });
      register('bannerUrl').onChange({ target: { value: tournament.bannerUrl || '', name: 'bannerUrl' } });
      register('primaryColor').onChange({ target: { value: tournament.primaryColor || '#2563EB', name: 'primaryColor' } });
      register('secondaryColor').onChange({ target: { value: tournament.secondaryColor || '#1E40AF', name: 'secondaryColor' } });
      register('accentColor').onChange({ target: { value: tournament.accentColor || '#3B82F6', name: 'accentColor' } });
    }
  }, [tournament, register]);

  const onSubmit = (data) => {
    updateTournament(
      { tournamentId, data },
      {
        onSuccess: () => {
          toast.success("Tournament settings updated successfully");
        }
      }
    );
  };

  const generateGraphic = async (type) => {
    setCurrentGraphicType(type);
    setGeneratedGraphicUrl(null);
    setIsGraphicModalOpen(true);
    try {
       const response = await api.post(
         `/tournaments/${tournamentId}/graphics/generate`, 
         null, 
         {
           params: { type, targetId: tournamentId, includeWatermark: true }
         }
       );
       setGeneratedGraphicUrl(response.data.data?.url || response.data.url);
    } catch (e) {
       console.error("Graphic Generation Failed", e);
       setIsGraphicModalOpen(false);
       toast.error("Failed to generate graphic");
    }
  };

  const themeType = watch('themeType');

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GraphicPreviewModal 
        isOpen={isGraphicModalOpen} 
        onClose={() => setIsGraphicModalOpen(false)} 
        graphicUrl={generatedGraphicUrl} 
        type={currentGraphicType} 
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tournament Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage general settings and brand theme</p>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">General Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tournament Name</label>
              <Input 
                {...register('name')}
                className="bg-slate-950 border-slate-800" 
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>
        </div>

        {/* Theme Settings (FR-18-005, 006) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <LayoutTemplate className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Theme & Branding</h2>
              <p className="text-sm text-slate-400">Override organization defaults for this specific tournament</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Theme Selector</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'USE_ORG', label: 'Organization Default' },
                  { value: 'DARK', label: 'Dark Theme' },
                  { value: 'LIGHT', label: 'Light Theme' },
                  { value: 'CUSTOM', label: 'Custom Colors' }
                ].map(theme => (
                  <label 
                    key={theme.value}
                    className={`cursor-pointer p-4 rounded-xl border transition-colors flex flex-col items-center text-center gap-2 ${
                      themeType === theme.value 
                        ? 'bg-blue-500/10 border-blue-500/50' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input 
                      type="radio" 
                      value={theme.value} 
                      {...register('themeType')}
                      className="sr-only" 
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      themeType === theme.value ? 'border-blue-500' : 'border-slate-600'
                    }`}>
                      {themeType === theme.value && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <span className="text-sm font-medium text-white">{theme.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {themeType === 'CUSTOM' && (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white mb-4">Custom Theme Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Primary Color</label>
                    <div className="flex gap-2">
                      <Input type="color" {...register('primaryColor')} className="w-12 h-10 p-1 bg-slate-950 border-slate-800" />
                      <Input type="text" {...register('primaryColor')} className="flex-1 bg-slate-950 border-slate-800 uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Secondary Color</label>
                    <div className="flex gap-2">
                      <Input type="color" {...register('secondaryColor')} className="w-12 h-10 p-1 bg-slate-950 border-slate-800" />
                      <Input type="text" {...register('secondaryColor')} className="flex-1 bg-slate-950 border-slate-800 uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Accent Color</label>
                    <div className="flex gap-2">
                      <Input type="color" {...register('accentColor')} className="w-12 h-10 p-1 bg-slate-950 border-slate-800" />
                      <Input type="text" {...register('accentColor')} className="flex-1 bg-slate-950 border-slate-800 uppercase" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Tournament Specific Branding
              </h3>
              <p className="text-sm text-slate-400 mb-4">Override the organization logo and banner for this tournament. Leave blank to use organization defaults.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tournament Logo URL</label>
                  <Input 
                    {...register('logoUrl')}
                    placeholder="https://example.com/logo.png"
                    className="bg-slate-950 border-slate-800" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tournament Banner URL</label>
                  <Input 
                    {...register('bannerUrl')}
                    placeholder="https://example.com/banner.png"
                    className="bg-slate-950 border-slate-800" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Graphics Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-400" /> Marketing Graphics Engine
              </h2>
              <p className="text-sm text-slate-400 mt-1">Automatically generate high-quality graphics for social media perfectly matching your brand kit.</p>
            </div>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold uppercase">Pro Feature</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Match Result Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col items-center text-center">
               <div className="w-full aspect-[16/9] bg-slate-900 rounded-lg border border-slate-800 mb-4 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900" />
                 <h3 className="text-2xl font-black italic uppercase relative z-10 text-white/50">MATCH RESULT</h3>
               </div>
               <h3 className="font-bold text-white mb-2">Match Result Graphic</h3>
               <p className="text-xs text-slate-400 mb-4 h-8">Perfect for Instagram/Twitter to announce match winners immediately after.</p>
               <button onClick={(e) => { e.preventDefault(); generateGraphic('match-result'); }} className="w-full py-2 bg-slate-800 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                 Generate Graphic
               </button>
            </div>
            {/* Leaderboard Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col items-center text-center">
               <div className="w-full aspect-[16/9] bg-slate-900 rounded-lg border border-slate-800 mb-4 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900" />
                 <div className="w-2/3 h-1/2 bg-slate-800/50 rounded flex flex-col gap-1 p-2">
                   <div className="h-2 w-full bg-slate-700 rounded-full" />
                   <div className="h-2 w-5/6 bg-slate-700 rounded-full" />
                   <div className="h-2 w-4/6 bg-slate-700 rounded-full" />
                 </div>
               </div>
               <h3 className="font-bold text-white mb-2">Top 10 Leaderboard</h3>
               <p className="text-xs text-slate-400 mb-4 h-8">Summary of the top 10 standings. Ideal for End of Day recaps.</p>
               <button onClick={(e) => { e.preventDefault(); generateGraphic('leaderboard'); }} className="w-full py-2 bg-slate-800 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                 Generate Graphic
               </button>
            </div>
          </div>
        </div>

        {/* Broadcast Streams Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <StreamSettingsPanel tournamentId={tournamentId} />
        </div>

      </div>
    </div>
  );
}
