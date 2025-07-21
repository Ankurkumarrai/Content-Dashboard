import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferencesState {
  // Content preferences
  favoriteCategories: string[];
  contentLanguage: string;
  
  // Display preferences
  theme: 'light' | 'dark' | 'system';
  layout: 'grid' | 'list' | 'masonry';
  cardsPerPage: number;
  
  // Feed preferences
  enableAutoRefresh: boolean;
  refreshInterval: number; // in minutes
  showImagePreviews: boolean;
  enableNotifications: boolean;
  
  // Privacy preferences
  enableTracking: boolean;
  shareUsageData: boolean;
  
  // User profile
  profile: {
    name: string;
    email: string;
    avatar: string;
    bio: string;
  };
  
  // Personalization
  readingHistory: string[];
  searchHistory: string[];
  contentInteractions: {
    [contentId: string]: {
      viewed: boolean;
      liked: boolean;
      shared: boolean;
      timeSpent: number;
    };
  };
}

const initialState: UserPreferencesState = {
  favoriteCategories: ['technology', 'entertainment', 'sports'],
  contentLanguage: 'en',
  theme: 'system',
  layout: 'grid',
  cardsPerPage: 20,
  enableAutoRefresh: true,
  refreshInterval: 15,
  showImagePreviews: true,
  enableNotifications: true,
  enableTracking: false,
  shareUsageData: false,
  profile: {
    name: 'User',
    email: '',
    avatar: '',
    bio: '',
  },
  readingHistory: [],
  searchHistory: [],
  contentInteractions: {},
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    updateFavoriteCategories: (state, action: PayloadAction<string[]>) => {
      state.favoriteCategories = action.payload;
    },
    
    addFavoriteCategory: (state, action: PayloadAction<string>) => {
      if (!state.favoriteCategories.includes(action.payload)) {
        state.favoriteCategories.push(action.payload);
      }
    },
    
    removeFavoriteCategory: (state, action: PayloadAction<string>) => {
      state.favoriteCategories = state.favoriteCategories.filter(
        category => category !== action.payload
      );
    },
    
    setContentLanguage: (state, action: PayloadAction<string>) => {
      state.contentLanguage = action.payload;
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    
    setLayout: (state, action: PayloadAction<'grid' | 'list' | 'masonry'>) => {
      state.layout = action.payload;
    },
    
    setCardsPerPage: (state, action: PayloadAction<number>) => {
      state.cardsPerPage = action.payload;
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.enableAutoRefresh = action.payload;
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    
    setShowImagePreviews: (state, action: PayloadAction<boolean>) => {
      state.showImagePreviews = action.payload;
    },
    
    setEnableNotifications: (state, action: PayloadAction<boolean>) => {
      state.enableNotifications = action.payload;
    },
    
    setEnableTracking: (state, action: PayloadAction<boolean>) => {
      state.enableTracking = action.payload;
    },
    
    setShareUsageData: (state, action: PayloadAction<boolean>) => {
      state.shareUsageData = action.payload;
    },
    
    updateProfile: (state, action: PayloadAction<Partial<UserPreferencesState['profile']>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    
    addToReadingHistory: (state, action: PayloadAction<string>) => {
      if (!state.readingHistory.includes(action.payload)) {
        state.readingHistory.unshift(action.payload);
        // Keep only last 100 items
        if (state.readingHistory.length > 100) {
          state.readingHistory = state.readingHistory.slice(0, 100);
        }
      }
    },
    
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      if (!state.searchHistory.includes(action.payload)) {
        state.searchHistory.unshift(action.payload);
        // Keep only last 50 searches
        if (state.searchHistory.length > 50) {
          state.searchHistory = state.searchHistory.slice(0, 50);
        }
      }
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    recordContentInteraction: (state, action: PayloadAction<{
      contentId: string;
      interaction: Partial<UserPreferencesState['contentInteractions'][string]>;
    }>) => {
      const { contentId, interaction } = action.payload;
      if (!state.contentInteractions[contentId]) {
        state.contentInteractions[contentId] = {
          viewed: false,
          liked: false,
          shared: false,
          timeSpent: 0,
        };
      }
      state.contentInteractions[contentId] = {
        ...state.contentInteractions[contentId],
        ...interaction,
      };
    },
    
    resetPreferences: (state) => {
      return { ...initialState, profile: state.profile };
    },
  },
});

export const {
  updateFavoriteCategories,
  addFavoriteCategory,
  removeFavoriteCategory,
  setContentLanguage,
  setTheme,
  setLayout,
  setCardsPerPage,
  setAutoRefresh,
  setRefreshInterval,
  setShowImagePreviews,
  setEnableNotifications,
  setEnableTracking,
  setShareUsageData,
  updateProfile,
  addToReadingHistory,
  addToSearchHistory,
  clearSearchHistory,
  recordContentInteraction,
  resetPreferences,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
