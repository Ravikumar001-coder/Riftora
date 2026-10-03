import React from 'react';

export const BrandPreviewPanel = ({ values }) => {
  const {
    logoUrl,
    secondaryLogoUrl,
    primaryColor = '#071426',
    secondaryColor = '#1e293b',
    accentColor = '#2563EB',
    primaryFont = 'Inter',
    secondaryFont = 'Roboto',
    brandTagline = 'Your Brand Tagline'
  } = values;

  // Fallback text if no logo
  const logoContent = logoUrl ? (
    <img src={logoUrl} alt="Primary Logo" className="h-8 object-contain" />
  ) : (
    <div className="font-bold text-lg text-white">ORG NAME</div>
  );

  return (
    <div className="space-y-6 mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Live Brand Preview</h3>
        <p className="text-sm text-slate-400">See how your brand looks across different surfaces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tournament Page Header Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Tournament Page Header</h4>
          <div 
            className="rounded-lg overflow-hidden border border-slate-700 shadow-lg relative h-40 flex flex-col"
            style={{ backgroundColor: primaryColor, fontFamily: primaryFont }}
          >
            {/* Header Nav */}
            <div className="flex items-center justify-between p-4" style={{ backgroundColor: secondaryColor }}>
              {logoContent}
              <div 
                className="px-4 py-1.5 rounded text-sm font-medium text-white"
                style={{ backgroundColor: accentColor }}
              >
                Register Now
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 p-4 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: primaryFont }}>
                Championship Series 2026
              </h1>
              <p className="text-sm text-white/80 italic" style={{ fontFamily: secondaryFont }}>
                {brandTagline || 'Your Brand Tagline'}
              </p>
            </div>
          </div>
        </div>

        {/* OBS Overlay Strip Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">OBS Overlay Strip</h4>
          <div className="rounded-lg overflow-hidden border border-slate-700 shadow-lg h-40 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center relative flex items-end">
            {/* The Strip */}
            <div 
              className="w-full h-12 flex items-center px-4 shadow-xl backdrop-blur-sm"
              style={{ backgroundColor: `${primaryColor}e6` }} // 90% opacity
            >
              <div className="flex items-center space-x-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-6 object-contain drop-shadow-md" />
                ) : (
                  <div className="w-6 h-6 rounded bg-white/20"></div>
                )}
                <div className="h-6 w-px bg-white/20"></div>
                <span className="text-white font-bold tracking-wider uppercase text-sm" style={{ fontFamily: primaryFont }}>
                  Live Broadcast
                </span>
              </div>
              <div className="ml-auto flex items-center space-x-3">
                <span className="text-white/80 text-xs" style={{ fontFamily: secondaryFont }}>MATCH 4 • ERANGEL</span>
                <div 
                  className="px-2 py-0.5 rounded text-xs font-bold text-white uppercase"
                  style={{ backgroundColor: accentColor }}
                >
                  Live
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Email Header Preview */}
        <div className="space-y-2 lg:col-span-2">
          <h4 className="text-sm font-medium text-slate-300">Email Notification</h4>
          <div className="rounded-lg overflow-hidden border border-slate-700 shadow-lg bg-slate-100 flex flex-col items-center p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="p-6 flex flex-col items-center text-center space-y-3"
                style={{ backgroundColor: primaryColor }}
              >
                {logoUrl ? (
                   <img src={logoUrl} alt="Logo" className="h-10 object-contain mb-2" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 mb-2"></div>
                )}
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: primaryFont }}>
                  Match Schedule Updated
                </h2>
                <p className="text-sm text-white/80" style={{ fontFamily: secondaryFont }}>
                  {brandTagline || 'Your Brand Tagline'}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                <div 
                  className="mt-6 w-full py-2 text-center text-white font-medium rounded-md shadow-sm"
                  style={{ backgroundColor: accentColor, fontFamily: primaryFont }}
                >
                  View Schedule
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
