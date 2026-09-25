import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { organizationService } from '../../organizations/api/organization.service';
import { authService } from '../../auth/api/auth.service';

// Utility for frontend-only mock delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const organizationSchema = z.object({
  org_name: z.string().min(3, "Organization name must be at least 3 characters").max(50, "Organization name must be less than 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export function OrganizerSetupForm({ onSuccess }) {
  const { user, updateUser } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError
  } = useForm({
    resolver: zodResolver(organizationSchema),
    mode: 'onChange'
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data) => {
      // Mock network delay for frontend-only dev
      await delay(800);
      return { redirect_to: '/dashboard/organizer' };
    },
    onSuccess: (data) => {
      // Complete onboarding and handle redirect
      updateUser({ 
        onboarding_completed: true,
        org_roles: ['Org Owner'], // Mocking a role assignment
        onboarding_path: 'organizer'
      });
      onSuccess?.(data.redirect_to);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to complete onboarding. Please try again.";
      setError("root.serverError", { type: "server", message });
    }
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (data) => {
      // Mock network delay for frontend-only dev
      await delay(1000);
      return { id: 'mock-org-123', ...data };
    },
    onSuccess: (orgData) => {
      // Organization created successfully, now complete onboarding
      completeOnboardingMutation.mutate({
        username: user?.username || '',
        display_name: user?.display_name || user?.username || '',
        onboarding_path: 'organizer'
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create organization. Please try again.";
      setError("root.serverError", { type: "server", message });
    }
  });

  const onSubmit = (data) => {
    // If the backend already detected an org_roles or completed onboarding, we shouldn't be here,
    // but we add a safety guard just in case.
    if (user?.org_roles && user.org_roles.length > 0) {
      completeOnboardingMutation.mutate({
        username: user?.username || '',
        display_name: user?.display_name || user?.username || '',
        onboarding_path: 'organizer'
      });
      return;
    }

    createOrganizationMutation.mutate({
      org_name: data.org_name,
      description: data.description,
      logo_url: data.logo_url || undefined,
      website_url: data.website_url || undefined,
    });
  };

  const isPending = createOrganizationMutation.isPending || completeOnboardingMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6">
      
      {/* Org Name */}
      <div className="space-y-2">
        <label htmlFor="org_name" className="block text-sm font-medium text-slate-300">
          Organization Name
        </label>
        <input
          id="org_name"
          type="text"
          placeholder="e.g. Hydra Events"
          {...register("org_name")}
          className={`w-full bg-slate-900/50 border ${errors.org_name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.org_name ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
        />
        {errors.org_name && (
          <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {errors.org_name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-300">
          Tell Us About Your Organization
        </label>
        <textarea
          id="description"
          placeholder="Briefly describe your esports organization or the events you plan to organize."
          {...register("description")}
          rows={4}
          className={`w-full bg-slate-900/50 border ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.description ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600 resize-none`}
        />
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
        <input
          id="website_url"
          type="text"
          placeholder="https://example.com"
          {...register("website_url")}
          className={`w-full bg-slate-900/50 border ${errors.website_url ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.website_url ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
        />
        {errors.website_url && (
          <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {errors.website_url.message}
          </p>
        )}
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <label htmlFor="logo_url" className="block text-sm font-medium text-slate-300">
          Organization Logo URL (Optional)
        </label>
        <input
          id="logo_url"
          type="text"
          placeholder="https://example.com/logo.png"
          {...register("logo_url")}
          className={`w-full bg-slate-900/50 border ${errors.logo_url ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 ${errors.logo_url ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition-colors placeholder:text-slate-600`}
        />
        {errors.logo_url && (
          <p className="text-red-400 text-sm flex items-center gap-1.5" role="alert">
            <AlertCircle className="w-4 h-4" />
            {errors.logo_url.message}
          </p>
        )}
        <p className="text-xs text-slate-500">
          Provide a URL to your logo. Direct image upload will be available soon.
        </p>
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
            {createOrganizationMutation.isPending ? "Creating Organization..." : "Completing Setup..."}
          </>
        ) : (
          "Create Organization"
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
