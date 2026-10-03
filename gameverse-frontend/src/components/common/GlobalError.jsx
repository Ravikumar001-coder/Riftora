import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, Home, ArrowLeft } from 'lucide-react';

export function GlobalError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Our team has been notified.";
  let debugInfo = "";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you are looking for doesn't exist or has been moved.";
    } else if (error.status === 401) {
      title = "Unauthorized";
      message = "You don't have permission to access this page. Please log in.";
    } else if (error.status === 403) {
      title = "Forbidden";
      message = "You don't have the required roles to view this content.";
    } else if (error.status === 503) {
      title = "Service Unavailable";
      message = "Looks like our API is down. Please try again later.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || error.data?.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
    debugInfo = error.stack;
  }

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        
        {/* Abstract background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          
          <p className="text-slate-400 mb-8 max-w-md">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors border border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] w-full sm:w-auto"
            >
              <RefreshCcw className="w-4 h-4" /> Try Again
            </button>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 w-full sm:w-auto"
            >
              <Home className="w-4 h-4" /> Home
            </button>
          </div>

          {/* Developer Debug Info */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="mt-8 w-full text-left">
              <details className="group border border-slate-800 rounded-lg bg-slate-950/50">
                <summary className="px-4 py-3 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                  Developer Error Details
                </summary>
                <div className="px-4 pb-4 pt-2">
                  <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap overflow-x-auto p-4 bg-black/50 rounded-lg border border-red-500/20">
                    {debugInfo}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
