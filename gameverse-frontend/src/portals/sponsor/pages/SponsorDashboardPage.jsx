import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { sponsorDashboardData } from '../../../services/mockData';
import { SponsorHeader } from '../components/SponsorHeader';
import { SponsorshipSummary } from '../components/SponsorshipSummary';
import { BrandIdentityCard } from '../components/BrandIdentityCard';
import { BrandPerformance } from '../components/BrandPerformance';
import { BrandPlacements } from '../components/BrandPlacements';
import { DeliverablesTracker } from '../components/DeliverablesTracker';
import { CampaignMilestones } from '../components/CampaignMilestones';
import { UpcomingEvents } from '../components/UpcomingEvents';
import { TournamentEngagement } from '../components/TournamentEngagement';
import { SponsorAssets } from '../components/SponsorAssets';
import { SponsorUpdates } from '../components/SponsorUpdates';
import { QuickActions } from '../components/QuickActions';
import { SponsorContact } from '../components/SponsorContact';
import { Loader2 } from 'lucide-react';

export function SponsorDashboardPage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth Check for Sponsor Rep
    if (!user?.roles?.includes('SPONSOR_REP')) {
      navigate('/', { replace: true });
      return;
    }

    // Fetch mock data
    setTimeout(() => {
      setData(sponsorDashboardData);
      setLoading(false);
    }, 800);
  }, [user, navigate, tournamentId]);

  if (loading) {
    return (
      <>
        <div className="min-h-screen w-full flex items-center justify-center relative z-10">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">No Sponsorship Campaign</h2>
          <p className="text-slate-400 text-center mb-6">This tournament does not have an active sponsorship campaign associated with your account.</p>
          <Link to="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Return Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full relative z-10 overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <SponsorHeader tournament={data.tournament} sponsor={data.sponsor} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SponsorshipSummary sponsor={data.sponsor} campaign={data.campaign} tournament={data.tournament} />
              <BrandPerformance analytics={data.analytics} />
              <BrandPlacements placements={data.placements} />
              <DeliverablesTracker deliverables={data.deliverables} />
            </div>
            
            <div className="space-y-6">
              <BrandIdentityCard sponsor={data.sponsor} />
              <LiveVisibilityStatus visibility={data.liveVisibility} isLive={data.tournament.status === 'LIVE'} />
              <CampaignMilestones milestones={data.milestones} />
              <UpcomingEvents events={data.upcomingEvents} tournamentSlug={data.tournament.slug} />
              <TournamentEngagement engagement={data.engagement} />
              <SponsorAssets assets={data.assets} />
              <SponsorUpdates updates={data.updates} />
              <QuickActions tournamentSlug={data.tournament.slug} />
              <SponsorContact contact={data.sponsor.contact} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function LiveVisibilityStatus({ visibility, isLive }) {
  if (!isLive) return null;
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-400 tracking-wider mb-4 uppercase">Live Brand Visibility</h3>
      <div className="space-y-3">
        {visibility.map((v, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="text-slate-300">{v.name}</span>
            {v.status === 'ACTIVE' && <span className="flex items-center text-green-400 font-medium"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>Active</span>}
            {v.status === 'UPCOMING' && <span className="flex items-center text-blue-400"><span className="w-1.5 h-1.5 rounded-full border border-blue-500 mr-2"></span>Upcoming</span>}
            {v.status === 'PENDING' && <span className="flex items-center text-slate-500"><span className="w-1.5 h-1.5 rounded-full border border-slate-600 mr-2"></span>Pending</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
