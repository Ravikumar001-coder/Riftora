import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, AlertCircle, Building2, Gamepad2, 
  AlignLeft, Globe, ImageIcon, ArrowRight, ArrowLeft, Check, Users 
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../services/api';

const organizationSchema = z.object({
  org_name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  org_slug: z.string().min(3, "Slug must be at least 3 characters").max(30, "Slug must be less than 30 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  primary_games: z.array(z.string()).min(1, "Please select at least one game"),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal('')),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  logo_file: z.any().optional(),
});

export function OrganizerSetupForm({ onSuccess }) {
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isValidatingNext, setIsValidatingNext] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(organizationSchema),
    mode: 'onChange',
    defaultValues: {
      org_name: '',
      org_slug: '',
      primary_games: [],
      description: '',
      website_url: '',
      logo_file: null
    }
  });

  const orgName = watch('org_name');
  const orgSlug = watch('org_slug');
  const description = watch('description');
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  useEffect(() => {
    if (!isSlugEdited) {
      const generated = orgName ? orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 30) : '';
      setValue('org_slug', generated, { shouldValidate: step === 1 });
    }
  }, [orgName, isSlugEdited, setValue, step]);

  const [debouncedSlug, setDebouncedSlug] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(orgSlug);
    }, 500);
    return () => clearTimeout(timer);
  }, [orgSlug]);

  const { data: slugCheck, isFetching: isCheckingSlug } = useQuery({
    queryKey: ['check-slug', debouncedSlug],
    queryFn: async () => {
      if (!debouncedSlug || debouncedSlug.length < 3) return null;
      const res = await api.get(`/organizations/check-slug?slug=${debouncedSlug}`);
      return res.data?.data?.available ?? false;
    },
    enabled: !!debouncedSlug && debouncedSlug.length >= 3,
    staleTime: 60000,
  });

  const { data: gamesData, isLoading: isGamesLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await api.get('/games');
      let allGames = response.data?.data || response.data?.content || response.data || [];
      if (!Array.isArray(allGames)) allGames = [];
      
      // Filter ONLY for BGMI and Free Fire as requested by project constraints
      return allGames.filter(g => {
        const code = (g.gameCode || g.game_code || g.code || '').toLowerCase();
        const name = (g.gameName || g.game_name || g.name || '').toLowerCase();
        return code === 'bgmi' || code === 'free-fire-max' || name.includes('bgmi') || name.includes('free fire');
      });
    },
    retry: 2,
    staleTime: 300000
  });

  const games = gamesData || [];

  const createOrganizationMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.post('/organizations', data);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          // Mock successful response if endpoint doesn't exist yet for seamless UI dev
          await new Promise(resolve => setTimeout(resolve, 800));
          return { id: 'mock-org-123', slug: orgSlug, ...data };
        }
        throw error;
      }
    },
    onSuccess: async (orgData) => {
      try {
        const authRes = await api.get('/auth/me');
        if (authRes.data && authRes.data.data) {
          updateUser({
            ...authRes.data.data,
            onboarding_completed: true,
            onboarding_path: 'organizer'
          });
        } else if (authRes.data) {
          updateUser({
            ...authRes.data,
            onboarding_completed: true,
            onboarding_path: 'organizer'
          });
        }
      } catch (e) {
        console.error('Failed to refresh user profile:', e);
        // Fallback to local state update
        updateUser({ 
          onboarding_completed: true,
          orgRoles: [{ orgId: orgData.org_id || orgData.id, role: 'Org Owner' }],
          org_roles: ['Org Owner'],
          onboarding_path: 'organizer'
        });
      }
      onSuccess?.('/dashboard/organizer');
    }
  });

  const onSubmit = async (data) => {
    try {
      await createOrganizationMutation.mutateAsync({
        org_name: data.org_name,
        org_slug: data.org_slug,
        primary_game_id: data.primary_games.length > 0 ? data.primary_games[0] : undefined,
        description: data.description || undefined,
        logo_url: data.logo_file ? data.logo_file.name : undefined,
        website_url: data.website_url || undefined,
      });
    } catch (error) {
      const errData = error.response?.data;
      let msg = "";
      if (errData?.message) msg = errData.message;
      else if (errData?.error && typeof errData.error === 'string') msg = errData.error;
      else if (errData?.error?.message) msg = errData.error.message;
      
      if (msg) {
        const isSlugError = msg.toLowerCase().includes('slug');
        const isNameError = msg.toLowerCase().includes('name');
        
        if (isSlugError || isNameError || msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('taken')) {
          createOrganizationMutation.reset();
          setDirection(-1);
          setStep(1);
          
          setTimeout(() => {
            if (isSlugError) setError('org_slug', { type: 'server', message: msg });
            else if (isNameError) setError('org_name', { type: 'server', message: msg });
            else setError('org_slug', { type: 'server', message: msg });
          }, 400);
        }
      }
    }
  };

  const nextStep = async () => {
    if ((step === 1 && isCheckingSlug) || isValidatingNext) return;

    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['org_name', 'org_slug', 'primary_games'];
    if (step === 2) fieldsToValidate = ['description', 'website_url', 'logo_file'];

    const isStepValid = await trigger(fieldsToValidate);
    if (!isStepValid) return;
    
    if (step === 1) {
      setIsValidatingNext(true);
      try {
        const res = await api.get(`/organizations/check-slug?slug=${orgSlug}`);
        const isAvailable = res.data?.data?.available ?? false;
        
        if (!isAvailable) {
          setError('org_slug', { 
            type: 'manual', 
            message: 'Organization slug is already taken. Please choose a different one.' 
          });
          setIsValidatingNext(false);
          return; 
        }
      } catch (err) {
        console.error('Failed to verify slug:', err);
      }
      setIsValidatingNext(false);
    }

    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative'
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      position: 'absolute'
    })
  };

  const isPending = createOrganizationMutation.isPending;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Wizard Progress */}
      <div className="flex items-center justify-center mb-8 space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
              step === i ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 
              step > i ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {step > i ? <Check className="w-4 h-4" /> : i}
            </div>
            {i < 3 && (
              <div className={`w-12 h-1 rounded-full mx-2 transition-colors duration-300 ${
                step > i ? 'bg-green-500/50' : 'bg-slate-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative overflow-hidden min-h-[350px]">
        <AnimatePresence initial={false} custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6 w-full px-1"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">Basic Information</h3>
                <p className="text-sm text-slate-400">Let's start with your organization's core details.</p>
              </div>

              {/* Org Name */}
              <div className="space-y-2">
                <label htmlFor="org_name" className="block text-sm font-medium text-slate-300">
                  Organization Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="org_name"
                    type="text"
                    placeholder="e.g. Hydra Events"
                    {...register("org_name")}
                    className={`w-full bg-slate-900/50 border ${errors.org_name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 ${errors.org_name ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-200 placeholder:text-slate-600 focus:-translate-y-0.5`}
                  />
                  <div className="absolute right-3 top-3.5 text-xs text-slate-500 font-medium">
                    {(orgName?.length || 0)}/50
                  </div>
                </div>
                {errors.org_name && (
                  <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.org_name.message}
                  </p>
                )}
                {/* Slug Input */}
                <div className="space-y-2 mt-3">
                  <label htmlFor="org_slug" className="block text-sm font-medium text-slate-300">
                    Organization URL
                  </label>
                  <div className={`relative group p-2.5 bg-slate-950/50 rounded-lg border ${errors.org_slug || slugCheck === false ? 'border-red-500/50' : 'border-slate-800/50 focus-within:border-blue-500'} flex items-center justify-between gap-2 transition-colors`}>
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs text-slate-400 font-mono">gameverse.gg/org/</span>
                      <input
                        id="org_slug"
                        type="text"
                        {...register("org_slug")}
                        onChange={(e) => {
                          setIsSlugEdited(true);
                          setValue("org_slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''), { shouldValidate: true });
                        }}
                        className="bg-transparent border-none outline-none text-white font-semibold text-xs font-mono w-full min-w-[50px] p-0 focus:ring-0"
                        placeholder="your-slug"
                      />
                    </div>
                    {orgSlug?.length >= 3 && (
                      <div className="shrink-0 text-xs font-medium pr-1">
                        {isCheckingSlug ? (
                          <span className="text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Checking...</span>
                        ) : slugCheck === false ? (
                          <span className="text-red-400">Taken</span>
                        ) : slugCheck === true ? (
                          <span className="text-green-400">Available</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {errors.org_slug && (
                    <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      {errors.org_slug.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Primary Games */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                  Primary Games
                </label>
                {isGamesLoading ? (
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading games...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {games.map(g => {
                      const gameId = g.gameId || g.game_id || g.id;
                      const gameName = g.gameName || g.game_name || g.name;
                      const selectedGames = watch('primary_games') || [];
                      const isSelected = selectedGames.includes(gameId);
                      return (
                        <label 
                          key={gameId} 
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-600/20 border-blue-500 text-white' 
                              : 'bg-slate-900/80 border-slate-600 text-slate-200 hover:border-blue-500/50 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={gameId}
                            {...register("primary_games")}
                            className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-950"
                          />
                          <span className="text-sm font-medium">{gameName}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {errors.primary_games && (
                  <p className="text-red-400 text-sm flex items-center gap-1.5 mt-2" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.primary_games.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6 w-full px-1"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">Organization Profile</h3>
                <p className="text-sm text-slate-400">Add details to help players find you.</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                  Description
                </label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 pl-4 flex pointer-events-none">
                    <AlignLeft className="text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <textarea
                    id="description"
                    placeholder="Briefly describe your esports organization..."
                    {...register("description")}
                    rows={4}
                    className={`w-full bg-slate-900/50 border ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 ${errors.description ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-200 placeholder:text-slate-600 resize-none focus:-translate-y-0.5`}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-slate-400 font-medium bg-slate-900/80 px-2 py-1 rounded">
                    {(description?.length || 0)}/500
                  </div>
                </div>
                {errors.description && (
                  <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label htmlFor="website_url" className="block text-sm font-medium text-slate-300">
                  Website (Optional)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="website_url"
                    type="text"
                    placeholder="https://example.com"
                    {...register("website_url")}
                    className={`w-full bg-slate-900/50 border ${errors.website_url ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 ${errors.website_url ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all duration-200 placeholder:text-slate-600 focus:-translate-y-0.5`}
                  />
                </div>
                {errors.website_url && (
                  <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.website_url.message}
                  </p>
                )}
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Organization Logo (Optional)
                </label>
                <div className="border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                  <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center mb-3 border border-slate-800 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                    <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-slate-300 mb-1">Click or drag to upload logo</p>
                  <p className="text-xs text-slate-500 mb-4">SVG, PNG, JPG or GIF (Max 2MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setValue("logo_file", e.target.files[0]);
                      }
                    }}
                  />
                  {watch("logo_file") && (
                    <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center rounded-xl border border-blue-500/50">
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-400 mb-1 flex items-center gap-2 justify-center">
                          <Check className="w-4 h-4" /> Logo Selected
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">
                          {watch("logo_file").name}
                        </p>
                        <button type="button" className="text-xs text-slate-500 underline mt-2 hover:text-slate-300 relative z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValue("logo_file", null); }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6 w-full flex flex-col items-center py-6 px-1"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-2 border border-blue-500/20">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Invite Your Team</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  Riftora is better with your team. You can invite staff and managers later from your organization dashboard.
                </p>
              </div>

              {/* API Errors */}
              {createOrganizationMutation.isError && (
                <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3 mt-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Failed to Create Organization</p>
                    <p>
                      {(() => {
                        const errData = createOrganizationMutation.error?.response?.data;
                        if (errData?.message) return errData.message;
                        if (errData?.errors && Array.isArray(errData.errors)) return errData.errors.map(e => e.defaultMessage || e.msg).join(', ');
                        if (errData?.error) {
                          if (typeof errData.error === 'string') return errData.error;
                          if (errData.error.message) return errData.error.message;
                          return JSON.stringify(errData.error);
                        }
                        return "A conflict occurred or invalid data was sent. Please go back and check your inputs.";
                      })()}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            disabled={isPending}
            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        )}
        
        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={(step === 1 && isCheckingSlug) || isValidatingNext}
            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:shadow-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {(step === 1 && isCheckingSlug) || isValidatingNext ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Checking...</>
            ) : (
              <>Next Step <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:shadow-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
        )}
      </div>
    </div>
  );
}
