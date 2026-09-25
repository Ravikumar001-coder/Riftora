import React, { useState, useEffect } from 'react';
import { Menu, MonitorPlay } from 'lucide-react';
import { DocsSidebar } from '../../components/docs/DocsSidebar';
import { DocsTableOfContents } from '../../components/docs/DocsTableOfContents';
import { CodeBlock } from '../../components/docs/CodeBlock';

const mockHeadings = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "leaderboard-overlay", text: "Leaderboard Overlay", level: 2 },
  { id: "match-bar-overlay", text: "Match Bar Overlay", level: 2 }
];

export function OverlayDocumentationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "OBS Overlays | Riftora Documentation";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex pt-20">
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-900/50"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <DocsSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      <main className="flex-1 min-w-0 max-w-full">
        <div className="max-w-5xl mx-auto px-6 py-12 flex gap-12">
          
          <div className="flex-1 min-w-0">
            <div className="mb-4 text-sm font-medium text-green-400 uppercase tracking-wider flex items-center gap-2">
              <MonitorPlay className="w-4 h-4" />
              Broadcasting
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
              OBS Overlay Setup
            </h1>

            <div className="prose prose-invert prose-blue max-w-none prose-headings:scroll-mt-24">
              <h2 id="overview" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Riftora provides real-time, transparent web graphics designed to be integrated directly into OBS Studio, 
                vMix, or any other broadcasting software that supports browser sources.
              </p>
              
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg my-8">
                <p className="text-yellow-200 text-sm m-0 font-medium">
                  <strong>Security Notice:</strong> Never expose your private overlay URLs or stream tokens on stream. 
                  These URLs contain authentication tokens that grant access to your tournament data.
                </p>
              </div>

              <h2 id="leaderboard-overlay" className="text-2xl font-bold text-white mt-16 mb-4 border-b border-white/10 pb-2">Leaderboard Overlay</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Displays the live standings of your tournament. It automatically scrolls if there are more teams than can fit on screen.
              </p>
              
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">OBS Settings</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-6">
                <li><strong>Width:</strong> 1920</li>
                <li><strong>Height:</strong> 1080</li>
                <li><strong>Custom CSS:</strong> (Leave blank)</li>
              </ul>
              
              <CodeBlock language="text" code="https://riftora.com/overlays/leaderboard?token=<YOUR_OVERLAY_TOKEN>" />

              <h2 id="match-bar-overlay" className="text-2xl font-bold text-white mt-16 mb-4 border-b border-white/10 pb-2">Match Bar Overlay</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                A lower-third or top-bar graphic displaying the current match status, tournament name, and sponsor logos.
              </p>
              
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">OBS Settings</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mb-6">
                <li><strong>Width:</strong> 1920</li>
                <li><strong>Height:</strong> 150</li>
              </ul>
              
              <CodeBlock language="text" code="https://riftora.com/overlays/match-bar?token=<YOUR_OVERLAY_TOKEN>&position=top" />
            </div>
          </div>

          <DocsTableOfContents headings={mockHeadings} />
        </div>
      </main>
    </div>
  );
}
