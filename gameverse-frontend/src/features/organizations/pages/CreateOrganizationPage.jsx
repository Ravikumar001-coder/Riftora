import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { CreateOrganizationForm } from '../components/CreateOrganizationForm';
import { UnsavedChangesDialog } from '../../../components/feedback/UnsavedChangesDialog';
import { useOrganizationMutations } from '../api/useOrganizationMutations';
import { toast } from 'sonner';

export function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  
  const { createOrganization } = useOrganizationMutations();

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      // Typically going to dashboard or previous route
      navigate(-1);
    }
  };

  const handleConfirmLeave = () => {
    setShowUnsavedDialog(false);
    navigate(-1);
  };

  const handleSubmit = (data) => {
    // Map frontend form schema to backend DTO
    const payload = {
      orgName: data.name,
      orgSlug: data.slug,
      primaryGameId: data.primaryGameId,
      description: data.description,
      country: data.country || null,
      city: data.city || null,
      logoUrl: data.logoUrl || null,
      bannerUrl: data.bannerUrl || null,
      websiteUrl: data.websiteUrl || null,
      instagramHandle: data.instagramHandle || null,
      youtubeUrl: data.youtubeUrl || null,
      discordLink: data.discordLink || null,
    };

    createOrganization.mutate(payload, {
      onSuccess: () => {
        setIsDirty(false);
        toast.success('Organization created successfully');
        navigate(`/organizations/${data.slug}/manage/overview`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create organization');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="hidden sm:block h-6 w-px bg-slate-800" />
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 font-bold">
            R
          </div>
          <span className="text-white font-semibold tracking-tight hidden sm:block">Riftora</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Create your organization</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Set up the organization workspace that will manage your tournaments, events, and community members.
          </p>
        </div>

        <CreateOrganizationForm 
          onSubmit={handleSubmit}
          isPending={createOrganization.isPending}
          setDirty={setIsDirty}
        />

        <div className="mt-6 flex justify-center sm:hidden">
           <button 
            type="button"
            onClick={handleCancel}
            className="text-slate-400 hover:text-white text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </main>

      <UnsavedChangesDialog 
        isOpen={showUnsavedDialog}
        onConfirm={handleConfirmLeave}
        onCancel={() => setShowUnsavedDialog(false)}
      />
    </div>
  );
}
