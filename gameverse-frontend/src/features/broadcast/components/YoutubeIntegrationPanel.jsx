import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useYoutubeIntegration, useConnectYoutube, useDisconnectYoutube } from '../hooks/useYoutubeIntegration';

export const YoutubeIntegrationPanel = ({ orgId }) => {
  const { data: integration, isLoading } = useYoutubeIntegration(orgId);
  const connectYoutube = useConnectYoutube(orgId);
  const disconnectYoutube = useDisconnectYoutube(orgId);
  
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // In a real application, you would redirect the user to Google's OAuth consent screen
      // and capture the authorization code on the callback URL.
      // For this simulation, we'll directly call the connect API with mock data.
      await connectYoutube.mutateAsync({ 
        authorizationCode: 'mock_auth_code_123', 
        redirectUri: 'http://localhost:5173/oauth/callback' 
      });
    } catch (error) {
      console.error('Failed to connect YouTube account', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectYoutube.mutateAsync();
    } catch (error) {
      console.error('Failed to disconnect YouTube account', error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-slate-400">Loading YouTube integration status...</div>;
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" stroke="none" className="w-6 h-6">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FFFFFF"></polygon>
            </svg>
            YouTube Account Connection
          </div>
          {integration ? (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Connected</Badge>
          ) : (
            <Badge className="bg-slate-800 text-slate-400 border-slate-700">Not Connected</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {integration ? (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-300 font-medium">{integration.youtubeChannelName}</p>
                <p className="text-slate-500 text-sm">Channel ID: {integration.youtubeChannelId}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={disconnectYoutube.isPending}
                className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
              >
                {disconnectYoutube.isPending ? 'Disconnecting...' : 'Disconnect Account'}
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              Your account is connected. You can now use automated stream creation, manage stream metadata, and sync viewer counts directly from the GameVerse dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Connect your YouTube account to automatically create streams, update titles/descriptions matching your tournament, and pull live viewer statistics.
            </p>
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-[#FF0000] hover:bg-[#CC0000] text-white flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FFFFFF"></polygon>
              </svg>
              {isConnecting ? 'Connecting...' : 'Connect with YouTube'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
