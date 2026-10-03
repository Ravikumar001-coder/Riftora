import React, { useState } from 'react';
import { BadgeCheck, MapPin, Globe, Share2, Plus, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function OrganizationHero({ org, isLoading }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${org.name} on Riftora`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // user cancelled or share failed, fallback to copy
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="w-full relative">
        {/* Cover Skeleton */}
        <div className="w-full h-48 md:h-64 lg:h-80 bg-white/5 animate-pulse" />
        
        {/* Profile Content Skeleton */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-white/10 animate-pulse border-4 border-[#071426]" />
            
            <div className="flex-1 w-full pb-2">
              <div className="h-8 w-64 bg-white/10 rounded animate-pulse mb-3" />
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 lg:h-80 relative overflow-hidden">
        <img 
          src={org.coverImage} 
          alt={`${org.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8">
          
          {/* Logo & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 flex-1">
            {/* Logo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative rounded-2xl overflow-hidden border-4 border-[#071426] shadow-2xl bg-[#0A1930]">
              <img 
                src={org.logo} 
                alt={`${org.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-rajdhani">
                  {org.name}
                </h1>
                {org.isVerified && (
                  <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm sm:text-base font-medium">
                {org.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {org.location}
                  </span>
                )}
                {org.website && (
                  <a 
                    href={org.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {org.foundedYear && (
                  <span className="hidden sm:inline-block">
                    • Founded {org.foundedYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto pb-2 shrink-0">
            <button
              onClick={handleFollowToggle}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
                isFollowing 
                  ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20 border border-transparent"
              )}
            >
              {isFollowing ? (
                <>
                  <Check className="w-4 h-4" /> Following
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Follow
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all relative"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline-block">Share</span>
              
              {/* Share Toast */}
              {showShareToast && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded shadow-xl whitespace-nowrap z-50">
                  Link copied!
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
