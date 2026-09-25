import { create } from 'zustand';
import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

export const useObsStore = create((set, get) => ({
  obs,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  scenes: [],
  currentScene: null,
  
  address: localStorage.getItem('obs_address') || 'ws://localhost:4455',
  password: localStorage.getItem('obs_password') || '',

  setCredentials: (address, password) => {
    localStorage.setItem('obs_address', address);
    localStorage.setItem('obs_password', password);
    set({ address, password });
  },

  connect: async () => {
    const { address, password } = get();
    set({ isConnecting: true, connectionError: null });
    
    try {
      await obs.connect(address, password, { rpcVersion: 1 });
      set({ isConnected: true, isConnecting: false });
      
      // Fetch scenes immediately after connecting
      get().fetchScenes();
      
    } catch (error) {
      console.error('OBS Connection Error:', error);
      set({ 
        isConnected: false, 
        isConnecting: false, 
        connectionError: error.message || 'Failed to connect' 
      });
      throw error;
    }
  },

  disconnect: async () => {
    try {
      await obs.disconnect();
    } catch (e) {
      console.error(e);
    }
    set({ isConnected: false, scenes: [], currentScene: null });
  },

  fetchScenes: async () => {
    if (!get().isConnected) return;
    
    try {
      const response = await obs.call('GetSceneList');
      // OBS usually returns scenes from bottom to top, reverse if needed. Let's just map them.
      set({ 
        scenes: response.scenes.map(s => s.sceneName).reverse(),
        currentScene: response.currentProgramSceneName 
      });
    } catch (error) {
      console.error('Failed to fetch scenes:', error);
    }
  },

  setCurrentScene: async (sceneName) => {
    if (!get().isConnected) return;
    
    try {
      await obs.call('SetCurrentProgramScene', { sceneName });
      set({ currentScene: sceneName });
    } catch (error) {
      console.error('Failed to set scene:', error);
    }
  },

  setSourceVisibility: async (sceneName, sourceName, visible) => {
    if (!get().isConnected) return;
    try {
      // Get the scene item id first
      const { sceneItems } = await obs.call('GetSceneItemList', { sceneName });
      const item = sceneItems.find(i => i.sourceName === sourceName);
      if (item) {
        await obs.call('SetSceneItemEnabled', {
          sceneName,
          sceneItemId: item.sceneItemId,
          sceneItemEnabled: visible
        });
      }
    } catch (error) {
      console.error(`Failed to set visibility for ${sourceName}:`, error);
    }
  },

  setTextSource: async (sourceName, text) => {
    if (!get().isConnected) return;
    try {
      await obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: {
          text: text
        }
      });
    } catch (error) {
      console.error(`Failed to set text for ${sourceName}:`, error);
    }
  },

  // Set up listeners once
  initListeners: () => {
    obs.on('ConnectionClosed', () => {
      set({ isConnected: false });
      
      // Auto-reconnect if we have credentials
      const { address, password } = get();
      if (address) {
        setTimeout(() => {
          if (!get().isConnected && !get().isConnecting) {
            get().connect().catch(() => {});
          }
        }, 5000);
      }
    });
    
    obs.on('CurrentProgramSceneChanged', (data) => {
      set({ currentScene: data.sceneName });
    });
    
    obs.on('SceneListChanged', (data) => {
      set({ scenes: data.scenes.map(s => s.sceneName).reverse() });
    });
  }
}));

// Initialize listeners outside of components
useObsStore.getState().initListeners();
