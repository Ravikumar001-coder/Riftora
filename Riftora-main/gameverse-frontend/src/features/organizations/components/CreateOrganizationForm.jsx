import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle, Upload, X } from 'lucide-react';

const organizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters").max(50, "Organization name must be less than 50 characters"),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be less than 30 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .refine(val => !val.startsWith('-') && !val.endsWith('-'), "Slug cannot start or end with a hyphen")
    .refine(val => !val.includes('--'), "Slug cannot contain consecutive hyphens"),
  primaryGameId: z.string().min(1, "Please select a primary game"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  instagramHandle: z.string().max(255).optional(),
  youtubeUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  discordLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

import { useGames } from '../../games/hooks/useGameQueries';

export function CreateOrganizationForm({ onSubmit, isPending, setDirty }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm({
    resolver: zodResolver(organizationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      primaryGameId: '',
      description: '',
      country: '',
      city: '',
      websiteUrl: '',
      instagramHandle: '',
      youtubeUrl: '',
      discordLink: ''
    }
  });

  const { data: games, isLoading: isGamesLoading } = useGames();

  const orgName = watch('name');
  const description = watch('description');

  // Notify parent of dirty state
  useEffect(() => {
    setDirty(isDirty || logoPreview !== null || bannerPreview !== null);
  }, [isDirty, logoPreview, bannerPreview, setDirty]);

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!isSlugManuallyEdited && orgName) {
      const generatedSlug = orgName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-')         // Spaces to hyphens
        .replace(/-+/g, '-')          // Remove consecutive hyphens
        .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens

      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [orgName, isSlugManuallyEdited, setValue]);

  const handleSlugEdit = (e) => {
    setIsSlugManuallyEdited(true);
    // Allow react-hook-form to process the event
    register('slug').onChange(e);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  const handleFormSubmit = (data) => {
    // Clean up empty URLs to null/undefined instead of passing empty string if optional
    const cleanedData = { ...data };
    if (!cleanedData.websiteUrl) delete cleanedData.websiteUrl;
    if (!cleanedData.youtubeUrl) delete cleanedData.youtubeUrl;
    if (!cleanedData.discordLink) delete cleanedData.discordLink;

    // Add media previews to data payload (frontend only)
    onSubmit({ ...cleanedData, logoPreview, bannerPreview });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      
      {/* Section 1: Organization Identity */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Organization Identity</h2>
          <p className="text-sm text-slate-400 mt-1">This is how your organization will appear to the public.</p>
        </div>

        <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Organization Logo
            </label>
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                {logoPreview ? (
                  <div className="relative w-24 h-24 rounded-2xl border border-slate-700 overflow-hidden bg-slate-800 group">
                    <img src={logoPreview} alt="Organization Logo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setLogoPreview(null)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>
              <div className="text-sm text-slate-500">
                <p className="font-medium text-slate-400 mb-1">Upload organization logo</p>
                <p>PNG, JPG or WebP.</p>
                <p>Recommended: square image, at least 400x400px.</p>
              </div>
            </div>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Organization Banner
            </label>
            <div className="flex items-start gap-6">
              <div className="shrink-0 w-full sm:w-80">
                {bannerPreview ? (
                  <div className="relative w-full h-32 rounded-2xl border border-slate-700 overflow-hidden bg-slate-800 group">
                    <img src={bannerPreview} alt="Organization Banner" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setBannerPreview(null)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-32 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Upload Banner</span>
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleBannerUpload} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Org Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Organization Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Riftora Esports"
              {...register("name")}
              className={`w-full bg-slate-950/50 border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Org Slug */}
          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-slate-300">
              Organization Slug *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none select-none">
                riftora.gg/organizations/
              </span>
              <input
                id="slug"
                type="text"
                placeholder="riftora-esports"
                {...register("slug")}
                onChange={handleSlugEdit}
                className={`w-full bg-slate-950/50 border ${errors.slug ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 pr-4 pl-[190px] focus:outline-none focus:ring-1 ${errors.slug ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
              />
            </div>
            {errors.slug ? (
              <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.slug.message}
              </p>
            ) : (
              <p className="text-slate-500 text-sm mt-1">This is your unique URL. It must be lowercase and contain no spaces.</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Organization Profile */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Organization Profile</h2>
          <p className="text-sm text-slate-400 mt-1">Provide more details to help players find and understand your organization.</p>
        </div>

        <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary Game */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label htmlFor="primaryGameId" className="block text-sm font-medium text-slate-300">
                Primary Game *
              </label>
              <select
                id="primaryGameId"
                {...register("primaryGameId")}
                className={`w-full bg-slate-950/50 border ${errors.primaryGameId ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.primaryGameId ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors appearance-none`}
                disabled={isGamesLoading}
              >
                <option value="" disabled>
                  {isGamesLoading ? "Loading games..." : "Select primary game"}
                </option>
                {games?.map(game => (
                  <option key={game.gameId} value={game.gameId}>{game.gameName}</option>
                ))}
              </select>
              {errors.primaryGameId && (
                <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.primaryGameId.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                Description
              </label>
              <span className="text-xs text-slate-500">
                {description?.length || 0} / 500
              </span>
            </div>
            <textarea
              id="description"
              placeholder="Tell us about your organization's goals, the games you focus on, and your community."
              {...register("description")}
              rows={4}
              className={`w-full bg-slate-950/50 border ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.description ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600 resize-none`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm flex items-center gap-1.5 mt-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Country */}
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-slate-300">
                Country
              </label>
              <input
                id="country"
                type="text"
                placeholder="e.g. United States"
                {...register("country")}
                className={`w-full bg-slate-950/50 border ${errors.country ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.country ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-slate-300">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="e.g. Los Angeles"
                {...register("city")}
                className={`w-full bg-slate-950/50 border ${errors.city ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.city ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Section 3: Social Links */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Social Links</h2>
          <p className="text-sm text-slate-400 mt-1">Connect your organization's social platforms.</p>
        </div>

        <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Website URL */}
            <div className="space-y-2">
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-300">
                Website
              </label>
              <input
                id="websiteUrl"
                type="text"
                placeholder="https://riftora.gg"
                {...register("websiteUrl")}
                className={`w-full bg-slate-950/50 border ${errors.websiteUrl ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.websiteUrl ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
              />
              {errors.websiteUrl && <p className="text-red-400 text-sm mt-1">{errors.websiteUrl.message}</p>}
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <label htmlFor="instagramHandle" className="block text-sm font-medium text-slate-300">
                Instagram Handle
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                  @
                </span>
                <input
                  id="instagramHandle"
                  type="text"
                  placeholder="riftora"
                  {...register("instagramHandle")}
                  className={`w-full bg-slate-950/50 border ${errors.instagramHandle ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 pr-4 pl-10 focus:outline-none focus:ring-1 ${errors.instagramHandle ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
                />
              </div>
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-slate-300">
                YouTube Channel
              </label>
              <input
                id="youtubeUrl"
                type="text"
                placeholder="https://youtube.com/@riftora"
                {...register("youtubeUrl")}
                className={`w-full bg-slate-950/50 border ${errors.youtubeUrl ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.youtubeUrl ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
              />
              {errors.youtubeUrl && <p className="text-red-400 text-sm mt-1">{errors.youtubeUrl.message}</p>}
            </div>

            {/* Discord */}
            <div className="space-y-2">
              <label htmlFor="discordLink" className="block text-sm font-medium text-slate-300">
                Discord Server
              </label>
              <input
                id="discordLink"
                type="text"
                placeholder="https://discord.gg/riftora"
                {...register("discordLink")}
                className={`w-full bg-slate-950/50 border ${errors.discordLink ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.discordLink ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
              />
              {errors.discordLink && <p className="text-red-400 text-sm mt-1">{errors.discordLink.message}</p>}
            </div>
          </div>
          
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="submit"
          disabled={isPending || !isValid}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:hover:shadow-none flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Organization"
          )}
        </button>
      </div>

    </form>
  );
}
