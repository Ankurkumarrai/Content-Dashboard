import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '@/lib/supabase';
import { UnifiedContent, contentService, newsService, movieService, socialService } from '@/services/apiService';

// Legacy ContentItem interface for backward compatibility
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

export interface ContentState {
  // Unified feed
  unifiedFeed: UnifiedContent[];
  
  // Separate content types
  articles: Article[];
  movies: any[];
  socialPosts: any[];
  
  // Feed management
  currentPage: number;
  hasMoreContent: boolean;
  
  // Trending content
  trendingContent: UnifiedContent[];
  
  // Favorites and bookmarks
  favorites: UnifiedContent[];
  bookmarks: UnifiedContent[];
  
  // Search
  searchResults: UnifiedContent[];
  searchQuery: string;
  
  // Content order (for drag and drop)
  contentOrder: string[];
  
  // Loading states
  loading: {
    feed: boolean;
    trending: boolean;
    search: boolean;
    infinite: boolean;
  };
  
  // Error states
  error: {
    feed: string | null;
    trending: string | null;
    search: string | null;
  };
  
  // Filters
  activeCategory: string;
  contentFilters: {
    categories: string[];
    dateRange: 'today' | 'week' | 'month' | 'all';
    sortBy: 'latest' | 'popular' | 'trending';
  };
  
  // Legacy support
  items: any[];
  filteredItems: any[];
  selectedCategory: string;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  sortBy: 'latest' | 'popular' | 'trending';
  viewMode: 'grid' | 'list';
}

const initialState: ContentState = {
  unifiedFeed: [],
  articles: [],
  movies: [],
  socialPosts: [],
  currentPage: 1,
  hasMoreContent: true,
  trendingContent: [],
  favorites: [],
  bookmarks: [],
  searchResults: [],
  searchQuery: '',
  contentOrder: [],
  loading: {
    feed: false,
    trending: false,
    search: false,
    infinite: false,
  },
  error: {
    feed: null,
    trending: null,
    search: null,
  },
  activeCategory: 'all',
  contentFilters: {
    categories: ['technology', 'entertainment', 'sports'],
    dateRange: 'week',
    sortBy: 'latest',
  },
  // Legacy support
  items: [],
  filteredItems: [],
  selectedCategory: 'all',
  isLoading: false,
  hasMore: true,
  page: 1,
  sortBy: 'latest',
  viewMode: 'grid',
};

// Async thunks
export const fetchUnifiedFeed = createAsyncThunk(
  'content/fetchUnifiedFeed',
  async ({ preferences, page = 1 }: { preferences: string[]; page?: number }) => {
    const content = await contentService.getUnifiedFeed(preferences, page);
    return { content, page };
  }
);

export const fetchTrendingContent = createAsyncThunk(
  'content/fetchTrendingContent',
  async (preferences: string[]) => {
    // Fetch trending from each service
    const [news, movies, social] = await Promise.all([
      newsService.getNews('technology', 1),
      movieService.getRecommendations(1),
      socialService.getPosts('trending', 10)
    ]);

    const trending: UnifiedContent[] = [];

    // Add trending news
    news.articles.filter(a => a.trending).slice(0, 3).forEach(article => {
      trending.push({
        id: article.id,
        type: 'news',
        title: article.title,
        description: article.description,
        image_url: article.image_url,
        author: article.author,
        timestamp: article.published_at,
        engagement: {
          likes: article.likes,
          shares: article.shares,
          comments: article.comments,
        },
        metadata: article,
      });
    });

    // Add trending movies (top rated)
    movies.results.sort((a, b) => b.vote_average - a.vote_average).slice(0, 3).forEach(movie => {
      trending.push({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        description: movie.description,
        image_url: movie.poster_path,
        timestamp: movie.release_date,
        engagement: {
          likes: Math.floor(movie.vote_average * 100),
          shares: Math.floor(movie.vote_average * 50),
        },
        metadata: movie,
      });
    });

    // Add trending social posts
    social.posts.sort((a, b) => b.likes - a.likes).slice(0, 4).forEach(post => {
      trending.push({
        id: post.id,
        type: 'social',
        title: `@${post.author}`,
        description: post.content,
        image_url: post.media_url,
        author: post.author,
        timestamp: post.timestamp,
        engagement: {
          likes: post.likes,
          shares: post.shares,
        },
        metadata: post,
      });
    });

    return trending;
  }
);

export const searchContent = createAsyncThunk(
  'content/searchContent',
  async (query: string) => {
    if (!query.trim()) return [];
    return await contentService.searchUnifiedContent(query);
  }
);

