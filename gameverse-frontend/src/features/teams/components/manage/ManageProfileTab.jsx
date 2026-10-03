import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateTeam } from '../../api/useTeamQueries';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUploadInput } from '../../components/ImageUploadInput';
import { GameSelectionCards } from '../../components/GameSelectionCards';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { AlertCircle } from 'lucide-react';

const profileSchema = z.object({
  teamName: z.string().trim()
    .min(1, "Team name is required.")
    .max(30, "Team name must be 30 characters or fewer."),
  teamTag: z.string().trim()
    .min(3, "Team tag must be at least 3 characters.")
    .max(5, "Team tag must be at most 5 characters.")
    .regex(/^[A-Z0-9]+$/, "Team tag must be uppercase letters or numbers only."),
  primaryGame: z.string()
    .min(1, "Please select a primary game."),
  description: z.string().max(200, "Description must be 200 characters or fewer.").optional().or(z.literal('')),
  country: z.string().optional(),
  instagram: z.string().optional().or(z.literal('')),
  youtube: z.string().url("Please enter a valid YouTube URL.").optional().or(z.literal('')),
  logo: z.any().optional(),
  banner: z.any().optional()
});

export function ManageProfileTab({ team, onToast, setIsDirty }) {
  const [submitError, setSubmitError] = useState('');
  const updateTeam = useUpdateTeam(team.teamId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      teamName: team.teamName || '',
      teamTag: team.teamTag || '',
      primaryGame: team.gameId || '',
      description: team.description || '',
      country: team.country || 'India',
      instagram: team.instagram || '',
      youtube: team.youtube || '',
      logo: team.logoUrl || null,
      banner: team.bannerUrl || null
    },
    mode: 'onChange'
  });

  const descriptionValue = watch('description') || '';

  // Propagate dirty state up to parent for "unsaved changes" warning
  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      
      const updatedProfile = {
        name: data.teamName,
        tag: data.teamTag,
        primaryGame: data.primaryGame,
        description: data.description,
        country: data.country,
        instagram: data.instagram,
        youtube: data.youtube,
        logoUrl: data.logo,
        bannerUrl: data.banner
      };

      await updateTeam.mutateAsync(updatedProfile);
      
      // Reset form to clear dirty state but keep new values
      reset(data);
      
      onToast("Team profile updated successfully.", false);
    } catch (err) {
      setSubmitError("Unable to save changes. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      
      {/* Banner Upload */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Team Banner</h3>
        <Controller
          name="banner"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageUploadInput
              label="Banner"
              maxSizeMB={2}
              accept="image/jpeg, image/png, image/webp"
              value={value}
              onChange={onChange}
              error={errors.banner?.message}
            />
          )}
        />
        <p className="text-sm text-slate-500 mt-2">Recommended size: 1920x480px. Maximum 2MB.</p>
      </section>

      {/* Basic Info & Logo */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Core Identity</h3>
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="shrink-0">
            <Controller
              name="logo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageUploadInput
                  label="Logo"
                  maxSizeMB={1}
                  accept="image/jpeg, image/png, image/webp"
                  value={value}
                  onChange={onChange}
                  error={errors.logo?.message}
                />
              )}
            />
            <p className="text-xs text-slate-500 text-center mt-2 max-w-[150px]">Maximum 1MB.<br/>JPG, PNG, WebP</p>
          </div>
          
          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Team Name <span className="text-red-500">*</span></label>
              <Input 
                {...register("teamName")}
                className={`bg-slate-950 border-slate-700 ${errors.teamName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="e.g. Hydra Reborn"
                aria-invalid={!!errors.teamName}
              />
              {errors.teamName && <p className="text-red-400 text-xs mt-1">{errors.teamName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Team Tag <span className="text-red-500">*</span></label>
              <Input 
                {...register("teamTag", { onChange: (e) => e.target.value = e.target.value.toUpperCase() })}
                className={`bg-slate-950 border-slate-700 uppercase ${errors.teamTag ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="e.g. HDRA"
                maxLength={5}
                aria-invalid={!!errors.teamTag}
              />
              <p className="text-xs text-slate-500 mt-1">3-5 uppercase alphanumeric characters</p>
              {errors.teamTag && <p className="text-red-400 text-xs mt-1">{errors.teamTag.message}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Game */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2">Primary Game</h3>
        <p className="text-sm text-slate-400 mb-6">Select the main game this team competes in.</p>
        
        <Controller
          name="primaryGame"
          control={control}
          render={({ field: { onChange, value } }) => (
            <GameSelectionCards 
              selectedGame={value} 
              onSelect={onChange} 
            />
          )}
        />
        {errors.primaryGame && <p className="text-red-400 text-xs mt-2">{errors.primaryGame.message}</p>}
      </section>

      {/* About & Socials */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Profile Details</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-sm font-semibold text-slate-300">Team Description</label>
              <span className={`text-xs ${descriptionValue.length > 200 ? 'text-red-400' : 'text-slate-500'}`}>
                {descriptionValue.length} / 200
              </span>
            </div>
            <textarea
              {...register("description")}
              className={`w-full bg-slate-950 border rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none ${errors.description ? 'border-red-500' : 'border-slate-700'}`}
              placeholder="Tell players and fans about your team..."
              aria-invalid={!!errors.description}
            ></textarea>
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Country</label>
              <select
                {...register("country")}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="India">India</option>
                <option value="Global">Global</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Instagram</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">@</span>
                <Input 
                  {...register("instagram")}
                  className="pl-8 bg-slate-950 border-slate-700"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">YouTube Channel</label>
              <Input 
                {...register("youtube")}
                className={`bg-slate-950 border-slate-700 ${errors.youtube ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="https://youtube.com/@channel"
                aria-invalid={!!errors.youtube}
              />
              {errors.youtube && <p className="text-red-400 text-xs mt-1">{errors.youtube.message}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex-1">
          {submitError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {submitError}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => reset()}
            disabled={!isDirty || isSubmitting}
          >
            Discard Changes
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px]"
            disabled={!isDirty || isSubmitting || !isValid}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
