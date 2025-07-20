import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      push: boolean;
      email: boolean;
    };
    contentTypes: string[];
    refreshRate: number;
    displayDensity: 'compact' | 'comfortable' | 'spacious';
    autoRefresh: boolean;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const defaultPreferences = {
  language: 'en',
  theme: 'dark' as const,
  notifications: {
    push: true,
    email: false,
  },
  contentTypes: ['news', 'entertainment', 'social', 'technology'],
  refreshRate: 30000,
  displayDensity: 'comfortable' as const,
  autoRefresh: true,
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<Omit<User, 'preferences'>>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserPreferences,
  updateUserProfile,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

// Mock users database
const mockUsers: Record<string, { password: string; user: User }> = {
  'user@example.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      preferences: defaultPreferences,
    },
  },
  'demo@dashboard.com': {
    password: 'demo123',
    user: {
      id: '2',
      email: 'demo@dashboard.com',
      name: 'Demo User',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      preferences: defaultPreferences,
    },
  },
};

// Mock authentication functions
export const authenticateUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userRecord = mockUsers[email];
      if (userRecord && userRecord.password === password) {
        resolve(userRecord.user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // Simulate network delay
  });
};

export const registerUser = (email: string, password: string, name: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers[email]) {
        reject(new Error('Email already exists'));
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=150`,
        preferences: defaultPreferences,
      };

      mockUsers[email] = {
        password,
        user: newUser,
      };

      resolve(newUser);
    }, 1000);
  });
};