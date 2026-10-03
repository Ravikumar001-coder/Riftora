import React, { useState } from 'react';
import { BadgeCheck, MapPin, Share2, Plus, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function PlayerHero({ player, isLoading }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${player.displayName} on Riftora`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
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
      <div className="w-full relative pt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10 animate-pulse border-4 border-[#071426]" />
            <div className="flex-1 w-full pt-4">
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-3 mx-auto sm:mx-0" />
              <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-4 mx-auto sm:mx-0" />
              <div className="h-16 w-full max-w-md bg-white/5 rounded animate-pulse mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative pt-24 pb-8 bg-gradient-to-b from-blue-900/20 to-transparent">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative rounded-full overflow-hidden border-4 border-[#071426] shadow-2xl bg-[#0A1930]">
            <img 
              src={player.avatar} 
              alt={`${player.displayName} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-rajdhani">
                {player.displayName}
              </h1>
              {player.isVerified && (
                <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
              )}
            </div>
            
            <p className="text-blue-400 font-bold mb-4 tracking-wide">@{player.username}</p>

            <p className="text-slate-300 max-w-2xl mb-6 text-sm sm:text-base leading-relaxed">
              {player.bio}
            </p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-400 text-sm font-medium mb-8">
              {(player.country || player.region) && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4" />
                  {player.country || player.region}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleFollowToggle}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg",
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
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all relative"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline-block">Share</span>
                
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
    </div>
  );
}
