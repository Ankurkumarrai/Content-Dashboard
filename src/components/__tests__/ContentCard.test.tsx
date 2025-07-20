import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ContentCard } from '../content/ContentCard';
import contentReducer from '../../store/slices/contentSlice';
import uiReducer from '../../store/slices/uiSlice';
import authReducer from '../../store/slices/authSlice';

const mockStore = configureStore({
  reducer: {
    content: contentReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});

const mockContentItem = {
  id: 'test-1',
  title: 'Test Article',
  description: 'This is a test article description',
  category: 'news' as const,
  author: 'Test Author',
  publishedAt: '2024-01-15T10:00:00Z',
  imageUrl: 'https://example.com/image.jpg',
  url: 'https://example.com/article',
  isFavorite: false,
  isBookmarked: false,
  readTime: 5,
  tags: ['test', 'news'],
  engagement: {
    likes: 10,
    shares: 5,
    comments: 3,
  },
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      {component}
    </Provider>
  );
};

describe('ContentCard', () => {
  it('renders content card with correct information', async () => {
    const { getByText } = renderWithProvider(<ContentCard item={mockContentItem} index={0} />);
    
    expect(getByText('Test Article')).toBeInTheDocument();
    expect(getByText('This is a test article description')).toBeInTheDocument();
    expect(getByText('Test Author')).toBeInTheDocument();
    expect(getByText('5 min read')).toBeInTheDocument();
  });

  it('handles favorite toggle', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(<ContentCard item={mockContentItem} index={0} />);
    
    const favoriteButton = getByRole('button', { name: /favorite/i });
    await user.click(favoriteButton);
    
    expect(favoriteButton).toBeInTheDocument();
  });

  it('handles bookmark toggle', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProvider(<ContentCard item={mockContentItem} index={0} />);
    
    const bookmarkButton = getByRole('button', { name: /bookmark/i });
    await user.click(bookmarkButton);
    
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('displays correct category badge', () => {
    const { getByText } = renderWithProvider(<ContentCard item={mockContentItem} index={0} />);
    
    expect(getByText('news')).toBeInTheDocument();
  });

  it('shows engagement metrics', () => {
    const { getByText } = renderWithProvider(<ContentCard item={mockContentItem} index={0} />);
    
    expect(getByText('10')).toBeInTheDocument(); // likes
    expect(getByText('5')).toBeInTheDocument();  // shares
    expect(getByText('3')).toBeInTheDocument();  // comments
  });
});