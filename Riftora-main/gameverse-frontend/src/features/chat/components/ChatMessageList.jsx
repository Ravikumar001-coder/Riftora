import React, { useState, useEffect, useRef } from 'react';
import { useChatHistory } from '../api/useChatQueries';
import { useStompStore } from '../../../store/stompStore';
import { useAuthStore } from '../../../store/authStore';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Send, Pin, PinOff, Info, Trash2, AlertTriangle, MicOff, Ban } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { toast } from 'sonner';

const AVAILABLE_REACTIONS = ['👍', '🔥', '💀', '👑'];

const renderMessageContent = (content) => {
  if (!content) return null;
  // Match @username
  const parts = content.split(/(@\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      return <span key={i} className="text-blue-400 font-semibold bg-blue-500/10 px-1 rounded">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

export function ChatMessageList({ tournamentId, channel, canSend }) {
  const { data: initialHistory, isLoading } = useChatHistory(tournamentId, channel);
  const { token, user } = useAuthStore();
  const subscribe = useStompStore(state => state.subscribe);
  const unsubscribe = useStompStore(state => state.unsubscribe);
  const publish = useStompStore(state => state.publish);
  const queryClient = useQueryClient();

  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState(() => sessionStorage.getItem('guestName') || '');
  const [tempGuestName, setTempGuestName] = useState('');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const topic = `/topic/tournament.${tournamentId}.chat.${channel}`;
    
    subscribe(topic, (newMsg) => {
      queryClient.setQueryData(['chat', tournamentId, channel], (old) => {
        if (!old) return [newMsg];
        if (old.some(m => m.messageId === newMsg.messageId)) return old;
        return [...old, newMsg];
      });
    });

    const reactionTopic = `/topic/tournament.${tournamentId}.chat.${channel}.reactions`;
    subscribe(reactionTopic, (messageId) => {
      // Invalide chat query to re-fetch with new reactions and deleted status
      queryClient.invalidateQueries(['chat', tournamentId, channel]);
    });

    let warningTopic = null;
    if (user) {
      warningTopic = `/user/${user.userId}/queue/chat.warnings`;
      subscribe(warningTopic, (warningText) => {
        toast.error("Moderator Warning", {
          description: warningText,
          duration: 10000,
        });
      });
    } else if (guestName) {
      const guestId = "guest-" + guestName.toLowerCase().replace(/[^a-z0-9]/g, "");
      warningTopic = `/user/${guestId}/queue/chat.warnings`;
      subscribe(warningTopic, (warningText) => {
        toast.error("Moderator Warning", {
          description: warningText,
          duration: 10000,
        });
      });
    }

    return () => {
      unsubscribe(topic);
      unsubscribe(reactionTopic);
      if (warningTopic) unsubscribe(warningTopic);
    };
  }, [tournamentId, channel, subscribe, unsubscribe, queryClient, user, guestName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [initialHistory]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !canSend) return;

    if (!user && channel === 'viewer' && !guestName) {
      setShowGuestPrompt(true);
      return;
    }

    publish(`/app/chat/${tournamentId}/${channel}/send`, {
      content: message,
      token: token,
      guestName: guestName
    });

    setMessage('');
  };

  const handleSetGuestName = (e) => {
    e.preventDefault();
    if (tempGuestName.trim()) {
      setGuestName(tempGuestName.trim());
      sessionStorage.setItem('guestName', tempGuestName.trim());
      setShowGuestPrompt(false);
    }
  };

  const handleReact = (messageId, emoji) => {
    if (!user && channel === 'viewer' && !guestName) {
      setShowGuestPrompt(true);
      return;
    }
    
    publish(`/app/chat/${tournamentId}/${channel}/react/${messageId}`, {
      emoji: emoji,
      token: token,
      guestName: guestName
    });
  };

  const handlePin = (messageId) => {
    if (!user || (user.onboardingPath !== 'organizer' && user.platformRole !== 'super_admin')) return;
    publish(`/app/chat/${tournamentId}/${channel}/pin/${messageId}`, {
      token: token
    });
  };

  const moderationMutation = useMutation({
    mutationFn: async (payload) => {
      await api.post(`/api/v1/tournaments/${tournamentId}/chat/${channel}/moderate`, payload);
    },
    onSuccess: (_, variables) => {
      toast.success(`Action ${variables.actionType} completed.`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to perform moderation action");
    }
  });

  const handleModerate = (actionType, msg) => {
    const isGuest = msg.senderId.startsWith('guest-');
    let reason = "Violation of chat rules";
    
    if (actionType !== 'DELETE') {
      const input = prompt(`Enter reason for ${actionType}:`);
      if (input === null) return;
      if (input.trim()) reason = input.trim();
    }

    moderationMutation.mutate({
      actionType,
      messageId: msg.messageId,
      targetUserId: isGuest ? null : msg.senderId,
      targetGuestName: isGuest ? msg.senderName : null,
      reason,
      durationMinutes: actionType === 'MUTE' ? 30 : null,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const messages = initialHistory || [];
  const pinnedMessages = messages.filter(m => m.isPinned);
  const regularMessages = messages.filter(m => !m.isPinned);

  return (
    <div className="flex flex-col h-full bg-[#071426]/50">
      
      {/* Pinned Messages Area */}
      {pinnedMessages.length > 0 && (
        <div className="bg-blue-900/20 border-b border-blue-500/20 p-3 max-h-24 overflow-y-auto">
          {pinnedMessages.map(msg => (
            <div key={msg.messageId} className="flex gap-2 items-start text-xs mb-2 last:mb-0 group">
              <Pin className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-blue-400">{msg.senderName}: </span>
                <span className="text-blue-100">{renderMessageContent(msg.content)}</span>
              </div>
              {user && (user.onboardingPath === 'organizer' || user.platformRole === 'super_admin') && (
                <button 
                  onClick={() => handlePin(msg.messageId)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                  title="Unpin message"
                >
                  <PinOff className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {regularMessages.map((msg) => {
          
          if (msg.isSystem) {
            return (
              <div key={msg.messageId} className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg text-yellow-200/90 text-sm">
                <Info className="w-4 h-4 text-yellow-500 shrink-0" />
                <span className="font-semibold">{msg.content}</span>
              </div>
            );
          }

          return (
          <div key={msg.messageId} className="flex flex-col group">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-white text-sm">{msg.senderName}</span>
              {msg.senderRole && msg.senderRole !== 'User' && msg.senderRole !== 'Viewer' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wider">
                  {msg.senderRole}
                </span>
              )}
              <span className="text-[10px] text-slate-500">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              
              {user && (user.onboardingPath === 'organizer' || user.platformRole === 'super_admin') && (
                <div className="opacity-0 group-hover:opacity-100 ml-auto flex items-center bg-[#0b1b36] border border-white/10 rounded overflow-hidden">
                  <button 
                    onClick={() => handlePin(msg.messageId)}
                    className="p-1 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                    title="Pin message"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModerate('DELETE', msg)}
                    className="p-1 hover:bg-red-500/20 transition-colors text-slate-400 hover:text-red-400 border-l border-white/5"
                    title="Delete message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModerate('WARN', msg)}
                    className="p-1 hover:bg-yellow-500/20 transition-colors text-slate-400 hover:text-yellow-400 border-l border-white/5"
                    title="Warn user"
                  >
                    <AlertTriangle className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModerate('MUTE', msg)}
                    className="p-1 hover:bg-orange-500/20 transition-colors text-slate-400 hover:text-orange-400 border-l border-white/5"
                    title="Mute user (30m)"
                  >
                    <MicOff className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleModerate('BAN', msg)}
                    className="p-1 hover:bg-red-600/30 transition-colors text-slate-400 hover:text-red-500 border-l border-white/5"
                    title="Ban user permanently"
                  >
                    <Ban className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-slate-300 text-sm mt-0.5 whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex bg-[#0b1b36] rounded-md border border-white/10 p-0.5 ml-2">
                {AVAILABLE_REACTIONS.map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => handleReact(msg.messageId, emoji)}
                    className="hover:bg-white/10 p-1 rounded text-sm transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(msg.reactions).map(([emoji, count]) => (
                  <button 
                    key={emoji} 
                    onClick={() => handleReact(msg.messageId, emoji)}
                    className="flex items-center gap-1 bg-[#0b1b36] border border-white/10 rounded-full px-2 py-0.5 text-xs hover:bg-white/10 transition-colors"
                  >
                    <span>{emoji}</span>
                    <span className="text-slate-400">{count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )})}
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-4 italic">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {canSend ? (
        showGuestPrompt ? (
          <form onSubmit={handleSetGuestName} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
            <Input 
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
              placeholder="Enter a display name to chat..."
              value={tempGuestName}
              onChange={e => setTempGuestName(e.target.value)}
              maxLength={50}
              autoFocus
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shrink-0" disabled={!tempGuestName.trim()}>
              Join Chat
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowGuestPrompt(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSend} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
            <Input 
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
              placeholder={`Message ${channel}...`}
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={300}
            />
            <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 shrink-0" disabled={!message.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )
      ) : (
        <div className="p-4 bg-black/40 border-t border-white/5 text-center text-slate-500 text-xs">
          You do not have permission to send messages in this channel.
        </div>
      )}
    </div>
  );
}
