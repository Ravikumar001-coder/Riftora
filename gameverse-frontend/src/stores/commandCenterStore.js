import { create } from 'zustand';

let toastCounter = 0;

export const useCommandCenterStore = create((set, get) => ({
  // Toast & Notification Tray (FR-21-042, FR-21-043)
  toasts: [],
  allNotifications: [],
  isTrayOpen: false,

  showToast: (message, type = 'info', entity = null, actionLabel = null, onAction = null) => {
    const id = ++toastCounter;
    const notification = {
      id,
      message,
      type,
      entity,
      actionLabel,
      onAction,
      timestamp: new Date(),
      pinned: false,
      dismissed: false,
    };
    set(state => ({
      toasts: [...state.toasts, notification],
      allNotifications: [notification, ...state.allNotifications],
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 8000);
    return id;
  },

  dismissToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id || t.pinned),
      allNotifications: state.allNotifications.map(n => n.id === id ? { ...n, dismissed: true } : n),
    }));
  },

  pinToast: (id) => {
    set(state => ({
      toasts: state.toasts.map(t => t.id === id ? { ...t, pinned: true } : t),
      allNotifications: state.allNotifications.map(n => n.id === id ? { ...n, pinned: true } : n),
    }));
  },

  unpinToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
      allNotifications: state.allNotifications.map(n => n.id === id ? { ...n, pinned: false, dismissed: true } : n),
    }));
  },

  setTrayOpen: (open) => set({ isTrayOpen: open }),
  clearAllNotifications: () => set({ allNotifications: [] }),

  // Command Palette (FR-21-045)
  isPaletteOpen: false,
  setPaletteOpen: (open) => set({ isPaletteOpen: open }),

  // Connection status (FR-21-003)
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),

  // Critical dispute alert (FR-21-033)
  criticalDisputeAlert: null,
  setCriticalDisputeAlert: (alert) => set({ criticalDisputeAlert: alert }),
  dismissCriticalAlert: () => set({ criticalDisputeAlert: null }),

  // Referee Mode (FR-21-005)
  isRefereeMode: false,
  setRefereeMode: (mode) => set({ isRefereeMode: mode }),

  // Live counts for sidebar badges (FR-21-004)
  badgeCounts: {
    disputes: 2,
    scoring: 1,
    checkin: 2,
    credentials: 1,
  },
  setBadgeCounts: (counts) => set(state => ({ badgeCounts: { ...state.badgeCounts, ...counts } })),
}));
