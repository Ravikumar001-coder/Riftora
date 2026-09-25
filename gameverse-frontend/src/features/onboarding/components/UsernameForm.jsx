import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../auth/api/auth.service';
import { useAuthStore } from '../../../store/authStore';

// We'll enforce a generic safe username schema: 3-20 chars, alphanumeric and underscores only.
const usernameSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
});

export function UsernameForm({ onSuccess }) {
  const { updateUser } = useAuthStore();
  const [debouncedUsername, setDebouncedUsername] = useState("");
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    setError
  } = useForm({
    resolver: zodResolver(usernameSchema),
    mode: 'onChange' // Validate on every keystroke
  });

  const usernameValue = watch("username", "");

  // Debounce the input for availability checking
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only set debounced if valid format
      if (usernameValue && usernameValue.length >= 3 && !errors.username) {
        setDebouncedUsername(usernameValue);
      } else {
        setDebouncedUsername(""); // Clear if invalid so we don't query
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [usernameValue, errors.username]);

  // Check Availability Query
  const { 
    data: availability, 
    isFetching: isChecking,
    isError: isCheckError
  } = useQuery({
    queryKey: ['usernameCheck', debouncedUsername],
    queryFn: () => authService.checkUsername(debouncedUsername),
    enabled: !!debouncedUsername && debouncedUsername.length >= 3,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (username) => authService.updateProfile({ username }),
    onSuccess: (data) => {
      // Update global auth store state
      updateUser(data);
      onSuccess?.();
    },
    onError: (error) => {
      // Map backend error to field if possible
      const message = error.response?.data?.message || "Failed to save username. Please try again.";
      setError("username", { type: "server", message });
    }
  });

  const onSubmit = (data) => {
    if (availability?.available === false) {
      setError("username", { type: "manual", message: "This username is already taken." });
      return;
    }
    saveMutation.mutate(data.username);
  };

  const isAvailable = availability?.available === true;
  const isTaken = availability?.available === false;
  const isCurrentlyChecking = isChecking;
  
  // URL preview building
  const baseUrl = window.location.origin;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6">
      
      <div className="space-y-4">
        <label htmlFor="username" className="block text-sm font-medium text-slate-300">
          Username
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-500 font-medium text-lg">@</span>
          </div>
          <input
            id="username"
            type="text"
            placeholder="riftora_player"
            {...register("username")}
            className={`w-full bg-slate-900/50 border ${errors.username || isTaken || isCheckError ? 'border-red-500/50 focus:border-red-500' : isAvailable ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 focus:border-blue-500'} text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-1 ${errors.username || isTaken || isCheckError ? 'focus:ring-red-500' : isAvailable ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600 text-lg`}
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          
          {/* Status Icons */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            {isCurrentlyChecking && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
            {!isCurrentlyChecking && isAvailable && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {!isCurrentlyChecking && (errors.username || isTaken || isCheckError) && usernameValue && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
        </div>

        {/* Validation / Status Message */}
        <div className="flex justify-between items-start min-h-[24px]">
          <div className="flex-1">
            {errors.username ? (
            <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
              <AlertCircle className="w-4 h-4" />
              {errors.username.message}
            </p>
          ) : isCurrentlyChecking ? (
            <p className="text-blue-400 text-sm" role="status">Checking availability...</p>
          ) : isAvailable ? (
            <p className="text-green-400 text-sm flex items-center gap-1.5" role="status">
              <CheckCircle2 className="w-4 h-4" />
              Username is available
            </p>
          ) : isTaken ? (
            <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
              <XCircle className="w-4 h-4" />
              This username is already taken.
            </p>
          ) : isCheckError ? (
            <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
              <AlertCircle className="w-4 h-4" />
              Couldn't check availability. Please try again.
            </p>
          ) : (
            <p className="text-slate-400 text-sm">
              Use letters, numbers, and underscores (3-20 chars).
            </p>
          )}
          </div>
          <div className="text-slate-500 text-xs font-mono pl-2 shrink-0">
            {usernameValue.length}/20
          </div>
        </div>
      </div>

      {/* Profile URL Preview */}
      <div className="bg-black/20 rounded-xl p-3 mt-4 flex items-center justify-center">
        <p className="text-slate-400 font-mono text-sm break-all">
          {baseUrl}/profile/<span className={isAvailable ? 'text-green-400 font-bold' : 'text-slate-300 font-bold'}>{usernameValue || 'username'}</span>
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={saveMutation.isPending || !isValid || !isAvailable || isCurrentlyChecking}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:hover:shadow-none flex items-center justify-center gap-2 text-lg mt-6"
      >
        {saveMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving Username...
          </>
        ) : (
          "Continue"
        )}
      </button>

      {/* Safe Error Fallback for Server Errors */}
      {saveMutation.isError && !errors.username && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
          <p className="font-semibold mb-1">Something Went Wrong</p>
          <p>We couldn't save your username right now. Please try again.</p>
        </div>
      )}
    </form>
  );
}
