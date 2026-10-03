import React, { useState, useEffect } from 'react';
import { Menu, BookOpen } from 'lucide-react';
import { DocsSidebar } from '../../components/docs/DocsSidebar';
import { DocsTableOfContents } from '../../components/docs/DocsTableOfContents';
import { errorCodes } from '../../../../services/docsData';

const mockHeadings = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "error-codes", text: "Error Codes", level: 2 },
  ...errorCodes.map(err => ({ id: err.code.toLowerCase(), text: err.code, level: 3 }))
];

export function ErrorReferencePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Error Reference | Riftora Documentation";
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
            <div className="mb-4 text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Reference
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
              Error Reference
            </h1>

            <div className="prose prose-invert prose-blue max-w-none prose-headings:scroll-mt-24">
              <h2 id="overview" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Overview</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                When the Riftora API encounters an error, it returns a standard error object containing a specific `code` and a human-readable `message`. 
                Use this reference to understand the cause of errors and how to resolve them.
              </p>

              <h2 id="error-codes" className="text-2xl font-bold text-white mt-16 mb-8 border-b border-white/10 pb-2">Error Codes</h2>
              
              <div className="space-y-8">
                {errorCodes.map(err => (
                  <div key={err.code} id={err.code.toLowerCase()} className="bg-slate-900 rounded-xl border border-slate-800 p-6 scroll-mt-24">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h3 className="text-lg font-mono font-bold text-red-400 m-0 bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">{err.code}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                        HTTP {err.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-6 gap-y-4">
                      <div className="text-sm font-medium text-slate-500 uppercase tracking-wider md:pt-1">Meaning</div>
                      <div className="text-slate-300 leading-relaxed">{err.meaning}</div>
                      
                      <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-4 md:mt-0 md:pt-1">Recommended Action</div>
                      <div className="text-slate-300 leading-relaxed">{err.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DocsTableOfContents headings={mockHeadings} />
        </div>
      </main>
    </div>
  );
}
