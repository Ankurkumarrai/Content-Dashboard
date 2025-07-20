import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
    isRead: boolean;
  }[];
  isSettingsOpen: boolean;
  isNotificationsOpen: boolean;
  activeView: 'feed' | 'trending' | 'favorites' | 'settings';
}

const initialState: UIState = {
  isSidebarCollapsed: false,
  theme: 'dark',
  language: 'en',
  notifications: [],
  isSettingsOpen: false,
  isNotificationsOpen: false,
  activeView: 'feed',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'isRead'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        isRead: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
    toggleNotifications: (state) => {
      state.isNotificationsOpen = !state.isNotificationsOpen;
    },
    setActiveView: (state, action: PayloadAction<UIState['activeView']>) => {
      state.activeView = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setLanguage,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  toggleSettings,
  setSettingsOpen,
  toggleNotifications,
  setActiveView,
} = uiSlice.actions;

export default uiSlice.reducer;