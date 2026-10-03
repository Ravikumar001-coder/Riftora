import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePublicProfileQuery, useIsFollowingQuery, useToggleFollowMutation, usePublicOrganizationTournamentsQuery } from '../../../features/organizations/api/usePublicOrganizationQueries';
import { useAuthStore } from '../../../store/authStore';
import { MapPin, Users, CheckCircle2, ChevronLeft, ShieldCheck, LogIn, Calendar, Globe, Camera, Video, Mail, MessageSquare } from 'lucide-react';
import { OrgSubdomainContext } from '../../../app/SubdomainApp';
import { TournamentCard } from '../../../portals/public/components/explore/TournamentCard';

export default function OrganizationProfilePage() {
  const params = useParams();
  const subdomainSlug = useContext(OrgSubdomainContext);
  const slug = subdomainSlug || params.slug || params.orgSlug;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const { data: org, isLoading, error } = usePublicProfileQuery(slug);
  const { data: isFollowing } = useIsFollowingQuery(org?.orgId);
  const toggleFollow = useToggleFollowMutation();
  const { data: tournamentsData, isLoading: isTournamentsLoading } = usePublicOrganizationTournamentsQuery(slug);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Organization Not Found</h2>
        <p className="text-slate-400 mb-6">The organization you are looking for might be private or doesn't exist.</p>
        <Link to="/orgs" className="text-blue-400 hover:text-blue-300">Browse Directory</Link>
      </div>
    );
  }

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { returnTo: `/orgs/${slug}` } });
      return;
    }
    toggleFollow.mutate(org.orgId);
  };

  return (
    <div className="min-h-screen bg-[#071426]">
      {/* Banner */}
      <div className="h-64 md:h-80 w-full relative bg-slate-900 border-b border-slate-800">
        {org.bannerUrl && (
          <img src={org.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute top-4 left-4 z-10">
          <Link to="/orgs" className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md text-white rounded-lg hover:bg-black/60 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Directory
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-slate-800 border-4 border-[#071426] flex items-center justify-center overflow-hidden shadow-2xl">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-white">{org.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="text-center md:text-left mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                {org.name}
                {org.isVerified && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span><strong className="text-white">{org.followerCount}</strong> Followers</span>
                </div>
                {(org.city || org.country) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {[org.city, org.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <button 
              onClick={handleFollowClick}
              disabled={toggleFollow.isPending}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isFollowing 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                  : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-900/30'
              } disabled:opacity-50`}
            >
              {!isAuthenticated ? (
                <><LogIn className="w-4 h-4" /> Sign in to Follow</>
              ) : isFollowing ? (
                <><CheckCircle2 className="w-4 h-4" /> Following</>
              ) : (
                'Follow Organization'
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-4">About {org.name}</h3>
              <div className="prose prose-invert max-w-none">
                {org.description ? (
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{org.description}</p>
                ) : (
                  <p className="text-slate-500 italic">No description provided.</p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-4">Recent Tournaments</h3>
              {isTournamentsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : tournamentsData?.content?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tournamentsData.content.map(tournament => (
                    <TournamentCard key={tournament.tournament_id || tournament.tournamentId} tournament={tournament} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-slate-700 rounded-xl">
                  <p className="text-slate-400">No public tournaments available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Organization Details</h3>
              
              <ul className="space-y-4">
                {org.primaryGame && (
                  <li className="flex flex-col">
                    <span className="text-xs text-slate-500 mb-1">Primary Game</span>
                    <span className="font-medium text-white">{org.primaryGame}</span>
                  </li>
                )}
                <li className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">Status</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Verified Active
                  </span>
                </li>
              </ul>
            </div>

            {(org.websiteUrl || org.discordLink || org.instagramHandle || org.youtubeUrl || org.contactEmail) && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Connect</h3>
                <div className="space-y-3">
                  {org.websiteUrl && (
                    <a href={org.websiteUrl.startsWith('http') ? org.websiteUrl : `https://${org.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                      <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">Website</span>
                    </a>
                  )}
                  {org.discordLink && (
                    <a href={org.discordLink.startsWith('http') ? org.discordLink : `https://${org.discordLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                      <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-[#5865F2]/20 group-hover:text-[#5865F2] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">Discord Server</span>
                    </a>
                  )}
                  {org.instagramHandle && (
                    <a href={org.instagramHandle.startsWith('http') ? org.instagramHandle : `https://instagram.com/${org.instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                      <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-pink-600/20 group-hover:text-pink-400 transition-colors">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{org.instagramHandle}</span>
                    </a>
                  )}
                  {org.youtubeUrl && (
                    <a href={org.youtubeUrl.startsWith('http') ? org.youtubeUrl : `https://${org.youtubeUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                      <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">YouTube Channel</span>
                    </a>
                  )}
                  {org.contactEmail && (
                    <a href={`mailto:${org.contactEmail}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                      <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-emerald-600/20 group-hover:text-emerald-400 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{org.contactEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
