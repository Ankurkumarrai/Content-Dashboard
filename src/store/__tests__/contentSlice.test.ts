import { describe, it, expect } from 'vitest';
import contentReducer, {
  ContentState,
  ContentItem,
  setLoading,
  setContent,
  toggleFavorite,
  toggleBookmark,
  setSearchQuery,
  setSelectedCategory,
} from '../slices/contentSlice';

const mockContentItem: ContentItem = {
  id: '1',
  title: 'Test Article',
  description: 'Test Description',
  category: 'technology',
  author: 'Test Author',
  publishedAt: '2023-01-01',
  imageUrl: 'test.jpg',
  url: 'https://test.com',
  isFavorite: false,
  isBookmarked: false,
  readTime: 5,
  tags: ['test'],
  engagement: {
    likes: 10,
    shares: 5,
    comments: 2,
  },
};

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
    dateRange: 'week' as const,
    sortBy: 'latest' as const,
  },
  items: [],
  filteredItems: [],
  selectedCategory: 'all',
  isLoading: false,
  hasMore: true,
  page: 1,
  sortBy: 'latest' as const,
  viewMode: 'grid' as const,
};

describe('contentSlice', () => {
  it('should return the initial state', () => {
    expect(contentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLoading', () => {
    const actual = contentReducer(initialState, setLoading(true));
    expect(actual.isLoading).toEqual(true);
    expect(actual.loading.feed).toEqual(true);
  });

  it('should handle setContent', () => {
    const mockContent = [mockContentItem];
    const actual = contentReducer(initialState, setContent(mockContent));
    expect(actual.items).toEqual(mockContent);
    expect(actual.filteredItems).toEqual(mockContent);
  });

  it('should handle toggleFavorite', () => {
    const stateWithContent = {
      ...initialState,
      items: [mockContentItem],
      filteredItems: [mockContentItem],
    };
    const actual = contentReducer(stateWithContent, toggleFavorite('1'));
    expect(actual.items[0].isFavorite).toEqual(true);
  });

  it('should handle toggleBookmark', () => {
    const stateWithContent = {
      ...initialState,
      items: [mockContentItem],
      filteredItems: [mockContentItem],
    };
    const actual = contentReducer(stateWithContent, toggleBookmark('1'));
    expect(actual.items[0].isBookmarked).toEqual(true);
  });

  it('should handle setSearchQuery', () => {
    const stateWithContent = {
      ...initialState,
      items: [mockContentItem],
      filteredItems: [mockContentItem],
    };
    const actual = contentReducer(stateWithContent, setSearchQuery('test'));
    expect(actual.searchQuery).toEqual('test');
  });

  it('should handle setSelectedCategory', () => {
    const actual = contentReducer(initialState, setSelectedCategory('technology'));
    expect(actual.selectedCategory).toEqual('technology');
    expect(actual.activeCategory).toEqual('technology');
  });
});