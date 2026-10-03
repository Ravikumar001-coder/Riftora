import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form'; // Actually it's react-hook-form, let me fix this in my head.
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Users, AlertTriangle } from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { useCreateTeam, useGetUserTeams } from '../api/useTeamQueries';
import { GameSelectionCards } from '../components/GameSelectionCards';
import { TeamPreviewCard } from '../components/TeamPreviewCard';
import { ImageUploadInput } from '../components/ImageUploadInput';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
// Zod schema matching PRD requirements
const createTeamSchema = z.object({
  teamName: z.string().trim()
    .min(1, "Team name is required.")
    .max(30, "Team name must be 30 characters or fewer."),
  teamTag: z.string().trim()
    .min(3, "Team tag must be at least 3 characters.")
    .max(5, "Team tag must be at most 5 characters.")
    .regex(/^[A-Z0-9]+$/, "Team tag must be uppercase letters or numbers only."),
  primaryGame: z.string()
    .min(1, "Please select a primary game."),
  description: z.string().max(200, "Description must be 200 characters or fewer.").optional(),
  country: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().url("Please enter a valid YouTube URL.").optional().or(z.literal('')),
  logo: z.any().optional(),
  banner: z.any().optional()
});

export const CreateTeamPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: teams = [] } = useGetUserTeams();
  const createTeamMutation = useCreateTeam();
  
  const activeTeamsCount = teams.filter(t => t.isActive).length;
  const isLimitReached = activeTeamsCount >= 3;
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useForm({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      teamName: '',
      teamTag: '',
      primaryGame: '',
      description: '',
      country: 'India',
      instagram: '',
      youtube: '',
      logo: null,
      banner: null
    }
  });

  const teamName = watch("teamName");
  const teamTag = watch("teamTag");
  const primaryGame = watch("primaryGame");
  const logo = watch("logo");
  const description = watch("description");

  // Local mock check removed, using query data

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      
      const payload = {
        gameId: data.primaryGame,
        teamName: data.teamName,
        teamTag: data.teamTag,
        logoUrl: data.logo?.url || '',
        bannerUrl: data.banner?.url || '',
        description: data.description || '',
        country: data.country || '',
        socialInstagram: data.instagram || '',
        socialYoutube: data.youtube || '',
        captainInGameUid: 'PENDING-' + Math.random().toString(36).substring(7),
        captainInGameName: user?.username || 'Captain'
      };

      const response = await createTeamMutation.mutateAsync(payload);
      
      // Navigate to the new team's management page
      navigate(`/teams/${response.data.teamSlug}/manage`);
      
    } catch (err) {
      setSubmitError(err.response?.data?.message || "We couldn't create your team. Please try again.");
    }
  };

  if (isLimitReached) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Team limit reached</h2>
          <p className="text-slate-400">
            You currently captain 3 active teams. You cannot create another team until one of your active teams is no longer active.
          </p>
          <Button 
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            onClick={() => navigate('/dashboard/player')} // or wherever teams are listed
          >
            View My Teams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-xs font-bold text-blue-500 tracking-wider uppercase">Team Management</p>
                <h1 className="text-xl font-bold text-white leading-tight">Create your team</h1>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <Users className="w-4 h-4" />
              <span>{activeTeamsCount} / 3 active teams</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <p className="text-slate-400 text-lg">Build your competitive identity and start competing on Riftora.</p>
          <p className="text-slate-500 text-sm mt-1">You'll automatically become the Team Captain.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form Area */}
          <div className="flex-1 min-w-0">
            <form id="create-team-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-medium">Creation Failed</p>
                    <p className="text-sm opacity-80">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Team Identity Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm">1</span>
                  Team Identity
                </h2>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  {/* Team Name */}
                  <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Team Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="teamName"
                      placeholder="Enter your team name"
                      className="bg-slate-950 border-slate-700"
                      aria-invalid={!!errors.teamName}
                      {...register("teamName")}
                    />
                    <div className="flex justify-between mt-1.5">
                      <p className="text-red-400 text-sm">{errors.teamName?.message}</p>
                      <p className={`text-xs text-right ml-auto ${teamName.length > 30 ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                        {teamName.length} / 30
                      </p>
                    </div>
                  </div>

                  {/* Team Tag */}
                  <div>
                    <label htmlFor="teamTag" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Team Tag <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="teamTag"
                      placeholder="e.g. HDRA"
                      className="bg-slate-950 border-slate-700 uppercase"
                      aria-invalid={!!errors.teamTag}
                      {...register("teamTag", {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase();
                        }
                      })}
                    />
                    {errors.teamTag ? (
                      <p className="text-red-400 text-sm mt-1.5">{errors.teamTag.message}</p>
                    ) : (
                      <p className="text-slate-500 text-xs mt-1.5">3–5 uppercase letters or numbers</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Game Selection Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm">2</span>
                  Primary Game
                </h2>
                
                <Controller
                  name="primaryGame"
                  control={control}
                  render={({ field }) => (
                    <GameSelectionCards 
                      value={field.value} 
                      onChange={field.onChange} 
                      error={errors.primaryGame?.message}
                    />
                  )}
                />
              </section>

              {/* Optional Details Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-sm">3</span>
                    Optional Details
                  </h2>
                  <span className="text-sm text-slate-500">Not required</span>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-8">
                  
                  {/* Logos & Banners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="logo"
                      control={control}
                      render={({ field }) => (
                        <ImageUploadInput
                          label="Team Logo"
                          helperText="PNG, JPG or WebP • 1 MB"
                          maxSizeMB={1}
                          accept="image/jpeg, image/png, image/webp"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <Controller
                      name="banner"
                      control={control}
                      render={({ field }) => (
                        <ImageUploadInput
                          label="Team Banner"
                          helperText="PNG, JPG or WebP • 2 MB"
                          maxSizeMB={2}
                          accept="image/jpeg, image/png, image/webp"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Tell players and fans about your team..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                      {...register("description")}
                    />
                    <div className="flex justify-between mt-1.5">
                      <p className="text-red-400 text-sm">{errors.description?.message}</p>
                      <p className="text-xs text-slate-500 ml-auto">
                        {(description || '').length} / 200
                      </p>
                    </div>
                  </div>

                  {/* Country & Socials */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-1.5">Country</label>
                      <Input id="country" className="bg-slate-950 border-slate-700" placeholder="e.g. India" {...register("country")} />
                    </div>
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-slate-300 mb-1.5">Instagram</label>
                      <Input id="instagram" className="bg-slate-950 border-slate-700" placeholder="@handle" {...register("instagram")} />
                    </div>
                    <div>
                      <label htmlFor="youtube" className="block text-sm font-medium text-slate-300 mb-1.5">YouTube</label>
                      <Input id="youtube" className="bg-slate-950 border-slate-700" placeholder="https://youtube.com/..." {...register("youtube")} aria-invalid={!!errors.youtube} />
                      {errors.youtube && <p className="text-red-400 text-xs mt-1">{errors.youtube.message}</p>}
                    </div>
                  </div>

                </div>
              </section>

              {/* Mobile CTA (Hidden on Desktop, shown at bottom on mobile) */}
              <div className="lg:hidden pt-4 pb-8">
                <Button 
                  type="submit" 
                  form="create-team-form" 
                  disabled={isSubmitting} 
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {isSubmitting ? 'Creating Team...' : 'Create Team'}
                </Button>
              </div>

            </form>
          </div>

          {/* Right Sidebar: Preview & CTA */}
          <div className="lg:w-80 shrink-0 order-first lg:order-last mb-8 lg:mb-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between lg:hidden mb-4">
                <h2 className="text-xl font-bold text-white">Team Preview</h2>
              </div>
              
              <TeamPreviewCard 
                teamName={teamName}
                teamTag={teamTag}
                primaryGame={primaryGame}
                logoPreview={logo?.url}
              />

              {/* Desktop CTA */}
              <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Button 
                  type="submit" 
                  form="create-team-form" 
                  disabled={isSubmitting} 
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {isSubmitting ? 'Creating Team...' : 'Create Team'}
                </Button>
                <p className="text-xs text-slate-500 text-center mt-3">
                  By creating a team, you agree to the platform guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
