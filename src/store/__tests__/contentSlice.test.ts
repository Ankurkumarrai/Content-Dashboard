import { describe, it, expect } from 'vitest';
import contentReducer, {
  setContent,
  toggleFavorite,
  toggleBookmark,
  setSearchQuery,
  setSelectedCategory,
  ContentItem,
} from '../slices/contentSlice';

const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Test Article 1',
    description: 'Description 1',
    category: 'news',
    author: 'Author 1',
    publishedAt: '2024-01-15T10:00:00Z',
    url: 'https://example.com/1',
    isFavorite: false,
    isBookmarked: false,
    readTime: 5,
    tags: ['test', 'news'],
    engagement: { likes: 10, shares: 5, comments: 3 },
  },
  {
    id: '2',
    title: 'Test Article 2',
    description: 'Description 2',
    category: 'technology',
    author: 'Author 2',
    publishedAt: '2024-01-15T11:00:00Z',
    url: 'https://example.com/2',
    isFavorite: false,
    isBookmarked: false,
    readTime: 8,
    tags: ['test', 'tech'],
    engagement: { likes: 15, shares: 8, comments: 5 },
  },
];

describe('contentSlice', () => {
  const initialState = {
    items: [],
    filteredItems: [],
    favorites: [],
    bookmarks: [],
    searchQuery: '',
    selectedCategory: 'all',
    isLoading: false,
    hasMore: true,
    page: 1,
    sortBy: 'latest' as const,
    viewMode: 'grid' as const,
  };

  it('should handle setContent', () => {
    const action = setContent(mockContentItems);
    const state = contentReducer(initialState, action);

    expect(state.items).toEqual(mockContentItems);
    expect(state.filteredItems).toEqual(mockContentItems);
  });

  it('should handle toggleFavorite', () => {
    const stateWithContent = {
      ...initialState,
      items: mockContentItems,
      filteredItems: mockContentItems,
    };

    const action = toggleFavorite('1');
    const state = contentReducer(stateWithContent, action);

    expect(state.items[0].isFavorite).toBe(true);
    expect(state.favorites).toHaveLength(1);
    expect(state.favorites[0].id).toBe('1');
  });

  it('should handle toggleBookmark', () => {
    const stateWithContent = {
      ...initialState,
      items: mockContentItems,
      filteredItems: mockContentItems,
    };

    const action = toggleBookmark('2');
    const state = contentReducer(stateWithContent, action);

    expect(state.items[1].isBookmarked).toBe(true);
    expect(state.bookmarks).toHaveLength(1);
    expect(state.bookmarks[0].id).toBe('2');
  });

  it('should handle setSearchQuery', () => {
    const stateWithContent = {
      ...initialState,
      items: mockContentItems,
      filteredItems: mockContentItems,
    };

    const action = setSearchQuery('Article 1');
    const state = contentReducer(stateWithContent, action);

    expect(state.searchQuery).toBe('Article 1');
    expect(state.filteredItems).toHaveLength(1);
    expect(state.filteredItems[0].title).toBe('Test Article 1');
  });

  it('should handle setSelectedCategory', () => {
    const stateWithContent = {
      ...initialState,
      items: mockContentItems,
      filteredItems: mockContentItems,
    };

    const action = setSelectedCategory('technology');
    const state = contentReducer(stateWithContent, action);

    expect(state.selectedCategory).toBe('technology');
    expect(state.filteredItems).toHaveLength(1);
    expect(state.filteredItems[0].category).toBe('technology');
  });

  it('should filter by "all" category', () => {
    const stateWithContent = {
      ...initialState,
      items: mockContentItems,
      filteredItems: [mockContentItems[0]], // Initially filtered
      selectedCategory: 'news',
    };

    const action = setSelectedCategory('all');
    const state = contentReducer(stateWithContent, action);

    expect(state.selectedCategory).toBe('all');
    expect(state.filteredItems).toEqual(mockContentItems);
  });
});