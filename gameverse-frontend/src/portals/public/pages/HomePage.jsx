import React, { useEffect } from 'react';
import { HeroSection } from '../../../components/landing/HeroSection';
import { PlatformStats } from '../../../components/landing/PlatformStats';
import { OldWayVsRiftora } from '../../../components/landing/OldWayVsRiftora';
import { CommandCenterShowcase } from '../../../components/landing/CommandCenterShowcase';
import { WhyRiftora } from '../../../components/landing/WhyRiftora';
import { BuiltForBattleRoyale } from '../../../components/landing/BuiltForBattleRoyale';
import { OneMatchSourceOfTruth } from '../../../components/landing/OneMatchSourceOfTruth';
import { RealTimeResultPipeline } from '../../../components/landing/RealTimeResultPipeline';
import { BroadcastOBS } from '../../../components/landing/BroadcastOBS';
import { SponsorManagement } from '../../../components/landing/SponsorManagement';
import { SponsorBroadcastVisual } from '../../../components/landing/SponsorBroadcastVisual';
import { OneSponsorEveryTouchpoint } from '../../../components/landing/OneSponsorEveryTouchpoint';
import { PlatformRoles } from '../../../components/landing/PlatformRoles';
import { HowItWorks } from '../../../components/landing/HowItWorks';
import { RealTimeLeaderboards } from '../../../components/landing/RealTimeLeaderboards';
import { LiveTournaments } from '../../../components/landing/LiveTournaments';
import { FeaturedTournaments } from '../../../components/landing/FeaturedTournaments';
import { Organizations } from '../../../components/landing/Organizations';
import { TopTeams } from '../../../components/landing/TopTeams';
import { PlayerSpotlight } from '../../../components/landing/PlayerSpotlight';
import { SupportedGames } from '../../../components/landing/SupportedGames';
import { CallToAction } from '../../../components/landing/CallToAction';
import { TeamCaptainWorkflow } from '../../../components/landing/TeamCaptainWorkflow';
export function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col relative">
        <HeroSection />
        <PlatformStats />
        <OldWayVsRiftora />
        <CommandCenterShowcase />
        <WhyRiftora />
        <BuiltForBattleRoyale />
        <OneMatchSourceOfTruth />
        <RealTimeResultPipeline />
        <BroadcastOBS />
        <SponsorManagement />
        <SponsorBroadcastVisual />
        <OneSponsorEveryTouchpoint />
        <PlatformRoles />
        <HowItWorks />
        <RealTimeLeaderboards />
        <TeamCaptainWorkflow />
        
        {/* Discovery & Community Layer */}
        <div className="py-12 relative border-t border-slate-800/50">
          <div className="text-center mb-16 pt-8">
             <h2 className="text-3xl font-bold text-white mb-4">Discover the Community</h2>
             <p className="text-slate-400">Explore events and top players across the Riftora ecosystem.</p>
          </div>
          <LiveTournaments />
          <FeaturedTournaments />
          
          <div className="py-12 mt-12 border-t border-slate-800/30">
            <Organizations />
            <TopTeams />
            <PlayerSpotlight />
          </div>
        </div>

        <SupportedGames />
        <CallToAction />
      </div>
    </>
  );
}
