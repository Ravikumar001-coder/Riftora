import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Menu, ArrowLeft, ArrowRight } from 'lucide-react';
import { DocsSidebar } from '../../components/docs/DocsSidebar';
import { DocsTableOfContents } from '../../components/docs/DocsTableOfContents';
import { mockArticleContent } from '../../../../services/docsData';
// In a real scenario, you would parse the markdown and extract headings.
// For this mock, we'll manually define them.
const mockHeadings = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "requirements", text: "Requirements", level: 2 },
  { id: "step-by-step-setup", text: "Step-by-Step Setup", level: 2 },
  { id: "common-issues", text: "Common Issues", level: 2 }
];

export function DocsArticlePage() {
  const { category, articleSlug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = `${articleSlug ? articleSlug.replace(/-/g, ' ') : 'Article'} | Riftora Documentation`;
    window.scrollTo(0, 0);
  }, [articleSlug]);

  return (
    <div className="min-h-screen bg-slate-950 flex pt-20">
      {/* Mobile Menu Toggle */}
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
            <div className="mb-4 text-sm font-medium text-blue-400 uppercase tracking-wider">
              {category ? category.replace(/-/g, ' ') : 'Category'}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8 capitalize">
              {articleSlug ? articleSlug.replace(/-/g, ' ') : 'Documentation Article'}
            </h1>

            {/* Simulated Markdown Render */}
            <div className="prose prose-invert prose-blue max-w-none prose-headings:scroll-mt-24">
              <h2 id="overview" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Tournament registration is the process of enrolling your team into an event. 
                Organizers may require specific conditions to be met before a registration is approved.
              </p>

              <h2 id="requirements" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Requirements</h2>
              <p className="text-slate-300 leading-relaxed mb-4">Before registering, ensure that:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-6 marker:text-blue-500">
                <li>You are the Captain of your team.</li>
                <li>Your team meets the minimum roster size requirements.</li>
                <li>All players have linked their game accounts.</li>
              </ol>

              <h2 id="step-by-step-setup" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Step-by-Step Setup</h2>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-6 marker:text-blue-500">
                <li>Navigate to the Tournament Overview page.</li>
                <li>Click the <strong className="text-white">Register Team</strong> button.</li>
                <li>Select the team you wish to enter.</li>
                <li>Choose the players from your roster who will compete.</li>
                <li>Accept the tournament rules and submit your registration.</li>
              </ol>

              <h2 id="common-issues" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Common Issues</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6 marker:text-red-500">
                <li><strong className="text-white">Missing Game Accounts:</strong> If a player hasn't linked their game account, you cannot select them.</li>
                <li><strong className="text-white">Region Locks:</strong> Some tournaments restrict entry based on player regions.</li>
              </ul>

              <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg my-8">
                <p className="text-blue-200 text-sm m-0">
                  <strong className="text-blue-400">Note:</strong> If the tournament has an entry fee, you will be redirected to the payment gateway after submitting your roster.
                </p>
              </div>
            </div>

            {/* Article Navigation */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4">
              <Link to="/docs/tournaments" className="flex flex-col items-start p-4 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-slate-900 transition-colors group">
                <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Previous
                </span>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Discover Tournaments</span>
              </Link>
              
              <Link to="/docs/tournaments/check-in" className="flex flex-col items-end p-4 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-slate-900 transition-colors group sm:text-right">
                <span className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                  Next <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Tournament Check-In</span>
              </Link>
            </div>
            
            {/* Feedback */}
            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <span className="text-sm text-slate-400">Was this helpful?</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 border border-white/5 rounded-lg hover:bg-slate-800 transition-colors">👍 Yes</button>
                <button className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-900 border border-white/5 rounded-lg hover:bg-slate-800 transition-colors">👎 No</button>
              </div>
            </div>

          </div>

          <DocsTableOfContents headings={mockHeadings} />
        </div>
      </main>
    </div>
  );
}
