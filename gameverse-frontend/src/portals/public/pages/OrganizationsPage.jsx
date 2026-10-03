import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicDirectoryQuery } from '../../../features/organizations/api/usePublicOrganizationQueries';
import { Search, MapPin, Users, CheckCircle2 } from 'lucide-react';

export default function OrganizationsPage() {
  const { data: orgs, isLoading } = usePublicDirectoryQuery();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const filteredOrgs = orgs?.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.primaryGame?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Organizations</h1>
          <p className="text-slate-400">Discover and follow esports organizations across the globe.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOrgs?.map(org => (
          <Link 
            key={org.orgId} 
            to={`/orgs/${org.slug}`}
            className="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20"
          >
            <div className="h-24 w-full bg-slate-900 relative">
              {org.bannerUrl && (
                <img src={org.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-50" />
              )}
              <div className="absolute -bottom-8 left-6">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border-4 border-slate-800/50 flex items-center justify-center overflow-hidden shadow-lg">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{org.name.charAt(0)}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-10 pb-6 px-6">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  {org.name}
                  {org.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                </h3>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                {org.description || "No description provided."}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  {org.followerCount} Followers
                </div>
                {(org.city || org.country) && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {[org.city, org.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredOrgs?.length === 0 && (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No organizations found</h3>
          <p className="text-slate-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
