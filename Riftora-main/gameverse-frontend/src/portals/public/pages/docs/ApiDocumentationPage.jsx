import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { DocsSidebar } from '../../components/docs/DocsSidebar';
import { DocsTableOfContents } from '../../components/docs/DocsTableOfContents';
import { CodeBlock } from '../../components/docs/CodeBlock';
import { apiEndpoints } from '../../../../services/docsData';

const mockHeadings = [
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "authentication", text: "Authentication", level: 2 },
  { id: "rate-limits", text: "Rate Limits", level: 2 },
  { id: "endpoints", text: "Endpoints", level: 2 },
  ...apiEndpoints.map(endpoint => ({ id: endpoint.id, text: `${endpoint.method} ${endpoint.path}`, level: 3 }))
];

export function ApiDocumentationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "API Documentation | Riftora Documentation";
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
            <div className="mb-4 text-sm font-medium text-purple-400 uppercase tracking-wider">
              Developers
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
              API Documentation
            </h1>

            <div className="prose prose-invert prose-blue max-w-none prose-headings:scroll-mt-24">
              <h2 id="introduction" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Introduction</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                The Riftora API provides RESTful endpoints to manage tournaments, teams, players, and matches. 
                All API responses return a standard JSON envelope containing either `data` or an `error` object.
              </p>

              <h2 id="authentication" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Authentication</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Most endpoints require authentication. Include your access token in the `Authorization` header as a Bearer token.
              </p>
              <CodeBlock language="http" code="Authorization: Bearer <your_access_token>" />

              <h2 id="rate-limits" className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">Rate Limits</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                API requests are limited to 100 requests per minute per IP address. Exceeding this limit will result in a `429 Too Many Requests` response.
                Check the `Retry-After` header for the number of seconds to wait before retrying.
              </p>

              <h2 id="endpoints" className="text-2xl font-bold text-white mt-16 mb-8 border-b border-white/10 pb-2">Endpoints</h2>
              
              <div className="space-y-16">
                {apiEndpoints.map(endpoint => (
                  <div key={endpoint.id} id={endpoint.id} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                        endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-white">{endpoint.path}</code>
                      {endpoint.access === 'Public' && (
                        <span className="ml-auto px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">Public</span>
                      )}
                    </div>
                    
                    <p className="text-slate-300 mb-6">{endpoint.description}</p>
                    
                    {endpoint.params && endpoint.params.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Parameters</h4>
                        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 border-b border-slate-800">
                              <tr>
                                <th className="px-4 py-3 font-medium text-slate-300">Name</th>
                                <th className="px-4 py-3 font-medium text-slate-300">Type</th>
                                <th className="px-4 py-3 font-medium text-slate-300">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {endpoint.params.map(param => (
                                <tr key={param.name}>
                                  <td className="px-4 py-3 font-mono text-blue-400">{param.name}</td>
                                  <td className="px-4 py-3 font-mono text-slate-400">{param.type}</td>
                                  <td className="px-4 py-3 text-slate-300">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Response Example</h4>
                      <CodeBlock language="json" code={endpoint.responseExample} />
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
