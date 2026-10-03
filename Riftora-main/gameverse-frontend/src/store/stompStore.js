import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuthStore } from './authStore';

let WS_URL = import.meta.env.VITE_API_URL?.replace('/v1', '/ws') || 'http://localhost:8081/ws';

// ADB Reverse handles port forwarding, so we keep localhost as is

export const useStompStore = create((set, get) => ({
  client: null,
  isConnected: false,
  subscriptions: new Map(),

  connect: () => {
    if (get().client) return;

    // Use zustand authStore instead of localStorage directly since it's persisted by zustand
    const { accessToken: token } = useAuthStore.getState();
    
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? {
        Authorization: `Bearer ${token}`
      } : {},
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      set({ isConnected: true });
      console.log('STOMP Connected');
      
      // Resubscribe to existing subscriptions
      const { subscriptions } = get();
      const newSubscriptions = new Map();
      
      subscriptions.forEach((callback, topic) => {
        const sub = client.subscribe(topic, (message) => {
          callback(JSON.parse(message.body));
        });
        newSubscriptions.set(topic, { callback, sub });
      });
      
      set({ subscriptions: newSubscriptions });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };
    
    client.onWebSocketClose = () => {
      set({ isConnected: false });
    };

    client.activate();
    set({ client });
  },

  disconnect: () => {
    const { client } = get();
    if (client) {
      client.deactivate();
      set({ client: null, isConnected: false, subscriptions: new Map() });
    }
  },

  subscribe: (topic, callback) => {
    const { client, isConnected, subscriptions } = get();
    
    if (subscriptions.has(topic)) {
      return; // Already subscribed
    }

    if (isConnected && client) {
      const sub = client.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
      
      const newMap = new Map(subscriptions);
      newMap.set(topic, { callback, sub });
      set({ subscriptions: newMap });
    } else {
      // Store callback to subscribe once connected
      const newMap = new Map(subscriptions);
      newMap.set(topic, callback);
      set({ subscriptions: newMap });
      
      // Attempt connection if not already connecting
      get().connect();
    }
  },

  unsubscribe: (topic) => {
    const { subscriptions } = get();
    const subscriptionData = subscriptions.get(topic);
    
    if (subscriptionData) {
      if (subscriptionData.sub) {
        subscriptionData.sub.unsubscribe();
      }
      
      const newMap = new Map(subscriptions);
      newMap.delete(topic);
      set({ subscriptions: newMap });
    }
  }
}));
