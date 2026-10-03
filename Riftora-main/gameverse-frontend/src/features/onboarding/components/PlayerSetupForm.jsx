import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, AlertCircle, Camera, X } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../../auth/api/auth.service';
import { playerGames } from '../../../config/games';

const playerSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters").max(30, "Display name must be less than 30 characters"),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional().or(z.literal('')),
  primaryGame: z.string().min(1, "Please select a primary game"),
});

export function PlayerSetupForm({ onSuccess }) {
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(playerSchema),
    mode: 'onChange',
    defaultValues: {
      displayName: user?.display_name || user?.username || '',
      bio: '',
      primaryGame: '',
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: (data) => authService.completeOnboarding(data),
    onSuccess: (data) => {
      // Mocking the frontend state update
      updateUser({ onboarding_completed: true, display_name: watch('displayName') });
      onSuccess?.(data.redirect_to);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to setup player profile. Please try again.";
      setError("root.serverError", { type: "server", message });
    }
  });

  const onSubmit = (data) => {
    completeOnboardingMutation.mutate({
      username: user?.username || '',
      display_name: data.displayName,
      bio: data.bio,
      primary_game: data.primaryGame,
      onboarding_path: 'player'
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("root.serverError", { type: "manual", message: "Image must be less than 5MB" });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const isPending = completeOnboardingMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6">
      
      {/* Avatar Upload (Local Only) */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-800/80 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-slate-500" />
            )}
          </div>
          
          {avatarPreview && (
            <button
              type="button"
              onClick={removeAvatar}
              className="absolute -top-2 -right-2 bg-slate-700 hover:bg-red-500 text-white rounded-full p-1 transition-colors border border-slate-600"
              aria-label="Remove avatar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="mt-4">
          <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/20">
            {avatarPreview ? 'Change Photo' : 'Add Photo'}
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden" 
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <label htmlFor="displayName" className="block text-sm font-medium text-slate-300">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          placeholder="e.g. ShadowX"
          {...register("displayName")}
          className={`w-full bg-slate-900/50 border ${errors.displayName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.displayName ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
        />
        {errors.displayName && (
          <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {errors.displayName.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium text-slate-300">
          Bio <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <textarea
          id="bio"
          placeholder="Tell the community about yourself..."
          {...register("bio")}
          rows={3}
          className={`w-full bg-slate-900/50 border ${errors.bio ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.bio ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600 resize-none`}
        />
        {errors.bio && (
          <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {errors.bio.message}
          </p>
        )}
      </div>

      {/* Primary Game */}
      <div className="space-y-2">
        <label htmlFor="primaryGame" className="block text-sm font-medium text-slate-300">
          Primary Game
        </label>
        <div className="relative">
          <select
            id="primaryGame"
            {...register("primaryGame")}
            className={`w-full bg-slate-900/50 border ${errors.primaryGame ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 appearance-none focus:outline-none focus:ring-1 ${errors.primaryGame ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors`}
          >
            <option value="" disabled>Select your primary game ▼</option>
            {playerGames.map((game) => (
              <option key={game.id} value={game.id}>{game.label}</option>
            ))}
          </select>
        </div>
        {errors.primaryGame && (
          <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {errors.primaryGame.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || !isValid}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:hover:shadow-none flex items-center justify-center gap-2 text-lg mt-8"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Setting up your profile...
          </>
        ) : (
          "Continue"
        )}
      </button>

      {/* API Errors */}
      {errors.root?.serverError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
          <p className="font-semibold mb-1">Something Went Wrong</p>
          <p>{errors.root.serverError.message}</p>
        </div>
      )}
    </form>
  );
}