export const loadMoreContent = createAsyncThunk(
  'content/loadMoreContent',
  async ({ preferences, page }: { preferences: string[]; page: number }) => {
    const content = await contentService.getUnifiedFeed(preferences, page);
    return { content, page };
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
      state.selectedCategory = action.payload; // Legacy support
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    addToFavorites: (state, action: PayloadAction<UnifiedContent>) => {
      const exists = state.favorites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    
    addToBookmarks: (state, action: PayloadAction<UnifiedContent>) => {
      const exists = state.bookmarks.find(item => item.id === action.payload.id);
      if (!exists) {
        state.bookmarks.push(action.payload);
      }
    },
    
    removeFromBookmarks: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(item => item.id !== action.payload);
    },
    
    reorderContent: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.unifiedFeed);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.unifiedFeed = result;
      
      // Update content order for persistence
      state.contentOrder = result.map(item => item.id);
    },
    
    updateContentFilters: (state, action: PayloadAction<Partial<typeof initialState.contentFilters>>) => {
      state.contentFilters = { ...state.contentFilters, ...action.payload };
    },
    
    clearErrors: (state) => {
      state.error = {
        feed: null,
        trending: null,
        search: null,
      };
    },
    
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMoreContent = true;
    },
    
    // Legacy support actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.loading.feed = action.payload;
    },
    
    setContent: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
    },
    
    addContent: (state, action: PayloadAction<any[]>) => {
      state.items = [...state.items, ...action.payload];
      state.filteredItems = [...state.filteredItems, ...action.payload];
    },
    
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.isFavorite = !item.isFavorite;
      }
    },
    
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.isBookmarked = !item.isBookmarked;
      }
    },
    
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.activeCategory = action.payload;
    },
    
    setSortBy: (state, action: PayloadAction<'latest' | 'popular' | 'trending'>) => {
      state.sortBy = action.payload;
      state.contentFilters.sortBy = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    
    incrementPage: (state) => {
      state.page += 1;
      state.currentPage += 1;
    },
    
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
      state.hasMoreContent = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch unified feed
    builder
      .addCase(fetchUnifiedFeed.pending, (state) => {
        state.loading.feed = true;
        state.isLoading = true;
        state.error.feed = null;
      })
      .addCase(fetchUnifiedFeed.fulfilled, (state, action) => {
        state.loading.feed = false;
        state.isLoading = false;
        state.unifiedFeed = action.payload.content;
        state.currentPage = action.payload.page;
        state.contentOrder = action.payload.content.map(item => item.id);
      })
      .addCase(fetchUnifiedFeed.rejected, (state, action) => {
        state.loading.feed = false;
        state.isLoading = false;
        state.error.feed = action.error.message || 'Failed to fetch content';
      });

    // Fetch trending content
    builder
      .addCase(fetchTrendingContent.pending, (state) => {
        state.loading.trending = true;
        state.error.trending = null;
      })
      .addCase(fetchTrendingContent.fulfilled, (state, action) => {
        state.loading.trending = false;
        state.trendingContent = action.payload;
      })
      .addCase(fetchTrendingContent.rejected, (state, action) => {
        state.loading.trending = false;
        state.error.trending = action.error.message || 'Failed to fetch trending content';
      });

    // Search content
    builder
      .addCase(searchContent.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.error.message || 'Search failed';
      });

    // Load more content (infinite scroll)
    builder
      .addCase(loadMoreContent.pending, (state) => {
        state.loading.infinite = true;
      })
      .addCase(loadMoreContent.fulfilled, (state, action) => {
        state.loading.infinite = false;
        if (action.payload.content.length === 0) {
          state.hasMoreContent = false;
          state.hasMore = false;
        } else {
          state.unifiedFeed.push(...action.payload.content);
          state.currentPage = action.payload.page;
        }
      })
      .addCase(loadMoreContent.rejected, (state) => {
        state.loading.infinite = false;
      });
  },
});

export const {
  setActiveCategory,
  setSearchQuery,
  clearSearchResults,
  addToFavorites,
  removeFromFavorites,
  addToBookmarks,
  removeFromBookmarks,
  reorderContent,
  updateContentFilters,
  clearErrors,
  resetPagination,
  // Legacy actions
  setLoading,
  setContent,
  addContent,
  toggleFavorite,
  toggleBookmark,
  setSelectedCategory,
  setSortBy,
  setViewMode,
  incrementPage,
  setHasMore,
} = contentSlice.actions;

export default contentSlice.reducer;