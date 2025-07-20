import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: 'news' | 'entertainment' | 'social' | 'technology' | 'sports' | 'science' | 'health' | 'business';
  author: string;
  publishedAt: string;
  imageUrl?: string;
  url: string;
  isFavorite: boolean;
  isBookmarked: boolean;
  readTime?: number;
  tags: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ContentState {
  items: ContentItem[];
  filteredItems: ContentItem[];
  favorites: ContentItem[];
  bookmarks: ContentItem[];
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  sortBy: 'latest' | 'popular' | 'trending';
  viewMode: 'grid' | 'list';
}

const initialState: ContentState = {
  items: [],
  filteredItems: [],
  favorites: [],
  bookmarks: [],
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: false,
  hasMore: true,
  page: 1,
  sortBy: 'latest',
  viewMode: 'grid',
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    addContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = [...state.items, ...action.payload];
      state.filteredItems = [...state.filteredItems, ...action.payload];
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.isFavorite = !item.isFavorite;
        if (item.isFavorite) {
          state.favorites.push(item);
        } else {
          state.favorites = state.favorites.filter((fav) => fav.id !== itemId);
        }
      }
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.isBookmarked = !item.isBookmarked;
        if (item.isBookmarked) {
          state.bookmarks.push(item);
        } else {
          state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== itemId);
        }
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = state.items.filter((item) =>
        item.title.toLowerCase().includes(action.payload.toLowerCase()) ||
        item.description.toLowerCase().includes(action.payload.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(action.payload.toLowerCase()))
      );
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      if (action.payload === 'all') {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter((item) => item.category === action.payload);
      }
    },
    setSortBy: (state, action: PayloadAction<'latest' | 'popular' | 'trending'>) => {
      state.sortBy = action.payload;
      // Sort logic can be implemented here
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    reorderContent: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.filteredItems.splice(fromIndex, 1);
      state.filteredItems.splice(toIndex, 0, movedItem);
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
  },
});

export const {
  setLoading,
  setContent,
  addContent,
  toggleFavorite,
  toggleBookmark,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setViewMode,
  reorderContent,
  incrementPage,
  setHasMore,
} = contentSlice.actions;

export default contentSlice.reducer;