import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStreamConfigs, useCreateStreamConfig } from '../hooks/useStreamConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';

const streamSchema = z.object({
  platform: z.enum(['youtube', 'twitch', 'facebook_gaming', 'custom']),
  channelId: z.string().optional(),
  streamUrl: z.string().url().optional().or(z.literal('')),
  streamKey: z.string().optional(),
  rtmpUrl: z.string().url().optional().or(z.literal('')),
  language: z.string().min(2, 'Language code required'),
  isPrimary: z.boolean().default(false),
});

export const StreamSettingsPanel = ({ tournamentId }) => {
  const { data: streams, isLoading } = useStreamConfigs(tournamentId);
  const createStream = useCreateStreamConfig(tournamentId);
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(streamSchema),
    defaultValues: {
      platform: 'youtube',
      language: 'en',
      isPrimary: false
    }
  });

  const platform = watch('platform');
  const isPrimary = watch('isPrimary');

  const onSubmit = async (data) => {
    try {
      await createStream.mutateAsync(data);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to create stream config', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-slate-400">Loading stream configurations...</div>;
  }

  const primaryStream = streams?.find(s => s.isPrimary);
  const secondaryStreams = streams?.filter(s => !s.isPrimary) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Broadcast Streams</h2>
          <p className="text-sm text-slate-400">Configure your primary and secondary stream outputs.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
          {isAdding ? 'Cancel' : 'Add Stream'}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-slate-900 border-slate-800 shadow-xl border">
          <CardHeader>
            <CardTitle className="text-lg text-white">New Stream Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Platform</Label>
                  <Select onValueChange={(val) => setValue('platform', val)} defaultValue={platform}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      <SelectItem value="youtube">YouTube Live</SelectItem>
                      <SelectItem value="twitch">Twitch</SelectItem>
                      <SelectItem value="facebook_gaming">Facebook Gaming</SelectItem>
                      <SelectItem value="custom">Custom RTMP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Language (e.g. en, hi)</Label>
                  <Input 
                    {...register('language')}
                    className="bg-slate-950 border-slate-800 text-slate-200" 
                    placeholder="en" 
                  />
                  {errors.language && <p className="text-red-400 text-xs">{errors.language.message}</p>}
                </div>
              </div>

              {platform === 'custom' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">RTMP URL</Label>
                    <Input 
                      {...register('rtmpUrl')} 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      placeholder="rtmp://a.rtmp.youtube.com/live2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Stream Key</Label>
                    <Input 
                      type="password"
                      {...register('streamKey')} 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      placeholder="••••••••••••" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Web Player / Embed URL (Optional)</Label>
                    <Input 
                      {...register('streamUrl')} 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      placeholder="https://mycdn.com/embed/stream" 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Channel ID or URL</Label>
                    <Input 
                      {...register('channelId')} 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      placeholder="UC..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Stream URL (Watch URL)</Label>
                    <Input 
                      {...register('streamUrl')} 
                      className="bg-slate-950 border-slate-800 text-slate-200" 
                      placeholder="https://..." 
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isPrimary" 
                  checked={isPrimary}
                  onCheckedChange={(checked) => setValue('isPrimary', checked)}
                  className="border-slate-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="isPrimary" className="text-slate-300 font-normal">Set as Primary Stream</Label>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {primaryStream && (
          <Card className="bg-slate-900 border-blue-900 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Primary</Badge>
            </div>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-400 font-bold uppercase">{primaryStream.platform.substring(0, 1)}</span>
                </div>
                <div>
                  <h3 className="text-white font-medium capitalize">{primaryStream.platform}</h3>
                  <p className="text-sm text-slate-400">Language: {primaryStream.language}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {primaryStream.channelId && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Channel</span>
                    <span className="text-slate-300 font-mono">{primaryStream.channelId}</span>
                  </div>
                )}
                {primaryStream.rtmpUrl && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">RTMP</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{primaryStream.rtmpUrl}</span>
                  </div>
                )}
                {primaryStream.hasStreamKey && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Stream Key</span>
                    <span className="text-slate-300 font-mono tracking-widest">{primaryStream.maskedStreamKey}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Status</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${primaryStream.isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></span>
                    <span className={primaryStream.isLive ? 'text-red-400' : 'text-slate-400'}>
                      {primaryStream.isLive ? 'LIVE' : 'Offline'}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {secondaryStreams.map((stream) => (
          <Card key={stream.configId} className="bg-slate-900 border-slate-800 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-400 font-bold uppercase text-xs">{stream.platform.substring(0, 1)}</span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm capitalize">{stream.platform}</h3>
                  <p className="text-xs text-slate-400">Language: {stream.language}</p>
                </div>
              </div>
              {stream.hasStreamKey && (
                <div className="flex justify-between pt-1 border-t border-slate-800 text-xs mt-4 pt-4">
                  <span className="text-slate-500">Stream Key</span>
                  <span className="text-slate-300 font-mono tracking-widest">{stream.maskedStreamKey}</span>
                </div>
              )}
              <div className={`flex justify-between pt-1 ${!stream.hasStreamKey ? 'border-t mt-4 pt-4' : 'mt-2'} border-slate-800 text-sm`}>
                <span className="text-slate-500">Status</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stream.isLive ? 'bg-red-500' : 'bg-slate-600'}`}></span>
                  <span className={stream.isLive ? 'text-red-400' : 'text-slate-400'}>
                    {stream.isLive ? 'LIVE' : 'Offline'}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!isLoading && !primaryStream && secondaryStreams.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </div>
          <h3 className="text-slate-300 font-medium mb-1">No Broadcasts Configured</h3>
          <p className="text-slate-500 text-sm mb-4">Set up a primary stream to broadcast your tournament.</p>
          <Button onClick={() => setIsAdding(true)} variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
            Configure Stream
          </Button>
        </div>
      )}
    </div>
  );
};
