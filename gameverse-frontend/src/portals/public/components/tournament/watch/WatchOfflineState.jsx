import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Tv, Calendar } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

export function WatchOfflineState({ tournament }) {
  const navigate = useNavigate();
  
  // Mock countdown target (e.g., 2 hours from now)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [targetDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 max-w-4xl mx-auto my-8 min-h-[400px] flex items-center justify-center">
      {/* Background Banner with Overlay */}
      {tournament.bannerUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${tournament.bannerUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b36] via-[#0b1b36]/80 to-[#0b1b36]/60 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 p-12 flex flex-col items-center justify-center text-center w-full">
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-lg">
          Stream Starts Soon
        </h2>
        
        <p className="text-lg text-slate-300 mb-8 max-w-lg font-medium drop-shadow-md">
          The official {tournament.name} broadcast is currently offline. We will be live in:
        </p>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-20 h-24 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-black/50">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Hours</span>
          </div>
          <span className="text-3xl font-bold text-white/50 mb-6">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-20 h-24 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-black/50">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Mins</span>
          </div>
          <span className="text-3xl font-bold text-white/50 mb-6">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-20 h-24 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-black/50">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Secs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => navigate(`/t/${tournament.slug}/schedule`)}
          >
            <Calendar className="w-4 h-4 mr-2" /> View Schedule
          </Button>
          <div className="flex gap-2 w-full">
            <Button 
              className="w-1/2 bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold"
              onClick={() => window.open('https://youtube.com', '_blank')}
            >
              <Play className="w-4 h-4 mr-2" /> YouTube
            </Button>
            <Button 
              className="w-1/2 bg-[#9146FF] hover:bg-[#772CE8] text-white font-semibold"
              onClick={() => window.open('https://twitch.tv', '_blank')}
            >
              <Tv className="w-4 h-4 mr-2" /> Twitch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
