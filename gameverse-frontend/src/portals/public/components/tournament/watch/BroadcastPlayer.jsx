import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

export function BroadcastPlayer({ stream }) {
  if (!stream || !stream.url) {
    return (
      <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
        <AlertCircle className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Stream Unavailable</h3>
        <p className="text-slate-400">The stream URL is missing or invalid.</p>
      </div>
    );
  }

  const isYouTube = stream.url.includes('youtube.com') || stream.url.includes('youtu.be');
  const isTwitch = stream.url.includes('twitch.tv');
  const isFacebook = stream.url.includes('facebook.com') || stream.url.includes('fb.gg');
  
  // For custom streams, we assume the provided URL is a valid embed URL if they chose 'custom' platform
  const isCustom = stream.platform === 'custom';
  
  const isAllowedProvider = isYouTube || isTwitch || isFacebook || isCustom;

  if (!isAllowedProvider) {
    return (
      <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-white/5">
        <AlertCircle className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Stream Unavailable</h3>
        <p className="text-slate-400 mb-6">The official stream could not be loaded securely.</p>
        <Button 
          variant="outline" 
          className="border-slate-700 bg-slate-800/50 text-slate-300"
          onClick={() => window.open(stream.url, '_blank')}
        >
          Watch on External Site <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  const getEmbedUrl = (url, platform) => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else {
          videoId = urlObj.searchParams.get('v');
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      
      // Twitch
      if (url.includes('twitch.tv/') && !url.includes('player.twitch.tv')) {
        const channel = url.split('twitch.tv/')[1].split('/')[0].split('?')[0];
        return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
      }
      
      // Facebook Gaming
      if ((url.includes('facebook.com') || url.includes('fb.gg')) && !url.includes('plugins/video.php')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`;
      }
      
      return url; // Default: assume it's already an embed URL or custom RTMP web player
    } catch (e) {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(stream.url, stream.platform);

  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden relative border border-white/5 shadow-2xl">
      <iframe 
        src={embedUrl} 
        title="Official Tournament Live Stream"
        className="w-full h-full border-0 absolute top-0 left-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
