import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { api } from '../services/api';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const useStompStore = create((set, get) => ({
  client: null,
  isConnected: false,
  isReconnecting: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 10,
  subscriptions: {},
  messages: [], // Generic message store

  connect: (token = null) => {
    if (get().client && get().client.connected) {
        return; // Already connected
    }

    const client = new Client({
      // We use SockJS for fallback and broad compatibility
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug('[STOMP]', str);
        }
      },
      reconnectDelay: 0, // We handle exponential backoff manually as per requirements
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      set({ 
        isConnected: true, 
        isReconnecting: false,
        reconnectAttempts: 0
      });
      console.log('STOMP connected');
      
      // Resubscribe to existing subscriptions
      const { subscriptions } = get();
      Object.keys(subscriptions).forEach(topic => {
        get().subscribe(topic, subscriptions[topic].callback);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.onWebSocketClose = () => {
      set({ isConnected: false });
      console.log('STOMP connection closed');
      get().handleReconnect(token);
    };

    client.activate();
    set({ client });
  },

  handleReconnect: (token) => {
      const { reconnectAttempts, maxReconnectAttempts, connect, isReconnecting } = get();
      
      if (isReconnecting || reconnectAttempts >= maxReconnectAttempts) {
          if (reconnectAttempts >= maxReconnectAttempts) {
              console.error('Max reconnection attempts reached');
          }
          return;
      }

      set({ isReconnecting: true });
      
      // Exponential backoff: 1s, 2s, 4s, 8s... max 30s
      let delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      
      console.log(`Reconnecting STOMP in ${delay}ms (Attempt ${reconnectAttempts + 1})`);
      
      setTimeout(() => {
          set(state => ({ 
              reconnectAttempts: state.reconnectAttempts + 1,
              isReconnecting: false
          }));
          connect(token);
      }, delay);
  },

  disconnect: () => {
    const { client } = get();
    if (client) {
      client.deactivate();
      set({ client: null, isConnected: false, subscriptions: {} });
    }
  },

  subscribe: (topic, callback) => {
    const { client, subscriptions } = get();
    
    // Save to subscriptions map to re-subscribe on reconnect
    set(state => ({
      subscriptions: {
        ...state.subscriptions,
        [topic]: { callback }
      }
    }));

    if (client && client.connected) {
      const stompSubscription = client.subscribe(topic, (message) => {
        if (message.body) {
          const parsed = JSON.parse(message.body);
          callback(parsed);
          
          // Optionally store in global messages array if needed
          set(state => ({
              messages: [...state.messages.slice(-49), { topic, data: parsed, timestamp: Date.now() }]
          }));
        }
      });
      
      // Update subscription with the STOMP subscription object so it can be unsubscribed
      set(state => ({
        subscriptions: {
          ...state.subscriptions,
          [topic]: { ...state.subscriptions[topic], stompSubscription }
        }
      }));
    }
  },

  unsubscribe: (topic) => {
    const { subscriptions } = get();
    const sub = subscriptions[topic];
    if (sub && sub.stompSubscription) {
      sub.stompSubscription.unsubscribe();
    }
    
    set(state => {
      const newSubs = { ...state.subscriptions };
      delete newSubs[topic];
      return { subscriptions: newSubs };
    });
  },

  sendMessage: (destination, body) => {
    const { client } = get();
    if (client && client.connected) {
      client.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.warn('Cannot send message: STOMP client is not connected');
    }
  }
}));
